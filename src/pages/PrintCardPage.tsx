import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getCardById } from '@/lib/data'
import { getLanguageDisplay, generateShortId } from '@/lib/utils'
import { CareCard } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import QRCode from 'qrcode'
import { Printer, ArrowLeft, Heart } from 'lucide-react'

export function PrintCardPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [card, setCard] = useState<CareCard | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !id) return
    loadCard()
  }, [user, id])

  const loadCard = async () => {
    if (!user || !id) return
    try {
      const data = await getCardById(id, user.id)
      if (!data) return

      setCard(data)
      const scanUrl = `${window.location.origin}/scan/${data.public_token}`
      const dataUrl = await QRCode.toDataURL(scanUrl, {
        width: 600,
        margin: 2,
        color: { dark: '#1c1917', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
      setQrDataUrl(dataUrl)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <LoadingSpinner message="Preparing printable card..." />
  if (!card) return null

  const lang = getLanguageDisplay(card.preferred_language)
  const shortId = generateShortId(card.public_token)

  return (
    <>
      {/* Screen controls */}
      <div className="page-container no-print">
        <Link to={`/card/${card.id}`} className="btn-ghost mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Card
        </Link>

        <h1 className="page-header mb-4">Print CareCard</h1>
        <p className="text-warmgray-500 text-sm mb-6">
          Print this page to create a physical CareCard. Cut along the card outline.
        </p>

        <button onClick={handlePrint} className="btn-primary mb-8">
          <Printer className="w-4 h-4" />
          Print Card
        </button>
      </div>

      {/* Printable Card */}
      <div className="flex justify-center px-4 pb-12">
        <div className="w-[340px]">
          {/* FRONT */}
          <div className="border-2 border-dashed border-warmgray-300 rounded-2xl p-6 bg-white mb-4 print:border-solid print:border-warmgray-900">
            <div className="text-center">
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-brand-500" fill="currentColor" />
                <span className="font-display font-bold text-lg text-warmgray-900">CareCard</span>
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-warmgray-900 mb-4">
                {card.display_name}
              </h2>

              {/* QR Code */}
              {qrDataUrl && (
                <div className="inline-block p-3 bg-white border-2 border-warmgray-200 rounded-xl mb-3">
                  <img src={qrDataUrl} alt="QR Code" className="w-40 h-40" />
                </div>
              )}

              {/* Card ID */}
              <div className="text-xs text-warmgray-400 font-mono mb-3">
                ID: {shortId}
              </div>

              {/* Scan instruction */}
              <p className="text-sm text-warmgray-600 font-medium">
                📱 Scan to safely help
              </p>
            </div>
          </div>

          {/* BACK */}
          <div className="border-2 border-dashed border-warmgray-300 rounded-2xl p-6 bg-white print:border-solid print:border-warmgray-900">
            <div className="text-center mb-4">
              <span className="font-display font-bold text-sm text-warmgray-400">CareCard</span>
            </div>

            <div className="space-y-3 text-sm">
              {/* Language */}
              <div className="p-3 rounded-lg bg-warmgray-50">
                <div className="text-xs text-warmgray-400 mb-1">Preferred Language</div>
                <div className="font-medium text-warmgray-800">
                  {lang.flag} {lang.native} ({lang.name})
                </div>
              </div>

              {/* Accessibility */}
              {card.accessibility_info && (
                <div className="p-3 rounded-lg bg-warmgray-50">
                  <div className="text-xs text-warmgray-400 mb-1">Accessibility</div>
                  <div className="font-medium text-warmgray-800 text-xs leading-relaxed">
                    {card.accessibility_info}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {card.custom_instructions && (
                <div className="p-3 rounded-lg bg-brand-50">
                  <div className="text-xs leading-relaxed text-warmgray-700">
                    {card.custom_instructions}
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 pt-3 border-t border-warmgray-200">
              <p className="text-[10px] text-warmgray-400 text-center leading-relaxed">
                CareCard is not an emergency service. If someone is in immediate danger, contact local emergency services.
              </p>
            </div>
          </div>

          <p className="text-xs text-warmgray-400 text-center mt-4 no-print">
            ✂️ Cut along the dashed line
          </p>
        </div>
      </div>
    </>
  )
}
