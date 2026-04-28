# Game Logic Requirements

## 1. American Roulette
A high-variance game featuring the "Double Zero" which provides the house its primary advantage.

- **Game Logic:** The player places chips on a virtual table (Inside bets like Straight Up, or Outside bets like Red/Black). An RNG generates a number between 0 and 37 (representing $0$ and $00$).
- **Math & Implementation:** Uses a simple 1-38 RNG range.
- **House Edge:** 5.26%.
- **Formula:** $EV = (\frac{1}{38} \times 35) - (\frac{37}{38} \times 1)$.
- **Backend:** A stateless function that accepts an array of bets, generates one number, and calculates the payout based on the intersection of the result and the bet coordinates.
- **UI/UX Complexity:** High. Requires a 2D/3D wheel animation and a responsive betting grid that handles multiple chip placements simultaneously.
- **Currency:** Chips (Input) $\rightarrow$ Chips (Payout).

## 2. Classic Blackjack (Single Hand)
The most popular "skill-based" game where the player competes against the House Engine.

- **Game Logic:** Player and Dealer are dealt two cards. Player can "Hit," "Stand," "Double," or "Split." The dealer must hit until reaching 17.
- **Math & Implementation:** Requires a virtual "Shoe" (6–8 decks).
- **House Edge:** ~0.5% (assuming standard Vegas rules).
- **Logic:** The house advantage comes from the fact that if the player busts, the house wins immediately, even if the dealer would have busted too.
- **Backend:** Must track "Hand State" during the session to prevent cheating or refreshing for a better hand.
- **UI/UX Complexity:** Medium. Needs card dealing animations and clear action buttons.
- **Currency:** Chips (Input) $\rightarrow$ Chips (Payout).

## 3. Digital Scratchers
This serves as your "Lottery" system. It is an instant-win game with high volatility.

- **Game Logic:** Players purchase a "Ticket." They use their mouse/touch to "scratch" off a coating to reveal 6–9 symbols. Matching 3 symbols wins the prize.
- **Math & Implementation:** Unlike the other games, Scratchers usually use a Pre-generated Pool (Probability Map).
- **House Edge:** 15% – 25%.
- **Logic:** Upon "Purchase," the backend picks a result from a weighted distribution (e.g., 1 in 1,000 for a Top Prize, 1 in 5 for a small win).
- **UI/UX Complexity:** Low. Uses a HTML5 Canvas "scratch" effect over a static image.
- **Currency:** Tickets (Input) $\rightarrow$ Chips or Tokens (Payout).

## 4. Modern Video Slots (5-Reel)
The primary driver for the "House Profit" counter due to its fast pace and adjustable RTP.

- **Game Logic:** Player sets a "Bet per Line." Clicking "Spin" rotates 5 reels. Winnings are paid based on symbols landing on predefined paths (Paylines).
- **Math & Implementation:** Uses Weighted Reels.
- **House Edge:** 5% – 10%.
- **Algorithm:** Reels are not 1:1. A "Cherry" might appear 5 times on Reel 1 but only 1 time on Reel 5. This creates the "Near Miss" effect.
- **UI/UX Complexity:** Very High. Requires complex animations, sound synchronization, and "Win" particle effects.
- **Currency:** Tokens (Input) $\rightarrow$ Tokens or Chips (Payout).

## 5. Keno
A slow-paced, high-reward game similar to a 24/7 lottery draw.

- **Game Logic:** A grid of 80 numbers is shown. The player selects up to 10 numbers. The engine draws 20 random numbers. The payout increases based on how many "catches" (matches) occur.
- **Math & Implementation:** Uses a Hypergeometric Distribution.
- **House Edge:** 20% – 30%.
- **Implementation:** The backend runs a shuffle() on an array of 1–80 and slices the first 20.
- **UI/UX Complexity:** Low. A simple static grid that highlights numbers as they are "called."
- **Currency:** Tokens (Input) $\rightarrow$ Tickets or Tokens (Payout).

## 6. Video Poker (Jacks or Better)
A mathematical game where players can reach near 100% RTP with perfect strategy.

- **Game Logic:** 5 cards are dealt. The player chooses which to "Hold" and which to "Discard." New cards are dealt for the discards. Payouts are based on the final Poker Hand.
- **Math & Implementation:** A standard 52-card deck RNG.
- **House Edge:** 0.46% (with a "Full Pay" 9/6 table).
- **Logic:** The engine must evaluate the final hand against a rank list (Royal Flush, Straight, etc.).
- **UI/UX Complexity:** Medium. Focuses on clarity and "Hold" indicators.
- **Currency:** Tokens (Input) $\rightarrow$ Tokens (Payout).

---

## Data Flow for Global Counters
To fulfill your requirement for the House Profit and Player Winnings counters, the backend must process every bet through this pipeline:

- **Wager Initiated:** GlobalWagers += BetAmount.
- **RNG Calculated:** Engine determines Win or Loss.
- **Winnings Distributed:** GlobalWinnings += PayoutAmount.
- **Profit Calculation:**
  $$GrossProfit = GlobalWagers - GlobalWinnings$$
  $$NetHouseProfit = GrossProfit \times (1 - TaxRate)$$
- **Display:** The UI polls these values every 5 seconds to update the live counters on the header of your website.