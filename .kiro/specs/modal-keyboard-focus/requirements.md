# Shared modal keyboard focus

Recorded from the actual 10 November 2026 development request; this is not a claim of historical Kiro Spec-mode execution.

- Focus the first visible enabled tabbable control on open, or the panel if empty.
- Wrap Tab and Shift+Tab, recomputing candidates after dynamic changes.
- Exclude hidden, inert, disabled and negative-tabindex controls.
- Escape dismisses once; callback rerenders must not reset input focus.
- Remove listeners and restore the connected opener on close/unmount.
- Preserve backdrop behavior; target the current single-modal case without new dependencies.

Kiro generated a helper and drafts. Independent corrections and verification are detailed in docs/kiro-development-result.md.

