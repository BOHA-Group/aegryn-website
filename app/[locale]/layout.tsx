import type { Metadata } from 'next'
import { Unbounded } from 'next/font/google'
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

const plusJakartaSans = localFont({
  src: [
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Light-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-latin.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-latin.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-latin.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-latin.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-latin.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Aegryn — Engineered to Last',
    description: 'Swiss Tech Asset Builder. We build proprietary digital assets engineered to last.',
    url: 'https://aegryn.com',
    siteName: 'Aegryn',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Aegryn' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegryn — Engineered to Last',
    description: 'Swiss Tech Asset Builder.',
    images: ['/og-image.png'],
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
        className={`${unbounded.variable} ${plusJakartaSans.variable} font-sans bg-ag-white text-ag-dark antialiased`}
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
