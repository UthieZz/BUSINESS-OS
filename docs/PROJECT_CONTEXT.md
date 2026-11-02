# Business OS - Project Context

_Last Updated: 2 November 2026_

---

# Project Status

## Current Sprint

**Sprint Zero – Foundation & Application Shell**

Progress:

```
██████████████████░░ 90%
```

---

# Completed

## Repository

- Git repository: UthieZz/BUSINESS-OS
- Application shell committed
- Processor event bus operational (in-memory)

## Application Shell

- Card, Dashboard, Header, Sidebar, Layout, AppContext
- Shared module navigation state (`activeModule`)
- **Sidebar navigation now switches views** (Dashboard / Inventory / placeholders)

## Processor

Operational. Modules: Inventory (engine), StrainBrain.

## Inventory

- InventoryService (in-memory) operational
- Live totals via processor state
- **InventoryView**: list items, add test asset, delete item
- Hard-coded duplicate `src/modules/Inventory.jsx` removed
- Numbers come only from InventoryService → processor

---

# Architecture

```
src/
  app/
  components/
  context/
  modules/
    Inventory/
      Inventory.jsx      # engine: registers state with processor
      InventoryView.jsx  # UI: list / add / delete
  processor/
  services/
```

---

# Explicit gaps (do not invent)

- **No Firebase / Firestore yet.** No `src/lib/firebase.js`. No live Vault path.
- No HANDOFF.md / SYSTEM_PROMPT.md in repo (only this PROJECT_CONTEXT).
- Theme partially touched (InventoryView uses #0A0A0C / #00FF66 / #d4af37); shell still generic dark.
- No search/filter UI yet.
- No atomic stock decrement transaction (requires Firestore).

---

# Next residual options

1. Search/filter on InventoryView (in-memory).
2. Add Firebase package + `src/lib/firebase.js` once credentials confirmed.
3. Persist vault to `tracker/currentCycle/vault`.
4. Full Cyber-Obsidian theme pass on Layout/Header/Sidebar.
5. Atomic decrement path after Firestore is live.

---

# Git checkpoint

## Checkpoint 3 (2 Nov 2026)

- Wired Sidebar → App view switch
- Inventory delete + list from service only
- Removed hard-coded Inventory.jsx duplicate
