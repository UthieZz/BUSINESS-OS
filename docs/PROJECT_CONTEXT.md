# Business OS - Project Context

_Last Updated: 6 November 2026_

---

# Project Status

## Current Sprint

**Sprint Zero – Foundation & Live Vault path**

Progress:

```
████████████████████ 100%
```

Vault UI residual closed. Live Firestore round-trip still requires local `VITE_FIREBASE_*` + smoke test.

---

# Completed (on main)

- Application shell: Card, Dashboard, Header, Sidebar, Layout, AppContext
- Sidebar navigation switches modules (mobile drawer present)
- Processor event bus operational
- `src/lib/firebase.js` with locked PATHS:
  - `tracker/currentCycle/vault`
  - `tracker/currentCycle/investors`
  - `sales`
  - `drop_requests`
- InventoryService: Firestore CRUD + search/filter + atomic `decrementStock`
- Vault UI: `InventoryView.jsx` — list, search, low-stock filter, add/edit modal, delete confirmation, processor sync
- App routes inventory module to InventoryView; engine in Inventory.jsx
- Theme Cyber-Obsidian
- firebase dependency in package.json

---

# PENDING (local-only)

1. VITE_FIREBASE_* / real config + `npm install`
2. Live round-trip smoke test (add → reload → edit → delete → decrementStock)
3. Auth + Firestore rules before any public exposure

---

# Architecture constraints (law)

- Cloud Firestore only. Zero Realtime Database. Zero databaseURL.
- PATHS locked in `src/lib/firebase.js`
- React 19 + Vite SPA
- Processor remains state coordination layer
- Theme: #0A0A0C / #00FF66 / #d4af37

---

# Next residual

1. Configure env and close live smoke test
2. Sales workflow using `decrementStock` transaction
3. Auth + rules
