# Business OS - Project Context

_Last Updated: 4 November 2026_

---

# Project Status

## Current Sprint

**Sprint Zero – Foundation & Live Vault path**

Progress:

```
████████████████████ 95%
```

Local machine inaccessible → live Firestore proof **PENDING**. See `docs/PENDING.md`.

---

# Completed (on main)

- Application shell: Card, Dashboard, Header, Sidebar, Layout, AppContext
- Sidebar navigation switches modules
- Processor event bus operational
- `src/lib/firebase.js` with locked PATHS:
  - `tracker/currentCycle/vault`
  - `tracker/currentCycle/investors`
  - `sales`
  - `drop_requests`
- InventoryService: Firestore CRUD + search/filter + atomic `decrementStock`
- Vault UI consolidated to single surface: `InventoryView.jsx` (add/edit/delete/search/low-stock filter)
- App routes inventory module to InventoryView; engine in Inventory.jsx
- Theme Cyber-Obsidian
- firebase dependency in package.json

---

# PENDING (local-only)

1. VITE_FIREBASE_* / real config + `npm install`
2. Live round-trip smoke test
3. Confirm mobile drawer if needed

---

# Architecture constraints (law)

- Cloud Firestore only. Zero Realtime Database. Zero databaseURL.
- PATHS locked in `src/lib/firebase.js`
- React 19 + Vite SPA
- Processor remains state coordination layer
- Theme: #0A0A0C / #00FF66 / #d4af37

---

# Next residual (remote-safe)

1. Mobile sidebar drawer/collapse
2. Replace confirm() with mobile-friendly dialog
3. When machine returns: env + smoke test → close Sprint Zero
