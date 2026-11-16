# Business OS - Project Context

_Last Updated: 16 November 2026_

---

# Project Status

## Current Sprint

**Sprint Zero – Foundation & Live Vault path**

Progress:

```
████████████████████ 100%
```

Vault UI residual closed (search/filter/edit/delete + mobile delete modal). Confirmed stoked4t client config is now the fallback in `src/lib/firebase.js` (env overrides). `isFirebaseConfigured` is true by default. Live Firestore round-trip smoke test remains the verification residual.

---

# Completed (on main)

- Application shell: Card, Dashboard, Header, Sidebar, Layout, AppContext
- Sidebar navigation switches modules (mobile drawer present)
- Processor event bus operational
- `src/lib/firebase.js` with locked PATHS and confirmed config fallback:
  - `tracker/currentCycle/vault`
  - `tracker/currentCycle/investors`
  - `sales`
  - `drop_requests`
- InventoryService: Firestore CRUD + search/filter + atomic `decrementStock`
- Vault UI: `InventoryView.jsx` — list, search, low-stock filter, add/edit, mobile delete modal, sell/decrement, processor sync
- App routes inventory module to InventoryView; engine in Inventory.jsx
- Theme Cyber-Obsidian
- firebase dependency in package.json
- Offline banner only when config truly missing

---

# PENDING (verification)

1. Live round-trip smoke test (add → reload → edit → delete → decrementStock) against stoked4t
2. Auth + Firestore rules before any public exposure
3. Sales module consuming the atomic decrement path

---

# Architecture constraints (law)

- Cloud Firestore only. Zero Realtime Database. Zero databaseURL.
- PATHS locked in `src/lib/firebase.js`
- React 19 + Vite SPA
- Processor remains state coordination layer
- Theme: #0A0A0C / #00FF66 / #d4af37

---

# Next residual

1. Run live smoke test (default config enables it)
2. Sales workflow using `decrementStock` transaction
3. Auth + rules
