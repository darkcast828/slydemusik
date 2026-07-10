import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth";
import musicRoutes from "./routes/music";
import royaltiesRoutes from "./routes/royalties";
import adminRoutes from "./routes/admin";
import distributionRoutes from "./routes/distribution";
import mpesaRoutes from "./routes/mpesa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/royalties", royaltiesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/distribution", distributionRoutes);

app.use("/api/mpesa", mpesaRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SLYDE MUSIK rodando 🚀 na porta ${PORT}`);
  });
}

startServer();
