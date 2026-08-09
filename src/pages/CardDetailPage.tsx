import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getCardById, getContacts, getScanLogs, deactivateCard, activateCard, regenerateQR, deleteContact, createContact, updateCard } from '@/lib/data'
import { getLanguageDisplay, formatDate, generateShortId, isValidPhone, isValidEmail } from '@/lib/utils'
import { CareCard, TrustedContact, ScanLog } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Toggle } from '@/components/Toggle'
import QRCode from 'qrcode'
import {
  QrCode, Download, Printer, RefreshCw, Shield, ShieldOff,
  Phone, Mail, Users, Clock, Eye, AlertTriangle,
  CheckCircle, Copy, ExternalLink, Trash2, Plus, AlertCircle,
  Globe, Accessibility, ArrowLeft, Edit2, Save, X
} from 'lucide-react'

export function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [card, setCard] = useState<CareCard | null>(null)
  const [contacts, setContacts] = useState<TrustedContact[]>([])
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([])
  const [loading, setLoading] = useState(true)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [actionLoading, setActionLoading] = useState('')
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<CareCard>>({})
  const [newContact, setNewContact] = useState<{ contact_name: string; relationship: string; contact_method: 'phone' | 'email'; contact_value: string; is_primary: boolean }>({ contact_name: '', relationship: '', contact_method: 'phone', contact_value: '', is_primary: false })
  const [showAddContact, setShowAddContact] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const qrRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!user || !id) return
    loadData()
  }, [user, id])

  const loadData = async () => {
    if (!user || !id) return
    try {
      const [cardData, contactsData, logsData] = await Promise.all([
        getCardById(id, user.id),
        getContacts(id, user.id),
        getScanLogs(id),
      ])

      if (!cardData) {
        navigate('/dashboard')
        return
      }

      setCard(cardData)
      setContacts(contactsData)
      setScanLogs(logsData)
      setEditData(cardData)

      // Generate QR
      const scanUrl = `${window.location.origin}/scan/${cardData.public_token}`
      const dataUrl = await QRCode.toDataURL(scanUrl, {
        width: 400,
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

  const handleDeactivate = async () => {
    if (!user || !card) return
    setActionLoading('deactivate')
    const ok = card.status === 'active'
      ? await deactivateCard(card.id, user.id)
      : await activateCard(card.id, user.id)
    if (ok) {
      setSuccess(card.status === 'active' ? 'Card deactivated.' : 'Card reactivated.')
      await loadData()
    }
    setActionLoading('')
    setShowDeactivateConfirm(false)
  }

  const handleRegenerate = async () => {
    if (!user || !card) return
    setActionLoading('regenerate')
    const newToken = await regenerateQR(card.id, user.id)
    if (newToken) {
      setSuccess('QR code regenerated. Previous QR has been deactivated.')
      await loadData()
    }
    setActionLoading('')
    setShowRegenerateConfirm(false)
  }

  const handleDownloadQR = () => {
    if (!qrDataUrl || !card) return
    const link = document.createElement('a')
    link.download = `carecard-${card.display_name.toLowerCase().replace(/\s+/g, '-')}-qr.png`
    link.href = qrDataUrl
    link.click()
  }

  const handleCopyLink = async () => {
    if (!card) return
    const url = `${window.location.origin}/scan/${card.public_token}`
    await navigator.clipboard.writeText(url)
    setSuccess('Link copied to clipboard.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSaveEdit = async () => {
    if (!user || !card) return
    setActionLoading('save')
    setError('')
    try {
      await updateCard(card.id, editData, user.id)
      setSuccess('Card updated successfully.')
      setEditing(false)
      await loadData()
    } catch {
      setError('Failed to save changes.')
    }
    setActionLoading('')
  }

  const handleAddContact = async () => {
    if (!user || !card) return
    if (!newContact.contact_name.trim() || !newContact.contact_value.trim()) {
      setError('Please fill in the contact name and value.')
      return
    }
    const method = newContact.contact_method
    if (method === 'phone' && !isValidPhone(newContact.contact_value)) {
      setError('Invalid phone number.')
      return
    }
    if (method === 'email' && !isValidEmail(newContact.contact_value)) {
      setError('Invalid email address.')
      return
    }
    
    setActionLoading('addContact')
    try {
      await createContact(newContact, card.id, user.id)
      setNewContact({ contact_name: '', relationship: '', contact_method: 'phone', contact_value: '', is_primary: false })
      setShowAddContact(false)
      setSuccess('Contact added.')
      await loadData()
    } catch {
      setError('Failed to add contact.')
    }
    setActionLoading('')
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!user) return
    setActionLoading(`deleteContact-${contactId}`)
    await deleteContact(contactId, user.id)
    setSuccess('Contact removed.')
    await loadData()
    setActionLoading('')
  }

  if (loading) return <LoadingSpinner message="Loading CareCard..." />
  if (!card) return null

  const lang = getLanguageDisplay(card.preferred_language)
  const isActive = card.status === 'active'
  const shortId = generateShortId(card.public_token)
  const scanUrl = `${window.location.origin}/scan/${card.public_token}`

  return (
    <div className="page-container page-enter">
      {/* Back */}
      <Link to="/dashboard" className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Success/Error banners */}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-3 h-3" /></button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Card Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
              isActive ? 'bg-brand-50 text-brand-600' : 'bg-warmgray-100 text-warmgray-400'
            }`}>
              {card.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-warmgray-900">{card.display_name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={isActive ? 'badge-active' : 'badge-inactive'}>
                  {isActive ? '🟢 Active' : '🔴 Deactivated'}
                </span>
                <span className="text-xs text-warmgray-400 font-mono">ID: {shortId}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setEditing(!editing); setEditData(card) }}
            className="btn-ghost"
          >
            {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Card details */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-warmgray-50">
            <div className="text-xs text-warmgray-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Language
            </div>
            {editing ? (
              <select
                value={editData.preferred_language || card.preferred_language}
                onChange={(e) => setEditData({ ...editData, preferred_language: e.target.value })}
                className="input-field text-sm py-1.5"
              >
                <option value="en">🇬🇧 English</option>
                <option value="ta">🇮🇳 தமிழ்</option>
                <option value="hi">🇮🇳 हिन्दी</option>
              </select>
            ) : (
              <div className="font-medium text-warmgray-800">{lang.flag} {lang.native}</div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-warmgray-50">
            <div className="text-xs text-warmgray-400 mb-1 flex items-center gap-1">
              <Accessibility className="w-3 h-3" /> Assistance Needs & Accessibility
            </div>
            {editing ? (
              <>
                <p className="text-[10px] text-amber-600 mb-1 leading-tight">
                  ⚠️ Avoid entering sensitive medical diagnoses/PII.
                </p>
                <textarea
                  value={editData.accessibility_info ?? card.accessibility_info}
                  onChange={(e) => setEditData({ ...editData, accessibility_info: e.target.value })}
                  className="input-field text-sm py-1.5 min-h-[60px]"
                />
              </>
            ) : (
              <div className="font-medium text-warmgray-800 text-sm">
                {card.accessibility_info || 'None specified'}
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveEdit}
              disabled={actionLoading === 'save'}
              className="btn-primary text-sm"
            >
              <Save className="w-4 h-4" />
              {actionLoading === 'save' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="card mb-6 text-center">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5 text-brand-500" />
          QR Code
        </h2>

        {isActive ? (
          <>
            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-warmgray-200 shadow-sm mb-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="CareCard QR Code" className="w-48 h-48 sm:w-56 sm:h-56" />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-warmgray-100 rounded-xl animate-pulse" />
              )}
            </div>

            <p className="text-xs text-warmgray-400 mb-4 max-w-sm mx-auto break-all">
              {scanUrl}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button onClick={handleDownloadQR} className="btn-secondary text-sm">
                <Download className="w-4 h-4" />
                Download
              </button>
              <Link to={`/print/${card.id}`} className="btn-secondary text-sm">
                <Printer className="w-4 h-4" />
                Print Card
              </Link>
              <button onClick={handleCopyLink} className="btn-secondary text-sm">
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
              <a href={scanUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                <ExternalLink className="w-4 h-4" />
                Preview
              </a>
            </div>
          </>
        ) : (
          <div className="py-8">
            <ShieldOff className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
            <p className="text-warmgray-500 mb-4">This card is deactivated. QR code is not functional.</p>
            <button onClick={() => setShowDeactivateConfirm(true)} className="btn-primary text-sm">
              Reactivate Card
            </button>
          </div>
        )}
      </div>

      {/* Trusted Contacts */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-warmgray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Trusted Contacts ({contacts.length})
          </h2>
          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="btn-ghost text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {showAddContact && (
          <div className="mb-4 p-4 rounded-xl bg-warmgray-50 border border-warmgray-200 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Name"
                value={newContact.contact_name}
                onChange={(e) => setNewContact({ ...newContact, contact_name: e.target.value })}
                className="input-field text-sm"
                maxLength={100}
              />
              <input
                placeholder="Relationship (e.g. Son)"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="input-field text-sm"
                maxLength={50}
              />
            </div>
            <input
              placeholder={newContact.contact_method === 'phone' ? '+91 98765 43210' : 'email@example.com'}
              value={newContact.contact_value}
              onChange={(e) => setNewContact({ ...newContact, contact_value: e.target.value })}
              className="input-field text-sm"
              maxLength={50}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddContact}
                disabled={actionLoading === 'addContact'}
                className="btn-primary text-sm"
              >
                {actionLoading === 'addContact' ? 'Adding...' : 'Add Contact'}
              </button>
              <button onClick={() => setShowAddContact(false)} className="btn-ghost text-sm">Cancel</button>
            </div>
          </div>
        )}

        {contacts.length === 0 ? (
          <p className="text-sm text-warmgray-500 py-4">No trusted contacts added yet.</p>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-warmgray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-warmgray-800 text-sm">{contact.contact_name}</span>
                    {contact.is_primary && <span className="text-xs text-brand-600 font-semibold">Primary</span>}
                    <span className="text-xs text-warmgray-400">{contact.relationship}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-warmgray-500 mt-0.5">
                    {contact.contact_method === 'phone' ? <Phone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                    {contact.contact_value}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  disabled={actionLoading === `deleteContact-${contact.id}`}
                  className="p-1.5 rounded hover:bg-red-50 text-warmgray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${contact.contact_name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Settings */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-500" />
          Public Visibility
        </h2>
        <div className="space-y-3">
          <Toggle id="detail-show-name" checked={card.show_display_name} onChange={async (v) => { await updateCard(card.id, { show_display_name: v }, user!.id); loadData() }} label="Display name" />
          <Toggle id="detail-show-lang" checked={card.show_language} onChange={async (v) => { await updateCard(card.id, { show_language: v }, user!.id); loadData() }} label="Preferred language" />
          <Toggle id="detail-show-access" checked={card.show_accessibility} onChange={async (v) => { await updateCard(card.id, { show_accessibility: v }, user!.id); loadData() }} label="Accessibility assistance" />
          <Toggle id="detail-show-instr" checked={card.show_instructions} onChange={async (v) => { await updateCard(card.id, { show_instructions: v }, user!.id); loadData() }} label="Custom instructions" />
          <Toggle id="detail-show-area" checked={card.show_area} onChange={async (v) => { await updateCard(card.id, { show_area: v }, user!.id); loadData() }} label="Approximate area" />
        </div>
      </div>

      {/* Scan Activity */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-500" />
          Scan Activity
        </h2>
        {scanLogs.length === 0 ? (
          <p className="text-sm text-warmgray-500">No scans recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {scanLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm py-2 border-b border-warmgray-100 last:border-0">
                <QrCode className="w-4 h-4 text-warmgray-400" />
                <span className="text-warmgray-600">CareCard scanned</span>
                <span className="text-warmgray-400 ml-auto text-xs">{formatDate(log.scanned_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h2 className="text-lg font-semibold text-warmgray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Card Actions
        </h2>
        <div className="space-y-3">
          {/* Regenerate QR */}
          {isActive && (
            <>
              {showRegenerateConfirm ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-800 mb-3">
                    <strong>Regenerate QR?</strong> The current QR code will stop working. You'll need to print a new card.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRegenerate}
                      disabled={actionLoading === 'regenerate'}
                      className="btn-primary text-sm !bg-amber-600 hover:!bg-amber-700"
                    >
                      <RefreshCw className={`w-4 h-4 ${actionLoading === 'regenerate' ? 'animate-spin' : ''}`} />
                      {actionLoading === 'regenerate' ? 'Regenerating...' : 'Yes, Regenerate'}
                    </button>
                    <button onClick={() => setShowRegenerateConfirm(false)} className="btn-ghost text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowRegenerateConfirm(true)}
                  className="btn-secondary w-full text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate QR Code
                </button>
              )}
            </>
          )}

          {/* Deactivate / Reactivate */}
          {showDeactivateConfirm ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-800 mb-3">
                <strong>{isActive ? 'Deactivate' : 'Reactivate'} this CareCard?</strong>
                {isActive && ' The QR code will stop working until reactivated.'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeactivate}
                  disabled={actionLoading === 'deactivate'}
                  className={`text-sm ${isActive ? 'btn-danger' : 'btn-primary'}`}
                >
                  {actionLoading === 'deactivate' ? 'Please wait...' : (isActive ? 'Deactivate' : 'Reactivate')}
                </button>
                <button onClick={() => setShowDeactivateConfirm(false)} className="btn-ghost text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeactivateConfirm(true)}
              className={`w-full text-sm ${isActive ? 'btn-danger' : 'btn-primary'}`}
            >
              {isActive ? (
                <><ShieldOff className="w-4 h-4" /> Deactivate Card</>
              ) : (
                <><Shield className="w-4 h-4" /> Reactivate Card</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
