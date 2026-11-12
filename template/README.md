# @pumpkin-seed/core

Shared React source package used by both PumpkinSeed apps.

Includes:
- Festival themes and CSS variables.
- App chrome, basic UI components and English/Chinese dictionary support.
- LocalAdapter and useTable for local browser persistence and same-origin tab updates.
- An experimental Supabase adapter with explicit database field mapping.

The local adapter sends same-tab notifications and supports multiple subscribers, with cleanup on unsubscribe. BroadcastChannel is used when available; storage events are the cross-tab fallback. Web Locks serialize read/modify/write operations on supported browsers. Errors are surfaced rather than treating damaged storage as empty data.

The API is a small list/insert/update/remove/subscribe interface. Subscriptions optionally accept an error callback. The UI hook returns rows, ready, error and refresh.

This package is not an authentication system or an encrypted/private data store. See the root README for scope, limitations, test instructions and the unverified status of hosted behavior.

