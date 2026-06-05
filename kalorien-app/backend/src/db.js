import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(__dirname, '..', 'kalorien.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Schema -----------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS foods (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    -- all macro values are per 100 g
    calories  REAL    NOT NULL,
    protein   REAL    NOT NULL DEFAULT 0,
    carbs     REAL    NOT NULL DEFAULT 0,
    fat       REAL    NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS entries (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id   INTEGER NOT NULL,
    -- log date in YYYY-MM-DD format
    date      TEXT    NOT NULL,
    -- amount eaten, in grams
    grams     REAL    NOT NULL,
    created_at TEXT   NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
`);

// --- Seed data (only on a fresh database) -----------------------------------

const foodCount = db.prepare('SELECT COUNT(*) AS n FROM foods').get().n;
if (foodCount === 0) {
  const insert = db.prepare(
    'INSERT INTO foods (name, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?)'
  );
  const seed = db.transaction((foods) => {
    for (const f of foods) insert.run(f.name, f.calories, f.protein, f.carbs, f.fat);
  });
  seed([
    { name: 'Apfel', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    { name: 'Banane', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { name: 'Hähnchenbrust (gekocht)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Reis (gekocht)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    { name: 'Vollkornbrot', calories: 247, protein: 13, carbs: 41, fat: 4.2 },
    { name: 'Magerquark', calories: 67, protein: 12, carbs: 4, fat: 0.3 },
    { name: 'Haferflocken', calories: 372, protein: 13, carbs: 59, fat: 7 },
    { name: 'Olivenöl', calories: 884, protein: 0, carbs: 0, fat: 100 }
  ]);
}

export default db;
