# DATA ROOM CHECKLIST, CIFSO v1.1

> **Audience:** Sellers, transmitted at onboarding  
> **Instructions:** Upload each document to your secure Aegryn seller space.  
> Status legend: **Required** = mandatory for certification / **Recommended** = improves your score  
> **If applicable** = required only when the regulation applies to your asset (see the Regulatory Applicability section at the end). Your analyst confirms which rows apply.

---

## Dimension C, Code & Architecture

| Code | Document | Status | Format |
|---|---|---|---|
| C-01 | Git repository access (read-only invite or export) | Required | Git URL or ZIP |
| C-02 | README and technical documentation | Required | MD, PDF, or Notion |
| C-03 | Dependency manifest with versions | Required | package.json, requirements.txt, etc. |
| C-04 | Test reports (unit + integration coverage) | Required | HTML, PDF, or CI output |
| C-05 | Architecture diagram | Required | PDF, PNG, or Miro/Lucidchart link |
| C-06 | CI/CD pipeline configuration | Recommended | YAML, screenshot, or description |
| C-07 | API documentation and secrets management policy | Recommended | MD, PDF, or Swagger |
| C-08 | Incident history log | Recommended | PDF or spreadsheet |
| C-09 | Tech debt register | Recommended | MD, PDF, or issue tracker export |
| C-50 | SBOM + vulnerability management process (Cyber Resilience Act) | If applicable | CycloneDX/SPDX + PDF |
| C-51 | Product data access mechanism (EU Data Act — access by design) | If applicable | Technical doc: direct, free, default access |
| C-52 | Data portability and export formats (Data Act ch. VI) | If applicable | Export docs, API spec |

---

## Dimension I, IP & Rights

| Code | Document | Status | Format |
|---|---|---|---|
| I-01 | Company registration certificate (Kbis or equivalent) | Required | PDF |
| I-02 | Articles of association (statuts) | Required | PDF |
| I-03 | Cap table (current shareholder structure) | Required | PDF or spreadsheet |
| I-04 | IP assignment contracts (employees + contractors) | Required | PDF |
| I-05 | Trademark registration certificate(s) | Required if registered | PDF |
| I-06 | Open-source licence audit | Required | PDF or spreadsheet |
| I-07 | Critical third-party API contracts | Required | PDF |
| I-08 | Patent filings (if applicable) | Recommended | PDF |
| I-09 | Inbound licence contracts | Recommended | PDF |
| I-10 | IP litigation declaration (signed) | Required | PDF |
| I-50 | B2B data-sharing terms compliant with FRAND (Data Act ch. III) | If applicable | PDF — T&Cs or addendum |
| I-51 | Tracker register and cookie consent compliance (ePrivacy) | If applicable | CMP export or PDF |
| I-52 | Platform terms compliant with DSA/P2B (ranking transparency, business users) | If applicable | PDF — T&Cs |
| I-53 | Sanctions and embargo non-exposure declaration (signed) | Required | PDF — signed by legal representative |
| I-54 | AML/KYC policy | If applicable | PDF |

---

## Dimension F, Finance

| Code | Document | Status | Format |
|---|---|---|---|
| F-01 | ARR certificate (audited by independent CPA) | Required | PDF |
| F-02 | MRR / ARR monthly dashboard (last 12 months) | Required | PDF or spreadsheet |
| F-03 | Anonymised client list with revenue breakdown | Required | Spreadsheet |
| F-04 | Churn report (monthly, last 12 months) | Required | PDF or spreadsheet |
| F-05 | Burn rate and cash position | Required | PDF or spreadsheet |
| F-06 | Cap table with dilution history | Required | PDF or spreadsheet |
| F-07 | Debt and loan contracts | Required if applicable | PDF |
| F-08 | Bank statements (last 3 months) | Required | PDF |
| F-09 | KPI dashboard (ARR, NRR, MRR, churn, CAC, LTV) | Recommended | PDF or dashboard export |

---

## Dimension S, Security

| Code | Document | Status | Format |
|---|---|---|---|
| S-01 | GDPR / LPD data processing register | Required | PDF or spreadsheet |
| S-02 | Privacy policy (current, published URL or PDF) | Required | PDF or URL |
| S-03 | DPA, Data Processing Agreement (with processors) | Required | PDF |
| S-04 | Latest external pentest report | Required | PDF |
| S-05 | Access control policy (admin access, MFA status) | Required | PDF or MD |
| S-06 | Encryption documentation (at rest + in transit) | Required | PDF or MD |
| S-07 | ISO 27001 / SOC 2 certificate (if applicable) | Recommended | PDF |
| S-08 | Past security incident report(s) with resolution | Recommended | PDF |
| S-09 | BCP / DRP, Business Continuity / Disaster Recovery Plan | Recommended | PDF or MD |
| S-52 | NIS2 registration and risk management measures | If applicable | PDF — registration proof + policy |
| S-53 | ICT register, resilience testing, provider clauses (DORA) | If applicable | PDF or spreadsheet |
| S-54 | EU AI Act risk classification and technical documentation | If applicable | PDF |

---

## Dimension O, Organisation & Talent

| Code | Document | Status | Format |
|---|---|---|---|
| O-50 | Regulatory compliance governance (designated officer, board-level accountability) | If applicable | PDF or org chart |

---

## Regulatory Applicability (CIFSO v4.1)

Not every regulation applies to every asset. During onboarding you declare a regulatory profile; your Aegryn analyst validates it. A regulation marked "not applicable" never penalises your score.

| Your asset… | Triggers | Documents |
|---|---|---|
| manufactures or sells connected products, or holds data generated by clients' business operations | EU Data Act (2023/2854) | C-51, C-52, I-50 |
| sells products with digital elements on the EU market | Cyber Resilience Act (2024/2847) | C-50 |
| processes EU/CH personal data | GDPR/nLPD + ePrivacy | S-01 to S-03, I-51 |
| is a financial entity or ICT provider to finance | DORA + AML | S-53, I-54 |
| develops or provides AI systems | EU AI Act (2024/1689) | S-54 |
| operates in an essential or important sector (health, energy, transport, public admin, digital) | NIS2 | S-52 |
| operates an online platform | DSA / P2B | I-52 |
| any asset | Sanctions & embargoes | I-53 |

**Important:** a missing or insufficient regulatory document never blocks your CIFSO report — it lowers the dimension score, can cap the grade at AA, and conditions the Transaction Readiness Score. Complete documentation is always in your interest.

---

## Notes

- All documents must be in PDF, MD, or standard spreadsheet format unless stated otherwise.
- Documents may be redacted for client names but must remain complete for financial figures.
- Missing required documents will pause the certification process.
- The CIFS expert may request additional documents during the audit phase.
