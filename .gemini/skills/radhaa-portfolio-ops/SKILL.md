---
name: radhaa-portfolio-ops
description: Operational Standard Operating Procedures (SOP) for managing, updating, and deploying the Radhaa Dudeja celebrity anchor portfolio. Covers media synchronization via Google Drive, calendar date holds, SEO content updates, lead pipeline management, and outbound automation webhooks (Zapier, Make.com, Slack).
---

# Radhaa Dudeja Portfolio Operations Skill

This skill provides comprehensive operational instructions for autonomous AI agents and engineers managing the official web platform of **Radhaa Dudeja** (Premier Anchor & Corporate Emcee).

---

## 1. Brand Guidelines & Identity Rules

- **Spelling**: The artist's name is strictly **Radhaa Dudeja** (double 'a' in Radhaa). Never use single 'a' in any user-facing text, SEO tag, or metadata.
- **Portals Separation**:
  - `/` (Home): The Grand Gateway with dual cinematic portals, brand marquee, and horizontal Netflix rails.
  - `/corporate`: Strictly dedicated to Corporate Tech Summits, Annual Galas, Leadership Offsites, and CXO Firesides.
  - `/weddings`: Strictly dedicated to Luxury Royal Sangeets, Haldi Fiestas, Family Games, and Royal Varmalas.
  - `/blog`: High-ranking SEO playbooks, anchoring masterclasses, and event guides.
  - `/admin`: Unified command center with Google Drive sync, Google Calendar, Leads CRM, SEO Content Editor, and Connectors Hub.
- **Terminology Rule**: Never use the internal technical word "vertical" or "verticals" in visible customer-facing copy. Use "Portals", "Showcases", "Ceremonies", or "Stage Formats".

---

## 2. Lead Generation & CRM Operations

- **Storage**: Inquiries are stored in `localStorage` (`radhaa_leads_crm_v1`) and dispatched to outbound webhooks.
- **Sources**:
  - `direct_form`: Submitted via the booking form on `/`, `/corporate`, or `/weddings`.
  - `price_estimator`: Created when an event producer locks an estimate in `StagePriceEstimator.tsx`.
  - `rfp_download`: Created when an executive downloads a tailored proposal via `RfpDeckGenerator.tsx`.
  - `calendar_hold`: Created when a client selects and reserves an open date slot on `GoogleCalendarBooking.tsx`.
- **Status Progression**:
  `new` ➔ `contacted` ➔ `proposal_sent` ➔ `confirmed` ➔ `archived`.
- **Action Protocols**:
  - Always respond via WhatsApp using the 1-click URL format:
    `https://wa.me/{clean_phone}?text={encoded_message}`.
  - Export CSVs weekly using `exportLeadsToCSV()` from `src/lib/leads.ts`.

---

## 3. Connectors & Outbound Webhooks

- Configured via `src/lib/outboundWebhooks.ts` and managed in Admin tab: **Connectors & Automations Hub**.
- **Supported Integrations**:
  - **Zapier**: Catch Hook endpoint to sync new leads into Google Sheets, Airtable, or Notion.
  - **Make.com (Integromat)**: Scenario webhook to trigger SMS alerts or CRM sync.
  - **Slack**: Incoming webhook URL to post alerts in `#stage-bookings`.
- **Event Schema**:
  ```json
  {
    "event": "lead.created",
    "artist": "Radhaa Dudeja",
    "website": "https://radhaadudeja.com",
    "timestamp": "2026-09-25T06:20:00.000Z",
    "data": {
      "leadId": "lead-2026-001",
      "clientName": "Vikram Singhania",
      "organization": "Singhania Family Estate",
      "email": "vikram@singhaniagroup.in",
      "phone": "+91 98200 45112",
      "eventType": "Luxury Royal Sangeet",
      "eventDate": "2026-11-18",
      "city": "Udaipur",
      "budgetTier": "₹3,50,000 - ₹5,00,000"
    }
  }
  ```

---

## 4. Live Visual Content Editor ("Connectent Change Tools")

- Activated globally on any page via the floating bottom pill: **"Visual Content Editor"**.
- Default passcode: `radhaa2026` or `ATMOSPHERE_2026`.
- Persists changes locally to `useSiteContent()` and triggers a `content.updated` outbound webhook.
- Can export content as JSON (`radhaa_site_copy_YYYY-MM-DD.json`) or revert to default copy with 1 click.

---

## 5. Google Calendar & Availability Sync

- Calendar holds are visualized in `GoogleCalendarBooking.tsx`.
- Supports 1-click **Add to Google Calendar** (`calendar.google.com/calendar/render?action=TEMPLATE&...`) and native `.ics` file generation for Outlook and Apple Calendar.
- Settings configured in Admin:
  - `google_calendar_url`: Direct public appointment scheduling link.
  - `google_calendar_id`: Target calendar identifier for API sync.
  - `google_drive_folder_url`: Cloud storage folder for media ingestion.

---

## 6. Build & Deployment Verification Checklist

Always run the following commands before publishing or deploying:
```bash
# 1. Typecheck and build bundle
npm run build

# 2. Check git branch and clean state
git status

# 3. Push to main branch
git push origin main
```
The bundle must compile in under 3 seconds with 0 syntax or JSX entity errors.
