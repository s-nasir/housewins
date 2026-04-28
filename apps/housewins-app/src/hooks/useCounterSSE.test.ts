import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGlobalCounterStore } from '../store/globalCounter.store'
import { useCounterSSE } from './useCounterSSE'

type EventHandler = (event: MessageEvent) => void

class MockEventSource {
  url: string
  private _listeners: Map<string, EventHandler[]> = new Map()
  static instances: MockEventSource[] = []
  onerror: ((event: Event) => void) | null = null

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }

  addEventListener(type: string, handler: EventHandler) {
    const existing = this._listeners.get(type) ?? []
    this._listeners.set(type, [...existing, handler])
  }

  removeEventListener(type: string, handler: EventHandler) {
    const existing = this._listeners.get(type) ?? []
    this._listeners.set(type, existing.filter(h => h !== handler))
  }

  emit(type: string, data: string) {
    const handlers = this._listeners.get(type) ?? []
    const event = new MessageEvent(type, { data })
    handlers.forEach(h => h(event))
  }

  close() {
    this._listeners.clear()
  }

  static reset() {
    MockEventSource.instances = []
  }
}

vi.stubGlobal('EventSource', MockEventSource)

beforeEach(() => {
  useGlobalCounterStore.setState({
    totalWagers: 0,
    totalWinnings: 0,
    netHouseProfit: 0,
    displayCurrency: 'USD',
  })
  MockEventSource.reset()
})

afterEach(() => {
  MockEventSource.reset()
})

describe('useCounterSSE', () => {
  it('opens an EventSource connection to /api/counter-stream', () => {
    renderHook(() => useCounterSSE())
    expect(MockEventSource.instances).toHaveLength(1)
    expect(MockEventSource.instances[0].url).toContain('/api/counter-stream')
  })

  it('updates the store when a counters event is received', () => {
    const { unmount } = renderHook(() => useCounterSSE())
    const source = MockEventSource.instances[0]

    act(() => {
      source.emit('counters', JSON.stringify({
        totalWagers: 99000,
        totalWinnings: 88000,
        netHouseProfit: 11000,
      }))
    })

    const { totalWagers, totalWinnings, netHouseProfit } = useGlobalCounterStore.getState()
    expect(totalWagers).toBe(99000)
    expect(totalWinnings).toBe(88000)
    expect(netHouseProfit).toBe(11000)

    unmount()
  })

  it('closes the EventSource on unmount', () => {
    const closeSpy = vi.spyOn(MockEventSource.prototype, 'close')
    const { unmount } = renderHook(() => useCounterSSE())
    unmount()
    expect(closeSpy).toHaveBeenCalledOnce()
  })

  it('handles multiple successive counter events', () => {
    const { unmount } = renderHook(() => useCounterSSE())
    const source = MockEventSource.instances[0]

    act(() => {
      source.emit('counters', JSON.stringify({ totalWagers: 100, totalWinnings: 90, netHouseProfit: 10 }))
    })
    act(() => {
      source.emit('counters', JSON.stringify({ totalWagers: 200, totalWinnings: 180, netHouseProfit: 20 }))
    })

    expect(useGlobalCounterStore.getState().totalWagers).toBe(200)
    unmount()
  })
})
