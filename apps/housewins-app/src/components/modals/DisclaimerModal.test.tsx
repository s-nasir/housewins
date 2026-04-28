import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DisclaimerModal } from './DisclaimerModal'

function renderModal(props: Partial<React.ComponentProps<typeof DisclaimerModal>> = {}) {
  return render(<DisclaimerModal isOpen={true} onClose={() => {}} {...props} />)
}

describe('DisclaimerModal', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('renders when isOpen is true', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the title "Before You Play"', () => {
    renderModal()
    expect(screen.getByText('Before You Play')).toBeInTheDocument()
  })

  it('renders the three bullet points', () => {
    renderModal()
    expect(screen.getByTestId('bullet-no-real-money')).toBeInTheDocument()
    expect(screen.getByTestId('bullet-fictional-currency')).toBeInTheDocument()
    expect(screen.getByTestId('bullet-educational')).toBeInTheDocument()
  })

  it('renders the National Helpline number', () => {
    renderModal()
    expect(screen.getByText(/1-800-522-4700/)).toBeInTheDocument()
  })

  it('renders the dismiss button with correct label', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /I Understand — Let's Play/i })).toBeInTheDocument()
  })

  it('dismiss button calls onClose and sets sessionStorage key', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByRole('button', { name: /I Understand — Let's Play/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('disclaimer_seen')).toBe('true')
  })

  it('clicking backdrop does NOT call onClose', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByTestId('disclaimer-backdrop'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('Escape key does NOT call onClose', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('focus is trapped — dismiss button is focused on open', () => {
    renderModal()
    const btn = screen.getByRole('button', { name: /I Understand — Let's Play/i })
    expect(document.activeElement).toBe(btn)
  })
})
