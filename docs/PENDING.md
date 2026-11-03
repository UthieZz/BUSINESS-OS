# PENDING — Sprint Zero residuals (blocked on local machine)

_Updated: 2026-11-03_

Local machine currently inaccessible. Do **not** block automation or agent runs on these.

## PENDING (requires local runtime)

1. **Firebase env + npm install**
   - Set `VITE_FIREBASE_*` (or fill `src/lib/firebase.js`)
   - `npm install` (firebase already in package.json)
   - Success signal: `npm run dev` boots with no Firebase init error

2. **Live Vault smoke test**
   - Add item → appears in list
   - Edit weight → persists
   - Delete → removed
   - `decrementStock` transaction no throw

3. **Create + Update UI** (code can be written remotely; live proof is local)
   - Add form for vault items
   - Edit form / inline update

## DONE on main (remote)

- `src/lib/firebase.js` + locked PATHS
- InventoryService Firestore CRUD + atomic `decrementStock`
- Search / low-stock filter / delete in App
- Sidebar nav wiring
- Cyber-Obsidian theme pass
- Commit: c0da4af (Sprint Zero vault path)

## Automation instruction

When local machine is inaccessible:
- Prefer code-only residuals (Add/Edit UI, cleanup, docs)
- Do not wait for npm/dev/Firestore proof
- Leave PENDING items listed here until user confirms live green
