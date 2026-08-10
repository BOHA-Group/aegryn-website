import type { Metadata }    from 'next'
import { cookies }          from 'next/headers'
import { getTranslations }  from 'next-intl/server'
import { redirect }         from 'next/navigation'
import Link                 from 'next/link'
import RegisterForm         from './RegisterForm'

export const metadata: Metadata = {
  title: 'Créer un compte — Espace client Aegryn',
  robots: { index: false, follow: false },
}

export default async function RegisterPage() {
  if (process.env.VERCEL_ENV === 'production') redirect('/')

  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'clientArea.register' })

  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6 pt-16 pb-10 relative">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-sans font-bold text-white text-[26px] tracking-[-0.03em] mb-2">
            {t('title')}
          </h1>
          <p className="font-sans text-[13px] text-white/55">
            {t('subtitle')}
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center font-sans text-[12px] text-white/55">
          {t('alreadyAccount')}{' '}
          <Link href="/client/login" className="text-ag-apex hover:text-ag-apex/80 underline underline-offset-2 transition-colors">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
