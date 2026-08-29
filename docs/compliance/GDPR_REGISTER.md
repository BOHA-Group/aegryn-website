# GDPR REGISTER, Record of Processing Activities (Art. 30 GDPR)

> **Audience:** Internal, Aegryn / BOHA Group  
> **Legal basis:** GDPR Art. 30, mandatory for organisations processing personal data  
> **Controller:** BOHA Group, contact@boha-group.com  
> **Last updated:** 2026-08  
> **Review frequency:** Annual minimum, or after any new processing activity

---

## Controller Information

| Field | Value |
|---|---|
| Organisation | BOHA Group |
| Legal form | _(to be filled, SAS / SA / etc.)_ |
| Registered address | _(to be filled)_ |
| Contact | contact@boha-group.com |
| DPO | None designated, threshold not reached. Data Protection Advisor to be assessed per nLPD (see `LPD_ADDENDUM.md`) |
| Privacy policy (public) | `aegryn.com/[locale]/privacy`, 6 locales (fr, en, de, es, it, nl) |
| Security policy (public) | `aegryn.com/[locale]/security`, 6 locales |

---

## Processing Activity 1, User Authentication & Account Management

| Field | Value |
|---|---|
| Purpose | Create and manage user accounts (buyer, seller, partner) |
| Legal basis | Art. 6(1)(b), performance of contract |
| Data subjects | Platform users |
| Categories of data | Email address, hashed password, role, KYC status, NDA status |
| Recipients | Supabase (processor, see DPA_TEMPLATE.md) |
| Retention | Duration of account + 3 years after last activity |
| Transfer outside EU/EEA | Supabase (US), SCCs in place |
| Security measures | RLS enforced, MFA available, encrypted in transit (TLS) |

---

## Processing Activity 2, KYC & Identity Verification

| Field | Value |
|---|---|
| Purpose | Verify buyer/seller/partner identity before granting access |
| Legal basis | Art. 6(1)(c), legal obligation + Art. 6(1)(b), contract |
| Data subjects | Buyers, sellers, partners |
| Categories of data | Full name, nationality, company details, KYC documents |
| Recipients | Aegryn admin team, Supabase (processor) |
| Retention | 5 years after account closure (AML compliance) |
| Transfer outside EU/EEA | Supabase (US), SCCs in place |
| Security measures | Admin-only access, RLS policies |

---

## Processing Activity 3, NDA Management

| Field | Value |
|---|---|
| Purpose | Record and enforce NDA signatures for asset access |
| Legal basis | Art. 6(1)(b), performance of contract |
| Data subjects | Buyers, sellers |
| Categories of data | Name, email, signature timestamp, IP address, asset reference |
| Recipients | Supabase (processor) |
| Retention | Duration of transaction + 10 years (legal evidence) |
| Transfer outside EU/EEA | Supabase (US), SCCs in place |
| Security measures | Append-only records, RLS |

---

## Processing Activity 4, Subscription & Billing

| Field | Value |
|---|---|
| Purpose | Manage expert partner subscriptions and payments |
| Legal basis | Art. 6(1)(b), performance of contract |
| Data subjects | Expert partners |
| Categories of data | Email, billing name, Stripe customer ID, payment history |
| Recipients | Stripe (processor, see DPA_TEMPLATE.md), Supabase |
| Retention | 10 years (accounting obligations) |
| Transfer outside EU/EEA | Stripe (US), SCCs in place |
| Security measures | No card data stored locally, Stripe handles PCI-DSS |

---

## Processing Activity 5, Referral Programme

| Field | Value |
|---|---|
| Purpose | Track referrals between expert partners and credit subscription months |
| Legal basis | Art. 6(1)(b), contract |
| Data subjects | Expert partners (referrer and referred) |
| Categories of data | User ID (internal), referral code, credit history, consent flag |
| Recipients | Supabase (processor) |
| Retention | Duration of account + 3 years |
| Transfer outside EU/EEA | Supabase (US), SCCs |
| Security measures | No UUID or personal data exposed in API responses or UI |

---

## Processing Activity 6, CIFS Certification Dossier

| Field | Value |
|---|---|
| Purpose | Conduct asset certification, collect and evaluate seller documents |
| Legal basis | Art. 6(1)(b), contract with seller |
| Data subjects | Sellers, company representatives |
| Categories of data | Company documents, financial data, technical data, personal details in contracts |
| Recipients | Assigned CIFS certifier, Aegryn admin, Supabase |
| Retention | Duration of listing + 5 years after transaction close |
| Transfer outside EU/EEA | Supabase (US), SCCs |
| Security measures | Role-based access, NDA required before certifier access |

---

## Processing Activity 7, Data Subject Rights (Export, Anonymisation, Partial Deletion)

| Field | Value |
|---|---|
| Purpose | Allow users to exercise GDPR rights: data portability (Art. 20), anonymisation, partial deletion |
| Legal basis | Art. 6(1)(c), legal obligation |
| Data subjects | All authenticated users |
| APIs implemented | `POST /api/client/account/export`, `POST /api/client/anonymise-account`, `POST /api/client/account/delete-partial` |
| Audit trail | `rgpd_requests` table, type: `export`, `anonymize`, `delete_partial`, `delete_full` |
| Recipients | Supabase (processor) |
| Retention | Audit log: 5 years |
| Security measures | Auth required, RLS, service role for deletions |

---

## Processing Activity 8, Transactional Emails

| Field | Value |
|---|---|
| Purpose | Send transactional notifications (account, subscription, referral, grade) |
| Legal basis | Art. 6(1)(b), contract |
| Data subjects | All users |
| Categories of data | Email address, name, notification content |
| Recipients | Resend (processor, see DPA_TEMPLATE.md) |
| Retention | Email logs: 90 days |
| Transfer outside EU/EEA | Resend (US), SCCs |
| Security measures | TLS in transit, no sensitive data in email body |

---

## Processing Activity 8, Web Analytics

| Field | Value |
|---|---|
| Purpose | Measure platform usage (page views, referral sources) |
| Legal basis | Art. 6(1)(f), legitimate interest (no cookies used) |
| Data subjects | Website visitors |
| Categories of data | Anonymised page views, referral source, country (no IP stored) |
| Recipients | Cloudflare Web Analytics (processor) |
| Retention | 90 days rolling |
| Transfer outside EU/EEA | Cloudflare (US), SCCs + Privacy Shield successor |
| Security measures | No cookies, no cross-site tracking, GDPR-compliant by design |

---

## Processing Activity 9, Blog / AI-Assisted Content

| Field | Value |
|---|---|
| Purpose | Publish market intelligence articles, some AI-assisted |
| Legal basis | Art. 6(1)(f), legitimate interest |
| Data subjects | None (no personal data in articles) |
| Notes | AI editorial review process documented, see `ai-editorial-review-process.md` (EU AI Act art. 50 §4). No personal data in articles. |

---

## Changelog

| Date | Change | Author |
|---|---|---|
| 2026-08 | Initial register created | Aegryn |
