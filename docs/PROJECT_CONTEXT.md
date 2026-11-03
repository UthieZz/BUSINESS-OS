# Business OS - Project Context

_Last Updated: 3 November 2026_

---

# Project Status

## Current Sprint

**Sprint Zero – Foundation & Live Vault path**

Progress:

```
██████████████████░░ 90%
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
- App: vault list, search, low-stock filter, delete, theme Cyber-Obsidian
- firebase dependency in package.json

---

# PENDING (local-only)

1. VITE_FIREBASE_* / real config + `npm install`
2. Live round-trip smoke test
3. Create + Update UI (code remote-ok; proof local)

---

# Architecture constraints (law)

- Cloud Firestore only. Zero Realtime Database. Zero databaseURL.
- PATHS locked in `src/lib/firebase.js`
- React 19 + Vite SPA
- Processor remains state coordination layer
- Theme: #0A0A0C / #00FF66 / #d4af37

---

# Next residual (remote-safe)

1. Implement Add + Edit UI against existing InventoryService
2. Remove any remaining hard-coded inventory paths if found
3. When machine returns: env + smoke test → close Sprint Zero
