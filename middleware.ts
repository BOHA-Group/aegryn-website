import createMiddleware from 'next-intl/middleware'
import { routing }      from './i18n/routing'
import { NextRequest }  from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* Routes exclues de l'i18n — gérées directement par Next.js */
  const bypass = [
    '/client/',
    '/admin/',
    '/api/',
    '/payload/',
    '/_next/',
    '/favicon',
    '/robots.txt',
    '/sitemap.xml',
    '/llms',
  ]

  if (bypass.some((prefix) => pathname.startsWith(prefix))) {
    return // laisse Next.js gérer sans intl
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|webm|ogg|pdf|zip)).*)',
  ],
}
