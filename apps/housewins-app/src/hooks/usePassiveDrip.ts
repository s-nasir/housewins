import { useEffect, useRef } from 'react'
import { useCurrencyStore } from '../store/currency.store'

const CHANNEL_NAME = 'housewins-drip-leader'
const DRIP_INTERVAL_MS = 10_000
const CHIPS_PER_TICK = 10
const TOKENS_PER_TICK = 5

export function usePassiveDrip(): void {
  const isLeaderRef = useRef(false)
  const claimCancelledRef = useRef(false)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    const handleMessage = (ev: MessageEvent) => {
      if (ev.data === 'leader-alive' || ev.data === 'claim-leader') {
        claimCancelledRef.current = true
        isLeaderRef.current = false
      }
      if (ev.data === 'claim-leader' && isLeaderRef.current) {
        channel.postMessage('leader-alive')
      }
    }

    channel.addEventListener('message', handleMessage)
    channel.postMessage('claim-leader')

    const claimTimeout = setTimeout(() => {
      if (claimCancelledRef.current) return

      isLeaderRef.current = true

      timerRef.current = setInterval(() => {
        if (!isLeaderRef.current) return
        useCurrencyStore.getState().addChips(CHIPS_PER_TICK)
        useCurrencyStore.getState().addTokens(TOKENS_PER_TICK)
      }, DRIP_INTERVAL_MS)
    }, 50)

    return () => {
      clearTimeout(claimTimeout)
      if (timerRef.current !== null) clearInterval(timerRef.current)
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [])
}
