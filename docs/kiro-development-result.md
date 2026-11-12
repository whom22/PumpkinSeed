# Verified Kiro development contribution

Date: 10 November 2026. This describes a new, bounded contribution, not the origin of the entire project.

## Actual Kiro work

Kiro CLI 3.1.0, using Qwen3 Coder Next, received the existing shared Modal and explicit keyboard-focus acceptance criteria. In one generation it produced a DOM focus-management helper, a React integration draft and a browser-test draft. No model tools were enabled. Raw output and original inputs are retained in the private `.qa/kiro-development-evidence` directory.

The core helper is now integrated in `template/src/ui/modalFocus.ts`, used by the shared Modal in `template/src/ui/kit.tsx` and therefore both apps. It moves focus into an open modal, wraps Tab/Shift+Tab, handles Escape and restores the invoker on cleanup.

## Independent corrections and verification

The generated draft was not accepted blindly. Independent integration corrected callback-identity focus resets, duplicate dialog roles, inert-ancestor/disabled-fieldset filtering, an empty-dialog focus escape, and idempotent cleanup. The generated test lacked a usable fixture and had invalid output escaping; its scenario list was turned into an executable Chromium fixture. These corrections and tests are not claimed as Kiro-authored.

Passed on the final implementation: three package typechecks, five core regressions, both production builds, eleven isolated DOM focus checks and eighteen actual-app browser checkpoints. The latter added real React focus stability/restoration, checked both app dialogs and reported no uncaught page errors. External requests were blocked in this final deterministic smoke run; public map tiles had passed the earlier 9 November check and are separately checked during video recording.

The modal supports the current single-modal usage. This is not a nested-dialog framework, a complete accessibility audit, hosted cross-device verification or a guarantee of competition eligibility.

## Cost and attribution

The development response records approximately 0.0176959071 credits. Including the earlier review and mistaken usage prompt, the recorded total is approximately 0.0360486799 credits. These are local per-turn records, not an account-balance measurement.

Original app construction and earlier repairs involved other tools. The earlier Kiro read-only review did not produce substantiated fixes. Existing specification/hook files do not prove prior Kiro execution. This new contribution must not be described as Kiro having built the whole application or executed all hooks.

