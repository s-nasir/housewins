import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CurrencyState {
  chips: number
  tokens: number
  tickets: number
  addChips: (amount: number) => void
  addTokens: (amount: number) => void
  addTickets: (amount: number) => void
  spendChips: (amount: number) => boolean
  spendTokens: (amount: number) => boolean
  spendTickets: (amount: number) => boolean
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      chips: 1000,
      tokens: 500,
      tickets: 10,

      addChips: (amount) => set((s) => ({ chips: s.chips + amount })),
      addTokens: (amount) => set((s) => ({ tokens: s.tokens + amount })),
      addTickets: (amount) => set((s) => ({ tickets: s.tickets + amount })),

      spendChips: (amount) => {
        if (get().chips < amount) return false
        set((s) => ({ chips: s.chips - amount }))
        return true
      },

      spendTokens: (amount) => {
        if (get().tokens < amount) return false
        set((s) => ({ tokens: s.tokens - amount }))
        return true
      },

      spendTickets: (amount) => {
        if (get().tickets < amount) return false
        set((s) => ({ tickets: s.tickets - amount }))
        return true
      },
    }),
    { name: 'housewins-currency' },
  ),
)
