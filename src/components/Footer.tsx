import { Link, useLocation } from 'react-router-dom'
import { Heart } from 'lucide-react'

export function Footer() {
  const location = useLocation()

  // Minimal footer on scan page
  if (location.pathname.startsWith('/scan/')) {
    return (
      <footer className="py-6 text-center text-xs text-warmgray-400 no-print">
        <p>CareCard is a communication aid and does not replace emergency services.</p>
      </footer>
    )
  }

  return (
    <footer className="border-t border-warmgray-200 mt-auto no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-warmgray-500">
            <Heart className="w-4 h-4 text-brand-500" fill="currentColor" />
            <span className="text-sm font-medium">CareCard</span>
            <span className="text-xs text-warmgray-400">— A small card. A safer connection.</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-xs sm:text-sm text-warmgray-500" aria-label="Footer navigation">
            <Link to="/how-it-works" className="hover:text-brand-500 transition-colors">How It Works</Link>
            <Link to="/for-elderly" className="hover:text-brand-500 transition-colors">For Elderly</Link>
            <Link to="/for-children" className="hover:text-brand-500 transition-colors">For Children</Link>
            <Link to="/for-caregivers" className="hover:text-brand-500 transition-colors">For Caregivers</Link>
            <Link to="/accessibility" className="hover:text-brand-500 transition-colors">Accessibility</Link>
            <Link to="/security" className="hover:text-brand-500 transition-colors">Security</Link>
            <Link to="/privacy" className="hover:text-brand-500 transition-colors">Privacy</Link>
            <Link to="/faq" className="hover:text-brand-500 transition-colors">FAQ</Link>
            <Link to="/help" className="hover:text-brand-500 transition-colors">Help</Link>
          </nav>
        </div>

        <p className="mt-4 text-xs text-warmgray-400 text-center sm:text-left">
          CareCard is a communication aid and does not replace emergency services.
          If someone is in immediate danger, contact the appropriate local emergency service.
        </p>
      </div>
    </footer>
  )
}
