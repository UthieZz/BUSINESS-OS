Sprint Zero residuals:

- Live vault read/write + search/filter/edit/delete confirmed (InventoryView implemented).
- Atomic decrementStock exposed via Sell control on vault items (uses Firestore transaction).
- Delete confirmation is now an in-app modal (mobile-friendly; no window.confirm).
- Theme Card aligned to --card-bg.
- Header status indicator now reflects processor inventory status (LIVE/OFFLINE) instead of hard-coded ONLINE.
- Offline config banner added to Vault when VITE_FIREBASE_* missing (default config makes this rare).
- .env.example added (populated with confirmed stoked4t client config).
- Dual inventory surfaces resolved: Inventory.jsx is no-render engine that seeds processor; InventoryView.jsx is the sole UI routed from App.
- Local npm install + production build green (vite build succeeds; chunk warning only).
- Vault UX: consistent ZAR formatting (toFixed(2)), larger mobile touch targets (min-height 44px on inputs/buttons), last-updated timestamp in filtered totals.
- firebase.js falls back to confirmed client config (apiKey/projectId etc.) so isFirebaseConfigured is true by default for the known project; env still overrides.

- Minimal Sales module implemented: SalesService.recordSale calls decrementStock (transaction) then writes sale doc to `sales`. SalesView UI wired in App (select item, grams, unit price, list).

Next: live smoke with default config (or real env), Auth + Firestore rules before any public exposure, expand Sales (payments/reconciliation).

- Filtered totals summary (count / weight / value) added to Vault list for quicker residual awareness.
