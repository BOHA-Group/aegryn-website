# GRADING_PROTOCOL, CIFSO v4.0

> **Audience:** Internal, Aegryn team + certified CIFSO partners  
> **Confidentiality:** Scoring weights are proprietary, never publish them.  
> **Implementation:** `lib/gradeEngine.ts` (admin-only, never imported client-side)  
> **Last updated:** 2026-09

---

## 1. Protocol Overview

**CIFSO** stands for **Capital & IP · Integrity & Governance · Finance & Metrics · Security & Sovereignty · Organisation & Talent**.

Each of the 5 dimensions is scored 0 to 20. Maximum total: 100 points.
The final grade is derived from the total score, subject to automatic refusal triggers.

Version 4.0 adds the O (Organisation) dimension and reformulates C and I to reflect the expanded scope beyond pure code/IP.

---

## 2. Grade Scale

| Grade | Key | Score | Meaning |
|---|---|---|---|
| AEG ★ | `star` | ≥ 90 | Apex, absolute excellence |
| AAA | `aaa` | 75–89 | Gold, premium asset |
| AA | `aa` | 60–74 | Silver, solid asset |
| A | `a` | 45–59 | Blue, standard asset |
| B | `b` | 30–44 | Amber, early stage |
| Non-certifiable | `refused` | < 30 or any auto-refusal | Not admissible in current state |

Grades B and above may enter the catalogue. `refused` triggers a formal rejection notice to the seller.

---

## 3. Dimension C, Capital & IP (20 pts)

### Evaluated criteria (qualitative, weights are internal)
- Test coverage
- Open critical and major vulnerabilities
- Architecture type (decoupled / partial / monolithic)
- CI/CD pipeline operational status
- API and technical documentation level
- Tech debt documented and tracked
- Obsolete dependencies (> 24 months)
- Last external code audit recency

### Automatic refusal triggers
1. Open critical vulnerabilities + no external code audit ever conducted
2. Test coverage < 10% combined with more than 5 open critical vulnerabilities

### Supporting documents (seller-provided)
`C-01` Git repository, `C-02` README + technical docs, `C-03` Dependency manifest  
`C-04` Test reports, `C-05` Architecture diagram, `C-06` CI/CD configuration  
`C-07` API / secrets management, `C-08` Incident history, `C-09` Tech debt register

---

## 4. Dimension I, Integrity & Governance (20 pts)

### Evaluated criteria
- Trademark registrations (number of jurisdictions)
- Active IP litigation
- Employee and contractor IP assignment coverage
- Critical open-source (GPL) dependencies
- Critical third-party API under formal contract
- Defensibility moat type (network / data / regulatory / none)
- GDPR / LPD compliance level

### Automatic refusal triggers
1. Active IP litigation AND no employee/contractor IP assignment contracts

### Supporting documents
`I-01` Kbis / company registration, `I-02` Articles of association, `I-03` Cap table  
`I-04` IP assignment contracts, `I-05` Trademark certificates, `I-06` Open-source licence audit  
`I-07` Critical API contracts, `I-08` Patents (if applicable), `I-09` Inbound licence contracts  
`I-10` IP litigation declaration

---

## 5. Dimension F, Finance & Metrics (20 pts)

### Evaluated criteria
- ARR level and revenue track record length
- ARR independently audited
- NRR (Net Revenue Retention)
- Monthly churn rate
- Gross margin
- YoY growth
- Top-1 client concentration

### Automatic refusal triggers
1. Runway < 3 months AND ARR < €100k
2. Monthly churn > 15%

### Supporting documents
`F-01` ARR certificate / audited revenue, `F-02` MRR dashboard, `F-03` Client list (anonymised)  
`F-04` Churn report, `F-05` Burn rate + cash position, `F-06` Cap table + dilution  
`F-07` Debt / loan contracts, `F-08` Bank statements (last 3 months), `F-09` KPI dashboard

---

## 6. Dimension S, Security & Sovereignty (20 pts)

### Evaluated criteria
- Last external pentest recency
- Critical vulnerabilities resolved
- MFA on all admin access
- Encryption (at rest + in transit)
- GDPR / LPD documented
- Active security incident
- External certification (ISO 27001 / SOC 2)

### Automatic refusal triggers
1. Active security incident in progress
2. No MFA on admin access AND no pentest ever conducted

### Supporting documents
`S-01` GDPR / LPD register, `S-02` Privacy policy, `S-03` DPA (Data Processing Agreement)  
`S-04` Pentest report, `S-05` Access control policy, `S-06` Encryption documentation  
`S-07` ISO 27001 / SOC 2 certificate (if applicable), `S-08` Past incident report  
`S-09` BCP / DRP (Business Continuity Plan)

---

## 7. Dimension O, Organisation & Talent (20 pts)

### Evaluated criteria
- Founder dependency: % of commercial deals led by founder
- Signing delegation: N-1 capable of signing without founder
- Revenue at risk if founder departs
- Operational documentation completeness
- Succession plan documented
- Key-person risk across C-suite
- Talent retention rate (annualised)
- Board / governance maturity

### Automatic refusal triggers
1. All 5 founder dependency criteria triggered simultaneously
2. Zero operational documentation AND no succession plan

### Supporting documents
`O-01` Org chart, `O-02` Succession plan, `O-03` Employment contracts (key staff)  
`O-04` Delegation of authority matrix, `O-05` Operational runbook, `O-06` Retention data

---

## 8. Subcode System

Each certified asset receives a set of subcodes per dimension (e.g. `C-11`, `C-17`, `S-23`).
These are internal granularity tags, displayed in Antiquorum-style notation on lot sheets.
They do not change the total score calculation.

Mapping logic: `lib/docToSubcodeMap.ts` (admin-only)  
DB columns: `subcodes_code`, `subcodes_ip`, `subcodes_finance`, `subcodes_security`, `subcodes_org` on `assets` table

---

## 9. Certification Output

Upon completion, the grade engine produces:
- `totalScore` (0–100)
- `grade` + `gradeLabel` (e.g. `aa` / `AA`)
- `autoRefusal` boolean + `refusalReasons[]`
- `publicRationale`, qualitative summary **safe to display to buyers** (no weights, no scores)
- Per-dimension `rationale[]`, internal only

---

## 10. Eligibility Rules

- Minimum grade to enter the catalogue: **B** (score >= 30, no auto-refusal)
- `refused` assets receive a formal rejection with listed reasons
- Grading version is stored in `grading_version` column (current: `4.0`)
- Re-certification possible after remediation, new assessment created, history preserved
