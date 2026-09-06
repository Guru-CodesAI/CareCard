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
            Authenticated database access is gated at the database layer. CareCard uses Supabase RLS to isolate caregiver-owned records, while public scans expose only explicitly selected fields:
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
            CareCard uses an opaque, high-entropy QR token model:
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
            <li>Raw contact values (phone numbers, emails) are never returned by the public <code className="bg-warmgray-100 px-1 rounded text-xs">get_public_contacts</code> RPC. Only the contact name, relationship, and method type are exposed to helpers.</li>
            <li>This deployment does not initiate phone calls or emails. The scan page shows the contact name and relationship so a helper knows who to reach. A production communication relay (e.g. Twilio, SendGrid) would be required to place calls or send messages server-side.</li>
            <li>Each piece of data (display name, languages spoken, assistance needs) is toggled individually by the caregiver, allowing them to optimize safety vs privacy.</li>
          </ul>
        </section>

        {/* Server-Side Rate Limiting */}
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-500" />
            Rate Limiting & Scan Logging
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-3">
            To reduce automated scraping of public profiles, CareCard applies client and server controls:
          </p>
          <ul className="space-y-2 text-sm text-warmgray-600 list-disc list-inside">
            <li>A client-side <code className="bg-warmgray-100 px-1 rounded text-xs">RateLimiter</code> class limits the scan page to 10 profile requests per minute before any database call is made.</li>
            <li>Each public profile or contact read consumes a server-side quota unit. PostgreSQL enforces a maximum of 20 public reads per minute per active card, using a transaction-level advisory lock.</li>
            <li>Scan timestamps are logged without storing helper IP addresses or any identifiable tracking data.</li>
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
