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
  GT: 'es', HN: 'es', SV: 'es', NI: 'es', PA: 'es', DO: 'es', CU: 'es',
  NL: 'nl',
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  ZA: 'en', IN: 'en', SG: 'en', HK: 'en', PH: 'en', NG: 'en', KE: 'en', GH: 'en',
}

const LOCALES     = routing.locales as readonly Locale[]
const PREF_COOKIE = 'ag-locale-pref'
const ACTIVITY_COOKIE = 'ag-last-active'
const SESSION_TTL_MS  = 24 * 60 * 60 * 1000 // 24h

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

/* ── Supabase Auth check ──
   getSession() lit le cookie localement (sans réseau, sans WebCrypto) pour vérifier
   qu'une session existe. La validation sécurisée du JWT est déléguée aux Server
   Component layouts (getUser() via supabaseServer.ts) qui font un appel réseau.
   getClaims() échoue en Edge Runtime Vercel (crypto.subtle.importKey EC instable). */

/** Vérifie si la dernière activité dépasse SESSION_TTL_MS (24h) */
function isSessionExpired(req: NextRequest): boolean {
  const ts = req.cookies.get(ACTIVITY_COOKIE)?.value
  if (!ts) return false // pas de cookie → première visite, pas expiré
  const last = parseInt(ts, 10)
  if (isNaN(last)) return false
  return Date.now() - last > SESSION_TTL_MS
}

/** Pose / renouvelle le cookie d'activité sur la réponse */
function touchActivity(response: NextResponse): void {
  response.cookies.set(ACTIVITY_COOKIE, String(Date.now()), {
    maxAge: Math.floor(SESSION_TTL_MS / 1000), // 86400 s
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

async function refreshAndCheckSession(
  req: NextRequest
): Promise<{ hasSession: boolean; response: NextResponse }> {
  /* Si le cookie d'activité dépasse 24h → session expirée sans faire de requête Supabase */
  if (isSessionExpired(req)) {
    return { hasSession: false, response: NextResponse.next({ request: req }) }
  }

  let response = NextResponse.next({ request: req })

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const supaUrl = rawUrl.trim()
  const supaKey = rawKey.trim()

  const supabase = createServerClient(
    supaUrl,
    supaKey,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  /* Renouvelle le cookie d'activité si une session est active */
  if (session) touchActivity(response)

  return { hasSession: !!session, response }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  /* ── 1. Protection /client/* ──────────────────────────── */
  const PUBLIC_CLIENT_PATHS = [
    '/client/login',
    '/client/auth-confirm',
    '/client/register',
    '/client/forgot-password',
    '/client/reset-password',
    '/client/set-password',
  ]
  if (pathname.startsWith('/client/') && !PUBLIC_CLIENT_PATHS.includes(pathname)) {
    /* Les prefetch RSC (Next-Router-Prefetch: 1) n'envoient pas les cookies navigateur
       → on les laisse passer, les layouts Server Component gèrent leur propre auth. */
    const isPrefetch = req.headers.get('Next-Router-Prefetch') === '1'
    if (!isPrefetch) {
      const { hasSession, response } = await refreshAndCheckSession(req)
      if (!hasSession) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/client/login'
        return NextResponse.redirect(loginUrl)
      }
      const preferred = req.cookies.get(PREF_COOKIE)?.value as Locale | undefined
      const locale: Locale = preferred && LOCALES.includes(preferred) ? preferred : (routing.defaultLocale as Locale)
      response.headers.set('x-next-intl-locale', locale)
      return response
    }
  }

  /* /client/login accessible sans session → pass-through */
  if (pathname.startsWith('/client/')) {
    const preferred = req.cookies.get(PREF_COOKIE)?.value as Locale | undefined
    const locale: Locale = preferred && LOCALES.includes(preferred) ? preferred : (routing.defaultLocale as Locale)
    const res = NextResponse.next()
    res.headers.set('x-next-intl-locale', locale)
    return res
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
    const { hasSession, response } = await refreshAndCheckSession(req)
    if (!hasSession) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search   = ''
      return NextResponse.redirect(loginUrl)
    }
    const preferred = req.cookies.get(PREF_COOKIE)?.value as Locale | undefined
    const locale: Locale = preferred && LOCALES.includes(preferred) ? preferred : (routing.defaultLocale as Locale)
    response.headers.set('x-next-intl-locale', locale)
    return response
  }

  /* ── 3. Routes API — pass-through ── */
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  /* ── 4. i18n + geo-detection pour toutes les autres routes ── */
  const hasLocalePrefix = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocalePrefix) {
    /* Rafraîchir silencieusement le token si une session existe —
       sans ça, le JWT expire pendant la navigation publique et force
       une reconnexion dès que l'utilisateur va sur /client/*. */
    const { response: refreshedRes } = await refreshAndCheckSession(req)
    const intlRes = intlMiddleware(req)
    /* Copier les cookies de refresh (sb-*) dans la réponse i18n */
    refreshedRes.cookies.getAll().forEach(({ name, value, ...opts }) => {
      intlRes.cookies.set(name, value, opts as Parameters<typeof intlRes.cookies.set>[2])
    })
    return intlRes
  }

  const preferred = req.cookies.get(PREF_COOKIE)?.value as Locale | undefined
  let detectedLocale: Locale

  if (preferred && LOCALES.includes(preferred)) {
    detectedLocale = preferred
  } else {
    // x-vercel-ip-country (Vercel) ou cf-ipcountry (Cloudflare) — même sémantique
    const country     = (req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry') ?? '').toUpperCase()
    const fromCountry = COUNTRY_LOCALE[country]
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
