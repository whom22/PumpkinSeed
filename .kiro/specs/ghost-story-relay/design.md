# Ghost Story Relay — Design

## Composition

```
AppChrome
├── HomeView (#/): ghost-nickname card (persisted + 🎲), create button, join-by-code,
│                  "how it haunts" steps
└── StoryRoom (#/r/CODE): roombar · scrolling story list · composer (meter + Enter)
                          + Finish modal (tale, copy, confetti)
```

## Key decisions

- **Hash routing, zero router dep.** `#/r/<CODE>` is parsed from `hashchange`; rooms are
  deep-linkable and static-host friendly (`index.html` fallback never needed).
- **One table, filtered client-side.** `story_lines` rows carry `roomId`; `StoryRoom` filters
  via `useMemo` and sorts by `created_at`. Same realtime plumbing as the map — the template
  doing its job.
- **Seeding is idempotent.** `gsr:seed:<room>` localStorage guard set *before* insert and
  rolled back on failure prevents duplicate opening lines from concurrent first visitors.
- **SpeechSynthesis with a queue of one.** Only the newest line is spoken (`lastSpokenRef`
  guard), pitch 0.75 / rate 0.92 for a campfire-narrator voice; unmount cancels speech.
- **Votes are local-toggle + shared counter.** `gsr:voted:<room>` remembers the user's toggles;
  the count is a plain row field — honest, simple, realtime.

## Data

`story_lines`: `roomId: string, author: string, text: string (≤140), vibes: number` — same
`Row` base, same two adapters as every PumpkinSeed app.

## Error handling

- Empty composer → toast error, no insert.
- Clipboard API failure is non-blocking (toast still shows the code).
- SpeechSynthesis unsupported → button simply has no effect; no crash.

## Testing strategy

- Two-tab relay: lines, vibes, nickname rename, finish modal; repeat with Supabase env.
- Re-entry with the same code must not duplicate the opening line.
