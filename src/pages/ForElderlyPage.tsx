import { Link } from 'react-router-dom'
import { Heart, Shield, Phone, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function ForElderlyPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="CareCard for Elderly People — QR Safety Card"
        description="Learn how CareCard gives families a simple QR safety card for elderly parents and senior citizens who may need help communicating."
        path="/for-elderly"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          👴 Senior Safety Solution
        </div>
        <h1 className="page-header mb-2 text-3xl font-display">CareCard for Elderly People</h1>
        <p className="text-warmgray-500 text-sm">
          CareCard gives families a simple QR safety card for elderly parents and senior citizens who may need help communicating with someone they don't know.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">Why Use a CareCard Elderly QR Card?</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-4">
            For senior citizen family members living with cognitive decline, dementia, or Alzheimer's, a simple outing can present challenges. If they get lost or disoriented, carrying a CareCard elderly QR card ensures senior safety without exposing sensitive contact details.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            By scanning the card, a helper can view the trusted contact's name and relationship, then use that information to help reconnect the cardholder with their family. CareCard functions as an elderly emergency contact card designed with strict privacy rules and cryptographic token security.
          </p>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Key Benefits for Seniors
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">No Tech Skills Required for the Senior</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  The elderly cardholder only needs to carry a physical printed card in their wallet, pocket, or attached to a keychain/lanyard. No smartphone, app setup, or internet usage is required on their part.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Multilingual Communication Assistance</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  Set their primary spoken languages (e.g., Tamil, Hindi, English). If a helper scans the card, the interface displays instructions in the languages the senior feels most comfortable communicating in.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Opaque Privacy Safeguards</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  Unlike traditional medical bracelets or custom IDs that print family phone numbers in plain view of strangers, CareCard uses secure QR tokens. Raw contact values are not encoded in the QR code itself, keeping the senior's family safe from unwanted solicitation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-warmgray-50">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-500" />
            Privacy & Peace of Mind
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            As a caregiver, you maintain absolute control over the information. If contact details change, you can update them dynamically in the online dashboard. There is no need to reprint the physical QR card; the printed code remains active and links to the updated information automatically.
          </p>
        </section>

        <div className="text-center py-4">
          <Link to="/auth" className="btn-primary">
            <Heart className="w-4 h-4" fill="white" />
            Create Senior Safety Card
          </Link>
        </div>
      </div>
    </div>
  )
}
