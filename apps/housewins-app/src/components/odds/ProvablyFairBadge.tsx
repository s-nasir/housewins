import { useState, useRef, useEffect } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ProvablyFairBadgeProps {
  commitment: string
  serverSeed: string | null
  nonce: number
}

export function ProvablyFairBadge({ commitment, serverSeed, nonce }: ProvablyFairBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        tabIndex={0}
        role="button"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors',
          'bg-chip-green text-cream hover:bg-chip-green/90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt'
        )}
      >
        <ShieldCheck data-testid="shield-icon" size={14} />
        Provably Fair ✓
      </button>

      {isExpanded && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 max-w-[calc(100vw-2rem)] bg-felt-light border border-felt/50 rounded-xl shadow-card p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-cream font-body font-semibold text-sm">Provably Fair Details</h4>
            <button
              onClick={() => setIsExpanded(false)}
              aria-label="Close"
              className="text-cream/60 hover:text-cream transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-cream/70 text-xs font-body block mb-1">Commitment Hash</label>
              <code className="block text-gold font-mono text-xs bg-felt/50 px-2 py-1.5 rounded break-all">
                {commitment}
              </code>
            </div>

            <div>
              <label className="text-cream/70 text-xs font-body block mb-1">Server Seed</label>
              {serverSeed ? (
                <code className="block text-gold font-mono text-xs bg-felt/50 px-2 py-1.5 rounded break-all">
                  {serverSeed}
                </code>
              ) : (
                <p className="text-cream/50 text-xs font-body italic px-2 py-1.5">
                  Pending reveal
                </p>
              )}
            </div>

            <div>
              <label className="text-cream/70 text-xs font-body block mb-1">Nonce</label>
              <code className="block text-gold font-mono text-xs bg-felt/50 px-2 py-1.5 rounded">
                {nonce}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
