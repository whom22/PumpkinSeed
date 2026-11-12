> **Archived unverified draft. Do not submit or publish this text as factual evidence of Kiro use, a live deployment, or a completed submission.** Claims below about development chronology, Kiro execution, event rules, deadlines and deployment status have not been verified. The original text is preserved for reference. Use [the current submission draft](submission-draft.md) and [the local demo runbook](demo-runbook.md) instead, and complete their verification checks before any authorized publication.

# Demo Video Script — target 2:30 (hard limit 3:00)

> Record at 1440×900. Two browser windows side by side for the realtime scenes.
> No copyrighted music — use silence or an original/spine-tingling free track you have rights to.
> End card must show the repo URL and the app URLs.

## 0:00–0:15 — Hook (over the map app, night map glowing)

> "Halloween night. Every family asks the same two questions: **where's the candy?** and
> **who wants to tell a story?** One template answers both. This is PumpkinSeed."

*(Screen: map desktop, slow pan/zoom over the glowing pins.)*

## 0:15–0:45 — App 1: Trick-or-Treat Map

- Show leaderboard + filters (chips, 🌾 allergy toggle, open-now). *(0:15–0:25)*
- Click 🎃+ → banner → drop a pin → fill the form (candy chips, spookiness stars, hours) → save → toast. *(0:25–0:38)*
- Click "Thanks!" on a row — leaderboard medal swaps. *(0:38–0:45)*

> "Houses pin candy, allergens, and hours. Families filter, plan, and thank.
> The green pins are allergy-friendly — a teal pumpkin, built in."

## 0:45–1:15 — The realtime proof (two windows, both apps)

- **Left** map, **right** second tab of the map. Add a house in one → it appears in the other instantly.
- Say: "No account, no server — it's all in the browser. Flip one environment variable and the
  same rows stream through Supabase." *(header badge `🧪 local` visible)*

## 1:15–2:00 — App 2: Ghost Story Relay

- Open the relay, click **Start a new story** → room code `PUMPK1` appears. *(1:15–1:22)*
- Copy invite → open in second window → both show "🕯️ The House" opening line. *(1:22–1:32)*
- Type a sentence in window A → appears live in window B. Add one in B → appears in A. *(1:32–1:45)*
- 👻 vote a line (count ticks up) → toggle **Read aloud** → the narrator voice reads the new line. *(1:45–1:55)*
- **Finish & share** → confetti + full tale card → copy. *(1:55–2:00)*

> "Same seed — zero shared feature code. The template ships the skin engine, the realtime
> data layer, the UI kit; the apps only grow their own fruit."

## 2:00–2:30 — The template + Kiro + close

- Quick screen tour: `.kiro/specs` (EARS requirements scrolling), `.kiro/steering`, `.kiro/hooks`.
- Skin switcher dropdown: flip to Christmas 🎄, whole app recolors, flip back. *(2:10–2:20)*

> "Spec-driven with Kiro: requirements in EARS, designs, tasks — plus steering rules and hooks
> that keep the repo healthy. One seed, many pumpkins. Plant yours."
>
> **End card:** repo URL · app URLs · "🎃 PumpkinSeed — Kiroween 2026"

## Shot checklist

- [ ] 1440×900, bookmarks bar hidden, dark OS chrome
- [ ] Demo data pre-seeded (leaderboard looks alive before recording)
- [ ] Two windows pre-arranged for realtime scenes
- [ ] Upload **public/unlisted-to-public** on YouTube, title: `PumpkinSeed — Kiroween 2026 (Trick-or-Treat Map + Ghost Story Relay)`
