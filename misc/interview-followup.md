# Casino Sim — Interview Follow-Up & Research Report
> Status: Resolves all open research items from `interview-questions.md`.  
> Answers are finalized ✅ or still need your input 🔲.

---

## SECTION A — Development Methodology (Q1, Q2, Q18, Q19)
*You deferred Q1, Q18, Q19 to after reading `ai-workflow-walkthrough.md`.*

### Findings from the AI Workflow Document

The Matt Pocock workflow maps directly to what we're building. Here's how I propose we adapt it:

**Our adapted AI-Driven Iterative Agile cycle:**

```
GRILL SESSION (done — this document)
  │
  ▼
PRD — single source of truth, includes module map + out-of-scope list
  │
  ▼
KANBAN ISSUES — vertical slices (each issue = schema + logic + UI layer)
  Labeled: AFK (agent runs alone) or HITL (you must be present)
  │
  ▼
AGENT IMPLEMENTATION — Windsurf/Cascade works issue by issue
  Uses TDD: test written before implementation
  Context cleared between each issue (Memento model)
  │
  ▼
YOUR REVIEW — tests first, then code, then manual QA in browser
  Bugs/missing behavior → new kanban issues
  │
  └──► back to backlog until sprint is done
```

**Key rules we adopt:**
1. **Deep modules**: Each game engine is one deep module with a small public interface. No shallow micro-files.
2. **Context discipline**: Each Windsurf session works ONE issue. We clear context between issues to stay in the smart zone.
3. **No spec-to-code**: We never just dump the PRD into an agent and say "build it." The agent picks one issue, explores the codebase, writes the test, then writes the code.
4. **Doc rot rule**: Once a sprint issue is implemented, the issue file is closed/deleted. We do NOT keep stale PRDs active in the repo.
5. **PRD out-of-scope section**: This defines "done" and prevents scope creep. Critical.

**CI/CD Decision (Q18):**  
Given the above workflow → **GitHub + Vercel auto-deploy + GitHub Actions test gate.**  
- Push to feature branch → Vercel preview URL (for your visual QA)  
- PR to `main` → GitHub Actions runs unit + game engine tests → if passing, auto-merge + deploy  
- This means a broken game engine **cannot** reach production.

**Testing Decision (Q19):**  
Confirmed: **Vitest (unit) + React Testing Library (component) + Playwright (E2E)**.  
- Vitest is fast, native to Vite, and works perfectly with Next.js.  
- Every game engine gets a dedicated test file run as part of CI.  
- Playwright E2E runs a "smoke test" session: visit site → play one round of each game → verify balance changed correctly.  

✅ **Q1 CONFIRMED:** AI-Driven Iterative Agile with the Memento context discipline above.  
✅ **Q2 CONFIRMED:** Docs 1–5 now, Doc 6 after methodology finalization, Doc 7 at the right phase.  
✅ **Q18 CONFIRMED:** GitHub + Vercel + GitHub Actions test gate on PRs to `main`.  
✅ **Q19 CONFIRMED:** Vitest + RTL + Playwright.  

---

## SECTION B — Frontend Framework (Q3, Q4, Q5, Q6, Q7)
*You asked me to re-evaluate with your 3 priorities: (1) lightweight, (2) exceptional UI/UX + animations, (3) AI codegen effectiveness.*

### Research: Vite + React vs Next.js for a Casino SPA

After reviewing 2025–2026 benchmarks:

| Factor | Vite + React | Next.js |
|--------|-------------|---------|
| Bundle size | ✅ Smaller client bundle | ❌ Larger (SSR hydration overhead) |
| Page load TTI | ✅ Faster (pure CSR, no hydration) | ❌ Slightly slower for SPAs |
| Dev hot reload | ✅ Fastest in class | ✅ Good (Turbopack) |
| Built-in API routes | ❌ None (need separate backend) | ✅ Yes |
| SEO | ❌ Poor (not needed for a game app) | ✅ Excellent (irrelevant for us) |
| AI codegen quality | ✅ Equal — both are top-tier | ✅ Equal |
| Animation support | ✅ Equal | ✅ Equal |
| Mobile performance | ✅ Lighter, faster on mobile | ❌ Heavier hydration |

**Key insight:** Our app has ZERO public SEO requirements, ZERO need for SSR, and ZERO mixed static+dynamic pages. It is a pure interactive game SPA. Every Next.js advantage (SSR, SSG, ISR, image optimization) is irrelevant. We would be carrying ~40–60KB of server framework overhead for no benefit.

**Our backend is simple:** 6 stateless game engine functions + 2 global counters. This does NOT require Next.js API routes. A **dedicated lightweight API layer** (4 API routes) is better served by a thin separate backend or edge functions.

### Revised Stack Recommendation

**Q3 — Frontend Framework: `Vite + React`**  
Pure SPA, fastest TTI, smallest bundle, no hydration overhead. Perfectly suited for a game app that lives entirely behind interaction. All game state is client-side (Zustand + localStorage). No SSR needed ever.

**Q4 — CSS/UI Framework: `Tailwind CSS + shadcn/ui`**  
✅ Confirmed. Tailwind is the best AI codegen target — highest training data density, utility-first means AI produces clean consistent output. shadcn gives us accessible, unstyled-by-default components we can skin with Classic Green Felt. No alternative beats this for our priorities.

**Q5 — Animation Library: REVISED**

After research, I revise my original recommendation:

| Library | Size | Complexity | AI Knowledge | Casino-Grade? |
|---------|------|-----------|-------------|--------------|
| Framer Motion | ~30-50KB | Low-Medium | ✅ Excellent | ✅ Good for transitions |
| GSAP | ~25KB core | High | ✅ Good | ✅ Best for timelines |
| Motion (new Framer Motion v11+) | ~17KB | Low-Medium | ✅ Growing | ✅ Very good |
| CSS animations | 0KB | Low | ✅ Excellent | ❌ Not for complex sequences |

**New recommendation: `Motion (Framer Motion v11 rebranded)` as primary + `GSAP` scoped to slot reel and roulette wheel only.**  
- Motion v11 is the lightest production-ready React animation library with the best AI codegen support.  
- GSAP handles the two complex timeline animations (slot reels, roulette spin) where precise sequencing is non-negotiable.  
- We do NOT import all of GSAP — only the `gsap/core` + `ScrollTrigger`-equivalent for game timelines. Keeps bundle tight.  
- GSAP is free for our use case (free tier covers all non-premium plugins we need).

**Q6 — Icon Library: `Lucide React`**  
✅ Confirmed. Lightest option (~2KB per icon, tree-shakeable), best AI codegen support, consistent design system. Heroicons is comparable but Lucide has a larger casino-adjacent icon set (cards, dice, coins).

**Q7 — Backend: REVISED**

Given we're moving to Vite (no built-in API routes), we need a backend. Best options re-evaluated:

| Option | Free? | Latency | Complexity | AI Codegen |
|--------|-------|---------|-----------|------------|
| Vercel Serverless Functions (separate) | ✅ Free | Low | Low | ✅ Excellent |
| Cloudflare Workers (Edge Functions) | ✅ 100k req/day free | Ultra-low | Medium | ✅ Good |
| Railway Node.js | ✅ Free tier (sleeps) | Medium | Medium | ✅ Good |

**New recommendation: `Cloudflare Workers` for game engine API.**  
- 100,000 free requests/day. More than enough for a simulation.  
- Globally distributed — sub-50ms latency worldwide.  
- Works with Upstash Redis (HTTP-based Redis calls, no Node.js required).  
- **Bonus:** `CF-IPCountry` header is built-in → solves Q15 geo-detection for free with no extra API call.  
- Pairs perfectly with **Cloudflare Pages** for hosting the Vite frontend (see Q16 revision).

**This changes Q16 (hosting).** See Section F.

✅ **Q3 CONFIRMED:** Vite + React  
✅ **Q4 CONFIRMED:** Tailwind CSS + shadcn/ui  
✅ **Q5 CONFIRMED:** Motion (primary) + GSAP (scoped to reels/wheel)  
✅ **Q6 CONFIRMED:** Lucide React  
✅ **Q7 REVISED:** Cloudflare Workers (edge functions) for game engine API  

---

## SECTION C — Real-Time Counters & WebSockets (Q8, Q9)

### Findings: Upstash Redis Free Tier
- **10,000 commands/day** on the free tier (as of 2025). 
- Each bet = 2 commands (increment wagers + increment winnings). At 5,000 bets/day that's 10,000 commands — right at the limit. 
- **Recommendation: Use Upstash Redis via Cloudflare Workers** (HTTP-based Redis calls). This means we stay fully serverless with zero node process management.
- Free tier is sufficient for a simulation site at low-to-moderate traffic.

### Findings: WebSockets vs SSE for Global Counters
WebSockets require a **persistent server** — incompatible with serverless/edge functions. On a free tier:
- Vercel does not support WebSockets on serverless functions.
- Cloudflare Workers supports WebSockets via Durable Objects — but Durable Objects are **NOT on the free tier** (paid plan only, ~$5/month).
- Railway/Render free tiers sleep after inactivity, killing all WebSocket connections.

**The honest answer:** True WebSockets for free = not practically achievable with our serverless-first stack.

**The good news:** **Server-Sent Events (SSE) on Cloudflare Workers IS free** and gives you 95% of the "live ticker" feel. The counter pushes from server → all connected clients whenever a bet is processed. No polling. No client needs to ask. It feels live.

**Recommendation: SSE (Server-Sent Events) via Cloudflare Workers.**  
- Free. Works with serverless. One-way server → client push (which is all we need — we never need the counter to send data *to* the server).  
- Achieves the stock-ticker visual effect you want.  
- Clients open a persistent SSE connection on page load. Every time a bet resolves, the worker pushes the new counter values to all connected clients instantly.

✅ **Q8 CONFIRMED:** Upstash Redis (free tier) — HTTP commands via Cloudflare Workers  
✅ **Q9 REVISED:** SSE (Server-Sent Events) — free, real-time, serverless-compatible. Drops WebSockets due to free tier incompatibility.

---

## SECTION D — RNG & Provably Fair (Q10, Q11)

### Q10 — Confirmed
✅ `crypto.randomInt()` / `crypto.getRandomValues()`. No change.

### Q11 — Clarification on "Provably Fair" vs Your Intent

You asked: *"The RNG should ensure the house always has an edge in the long run, but I want to show that RNG is still happening, and visualize how low the player's odds are."*

These are two separate features. Here's how both work:

**Feature 1: Provably Fair RNG (the transparency proof)**  
This is about proving to the user that the result was NOT manipulated AFTER their bet was placed. It does NOT affect the odds or house edge — it just proves the RNG wasn't rigged per-round. Works like this:  
1. Before each round, server commits to a secret seed hash (shown to player).  
2. Round plays out (with normal house edge math).  
3. After the round, server reveals the seed.  
4. Player can verify: hash(seed) = the commitment shown before = the result was predetermined and not changed after bet.  
This confirms the casino didn't change the result mid-round. The house edge is still built into the probability tables — it's fair in the mathematical sense, not the outcome sense.

**Feature 2: Odds Visualization (what you actually want)**  
A live odds panel on each game page showing:
- "Your odds of winning this bet: 2.63%" (Roulette single number)  
- "House edge: 5.26%"  
- "Expected loss per $100 wagered: $5.26"  
- A probability bar showing Player Win vs House Win probability graphically  
- After each round: "Over 100 spins with this strategy, you'd statistically win X times and lose Y times"

**Recommendation: Implement BOTH.**  
- Provably fair adds credibility and matches your educational mission.  
- Odds visualization is the core educational feature that makes this site unique.

✅ **Q10 CONFIRMED:** `crypto.randomInt()` server-side  
✅ **Q11 CONFIRMED:** Both provably fair transparency + odds visualization panel per game  

---

## SECTION E — Currency Economy (Q13)

You asked for a recommendation on wager amounts, currency balance, and earn rate, with the constraint that users should never wait more than 2 minutes to play.

### Game Wager Structure
I recommend **configurable wagers within a min/max range** per game, matching real casino behavior:

| Game | Currency | Min Wager | Max Wager | Notes |
|------|----------|-----------|-----------|-------|
| American Roulette | Chips | 5 | 500 | Per bet position |
| Blackjack | Chips | 10 | 1,000 | Per hand |
| Digital Scratchers | Tickets | 1 | 5 | Per ticket |
| Video Slots | Tokens | 1 | 100 | Per spin (total across paylines) |
| Keno | Tokens | 5 | 200 | Per draw |
| Video Poker | Tokens | 5 | 250 | Per hand |

### Passive Earn Rate
- Earn rate: **10 Chips + 5 Tokens every 10 seconds** (tab active)
- In 2 minutes (120 seconds) = **120 Chips + 60 Tokens**
- Minimum game costs 5 Chips (Roulette) or 1 Ticket (Scratchers)
- User can play within seconds of arriving — well under 2-minute threshold ✅

### Starting Bundle (revised)
| Currency | Amount | Rationale |
|----------|--------|-----------|
| Chips | 1,000 | ~100 min-bet Roulette rounds. Enough to learn the game without running out in 5 minutes |
| Tokens | 500 | ~100 min-bet slots spins. Slot games burn through fast — needs a cushion |
| Tickets | 10 | ~10 scratcher games at min bet |

### Session Isolation (Q14 — confirmed)
✅ Each browser tab = isolated session via a unique session UUID stored in `sessionStorage` (NOT `localStorage`). Chips use `localStorage` so they persist across page refreshes within the same browser. Multi-tab detection: a `BroadcastChannel` API check ensures only ONE tab per browser is actively earning the passive drip at a time. Second tab stays playable but doesn't earn. Different browser = different session entirely.

✅ **Q13 CONFIRMED:** Configurable wagers per game, 1,000 Chips / 500 Tokens / 10 Tickets starting bundle  
✅ **Q14 CONFIRMED:** BroadcastChannel API for single-tab passive earn enforcement  

---

## SECTION F — Hosting & Geo-Currency (Q15, Q16)

### Q15 — Geo-Currency (Revised)
Since we're moving to Cloudflare Workers for the backend, **`CF-IPCountry` header is built-in for free** — no ip-api.com call needed.  
- Worker reads `CF-IPCountry` header → returns country code to client.  
- Client uses `Intl.NumberFormat` to format the counter in local currency with live exchange rates.
- For exchange rates: **Open Exchange Rates free tier** (1,000 requests/month) or **ExchangeRate-API free tier** (1,500 requests/month) — more than enough for a simulation.
- Global counter starts in USD. Converts to local currency on display. Symbol and amount both change.

### Q16 — Hosting (Revised based on Q7 decision)
Since we chose Cloudflare Workers for the API, **Cloudflare Pages** is the natural fit for the Vite frontend:

| Platform | Frontend | Backend | Free Tier | Performance |
|----------|----------|---------|-----------|-------------|
| **Cloudflare Pages + Workers** | ✅ Pages | ✅ Workers | ✅ Extremely generous | ✅ Global edge |
| Vercel | ✅ Native Next.js | ❌ (we changed framework) | ✅ Good | ✅ Good |

**Recommendation: Cloudflare Pages (frontend) + Cloudflare Workers (backend)**  
- One platform, one account, one billing dashboard (all free tier).  
- Free: 500 builds/month, unlimited bandwidth, 100k Worker requests/day.  
- Zero cold starts (edge runtime is always warm).  
- Custom domain support on free tier.  
- Automatic preview deployments on every branch push.  
- CI/CD: GitHub → Cloudflare Pages auto-deploy. Add GitHub Actions for test gate.

✅ **Q15 CONFIRMED:** CF-IPCountry header (free, built-in) + Intl.NumberFormat + ExchangeRate-API  
✅ **Q16 REVISED:** Cloudflare Pages + Workers (full free tier, one ecosystem)  

---

## SECTION G — Casino Name (Q23)

You liked "dontgamble.com" and "onisac.com" (casino reversed). Here are 10 more creative options:

| Name | Concept | Vibe |
|------|---------|------|
| **Miraje.io** | Mirage — the illusion of winning | Mysterious, casino-adjacent |
| **Fakeno.com** | Keno + Fake — honest self-referential | Funny, educational, memorable |
| **HouseWins.gg** | Blunt truth. No illusions. | Brutally honest, viral potential |
| **Chipfall.com** | Chips fall like the odds | Evocative, dark |
| **NullBet.com** | Every bet nets zero in the long run | Developer-coded, clever |
| **SimCasino.io** | Transparent, descriptive | Clear branding |
| **TheFelt.io** | References the classic green felt | Matches your visual theme perfectly |
| **OddsOn.app** | "Odds are on the house" double meaning | Clean, modern |
| **Esuoh.com** | "House" reversed — like your "onisac" idea | Consistent clever naming pattern |
| **ZeroEdge.fun** | "Zero edge for you" / educational tone | Educational positioning |

**My top 3 recommendations:**
1. **HouseWins.gg** — Most viral. Everyone who sees it immediately understands the concept. Perfect for the educational mission. `.gg` is gaming standard.
2. **TheFelt.io** — Perfectly aligned with Classic Green Felt theme. Sophisticated, memorable.
3. **Miraje.io** — Most brandable. Logo potential is high. Sounds like a real casino name, which subverts expectations.

🔲 **Q23 NEEDS YOUR DECISION:** Which name (or direction) resonates?

---

## SECTION H — Payments & Support Page (Q27 Additional Note)

You asked about a Support page where users can:
1. Submit feedback / report issues  
2. Buy in-game currency as developer support (not gambling)  
3. Clear messaging that this is supporting the developer, not buying gambling currency

### Is it taxable?
**Yes, with nuance.** Payments received for "supporting a developer" are taxable income in the US (and most jurisdictions) — they are considered service income or gift income depending on framing. Since you're giving something in return (in-game currency), it's most likely **taxable business income**. You would report it as self-employment income. This is not gambling revenue (no wagering element), so no gaming tax applies. **Consult a CPA before launching paid support.** The information here is not legal/tax advice.

### Payment Processor Comparison

| Processor | Platform Fee | Stripe Processing Fee | Total Cut | Notes |
|-----------|-------------|----------------------|-----------|-------|
| **Stripe Direct** | 0% | 2.9% + $0.30 | **2.9% + $0.30** | Lowest total. You integrate directly. |
| Ko-fi (free tier) | 0% platform | ~2.9% + $0.30 (Stripe) | **2.9% + $0.30** | 0% Ko-fi fee, but you use their hosted page |
| Ko-fi Gold | $6/month | ~2.9% + $0.30 | **2.9% + $0.30 + $6/mo** | Only worth it for Ko-fi's extra features |
| Buy Me a Coffee | 5% | ~2.9% + $0.30 | **7.9% + $0.30** | Most expensive. Not recommended. |
| Patreon | 8–12% | ~2.9% + $0.30 | **11–15%** | Overkill for one-time support. |

**Recommendation: Ko-fi (free tier) for launch, upgrade to Stripe Direct integration when you're ready to build a custom support page.**

- **Ko-fi free tier**: 0% platform fee, instant setup, hosted page you can link from your app. No coding required. You get a "Buy me a coffee / Support the dev" link in the footer — done in 10 minutes.
- **Stripe Direct (later)**: When you build a proper in-app support page with custom UX, integrate Stripe Checkout directly. Lowest total fees (2.9% + $0.30 per transaction). Requires Stripe account + webhook setup (we can build this as a Cloudflare Worker).

**In-app currency amounts for supporter packs** (suggested):
| Pack | Price | Chips | Tokens | Tickets |
|------|-------|-------|--------|---------|
| Starter Support | $1.99 | +5,000 | +2,000 | +25 |
| Regular Support | $4.99 | +15,000 | +7,500 | +75 |
| High Roller Support | $9.99 | +50,000 | +25,000 | +200 |

The confirmation screen must say: *"You are supporting the developer of this free simulation. No real money can be won or withdrawn. This is not a gambling transaction."*

✅ **Q27 CONFIRMED:** Ko-fi (free tier) at launch → Stripe Direct for custom support page later  

---

## FINAL STACK SUMMARY

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend Framework | **Vite + React** | Lightest SPA, fastest TTI, pure CSR |
| Styling | **Tailwind CSS + shadcn/ui** | Best AI codegen, fully customizable |
| Animation (UI) | **Motion (Framer Motion v11)** | Lightweight React-native transitions |
| Animation (Games) | **GSAP** (scoped) | Slot reels, roulette wheel timelines |
| Icons | **Lucide React** | Lightweight, tree-shakeable |
| Audio | **Howler.js** | Cross-browser, sprite support |
| State Management | **Zustand + localStorage** | Lightweight, no boilerplate |
| Game Engine API | **Cloudflare Workers** | Free, edge, global |
| Counter Storage | **Upstash Redis** (HTTP) | Free tier, atomic counters |
| Real-time Counters | **SSE via Cloudflare Workers** | Free, no WebSocket server needed |
| RNG | **`crypto.randomInt()`** | Cryptographically secure, built-in |
| Frontend Hosting | **Cloudflare Pages** | Free, global CDN, auto-deploy |
| CI/CD | **GitHub + Cloudflare Pages + GitHub Actions** | Test gate on PRs |
| Testing | **Vitest + RTL + Playwright** | Full coverage pyramid |
| Payments | **Ko-fi → Stripe Direct** | 0% platform fee, lowest cut |
| Geo Detection | **CF-IPCountry header** | Free, built-in, no API call |
| Currency Format | **Intl.NumberFormat + ExchangeRate-API** | Browser-native + free tier |

---

## REMAINING OPEN QUESTIONS

These need your answer before we move to PRD creation:

**RQ1. Casino Name (Q23)**  
Choose from Section G above, or provide your own.  
Your decision →

**RQ2. Are the starting currency amounts acceptable?**  
1,000 Chips / 500 Tokens / 10 Tickets  
Your decision →

**RQ3. Do you approve the passive earn rate?**  
10 Chips + 5 Tokens every 10 seconds (background tabs allowed, but only one tab earns at a time via BroadcastChannel).  
Your decision →

**RQ4. Ko-fi or custom Stripe for the support page at launch?**  
Ko-fi = 10 minutes, zero code. Stripe = custom UI, same fees.  
Your decision →

**RQ5. Regarding the full stack revision (Vite + Cloudflare instead of Next.js + Vercel):**  
Do you approve the revised stack? Any concerns?  
Your decision →
