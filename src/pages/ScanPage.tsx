import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicProfile, getPublicContacts, logScan } from '@/lib/data'
import { getLanguageDisplay, RateLimiter } from '@/lib/utils'
import { PublicCardProfile, SCAN_PAGE_TRANSLATIONS } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import {
  Heart, Phone, Mail, Globe, Accessibility, MapPin,
  MessageSquare, AlertTriangle, ShieldCheck, Shield,
  ChevronDown, ChevronUp, Info, ExternalLink
} from 'lucide-react'

// Client-side rate limiter
const scanRateLimiter = new RateLimiter(10, 60000) // 10 requests per minute

interface PublicContact {
  contact_name: string
  relationship: string
  contact_method: 'phone' | 'email'
  is_primary: boolean
}

export function ScanPage() {
  const { token } = useParams<{ token: string }>()
  const [profile, setProfile] = useState<PublicCardProfile | null>(null)
  const [contacts, setContacts] = useState<PublicContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'invalid' | 'deactivated' | 'rate_limited' | null>(null)
  const [showContacts, setShowContacts] = useState(false)
  const [showLanguageHelp, setShowLanguageHelp] = useState(false)
  const [contactIndex, setContactIndex] = useState(0)
  const [showSafetyNotice, setShowSafetyNotice] = useState(true)
  
  // Secure Relay State
  const [showRelayModal, setShowRelayModal] = useState(false)
  const [relayType, setRelayType] = useState<'phone' | 'email'>('phone')
  const [relayContact, setRelayContact] = useState<PublicContact | null>(null)
  const [relayProgress, setRelayProgress] = useState(0)
  const [relayStatus, setRelayStatus] = useState<'connecting' | 'connected'>('connecting')

  // Get translations based on card language
  const lang = profile?.preferred_language || 'en'
  const t = SCAN_PAGE_TRANSLATIONS[lang] || SCAN_PAGE_TRANSLATIONS.en

  useEffect(() => {
    // Prevent search engine indexing of dynamic profile scan pages
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    loadProfile()
  }, [token])

  const loadProfile = async () => {
    if (!token) return

    // Rate limiting
    if (!scanRateLimiter.canProceed()) {
      setError('rate_limited')
      setLoading(false)
      return
    }

    try {
      const data = await getPublicProfile(token)
      if (!data) {
        setError('invalid')
        setLoading(false)
        return
      }

      if (data.status === 'deactivated' || data.status === 'inactive') {
        setProfile(data)
        setError('deactivated')
        setLoading(false)
        return
      }

      setProfile(data)

      // Log the scan
      await logScan(token)

      // Load contacts
      const contactsData = await getPublicContacts(token)
      setContacts(contactsData)
    } catch (err) {
      console.error(err)
      setError('invalid')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = (contact: PublicContact) => {
    setRelayContact(contact)
    setRelayType(contact.contact_method)
    setRelayStatus('connecting')
    setRelayProgress(0)
    setShowRelayModal(true)

    const duration = 1500
    const intervalTime = 50
    const steps = duration / intervalTime
    let stepCount = 0

    const timer = setInterval(() => {
      stepCount++
      setRelayProgress(Math.min(Math.round((stepCount / steps) * 100), 100))
      if (stepCount >= steps) {
        clearInterval(timer)
        setRelayStatus('connected')
      }
    }, intervalTime)
  }

  const handleTryNext = () => {
    if (contactIndex < contacts.length - 1) {
      setContactIndex(contactIndex + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warmgray-50">
        <LoadingSpinner message={t.loading} />
      </div>
    )
  }

  // Error: Rate limited
  if (error === 'rate_limited') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warmgray-50 px-4">
        <div className="max-w-sm w-full text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-warmgray-900 mb-2">Too Many Requests</h1>
          <p className="text-warmgray-500 text-sm">{t.tooManyRequests}</p>
        </div>
      </div>
    )
  }

  // Error: Invalid or expired
  if (error === 'invalid') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warmgray-50 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-warmgray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-warmgray-400" />
          </div>
          <h1 className="text-xl font-bold text-warmgray-900 mb-2">Invalid CareCard</h1>
          <p className="text-warmgray-500 text-sm mb-6">{t.invalidCard}</p>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            <p className="font-medium">Need immediate help?</p>
            <p className="mt-1 text-xs">
              If someone is in immediate danger, contact the appropriate local emergency service.
            </p>
          </div>
          <Link to="/" className="btn-ghost mt-4 inline-flex">
            <Heart className="w-4 h-4" />
            About CareCard
          </Link>
        </div>
      </div>
    )
  }

  // Error: Deactivated card
  if (error === 'deactivated') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warmgray-50 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-warmgray-900 mb-2">Card Deactivated</h1>
          <p className="text-warmgray-500 text-sm mb-6">{t.deactivatedCard}</p>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            <p>If someone needs immediate help, contact local emergency services.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const langDisplay = profile.preferred_language ? getLanguageDisplay(profile.preferred_language) : null
  const currentContact = contacts[contactIndex]

  return (
    <div className="min-h-dvh bg-warmgray-50">
      {/* Header */}
      <div className="bg-white border-b border-warmgray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-warmgray-900">CareCard</span>
          </div>
          <span className="text-xs text-warmgray-400 font-mono">
            {profile.card_id_short}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Status */}
        <div className="text-center mb-6">
          <span className="badge-active text-sm">
            <ShieldCheck className="w-4 h-4" />
            {t.activeCard}
          </span>
        </div>

        {/* Safety Notice */}
        {showSafetyNotice && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p>{t.safetyNotice}</p>
                <button
                  onClick={() => setShowSafetyNotice(false)}
                  className="mt-2 text-xs text-blue-600 font-medium hover:text-blue-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="card mb-6">
          {/* Name */}
          {profile.display_name && (
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-brand-600">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-display font-bold text-warmgray-900">
                {profile.display_name}
              </h1>
            </div>
          )}

          {/* Info sections */}
          <div className="space-y-4">
            {/* Language */}
            {langDisplay && (
              <div className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200">
                <div className="flex items-center gap-2 text-xs text-warmgray-400 mb-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {t.preferredLanguage}
                </div>
                <p className="font-semibold text-warmgray-800 text-lg">
                  {langDisplay.flag} {langDisplay.native}
                </p>
              </div>
            )}

            {/* Accessibility */}
            {profile.accessibility_info && (
              <div className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200">
                <div className="flex items-center gap-2 text-xs text-warmgray-400 mb-1.5">
                  <Accessibility className="w-3.5 h-3.5" />
                  {t.accessibility}
                </div>
                <p className="text-warmgray-800 leading-relaxed">
                  {profile.accessibility_info}
                </p>
              </div>
            )}

            {/* Custom Instructions */}
            {profile.custom_instructions && (
              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
                <p className="text-warmgray-800 leading-relaxed text-sm">
                  {profile.custom_instructions}
                </p>
              </div>
            )}

            {/* Area */}
            {profile.approximate_area && (
              <div className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200">
                <div className="flex items-center gap-2 text-xs text-warmgray-400 mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.area}
                </div>
                <p className="text-warmgray-800">{profile.approximate_area}</p>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA: Contact Trusted Person */}
        {contacts.length > 0 && (
          <div className="mb-6">
            {!showContacts ? (
              <button
                onClick={() => setShowContacts(true)}
                className="btn-primary w-full text-lg py-5 rounded-2xl"
                id="scan-contact-button"
              >
                <Phone className="w-6 h-6" />
                {t.contactTrusted}
              </button>
            ) : (
              <div className="card">
                <h2 className="font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-brand-500" />
                  {t.contactTrusted}
                </h2>

                {currentContact && (
                  <div className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-warmgray-800">{currentContact.contact_name}</span>
                      <span className="text-xs text-warmgray-400">— {currentContact.relationship}</span>
                      {currentContact.is_primary && (
                        <span className="text-xs text-brand-600 font-semibold">Primary</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleContact(currentContact)}
                      className="btn-primary w-full mb-2"
                      id="scan-call-button"
                    >
                      {currentContact.contact_method === 'phone' ? (
                        <><Phone className="w-4 h-4" /> {t.callNow}</>
                      ) : (
                        <><Mail className="w-4 h-4" /> {t.sendEmail}</>
                      )}
                    </button>
                    <p className="text-[10px] text-warmgray-400 text-center">
                      Note: This will launch your device's native dialer or mail application.
                    </p>
                  </div>
                )}

                {contactIndex < contacts.length - 1 && (
                  <button
                    onClick={handleTryNext}
                    className="btn-secondary w-full text-sm"
                  >
                    {t.tryAnother}
                  </button>
                )}

                {contactIndex > 0 && contactIndex >= contacts.length - 1 && (
                  <p className="text-xs text-warmgray-400 text-center mt-2">
                    {t.contactUnavailable}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Language Help */}
        <div className="mb-6">
          <button
            onClick={() => setShowLanguageHelp(!showLanguageHelp)}
            className="btn-secondary w-full"
          >
            <MessageSquare className="w-4 h-4" />
            {t.helpWithLanguage}
            {showLanguageHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showLanguageHelp && langDisplay && (
            <div className="card mt-3">
              <h3 className="text-sm font-semibold text-warmgray-700 mb-3">
                Quick phrases in {langDisplay.name}
              </h3>
              <div className="space-y-3">
                {getQuickPhrases(profile.preferred_language || 'en').map((phrase, i) => (
                  <div key={i} className="p-3 rounded-lg bg-warmgray-50 border border-warmgray-100">
                    <p className="text-xs text-warmgray-400 mb-1">{phrase.english}</p>
                    <p className="text-warmgray-800 font-medium">{phrase.translated}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency Disclaimer */}
        <div className="p-4 rounded-xl bg-warmgray-100 border border-warmgray-200 text-xs text-warmgray-500 leading-relaxed">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-warmgray-400" />
            <p>{t.disclaimer}</p>
          </div>
        </div>

        {/* CareCard branding */}
        <div className="text-center mt-6 py-4">
          <div className="flex items-center justify-center gap-1.5 text-warmgray-400">
            <Heart className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Powered by CareCard</span>
          </div>
          <p className="text-[10px] text-warmgray-300 mt-1">
            {window.location.origin}
          </p>
        </div>
      </div>

      {/* Secure Relay Modal */}
      {showRelayModal && relayContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl relative border border-warmgray-100 flex flex-col items-center text-center page-enter">
            {/* Modal Icon / Visuals */}
            {relayStatus === 'connecting' ? (
              <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-6 relative animate-pulse">
                <ShieldCheck className="w-10 h-10" />
                <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 animate-ping" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 relative">
                <Phone className="w-10 h-10 animate-bounce" />
                <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-pulse" />
              </div>
            )}

            <h3 className="text-lg font-bold text-warmgray-900 mb-1">
              Contact Assistance
            </h3>
            <p className="text-xs text-warmgray-400 mb-4 font-medium uppercase tracking-wider">
              Simulated Secure Proxy Relay
            </p>

            <div className="w-full bg-warmgray-50 rounded-xl p-4 border border-warmgray-100 mb-6 text-left">
              <div className="text-xs text-warmgray-400 mb-1 font-semibold">RECIPIENT</div>
              <div className="font-semibold text-warmgray-800 text-sm">
                {relayContact.contact_name} ({relayContact.relationship})
              </div>
              <div className="text-xs text-warmgray-500 mt-1 font-mono">
                Relay Session: {token?.substring(0, 8).toUpperCase() || 'UNKNOWN'}
              </div>
            </div>

            {relayStatus === 'connecting' ? (
              <div className="w-full">
                <p className="text-xs text-warmgray-600 mb-2 font-medium">
                  Establishing private routing tunnel... {relayProgress}%
                </p>
                <div className="w-full bg-warmgray-100 h-2 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-brand-500 transition-all duration-100" 
                    style={{ width: `${relayProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <p className="text-xs text-warmgray-600 leading-relaxed bg-green-50/50 text-green-800 p-3 rounded-lg border border-green-100">
                  🛡️ <strong>Demo Simulation:</strong> In production, this request connects to a server-side proxy relay (e.g. Twilio/SendGrid). Your browser receives no PII.
                </p>
                
                {relayType === 'phone' ? (
                  <a
                    href="tel:+18005550199"
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Place Proxy Call
                  </a>
                ) : (
                  <a
                    href={`mailto:relay-session@carecard.org?subject=CareCard%20Secure%20Relay%20[ID:${token?.substring(0, 8)}]`}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Proxy Email
                  </a>
                )}
              </div>
            )}

            <button
              onClick={() => setShowRelayModal(false)}
              className="text-xs text-warmgray-400 font-semibold hover:text-warmgray-600 mt-4 transition-colors"
            >
              Cancel & Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Quick phrases for language help
function getQuickPhrases(langCode: string): { english: string; translated: string }[] {
  const phrases: Record<string, { english: string; translated: string }[]> = {
    ta: [
      { english: 'I found this person and they are safe.', translated: 'இந்த நபர் பாதுகாப்பாக இருக்கிறார்.' },
      { english: 'We are trying to contact your family.', translated: 'குடும்பத்தினரை தொடர்பு கொள்ள முயற்சிக்கிறோம்.' },
      { english: 'Do you need water or food?', translated: 'தண்ணீர் அல்லது உணவு வேண்டுமா?' },
      { english: 'Can you tell me your name?', translated: 'உங்கள் பெயர் என்ன?' },
      { english: 'Please sit here. Help is coming.', translated: 'தயவுசெய்து இங்கே உட்காருங்கள். உதவி வருகிறது.' },
    ],
    hi: [
      { english: 'I found this person and they are safe.', translated: 'यह व्यक्ति सुरक्षित है।' },
      { english: 'We are trying to contact your family.', translated: 'हम आपके परिवार से संपर्क करने का प्रयास कर रहे हैं।' },
      { english: 'Do you need water or food?', translated: 'क्या आपको पानी या खाना चाहिए?' },
      { english: 'Can you tell me your name?', translated: 'क्या आप मुझे अपना नाम बता सकते हैं?' },
      { english: 'Please sit here. Help is coming.', translated: 'कृपया यहाँ बैठें। मदद आ रही है।' },
    ],
    en: [
      { english: 'I found this person and they are safe.', translated: 'I found this person and they are safe.' },
      { english: 'We are trying to contact your family.', translated: 'We are trying to contact your family.' },
      { english: 'Do you need water or food?', translated: 'Do you need water or food?' },
      { english: 'Can you tell me your name?', translated: 'Can you tell me your name?' },
      { english: 'Please sit here. Help is coming.', translated: 'Please sit here. Help is coming.' },
    ],
  }
  return phrases[langCode] || phrases.en
}
