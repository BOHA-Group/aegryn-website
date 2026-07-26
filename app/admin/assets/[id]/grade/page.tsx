import { createServiceClient } from '@/lib/supabase'
import { redirect, notFound }   from 'next/navigation'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import GradeForm                from './GradeForm'

export const metadata: Metadata = {
  title: 'Attribution de grade — AEGRYN Admin',
  robots: { index: false, follow: false },
}

function fmtEur(n: unknown) {
  if (!n) return '—'
  const v = Number(n)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} M€`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)} K€`
  return `${Math.round(v)} €`
}

export default async function AdminAssetGradePage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id }    = await params
  const { token } = await searchParams

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && token !== adminToken) redirect('/')

  const supa = createServiceClient()
  const { data: asset, error } = await supa
    .from('assets')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !asset) notFound()

  const a = asset as Record<string, unknown>
  const tokenQs = token ? `?token=${token}` : ''

  /* ── Benchmark marché — comparables pour contextualiser le grading ── */
  const { data: benchmarkRows } = await supa
    .from('benchmark_data')
    .select('*')
    .order('category', { ascending: true })

  const { data: transactionComps } = await supa
    .from('transaction_results')
    .select('*')
    .order('closed_at', { ascending: false })
    .limit(50)

  /* ── Alertes documents bloquants ── */
  const { data: blockingDocs } = await supa
    .from('data_room_documents')
    .select('document_code, admin_quality, file_name')
    .eq('asset_id', id)
    .eq('required_level', 'blocking')
    .in('admin_quality', ['missing', 'insufficient'])

  const blockingAlerts = (blockingDocs ?? []) as {
    document_code: string | null
    admin_quality: string
    file_name: string
  }[]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link href={`/admin/assets${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              ← Assets
            </Link>
            <Link href={`/admin/assets/${id}/documents${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              Documents {blockingAlerts.length > 0 && <span className="text-amber-500">({blockingAlerts.length})</span>}
            </Link>
            <Link href={`/admin/leads${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              Leads
            </Link>
          </div>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN — Attribution de grade officiel</p>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
            {String(a.company_name ?? a.seller_name ?? 'Actif sans nom')}
          </h1>
          <p className="text-[12px] text-gray-400 mt-1">{String(a.seller_email ?? '')} · soumis le {a.submitted_at ? new Date(String(a.submitted_at)).toLocaleDateString('fr-CH') : '—'}</p>
        </div>

        {/* Fiche déclarative vendeur */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">Données déclaratives vendeur (non vérifiées)</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { label: 'Type actif',   value: String(a.asset_type   ?? '—') },
              { label: 'Secteur',      value: String(a.sector       ?? '—') },
              { label: 'ARR déclaré',  value: fmtEur(a.arr) },
              { label: 'Croissance',   value: a.arr_growth  != null ? `${a.arr_growth}%`   : '—' },
              { label: 'Équipe',       value: a.team_size   != null ? `${a.team_size} pers.` : '—' },
              { label: 'Fondé en',     value: String(a.founded_year ?? '—') },
              { label: 'Site',         value: String(a.website      ?? '—') },
              { label: 'Prix demandé', value: fmtEur(a.asking_price) },
            ] as { label: string; value: string }[]).map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[10px] text-gray-400 mb-0.5">{label}</dt>
                <dd className="text-[12px] font-semibold text-gray-700">{value}</dd>
              </div>
            ))}
          </dl>
          {!!a.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <dt className="text-[10px] text-gray-400 mb-1">Description</dt>
              <dd className="text-[12px] text-gray-600 leading-relaxed">{`${a.description}`}</dd>
            </div>
          )}
        </div>

        {/* Formulaire grade */}
        <GradeForm
          assetId={id}
          adminToken={token ?? ''}
          blockingAlerts={blockingAlerts}
          initialStatus={String(a.status ?? 'submitted')}
          evaluationType={String(a.evaluation_type ?? 'full_certification')}
          partnerReviewerType={a.partner_reviewer_type ? String(a.partner_reviewer_type) : undefined}
          initialAsset={{
            score_code:          Number(a.score_code ?? 0),
            score_ip:            Number(a.score_ip ?? 0),
            score_finance:       Number(a.score_finance ?? 0),
            score_security:      Number(a.score_security ?? 0),
            subcodes_code:       (a.subcodes_code as string[]      | null) ?? [],
            subcodes_ip:         (a.subcodes_ip as string[]        | null) ?? [],
            subcodes_finance:    (a.subcodes_finance as string[]   | null) ?? [],
            subcodes_security:   (a.subcodes_security as string[]  | null) ?? [],
            revenue_track_months: a.revenue_track_months != null ? Number(a.revenue_track_months) : null,
            gross_margin:        a.gross_margin != null ? Number(a.gross_margin) : null,
            nrr:                 a.nrr != null ? Number(a.nrr) : null,
            benchmark_category:  (a.benchmark_category as string | null) ?? null,
            aeg_grade:           (a.aeg_grade as string | null) ?? null,
            arr:                 a.arr != null ? Number(a.arr) : null,
            sector:              a.sector ? String(a.sector) : null,
          }}
          benchmarkRows={benchmarkRows ?? []}
          transactionComps={transactionComps ?? []}
        />

      </div>
    </main>
  )
}
