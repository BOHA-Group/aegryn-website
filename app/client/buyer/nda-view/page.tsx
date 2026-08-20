/**
 * /client/buyer/nda-view — lecture seule du NDA signé
 * Accessible uniquement si le NDA catalog_general a déjà été signé.
 * Redirige vers /client/buyer/nda-required si pas encore signé.
 */
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Shield, CheckCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import { NDA_VERSIONS } from '@/lib/ndaVersions'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mon NDA — Aegryn',
    robots: { index: false, follow: false },
  }
}

export default async function NdaViewPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: sig } = await supa
    .from('nda_signatures')
    .select('signed_at, nda_version, ip_address')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (!sig) redirect('/client/buyer/nda-required')

  const t = await getTranslations('nda')
  const signedDate = sig.signed_at
    ? new Date(sig.signed_at as string).toLocaleDateString('fr-CH', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—'
  const signedTime = sig.signed_at
    ? new Date(sig.signed_at as string).toLocaleTimeString('fr-CH', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich',
      })
    : '—'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ag-navy text-white px-6 py-5 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-ag-apex shrink-0" />
            <div>
              <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-ag-apex font-bold">Accord de confidentialité</p>
              <p className="text-[13px] font-semibold text-white/90">Lecture seule — document signé</p>
            </div>
          </div>
          <Link href="/client/buyer"
            className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors border border-white/20 px-3 py-1.5">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Bandeau confirmation */}
        <div className="bg-emerald-50 border border-emerald-200 px-6 py-4 flex items-start gap-3">
          <CheckCircle size={16} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-sans text-[13px] font-semibold text-emerald-800">
              NDA accepté le {signedDate}
            </p>
            <p className="font-mono text-[10px] text-emerald-600 mt-0.5">
              {signedDate} à {signedTime} — Version {String(sig.nda_version ?? NDA_VERSIONS.buyer)}
            </p>
          </div>
        </div>

        {/* Texte NDA complet — lecture seule */}
        <div className="bg-white border border-gray-200 px-8 py-8 space-y-8 text-[13px] text-gray-700 leading-relaxed">

          <div className="border-b border-gray-100 pb-6">
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-2">{t('versionLabel')} {String(sig.nda_version ?? NDA_VERSIONS.buyer)}</p>
            <h1 className="text-[17px] font-bold text-gray-900 leading-snug">{t('mainTitle')}</h1>
            <p className="text-[12px] text-gray-500 mt-1">{t('mainSubtitle')}</p>
          </div>

          <div className="bg-gray-50 px-5 py-4 text-[12px] space-y-2">
            <p><strong>{t('partiesLabel')}</strong></p>
            <p><strong>{t('mainSubtitle')}</strong>, {t('partiesAegryn').split(', ').slice(1).join(', ')}</p>
            <p className="text-gray-400">{t('partiesAnd')}</p>
            <p>{t('partiesBuyer')}</p>
          </div>

          <NdaArticle num="1" title={t('a1Title')}>{t('a1')}</NdaArticle>

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
            {t('a5').split(t('a5Years'))[0]}
            <strong className="text-gray-900">{t('a5Years')}</strong>
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

          <NdaArticle num="7" title={t('a7Title')}>{t('a7')}</NdaArticle>
          <NdaArticle num="8" title={t('a8Title')}>{t('a8')}</NdaArticle>
        </div>

        {/* Pied de page signature */}
        <div className="bg-white border border-ag-navy/20 px-8 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ag-navy mb-3">
            Signature électronique enregistrée
          </p>
          <div className="grid grid-cols-3 gap-4 text-[11px] text-gray-500 font-mono">
            <div>
              <p className="text-gray-400 mb-0.5">Date et heure</p>
              <p className="text-gray-700">{signedDate} à {signedTime}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Version</p>
              <p className="text-gray-700">{String(sig.nda_version ?? NDA_VERSIONS.buyer)}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Signataire</p>
              <p className="text-gray-700">{user.email}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

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
