import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react'

export interface Counters {
  houseProfit: number
  totalWinnings: number
}

export interface Balance {
  chips: number
  tokens: number
  tickets: number
}

export interface HeaderProps {
  counters?: Counters | null
  balance?: Balance
  showBack?: boolean
}

const DEFAULT_BALANCE: Balance = { chips: 1000, tokens: 500, tickets: 10 }

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US').format(n)

export function Header({ counters, balance = DEFAULT_BALANCE, showBack = false }: HeaderProps) {
  const [muted, setMuted] = useState(false)

  return (
    <header className="bg-felt-dark px-4 py-3 flex items-center gap-3 min-h-[56px] sticky top-0 z-50">
      <div className="flex items-center gap-2 flex-shrink-0">
        {showBack && (
          <Link to="/" data-testid="back-arrow" className="text-cream/70 hover:text-cream mr-1">
            <ArrowLeft size={18} />
          </Link>
        )}
        <span className="font-display text-gold font-bold text-lg leading-none select-none">
          HouseWins.gg
        </span>
      </div>

      <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
        <span
          data-testid="counter-house"
          className="font-mono text-xs text-cream/60 whitespace-nowrap hidden sm:inline"
        >
          House: {counters != null ? fmt(counters.houseProfit) : '—'}
        </span>
        <span className="text-cream/30 hidden sm:inline text-xs">|</span>
        <span
          data-testid="counter-players"
          className="font-mono text-xs text-cream/60 whitespace-nowrap hidden sm:inline"
        >
          Players: {counters != null ? fmt(counters.totalWinnings) : '—'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          data-testid="badge-chips"
          className="inline-flex items-center gap-1 bg-felt-light text-cream text-xs font-body px-2 py-1 rounded-full"
        >
          🪙 {fmt(balance.chips)}
        </span>
        <span
          data-testid="badge-tokens"
          className="inline-flex items-center gap-1 bg-felt-light text-cream text-xs font-body px-2 py-1 rounded-full hidden xs:inline-flex sm:inline-flex"
        >
          🎫 {fmt(balance.tokens)}
        </span>
        <span
          data-testid="badge-tickets"
          className="inline-flex items-center gap-1 bg-felt-light text-cream text-xs font-body px-2 py-1 rounded-full hidden sm:inline-flex"
        >
          🎟 {fmt(balance.tickets)}
        </span>

        <button
          data-testid="mute-toggle"
          onClick={() => setMuted(m => !m)}
          className="text-cream/70 hover:text-cream transition-colors p-1 rounded"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted
            ? <VolumeX size={18} data-testid="icon-volume-off" />
            : <Volume2 size={18} data-testid="icon-volume-on" />
          }
        </button>
      </div>
    </header>
  )
}
