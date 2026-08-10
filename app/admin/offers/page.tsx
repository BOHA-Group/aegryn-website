import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Offres — Aegryn Admin',
  robots: { index: false, follow: false },
}

const BID_MODEL_LABEL: Record<string, string> = {
  club_deal:    'Club Deal',
  corporate:    'Corporate',
  fund:         'Fonds',
  equity_stake: 'Equity Stake',
}

function statusColor(s: string) {
  return s === 'retained'    ? 'bg-emerald-50 text-emerald-700'
    : s === 'rejected'       ? 'bg-red-50 text-red-600'
    : s === 'withdrawn'      ? 'bg-gray-100 text-gray-400'
    : s === 'under_review'   ? 'bg-blue-50 text-blue-700'
    : 'bg-yellow-50 text-yellow-700'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const { data, error } = await supa
    .from('auction_bids')
    .select('id, bid_amount_chf, bid_model, status, submitted_at, asset_id, auction_assets(name, grade)')
    .order('submitted_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as Record<string, unknown>[]

  const counts = {
    submitted:    rows.filter(r => r.status === 'submitted').length,
    under_review: rows.filter(r => r.status === 'under_review').length,
    retained:     rows.filter(r => r.status === 'retained').length,
    rejected:     rows.filter(r => r.status === 'rejected').length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Offres soumises</h1>
            <p className="text-[12px] text-gray-400 mt-1">Toutes les offres (Club Deal / Corporate / Fonds / Equity Stake) tous actifs confondus</p>
          </div>
          <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Soumises',    count: counts.submitted,    color: 'border-yellow-200 bg-yellow-50' },
            { label: 'En revue',    count: counts.under_review, color: 'border-blue-200 bg-blue-50' },
            { label: 'Retenues',    count: counts.retained,     color: 'border-emerald-200 bg-emerald-50' },
            { label: 'Rejetées',    count: counts.rejected,     color: 'border-red-200 bg-red-50' },
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

        {rows.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucune offre soumise pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Actif', 'Grade', 'Modèle', 'Montant', 'Statut', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => {
                  const asset = r.auction_assets as Record<string, unknown> | null
                  return (
                    <tr key={String(r.id)} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{fmtDate(r.submitted_at)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{String(asset?.name ?? '—')}</td>
                      <td className="px-4 py-3 font-mono font-bold">{String((asset?.grade as Record<string, unknown>)?.letter ?? '—')}</td>
                      <td className="px-4 py-3 text-[10px] uppercase tracking-wide text-gray-500">{BID_MODEL_LABEL[String(r.bid_model)] ?? String(r.bid_model ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{r.bid_amount_chf ? `${r.bid_amount_chf} CHF` : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${statusColor(String(r.status ?? ''))}`}>
                          {String(r.status ?? '—')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/offers/${r.id}${tokenQs}`}
                          className="text-[10px] font-semibold text-gray-700 border border-gray-300 px-2 py-1 hover:border-gray-500 transition-colors">
                          Ouvrir →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  )
}
