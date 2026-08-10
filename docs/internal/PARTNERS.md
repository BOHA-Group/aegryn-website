# PARTNERS — Network, Pipeline & Commission Model

> **Audience:** Internal — Aegryn team  
> **Confidentiality:** Do not share partner contact details externally.  
> **Last updated:** 2026-08

---

## 1. Partner Types

| Type | Role | Access |
|---|---|---|
| **Expert CIFS** | Conducts certification missions on behalf of Aegryn | Mission portal, grade submission |
| **M&A Advisor** | Sources deals, introduces sellers or buyers | Pipeline access, commission |
| **Legal Partner** | Provides closing services (lawyer, notary) | On-demand via closing network |
| **Financial Partner** | CPA, auditor — validates financial dimension | Mission portal |

---

## 2. Expert CIFS Directory

_(To be filled — no personal data entered here until onboarding confirmed)_

| Name | Specialisation | Status | Subscription since |
|---|---|---|---|
| — | — | — | — |

---

## 3. Deal Pipeline

_(To be filled per active deal — no client data entered until transaction initiated)_

| Asset ref | Source partner | Stage | Last update |
|---|---|---|---|
| — | — | — | — |

---

## 4. Commission Model

### 4.1 Expert CIFS — Certification mission
| Element | Details |
|---|---|
| Fee source | Paid by Aegryn from seller certification fee |
| Amount | _(TBD — defined per mission scope)_ |
| Payment trigger | Grade issued and validated by Aegryn |
| Payment method | Invoice from partner to Aegryn |

### 4.2 Referral programme (Expert subscription)
| Rule | Value |
|---|---|
| Sponsor credit | +1 month per referred user who pays first month |
| Referred credit | +1 month on first payment |
| Maximum credit (referred) | 6 months total (hard cap) |
| Cross-referral | Blocked in both directions |
| Multiple sponsors per user | Not allowed — one sponsor maximum |
| Sponsor cap (filleuls) | No hard cap in current implementation |
| Sponsor requirement | Active Stripe subscription |

### 4.3 Transaction commission
| Element | Details |
|---|---|
| Commission rate | _(TBD — pending decision D-P001)_ |
| Basis | % of closing transaction price |
| Trigger | Escrow released, `HANDOVER.md` signed |
| Invoiced by | Aegryn to buyer and/or seller (to be defined) |

---

## 5. Partner Accreditation — Certification Levels

| Level | Name | Fee | Scope |
|---|---|---|---|
| Niveau 1 | Standard accreditation | CHF 2 000 | Access to standard CIFS missions |
| Niveau 2 | Premium accreditation | CHF 5 000 | Access to all missions + advanced training |

Payment links: stored in env vars `STRIPE_CERT_2000_URL` and `STRIPE_CERT_5000_URL` (to be created in Stripe Dashboard — production).

---

## 6. Notes

_(Free field)_
