import { Link } from 'react-router-dom'
import {
  Heart, QrCode, Phone, Shield, Scan, User, 
  HelpCircle, ArrowLeft, ChevronRight, AlertTriangle,
  RefreshCw, Lock, EyeOff, Printer, Info
} from 'lucide-react'
import { SEO } from '@/components/SEO'

export function HelpPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="CareCard Help — QR Safety Card Guide"
        description="Learn how to create, carry, scan, and manage a CareCard QR safety card. Access our official user guide and troubleshooting tips."
        path="/help"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" /> User Guide
        </div>
        <h1 className="page-header mb-2 text-3xl font-display flex items-center gap-2">
          CareCard Help & User Guide
        </h1>
        <p className="text-warmgray-500 text-sm">
          Welcome to the official CareCard support and assistance directory. Learn how to use and manage your QR emergency contact card.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section: What is CareCard? */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="what-is-carecard">
            What is CareCard?
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            CareCard is a privacy-first digital assistance system designed to connect senior citizens, children, and individuals who may need help communicating with their trusted contacts. 
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            By combining a physical QR card with a secure caregiver dashboard, families can ensure that if a loved one gets disoriented or lost, a helper can scan the card to reconnect them safely without exposing private phone numbers or addresses.
          </p>
        </section>

        {/* Section: How does a CareCard QR work? */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="how-does-qr-work">
            How does a CareCard QR work?
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            Every CareCard contains a secure, opaque QR code. When scanned by a helper's mobile camera:
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside mb-3">
            <li>The browser requests our secure database to resolve the card's public profile.</li>
            <li>No personal identification or private contact numbers are hardcoded inside the physical card's QR pattern.</li>
            <li><strong>No app registration or app installation is required</strong> for the helper. They simply view the responsive browser page.</li>
          </ul>
        </section>

        {/* Section: How to create a CareCard */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="how-to-create">
            How to create a CareCard
          </h2>
          <div className="flex gap-4 items-start bg-warmgray-50 p-4 rounded-xl border border-warmgray-200">
            <User className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warmgray-600 leading-relaxed mb-2">
                Setting up a CareCard QR profile is quick and free:
              </p>
              <ol className="list-decimal list-inside text-sm text-warmgray-600 space-y-1">
                <li>Create a caregiver account or sign in.</li>
                <li>Go to the dashboard and select <strong>Create Card</strong>.</li>
                <li>Enter basic cardholder information (name, language, optional details).</li>
                <li>Add one or more trusted contact numbers and emails.</li>
                <li>Generate the profile and download the printable QR card card.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section: How to scan a CareCard */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="how-to-scan">
            How to scan a CareCard
          </h2>
          <div className="flex gap-4 items-start bg-warmgray-50 p-4 rounded-xl border border-warmgray-200">
            <Scan className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warmgray-600 leading-relaxed mb-2">
                If you encounter someone carrying a CareCard who needs assistance:
              </p>
              <ol className="list-decimal list-inside text-sm text-warmgray-600 space-y-1">
                <li>Open your smartphone's native camera app or any QR reader.</li>
                <li>Point the camera at the card's QR code.</li>
                <li>Tap the link banner that appears on your screen.</li>
                <li>Review the shared communication needs or languages.</li>
                <li>View the trusted contact's name and relationship to help reconnect the cardholder with their family.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section: How to deactivate a CareCard */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="how-to-deactivate">
            How to deactivate a CareCard
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            If a printed QR emergency card is misplaced or stolen, you can deactivate it immediately to secure your data:
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside">
            <li>Log into your CareCard dashboard, click on the card, and select <strong>Deactivate Card</strong>.</li>
            <li>This turns off public profile visibility. Anyone scanning the deactivated QR code will see a "Card Deactivated" warning instead of your profile.</li>
          </ul>
        </section>

        {/* Section: How to regenerate a CareCard QR */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="how-to-regenerate">
            How to regenerate a CareCard QR
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            If you want to keep the same profile details but render old printed QR codes invalid, you can regenerate the secure token:
          </p>
          <div className="flex items-start gap-2 bg-brand-50 p-3 rounded-lg border border-brand-200 text-sm text-warmgray-700">
            <RefreshCw className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p>
              Under card settings, tap <strong>Regenerate QR Token</strong>. A new cryptographic card ID is mapped to your profile. The old QR code is invalidated instantly. You should print the new QR card for the cardholder to carry.
            </p>
          </div>
        </section>

        {/* Section: CareCard privacy & security */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-3" id="privacy-security">
            CareCard privacy & security
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            CareCard is built on a "Privacy by Design" architecture. We keep your family's personal information safe through:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-warmgray-50 rounded-lg border border-warmgray-100">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-warmgray-400 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-500" /> Supabase RLS
              </h3>
              <p className="text-xs text-warmgray-500 leading-relaxed">
                Row Level Security restricts card editing or deletion access to the authorized caregiver account only.
              </p>
            </div>
            <div className="p-3 bg-warmgray-50 rounded-lg border border-warmgray-100">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-warmgray-400 mb-1 flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-brand-500" /> Server-Side Security
              </h3>
              <p className="text-xs text-warmgray-500 leading-relaxed">
                Contact information is retrieved through secure server-side RPC functions with strict database permissions. In this MVP, contact details are displayed to helpers; a production release may add a server-side relay to keep numbers fully private.
              </p>
            </div>
          </div>
        </section>

        {/* Section: CareCard FAQ */}
        <section className="card">
          <h2 className="text-xl font-bold text-warmgray-900 mb-4" id="faq">
            CareCard FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'Will strangers see my personal phone number?',
                a: 'In this deployment, the trusted contact name and relationship are shown to helpers. Raw contact values (phone numbers, emails) are not returned by the public database function. A future production release may add a server-side communication relay so contact details are never exposed in the browser at all.',
              },
              {
                q: 'Does CareCard track physical location?',
                a: 'CareCard does not track location. It only records helper scan event times to notify caregivers, without tracking help cookies or device GPS.',
              },
              {
                q: 'Is there a fee for creating a card?',
                a: 'No. Creating and managing a CareCard emergency contact profile is completely free.',
              },
              {
                q: 'Do helpers need to register?',
                a: 'No registration or app downloads are needed for someone scanning the card to connect with you.',
              },
            ].map((faq) => (
              <details key={faq.q} className="group border-b border-warmgray-100 pb-2">
                <summary className="flex items-center justify-between py-2 cursor-pointer hover:text-brand-500 transition-colors font-medium text-warmgray-850 text-sm list-none">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-warmgray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                </summary>
                <p className="py-2 text-sm text-warmgray-550 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Emergency disclaimer */}
        <section className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-800 mb-1">Emergency Disclaimer</h2>
              <p className="text-sm text-red-700 leading-relaxed">
                CareCard is a communication helper. It is not a locator beacon, continuous tracker, or medical diagnostics system. In immediate risk, always contact local emergency services (112 / 911).
              </p>
            </div>
          </div>
        </section>

        <div className="text-center pt-4">
          <Link to="/auth" className="btn-primary inline-flex">
            <Heart className="w-4 h-4" fill="white" />
            Create Your CareCard
          </Link>
        </div>
      </div>
    </div>
  )
}
