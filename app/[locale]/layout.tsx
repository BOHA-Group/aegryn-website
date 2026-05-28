import type { Metadata } from 'next'
import { Unbounded, DM_Sans, DM_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import LenisProvider from '@/components/providers/LenisProvider'
import '@/styles/globals.css'

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-unbounded',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
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
        className={`${unbounded.variable} ${dmSans.variable} ${dmMono.variable} font-sans bg-aegryn-bg text-aegryn-cream antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 rounded-md bg-aegryn-apex px-4 py-2 text-sm font-bold text-aegryn-obsidian"
            >
              Skip to content
            </a>
            <Nav />
            <main id="main" role="main">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
