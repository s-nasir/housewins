import { useEffect } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'motion/react'

interface CurrencyBadgeProps {
  icon: string
  value: number
  testId?: string
  className?: string
}

const fmt = new Intl.NumberFormat('en-US')

export function CurrencyBadge({ icon, value, testId, className = '' }: CurrencyBadgeProps) {
  const motionValue = useMotionValue(value)
  const displayValue = useTransform(motionValue, (v) => fmt.format(Math.round(v)))

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.6, ease: 'easeOut' })
    return controls.stop
  }, [value, motionValue])

  return (
    <span
      data-testid={testId}
      className={`inline-flex items-center gap-1 bg-felt-light text-cream text-xs font-body px-2 py-1 rounded-full ${className}`}
    >
      {icon} <motion.span>{displayValue}</motion.span>
    </span>
  )
}
