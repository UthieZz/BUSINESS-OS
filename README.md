# Business OS — StokeD⁴T

React 19 + Vite SPA for operating Stoked4T. Cloud Firestore only. Paths locked in `src/lib/firebase.js`.

## Stack
- React 19 + Vite
- Firebase JS SDK 11 (Firestore)
- Processor event bus for state coordination
- Cyber-Obsidian theme (`#0A0A0C`, neon `#00FF66`, gold `#d4af37`)

## Run locally
```bash
npm install
cp .env.example .env   # fill VITE_FIREBASE_* from Firebase console
npm run dev
```

## Structure
- `src/lib/firebase.js` — config + locked PATHS
- `src/services/InventoryService.js` — vault CRUD + atomic `decrementStock`
- `src/modules/Inventory/Inventory.jsx` — no-render engine (seeds processor)
- `src/modules/Inventory/InventoryView.jsx` — sole vault UI (search/filter/edit/delete/sell)
- `src/processor/` — event bus
- `src/components/` — Header, Sidebar (mobile drawer), Layout, Dashboard

## Status
Sprint Zero close-out: live vault path implemented; local build green. Live smoke, Auth + rules, and Sales still residual.

See `docs/BUSINESS_OS_HANDOFF.md` and `docs/PENDING.md`.
