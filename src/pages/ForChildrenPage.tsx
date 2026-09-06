import { Link } from 'react-router-dom'
import { Heart, Shield, Sparkles, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react'
import { SEO } from '@/components/SEO'

export function ForChildrenPage() {
  return (
    <div className="page-container page-enter">
      <SEO
        title="QR Emergency Contact Card for Children | CareCard"
        description="Learn how a QR emergency card for children helps keep kids safe. CareCard provides a secure child safety QR code and emergency contact card for kids."
        path="/for-children"
      />
      <Link to="/" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
          👧 Child Safety Solution
        </div>
        <h1 className="page-header mb-2 text-3xl">QR Emergency Contact Card for Children</h1>
        <p className="text-warmgray-500 text-sm">
          A secure child safety QR code solution to help lost children reconnect with parents at crowded events, theme parks, and school field trips.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3">Keep Your Kids Safe in Crowds</h2>
          <p className="text-sm text-warmgray-600 leading-relaxed mb-4">
            Losing sight of a child at a theme park, beach, or festival is every parent’s worst nightmare. Many parents resort to writing phone numbers on their children's arms, putting paper notes in pockets, or using custom badges.
          </p>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            CareCard provides a modern, privacy-first alternative. It lets you create a clean digital safety profile. If a child gets lost, any trusted adult or security guard can scan the child's QR code to access the emergency contact card for kids. This QR emergency card for children helps reconnect families quickly without exposing raw numbers.
          </p>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Designed for Child Protection
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">No GPS Tracking, Complete Privacy</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  We don't collect continuous location coordinates. CareCard values privacy by design, avoiding privacy risks associated with children's GPS-tracking smartwatches.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Easy to Wear or Print</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  Print the QR card and slip it inside a backpack pocket, attach it as a zipper tag, or print it as an adhesive label. You can make it as visible or hidden as you prefer.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warmgray-800 text-sm">Dynamic Updates</h3>
                <p className="text-xs text-warmgray-500 mt-1">
                  Is a grandparent watching them today? Just update the trusted contact in your online dashboard. The physical card doesn't need to be replaced, since the QR points to the updated profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-warmgray-50">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-500" />
            Secure Contact Sharing
          </h2>
          <p className="text-sm text-warmgray-600 leading-relaxed">
            The QR code links to a secure UUID token rather than storing your contact details directly in the code itself, preventing unwanted scans or harvesting of child/parent data. When a helper scans the card, they see the trusted contact's name and relationship so they can help reconnect the child with their family.
          </p>
        </section>

        <div className="text-center py-4">
          <Link to="/auth" className="btn-primary">
            <Heart className="w-4 h-4" fill="white" />
            Create Child Safety QR Card
          </Link>
        </div>
      </div>
    </div>
  )
}
