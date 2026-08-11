import { Link } from 'react-router-dom'
import { Heart, Shield, Layers, RefreshCw, Activity, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function ForCaregiversPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="Digital Safety Card for Caregivers | CareCard"
        description="Learn how a caregiver QR card protects family members. Manage family emergency QR codes, caregiver emergency contact cards, and elderly parent safety cards."
        path="/for-caregivers"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          🛡️ Family Safety Hub
        </div>
        <h1 className="page-header mb-2 text-3xl font-display">Digital Safety Card for Caregivers</h1>
        <p className="text-warmgray-500 text-sm">
          Keep your family members, patients, or school groups safe with a centralized caregiver QR card dashboard.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">Centralized Caregiver QR Card Management</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-4">
            Whether you are a parent setting up a family emergency QR code for your kids, or a child setting up an elderly parent safety card, CareCard gives you a single workspace to organize all your caregiver emergency contact cards.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            From a secure online dashboard, you can edit caregiver emergency contact cards dynamically, view active scan alerts, and update trusted contact information without needing to reprint the physical QR code card.
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
