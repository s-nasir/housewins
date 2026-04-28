import { cn } from '../../lib/utils'

type ChipColor = 'red' | 'blue' | 'green' | 'black' | 'white'

export interface ChipProps {
  color: ChipColor
  denomination: number
  selected?: boolean
  onClick?: () => void
  className?: string
}

const colorClasses: Record<ChipColor, string> = {
  red:   'bg-chip-red   text-cream  border-red-400/50',
  blue:  'bg-chip-blue  text-cream  border-blue-300/50',
  green: 'bg-chip-green text-cream  border-green-400/50',
  black: 'bg-chip-black text-cream  border-neutral-600/50',
  white: 'bg-chip-white text-felt-dark border-neutral-300/70',
}

const fmt = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 0 })

export function Chip({ color, denomination, selected = false, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${denomination} chip`}
      className={cn(
        'relative inline-flex items-center justify-center',
        'w-12 h-12 rounded-full border-4 shadow-chip',
        'font-mono font-bold text-xs select-none',
        'transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt',
        'hover:scale-110 active:scale-95',
        colorClasses[color],
        selected && 'scale-110 ring-2 ring-gold ring-offset-2 ring-offset-felt',
        className,
      )}
    >
      <span className="relative z-10 leading-none">{fmt.format(denomination)}</span>
      <span
        aria-hidden="true"
        className="absolute inset-1 rounded-full border-2 border-white/20 pointer-events-none"
      />
    </button>
  )
}
