import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Catalogue — Espace Acquéreur AEGRYN',
  robots: { index: false, follow: false },
}

function gradeColor(g: string) {
  return g === '★'   ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : g === 'AAA'    ? 'text-blue-700 border-blue-200 bg-blue-50'
    : g === 'AA'     ? 'text-green-700 border-green-200 bg-green-50'
    : g === 'A'      ? 'text-yellow-700 border-yellow-200 bg-yellow-50'
    : g === 'B'      ? 'text-gray-600 border-gray-200 bg-gray-50'
    : 'text-red-500 border-red-100 bg-red-50'
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

type Asset = {
  id: string
  company_name: string | null
  asset_type: string | null
  arr: number | null
  official_grade: string | null
  score_total: number | null
  public_summary: string | null
  published_at: string | null
  gross_margin: number | null
  nrr: number | null
  benchmark_category: string | null
}

export default async function BuyerCataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; type?: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const t    = await getTranslations('clientSpace')
  const supa = createServiceClient()

  /* Vérification KYC — accès bloqué si non approuvé */
  const { data: profileKyc } = await supa
    .from('profiles')
    .select('kyc_status')
    .eq('id', user.id)
    .single()

  const kycStatus = (profileKyc as { kyc_status?: string } | null)?.kyc_status ?? 'pending'
  if (kycStatus !== 'approved') {
    return (
      <div className="p-8 max-w-2xl">
        <div className="border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-3">Accès restreint</p>
          <h2 className="font-sans font-bold text-gray-900 text-[20px] mb-3">Vérification KYC requise</h2>
          <p className="font-sans text-[13px] text-gray-600 mb-6">
            L&apos;accès au catalogue AEGRYN nécessite la validation complète de votre dossier KYC.
            {kycStatus === 'in_review' && ' Votre dossier est en cours d\'examen — vous serez notifié dès qu\'il sera traité.'}
            {kycStatus === 'rejected'  && ' Votre dossier a été rejeté. Consultez votre espace KYC pour voir les motifs et soumettre les documents corrigés.'}
            {kycStatus === 'pending'   && ' Veuillez compléter et soumettre votre dossier KYC pour accéder au catalogue.'}
          </p>
          <a href="/client/buyer/kyc"
            className="inline-block bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors">
            Accéder à mon espace KYC →
          </a>
        </div>
      </div>
    )
  }

  const { grade, type } = await searchParams

  let query = supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, public_summary, published_at, gross_margin, nrr, benchmark_category')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (grade) query = query.eq('official_grade', grade)
  if (type) query = query.eq('asset_type', type)

  const { data: assets } = await query

  const grades = ['★', 'AAA', 'AA', 'A', 'B']
  const types  = ['saas', 'marketplace', 'ecommerce', 'ip', 'other']

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">{t('spaceNameBuyer')}</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Catalogue AEGRYN</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          {t('catalogSubtitle')}
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white border border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-gray-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">{t('filterLabel')}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="font-sans text-[11px] text-gray-500 self-center">{t('filterGrade')} :</span>
          <Link href="/client/buyer/catalogue" className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-wider ${!grade ? 'bg-ag-navy text-white border-ag-navy' : 'text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            {t('filterAll')}
          </Link>
          {grades.map(g => (
            <Link key={g}
              href={`/client/buyer/catalogue?grade=${encodeURIComponent(g)}${type ? `&type=${type}` : ''}`}
              className={`px-3 py-1 border font-mono text-[10px] ${grade === g ? 'bg-ag-navy text-white border-ag-navy' : 'text-gray-500 border-gray-200 hover:border-gray-400'}`}>
              {g}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="font-sans text-[11px] text-gray-500 self-center">{t('filterType')} :</span>
          <Link href={`/client/buyer/catalogue${grade ? `?grade=${grade}` : ''}`} className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-wider ${!type ? 'bg-ag-navy text-white border-ag-navy' : 'text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            {t('filterAll')}
          </Link>
          {types.map(assetType => (
            <Link key={assetType}
              href={`/client/buyer/catalogue?${grade ? `grade=${grade}&` : ''}type=${assetType}`}
              className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-wider ${type === assetType ? 'bg-ag-navy text-white border-ag-navy' : 'text-gray-500 border-gray-200 hover:border-gray-400'}`}>
              {assetType}
            </Link>
          ))}
        </div>
      </div>

      {/* Résultats */}
      <p className="font-sans text-[12px] text-gray-400 mb-4">
        {assets?.length ?? 0} actif{(assets?.length ?? 0) !== 1 ? 's' : ''} trouvé{(assets?.length ?? 0) !== 1 ? 's' : ''}
      </p>

      {!assets || assets.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <p className="font-sans text-[14px] text-gray-400">
            {t('noAssets')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(assets as Asset[]).map(asset => (
            <Link key={asset.id} href={`/client/buyer/catalogue/${asset.id}`}
              className="bg-white border border-gray-200 p-6 hover:border-ag-navy/30 hover:shadow-sm transition-all group block">

              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-sans font-semibold text-gray-900 text-[15px] truncate">
                      {asset.company_name ?? `${t('assetDefault')} #${asset.id.slice(0, 8)}`}
                    </h2>
                    {asset.asset_type && (
                      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-400 border border-gray-200 px-1.5 py-0.5">
                        {asset.asset_type}
                      </span>
                    )}
                  </div>
                  {asset.benchmark_category && (
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">{asset.benchmark_category}</p>
                  )}
                </div>
                {asset.official_grade && (
                  <div className={`border px-3 py-1.5 font-mono font-bold text-[15px] shrink-0 ${gradeColor(asset.official_grade)}`}>
                    {asset.official_grade}
                    {asset.score_total != null && (
                      <span className="font-sans font-normal text-[9px] opacity-60 ml-1">{asset.score_total}/100</span>
                    )}
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-0.5">ARR</p>
                  <p className="font-sans font-semibold text-[13px] text-gray-800">{fmtChf(asset.arr)}</p>
                </div>
                {asset.gross_margin != null && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-0.5">{t('grossMargin')}</p>
                    <p className="font-sans font-semibold text-[13px] text-gray-800">{asset.gross_margin}%</p>
                  </div>
                )}
                {asset.nrr != null && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-0.5">NRR</p>
                    <p className="font-sans font-semibold text-[13px] text-gray-800">{asset.nrr}%</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {asset.public_summary && (
                <p className="font-sans text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-4 border-l-2 border-ag-apex pl-3">
                  {asset.public_summary}
                </p>
              )}

              <div className="flex items-center justify-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ag-navy group-hover:underline flex items-center gap-1">
                  {t('viewDetails')} <ArrowUpRight size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
