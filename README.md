# CareCard

### A small card. A safer connection.

> **CareCard is a privacy-first digital assistance card that helps people safely reconnect vulnerable individuals with trusted contacts.** A caregiver creates a secure CareCard, the card holder carries its QR code, and a helper can scan it without installing an app to access limited assistance information and contact a trusted person.

**Alternative tagline:** *If I can't explain who I am, my CareCard can help.*

---

## 🧩 Problem

Ordinary identification cards often expose too much personal information. Smartphone-based emergency apps fail when:

- Phone is lost or battery is dead
- The person doesn't know how to use it
- The app isn't installed
- The phone is locked or offline
- The person cannot communicate easily

CareCard provides a middle layer: **Physical card → Secure QR → Privacy-controlled online profile → Trusted contact.**

---

## 💡 Solution

CareCard is a zero-friction, privacy-first assistance system:

1. **Create** — A caregiver creates a secure digital CareCard
2. **Carry** — The card holder carries a printed QR card
3. **Reconnect** — A helper scans the QR and contacts a trusted person

No app installation required for helpers. No technical knowledge required for card holders.

---

## 👥 Target Users

| Role | Description |
|------|-------------|
| **Caregiver** | Family member, parent, guardian — creates and manages CareCards |
| **Card Holder** | Elderly person, child, person with accessibility needs, traveler, student |
| **Helper** | Stranger, staff, security guard, volunteer — scans QR to help |

---

## ✨ Key Features

### P0 — Core (Must Work)
- ✅ Secure authentication (email/password)
- ✅ CareCard creation with step-by-step wizard
- ✅ Supabase database with RLS policies
- ✅ Cryptographically secure QR generation (no PII in QR)
- ✅ Public scan page (no login required for helpers)
- ✅ Privacy-first information filtering (caregiver controls visibility)
- ✅ Trusted contact system with phone/email
- ✅ Card deactivation & QR regeneration
- ✅ Responsive mobile-first UI
- ✅ Printable physical CareCard

### P1 — High Value
- ✅ Multilingual support (English, Tamil, Hindi)
- ✅ Language assistance phrases for helpers
- ✅ Scan activity logging
- ✅ Accessibility-first design (large targets, high contrast, semantic HTML)
- ✅ Multiple trusted contacts with fallback

### P2 — Optional (Architecture Ready)
- 🔲 Temporary location sharing (15/30/60 min)
- 🔲 AI translation via Edge Function
- 🔲 PWA installation
- 🔲 Analytics dashboard

---

## 🔄 User Workflow

```
CAREGIVER → SIGN UP → CREATE CARECARD → ADD TRUSTED CONTACTS
    ↓
SET PUBLIC/PRIVATE FIELDS → GENERATE SECURE QR → PRINT/CARRY
    ↓
PERSON NEEDS HELP → HELPER SCANS QR → VIEW SAFE PROFILE
    ↓
CONTACT TRUSTED PERSON → OPTIONAL LANGUAGE HELP → FAMILY RECONNECTS
```

---

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│   Frontend   │────▶│   Supabase   │────▶│   PostgreSQL   │
│  React/Vite  │     │   Auth/API   │     │    + RLS       │
│  TypeScript  │     │              │     │                │
└─────────────┘     └──────────────┘     └────────────────┘
       │
       │  QR Scan
       ▼
┌─────────────┐
│  Public Scan │  ← No auth required
│    Page      │  ← Minimal data only
└─────────────┘
```

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| QR Generation | qrcode (npm) |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Security | Row Level Security, crypto.getRandomValues |
| Deployment | Vercel (frontend), Supabase (backend) |

---

## 🗃 Database Structure

### `care_cards`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| caregiver_id | UUID | FK to auth.users |
| public_token | TEXT | Cryptographically random, used in QR URL |
| display_name | TEXT | Card holder's display name |
| preferred_language | TEXT | Language code (en, ta, hi...) |
| accessibility_info | TEXT | Accessibility needs description |
| status | TEXT | active / inactive / deactivated |
| show_* | BOOLEAN | Privacy toggles for each field |

### `trusted_contacts`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| card_id | UUID | FK to care_cards |
| contact_name | TEXT | Trusted person's name |
| relationship | TEXT | e.g., "Son", "Daughter" |
| contact_method | TEXT | phone / email |
| contact_value | TEXT | Phone number or email |
| is_primary | BOOLEAN | Primary contact flag |

### `scan_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| card_id | UUID | FK to care_cards |
| scanned_at | TIMESTAMPTZ | Scan timestamp |

---

## 🔒 Security Model

### QR Security
- QR contains **only** an opaque random token (64 hex characters)
- No PII (phone, address, email, medical info) encoded in QR
- Tokens are cryptographically random (`crypto.getRandomValues`)
- Tokens are revocable and regenerable
- Old tokens become immediately invalid on regeneration

### Row Level Security
- Caregivers can only access their own cards and contacts
- Public scanners can only see active cards with privacy-filtered fields
- Scan logs are write-only for public, read-only for card owners

### Privacy Controls
- Each field has an individual public/private toggle
- Private data (raw contact values, phone numbers, emails, addresses) is never returned or exposed to public endpoints or browser network logs
- Privacy-by-default: most sensitive fields start as hidden

### Input Security
- All user input sanitized (HTML stripped, length-limited)
- Client-side rate limiting on scan page
- No raw HTML rendering of user content

---

## 🔐 Threat Model

| # | Threat | Mitigation |
|---|--------|------------|
| 1 | Token guessing | Cryptographically random 64-char hex tokens |
| 2 | Token enumeration | Opaque IDs, client-side rate limiting |
| 3 | QR cloning | Revocation + token regeneration |
| 4 | Data scraping | Minimum public data + rate limiting |
| 5 | Stalking | No public location, minimal profile |
| 6 | Account takeover | Supabase Auth + email verification |
| 7 | Unauthorized modification | RLS policies on all tables |
| 8 | Malicious scanner | Private info never exposed publicly |
| 9 | Database leakage | RLS + least privilege + no sensitive fields in public queries |
| 10 | Abuse/spam | Rate limiting + input validation |

---

## ⚠️ Known Limitations

1. **Offline:** QR scan requires internet. Physical card can include minimal printed info.
2. **Contact privacy:** Contact destinations are fully hidden. The public RPC does not return contact values; instead, the frontend simulates a secure server-side relay proxy call and proxy email redirect.
3. **Demo mode:** To prevent accidental open deployment, demo mode requires an explicit VITE_DEMO_MODE=true environment variable when Supabase keys are absent.
4. **No MFA:** Optional MFA is architecturally planned but not implemented in the MVP.
5. **No server-side rate limiting:** Current rate limiting is client-side only. Production needs Supabase Edge Function rate limiting.

---

## 🚀 Future Improvements

- [ ] Supabase Edge Function for privacy-preserving contact relay
- [ ] Temporary location sharing (15/30/60 min)
- [ ] AI-powered translation via Edge Function
- [ ] PWA with offline card caching
- [ ] MFA for sensitive caregiver actions
- [ ] Server-side rate limiting
- [ ] Email/SMS notification on card scan
- [ ] Photo upload with Supabase Storage
- [ ] Card sharing with multiple caregivers
- [ ] QR NFC integration

---

## 📦 Installation

```bash
# Clone the repository
git clone <repo-url>
cd carecard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# (Optional) Configure Supabase
# Edit .env with your Supabase URL and anon key
# Run supabase/schema.sql in Supabase SQL Editor

# Start development server
npm run dev
```

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | For production |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | For production |

> **⚠️ Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend code.**

Without environment variables, the app will fail-closed in production unless VITE_DEMO_MODE=true is explicitly set in development.

---

## 🌐 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Backend (Supabase)
1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy the project URL and anon key to `.env`

---

## 🎮 Demo Flow

1. Open the app → Landing page
2. Click "Create CareCard" → Sign up
3. Follow the 3-step wizard (Name → Contacts → Privacy)
4. View the generated QR code
5. Open the QR scan URL in another tab/device
6. See the public profile with limited, safe information
7. Click "Contact Trusted Person" → Contact action
8. Try "Help With Language" → Quick Tamil phrases
9. Go back to dashboard → Deactivate card
10. Scan the QR again → "Card Deactivated" message
11. Reactivate → Regenerate QR → Old QR stops working

---

## ⚡ Important Disclaimers

> **CareCard is not an emergency service, medical system, identity-verification service, or continuous tracking system.**

> CareCard is a communication aid and does not replace emergency services. If someone is in immediate danger or requires urgent medical assistance, contact the appropriate local emergency service.

---

Built for **Hack Devengers 1.0** 🚀
