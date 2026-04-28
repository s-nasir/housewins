import { useEffect } from 'react'
import { useGlobalCounterStore } from '../store/globalCounter.store'

const SSE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/api/counter-stream`

export function useCounterSSE(): void {
  const setCounters = useGlobalCounterStore((s) => s.setCounters)

  useEffect(() => {
    const source = new EventSource(SSE_URL)

    const handleCounters = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        setCounters({
          totalWagers: data.totalWagers,
          totalWinnings: data.totalWinnings,
          netHouseProfit: data.netHouseProfit,
        })
      } catch {
      }
    }

    source.addEventListener('counters', handleCounters)

    return () => {
      source.removeEventListener('counters', handleCounters)
      source.close()
    }
  }, [setCounters])
}
