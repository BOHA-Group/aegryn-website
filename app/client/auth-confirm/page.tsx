/**
 * /client/auth-confirm
 * Page intermédiaire affichée brièvement pendant que le callback
 * /api/auth/callback échange le code OTP et redirige vers /client/my-assets.
 */
import type { Metadata } from 'next'
import { cookies }       from 'next/headers'
import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'

export const metadata: Metadata = {
  title: 'Connexion en cours — Aegryn',
  robots: { index: false, follow: false },
}

export default async function AuthConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'clientArea.login' })

  if (error) {
    return (
      <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-red-400 mb-4">Aegryn</p>
          <h1 className="font-sans font-bold text-white text-[22px] tracking-tight mb-3">
            {t('linkExpired')}
          </h1>
          <Link
            href="/client/login"
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors mt-6"
          >
            {t('backToSite')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="w-8 h-8 border-2 border-ag-apex border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-3">Aegryn</p>
        <h1 className="font-sans font-bold text-white text-[20px] tracking-tight mb-2">
          {t('submitting')}
        </h1>
      </div>
    </main>
  )
}
