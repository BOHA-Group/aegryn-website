# COOKIE CONSENT — Architecture & Compliance

> **Audience:** Internal — Aegryn / BOHA Group  
> **Legal basis:** GDPR Art. 6(1)(a) + ePrivacy Directive — consent for non-essential cookies  
> **Last updated:** 2026-08

---

## 1. Current Status

| Element | Status |
|---|---|
| Cookie banner implementation | _(to confirm — check components/analytics/)_ |
| Consent management platform (CMP) | _(none identified — to implement)_ |
| Analytics tool | Cloudflare Web Analytics — **cookie-free** ✅ |
| Meta Pixel | Component ready (`MetaPixel.tsx`) — **pending ID configuration** |
| Other tracking | None identified |

---

## 2. Cookie Inventory

### 2.1 Strictly Necessary (no consent required)

| Name | Purpose | Provider | Duration |
|---|---|---|---|
| `sb-*` (Supabase) | Authentication session | Supabase | Session / persistent |
| CSRF token | Security | Aegryn (Next.js) | Session |

### 2.2 Analytics (consent required)

| Name | Purpose | Provider | Duration | Status |
|---|---|---|---|---|
| Cloudflare Web Analytics | Page view measurement | Cloudflare | No cookie — pixel only | ✅ No consent needed |
| Meta Pixel | Ad conversion tracking | Meta | 90 days | ⚠️ Requires consent — ID not yet configured |

### 2.3 Marketing / Personalisation (consent required)

| Name | Purpose | Provider | Status |
|---|---|---|---|
| _(none currently)_ | — | — | — |

---

## 3. Consent Architecture

### Current approach
Cloudflare Web Analytics is cookie-free — **no consent banner required** for analytics alone.

### When Meta Pixel is activated
A consent banner will be **mandatory** before the Meta Pixel fires.
The existing `MetaPixel.tsx` component already listens for `cookie_consent_updated` event.

**Required before activation:**
- [ ] Implement cookie consent banner (e.g. custom or CMP like Axeptio / Cookiebot)
- [ ] Ensure banner blocks Meta Pixel until consent is given
- [ ] Update privacy policy to mention Meta Pixel
- [ ] Configure `NEXT_PUBLIC_META_PIXEL_ID` in Vercel environment variables

### Consent event flow
```
User visits site → Banner shown →
  Accept all → fire cookie_consent_updated → MetaPixel loads
  Reject / Essential only → MetaPixel does NOT load
  Close without choice → treated as reject
```

---

## 4. Privacy Policy Requirements

The `/terms/use` page must cover:
- [ ] List of all cookies and their purpose
- [ ] How to withdraw consent
- [ ] Third-party processors for cookies (Meta, etc.)
- [ ] Retention periods

---

## 5. ePrivacy / PECR Compliance

| Jurisdiction | Rule | Aegryn status |
|---|---|---|
| EU (GDPR + ePrivacy) | Consent required for non-essential cookies | ✅ N/A today (no non-essential cookies) |
| Switzerland (LPD + TDG) | Same principle | ✅ N/A today |
| UK (PECR) | Same principle | ✅ N/A today |

Status will change to **action required** when Meta Pixel or any other tracking is activated.

---

## 6. Action Items

| # | Action | Trigger | Status |
|---|---|---|---|
| 1 | Implement cookie consent banner | Before activating Meta Pixel | ☐ |
| 2 | Configure `NEXT_PUBLIC_META_PIXEL_ID` | When Meta Business Manager ID obtained | ☐ |
| 3 | Update privacy policy with full cookie list | Before Meta Pixel activation | ☐ |
| 4 | Audit Supabase auth cookies for necessary/strictly necessary classification | Now | ☐ |
