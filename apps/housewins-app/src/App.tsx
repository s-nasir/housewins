import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageShell } from './components'
import { DisclaimerModal } from './components/modals/DisclaimerModal'
import { LobbyPage } from './pages/LobbyPage'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-4">
      <h1 className="font-display text-4xl text-gold">{name}</h1>
      <p className="text-cream/60">Sprint implementation pending</p>
    </div>
  )
}

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(
    () => sessionStorage.getItem('disclaimer_seen') !== 'true'
  )

  useEffect(() => {
    const handleOpenDisclaimer = () => setShowDisclaimer(true)
    window.addEventListener('open-disclaimer', handleOpenDisclaimer)
    return () => window.removeEventListener('open-disclaimer', handleOpenDisclaimer)
  }, [])

  return (
    <BrowserRouter>
      <PageShell>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/roulette" element={<Placeholder name="American Roulette" />} />
          <Route path="/blackjack" element={<Placeholder name="Classic Blackjack" />} />
          <Route path="/scratchers" element={<Placeholder name="Digital Scratchers" />} />
          <Route path="/slots" element={<Placeholder name="Video Slots" />} />
          <Route path="/keno" element={<Placeholder name="Keno" />} />
          <Route path="/poker" element={<Placeholder name="Video Poker" />} />
          <Route path="/support" element={<Placeholder name="Support" />} />
          <Route path="*" element={<Placeholder name="404 — Page Not Found" />} />
        </Routes>
      </PageShell>
      <DisclaimerModal isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />
    </BrowserRouter>
  )
}

export default App
