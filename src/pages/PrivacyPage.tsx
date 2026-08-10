import { Link } from 'react-router-dom'
import { Shield, Lock, Eye, Database, Trash2, Heart, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function PrivacyPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="CareCard Privacy — Privacy-First QR Assistance"
        description="Learn how CareCard minimizes personal information exposure through QR token design, privacy controls and controlled public profiles."
        path="/privacy"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="page-header mb-2">Privacy Policy</h1>
      <p className="text-warmgray-500 text-sm mb-8">
        Last updated: August 2026
      </p>

      <div className="prose prose-warmgray max-w-none space-y-8">
        {/* Overview */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-500" />
            Overview
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            CareCard is a privacy-first digital assistance card. We believe in collecting 
            only the minimum information necessary to provide the service. This page explains 
            what data we collect, how we use it, and how we protect it.
          </p>
        </section>

        {/* What We Collect */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-500" />
            What We Collect
          </h2>
          <div className="space-y-3 text-sm text-warmgray-600">
            <div>
              <h3 className="font-medium text-warmgray-800">For Caregivers (Account Holders)</h3>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Email address for authentication</li>
                <li>Name (optional, for display only)</li>
                <li>CareCard details you create (display name, language, accessibility info)</li>
                <li>Trusted contact information you provide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-warmgray-800">For Helpers (QR Scanners)</h3>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>No account required</li>
                <li>No personal information collected</li>
                <li>Basic scan timestamp logged (for scan activity notification to caregivers)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We Do NOT Collect */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" />
            What We Do NOT Collect
          </h2>
          <ul className="space-y-2 text-sm text-warmgray-600">
            {[
              'Government IDs (Aadhaar, passport, etc.)',
              'Medical records or health data',
              'Financial information',
              'Continuous location data',
              'Biometric data',
              'Social media accounts',
              'Full dates of birth',
              'Scanner identity information',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-red-400">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Public Information */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-500" />
            Public Information Control
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            You have full control over what information is shown when someone scans a CareCard QR code.
            Each field can be individually toggled on or off. By default, we follow a privacy-by-default 
            approach where only essential assistance information is shown.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            Private information such as exact addresses are never displayed in the public QR scan page or encoded in the QR code itself. The QR page allows helpers to call or email trusted contacts; while the contacts list is served via secure server-side database RPC functions, the helper's browser initiates the direct call (<code className="font-mono text-xs">tel:</code>/<code className="font-mono text-xs">mailto:</code>), which exposes the destination contact value to the helper's native dialer. For production deployments requiring absolute confidentiality, a server-side telephone relay/proxy is recommended.
          </p>
        </section>

        {/* Data Retention */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-brand-500" />
            Data Retention
          </h2>
          <div className="space-y-2 text-sm text-warmgray-600">
            <div className="flex justify-between py-2 border-b border-warmgray-100">
              <span>CareCard data</span>
              <span className="text-warmgray-800 font-medium">Until deleted or deactivated</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warmgray-100">
              <span>Scan logs</span>
              <span className="text-warmgray-800 font-medium">Short retention (30 days)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warmgray-100">
              <span>Temporary location</span>
              <span className="text-warmgray-800 font-medium">Deleted after session expiry</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Account data</span>
              <span className="text-warmgray-800 font-medium">Until account deletion</span>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Important:</strong> CareCard is a communication aid and does not replace 
            emergency services. It is not a medical system, identity verification service, 
            or continuous tracking system.
          </p>
        </section>
      </div>
    </div>
  )
}
