import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import { ArrowUpRight }        from 'lucide-react'
import InviteButton            from './InviteButton'

export const metadata: Metadata = {
  title: 'Assets — AEGRYN Admin',
  robots: { index: false, follow: false },
}

const STATUS_ORDER = ['submitted', 'under_review', 'graded', 'published', 'sold', 'withdrawn']

function statusColor(s: string) {
  return s === 'submitted'    ? 'bg-blue-50 text-blue-700'
    : s === 'under_review'    ? 'bg-yellow-50 text-yellow-700'
    : s === 'graded'          ? 'bg-purple-50 text-purple-700'
    : s === 'published'       ? 'bg-emerald-50 text-emerald-700'
    : s === 'sold'            ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-500'
}

function gradeColor(g: string) {
  return g === '★'   ? 'bg-emerald-100 text-emerald-800'
    : g === 'AAA'    ? 'bg-blue-100 text-blue-800'
    : g === 'AA'     ? 'bg-green-100 text-green-800'
    : g === 'A'      ? 'bg-yellow-100 text-yellow-800'
    : g === 'B'      ? 'bg-gray-100 text-gray-700'
    : g              ? 'bg-red-50 text-red-600'
    : 'bg-gray-50 text-gray-400'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function AdminAssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string }>
}) {
  const params = await searchParams

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa   = createServiceClient()
  const status = params.status ?? 'all'

  let q = supa
    .from('assets')
    .select('id, seller_name, seller_email, company_name, asset_type, arr, official_grade, score_total, status, submitted_at, graded_at')
    .order('submitted_at', { ascending: false })
    .limit(200)

  if (status !== 'all') q = q.eq('status', status)

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

        {/* Filtres statut */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ key: 'all', label: 'Tous', count: Object.values(counts).reduce((a, b) => a + b, 0) }, ...STATUS_ORDER.map(s => ({ key: s, label: s, count: counts[s] ?? 0 }))].map(({ key, label, count }) => (
            <Link key={key}
              href={`/admin/assets?status=${key}${params.token ? `&token=${params.token}` : ''}`}
              className={`px-4 py-2 text-[11px] font-semibold border transition-colors flex items-center gap-2 ${
                status === key ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}>
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${status === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
            </Link>
          ))}
        </div>

        {/* Table */}
        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucun actif {status !== 'all' ? `au statut "${status}"` : ''}.</p>
            <p className="text-[11px] text-gray-300 mt-2">Les soumissions via /grade/submit apparaîtront ici une fois la table Supabase déployée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Soumis', 'Vendeur', 'Société', 'Type', 'ARR', 'Grade', 'Score', 'Statut', 'Accès client', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(r.submitted_at)}</td>
                    <td className="px-4 py-3">
                      <div>{String(r.seller_name ?? '—')}</div>
                      <div className="text-[11px] text-gray-400">{String(r.seller_email ?? '')}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{String(r.company_name ?? '—')}</td>
                    <td className="px-4 py-3 text-gray-600 uppercase text-[10px]">{String(r.asset_type ?? '—')}</td>
                    <td className="px-4 py-3 font-mono">
                      {r.arr ? `${Math.round(Number(r.arr) / 1000)}K€` : <em className="text-gray-300">—</em>}
                    </td>
                    <td className="px-4 py-3">
                      {r.official_grade
                        ? <span className={`px-2 py-0.5 text-[11px] font-bold ${gradeColor(String(r.official_grade))}`}>{String(r.official_grade)}</span>
                        : <span className="text-gray-300 text-[10px]">non gradé</span>}
                    </td>
                    <td className="px-4 py-3 font-mono">{r.score_total != null ? String(r.score_total) : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>
                        {String(r.status ?? '—')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <InviteButton
                        assetId={String(r.id)}
                        sellerEmail={String(r.seller_email ?? '')}
                        sellerName={String(r.seller_name ?? '')}
                        adminToken={params.token ?? ''}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/assets/${r.id}/grade${tokenQs}`}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800">
                        Grader <ArrowUpRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
