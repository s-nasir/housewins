# API Contract
## HouseWins.gg — Cloudflare Workers API
**Version:** 1.0  
**Base URL:** `https://api.housewins.gg` (production) | `http://localhost:8787` (local Wrangler dev)

> All endpoints are Cloudflare Worker handlers. No authentication. All game state validated via hash.

---

## Headers (all requests)
```
Content-Type: application/json
```

## Headers (all responses)
```
Content-Type: application/json
Access-Control-Allow-Origin: https://housewins.gg (and preview URLs)
CF-IPCountry: <ISO 3166-1 alpha-2 country code>  ← injected by Cloudflare automatically
```

---

## Endpoints

### GET `/api/health`
Health check. Returns 200 if Worker is live.

**Response:**
```json
{ "status": "ok", "timestamp": 1714300000000 }
```

---

### GET `/api/counters`
Returns current global counters snapshot (single fetch, not streaming).

**Response:**
```json
{
  "totalWagers": 1250000.00,
  "totalWinnings": 1137500.00,
  "netHouseProfit": 95625.00,
  "currency": "USD",
  "timestamp": 1714300000000
}
```

---

### GET `/api/counter-stream`
**SSE endpoint.** Opens a persistent Server-Sent Events connection. Pushes counter updates to all connected clients when a bet resolves.

**Response headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Event format (pushed to client):**
```
event: counters
data: {"totalWagers":1250000,"totalWinnings":1137500,"netHouseProfit":95625,"currency":"USD"}

```
*(blank line terminates each event)*

**Client usage:**
```typescript
const source = new EventSource('https://api.housewins.gg/api/counter-stream');
source.addEventListener('counters', (e) => {
  const data = JSON.parse(e.data);
  // update Zustand store
});
```

---

### GET `/api/geo`
Returns the user's detected country and local currency code.

**Response:**
```json
{
  "countryCode": "GB",
  "currencyCode": "GBP",
  "currencySymbol": "£",
  "exchangeRate": 0.789
}
```
*Exchange rate relative to USD base. Fetched from ExchangeRate-API and cached in Worker KV for 1 hour.*

---

### POST `/api/roulette/spin`
**Body:**
```json
{
  "sessionId": "uuid-v4",
  "bets": [
    { "id": "bet_1", "type": "straight", "numbers": [7], "amount": 50 },
    { "id": "bet_2", "type": "red", "numbers": [], "amount": 25 }
  ],
  "clientSeed": "optional-client-seed-string"
}
```

**Response:**
```json
{
  "outcome": {
    "result": 7,
    "resultLabel": "7 Red"
  },
  "payouts": [
    { "betId": "bet_1", "won": true, "amount": 1750 },
    { "betId": "bet_2", "won": true, "amount": 25 }
  ],
  "totalPayout": 1775,
  "netChange": +1700,
  "provablyFair": {
    "commitment": "a3f4...hash",
    "serverSeed": "revealed-seed",
    "nonce": 42
  },
  "oddsInfo": {
    "bets": [
      { "betId": "bet_1", "type": "straight", "winProbability": "2.63%", "houseEdge": "5.26%", "expectedLossPer100": "$5.26" },
      { "betId": "bet_2", "type": "red", "winProbability": "47.37%", "houseEdge": "5.26%", "expectedLossPer100": "$5.26" }
    ]
  },
  "globalCounters": {
    "totalWagers": 1250075,
    "totalWinnings": 1139275,
    "netHouseProfit": 93075
  }
}
```

---

### POST `/api/blackjack/action`
**Body:**
```json
{
  "sessionId": "uuid-v4",
  "action": "deal",
  "bet": 100,
  "handState": null
}
```
*On subsequent actions (hit/stand/double/split), `handState` contains the state object returned from the previous response.*

**Response:**
```json
{
  "handState": {
    "playerHands": [[{"suit":"hearts","rank":"A"},{"suit":"clubs","rank":"K"}]],
    "dealerHand": [{"suit":"diamonds","rank":"7"},{"suit":"hidden":"true"}],
    "phase": "PLAYER_TURN",
    "shoeHash": "hash-of-remaining-shoe",
    "bets": [100],
    "activeHandIndex": 0
  },
  "availableActions": ["hit", "stand", "double"],
  "isBlackjack": true,
  "outcome": null,
  "payouts": null,
  "provablyFair": { "commitment": "...", "serverSeed": null, "nonce": 1 },
  "oddsInfo": { "winProbability": "42.4%", "houseEdge": "0.50%", "expectedLossPer100": "$0.50" },
  "globalCounters": { "totalWagers": 1250175, "totalWinnings": 1139275, "netHouseProfit": 93075 }
}
```

---

### POST `/api/scratchers/purchase`
**Body:**
```json
{
  "sessionId": "uuid-v4",
  "ticketCount": 1
}
```

**Response:**
```json
{
  "outcome": {
    "grid": [
      ["Cherry","7","Diamond"],
      ["Crown","Cherry","Cherry"],
      ["Star","Gold","7"]
    ],
    "prizeTier": "no_win",
    "matchedSymbol": null,
    "matchCount": 0
  },
  "payouts": [{ "amount": 0, "currency": "chips" }],
  "provablyFair": { "commitment": "...", "serverSeed": "...", "nonce": 5 },
  "oddsInfo": { "winProbability": "12.5%", "houseEdge": "20%", "expectedLossPer100": "$20.00" },
  "globalCounters": { "totalWagers": 1250185, "totalWinnings": 1139275, "netHouseProfit": 93075 }
}
```

---

### POST `/api/slots/spin`
**Body:**
```json
{
  "sessionId": "uuid-v4",
  "betPerLine": 5,
  "activeLines": 20,
  "clientSeed": "optional"
}
```

**Response:**
```json
{
  "outcome": {
    "grid": [
      ["Wild","Crown","Diamond","A","K"],
      ["7","Crown","Diamond","A","Q"],
      ["Cherry","Crown","Diamond","K","Q"]
    ],
    "reelStops": [3, 7, 12, 24, 18],
    "wins": [
      { "lineIndex": 1, "symbols": ["Crown","Crown","Crown","Crown","Crown"], "payout": 500 }
    ],
    "totalPayout": 500
  },
  "provablyFair": { "commitment": "...", "serverSeed": "...", "nonce": 101 },
  "oddsInfo": { "winProbability": "varies", "houseEdge": "7%", "rtp": "93%", "expectedLossPer100": "$7.00" },
  "globalCounters": { "totalWagers": 1250285, "totalWinnings": 1139775, "netHouseProfit": 93075 }
}
```

---

### POST `/api/keno/draw`
**Body:**
```json
{
  "sessionId": "uuid-v4",
  "picks": [3, 15, 22, 47, 63, 71, 8, 44, 19, 55],
  "wager": 50
}
```

**Response:**
```json
{
  "outcome": {
    "drawn": [3,8,15,19,22,33,41,44,47,52,55,57,61,63,66,67,71,73,75,79],
    "catches": 10,
    "picks": [3,15,22,47,63,71,8,44,19,55]
  },
  "payouts": [{ "amount": 50000, "currency": "tokens" }],
  "provablyFair": { "commitment": "...", "serverSeed": "...", "nonce": 7 },
  "oddsInfo": { "houseEdge": "25%", "expectedLossPer100": "$25.00" },
  "globalCounters": { "totalWagers": 1250335, "totalWinnings": 1189775, "netHouseProfit": 51375 }
}
```

---

### POST `/api/poker/action`
**Body (deal):**
```json
{
  "sessionId": "uuid-v4",
  "action": "deal",
  "bet": 25,
  "handState": null
}
```

**Body (hold):**
```json
{
  "sessionId": "uuid-v4",
  "action": "hold",
  "bet": 25,
  "handState": { "hand": [...], "shoeHash": "...", "remainingShoe": "..." },
  "holdMask": [true, false, true, false, true]
}
```

**Response (after hold):**
```json
{
  "outcome": {
    "finalHand": [
      {"suit":"spades","rank":"A"},
      {"suit":"hearts","rank":"A"},
      {"suit":"clubs","rank":"A"},
      {"suit":"diamonds","rank":"K"},
      {"suit":"spades","rank":"K"}
    ],
    "handRank": "full_house",
    "handLabel": "Full House, Aces over Kings"
  },
  "payouts": [{ "amount": 225, "currency": "tokens" }],
  "provablyFair": { "commitment": "...", "serverSeed": "...", "nonce": 33 },
  "oddsInfo": { "houseEdge": "0.46%", "expectedLossPer100": "$0.46" },
  "globalCounters": { "totalWagers": 1250360, "totalWinnings": 1189975, "netHouseProfit": 51375 }
}
```

---

## Error Responses

All errors follow this shape:
```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Bet amount exceeds available Chips balance.",
    "details": {}
  }
}
```

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `INVALID_BET` | 400 | Bet structure malformed or out of range |
| `INSUFFICIENT_FUNDS` | 400 | Client-side balance check (informational — balance is client-side) |
| `INVALID_HAND_STATE` | 400 | Hand state hash mismatch (anti-cheat) |
| `INVALID_ACTION` | 400 | Action not valid for current game phase |
| `RATE_LIMITED` | 429 | Too many requests from this IP |
| `INTERNAL_ERROR` | 500 | Worker or Redis failure |

---

## CORS Configuration

```typescript
// wrangler.toml cors origins
const ALLOWED_ORIGINS = [
  'https://housewins.gg',
  'https://*.housewins.pages.dev',  // all preview branches
  'http://localhost:5173',           // local Vite dev
];
```
