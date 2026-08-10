import { Link } from 'react-router-dom'
import { Heart, Shield, Layers, RefreshCw, Activity, ArrowLeft } from 'lucide-react'

export function ForCaregiversPage() {
  return (
    <div className="page-container page-enter">
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          🛡️ Family Safety Hub
        </div>
        <h1 className="page-header mb-2 text-3xl">Digital Safety Cards for Caregivers</h1>
        <p className="text-warmgray-500 text-sm">
          Keep your family members, patients, or school groups safe with centralized QR emergency contact profiles.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">Centralized Care Management</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-4">
            Whether you are a parent managing safety cards for your kids, a child looking after aging parents, or a healthcare coordinator managing multiple patients, CareCard gives you a single workspace to organize all your profiles.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            From a secure online dashboard, you can view active cards, edit information dynamically, and check active scan alerts to stay informed when assistance is requested.
          </p>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" />
            Key Features for Caregivers
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <RefreshCw className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Instant QR Regeneration</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  If a card is misplaced or you suspect the physical QR was copied, you can deactivate the old token from the dashboard. Regenerate a new token instantly to link the physical card to a new secure UUID.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Activity className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Real-time Scan Notification Logs</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  When someone scans a CareCard QR code, the dashboard records a scan event time, helping you track how often the card is scanned and allowing you to remain informed.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Flexible Public Settings</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  You decide what information to reveal. Toggle public fields on/off individually. Change language preferences or special assistance notes dynamically without reprinting the card.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-warmgray-50">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">Designed for Peace of Mind</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            CareCard simplifies communication during emergency situations. Caregivers can feel confident that their family member is carrying clear, accessible instructions, and that trusted contact lines are ready.
          </p>
        </section>

        <div className="text-center py-4">
          <Link to="/auth" className="btn-primary">
            <Heart className="w-4 h-4" fill="white" />
            Create Caregiver Account
          </Link>
        </div>
      </div>
    </div>
  )
}
