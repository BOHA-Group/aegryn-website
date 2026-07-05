import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Transactions — AEGRYN Admin',
  robots: { index: false, follow: false },
}

const STATUS_LABEL: Record<string, string> = {
  ei_submitted:   'EI soumise',
  ap_signed:      'AP signé',
  escrow_paid:    'Séquestre versé',
  dd_in_progress: 'DD en cours',
  signing:        'Signing',
  closed:         'Clôturé',
  cancelled:      'Annulé',
}

function statusColor(s: string) {
  return s === 'closed'         ? 'bg-emerald-50 text-emerald-700'
    : s === 'cancelled'         ? 'bg-red-50 text-red-500'
    : s === 'signing'           ? 'bg-purple-50 text-purple-700'
    : s === 'dd_in_progress'    ? 'bg-blue-50 text-blue-700'
    : s === 'escrow_paid'       ? 'bg-teal-50 text-teal-700'
    : 'bg-yellow-50 text-yellow-700'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const { data, error } = await supa
    .from('transactions')
    .select('id, status, escrow_amount_chf, dd_deadline_at, signing_date, closed_at, created_at, asset_id, assets(name, official_grade)')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as Record<string, unknown>[]

  const counts = Object.keys(STATUS_LABEL).reduce((acc, k) => {
    acc[k] = rows.filter(r => r.status === k).length
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Transactions — Pipeline PTT</h1>
            <p className="text-[12px] text-gray-400 mt-1">Suivi manuel des transactions : EI → AP → Séquestre → DD → Signing → Closing</p>
          </div>
          <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <div key={key} className="border border-gray-200 bg-white p-4">
              <p className="text-[22px] font-bold text-gray-900">{counts[key] ?? 0}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}. La migration 017 doit être appliquée pour activer cette page.
          </div>
        )}

        {rows.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucune transaction en cours.</p>
            <p className="text-[11px] text-gray-300 mt-2">Les transactions sont créées depuis /admin/offers lors de l'acceptation d'une offre.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Créée le', 'Actif', 'Grade', 'Statut', 'Séquestre', 'DD limite', 'Signing', 'Clôturée', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => {
                  const asset = r.assets as Record<string, unknown> | null
                  return (
                    <tr key={String(r.id)} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{String(asset?.name ?? '—')}</td>
                      <td className="px-4 py-3 font-mono font-bold">{String(asset?.official_grade ?? '—')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${statusColor(String(r.status ?? ''))}`}>
                          {STATUS_LABEL[String(r.status ?? '')] ?? String(r.status ?? '—')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">
                        {r.escrow_amount_chf ? `${r.escrow_amount_chf} CHF` : '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{fmtDate(r.dd_deadline_at)}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{fmtDate(r.signing_date)}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{fmtDate(r.closed_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/transactions/${r.id}${tokenQs}`}
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
