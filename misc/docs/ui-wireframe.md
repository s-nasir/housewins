# UI/UX Wireframe Document
## HouseWins.gg
**Version:** 1.0  
**Theme:** Classic Green Felt — intoxicating yet comforting  
**Approach:** Mobile-first (375px base), scales up to 1440px desktop

> This document defines layout structure, component hierarchy, and interaction patterns. It is the reference for all UI implementation issues.

---

## Design Tokens

### Colors
```css
--color-felt:       #1B4332;   /* primary background — deep casino green */
--color-felt-light: #2D6A4F;   /* card surfaces, elevated panels */
--color-felt-dark:  #0D2B1E;   /* header, footer, deep shadows */
--color-cream:      #F5F0E8;   /* primary text, card faces */
--color-gold:       #C9A84C;   /* accents, win highlights, CTAs */
--color-gold-light: #E8C96A;   /* hover states on gold elements */
--color-burgundy:   #7B1D1D;   /* danger states, loss indicators */
--color-burgundy-light: #A63030; /* hover on loss states */
--color-chip-red:   #C0392B;
--color-chip-blue:  #2471A3;
--color-chip-green: #1E8449;
--color-chip-black: #212121;
--color-chip-white: #F0F0F0;
```

### Typography
```css
--font-display: 'Playfair Display', Georgia, serif;   /* headings, logo, game titles */
--font-body:    'Inter', system-ui, sans-serif;        /* UI text, labels, numbers */
--font-mono:    'JetBrains Mono', monospace;           /* counter values, odds display */
```

### Spacing (Tailwind custom scale)
Base unit: 4px. All spacing multiples of 4px.

### Shadows
```css
--shadow-card: 0 4px 24px rgba(0,0,0,0.4);
--shadow-chip: 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
--shadow-glow-gold: 0 0 16px rgba(201,168,76,0.4);    /* win state glow */
```

---

## Global Layout Shell

```
┌─────────────────────────────────────────────────┐
│  HEADER                                          │
│  [Logo]  [House: $X | Players: $Y]  [🪙 Bal] [🔇]│
├─────────────────────────────────────────────────┤
│                                                  │
│  PAGE CONTENT (varies by route)                  │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER (lobby only)                             │
│  [Disclaimer] [Responsible Gambling] [Support ♥] │
└─────────────────────────────────────────────────┘
```

### Header Component
- **Logo:** "HouseWins.gg" in Playfair Display, gold color, left-aligned
- **Global Counter:** Center or right — two values:
  - "House: $X,XXX,XXX" (NetHouseProfit, updates via SSE, animated count-up on change)
  - "Players Won: $X,XXX,XXX" (TotalWinnings, same)
  - Values formatted via `Intl.NumberFormat` in local currency
- **Balance Display:** Three pill badges — `🪙 1,000 Chips` | `🎫 500 Tokens` | `🎟 10 Tickets`
  - On mobile: collapsed to icon + total, expands on tap
- **Mute Toggle:** 🔊 / 🔇 icon button, top-right corner
- **Back Arrow:** Game pages only — returns to lobby

---

## Page 1: Lobby (`/`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗        │
│  ║  WELCOME BANNER                       ║        │
│  ║  "The House Always Wins."             ║        │
│  ║  [Play Free — No Real Money]          ║        │
│  ╚═══════════════════════════════════════╝        │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Roulette │  │Blackjack │  │Scratchers│        │
│  │ [thumb]  │  │ [thumb]  │  │ [thumb]  │        │
│  │ Edge:5.2%│  │ Edge:0.5%│  │Edge:20% │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Slots   │  │  Keno    │  │  Poker   │        │
│  │ [thumb]  │  │ [thumb]  │  │ [thumb]  │        │
│  │ Edge: 7% │  │Edge:25% │  │Edge:0.5%│        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                  │
FOOTER
```

### Game Card Component
- Size: `160×220px` mobile, `220×290px` desktop
- Contains: thumbnail illustration, game name, house edge badge, "Play →" CTA
- Hover state: gold border glow (`shadow-glow-gold`), slight scale-up (Motion `whileHover`)
- House edge badge: color-coded (green ≤ 1%, yellow 1–10%, red > 10%)

---

## Page 2: Roulette (`/roulette`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  ┌───────────────────────────┐                   │
│  │    ROULETTE WHEEL (2D)    │  ODDS PANEL        │
│  │    Canvas animation       │  Win: 2.63%        │
│  │    result indicator ↓     │  Edge: 5.26%       │
│  └───────────────────────────┘  Loss/100: $5.26  │
│                                                  │
│  ┌───────────────────────────────────────────┐   │
│  │           BETTING GRID                     │   │
│  │  0  │ 00 │                                 │   │
│  │  1  │  2  │  3  │ ← Row 1                  │   │
│  │  ...36 numbers...                          │   │
│  │ [1-18][Even][Red][Black][Odd][19-36]       │   │
│  │ [1st12][2nd12][3rd12]                      │   │
│  │ [Col1][Col2][Col3]                         │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  Chip Selector: [5][10][25][50][100][500]        │
│                                                  │
│  [CLEAR BETS]              [SPIN (Total: 0)]     │
│                                                  │
│  SESSION: Won: 0 | Lost: 0 | Net: 0             │
└─────────────────────────────────────────────────┘
```

### Interaction Details
- **Chip placement:** Click any betting grid cell → places selected chip denomination. Multiple chips stackable on same position. Visual chip stack shown.
- **Wheel animation:** On SPIN — wheel accelerates, spins 5–8 full rotations (GSAP timeline), decelerates, ball drops on result number. ~4 second animation.
- **Win highlight:** Winning bet cells pulse gold. Win amount floats up (+1,750) in green text (Motion animation).
- **Loss:** Losing chips removed with brief fade-out.

---

## Page 3: Blackjack (`/blackjack`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  DEALER HAND                  ODDS PANEL         │
│  [🂡][🂻][?]                  Win: 42.4%          │
│  Dealer: 17                   Edge: 0.5%         │
│                               Loss/100: $0.50    │
│                                                  │
│  ─────────────────── TABLE ──────────────────    │
│                                                  │
│  PLAYER HAND                                     │
│  [🂱][🂾]                                         │
│  Value: 21 ← BLACKJACK!                          │
│                                                  │
│  [HIT]  [STAND]  [DOUBLE]  [SPLIT]               │
│                                                  │
│  Bet: [10][25][50][100][250][500]  [DEAL]         │
│                                                  │
│  SESSION: Won: 0 | Lost: 0 | Net: 0             │
└─────────────────────────────────────────────────┘
```

### Card Animations
- Deal: cards slide in from center of table (Motion `animate` from off-screen)
- Hit: new card slides in to hand
- Dealer reveal: face-down card flips over (CSS 3D transform via Motion)
- Bust: hand shakes (Motion `animate` x-oscillation), red flash

---

## Page 4: Scratchers (`/scratchers`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐         │
│  │         SCRATCH TICKET              │         │
│  │   ┌────┐  ┌────┐  ┌────┐            │         │
│  │   │░░░░│  │░░░░│  │░░░░│  ← Row 1   │         │
│  │   └────┘  └────┘  └────┘            │         │
│  │   ┌────┐  ┌────┐  ┌────┐            │         │
│  │   │░░░░│  │░░░░│  │░░░░│  ← Row 2   │         │
│  │   └────┘  └────┘  └────┘            │         │
│  │   ┌────┐  ┌────┐  ┌────┐            │         │
│  │   │░░░░│  │░░░░│  │░░░░│  ← Row 3   │         │
│  │   └────┘  └────┘  └────┘            │         │
│  └─────────────────────────────────────┘         │
│                                                  │
│  Cost: 1 Ticket     [SCRATCH ALL]                │
│                                                  │
│  [BUY NEW TICKET]                                │
│                                                  │
│  ODDS PANEL: Win chance 12.5% | Edge: 20%        │
└─────────────────────────────────────────────────┘
```

### Scratch Interaction
- **Mouse/touch drag:** Canvas element with composite `destination-out` to erase scratch coating
- **Reveal threshold:** When 70% of cell area scratched → auto-reveal that cell
- **SCRATCH ALL button:** Instantly reveals all cells with a wipe animation
- **Win state:** Matching 3 symbols → all three cells pulse gold, win amount displayed

---

## Page 5: Slots (`/slots`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐     │
│  │   REEL 1  │ REEL 2  │ REEL 3 │ REEL 4 │ REEL 5│
│  │  ┌──────┐ │┌──────┐ │┌──────┐│┌──────┐│┌─────┐│
│  │  │Crown │ ││  A   │ ││  K   ││││  Q  │││ Wild│││
│  │  ├──────┤ │├──────┤ │├──────┤│├──────┤│├─────┤│  ← Mid row (paylines)
│  │  │  7   │ ││Diamond│ ││Crown ││││Diamond│││  A  │││
│  │  ├──────┤ │├──────┤ │├──────┤│├──────┤│├─────┤│
│  │  │  K   │ ││  Q   │ ││  A   ││││  K  │││ K   │││
│  │  └──────┘ │└──────┘ │└──────┘│└──────┘│└─────┘│
│  └─────────────────────────────────────────┐     │
│                                            │     │
│  ← Payline indicators (left/right edges)   │     │
│                                                  │
│  Bet/Line: [1][5][10][25][50]  Lines: 20         │
│  Total Bet: 100 Tokens                           │
│                                                  │
│              [  S P I N  ]                       │
│                                                  │
│  RTP: 93% | Edge: 7% | Loss/100: $7.00          │
│  SESSION: Won: 0 | Lost: 0 | Net: 0             │
└─────────────────────────────────────────────────┘
```

### Reel Animations (GSAP)
- **Spin start:** All 5 reels begin spinning simultaneously (fast blur effect)
- **Stop sequence:** Reels stop left-to-right with 150ms delay between each
- **Stop easing:** GSAP `elastic.out` feel — slight overshoot then settle
- **Win line highlight:** Active paylines flash sequentially, win symbols scale up
- **Big win:** If payout > 10× bet — screen flash, particle confetti, win counter ticks up

---

## Page 6: Keno (`/keno`)

```
HEADER
┌─────────────────────────────────────────────────┐
│   KENO GRID (10 × 8 = 80 numbers)               │
│                                                  │
│  [ 1][ 2][ 3][ 4][ 5][ 6][ 7][ 8][ 9][10]      │
│  [11][12][13][14][15][16][17][18][19][20]      │
│  ... (8 rows total)                             │
│  [71][72][73][74][75][76][77][78][79][80]      │
│                                                  │
│  Picked: 3/10  [CLEAR]                          │
│                                                  │
│  Wager: [5][10][25][50][100]                    │
│                                                  │
│  [  DRAW  ]                                      │
│                                                  │
│  Payout table (right panel or below):           │
│  Catches: 5→1× | 6→3× | 7→8× | ...            │
│                                                  │
│  Edge: 25% | Loss/100: $25.00                   │
└─────────────────────────────────────────────────┘
```

### Draw Animation
- 20 numbers drawn sequentially, each one pops/highlights with a 100ms delay
- Player's picked numbers that are caught: turn gold + pulse
- Player's picked numbers that miss: fade to muted color

---

## Page 7: Video Poker (`/poker`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  PAY TABLE (scrollable on mobile)               │
│  Royal Flush: 800× | Straight Flush: 50× | ...  │
│                                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │  A♠  │ │  K♥  │ │  Q♦  │ │  J♣  │ │ 10♠  │  │
│  │ HOLD │ │      │ │ HOLD │ │      │ │ HOLD │  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│                                                  │
│  Hand: Royal Flush!  Payout: 20,000 Tokens ✨    │
│                                                  │
│  Bet: [5][10][25][50][100][250]                  │
│                                                  │
│  [DEAL / DRAW]                                   │
│                                                  │
│  Edge: 0.46% | Loss/100: $0.46                  │
│  SESSION: Won: 0 | Lost: 0 | Net: 0             │
└─────────────────────────────────────────────────┘
```

### Card Interaction
- **HOLD toggle:** Click card → "HOLD" badge appears (Motion spring animation). Click again to un-hold.
- **Draw:** Non-held cards slide off, replacement cards slide in from deck
- **Hand evaluation:** Winning hand displayed above cards with rank label + glow

---

## Support Page (`/support`)

```
HEADER
┌─────────────────────────────────────────────────┐
│  Support the Developer                          │
│                                                  │
│  HouseWins.gg is free, forever.                 │
│  If you enjoy it, consider buying me a coffee.  │
│                                                  │
│  ⚠️  This is NOT gambling. You are supporting   │
│  a developer. No real money can be won or       │
│  withdrawn. In-game currency has no real value. │
│                                                  │
│  [☕ Support on Ko-fi →]                         │
│                                                  │
│  ──────────────────────────────────             │
│                                                  │
│  Feedback & Bug Reports                         │
│  [Subject: ___________________________]         │
│  [Message: ___________________________]         │
│  [Send Feedback]                                │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Disclaimer Modal

Shown once per new browser session (sessionStorage flag `disclaimer_seen`).

```
┌─────────────────────────────────────────────────┐
│  ⚠️  Before You Play                            │
│                                                  │
│  HouseWins.gg is a FREE casino simulation.      │
│  • No real money is used or can be won          │
│  • All currency is fictional and non-withdrawable│
│  • This site is for educational purposes only   │
│  • Gambling odds are simulated accurately       │
│                                                  │
│  If you or someone you know has a gambling      │
│  problem: 1-800-522-4700 (National Helpline)    │
│                                                  │
│  [I Understand — Let's Play]                    │
└─────────────────────────────────────────────────┘
```

---

## Odds Visualization Panel (per game)

Present on every game page, positioned as a sidebar on desktop, collapsible panel on mobile.

```
┌──────────────────────────┐
│  📊 Your Odds            │
│                          │
│  Win Probability         │
│  ████░░░░░░░░ 2.63%      │
│  (House wins 97.37%)     │
│                          │
│  House Edge: 5.26%       │
│  Expected loss per $100: │
│  -$5.26                  │
│                          │
│  In 100 rounds:          │
│  You win ~3 times        │
│  House wins ~97 times    │
│                          │
│  [?] How is this         │
│      calculated?         │
└──────────────────────────┘
```

---

## Component Inventory

| Component | Used In | Animation |
|-----------|---------|-----------|
| `Header` | All pages | SSE counter Motion count-up |
| `Footer` | Lobby | Static |
| `GameCard` | Lobby | Motion whileHover scale + glow |
| `DisclaimerModal` | App root | Motion fade-in on mount |
| `OddsPanel` | All game pages | Static (values update on bet change) |
| `CurrencyBadge` | Header | Motion count-up on balance change |
| `ChipSelector` | Roulette, BJ | Motion bounce on select |
| `RouletteWheel` | Roulette | GSAP timeline |
| `BettingGrid` | Roulette | Motion chip placement |
| `PlayingCard` | BJ, Poker | Motion slide-in, CSS 3D flip |
| `ScratchCanvas` | Scratchers | Canvas composite operations |
| `SlotReel` | Slots | GSAP spin + stop |
| `KenoGrid` | Keno | Motion highlight on draw |
| `PayTable` | Poker | Static table |
| `SessionStats` | All game pages | Motion count-up |
| `ProvablyFairBadge` | All game pages | Expandable detail panel |
