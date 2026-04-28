import { GameCard, type GameCardProps } from '../components/lobby/GameCard'

const GAMES: GameCardProps[] = [
  {
    id: 'roulette',
    name: 'American Roulette',
    route: '/roulette',
    houseEdge: 0.0526,
    icon: '🎡',
    color: 'bg-chip-red',
  },
  {
    id: 'blackjack',
    name: 'Classic Blackjack',
    route: '/blackjack',
    houseEdge: 0.005,
    icon: '🃏',
    color: 'bg-chip-blue',
  },
  {
    id: 'scratchers',
    name: 'Digital Scratchers',
    route: '/scratchers',
    houseEdge: 0.2,
    icon: '🎰',
    color: 'bg-chip-black',
  },
  {
    id: 'slots',
    name: 'Video Slots',
    route: '/slots',
    houseEdge: 0.07,
    icon: '🍒',
    color: 'bg-chip-green',
  },
  {
    id: 'keno',
    name: 'Keno',
    route: '/keno',
    houseEdge: 0.25,
    icon: '🔢',
    color: 'bg-burgundy',
  },
  {
    id: 'poker',
    name: 'Video Poker',
    route: '/poker',
    houseEdge: 0.0046,
    icon: '♠️',
    color: 'bg-felt-dark',
  },
]

export function LobbyPage() {
  return (
    <section
      data-testid="lobby-page"
      className="px-4 py-8 max-w-5xl mx-auto"
    >
      <h1 className="font-display text-gold text-3xl font-bold mb-6 text-center">
        Choose Your Game
      </h1>
      <div
        data-testid="lobby-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {GAMES.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </section>
  )
}
