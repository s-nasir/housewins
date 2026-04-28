import { cn } from '../../lib/utils'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'gold'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-chip-green text-cream',
  yellow: 'bg-yellow-500 text-felt-dark',
  red:    'bg-chip-red text-cream',
  gold:   'bg-gold text-felt-dark',
}

export function Badge({ variant = 'green', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
