# Issue 001: Global Layout — Header, Footer, Shell
**Sprint:** 1
**Type:** HITL (visual QA required after implementation)
**Blocking:** issue-002, issue-003
**Blocked by:** none
**Files to create/modify:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/PageShell.tsx`
- `src/components/layout/Header.test.tsx`
- `src/App.tsx` (wrap routes in PageShell)

## Acceptance Criteria
- [ ] Header renders on all pages: logo ("HouseWins.gg"), global counter placeholder (two values), currency balance display (3 badges: Chips / Tokens / Tickets), mute toggle button
- [ ] Footer renders on lobby page only (`/`): Disclaimer link, Responsible Gambling link, Support link
- [ ] `PageShell` wraps all routes — header always visible, footer conditional on route
- [ ] All elements use design tokens from `tailwind.config.js` (felt background, cream text, gold accents)
- [ ] Layout is mobile-first: header stacks correctly at 375px, 768px, 1280px
- [ ] Header renders without crashing when counter values are null/undefined (loading state)
- [ ] Mute toggle button is present and changes icon between 🔊 and 🔇 on click
- [ ] All tests pass: `pnpm --filter housewins-app test`

## Out of Scope
- Do NOT wire up live SSE counter data (that's issue-005)
- Do NOT implement currency store logic (that's issue-002)
- Do NOT implement disclaimer modal (that's issue-003)
- Counter display shows static placeholder values for now

## Notes
- See `docs/ui-wireframe.md` — Global Layout Shell section
- Use Lucide React for icons (`Volume2`, `VolumeX`, `ArrowLeft`)
- Header component receives `counters` and `balance` as props (not wired yet — use defaults)
