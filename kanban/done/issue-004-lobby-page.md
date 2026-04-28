# Issue 004: Lobby Page — Game Cards Grid
**Sprint:** 1
**Type:** HITL (visual QA required)
**Blocking:** none
**Blocked by:** issue-001, issue-002
**Files to create/modify:**
- `src/pages/LobbyPage.tsx`
- `src/components/lobby/GameCard.tsx`
- `src/components/lobby/GameCard.test.tsx`
- `src/components/ui/CurrencyBadge.tsx`
- `src/components/index.ts` (add new exports)

## Acceptance Criteria
- [ ] Lobby page renders a 3×2 grid of GameCard components (6 games)
- [ ] Each GameCard shows: game thumbnail placeholder (colored div with game icon), game name, house edge badge (color-coded: green ≤1%, yellow 1–10%, red >10%), "Play →" CTA link to game route
- [ ] Hovering a GameCard applies gold border glow (`shadow-glow-gold`) and slight scale (Motion `whileHover={{ scale: 1.03 }}`)
- [ ] Grid is responsive: 1 column on mobile (375px), 2 columns at md (768px), 3 columns at lg (1024px+)
- [ ] `CurrencyBadge` component renders a pill showing currency icon + amount with Motion count-up animation when value changes
- [ ] Header currency badges use `CurrencyBadge` and read from `useCurrencyStore`
- [ ] `usePassiveDrip` is active on lobby page (and all pages) — balance increments every 10s
- [ ] All tests pass

## Out of Scope
- No actual game thumbnails yet (placeholder colored divs are fine)
- No audio on lobby page yet (issue-007)

## Notes
- See `docs/ui-wireframe.md` — Page 1: Lobby section
- House edge values per game are defined in `docs/game-engine-specs.md`
- GameCard href uses React Router `<Link>` not `<a>`
