-- ============================================
-- CareCard Security Hardening Update
-- Run this in the Supabase SQL Editor
-- ============================================

-- --------------------------------------------
-- 1. CLEAN UP EXPLAINED VULNERABLE POLICIES
-- --------------------------------------------

-- Drop old broad public read/insert policies
DROP POLICY IF EXISTS "Public can read active cards by token" ON care_cards;
DROP POLICY IF EXISTS "Public can read contacts for active cards" ON trusted_contacts;
DROP POLICY IF EXISTS "Anyone can create scan logs" ON scan_logs;
DROP POLICY IF EXISTS "Caregivers can create own contacts" ON trusted_contacts;

-- --------------------------------------------
-- 2. TIGHTEN REMAINING RLS POLICIES
-- --------------------------------------------

-- A. Care Cards
-- Caregivers can manage their own cards (fully restricted to authenticated owners)
-- No public SELECT allowed on care_cards table directly.
ALTER TABLE care_cards ENABLE ROW LEVEL SECURITY;

-- B. Trusted Contacts
-- Fix authorization flaw: Caregivers can only insert contacts into cards they actually own
CREATE POLICY "Caregivers can create own contacts"
  ON trusted_contacts FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = caregiver_id AND
    EXISTS (
      SELECT 1 FROM care_cards
      WHERE care_cards.id = card_id
      AND care_cards.caregiver_id = auth.uid()
    )
  );

-- C. Scan Logs
-- Prevent arbitrary log forging. Restrict table insertion to internal/authenticated only
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

-- D. Database Constraints & Integrity
CREATE UNIQUE INDEX IF NOT EXISTS one_primary_contact_per_card 
  ON trusted_contacts(card_id) WHERE is_primary = TRUE;

-- Caregivers can read scan logs for their own cards (already configured)
-- Public scan insertion is disabled on the table directly. Will use RPC instead.


-- --------------------------------------------
-- 3. SECURE SERVER-SIDE RPC FUNCTIONS
-- --------------------------------------------

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
SECURITY DEFINER -- executes with creator (owner) privilege to bypass public select restrictions
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
-- 4. REVOKE PUBLIC EXECUTE PRIVILEGES
-- --------------------------------------------
-- Keep access to functions secure (restricted to public calls but prevented from table modifications)

-- Revoke default public execution where necessary
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_contacts(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_card_scan(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.purge_old_scan_logs() FROM authenticated, anon, public;


