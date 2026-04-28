# Issue 006: Design System — Shared UI Primitives
**Sprint:** 1
**Type:** HITL (visual QA required)
**Blocking:** none
**Blocked by:** issue-001
**Files to create/modify:**
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Chip.tsx` (casino chip visual component)
- `src/components/ui/Button.test.tsx`
- `src/lib/utils.ts` (cn() helper using clsx + tailwind-merge)
- `src/components/index.ts` (add new exports)

## Acceptance Criteria
- [ ] `cn()` utility in `src/lib/utils.ts` merges Tailwind classes correctly (clsx + tailwind-merge)
- [ ] `Button` component: variants `primary` (gold bg, felt-dark text), `secondary` (felt-light bg, cream text), `ghost` (transparent, cream text). Sizes: `sm`, `md`, `lg`. Disabled state. Loading state (spinner).
- [ ] `Badge` component: color variants `green`, `yellow`, `red`, `gold`. Used for house edge labels.
- [ ] `Card` component: felt-light background, card shadow, rounded corners. Used as base for game panels.
- [ ] `Chip` component: visual casino chip rendered in CSS. Color variants matching `chip-*` tokens (red, blue, green, black, white). Shows denomination number. Used in Roulette chip selector.
- [ ] All components are accessible (proper ARIA roles, keyboard navigable)
- [ ] Storybook is NOT required — visual QA done in browser
- [ ] All tests pass

## Out of Scope
- shadcn/ui components are NOT initialized via CLI yet — these are our custom primitives
- shadcn initialization happens if/when we need more complex components (Dialog, Select, etc.)

## Notes
- See `docs/ui-wireframe.md` — Design Tokens section for exact color values
- All components use Tailwind classes — no inline styles
- `cn()` pattern: `import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'`
