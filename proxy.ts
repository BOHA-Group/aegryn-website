import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

type Locale = 'fr' | 'en' | 'it' | 'es' | 'de' | 'nl'

/* ── Country → locale mapping (Vercel x-vercel-ip-country header) ── */
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

const LOCALES = routing.locales as readonly Locale[]
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

const intlMiddleware = createMiddleware(routing)

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  /* If URL already contains a locale prefix → delegate to next-intl */
  const hasLocalePrefix = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocalePrefix) return intlMiddleware(req)

  /* ── Geo detection for root / or unknown paths ─────────────── */
  const preferred = req.cookies.get(PREF_COOKIE)?.value as Locale | undefined
  let detectedLocale: Locale

  if (preferred && LOCALES.includes(preferred)) {
    detectedLocale = preferred
  } else {
    const country = req.headers.get('x-vercel-ip-country') ?? ''
    const fromCountry = COUNTRY_LOCALE[country.toUpperCase()]
    const fromBrowser = localeFromAcceptLanguage(req.headers.get('accept-language'))
    detectedLocale = fromCountry ?? fromBrowser ?? (routing.defaultLocale as Locale)
  }

  const url = req.nextUrl.clone()
  url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`
  const res = NextResponse.redirect(url, { status: 302 })

  if (!preferred) {
    res.cookies.set(PREF_COOKIE, detectedLocale, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
