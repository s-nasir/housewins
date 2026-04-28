# Webapp

## Requirements

### Frontend 

This app will have 7 pages. Main page and 6 game pages. 
- The game pages should have modern and engaging UI/UX that mimics real casino games, and compliment game logic.
- Main page should have links to all game pages with thumbnails and titles of the games.
- Main page should have a header and footer. 
- Main page should have a counter for house profits after tax and winnings.
- Animations should be used to enhance the user experience and make the app more engaging.
- Animations need to be as light weight as possible while being extremely smooth and visually appealing.

### Backend
- Each games game logic should be run by a dedicated casino game engine that will be built in house with a house edge. The house edge will be declared in terms and conditions. The engines will be simulation of real mathematical models used in actual casino games.
- The casino game engines should be able to handle multiple users playing simultaneously. 
- There will be no user profiles, therefore no user login or registration. No user data will be stored or tracked.     
- The casino game engines should be able to handle multiple games running at the same time. For example user can have multiple tabs running a game on each tab.    
- House profit and users winning should be tracked, stored, and displayed in real time. User winnings will be a pool of all user winnings that have won. There are no withdrawals, all house profits and winnings are superficial as this webapp is a simulation.
- A session user winnings and money lost to the house should be tracked and displayed in real time for the user. This will be stored in the browser's cache, and will be lost when the cache is lost. 
- In game currency will be freely provided to users, but on a timely basis. For example: Every sesion, users get a bonus pack of chips(or whatever type of currency we decide later). Additionally, every 10 seconds spent ON the website (CANNOT TAB OUT) user gets 10 chips passively that can be used for games instantly.
- Any winnings should be converted and paid in the in game currency and can be instantly wagered and used in the session it was won. It will be added in the winning pool, but will be LOST if the cache of that session is lost on browser exit or hard refresh.    
- Depending on the location the website is accessed from, all money currency designation should be changed to that country's local currency. 

### Extra Notes from AI that need to be incorporated in requirements

2. Core Mathematical FormulasTo accurately simulate the "unfair" advantage, use the following formulas in your game engine:The House Edge FormulaThe house edge is the difference between the True Odds and the Payout Odds.  $$House\ Edge = \frac{True\ Odds - Payout\ Odds}{True\ Odds + 1}$$Example (Roulette Single Number):True Odds of hitting a number: $36$ to $1$ (on a 37-slot wheel).Payout Odds: $35$ to $1$.Edge: $\frac{36 - 35}{36 + 1} = \frac{1}{37} \approx 2.70\%$.Slots & RTP (Return to Player)For your slots, you define the RTP (e.g., 95%). The engine calculates the win based on a PAR Sheet (Probability Analysis Record).$$Total\ Payout = \sum (Probability\ of\ Combo \times Payout\ of\ Combo)$$To ensure the house wins, the sum of all payouts must be $< 1.00$.3. The Cashflow SystemTo manage the global counters, you should define a clear hierarchy for your currencies:Tokens (Timed Drops): Given every 1 hour. These are "low value."Chips (Play Currency): The standard unit for all games. Tokens can be "exchanged" for Chips at a fixed rate (e.g., 100 Tokens = 10 Chips).Tickets (High Stakes): Earned through winning streaks or "leveling up." Used for high-edge games like Keno or Jackpot Slots.Global Counter LogicYou will need two global variables stored on your server (updated via API calls from the client):Total Player Winnings: Sum of every winning bet payout.Gross Gaming Revenue (GGR): Total wagers $-$ Total Payouts.House Profit (After Tax):Assuming a standard 2026 hypothetical "Simulation Tax" of 15% on GGR:$$Net\ Profit = (Total\ Wagers - Total\ Payouts) \times 0.85$$Note: Since you have no logins, you should use Local Storage to save the player's current session balance, while the Global Counters are updated in real-time for all visitors to see.


### Development Requirements
- The app will be built ENTIRELY with AI assistance. No human coding will be done.