import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/LoadingSpinner'

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
