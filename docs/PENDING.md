Sprint Zero residuals:
- Live vault read/write + search/filter/edit/delete confirmed (InventoryView implemented).
- Atomic decrementStock exposed via Sell control on vault items (uses Firestore transaction).
- Delete confirmation is now an in-app modal (mobile-friendly; no window.confirm).
- Theme Card aligned to --card-bg.
- Header status indicator now reflects processor inventory status (LIVE/OFFLINE) instead of hard-coded ONLINE.
- Offline config banner added to Vault when VITE_FIREBASE_* missing.
- .env.example added.
- Dual inventory surfaces resolved: Inventory.jsx is no-render engine that seeds processor; InventoryView.jsx is the sole UI routed from App.
- Local npm install + production build green (vite build succeeds; chunk warning only).
Next: live smoke with real env (requires VITE_FIREBASE_*), Auth + Firestore rules before any public exposure, Sales module that consumes decrementStock.
