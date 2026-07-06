import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const SUPPORTED_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

function isSupportedLocale(v: string | undefined): v is SupportedLocale {
  return !!v && (SUPPORTED_LOCALES as readonly string[]).includes(v)
}

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ── /client/* and /admin/* — locale from cookie, not URL ── */
  if (pathname.startsWith('/client') || pathname.startsWith('/admin')) {
    const preferred = request.cookies.get('ag-locale-pref')?.value
    const locale: SupportedLocale = isSupportedLocale(preferred) ? preferred : 'fr'

    const response = NextResponse.next()
    response.headers.set('x-next-intl-locale', locale)
    return response
  }

  /* ── All other routes — next-intl handles [locale]/* prefixes ── */
  return handleI18nRouting(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
