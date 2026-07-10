import express from "express";
import db from "../database.ts";

const router = express.Router();

// Get distribution status for an artist's songs
router.get("/:artist_id", (req, res) => {
  try {
    const artistId = req.params.artist_id;
    
    // Auto-confirm distributions that have passed their scheduled time
    db.exec(`
      UPDATE distributions 
      SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP 
      WHERE status = 'pending' AND scheduled_for <= CURRENT_TIMESTAMP
    `);
    
    // Get all songs for the artist
    const songsStmt = db.prepare(`
      SELECT id, title, artist_name, cover, release_date, created_at 
      FROM songs 
      WHERE artist_id = ? 
      ORDER BY created_at DESC
    `);
    const songs = songsStmt.all(artistId) as any[];

    // For each song, get its distribution status
    const distStmt = db.prepare(`
      SELECT d.status, d.confirmed_at, p.name as platform_name
      FROM distributions d
      JOIN platforms p ON d.platform_id = p.id
      WHERE d.song_id = ?
    `);

    const result = songs.map(song => {
      const distributions = distStmt.all(song.id) as any[];
      const confirmed = distributions.filter(d => d.status === 'confirmed').length;
      const pending = distributions.filter(d => d.status === 'pending').length;
      const rejected = distributions.filter(d => d.status === 'rejected').length;
      
      return {
        ...song,
        stats: {
          total: distributions.length,
          confirmed,
          pending,
          rejected
        },
        platforms: distributions
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados de distribuição" });
  }
});

// Get recent notifications (recently confirmed platforms)
router.get("/notifications/:artist_id", (req, res) => {
  try {
    const artistId = req.params.artist_id;
    
    const stmt = db.prepare(`
      SELECT s.title, p.name as platform_name, d.confirmed_at
      FROM distributions d
      JOIN songs s ON d.song_id = s.id
      JOIN platforms p ON d.platform_id = p.id
      WHERE s.artist_id = ? AND d.status = 'confirmed'
      ORDER BY d.confirmed_at DESC
      LIMIT 10
    `);
    
    const notifications = stmt.all(artistId);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar notificações" });
  }
});

// Force sync a song to all platforms (Simulated API push)
router.post("/sync/:song_id", (req, res) => {
  try {
    const songId = req.params.song_id;
    
    // Update all pending distributions to confirmed
    db.exec(`
      UPDATE distributions 
      SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP 
      WHERE song_id = ${songId} AND status = 'pending'
    `);
    
    res.json({ message: "Sincronização com APIs concluída com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao sincronizar com as plataformas" });
  }
});

export default router;
