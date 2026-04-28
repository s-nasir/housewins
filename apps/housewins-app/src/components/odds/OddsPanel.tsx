import { useState } from 'react'
import { BarChart3, ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

export interface OddsPanelProps {
  winProbability: string
  houseEdge: string
  expectedLossPer100: string
  rtp?: string
}

export function OddsPanel({ winProbability, houseEdge, expectedLossPer100, rtp }: OddsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const winPercentage = parseFloat(winProbability.replace('%', ''))
  const houseWinPercentage = (100 - winPercentage).toFixed(2)
  
  const winRounds = Math.round(winPercentage)
  const houseRounds = 100 - winRounds

  return (
    <div className="bg-felt-light rounded-xl p-4 border border-felt/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        tabIndex={0}
        className="lg:hidden w-full flex items-center justify-between text-cream font-body font-semibold text-base mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
      >
        <span className="flex items-center gap-2">
          <BarChart3 size={18} className="text-gold" />
          📊 Your Odds
        </span>
        <ChevronDown
          data-testid="chevron-icon"
          size={18}
          className={cn(
            'transition-transform text-cream/60',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      <div className={cn(
        'lg:block',
        !isExpanded && 'hidden'
      )}>
        <h3 className="hidden lg:flex items-center gap-2 text-cream font-body font-semibold text-base mb-4">
          <BarChart3 size={18} className="text-gold" />
          📊 Your Odds
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-cream/80 text-sm font-body">Win Probability</span>
              <span className="text-gold font-mono text-sm font-semibold">{winProbability}</span>
            </div>
            <div className="w-full h-3 bg-felt rounded-full overflow-hidden">
              <motion.div
                data-testid="win-probability-bar"
                initial={{ width: 0 }}
                animate={{ width: winProbability }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gold rounded-full"
                style={{ width: winProbability }}
              />
            </div>
            <p className="text-cream/60 text-xs font-body mt-1">
              (House wins {houseWinPercentage}%)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-cream/80 text-sm font-body">House Edge</span>
              <span className="text-burgundy font-mono text-sm font-semibold">{houseEdge}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-cream/80 text-sm font-body">Expected loss per $100</span>
              <span className="text-burgundy font-mono text-sm font-semibold">{expectedLossPer100}</span>
            </div>

            {rtp && (
              <div className="flex items-center justify-between">
                <span className="text-cream/80 text-sm font-body">RTP</span>
                <span className="text-chip-green font-mono text-sm font-semibold">{rtp}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-felt/50">
            <p className="text-cream/70 text-sm font-body mb-2">In 100 rounds:</p>
            <p className="text-cream/60 text-xs font-body">
              You win ~{winRounds} {winRounds === 1 ? 'time' : 'times'}
            </p>
            <p className="text-cream/60 text-xs font-body">
              House wins ~{houseRounds} {houseRounds === 1 ? 'time' : 'times'}
            </p>
          </div>

          <div className="pt-2">
            <a
              href="#"
              className="text-gold/70 hover:text-gold text-xs font-body underline"
            >
              ? How is this calculated?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
