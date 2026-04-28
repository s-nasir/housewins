import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-felt-dark border-t border-felt-light/30 px-4 py-4 mt-auto">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-cream/50">
        <Link to="/disclaimer" className="hover:text-cream/80 transition-colors">
          Disclaimer
        </Link>
        <Link to="/responsible-gambling" className="hover:text-cream/80 transition-colors">
          Responsible Gambling
        </Link>
        <Link to="/support" className="hover:text-cream/80 transition-colors">
          Support ♥
        </Link>
      </nav>
    </footer>
  )
}
