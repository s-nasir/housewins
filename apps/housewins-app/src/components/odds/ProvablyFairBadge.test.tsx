import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ProvablyFairBadge } from './ProvablyFairBadge'

describe('ProvablyFairBadge', () => {
  const defaultProps = {
    commitment: 'abc123def456',
    serverSeed: 'xyz789uvw012',
    nonce: 42,
  }

  it('renders the badge label with checkmark', () => {
    render(<ProvablyFairBadge {...defaultProps} />)
    expect(screen.getByText(/Provably Fair/)).toBeInTheDocument()
    expect(screen.getByText(/✓/)).toBeInTheDocument()
  })

  it('renders shield icon', () => {
    render(<ProvablyFairBadge {...defaultProps} />)
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
  })

  it('is initially collapsed', () => {
    render(<ProvablyFairBadge {...defaultProps} />)
    expect(screen.queryByText(/commitment/i)).not.toBeInTheDocument()
  })

  it('expands when badge is clicked', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} />)
    
    const badge = screen.getByRole('button', { name: /Provably Fair/i })
    await user.click(badge)
    
    expect(screen.getByText(/commitment/i)).toBeInTheDocument()
  })

  it('shows commitment hash when expanded', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: /Provably Fair/i }))
    
    expect(screen.getByText('abc123def456')).toBeInTheDocument()
  })

  it('shows revealed server seed when expanded and seed is not null', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: /Provably Fair/i }))
    
    expect(screen.getByText('xyz789uvw012')).toBeInTheDocument()
  })

  it('shows "Pending reveal" when serverSeed is null', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} serverSeed={null} />)
    
    await user.click(screen.getByRole('button', { name: /Provably Fair/i }))
    
    expect(screen.getByText(/Pending reveal/i)).toBeInTheDocument()
  })

  it('shows nonce value when expanded', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: /Provably Fair/i }))
    
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('collapses when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: /Provably Fair/i }))
    expect(screen.getByText(/commitment/i)).toBeInTheDocument()
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    expect(screen.queryByText(/commitment/i)).not.toBeInTheDocument()
  })

  it('is keyboard accessible with tabindex', () => {
    render(<ProvablyFairBadge {...defaultProps} />)
    const badge = screen.getByRole('button', { name: /Provably Fair/i })
    expect(badge).toHaveAttribute('tabIndex')
  })

  it('has aria-expanded attribute', () => {
    render(<ProvablyFairBadge {...defaultProps} />)
    const badge = screen.getByRole('button', { name: /Provably Fair/i })
    expect(badge).toHaveAttribute('aria-expanded', 'false')
  })

  it('updates aria-expanded when expanded', async () => {
    const user = userEvent.setup()
    render(<ProvablyFairBadge {...defaultProps} />)
    
    const badge = screen.getByRole('button', { name: /Provably Fair/i })
    expect(badge).toHaveAttribute('aria-expanded', 'false')
    
    await user.click(badge)
    expect(badge).toHaveAttribute('aria-expanded', 'true')
  })
})
