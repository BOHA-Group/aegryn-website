import type { Metadata }   from 'next'
import { cookies }         from 'next/headers'
import { getTranslations } from 'next-intl/server'
import ResetPasswordForm   from './ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Nouveau mot de passe — AEGRYN',
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'clientArea.resetPassword' })

  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6 pt-16 relative">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[24px] tracking-[-0.03em] mb-2">
            {t('title')}
          </h1>
          <p className="font-sans text-[13px] text-white/55">
            {t('subtitle')}
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </main>
  )
}
