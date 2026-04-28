# Issue 005: Global Counter — SSE + Upstash Redis + Geo Currency
**Sprint:** 1
**Type:** AFK
**Blocking:** none
**Blocked by:** issue-001
**Files to create/modify:**
- `workers/housewins-api/src/routes/counters.ts`
- `workers/housewins-api/src/routes/geo.ts`
- `workers/housewins-api/src/lib/redis.ts`
- `workers/housewins-api/src/index.ts` (add routes)
- `workers/housewins-api/src/__tests__/counters.test.ts`
- `src/store/globalCounter.store.ts`
- `src/hooks/useCounterSSE.ts`

## Acceptance Criteria

### Worker side
- [ ] `GET /api/counter-stream` opens an SSE stream (`Content-Type: text/event-stream`)
- [ ] Worker reads `global:wagers` and `global:winnings` from Upstash Redis on connection
- [ ] Worker sends initial `counters` event immediately on connection
- [ ] Worker sends updated `counters` event after every bet (triggered by game route resolvers calling `broadcastCounters()`)
- [ ] `GET /api/counters` returns a one-time JSON snapshot (for initial page load before SSE connects)
- [ ] `GET /api/geo` returns `{ countryCode, currencyCode, currencySymbol, exchangeRate }` using `CF-IPCountry` header + ExchangeRate-API (cached 1 hour in KV)
- [ ] All counter arithmetic uses `INCRBYFLOAT` (atomic)
- [ ] Worker unit tests mock Upstash Redis

### Frontend side
- [ ] `useGlobalCounterStore` (Zustand) stores `totalWagers`, `totalWinnings`, `netHouseProfit`, `displayCurrency`
- [ ] `useCounterSSE` hook opens `EventSource('/api/counter-stream')` and updates the store on each event
- [ ] Hook auto-reconnects on connection loss (EventSource does this natively — verify it works)
- [ ] Header global counter displays values formatted via `Intl.NumberFormat` in detected local currency
- [ ] Counter values animate up on change (Motion `useSpring` or count-up effect)
- [ ] All tests pass

## Out of Scope
- Counter broadcasting from game engines is done per-game in Sprint 3–6
- For now, `/api/counter-stream` can send a heartbeat every 30s to keep connection alive

## Notes
- See `docs/api-contract.md` — `/api/counter-stream` and `/api/geo` endpoints
- Upstash Redis credentials go in `.dev.vars` locally and `wrangler secret` for production
- ExchangeRate-API free tier: https://open.er-api.com/v6/latest/USD (no key needed for basic)
