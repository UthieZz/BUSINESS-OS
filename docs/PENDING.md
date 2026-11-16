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
- Default activeModule set to "inventory" so Vault is the operational landing on load.
- index.html title updated to Business OS — StokeD⁴T.

- Sales list now resolves vault item names (instead of raw itemId) for readability.

- Vault list now supports client-side sort (name / weight desc / value desc) in addition to search + low-stock filter.
- Dashboard cards are clickable and navigate to the corresponding module via AppContext (wires navigation residual).
- Hard-coded "Sprint Zero" status removed from Header; Cash Flow / Oracle cards no longer show misleading "Coming Soon" / "Monitoring..." values.

Next: live smoke with default config (or real env), Auth + Firestore rules before any public exposure, expand Sales (payments/reconciliation).

- Filtered totals summary (count / weight / value) added to Vault list for quicker residual awareness.

- Dashboard now shows live Sales totals (count + revenue) from processor sales state seeded by Sales engine (non-render) and refreshed on SalesView. Inventory value and weight use consistent ZAR/g formatting. Hard-coded "Coming Soon" cleaned for Sales card.
