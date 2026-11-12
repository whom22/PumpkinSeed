# Festival Kit Template �� Tasks

- [x] 1. Set up pnpm workspace (root, template, two apps) with strict TS base config
- [x] 2. Define `DataLayer` contract, `Row`, `RowDraft`, `uid`, `nowIso` in `data/types.ts`
- [x] 3. Implement `LocalAdapter`: localStorage store + BroadcastChannel fan-out + unsubscribe
- [x] 4. Implement `BroadcastChannel` shim with storage-event fallback
- [x] 5. Implement `SupabaseAdapter` with postgres_changes realtime
- [x] 6. Implement `createDataLayer` env switch and export from barrel
- [x] 7. Define three festival skins as CSS-var maps (halloween, christmas, lunar-new-year)
- [x] 8. Implement `FestivalProvider` (apply-on-change, unknown-id fallback, extra skins)
- [x] 9. Write `base.css`: tokens, night backdrop, buttons, cards, forms, modal, toasts, confetti, leaflet theming, reduced-motion
- [x] 10. Build UI kit: Button, Card, Badge, EmptyState, Spinner, Modal, ToastProvider/useToast
- [x] 11. Build `AppChrome` (motif header, skin switcher, backend badge, seed footer)
- [x] 12. Build `I18nProvider` (detect, persist, en-fallback) + `LangToggle`
- [x] 13. Build hooks: `useTable`, `usePersistedState`, `useGeolocation`, `useClock`
- [x] 14. Barrel `src/index.ts` + `styles.css` export + `env.d.ts`
- [x] 15. `tsc --noEmit` green for template package

