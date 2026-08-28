import { getTranslations } from 'next-intl/server'
import { Construction }    from 'lucide-react'
import type { ReactNode }  from 'react'
import { getAdminUser }    from '@/lib/adminAuth'

/* ─── Gate : section Magazine bloquée en production ─────────────────────── */
/* En preview / développement : accès libre.                                  */
/* En production (VERCEL_ENV === 'production') : badge "Prochainement",       */
/* SAUF pour un profil admin déjà connecté (session Supabase role admin,      */
/* via /admin/login) qui garde un accès complet pour review/QA.               */

export default async function IntelligenceLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) return <>{children}</>

  const adminUser = await getAdminUser()
  if (adminUser) return <>{children}</>

  const { locale } = await params
  const t    = await getTranslations({ locale, namespace: 'comingSoon' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <main className="min-h-screen bg-ag-off-white flex items-center justify-center px-6 py-32">
      <div className="max-w-lg w-full">

        {/* Label section */}
        <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
          {tNav('magazine')} · Aegryn Magazine
        </p>

        {/* Bloc "Prochainement" */}
        <div className="border border-ag-apex/20 bg-ag-navy/5 p-8 flex flex-col gap-6">
          <span className="w-10 h-10 flex items-center justify-center border border-ag-apex/40 bg-ag-apex/10 text-ag-apex">
            <Construction size={16} strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.2em] uppercase text-ag-apex mb-2">
              {t('label')}
            </p>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
              {t('descSection', { section: 'Aegryn Magazine' })}
            </p>
          </div>
        </div>

        {/* Retour accueil */}
        <p className="mt-8 font-sans text-[11px] tracking-[0.14em] text-ag-gray-light text-center">
          <a href={`/${locale}`} className="hover:text-ag-black transition-colors underline underline-offset-4">
            {t('backHome')}
          </a>
        </p>

      </div>
    </main>
  )
}
