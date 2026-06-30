/**
 * /admin/auction/bids
 * Revue des offres scellées — adjudication
 */
import { redirect }            from 'next/navigation'
import Link                    from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'

export const metadata: Metadata = { title: 'Bids — Auction Admin', robots: { index: false, follow: false } }

const STATUS_LABEL: Record<string, string> = {
  submitted:   'Soumise',
  under_review:'En examen',
  retained:    'Retenue',
  rejected:    'Rejetée',
  withdrawn:   'Retirée',
}
const STATUS_COLOR: Record<string, string> = {
  submitted:   'bg-blue-50 text-blue-700',
  under_review:'bg-amber-50 text-amber-700',
  retained:    'bg-green-50 text-green-700',
  rejected:    'bg-red-50 text-red-600',
  withdrawn:   'bg-gray-100 text-gray-500',
}

export default async function AuctionBidsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string; asset?: string }>
}) {
  const { token, status = 'submitted', asset } = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && token !== adminToken) redirect('/')

  const qs   = token ? `?token=${token}` : ''
  const supa = createServiceClient()

  /* Offres */
  let q = supa
    .from('auction_bids')
    .select('id, asset_id, user_id, bid_amount_chf, conditions, status, submitted_at, reviewed_at, admin_note, auction_assets(name, lot_number, reserve_price, session_closes_at)')
    .order('bid_amount_chf', { ascending: false })

  if (status !== 'all') q = q.eq('status', status)
  if (asset)            q = q.eq('asset_id', asset)

  const { data: bids } = await q as unknown as { data: Record<string, unknown>[] | null }

  /* Actifs pour filtre */
  const { data: lots } = await supa
    .from('auction_assets')
    .select('id, name, lot_number')
    .eq('status', 'published')

  const fmtChf = (n: number | null) => n == null ? '—' : `CHF ${new Intl.NumberFormat('fr-CH').format(n)}`

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Auction Admin</p>
            <h1 className="text-xl font-bold text-gray-900">Offres scellées — Appel d'offres fermé</h1>
          </div>
          <Link href={`/admin/auction${qs}`} className="text-xs text-gray-400 hover:text-gray-700">← Dashboard</Link>
        </div>

        {/* Note méthodologique */}
        <div className="bg-amber-50 border border-amber-200 rounded-sm px-5 py-4 mb-6 text-xs text-amber-800">
          <strong>Modèle sealed bid :</strong> Les montants des offres sont visibles uniquement par l'admin.
          La mise à prix (reserve_price) doit être atteinte pour qu'une offre soit éligible.
          En cas d'égalité, AEGRYN sélectionne sur critères qualitatifs (conditions, capacité, KYC).
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['submitted', 'under_review', 'retained', 'rejected', 'all'].map(s => (
            <Link
              key={s}
              href={`/admin/auction/bids${token ? `?token=${token}&` : '?'}status=${s}${asset ? `&asset=${asset}` : ''}`}
              className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                status === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {STATUS_LABEL[s] ?? 'Toutes'}
            </Link>
          ))}
          {lots && (
            <select
              className="ml-auto text-[11px] font-mono border border-gray-200 px-3 py-1.5 text-gray-600 bg-white"
              defaultValue={asset ?? ''}
              onChange={() => {}}
            >
              <option value="">Tous les actifs</option>
              {lots.map(l => (
                <option key={l.id} value={l.id}>{l.name} #{l.lot_number}</option>
              ))}
            </select>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-mono uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Actif</th>
                  <th className="text-right px-4 py-3">Offre (CHF)</th>
                  <th className="text-right px-4 py-3">Mise à prix</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-left px-4 py-3">Soumise</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!bids?.length ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Aucune offre</td></tr>
                ) : bids.map(b => {
                  const lotData  = b.auction_assets as { name: string; lot_number: string; reserve_price: number | null; session_closes_at: string | null } | null
                  const reserve  = lotData?.reserve_price ?? null
                  const bid      = b.bid_amount_chf as number
                  const eligible = reserve == null || bid >= reserve

                  return (
                    <tr key={b.id as string} className={`border-b border-gray-50 hover:bg-gray-50 ${!eligible ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-3">
                        <p className="font-semibold text-gray-900">{lotData?.name ?? '—'}</p>
                        <p className="text-gray-400">#{lotData?.lot_number}</p>
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-bold ${eligible ? 'text-green-700' : 'text-red-500'}`}>
                        {fmtChf(bid)}
                        {!eligible && <span className="ml-1 text-red-400 font-normal">(sous réserve)</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-400">{fmtChf(reserve)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLOR[b.status as string] ?? ''}`}>
                          {STATUS_LABEL[b.status as string] ?? b.status as string}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(b.submitted_at as string).toLocaleDateString('fr-CH')}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link href={`/admin/auction/bids/${b.id}${qs}`} className="text-blue-600 hover:underline">
                          Examiner →
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
