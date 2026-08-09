import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertTriangle, KeyRound } from 'lucide-react'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import { AuthPage } from '@/pages/AuthPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CreateCardPage } from '@/pages/CreateCardPage'
import { CardDetailPage } from '@/pages/CardDetailPage'
import { ScanPage } from '@/pages/ScanPage'
import { PrintCardPage } from '@/pages/PrintCardPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { HelpPage } from '@/pages/HelpPage'


// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

// Redirect authenticated users away from auth page
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const isScanPage = location.pathname.startsWith('/scan/')

  // Production check: Block application if credentials are not configured
  if (import.meta.env.PROD && !isSupabaseConfigured()) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warmgray-50 px-4 py-12">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-red-100 shadow-xl page-enter">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-warmgray-900 mb-2">
            Configuration Required
          </h1>
          <p className="text-sm text-warmgray-500 mb-6">
            CareCard is deployed in production mode, but could not connect to the database. The Supabase environment variables are missing on Vercel.
          </p>
          <div className="bg-warmgray-50 rounded-xl p-4 text-left space-y-3 border border-warmgray-100 text-xs text-warmgray-600 mb-6 font-mono">
            <div className="flex items-center gap-2 text-warmgray-700 font-semibold mb-1">
              <KeyRound className="w-4 h-4 text-brand-500" />
              Required Variables:
            </div>
            <div>VITE_SUPABASE_URL</div>
            <div>VITE_SUPABASE_ANON_KEY</div>
          </div>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full inline-block py-2.5"
          >
            Configure on Vercel
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh">

      {!isScanPage && <Header />}
      
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/scan/:token" element={<ScanPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Guest-only route */}
          <Route path="/auth" element={<GuestRoute><AuthPage /></GuestRoute>} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateCardPage /></ProtectedRoute>} />
          <Route path="/card/:id" element={<ProtectedRoute><CardDetailPage /></ProtectedRoute>} />
          <Route path="/print/:id" element={<ProtectedRoute><PrintCardPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-container text-center py-20">
              <h1 className="text-4xl font-display font-bold text-warmgray-300 mb-4">404</h1>
              <p className="text-warmgray-500 mb-6">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
