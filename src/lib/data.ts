/**
 * Data access layer for CareCard (Production-only Supabase integration).
 */

import { supabase } from '@/lib/supabase'
import { CareCard, TrustedContact, ScanLog, PublicCardProfile } from '@/types'
import { generateSecureToken, sanitizeInput } from '@/lib/utils'

// ========================================
// CareCards
// ========================================

export async function getCards(caregiverId: string): Promise<CareCard[]> {
  const { data, error } = await supabase
    .from('care_cards')
    .select('*')
    .eq('caregiver_id', caregiverId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getCardById(id: string, caregiverId: string): Promise<CareCard | null> {
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
    show_trusted_contact?: boolean
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
    show_trusted_contact: data.show_trusted_contact ?? true,
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
  // Strip security-sensitive fields from generic updates to prevent parameter pollution
  const { id: _id, public_token, caregiver_id, status, created_at, ...allowedUpdates } = updates

  // Sanitize string fields
  const sanitized: Partial<CareCard> = { ...allowedUpdates }
  if (sanitized.display_name) sanitized.display_name = sanitizeInput(sanitized.display_name, 100)
  if (sanitized.accessibility_info) sanitized.accessibility_info = sanitizeInput(sanitized.accessibility_info, 500)
  if (sanitized.custom_instructions) sanitized.custom_instructions = sanitizeInput(sanitized.custom_instructions, 500)
  if (sanitized.approximate_area) sanitized.approximate_area = sanitizeInput(sanitized.approximate_area, 200)

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
  const { error } = await supabase
    .from('care_cards')
    .update({ status: 'deactivated', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return !error
}

export async function activateCard(id: string, caregiverId: string): Promise<boolean> {
  const { error } = await supabase
    .from('care_cards')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return !error
}

export async function regenerateQR(id: string, caregiverId: string): Promise<string | null> {
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
  // Use the secure RPC function to get the profile without exposing other table rows or show_* flags
  const { data, error } = await supabase
    .rpc('get_public_profile', { p_token: token })

  if (error || !data || data.length === 0) return null

  const record = data[0]
  return {
    display_name: record.display_name,
    preferred_language: record.preferred_language,
    accessibility_info: record.accessibility_info,
    approximate_area: record.approximate_area,
    custom_instructions: record.custom_instructions,
    status: record.status,
    card_id_short: token.substring(0, 8).toUpperCase(),
  }
}

// ========================================
// Trusted Contacts
// ========================================

export async function getContacts(cardId: string, caregiverId: string): Promise<TrustedContact[]> {
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

  const { data: contact, error } = await supabase
    .from('trusted_contacts')
    .insert({
      ...sanitized,
      card_id: cardId,
      caregiver_id: caregiverId,
      is_verified: true,
      contact_enabled: true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return contact
}

export async function updateContact(
  id: string,
  data: Partial<TrustedContact>,
  caregiverId: string
): Promise<TrustedContact | null> {
  const { data: updated, error } = await supabase
    .from('trusted_contacts')
    .update(data)
    .eq('id', id)
    .eq('caregiver_id', caregiverId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return updated
}

export async function deleteContact(id: string, caregiverId: string): Promise<boolean> {
  const { error } = await supabase
    .from('trusted_contacts')
    .delete()
    .eq('id', id)
    .eq('caregiver_id', caregiverId)

  return !error
}

export async function getPublicContacts(token: string): Promise<{ contact_name: string; relationship: string; contact_method: 'phone' | 'email'; is_primary: boolean }[]> {
  // Use the secure RPC function to fetch contacts without exposing raw tables to public SELECTs
  const { data, error } = await supabase
    .rpc('get_public_contacts', { p_token: token })

  if (error) return []
  return data || []
}

// ========================================
// Scan Logs
// ========================================

export async function logScan(token: string): Promise<void> {
  // Use the secure RPC scan logger
  await supabase.rpc('log_card_scan', { p_token: token })
}

export async function getScanLogs(cardId: string): Promise<ScanLog[]> {
  const { data, error } = await supabase
    .from('scan_logs')
    .select('*')
    .eq('card_id', cardId)
    .order('scanned_at', { ascending: false })
    .limit(20)

  if (error) return []
  return data || []
}

// ========================================
// Account Deletion
// ========================================

export async function deleteUserAccount(caregiverId: string): Promise<boolean> {
  const { error } = await supabase.rpc('delete_user_account')
  return !error
}
