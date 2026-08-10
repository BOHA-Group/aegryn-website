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
- Founder of a profitable tech asset (SaaS, marketplace, mobile app, API)
- ARR €100k–€10M+, seeking structured exit with legal protection
- Needs: grade report, data room, qualified buyer introduction, closing support

### 2.2 Buyer (Acquéreur)
- PE fund, family office, strategic acquirer, or serial entrepreneur
- Acquisition capacity €300k–€20M+
- Needs: certified pipeline, NDA-gated access, financial metrics, legal clarity

### 2.3 Certified Partner (Expert CIFS)
- M&A consultant, CPA, tech auditor, IP attorney
- Conducts CIFS certification missions on behalf of Aegryn
- Needs: mission dashboard, document submission portal, commission tracking

---

## 3. Core Flows

### 3.1 Seller Flow
```
Submit asset → Pay evaluation fee → Aegryn assigns certifier → 
CIFS audit (4 dimensions) → Grade issued → Dossier published → 
NDA matching → Session presentation → Offer → Closing
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

1. **Pre-certification** — asset submitted, fee paid, certifier assigned
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
| Certification fee | One-time, paid by seller | TBD per tier |
| Partner subscription | Monthly SaaS | CHF 89/mo or annual |
| Transaction commission | % of closing price | TBD |
| Certification Niveau 1 | One-time partner accreditation | CHF 2 000 |
| Certification Niveau 2 | One-time partner accreditation | CHF 5 000 |

---

## 8. Non-Goals (explicit)

- Aegryn does not manage equity stakes or minority participations (parking lot)
- Aegryn does not publish financials of listed assets publicly
- Aegryn does not process payments between buyers and sellers directly (escrow via institution)
- Aegryn does not offer earn-out structuring at this stage
