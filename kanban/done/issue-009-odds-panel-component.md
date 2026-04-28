# Issue 009: Shared OddsPanel Component
**Sprint:** 2
**Type:** HITL (visual QA required)
**Blocking:** issue-012
**Blocked by:** issue-006 (design system primitives — already done)
**Currency affected:** None
**Files to create/modify:**
- `src/components/odds/OddsPanel.tsx`
- `src/components/odds/OddsPanel.test.tsx`
- `src/components/odds/ProvablyFairBadge.tsx`
- `src/components/odds/ProvablyFairBadge.test.tsx`
- `src/components/index.ts` (add exports)

## Acceptance Criteria
- [ ] `OddsPanel` accepts props: `winProbability: string`, `houseEdge: string`, `expectedLossPer100: string`, optional `rtp?: string`
- [ ] Renders the layout from `docs/ui-wireframe.md` — Odds Visualization Panel section: title `"📊 Your Odds"`, Win Probability bar (filled proportion = parsed percentage), House Edge value, Expected loss per $100, "In 100 rounds" plain-language summary
- [ ] Win probability bar uses gold fill on felt-light track; bar width animates on prop change (Motion `animate={{ width }}`)
- [ ] Sidebar layout on `lg+` (≥1024px), collapsible accordion on mobile (`< lg`) — uses a disclosure button with chevron icon
- [ ] `ProvablyFairBadge` accepts props: `commitment: string`, `serverSeed: string | null`, `nonce: number`
- [ ] Badge renders a small pill labeled "Provably Fair ✓" with shield icon; clicking it expands a panel showing commitment hash, revealed seed (or "Pending reveal" if `serverSeed === null`), and nonce
- [ ] Clicking outside or the close button collapses the badge
- [ ] All elements use design tokens — no inline styles
- [ ] Both components are keyboard-accessible (`tabindex`, `role="button"`, `aria-expanded`)
- [ ] Tests cover: rendering with each prop combination, collapse/expand interaction, win-probability bar width matches input
- [ ] All tests pass

## Out of Scope
- Wiring to a specific game (that's issue-012 for Roulette and future game-page issues)
- "How is this calculated?" help modal — render the link as a non-functional anchor for now (TODO comment)

## Notes
- See `docs/ui-wireframe.md` — Odds Visualization Panel + Component Inventory rows
- This component is reused by ALL six game pages — keep it game-agnostic (pass numbers as pre-formatted strings from each page)
- Use `lucide-react` icons: `BarChart3`, `ShieldCheck`, `ChevronDown`
