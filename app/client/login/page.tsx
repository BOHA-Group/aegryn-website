import type { Metadata } from 'next'
import { cookies }       from 'next/headers'
import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'
import LoginForm         from './LoginForm'

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
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6 pt-16 relative">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[28px] tracking-[-0.03em] mb-2">
            {t('title')}
          </h1>
          <p className="font-sans text-[13px] text-white/55">
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
          <Link href="/client/forgot-password" className="font-sans text-[12px] text-white/55 hover:text-ag-apex transition-colors">
            {t('forgotPassword')}
          </Link>
        </p>
        <p className="mt-4 text-center font-sans text-[12px] text-white/55">
          {t('noAccount')}{' '}
          <Link href="/client/register" className="text-ag-apex hover:text-ag-apex/80 underline underline-offset-2 transition-colors">
            {t('createAccount')}
          </Link>
        </p>
      </div>
    </main>
  )
}
