/**
 * /admin/transaction/sequesters
 * Suivi des cautions bancaires (séquestres)
 */
import Link                    from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { requireAdmin }        from '@/lib/adminAuth'
import type { Metadata }       from 'next'

export const metadata: Metadata = { title: 'Séquestres — Transact Admin', robots: { index: false, follow: false } }

const STATUS_LABEL: Record<string, string> = {
  awaited:  'En attente de virement',
  received: 'Reçu et confirmé',
  released: 'Restitué',
  applied:  'Déduit (adjudicataire)',
  forfeited:'Perdu (défaillance)',
}
const STATUS_COLOR: Record<string, string> = {
  awaited:  'bg-amber-50 text-amber-700',
  received: 'bg-green-50 text-green-700',
  released: 'bg-gray-100 text-gray-500',
  applied:  'bg-blue-50 text-blue-700',
  forfeited:'bg-red-50 text-red-600',
}

export default async function TransactSequesters({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdmin()
  const { status = 'awaited' } = await searchParams

  const qs   = ''
  const supa = createServiceClient()

  let q = supa
    .from('auction_sequesters')
    .select('id, asset_id, user_id, amount_chf, status, reference, received_at, bank_ref, admin_note, created_at, auction_assets(name, lot_number)')
    .order('created_at', { ascending: false })

  if (status !== 'all') q = q.eq('status', status)

  const { data: seqs } = await q as unknown as { data: Record<string, unknown>[] | null }

  /* Totaux par statut */
  const { data: totals } = await supa
    .from('auction_sequesters')
    .select('status, amount_chf') as unknown as { data: { status: string; amount_chf: number }[] | null }

  const totalReceived = (totals ?? []).filter(t => t.status === 'received').reduce((s, t) => s + (t.amount_chf ?? 0), 0)
  const totalAwaited  = (totals ?? []).filter(t => t.status === 'awaited').reduce((s, t) => s + (t.amount_chf ?? 0), 0)

  const fmtChf = (n: number | null) => n == null ? '—' : `CHF ${new Intl.NumberFormat('fr-CH').format(n)}`

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Transact Admin</p>
            <h1 className="text-xl font-bold text-gray-900">Séquestres — Cautions bancaires</h1>
          </div>
          <Link href={`/admin/transaction${qs}`} className="text-xs text-gray-400 hover:text-gray-700">← Dashboard</Link>
        </div>

        {/* Totaux */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-green-200 rounded-sm p-5">
            <p className="text-xs text-gray-400 mb-1">Total reçu (confirmé)</p>
            <p className="text-xl font-bold text-green-700">{fmtChf(totalReceived)}</p>
          </div>
          <div className="bg-white border border-amber-200 rounded-sm p-5">
            <p className="text-xs text-gray-400 mb-1">Total en attente</p>
            <p className="text-xl font-bold text-amber-600">{fmtChf(totalAwaited)}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['awaited', 'received', 'released', 'applied', 'forfeited', 'all'].map(s => (
            <Link
              key={s}
              href={`/admin/transaction/sequesters?status=${s}`}
              className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                status === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s === 'all' ? 'Tous' : STATUS_LABEL[s]}
            </Link>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-mono uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Actif</th>
                  <th className="text-left px-4 py-3">Référence</th>
                  <th className="text-right px-4 py-3">Montant (CHF)</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-left px-4 py-3">Reçu le</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!seqs?.length ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Aucun séquestre</td></tr>
                ) : seqs.map(s => {
                  const lot = s.auction_assets as { name: string; lot_number: string } | null
                  return (
                    <tr key={s.id as string} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <p className="font-semibold text-gray-900">{lot?.name ?? '—'}</p>
                        <p className="text-gray-400">#{lot?.lot_number}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500">{s.reference as string ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">
                        {fmtChf(s.amount_chf as number)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLOR[s.status as string] ?? ''}`}>
                          {STATUS_LABEL[s.status as string] ?? s.status as string}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {s.received_at ? new Date(s.received_at as string).toLocaleDateString('fr-CH') : '—'}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link href={`/admin/transaction/sequesters/${s.id}`} className="text-blue-600 hover:underline">
                          Gérer →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
