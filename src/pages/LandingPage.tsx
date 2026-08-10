import { Link } from 'react-router-dom'
import { 
  Heart, Shield, QrCode, Phone, Users, Scan, Printer,
  ArrowRight, Globe, Eye, Lock, ChevronRight, Cpu, Server
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
              Privacy-First Assistance
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-warmgray-900 tracking-tight leading-tight">
              Privacy-First QR Emergency Contact Card
            </h1>
            
            <h2 className="mt-4 text-xl sm:text-2xl font-display font-medium text-brand-600">
              A Small Card. A Safer Connection.
            </h2>
            
            <p className="mt-6 text-base sm:text-lg text-warmgray-500 max-w-2xl mx-auto leading-relaxed">
              CareCard helps elderly people, children, and individuals who may need assistance reconnect with trusted contacts—without requiring the helper to install an app or expose private details.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={user ? '/create' : '/auth'}
                className="btn-primary text-base px-8 py-4 rounded-2xl w-full sm:w-auto hover:scale-[1.02] transition-transform"
                id="cta-create-card"
              >
                <Heart className="w-5 h-5" fill="white" />
                Create CareCard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="btn-secondary text-base px-8 py-4 rounded-2xl w-full sm:w-auto hover:bg-warmgray-200 transition-colors"
                id="cta-how-it-works"
              >
                How it works
              </Link>
            </div>

            <p className="mt-4 text-sm text-warmgray-400">
              Free to create · No app registration required for helpers
            </p>
          </div>
        </div>
      </section>

      {/* Why CareCard Exists */}
      <section className="py-16 sm:py-24 bg-white border-b border-warmgray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900 mb-6">
                Why CareCard Exists
              </h2>
              <p className="text-warmgray-600 leading-relaxed mb-4">
                What happens when someone you care about gets disoriented, lost, or needs communication assistance in public? Custom printed ID bracelets expose private phone numbers, while tracking devices can compromise personal location privacy.
              </p>
              <p className="text-warmgray-600 leading-relaxed mb-6">
                CareCard is built to address this exact gap. It offers a secure, physical QR card connected to a privacy-controlled digital dashboard. When a scanner helps a cardholder, communication is facilitated without exposing sensitive personal identifiers.
              </p>
              <div className="flex gap-4">
                <Link to="/for-elderly" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  For Elderly <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/for-children" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  For Children <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/for-caregivers" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  For Caregivers <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-orange-50 p-8 rounded-3xl border border-brand-100/50">
              <h3 className="font-semibold text-warmgray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-500" />
                Privacy & Safety Standard
              </h3>
              <ul className="space-y-3 text-sm text-warmgray-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">✓</span>
                  No app installation required for helpers to view cards
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">✓</span>
                  Opaque cryptographic tokens prevent URL harvesting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">✓</span>
                  One-click deactivation instantly revokes physical card QR codes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">✓</span>
                  Multilingual Tamil/Hindi/English translation built-in
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How the QR Assistance System Works */}
      <section className="py-16 sm:py-24 bg-warmgray-50/50" id="how-it-works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900">
              How the QR Assistance System Works
            </h2>
            <p className="mt-3 text-warmgray-500 max-w-lg mx-auto">
              Five simple steps designed to keep vulnerable people safe and protected.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="card bg-white flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <QrCode className="w-5 h-5 text-brand-600" />
                </div>
                <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider mb-1">Step 1</div>
                <h3 className="text-base font-semibold text-warmgray-900 mb-2">Create Card</h3>
                <p className="text-xs text-warmgray-500 leading-relaxed">
                  A caregiver creates a digital card and chooses which information can be publicly displayed.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card bg-white flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Printer className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Step 2</div>
                <h3 className="text-base font-semibold text-warmgray-900 mb-2">Print & Carry</h3>
                <p className="text-xs text-warmgray-500 leading-relaxed">
                  The card holder carries a simple physical QR card in their pocket, wallet, or lanyard.
                </p>
              </div>
            </div>

            {/* Step-3 */}
            <div className="card bg-white flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Scan className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">Step 3</div>
                <h3 className="text-base font-semibold text-warmgray-900 mb-2">Scan QR</h3>
                <p className="text-xs text-warmgray-500 leading-relaxed">
                  A helper scans the QR code. No app installation or account is required for the helper.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card bg-white flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Step 4</div>
                <h3 className="text-base font-semibold text-warmgray-900 mb-2">View Profile</h3>
                <p className="text-xs text-warmgray-500 leading-relaxed">
                  Only the specific assistance information allowed by the caregiver is shown publicly.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="card bg-white flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Step 5</div>
                <h3 className="text-base font-semibold text-warmgray-900 mb-2">Reconnect</h3>
                <p className="text-xs text-warmgray-500 leading-relaxed">
                  The helper calls trusted contacts using native dialers, minimizing exposure of private data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Elderly People, Children and Accessibility Needs */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900">
              Built for Elderly People, Children and Accessibility Needs
            </h2>
            <p className="mt-3 text-warmgray-500 max-w-lg mx-auto">
              Our safety solution is optimized for individuals who need communication assistance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '👴', label: 'Elderly Safety Cards', desc: 'For seniors who may get disoriented or lost.', path: '/for-elderly' },
              { emoji: '👧', label: 'Child ID Badges', desc: 'Keep kids connected at events or amusement parks.', path: '/for-children' },
              { emoji: '♿', label: 'Accessibility Tools', desc: 'Help non-verbal users communicate languages and needs.', path: '/accessibility' },
              { emoji: '✈️', label: 'Travel Safety Aids', desc: 'Display contact instructions for foreign language speakers.', path: '/help' },
              { emoji: '🎓', label: 'Student Field Trips', desc: 'Secure identifying details for young students on trips.', path: '/for-children' },
              { emoji: '🎪', label: 'Vulnerable Individuals', desc: 'Allow caretakers to manage public safety access rules.', path: '/for-caregivers' },
            ].map((item) => (
              <Link 
                to={item.path} 
                key={item.label} 
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-warmgray-200 hover:border-brand-200 hover:shadow-sm transition-all duration-200 group text-left"
              >
                <span className="text-2xl" role="img" aria-label={item.label}>{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-warmgray-800 text-sm group-hover:text-brand-600 transition-colors">{item.label}</h3>
                  <p className="text-xs text-warmgray-500 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy-first by design */}
      <section className="py-16 sm:py-24 bg-warmgray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-4 border border-green-200">
                <Lock className="w-3.5 h-3.5" />
                Privacy-First Architecture
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900 mb-4">
                Privacy-First by Design
              </h2>
              <p className="text-warmgray-500 leading-relaxed mb-6">
                CareCard values information security. You have full granular control over what a helper can see when they scan the QR card. We follow the principle of minimum necessary data disclosure.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'No raw contact details printed on physical cards',
                  'No continuous GPS tracking or cookies logged',
                  'No medical histories or government IDs stored',
                  'Client-side state never contains private DB entries',
                  'Sanitized data layers protect scanner identity',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-warmgray-600">
                    <Shield className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/privacy" className="btn-secondary text-sm px-5 py-2.5 rounded-xl hover:bg-warmgray-200">
                Read Privacy Policy
              </Link>
            </div>

            <div className="card bg-white border-warmgray-200 shadow-lg">
              <h3 className="font-semibold text-warmgray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-500" />
                What a helper sees when scanning
              </h3>
              <div className="space-y-3 text-left">
                <div className="p-3 rounded-lg bg-warmgray-50 border border-warmgray-200">
                  <div className="text-xs text-warmgray-400 mb-1">Display name</div>
                  <div className="font-medium text-warmgray-800">Raman</div>
                </div>
                <div className="p-3 rounded-lg bg-warmgray-50 border border-warmgray-200">
                  <div className="text-xs text-warmgray-400 mb-1">Preferred language</div>
                  <div className="font-medium text-warmgray-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-warmgray-400" />
                    🇮🇳 தமிழ் (Tamil)
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-warmgray-50 border border-warmgray-200">
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

      {/* Secure QR Token Architecture */}
      <section className="py-16 sm:py-24 bg-white border-t border-warmgray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900">
              Secure QR Token Architecture
            </h2>
            <p className="mt-3 text-warmgray-500 max-w-lg mx-auto">
              How CareCard protects personal information behind cryptographically secure database layers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-warmgray-50/50 hover:shadow-card-hover transition-all duration-300">
              <Cpu className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-base font-semibold text-warmgray-900 mb-2">Cryptographic Tokens</h3>
              <p className="text-xs text-warmgray-500 leading-relaxed">
                We generate unique, random UUID tokens instead of encoding names or numbers directly in the QR code text or public page URLs, avoiding unauthorized database harvests.
              </p>
            </div>
            
            <div className="card bg-warmgray-50/50 hover:shadow-card-hover transition-all duration-300">
              <Lock className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-base font-semibold text-warmgray-900 mb-2">PostgreSQL RLS</h3>
              <p className="text-xs text-warmgray-500 leading-relaxed">
                By enforcing Row Level Security (RLS) on Supabase, database entities are protected at the database tier. Users can only perform operations on cards owned by their user ID.
              </p>
            </div>

            <div className="card bg-warmgray-50/50 hover:shadow-card-hover transition-all duration-300">
              <Server className="w-8 h-8 text-brand-500 mb-4" />
              <h3 className="text-base font-semibold text-warmgray-900 mb-2">Server-Side Proxy</h3>
              <p className="text-xs text-warmgray-500 leading-relaxed">
                Contact methods are executed through RPC configurations and server proxy alerts, alerting caregivers of scan activity while protecting contact phone numbers in transit.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/security" className="btn-secondary text-sm px-6 py-3 rounded-xl hover:bg-warmgray-200">
              Review Full Security Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 sm:py-24 bg-warmgray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-warmgray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'What is a QR emergency contact card?',
                a: 'CareCard is a physical QR card connected to a privacy-controlled digital assistance profile. It allows a caregiver to share limited, essential safety details with helpers scanning the QR code.'
              },
              {
                q: 'How does a QR emergency contact card work?',
                a: 'A caregiver creates a CareCard, prints its QR code, and the card holder carries it. A helper can scan the QR code to view permitted assistance information.'
              },
              {
                q: 'Is CareCard designed for elderly people?',
                a: 'Yes. CareCard is designed for elderly people, children, travelers, and individuals who may have difficulty communicating during situations where assistance is needed.'
              },
              {
                q: 'Does the QR code contain my phone number?',
                a: 'No. CareCard uses an opaque cryptographically generated token instead of putting personal information directly into the QR code text.'
              },
              {
                q: 'Does the helper need the CareCard app?',
                a: 'No. The helper can access the public assistance view through any standard mobile browser, without installing apps or registering.'
              },
              {
                q: 'Can I deactivate my CareCard?',
                a: 'Yes. A caregiver can deactivate the card and regenerate its QR token directly in their dashboard. The old QR code instantly stops working.'
              },
              {
                q: 'Is CareCard an emergency service?',
                a: 'No. CareCard is a communication and assistance aid and does not replace emergency services. In an emergency, always call local response services first.'
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="card bg-white group cursor-pointer border border-warmgray-200 shadow-sm"
              >
                <summary className="flex items-center justify-between font-medium text-warmgray-800 list-none text-sm sm:text-base">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-warmgray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-warmgray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/faq" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1">
              View all FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-brand-500 to-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to create a CareCard?
          </h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">
            It takes less than 2 minutes to secure a loved one. Help them stay safely connected.
          </p>
          <Link
            to={user ? '/create' : '/auth'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-2xl hover:bg-brand-50 hover:scale-105 transition-all text-base shadow-lg"
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

