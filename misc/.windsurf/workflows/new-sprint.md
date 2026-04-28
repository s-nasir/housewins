---
description: Plan and set up a new sprint from the PRD backlog
---

## Steps

1. Read `docs/PRD.md` — find the next unstarted sprint section.

2. Create the sprint folder: `kanban/sprint-N/`

3. For each item in that sprint, create one issue file: `kanban/sprint-N/issue-NNN-<slug>.md`

   Each issue file must contain:
   ```markdown
   # Issue NNN: <Title>
   **Sprint:** N
   **Type:** AFK | HITL
   **Blocking:** issue-NNN (if any)
   **Blocked by:** issue-NNN (if any)
   **Currency affected:** Chips | Tokens | Tickets | None
   **Files to create/modify:** (list)

   ## Acceptance Criteria
   - [ ] ...specific, testable conditions...

   ## Out of Scope
   - ...what NOT to do in this issue...

   ## Notes
   (any implementation hints or references to docs)
   ```

4. Identify which issues have no blocking dependencies — these can be worked on in parallel (AFK).

5. Output a sprint plan summary:
   - Issues list with type (AFK/HITL) and blocking graph
   - Recommended starting order
   - Any issues that need human design decisions before they can start (HITL)

## Rules
- Each issue must be a vertical slice: touches all layers it needs (Worker + React + test)
- Maximum issue scope: one component + one Worker endpoint + its tests
- If an issue would take more than ~200 lines of new code, split it into two issues
- Never put more than 6 issues in a single sprint
