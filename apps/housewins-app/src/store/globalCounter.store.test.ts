import { describe, it, expect, beforeEach } from 'vitest'
import { useGlobalCounterStore } from './globalCounter.store'

beforeEach(() => {
  useGlobalCounterStore.setState({
    totalWagers: 0,
    totalWinnings: 0,
    netHouseProfit: 0,
    displayCurrency: 'USD',
  })
})

describe('useGlobalCounterStore — initial state', () => {
  it('starts with all counters at zero', () => {
    const { totalWagers, totalWinnings, netHouseProfit } = useGlobalCounterStore.getState()
    expect(totalWagers).toBe(0)
    expect(totalWinnings).toBe(0)
    expect(netHouseProfit).toBe(0)
  })

  it('starts with displayCurrency USD', () => {
    expect(useGlobalCounterStore.getState().displayCurrency).toBe('USD')
  })
})

describe('useGlobalCounterStore — setCounters', () => {
  it('updates all counter fields', () => {
    useGlobalCounterStore.getState().setCounters({
      totalWagers: 50000,
      totalWinnings: 45000,
      netHouseProfit: 5000,
    })
    const { totalWagers, totalWinnings, netHouseProfit } = useGlobalCounterStore.getState()
    expect(totalWagers).toBe(50000)
    expect(totalWinnings).toBe(45000)
    expect(netHouseProfit).toBe(5000)
  })

  it('does not mutate other state when called', () => {
    useGlobalCounterStore.getState().setCounters({
      totalWagers: 1,
      totalWinnings: 1,
      netHouseProfit: 0,
    })
    expect(useGlobalCounterStore.getState().displayCurrency).toBe('USD')
  })
})

describe('useGlobalCounterStore — setDisplayCurrency', () => {
  it('updates displayCurrency', () => {
    useGlobalCounterStore.getState().setDisplayCurrency('GBP')
    expect(useGlobalCounterStore.getState().displayCurrency).toBe('GBP')
  })
})
