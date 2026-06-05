# Kalorien App 🥗

A simple full-stack **calorie tracking** application.

Track the food you eat each day, see how your calories and macros (protein,
carbs, fat) add up, and compare them against a daily goal.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`)

## Project Structure

```
kalorien-app/
├── backend/          # Express API + SQLite database
│   └── src/
│       ├── db.js     # Database connection, schema & seed data
│       └── server.js # REST API
└── frontend/         # React (Vite) single-page app
    └── src/
        ├── api.js
        ├── App.jsx
        └── components/
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run dev        # starts the API on http://localhost:4000
```

The SQLite database file (`kalorien.db`) is created automatically on first run
and seeded with a few common foods.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev        # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend, so just open
http://localhost:5173 in your browser.

## Features

- 📋 **Food library** – maintain a list of foods with calories and macros per 100 g.
- ➕ **Daily log** – add foods you ate (with amount in grams) to any date.
- 📊 **Daily summary** – totals for calories, protein, carbs and fat, with a
  progress bar against your daily calorie goal.
- 🗑️ Remove log entries and foods.

## API Overview

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/foods`          | List all foods                       |
| POST   | `/api/foods`          | Create a food                        |
| DELETE | `/api/foods/:id`      | Delete a food                        |
| GET    | `/api/entries?date=`  | List log entries for a date          |
| POST   | `/api/entries`        | Add a log entry                      |
| DELETE | `/api/entries/:id`    | Delete a log entry                   |
| GET    | `/api/summary?date=`  | Daily totals for a date              |

## License

MIT
