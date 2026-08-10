# LPD ADDENDUM — Swiss Data Protection Act (nLPD)

> **Audience:** Internal — Aegryn / BOHA Group  
> **Legal basis:** Loi fédérale sur la protection des données (LPD révisée) — en vigueur 1er septembre 2023  
> **Scope:** Applies to all processing of personal data of Swiss residents, or processing carried out in Switzerland  
> **Last updated:** 2026-08

---

## 1. Context

The Swiss revised Federal Act on Data Protection (nLPD / nDSG) entered into force on **1 September 2023**.
It is largely aligned with GDPR but contains specific provisions that differ.

Aegryn processes data of Swiss residents and operates under Swiss law for M&A transactions.
This addendum complements `GDPR_REGISTER.md` and highlights Swiss-specific obligations.

---

## 2. Key Differences vs. GDPR

| Topic | GDPR | nLPD | Aegryn action required |
|---|---|---|---|
| **Legal basis** | 6 legal bases (art. 6) | Similar bases, but "legitimate interest" requires balancing test with higher threshold | Review processing activities 6, 8, 9 for LPD legitimate interest |
| **Data Protection Officer** | Mandatory above 250 employees or high-risk processing | Not mandatory — but "Data Protection Advisor" (conseiller) recommended | Designate advisor if processing volume grows |
| **Privacy policy** | Must cover art. 13/14 GDPR | Must be "easily accessible" — no specific format required | ✅ `/terms/use` page exists — review content |
| **Data subjects' rights** | Access, rectification, erasure, portability, objection | Same rights + right to correct inaccurate data | ✅ Covered by Supabase Auth + account deletion flow |
| **Data breach notification** | 72h to supervisory authority (CNIL/EDPB) | Notify FDPIC "as soon as possible" — no strict 72h but prompt | See BREACH_RESPONSE.md |
| **Supervisory authority** | National DPA (CNIL for FR) | FDPIC — Federal Data Protection and Information Commissioner | Add FDPIC as contact in breach response |
| **Cross-border transfers** | Adequacy decision or SCCs | Adequacy list (CH) + SCCs — US not on CH adequacy list | Verify SCCs with Supabase/Stripe/Resend cover CH transfers |
| **Profiling** | Art. 22 restrictions | High-risk profiling requires explicit consent | CIFS grading is not automated profiling — human decision always required |
| **Special categories** | Art. 9 GDPR | Same + biometric + genetic data — stricter consent | N/A for Aegryn current scope |

---

## 3. FDPIC Contact

**Federal Data Protection and Information Commissioner (FDPIC)**  
Feldeggweg 1, 3003 Bern, Switzerland  
https://www.edoeb.admin.ch  
For breach notification and formal enquiries.

---

## 4. Swiss-Specific Processing Activities

### Transaction data under Swiss law
All M&A transaction records (NDA, LOI, SPA) are subject to Swiss law and must be retained per Swiss commercial law obligations (10 years — CO art. 958f).

### CIFS certification under Swiss standards
The CIFS protocol is operated under Swiss law. Certification records constitute contractual evidence and are subject to Swiss retention rules.

---

## 5. Action Items

| # | Action | Status | Owner |
|---|---|---|---|
| 1 | Confirm SCCs with Supabase explicitly cover Switzerland | ☐ | Legal |
| 2 | Confirm SCCs with Stripe explicitly cover Switzerland | ☐ | Legal |
| 3 | Confirm SCCs with Resend explicitly cover Switzerland | ☐ | Legal |
| 4 | Review `/terms/use` page for LPD-specific mentions | ☐ | Aegryn |
| 5 | Assess whether Data Protection Advisor should be designated | ☐ | Founder |
| 6 | Add FDPIC as breach notification contact in BREACH_RESPONSE.md | ✅ | Done |

---

## 6. Changelog

| Date | Change |
|---|---|
| 2026-08 | Initial addendum created |
