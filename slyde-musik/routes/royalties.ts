import express from "express";
import db from "../database.ts";

const router = express.Router();

router.get("/:artist_id?", (req, res) => {
  try {
    const artistId = req.params.artist_id || "unknown_user";
    
    const stmt = db.prepare(`
      SELECT songs.id, songs.title, songs.genre, songs.release_date, royalties.streams, royalties.revenue, songs.cover
      FROM royalties
      JOIN songs ON songs.id = royalties.song_id
      WHERE songs.artist_id = ? OR ? = 'all'
      ORDER BY royalties.revenue DESC
    `);
    
    const rows = stmt.all(artistId, artistId).map(row => ({
      ...row,
      revenue: Number((row.revenue * 0.9).toFixed(2))
    }));
    
    // If no data, return some mock data for demonstration purposes
    if (rows.length === 0) {
      return res.json([
        { id: 1, title: "Hit Africano 1", genre: "Afrobeats", release_date: "2023-05-10", streams: 125000, revenue: 405.18, cover: null },
        { id: 2, title: "Vibe de Verão", genre: "Pop", release_date: "2023-08-15", streams: 85000, revenue: 279.45, cover: null },
        { id: 3, title: "Noites em Maputo", genre: "R&B / Soul", release_date: "2023-11-20", streams: 45000, revenue: 149.22, cover: null },
        { id: 4, title: "Ritmo Quente", genre: "Reggaeton", release_date: "2024-01-05", streams: 22000, revenue: 76.86, cover: null },
      ]);
    }
    
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar royalties" });
  }
});

export default router;
