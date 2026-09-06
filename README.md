<div align="center">

# 🎴 CareCard

### **Privacy-First QR Emergency Contact Card — A small card. A safer connection.**

[![Security Verification](https://img.shields.io/badge/Security-Hardened-success?style=for-the-badge&logo=securityscorecard&logoColor=white)](https://github.com/Guru-CodesAI/CareCard)
[![Database](https://img.shields.io/badge/Database-Supabase%20%2B%20Postgres-blue?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Platform](https://img.shields.io/badge/Vite-React%20%2B%20TS-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://care-card-three.vercel.app)

<p align="center" style="max-width: 600px; font-size: 1.1rem; line-height: 1.6; color: #4B5563;">
  <strong>CareCard is an open-source, privacy-first QR emergency contact card and safety assistance ecosystem.</strong> It enables caregivers to create secure physical QR cards that reconnect vulnerable individuals—such as elderly citizens, children, and people with accessibility needs—with their families safely and without exposing private personal details.
</p>

*“If I can’t explain who I am, my CareCard can help.”*

---

[✨ Key Features](#-key-features) • [🛡️ Security Model](#-security-model) • [🏗️ Technical SEO & Architecture](#-technical-seo--architecture) • [🚀 Quick Start](#-quick-start) • [🎮 Demo Flow](#-demo-flow)

</div>

---

## 🎯 Target SEO & Discoverability Cluster
For developers, recruiters, and search indexers, CareCard is optimized around the following keywords:
* **Primary:** `privacy-first QR emergency contact card`
* **Secondary:** `senior citizen safety card`, `digital emergency contact card`, `QR safety card`, `elderly emergency QR card`, `accessibility safety assistance`
* **GitHub Topics:** `react`, `typescript`, `supabase`, `postgres-rls`, `emergency-card`, `privacy-by-design`, `qr-code-generator`, `seo-optimization`, `structured-data-json-ld`, `accessibility-tools`

---

## 🧩 The Challenge

Traditional emergency contact cards often expose too much personal information. Conversely, complex smartphone apps fail when:
- 🔋 The battery dies or the phone is lost.
- 📱 The screen is locked or has no network connection.
- ⚙️ The user is disoriented and cannot navigate a digital UI.

CareCard bridges this gap by combining **physical simplicity with digital privacy control**:

```
[ Physical QR Card ]  ──▶  [ Opaque Bearer Token ]  ──▶  [ Secure Public Profile ]
                                                                 │
                                                                 ▼
                                                  [ Contact Name & Relationship Shown ]
                                                  [ Raw phone/email NOT sent to browser ]
```

> **MVP Note:** This deployment does not initiate phone calls or emails. The scan page shows the trusted contact's name and relationship so a helper knows who to reach. A production communication relay (e.g. Twilio, SendGrid) would be required to place calls or send messages server-side without exposing contact values to the browser.

---

## ✨ Key Features

### 🛡️ Core Security & Privacy
* **Zero-PII QR Codes:** QR codes only embed a cryptographically secure random token. No phone numbers, names, or addresses are printed or stored within the barcode itself.
* **Server-Side Protection:** Strictly isolated public views. The frontend only receives masked/sanitized data profiles.
* **Granular Visibility Control:** Caregivers can toggle visibility for display names, preferred languages, custom instructions, and approximate areas at any time.
* **One-Click Deactivation:** Lost your card? Instantly deactivate it or regenerate the QR. Old QR codes become immediately invalid.

### 🌐 Assistant Tools (Helper View)
* **Contact Assistance (MVP Demo):** Displays the trusted contact's name and relationship, retrieved via server-side RPCs. Raw contact values (phone numbers, emails) are **not** returned by the public RPC. This deployment does not initiate calls or emails. A future production release may include a server-side communication relay to enable helpers to reach caregivers without any contact details being exposed in the browser.
* **Multilingual Support:** Supports English, Tamil, and Hindi.
* **Language Assistance Cards:** Provides instant translation cards to help strangers communicate basic assistance phrases with the cardholder.
* **Scan Auditing:** Real-time log tracking for caregivers to see when and how many times a card was scanned.

---

## 🏗️ Technical SEO & Architecture

CareCard features a production-ready SEO architecture designed to crawl public marketing assets while protecting private user profiles.

### 🚀 Search Discovery & Page Optimization
* **JSON-LD Structured Data:** Embeds microdata schemas for both `WebApplication` (defining product utility) and `FAQPage` (matching direct user queries).
* **Canonical Targeting:** Employs `<link rel="canonical" />` tags to enforce single-domain indexing across landing pages.
* **Crawler Privacy Safeguards:** Dynamic profile pages (`/scan/:token`) execute client-side mount hooks that inject `<meta name="robots" content="noindex, nofollow" />`. This ensures personal profile pages are never harvested by crawlers.
* **XML Sitemap & Robots.txt:** Configured via `public/sitemap.xml` and `public/robots.txt` to whitelist marketing entry points while blocking indexation of internal profile parameters.

### ⚙️ Core Application Stack
```
                  ┌──────────────────────┐
                  │      React App       │
                  │   Vite + TypeScript  │
                  └──────────────────────┘
                             │
                             ▼  (Secure RPCs Only)
                  ┌──────────────────────┐
                  │    Supabase BaaS     │
                  │  Auth, REST API, RLS │
                  └──────────────────────┘
                             │
                             ▼  (Database Constraints)
                  ┌──────────────────────┐
                  │      PostgreSQL      │
                  │ Triggers & Functions │
                  └──────────────────────┘
```

---

## 🛡️ Security Hardening (PostgreSQL + RLS)

We have taken CareCard through extensive defensive auditing and implemented a strict, production-ready security architecture:

### 1. Row Level Security (RLS) Boundaries
* Direct public reads on `care_cards`, `trusted_contacts`, and `scan_logs` are **strictly blocked**.
* Caregivers can only perform CRUD operations on records they own (`auth.uid() = caregiver_id`).
* The **UPDATE** policy on `trusted_contacts` prevents cross-card IDOR manipulation via target `card_id` checking:
  ```sql
  WITH CHECK (
    auth.uid() = caregiver_id AND
    EXISTS (
      SELECT 1 FROM care_cards
      WHERE care_cards.id = card_id AND care_cards.caregiver_id = auth.uid()
    )
  )
  ```

### 2. Immutable Security Fields (Triggers)
We enforce security invariants using a BEFORE UPDATE database trigger (`protect_contact_security_fields`). It prevents clients from:
* Changing the `caregiver_id` of a contact.
* Moving a contact to an unauthorized card.
* Elevating `is_verified` or modifying verification states directly.

### 3. Server-Side Rate Limiting
To prevent scan logging abuse, the PostgreSQL function `log_card_scan(p_token text)` limits requests to **20 scans/minute per card** using a server-side window:
```sql
SELECT COUNT(*) INTO v_recent_count
FROM scan_logs
WHERE card_id = v_card_id AND scanned_at > NOW() - INTERVAL '1 minute';

IF v_recent_count >= 20 THEN
  RAISE EXCEPTION 'Rate limit exceeded' USING ERRCODE = 'P0001';
END IF;
```

### 4. Least Privilege Access Controls
All database RPCs run under `SECURITY DEFINER` with search path containment (`SET search_path = public, pg_temp`). Public execution privileges are revoked by default and granted explicitly:
* `get_public_profile` & `get_public_contacts` $\rightarrow$ Allowed for `anon, authenticated`.
* `delete_user_account` $\rightarrow$ Allowed for `authenticated` only.
* `purge_old_scan_logs` $\rightarrow$ **Blocked** for all users (executed via background worker).

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase Account

### Setup

```bash
# Clone the repository
git clone https://github.com/Guru-CodesAI/CareCard.git
cd CareCard

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Migration
1. Go to your **Supabase Dashboard** $\rightarrow$ **SQL Editor**.
2. Create a **New Query**, copy the contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.

### Start Development Server
```bash
npm run dev
```

---

## 🎮 Demo Flow

Follow this workflow to test the entire application:

1. **Dashboard & Auth:** Sign up as a Caregiver.
2. **Create Card:** Click **Create CareCard** and follow the step-by-step wizard. Add contacts (e.g. Son, Daughter) and configure your public privacy toggles.
3. **QR Generation:** View your new card. Download or click **Preview** to simulate scanning.
4. **Public Profile (Helper View):** You will be redirected to the secure scan page. View trusted contacts and language assistance cards. The **Contact Assistance** section explains that this MVP shows contact information; a production release may add a server-side relay for additional privacy.
5. **Logs & Auditing:** Return to your dashboard. Under **Scan Activity**, you will see the scan recorded instantly.
6. **Card Reactivation:** Click **Deactivate Card** and scan the old QR code $\rightarrow$ Access is immediately denied.
7. **Regenerate QR:** Reactivate your card and click **Regenerate QR** $\rightarrow$ A new secure token is created, and the old QR is permanently invalidated.

---

## ⚡ Important Disclaimers

> [!WARNING]
> **CareCard is not a replacement for emergency services.**
> If the cardholder is in immediate danger or requires urgent medical attention, contact the appropriate local emergency service (e.g. 911 / 100) immediately.

> [!NOTE]
> **MVP Architecture:** This is a minimum viable product (MVP) demonstrating the core QR security and contact architecture. Trusted contacts are retrieved via secure server-side RPCs and displayed to helpers. A future production release may include a server-side communication relay to further enhance privacy by preventing direct exposure of contact details.

---

Built with 🤍 by **GURUNATHAN V** 🚀

