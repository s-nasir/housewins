# Game Engine Specifications
## HouseWins.gg
**Version:** 1.0  
**Status:** Active

> Each engine is a **deep module** — one Cloudflare Worker handler per game, with a small public interface (request/response shape) hiding all math internally.

---

## Shared Contracts

### Request Shape (all games)
```typescript
{
  gameId: string,          // 'roulette' | 'blackjack' | 'scratchers' | 'slots' | 'keno' | 'poker'
  action: string,          // game-specific action (see each spec)
  bets: Bet[],             // array of bet objects (structure varies by game)
  sessionId: string,       // UUID from sessionStorage — for hand-state games
  clientSeed: string,      // optional: client-supplied seed for provably fair
}
```

### Response Shape (all games)
```typescript
{
  outcome: GameOutcome,    // game-specific result object
  payouts: Payout[],       // array of { betId, amount, currency }
  netBalance: {
    chips: number,
    tokens: number,
    tickets: number
  },
  provablyFair: {
    commitment: string,    // SHA-256(serverSeed + nonce) — sent before round
    serverSeed: string,    // revealed after round
    nonce: number
  },
  oddsInfo: OddsInfo,      // { winProbability, houseEdge, expectedLossPer100 }
  globalCounters: {
    totalWagers: number,
    totalWinnings: number,
    netHouseProfit: number // after 15% tax
  }
}
```

### RNG Module (shared)
```typescript
// Cloudflare Workers Web Crypto API
function secureRandom(min: number, max: number): number {
  const range = max - min + 1;
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return min + (buffer[0] % range);
}

function secureRandomFloat(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 0xFFFFFFFF;
}

// Fisher-Yates shuffle (for Keno, card decks)
function secureShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandom(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

### Provably Fair Module (shared)
```typescript
async function generateCommitment(serverSeed: string, nonce: number): Promise<string> {
  const data = new TextEncoder().encode(`${serverSeed}:${nonce}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

---

## 1. American Roulette

### Public Interface
- **Route:** `POST /api/roulette/spin`
- **Action:** `spin`

### Bet Types Supported
| Bet Type | Positions | Payout |
|----------|-----------|--------|
| Straight Up | 1 number (0–37, where 37 = 00) | 35:1 |
| Split | 2 adjacent numbers | 17:1 |
| Street | 3 numbers in a row | 11:1 |
| Corner | 4 numbers | 8:1 |
| Five Number | 0, 00, 1, 2, 3 | 6:1 |
| Six Line | 6 numbers | 5:1 |
| Column | 12 numbers | 2:1 |
| Dozen | 1st/2nd/3rd 12 | 2:1 |
| Red/Black | 18 numbers | 1:1 |
| Even/Odd | 18 numbers | 1:1 |
| Low/High | 1–18 / 19–36 | 1:1 |

### Math
```
House Edge = 2/38 = 5.26% (two zeros on 38-slot wheel)
EV per $1 bet (Straight Up) = (1/38 × 35) - (37/38 × 1) = -0.0526
```

### Engine Logic
```typescript
function spinRoulette(bets: RouletteBet[]): RouletteOutcome {
  const result = secureRandom(0, 37); // 0=0, 37=00, 1-36=numbers
  const payouts = bets.map(bet => ({
    betId: bet.id,
    amount: calculateRoulettePayout(bet, result)
  }));
  return { result, payouts };
}
```

### State
Stateless — no session state required.

### Odds Info Returned
```typescript
{ winProbability: "2.63%", houseEdge: "5.26%", expectedLossPer100: "$5.26" }
// varies by bet type placed
```

---

## 2. Classic Blackjack

### Public Interface
- **Route:** `POST /api/blackjack/action`
- **Actions:** `deal` | `hit` | `stand` | `double` | `split`

### Rules
- 6-deck shoe (312 cards), reshuffled when < 52 cards remain
- Dealer stands on soft 17
- Blackjack pays 3:2
- Double on any two cards
- Split up to 3 times (no re-split aces)
- No surrender
- House Edge: ~0.5%

### State Machine
```
IDLE → DEAL → PLAYER_TURN → (HIT | STAND | DOUBLE | SPLIT) → DEALER_TURN → RESOLVE → IDLE
```

### Hand State (stored in Cloudflare KV or returned to client)
Since no server-side sessions exist, hand state is returned to the client and re-submitted with each action. The Worker validates the state hash to prevent cheating.

```typescript
type BlackjackHandState = {
  playerHands: Card[][],    // supports splits
  dealerHand: Card[],
  shoe: Card[],             // remaining deck (hashed)
  shoeHash: string,         // SHA-256 of shoe state — server validates on next action
  phase: GamePhase,
  bets: number[],
  activeHandIndex: number
}
```

### Engine Logic (key functions)
```typescript
function calculateHandValue(hand: Card[]): { value: number, soft: boolean }
function dealerPlay(hand: Card[], shoe: Card[]): { finalHand: Card[], shoe: Card[] }
function resolveHand(playerHand: Card[], dealerHand: Card[], bet: number): number
// Returns: positive = player wins that amount, negative = player loses
```

### Odds Info
```typescript
{ winProbability: "42.4%", houseEdge: "0.50%", expectedLossPer100: "$0.50" }
// Note: win prob excludes push (8.5%), dealer blackjack (4.7%)
```

---

## 3. Digital Scratchers

### Public Interface
- **Route:** `POST /api/scratchers/purchase`
- **Action:** `purchase`

### Prize Distribution (Weighted Pool)
| Prize | Probability | Payout (in Chips) |
|-------|-------------|-------------------|
| Jackpot (3× Gold Bar) | 1 in 5,000 | 10,000 |
| Major (3× Diamond) | 1 in 500 | 1,000 |
| Mid (3× 7) | 1 in 100 | 200 |
| Small (3× Cherry) | 1 in 20 | 50 |
| Mini (3× Star) | 1 in 8 | 15 |
| No Win | ~85% | 0 |

House Edge: ~20%

### Engine Logic
```typescript
function generateScratcherResult(ticketCost: number): ScratcherGrid {
  // Pre-generate 9 symbols for a 3×3 grid
  // First, determine prize tier using weighted RNG
  // Then fill grid: winning tier = 3 matching symbols + 6 random
  // Losing result = no 3-of-a-kind (guaranteed by construction)
  const prizeTier = weightedRandom(PRIZE_TABLE);
  return buildGrid(prizeTier);
}
```

### State
Stateless — result fully determined at purchase time, returned to client.

---

## 4. Video Slots (5-Reel, 20 Fixed Paylines)

### Public Interface
- **Route:** `POST /api/slots/spin`
- **Action:** `spin`

### Reel Configuration (Weighted Stops)
Each reel has 32 virtual stops. Symbol weights are NOT equal (creates near-miss effect):

| Symbol | Reel 1 | Reel 2 | Reel 3 | Reel 4 | Reel 5 |
|--------|--------|--------|--------|--------|--------|
| Wild | 2 | 2 | 2 | 1 | 1 |
| Jackpot (7) | 1 | 1 | 1 | 1 | 1 |
| High (Crown) | 3 | 3 | 2 | 2 | 2 |
| Mid (Diamond) | 4 | 4 | 4 | 3 | 3 |
| Low (A) | 5 | 5 | 5 | 6 | 6 |
| Low (K) | 5 | 5 | 5 | 6 | 6 |
| Low (Q) | 6 | 6 | 7 | 7 | 7 |
| Blank | 6 | 6 | 6 | 6 | 6 |

RTP: ~93% (House Edge: ~7%)

### Payline Definitions (20 fixed lines)
Lines defined as row index per reel (0=top, 1=mid, 2=bottom):
```typescript
const PAYLINES: number[][] = [
  [1,1,1,1,1], // Line 1: Middle horizontal
  [0,0,0,0,0], // Line 2: Top horizontal
  [2,2,2,2,2], // Line 3: Bottom horizontal
  [0,1,2,1,0], // Line 4: V-shape
  [2,1,0,1,2], // Line 5: Inverted V
  // ... 15 more zigzag patterns
];
```

### Engine Logic
```typescript
function spinReels(betPerLine: number): SlotsOutcome {
  const reelStops = REELS.map(reel => {
    const stopIndex = secureRandom(0, reel.totalWeight - 1);
    return getSymbolAtStop(reel, stopIndex);
  });
  const grid = buildVisibleGrid(reelStops); // 3 rows × 5 reels
  const wins = evaluatePaylines(grid, PAYLINES, betPerLine);
  return { grid, reelStops, wins, totalPayout: wins.reduce((s, w) => s + w.amount, 0) };
}
```

### Odds Info
```typescript
{ winProbability: "varies by combo", houseEdge: "7%", expectedLossPer100: "$7.00", rtp: "93%" }
```

---

## 5. Keno

### Public Interface
- **Route:** `POST /api/keno/draw`
- **Action:** `draw`

### Payout Table (Hypergeometric Distribution)
Player picks N numbers (1–10). 20 drawn from 80.

Example for 10 picks:
| Catches | Payout (× wager) |
|---------|-----------------|
| 10 | 1,000× |
| 9 | 100× |
| 8 | 25× |
| 7 | 8× |
| 6 | 3× |
| 5 | 1× |
| 0–4 | 0 |

House Edge: ~25%

### Engine Logic
```typescript
function drawKeno(playerPicks: number[]): KenoOutcome {
  const pool = Array.from({ length: 80 }, (_, i) => i + 1);
  const drawn = secureShuffle(pool).slice(0, 20);
  const catches = playerPicks.filter(n => drawn.includes(n)).length;
  const payout = KENO_PAYOUT_TABLE[playerPicks.length][catches] ?? 0;
  return { drawn, catches, payout };
}
```

---

## 6. Video Poker — Jacks or Better

### Public Interface
- **Route:** `POST /api/poker/action`
- **Actions:** `deal` | `hold`

### Rules
- 52-card deck (no jokers)
- Full Pay 9/6 table: Full House pays 9×, Flush pays 6×
- House Edge: 0.46% (with perfect strategy)

### Pay Table
| Hand | Payout (× bet) |
|------|----------------|
| Royal Flush | 800× |
| Straight Flush | 50× |
| Four of a Kind | 25× |
| Full House | 9× |
| Flush | 6× |
| Straight | 4× |
| Three of a Kind | 3× |
| Two Pair | 2× |
| Jacks or Better | 1× |
| Everything else | 0 |

### Engine Logic
```typescript
function dealPokerHand(shoe: Card[]): PokerDealResult {
  const shuffled = secureShuffle(shoe);
  return { hand: shuffled.slice(0, 5), remainingShoe: shuffled.slice(5) };
}

function drawReplacements(hand: Card[], holdMask: boolean[], shoe: Card[]): Card[] {
  return hand.map((card, i) => holdMask[i] ? card : shoe.shift()!);
}

function evaluateHand(hand: Card[]): HandRank {
  // Evaluate: Royal Flush → Straight Flush → 4oaK → Full House → Flush → Straight → 3oaK → TwoPair → Pair(JJ+) → High Card
}
```

### State
Dealt hand + remaining shoe returned to client, re-submitted on `hold` action with shoe hash validation.

---

## Global Counter Update (all games, post-resolution)

```typescript
async function updateGlobalCounters(wagerAmount: number, payoutAmount: number, redis: Redis) {
  await redis.incrbyfloat('global:wagers', wagerAmount);
  await redis.incrbyfloat('global:winnings', payoutAmount);
}

function computeDisplayCounters(wagers: number, winnings: number) {
  const gross = wagers - winnings;
  const net = gross * 0.85; // 15% simulated tax
  return { totalWagers: wagers, totalWinnings: winnings, netHouseProfit: net };
}
```
