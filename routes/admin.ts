import express from "express";
import db from "../database.js";

const router = express.Router();

// Middleware para verificar email e senha do painel
const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const email = req.headers["x-admin-email"];
  const password = req.headers["x-admin-password"];
  
  // Credenciais hardcoded para o painel de administração
  if (email !== "admin@slydemusik.com" || password !== "slyde-admin-2026") {
    return res.status(403).json({ error: "Acesso negado. Credenciais incorretas." });
  }
  next();
};

router.use(checkAdminAuth);

router.get("/stats", (req, res) => {
  try {
    const artistsCount = db.prepare("SELECT COUNT(*) as count FROM artists").get() as { count: number };
    const songsCount = db.prepare("SELECT COUNT(*) as count FROM songs").get() as { count: number };
    const totalRevenue = db.prepare("SELECT SUM(revenue) as total FROM royalties").get() as { total: number };
    
    res.json({
      artists: artistsCount.count,
      songs: songsCount.count,
      revenue: totalRevenue.total || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

router.get("/artists", (req, res) => {
  try {
    const artists = db.prepare("SELECT id, name, email FROM artists ORDER BY id DESC").all();
    res.json(artists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar artistas" });
  }
});

router.get("/songs", (req, res) => {
  try {
    const songs = db.prepare(`
      SELECT songs.id, songs.title, songs.genre, songs.release_date, songs.status, songs.cover, COALESCE(songs.artist_name, artists.name) as artist_name, songs.artist_id
      FROM songs 
      LEFT JOIN artists ON songs.artist_id = artists.id
      ORDER BY songs.id DESC
    `).all();
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar músicas" });
  }
});

router.post("/songs/:id/distribute", (req, res) => {
  try {
    const songId = req.params.id;
    
    // Inicia uma transação para atualizar a música e suas distribuições
    const distributeTransaction = db.transaction((id) => {
      const stmtSong = db.prepare("UPDATE songs SET status = 'distributed' WHERE id = ?");
      const info = stmtSong.run(id);
      
      if (info.changes > 0) {
        // Atualiza todas as distribuições pendentes para confirmadas
        const stmtDist = db.prepare("UPDATE distributions SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP WHERE song_id = ? AND status = 'pending'");
        stmtDist.run(id);
        return true;
      }
      return false;
    });

    const success = distributeTransaction(songId);
    
    if (success) {
      res.json({ success: true, message: "Música distribuída com sucesso!" });
    } else {
      res.status(404).json({ error: "Música não encontrada." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao distribuir música." });
  }
});

export default router;
