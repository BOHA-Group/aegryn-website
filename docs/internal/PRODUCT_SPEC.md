# PRODUCT_SPEC — Aegryn Platform

> **Audience:** Internal — Aegryn team only  
> **Last updated:** 2026-08  
> **Status:** Living document — update after each major release

---

## 1. Product Vision

Aegryn is a Swiss-regulated certification and transaction platform for European tech assets.
It bridges certified digital asset sellers with qualified institutional buyers through a structured,
confidential, and legally framed transaction protocol.

**Core promise:** No asset enters the catalogue without passing the CIFS certification.
No buyer accesses a dossier without a signed NDA and verified qualification.

---

## 2. User Personas

### 2.1 Seller (Cédant)

#### Seller A — Early Exit
- Founder of a profitable tech asset (SaaS, marketplace, mobile app, API)
- ARR €100k–€500k, Grade A–AA, indicative ticket €200k–€800k
- Typical buyer profile: search fund operator or entrepreneurship-through-acquisition (ETA) individual
- Needs: grade report, structured data room, introduction to qualified buyers, closing support

#### Seller B — Mature Exit
- Founder of a scaling tech asset with fully documented financials and established revenue base
- ARR €500k–€5M, Grade AA–AAA, indicative ticket €800k–€5M
- Typical buyer profile: private equity fund or family office
- Needs: grade report, investment-committee-ready dossier, structured data room, legal and transfer framing

### 2.2 Buyer (Acquéreur)

#### Buyer A — Search Fund / Entrepreneurship Through Acquisition
- Individual operator or search fund on a first acquisition
- Ticket €200k–€1M
- Needs: certified and pre-audited pipeline, NDA-gated dossier access, closing expert support and transaction guidance

#### Buyer B — Private Equity / Family Office / Strategic Acquirer
- Private equity fund, family office, or strategic corporate acquirer
- Ticket €1M–€10M, investment committee process, possible special purpose vehicle structure, own due diligence team
- Needs: certified pipeline, financial metrics and grade documentation, legal clarity, full data room access

### 2.3 Certified Partner (Expert CIFS)
- M&A consultant, CPA, tech auditor, IP attorney
- Conducts CIFS certification missions on behalf of Aegryn
- Needs: mission dashboard, document submission portal, commission tracking

---

## 3. Core Flows

### 3.1 Seller Flow

#### Flow A — Auction Certification (no upfront fee)
```
Submit asset → Pre-screening (5 business days) → CIFS audit (4 dimensions) →
Grade issued → Dossier published → NDA matching → Session presentation →
Offer → Closing → Commission deducted
```

#### Flow B — AEGRYN Review (CHF 2 000 HT)
```
Submit asset → Pay review fee (CHF 2 000 HT) → Written opinion (15 business days) →
Internal use only → Optional: upgrade to Auction (fee deductible within 6 months)
```

#### Flow C — AEGRYN Review+ (CHF 5 000 HT)
```
Submit asset → Pay fee (CHF 5 000 HT) → Expert partner review (20 business days) →
Written opinion → Optional: upgrade to Auction (fee deductible within 6 months)
```

### 3.2 Buyer Flow
```
Register → KYC verified → NDA signed → Catalogue access → 
Receive session invitation → Review dossier → Express interest → 
Negotiation → LOI → Closing
```

### 3.3 Partner Flow
```
Apply → Expert review → Subscription activated → 
Receive certification mission → Submit grade report → 
Commission credited → Referral programme
```

---

## 4. Feature Inventory (live)

| Feature | Status | Space |
|---|---|---|
| CIFS certification — 4-dimension grade engine | ✅ Live | Admin |
| 5-grade scale B → AEG ★ | ✅ Live | All |
| Asset catalogue with multi-filter (grade, category, ARR) | ✅ Live | Public + Buyer |
| NDA digital — automated gating | ✅ Live | Buyer |
| KYC multi-role (buyer, seller, partner) | ✅ Live | All |
| Private cession sessions | ✅ Live | Buyer |
| Qualified buyer space (data room) | ✅ Live | Buyer |
| Seller submission + tracking space | ✅ Live | Seller |
| Partner subscription (89 CHF/mo or annual -10%) | ✅ Live | Partner |
| Referral programme (6-month cap, cross-referral blocked) | ✅ Live | Partner |
| Expert CIFS network (mission portal) | ✅ Live | Partner |
| On-demand closing expert network | ✅ Live | All |
| Blog & market intelligence | ✅ Live | Public |
| i18n × 6 languages (fr, en, de, es, it, nl) | ✅ Live | Public |

### 4.1 Upcoming

| Feature | Priority |
|---|---|
| Personalised alert notifications | Medium |
| Institutional partner API | Low |
| CIFS extension to on-chain assets (Swiss law) | Low |

---

## 5. Transaction Protocol (PTT)

Four phases govern every transaction on Aegryn:

1. **Pre-certification** — asset submitted, pre-qualification completed (Flow A: no upfront fee; Flow B/C: fee paid), certifier assigned
2. **Certification** — CIFS audit conducted, grade issued, dossier built
3. **Market phase** — sessions presented, NDA signed, dossier accessed
4. **Closing** — LOI signed, escrow activated, legal experts mobilised, transfer completed

See `TRANSFER_CHECKLIST.md` for the full operational checklist.

---

## 6. Confidentiality Rules

- Asset identity never disclosed before double NDA (seller + buyer both signed)
- Teaser contains only: sector, grade, transaction type, indicative ticket
- No seller name, company name, URL, or financials in public communication
- Buyer capacity verified before any introduction

---

## 7. Monetisation

| Stream | Model | Amount |
|---|---|---|
| Auction Certification — publication fee | One-time, paid by seller (deductible from commission if sold) | CHF 2 000 HT |
| Auction Certification — success fee | Degressive % of closing price (8% → 6%), min. CHF 25 000 HT | — |
| AEGRYN Review | One-time, paid by seller — deductible within 6 months | CHF 2 000 HT |
| AEGRYN Review+ | One-time, paid by seller — deductible within 6 months | CHF 5 000 HT |
| Partner subscription | Monthly SaaS | CHF 89 HT/mo or annual |

---

## 8. Explicit Non-Goals

Aegryn never:
- Acts as escrow agent or custodian of transaction funds
- Provides legal, financial, or investment advice — CIFS certification is a decision-support tool, not regulated financial advice (MiFID II)
- Guarantees asset value, transaction outcomes, post-transfer performance, or the conduct of any party — Aegryn acts solely as a certified intermediary and cannot be held liable for disputes arising between parties after closing
- Discloses seller or buyer identity before mutual NDA
- Publishes financials of listed assets publicly
- Publishes any asset to the catalogue without a completed CIFS pre-screening
- Grants catalogue access or accepts buyer registrations without verified KYC

Parked (not in current scope, no committed timeline):
- Equity stake / minority participation management
- Earn-out structuring and monitoring
- Institutional partner API
- CIFS extension to on-chain assets
