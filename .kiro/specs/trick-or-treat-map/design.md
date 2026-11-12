# Trick-or-Treat Map — Design

## Composition

```
AppChrome
└── .tot-layout (desktop: map | sidebar 380px; mobile: stacked)
    ├── .tot-mappane
    │   ├── toolbar: search · open-now · allergy-only · add-house
    │   ├── candy chips (single-select type filter)
    │   └── MapView (Leaflet, dark-filtered OSM, divIcon pins)
    └── .tot-side: StopDetail (modal) + votes leaderboard
```

## Key decisions

- **Leaflet in one component.** `MapView` owns the map lifecycle (`useRef` host + init once),
  marker sync (`useEffect` on stops), pick-mode handler, and a one-shot `fitBounds`
  (`fittedRef` guard). Everything else stays React.
- **Pins as `L.divIcon`.** A rotated teardrop div styled with `--ps-accent`/`--ps-success`
  gradients keeps the pins on-theme for free and lets CSS do the selected ring.
- **Pick flow over a geocoder.** The 🎃+ button arms pick mode; the next map click dispatches
  `tot:pick` with latlng; `AddStopModal` listens and prefills. Geolocation is only a prefill.
- **Filtering is a pure `useMemo`** over `useTable` rows — no server round-trips, works the
  same on both adapters.
- **Night mode is a tile-pane CSS filter** (`invert → hue-rotate`) on standard OSM tiles:
  no tile API key, attribution preserved.

## Data

`candy_stops`: `name, lat, lng, candy: string[], allergenFree: boolean, hours: string,
spooky: 1-5, note?, votes: number` — flat, anon-writable, realtime-synced.

## Error handling

- Geolocation denial/timeout surfaces through the locate button's disabled state; the map
  pick flow never depends on it.
- Marker popups HTML-escape user names/notes.

## Testing strategy

- Two-tab manual matrix for live adds/thanks (local mode), then repeat with Supabase env set.
- Filters: hours boundary cases (empty window, midnight-crossing not supported by design —
  documented in `parseHours`).
