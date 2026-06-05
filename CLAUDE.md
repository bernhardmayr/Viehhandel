# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Viehhandel is a prototype web platform for trading cattle and calves (Kühe und Kälber). It is a **minimal demonstration** of a React + Express architecture and intentionally implements only a small slice of the full product. The intended product scope (auctions, direct purchase, brokering, marketplace, messaging, payments via Stripe, GDPR/PSD2 compliance, etc.) is described in `SPECIFICATION.md`; the actual code implements only basic in-memory animal management. Project docs and UI text are in German.

## Commands

All commands run from the `backend/` directory — the backend serves both the API and the static frontend.

```
cd backend
npm install      # install express + cors
npm start        # node server.js — serves on http://localhost:3000
```

- `npm test` is a placeholder (`echo "No tests specified" && exit 0`); there is no test framework wired up.
- Override the port with the `PORT` environment variable (defaults to `3000`).

## Architecture

Two layers, served from a single Express process:

- **Backend** (`backend/server.js`): An Express app that (1) exposes a JSON API under `/api`, and (2) serves the `frontend/` directory as static files via `express.static`. State is an **in-memory `animals` array** — there is no database, so all data resets on restart. Seed data (Berta, Max) is defined inline.
  - `GET /api/animals` — list all animals
  - `POST /api/animals` — create an animal; requires `type`, `name`, `price` (400 otherwise)
  - `POST /api/animals/:id/buy` — "buy" an animal by removing it from the array (404 if not found)
- **Frontend** (`frontend/`): A **build-less React 18 app**. `index.html` loads React, ReactDOM, and Babel-standalone from CDNs, then loads `app.js` as `type="text/babel"` so JSX is transpiled in the browser. There is no bundler, no `package.json`, and no node_modules for the frontend. `app.js` fetches from the same-origin `/api/*` endpoints (works because Express serves the frontend).

Because there is no build step, editing `frontend/app.js` and reloading the browser is the full frontend dev loop. Editing `backend/server.js` requires restarting `npm start`.

## Repository quirks (verify before relying on the app)

This repo was assembled through a series of automated merges, which left a few artifacts a future instance should be aware of and likely fix before the app runs:

- **`backend/server.js`** — the `/api/animals/:id/buy` handler is not closed; the `/` health-check route and the rest of the file are nested inside its callback, leaving the file with unbalanced braces. The server will not start as-is.
- **`frontend/app.js`** — contains two conflicting `AnimalList` definitions merged together (one with a `Kaufen`/buy button, one without), and the first block is syntactically incomplete. Only one coherent `AnimalList` should remain (the buy-button version matches how `App` calls it: `<AnimalList animals={animals} onBuy={buyAnimal} />`).
- **`backend/backend/`** — a stray nested directory containing only an empty `package-lock.json` (name `"backend"`). It is not used by anything; the real backend is `backend/`.

When fixing these, prefer the variant consistent with the rest of the code (e.g. the direct-purchase flow that `README.md` and the buy endpoint describe) rather than deleting functionality.

## Conventions

- `node_modules/` is the only gitignored path.
- Documentation, commit context, and UI strings are German; keep new user-facing text and docs in German to match.
- Keep the architecture build-less unless explicitly asked to introduce a bundler/framework — the frontend deliberately relies on CDN React + in-browser Babel.
