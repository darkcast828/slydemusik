import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "slyde.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_id TEXT,
    artist_name TEXT,
    title TEXT,
    album TEXT,
    genre TEXT,
    cover TEXT,
    file TEXT,
    release_date TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS royalties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    streams INTEGER,
    revenue REAL
  );

  CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    platform_id INTEGER,
    status TEXT DEFAULT 'pending',
    scheduled_for DATETIME,
    confirmed_at DATETIME,
    FOREIGN KEY(song_id) REFERENCES songs(id),
    FOREIGN KEY(platform_id) REFERENCES platforms(id)
  );
`);

// Add columns if they don't exist (for existing databases)
try { db.exec(`ALTER TABLE songs ADD COLUMN artist_name TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE songs ADD COLUMN album TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE songs ADD COLUMN status TEXT DEFAULT 'pending';`); } catch (e) {}
try { db.exec(`ALTER TABLE songs ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;`); } catch (e) {}
try { db.exec(`ALTER TABLE distributions ADD COLUMN scheduled_for DATETIME;`); } catch (e) {}

// Seed platforms
const platforms = [
  "Spotify", "Apple Music", "Deezer", "YouTube Music", "TikTok", "Amazon Music", "Tidal", 
  "Boomplay", "Audiomack", "Pandora", "SoundCloud", "Napster", "Claro Música", "Anghami", 
  "iHeartRadio", "Tencent", "NetEase", "Joox", "Qobuz", "KKBOX", "Line Music", "Yandex Music", 
  "VK Music", "JioSaavn", "Gaana", "Wynk", "Hungama", "Resso", "Triller", "Snapchat", 
  "Facebook", "Instagram", "Twitch", "Peloton", "Soundtrack Your Brand", "TouchTunes", 
  "PlayNetwork", "MediaNet", "7digital", "Slacker", "AWA", "Bugs!", "Melon", "Vibe", "Flo"
];

const insertPlatform = db.prepare(`INSERT OR IGNORE INTO platforms (name) VALUES (?)`);
const insertMany = db.transaction((plats: string[]) => {
  for (const p of plats) insertPlatform.run(p);
});
insertMany(platforms);

export default db;
