import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { GameCard } from './GameCard'

function renderCard(overrides: Partial<React.ComponentProps<typeof GameCard>> = {}) {
  const defaults: React.ComponentProps<typeof GameCard> = {
    id: 'blackjack',
    name: 'Classic Blackjack',
    route: '/blackjack',
    houseEdge: 0.005,
    icon: '🃏',
    color: 'bg-chip-blue',
    ...overrides,
  }
  return render(
    <MemoryRouter>
      <GameCard {...defaults} />
    </MemoryRouter>,
  )
}

describe('GameCard', () => {
  it('renders the game name', () => {
    renderCard()
    expect(screen.getByTestId('gamecard-name')).toHaveTextContent('Classic Blackjack')
  })

  it('renders a Play link pointing to the game route', () => {
    renderCard({ route: '/blackjack' })
    const link = screen.getByTestId('gamecard-link')
    expect(link).toHaveAttribute('href', '/blackjack')
    expect(link).toHaveTextContent('Play')
  })

  it('renders a green house edge badge for edge ≤ 1%', () => {
    renderCard({ houseEdge: 0.005 })
    const badge = screen.getByTestId('gamecard-edge-badge')
    expect(badge).toHaveTextContent('0.50%')
    expect(badge.className).toContain('green')
  })

  it('renders a yellow house edge badge for edge between 1% and 10%', () => {
    renderCard({ houseEdge: 0.07 })
    const badge = screen.getByTestId('gamecard-edge-badge')
    expect(badge).toHaveTextContent('7.00%')
    expect(badge.className).toContain('yellow')
  })

  it('renders a red house edge badge for edge > 10%', () => {
    renderCard({ houseEdge: 0.25 })
    const badge = screen.getByTestId('gamecard-edge-badge')
    expect(badge).toHaveTextContent('25.00%')
    expect(badge.className).toContain('red')
  })

  it('renders the thumbnail placeholder with the correct color class', () => {
    renderCard({ color: 'bg-chip-blue' })
    const thumb = screen.getByTestId('gamecard-thumb')
    expect(thumb.className).toContain('bg-chip-blue')
  })

  it('renders the game icon inside the thumbnail', () => {
    renderCard({ icon: '🃏' })
    expect(screen.getByTestId('gamecard-icon')).toHaveTextContent('🃏')
  })
})
