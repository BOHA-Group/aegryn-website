import type { Metadata } from 'next'
import { Unbounded, DM_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import LenisProvider from '@/components/providers/LenisProvider'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import CookieBanner from '@/components/analytics/CookieBanner'
import '@/styles/globals.css'

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-unbounded',
  display: 'swap',
})

const overusedGrotesk = localFont({
  src: [
    {
      path: '../fonts/OverusedGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/OverusedGrotesk-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aegryn.com'),
  title: {
    default: 'Aegryn — Engineered to Last',
    template: '%s — Aegryn',
  },
  description:
    'Aegryn is a Swiss Tech Asset Builder. We build proprietary digital assets engineered to last.',
  icons: {
    icon: '/favicon.ico',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en' | 'it' | 'es' | 'de' | 'nl')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${unbounded.variable} ${overusedGrotesk.variable} ${dmMono.variable} font-sans bg-ag-white text-ag-dark antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-ag-navy px-4 py-2 text-sm font-bold text-white"
            >
              Skip to content
            </a>
            <Nav />
            <main id="main" role="main">
              {children}
            </main>
            <Footer />
            <CookieBanner />
            <GoogleAnalytics />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
