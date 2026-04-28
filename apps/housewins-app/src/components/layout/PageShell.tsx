import { useLocation } from 'react-router-dom'
import { Header, type HeaderProps } from './Header'
import { Footer } from './Footer'

interface PageShellProps extends HeaderProps {
  children: React.ReactNode
}

const GAME_ROUTES = ['/roulette', '/blackjack', '/scratchers', '/slots', '/keno', '/poker']

export function PageShell({ children, counters, balance }: PageShellProps) {
  const { pathname } = useLocation()
  const isLobby = pathname === '/'
  const isGamePage = GAME_ROUTES.includes(pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <Header counters={counters} balance={balance} showBack={isGamePage} />
      <main className="flex-1">
        {children}
      </main>
      {isLobby && <Footer />}
    </div>
  )
}
