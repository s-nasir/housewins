import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { Header } from './Header'

function renderHeader(props: Partial<React.ComponentProps<typeof Header>> = {}) {
  return render(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('renders the logo text', () => {
    renderHeader()
    expect(screen.getByText('HouseWins.gg')).toBeInTheDocument()
  })

  it('renders counter placeholder values when counters are undefined', () => {
    renderHeader({ counters: undefined })
    expect(screen.getByTestId('counter-house')).toBeInTheDocument()
    expect(screen.getByTestId('counter-players')).toBeInTheDocument()
  })

  it('renders counter placeholder values when counters are null', () => {
    renderHeader({ counters: null })
    expect(screen.getByTestId('counter-house')).toBeInTheDocument()
    expect(screen.getByTestId('counter-players')).toBeInTheDocument()
  })

  it('renders provided counter values', () => {
    renderHeader({ counters: { houseProfit: 1234567, totalWinnings: 9876543 } })
    expect(screen.getByTestId('counter-house')).toHaveTextContent('1,234,567')
    expect(screen.getByTestId('counter-players')).toHaveTextContent('9,876,543')
  })

  it('renders three currency balance badges', () => {
    renderHeader()
    expect(screen.getByTestId('badge-chips')).toBeInTheDocument()
    expect(screen.getByTestId('badge-tokens')).toBeInTheDocument()
    expect(screen.getByTestId('badge-tickets')).toBeInTheDocument()
  })

  it('renders balance values from props', () => {
    renderHeader({ balance: { chips: 2500, tokens: 750, tickets: 5 } })
    expect(screen.getByTestId('badge-chips')).toHaveTextContent('2,500')
    expect(screen.getByTestId('badge-tokens')).toHaveTextContent('750')
    expect(screen.getByTestId('badge-tickets')).toHaveTextContent('5')
  })

  it('renders mute toggle button', () => {
    renderHeader()
    expect(screen.getByTestId('mute-toggle')).toBeInTheDocument()
  })

  it('mute toggle changes icon on click', () => {
    renderHeader()
    const btn = screen.getByTestId('mute-toggle')
    expect(screen.getByTestId('icon-volume-on')).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByTestId('icon-volume-off')).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.getByTestId('icon-volume-on')).toBeInTheDocument()
  })

  it('does not render back arrow on lobby route (no showBack prop)', () => {
    renderHeader()
    expect(screen.queryByTestId('back-arrow')).not.toBeInTheDocument()
  })

  it('renders back arrow when showBack is true', () => {
    renderHeader({ showBack: true })
    expect(screen.getByTestId('back-arrow')).toBeInTheDocument()
  })
})
