import { Link } from 'react-router-dom'
import { Heart, Globe, Type, Eye, CheckCircle, ArrowLeft } from 'lucide-react'

export function AccessibilityPage() {
  return (
    <div className="page-container page-enter">
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          ♿ Accessibility First
        </div>
        <h1 className="page-header mb-2 text-3xl">Accessible QR Assistance Card</h1>
        <p className="text-warmgray-500 text-sm">
          How CareCard ensures high accessibility, clear readability, and multilingual support for individuals who need help communicating.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">Designed for Diverse Needs</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-4">
            CareCard is built to assist individuals who may have difficulty communicating during emergency or stressful situations. This includes non-verbal individuals, seniors with cognitive conditions, neurodivergent people, and travelers who do not speak the local language.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            Our web application and public scanner views are optimized to be as readable, simple, and quick to load as possible.
          </p>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-500" />
            Key Accessibility Features
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Multilingual Translations (English, Tamil, Hindi)</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  The helper page displays in English, Tamil (தமிழ்), or Hindi (हिन्दी) depending on the cardholder's preference. This enables local helpers in India and internationally to quickly understand instructions.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Type className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">High Contrast & Clean Typography</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  We use large, high-contrast, modern typography (Outfit and Inter sans-serif font families) to make reading text easy even under challenging lighting or outdoor conditions.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Large Tap Targets & Keyboard Navigation</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  Interactive buttons (like calling the caregiver) have large tap targets (exceeding 48px) and explicit focus states, ensuring they are easy to use for helpers with motor control difficulties or on shaky mobile screens.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-warmgray-50">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">HTML5 Semantic Standards</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            By utilizing native HTML elements like <code className="bg-warmgray-100 px-1 rounded text-xs">&lt;button&gt;</code>, <code className="bg-warmgray-100 px-1 rounded text-xs">&lt;nav&gt;</code>, and <code className="bg-warmgray-100 px-1 rounded text-xs">&lt;main&gt;</code> instead of unsemantic wrappers, we ensure compatibility with screen readers, assistive tools, and voice search applications.
          </p>
        </section>

        <div className="text-center py-4">
          <Link to="/auth" className="btn-primary">
            <Heart className="w-4 h-4" fill="white" />
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  )
}
