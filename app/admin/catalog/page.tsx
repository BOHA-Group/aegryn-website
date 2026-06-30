import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Catalogue — AEGRYN Admin',
  robots: { index: false, follow: false },
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

function fmtEur(n: unknown) {
  if (!n) return '—'
  const v = Number(n)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M€`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K€`
  return `${Math.round(v)}€`
}

export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; action?: string; id?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  /* ── Action publish/unpublish/withdraw ── */
  if (params.action && params.id) {
    const newStatus =
      params.action === 'publish'   ? 'published'
      : params.action === 'unpublish' ? 'graded'
      : params.action === 'withdraw'  ? 'withdrawn'
      : null

    if (newStatus) {
      const update: Record<string, unknown> = { status: newStatus }
      if (newStatus === 'published') update.published_at = new Date().toISOString()
      await supa.from('assets').update(update).eq('id', params.id)
    }
    redirect(`/admin/catalog${tokenQs}`)
  }

  /* ── Fetch actifs gradés + publiés + retirés ── */
  const { data, error } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, public_summary, status, graded_at, published_at')
    .in('status', ['graded', 'published', 'withdrawn'])
    .order('graded_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as Record<string, unknown>[]

  const counts = {
    graded:    rows.filter(r => r.status === 'graded').length,
    published: rows.filter(r => r.status === 'published').length,
    withdrawn: rows.filter(r => r.status === 'withdrawn').length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Catalogue</h1>
            <p className="text-[12px] text-gray-400 mt-1">Publication des actifs gradés vers le catalogue public</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/assets${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              ← Assets
            </Link>
            <Link href={`/admin/leads${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Leads
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Gradés (en attente)',  count: counts.graded,    color: 'border-purple-200 bg-purple-50' },
            { label: 'Publiés au catalogue', count: counts.published, color: 'border-emerald-200 bg-emerald-50' },
            { label: 'Retirés',              count: counts.withdrawn, color: 'border-gray-200 bg-gray-50' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`border p-5 ${color}`}>
              <p className="text-[28px] font-bold text-gray-900">{count}</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucun actif gradé pour l'instant.</p>
            <p className="text-[11px] text-gray-300 mt-2">Attribuez un grade via /admin/assets/[id]/grade pour qu'un actif apparaisse ici.</p>
            <Link href={`/admin/assets${tokenQs}`}
              className="inline-block mt-4 text-[11px] font-semibold text-blue-600 hover:text-blue-800">
              → Aller aux assets
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Gradé le', 'Actif (anonymisé)', 'Type', 'ARR', 'Grade', 'Score', 'Résumé public', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{fmtDate(r.graded_at)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {String(r.company_name ?? `Actif #${String(r.id).slice(0, 8)}`)}
                    </td>
                    <td className="px-4 py-3 uppercase text-[10px] text-gray-500">{String(r.asset_type ?? '—')}</td>
                    <td className="px-4 py-3 font-mono">{fmtEur(r.arr)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-bold ${gradeColor(String(r.official_grade ?? ''))}`}>
                        {String(r.official_grade ?? '—')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{r.score_total != null ? `${r.score_total}/100` : '—'}</td>
                    <td className="px-4 py-3 max-w-[220px]">
                      {r.public_summary
                        ? <span className="text-gray-600 line-clamp-2">{String(r.public_summary)}</span>
                        : <span className="text-amber-500 text-[10px]">⚠ Résumé manquant</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        r.status === 'published' ? 'bg-emerald-50 text-emerald-700'
                        : r.status === 'graded'  ? 'bg-purple-50 text-purple-700'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                        {String(r.status ?? '—')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {r.status === 'graded' && (
                          <Link
                            href={`/admin/catalog?action=publish&id=${r.id}${params.token ? `&token=${params.token}` : ''}`}
                            className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-2 py-1 hover:border-emerald-400 transition-colors"
                          >
                            Publier
                          </Link>
                        )}
                        {r.status === 'published' && (
                          <Link
                            href={`/admin/catalog?action=unpublish&id=${r.id}${params.token ? `&token=${params.token}` : ''}`}
                            className="text-[10px] font-semibold text-orange-600 hover:text-orange-800 border border-orange-200 px-2 py-1 hover:border-orange-400 transition-colors"
                          >
                            Dépublier
                          </Link>
                        )}
                        <Link
                          href={`/admin/catalog?action=withdraw&id=${r.id}${params.token ? `&token=${params.token}` : ''}`}
                          className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 hover:border-gray-400 transition-colors"
                        >
                          Retirer
                        </Link>
                        <Link
                          href={`/admin/assets/${r.id}/grade${tokenQs}`}
                          className="text-[10px] font-semibold text-blue-500 hover:text-blue-700"
                        >
                          Éditer
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          <strong>Catalogue public (/auction/catalog)</strong> — affiche uniquement les actifs au statut <em>published</em>, avec résumé anonymisé. Le nom du vendeur et l'email ne sont jamais exposés.
        </div>

      </div>
    </main>
  )
}
