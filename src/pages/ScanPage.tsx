import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicProfile, getPublicContacts } from '@/lib/data'
import { getLanguageDisplay, RateLimiter } from '@/lib/utils'
import { PublicCardProfile, SCAN_PAGE_TRANSLATIONS } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import {
  Heart, Phone, Mail, Globe, Accessibility, MapPin,
  MessageSquare, AlertTriangle, ShieldCheck, Shield,
  ChevronDown, ChevronUp, Info, ExternalLink
} from 'lucide-react'
import { SEO } from '@/components/SEO'

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

      // Load contacts
      const contactsData = await getPublicContacts(token)
      setContacts(contactsData)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error && err.message.includes('Rate limit exceeded')
        ? 'rate_limited'
        : 'invalid')
    } finally {
      setLoading(false)
    }
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
      <SEO
        title={`CareCard Assistance Profile — ${profile.display_name || 'Active Card'}`}
        description="CareCard privacy-first emergency contact assistance profile."
        path={`/scan/${token}`}
        noindex
      />
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

        {/* Primary CTA: Contact Assistance */}
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
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-warmgray-800">{currentContact.contact_name}</span>
                        <span className="text-xs text-warmgray-400">— {currentContact.relationship}</span>
                        {currentContact.is_primary && (
                          <span className="text-xs text-brand-600 font-semibold">Primary</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-800 leading-relaxed mb-3">
                        <Info className="w-4 h-4 inline mr-2" />
                        This deployment does not initiate phone calls or emails.
                      </p>
                    </div>

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
