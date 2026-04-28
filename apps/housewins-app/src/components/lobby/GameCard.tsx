import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

export interface GameCardProps {
  id: string
  name: string
  route: string
  houseEdge: number
  icon: string
  color: string
}

function edgeBadgeClass(edge: number): string {
  if (edge <= 0.01) return 'bg-chip-green text-cream'
  if (edge <= 0.1) return 'bg-yellow-500 text-felt-dark'
  return 'bg-chip-red text-cream'
}

const pct = (edge: number) => `${(edge * 100).toFixed(2)}%`

export function GameCard({ id, name, route, houseEdge, icon, color }: GameCardProps) {
  return (
    <motion.div
      data-testid={`gamecard-${id}`}
      className="relative flex flex-col rounded-xl bg-felt-dark border border-felt-light overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.03, boxShadow: '0 0 16px rgba(201,168,76,0.4)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        data-testid="gamecard-thumb"
        className={`${color} flex items-center justify-center h-32`}
      >
        <span data-testid="gamecard-icon" className="text-5xl select-none">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <span
          data-testid="gamecard-name"
          className="font-display text-cream text-base font-semibold leading-tight"
        >
          {name}
        </span>

        <div className="flex items-center justify-between">
          <span
            data-testid="gamecard-edge-badge"
            className={`text-xs font-mono px-2 py-0.5 rounded-full font-semibold ${edgeBadgeClass(houseEdge)}`}
          >
            {pct(houseEdge)}
          </span>

          <Link
            data-testid="gamecard-link"
            to={route}
            className="text-gold text-sm font-body font-semibold hover:text-gold-light transition-colors"
          >
            Play →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
