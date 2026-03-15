import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  try {
    const stmt = db.prepare("INSERT INTO artists (name, email, password) VALUES (?, ?, ?)");
    stmt.run(name, email, password);
    res.send("Artista registrado no SLYDE MUSIK 🎵");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao registrar");
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare("SELECT * FROM artists WHERE email=? AND password=?");
    const row = stmt.get(email, password);
    
    if (!row) return res.status(401).send("Login inválido");
    res.send("Login realizado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

export default router;
