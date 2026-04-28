import { useLocation } from 'react-router-dom'
import { Header, type HeaderProps } from './Header'
import { Footer } from './Footer'
import { usePassiveDrip } from '../../hooks/usePassiveDrip'
import { useCounterSSE } from '../../hooks/useCounterSSE'
import { useGlobalCounterStore } from '../../store/globalCounter.store'

interface PageShellProps extends Omit<HeaderProps, 'counters'> {
  children: React.ReactNode
}

const GAME_ROUTES = ['/roulette', '/blackjack', '/scratchers', '/slots', '/keno', '/poker']

export function PageShell({ children, balance }: PageShellProps) {
  usePassiveDrip()
  useCounterSSE()
  const { pathname } = useLocation()
  const isLobby = pathname === '/'
  const isGamePage = GAME_ROUTES.includes(pathname)

  const netHouseProfit = useGlobalCounterStore((s) => s.netHouseProfit)
  const totalWinnings = useGlobalCounterStore((s) => s.totalWinnings)

  const liveCounters = netHouseProfit > 0 || totalWinnings > 0
    ? { houseProfit: netHouseProfit, totalWinnings }
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header counters={liveCounters} balance={balance} showBack={isGamePage} />
      <main className="flex-1">
        {children}
      </main>
      {isLobby && <Footer />}
    </div>
  )
}
