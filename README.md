# PumpkinSeed

**One small shared foundation. Two focused festival demos.**

PumpkinSeed is a React + TypeScript workspace with a reusable core and two apps:

- **Trick-or-Treat Map:** add a fictional candy stop, choose a point on a map, filter markers, and add a thanks vote.
- **Ghost Story Relay:** start a local room, append short story lines, vote, and preview the assembled story.

Both apps import themes, UI components, language support and browser storage from `@pumpkin-seed/core`. The app-specific code is separate. These demos use browser-local data, not a shared community backend.

## Try the public demos

- [PumpkinSeed landing page](https://whom22.github.io/PumpkinSeed/)
- [Trick-or-Treat Map](https://whom22.github.io/PumpkinSeed/map/)
- [Ghost Story Relay](https://whom22.github.io/PumpkinSeed/story/)

GitHub Pages serves both apps. Data remains in your browser profile; story updates sync between tabs of that profile, not across devices. Use fictional demo data.

## Run the local demo

Prerequisites: Node.js 22.12 or newer and pnpm 10.32.1. This checkout was checked with Node.js 24.18.0.

```sh
pnpm install --frozen-lockfile
node scripts/dev.cjs
```

Open:

- Map: http://127.0.0.1:5173
- Story: http://127.0.0.1:5174

Keep the terminal running. Press Ctrl+C to stop. The servers bind only to this computer and refuse to silently switch ports. If a port is occupied, stop the process you recognize or explicitly choose and document different ports.

Open the **same app URL in two tabs of one browser profile**. A write should appear in both tabs without refreshing. Use the fictional-point option in the map form, or Choose on map and click a point. Geolocation is not requested.

## Scope and privacy

- Local mode is the default. Data stays in that browser profile's localStorage. Another device, browser profile, private window, hostname or port has different data. Sharing a room URL does **not** transfer the story.
- Data is not encrypted or authenticated. Anyone who can access the same browser profile can read it. Room codes group rows; they are not access-control secrets.
- Use fictional names, locations and stories. Do not enter a real home address, children's information, medical details or other sensitive data.
- OpenStreetMap tiles require internet. The map provider receives normal tile requests and network metadata. Markers and lists still work without tiles, but the background can be blank. This is not a fully offline map.
- Allergy labels are unverified demo fields, not a food-safety guarantee.
- Modern browsers with Web Locks serialize local writes and create one automatic story opening. Without Web Locks, start the story yourself; simultaneous writes are not guaranteed.
- Votes are casual demonstration counters, not unique-user or abuse-resistant votes. Contributor counts are distinct author names, not online presence. There is no enforced turn-taking or route planner.
- Speech and clipboard depend on browser support and permissions. Finish & share opens a local preview; it does not publish or lock a story.
- Clearing browser storage deletes local demo data. Export and recovery are not implemented.

## Verify

```sh
node scripts/check.cjs
```

This runs all three TypeScript checks, the core regression suite and both production builds. No lint configuration existed in the original repository; no lint pass is claimed.

`scripts/browser-smoke.cjs` tests the built apps in a fresh headless Chromium context. It needs an existing Playwright installation and browser. It uses localhost ports 5173 and 5174, never your normal browser profile, and blocks external requests by default. Set `PLAYWRIGHT_MODULE` to an installed Playwright module path and optionally `CHROMIUM_EXECUTABLE` to the installed browser executable. Test outputs and screenshots go to ignored `.qa/`.

See [the demo runbook](docs/demo-runbook.md) for recorded verification coverage and a three-minute rehearsal.

## Experimental hosted adapter

The Supabase adapter remains in the source for future work, but is **not part of the verified local demo**. Environment credentials alone no longer enable it. It additionally requires `VITE_DATA_MODE=supabase`.

Its camelCase/snake_case field mapping matches the sample SQL and is unit-tested. No real database migration, hosted realtime, authorization or security testing was performed. The sample SQL contains open anonymous policies that allow broad read/write access. Do not use it for private or real community data, and never place a service-role key in a client app.

## Submission and Kiro evidence

The repository contains three original application/template specification sets and a new modal-focus requirements record, steering files and hook definitions under `.kiro/`. Their presence does not prove actual Kiro sessions, executed hooks, or a spec-before-code workflow. Those claims remain unverified.

The source repository is public at https://github.com/whom22/PumpkinSeed, and both browser-local demos are hosted on GitHub Pages at the links above. A public video and final competition submission are separate release steps. Competition eligibility and current rules need separate verification.

## License

MIT. See [LICENSE](LICENSE).

Verified new Kiro contribution: shared modal keyboard-focus implementation draft, independently corrected and tested on 10 November 2026. See [development evidence](docs/kiro-development-result.md). This is not a claim that Kiro created the whole project.

