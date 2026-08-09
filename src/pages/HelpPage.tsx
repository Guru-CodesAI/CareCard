import { Link } from 'react-router-dom'
import {
  Heart, QrCode, Phone, Shield, Scan, User, 
  HelpCircle, ArrowLeft, ChevronRight, AlertTriangle,
  RefreshCw, Globe, Printer
} from 'lucide-react'

export function HelpPage() {
  return (
    <div className="page-container page-enter">
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="page-header mb-2 flex items-center gap-2">
        <HelpCircle className="w-7 h-7 text-brand-500" />
        Help & Safety
      </h1>
      <p className="text-warmgray-500 text-sm mb-8">
        Learn how CareCard works and how to use it.
      </p>

      {/* What is CareCard */}
      <section className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-3">What is CareCard?</h2>
        <p className="text-sm text-warmgray-600 leading-relaxed">
          CareCard is a privacy-first digital assistance card that helps people safely reconnect
          vulnerable individuals with trusted contacts. A caregiver creates a secure CareCard,
          the card holder carries its QR code, and a helper can scan it without installing an app
          to access limited assistance information and contact a trusted person.
        </p>
      </section>

      {/* How to use */}
      <section className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4">How to use CareCard</h2>
        <div className="space-y-4">
          {[
            {
              icon: <User className="w-5 h-5 text-brand-500" />,
              title: 'For Caregivers',
              steps: [
                'Create an account on CareCard',
                'Fill in the card holder\'s basic information',
                'Add trusted contacts (family members, guardians)',
                'Choose what information helpers can see',
                'Generate and print the QR code card',
                'Give the card to the person who needs it',
              ]
            },
            {
              icon: <QrCode className="w-5 h-5 text-blue-500" />,
              title: 'For Card Holders',
              steps: [
                'Simply carry the printed card',
                'No app installation needed',
                'No technical knowledge required',
                'Keep the card in a wallet, lanyard, or pocket',
              ]
            },
            {
              icon: <Scan className="w-5 h-5 text-green-500" />,
              title: 'For Helpers',
              steps: [
                'Open your phone camera',
                'Scan the QR code on the card',
                'View the assistance information',
                'Contact the trusted person shown',
                'No account or app required',
              ]
            },
          ].map((section) => (
            <div key={section.title} className="p-4 rounded-xl bg-warmgray-50 border border-warmgray-200">
              <h3 className="font-semibold text-warmgray-800 flex items-center gap-2 mb-3">
                {section.icon}
                {section.title}
              </h3>
              <ol className="space-y-2">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-warmgray-600">
                    <span className="w-5 h-5 rounded-full bg-warmgray-200 flex items-center justify-center text-xs font-semibold text-warmgray-600 shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4">Common Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Will strangers see my phone number?',
              a: 'No. CareCard only displays information you choose to make public. Private contact details are never exposed through the QR code or scan page.',
            },
            {
              q: 'Can someone track me with CareCard?',
              a: 'CareCard does not continuously track you. Temporary location sharing is optional and automatically expires after the set duration.',
            },
            {
              q: 'What if I lose my card?',
              a: 'Deactivate the old card from your dashboard and generate a new QR. The old QR becomes invalid immediately.',
            },
            {
              q: 'What if my family contact changes?',
              a: 'Update the trusted contact in your dashboard. The physical card doesn\'t need reprinting since the QR points to your online profile.',
            },
            {
              q: 'What if my QR is copied?',
              a: 'Revoke the old QR and generate a new one from the card management page. The old QR will stop working immediately.',
            },
            {
              q: 'Does this replace emergency services?',
              a: 'No. CareCard is a communication aid. If someone is in immediate danger or needs urgent medical help, always contact the appropriate local emergency service.',
            },
            {
              q: 'Does CareCard store my medical records?',
              a: 'No. CareCard is designed to minimize sensitive information. It does not store medical records, diagnoses, or health data.',
            },
            {
              q: 'Does the app work without internet?',
              a: 'The QR scan requires internet to load the profile. For offline situations, the physical card can include minimal printed information chosen by the caregiver.',
            },
          ].map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-warmgray-50 transition-colors font-medium text-warmgray-800 text-sm list-none">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-warmgray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
              </summary>
              <p className="px-3 pb-3 text-sm text-warmgray-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Emergency */}
      <section className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-red-800 mb-1">In an Emergency</h2>
            <p className="text-sm text-red-700 leading-relaxed">
              CareCard is a communication aid and does not replace emergency services.
              If someone is in immediate danger or requires urgent medical assistance,
              contact the appropriate local emergency service.
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-red-700"><strong>India:</strong> 112 (Emergency) · 108 (Ambulance)</p>
              <p className="text-red-700"><strong>International:</strong> 112</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-4">
        <Link to="/auth" className="btn-primary">
          <Heart className="w-4 h-4" fill="white" />
          Create Your CareCard
        </Link>
      </div>
    </div>
  )
}
