import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      btnRef.current?.focus()
    }
  }, [isOpen])

  function handleDismiss() {
    sessionStorage.setItem('disclaimer_seen', 'true')
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            data-testid="disclaimer-backdrop"
            className="fixed inset-0 bg-felt-dark/80 z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="disclaimer-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onKeyDown={handleKeyDown}
              className="bg-felt-dark border border-felt-light/40 rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 focus:outline-none"
              tabIndex={-1}
            >
              <h2
                id="disclaimer-title"
                className="font-display text-2xl text-gold text-center"
              >
                Before You Play
              </h2>

              <ul className="flex flex-col gap-3 text-cream/80 font-body text-sm">
                <li data-testid="bullet-no-real-money" className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span>This site uses <strong>no real money</strong>. All wagers are fictional.</span>
                </li>
                <li data-testid="bullet-fictional-currency" className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span>All chips, tokens, and tickets are <strong>fictional currency</strong> with no real-world value.</span>
                </li>
                <li data-testid="bullet-educational" className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span>HouseWins.gg is an <strong>educational simulation</strong> designed to demonstrate how casino odds work.</span>
                </li>
              </ul>

              <p className="text-cream/50 text-xs text-center font-body">
                If you or someone you know has a gambling problem, call the{' '}
                <strong className="text-cream/80">National Problem Gambling Helpline</strong>:{' '}
                <strong className="text-gold">1-800-522-4700</strong>
              </p>

              <button
                ref={btnRef}
                onClick={handleDismiss}
                className="bg-gold text-felt-dark font-display font-bold text-base px-6 py-3 rounded-xl hover:bg-gold/90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                I Understand — Let's Play
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
