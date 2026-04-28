import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react'
import { useMotionValue, useSpring, useTransform, motion } from 'motion/react'
import { CurrencyBadge } from '../ui/CurrencyBadge'
import { useCurrencyStore } from '../../store/currency.store'

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

const SPRING_CONFIG = { stiffness: 60, damping: 20 }

function AnimatedCounter({ value, testId, label }: { value: number; testId: string; label: string }) {
  const mv = useMotionValue(value)
  const spring = useSpring(mv, SPRING_CONFIG)
  const display = useTransform(spring, (n) => new Intl.NumberFormat('en-US').format(Math.round(n)))

  useEffect(() => {
    mv.set(value)
  }, [mv, value])

  return (
    <span data-testid={testId} className="font-mono text-xs text-cream/60 whitespace-nowrap hidden sm:inline">
      {label}: <motion.span>{display}</motion.span>
    </span>
  )
}

export function Header({ counters, balance, showBack = false }: HeaderProps) {
  const [muted, setMuted] = useState(false)
  const storeChips = useCurrencyStore((s) => s.chips)
  const storeTokens = useCurrencyStore((s) => s.tokens)
  const storeTickets = useCurrencyStore((s) => s.tickets)

  const chips = balance?.chips ?? storeChips
  const tokens = balance?.tokens ?? storeTokens
  const tickets = balance?.tickets ?? storeTickets

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
        {counters != null ? (
          <>
            <AnimatedCounter value={counters.houseProfit} testId="counter-house" label="House" />
            <span className="text-cream/30 hidden sm:inline text-xs">|</span>
            <AnimatedCounter value={counters.totalWinnings} testId="counter-players" label="Players" />
          </>
        ) : (
          <>
            <span data-testid="counter-house" className="font-mono text-xs text-cream/60 whitespace-nowrap hidden sm:inline">
              House: —
            </span>
            <span className="text-cream/30 hidden sm:inline text-xs">|</span>
            <span data-testid="counter-players" className="font-mono text-xs text-cream/60 whitespace-nowrap hidden sm:inline">
              Players: —
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <CurrencyBadge icon="🪙" value={chips} testId="badge-chips" />
        <CurrencyBadge icon="🎫" value={tokens} testId="badge-tokens" className="hidden xs:inline-flex sm:inline-flex" />
        <CurrencyBadge icon="🎟" value={tickets} testId="badge-tickets" className="hidden sm:inline-flex" />

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
