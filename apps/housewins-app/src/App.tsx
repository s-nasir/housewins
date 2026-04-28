import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageShell } from './components'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-4">
      <h1 className="font-display text-4xl text-gold">{name}</h1>
      <p className="text-cream/60">Sprint implementation pending</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <PageShell>
        <Routes>
          <Route path="/" element={<Placeholder name="HouseWins.gg — Lobby" />} />
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
    </BrowserRouter>
  )
}

export default App
