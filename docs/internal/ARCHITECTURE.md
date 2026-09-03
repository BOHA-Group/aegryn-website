# ARCHITECTURE, Aegryn Platform

> **Audience:** Internal, developers  
> **Last updated:** 2026-09-03

---

## 1. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 App Router | TypeScript strict |
| CSS | Tailwind CSS 3.4 | Custom tokens (`ag-*`) |
| Database | Supabase (PostgreSQL) | Row Level Security enforced |
| Auth | Supabase Auth | JWT, multi-role |
| i18n | next-intl | 6 locales: fr, en, de, es, it, nl |
| Email | Resend + React Email | From: contact@boha-group.com |
| Payments | Stripe | Subscriptions + webhooks |
| Storage | Cloudflare R2 | Media assets |
| CDN/DNS | Cloudflare | Proxy orange |
| Hosting | Vercel (front) | CI/CD via GitHub Actions |
| CMS | Payload CMS v3 | Same repo, OVH VPS |
| Scroll | Lenis + GSAP ScrollTrigger | Synced, see layout.tsx |
| Animations | GSAP 3 + Framer Motion 12 | GSAP: scroll / Framer: UI |
| 3D | React Three Fiber + drei | Logo section only |
| Icons | Lucide React | |
| Analytics | Cloudflare Web Analytics | GDPR-compliant, no cookies |

---

## 2. Repository

```
github.com/BOHA-Group/aegryn-website
├── aegryn-site/          ← Next.js app (main working directory)
│   ├── app/              ← App Router pages + API routes
│   │   ├── [locale]/     ← Public marketing pages (i18n)
│   │   ├── client/       ← Authenticated client spaces
│   │   │   ├── buyer/
│   │   │   ├── seller/
│   │   │   ├── partner/
│   │   │   └── internal/     ← Espace collaborateur (rôle internal)
│   │   ├── admin/        ← Internal admin (Aegryn team)
│   │   └── api/          ← API routes
│   ├── components/       ← Shared UI components
│   ├── lib/              ← Business logic (grade engine, etc.)
│   ├── i18n/messages/    ← Translation files (fr.json = source of truth)
│   ├── supabase/         ← Migrations (sequential numbering)
│   ├── docs/             ← Internal documentation (this folder)
│   └── types/            ← Shared TypeScript types
```

---

## 3. Branches

| Branch | Target | Protection |
|---|---|---|
| `main` | Production (aegryn.com) | Protected, requires PR |
| `preview` | Staging (Vercel preview) | Push after user validation only |
| `feature/*` | Feature preview | Auto-deployed by Vercel |
| `hotfix/*` | Emergency production fix | |

**Rule:** Never push directly to `main` or `preview` without explicit approval.

---

## 4. Key Routes

### Public (`/[locale]/`)
| Route | Purpose |
|---|---|
| `/` | Home |
| `/transact/catalog` | Asset catalogue (public teaser) |
| `/transact/sessions` | Private sessions info |
| `/grade/grading-system` | CIFS explained publicly |
| `/grade/submit` | Seller asset submission |
| `/roadmap` | Platform roadmap (top 20) |
| `/about` | About Aegryn |
| `/blog/[slug]` | Market intelligence |
| `/magazine` | Magazine hub |
| `/magazine/[issue]` | Issue viewer (flipbook + web) |
| `/magazine/[issue]/[slug]` | Individual article |

### Client (`/client/`)
| Route | Space | Purpose |
|---|---|---|
| `/client/buyer/catalogue` | Buyer | Full NDA-gated catalogue |
| `/client/seller/actifs` | Seller | Asset tracking dashboard |
| `/client/partner/certifications` | Partner | CIFS missions (auditeurs externes) |
| `/client/internal` | Internal | Dashboard collaborateur (permissions granulaires) |

### Admin (`/admin/`)
| Route | Purpose |
|---|---|
| `/admin/assets` | Asset management + grade engine |
| `/admin/members` | User management (roles, KYC, NDA) |
| `/admin/experts` | Partner/expert review |
| `/admin/invoices` | Invoice generation |

### Admin authentication
- **Primary:** Supabase session cookie (httpOnly, set at `/admin/login`). Verified server-side via `requireAdmin()` / `getAdminUser()` (`lib/adminAuth.ts`), which checks `app_metadata.role` or the `profiles.roles` table.
- **Perimeter defense:** `proxy.ts` (Next.js middleware) blocks `/admin/*` and `/client/*` at the network layer before any page/API code runs.
- **No token in URLs, props, or fetch bodies**, as of 2026-08, all admin `page.tsx` and client components were audited and cleaned of `tokenQs`/`adminToken` propagation. Admin API routes (`/api/admin/**`) authenticate via session cookie by default.
- **Legacy fallback:** `ADMIN_LEADS_TOKEN` (env var) remains accepted as an optional secondary credential in some API route bodies (for external automation/scripts), verified via `checkAdminAccess(token)`. It is never required and never propagated by the UI. See `AUDIT_CHECKLIST.md` §4.5 for residual risk tracking.

---

## 5. Code Conventions

- **Server Components by default**, `'use client'` only when interactivity required
- **i18n:** `fr.json` is the single source of truth. All new keys must be added there first, then propagated to en/de/es/it/nl
- **Grade engine** (`lib/gradeEngine.ts`), admin-only, never imported client-side
- **No `console.log` on main/preview**, debug logs only on feature branches
- **No UUID or internal DB IDs in client-facing API responses**
- **No Postgres error messages exposed to client**, always return `{ error: 'server_error' }`
- **tsc --noEmit = 0 errors** before every commit

---

## 6. Database Migrations

Located in `supabase/migrations/`, sequentially numbered (`001_`, `002_`, ...).
Current count: 101 (dernière: 101_internal_role_permissions).

Run via Supabase CLI:
```bash
supabase db push
```

**Never modify existing migrations.** Create a new one for any schema change.

---

## 7. Environment Variables

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side service role |
| `STRIPE_SECRET_KEY` | Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `RESEND_API_KEY` | Email sending |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (https://aegryn.com) |
| `NEXT_PUBLIC_VERCEL_ENV` | Environment flag (production/preview) |

---

## 8. CI/CD Pipeline

`.github/workflows/ci.yml` runs on every push to `preview` and `main`:
1. `npx tsc --noEmit`, TypeScript check
2. ESLint, no unused vars (must match `/^_/`)
3. `next build`, production build

Failures block merge.
