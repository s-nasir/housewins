# Issue 007: Shared RNG + Provably Fair Module (Worker)
**Sprint:** 2
**Type:** AFK
**Blocking:** issue-008
**Blocked by:** none
**Currency affected:** None
**Files to create/modify:**
- `workers/housewins-api/src/lib/rng.ts`
- `workers/housewins-api/src/lib/provablyFair.ts`
- `workers/housewins-api/src/__tests__/rng.test.ts`
- `workers/housewins-api/src/__tests__/provablyFair.test.ts`

## Acceptance Criteria
- [ ] `secureRandom(min, max)` returns an integer in `[min, max]` inclusive using `crypto.getRandomValues(Uint32Array(1))`
- [ ] `secureRandomFloat()` returns a float in `[0, 1)` derived from `crypto.getRandomValues`
- [ ] `secureShuffle<T>(array)` returns a new array shuffled via Fisher-Yates using `secureRandom` (does not mutate input)
- [ ] `weightedRandom<T>(items: { value: T; weight: number }[])` selects one item proportional to its weight (used later by Scratchers/Slots)
- [ ] `generateServerSeed()` returns a 32-byte hex string from `crypto.getRandomValues`
- [ ] `generateCommitment(serverSeed, nonce)` returns hex SHA-256 of `${serverSeed}:${nonce}` using `crypto.subtle.digest`
- [ ] `verifyCommitment(serverSeed, nonce, commitment)` returns boolean
- [ ] Distribution test: `secureRandom(0, 37)` over 100,000 trials produces every value at least once and no value appears more than 1.5× the expected mean (catches off-by-one bugs only — not a statistical proof)
- [ ] `secureShuffle` test: shuffling `[1..10]` 1,000 times yields all 10 values in every position at least once
- [ ] `generateCommitment` matches the example from `docs/game-engine-specs.md` for a known seed/nonce pair
- [ ] All tests pass: `pnpm --filter housewins-api test`

## Out of Scope
- Per-game engine logic (that's issue-008 onward)
- Persisting server seeds across requests — every round generates a fresh seed
- Client-seed mixing (deferred — `clientSeed` is accepted in API but unused in v1)

## Notes
- See `docs/game-engine-specs.md` — Shared Contracts section (RNG Module, Provably Fair Module)
- Cloudflare Workers expose Web Crypto natively — no polyfill needed
- Keep these as pure functions with no Worker-runtime dependencies so they're trivially unit-testable in Vitest
- These modules are imported by every game engine — keep the public surface minimal
