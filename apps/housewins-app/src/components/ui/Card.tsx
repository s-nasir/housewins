import { cn } from '../../lib/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-felt-light rounded-xl shadow-card border border-felt/50',
        className,
      )}
    >
      {children}
    </div>
  )
}
