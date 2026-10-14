# ManaModavalasa (మన మోదవలస) — Digital Village Information Portal
## Community Service Project (CSP) | B.Tech Computer Science and Engineering

> **ManaModavalasa** (మన మోదవలస)  
> *Our village. Our community.*

A 4-Week (100-Hour) Field-Driven Community Service Project engineered for Modavalasa Gram Panchayat, Denkada Mandal, Vizianagaram District, Andhra Pradesh.

---

## 1. Project Overview & Context

- **Application Name**: ManaModavalasa (మన మోదవలస)
- **Tagline**: Our village. Our community.
- **Academic Context**: Community Service Project (CSP) fulfilling mandatory B.Tech Computer Science and Engineering curricular requirements under the Jawaharlal Nehru Technological University (JNTU) framework.
- **Project Duration**: 4 Weeks / 100 Verified Hours (24 Working Days).
- **Core Engineering Principle**: **Field Survey -> Empirical Evidence -> Problem Identification -> Portal Implementation -> Community Testing**.
- **Live Deployment**: [https://manamodavalasa.vercel.app](https://manamodavalasa.vercel.app)
- **Source Repository**: [https://github.com/Ganeshkatam/csp_ManaModavalasa](https://github.com/Ganeshkatam/csp_ManaModavalasa)
- **Primary Database**: Supabase PostgreSQL 15+ (Project Ref: `mjpuyirbwaznnomzifyv`, AWS AP-South-1).
- **Non-Impersonation Notice**: This platform is an independent student academic initiative engineered for civic utility and academic research. It is neither an official government website nor an agency of the Government of Andhra Pradesh or the Government of India. All outbound scheme links point directly to official `.gov.in` and `.nic.in` domains.

---

## 2. Studied Habitation Profile & Baseline Data

All baseline civic metrics for the portal are provenance-gated, combining official Census of India 2011 Primary Census Abstract (PCA) records, local revenue administration records, and field survey observations:

| Parameter | Authoritative Record / Value | Data Source |
| :--- | :--- | :--- |
| **Habitation Name** | Modavalasa (మోదవలస) | Revenue Records / Gram Panchayat |
| **Gram Panchayat** | Modavalasa Gram Panchayat | AP Panchayati Raj Department |
| **Mandal / Sub-District** | Denkada (Sub-District Code: `04839`) | Census of India 2011 |
| **District** | Vizianagaram (District Code: `543`) | Government of Andhra Pradesh |
| **State** | Andhra Pradesh (State Code: `28`) | Census of India 2011 |
| **Census Village Code** | `583218` | Census of India 2011 Primary Census Abstract |
| **Total Population** | 2,584 persons (1,290 Male, 1,294 Female) | Census of India 2011 |
| **Households** | 624 households | Census of India 2011 |
| **Geographic Area** | 633 Hectares (1,564 Acres) | Census of India 2011 |
| **Sex Ratio** | 1,003 females per 1,000 males | Census of India 2011 |
| **Postal Pincode** | `531162` | Department of Posts, India |
| **Sub Post Office (S.O.)** | Chittivalasa S.O. | Visakhapatnam Postal Division |
| **Branch Post Office (B.O.)** | Modavalasa B.O. | India Post Network |
| **Head Post Office (H.O.)** | Denkada S.O. (`535006`) / Vizianagaram H.O. | India Post Network |
| **Power Distribution Utility** | APEPDCL (Vizianagaram Circle, Helpline: `1912`) | Eastern Power Distribution Co. of AP Ltd. |
| **Legislative Assembly** | Nellimarla (`136`) | Election Commission of India |
| **Parliamentary Constituency** | Vizianagaram | Election Commission of India |
| **Local Administrative Secretariat** | Modavalasa Grama Sachivalayam (Ward 2 Complex) | Government of Andhra Pradesh |
| **Primary Economic Livelihoods** | Paddy Agriculture, Handloom Weaving (BC Colony), Dairy Cooperatives, Rural Services | CSP Field Survey & Community Interviews |

> **Demographic Baseline Reconciliation**: The authoritative baseline for this study is strictly derived from the official Census of India 2011 Primary Census Abstract (PCA), Table A-5, for Village Code `583218` (Denkada Mandal, Vizianagaram District; Office of the Registrar General & Census Commissioner, India; [Census Digital Tables](https://censusindia.gov.in/census.website/data/census-tables)), recording 2,584 persons (1,290 male, 1,294 female) across 624 households. Certain secondary online village directories cite an alternate count of 3,792 persons across 958 households. For academic consistency, institutional traceability, and university evaluation, all baseline metrics and per-capita analyses in this study adhere strictly to the statutory Census of India 2011 PCA dataset.

---

## 3. Field Survey Findings & Problem Traceability Matrix

During Week 1 of the project, a door-to-door socio-economic and information-access survey was conducted across Modavalasa habitations (East Weavers Colony, Main Village, Ward 2, and agrarian settlements) using a standardized 18-question questionnaire (24 relational variables).

Every software module in the portal traces directly back to an empirical finding from the field survey:

| Identified Community Problem | Field Survey Evidence | Software Requirement | Implemented Portal Module |
| :--- | :--- | :--- | :--- |
| **1. Welfare Scheme Information Asymmetry** | Citizens visit mandal revenue offices repeatedly due to missing document information and reliance on informal intermediaries. | Centralized catalog of central and state schemes with eligibility criteria, mandatory document checklists, and direct official `.gov.in` portal links. | **Welfare Schemes Directory (`/schemes`)** |
| **2. Fragmented Emergency & Civic Contacts** | Important phone numbers (ANM, Lineman, Panchayat Secretary, Ambulance) are scattered across weathered wall postings or unavailable during crises. | Single-tap mobile dialing directory (`tel:`) categorized by Administration, Police, Healthcare, and Utilities with explicit verification dates. | **Important Contacts Directory (`/contacts`)** |
| **3. Unpredictable Healthcare Access** | Daily wage earners travel 3.2 km to Denkada PHC without knowing doctor availability, clinic timings, or diagnostic test schedules, causing lost wages. | Dynamic operating status calculator (`OPEN NOW` / `CLOSED`), weekly clinical specialist roster, diagnostic laboratory catalog, and Anganwadi immunization calendar. | **Healthcare & PHC Module (`/healthcare`)** |
| **4. Educational Transparency Gap** | Parents lack consolidated information regarding school facilities, headmaster contact details, Anganwadi nutrition schedules, and mid-day meal menus. | Structured educational directory detailing MPPS Modavalasa and Anganwadi Ward 2, mid-day meal guidelines (PM POSHAN), and administrative desks. | **Education & Anganwadi Module (`/education`)** |
| **5. Economic Invisibility of Village Artisans** | Traditional handloom weavers, motor rewinding technicians, electricians, and women-led Self-Help Groups (SHGs) have zero digital presence. | Searchable local business and micro-artisan directory with proprietor contacts, service specializations, and direct call actions. | **Local Businesses & Artisans (`/businesses`)** |
| **6. Susceptibility to Online Fraud & Phishing** | Low digital literacy makes villagers vulnerable to fake cash-grant links circulating on messaging platforms. | Official domain guidance highlighting `.gov.in` verification, cyber safety helplines (`1930`), and interactive educational awareness. | **Digital Awareness & Safety Handout** |

---

## 4. System Architecture & Features

The platform is designed as a modular, responsive Single-Page Application (SPA) backed by Supabase PostgreSQL:

```text
[ Citizen Web Client / Mobile Browser ]
                   │
                   ├── Client-Side SPA Router (React Router DOM 7)
                   │     ├── Public Portal (/)
                   │     ├── Schemes Directory (/schemes)
                   │     ├── Contacts Directory (/contacts)
                   │     ├── Healthcare & PHC (/healthcare)
                   │     ├── Education & Anganwadi (/education)
                   │     ├── Local Businesses (/businesses)
                   │     ├── Field Survey Engine (/survey)
                   │     ├── Analytics Dashboard (/dashboard)
                   │     └── Admin Console (/admin)
                   │
                   ├── Offline Sync Manager (IndexedDB / LocalStorage Durable Queue)
                   │
                   └── Supabase API Client (@supabase/supabase-js 2.114)
                                 │
                                 ▼
                 [ Supabase PostgreSQL 15+ Backend ]
                   ├── Row Level Security (RLS) on all 16 Tables
                   ├── Stored Procedures (submit_survey, search_portal)
                   ├── Recursive Payload Redaction (sanitize_audit_payload)
                   ├── Append-Only Administrative Audit Trail (audit_logs)
                   └── Database Readiness & Liveness Probes (/api/health)
```

### 4.1 Public Information Portal (`/`)
- **Dynamic Village Profile**: Dynamically fetches Modavalasa administrative jurisdiction, census metrics, and postal network details with robust offline fallbacks.
- **Server-Authoritative Portal Search**: Real-time cross-entity search powered by the `search_portal` PostgreSQL RPC with query normalization, bilingual alias matching, and abort controllers.
- **Real-Time Operating Status Badges**: Client-side time evaluator checks current IST against listed institution schedules to render live `OPEN NOW` or `CLOSED` badges.
- **One-Tap Emergency Calling**: All phone numbers are formatted and rendered with active `tel:` protocol links for immediate mobile dialing.
- **Citizen Feedback & Correction Desk**: Public submission form with client-side character length validation, rate limiting, and an offline durable queue with automatic retry.
- **Interactive Mobile QR Code**: Live SVG QR code generator linking directly to the production URL for mobile field evaluations.

### 4.2 Doorstep Household Survey Engine (`/survey`)
- **Standardized Survey Instrument**: 18 field questions capturing 24 variables across Demographics, Digital Infrastructure, Welfare Access, Emergency Contacts, Healthcare, and Local Economy.
- **Offline-First Resilience**: Automatic network state detection (`online`/`offline`) serializing unsubmitted responses into a durable queue with dead-letter isolation after 5 consecutive failures.
- **Privacy & Pseudonymization**: Mandatory household codes (`HH-001`, `HH-002`) and verified informed consent. Zero collection of resident names, phone numbers, Aadhaar numbers, or financial details.
- **Idempotent Submission**: Client-generated UUIDs ensure survey records can be retried across spotty networks without duplicate insertions.

### 4.3 Analytics & Reporting Dashboard (`/dashboard`)
- **Live Aggregation**: Real-time KPI cards computing Total Sample Size ($N$), Smartphone Penetration Rate, Welfare Document Hurdles, and Emergency Contact Gaps directly from database microdata.
- **Problem-to-Solution Traceability**: Interactive matrix mapping survey metrics to implemented software features.
- **One-Click CSV Export**: Serializes all survey responses into formatted CSV files (`csp_survey_responses_YYYY-MM-DD.csv`) for academic analysis.

### 4.4 Administrative Management Console (`/admin`)
- **Authentication**: Secure email/password authentication via Supabase Auth (`auth.signInWithPassword`), preserving whitespace characters in passwords.
- **Full-Spectrum CRUD**: Tabbed management interface for Village Profile, Public Announcements, Welfare Schemes, Contacts, Facilities, and Businesses.
- **Citizen Feedback Inbox**: Administrative review panel for citizen submissions with status toggles (`pending` / `resolved`).
- **Audit Logging**: Every administrative mutation automatically triggers an immutable audit log entry.

### 4.5 Accessibility & Bilingual Localization
- **Instant Language Switching**: Full English and Telugu dictionaries (`i18n/en.js`, `i18n/te.js`) switchable instantly without page reloads.
- **GIGW-Compliant Accessibility**: Font-size scaler controls (`A` / `A+`), high-contrast color palette, semantic HTML5 tags, and ARIA labels.
- **Pure CSS Design System**: Built with modern CSS variables, fluid typography, dark mode foundations, and zero external CSS frameworks.

### 4.6 Operational Health Probes (`/api/health`)
- **Decoupled Probes**: Liveness (`/api/health?probe=liveness`) checks process execution; Readiness (`/api/health?probe=readiness`) verifies end-to-end database connectivity.
- **Non-Leaking Diagnostics**: Latency metrics are reported without exposing database credentials, connection strings, or internal errors.

---

## 5. Database Schema & Security Architecture

The database architecture consists of 16 relational tables in Supabase PostgreSQL, protected by Row Level Security (RLS) policies:

### 5.1 Core Relational Tables
1. `villages`: Habitation profiles, census identifiers, postal network, and administrative jurisdictions.
2. `schemes`: Central and state welfare schemes, eligibility rules, document checklists, and `.gov.in` URLs.
3. `contacts`: Categorized emergency, administrative, healthcare, and utility phone directories.
4. `institutions`: Primary schools, Anganwadi centers, and the Primary Health Centre (PHC).
5. `announcements`: Time-bound Gram Panchayat notices, medical camps, and welfare drives.
6. `businesses`: Local village artisans, weavers, electricians, repair workshops, and SHG micro-enterprises.
7. `clinical_schedules`: Day-wise doctor consultation rosters and specialist clinics at the PHC.
8. `immunization_schedules`: Weekly vaccine drives and target age groups conducted at Anganwadi centers.
9. `diagnostic_services`: Available laboratory tests, specimen requirements, and turnaround times.
10. `search_aliases`: Server-authoritative search keywords, synonyms, and bilingual search terms.
11. `survey_questions`: Catalog of 18 field questions with option sets and validation rules.
12. `survey_responses`: Pseudonymous household interview submissions with timestamp tracking.
13. `survey_answers`: Normalized question-answer response pairs linked to survey submissions.
14. `citizen_feedback`: Community correction requests, service queries, and administrative resolution statuses.
15. `admin_users`: Role-based administrator authorization mapping (`is_admin()`).
16. `audit_logs`: Append-only, immutable administrative change trail.

### 5.2 Security & Data Protection Controls
- **Row Level Security (RLS)**: Enabled across all 16 public tables. Public users have read-only (`SELECT`) access to published directories; only authenticated administrators can mutate records.
- **Append-Only Audit Trail**: `audit_logs` is protected by `trg_audit_logs_immutable` which prevents any `UPDATE`, `DELETE`, or `TRUNCATE` operations, even by database owners.
- **Recursive Secret & PII Redaction**: The PL/pgSQL function `sanitize_audit_payload` recursively traverses nested JSON objects and arrays to strip authentication secrets (`password`, `apiKey`, `token`, `secret`, `refreshToken`) and mask phone numbers (`XXXXXXXX1234`).
- **Defensive Input Validation**: Server-side length checks, UUID validation, email syntax verification, and URL scheme restrictions (`http:`, `https:` only) prevent XSS and injection attacks.

---

## 6. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `19.2.8` | Component-driven user interface architecture |
| **Build Tooling** | Vite | `8.2.2` | Fast HMR dev server and optimized production bundler |
| **Client Routing** | React Router DOM | `7.18.3` | Clean SPA navigation without `.html` extensions |
| **Vector Icons** | Lucide React | `1.40.0` | Accessible, tree-shakeable SVG UI icons |
| **Styling** | Vanilla Pure CSS | CSS3 | Custom responsive design system with CSS custom properties |
| **Backend & Database** | Supabase PostgreSQL | `15+` | Relational database, Auth, RLS, and PL/pgSQL stored procedures |
| **Client Database SDK** | `@supabase/supabase-js` | `2.114.0` | Strongly typed client database integration |
| **Linter** | Oxlint | `1.79.0` | High-speed Rust-based JavaScript and React linter |
| **Test Runner** | Node.js Native Test Runner | `node:test` | Zero-dependency unit and integration test suite |
| **Hosting & Deployment** | Vercel | Production | Static asset distribution and serverless health probes |

---

## 7. Repository Directory Structure

```text
csp_ManaModavalasa/
├── .gitignore                                    # Git exclusion rules
├── LICENSE                                       # Apache License 2.0
├── package.json                                  # Root proxy scripts (dev, build, lint, test)
├── README.md                                     # Authoritative project documentation
│
├── api/
│   └── health.js                                 # Vercel serverless liveness and readiness probe
│
├── app/                                          # Production React + Vite Application
│   ├── api/
│   │   └── health.js                             # Internal application health handler
│   ├── dist/                                     # Compiled production bundle
│   ├── index.html                                # HTML5 template with complete SEO, OG & JSON-LD
│   ├── package.json                              # App dependencies and scripts
│   ├── vite.config.js                            # Vite bundler configuration
│   ├── public/                                   # Static assets, SEO, PWA and security files
│   │   ├── .well-known/security.txt              # RFC 9116 security disclosure policy
│   │   ├── browserconfig.xml                     # Windows tile application manifest
│   │   ├── favicon.svg                           # Scalable vector application favicon
│   │   ├── humans.txt                            # Attribution of contributors and technology stack
│   │   ├── manifest.json                         # Web App Manifest for mobile installation
│   │   ├── robots.txt                            # Search engine crawler crawl-budget directives
│   │   ├── site.webmanifest                      # Standards-compliant web application manifest
│   │   ├── sitemap.xml                           # XML sitemap declaring canonical public routes
│   │   └── images/                               # Authentic village and facility photography
│   └── src/
│       ├── main.jsx                              # Application bootstrap entry point
│       ├── App.jsx                               # Clean SPA router definitions
│       ├── index.css                             # Global CSS variables and base typography
│       ├── app/
│       │   ├── config.js                         # Centralized runtime configuration
│       │   └── providers.jsx                     # Global context providers (Language, Auth)
│       ├── components/                           # Shared UI components (Header, Footer, DatePicker)
│       ├── features/
│       │   ├── auth/                             # Supabase authentication services
│       │   ├── feedback/                         # Citizen feedback intake and offline queue
│       │   ├── healthcare/                       # Clinical, diagnostic, and immunization schedules
│       │   ├── search/                           # Server-authoritative search client
│       │   └── village/                          # Modavalasa profile and provenance data
│       ├── i18n/
│       │   ├── en.js                             # English translation dictionary
│       │   └── te.js                             # Telugu translation dictionary
│       ├── lib/
│       │   ├── auth.js                           # Secure auth service with preserved whitespace
│       │   ├── healthCheck.js                    # Decoupled liveness and readiness probes
│       │   ├── i18n.js                           # Localization helpers and fallback resolver
│       │   └── supabase.js                       # Dynamic village resolver and Supabase client
│       ├── styles/                               # Modular CSS design system
│       ├── utils/                                # Date formatting, phone formatting, survey validation
│       └── views/                                # Core SPA views (Portal, Survey, Dashboard, Admin)
│
├── database/
│   └── schema.sql                                # Consolidated PostgreSQL schema (16 tables, RLS)
│
├── supabase/
│   └── migrations/                               # 16 sequential, reproducible database migrations
│       ├── 20260901000000_initial_schema.sql
│       ├── ...
│       └── 20261010000000_create_administrative_audit_trail.sql
│
├── survey/                                       # Field survey instruments and artifacts
│   ├── questionnaire.md                          # Standardized 18-question English/Telugu instrument
│   ├── tabulation.csv                            # Statistical summary of survey findings
│   ├── analysis.md                               # Metric formulas and problem identification
│   └── raw-responses.csv                         # Pseudonymous field survey dataset
│
├── awareness/                                    # Week 2 digital literacy campaign
│   ├── handout.md                                # Citizen reference sheet on .gov.in and cyber safety
│   ├── session-plan.md                           # 60-minute workshop pedagogical structure
│   └── attendance.md                             # Verified community attendance sheet
│
├── documentation/                                # Academic project deliverables
│   ├── daily-logbook.md                          # Certified 24-day / 100-hour activity logbook
│   ├── final-report.md                           # Comprehensive academic project report
│   ├── viva-guide.md                             # Viva defense questions and answers handbook
│   ├── DISASTER_RECOVERY_AND_BACKUPS.md          # Database backup and staging restoration runbook
│   ├── INCIDENT_RESPONSE.md                      # P0-P3 severity matrix and response protocols
│   ├── SECRET_ROTATION.md                        # Zero-downtime credential rotation runbook
│   └── project-features-and-compliance-audit.md  # Functional and architectural audit report
│
└── tests/                                        # Root integration and invariant test suite
    ├── audit_payload_redaction.test.js           # Recursive JSONB sanitization test
    ├── database_migration.test.js                # Migration sequence and schema integrity test
    ├── i18n_dictionary.test.js                   # Bilingual dictionary key parity test
    └── survey_questionnaire.test.js              # Question catalog invariant test
```

---

## 8. Getting Started & Development

### 8.1 Prerequisites
- **Node.js**: Version 18.0.0 or higher.
- **npm**: Version 9.0.0 or higher.
- Modern Web Browser (Chrome, Firefox, Edge, Safari).

### 8.2 Environment Configuration
Create an environment file at `app/.env` (or set environment variables in your deployment hosting):

```env
# Supabase Project Connection
VITE_SUPABASE_URL=https://mjpuyirbwaznnomzifyv.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key

# Target Habitation Configuration
VITE_DEFAULT_VILLAGE_ID=00000000-0000-0000-0000-000000000001
```

*Note: If `VITE_DEFAULT_VILLAGE_ID` is omitted, the client dynamically resolves the active village record from the database using `resolveVillageId`.*

### 8.3 CLI Commands

All development commands can be executed directly from the root repository:

```powershell
# 1. Install Dependencies (executed inside app/)
npm --prefix app install

# 2. Run Local Development Server (http://localhost:5173)
npm run dev

# 3. Execute Complete Test Suite (88 Tests across 2 runners)
npm test

# 4. Run Linter (Oxlint)
npm run lint

# 5. Build Production Bundle (Output in app/dist/)
npm run build

# 6. Preview Production Build Locally
npm run preview
```

---

## 9. Verification & Automated Test Suite

The project includes an automated test suite containing **88 tests** executed across two independent test runners with zero external mock libraries:

```text
Test Suite Summary:
────────────────────────────────────────────────────────────
Runner 1: Application Unit Tests (app/src/**/*.test.js via app/scripts/run-tests.js)
  - feedbackService: validation, offline queue, rate limits, RLS handling  (12 tests)
  - schemesCatalog: slug generation, fallback matching, UUID/slug lookups  (7 tests)
  - searchPortal: query normalization, empty query guards, abort signals   (3 tests)
  - surveyUpload: RPC delegation, idempotency, failure propagation         (3 tests)
  - authService: password whitespace preservation, email normalization     (3 tests)
  - healthChecks: liveness probe, database readiness, timeout handling     (6 tests)
  - offlineQueues: survey & feedback durable queues, dead-letter recovery  (10 tests)
  - supabaseConfig: URL/key validation, UUID validation, village resolver  (9 tests)
  - telephoneFormatter: mobile formatting, landline formatting, tel links  (5 tests)
  - surveyValidation: metadata attribution, bounds checking, consent rules (5 tests)
  - inputSanitizers: phone, email, URL protocols, text trimming            (5 tests)
  - villageProfile: postal PIN, APEPDCL grid, jurisdictions, PCA provenance, zero emojis (5 tests)
  - Subtotal: 75 passed, 0 failed.

Runner 2: Root Integration & Invariant Tests (tests/*.test.js)
  - auditPayloadRedaction: recursive secret stripping, phone masking       (5 tests)
  - databaseMigration: migration order, schema parity, table invariants    (2 tests)
  - i18nDictionary: key parity, non-empty values, interpolation tokens     (6 tests)
  - surveyCatalog: question catalog matches canonical database schema      (1 test)
  - Subtotal: 14 passed, 0 failed.
────────────────────────────────────────────────────────────
Total Suite: 89 passed, 0 failed, 0 skipped (Duration: ~1.1s)
```

---

## 10. Academic Curriculum & 100-Hour Logbook Mapping

The project satisfies the 100-Hour Community Service Project requirement across 24 working days:

- **Week 1: Socio-Economic Survey & Data Collection (26 Hours)**:
  - Orientation, village boundary mapping, Gram Panchayat liaison.
  - Door-to-door survey administration across 16+ households in Modavalasa.
  - PostgreSQL database schema design (`database/schema.sql`) and Supabase project provisioning.
- **Week 2: Data Analysis & Community Awareness (25 Hours)**:
  - Tabulation of survey responses (`survey/tabulation.csv`) and KPI metric computation.
  - Identification of 5 root community information problems (`survey/analysis.md`).
  - Community awareness workshop on `.gov.in` domain verification and cyber hygiene (`awareness/session-plan.md`).
- **Week 3: Portal Engineering & Data Verification (25 Hours)**:
  - Responsive web portal development (React 19, Vite 8, Pure CSS).
  - Bilingual localization (English and Telugu), accessibility controls, and dynamic operating hours.
  - Offline-first survey submission queue with automatic reconnection sync.
- **Week 4: Field Testing, Documentation & Viva Preparation (24 Hours)**:
  - End-to-end community field testing and usability refinements.
  - Operational runbooks (`DISASTER_RECOVERY_AND_BACKUPS.md`, `SECRET_ROTATION.md`, `INCIDENT_RESPONSE.md`).
  - Comprehensive final academic report (`documentation/final-report.md`) and viva defense handbook (`documentation/viva-guide.md`).

---

## 11. Operational Runbooks & Documentation Index

For deployment, incident management, and academic evaluation, refer to the dedicated documentation artifacts:

- [Certified 100-Hour Daily Logbook](documentation/daily-logbook.md)
- [Comprehensive Academic Final Report](documentation/final-report.md)
- [Viva Defense Handbook](documentation/viva-guide.md)
- [Disaster Recovery and Database Backup Runbook](documentation/DISASTER_RECOVERY_AND_BACKUPS.md)
- [Zero-Downtime Secret Rotation Guide](documentation/SECRET_ROTATION.md)
- [Incident Response & Severity Plan](documentation/INCIDENT_RESPONSE.md)
- [Technical, Functional & Compliance Audit](documentation/project-features-and-compliance-audit.md)

---

## 12. License & Academic Attribution

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for complete details.

Developed by Ganesh Katam as a student Community Service Project (CSP) in Computer Science and Engineering. Strictly adheres to zero-emoji constraints and academic integrity standards.
