> **Archived unverified draft. Do not submit or publish this text as factual evidence of Kiro use, a live deployment, or a completed submission.** Claims below about development chronology, Kiro execution, event rules, deadlines and deployment status have not been verified. The original text is preserved for reference. Use [the current submission draft](submission-draft.md) and [the local demo runbook](demo-runbook.md) instead, and complete their verification checks before any authorized publication.

# How We Used Kiro �� Submission Write-up

**Project:** PumpkinSeed (template + Trick-or-Treat Map + Ghost Story Relay)
**Category:** Skeleton Crew �� **Track:** Open Ended

## Spec-driven development (`.kiro/specs/`)

Every package was built from a full three-file spec, written before code:

- **`requirements.md`** �� user stories with acceptance criteria in **EARS notation**
  (`WHEN �� THE SYSTEM SHALL ��`). 4 requirements / 15 criteria for the template, 3 / 10 and
  3 / 11 for the two apps.
- **`design.md`** �� architecture diagrams (module composition per app), key decisions
  (skins-as-data, DataLayer dual adapters, hash routing, idempotent room seeding), data
  contracts, error handling, and a testing strategy.
- **`tasks.md`** �� the implementation plan as discrete tracked tasks (15 / 12 / 12), executed
  in dependency order; every task ships checked.

The specs are the reason two apps could share *zero* feature code while staying one product:
the contract (`DataLayer`, `FestivalSkin`, `AppChrome`) was pinned down at spec level first.

## Steering (`.kiro/steering/`)

Four steering files govern every agent session in this repo:

- **`product.md`** �� the "why": festival communities need one-night tools; the seed metaphor;
  the two-app family table. Kept scope honest when it would have been easy to gold-plate.
- **`tech.md`** �� pnpm workspaces, React 19, no Tailwind/CSS-in-JS, Supabase behind a
  DataLayer seam, "prefer zero new runtime dependencies", Windows-first scripts.
- **`structure.md`** �� the CSS class treaty (`ps-*` / `tot-*` / `gsr-*` namespaces that may
  not cross), row naming, i18n key namespaces, barrel-only imports.
- **`react-components.md`** �� `fileMatch`-scoped rules (cleanup effects, no data fetches in
  render, emoji-first iconography) loaded only for `.tsx` files.

## Hooks (`.kiro/hooks/`)

Three agent hooks encode our guardrails:

1. **`typecheck-on-save`** �� `PostFileSave` on `*.ts(x)` runs strict `tsc --noEmit`.
2. **`kiro-folder-guard`** �� an agent hook on `.gitignore` saves that keeps `/.kiro` tracked
   (a Kiroween disqualifier if ignored).
3. **`spooky-review-on-stop`** �� a `Stop` review: typecheck green, i18n en+zh completeness,
   and no unjustified new dependencies before any session wraps.

## What Kiro changed about the result

- The **template boundary** exists because the spec forced us to write the contract first ��
  the SkinSwitcher, mode badge, and `useTable` hook fell out of that contract.
- Steering's **"skins are data"** rule is why adding a third festival (Lunar New Year) was a
  30-line object instead of a refactor.
- The hooks made **`/.kiro` un-gitignore-able** and typechecks boring �� infrastructure as
  team habits instead of README warnings.

## Kiro surfaces used

Specs (requirements �� design �� tasks) �� Steering (always + fileMatch inclusion) �� Agent Hooks
(`PostFileSave`, `Stop`) �� Kiro as the IDE/CLI workspace for the repo.

