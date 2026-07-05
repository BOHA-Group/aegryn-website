import type { Metadata } from 'next'
import { cookies }       from 'next/headers'
import { getTranslations } from 'next-intl/server'
import LoginForm         from './LoginForm'
import ClientLocaleSwitcher from '../ClientLocaleSwitcher'

export const metadata: Metadata = {
  title: 'Connexion — Espace client AEGRYN',
  robots: { index: false, follow: false },
}

export default async function ClientLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'clientArea.login' })

  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6 relative">
      <a
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 font-sans text-[12px] text-white/40 hover:text-white transition-colors"
      >
        <span aria-hidden="true">←</span> {t('backToSite')}
      </a>
      <ClientLocaleSwitcher />
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[28px] tracking-[-0.03em] mb-2">
            {t('title')}
          </h1>
          <p className="font-sans text-[13px] text-white/40">
            {t('subtitle')}
          </p>
        </div>
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700/40 px-4 py-3 text-center">
            <p className="font-sans text-[12px] text-red-400">
              {t('linkExpired')}
            </p>
          </div>
        )}
        <LoginForm />
        <p className="mt-5 text-center">
          <a href="/client/forgot-password" className="font-sans text-[12px] text-white/30 hover:text-ag-apex transition-colors">
            {t('forgotPassword')}
          </a>
        </p>
        <p className="mt-4 text-center font-sans text-[11px] text-white/25">
          {t('noAccount')}
          <br />
          {t('contact')} <a href="mailto:contact@aegryn.com" className="text-ag-apex/60 hover:text-ag-apex transition-colors">contact@aegryn.com</a>
        </p>
      </div>
    </main>
  )
}
