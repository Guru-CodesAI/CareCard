-- ============================================
-- CareCard Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CareCards Table
-- ============================================
CREATE TABLE care_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_token TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) <= 100),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (char_length(preferred_language) <= 10),
  accessibility_info TEXT DEFAULT '' CHECK (char_length(accessibility_info) <= 500),
  custom_instructions TEXT DEFAULT '' CHECK (char_length(custom_instructions) <= 500),
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deactivated')),
  
  -- Privacy toggles
  show_display_name BOOLEAN NOT NULL DEFAULT TRUE,
  show_language BOOLEAN NOT NULL DEFAULT TRUE,
  show_accessibility BOOLEAN NOT NULL DEFAULT TRUE,
  show_area BOOLEAN NOT NULL DEFAULT FALSE,
  show_instructions BOOLEAN NOT NULL DEFAULT FALSE,
  approximate_area TEXT DEFAULT '' CHECK (char_length(approximate_area) <= 200),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on public_token for fast QR lookups
CREATE INDEX idx_care_cards_public_token ON care_cards(public_token);
CREATE INDEX idx_care_cards_caregiver_id ON care_cards(caregiver_id);

-- ============================================
-- 2. Trusted Contacts Table
-- ============================================
CREATE TABLE trusted_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES care_cards(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL CHECK (char_length(contact_name) <= 100),
  relationship TEXT DEFAULT '' CHECK (char_length(relationship) <= 50),
  contact_method TEXT NOT NULL DEFAULT 'phone' CHECK (contact_method IN ('phone', 'email')),
  contact_value TEXT NOT NULL CHECK (char_length(contact_value) <= 50),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trusted_contacts_card_id ON trusted_contacts(card_id);
CREATE INDEX idx_trusted_contacts_caregiver_id ON trusted_contacts(caregiver_id);
CREATE UNIQUE INDEX one_primary_contact_per_card ON trusted_contacts(card_id) WHERE is_primary = TRUE;

-- ============================================
-- 3. Scan Logs Table
-- ============================================
CREATE TABLE scan_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES care_cards(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT
);

CREATE INDEX idx_scan_logs_card_id ON scan_logs(card_id);
CREATE INDEX idx_scan_logs_scanned_at ON scan_logs(scanned_at);

-- ============================================
-- 4. Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE care_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

-- ======== CARE CARDS ========

-- Caregivers can manage their own cards
CREATE POLICY "Caregivers can read own cards"
  ON care_cards FOR SELECT
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can create own cards"
  ON care_cards FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can update own cards"
  ON care_cards FOR UPDATE
  USING (auth.uid() = caregiver_id)
  WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can delete own cards"
  ON care_cards FOR DELETE
  USING (auth.uid() = caregiver_id);

-- NOTE: Direct SELECT on care_cards is disabled for public (anon) roles.
-- Public scan retrieval is routed securely through RPC (get_public_profile).

-- ======== TRUSTED CONTACTS ========

-- Caregivers can manage their own contacts
CREATE POLICY "Caregivers can read own contacts"
  ON trusted_contacts FOR SELECT
  USING (auth.uid() = caregiver_id);

-- Secure contact creation: ensure caregiver owns the target card
CREATE POLICY "Caregivers can create own contacts"
  ON trusted_contacts FOR INSERT
  WITH CHECK (
    auth.uid() = caregiver_id AND
    EXISTS (
      SELECT 1 FROM care_cards
      WHERE care_cards.id = card_id
      AND care_cards.caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can update own contacts"
  ON trusted_contacts FOR UPDATE
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can delete own contacts"
  ON trusted_contacts FOR DELETE
  USING (auth.uid() = caregiver_id);

-- NOTE: Direct SELECT on trusted_contacts is disabled for public (anon) roles.
-- Public contact retrieval is routed securely through RPC (get_public_contacts).

-- ======== SCAN LOGS ========

-- Caregivers can read scan logs for their own cards
CREATE POLICY "Caregivers can read own card scan logs"
  ON scan_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM care_cards 
      WHERE care_cards.id = scan_logs.card_id 
      AND care_cards.caregiver_id = auth.uid()
    )
  );

-- NOTE: Direct INSERT on scan_logs is disabled for public (anon) roles.
-- Public scan logging is routed securely through RPC (log_card_scan).

-- ============================================
-- 5. Updated_at Trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER care_cards_updated_at
  BEFORE UPDATE ON care_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. Secure Server-Side RPC Functions
-- ============================================

-- A. Secure Public Profile Retrieval
-- Server-side projection: only outputs enabled fields and never exposes caregiver_id or tokens.
CREATE OR REPLACE FUNCTION public.get_public_profile(p_token text)
RETURNS TABLE (
  display_name text,
  preferred_language text,
  accessibility_info text,
  approximate_area text,
  custom_instructions text,
  status text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE WHEN show_display_name THEN cc.display_name ELSE NULL END,
    CASE WHEN show_language THEN cc.preferred_language ELSE NULL END,
    CASE WHEN show_accessibility THEN cc.accessibility_info ELSE NULL END,
    CASE WHEN show_area THEN cc.approximate_area ELSE NULL END,
    CASE WHEN show_instructions THEN cc.custom_instructions ELSE NULL END,
    cc.status
  FROM care_cards cc
  WHERE cc.public_token = p_token AND cc.status = 'active'
  LIMIT 1;
END;
$$;

-- B. Secure Public Contacts Retrieval
-- Only exposes contacts if the card is active and the secure public_token matches.
DROP FUNCTION IF EXISTS public.get_public_contacts(text);
CREATE OR REPLACE FUNCTION public.get_public_contacts(p_token text)
RETURNS TABLE (
  contact_name text,
  relationship text,
  contact_method text,
  is_primary boolean
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.contact_name,
    tc.relationship,
    tc.contact_method,
    tc.is_primary
  FROM trusted_contacts tc
  JOIN care_cards cc ON cc.id = tc.card_id
  WHERE cc.public_token = p_token AND cc.status = 'active' AND tc.is_verified = TRUE
  ORDER BY tc.is_primary DESC;
END;
$$;

-- C. Secure Scan Logger
-- Sanitizes inputs, confirms the card exists and is active, and writes the log.
CREATE OR REPLACE FUNCTION public.log_card_scan(p_token text)
RETURNS void 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_card_id UUID;
BEGIN
  SELECT id INTO v_card_id 
  FROM care_cards 
  WHERE public_token = p_token AND status = 'active';
  
  IF v_card_id IS NOT NULL THEN
    INSERT INTO scan_logs (card_id) VALUES (v_card_id);
  END IF;
END;
$$;


-- D. Cascading Account Deletion
-- Allows authenticated users to trigger deletion of their profile which cascades to all tables.
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Cascading deletes will trigger on care_cards, trusted_contacts, and scan_logs
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

-- E. Purge Old Scan Logs
-- Automatically purges logs older than 30 days to enforce data-retention privacy.
CREATE OR REPLACE FUNCTION public.purge_old_scan_logs()
RETURNS integer
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM scan_logs
  WHERE scanned_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- --------------------------------------------
-- 7. Grant execution permissions
-- --------------------------------------------
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_contacts(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_card_scan(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.purge_old_scan_logs() FROM authenticated, anon, public;


