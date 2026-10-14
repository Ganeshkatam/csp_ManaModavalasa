# CSP Viva Voce & Presentation Defense Guide
## 100-Mark Evaluation Optimization Strategy

This guide prepares the student to defend the Community Service Project before external university examiners and departmental evaluators.

---

## 1. 100-Mark Rubric Mapping Strategy

| Rubric Component | Marks Allocated | What Examiners Look For | How Our Project Guarantees Maximum Marks |
| :--- | :---: | :--- | :--- |
| **Log Book** | **20** | Continuous, daily, authentic work across 4 weeks totaling at least 100 hours with mentor sign-offs. | `documentation/daily-logbook.md` documents all 24 working days (4–5 hours/day = 100 certified hours) detailing location, activity, outcome, evidence reference, and faculty signature blocks. |
| **Implementation** | **30** | Working, responsive, error-free software directly adapted to the assigned habitation with community utility. | Production React 19 + Vite web application (`app/src/`) and standalone reference portal (`portal/`), backed by Supabase PostgreSQL with strict RLS, atomic RPC survey submission, and 89 passing automated tests. |
| **Project Report** | **25** | Methodological rigor, empirical survey analysis, traceability matrix, and complete academic structure. | `documentation/final-report.md` rigorously follows Parts A, B, and C with zero fabricated data, explicit formulas, problem diagnosis, and verified references. |
| **Viva / Presentation** | **25** | Deep understanding of technical decisions, rural constraints, data security, and social impact. | This defense handbook equips the student with crisp, technically sound answers to anticipated examiner questions. |
| **Total** | **100** | **Full University Compliance** | **Rigorous, Academically Defensible Project** |

---

## 2. Core Narrative: The Project Story in 2 Minutes

When asked to introduce your project, deliver this crisp opening statement:

> "Respected examiners, our Community Service Project addresses the critical rural digital divide in Modavalasa (Census Village Code: 583218, Denkada Mandal). Rather than developing a theoretical web application in the lab, our project followed a strict 4-week empirical framework: **Survey -> Evidence -> Problem Identification -> Portal Implementation -> Community Validation**.
>
> In Week 1, we conducted door-to-door household surveys using a digital collection form connected to a Supabase database. In Week 2, we held a community awareness session educating residents on identifying genuine `.gov.in` portals and practicing cyber safety. In Week 3, we built a mobile-first Village Information Portal providing one-touch emergency calls, Primary Health Centre timings, verified welfare scheme document checklists, and a local artisan directory. In Week 4, we field-tested the portal with village residents. Every line of code and every feature in this project traces directly back to a real problem discovered during our field survey."

---

## 3. High-Scoring Responses to Tough Examiner Questions

### Category A: Community Methodology & Academic Integrity

#### Q1: "How did you arrive at your survey percentages? Are these numbers real or assumed?"
**Model Answer**:
> "Every single percentage is calculated directly from empirical doorstep interviews recorded in our database. We surveyed households across residential wards of Modavalasa using our digital survey form (`app/src/views/SurveyFormView.jsx` and `portal/survey.html`). The responses are stored in normalized Supabase tables (`survey_responses` and `survey_answers`). Our live dashboard computes counts and percentages mathematically without manual estimation, and raw response datasets can be exported at any time for academic verification."

#### Q2: "Why did you choose an information portal rather than a heavy mobile app?"
**Model Answer**:
> "Our field survey revealed that while rural households possess smartphones, device storage is constrained and cellular networks fluctuate between 2G, 3G, and 4G. Requiring residents to download an 80MB native Android APK creates substantial friction and installation abandonment. A responsive, mobile-first web portal requires zero installation, opens immediately in any browser, uses route-level code splitting, and caches core civic directory data locally for instantaneous offline access."

---

### Category B: Software Engineering & Architecture Decisions

#### Q3: "What is your software architecture, and why did you design it this way?"
**Model Answer**:
> "Our architecture is engineered specifically for rural edge reliability and sustainable public access:
> 1. **Modular Frontend**: Built with React 19 and Vite (`app/`), featuring route-level code splitting, bilingual English/Telugu localization (`i18n`), and an indexed offline IndexedDB/LocalStorage sync queue. We also maintain a lightweight standalone reference portal (`portal/`) requiring zero build tools.
> 2. **Native Performance**: Eliminates third-party font downloads in favor of the system UI font stack (`system-ui`), conserving bandwidth and eliminating external DNS round-trips.
> 3. **Managed Serverless Relational Backend**: Supabase PostgreSQL provides structured relational integrity, strict Row Level Security (RLS), atomic transactional RPCs, and automated audit trails without maintenance overhead."

#### Q4: "How does your system protect sensitive data, prevent unauthorized modifications, and defend against malicious survey submissions?"
**Model Answer**:
> "We implemented multi-layered defense-in-depth across our PostgreSQL database (`database/schema.sql`):
> 1. **Row Level Security (RLS)**: Public anonymous users have zero direct `SELECT`, `INSERT`, `UPDATE`, or `DELETE` access to `survey_responses` and `survey_answers`. Direct table access is strictly restricted to authenticated administrators via `is_admin()`.
> 2. **Atomic RPC Submission (`submit_survey`)**: Public survey collection occurs exclusively through a hardened PostgreSQL `SECURITY DEFINER` function with search path locked to `public`. This RPC executes within a single database transaction, enforces a **5-minute replay prevention window** on duplicate payloads, validates respondent and village identifiers, and imposes a **rate limit of 30 submissions per minute per village** to defeat burst denial-of-service attempts.
> 3. **Data Privacy Compliance (DPDP Act, 2023)**: Survey records require affirmative consent and capture zero PII. The citizen feedback form explicitly displays statutory data protection notices under the Digital Personal Data Protection Act, 2023.
> 4. **Administrative Hardening**: Admin credentials enforce a minimum 12-character length policy, mandatory first-login password rotation, and append-only audit logging (`audit_logs`) with recursive credential redaction."

#### Q5: "How does the portal handle poor or absent mobile network connectivity in the village?"
**Model Answer**:
> "We implemented a dual-layer offline caching strategy:
> 1. **Durable Survey Queue**: If a surveyor loses cellular connectivity during a doorstep interview, the application catches the network failure, persists the full serialized payload into an offline client queue, and provides an automatic retry and manual sync mechanism once internet access is restored.
> 2. **Public Portal Cache**: Verified village contacts, clinic timings, and welfare scheme checklists are cached locally in browser storage. If a citizen revisits the portal while offline, all essential emergency and civic data renders immediately."

---

### Category C: Verification & Quality Assurance

#### Q6: "How did you verify system correctness and ensure changes did not break existing features?"
**Model Answer**:
> "We built an automated test suite containing **89 unit and integration tests** executing via `node scripts/run-tests.js`:
> - **75 Application Tests**: Verify offline queues, telephone number sanitization, internationalization key parity, survey metadata bounds, URL protocol validation, Census 2011 PCA provenance, and demographic profile invariants.
> - **14 Root Invariant Tests**: Verify recursive secret redaction in audit logs, database migration sequence integrity, schema parity, and survey catalog synchronization.
> All 89 tests execute in approximately 1.0 second with a 100% pass rate in our automated CI verification pipeline."

#### Q7: "How do you ensure you are not publishing fake phone numbers or outdated government rules?"
**Model Answer**:
> "Every single directory record enforces mandatory `source` and `verified_on` metadata fields:
> - Emergency contacts are cross-verified with Gram Panchayat notices and administrative service boards.
> - Welfare schemes link exclusively to official `.gov.in` and `.nic.in` domains with verified document checklists.
> - Citizen feedback allows residents to report outdated numbers or request listing corrections, which are triaged in the administrative console."

#### Q8: "What is the social impact of this project on the village?"
**Model Answer**:
> "The project delivers three concrete benefits:
> 1. **Eliminates Administrative Friction**: Residents know precise scheme eligibility rules and required certificates before traveling, eliminating repetitive 15-kilometer trips to mandal offices.
> 2. **Emergency Preparedness**: Direct tap-to-call links for PHC ambulances, animal husbandry clinics, and electricity linemen minimize response latency during rural emergencies.
> 3. **Local Economic Visibility**: Micro-enterprises, handloom weavers in BC Colony, and rural artisans gain digital discovery without platform commissions."

---

## 4. Key Metrics & Terminology Checklist for Viva
Be fluent with these technical terms during your defense:
- **Primary Census Abstract (PCA)**: Statutory Census of India demographic baseline (Village Code: 583218, 2,584 persons, 624 households; Office of the Registrar General & Census Commissioner, India).
- **Row Level Security (RLS)**: PostgreSQL feature restricting table row read/write permissions based on the executing user's authenticated session.
- **SECURITY DEFINER with Search Path**: PostgreSQL function executing with creator privileges while locking `search_path` to `public` to prevent path injection exploits.
- **Traceability Matrix**: Direct empirical mapping linking every surveyed community bottleneck to an implemented software feature.
- **Digital Personal Data Protection (DPDP) Act, 2023**: Indian statutory privacy framework guaranteeing lawful purpose, informed consent, and data minimization.
- **Automated Regression Suite**: 89 deterministic unit and integration tests guaranteeing schema parity, offline resilience, and zero regression.
