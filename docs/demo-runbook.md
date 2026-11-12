# PumpkinSeed local demo runbook

A roughly three-minute demonstration of the repaired local build. Use fictional data only. This script is a rehearsal plan, not a claim that acceptance tests passed. Do not record the final take until the release checks below pass on the final code.

## Prepare before recording

1. Use a dedicated demo browser profile with no personal pages visible. Do not clear an existing profile's data. Use two windows in this same profile, not separate browsers or ordinary versus private windows.
2. After dependencies are installed, run `node scripts/dev.cjs` in a terminal at the repository root. Keep it running. It launches both apps bound to this computer only at `http://127.0.0.1:5173` and `http://127.0.0.1:5174`, with strict ports. If a port is occupied, stop and resolve the conflict; the launcher must not silently switch ports. Use these exact origins in both windows. Press Ctrl+C when finished.
3. Confirm both headers show local mode. If either shows live mode, stop and resolve configuration with the repair owner before proceeding. Do not connect to a hosted database for this recording.
4. Select English and the Halloween skin. Arrange two map windows side by side. Prepare two relay tabs on its home page. Cross-tab sharing is per app origin; map port 5173 and story port 5174 do not share browser storage with each other.
5. Create one fictional baseline map stop, `Demo Lantern House`, through the map pin picker. Use a visibly arbitrary demonstration point, Chocolate candy, blank hours and note `Fictional demo stop. Not a real household.` Leave the allergy checkbox off. There are no geolocation controls in this streamlined build. Never show a real home address or personal coordinates.
6. Confirm map tiles load before the take. Tiles are served by OpenStreetMap, so the map background needs network access. Keep attribution visible. If tiles are unavailable, disclose that limitation and postpone the map-background shot; do not call the entire demo fully offline.
7. Open `.kiro/` and `template/src/` in a local file browser or editor for the final short tour. Hide unrelated files, terminal history and account details. Do not show private session logs or credentials.

## Timed recording script

### 0:00 to 0:20 Introduce the scope

Show the map and its local-mode badge.

Say: "PumpkinSeed is a shared festival UI and browser data layer with two different apps. This demo runs locally, using fictional data. Changes sync between tabs in the same browser profile and origin, not across devices."

### 0:20 to 1:15 Demonstrate the map

- Click Add my house in the toolbar to open the form. Choose Choose on map, then click an arbitrary map point to reopen the form with its coordinates. Alternatively choose Use fictional demo point to fill demonstration coordinates immediately. The Add my house control embedded on the map enters picking mode directly.
- Enter house name `Demo Moon Porch`, leave Chocolate selected, leave hours blank, tick the fictional allergy-options checkbox, and add note `Fictional demo only. Verify food labels in real use.` Save.
- Show the second map window receiving the new stop without a manual refresh. Click Thanks once in the first window and show its count changing in the second.
- Toggle the allergy filter so only the tagged fictional stop remains on the map, then turn the filter off. Do not claim a leaderboard filter unless the repaired UI actually provides it.

Say: "The map records candy stops and supports filtering and thanks. These allergy labels are sample data, not verified safety information. The second window reflects the same local data."

### 1:15 to 2:20 Demonstrate the story relay

- Switch both windows to the relay origin. In the first, enter nickname `Demo Ghost` and click Start a new story.
- Wait for the opening line in a browser supporting Web Locks. Without Web Locks, the room intentionally starts empty: submit `The invitation said midnight. Nobody remembered sending it.` yourself before proceeding, so three lines will be available for the final preview. Use the actual generated room code; do not promise a fixed code. Open the exact current room URL in the second relay window using the address bar. Copy invite is optional if clipboard access already works; manual URL copying is the reliable fallback.
- In the first window, enter `A tiny pumpkin knocked on the locked door.` and click Whisper it. Wait until the second window displays it.
- In the second window, enter `Inside, the candle answered in a whisper.` and click Whisper it. Show the update in the first window.
- Click a story-line vote once and show its count. Click Finish & share after the opening and both submitted lines are visible. Show the assembled story. This opens a local preview, not a public publication or a locked final room.

Say: "The second app builds a story one short line at a time. The room code groups local story lines; it is not a private-room password. Both windows belong to one browser profile, so this demonstrates tab synchronization rather than two independent users."

Keep read-aloud out of the critical path. It can be an optional rehearsed extra if supported and time remains. Do not call an author count live online presence.

### 2:20 to 2:50 Show the shared foundation

- Close the story preview if needed. Switch the festival skin to Christmas, then back to Halloween.
- Briefly show `template/src/` and the original three spec folders and modal-focus requirements under `.kiro/specs/`, then `.kiro/steering/` and `.kiro/hooks/`.

Say: "Both apps share themes, UI, language support and data access from the core package. The repository also includes specification, steering and hook files. Those files alone do not establish actual Kiro use. Hosted synchronization and public deployment are outside this demo."

### 2:50 to 3:00 Close

Show both apps. Say: "That is PumpkinSeed: two focused festival demos built on one reusable foundation."

End with the project name and `Local demo`. Add public repository, deployment or video links only after they exist, have been verified, and are authorized for sharing. For a strict three-minute submission limit, aim for a 2:50 take and verify the exported duration.

## Release checks before the final take

Verified against `.qa/regression-results.json`: the production-build browser run passed 18 checkpoints in installed Chromium 145.0.7632.6. Only localhost and OpenStreetMap tile requests were allowed; other external requests were blocked. Live tiles loaded successfully for the fictional demo area. These results establish the tested local behavior, not hosted operation or a completed video rehearsal.

- [x] The repair owner reports `node scripts/check.cjs` passed three package typechecks, five core tests and two app builds. Re-run it if the code changes.
- [x] The tested local app flows produced zero uncaught JavaScript errors.
- [x] Map creation and thanks update in both tabs; data survives refresh. Cancel and Escape retain draft without saving.
- [x] Manual map picking and allergy filtering work without geolocation; forced write failure preserves the draft and shows an error.
- [x] Exact story-code validation, one automatic opening, both-direction writes, votes, refresh persistence, final preview and Back/Forward navigation pass.
- [x] Concurrent story submissions retain both lines. Simultaneous room opening and storage-event synchronization without BroadcastChannel pass.
- [x] Both apps fit 390px mobile width without overflow; desktop and mobile screenshots were captured.
- [x] Corrupt stored data produces a visible error without overwrite; blocked storage produces an error without an app crash.
- [ ] Rehearse the final recording using the launcher URLs and confirm local-mode badges.
- [x] The fictional-point shortcut was used twice, and switching to Christmas and back to Halloween succeeded in the final browser script.
- [ ] If demonstrating a browser without Web Locks, verify the manual first-line path there. The passing storage fallback test concerns BroadcastChannel, not Web Locks.
- [x] Live OpenStreetMap tiles loaded for the fictional demo area. Keep attribution visible and recheck network availability before recording.
- [ ] Check the complete timed take, optional clipboard/speech features, and absence of personal information or unrelated browser content.
- [ ] Any claim of actual Kiro use has separately verified evidence or is omitted. All publication and submission requirements still need verification.

## Recover without overstating results

- No cross-tab update: check profile and exact scheme, hostname and port first. Refresh only to diagnose persistence; a refreshed page is not proof of live synchronization. If still failing, stop the final take and report the failure.
- Unexpected old data: use a new dedicated demo profile and repeat setup rather than deleting unrelated storage.
- Map save disabled: choose Use fictional demo point, or Choose on map and then click a point. Complete required fields. No real geolocation is needed.
- Clipboard or speech unavailable: copy the room address manually and omit narration audio. Do not spend the timed take requesting permissions.
- Storage blocked or full: stop and report it. Do not call a write successful unless the data appears and survives refresh.

Recording, uploading, publishing, deploying and submitting are separate actions. This runbook does not authorize any of them.

## Recorded local draft

A 113.8-second silent English-captioned version was recorded and visually checked on 9 November 2026. It uses two actual app views inside an isolated recording-only browser wrapper and accurately labels them as same-browser views. It is not a cross-device demonstration. The app interactions are real; no Kiro review is claimed. See `video-delivery.md`. The video remains local and requires user review before any upload. Optional speech and clipboard permission features are not shown.

## 10 November update

Use the v2 recording and factual Kiro-development caption. Kiro generated a shared modal-focus helper and draft tests; independent corrections and verification followed. Original project generation and hook execution are not claimed. The first privately delivered video remains a historical copy.

