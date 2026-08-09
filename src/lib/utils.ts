/**
 * Generate a cryptographically secure random token for CareCard public URLs.
 * Uses Web Crypto API for secure randomness.
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a short human-readable card ID from the token.
 * This is NOT used for security — it's for display/verification purposes only.
 */
export function generateShortId(token: string): string {
  return token.substring(0, 8).toUpperCase()
}

/**
 * Sanitize user input to prevent XSS.
 * Strips HTML tags and limits length.
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, maxLength)
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate phone number format (basic validation).
 */
export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, hyphens, plus sign, parentheses
  return /^[+]?[\d\s\-()]{7,20}$/.test(phone)
}

/**
 * Format a date string for display.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get the display text for a language code.
 */
export function getLanguageDisplay(code: string): { name: string; native: string; flag: string } {
  const languages: Record<string, { name: string; native: string; flag: string }> = {
    en: { name: 'English', native: 'English', flag: '🇬🇧' },
    ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    te: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    ml: { name: 'Malayalam', native: 'മலയാളം', flag: '🇮🇳' },
    kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  }
  return languages[code] || { name: code, native: code, flag: '🌐' }
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Simple rate limiter for client-side use
 */
export class RateLimiter {
  private timestamps: number[] = []
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  canProceed(): boolean {
    const now = Date.now()
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs)
    if (this.timestamps.length >= this.maxRequests) {
      return false
    }
    this.timestamps.push(now)
    return true
  }
}
