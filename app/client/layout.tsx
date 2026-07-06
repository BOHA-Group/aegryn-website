import localFont  from 'next/font/local'
import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import ClientTopBar from '@/components/layout/ClientTopBar'
import '@/styles/globals.css'

const SUPPORTED_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

const plusJakartaSans = localFont({
  src: [
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Light-300.woff2',    weight: '300', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Regular-400.woff2',  weight: '400', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Medium-500.woff2',   weight: '500', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Bold-700.woff2',     weight: '700', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold-800.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const cookieStore   = await cookies()
  const preferred      = cookieStore.get('ag-locale-pref')?.value
  const locale: SupportedLocale = isSupportedLocale(preferred) ? preferred : 'fr'
  const messages       = (await import(`@/i18n/messages/${locale}.json`)).default

  return (
    <html lang={locale} className={`${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased">
        <ClientTopBar />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
