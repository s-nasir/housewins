---
description: Review AI-generated code from a completed issue (always fresh context)
---

## Pre-conditions
- The issue implementation is complete (tests passing, issue in `done/`)
- You are in a FRESH context window (never review in the same session that wrote the code)
- You have the issue file, the diff/changed files, and the test files ready to read

## Steps

1. Read the issue acceptance criteria first — know what was supposed to be built.

2. Read the TEST FILES before the implementation files:
   - Are the tests testing the RIGHT things (acceptance criteria), or just confirming the implementation exists?
   - Are edge cases covered? (e.g., bet at min wager, bet at max wager, exactly zero balance)
   - For game engines: is the house edge formula being verified?

3. Read the implementation files:
   - Does the public interface match what was planned in `api-contract.md` or `game-engine-specs.md`?
   - Are there any obvious logic errors in the math?
   - Is the module deep (small interface, complex internals hidden) or shallow (many tiny exports)?
   - Are there any hardcoded values that should be constants?

4. Check for regressions:
   - Did this change touch any shared modules (RNG, counter update, currency store)?
   - Do the existing tests still pass?

5. Output a review report:
   - APPROVED / CHANGES REQUESTED
   - For each concern: file, line range, description, suggested fix
   - If APPROVED: confirm the PR can be merged to `main`

## Rules
- Do NOT rewrite the code during review. Flag issues, let a new implementation session fix them.
- If you find a game math error (wrong house edge, wrong payout), this is a BLOCKER — mark CHANGES REQUESTED.
- Visual QA (does it look right) is done by the human in the browser, not this workflow.
