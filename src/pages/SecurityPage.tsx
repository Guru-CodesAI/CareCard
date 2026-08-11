import { Link } from 'react-router-dom'
import { Shield, Lock, Cpu, EyeOff, Server, AlertTriangle, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function SecurityPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="Secure QR Emergency Card — RLS & Token Security | CareCard"
        description="Explore the secure QR emergency card architecture. Built with Supabase RLS, secure QR tokens, PostgreSQL security policies, and rate limits."
        path="/security"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" /> Technical Architecture
        </div>
        <h1 className="page-header mb-2 text-3xl font-display">Secure QR Emergency Card Architecture</h1>
        <p className="text-warmgray-500 text-sm">
          A showcase of our privacy by design project utilizing a secure QR token system and robust database policies.
        </p>
      </div>

      <div className="prose prose-warmgray max-w-none space-y-8">
        
        {/* Row Level Security */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" />
            Supabase Row Level Security & PostgreSQL Security
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            Every database query is gated at the database layer. As a React Supabase security implementation, this Supabase RLS project leverages PostgreSQL RLS security to enforce absolute data isolation:
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside">
            <li>Caregivers can only view, edit, or delete CareCards that belong to their authenticated user ID (<code className="bg-warmgray-100 px-1 rounded text-xs">auth.uid()</code>).</li>
            <li>No database operations can bypass these access control rules from the frontend client.</li>
            <li>Public scanners cannot query the cards table directly; they can only fetch sanitized information through cryptographic token mapping.</li>
          </ul>
        </section>

        {/* Secure QR Tokens */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            Secure QR Token Security & Privacy Architecture
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            Many emergency QR systems put raw personal data (like name or phone number) straight into the QR code or encode it directly in the URL query parameters. This exposes information to any scanner immediately.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            CareCard solves this with a robust **QR token security** model utilizing opaque, cryptographic tokens:
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside">
            <li>The QR code contains only a random UUID string (e.g. <code className="bg-warmgray-100 px-1 rounded text-xs">/scan/7a3f-b25c-...</code>).</li>
            <li>When scanned, our database queries the card matching that token and resolves only the fields marked public by the caregiver.</li>
            <li>If a card is lost or stolen, the caregiver can deactivate the token with a single click. This instantly invalidates the old physical QR code without deleting the card or requiring account recreation.</li>
          </ul>
        </section>

        {/* Public/Private Separation */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-brand-500" />
            Supabase RPC Security & IDOR Prevention
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            We isolate sensitive contact details using PostgreSQL security policies and Supabase RPC security functions.
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside">
            <li>Private information (like phone numbers, specific instructions, or emails) is never loaded directly into the client-side state, achieving IDOR prevention on Supabase.</li>
            <li>Helpers can trigger phone calls or emails through secure endpoints that only expose details to the helper's local browser dialer or email client, rather than revealing them in raw plaintext in the UI code.</li>
            <li>Each piece of data (display name, languages spoken, assistance needs) is toggled individually by the caregiver, allowing them to optimize safety vs privacy.</li>
          </ul>
        </section>

        {/* Server-Side Rate Limiting */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-500" />
            Server-Side Rate Limiting PostgreSQL & Supabase Security Project Architecture
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            To prevent scraping or automated scanning of public profiles, CareCard implements server side rate limiting PostgreSQL procedures and Edge functions:
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside">
            <li>Strict rate limiting on the card resolution endpoint (<code className="bg-warmgray-100 px-1 rounded text-xs">/api/scan</code>) restricts requests based on IP address and scan volume.</li>
            <li>Database logging tracks scan event times to alert caregivers of active scans without storing helper IP addresses or identifiable tracking cookies.</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Limitations & Scope:</strong> CareCard is not a medical device, continuous GPS tracker, or emergency dispatch service. It acts as a secure, offline-to-online communication system designed to reconnect individuals safely.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
