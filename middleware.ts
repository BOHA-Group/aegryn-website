/**
 * Middleware i18n AEGRYN
 *
 * Priorité de détection de la locale :
 *   1. Cookie NEXT_LOCALE (choix manuel du user — sticky)
 *   2. Header Accept-Language du navigateur
 *   3. Pays IP via Cloudflare cf-ipcountry (fallback géographique)
 *   4. Langue par défaut : 'fr'
 *
 * Le middleware next-intl gère ensuite le préfixe /[locale]/ dans les URLs.
 */
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { type NextRequest, NextResponse } from 'next/server'

type Locale = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
const LOCALES = routing.locales as readonly Locale[]
const DEFAULT_LOCALE: Locale = 'fr'

/** Mapping pays ISO-3166-1 alpha-2 → locale AEGRYN */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Français
  FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr', MA: 'fr', DZ: 'fr',
  TN: 'fr', SN: 'fr', CI: 'fr', CM: 'fr', CD: 'fr', MG: 'fr',
  // Allemand
  DE: 'de', AT: 'de', LI: 'de',
  // Espagnol
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  BO: 'es', EC: 'es', PY: 'es', UY: 'es', GT: 'es', HN: 'es', SV: 'es',
  NI: 'es', CR: 'es', PA: 'es', DO: 'es', CU: 'es',
  // Italien
  IT: 'it', SM: 'it', VA: 'it',
  // Néerlandais
  NL: 'nl',
  // Anglais (reste du monde)
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', ZA: 'en',
  SG: 'en', IN: 'en', PH: 'en', NG: 'en', KE: 'en', GH: 'en',
}

/**
 * Extrait la meilleure locale depuis l'header Accept-Language.
 * Ex: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" → 'fr'
 */
function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  const parts = header
    .split(',')
    .map(p => {
      const [tag, q] = p.trim().split(';q=')
      return { lang: tag.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of parts) {
    const match = LOCALES.find(l => l === lang)
    if (match) return match
  }
  return null
}

const intlMiddleware = createMiddleware(routing)

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Exclure les routes non-localisées (API, assets statiques, _next, admin, client)
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/client') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|avif|woff2?|ttf|otf|css|js|json|txt|xml|webmanifest)$/)
  ) {
    return NextResponse.next()
  }

  // Si l'URL contient déjà un préfixe de locale connu → laisser next-intl gérer
  const firstSegment = pathname.split('/')[1]
  if (LOCALES.includes(firstSegment as Locale)) {
    return intlMiddleware(req)
  }

  // Détecter la locale à partir des signaux disponibles
  // 1. Cookie NEXT_LOCALE (choix manuel — sticky)
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value as Locale | undefined
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    return intlMiddleware(req)
  }

  // 2. Accept-Language
  const alLocale = localeFromAcceptLanguage(req.headers.get('accept-language'))

  // 3. Cloudflare cf-ipcountry
  const country = req.headers.get('cf-ipcountry')?.toUpperCase() ?? ''
  const geoLocale = COUNTRY_TO_LOCALE[country] ?? null

  // Priorité : Accept-Language > geo > default
  const detectedLocale: Locale = alLocale ?? geoLocale ?? DEFAULT_LOCALE

  // Injecter la locale détectée si différente du default, puis laisser next-intl gérer
  if (detectedLocale !== DEFAULT_LOCALE) {
    const url = req.nextUrl.clone()
    url.pathname = `/${detectedLocale}${pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set('NEXT_LOCALE', detectedLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [
    // Match toutes les routes sauf fichiers statiques et API internes
    '/((?!api|_next/static|_next/image|favicon|images|audio|videos|fonts|legal|manifest|browserconfig|humans|llms|apple-touch-icon|sitemap.xml|robots.txt).*)',
  ],
}
