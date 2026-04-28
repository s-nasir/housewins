# Casino Sim — Pre-Development Interview Questions
> Answer each question to help us build shared understanding before writing a single line of code.  
> Format: **Your decision** → [answer here]

---

## 1. Project Lifecycle & Development Methodology

**Q1. What software development cycle should we use?**  
I recommend **AI-Driven Iterative Agile** — short sprints (1–2 weeks), each sprint producing a working slice of the app that AI generates, you review, and we refine. Since all code is AI-generated, traditional peer review is replaced by prompt review + output validation. Alternatives:  
- **Waterfall**: Plan everything first, build linearly. Safer for documentation but rigid — bad fit for AI-gen since prompts evolve.  
- **Feature-based Kanban**: No sprints, just a backlog. Good if you want to move at your own pace without sprint pressure.  
- **Spike-then-build**: Short R&D spikes per game to validate math and UI feasibility, then build in one pass. Good for high-complexity games like Slots and Roulette.

**Your decision →** I will go forward with **AI-Driven Iterative Agile**. But we will define and create a clear system, taking inspiration from concepts explained in @ai-workflow-walkthrough.md document in the current directory. We will create clear workflows defining how I will operate, and how agents will operate.

---

**Q2. What documentation artifacts should we create and maintain?**  
I recommend the following (in creation order):  
1. **PRD (Product Requirements Doc)** — single source of truth for all features  
2. **Architecture Decision Record (ADR)** — documents *why* we chose each tool/framework  
3. **Game Engine Specs** — per-game math, RNG, and state machine definitions  
4. **API Contract Doc** — all endpoints, payloads, and response shapes  
5. **UI/UX Wireframe Doc** — page layouts and component map  
6. **Deployment Runbook** — how to build, test, and push to prod  
7. **QA/Test Plan** — what we verify per game and per feature  

We can trim this if you want to move faster. Which of these feel essential vs. optional to you?

**Your decision →** We will create 1 through 5. Documentation 6 will be created after we clear system of development cycle from Qestion 1. Document 7 will be create later in development phase, I will determine the best time to create it.

---

## 2. Tech Stack — Frontend

**Q3. What frontend framework should we use?**  
I recommend **Next.js (React)** — it handles both frontend and lightweight backend (API routes), has massive AI training data so AI code gen is most accurate, supports SSR/SSG for fast loads, and has a huge component ecosystem. Alternatives:  
- **Vite + React (SPA only)**: Simpler, no server-side. Fine if we use a separate backend.  
- **SvelteKit**: Leaner bundle, great performance, but less AI training data = less reliable AI codegen.  
- **Astro**: Best for static/content-heavy sites. Too limited for real-time game interactivity.  

**Your decision →** I like your recommendation. Before we proceed, let's do more research to make sure it is the best option for our project. From my experience, our backend requires strong logic, but doesn't require handling of intensive API calls or complex database queries. Therefore, Priority 1 is having the an as lightweight as possible frontend framework. Priority 2 is having exceptional UI/UX experience, with the best AI created game design animations and visuals, with respect to the lightweight framwork. Our website should be smooth, fast, and crisp with no lags, no bloat, and no slow loading pages. Priority 3 is having the best animation library that can handle complex game animations while maintaining performance. And a global priority when it comes to all priority requirements is that the AI agents be able to use the framework and libraries effectively to satisfy all requirements.
Evaluate you options again, and ask this question again with revised recommendations. 

**Q4. What CSS/UI framework should we use?**  
I recommend **Tailwind CSS + shadcn/ui** — Tailwind gives utility-first styling (perfect for AI codegen, since AI knows it extremely well), and shadcn gives accessible pre-built components we can skin to look like a casino. Alternatives:  
- **Chakra UI**: Component library, easier but less customizable for a casino aesthetic.  
- **MUI (Material UI)**: Very polished but carries a "corporate app" look — hard to make feel like a casino.  
- **Plain CSS/SCSS**: Full control, but AI codegen produces inconsistent output without a framework constraint.  

**Your decision →** Priority 1 is having the an as lightweight as possible frontend framework. Priority 2 is having exceptional UI/UX experience, with the best AI created game design animations and visuals, with respect to the lightweight framwork. Our website should be smooth, fast, and crisp with no lags, no bloat, and no slow loading pages. Priority 3 is having the best animation library that can handle complex game animations while maintaining performance. And a global priority when it comes to all priority requirements is that the AI agents be able to use the framework and libraries effectively to satisfy all requirements.
Evaluate you options again, and ask this question again with revised recommendations. 

---

**Q5. What animation library should we use?**  
This is critical given your requirement for lightweight but visually stunning animations. I recommend **Framer Motion** for UI transitions + **GSAP (GreenSock)** for complex game animations (roulette wheel spin, card deal, slot reel spin). Alternatives:  
- **Framer Motion only**: Excellent for React, but not powerful enough for synchronized slot reel animations.  
- **CSS animations only**: Very lightweight, zero JS overhead, but too limited for game-grade animations.  
- **Three.js / React Three Fiber**: Full 3D support — overkill unless you want a 3D roulette wheel specifically.  
- **Lottie**: JSON-based animations, great for pre-made effects but inflexible for interactive game states.  

**Your decision →** *Priority 1 is having the an as lightweight as possible frontend framework. Priority 2 is having exceptional UI/UX experience, with the best AI created game design animations and visuals, with respect to the lightweight framwork. Our website should be smooth, fast, and crisp with no lags, no bloat, and no slow loading pages. Priority 3 is having the best animation library that can handle complex game animations while maintaining performance. And a global priority when it comes to all priority requirements is that the AI agents be able to use the framework and libraries effectively to satisfy all requirements.
Evaluate you options again, and ask this question again with revised recommendations. 

---

**Q6. What icon library should we use?**  
I recommend **Lucide React** — lightweight, consistent, and perfectly supported by AI codegen. Alternatives:  
- **Heroicons**: Similar quality, slightly fewer icons.  
- **Font Awesome**: Massive icon set, but heavier and licensing concerns on some icons.  

**Your decision →**Priority 1 is having the an as lightweight as possible frontend framework. Priority 2 is having exceptional UI/UX experience, with the best AI created game design animations and visuals, with respect to the lightweight framwork. Our website should be smooth, fast, and crisp with no lags, no bloat, and no slow loading pages. Priority 3 is having the best animation library that can handle complex game animations while maintaining performance. And a global priority when it comes to all priority requirements is that the AI agents be able to use the framework and libraries effectively to satisfy all requirements.
Evaluate you options again, and ask this question again with revised recommendations. 

---

## 3. Tech Stack — Backend

**Q7. Where should the game engine logic live?**  
I recommend **Next.js API Routes (serverless functions)** — keeps everything in one repo, stateless per-request, auto-scales, and zero server management. Each game engine is a serverless function. Alternatives:  
- **Dedicated Node.js/Express server**: More control over WebSockets and persistent connections, but requires a separate server to host and manage.  
- **Python FastAPI backend**: Excellent for math-heavy logic, but adds a second language and deployment target — harder for AI to keep consistent across the stack.  
- **Edge Functions (Cloudflare Workers)**: Ultra-low latency globally, but limited runtime (no Node.js APIs, 128MB memory limit).  

**Your decision →**Priority 1 is having the an as lightweight as possible frontend framework. Priority 2 is having exceptional UI/UX experience, with the best AI created game design animations and visuals, with respect to the lightweight framwork. Our website should be smooth, fast, and crisp with no lags, no bloat, and no slow loading pages. Priority 3 is having the best animation library that can handle complex game animations while maintaining performance. And a global priority when it comes to all priority requirements is that the AI agents be able to use the framework and libraries effectively to satisfy all requirements.
Evaluate you options again, and ask this question again with revised recommendations. 

---

**Q8. How should the global house profit and player winnings counters be stored and synced?**  
These are the only "server-side persistent" data in your app. I recommend **Upstash Redis (serverless Redis)** — free tier (10,000 requests/day), globally replicated, sub-millisecond reads, and perfect for counters with atomic increments. Alternatives:  
- **PlanetScale (MySQL serverless)**: More structure, but overkill for two counters.  
- **Supabase Postgres**: Free tier, real-time subscriptions built-in (could push counter updates to clients via WebSocket), but heavier setup.  
- **Firebase Realtime Database**: Easy real-time sync, but Google ecosystem lock-in and data rules complexity.  
- **Vercel KV (also Upstash under the hood)**: One-click setup if we deploy to Vercel — potentially the simplest option.  

**Your decision →** I want a complete free tier option. If upstash redis fits that criteria, then I like the upstash redis option. Ideally I want the global counters to be updated in real time on a free tier server, but I am willing to make the sub 5 second polling option compromise for free tiers.    

---

**Q9. Do we need WebSockets, or is HTTP polling sufficient?**  
Your doc states counters update every 5 seconds via polling. I recommend **HTTP polling** to start — simple, no infrastructure overhead, and sufficient for a counter that doesn't need millisecond precision. We can upgrade later. Alternatives:  
- **WebSockets (Socket.io or native)**: True real-time push to all clients. Required if you want the counter to feel "live" like a stock ticker. Needs a persistent server (not serverless).  
- **Server-Sent Events (SSE)**: One-way real-time push from server to client. Simpler than WebSockets, works with serverless. A good middle ground.  

**Your decision →** If websockets can be done for free or extremely minimal cost, then I like the websockets option because a live stock ticker feeling would be nice. Otherwise, lets go with your recommendation. 

---

## 4. RNG & Game Integrity

**Q10. How should we implement the Random Number Generator?**  
I recommend **`crypto.getRandomValues()` (Web Crypto API)** on the server side (available in Node.js as `crypto.randomInt()`) — cryptographically secure, no external dependency, and passes statistical randomness tests. Alternatives:  
- **`Math.random()`**: Fast but NOT cryptographically secure — predictable and exploitable if anyone reverse-engineers the seed. Not recommended for any casino simulation.  
- **Third-party RNG service (RANDOM.org API)**: True hardware random numbers. Adds latency and a paid API call per spin. Overkill for a simulation.  

**Your decision →** Lets go with your recommendation.

---

**Q11. Should we implement provably fair / verifiable RNG for transparency?**  
I recommend **yes** — since your stated purpose is educational ("understand the odds"), showing users a seed/hash they can verify builds credibility. This is a simple SHA-256 hash of the seed + nonce revealed after the round. Alternatives:  
- **No**: Simpler, invisible to 99% of users. Faster to build.  

**Your decision →** I need more context of what you mean by 'fair'. Similar to how the players play unfair odds and mostly lose due to house edge, the RNG should be designed to ensure that the house always has an edge in the long run. However, I want to display that there is still RNG, and I want to visualize how low the player's odds are compared to the house for all games. Determine how this can be done.

---

## 5. Session, Currency & Local Storage

**Q12. How should in-session currency state be managed on the client?**  
I recommend **Zustand** (lightweight React state manager) + **localStorage persistence** — Zustand handles in-memory game state, and we persist to localStorage on every balance change so a page refresh within the same session doesn't wipe the balance. Alternatives:  
- **React Context + useReducer**: No extra library, but can cause re-render performance issues during fast game loops (e.g., slots spinning rapidly).  
- **Redux Toolkit**: More powerful but far more boilerplate — overkill for this use case.  
- **Just localStorage with no state manager**: Works but creates messy prop-drilling across components.  

**Your decision →** Lets go with your recommendation.

---

**Q13. What should the starting currency bundle be when a user first visits?**  
Your doc mentions a welcome "bonus pack." I recommend a tiered welcome pack:  
- **500 Chips** (standard play currency)  
- **100 Tokens** (for slots/keno/poker)  
- **5 Tickets** (for scratchers and jackpot games)  

And the passive earn rate of 10 Chips per 10 seconds of active focus (tab must be in focus, using the Page Visibility API). Alternatives: different amounts — what feels right for the economy balance you want?

**Your decision →** First we need to determine are all games a fixed price, or do they have variable prices? Or are their wagers configurable? Similar to a casino, I don't want a user to wait more that 2 mins to earn enough currency to play a game. We need to balance the ideal rate of passive credit earnings where we don't give too much away, but also don't make it too difficult for users to play. Figure these out and make a recommendation.

---

**Q14. Should we implement anti-abuse for the passive chip drip?**  
The 10-chip-per-10-seconds rule requires the tab to be in focus. I recommend using the **Page Visibility API + `requestAnimationFrame` heartbeat** to detect genuine focus vs. background tab. We should also debounce rapid tab-switching. Without this, users can auto-farm chips with simple scripts. Alternatives:  
- **No protection**: Simpler. Since chips are free anyway, abuse is low-impact.  
- **Server-validated drip**: Client requests chips from the server every 10s, server validates timing. Harder to abuse but adds API calls.  

**Your decision →** Lets keep it no protection. Users can tab out and earn passively. BUT, they can't have multiple tabs open and earn simultaneously on the same session. They can use a different browser, and that will be different session. Therefore, each session is isolated.

---

## 6. Geo-Currency & Localization

**Q15. How should we detect the user's country and display local currency?**  
I recommend **ip-api.com (free tier, no key needed)** for IP-based country detection + the **Intl.NumberFormat browser API** for formatting currency amounts. This is zero-cost and zero-config. Alternatives:  
- **Cloudflare's `CF-IPCountry` header**: If we deploy to Cloudflare Pages, this is free and built-in — no external API call.  
- **MaxMind GeoIP (paid)**: Most accurate, but $24+/month.  
- **Browser `navigator.language`**: Not location-accurate (a Japanese person in the US would get USD), but zero latency.  

**Your decision →** *(Note: since chips are fictional currency, do you want the symbol to change visually, or the actual exchange-rate-equivalent amount to change?)* Let's go with your recommendation. Even though the counter is fictional, we will start counters in USD. On country change, the amount will be converted to the local currency, and the symbol will change visually.

---

## 7. Deployment & Hosting

**Q16. Where should we host the application?**  
I recommend **Vercel (free Hobby tier)** — zero-config Next.js deployment, global CDN, serverless functions included, custom domain support, and automatic preview deployments per branch. For your scale (free simulation site), the free tier is more than sufficient. Alternatives:  
- **Netlify**: Similar free tier, but Next.js serverless functions are less natively supported (requires adapter).  
- **Cloudflare Pages**: Extremely fast global edge delivery, very generous free tier, but API routes must use Edge Runtime (limited Node.js APIs).  
- **Railway / Render**: Good if we need a persistent server (for WebSockets), free tier available but servers sleep after inactivity.  
- **GitHub Pages**: Free but static-only — no serverless functions. Doesn't work for our backend needs.  

**Your decision →** Lets go with your recommendation, this may change based on our revision of earlier framwork questions. Take that into account before finalizing. 

---

**Q17. Do you have a domain name, or should we use the free subdomain provided by the host?**  

**Your decision →** Lets go with the free subdomain for now.

---

**Q18. What should the CI/CD pipeline look like?**  
I recommend **GitHub + Vercel auto-deploy** — push to `main` branch = automatic production deploy. Push to any feature branch = automatic preview URL. No manual steps needed. Alternatives:  
- **GitHub Actions custom pipeline**: More control (run tests before deploy), but more setup.  
- **Manual deploy via CLI**: Simplest, but error-prone.  

**Your decision →** *(Do you want automated testing to block a deploy if tests fail?)* This question will be answered after we finalize development methodology from question 1. And also after you refer and understand the ./ai-workflow-walkthrough.md document.

---

## 8. Testing Strategy

**Q19. What testing approach should we use?**  
Since all code is AI-generated, testing is critical for catching logic errors (especially in game math). I recommend a 3-layer strategy:  
- **Unit tests (Vitest)**: Per game engine — verify RNG ranges, payout math, house edge calculations.  
- **Component tests (React Testing Library)**: Verify UI renders correct states (win screen, lose screen, balance update).  
- **E2E tests (Playwright)**: Simulate a full user session — visit site, play a round of each game, verify balance changes.  

Alternatives:  
- **Jest instead of Vitest**: Jest is older, slower, but more commonly seen in tutorials. Vitest is faster and works natively with Vite/Next.js.  
- **No automated testing, manual QA only**: Faster to start, but risky with AI codegen — math bugs can be subtle.  
- **Cypress instead of Playwright**: Playwright is faster and more reliable in CI. Cypress is more beginner-friendly.  

**Your decision →** This question will be answered after we finalize development methodology from question 1. And also after you refer and understand the ./ai-workflow-walkthrough.md document.

---

## 9. Game-Specific UX Decisions

**Q20. For the Roulette wheel — 2D or 3D?**  
I recommend **2D with high-quality CSS/Canvas animation** — achieves 90% of the visual wow factor at 10% of the complexity. A 3D wheel (Three.js) would triple development time and add significant bundle weight. Alternatives:  
- **3D (React Three Fiber + Three.js)**: Spectacular visually, but complex to build with AI and heavy for mobile browsers.  
- **Pre-rendered video/GIF loop**: Fake but fast. Not interactive.  

**Your decision →** Lets go with your recommendation. 2D. 

---

**Q21. Should the Slots game have a fixed payline count or adjustable?**  
I recommend **20 fixed paylines** (industry standard for 5-reel) — simplifies math and UI while feeling authentic. Alternatives:  
- **Adjustable (1–25 paylines)**: More authentic to real slots, but adds UI complexity and requires per-payline bet tracking.  
- **243 ways-to-win (no paylines)**: Modern slots mechanic, simpler math, no payline grid UI needed.  

**Your decision →** Lets go with your recommendation. 

---

**Q22. Should we have audio/sound effects?**  
I strongly recommend **yes** — casino ambience, chip sounds, win jingles, and spin sounds are critical to the psychological experience of casino simulation. I recommend using **Howler.js** for audio management (handles autoplay policy, audio sprites, and cross-browser quirks). Alternatives:  
- **Web Audio API directly**: More control, but complex boilerplate.  
- **No audio**: Silent casino. Kills immersion. Not recommended.  

**Your decision →** Lets go with your recommendation. Yes, with mute toggle.

---

## 10. Branding & Design Direction

**Q23. What should the casino be named?**  
The name affects the domain, logo, color scheme, and overall brand identity.

**Your decision →** I want to use a catchy website name, like 'dontgamble.com' or 'onisac.com'(casino flipped). Recommend other creative and clever names. We will follow a casino theme overall in our branding and design.

---

**Q24. What visual theme should the casino have?**  
I recommend picking one strong aesthetic direction to guide all UI decisions:  
- **A. Dark Luxury** — Deep blacks, gold accents, velvet textures. Feels like a high-end Vegas VIP room.  
- **B. Neon Cyberpunk** — Dark backgrounds, electric neon glows (cyan/magenta/yellow). Futuristic digital casino.  
- **C. Classic Green Felt** — Traditional casino table green, cream, and burgundy. Familiar and trustworthy.  
- **D. Modern Minimalist** — Clean whites, bold typography, subtle gradients. Sophisticated but approachable.  

**Your decision →** Lets go with **C. Classic Green Felt**, it should feeled intoxicating yet comforting.

---

**Q25. Should we support mobile / responsive design from day one?**  
I recommend **yes, mobile-first** — casino games are increasingly played on mobile. Tailwind makes responsive design trivial with breakpoint prefixes. The betting grid and roulette table will need special attention on small screens. Alternatives:  
- **Desktop-only first**: Faster to build initially, add mobile later. Risk: retrofitting responsive design is always harder than building it in.  

**Your decision →** Lets go with **yes, mobile-first**.

---

## 11. Legal & Compliance (Even for a Simulation)

**Q26. Should we display a disclaimer that this is a simulation and not real gambling?**  
I strongly recommend **yes** — a persistent footer/modal disclaimer: *"This is a free simulation. No real money is used or can be won. For educational purposes only."* This is a legal safeguard and aligns with your stated purpose. Alternatives:  
- **Disclaimer on landing page only**: Less intrusive but less protective.  
- **None**: Not recommended.  

**Your decision →** YES. A pop up terms disclaimer should always be displayed on a new user session/first visit. This pop-up should also be accessible from the main page footer.  

---

**Q27. Should we add a "Responsible Gambling" informational section?**  
I recommend **yes** — a link to resources like the National Problem Gambling Helpline. Strengthens legitimacy and educational positioning. Alternatives:  
- **No**: Simpler. But given the subject matter, some users may need it.  

**Your decision →** YES. A link to resources like the National Problem Gambling Helpline should be added to the main page footer.

**Additional Note:** I want to add a Support page/pop-up that allows users to submit feedback, report issues, and buy in-game currency with a clear confirmation note that they are supporting the developer and not gambling. Figure out how we can setup a payment gateway for this, and is this taxable. We will not implement payment gateways, and use third party like stripe. But find the best option with minimal cut to the third party service.  

---

## Summary Checklist
| # | Topic | Status |
|---|-------|--------|
| 1 | Dev cycle / methodology | ⬜ |
| 2 | Documentation artifacts | ⬜ |
| 3 | Frontend framework | ⬜ |
| 4 | CSS/UI library | ⬜ |
| 5 | Animation library | ⬜ |
| 6 | Icon library | ⬜ |
| 7 | Game engine location | ⬜ |
| 8 | Global counter storage | ⬜ |
| 9 | WebSockets vs polling | ⬜ |
| 10 | RNG implementation | ⬜ |
| 11 | Provably fair RNG | ⬜ |
| 12 | Client state manager | ⬜ |
| 13 | Starting currency amounts | ⬜ |
| 14 | Anti-abuse chip drip | ⬜ |
| 15 | Geo-currency detection | ⬜ |
| 16 | Hosting platform | ⬜ |
| 17 | Domain name | ⬜ |
| 18 | CI/CD pipeline | ⬜ |
| 19 | Testing strategy | ⬜ |
| 20 | Roulette 2D vs 3D | ⬜ |
| 21 | Slots payline model | ⬜ |
| 22 | Audio / sound effects | ⬜ |
| 23 | Casino name | ⬜ |
| 24 | Visual theme | ⬜ |
| 25 | Mobile responsive | ⬜ |
| 26 | Simulation disclaimer | ⬜ |
| 27 | Responsible gambling section | ⬜ |
