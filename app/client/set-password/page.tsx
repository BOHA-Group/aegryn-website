import type { Metadata } from 'next'
import { cookies }       from 'next/headers'
import { getTranslations } from 'next-intl/server'
import SetPasswordForm   from './SetPasswordForm'
import ClientLocaleSwitcher from '../ClientLocaleSwitcher'

export const metadata: Metadata = {
  title: 'Activer votre compte — AEGRYN',
  robots: { index: false, follow: false },
}

export default async function SetPasswordPage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'clientArea.setPassword' })

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
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[22px] tracking-tight mb-2">
            {t('title')}
          </h1>
          <p className="font-sans text-[13px] text-white/40">
            {t('subtitle')}
          </p>
        </div>
        <SetPasswordForm />
      </div>
    </main>
  )
}
