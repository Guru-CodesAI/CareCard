import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Settings, User, Shield, LogOut, AlertCircle, CheckCircle, Heart } from 'lucide-react'

export function SettingsPage() {
  const { user, signOut, isDemo } = useAuth()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="page-container page-enter">
      <h1 className="page-header mb-8 flex items-center gap-2">
        <Settings className="w-7 h-7 text-brand-500" />
        Settings
      </h1>

      {/* Account Info */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-warmgray-400" />
          Account
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-warmgray-50">
            <span className="text-sm text-warmgray-500">Name</span>
            <span className="text-sm font-medium text-warmgray-800">
              {user?.full_name || 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-warmgray-50">
            <span className="text-sm text-warmgray-500">Email</span>
            <span className="text-sm font-medium text-warmgray-800">
              {user?.email}
            </span>
          </div>
          {isDemo && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <p className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Demo mode — data is stored in memory only.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Privacy */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-warmgray-400" />
          Privacy & Security
        </h2>
        <div className="space-y-3 text-sm text-warmgray-600">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>Your CareCards only show information you've explicitly toggled as public.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>Phone numbers and email addresses of trusted contacts are never displayed in the QR code.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>Location tracking is disabled by default and is always temporary when enabled.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>Scan logs are kept with minimal information and short retention.</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={handleSignOut} className="btn-secondary w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        {showDeleteConfirm ? (
          <div className="card border-red-200">
            <p className="text-sm text-red-700 mb-3">
              <strong>Delete your account?</strong> This will permanently remove all your CareCards and data. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button className="btn-danger text-sm" onClick={() => { /* Would need Supabase function */ setShowDeleteConfirm(false) }}>
                Delete Account
              </button>
              <button className="btn-ghost text-sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-ghost w-full text-red-500 hover:text-red-700"
          >
            Delete Account
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-1.5 text-warmgray-400 mb-1">
          <Heart className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">CareCard v1.0</span>
        </div>
        <p className="text-[10px] text-warmgray-300">
          Built for Hack Devengers 1.0
        </p>
      </div>
    </div>
  )
}
