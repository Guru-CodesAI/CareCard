import { Link } from 'react-router-dom'
import { 
  Heart, Shield, QrCode, Phone, Users, Scan, Printer,
  ArrowRight, Globe, Eye, Lock, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-orange-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/60 text-brand-700 text-sm font-medium mb-6 border border-brand-200/50">
              <Shield className="w-4 h-4" />
              Privacy-first assistance
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-warmgray-900 tracking-tight">
              Care<span className="text-brand-500">Card</span>
            </h1>
            
            <p className="mt-4 text-xl sm:text-2xl font-display font-medium text-warmgray-600">
              A small card that can make a big difference.
            </p>
            
            <p className="mt-6 text-base sm:text-lg text-warmgray-500 max-w-xl mx-auto leading-relaxed">
              Help someone reconnect with the people they trust — without requiring an app, account, or technical knowledge.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={user ? '/create' : '/auth'}
                className="btn-primary text-base px-8 py-4 rounded-2xl w-full sm:w-auto"
                id="cta-create-card"
              >
                <Heart className="w-5 h-5" fill="white" />
                Create CareCard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/help"
                className="btn-secondary text-base px-8 py-4 rounded-2xl w-full sm:w-auto"
                id="cta-how-it-works"
              >
                How it works
              </Link>
            </div>

            <p className="mt-4 text-sm text-warmgray-400">
              Free to create · No app required for helpers
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white" id="how-it-works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900">
              How CareCard Works
            </h2>
            <p className="mt-3 text-warmgray-500 max-w-lg mx-auto">
              Three simple steps to help vulnerable people stay connected.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="card text-center group hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-100 transition-colors">
                <QrCode className="w-7 h-7 text-brand-600" />
              </div>
              <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">Step 1</div>
              <h3 className="text-lg font-semibold text-warmgray-900 mb-2">Create</h3>
              <p className="text-sm text-warmgray-500 leading-relaxed">
                A caregiver creates a secure digital CareCard with safe assistance information.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card text-center group hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                <Printer className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">Step 2</div>
              <h3 className="text-lg font-semibold text-warmgray-900 mb-2">Carry</h3>
              <p className="text-sm text-warmgray-500 leading-relaxed">
                Print or carry the QR card. In a wallet, on a keychain, or on a lanyard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card text-center group hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                <Phone className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-2">Step 3</div>
              <h3 className="text-lg font-semibold text-warmgray-900 mb-2">Reconnect</h3>
              <p className="text-sm text-warmgray-500 leading-relaxed">
                A helper scans the QR and safely contacts a trusted family member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 sm:py-24 bg-warmgray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900">
              Who is CareCard for?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '👴', label: 'Elderly individuals', desc: 'Who may need assistance while out' },
              { emoji: '👧', label: 'Children', desc: 'At events, camps, or public places' },
              { emoji: '♿', label: 'People with accessibility needs', desc: 'Who may need communication help' },
              { emoji: '✈️', label: 'Travelers', desc: 'In unfamiliar locations or countries' },
              { emoji: '🎓', label: 'Students', desc: 'On field trips or study abroad' },
              { emoji: '🎪', label: 'Event participants', desc: 'At festivals, fairs, or gatherings' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-warmgray-200 hover:border-brand-200 transition-colors">
                <span className="text-2xl" role="img" aria-label={item.label}>{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-warmgray-800 text-sm">{item.label}</h3>
                  <p className="text-xs text-warmgray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy First */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-4 border border-green-200">
                <Lock className="w-3.5 h-3.5" />
                Privacy by Default
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900 mb-4">
                Only share what's necessary
              </h2>
              <p className="text-warmgray-500 leading-relaxed mb-6">
                You control exactly what a helper can see. CareCard follows the principle of minimum necessary information.
              </p>
              <ul className="space-y-3">
                {[
                  'No home address shown publicly',
                  'No phone numbers exposed in the QR',
                  'No medical records stored',
                  'No permanent location tracking',
                  'No unnecessary data collection',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-warmgray-600">
                    <Shield className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card bg-warmgray-50 border-warmgray-200">
              <h3 className="font-semibold text-warmgray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-500" />
                What a helper sees
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white border border-warmgray-200">
                  <div className="text-xs text-warmgray-400 mb-1">Display name</div>
                  <div className="font-medium text-warmgray-800">Raman</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-warmgray-200">
                  <div className="text-xs text-warmgray-400 mb-1">Preferred language</div>
                  <div className="font-medium text-warmgray-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-warmgray-400" />
                    🇮🇳 தமிழ்
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-warmgray-200">
                  <div className="text-xs text-warmgray-400 mb-1">Accessibility assistance</div>
                  <div className="font-medium text-warmgray-800">May need assistance while walking</div>
                </div>
                <button className="btn-primary w-full mt-2" tabIndex={-1} aria-hidden>
                  <Phone className="w-4 h-4" />
                  Contact Trusted Person
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-warmgray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900 text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Will strangers see my phone number?',
                a: 'No. CareCard only displays information you choose to make public. Phone numbers are never printed on the card or shown in the QR scan page.'
              },
              {
                q: 'Can someone track me with CareCard?',
                a: 'CareCard does not continuously track you. Temporary location sharing is optional and automatically expires.'
              },
              {
                q: 'What if I lose my card?',
                a: 'Deactivate the old card from your dashboard and generate a new QR. The old QR becomes invalid immediately.'
              },
              {
                q: 'Does this replace emergency services?',
                a: 'No. CareCard is a communication aid. If someone is in immediate danger, always contact the appropriate emergency service.'
              },
              {
                q: 'Does the helper need an app?',
                a: 'No. The helper simply scans the QR code with their phone camera. No app, no registration, no account needed.'
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="card group cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium text-warmgray-800 list-none">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-warmgray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-warmgray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to create a CareCard?
          </h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">
            It takes less than 2 minutes. Help your loved ones stay safely connected.
          </p>
          <Link
            to={user ? '/create' : '/auth'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-2xl hover:bg-brand-50 transition-colors text-base"
          >
            <Heart className="w-5 h-5" fill="currentColor" />
            Create CareCard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
