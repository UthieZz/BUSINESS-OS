# BUSINESS OS — STOKED4T IMPLEMENTATION HANDOFF

**Document:** Engineering handoff and completion specification  
**Prepared:** 3 November 2026  
**Repository:** https://github.com/UthieZz/Business-Os  
**GitHub repository name:** `UthieZz/BUSINESS-OS`  
**Default branch observed:** `main`  
**Application:** Business OS  
**Initial operating business/workspace:** Stoked4T  
**Primary objective:** Complete the existing Business OS application so it reliably operates Stoked4T through a browser on desktop and mobile.

---

## 1. Executive direction

The authoritative codebase for this task is:

`https://github.com/UthieZz/Business-Os`

Do not use `UthieZz/Stoked4Toked` as the project repository. That was an incorrect repository reference in an earlier handoff.

Keep these concepts distinct:

- **Business OS** is the software project and application being developed in this repository.
- **Stoked4T** is the business whose operations the application must support in this delivery.
- The immediate objective is to make the existing Business OS application a dependable web-based operating system for Stoked4T. Do not assume the owner is asking for a commercial multi-tenant SaaS platform, tenant billing, or a general-purpose ERP. Those are separate product decisions.

The task is not to create a new application from scratch. Inspect and extend the existing implementation, preserve working components and domain logic, close known defects, complete the required business workflows, and restore a verified browser-accessible deployment.

A dashboard that merely looks complete is not a completed business system. The application must accurately record and reconcile inventory, sales, money received, money owed, costs, profit, customer/order activity and operational events.

## 2. Repository baseline and evidence boundary

The following baseline was observed from the public `main` branch on 3 November 2026. Treat it as a starting snapshot, not proof that the local working tree or deployed application is identical.

### 2.1 Observed technology and structure

- React 19 and React DOM.
- Vite 8 development/build tooling.
- JavaScript/JSX (the inspected application files are not yet TypeScript).
- Firebase JS SDK 11.
- ESLint configuration.
- `npm` scripts include `dev`, `build`, `lint`, and `preview`.
- Main application entry: `src/main.jsx`.
- App composition: `src/app/App.jsx`.
- Existing UI components: `Card`, `Dashboard`, `Header`, `Layout`, `Sidebar`.
- Application context: `src/context/AppContext.jsx`.
- Processor/event coordination: `src/processor/Processor.jsx` and `ProcessorService.js`.
- Inventory engine/UI: `src/modules/Inventory/`.
- Firestore access: `src/lib/firebase.js`.
- Inventory data service: `src/services/InventoryService.js`.
- Additional feature concept: `src/modules/StrainBrain.jsx`.

The repository contains more than the default Vite starter screen. It has an application shell, navigation, dashboard, processor/event layer, inventory UI and Firestore inventory service. Preserve and evaluate those components before considering architectural replacement.

### 2.2 Existing implementation evidence

The inspected code and repository notes indicate that the current `main` branch already includes:

- A React application shell and module navigation.
- A Cyber-Obsidian visual direction.
- A processor/event coordination layer.
- Firebase initialization guarded against an empty environment configuration.
- Firestore path constants in `src/lib/firebase.js`.
- An InventoryService with Firestore CRUD operations, search/filtering and an atomic `decrementStock` transaction.
- Inventory add/edit/list/delete UI in `src/app/App.jsx`.
- An additional `InventoryView.jsx` implementation that overlaps with the inventory UI in `App.jsx`.
- A dashboard component that consumes application/processor state.

These are implementation claims based on source inspection. They are not equivalent to live operational verification.

### 2.3 Current known limitations and pending proof

The repository's `docs/AUDIT_2026-11-03.md`, `docs/PENDING.md` and `docs/PROJECT_CONTEXT.md` report the following:

**Reported as implemented on `main`:**
- Firestore initialization guard and path handling.
- Inventory CRUD service.
- Inventory list/search/low-stock filter.
- Add/edit interface.
- Processor listener cleanup and asynchronous inventory totals correction.
- Dashboard state subscription improvements.

**Still requiring local/runtime verification:**
- Configure the real `VITE_FIREBASE_*` environment values.
- Run `npm install` and regenerate/validate the lockfile if necessary.
- Start the application locally.
- Perform a live Firestore round-trip smoke test: add an item, reload/read it, edit it, verify persistence, delete it, and verify the stock-decrement transaction.
- Confirm the actual Firestore project, database and security rules.
- Confirm the deployed web application and its production behavior.

**Known architectural/functional residuals from the audit:**
- Two overlapping inventory UI surfaces exist (`App.jsx` and `InventoryView.jsx`). Choose one authoritative surface and remove or route the other deliberately.
- Authentication is not present in the inspected implementation. A public deployment must not rely on hidden UI controls for protection.
- Firestore rules are not present in the repository snapshot inspected. Do not expose private business data until access rules and authentication are appropriately implemented and tested.
- Sales, investors/consignment and drop-request paths may be declared, but full operational services/workflows were not evidenced in the inspected files.
- The sidebar is not yet a polished mobile drawer/collapsible navigation.
- There are no evidenced automated unit/integration/end-to-end tests or CI workflow in the inspected tree.
- `confirm()` is used for deletion and should be replaced with a mobile-friendly confirmation pattern.
- StrainBrain currently appears to be a limited/hard-coded feature concept; do not treat it as a completed AI capability.
- Full-collection reads and client-side filtering may be acceptable for a small initial dataset but require review as the dataset grows.

Do not convert any pending item into a completed claim without running the relevant test and recording its result.

## 3. Product outcome

Deliver a usable, responsive web application that supports Stoked4T's actual operating cycle:

**Acquire stock → record stock → allocate/hold/consign → sell or fulfil → record payment → reconcile → recover capital → reinvest.**

The system must preserve the distinctions between:

- Physical stock on hand.
- Available stock.
- Reserved/held stock.
- Consigned stock.
- Sold stock.
- Returned or written-off stock.
- Revenue earned.
- Cash actually received.
- Customer balances/amounts outstanding.
- Acquisition costs and other business costs.
- Gross margin and realized profit.
- Expected future income versus money already received.

Never show expected payment as available cash. Never calculate profit by treating all sales revenue as profit.

## 4. Required discovery before implementation

Before substantial edits, the agent must:

1. Read `README.md`, all `docs/` files, repository instructions and relevant source.
2. Inspect current branch, commit history, working-tree status and complete file tree.
3. Inspect all components, module registrations, event listeners and state ownership.
4. Trace the inventory UI from user action through validation, service, Firestore path, persistence and refreshed UI.
5. Inspect Firebase configuration, environment variable names, authentication, Firestore rules, indexes, Storage rules and any backend functions.
6. Establish which Firebase project and Firestore database are actually intended. Do not infer this from an old URL, project nickname or an environment variable alone.
7. Inspect the actual Firestore schema and records only with authorized access. Do not create new collection roots or duplicate existing data.
8. Identify the source of truth for each feature and any older HTML/export/archive supplied to the agent. Compare useful functionality before discarding it.
9. Run baseline install/build/lint/test checks when a local runtime is available. If it is not available, clearly state that limitation and continue with safe code-level work.
10. Produce a feature map with the statuses `WORKING`, `PARTIAL`, `BROKEN`, `MISSING` or `UNKNOWN`, each supported by evidence.
11. Create a recoverable branch/checkpoint before broad changes.

The repository notes specify Cloud Firestore and prohibit Realtime Database. Treat that as a project architecture constraint unless the owner explicitly changes it. Verify the actual Firebase configuration and Firestore database. Do not introduce Realtime Database, `databaseURL`, new production roots or a second production database.

## 5. Architecture and data governance

### 5.1 Preserve the current architecture unless evidence supports change

The current implementation is React + Vite with a Firestore service layer and a processor/event coordination layer. Preserve this foundation unless the agent demonstrates a concrete technical reason to change it.

Do not:
- Replace the project with a generic dashboard template.
- Rewrite all components before understanding their responsibilities.
- bypass `InventoryService` with scattered direct Firestore calls.
- create a second inventory implementation.
- add a new state-management framework without a demonstrated need.
- add multi-tenancy, subscription billing or SaaS administration without an explicit product decision.

Prefer clear domain services, reusable UI components, explicit data contracts, predictable state ownership and testable business rules.

### 5.2 Firestore path constraints

The current source defines these path segments in `src/lib/firebase.js`:

- `PATHS.VAULT = ["tracker", "currentCycle", "vault"]`
- `PATHS.INVESTORS = ["tracker", "currentCycle", "investors"]`
- `PATHS.SALES = ["sales"]`
- `PATHS.DROP_REQUESTS = ["drop_requests"]`

These are observed code constants, not proof that every collection exists in the live database. Preserve the path-segment convention and verify schema/collection use before changing it. Do not invent additional roots or silently migrate documents.

### 5.3 Financial and stock integrity

- Use integer minor currency units (cents) or a controlled decimal strategy for money.
- Keep currency explicit and display South African Rand (`ZAR`, `R`) consistently.
- Do not use uncontrolled JavaScript floating-point arithmetic for financial totals.
- Store unit acquisition cost separately from sale price.
- Distinguish quantity from weight and value; document units.
- Prevent negative stock and invalid state transitions.
- Use Firestore transactions or trusted backend operations for related stock/financial mutations.
- Protect against duplicate submissions and duplicate sale records.
- Preserve original transactions. Correct mistakes through traceable reversals/adjustments rather than silently rewriting history.
- Define the effects of partial payments, refunds, returns, cancellations and stock corrections.
- Record actor and server timestamp for important changes.
- Reconcile dashboard totals to underlying records.

Any existing field such as `value` must be understood before it is reinterpreted as cost, retail value, revenue or profit. Do not silently change the meaning of historical fields.

## 6. Required operational modules

Complete these workflows based on verified business rules and existing data. Where rules are unknown, inspect available evidence and document a proposal instead of inventing policy.

### 6.1 Inventory / Vault — first priority

- List, search and inspect inventory.
- Add and edit items with validated fields.
- Record item identity, quantity/weight and units, acquisition cost, selling price and relevant metadata where supported by the real business model.
- Display stock totals and low-stock alerts from authoritative records.
- Track available, reserved, consigned and otherwise unavailable quantities if the underlying business process requires them.
- Support traceable stock adjustments and movement history.
- Prevent negative stock and invalid transitions.
- Avoid destructive deletion of records that are referenced by sales or movements; prefer archive/adjustment semantics when appropriate.
- Make loading, empty, offline, success and error states explicit.

Do not expand the current three-field inventory form into a large speculative schema. Establish the real Stoked4T inventory fields and historical data first.

### 6.2 Sales and payments

- Capture a sale with line items, quantities, unit prices, discounts only if supported, customer/reference details and timestamps.
- Validate available stock before confirming.
- Update stock and sale records consistently.
- Record payment status: paid, partially paid or unpaid.
- Record actual payments and payment dates independently of sale creation.
- Show gross sales, costs, realized profit, cash received and outstanding balances separately.
- Prevent duplicate sale submission.
- Provide transaction history and traceable corrections/refunds.

### 6.3 Consignment / investors

- Inspect the meaning of the existing `investors` path and any historical Stoked4T agreements before naming or implementing the module.
- Distinguish capital investment/loan arrangements from consignment stock arrangements. They are not interchangeable.
- If consignment is part of the verified operating model, track recipient/consignor, agreed terms, allocated stock, sold/returned/remaining quantities and settlements.
- If investor loans or profit-share arrangements are part of the model, track principal, agreed return, due date, repayments and outstanding liability separately.
- Do not invent contractual terms, calculate a return without an agreed formula, or conflate an investment liability with sales revenue.
- Keep all balances reconcilable to source transactions.

### 6.4 Drop requests / fulfilment

- Inspect the current business meaning of `drop_requests`.
- Capture request/customer reference, requested items, quantities, status and timestamps.
- Implement only the lifecycle confirmed by existing evidence/owner decisions.
- Validate stock and reservation rules before fulfilment.
- Prevent fulfilment beyond available or reserved stock.
- Record cancellation and status changes with actor and timestamp.

### 6.5 Tracker / operations

- Preserve the purpose of the existing `tracker/currentCycle` hierarchy.
- Record operational events without duplicating authoritative sales or stock ledgers.
- Make events attributable and timestamped.
- Provide useful history and filters where justified.

### 6.6 Dashboard and reporting

- Show verified inventory totals, sales, payments received, outstanding amounts and relevant operational alerts.
- Clearly label time ranges and calculation definitions.
- Reconcile aggregates against source records.
- Do not show hard-coded demo values or misleading metrics.
- Distinguish live data, offline state, empty state and unavailable data.

### 6.7 Admin, access and audit

- Add authentication appropriate to the actual owner/operator model.
- Enforce permissions in Firestore rules and/or trusted backend code, not only in the UI.
- Deny access by default and grant minimum necessary access.
- Record important mutations with actor, timestamp, entity and action.
- Protect audit data from ordinary users and make it append-only where practical.
- Do not expose customer or business records publicly.

### 6.8 AI / StrainBrain

Only complete AI capabilities supported by verified existing code or an explicit owner-approved product requirement. AI output is advisory, not authoritative business data.

- Keep provider secrets server-side or in approved managed secret facilities.
- Validate all AI-generated actions.
- Enforce permissions outside the model.
- Require explicit authorized confirmation before financial, inventory-destructive or customer-facing actions.
- Log actions safely without storing secrets.
- Never let an AI assistant silently create sales, alter balances or fabricate stock.

## 7. Web application and user experience

The end product must work as a normal browser application, not only through a local Vite development server.

Requirements:
- Responsive desktop and mobile layouts.
- Clear navigation and a coherent application shell.
- Mobile-friendly navigation (drawer/collapse or equivalent).
- Direct route navigation and refresh support if multiple routes are introduced.
- Accessible forms, labels, keyboard behavior and validation.
- Clear loading, empty, offline, success and error states.
- Confirmation for consequential actions using a mobile-friendly UI.
- No dead buttons or placeholder modules presented as functional.
- Consistent date/time handling and ZAR formatting.
- No fake/demo records in production.
- No silent failure when a read/write fails.

Keep the existing Cyber-Obsidian visual direction unless a deliberate redesign is justified. Visual polish is secondary to operational correctness.

## 8. Security, deployment and environment

- Verify Firebase project ID, web app registration, Firestore database and database location.
- Verify Authentication providers and user/role model.
- Inspect Firestore rules, Storage rules, indexes and Cloud Functions.
- Do not place service-account credentials, private keys or AI provider secrets in source control or browser bundles.
- Firebase client configuration is not authorization; rules and trusted code must enforce access.
- Keep development and production environments separate.
- Never delete, reseed, bulk-overwrite or migrate production data without explicit approval and a tested recovery plan.
- Do not switch Firebase projects or database targets as a convenience.
- Do not change database location in place. If migration is necessary, prepare backup/export, import, validation, downtime and rollback plans and wait for approval.
- Deploy to a preview/staging target first where available.
- Test the deployed site on desktop and mobile.
- Verify authentication, reads, writes, permissions and critical workflows against the intended project.
- Deploy production only after the target is confirmed and acceptance tests pass.
- Record exact URL, Firebase project, Hosting site, commit SHA and deployment evidence.
- If credentials or permissions are unavailable, complete safe work and document exact blockers. Never claim deployment succeeded without proof.

## 9. Execution sequence

### Phase 0 — Discovery and preservation
Read project docs and source, inspect the tree/history, establish current state, baseline checks and source-of-truth map. Create a safe branch/checkpoint.

### Phase 1 — Close Sprint Zero
Resolve the duplicate inventory UI, confirm the inventory service contract, improve validation/error handling, add tests for inventory calculations and stock invariants, and run the local Firebase configuration and live smoke test when authorized credentials are available.

Do not build Sales on top of an unverified inventory foundation.

### Phase 2 — Secure web foundation
Implement authentication and tested access rules, confirm Firebase project/database, separate environments, and ensure the web app can run and build cleanly.

### Phase 3 — Complete inventory
Complete the authoritative inventory workflow, stock movements, adjustments, reservation logic if required, auditability and regression tests.

### Phase 4 — Sales and payment ledger
Implement sale capture, payment records, outstanding balances, stock integration and financial reconciliation.

### Phase 5 — Consignment/investors and drop requests
Resolve the actual domain meaning of the existing paths and implement the approved workflows with quantity and money reconciliation.

### Phase 6 — Dashboard, tracker and AI
Make dashboard totals authoritative, complete the tracker/admin surfaces and preserve only verified AI capabilities.

### Phase 7 — Verification and deployment
Run unit, integration, security and browser tests; produce a preview deployment; perform acceptance testing; deploy production only when approved and verified.

### Phase 8 — Handover
Document architecture, data model, environment setup, tests, deployment, known limitations, recovery and next priorities.

The agent must continue beyond planning. It should work incrementally, report evidence after major phases and avoid stopping after producing a roadmap.

## 10. Acceptance criteria

### Web application
- [ ] Production build succeeds.
- [ ] App loads at the verified public URL.
- [ ] Desktop and mobile layouts are usable.
- [ ] Navigation and direct refresh work.
- [ ] No misleading placeholders or dead controls.
- [ ] Loading, empty, offline, success and error states work.

### Data and security
- [ ] Correct Firebase project and Firestore database are verified.
- [ ] Database location is documented.
- [ ] Authentication works.
- [ ] Firestore/Storage rules are reviewed and tested.
- [ ] Unauthorized users cannot read or mutate protected records.
- [ ] No secrets are exposed in source or browser bundles.
- [ ] Production data has not been destructively changed.

### Inventory and operations
- [ ] Inventory add/edit/read/archive behavior persists.
- [ ] Inventory survives reload and a new session.
- [ ] Stock changes are traceable.
- [ ] Negative stock and invalid transitions are prevented.
- [ ] Sales and payments reconcile to stock and balances.
- [ ] Consignment/investor records reflect the correct legal/business meaning.
- [ ] Drop requests follow the approved lifecycle.
- [ ] Dashboard totals reconcile to source records.

### Financial correctness
- [ ] ZAR is handled consistently.
- [ ] Revenue, costs, profit, cash received and amounts outstanding are distinct.
- [ ] Partial payments, returns, refunds and cancellations have defined behavior.
- [ ] Financial calculations have automated tests.
- [ ] Duplicate submissions are prevented.

### Delivery
- [ ] Exact build/lint/test commands and results are recorded.
- [ ] Preview deployment is tested.
- [ ] Production deployment is verified or the blocker is explicit.
- [ ] Commit SHA, branch, URLs and configuration are documented.
- [ ] Recovery/rollback procedure is supplied.

## 11. Change authority and approval gates

The agent may inspect, plan, implement, refactor and test reversible code changes within this scope. It should make ordinary engineering decisions independently and document them.

Stop and obtain explicit owner approval before:
- Deleting, overwriting, reseeding or bulk-transforming production data.
- Switching Firebase project, Firestore database or production Hosting target.
- Migrating a database or changing its location.
- Performing irreversible schema changes without a tested backup/rollback plan.
- Changing account ownership, rotating credentials or changing real-user access.
- Publishing private data or changing public access boundaries.
- Enabling paid services or incurring material costs.
- Sending customer communications or executing real financial transactions.
- Deploying to production when the target or impact is unclear.

For an approval request, state the evidence, proposed action, impact, alternatives, cost, backup/rollback plan and exact decision required. Continue independent safe work while waiting.

## 12. Required final report

The final report must include:

1. Starting state and repository commit.
2. What was already working, with evidence.
3. What was broken, partial, missing or unknown.
4. Changes made and important files/modules.
5. Verified architecture and data model.
6. Firebase project/database/location and security status.
7. Tests run, exact commands and exact outcomes.
8. Preview/production URL and deployment evidence, or exact blocker.
9. Branch and commit SHA.
10. Remaining defects, risks and assumptions.
11. Backup and rollback instructions.
12. Next priorities.

**Definition of done:** Business OS is a reliable, secure, tested, browser-accessible application operating Stoked4T with persistent and reconciled business data. A polished dashboard, a successful local preview or a passing build alone does not satisfy completion.