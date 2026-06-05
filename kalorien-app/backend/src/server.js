import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Helpers ----------------------------------------------------------------

const today = () => new Date().toISOString().slice(0, 10);

function isValidDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function asyncRoute(handler) {
  return (req, res) => {
    try {
      handler(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// --- Foods ------------------------------------------------------------------

app.get('/api/foods', asyncRoute((req, res) => {
  const foods = db.prepare('SELECT * FROM foods ORDER BY name COLLATE NOCASE').all();
  res.json(foods);
}));

app.post('/api/foods', asyncRoute((req, res) => {
  const { name, calories, protein = 0, carbs = 0, fat = 0 } = req.body ?? {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  if (calories == null || Number.isNaN(Number(calories)) || Number(calories) < 0) {
    return res.status(400).json({ error: 'calories must be a non-negative number' });
  }

  const info = db
    .prepare('INSERT INTO foods (name, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?)')
    .run(name.trim(), Number(calories), Number(protein), Number(carbs), Number(fat));

  const food = db.prepare('SELECT * FROM foods WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(food);
}));

app.delete('/api/foods/:id', asyncRoute((req, res) => {
  const info = db.prepare('DELETE FROM foods WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Food not found' });
  res.status(204).end();
}));

// --- Entries (daily log) ----------------------------------------------------

app.get('/api/entries', asyncRoute((req, res) => {
  const date = req.query.date || today();
  if (!isValidDate(date)) return res.status(400).json({ error: 'invalid date' });

  const entries = db
    .prepare(
      `SELECT e.id, e.date, e.grams, e.food_id,
              f.name, f.calories, f.protein, f.carbs, f.fat
         FROM entries e
         JOIN foods f ON f.id = e.food_id
        WHERE e.date = ?
        ORDER BY e.created_at`
    )
    .all(date)
    .map((row) => ({
      id: row.id,
      date: row.date,
      grams: row.grams,
      food: { id: row.food_id, name: row.name },
      // computed values for the eaten amount
      calories: round(row.calories * row.grams / 100),
      protein: round(row.protein * row.grams / 100),
      carbs: round(row.carbs * row.grams / 100),
      fat: round(row.fat * row.grams / 100)
    }));

  res.json(entries);
}));

app.post('/api/entries', asyncRoute((req, res) => {
  const { food_id, grams, date = today() } = req.body ?? {};

  if (!isValidDate(date)) return res.status(400).json({ error: 'invalid date' });
  if (!grams || Number.isNaN(Number(grams)) || Number(grams) <= 0) {
    return res.status(400).json({ error: 'grams must be a positive number' });
  }

  const food = db.prepare('SELECT id FROM foods WHERE id = ?').get(food_id);
  if (!food) return res.status(400).json({ error: 'unknown food_id' });

  const info = db
    .prepare('INSERT INTO entries (food_id, date, grams) VALUES (?, ?, ?)')
    .run(food_id, date, Number(grams));

  res.status(201).json({ id: info.lastInsertRowid });
}));

app.delete('/api/entries/:id', asyncRoute((req, res) => {
  const info = db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Entry not found' });
  res.status(204).end();
}));

// --- Summary ----------------------------------------------------------------

app.get('/api/summary', asyncRoute((req, res) => {
  const date = req.query.date || today();
  if (!isValidDate(date)) return res.status(400).json({ error: 'invalid date' });

  const row = db
    .prepare(
      `SELECT
         COALESCE(SUM(f.calories * e.grams / 100), 0) AS calories,
         COALESCE(SUM(f.protein  * e.grams / 100), 0) AS protein,
         COALESCE(SUM(f.carbs    * e.grams / 100), 0) AS carbs,
         COALESCE(SUM(f.fat      * e.grams / 100), 0) AS fat,
         COUNT(*) AS entries
       FROM entries e
       JOIN foods f ON f.id = e.food_id
      WHERE e.date = ?`
    )
    .get(date);

  res.json({
    date,
    calories: round(row.calories),
    protein: round(row.protein),
    carbs: round(row.carbs),
    fat: round(row.fat),
    entries: row.entries
  });
}));

// --- Misc -------------------------------------------------------------------

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

function round(n) {
  return Math.round(n * 10) / 10;
}

app.listen(PORT, () => {
  console.log(`Kalorien API listening on http://localhost:${PORT}`);
});
