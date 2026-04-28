import { create } from 'zustand'

interface GlobalCounterState {
  totalWagers: number
  totalWinnings: number
  netHouseProfit: number
  displayCurrency: string
  setCounters: (counters: { totalWagers: number; totalWinnings: number; netHouseProfit: number }) => void
  setDisplayCurrency: (code: string) => void
}

export const useGlobalCounterStore = create<GlobalCounterState>()((set) => ({
  totalWagers: 0,
  totalWinnings: 0,
  netHouseProfit: 0,
  displayCurrency: 'USD',
  setCounters: ({ totalWagers, totalWinnings, netHouseProfit }) =>
    set({ totalWagers, totalWinnings, netHouseProfit }),
  setDisplayCurrency: (code) => set({ displayCurrency: code }),
}))
