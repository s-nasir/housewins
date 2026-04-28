# Issue 008: Roulette Worker Engine — `POST /api/roulette/spin`
**Sprint:** 2
**Type:** AFK
**Blocking:** issue-012
**Blocked by:** issue-007
**Currency affected:** Chips (server-side wager/payout math; balance updates happen client-side in issue-012)
**Files to create/modify:**
- `workers/housewins-api/src/routes/roulette.ts`
- `workers/housewins-api/src/lib/roulette/payouts.ts`
- `workers/housewins-api/src/lib/roulette/oddsInfo.ts`
- `workers/housewins-api/src/index.ts` (mount route)
- `workers/housewins-api/src/__tests__/roulette.test.ts`

## Acceptance Criteria
- [ ] `POST /api/roulette/spin` accepts the request shape from `docs/api-contract.md` (`sessionId`, `bets[]`, optional `clientSeed`)
- [ ] Validates each bet: `type` is one of the 11 supported types, `amount` is in range `[5, 500]`, `numbers[]` is consistent with the bet type (e.g. `straight` has 1 number, `split` has 2 adjacent, `corner` has 4)
- [ ] Returns `400 INVALID_BET` for malformed input — does NOT touch counters
- [ ] Spins via `secureRandom(0, 37)` where `0 = 0`, `37 = 00`, `1..36 = numbers`
- [ ] `calculateRoulettePayout(bet, result)` correctly resolves all 11 bet types per the payout table in `docs/game-engine-specs.md` §1
- [ ] Response includes: `outcome.result`, `outcome.resultLabel` (e.g. `"7 Red"`, `"00 Green"`), `payouts[]`, `totalPayout`, `netChange` (totalPayout − totalWagered), `provablyFair`, `oddsInfo`, `globalCounters`
- [ ] On resolution: `INCRBYFLOAT global:wagers <totalWagered>` and `INCRBYFLOAT global:winnings <totalPayout>` are called atomically, then `broadcastCounters()` is invoked
- [ ] `oddsInfo.bets[]` returns per-bet `winProbability`, `houseEdge` (always `5.26%`), `expectedLossPer100`
- [ ] Unit tests cover: each of the 11 bet types winning + losing, multi-bet round, invalid bet shape, amount-out-of-range, mocked Redis `INCRBYFLOAT`, mocked `broadcastCounters`
- [ ] Statistical sanity test: 10,000 straight-up bets on `7` produces win count within `[200, 320]` (expected ~263)
- [ ] All tests pass

## Out of Scope
- Frontend integration (issue-012)
- Wheel animation (issue-011)
- Persisting bet history per-session (we don't have user accounts)

## Notes
- See `docs/api-contract.md` — `/api/roulette/spin` request/response shapes
- See `docs/game-engine-specs.md` §1 for full bet type table and payout formulas
- Use the helpers from issue-007 (`secureRandom`, `generateServerSeed`, `generateCommitment`)
- Wager range constants live near the route handler — single source of truth for the 5/500 min/max
- Color helper: `0` and `00` are green; reds are `[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]`; rest are black
