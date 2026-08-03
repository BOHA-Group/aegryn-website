import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import AssetsAdminClient       from './AssetsAdminClient'

export const metadata: Metadata = {
  title: 'Assets — AEGRYN Admin',
  robots: { index: false, follow: false },
}

const STATUS_ORDER  = ['submitted', 'under_review', 'graded', 'published', 'sold', 'withdrawn']
const EVAL_TYPES    = ['full_certification', 'review_internal', 'review_partner'] as const

function evalLabel(e: string) {
  return e === 'full_certification' ? 'Certification'
    : e === 'review_internal'       ? 'Review'
    : e === 'review_partner'        ? 'Review+'
    : e
}

export default async function AdminAssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string; eval?: string; delete?: string }>
}) {
  const params = await searchParams

  await checkAdminAccess(params.token)

  const supa   = createServiceClient()
  const status = params.status ?? 'all'
  const evalFilter = params.eval ?? 'all'

  let q = supa
    .from('assets')
    .select('id, seller_name, seller_email, company_name, asset_type, arr, official_grade, score_total, status, submitted_at, graded_at, evaluation_type')
    .order('submitted_at', { ascending: false })
    .limit(200)

  if (status !== 'all') q = q.eq('status', status)
  if (evalFilter !== 'all') q = q.eq('evaluation_type', evalFilter)

  const { data, error } = await q
  const rows = (data ?? []) as Record<string, unknown>[]

  /* counts par statut */
  const counts: Record<string, number> = {}
  await Promise.all(STATUS_ORDER.map(async s => {
    const { count } = await supa.from('assets').select('id', { count: 'exact', head: true }).eq('status', s)
    counts[s] = count ?? 0
  }))

  const tokenQs = params.token ? `?token=${params.token}` : ''

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Actifs soumis</h1>
            <p className="text-[12px] text-gray-400 mt-1">Gestion du pipeline de certification</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/catalog${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Catalogue
            </Link>
            <Link href={`/admin/leads${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              ← Leads
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}
          </div>
        )}

        {/* Sélection totale rapide */}
        {rows.length > 0 && (
          <div className="flex items-center gap-3 mb-4 text-[11px] text-gray-500">
            <span className="font-mono">{rows.length} actif{rows.length > 1 ? 's' : ''} affiché{rows.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Filtres statut */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[{ key: 'all', label: 'Tous', count: Object.values(counts).reduce((a, b) => a + b, 0) }, ...STATUS_ORDER.map(s => ({ key: s, label: s, count: counts[s] ?? 0 }))].map(({ key, label, count }) => (
            <Link key={key}
              href={`/admin/assets?status=${key}${evalFilter !== 'all' ? `&eval=${evalFilter}` : ''}${params.token ? `&token=${params.token}` : ''}`}
              className={`px-4 py-2 text-[11px] font-semibold border transition-colors flex items-center gap-2 ${
                status === key ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}>
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${status === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
            </Link>
          ))}
        </div>

        {/* Filtres type d'évaluation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', ...EVAL_TYPES] as const).map(k => (
            <Link key={k}
              href={`/admin/assets?status=${status}&eval=${k}${params.token ? `&token=${params.token}` : ''}`}
              className={`px-3 py-1.5 text-[10px] font-semibold border transition-colors ${
                evalFilter === k ? 'bg-indigo-700 text-white border-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-400 bg-white'
              }`}>
              {k === 'all' ? 'Tous types' : evalLabel(k)}
            </Link>
          ))}
        </div>

        {/* Table avec sélection + suppression */}
        <AssetsAdminClient
          rows={rows}
          adminToken={params.token ?? ''}
          tokenQs={tokenQs}
        />
      </div>
    </main>
  )
}
