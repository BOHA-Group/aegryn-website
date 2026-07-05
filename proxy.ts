import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

type Locale = 'fr' | 'en' | 'it' | 'es' | 'de' | 'nl'

/* ── Country → locale mapping ── */
const COUNTRY_LOCALE: Record<string, Locale> = {
  FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr', SN: 'fr',
  CI: 'fr', CM: 'fr', MG: 'fr', MA: 'fr', TN: 'fr', DZ: 'fr',
  DE: 'de', AT: 'de', LI: 'de',
  IT: 'it', SM: 'it', VA: 'it',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', BO: 'es', PY: 'es', UY: 'es', CR: 'es',
  NL: 'nl',
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  ZA: 'en', IN: 'en', SG: 'en', HK: 'en', PH: 'en',
}

const LOCALES   = routing.locales as readonly Locale[]
const PREF_COOKIE = 'ag-locale-pref'

function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  const parts = header
    .split(',')
    .map((s) => {
      const [tag, q = '1'] = s.trim().split(';q=')
      return { tag: tag.trim().toLowerCase(), q: parseFloat(q) }
    })
    .sort((a, b) => b.q - a.q)
  for (const { tag } of parts) {
    const base = tag.split('-')[0] as Locale
    if (LOCALES.includes(base)) return base
  }
  return null
}

const intlMiddleware = createIntlMiddleware(routing)

/* ── Supabase Auth check (edge-compatible, sync cookies) ── */
function getSupabaseUser(req: NextRequest): { hasSession: boolean; res: NextResponse } {
  const res = NextResponse.next({ request: req })

  const _supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  /* Supabase stocke la session dans sb-<ref>-auth-token */
  const sessionCookie = req.cookies.getAll().find(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  /* Pour l'edge on ne peut pas appeler getUser() (async) —
     on vérifie la présence du cookie de session comme signal fiable */
  return { hasSession: !!sessionCookie, res }
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  /* ── 1. Protection /client/* ──────────────────────────── */
  if (pathname.startsWith('/client/') && pathname !== '/client/login' && pathname !== '/client/auth-confirm') {
    const { hasSession } = getSupabaseUser(req)
    if (!hasSession) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/client/login'
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  /* /client/login accessible sans session → pass-through */
  if (pathname.startsWith('/client/')) {
    return NextResponse.next()
  }

  /* ── 2. Protection /admin/* ────────────────────────────── */
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    /* Pages publiques admin (auth flows) */
    if (
      pathname === '/admin/login' ||
      pathname === '/admin/forgot-password' ||
      pathname === '/admin/reset-password'
    ) return NextResponse.next()

    /* Toutes les autres routes admin requièrent une session */
    const { hasSession } = getSupabaseUser(req)
    if (!hasSession) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search   = ''
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  /* ── 3. Routes API — pass-through ── */
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  /* ── 4. i18n + geo-detection pour toutes les autres routes ── */
  const hasLocalePrefix = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocalePrefix) return intlMiddleware(req)

  const preferred = req.cookies.get(PREF_COOKIE)?.value as Locale | undefined
  let detectedLocale: Locale

  if (preferred && LOCALES.includes(preferred)) {
    detectedLocale = preferred
  } else {
    const country     = req.headers.get('x-vercel-ip-country') ?? ''
    const fromCountry = COUNTRY_LOCALE[country.toUpperCase()]
    const fromBrowser = localeFromAcceptLanguage(req.headers.get('accept-language'))
    detectedLocale    = fromCountry ?? fromBrowser ?? (routing.defaultLocale as Locale)
  }

  const url      = req.nextUrl.clone()
  url.pathname   = `/${detectedLocale}${pathname === '/' ? '' : pathname}`
  const redirect = NextResponse.redirect(url, { status: 302 })

  if (!preferred) {
    redirect.cookies.set(PREF_COOKIE, detectedLocale, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
  }

  return redirect
}

export const config = {
  matcher: ['/((?!_next|_vercel|api/webhooks|.*\\..*).*)'],
}
