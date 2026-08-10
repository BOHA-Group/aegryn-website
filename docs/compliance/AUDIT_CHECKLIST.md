# AUDIT CHECKLIST — GDPR · LPD · AI Act

> **Audience:** Internal — Aegryn / BOHA Group  
> **Usage:** Use this checklist to prepare for or respond to a regulatory audit. Run it at least annually.  
> **Last updated:** 2026-08

---

## How to Use This Checklist

For each item:
- ✅ = in place and documented
- ⚠️ = partial / needs update
- ❌ = missing — action required
- N/A = not applicable

---

## Section 1 — GDPR Fundamentals

| # | Item | Reference | Status |
|---|---|---|---|
| 1.1 | Record of processing activities (Art. 30) maintained | `GDPR_REGISTER.md` | ✅ |
| 1.2 | Legal basis identified for each processing activity | `GDPR_REGISTER.md` | ✅ |
| 1.3 | Privacy policy published and accessible | `/privacy` (6 locales) + `/security` (6 locales) | ✅ |
| 1.4 | Data subject rights procedure in place (access, erasure, portability) | Account deletion flow | ⚠️ Confirm erasure is complete |
| 1.5 | DPA signed with all processors (Art. 28) | `DPA_TEMPLATE.md` | ❌ DPAs not yet formally accepted |
| 1.6 | Sub-processor lists reviewed | `DPA_TEMPLATE.md` | ⚠️ |
| 1.7 | Data breach response procedure defined | `BREACH_RESPONSE.md` | ✅ |
| 1.8 | Breach log maintained | `BREACH_RESPONSE.md` §4 | ✅ (empty — no breaches) |
| 1.9 | Retention periods defined per processing activity | `GDPR_REGISTER.md` | ✅ |
| 1.10 | Data minimisation applied (only necessary data collected) | Code + DB schema | ⚠️ Confirm no excess fields |
| 1.11 | International transfer safeguards in place (SCCs) | `DPA_TEMPLATE.md` | ⚠️ Formal acceptance pending |
| 1.12 | DPIA conducted for high-risk processing | N/A — no high-risk identified | ✅ N/A |

---

## Section 2 — Swiss LPD (nLPD)

| # | Item | Reference | Status |
|---|---|---|---|
| 2.1 | LPD-specific obligations reviewed | `LPD_ADDENDUM.md` | ✅ |
| 2.2 | SCCs cover Swiss transfers (not just EU) | `LPD_ADDENDUM.md` §5 | ❌ To confirm with each processor |
| 2.3 | FDPIC contact known and documented | `BREACH_RESPONSE.md` §5 | ✅ |
| 2.4 | Privacy policy covers Swiss residents | `/terms/use` | ⚠️ Review |
| 2.5 | Data Protection Advisor assessed | `LPD_ADDENDUM.md` §5 | ⚠️ Not yet designated |
| 2.6 | Transaction data retained 10 years (CO art. 958f) | `GDPR_REGISTER.md` Activity 3 | ✅ |

---

## Section 3 — EU AI Act

| # | Item | Reference | Status |
|---|---|---|---|
| 3.1 | AI systems inventory completed | `AI_ACT_COMPLIANCE.md` §1 | ✅ |
| 3.2 | Risk classification assessed for each AI system | `AI_ACT_COMPLIANCE.md` §2 | ✅ |
| 3.3 | Prohibited practices confirmed as not used | `AI_ACT_COMPLIANCE.md` §4 | ✅ |
| 3.4 | Art. 50 transparency — AI content labelled | `ai-editorial-review-process.md` | ✅ |
| 3.5 | Human review process documented | `ai-editorial-review-process.md` | ✅ |
| 3.6 | CIFS engine human oversight confirmed | `GRADING_PROTOCOL.md` §8 | ✅ |
| 3.7 | Annual AI Act review scheduled | `AI_ACT_COMPLIANCE.md` §6 | ⚠️ Calendar entry needed |
| 3.8 | Full application obligations reviewed (Aug 2027) | `AI_ACT_COMPLIANCE.md` §6 | ☐ Due before 2027-08 |

---

## Section 4 — Technical Security (GDPR Art. 32)

| # | Item | Reference | Status |
|---|---|---|---|
| 4.1 | TLS enforced on all endpoints | Vercel + Cloudflare | ✅ |
| 4.2 | Row-Level Security (RLS) enforced on all tables | Supabase migrations | ✅ |
| 4.3 | No UUIDs or internal IDs in client API responses | Code audit 2026-08 | ✅ |
| 4.4 | No Postgres error messages exposed to clients | Code audit 2026-08 | ✅ |
| 4.5 | Admin routes protected (auth check on all /admin/*) | Code review needed | ⚠️ |
| 4.6 | MFA available for user accounts | Supabase Auth | ⚠️ Available but not enforced |
| 4.7 | Referral cross-data blocked (no UUID leakage) | Commits 82866af, cb44003 | ✅ |
| 4.8 | grade engine admin-only, not importable client-side | `lib/gradeEngine.ts` | ✅ |
| 4.9 | Credentials inventory documented | `CREDENTIALS.md` (asset-handover) | ✅ template |
| 4.10 | Backup and recovery tested | _(to confirm with Supabase)_ | ⚠️ |

---

## Section 5 — Documents to Present in Case of Audit

| Document | Location | Ready |
|---|---|---|
| Record of processing activities | `docs/compliance/GDPR_REGISTER.md` | ✅ |
| LPD addendum | `docs/compliance/LPD_ADDENDUM.md` | ✅ |
| DPA register | `docs/compliance/DPA_TEMPLATE.md` | ⚠️ DPAs not formally accepted |
| Breach response procedure | `docs/compliance/BREACH_RESPONSE.md` | ✅ |
| AI Act compliance | `docs/compliance/AI_ACT_COMPLIANCE.md` | ✅ |
| AI editorial review process | `docs/compliance/ai-editorial-review-process.md` | ✅ |
| Cookie consent architecture | `docs/compliance/COOKIE_CONSENT.md` | ✅ |
| Git history (traceability) | `git log --all --oneline` | ✅ |
| Privacy policy (public) | `aegryn.com/[locale]/privacy` — 6 locales | ✅ |
| Security policy (public) | `aegryn.com/[locale]/security` — 6 locales | ✅ |
| CGV (public) | `aegryn.com/terms/cgv` | ⚠️ Awaiting lawyer |
| AI usage notice (public) | `aegryn.com/terms/ai-usage` | ✅ |

---

## Priority Actions Before Any Audit

| Priority | Action |
|---|---|
| 🔴 | Formally accept DPAs with Supabase, Stripe, Resend, Vercel, Cloudflare |
| 🔴 | Confirm SCCs cover Swiss transfers for all US processors |
| 🔴 | Have CGV reviewed and signed by lawyer |
| 🟡 | Review `/privacy` content for GDPR Art. 13/14 completeness (referral, CIFS, NDA processing) |
| 🟡 | Verify export/anonymise/delete-partial APIs cover all tables in GDPR_REGISTER |
| 🟡 | Enforce MFA on admin accounts |
| 🟡 | Remove URL token fallback from `checkAdminAccess` — use `requireAdmin()` only |
| 🟢 | Designate Data Protection Advisor (LPD) |
| 🟢 | Schedule annual AI Act review |
