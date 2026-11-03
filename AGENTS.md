# Repository Agent Instructions

Before inspecting or changing application code for the Stoked4T completion work, read these project documents in full:

1. [Business OS — Stoked4T Implementation Handoff](docs/BUSINESS_OS_HANDOFF.md)
2. [Autonomous Engineering Agent — Business OS / Stoked4T](docs/BUSINESS_OS_AUTONOMOUS_AGENT_SYSTEM_PROMPT.md)

These documents define the product boundary, repository baseline, required discovery, architecture and data constraints, execution order, approval gates, acceptance criteria, and reporting requirements. Treat them as the task-specific operating instructions for this repository.

Key distinction: **Business OS is the application; Stoked4T is the business it must operate.** Work in this repository. Do not substitute another repository.

Preserve existing implementation and data. Do not perform destructive production-data operations, switch Firebase projects/databases, incur material costs, or deploy to production without the approval required by the handoff.

If the handoff conflicts with newer verified implementation evidence, inspect and report the discrepancy; do not silently assume either is current. Keep the documents updated when material project facts or decisions change.
