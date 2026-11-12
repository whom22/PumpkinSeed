---
inclusion: always
---

# Project Structure

```
pumpkin-seed/
├── .kiro/                    # specs / steering / hooks — MUST stay in git (hackathon rule)
├── template/                 # @pumpkin-seed/core — the seed
│   └── src/
│       ├── theme/            # FestivalProvider + skin definitions (CSS var maps)
│       ├── ui/               # kit.tsx (Button/Card/Badge/Modal/Toast…), AppChrome, LangToggle
│       ├── data/             # DataLayer contract + LocalAdapter + SupabaseAdapter + factory
│       ├── i18n/             # I18nProvider (en/zh), ~60 lines, no dependency
│       ├── hooks/            # useTable, usePersistedState, useGeolocation, useClock
│       └── styles/base.css   # the shared design language (CSS custom properties)
├── apps/
│   ├── trick-or-treat-map/   # App 1 — Leaflet map + candy leaderboard
│   │   └── src/
│   │       ├── components/   # MapView, AddStopModal
│   │       ├── types.ts      # CandyStop row + candy catalog + hours parsing
│   │       ├── i18n.ts       # en/zh dictionaries
│   │       └── app.css       # app-only styles (prefix: tot-)
│   └── ghost-story-relay/    # App 2 — hash-routed rooms + realtime relay
│       └── src/
│           ├── components/   # HomeView, StoryRoom
│           ├── types.ts      # StoryLine row + room codes + ghost names
│           ├── i18n.ts       # en/zh dictionaries
│           └── app.css       # app-only styles (prefix: gsr-)
└── docs/                     # submission materials: Kiro write-up, blog, video script
```

## Conventions

- **Class prefixes are namespaced**: template components use `ps-*`, the map app uses `tot-*`,
  the relay app uses `gsr-*`. Never cross the boundary — apps may not style `ps-*` internals.
- **Rows extend `Row`** (`id`, `created_at`) from the template; tables are snake_case, rows camelCase.
- **i18n keys** are namespaced: `app.*`, `form.*`, `filter.*` / `room.*`, `share.*`, `home.*`.
  The English dictionary is the fallback and must always be complete.
- **Exports**: apps import template symbols only from `@pumpkin-seed/core` (the barrel `src/index.ts`).
- App components never touch `localStorage` keys owned by the template (`ps:*`); app keys are
  `tot:*` / `gsr:*`.
