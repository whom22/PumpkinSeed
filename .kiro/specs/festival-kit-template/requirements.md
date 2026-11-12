# Festival Kit Template — Requirements

## Overview
The seed package `@pumpkin-seed/core` provides everything a festival app needs so that two
distinct apps can grow from one template with zero duplicated infrastructure.

## Requirements

### Requirement 1: Festival skin engine
**User story:** As a builder, I want to switch the entire look of an app to a named festival skin,
so that one codebase serves any holiday.

#### Acceptance criteria
1. WHEN `<FestivalProvider initialSkin="halloween">` mounts
   THE SYSTEM SHALL apply every skin CSS variable to `:root` and set `data-skin` on `<html>`.
2. WHEN the user selects another skin from the switcher rendered in `AppChrome`
   THE SYSTEM SHALL recolor all themed surfaces, fonts, glows, and confetti within one animation frame.
3. WHEN a skin id is unknown
   THE SYSTEM SHALL fall back to the Halloween skin instead of rendering unstyled.
4. THE SYSTEM SHALL ship at least three built-in skins (halloween, christmas, lunar-new-year)
   and allow apps to register extra skins via `extraSkins`.

### Requirement 2: Realtime data layer with two backends
**User story:** As a builder, I want a single table-store API that runs with zero setup and
optionally upgrades to hosted realtime, so my demo always works and my production can scale.

#### Acceptance criteria
1. WHEN neither `VITE_SUPABASE_URL` nor `VITE_SUPABASE_ANON_KEY` is set
   THE SYSTEM SHALL activate `LocalAdapter` (`mode === 'local'`).
2. WHEN both variables are set
   THE SYSTEM SHALL activate `SupabaseAdapter` (`mode === 'supabase'`).
3. WHEN a row is inserted, updated, or removed in one tab
   THE SYSTEM SHALL propagate the change to every subscribed tab of the same origin in under one second.
4. WHEN `subscribe` is called
   THE SYSTEM SHALL immediately emit the current row set and return an unsubscribe function.
5. THE SYSTEM SHALL expose `mode` so the UI can badge which backend is live.

### Requirement 3: Spooky UI kit
**User story:** As a builder, I want polished themed primitives, so both apps look designed, not default.

#### Acceptance criteria
1. THE SYSTEM SHALL export Button (4 variants × 3 sizes), Card, Badge (3 tones), Modal, Toasts,
   EmptyState, Spinner, FestivalConfetti, AppChrome, and LangToggle from the barrel.
2. WHEN a mutation succeeds or fails
   THE SYSTEM SHALL show a toast that auto-dismisses within 4 seconds.
3. WHEN `prefers-reduced-motion` is set
   THE SYSTEM SHALL disable confetti and looping animations.

### Requirement 4: Tiny i18n
**User story:** As a Chinese or English speaker, I want both apps in my language without a
weighty i18n library.

#### Acceptance criteria
1. WHEN the browser language starts with `zh`
   THE SYSTEM SHALL default to the `zh` dictionary, otherwise `en`.
2. WHEN a key is missing in the active dictionary
   THE SYSTEM SHALL fall back to English, then to the key itself.
3. WHEN the user toggles language
   THE SYSTEM SHALL persist the choice across reloads and update `<html lang>`.
