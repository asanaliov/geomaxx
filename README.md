# 🌍 GeoMaxx

A daily satellite-image guessing game. Each day, identify one landmark from an
aerial view in **6 guesses or fewer**. The catch: you start zoomed all the way
out, and the map only zooms *in* toward the landmark when you guess wrong — so
the clearest view is the one you see last.

One puzzle per day, the same for everyone, rolled at midnight UTC.

## How to play

1. The map opens on a wide, country-level satellite view — somewhere on Earth.
2. Type a landmark name; autocomplete suggests matches from the built-in list.
3. **Wrong guess?** The map zooms in one step (`COUNTRY → REGION → CITY →
   DISTRICT → BLOCK → STREET`) and tells you how far off you were.
4. Distance feedback is colour-coded: 🟩 within 500 km · 🟨 within 1,500 km ·
   🟧 within 3,000 km · 🟥 farther.
5. Guess it within 6 tries to win, then share your result grid.

The map controls are intentionally locked — you only ever see what the game
reveals.

## Tech stack

- **React 19 + TypeScript** with **Vite**
- **Tailwind CSS** (dark theme only)
- **Leaflet** + **react-leaflet** with **Esri World Imagery** satellite tiles
  (no API key required)
- **localStorage** for game state and stats — no backend

Everything runs client-side: the daily puzzle is derived from the UTC date via a
seeded PRNG, so every player gets the same landmark without a server.

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run lint       # eslint
```

## Project structure

```
src/
  components/   UI: GameMap, GuessInput, HUD, Header, modals
  hooks/        Game state & stats (useGame, useStats, useMidnightReload)
  lib/          Pure logic: daily puzzle, haversine distance, scoring, storage
  lib/locations.ts   The landmark list (name, coords, country, difficulty)
  types/        Shared TypeScript interfaces
```

### Adding a landmark

Append an entry to `src/lib/locations.ts`. Coordinates must be accurate — any
location can be both the daily answer (the map centres on it) and a guess (used
for distance). For spots that are a tiny speck at the default wide start (e.g.
small ocean-bound islands), set an optional `zoomLevels: [...]` (6 levels) to
start the puzzle zoomed in enough to be recognizable.

## Deployment

The app is a static Vite build (`dist/`) and deploys to any static host. On
Vercel it auto-detects the Vite preset — no configuration needed.
