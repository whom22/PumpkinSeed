# Ghost Story Relay — Requirements

## Overview
Room-based realtime horror-story relay: join with a 6-character code, add one sentence per
turn, vote the spookiest lines, read aloud, and share the finished tale.

## Requirements

### Requirement 1: Rooms via code or link
**User story:** As a party host, I want a room code I can shout across the room, so guests join
in seconds.

#### Acceptance criteria
1. WHEN the user presses "Start a new story"
   THE SYSTEM SHALL generate a 6-character unambiguous code (no 0/O/1/I/L) and route to `#/r/<CODE>`.
2. WHEN a user joins with a code
   THE SYSTEM SHALL normalize case and route to the same room.
3. WHEN the room is opened for the first time
   THE SYSTEM SHALL seed exactly one opening line authored by "🕯️ The House" (language-aware),
   guarded so concurrent first visitors cannot duplicate it.
4. WHEN a user copies the invite
   THE SYSTEM SHALL put a shareable room URL on the clipboard and toast a confirmation.

### Requirement 2: Relay writing
**User story:** As a guest, I want to add one sentence and see everyone else's sentences appear
live, so the story grows before my eyes.

#### Acceptance criteria
1. WHEN a line is added in any tab/device of the room
   THE SYSTEM SHALL append it live to every open room view, in `created_at` order, without reload.
2. WHEN a line is submitted
   THE SYSTEM SHALL accept max 140 characters, show a live character meter, and warn on empty input.
3. WHEN the composer submits (Enter or button)
   THE SYSTEM SHALL attribute the line to the user's persisted ghost nickname (editable in the room,
   randomizable).
4. THE SYSTEM SHALL visually distinguish the opening line, the user's own lines, and others' lines.

### Requirement 3: Vibes, reading, sharing
**User story:** As a reader, I want to reward the spookiest lines and hear the story read aloud.

#### Acceptance criteria
1. WHEN the user toggles 👻 on a line
   THE SYSTEM SHALL increment (or un-increment) `vibes`, remember the vote locally per room, and
   reflect the change live everywhere.
2. WHEN "Read aloud" is enabled
   THE SYSTEM SHALL speak every newly arrived line via SpeechSynthesis in the active language
   and provide a stop control; leaving the room cancels speech.
3. WHEN "Finish & share" is pressed with ≥ 3 lines
   THE SYSTEM SHALL show the full tale, fire festival confetti, offer copy-to-clipboard, and a
   route back to start a new story.
