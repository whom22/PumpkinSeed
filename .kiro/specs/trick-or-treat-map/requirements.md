# Trick-or-Treat Map — Requirements

## Overview
A community candy map for Halloween night: generous houses pin their location, candy types,
allergy info, and candy hours; trick-or-treaters filter, locate, and thank them.

## Requirements

### Requirement 1: Pin a candy house
**User story:** As a neighbor giving out candy, I want to drop my house on the map with candy
details, so families can find me.

#### Acceptance criteria
1. WHEN the user taps the map's 🎃+ button
   THE SYSTEM SHALL enter pick mode, show a hint banner, and open the add form at the next
   tapped coordinate.
2. WHEN the add form opens
   THE SYSTEM SHALL prefill the location with the browser geolocation when permission is granted
   (map pick overrides it).
3. WHEN the user saves with a valid location
   THE SYSTEM SHALL insert a `candy_stops` row (name, lat/lng, candy types, allergen-free flag,
   hours, 1-5 spookiness, note, votes=0) and show a success toast.
4. WHEN the user saves without any location
   THE SYSTEM SHALL keep the form open and disable save until a location exists.

### Requirement 2: Browse and filter
**User story:** As a parent, I want to filter houses by what my kid can eat and when they're open.

#### Acceptance criteria
1. WHEN rows change (any device/tab)
   THE SYSTEM SHALL update map markers, popups, and the leaderboard live without reload.
2. WHEN the "Open now" filter is on
   THE SYSTEM SHALL show only houses whose `HH:MM-HH:MM` window contains the current local time
   (houses without a window always pass).
3. WHEN an allergen or candy-type filter is on
   THE SYSTEM SHALL show only matching houses; multiple filters AND together.
4. WHEN the map first receives data
   THE SYSTEM SHALL fit the viewport to all markers.

### Requirement 3: Thank a house
**User story:** As a trick-or-treater, I want to thank generous houses so they rank on the leaderboard.

#### Acceptance criteria
1. WHEN the user presses "Thanks!"
   THE SYSTEM SHALL increment the row's `votes` by one, live-synced, and show a toast.
2. THE SYSTEM SHALL display a votes-sorted leaderboard with 🥇🥈🥉 medals and candy-type emojis.
3. WHEN a house is allergen-free
   THE SYSTEM SHALL badge it 🌾 and color its map marker green.
