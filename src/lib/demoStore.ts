/**
 * Demo data store for CareCard.
 * This allows the full application to work without Supabase for hackathon demos.
 * When Supabase is configured, this is not used.
 */

import { CareCard, TrustedContact, ScanLog } from '@/types'
import { generateSecureToken } from '@/lib/utils'

// In-memory store
let cards: CareCard[] = []
let contacts: TrustedContact[] = []
let scanLogs: ScanLog[] = []
let currentUser: { id: string; email: string; full_name: string } | null = null

// Demo user accounts (email -> password)
const demoAccounts: Record<string, { password: string; name: string }> = {}

function generateId(): string {
  return crypto.randomUUID()
}

// Auth
export const demoAuth = {
  signUp(email: string, password: string, fullName: string) {
    if (demoAccounts[email]) {
      return { error: { message: 'An account with this email already exists.' } }
    }
    const id = generateId()
    demoAccounts[email] = { password, name: fullName }
    currentUser = { id, email, full_name: fullName }
    localStorage.setItem('carecard_demo_user', JSON.stringify(currentUser))
    return { data: { user: currentUser }, error: null }
  },

  signIn(email: string, password: string) {
    const account = demoAccounts[email]
    // In demo mode, also accept any login to make it easy
    if (!account) {
      // Auto-create account in demo mode for convenience
      const id = generateId()
      demoAccounts[email] = { password, name: email.split('@')[0] }
      currentUser = { id, email, full_name: email.split('@')[0] }
      localStorage.setItem('carecard_demo_user', JSON.stringify(currentUser))
      return { data: { user: currentUser }, error: null }
    }
    if (account.password !== password) {
      return { error: { message: 'Invalid email or password.' } }
    }
    currentUser = { 
      id: generateId(), 
      email, 
      full_name: account.name 
    }
    localStorage.setItem('carecard_demo_user', JSON.stringify(currentUser))
    return { data: { user: currentUser }, error: null }
  },

  signOut() {
    currentUser = null
    localStorage.removeItem('carecard_demo_user')
    return { error: null }
  },

  getUser() {
    if (currentUser) return currentUser
    const stored = localStorage.getItem('carecard_demo_user')
    if (stored) {
      currentUser = JSON.parse(stored)
      return currentUser
    }
    return null
  },

  getSession() {
    const user = this.getUser()
    return user ? { user } : null
  }
}

// Cards
export const demoCards = {
  async getAll(caregiverId: string): Promise<CareCard[]> {
    return cards.filter(c => c.caregiver_id === caregiverId)
  },

  async getById(id: string, caregiverId: string): Promise<CareCard | null> {
    return cards.find(c => c.id === id && c.caregiver_id === caregiverId) || null
  },

  async getByToken(token: string): Promise<CareCard | null> {
    return cards.find(c => c.public_token === token) || null
  },

  async create(data: Partial<CareCard>, caregiverId: string): Promise<CareCard> {
    const card: CareCard = {
      id: generateId(),
      caregiver_id: caregiverId,
      public_token: generateSecureToken(),
      display_name: data.display_name || '',
      preferred_language: data.preferred_language || 'en',
      accessibility_info: data.accessibility_info || '',
      custom_instructions: data.custom_instructions || '',
      photo_url: data.photo_url || null,
      status: 'active',
      show_display_name: data.show_display_name ?? true,
      show_language: data.show_language ?? true,
      show_accessibility: data.show_accessibility ?? true,
      show_area: data.show_area ?? false,
      show_instructions: data.show_instructions ?? false,
      approximate_area: data.approximate_area || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    cards.push(card)
    return card
  },

  async update(id: string, data: Partial<CareCard>, caregiverId: string): Promise<CareCard | null> {
    const index = cards.findIndex(c => c.id === id && c.caregiver_id === caregiverId)
    if (index === -1) return null
    cards[index] = { ...cards[index], ...data, updated_at: new Date().toISOString() }
    return cards[index]
  },

  async deactivate(id: string, caregiverId: string): Promise<boolean> {
    const card = cards.find(c => c.id === id && c.caregiver_id === caregiverId)
    if (!card) return false
    card.status = 'deactivated'
    card.updated_at = new Date().toISOString()
    return true
  },

  async activate(id: string, caregiverId: string): Promise<boolean> {
    const card = cards.find(c => c.id === id && c.caregiver_id === caregiverId)
    if (!card) return false
    card.status = 'active'
    card.updated_at = new Date().toISOString()
    return true
  },

  async regenerateToken(id: string, caregiverId: string): Promise<string | null> {
    const card = cards.find(c => c.id === id && c.caregiver_id === caregiverId)
    if (!card) return null
    card.public_token = generateSecureToken()
    card.updated_at = new Date().toISOString()
    return card.public_token
  },
}

// Contacts
export const demoContacts = {
  async getByCardId(cardId: string, caregiverId: string): Promise<TrustedContact[]> {
    return contacts.filter(c => c.card_id === cardId && c.caregiver_id === caregiverId)
  },

  async create(data: Partial<TrustedContact>, cardId: string, caregiverId: string): Promise<TrustedContact> {
    const contact: TrustedContact = {
      id: generateId(),
      card_id: cardId,
      caregiver_id: caregiverId,
      contact_name: data.contact_name || '',
      relationship: data.relationship || '',
      contact_method: data.contact_method || 'phone',
      contact_value: data.contact_value || '',
      is_primary: data.is_primary ?? false,
      is_verified: true, // Auto-verify in demo
      created_at: new Date().toISOString(),
    }
    contacts.push(contact)
    return contact
  },

  async delete(id: string, caregiverId: string): Promise<boolean> {
    const index = contacts.findIndex(c => c.id === id && c.caregiver_id === caregiverId)
    if (index === -1) return false
    contacts.splice(index, 1)
    return true
  },

  async getPublicContacts(cardId: string): Promise<Pick<TrustedContact, 'contact_name' | 'relationship' | 'contact_method' | 'is_primary'>[]> {
    return contacts
      .filter(c => c.card_id === cardId)
      .map(c => ({
        contact_name: c.contact_name,
        relationship: c.relationship,
        contact_method: c.contact_method,
        is_primary: c.is_primary,
      }))
  },
}

// Scan logs
export const demoScanLogs = {
  async log(cardId: string): Promise<void> {
    scanLogs.push({
      id: generateId(),
      card_id: cardId,
      scanned_at: new Date().toISOString(),
      user_agent: navigator.userAgent.substring(0, 100),
    })
  },

  async getByCardId(cardId: string): Promise<ScanLog[]> {
    return scanLogs
      .filter(l => l.card_id === cardId)
      .sort((a, b) => new Date(b.scanned_at).getTime() - new Date(a.scanned_at).getTime())
      .slice(0, 20)
  },
}

// Initialize with demo data
export function initDemoData() {
  // Don't reinitialize if data exists
  if (cards.length > 0) return

  const demoUserId = 'demo-user-arun'
  
  // Create demo caregiver
  demoAccounts['arun@demo.carecard.in'] = { password: 'demo1234', name: 'Arun' }

  // Create demo card
  const demoToken = generateSecureToken()
  const demoCard: CareCard = {
    id: 'demo-card-raman',
    caregiver_id: demoUserId,
    public_token: demoToken,
    display_name: 'Raman',
    preferred_language: 'ta',
    accessibility_info: 'May need assistance while walking. Uses a walking stick.',
    custom_instructions: 'Please help contact a trusted family member. Raman may take a moment to respond.',
    photo_url: null,
    status: 'active',
    show_display_name: true,
    show_language: true,
    show_accessibility: true,
    show_area: false,
    show_instructions: true,
    approximate_area: 'T. Nagar, Chennai',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
  cards.push(demoCard)

  // Create demo contacts
  contacts.push({
    id: 'demo-contact-1',
    card_id: 'demo-card-raman',
    caregiver_id: demoUserId,
    contact_name: 'Arun',
    relationship: 'Son',
    contact_method: 'phone',
    contact_value: '+91 98765 43210',
    is_primary: true,
    is_verified: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  })

  contacts.push({
    id: 'demo-contact-2',
    card_id: 'demo-card-raman',
    caregiver_id: demoUserId,
    contact_name: 'Priya',
    relationship: 'Daughter',
    contact_method: 'phone',
    contact_value: '+91 98765 43211',
    is_primary: false,
    is_verified: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  })

  // Create demo scan logs
  scanLogs.push({
    id: 'demo-scan-1',
    card_id: 'demo-card-raman',
    scanned_at: new Date(Date.now() - 3600000).toISOString(),
    user_agent: 'Demo scan',
  })

  console.log(`🟢 CareCard Demo Mode Active — Demo QR token: ${demoToken}`)
  console.log(`   Visit: /scan/${demoToken}`)
}
