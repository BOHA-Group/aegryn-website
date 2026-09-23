import localFont from 'next/font/local'
import { headers, cookies } from 'next/headers'
import { routing } from '@/i18n/routing'

/**
 * Root layout — seul endroit autorisé à rendre <html>/<body>.
 * Les layouts enfants ([locale], /admin, /client) ne doivent PAS
 * re-rendre html/body : le nesting invalide fait échouer l'hydratation
 * React (l'arbre est régénéré côté client → perte des styles/head).
 *
 * Lang : header x-next-intl-locale posé par le middleware intl pour les
 * routes /{locale}/* ; fallback sur le cookie ag-locale-pref (admin/client)
 * puis "fr". CookieScript est chargé via GTM — pas de script direct ici.
 */
const plusJakartaSans = localFont({
  src: [
    { path: '../public/fonts/PlusJakartaSans/PlusJakartaSans-Light-300.woff2',     weight: '300', style: 'normal' },
    { path: '../public/fonts/PlusJakartaSans/PlusJakartaSans-Regular-400.woff2',   weight: '400', style: 'normal' },
    { path: '../public/fonts/PlusJakartaSans/PlusJakartaSans-Medium-500.woff2',    weight: '500', style: 'normal' },
    { path: '../public/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold-600.woff2',  weight: '600', style: 'normal' },
    { path: '../public/fonts/PlusJakartaSans/PlusJakartaSans-Bold-700.woff2',      weight: '700', style: 'normal' },
    { path: '../public/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const c = await cookies()
  const headerLocale = h.get('x-next-intl-locale')
  const cookieLocale = c.get('ag-locale-pref')?.value
  const candidate    = headerLocale ?? cookieLocale ?? 'fr'
  const lang         = routing.locales.includes(candidate as 'fr') ? candidate : 'fr'

  return (
    <html lang={lang} dir="ltr" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="font-sans bg-ag-white text-ag-dark antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
