import express from "express";
import multer from "multer";
import db from "../database.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure directories exist
const musicDir = path.join(__dirname, "../uploads/music");
const coversDir = path.join(__dirname, "../uploads/covers");
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });
if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "music") {
      cb(null, musicDir);
    } else {
      cb(null, coversDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  (req, res) => {
    const { title, artist, album, genre, release_date, artist_id } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const music = files["music"]?.[0]?.filename;
    const cover = files["cover"]?.[0]?.filename;

    if (!music || !cover || !title || !artist || !genre || !release_date) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios e envie os arquivos." });
    }

    try {
      const insertSong = db.prepare(`
        INSERT INTO songs (artist_id, artist_name, title, album, genre, cover, file, release_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = insertSong.run(artist_id || "unknown_user", artist, title, album || null, genre, cover, music, release_date);
      const songId = result.lastInsertRowid;

      // Create distribution records for all platforms
      const platforms = db.prepare(`SELECT id FROM platforms`).all() as { id: number }[];
      const insertDist = db.prepare(`
        INSERT INTO distributions (song_id, platform_id, status, scheduled_for)
        VALUES (?, ?, 'pending', datetime('now', ?))
      `);
      
      const insertManyDist = db.transaction((plats: { id: number }[]) => {
        for (const p of plats) {
          // Random delay between 12 hours and 72 hours (3 dias)
          const hoursDelay = Math.floor(Math.random() * (72 - 12 + 1) + 12);
          insertDist.run(songId, p.id, `+${hoursDelay} hours`);
        }
      });
      insertManyDist(platforms);

      res.json({ message: "Música enviada para SLYDE MUSIK e em processo de distribuição 🎧", songId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao salvar no banco de dados" });
    }
  }
);

export default router;
