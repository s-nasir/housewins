import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCurrencyStore } from '../store/currency.store'
import { usePassiveDrip } from './usePassiveDrip'

class MockBroadcastChannel {
  name: string
  private _onmessage: ((ev: MessageEvent) => void) | null = null
  private _listeners: Array<(ev: MessageEvent) => void> = []
  private static registry: Map<string, MockBroadcastChannel[]> = new Map()

  get onmessage() {
    return this._onmessage
  }

  set onmessage(handler: ((ev: MessageEvent) => void) | null) {
    this._onmessage = handler
  }

  constructor(name: string) {
    this.name = name
    const existing = MockBroadcastChannel.registry.get(name) ?? []
    MockBroadcastChannel.registry.set(name, [...existing, this])
  }

  postMessage(data: unknown) {
    const peers = MockBroadcastChannel.registry.get(this.name) ?? []
    const evt = new MessageEvent('message', { data })
    for (const peer of peers) {
      if (peer !== this) {
        if (peer._onmessage) peer._onmessage(evt)
        peer._listeners.forEach((fn) => fn(evt))
      }
    }
  }

  addEventListener(_type: string, handler: (ev: MessageEvent) => void) {
    this._listeners.push(handler)
  }

  removeEventListener(_type: string, handler: (ev: MessageEvent) => void) {
    this._listeners = this._listeners.filter((fn) => fn !== handler)
  }

  close() {
    const peers = MockBroadcastChannel.registry.get(this.name) ?? []
    MockBroadcastChannel.registry.set(
      this.name,
      peers.filter((p) => p !== this),
    )
    this._onmessage = null
    this._listeners = []
  }

  static reset() {
    MockBroadcastChannel.registry.clear()
  }
}

vi.stubGlobal('BroadcastChannel', MockBroadcastChannel)

beforeEach(() => {
  useCurrencyStore.setState({ chips: 1000, tokens: 500, tickets: 10 })
  MockBroadcastChannel.reset()
  vi.useFakeTimers()
})

afterEach(() => {
  MockBroadcastChannel.reset()
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('usePassiveDrip — leader tab earns currency', () => {
  it('adds 10 chips and 5 tokens after 10 seconds', () => {
    const { unmount } = renderHook(() => usePassiveDrip())

    act(() => {
      vi.advanceTimersByTime(10_100)
    })

    const { chips, tokens } = useCurrencyStore.getState()
    expect(chips).toBe(1010)
    expect(tokens).toBe(505)

    unmount()
  })

  it('adds currency on each 10s tick (multiple ticks)', () => {
    const { unmount } = renderHook(() => usePassiveDrip())

    act(() => {
      vi.advanceTimersByTime(30_100)
    })

    const { chips, tokens } = useCurrencyStore.getState()
    expect(chips).toBe(1030)
    expect(tokens).toBe(515)

    unmount()
  })
})

describe('usePassiveDrip — second tab does NOT earn currency', () => {
  it('only one of two concurrent hooks earns currency (leader election)', () => {
    const { unmount: unmount1 } = renderHook(() => usePassiveDrip())
    const { unmount: unmount2 } = renderHook(() => usePassiveDrip())

    act(() => {
      vi.advanceTimersByTime(10_100)
    })

    const { chips, tokens } = useCurrencyStore.getState()
    expect(chips).toBe(1010)
    expect(tokens).toBe(505)

    unmount1()
    unmount2()
  })
})

describe('usePassiveDrip — cleanup on unmount', () => {
  it('stops drip after unmount', () => {
    const { unmount } = renderHook(() => usePassiveDrip())

    act(() => {
      vi.advanceTimersByTime(10_100)
    })

    expect(useCurrencyStore.getState().chips).toBe(1010)

    unmount()

    act(() => {
      vi.advanceTimersByTime(10_100)
    })

    expect(useCurrencyStore.getState().chips).toBe(1010)
  })
})
