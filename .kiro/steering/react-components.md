---
inclusion: fileMatch
fileMatchPattern: ["apps/*/src/**/*.tsx", "template/src/**/*.tsx"]
---

# React Component Rules

- Function components only. Props interfaces are declared right above the component and exported
  only if consumed by other files.
- No `useEffect` without a cleanup or a comment saying why none is needed.
- Data access flows through hooks from `@pumpkin-seed/core` (`useTable`, `usePersistedState`).
  Components never call `data.list()` inside render.
- Toast feedback after every user-visible mutation (`useToast`), with the app's i18n keys.
- Styles are plain CSS classes in the app's `app.css` (or template `base.css`) — never inline
  objects for anything reusable; one-off positioning inline styles are fine.
- Prefer emoji as iconography; it is on-theme and dependency-free. Decorative emojis get
  `aria-hidden` via empty alt or being plain text inside buttons with labels.
