import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NdaAcceptForm } from '@/components/buyer/NdaAcceptForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('nda')
  return {
    title: t('pageTitle'),
    robots: { index: false, follow: false },
  }
}

const NDA_VERSION = 'v1.0-2026-07'

export default async function NdaRequiredPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: existing } = await supa
    .from('nda_signatures')
    .select('signed_at')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (existing) redirect('/client/buyer/catalogue')

  const t = await getTranslations('nda')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ag-navy text-white px-6 py-5 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Shield size={16} className="text-ag-apex shrink-0" />
          <div>
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-ag-apex font-bold">{t('stepLabel')}</p>
            <p className="text-[13px] font-semibold text-white/90">{t('stepTitle')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Intro */}
        <div className="bg-white border border-gray-200 px-8 py-6">
          <p className="text-[13px] text-gray-600 leading-relaxed">{t('introText')}</p>
        </div>

        {/* Texte NDA complet */}
        <div className="bg-white border border-gray-200 px-8 py-8 space-y-8 text-[13px] text-gray-700 leading-relaxed">

          {/* Titre */}
          <div className="border-b border-gray-100 pb-6">
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-2">{t('versionLabel')} {NDA_VERSION}</p>
            <h1 className="text-[17px] font-bold text-gray-900 leading-snug">{t('mainTitle')}</h1>
            <p className="text-[12px] text-gray-500 mt-1">{t('mainSubtitle')}</p>
          </div>

          {/* Parties */}
          <div className="bg-gray-50 px-5 py-4 text-[12px] space-y-2">
            <p><strong>{t('partiesLabel')}</strong></p>
            <p><strong>{t('mainSubtitle')}</strong>, {t('partiesAegryn').split(', ').slice(1).join(', ')}</p>
            <p className="text-gray-400">{t('partiesAnd')}</p>
            <p>{t('partiesBuyer')}</p>
          </div>

          <NdaArticle num="1" title={t('a1Title')}>
            {t('a1')}
          </NdaArticle>

          <NdaArticle num="2" title={t('a2Title')}>
            {t('a2Intro')}
            <ul className="mt-3 space-y-2 list-none">
              {(['a2i1', 'a2i2', 'a2i3', 'a2i4', 'a2i5'] as const).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </NdaArticle>

          <NdaArticle num="3" title={t('a3Title')}>
            <div className="space-y-4 mt-2">
              <SubSection label={t('a3s1Title')}>{t('a3s1')}</SubSection>
              <SubSection label={t('a3s2Title')}>{t('a3s2')}</SubSection>
              <SubSection label={t('a3s3Title')}>{t('a3s3')}</SubSection>
              <SubSection label={t('a3s4Title')}>{t('a3s4')}</SubSection>
              <SubSection label={t('a3s5Title')}>{t('a3s5')}</SubSection>
              <SubSection label={t('a3s6Title')}>{t('a3s6')}</SubSection>
            </div>
          </NdaArticle>

          <NdaArticle num="4" title={t('a4Title')}>
            {t('a4Intro')}
            <ul className="mt-3 space-y-2 list-none">
              {(['a4i1', 'a4i2', 'a4i3'] as const).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </NdaArticle>

          <NdaArticle num="5" title={t('a5Title')}>
            {t('a5').replace(t('a5Years'), '')}
            <strong className="text-gray-900"> {t('a5Years')}</strong>
            {t('a5').split(t('a5Years'))[1] ?? ''}
          </NdaArticle>

          <NdaArticle num="6" title={t('a6Title')}>
            {t('a6Intro')}
            <ul className="mt-3 space-y-2 list-none">
              {(['a6i1', 'a6i2', 'a6i3'] as const).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </NdaArticle>

          <NdaArticle num="7" title={t('a7Title')}>
            {t('a7')}
          </NdaArticle>

          <NdaArticle num="8" title={t('a8Title')}>
            {t('a8')}
          </NdaArticle>
        </div>

        {/* Formulaire d'acceptation */}
        <div className="bg-white border border-ag-navy/20 px-8 py-6 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ag-navy">
            {t('acceptSectionLabel')}
          </p>
          <NdaAcceptForm
            redirectTo="/client/buyer/catalogue"
            ndaVersion={NDA_VERSION}
            check1Label={t('check1')}
            check2Label={t('check2')}
            signingBtn={t('signingBtn')}
            acceptBtn={t('acceptBtn')}
            versionFooter={t('versionFooter')}
            errorFallback="Error"
          />
        </div>

      </div>
    </main>
  )
}

/* ── Composants helpers ─────────────────────────────────────────────────── */

function NdaArticle({ num, title, children }: {
  num: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-3">
        Article {num} — {title}
      </h2>
      <div className="text-[13px] text-gray-700 leading-relaxed">{children}</div>
    </div>
  )
}

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pl-4 border-l-2 border-gray-100">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-[13px] text-gray-600 leading-relaxed">{children}</p>
    </div>
  )
}
