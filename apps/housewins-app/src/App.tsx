import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="font-display text-4xl text-gold">{name}</h1>
      <p className="text-cream/60">Sprint implementation pending</p>
      <Link to="/" className="text-gold underline text-sm">← Back to Lobby</Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
