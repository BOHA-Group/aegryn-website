# DECISIONS, Actées & Architecture

> **Audience:** Internal, Aegryn team  
> **Rule:** Any decision that affects the product, stack, or protocol must be logged here.  
> **Last updated:** 2026-09-03

---

## Decision Log

### D-001, Typography: Plus Jakarta Sans (unique)
**Date:** 2026-06-29  
**Decision:** Plus Jakarta Sans is the sole typeface for the entire platform. Unbounded removed. DM Mono kept only if explicitly needed.  
**Weights loaded:** 300, 400, 500, 600, 700, 800  
**Status:** ✅ Implemented

---

### D-002, Grade scale: 5 immutable grades
**Date:** 2026-07  
**Decision:** Official scale is B → A → AA → AAA → AEG ★. No intermediate grades (A+, AA+, B+, C, D, E). The AEG ★ key is `star` in DB.  
**Status:** ✅ Implemented, never alter without full product review

---

### D-003, Email domain: @boha-group.com only
**Date:** 2026-07  
**Decision:** All transactional and operational emails use `@boha-group.com` (Google Workspace). No `@aegryn.com` addresses created until Google Workspace is active on `aegryn.com`.  
**Status:** ✅ Enforced in code, `contact@boha-group.com` is the canonical address

---

### D-004, Git push policy: explicit approval required
**Date:** 2026-07  
**Decision:** No push to `preview` or `main` without explicit chat approval from Yohann. Commits are automatic, push is not.  
**Status:** ✅ Enforced

---

### D-005, i18n: fr.json is the single source of truth
**Date:** 2026-07  
**Decision:** All new i18n keys are created in `fr.json` first, then propagated to en/de/es/it/nl. Never add a key to another language first.  
**Status:** ✅ Enforced, 6 languages mandatory on all new content

---

### D-006, Grade engine: admin-only, weights never exposed
**Date:** 2026-07  
**Decision:** `lib/gradeEngine.ts` and `lib/docToSubcodeMap.ts` are never imported on the client side. Scoring thresholds per criterion are proprietary and not documented externally.  
**Status:** ✅ Implemented

---

### D-007, No confidential data in API responses
**Date:** 2026-08  
**Decision:** No UUIDs, no Postgres error messages, no internal IDs in client-facing API responses. Errors return `{ error: 'server_error' }`. Referral notes do not contain sponsor UUIDs.  
**Status:** ✅ Implemented (commits 82866af, cb44003)

---

### D-008, Referral programme rules
**Date:** 2026-08  
**Decision:** Max 6 months credit per referred user. Cross-referral blocked in both directions (A→B blocks B→A). One sponsor per referred user. Sponsor must have active subscription.  
**Status:** ✅ Implemented

---

### D-009, CIFS grading version
**Date:** 2026-08  
**Decision:** Current protocol version is `1.0`. Stored in `grading_version` column on `assets` table. Any methodology change requires a version bump and migration.  
**Status:** ✅ Implemented

---

### D-010, Admin token no longer propagated via URLs/props/bodies
**Date:** 2026-08  
**Decision:** All `/admin/**` pages and client components stopped passing `tokenQs`/`adminToken` through URLs, React props, or client fetch bodies. Admin API routes now authenticate primarily via Supabase httpOnly session cookie (`getAdminUser()` / `checkAdminAccess()`), with `ADMIN_LEADS_TOKEN` kept only as an optional secondary credential in request bodies for external automation. Verified via live tests: cookie-only auth succeeds (200) on all modified routes; missing/invalid session returns 401; middleware (`proxy.ts`) redirects unauthenticated `/admin` page loads.  
**Residual risk:** `ADMIN_LEADS_TOKEN` does not expire or rotate, tracked in `AUDIT_CHECKLIST.md` §Priority Actions.  
**Status:** ✅ Implemented, see commits on `main` (security: remove adminToken/tokenQs propagation)

---

### D-011, Admin token rotation + fix open-by-default bug
**Date:** 2026-08  
**Decision:** `ADMIN_LEADS_TOKEN` rotated to a new 256-bit value (Vercel Production/Preview/Development + GitHub Actions secret). Old value invalidated. Audit found `/api/admin/bulk-delete` and `/api/admin/auction/update-lot` had no in-repo callers (no admin page/component references them) and no `getAdminUser()` cookie fallback, `bulk-delete` was open-by-default (`!adminToken || token === adminToken` → `true` if env var unset). Both fixed to require either valid token or admin session cookie; `bulk-delete`'s open-default removed entirely.  
**Unresolved:** cannot confirm from this repo alone whether external/manual scripts depend on these 2 routes. Full removal of `ADMIN_LEADS_TOKEN` deferred until confirmed.  
**Status:** ✅ Rotation + bug fix implemented, ⚠️ full token removal pending confirmation

---

### D-012, Confirmed no Supabase-side caller for bulk-delete/update-lot, token removed entirely
**Date:** 2026-08  
**Decision:** Investigated whether Supabase (database triggers, Database Webhooks, `pg_cron`, `pg_net`/`http` extensions, or Edge Functions) could be calling `/api/admin/bulk-delete` or `/api/admin/auction/update-lot`. Verified via `supabase db query` (linked to project `aegryn-auction`, ref `regdgeodxwpqekhcfmmp`) and `supabase functions list`:
- Installed extensions: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`, **no `pg_net`/`http`**, so Postgres cannot issue outbound HTTP calls.
- Schemas `cron` and `supabase_functions` (used by `pg_cron` and Database Webhooks respectively) **do not exist** in this project.
- Zero Edge Functions deployed.
- No function/trigger source code (`pg_proc.prosrc`) references `bulk-delete`, `update-lot`, or `aegryn`.
- Full repo grep (root + `aegryn-site`, excluding `node_modules`) found zero matches outside the 2 route files themselves.
Conclusion: no technical path exists for Supabase to call these routes, and no other automation was found. User confirmed no external script/tool (Postman, Zapier, etc.) depends on them. `ADMIN_LEADS_TOKEN` fallback removed entirely from both routes, they now authenticate via `getAdminUser()` session cookie only. Verified live: token (old or new) rejected with 401; session cookie succeeds with 200.  
**Status:** ✅ Implemented, token fully removed from these 2 routes

---

### D-013, Fix profiles.admin_note column exposure (RLS row-level ≠ column-level)
**Date:** 2026-08  
**Decision:** Found and fixed a live vulnerability: `profiles.admin_note` (internal admin-only notes) was readable by any authenticated user for their own row via direct PostgREST calls (anon key + own JWT), bypassing all app code. Root cause: `profiles_self_read` RLS policy (`auth.uid() = id`) is row-level only and does not restrict columns; the existing `admin_note, only service_role` policy was a RESTRICTIVE policy with `qual = true`, a no-op. Additionally, `authenticated` held a **table-level** SELECT grant covering all columns, a column-level `REVOKE SELECT (admin_note)` has no effect against a table-level GRANT (Postgres has no "all columns except X" REVOKE primitive).  
**Fix (migration `065_restrict_profiles_admin_note.sql`):** `REVOKE SELECT ON public.profiles FROM authenticated`, then `GRANT SELECT` explicitly on all columns except `admin_note`. `service_role` (all `app/admin/**` server code) is unaffected, it bypasses RLS and column grants natively.  
**Verified live:** direct REST query for `admin_note` → `permission denied for table profiles`. Normal columns (`email`, `full_name`, `kyc_status`, etc.) still readable. Admin UI unaffected.  
**Status:** ✅ Implemented and verified

---

### D-014, Homepage DiscoverStrip: Barnes-style magazine teaser
**Date:** 2026-08  
**Decision:** The homepage magazine section (DiscoverStrip) follows the Barnes International visual style: white text card centered-left with generous padding (40px/44px), 4 mini covers (IssueMiniCard with `decorative` prop) positioned in a diagonal ascending from center to top-right, no overlapping, no badges, no interactivity. Covers are hidden on mobile (`hidden md:block`). Background color `#F5F2EE`, fixed height 560px.  
**Status:** ✅ Implemented

---

### D-015, Em-dash removal: no IA-style punctuation
**Date:** 2026-08  
**Decision:** All em-dashes (U+2014) removed from the entire codebase: i18n JSON files (6 languages, ~1560 replacements), source code user-facing strings (~30), and all `.md` documentation. Replacement rules by context: badges use `·` (middle dot), SEO/meta titles use `|` (pipe), dimensions/labels use `:` (colon), prose uses `,` (comma). UI null-fallback `'—'` characters are preserved as standard convention.  
**Status:** ✅ Implemented

---

### D-016, Magazine slogan and SEO update
**Date:** 2026-08  
**Decision:** Magazine hub description changed from "Publications, rapports et analyses sur le marche M&A tech europeen." to "Deals, multiples, portraits et art de vivre — trimestriel." (all 6 languages). SEO meta title/description updated to match in `magazine.report.meta` namespace. `report` block added to en.json and de.json (was missing).  
**Status:** ✅ Implemented

---

### D-017, Internal role: granular permission-based access
**Date:** 2026-09-03
**Decision:** New user role `internal` created for Aegryn collaborators. Access to the platform is gated by granular permissions assigned by admin (catalog, kyc, grading, dataroom, magazine, experts/auditeurs). The `/client/internal` space is empty by default — sections unlock per permission. The `experts.validate` permission is disabled (grayed out in UI, badge "Bientôt disponible") and renamed "Auditeurs externes". Role `internal` added to all relevant places: register API/form, login redirect, admin member detail, admin permissions page, migration 101.
**Status:** ✅ Implemented — migrations 098, 101

---

### D-018, Expert profile & subscription masked for partner space
**Date:** 2026-09-03
**Decision:** The `/client/partner/expert-profile` and `/client/partner/subscription` pages are temporarily masked (redirect to `/client/partner`). These pages handle the expert listing product (€89/month Stripe subscription). Masked pending product decision. Links removed from `PartnerNav.tsx`. Code and components preserved intact. See `docs/parking-lot.md` § "Fiche Expert & Abonnement partenaire" for reactivation instructions.
**Status:** ✅ Implemented

---

## Pending Decisions

| # | Topic | Context | Due |
|---|---|---|---|
| P-001 | Transaction commission rate | % of closing, not yet defined | TBD |
| P-002 | Re-certification policy | Delay between two certifications for the same asset | TBD |
| P-003 | Buyer tier structure | Qualification thresholds for buyer access levels | TBD |
| P-004 | Escrow institution | Which institution manages transaction escrow | TBD |
