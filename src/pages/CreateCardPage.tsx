import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createCard, createContact } from '@/lib/data'
import { isValidPhone, isValidEmail } from '@/lib/utils'
import { SUPPORTED_LANGUAGES } from '@/types'
import { Toggle } from '@/components/Toggle'
import {
  ArrowRight, ArrowLeft, Heart, Globe, Accessibility,
  Phone, Mail, User, Users, Shield, AlertCircle,
  CheckCircle, Plus, Trash2
} from 'lucide-react'
import { SEO } from '@/components/SEO'

interface ContactEntry {
  contact_name: string
  relationship: string
  contact_method: 'phone' | 'email'
  contact_value: string
  is_primary: boolean
}

export function CreateCardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 - Basic info
  const [displayName, setDisplayName] = useState('')
  const [language, setLanguage] = useState('en')
  const [accessibilityInfo, setAccessibilityInfo] = useState('')
  const [customInstructions, setCustomInstructions] = useState('')

  // Step 2 - Trusted contacts
  const [contacts, setContacts] = useState<ContactEntry[]>([
    { contact_name: '', relationship: '', contact_method: 'phone', contact_value: '', is_primary: true }
  ])

  // Step 3 - Privacy
  const [showDisplayName, setShowDisplayName] = useState(true)
  const [showLanguage, setShowLanguage] = useState(true)
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [showArea, setShowArea] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [approximateArea, setApproximateArea] = useState('')

  const totalSteps = 3

  const validateStep1 = (): boolean => {
    if (!displayName.trim()) {
      setError('Please enter a display name.')
      return false
    }
    return true
  }

  const validateStep2 = (): boolean => {
    const validContacts = contacts.filter(c => c.contact_name.trim() && c.contact_value.trim())
    if (validContacts.length === 0) {
      setError('Please add at least one trusted contact.')
      return false
    }
    for (const c of validContacts) {
      if (c.contact_method === 'phone' && !isValidPhone(c.contact_value)) {
        setError(`Invalid phone number for ${c.contact_name}.`)
        return false
      }
      if (c.contact_method === 'email' && !isValidEmail(c.contact_value)) {
        setError(`Invalid email for ${c.contact_name}.`)
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const addContact = () => {
    setContacts([
      ...contacts,
      { contact_name: '', relationship: '', contact_method: 'phone', contact_value: '', is_primary: false }
    ])
  }

  const removeContact = (index: number) => {
    if (contacts.length <= 1) return
    const updated = contacts.filter((_, i) => i !== index)
    // Ensure at least one is primary
    if (!updated.some(c => c.is_primary) && updated.length > 0) {
      updated[0].is_primary = true
    }
    setContacts(updated)
  }

  const updateContact = (index: number, field: keyof ContactEntry, value: string | boolean) => {
    const updated = [...contacts]
    if (field === 'is_primary' && value === true) {
      // Only one primary
      updated.forEach((c, i) => { c.is_primary = i === index })
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setContacts(updated)
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    setError('')

    try {
      // Create the card
      const card = await createCard({
        display_name: displayName,
        preferred_language: language,
        accessibility_info: accessibilityInfo,
        custom_instructions: customInstructions,
        show_display_name: showDisplayName,
        show_language: showLanguage,
        show_accessibility: showAccessibility,
        show_area: showArea,
        show_instructions: showInstructions,
        approximate_area: approximateArea,
      }, user.id)

      // Create contacts
      const validContacts = contacts.filter(c => c.contact_name.trim() && c.contact_value.trim())
      for (const contact of validContacts) {
        await createContact(contact, card.id, user.id)
      }

      navigate(`/card/${card.id}`)
    } catch (err) {
      setError('Failed to create CareCard. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container page-enter">
      <SEO
        title="Create CareCard | CareCard"
        description="Create a new privacy-first QR safety emergency contact profile."
        path="/create"
        noindex
      />
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="page-header">Create CareCard</h1>
          <span className="text-sm text-warmgray-500">Step {step} of {totalSteps}</span>
        </div>
        <div className="h-2 bg-warmgray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-warmgray-900 mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" />
              Basic Information
            </h2>
            <p className="text-sm text-warmgray-500 mb-6">
              Information about the person who will carry this CareCard.
            </p>

            <div className="space-y-5">
              {/* Display Name */}
              <div>
                <label htmlFor="create-name" className="label">Display Name *</label>
                <input
                  id="create-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Raman"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-warmgray-400 mt-1">
                  This is the name a helper will see. It can be a first name or nickname.
                </p>
              </div>

              {/* Language */}
              <div>
                <label htmlFor="create-language" className="label flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-warmgray-400" />
                  Preferred Language
                </label>
                <select
                  id="create-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Accessibility / Assistance Needs */}
              <div>
                <label htmlFor="create-accessibility" className="label flex items-center gap-1.5 mb-1">
                  <Accessibility className="w-4 h-4 text-warmgray-400" />
                  Assistance Needs & Accessibility (optional)
                </label>
                <p className="text-[11px] text-amber-600 mb-2 leading-normal">
                  ⚠️ <strong>Privacy Notice:</strong> Only describe general assistance needs (e.g. "Needs a communication guide"). For your privacy, do <strong>not</strong> enter specific medical diagnoses, medications, full addresses, or other sensitive details.
                </p>
                <textarea
                  id="create-accessibility"
                  value={accessibilityInfo}
                  onChange={(e) => setAccessibilityInfo(e.target.value)}
                  className="input-field min-h-[80px] resize-y"
                  placeholder="e.g. May need assistance while walking. Uses a walking stick."
                  maxLength={500}
                />
              </div>

              {/* Custom Instructions */}
              <div>
                <label htmlFor="create-instructions" className="label">
                  Custom Assistance Instructions (optional)
                </label>
                <textarea
                  id="create-instructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="input-field min-h-[80px] resize-y"
                  placeholder="e.g. Please help contact a trusted family member. May take a moment to respond."
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Trusted Contacts */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-warmgray-900 mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" />
              Trusted Contacts
            </h2>
            <p className="text-sm text-warmgray-500 mb-6">
              People a helper can reach out to when this CareCard is scanned.
            </p>

            <div className="space-y-6">
              {contacts.map((contact, index) => (
                <div key={index} className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-warmgray-700">
                      {contact.is_primary ? '⭐ Primary Contact' : `Contact ${index + 1}`}
                    </h3>
                    {contacts.length > 1 && (
                      <button
                        onClick={() => removeContact(index)}
                        className="p-1 rounded hover:bg-red-50 text-warmgray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`contact-name-${index}`} className="label">Name *</label>
                      <input
                        id={`contact-name-${index}`}
                        type="text"
                        value={contact.contact_name}
                        onChange={(e) => updateContact(index, 'contact_name', e.target.value)}
                        className="input-field"
                        placeholder="Arun"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label htmlFor={`contact-rel-${index}`} className="label">Relationship</label>
                      <input
                        id={`contact-rel-${index}`}
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                        className="input-field"
                        placeholder="Son, Daughter, Guardian..."
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Contact Method</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateContact(index, 'contact_method', 'phone')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          contact.contact_method === 'phone'
                            ? 'bg-brand-50 border-brand-300 text-brand-700'
                            : 'bg-white border-warmgray-300 text-warmgray-600 hover:bg-warmgray-50'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        Phone
                      </button>
                      <button
                        type="button"
                        onClick={() => updateContact(index, 'contact_method', 'email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          contact.contact_method === 'email'
                            ? 'bg-brand-50 border-brand-300 text-brand-700'
                            : 'bg-white border-warmgray-300 text-warmgray-600 hover:bg-warmgray-50'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`contact-value-${index}`} className="label">
                      {contact.contact_method === 'phone' ? 'Phone Number *' : 'Email Address *'}
                    </label>
                    <input
                      id={`contact-value-${index}`}
                      type={contact.contact_method === 'phone' ? 'tel' : 'email'}
                      value={contact.contact_value}
                      onChange={(e) => updateContact(index, 'contact_value', e.target.value)}
                      className="input-field"
                      placeholder={contact.contact_method === 'phone' ? '+91 98765 43210' : 'arun@example.com'}
                      maxLength={50}
                    />
                  </div>

                  {!contact.is_primary && (
                    <button
                      type="button"
                      onClick={() => updateContact(index, 'is_primary', true)}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Set as primary contact
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addContact}
                className="btn-secondary w-full"
              >
                <Plus className="w-4 h-4" />
                Add Another Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Privacy Controls */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-warmgray-900 mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-500" />
              What should a helper see?
            </h2>
            <p className="text-sm text-warmgray-500 mb-6">
              Control exactly what information is shown when someone scans this CareCard.
            </p>

            <div className="space-y-4">
              <Toggle
                id="toggle-name"
                checked={showDisplayName}
                onChange={setShowDisplayName}
                label="Display name"
                description="Show the card holder's name to helpers"
              />
              <Toggle
                id="toggle-language"
                checked={showLanguage}
                onChange={setShowLanguage}
                label="Preferred language"
                description="Help someone communicate in the right language"
              />
              <Toggle
                id="toggle-accessibility"
                checked={showAccessibility}
                onChange={setShowAccessibility}
                label="Accessibility assistance"
                description="Share accessibility needs with helpers"
              />
              <Toggle
                id="toggle-instructions"
                checked={showInstructions}
                onChange={setShowInstructions}
                label="Custom assistance instructions"
                description="Show custom help instructions"
              />
              <Toggle
                id="toggle-area"
                checked={showArea}
                onChange={setShowArea}
                label="Approximate home area"
                description="Show a general area (not exact address)"
              />

              {showArea && (
                <div className="ml-14">
                  <label htmlFor="create-area" className="label">Approximate Area</label>
                  <input
                    id="create-area"
                    type="text"
                    value={approximateArea}
                    onChange={(e) => setApproximateArea(e.target.value)}
                    className="input-field"
                    placeholder="e.g. T. Nagar, Chennai"
                    maxLength={200}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy tip:</strong> Only share information that is necessary for someone to help.
                  Full address, personal email, phone numbers, and medical records are never shown publicly.
                </span>
              </p>
            </div>
          </div>

          {/* Summary preview */}
          <div className="card bg-warmgray-50">
            <h3 className="text-sm font-semibold text-warmgray-700 mb-3">Preview — What a helper will see</h3>
            <div className="space-y-2 text-sm">
              {showDisplayName && displayName && (
                <div className="flex justify-between">
                  <span className="text-warmgray-500">Name</span>
                  <span className="font-medium">{displayName}</span>
                </div>
              )}
              {showLanguage && (
                <div className="flex justify-between">
                  <span className="text-warmgray-500">Language</span>
                  <span className="font-medium">{SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName}</span>
                </div>
              )}
              {showAccessibility && accessibilityInfo && (
                <div className="flex justify-between">
                  <span className="text-warmgray-500">Accessibility</span>
                  <span className="font-medium truncate max-w-[200px]">{accessibilityInfo}</span>
                </div>
              )}
              {showInstructions && customInstructions && (
                <div className="flex justify-between">
                  <span className="text-warmgray-500">Instructions</span>
                  <span className="font-medium truncate max-w-[200px]">{customInstructions}</span>
                </div>
              )}
              {showArea && approximateArea && (
                <div className="flex justify-between">
                  <span className="text-warmgray-500">Area</span>
                  <span className="font-medium">{approximateArea}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-warmgray-200">
        {step > 1 ? (
          <button onClick={handleBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <button onClick={handleNext} className="btn-primary">
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
            id="create-card-submit"
          >
            {loading ? 'Creating...' : (
              <>
                <CheckCircle className="w-4 h-4" />
                Create CareCard
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
