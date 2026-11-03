# PENDING — Sprint Zero residuals

_Updated: 2026-11-03_

Local machine currently inaccessible. Do **not** block automation on these.

## PENDING (requires local runtime)

1. **Firebase env + npm install**
   - Set `VITE_FIREBASE_*` (or fill `src/lib/firebase.js`)
   - `npm install`
   - Success: `npm run dev` boots with no Firebase init error

2. **Live Vault smoke test**
   - Add item → appears
   - Edit weight/value → persists
   - Delete → removed
   - `decrementStock` no throw

## DONE on main (remote)

- `src/lib/firebase.js` + locked PATHS
- InventoryService Firestore CRUD + atomic `decrementStock`
- Search / low-stock filter / delete
- **Add + Edit form UI** (App.jsx + InventoryView)
- Sidebar nav + Cyber-Obsidian theme

## Automation instruction

When local machine is inaccessible:
- Prefer code-only residuals
- Do not wait for npm/dev/Firestore proof
- Leave PENDING items listed until user confirms live green
