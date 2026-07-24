import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dossier actif — Espace Cédant AEGRYN',
  robots: { index: false, follow: false },
}

const STATUS_STEPS = [
  { key: 'submitted',    label: 'Dossier reçu',        desc: 'Votre dossier a bien été soumis.' },
  { key: 'under_review', label: 'Analyse en cours',    desc: 'Nos analystes étudient votre dossier.' },
  { key: 'graded',       label: 'Grade attribué',      desc: 'Votre actif a reçu un grade officiel AEGRYN.' },
  { key: 'published',    label: 'Publié au catalogue', desc: 'Votre actif est visible par les acquéreurs qualifiés.' },
  { key: 'sold',         label: 'Vendu',               desc: 'La transaction a été clôturée avec succès.' },
]

function gradeColor(g: string) {
  return g === '★'   ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : g === 'AAA'    ? 'text-blue-700 border-blue-200 bg-blue-50'
    : g === 'AA'     ? 'text-green-700 border-green-200 bg-green-50'
    : g === 'A'      ? 'text-yellow-700 border-yellow-200 bg-yellow-50'
    : g === 'B'      ? 'text-gray-600 border-gray-200 bg-gray-50'
    : 'text-red-500 border-red-100 bg-red-50'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default async function SellerAssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { id } = await params
  const supa = createServiceClient()

  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, status, public_summary, submitted_at, graded_at, published_at, seller_email, seller_uid, gross_margin, nrr, benchmark_category, revenue_track_months')
    .eq('id', id)
    .single()

  if (!asset) notFound()

  const isOwner =
    asset.seller_uid === user.id ||
    (asset.seller_email && asset.seller_email === user.email)

  if (!isOwner) notFound()

  const stepIdx    = STATUS_STEPS.findIndex(s => s.key === asset.status)
  const isWithdrawn = asset.status === 'withdrawn'

  const { data: bidsOnAsset } = await supa
    .from('auction_bids')
    .select('id, amount_chf, status, created_at')
    .eq('asset_id', id)
    .not('status', 'eq', 'withdrawn')
    .order('amount_chf', { ascending: false })
    .limit(5)

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/client/seller/actifs"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft size={12} /> Mes dossiers
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">
              {asset.company_name ?? `Actif #${id.slice(0, 8)}`}
            </h1>
            {asset.asset_type && (
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 border border-gray-200 px-2 py-0.5">
                {asset.asset_type}
              </span>
            )}
          </div>
          {asset.benchmark_category && (
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">{asset.benchmark_category}</p>
          )}
          <p className="font-sans text-[12px] text-gray-400 mt-1">Soumis le {fmtDate(asset.submitted_at)}</p>
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

      {/* Timeline */}
      {!isWithdrawn ? (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Avancement du dossier</p>
          <div className="flex items-start">
            {STATUS_STEPS.map((step, i) => {
              const done    = i < stepIdx
              const current = i === stepIdx
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`absolute top-3 left-1/2 w-full h-px ${done ? 'bg-ag-apex' : 'bg-gray-200'}`} />
                  )}
                  <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 ${
                    done    ? 'bg-ag-apex border-ag-apex'
                    : current ? 'bg-white border-ag-apex'
                    : 'bg-white border-gray-200'
                  }`}>
                    {done    && <div className="w-2 h-2 bg-ag-navy rounded-full" />}
                    {current && <div className="w-2 h-2 bg-ag-apex rounded-full" />}
                  </div>
                  <p className={`font-sans text-[9px] text-center leading-tight px-1 ${
                    current ? 'text-ag-black font-semibold' : done ? 'text-gray-400' : 'text-gray-300'
                  }`}>{step.label}</p>
                  {current && (
                    <p className="font-sans text-[8px] text-ag-apex text-center mt-0.5 px-1 leading-tight">{step.desc}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 px-5 py-4 mb-6">
          <p className="font-sans text-[13px] text-gray-400 italic">Dossier retiré du processus.</p>
        </div>
      )}

      {/* Métriques */}
      <div className="bg-white border border-gray-200 p-6 mb-4">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Indicateurs soumis</p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">ARR</p>
            <p className="font-sans font-bold text-[15px] text-gray-900">{fmtChf(asset.arr)}</p>
          </div>
          {asset.gross_margin != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Marge brute</p>
              <p className="font-sans font-bold text-[15px] text-gray-900">{asset.gross_margin}%</p>
            </div>
          )}
          {asset.nrr != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">NRR</p>
              <p className="font-sans font-bold text-[15px] text-gray-900">{asset.nrr}%</p>
            </div>
          )}
          {asset.revenue_track_months != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Track record</p>
              <p className="font-sans font-bold text-[15px] text-gray-900">{asset.revenue_track_months} mois</p>
            </div>
          )}
        </div>
      </div>

      {/* Résumé public */}
      {asset.public_summary && (
        <div className="bg-white border border-gray-200 p-6 mb-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-3">Résumé certifié (visible acquéreurs)</p>
          <p className="font-sans text-[13px] text-gray-600 leading-relaxed border-l-2 border-ag-apex pl-4">
            {asset.public_summary}
          </p>
        </div>
      )}

      {/* Dates clés */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Dates clés</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Soumission</p>
            <p className="font-sans text-[12px] text-gray-700">{fmtDate(asset.submitted_at)}</p>
          </div>
          {asset.graded_at && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Grade attribué</p>
              <p className="font-sans text-[12px] text-gray-700">{fmtDate(asset.graded_at)}</p>
            </div>
          )}
          {asset.published_at && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Publication</p>
              <p className="font-sans text-[12px] text-gray-700">{fmtDate(asset.published_at)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Offres reçues (si publié) */}
      {asset.status === 'published' && bidsOnAsset && bidsOnAsset.length > 0 && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">
            Expressions d&apos;Intérêt reçues ({bidsOnAsset.length})
          </p>
          <div className="flex flex-col gap-2">
            {bidsOnAsset.map(bid => (
              <div key={bid.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200">
                <div>
                  <p className="font-mono font-bold text-[13px] text-gray-800">{fmtChf(bid.amount_chf)}</p>
                  <p className="font-mono text-[9px] text-gray-400 mt-0.5">{fmtDate(bid.created_at)}</p>
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-widest border px-2 py-0.5 ${
                  bid.status === 'retained' ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                  : bid.status === 'rejected' ? 'text-red-500 border-red-100 bg-red-50'
                  : 'text-blue-600 border-blue-200 bg-blue-50'
                }`}>
                  {bid.status === 'submitted' ? 'En examen' : bid.status === 'retained' ? 'Retenue' : bid.status}
                </span>
              </div>
            ))}
          </div>
          <p className="font-sans text-[11px] text-gray-400 mt-3">
            Les identités des acquéreurs restent confidentielles. L&apos;équipe AEGRYN gère le processus de sélection.
          </p>
        </div>
      )}

      {/* Contact */}
      <div className="bg-ag-navy/5 border border-ag-navy/20 px-5 py-4">
        <p className="font-sans text-[12px] text-gray-600">
          Pour toute question sur ce dossier, contactez votre chargé de compte à{' '}
          <a href="mailto:contact@boha-group.com" className="text-ag-navy underline">contact@boha-group.com</a>{' '}
          en mentionnant la référence <span className="font-mono text-[10px]">{id}</span>.
        </p>
      </div>
    </div>
  )
}
