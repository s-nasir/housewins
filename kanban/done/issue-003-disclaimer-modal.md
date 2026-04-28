# Issue 003: Disclaimer Modal + Session Gate
**Sprint:** 1
**Type:** HITL (visual QA required)
**Blocking:** none
**Blocked by:** issue-001
**Files to create/modify:**
- `src/components/modals/DisclaimerModal.tsx`
- `src/components/modals/DisclaimerModal.test.tsx`
- `src/App.tsx` (mount modal at root)

## Acceptance Criteria
- [ ] Modal renders on first visit of a new browser session (sessionStorage key `disclaimer_seen` absent)
- [ ] Modal does NOT render on subsequent page navigations within the same session
- [ ] Modal contains: title "Before You Play", 3 bullet points (no real money, fictional currency, educational), National Helpline number (1-800-522-4700), dismiss button "I Understand — Let's Play"
- [ ] Dismiss button sets `sessionStorage.setItem('disclaimer_seen', 'true')` and closes modal
- [ ] Modal has a backdrop overlay (felt-dark at 80% opacity). Clicking backdrop does NOT dismiss (must click button)
- [ ] Modal is animated: fade + scale-in on mount using Motion (`AnimatePresence` + `motion.div`)
- [ ] Footer "Disclaimer" link re-opens the modal regardless of session state
- [ ] Fully keyboard accessible: focus trapped inside modal, Escape key does NOT close it
- [ ] All tests pass

## Out of Scope
- Do NOT store any user data server-side
- Do NOT add cookie consent (not needed — no cookies)

## Notes
- See `docs/ui-wireframe.md` — Disclaimer Modal section
- Use Motion's `AnimatePresence` for mount/unmount animation
- `initial={{ opacity: 0, scale: 0.95 }}` → `animate={{ opacity: 1, scale: 1 }}`
