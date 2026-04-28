# Architecture Decision Record (ADR)
## HouseWins.gg
**Version:** 1.0  
**Status:** Active

> This document records *why* each architectural choice was made. It is the defense against future "why did we do it this way?" questions.

---

## ADR-001: Frontend Framework — Vite + React over Next.js

**Status:** Decided  
**Date:** 2026-04-28

### Context
We need a React-based frontend for a 7-page interactive game application. Two primary candidates: Vite + React (SPA) and Next.js (SSR/SSG hybrid).

### Decision
**Vite + React (pure SPA)**

### Rationale
- Our app has **zero SEO requirements** — all 7 pages are interactive game UIs, not indexed content
- All game state is **client-side** (Zustand + localStorage) — SSR adds no value and introduces hydration complexity
- Vite produces **smaller client bundles** and faster TTI for pure SPAs (benchmarked 2025–2026)
- No need for API Routes — game engine lives in a separate Cloudflare Workers project
- Next.js SSR/App Router overhead (~40–60KB) buys us nothing for this use case
- Both have equivalent AI codegen quality; Vite wins on runtime performance for interactive SPAs

### Consequences
- We maintain a **separate Cloudflare Workers project** for the game engine API (acceptable — clean separation of concerns)
- No built-in image optimization or font optimization (not needed — no content images)
- Routing via **React Router v7**

### Rejected Alternatives
- **Next.js**: Overkill SSR framework for a pure SPA game app
- **SvelteKit**: Less AI training data = less reliable AI codegen
- **Astro**: Static-site focused, inadequate for real-time game interactivity

---

## ADR-002: Hosting — Cloudflare Pages + Workers over Vercel

**Status:** Decided  
**Date:** 2026-04-28

### Context
We need free hosting for a Vite SPA + a serverless API layer.

### Decision
**Cloudflare Pages (frontend) + Cloudflare Workers (backend)**

### Rationale
- **One ecosystem**: single account, single billing, single dashboard
- **Free tier**: 500 builds/month, unlimited bandwidth, 100k Worker requests/day — vs Vercel's 100GB bandwidth limit
- **Edge runtime**: Workers run at the edge globally with zero cold starts. Vercel serverless functions have cold start latency
- **CF-IPCountry header**: Free, built-in IP geolocation — eliminates need for ip-api.com API call
- **SSE support**: Cloudflare Workers support SSE responses natively on the free tier. Vercel serverless functions have a 10-second timeout that would kill SSE streams
- **Consistent tooling**: Using the same platform for both frontend and backend avoids cross-origin complexity

### Consequences
- Workers use **Edge Runtime** (not full Node.js) — `crypto` is available via Web Crypto API (`crypto.getRandomValues()`)
- Must use **Wrangler CLI** for local Workers development
- `node:crypto` module uses `crypto.randomInt()` — in Workers we use `crypto.getRandomValues()` equivalent

### Rejected Alternatives
- **Vercel**: SSE timeout issue, less generous free tier, no native geo header
- **Railway / Render**: Free tier servers sleep after inactivity (kills SSE connections)
- **Netlify**: Less native Vite SPA support, no edge functions on free tier

---

## ADR-003: Real-time Counter Delivery — SSE over WebSockets

**Status:** Decided  
**Date:** 2026-04-28

### Context
Global house profit and player winnings counters must update for all connected clients when a bet resolves.

### Decision
**Server-Sent Events (SSE) via Cloudflare Workers**

### Rationale
- **WebSockets require persistent connections** — incompatible with serverless/edge functions. Cloudflare Durable Objects (required for stateful WebSockets) are a **paid feature** (~$5/month)
- **SSE is one-directional** (server → client) which is exactly what we need — counter values are only ever pushed FROM the server TO clients. No client → server counter data needed
- SSE works natively with Cloudflare Workers on the free tier via `ReadableStream` responses
- Achieves the same "live stock ticker" visual feel as WebSockets for our use case
- SSE uses standard HTTP — easier to debug, no special client library needed (native `EventSource` API)

### Consequences
- Counter updates are pushed server-side when a bet resolves in the Worker
- Clients open a persistent SSE connection via `new EventSource('/api/counter-stream')`
- Reconnection is handled automatically by the browser's native EventSource

### Rejected Alternatives
- **WebSockets**: Require Cloudflare Durable Objects (paid). Not free.
- **HTTP Polling (5s)**: Acceptable fallback but adds unnecessary latency and requests. SSE is strictly better on free tier.

---

## ADR-004: Global Counter Storage — Upstash Redis

**Status:** Decided  
**Date:** 2026-04-28

### Context
Two server-side persistent values: GlobalWagers and GlobalWinnings. Must support concurrent atomic increments from multiple Workers.

### Decision
**Upstash Redis (serverless Redis, HTTP API)**

### Rationale
- **Atomic operations**: `INCRBYFLOAT` is atomic — no race conditions with concurrent bets from multiple users
- **Free tier**: 10,000 commands/day. At average 2 commands per bet, supports ~5,000 bets/day before limit. Sufficient for a simulation site
- **HTTP API**: Works from Cloudflare Workers Edge Runtime without a Node.js TCP connection (Workers can't open TCP connections — Upstash's HTTP Redis is the standard solution)
- **Globally replicated**: Sub-millisecond reads from any region

### Consequences
- At high traffic (>5,000 bets/day), may need to upgrade to Upstash pay-as-you-go ($0.20/100k commands)
- Values persist indefinitely — counters are cumulative across all time (which is the desired behavior)

### Rejected Alternatives
- **Supabase Postgres**: More setup, TCP connection, overkill for 2 counters
- **PlanetScale**: Deprecated free tier
- **Firebase Realtime DB**: Google lock-in, more complex rules

---

## ADR-005: State Management — Zustand + localStorage

**Status:** Decided  
**Date:** 2026-04-28

### Context
Session currency balances (Chips, Tokens, Tickets), game UI state, and passive earn timer must be managed client-side.

### Decision
**Zustand with localStorage middleware persistence**

### Rationale
- **Lightweight**: ~3KB. No boilerplate (vs Redux Toolkit's setup overhead)
- **No re-render cascades**: Zustand subscribers only re-render when their specific slice changes — critical for slot reel animation loops that update many times per second
- **localStorage persistence**: `zustand/middleware/persist` serializes state to localStorage on every change. Balance survives page refresh
- **AI codegen**: Zustand is extremely well-known by LLMs — clean, predictable patterns

### Currency persistence rules:
- `localStorage`: Chips, Tokens, Tickets balances (persist across refresh)
- `sessionStorage`: Hand state (Blackjack), current session stats, disclaimer-seen flag
- `BroadcastChannel`: Cross-tab coordination (only one tab earns the passive drip)

### Rejected Alternatives
- **React Context + useReducer**: Re-render performance issues in fast game loops
- **Redux Toolkit**: Too much boilerplate, no benefit for this use case

---

## ADR-006: Animation Strategy — Motion + GSAP

**Status:** Decided  
**Date:** 2026-04-28

### Context
Two classes of animation: (1) UI transitions (page enter/exit, modal, button feedback) and (2) complex game timelines (roulette wheel, slot reels, card deals).

### Decision
**Motion (Framer Motion v11) for UI + GSAP (core only) for game timelines**

### Rationale
- **Motion v11** (~17KB) is the lightest production-ready React animation library. Replaces both Framer Motion (30–50KB) and spring-based CSS approaches for component-level transitions
- **GSAP** is the industry standard for complex timeline animations. Roulette wheel spin requires: easing curves + deceleration physics + stop-on-target + sound sync. GSAP's timeline API handles this precisely
- We import only `gsap/core` — no premium plugins needed. Keeps GSAP bundle impact minimal (~25KB)
- The split is intentional: Motion handles React's component lifecycle animations. GSAP manipulates DOM/Canvas elements outside React's render cycle for game-specific animations

### Consequences
- GSAP is used **only** in: RouletteWheel component, SlotReels component
- All other animations use Motion
- GSAP animations run on `useRef` canvas/DOM elements, not React state — no re-renders during spin

### Rejected Alternatives
- **GSAP only**: Loses React-native transition benefits of Motion
- **Framer Motion only (old)**: Not powerful enough for synchronized slot reel timelines
- **CSS animations only**: Cannot handle programmatically-determined stop positions (e.g., where roulette ball lands)

---

## ADR-007: RNG — Web Crypto API

**Status:** Decided  
**Date:** 2026-04-28

### Context
All game outcomes must be random and non-exploitable.

### Decision
**`crypto.getRandomValues()` (Web Crypto API) in Cloudflare Workers**

### Rationale
- Cryptographically secure (passes NIST statistical tests). `Math.random()` is NOT cryptographically secure and is exploitable if the seed is guessed
- Built into the Web Crypto API — available in all modern browsers and Cloudflare Workers Edge Runtime without any import
- Zero latency (no external API call)

### Provably Fair Layer
- Before each round: Worker generates `seed`, computes `commitment = SHA-256(seed + nonce)`, sends commitment to client
- After round resolves: Worker reveals `seed`. Client can verify `SHA-256(seed + nonce) === commitment`
- This proves the outcome was not manipulated after the bet was placed
- The house edge is built into the **probability tables** (e.g., 1/38 chance on a 38-number roulette) — not into RNG manipulation

### Rejected Alternatives
- **Math.random()**: Not cryptographically secure
- **RANDOM.org**: External dependency, latency, paid API

---

## ADR-008: Testing Strategy — Vitest + RTL + Playwright

**Status:** Decided  
**Date:** 2026-04-28

### Context
All code is AI-generated. Game math bugs (wrong house edge, wrong payout calculation) are the highest-risk failure mode.

### Decision
**Three-layer test pyramid:**
1. **Vitest** — unit tests for all game engine functions
2. **React Testing Library** — component tests for UI state machines
3. **Playwright** — E2E smoke tests for full user sessions

### Rationale
- **Vitest**: Native to Vite, ESM-first, fastest test runner in the ecosystem. Each game engine function has a dedicated test: RNG output range, payout math, house edge verification
- **RTL**: Tests component behavior (correct balance after win/loss, button states in Blackjack) without testing implementation details
- **Playwright**: Smoke test per game (visit page → place bet → verify balance changed). Catches integration failures
- **TDD discipline**: Tests written BEFORE implementation in every agent loop. Prevents AI from writing tests that rubber-stamp its own bugs

### CI Gate
- All Vitest + RTL tests must pass before a PR can merge to `main`
- Playwright runs post-deploy on preview URL before production promotion

### Rejected Alternatives
- **Jest**: Older, slower, not ESM-native. Vitest is the modern replacement
- **Cypress**: Slower than Playwright in CI, less reliable cross-browser

---

## ADR-009: Development Methodology — AI-Driven Iterative Agile

**Status:** Decided  
**Date:** 2026-04-28

### Context
100% AI-generated code. Human role is architect + reviewer. Need a workflow that keeps AI in the "smart zone" and prevents scope creep.

### Decision
**AI-Driven Iterative Agile with Memento context discipline**

### Rules
1. **One issue per context window.** Each Windsurf session picks ONE kanban issue, clears context between issues.
2. **Vertical slices.** Every issue touches all layers: Worker logic + React component + test. No horizontal "all database first" phases.
3. **TDD inside every agent loop.** Test written before implementation. Prevents rubber-stamp tests.
4. **Deep modules.** Each game engine is one module with a small public interface. AI implements the interior; human designs the interface.
5. **Doc rot rule.** After implementation, the issue is closed/deleted. Stale PRD sections are dangerous.
6. **Human review is mandatory** for: interface design, visual QA, code review of tests (are they testing the right things?), merging to `main`.
7. **AFK vs HITL labels.** Implementation is AFK. Planning, interface design, and visual QA are always HITL.

### Consequences
- Issues must be written as **complete vertical slices with explicit acceptance criteria**
- A context monitoring practice is maintained (watch token count)
- Code review always uses a **fresh context window** (not the same session that wrote the code)
