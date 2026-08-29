# DPA TEMPLATE, Data Processing Agreement (Art. 28 GDPR)

> **Audience:** Internal, Aegryn / BOHA Group  
> **Legal basis:** GDPR Art. 28, mandatory agreement with each data processor  
> **Usage:** This template summarises the DPA status per processor. Formal DPAs are signed via each processor's standard process (links below).  
> **Last updated:** 2026-08

---

## Processor Status Register

| Processor | Service | DPA available | Signed / accepted | SCCs (US transfer) | Notes |
|---|---|---|---|---|---|
| **Supabase** | Database, Auth, Storage | ✅ Yes, [supabase.com/privacy](https://supabase.com/privacy) | ☐ Accept via dashboard | ✅ SCCs | Verify CH coverage |
| **Stripe** | Payments, subscriptions | ✅ Yes, [stripe.com/privacy-center](https://stripe.com/privacy-center) | ☐ Accept via dashboard | ✅ SCCs | PCI-DSS compliant |
| **Resend** | Transactional email | ✅ Yes, [resend.com/legal/dpa](https://resend.com/legal/dpa) | ☐ Request via dashboard | ✅ SCCs | Verify CH coverage |
| **Vercel** | Hosting, CI/CD | ✅ Yes, [vercel.com/legal/dpa](https://vercel.com/legal/dpa) | ☐ Accept via dashboard | ✅ SCCs | |
| **Cloudflare** | CDN, DNS, Analytics | ✅ Yes, [cloudflare.com/privacypolicy](https://cloudflare.com/privacypolicy) | ☐ Accept via dashboard | ✅ SCCs | Analytics is cookie-free |
| **GitHub** | Source code hosting | ✅ Yes, [github.com/site/privacy](https://github.com/site/privacy) | ☐ | ✅ SCCs | No personal data in repo |

---

## DPA Checklist (per processor)

Each signed/accepted DPA must confirm:

- [ ] Processor acts only on documented instructions from controller
- [ ] Confidentiality obligations on all authorised persons
- [ ] Appropriate technical and organisational security measures
- [ ] Sub-processor rules, prior written authorisation required
- [ ] Assistance with data subject rights requests
- [ ] Deletion or return of data at contract end
- [ ] Audit rights for controller

---

## Sub-processors, Known Lists

| Processor | Sub-processor list URL |
|---|---|
| Supabase | [supabase.com/legal/privacysub-processors](https://supabase.com/legal/privacy) |
| Stripe | [stripe.com/legal/privacy-center](https://stripe.com/legal/privacy-center) |
| Resend | _(check resend.com/legal)_ |
| Vercel | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy) |
| Cloudflare | [cloudflare.com/gdpr/subprocessors](https://www.cloudflare.com/trust-hub/gdpr/) |

---

## Internal DPA Template (for bespoke processors)

Use the following structure if a custom DPA must be drafted (e.g. for a bespoke CIFS certifier):

```
DATA PROCESSING AGREEMENT

Between:
  Controller: BOHA Group, [address], contact@boha-group.com
  Processor:  [Name], [address]

1. Subject matter and duration
   [Processor] processes personal data on behalf of [Controller] for the purpose of: [purpose].
   This agreement is effective from [date] and remains in force until terminated.

2. Nature and purpose of processing
   [Describe processing: categories of data, data subjects, operations performed]

3. Processor obligations
   - Process data only on documented instructions from Controller
   - Ensure confidentiality of authorised persons
   - Implement Art. 32 security measures
   - Not engage sub-processors without prior written consent
   - Assist Controller with data subject rights (Art. 15–22)
   - Delete or return all data upon contract termination
   - Provide audit cooperation

4. Controller obligations
   - Provide lawful instructions
   - Ensure appropriate legal basis for processing

5. Security measures
   [List applicable technical and organisational measures]

6. Sub-processors
   [List approved sub-processors or state "none"]

7. International transfers
   [State adequacy decision or SCCs reference]

8. Governing law
   Swiss law / EU law, [specify]

Signed:
Controller: ___________________ Date: ___________
Processor:  ___________________ Date: ___________
```

---

## Action Items

| # | Action | Status |
|---|---|---|
| 1 | Accept Supabase DPA via Supabase dashboard | ☐ |
| 2 | Accept Stripe DPA via Stripe dashboard | ☐ |
| 3 | Accept/request Resend DPA | ☐ |
| 4 | Accept Vercel DPA via Vercel dashboard | ☐ |
| 5 | Accept Cloudflare DPA | ☐ |
| 6 | Confirm all SCCs cover Swiss transfers (LPD) | ☐ |
