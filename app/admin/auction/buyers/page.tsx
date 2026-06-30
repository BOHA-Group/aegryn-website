/**
 * /admin/auction/buyers
 * Suivi KYC acquéreurs + gestion accès dossier
 */
import { requireAdmin }        from '@/lib/adminAuth'
import Link                    from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'

export const metadata: Metadata = { title: 'Buyers — Auction Admin', robots: { index: false, follow: false } }

const KYC_LABEL: Record<string, string> = {
  pending:   'En attente',
  in_review: 'En examen',
  approved:  'Approuvé',
  rejected:  'Refusé',
  expired:   'Expiré',
}
const KYC_COLOR: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700',
  in_review: 'bg-blue-50 text-blue-700',
  approved:  'bg-green-50 text-green-700',
  rejected:  'bg-red-50 text-red-600',
  expired:   'bg-gray-100 text-gray-500',
}

export default async function AuctionBuyersPage({
  searchParams,
}: {
  searchParams: Promise<{ kyc?: string }>
}) {
  await requireAdmin()
  const { kyc = 'all' } = await searchParams

  const qs   = ''
  const supa = createServiceClient()

  /* KYC verifications */
  let kycQ = supa
    .from('buyer_kyc_verifications')
    .select('id, user_id, full_name, company_name, country, kyc_status, declared_capacity_min_chf, declared_capacity_max_chf, created_at, reviewed_at')
    .order('created_at', { ascending: false })

  if (kyc !== 'all') kycQ = kycQ.eq('kyc_status', kyc)

  const { data: buyers } = await kycQ

  /* Demandes dossier */
  const { data: requests } = await supa
    .from('auction_dossier_requests')
    .select('id, asset_id, user_id, status, created_at, auction_assets(name, lot_number)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20)

  const fmtChf = (n: number | null) => n == null ? '—' : `CHF ${new Intl.NumberFormat('fr-CH').format(n)}`

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Auction Admin</p>
            <h1 className="text-xl font-bold text-gray-900">Acquéreurs & KYC</h1>
          </div>
          <Link href={`/admin/auction${qs}`} className="text-xs text-gray-400 hover:text-gray-700">← Dashboard</Link>
        </div>

        {/* KYC filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'in_review', 'approved', 'rejected'].map(s => (
            <Link
              key={s}
              href={`/admin/auction/buyers?kyc=${s}`}
              className={`text-[11px] font-mono uppercase tracking-wider px-4 py-2 border transition-colors ${
                kyc === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s === 'all' ? 'Tous' : KYC_LABEL[s]}
            </Link>
          ))}
        </div>

        {/* KYC table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Vérifications KYC ({buyers?.length ?? 0})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-mono uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Acquéreur</th>
                  <th className="text-left px-4 py-3">Pays</th>
                  <th className="text-left px-4 py-3">Capacité déclarée</th>
                  <th className="text-left px-4 py-3">KYC</th>
                  <th className="text-left px-4 py-3">Soumis</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!buyers?.length ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Aucun résultat</td></tr>
                ) : buyers.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-semibold text-gray-900">{b.full_name ?? '—'}</p>
                      {b.company_name && <p className="text-gray-400">{b.company_name}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{b.country ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.declared_capacity_min_chf
                        ? `${fmtChf(b.declared_capacity_min_chf)} — ${fmtChf(b.declared_capacity_max_chf)}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${KYC_COLOR[b.kyc_status] ?? ''}`}>
                        {KYC_LABEL[b.kyc_status] ?? b.kyc_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(b.created_at).toLocaleDateString('fr-CH')}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin/auction/buyers/${b.user_id}${qs}`}
                        className="text-blue-600 hover:underline"
                      >
                        Gérer →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demandes dossier en attente */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Demandes dossier en attente ({requests?.length ?? 0})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-mono uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Actif</th>
                  <th className="text-left px-4 py-3">Acquéreur (user_id)</th>
                  <th className="text-left px-4 py-3">Soumis</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!requests?.length ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Aucune demande en attente</td></tr>
                ) : requests.map((r: Record<string, unknown>) => {
                  const asset = r.auction_assets as { name: string; lot_number: string } | null
                  return (
                    <tr key={r.id as string} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900">
                        {asset ? `${asset.name} (#${asset.lot_number})` : '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-400 truncate max-w-[180px]">{r.user_id as string}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(r.created_at as string).toLocaleDateString('fr-CH')}</td>
                      <td className="px-6 py-3 text-right">
                        <form action={`/api/auction/grant-access`} method="POST" className="inline-flex gap-2">
                          <input type="hidden" name="request_id" value={r.id as string} />
                          <Link
                            href={`/admin/auction/requests/${r.id}${qs}`}
                            className="text-blue-600 hover:underline"
                          >
                            Examiner →
                          </Link>
                        </form>
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
