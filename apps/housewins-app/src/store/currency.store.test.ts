import { describe, it, expect, beforeEach } from 'vitest'
import { useCurrencyStore } from './currency.store'

beforeEach(() => {
  useCurrencyStore.setState({ chips: 1000, tokens: 500, tickets: 10 })
  localStorage.clear()
})

describe('useCurrencyStore — initial state', () => {
  it('starts with 1000 chips, 500 tokens, 10 tickets', () => {
    const { chips, tokens, tickets } = useCurrencyStore.getState()
    expect(chips).toBe(1000)
    expect(tokens).toBe(500)
    expect(tickets).toBe(10)
  })
})

describe('useCurrencyStore — addChips', () => {
  it('adds chips to balance', () => {
    useCurrencyStore.getState().addChips(250)
    expect(useCurrencyStore.getState().chips).toBe(1250)
  })
})

describe('useCurrencyStore — addTokens', () => {
  it('adds tokens to balance', () => {
    useCurrencyStore.getState().addTokens(100)
    expect(useCurrencyStore.getState().tokens).toBe(600)
  })
})

describe('useCurrencyStore — addTickets', () => {
  it('adds tickets to balance', () => {
    useCurrencyStore.getState().addTickets(5)
    expect(useCurrencyStore.getState().tickets).toBe(15)
  })
})

describe('useCurrencyStore — spendChips', () => {
  it('deducts chips and returns true on success', () => {
    const result = useCurrencyStore.getState().spendChips(400)
    expect(result).toBe(true)
    expect(useCurrencyStore.getState().chips).toBe(600)
  })

  it('spends exact balance and returns true', () => {
    const result = useCurrencyStore.getState().spendChips(1000)
    expect(result).toBe(true)
    expect(useCurrencyStore.getState().chips).toBe(0)
  })

  it('returns false and does not mutate when chips < amount', () => {
    const result = useCurrencyStore.getState().spendChips(1001)
    expect(result).toBe(false)
    expect(useCurrencyStore.getState().chips).toBe(1000)
  })

  it('returns false on zero balance spend attempt', () => {
    useCurrencyStore.setState({ chips: 0, tokens: 500, tickets: 10 })
    const result = useCurrencyStore.getState().spendChips(1)
    expect(result).toBe(false)
    expect(useCurrencyStore.getState().chips).toBe(0)
  })
})

describe('useCurrencyStore — spendTokens', () => {
  it('deducts tokens and returns true on success', () => {
    const result = useCurrencyStore.getState().spendTokens(200)
    expect(result).toBe(true)
    expect(useCurrencyStore.getState().tokens).toBe(300)
  })

  it('spends exact token balance and returns true', () => {
    const result = useCurrencyStore.getState().spendTokens(500)
    expect(result).toBe(true)
    expect(useCurrencyStore.getState().tokens).toBe(0)
  })

  it('returns false and does not mutate when tokens < amount', () => {
    const result = useCurrencyStore.getState().spendTokens(501)
    expect(result).toBe(false)
    expect(useCurrencyStore.getState().tokens).toBe(500)
  })
})

describe('useCurrencyStore — spendTickets', () => {
  it('deducts tickets and returns true on success', () => {
    const result = useCurrencyStore.getState().spendTickets(5)
    expect(result).toBe(true)
    expect(useCurrencyStore.getState().tickets).toBe(5)
  })

  it('spends exact ticket balance and returns true', () => {
    const result = useCurrencyStore.getState().spendTickets(10)
    expect(result).toBe(true)
    expect(useCurrencyStore.getState().tickets).toBe(0)
  })

  it('returns false and does not mutate when tickets < amount', () => {
    const result = useCurrencyStore.getState().spendTickets(11)
    expect(result).toBe(false)
    expect(useCurrencyStore.getState().tickets).toBe(10)
  })
})
