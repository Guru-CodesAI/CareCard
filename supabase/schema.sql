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

-- Caregivers can read their own cards
CREATE POLICY "Caregivers can read own cards"
  ON care_cards FOR SELECT
  USING (auth.uid() = caregiver_id);

-- Caregivers can create their own cards
CREATE POLICY "Caregivers can create own cards"
  ON care_cards FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

-- Caregivers can update their own cards
CREATE POLICY "Caregivers can update own cards"
  ON care_cards FOR UPDATE
  USING (auth.uid() = caregiver_id)
  WITH CHECK (auth.uid() = caregiver_id);

-- Public can read active cards by token (limited fields enforced at application layer)
-- This allows the scan page to work without authentication
CREATE POLICY "Public can read active cards by token"
  ON care_cards FOR SELECT
  USING (status = 'active');

-- ======== TRUSTED CONTACTS ========

-- Caregivers can manage their own contacts
CREATE POLICY "Caregivers can read own contacts"
  ON trusted_contacts FOR SELECT
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can create own contacts"
  ON trusted_contacts FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can update own contacts"
  ON trusted_contacts FOR UPDATE
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can delete own contacts"
  ON trusted_contacts FOR DELETE
  USING (auth.uid() = caregiver_id);

-- Public can read contacts for active cards (for contact action on scan page)
-- NOTE: In production, this should go through an Edge Function to avoid exposing raw contact data
CREATE POLICY "Public can read contacts for active cards"
  ON trusted_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM care_cards 
      WHERE care_cards.id = trusted_contacts.card_id 
      AND care_cards.status = 'active'
    )
  );

-- ======== SCAN LOGS ========

-- Anyone can insert scan logs
CREATE POLICY "Anyone can create scan logs"
  ON scan_logs FOR INSERT
  WITH CHECK (true);

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

-- ============================================
-- 5. Updated_at trigger
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
