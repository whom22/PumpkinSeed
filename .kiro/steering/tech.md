---
inclusion: always
---

# Technology Stack

## Runtime

- **TypeScript** everywhere, strict mode (`tsconfig.base.json` is the source of truth).
- **React 19** (function components + hooks only; no class components, no external state library).
- **Vite 7** for both apps; the template package ships TS source (`src/index.ts`) and is consumed
  directly through the workspace �� no build step for `@pumpkin-seed/core`.

## Workspaces

- **pnpm workspaces**: `template/`, `apps/*`. App��template dependency is `workspace:*`.
- Never add a bundler or build script to `template/`; Vite compiles it via the app.

## Data layer

- **Supabase JS v2** is the only backend dependency. The template wraps it behind the `DataLayer`
  interface (`src/data/types.ts`) with two adapters:
  - `LocalAdapter` �� `localStorage` + `BroadcastChannel`, zero setup, cross-tab realtime.
  - `SupabaseAdapter` �� hosted Postgres + realtime postgres_changes.
- Apps must never import Supabase directly; they go through `createDataLayer({...import.meta.env})`.
- Tables are flat (no auth): `candy_stops`, `story_lines`. Anon key + open RLS is an accepted trade-off
  because every app is a throwaway community tool.

## Map (Trick-or-Treat Map only)

- **Leaflet 1.9** + OpenStreetMap raster tiles, night-mode via CSS filter on `.leaflet-tile-pane`.
- No geocoding API, no tile API key. `L.divIcon` markers styled with festival CSS variables.

## Styling

- Hand-rolled design system in `template/src/styles/base.css` driven by CSS custom properties.
- **No Tailwind, no CSS-in-JS.** Festival skins are plain `Record<string,string>` var maps
  applied on `:root` by `FestivalProvider`.
- Fonts: Google Fonts (`Creepster` display / `Lilita One` fallback / `Inter` body), loaded per-app.

## PWA

- `vite-plugin-pwa`, `generateSW` mode, manifest per app, SVG icons.

## Constraints

- Prefer zero new runtime dependencies. Anything �� 100 kB minified needs a spec-level justification.
- Keep every file readable top-to-bottom; if a component file exceeds ~200 lines, split it.
- Windows dev machines are first-class: scripts must work in Git Bash and PowerShell.

