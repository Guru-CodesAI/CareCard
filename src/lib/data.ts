/**
 * Data access layer for CareCard.
 * Transparently uses Supabase or demo store based on configuration.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { demoCards, demoContacts, demoScanLogs } from '@/lib/demoStore'
import { CareCard, TrustedContact, ScanLog, PublicCardProfile } from '@/types'
import { generateSecureToken, sanitizeInput } from '@/lib/utils'

const useSupabase = isSupabaseConfigured

// ========================================
// CareCards
// ========================================

export async function getCards(caregiverId: string): Promise<CareCard[]> {
  if (!useSupabase()) {
    return demoCards.getAll(caregiverId)
  }

  const { data, error } = await supabase
    .from('care_cards')
    .select('*')
    .eq('caregiver_id', caregiverId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getCardById(id: string, caregiverId: string): Promise<CareCard | null> {
  if (!useSupabase()) {
    return demoCards.getById(id, caregiverId)
  }

  const { data, error } = await supabase
    .from('care_cards')
    .select('*')
    .eq('id', id)
    .eq('caregiver_id', caregiverId)
    .single()

  if (error) return null
  return data
}

export async function createCard(
  data: {
    display_name: string
    preferred_language: string
    accessibility_info?: string
    custom_instructions?: string
    show_display_name?: boolean
    show_language?: boolean
    show_accessibility?: boolean
    show_area?: boolean
    show_instructions?: boolean
    approximate_area?: string
  },
  caregiverId: string
): Promise<CareCard> {
  const sanitized = {
    display_name: sanitizeInput(data.display_name, 100),
    preferred_language: data.preferred_language,
    accessibility_info: sanitizeInput(data.accessibility_info || '', 500),
    custom_instructions: sanitizeInput(data.custom_instructions || '', 500),
    approximate_area: sanitizeInput(data.approximate_area || '', 200),
    show_display_name: data.show_display_name ?? true,
    show_language: data.show_language ?? true,
    show_accessibility: data.show_accessibility ?? true,
    show_area: data.show_area ?? false,
    show_instructions: data.show_instructions ?? false,
  }

  if (!useSupabase()) {
    return demoCards.create(sanitized as Partial<CareCard>, caregiverId)
  }

  const token = generateSecureToken()
  const { data: card, error } = await supabase
    .from('care_cards')
    .insert({
      ...sanitized,
      caregiver_id: caregiverId,
      public_token: token,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return card
}

export async function updateCard(
  id: string,
  updates: Partial<CareCard>,
  caregiverId: string
): Promise<CareCard | null> {
  // Sanitize string fields
  const sanitized: Partial<CareCard> = { ...updates }
  if (sanitized.display_name) sanitized.display_name = sanitizeInput(sanitized.display_name, 100)
  if (sanitized.accessibility_info) sanitized.accessibility_info = sanitizeInput(sanitized.accessibility_info, 500)
  if (sanitized.custom_instructions) sanitized.custom_instructions = sanitizeInput(sanitized.custom_instructions, 500)
  if (sanitized.approximate_area) sanitized.approximate_area = sanitizeInput(sanitized.approximate_area, 200)

  if (!useSupabase()) {
    return demoCards.update(id, sanitized, caregiverId)
  }

  const { data, error } = await supabase
    .from('care_cards')
    .update({ ...sanitized, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('caregiver_id', caregiverId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deactivateCard(id: string, caregiverId: string): Promise<boolean> {
  if (!useSupabase()) {
    return demoCards.deactivate(id, caregiverId)
  }

  const { error } = await supabase
    .from('care_cards')
    .update({ status: 'deactivated', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return !error
}

export async function activateCard(id: string, caregiverId: string): Promise<boolean> {
  if (!useSupabase()) {
    return demoCards.activate(id, caregiverId)
  }

  const { error } = await supabase
    .from('care_cards')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return !error
}

export async function regenerateQR(id: string, caregiverId: string): Promise<string | null> {
  if (!useSupabase()) {
    return demoCards.regenerateToken(id, caregiverId)
  }

  const newToken = generateSecureToken()
  const { error } = await supabase
    .from('care_cards')
    .update({ public_token: newToken, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return error ? null : newToken
}

// ========================================
// Public scan — returns only safe fields
// ========================================

export async function getPublicProfile(token: string): Promise<PublicCardProfile | null> {
  if (!useSupabase()) {
    const card = await demoCards.getByToken(token)
    if (!card) return null
    return {
      display_name: card.show_display_name ? card.display_name : null,
      preferred_language: card.show_language ? card.preferred_language : null,
      accessibility_info: card.show_accessibility ? card.accessibility_info : null,
      approximate_area: card.show_area ? card.approximate_area : null,
      custom_instructions: card.show_instructions ? card.custom_instructions : null,
      status: card.status,
      card_id_short: card.public_token.substring(0, 8).toUpperCase(),
    }
  }

  // Use a database function or view to return only public fields
  const { data, error } = await supabase
    .from('care_cards')
    .select('display_name, preferred_language, accessibility_info, approximate_area, custom_instructions, status, public_token, show_display_name, show_language, show_accessibility, show_area, show_instructions')
    .eq('public_token', token)
    .single()

  if (error || !data) return null

  return {
    display_name: data.show_display_name ? data.display_name : null,
    preferred_language: data.show_language ? data.preferred_language : null,
    accessibility_info: data.show_accessibility ? data.accessibility_info : null,
    approximate_area: data.show_area ? data.approximate_area : null,
    custom_instructions: data.show_instructions ? data.custom_instructions : null,
    status: data.status,
    card_id_short: data.public_token.substring(0, 8).toUpperCase(),
  }
}

// ========================================
// Trusted Contacts
// ========================================

export async function getContacts(cardId: string, caregiverId: string): Promise<TrustedContact[]> {
  if (!useSupabase()) {
    return demoContacts.getByCardId(cardId, caregiverId)
  }

  const { data, error } = await supabase
    .from('trusted_contacts')
    .select('*')
    .eq('card_id', cardId)
    .eq('caregiver_id', caregiverId)
    .order('is_primary', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createContact(
  data: {
    contact_name: string
    relationship: string
    contact_method: 'phone' | 'email'
    contact_value: string
    is_primary: boolean
  },
  cardId: string,
  caregiverId: string
): Promise<TrustedContact> {
  const sanitized = {
    contact_name: sanitizeInput(data.contact_name, 100),
    relationship: sanitizeInput(data.relationship, 50),
    contact_method: data.contact_method,
    contact_value: sanitizeInput(data.contact_value, 50),
    is_primary: data.is_primary,
  }

  if (!useSupabase()) {
    return demoContacts.create(sanitized, cardId, caregiverId)
  }

  const { data: contact, error } = await supabase
    .from('trusted_contacts')
    .insert({
      ...sanitized,
      card_id: cardId,
      caregiver_id: caregiverId,
      is_verified: false,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return contact
}

export async function deleteContact(id: string, caregiverId: string): Promise<boolean> {
  if (!useSupabase()) {
    return demoContacts.delete(id, caregiverId)
  }

  const { error } = await supabase
    .from('trusted_contacts')
    .delete()
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return !error
}

export async function getPublicContacts(token: string): Promise<{ contact_name: string; relationship: string; contact_method: 'phone' | 'email'; contact_value: string; is_primary: boolean }[]> {
  if (!useSupabase()) {
    const card = await demoCards.getByToken(token)
    if (!card || card.status !== 'active') return []
    return demoContacts.getPublicContacts(card.id)
  }

  // Get card by token first, then get contacts
  const { data: card } = await supabase
    .from('care_cards')
    .select('id')
    .eq('public_token', token)
    .eq('status', 'active')
    .single()

  if (!card) return []

  const { data, error } = await supabase
    .from('trusted_contacts')
    .select('contact_name, relationship, contact_method, contact_value, is_primary')
    .eq('card_id', card.id)
    .order('is_primary', { ascending: false })

  if (error) return []
  return data || []
}

// ========================================
// Scan Logs
// ========================================

export async function logScan(token: string): Promise<void> {
  if (!useSupabase()) {
    const card = await demoCards.getByToken(token)
    if (card) {
      await demoScanLogs.log(card.id)
    }
    return
  }

  const { data: card } = await supabase
    .from('care_cards')
    .select('id')
    .eq('public_token', token)
    .single()

  if (card) {
    await supabase.from('scan_logs').insert({
      card_id: card.id,
    })
  }
}

export async function getScanLogs(cardId: string): Promise<ScanLog[]> {
  if (!useSupabase()) {
    return demoScanLogs.getByCardId(cardId)
  }

  const { data, error } = await supabase
    .from('scan_logs')
    .select('*')
    .eq('card_id', cardId)
    .order('scanned_at', { ascending: false })
    .limit(20)

  if (error) return []
  return data || []
}
