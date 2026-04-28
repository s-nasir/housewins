# Issue 012: Roulette Page Integration — Bets → Worker → Store
**Sprint:** 2
**Type:** HITL (full end-to-end visual QA)
**Blocking:** none
**Blocked by:** issue-008, issue-009, issue-010, issue-011
**Currency affected:** Chips (real spend on spin, real credit on payout)
**Files to create/modify:**
- `src/pages/RoulettePage.tsx` (full wiring — replaces scaffold from issue-010)
- `src/lib/api/rouletteClient.ts` (typed fetch wrapper for `/api/roulette/spin`)
- `src/components/roulette/RouletteSessionStats.tsx`
- `src/pages/RoulettePage.test.tsx`
- `src/lib/api/rouletteClient.test.ts`

## Acceptance Criteria
- [ ] On clicking SPIN: validates `bets.length > 0` and `currencyStore.chips >= totalWagered`
- [ ] Calls `useCurrencyStore.spendChips(totalWagered)` BEFORE the API call (optimistic deduct); if Worker returns an error, refunds via `addChips(totalWagered)` and surfaces a toast
- [ ] Calls `POST /api/roulette/spin` via `rouletteClient` with the bets payload + a fresh `sessionId` from `useSessionStore`
- [ ] Awaits Worker response, then calls `wheelRef.current.spinTo(outcome.result)` and waits for animation to complete
- [ ] After animation: credits `useCurrencyStore.addChips(totalPayout)` (note: `totalPayout` includes returned stake on winning bets — see `docs/api-contract.md`)
- [ ] Updates `useSessionStore` with `sessionWon += totalPayout` and `sessionLost += totalWagered` then `bets` state cleared
- [ ] Winning grid cells pulse gold for 1.5s; losing cells fade chips out
- [ ] `OddsPanel` (from issue-009) renders on the page using `oddsInfo` from the most recent response (or default placeholder values before first spin)
- [ ] `ProvablyFairBadge` (from issue-009) renders the latest `commitment`, `serverSeed`, `nonce` after each spin
- [ ] `RouletteSessionStats` renders `Won | Lost | Net` reading from `useSessionStore`
- [ ] Spin button is disabled while a spin is in flight (loading spinner from `Button` primitive)
- [ ] Error handling: `INSUFFICIENT_FUNDS`, `INVALID_BET`, network failure — each shows an inline error message, refunds, and re-enables the button
- [ ] Integration test (Vitest + RTL): mock `fetch` returning a `straight 7 win` payload; place a 50-chip straight bet on 7; assert balance decreases by 50, then increases by 1750 after spin completes
- [ ] All tests pass

## Out of Scope
- Sound effects (Sprint 7)
- Animated chip placement on bets resolved as wins (the cell pulse is sufficient for v1)
- Server-side balance enforcement — balance is client-only by design (PRD §3)

## Notes
- See `docs/api-contract.md` — `/api/roulette/spin` for full request/response shapes
- See `docs/PRD.md` §6.3 — Chips wager range `[5, 500]`
- The Worker increments global counters; the SSE stream from issue-005 will deliver the updated header counter automatically — do NOT also update `globalCounter.store` from this page
- `sessionId` should be generated once per browser session and reused (UUID v4 stored in sessionStorage by `useSessionStore`)
- Use `react-hot-toast` or a simple inline alert primitive for error toasts (no need for a toast lib if it isn't already installed — inline alert is fine)
