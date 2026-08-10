import { Link } from 'react-router-dom'
import { QrCode, Printer, Scan, Eye, Heart, ArrowLeft, ArrowRight, UserPlus } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function HowItWorksPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="How CareCard Works — Privacy-First QR Assistance"
        description="Learn how CareCard uses a privacy-first QR card to help people share essential assistance information and reconnect with trusted contacts."
        path="/how-it-works"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          <QrCode className="w-4 h-4" /> User Guide
        </div>
        <h1 className="page-header mb-2">How CareCard Works</h1>
        <p className="text-warmgray-500 text-sm">
          A step-by-step guide to setting up and using a privacy-first QR emergency contact card.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <section className="card flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 mt-1">
            <UserPlus className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">Step 1</div>
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">Create a CareCard Profile</h2>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              A caregiver registers a free account and fills in the card holder's basic information. You choose exactly what information can be publicly displayed when scanned, such as language preferences or simple mobility needs, while keeping sensitive phone numbers secure.
            </p>
          </div>
        </section>

        {/* Step 2 */}
        <section className="card flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-1">
            <Printer className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Step 2</div>
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">Print and Carry the QR Card</h2>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              Once configuration is complete, generate the card and print it on standard cardstock, paper, or sticker sheets. The card holder carries the physical card in their wallet, pockets, or wears it as a keychain, cardholder, or lanyard.
            </p>
          </div>
        </section>

        {/* Step 3 */}
        <section className="card flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-1">
            <Scan className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1">Step 3</div>
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">A Helper Scans the QR Code</h2>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              If the card holder needs assistance (such as when lost, confused, or unable to speak English/local language), a helper scans the QR code using any smartphone camera. **No app installation or account registration is required** for the helper.
            </p>
          </div>
        </section>

        {/* Step 4 */}
        <section className="card flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-1">
            <Eye className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">Step 4</div>
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">View Permitted Assistance Data</h2>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              The helper is shown a mobile-optimized public page displaying only the information approved by the caregiver. Sensitive contact numbers are hidden until interaction is triggered. Caregivers receive a notification of the scan event in their dashboard.
            </p>
          </div>
        </section>

        {/* Step 5 */}
        <section className="card flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-1">
            <Heart className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Step 5</div>
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">Reconnect with Trusted Contacts</h2>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              The helper can tap the contact buttons on their screen to call or email the caregiver directly from their native dialer, enabling a quick and safe reconnection without putting private numbers directly in the QR code text or public URLs.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-6">
          <Link to="/auth" className="btn-primary">
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
