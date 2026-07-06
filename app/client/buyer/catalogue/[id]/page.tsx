import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft, Gavel } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fiche actif — Espace Acquéreur AEGRYN',
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

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function BuyerAssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const t = await getTranslations('clientSpace')
  const { id } = await params
  const supa = createServiceClient()

  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, public_summary, published_at, gross_margin, nrr, benchmark_category, status, revenue_track_months')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!asset) notFound()

  const { data: existingBid } = await supa
    .from('auction_bids')
    .select('id, amount_chf, status')
    .eq('asset_id', id)
    .eq('bidder_id', user.id)
    .in('status', ['draft', 'submitted', 'retained'])
    .single()

  return (
    <div className="p-8 max-w-3xl">

      {/* Back */}
      <Link href="/client/buyer/catalogue"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft size={12} /> {t('backToCatalog')}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">
              {asset.company_name ?? `${t('assetDefault')} #${asset.id.slice(0, 8)}`}
            </h1>
            {asset.asset_type && (
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 border border-gray-200 px-2 py-0.5">
                {asset.asset_type}
              </span>
            )}
          </div>
          {asset.benchmark_category && (
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
              {asset.benchmark_category}
            </p>
          )}
          <p className="font-sans text-[12px] text-gray-400 mt-1">{t('publishedOn', { date: fmtDate(asset.published_at) })}</p>
        </div>
        {asset.official_grade && (
          <div className={`border px-4 py-2 font-mono font-bold text-[20px] shrink-0 ${gradeColor(asset.official_grade)}`}>
            {asset.official_grade}
            {asset.score_total != null && (
              <span className="font-sans font-normal text-[11px] opacity-60 ml-1.5">{asset.score_total}/100</span>
            )}
          </div>
        )}
      </div>

      {/* Métriques */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">{t('metricsTitle')}</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">ARR</p>
            <p className="font-sans font-bold text-[16px] text-gray-900">{fmtChf(asset.arr)}</p>
          </div>
          {asset.gross_margin != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">{t('grossMargin')}</p>
              <p className="font-sans font-bold text-[16px] text-gray-900">{asset.gross_margin}%</p>
            </div>
          )}
          {asset.nrr != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">NRR</p>
              <p className="font-sans font-bold text-[16px] text-gray-900">{asset.nrr}%</p>
            </div>
          )}
          {asset.revenue_track_months != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Track record</p>
              <p className="font-sans font-bold text-[16px] text-gray-900">{t('trackRecordMonths', { n: asset.revenue_track_months })}</p>
            </div>
          )}
        </div>
      </div>

      {/* Résumé public */}
      {asset.public_summary && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-3">{t('certifiedSummary')}</p>
          <p className="font-sans text-[13px] text-gray-600 leading-relaxed border-l-2 border-ag-apex pl-4">
            {asset.public_summary}
          </p>
        </div>
      )}

      {/* Mention confidentialité */}
      <div className="bg-gray-50 border border-gray-200 px-5 py-4 mb-8">
        <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
          <strong>{t('confidentialityTitle')} :</strong> {t('confidentialityText')}
        </p>
      </div>

      {/* CTA offre */}
      <div className="bg-ag-navy p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">{t('expressInterest')}</p>
            <p className="font-sans font-semibold text-white text-[15px] mb-1">
              {existingBid ? t('existingBidLabel') : t('submitInterestLabel')}
            </p>
            <p className="font-sans text-[12px] text-white/40">
              {existingBid
                ? t('offerAmountStatus', { amount: fmtChf(existingBid.amount_chf), status: existingBid.status })
                : t('offerReviewTime')}
            </p>
          </div>
          {existingBid ? (
            <Link href={`/client/buyer/offres/${existingBid.id}`}
              className="shrink-0 bg-ag-apex text-ag-navy font-mono text-[10px] uppercase tracking-widest px-5 py-3 hover:bg-ag-apex/90 transition-colors">
              {t('viewMyOffer')}
            </Link>
          ) : (
            <Link href={`/client/buyer/offres/new?asset=${asset.id}`}
              className="shrink-0 flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] uppercase tracking-widest px-5 py-3 hover:bg-ag-apex/90 transition-colors">
              <Gavel size={12} /> {t('submitEi')}
            </Link>
          )}
        </div>
      </div>

    </div>
  )
}
