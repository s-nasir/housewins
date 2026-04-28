---
description: Start work on a new kanban issue (one vertical slice)
---

## Pre-conditions
- The issue file exists in `kanban/backlog/` or `kanban/sprint-N/`
- All blocking issues are marked DONE
- You have cleared the context window since the last issue

## Steps

1. Read the issue file to understand the acceptance criteria, affected modules, and AFK/HITL label.

2. Explore only the relevant parts of the codebase (use sub-agent search, not full read). Identify:
   - Which files will be created or modified
   - The public interface of any module being built
   - Any existing tests that may be affected

3. Write the test(s) FIRST (TDD — red phase):
   - Unit test for any game engine function
   - Component test for any UI state change
   - Place tests in `src/__tests__/` (frontend) or `workers/src/__tests__/` (backend)
   - Run tests and confirm they FAIL before implementation

4. Implement the minimal code to make tests pass (green phase):
   - Stay within the scope of the issue — do not expand
   - Follow deep module pattern: public interface is small, internals are hidden
   - Do not add comments unless the issue explicitly requires them

5. Refactor if needed. Re-run tests. Confirm all pass.

6. Run the full test suite to check for regressions:
   ```
   pnpm test
   ```

7. Output a completion summary:
   - Files created/modified
   - Test results
   - Any decisions made (add to ADR if significant)
   - Any new issues discovered (list them — do NOT implement them now)

8. Move the issue file from `backlog/` to `done/`. Do NOT delete it yet — wait for human merge approval.

## Rules
- ONE issue per context window. Do not start the next issue in this session.
- If you discover the issue is blocked by something not in the backlog, STOP and report it.
- If the issue requires a visual decision (layout, color, animation feel), STOP and mark it HITL.
- Never modify `main` branch directly. All work goes on a feature branch named `issue/<issue-id>`.
