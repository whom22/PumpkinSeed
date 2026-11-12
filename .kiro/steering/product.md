---
inclusion: always
---

# Product: PumpkinSeed

PumpkinSeed is a **lean festival-app template** ("the seed") plus **two distinct apps** grown from it,
built for the Kiroween 2026 hackathon's **Skeleton Crew** category (one template → two apps).

## Why this exists

Festival communities (Halloween night especially) need tiny, throwaway-but-real web tools:
where are the candy houses? which story are the neighbors writing together? Existing options
are heavyweight platforms or dead QR-code links. PumpkinSeed makes these tools a **seed you plant**:
the same template powers both, so a new festival tool takes hours, not weeks.

## The family

| Member | What it does | Festival problem it solves |
|---|---|---|
| `template/` (`@pumpkin-seed/core`) | Festival skin engine, spooky UI kit, realtime data layer, tiny i18n | The reusable seed itself |
| `apps/trick-or-treat-map` | Community candy map: houses pin candy/allergies/hours, families plan routes, thanks leaderboard | Finding candy safely on Halloween night |
| `apps/ghost-story-relay` | Room-based realtime horror-story relay: one sentence each, vibe votes, read-aloud, share card | A party game strangers can join with a code |

## Who it's for

- **Neighbors & families** on Halloween night (map): parents checking allergens, hosts advertising full-size bars.
- **Party guests & classrooms** (relay): anyone with a 6-char code and a sentence to add.
- **Hackathon builders** (template): developers who want a festival-ready starter with spec-driven `.kiro` scaffolding.

## Objectives

1. Zero-setup: every app runs fully in-browser (local realtime via BroadcastChannel) with no account.
2. One environment variable pair (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) upgrades both apps to hosted realtime.
3. Adding a new festival = one skin object, not a fork.
4. Every artifact a Kiro workflow needs (specs, steering, hooks) ships in the repo and stays un-gitignored.
