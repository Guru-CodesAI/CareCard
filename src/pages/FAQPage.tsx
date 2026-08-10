import { Link } from 'react-router-dom'
import { HelpCircle, ChevronRight, AlertTriangle, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function FAQPage() {
  const faqs = [
    {
      q: 'What is a QR emergency contact card?',
      a: 'CareCard is a physical QR card connected to a privacy-controlled digital assistance profile. It allows a caregiver to share limited, essential safety information with helpers who scan the card.'
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
      a: 'No. CareCard uses an opaque cryptographically generated token instead of storing personal information directly in the QR code or URL.'
    },
    {
      q: 'Does the helper need the CareCard app?',
      a: 'No. The helper can access the public assistance view through any standard web browser on their smartphone.'
    },
    {
      q: 'Can I deactivate my CareCard?',
      a: 'Yes. A caregiver can deactivate the card and regenerate its QR token directly from their dashboard. The old physical QR code will immediately become invalid.'
    },
    {
      q: 'Is CareCard an emergency service?',
      a: 'No. CareCard is a communication and assistance aid and does not replace emergency services. In a medical or safety emergency, always call local emergency response first.'
    }
  ]

  return (
    <div className="page-container page-enter">
      <SEO
        title="CareCard FAQ — QR Emergency Contact Card Questions"
        description="Answers to common questions about CareCard, QR emergency contact cards, privacy, elderly safety, caregivers and assistance."
        path="/faq"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" /> Help Center
        </div>
        <h1 className="page-header mb-2 text-3xl">Frequently Asked Questions</h1>
        <p className="text-warmgray-500 text-sm">
          Everything you need to know about CareCard's emergency contact profiles and security details.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.q} className="card group cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-warmgray-800 list-none">
              {faq.q}
              <ChevronRight className="w-4 h-4 text-warmgray-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-3 text-sm text-warmgray-500 leading-relaxed">{faq.a}</p>
          </details>
        ))}

        <section className="p-4 rounded-xl bg-red-50 border border-red-200 mt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-800 mb-1">Emergency Notice</h2>
              <p className="text-sm text-red-700 leading-relaxed">
                If someone is in immediate danger or requires urgent medical assistance, contact your local emergency services (112, 108, 911, etc.) immediately. CareCard is a helper communication aid, not an emergency dispatch system.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
