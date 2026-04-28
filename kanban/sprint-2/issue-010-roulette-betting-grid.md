# Issue 010: Roulette Betting Grid + Chip Selector UI
**Sprint:** 2
**Type:** HITL (visual QA required)
**Blocking:** issue-012
**Blocked by:** issue-006 (design system — already done)
**Currency affected:** Chips (chip selector denominations + pending wager total)
**Files to create/modify:**
- `src/pages/RoulettePage.tsx` (initial scaffold — wired in issue-012)
- `src/components/roulette/BettingGrid.tsx`
- `src/components/roulette/ChipSelector.tsx`
- `src/components/roulette/ChipStack.tsx`
- `src/hooks/useRouletteBets.ts`
- `src/components/roulette/BettingGrid.test.tsx`
- `src/components/roulette/ChipSelector.test.tsx`
- `src/hooks/useRouletteBets.test.ts`

## Acceptance Criteria
- [ ] `RoulettePage` is mounted at `/roulette` and renders a placeholder layout: betting grid + chip selector + a static "Spin" button (no spin logic yet — that's issue-012)
- [ ] `BettingGrid` renders the full American Roulette table from `docs/ui-wireframe.md` — Page 2 section:
  - 0 and 00 cells at top
  - 36 numbered cells in 3×12 grid (with correct red/black colouring; 0/00 green)
  - Outside bets: `1-18`, `19-36`, `Even`, `Odd`, `Red`, `Black`, `1st 12`, `2nd 12`, `3rd 12`, three column `2:1` cells
- [ ] Clicking any cell with a chip selected calls a callback `onPlaceBet({ type, numbers, amount })` with the correct `type` for that cell
- [ ] `ChipSelector` shows 6 chip denominations: `5, 10, 25, 50, 100, 500` (Chips). Selected chip has gold ring + Motion `whileTap` bounce
- [ ] `ChipStack` renders stacked chip visuals on a cell when bets are placed; stacks of >3 collapse to "Nx" label
- [ ] `useRouletteBets` hook manages local bet state: `bets[]`, `totalWagered`, `addBet(bet)`, `clearBets()`, `removeLastBet()`
- [ ] "Total wagered" indicator updates live below the grid as chips are placed
- [ ] Disable a chip in the selector if the user's `chips` balance < that denomination (read-only — no spend yet)
- [ ] Clamp: `addBet` rejects bets that would push `totalWagered + amount` past 500 (per-bet max from PRD §6.3) for that single bet entry
- [ ] Mobile (375px): grid scrolls horizontally with sticky 0/00 column; chip selector wraps to two rows
- [ ] All tests pass; visual QA: place chips on straight, split, corner, red, dozen — each shows correct chip stack

## Out of Scope
- Spin animation (issue-011)
- Wiring to Worker `/api/roulette/spin` (issue-012)
- Persisting bets across page reloads — bets are ephemeral, cleared on spin

## Notes
- See `docs/ui-wireframe.md` — Page 2: Roulette section for the grid layout
- See `docs/game-engine-specs.md` §1 for the 11 bet types — encode each cell's `(type, numbers)` mapping in a constants file `src/components/roulette/bettingGridLayout.ts`
- Use existing `Chip` primitive from issue-006 for the chip visuals
- Use `useCurrencyStore` (read-only here) to gate chip selector disabled state
