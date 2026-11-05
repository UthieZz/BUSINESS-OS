# PENDING — Sprint Zero residuals

_Updated: 2026-11-05_

## DONE on main (remote)

- `src/lib/firebase.js` + locked PATHS (Cloud Firestore only)
- InventoryService: full CRUD, search/filter, low-stock, atomic `decrementStock` transaction
- InventoryView: list / search / low-stock filter / add / edit / delete (mobile dialog)
- Inventory engine always mounted (Dashboard totals available immediately)
- Mobile drawer Sidebar + Header hamburger (≤768px)
- Cyber-Obsidian theme consistent (#0A0A0C / #00FF66 / #d4af37)
- Delete uses in-component mobile-friendly dialog (no native `confirm()`)

## PENDING (requires local runtime + Firebase env)

1. **Firebase env + npm install**
   - Set `VITE_FIREBASE_*`
   - `npm install && npm run dev`
   - Success: no Firebase init error, vault round-trip green

2. **Live Vault smoke test**
   - Add → appears
   - Edit weight/value → persists
   - Delete → removed (via dialog)
   - `decrementStock` succeeds (or throws on insufficient)

## Next residual
- Auth + Firestore rules for vault (before any public deploy)
- Sales ledger on verified inventory foundation
