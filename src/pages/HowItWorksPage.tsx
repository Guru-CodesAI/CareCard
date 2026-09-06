import { Link } from 'react-router-dom'
import { QrCode, Printer, Scan, Eye, Heart, ArrowLeft, ArrowRight, UserPlus } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function HowItWorksPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="CareCard QR — How the Emergency Contact Card Works"
        description="Learn how the CareCard QR card works to connect helpers with caregivers in an emergency without exposing sensitive data."
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
        <h1 className="page-header mb-2 text-3xl font-display">How the CareCard QR Card Works</h1>
        <p className="text-warmgray-500 text-sm">
          A step-by-step guide to setting up and using your CareCard QR emergency contact card without installing any apps.
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
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">Create a Digital Emergency QR Code Profile</h2>
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
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">Print and Carry the QR Safety Card</h2>
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
            <h2 className="text-lg font-semibold text-warmgray-900 mb-2">Scan the QR Contact Card (No App Required)</h2>
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
              The helper is shown a mobile-optimized public page displaying only the information approved by the caregiver — such as the cardholder's display name, preferred language, and accessibility needs. The caregiver's scan dashboard is updated with a timestamp of the scan event.
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
              The helper sees the trusted contact's name and relationship. They can use this information to reach out through their own device. This deployment shows contact details directly to the helper. A future production release may add a server-side communication relay so contact numbers remain fully private.
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
