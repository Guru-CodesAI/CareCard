import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getCards } from '@/lib/data'
import { getLanguageDisplay } from '@/lib/utils'
import { CareCard } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EmptyState } from '@/components/EmptyState'
import {
  Plus, QrCode, Printer, Eye, Edit, Heart, 
  MoreVertical, Shield
} from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cards, setCards] = useState<CareCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadCards()
  }, [user])

  const loadCards = async () => {
    if (!user) return
    try {
      const data = await getCards(user.id)
      setCards(data)
    } catch (err) {
      console.error('Failed to load cards:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading your CareCards..." />

  return (
    <div className="page-container page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">
            Hello, {user?.full_name || user?.email?.split('@')[0] || 'there'} 👋
          </h1>
          <p className="text-warmgray-500 text-sm mt-1">
            Manage your CareCards
          </p>
        </div>
        <Link
          to="/create"
          className="btn-primary"
          id="dashboard-create-card"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Card</span>
        </Link>
      </div>

      {/* Cards list */}
      {cards.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-7 h-7 text-brand-400" />}
          title="No CareCards yet"
          description="Create your first CareCard to help protect someone you care about."
          action={
            <Link to="/create" className="btn-primary" id="empty-create-card">
              <Plus className="w-4 h-4" />
              Create your first CareCard
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-warmgray-500 uppercase tracking-wider">
            My CareCards ({cards.length})
          </h2>

          {cards.map((card) => {
            const lang = getLanguageDisplay(card.preferred_language)
            const isActive = card.status === 'active'

            return (
              <div
                key={card.id}
                className="card-hover cursor-pointer"
                onClick={() => navigate(`/card/${card.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/card/${card.id}`) }}
                aria-label={`CareCard for ${card.display_name}`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    isActive ? 'bg-brand-50' : 'bg-warmgray-100'
                  }`}>
                    {card.display_name.charAt(0).toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-warmgray-900 truncate">
                        {card.display_name || 'Unnamed Card'}
                      </h3>
                      <span className={isActive ? 'badge-active' : 'badge-inactive'}>
                        {isActive ? '🟢 Active' : '🔴 Deactivated'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warmgray-500">
                      <span>{lang.flag} {lang.native}</span>
                      {card.accessibility_info && (
                        <span className="truncate max-w-[200px]">{card.accessibility_info}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={`/card/${card.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-warmgray-100 transition-colors"
                      aria-label={`View ${card.display_name}`}
                    >
                      <Eye className="w-4 h-4 text-warmgray-400" />
                    </Link>
                    <Link
                      to={`/print/${card.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-warmgray-100 transition-colors"
                      aria-label={`Print ${card.display_name}`}
                    >
                      <Printer className="w-4 h-4 text-warmgray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Security reminder */}
      <div className="mt-8 p-4 rounded-xl bg-warmgray-100 border border-warmgray-200 flex items-start gap-3">
        <Shield className="w-5 h-5 text-warmgray-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-warmgray-600 font-medium">Privacy Reminder</p>
          <p className="text-xs text-warmgray-500 mt-1">
            Only the information you've toggled as public will be visible when someone scans a CareCard QR code.
          </p>
        </div>
      </div>
    </div>
  )
}
