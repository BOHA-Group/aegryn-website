/**
 * middleware.ts — Aegryn Next.js middleware
 *
 * Rôles :
 *  1. next-intl : routing i18n (locales fr/en/de/es/it/nl)
 *  2. Protection périmétrique /admin/* — redirige vers /admin/login si ni
 *     cookie admin_token ni cookie de session Supabase présents.
 *  3. Protection périmétrique /client/* — redirige vers /client/login si
 *     pas de cookie de session Supabase.
 *
 * Note : cette vérification est une défense en profondeur (layer 1).
 * La vérification de rôle admin reste dans checkAdminAccess / requireAdmin
 * (layer 2, côté serveur dans chaque page).
 */
import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
const defaultLocale = 'fr'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

/** Cookie noms Supabase (auth-token peut varier selon le projet) */
const SUPABASE_AUTH_COOKIE_PREFIXES = ['sb-', 'supabase-auth-token']

/** Cookie posé par adminAuth.ts pour le fallback token */
const ADMIN_TOKEN_COOKIE = 'aegryn-admin-token'

function hasSupabaseCookie(request: NextRequest): boolean {
  return SUPABASE_AUTH_COOKIE_PREFIXES.some(prefix =>
    [...request.cookies.getAll()].some(c => c.name.startsWith(prefix) && c.value)
  )
}

function hasAdminTokenCookie(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_TOKEN_COOKIE)
  return !!cookie?.value
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ── /admin/* protection ── */
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login' ||
      pathname === '/admin/forgot-password' ||
      pathname === '/admin/reset-password'

    if (!isLoginPage) {
      const hasSession = hasSupabaseCookie(request) || hasAdminTokenCookie(request)
      if (!hasSession) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }
    return NextResponse.next()
  }

  /* ── /client/* protection ── */
  if (pathname.startsWith('/client')) {
    const isAuthPage = pathname === '/client/login' ||
      pathname === '/client/register' ||
      pathname.startsWith('/client/auth')

    if (!isAuthPage && !hasSupabaseCookie(request)) {
      const url = request.nextUrl.clone()
      url.pathname = '/client/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  /* ── i18n routing pour toutes les autres routes ── */
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match:
     *  - /admin/* (sans les fichiers statiques)
     *  - /client/*
     *  - toutes les routes i18n (exclut _next, api, fichiers statiques)
     */
    '/admin/:path*',
    '/client/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js)).*)',
  ],
}
