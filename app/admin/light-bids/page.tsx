/**
 * /admin/light-bids
 * Gestion des offres de principe data_room_light_bids.
 * Admin confirme la réception du séquestre pour déclencher la data room complète.
 */
import type { Metadata } from 'next'
import { redirect }      from 'next/navigation'
import Link              from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import LightBidsAdminClient    from './LightBidsAdminClient'

export const metadata: Metadata = {
  title: 'Offres de principe — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function LightBidsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa   = createServiceClient()
  const status = params.status ?? 'pending_seller'

  let q = supa
    .from('data_room_light_bids')
    .select(`
      id, status, bid_amount_chf, sequester_amount_chf, buyer_note, seller_note, admin_note,
      created_at, reviewed_at, asset_id, bidder_id,
      assets ( company_name, asset_type, arr, official_grade ),
      profiles:bidder_id ( email, first_name, last_name, kyc_status )
    `)
    .order('created_at', { ascending: false })
    .limit(300)

  if (status !== 'all') q = q.eq('status', status)

  const { data, error } = await q

  const rows = ((data ?? []) as unknown[]).map((item) => {
    const r = item as Record<string, unknown>
    const rawA = r.assets;   const a = Array.isArray(rawA) ? rawA[0] ?? null : rawA ?? null
    const rawP = r.profiles; const p = Array.isArray(rawP) ? rawP[0] ?? null : rawP ?? null
    return {
      id:                   String(r.id),
      status:               String(r.status),
      bid_amount_chf:       Number(r.bid_amount_chf),
      sequester_amount_chf: Number(r.sequester_amount_chf),
      buyer_note:           r.buyer_note  != null ? String(r.buyer_note)  : null,
      seller_note:          r.seller_note != null ? String(r.seller_note) : null,
      admin_note:           r.admin_note  != null ? String(r.admin_note)  : null,
      created_at:           String(r.created_at),
      reviewed_at:          r.reviewed_at != null ? String(r.reviewed_at) : null,
      asset_id:             String(r.asset_id),
      bidder_id:            String(r.bidder_id),
      assets: a ? {
        company_name:   (a as Record<string, unknown>).company_name   != null ? String((a as Record<string, unknown>).company_name)   : null,
        asset_type:     (a as Record<string, unknown>).asset_type     != null ? String((a as Record<string, unknown>).asset_type)     : null,
        arr:            (a as Record<string, unknown>).arr             != null ? Number((a as Record<string, unknown>).arr)             : null,
        official_grade: (a as Record<string, unknown>).official_grade != null ? String((a as Record<string, unknown>).official_grade) : null,
      } : null,
      profiles: p ? {
        email:      (p as Record<string, unknown>).email      != null ? String((p as Record<string, unknown>).email)      : null,
        first_name: (p as Record<string, unknown>).first_name != null ? String((p as Record<string, unknown>).first_name) : null,
        last_name:  (p as Record<string, unknown>).last_name  != null ? String((p as Record<string, unknown>).last_name)  : null,
        kyc_status: (p as Record<string, unknown>).kyc_status != null ? String((p as Record<string, unknown>).kyc_status) : null,
      } : null,
    }
  })

  const STATUSES = ['pending_seller', 'approved', 'sequester_sent', 'sequester_received', 'rejected', 'all']

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Offres de principe</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              Confirmez la réception du séquestre pour débloquer la data room complète.
            </p>
          </div>
          <Link href="/admin" className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Admin
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map(s => (
            <Link key={s}
              href={`/admin/light-bids?status=${s}${params.token ? `&token=${params.token}` : ''}`}
              className={`px-4 py-2 text-[11px] font-semibold border transition-colors ${
                status === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}>
              {s === 'all' ? 'Toutes' : s === 'pending_seller' ? 'En attente vendeur' : s === 'sequester_sent' ? 'Séquestre signalé' : s === 'sequester_received' ? 'Séquestre reçu' : s}
            </Link>
          ))}
        </div>

        <LightBidsAdminClient rows={rows} />
      </div>
    </main>
  )
}
