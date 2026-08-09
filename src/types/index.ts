// ============================================
// CareCard Core Types
// ============================================

export interface CareCard {
  id: string
  caregiver_id: string
  public_token: string
  display_name: string
  preferred_language: string
  accessibility_info: string
  custom_instructions: string
  photo_url: string | null
  status: CardStatus
  // Privacy toggles — what helpers can see
  show_display_name: boolean
  show_language: boolean
  show_accessibility: boolean
  show_area: boolean
  show_instructions: boolean
  approximate_area: string
  created_at: string
  updated_at: string
}

export type CardStatus = 'active' | 'inactive' | 'deactivated'

export interface TrustedContact {
  id: string
  card_id: string
  caregiver_id: string
  contact_name: string
  relationship: string
  contact_method: 'phone' | 'email'
  contact_value: string
  is_primary: boolean
  is_verified: boolean
  created_at: string
}

export interface ScanLog {
  id: string
  card_id: string
  scanned_at: string
  // Minimal info — no invasive tracking
  user_agent: string | null
}

// Public-safe card profile (only the fields a helper should see)
export interface PublicCardProfile {
  display_name: string | null
  preferred_language: string | null
  accessibility_info: string | null
  approximate_area: string | null
  custom_instructions: string | null
  status: CardStatus
  card_id_short: string
}

// Caregiver profile
export interface CaregiverProfile {
  id: string
  email: string
  full_name: string
  created_at: string
}

// Create CareCard form data
export interface CreateCardFormData {
  display_name: string
  preferred_language: string
  accessibility_info: string
  custom_instructions: string
  show_display_name: boolean
  show_language: boolean
  show_accessibility: boolean
  show_area: boolean
  show_instructions: boolean
  approximate_area: string
}

export interface CreateContactFormData {
  contact_name: string
  relationship: string
  contact_method: 'phone' | 'email'
  contact_value: string
  is_primary: boolean
}

// Supported languages
export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
]

// Translation strings for the scan page
export const SCAN_PAGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    activeCard: 'Active Card',
    deactivatedCard: 'This CareCard is no longer active',
    preferredLanguage: 'Preferred Language',
    accessibility: 'Accessibility Assistance',
    helpMessage: 'Please help contact a trusted family member.',
    contactTrusted: 'Contact Trusted Person',
    helpWithLanguage: 'Help With Language',
    disclaimer: 'CareCard is a communication aid and does not replace emergency services. If someone is in immediate danger, contact the appropriate local emergency service.',
    invalidCard: 'This CareCard link is invalid or expired.',
    loading: 'Loading CareCard...',
    contactUnavailable: 'The trusted contact couldn\'t be reached. Try another trusted contact.',
    tryAnother: 'Try Another Contact',
    tooManyRequests: 'Too many requests. Please try again later.',
    safetyNotice: 'This CareCard contains limited information intended to help reconnect this person with a trusted contact.',
    area: 'Approximate Area',
    instructions: 'Assistance Instructions',
    callNow: 'Call Now',
    sendEmail: 'Send Email',
  },
  ta: {
    activeCard: 'செயலில் உள்ள அட்டை',
    deactivatedCard: 'இந்த CareCard இனி செயலில் இல்லை',
    preferredLanguage: 'விருப்பமான மொழி',
    accessibility: 'அணுகல் உதவி',
    helpMessage: 'நம்பகமான குடும்ப உறுப்பினரைத் தொடர்பு கொள்ள உதவுங்கள்.',
    contactTrusted: 'நம்பகமான நபரைத் தொடர்பு கொள்ளுங்கள்',
    helpWithLanguage: 'மொழி உதவி',
    disclaimer: 'CareCard ஒரு தகவல் தொடர்பு உதவி மட்டுமே, அவசர சேவைகளுக்கு மாற்றாக அல்ல. உடனடி ஆபத்தில் இருந்தால், உள்ளூர் அவசர சேவையைத் தொடர்பு கொள்ளுங்கள்.',
    invalidCard: 'இந்த CareCard இணைப்பு தவறானது அல்லது காலாவதியானது.',
    loading: 'CareCard ஏற்றப்படுகிறது...',
    contactUnavailable: 'நம்பகமான தொடர்பை அடைய முடியவில்லை. மற்றொரு தொடர்பை முயற்சிக்கவும்.',
    tryAnother: 'மற்றொரு தொடர்பை முயற்சிக்கவும்',
    tooManyRequests: 'அதிகமான கோரிக்கைகள். பின்னர் மீண்டும் முயற்சிக்கவும்.',
    safetyNotice: 'இந்த CareCard இந்த நபரை நம்பகமான தொடர்புடன் மீண்டும் இணைக்க உதவும் குறைந்தபட்ச தகவலைக் கொண்டுள்ளது.',
    area: 'தோராயமான பகுதி',
    instructions: 'உதவி வழிமுறைகள்',
    callNow: 'இப்போது அழைக்கவும்',
    sendEmail: 'மின்னஞ்சல் அனுப்பவும்',
  },
}
