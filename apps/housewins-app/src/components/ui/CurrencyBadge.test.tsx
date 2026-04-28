import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CurrencyBadge } from './CurrencyBadge'

describe('CurrencyBadge', () => {
  it('renders the icon and formatted value', () => {
    render(<CurrencyBadge icon="🪙" value={1000} testId="badge-chips" />)
    const badge = screen.getByTestId('badge-chips')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('🪙')
    expect(badge).toHaveTextContent('1,000')
  })

  it('renders zero value correctly', () => {
    render(<CurrencyBadge icon="🎫" value={0} testId="badge-tokens" />)
    expect(screen.getByTestId('badge-tokens')).toHaveTextContent('0')
  })

  it('renders large values with comma formatting', () => {
    render(<CurrencyBadge icon="🎟" value={1234567} testId="badge-tickets" />)
    expect(screen.getByTestId('badge-tickets')).toHaveTextContent('1,234,567')
  })
})
