# Festival Kit Template — Design

## Architecture

```
┌────────────── apps (trick-or-treat-map / ghost-story-relay) ──────────────┐
│  App.tsx: createDataLayer({...import.meta.env}) → single DataLayer        │
│  <I18nProvider><FestivalProvider><ToastProvider><AppChrome>…              │
│  feature components use useTable(data, table) for live rows               │
└───────────────┬───────────────────────────────────────────────────────────┘
                │ imports (workspace:*, TS source)
┌───────────────▼────────── @pumpkin-seed/core ─────────────────────────────┐
│ theme/      skins.ts (FestivalSkin → CSS vars) + FestivalProvider         │
│ ui/         kit.tsx (primitives) · AppChrome (header/footer chrome)       │
│ data/       types.ts (DataLayer contract) · local.ts · supabase.ts        │
│             createDataLayer.ts (env switch) · broadcast.ts (shim)         │
│ i18n/       i18n.tsx (en/zh provider)                                     │
│ hooks/      useTable · usePersistedState · useGeolocation · useClock      │
│ styles/     base.css — design tokens on :root + component classes         │
└───────────────────────────────────────────────────────────────────────────┘
```

## Key decisions

- **Skins as data.** A skin is a `Record<string,string>` of CSS custom properties applied to
  `:root`. Components never read the skin object; they style `var(--ps-*)`. Adding a festival
  is ~30 lines of object, zero component churn.
- **DataLayer over an ORM.** Two tiny adapters (~60 lines each) beat a generic client for a
  hackathon-sized surface. `LocalAdapter` uses one `localStorage` key per table
  (`ps:<table>`) and a `BroadcastChannel` (`ps-sync:<table>`) for cross-tab fan-out.
  `SupabaseAdapter` re-lists on every postgres change — table sizes here are tens of rows,
  so correctness beats delta-diff cleverness.
- **Chrome as a component.** `AppChrome` renders header (motif, title, mode badge, skin
  switcher, app actions), confetti layer, main slot, and the "Grown from PumpkinSeed"
  footer — the visible proof both apps share one lineage (the Skeleton Crew pitch).
- **Type-only template package.** The template ships `.ts(x)` source and resolves through
  Vite in the consuming app: one pipeline, no build artifacts to keep in sync.

## Data contracts

```ts
interface Row { id: string; created_at: string }   // uid() + nowIso() set by adapters
interface DataLayer { mode; list; insert; update; remove; subscribe }
```

## Error handling

- Adapter failures throw `DataLayerError`; `useTable` keeps the last good rows and surfaces
  `ready` so apps can show a spinner instead of a blank screen.
- `LocalAdapter` reads tolerate JSON corruption (returns `[]`).
- Supabase `subscribe` keeps one channel per table and unsubscribes on teardown.

## Testing strategy

- `tsc --noEmit` per package (strict) as the static gate.
- Manual realtime matrix: two tabs, insert/update/remove/vote in each direction, both adapters.
