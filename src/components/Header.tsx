import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, Menu, X, LogOut, LayoutDashboard, Plus, Settings, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { user, signOut, isDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMenuOpen(false)
  }

  // Don't show header on scan page
  if (location.pathname.startsWith('/scan/')) return null

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-warmgray-200 no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-warmgray-900 hover:text-brand-600 transition-colors"
            aria-label="CareCard Home"
          >
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg">CareCard</span>
          </Link>

          {/* Demo badge */}
          {isDemo && (
            <span className="badge-warning text-[10px] hidden sm:inline-flex">
              Demo Mode
            </span>
          )}

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/create" className="btn-ghost">
                  <Plus className="w-4 h-4" />
                  New Card
                </Link>
                <Link to="/settings" className="btn-ghost">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button onClick={handleSignOut} className="btn-ghost text-warmgray-500">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/help" className="btn-ghost">
                  <HelpCircle className="w-4 h-4" />
                  Help
                </Link>
                <Link to="/auth" className="btn-primary text-sm !py-2 !px-4">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-warmgray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-warmgray-100 space-y-1" aria-label="Mobile navigation">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-warmgray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 text-warmgray-500" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  to="/create"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-warmgray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Plus className="w-5 h-5 text-warmgray-500" />
                  <span className="font-medium">Create CareCard</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-warmgray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 text-warmgray-500" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-warmgray-100 transition-colors w-full text-left text-warmgray-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/help"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-warmgray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <HelpCircle className="w-5 h-5 text-warmgray-500" />
                  <span className="font-medium">Help</span>
                </Link>
                <Link
                  to="/auth"
                  className="btn-primary w-full mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
