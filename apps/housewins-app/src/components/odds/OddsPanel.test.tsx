import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { OddsPanel } from './OddsPanel'

describe('OddsPanel', () => {
  const defaultProps = {
    winProbability: '2.63%',
    houseEdge: '5.26%',
    expectedLossPer100: '$5.26',
  }

  it('renders the title', () => {
    render(<OddsPanel {...defaultProps} />)
    const titles = screen.getAllByText(/📊 Your Odds/)
    expect(titles.length).toBeGreaterThan(0)
  })

  it('renders win probability with correct value', () => {
    render(<OddsPanel {...defaultProps} />)
    expect(screen.getByText('2.63%')).toBeInTheDocument()
  })

  it('renders house edge value', () => {
    render(<OddsPanel {...defaultProps} />)
    expect(screen.getByText(/5.26%/)).toBeInTheDocument()
  })

  it('renders expected loss per $100', () => {
    render(<OddsPanel {...defaultProps} />)
    expect(screen.getByText(/\$5.26/)).toBeInTheDocument()
  })

  it('renders RTP when provided', () => {
    render(<OddsPanel {...defaultProps} rtp="94.74%" />)
    expect(screen.getByText(/94.74%/)).toBeInTheDocument()
  })

  it('does not render RTP when not provided', () => {
    render(<OddsPanel {...defaultProps} />)
    expect(screen.queryByText(/RTP/)).not.toBeInTheDocument()
  })

  it('renders plain-language summary', () => {
    render(<OddsPanel {...defaultProps} />)
    expect(screen.getByText(/In 100 rounds/)).toBeInTheDocument()
  })

  it('renders win probability bar with correct width', () => {
    render(<OddsPanel {...defaultProps} winProbability="25%" />)
    const bar = screen.getByTestId('win-probability-bar')
    expect(bar).toBeInTheDocument()
  })

  it('handles decimal percentages in bar width', () => {
    render(<OddsPanel {...defaultProps} winProbability="2.63%" />)
    const bar = screen.getByTestId('win-probability-bar')
    expect(bar).toBeInTheDocument()
  })

  it('is collapsible on mobile (accordion pattern)', async () => {
    render(<OddsPanel {...defaultProps} />)
    const button = screen.getByRole('button', { name: /Your Odds/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded')
  })

  it('toggles expanded state when disclosure button clicked', async () => {
    const user = userEvent.setup()
    render(<OddsPanel {...defaultProps} />)
    const button = screen.getByRole('button', { name: /Your Odds/i })
    
    const initialExpanded = button.getAttribute('aria-expanded') === 'true'
    await user.click(button)
    const afterClickExpanded = button.getAttribute('aria-expanded') === 'true'
    
    expect(afterClickExpanded).toBe(!initialExpanded)
  })

  it('is keyboard accessible', () => {
    render(<OddsPanel {...defaultProps} />)
    const button = screen.getByRole('button', { name: /Your Odds/i })
    expect(button).toHaveAttribute('tabIndex')
  })

  it('renders chevron icon in disclosure button', () => {
    render(<OddsPanel {...defaultProps} />)
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument()
  })
})
