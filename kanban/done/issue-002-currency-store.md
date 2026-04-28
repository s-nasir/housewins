# Issue 002: Currency System — Zustand Store + Passive Drip
**Sprint:** 1
**Type:** AFK
**Blocking:** issue-004
**Blocked by:** issue-001
**Files to create/modify:**
- `src/store/currency.store.ts`
- `src/store/session.store.ts`
- `src/store/index.ts`
- `src/hooks/usePassiveDrip.ts`
- `src/store/currency.store.test.ts`
- `src/hooks/usePassiveDrip.test.ts`

## Acceptance Criteria
- [ ] `useCurrencyStore` (Zustand + localStorage persist) exposes: `chips`, `tokens`, `tickets`, `addChips`, `addTokens`, `addTickets`, `spendChips`, `spendTokens`, `spendTickets`
- [ ] `spendChips(amount)` returns `false` and does not mutate if `chips < amount`; returns `true` on success
- [ ] Same guard for `spendTokens`, `spendTickets`
- [ ] New session initialises with 1,000 Chips / 500 Tokens / 10 Tickets (checked via localStorage key absence)
- [ ] Balance persists through page refresh (localStorage middleware)
- [ ] `useSessionStore` tracks: `sessionWon`, `sessionLost` — resets on browser close (sessionStorage, not localStorage)
- [ ] `usePassiveDrip` hook: adds 10 Chips + 5 Tokens every 10 seconds
  - Uses `BroadcastChannel` — only ONE tab earns at a time (leader election: first tab to open wins)
  - Second tab: connects to channel but does NOT start its own drip timer
  - Tab close: BroadcastChannel releases leader, next tab becomes leader
- [ ] All unit tests pass with full edge-case coverage (zero balance, exact balance spend, multi-tab simulation)

## Out of Scope
- Do NOT implement UI components here (that's issue-001 and later)
- Passive drip rate is hardcoded at 10/5 per 10s — rate tuning is a future issue

## Notes
- See `docs/PRD.md` §6.2 for currency system spec
- Zustand persist middleware: `import { persist } from 'zustand/middleware'`
- BroadcastChannel name: `'housewins-drip-leader'`
- Test the leader election with a mock BroadcastChannel
