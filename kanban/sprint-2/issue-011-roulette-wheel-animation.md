# Issue 011: Roulette Wheel — Canvas + GSAP Animation
**Sprint:** 2
**Type:** HITL (animation tuning + visual QA)
**Blocking:** issue-012
**Blocked by:** none
**Currency affected:** None
**Files to create/modify:**
- `src/components/roulette/RouletteWheel.tsx`
- `src/components/roulette/wheelLayout.ts` (38-slot order constant)
- `src/components/roulette/RouletteWheel.test.tsx`

## Acceptance Criteria
- [ ] `RouletteWheel` renders a 2D canvas (or SVG) wheel with 38 slots in standard American order (`0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, 00, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2`)
- [ ] Each slot is colored: `0` and `00` green, reds per the standard distribution, rest black; slot number text in cream
- [ ] Component exposes an imperative method via `useImperativeHandle`: `spinTo(result: number): Promise<void>` that resolves when the spin animation completes
- [ ] Spin animation: GSAP timeline, ~4 seconds total, 5–8 full rotations, decelerates with custom ease, ball drops onto target slot
- [ ] Result indicator (small triangle pointing at top of wheel) marks the winning slot when animation completes
- [ ] Subtle gold glow pulse on the winning slot for 1.2s after settle (Motion or GSAP repeat)
- [ ] `prefers-reduced-motion: reduce` shortcuts to a 400ms fade to result — no rotation
- [ ] Component is responsive: scales to its container, min 280px wide on mobile, max 480px on desktop
- [ ] Cleanup: GSAP timelines killed on unmount (no memory leaks)
- [ ] Tests cover: renders 38 slots, `spinTo` returns a resolved promise after the animation duration (use fake timers), reduced-motion path, slot color mapping
- [ ] All tests pass; visual QA: spin to 0, 00, 7, 17, 36 — each lands on the correct slot under the indicator

## Out of Scope
- Sound effects (Sprint 7)
- Multi-ball or 3D rendering — strictly 2D
- Live wiring to the Worker (issue-012)

## Notes
- See `docs/ui-wireframe.md` — Page 2: Roulette / Wheel animation section
- Use GSAP (already in stack); import as `import gsap from 'gsap'`
- The 38-slot wheel order is fixed and must match the constant above (do not invent your own order)
- Test with `vi.useFakeTimers()` and `vi.advanceTimersByTime()` to avoid real 4s waits
