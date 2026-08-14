import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft, Gavel, ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fiche actif — Espace Acquéreur Aegryn',
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

  const [{ data: existingBid }, { data: assessment }] = await Promise.all([
    supa
      .from('auction_bids')
      .select('id, amount_chf, status')
      .eq('asset_id', id)
      .eq('bidder_id', user.id)
      .in('status', ['draft', 'submitted', 'retained'])
      .single(),
    supa
      .from('grade_assessments')
      .select('computed_grade, computed_score, trs, engine_result_json')
      .eq('asset_id', id)
      .in('status', ['published', 'validated'])
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  type DimScores = { score?: number }
  type EngineResult = { dimensions?: { code?: DimScores; ip?: DimScores; finance?: DimScores; security?: DimScores } }
  const engine = (assessment?.engine_result_json ?? {}) as EngineResult
  const dims = engine?.dimensions ?? null

  const GRADE_LABEL: Record<string, string> = {
    star: 'AEG ★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'Refusé',
  }
  const GRADE_CLS: Record<string, string> = {
    star:    'text-emerald-700 bg-emerald-50 border-emerald-300',
    aaa:     'text-yellow-700 bg-yellow-50 border-yellow-300',
    aa:      'text-slate-700 bg-slate-50 border-slate-300',
    a:       'text-blue-700 bg-blue-50 border-blue-300',
    b:       'text-orange-700 bg-orange-50 border-orange-300',
    refused: 'text-red-700 bg-red-50 border-red-300',
  }
  const TRS_META: Record<string, { label: string; cls: string; desc: string }> = {
    ready:       { label: 'Prêt à transiger',              cls: 'text-emerald-700 bg-emerald-50 border-emerald-300', desc: 'L\u2019actif remplit toutes les conditions requises pour entrer en session de transaction.' },
    conditional: { label: 'Conditionnel — actions en cours', cls: 'text-amber-700 bg-amber-50 border-amber-300',   desc: 'Des actions sont en cours côté vendeur avant que la transaction puisse démarrer.' },
    remediation: { label: 'En remédiation',                cls: 'text-orange-700 bg-orange-50 border-orange-300', desc: 'Des points sont en cours de résolution. La publication reste active.' },
    blocked:     { label: 'Transaction temporairement bloquée', cls: 'text-red-700 bg-red-50 border-red-300',    desc: 'Un blocage est détecté — contactez AEGRYN Advisory.' },
  }

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

      {/* ── CIFS Synthesis ── */}
      {assessment && assessment.computed_grade && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={14} className="text-ag-navy shrink-0" />
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Synthèse CIFS — État des lieux certifié</p>
          </div>

          {/* Grade + Score */}
          <div className="flex items-center gap-4 mb-6">
            {GRADE_LABEL[assessment.computed_grade] && (
              <span className={`border px-4 py-2 font-mono font-bold text-[22px] shrink-0 ${GRADE_CLS[assessment.computed_grade] ?? ''}`}>
                {GRADE_LABEL[assessment.computed_grade]}
              </span>
            )}
            <div>
              <p className="font-mono font-bold text-[28px] text-gray-900 leading-none">
                {assessment.computed_score ?? '—'}<span className="text-[13px] font-normal text-gray-400">/100</span>
              </p>
              <p className="font-sans text-[11px] text-gray-400 mt-0.5">Score CIFS</p>
            </div>
          </div>

          {/* Barres par dimension */}
          {dims && (
            <div className="flex flex-col gap-3 mb-6">
              {([
                { label: 'C — Code',     key: 'code'     as const, color: 'bg-blue-400' },
                { label: 'I — IP',       key: 'ip'       as const, color: 'bg-purple-400' },
                { label: 'F — Finance',  key: 'finance'  as const, color: 'bg-amber-400' },
                { label: 'S — Sécurité',key: 'security' as const, color: 'bg-red-400' },
              ]).map(d => {
                const s = dims?.[d.key]?.score ?? 0
                return (
                  <div key={d.key}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">{d.label}</p>
                      <p className="font-mono text-[10px] text-gray-700 font-bold">{s}<span className="font-normal text-gray-400">/25</span></p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(s / 25) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TRS */}
          {assessment.trs && TRS_META[assessment.trs] && (
            <div className={`border px-4 py-3 mb-5 ${TRS_META[assessment.trs].cls}`}>
              <div className="flex items-center gap-2 mb-1">
                {assessment.trs === 'ready'
                  ? <CheckCircle2 size={13} />
                  : assessment.trs === 'blocked'
                    ? <XCircle size={13} />
                    : <AlertTriangle size={13} />}
                <p className="font-mono text-[9px] uppercase tracking-widest font-bold">
                  TRS — {TRS_META[assessment.trs].label}
                </p>
              </div>
              <p className="font-sans text-[11px] opacity-80">{TRS_META[assessment.trs].desc}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-t border-gray-100 pt-4">
            <p className="font-sans text-[10px] text-gray-400 leading-relaxed">
              <strong className="text-gray-500">Note AEGRYN :</strong> Le score CIFS certifie l&apos;état structurel de l&apos;actif au moment de son évaluation. Il constitue un point de départ documenté, non un substitut à la due diligence acquéreur. Tout investissement en session Auction implique un séquestre et reste soumis aux conditions contractuelles AEGRYN.
            </p>
          </div>
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
