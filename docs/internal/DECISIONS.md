# DECISIONS — Actées & Architecture

> **Audience:** Internal — Aegryn team  
> **Rule:** Any decision that affects the product, stack, or protocol must be logged here.  
> **Last updated:** 2026-08

---

## Decision Log

### D-001 — Typography: Plus Jakarta Sans (unique)
**Date:** 2026-06-29  
**Decision:** Plus Jakarta Sans is the sole typeface for the entire platform. Unbounded removed. DM Mono kept only if explicitly needed.  
**Weights loaded:** 300, 400, 500, 600, 700, 800  
**Status:** ✅ Implemented

---

### D-002 — Grade scale: 5 immutable grades
**Date:** 2026-07  
**Decision:** Official scale is B → A → AA → AAA → AEG ★. No intermediate grades (A+, AA+, B+, C, D, E). The AEG ★ key is `star` in DB.  
**Status:** ✅ Implemented — never alter without full product review

---

### D-003 — Email domain: @boha-group.com only
**Date:** 2026-07  
**Decision:** All transactional and operational emails use `@boha-group.com` (Google Workspace). No `@aegryn.com` addresses created until Google Workspace is active on `aegryn.com`.  
**Status:** ✅ Enforced in code — `contact@boha-group.com` is the canonical address

---

### D-004 — Git push policy: explicit approval required
**Date:** 2026-07  
**Decision:** No push to `preview` or `main` without explicit chat approval from Yohann. Commits are automatic, push is not.  
**Status:** ✅ Enforced

---

### D-005 — i18n: fr.json is the single source of truth
**Date:** 2026-07  
**Decision:** All new i18n keys are created in `fr.json` first, then propagated to en/de/es/it/nl. Never add a key to another language first.  
**Status:** ✅ Enforced — 6 languages mandatory on all new content

---

### D-006 — Grade engine: admin-only, weights never exposed
**Date:** 2026-07  
**Decision:** `lib/gradeEngine.ts` and `lib/docToSubcodeMap.ts` are never imported on the client side. Scoring thresholds per criterion are proprietary and not documented externally.  
**Status:** ✅ Implemented

---

### D-007 — No confidential data in API responses
**Date:** 2026-08  
**Decision:** No UUIDs, no Postgres error messages, no internal IDs in client-facing API responses. Errors return `{ error: 'server_error' }`. Referral notes do not contain sponsor UUIDs.  
**Status:** ✅ Implemented (commits 82866af, cb44003)

---

### D-008 — Referral programme rules
**Date:** 2026-08  
**Decision:** Max 6 months credit per referred user. Cross-referral blocked in both directions (A→B blocks B→A). One sponsor per referred user. Sponsor must have active subscription.  
**Status:** ✅ Implemented

---

### D-009 — CIFS grading version
**Date:** 2026-08  
**Decision:** Current protocol version is `1.0`. Stored in `grading_version` column on `assets` table. Any methodology change requires a version bump and migration.  
**Status:** ✅ Implemented

---

### D-010 — Admin token no longer propagated via URLs/props/bodies
**Date:** 2026-08  
**Decision:** All `/admin/**` pages and client components stopped passing `tokenQs`/`adminToken` through URLs, React props, or client fetch bodies. Admin API routes now authenticate primarily via Supabase httpOnly session cookie (`getAdminUser()` / `checkAdminAccess()`), with `ADMIN_LEADS_TOKEN` kept only as an optional secondary credential in request bodies for external automation. Verified via live tests: cookie-only auth succeeds (200) on all modified routes; missing/invalid session returns 401; middleware (`proxy.ts`) redirects unauthenticated `/admin` page loads.  
**Residual risk:** `ADMIN_LEADS_TOKEN` does not expire or rotate — tracked in `AUDIT_CHECKLIST.md` §Priority Actions.  
**Status:** ✅ Implemented — see commits on `main` (security: remove adminToken/tokenQs propagation)

---

### D-011 — Admin token rotation + fix open-by-default bug
**Date:** 2026-08  
**Decision:** `ADMIN_LEADS_TOKEN` rotated to a new 256-bit value (Vercel Production/Preview/Development + GitHub Actions secret). Old value invalidated. Audit found `/api/admin/bulk-delete` and `/api/admin/auction/update-lot` had no in-repo callers (no admin page/component references them) and no `getAdminUser()` cookie fallback — `bulk-delete` was open-by-default (`!adminToken || token === adminToken` → `true` if env var unset). Both fixed to require either valid token or admin session cookie; `bulk-delete`'s open-default removed entirely.  
**Unresolved:** cannot confirm from this repo alone whether external/manual scripts depend on these 2 routes. Full removal of `ADMIN_LEADS_TOKEN` deferred until confirmed.  
**Status:** ✅ Rotation + bug fix implemented — ⚠️ full token removal pending confirmation

---

## Pending Decisions

| # | Topic | Context | Due |
|---|---|---|---|
| P-001 | Transaction commission rate | % of closing — not yet defined | TBD |
| P-002 | Re-certification policy | Delay between two certifications for the same asset | TBD |
| P-003 | Buyer tier structure | Qualification thresholds for buyer access levels | TBD |
| P-004 | Escrow institution | Which institution manages transaction escrow | TBD |
