/**
 * /admin/data-room-requests
 * ──────────────────────────────────────────────────────────────────
 * Gestion des demandes d'accès data room light par les acquéreurs.
 * L'admin peut approuver/rejeter + saisir le bid_amount_chf.
 */
import type { Metadata } from 'next'
import { redirect }      from 'next/navigation'
import Link              from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import DataRoomRequestsClient  from './DataRoomRequestsClient'

export const metadata: Metadata = {
  title: 'Demandes Data Room Light — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function DataRoomRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string }>
}) {
  const params = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa = createServiceClient()
  const status = params.status ?? 'pending'

  let q = supa
    .from('data_room_light_requests')
    .select(`
      id, status, bid_amount_chf, admin_note, reviewed_at, created_at,
      asset_id, user_id,
      assets ( company_name, asset_type, arr, official_grade ),
      profiles ( email, first_name, last_name, kyc_status )
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  if (status !== 'all') q = q.eq('status', status)

  const { data, error } = await q

  const rows = ((data ?? []) as unknown[]).map((item) => {
    const r = item as Record<string, unknown>
    const rawAssets   = r.assets
    const rawProfiles = r.profiles
    const assets   = Array.isArray(rawAssets)   ? rawAssets[0]   ?? null : rawAssets   ?? null
    const profiles = Array.isArray(rawProfiles) ? rawProfiles[0] ?? null : rawProfiles ?? null
    return {
      id:             String(r.id),
      status:         String(r.status),
      bid_amount_chf: r.bid_amount_chf != null ? Number(r.bid_amount_chf) : null,
      admin_note:     r.admin_note != null ? String(r.admin_note) : null,
      reviewed_at:    r.reviewed_at != null ? String(r.reviewed_at) : null,
      created_at:     String(r.created_at),
      asset_id:       String(r.asset_id),
      user_id:        String(r.user_id),
      assets:  assets  ? {
        company_name:   (assets  as Record<string, unknown>).company_name  != null ? String((assets  as Record<string, unknown>).company_name)  : null,
        asset_type:     (assets  as Record<string, unknown>).asset_type    != null ? String((assets  as Record<string, unknown>).asset_type)    : null,
        arr:            (assets  as Record<string, unknown>).arr            != null ? Number((assets  as Record<string, unknown>).arr)            : null,
        official_grade: (assets  as Record<string, unknown>).official_grade != null ? String((assets  as Record<string, unknown>).official_grade) : null,
      } : null,
      profiles: profiles ? {
        email:      (profiles as Record<string, unknown>).email      != null ? String((profiles as Record<string, unknown>).email)      : null,
        first_name: (profiles as Record<string, unknown>).first_name != null ? String((profiles as Record<string, unknown>).first_name) : null,
        last_name:  (profiles as Record<string, unknown>).last_name  != null ? String((profiles as Record<string, unknown>).last_name)  : null,
        kyc_status: (profiles as Record<string, unknown>).kyc_status != null ? String((profiles as Record<string, unknown>).kyc_status) : null,
      } : null,
    }
  })

  const STATUSES = ['pending', 'approved', 'rejected', 'revoked', 'all']

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Demandes Data Room Light</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              Approuvez les demandes et renseignez le montant indicatif (base séquestre 10%).
            </p>
          </div>
          <Link href="/admin"
            className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Admin
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}
          </div>
        )}

        {/* Filtres statut */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map(s => (
            <Link key={s}
              href={`/admin/data-room-requests?status=${s}${params.token ? `&token=${params.token}` : ''}`}
              className={`px-4 py-2 text-[11px] font-semibold border transition-colors ${
                status === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}>
              {s === 'all' ? 'Toutes' : s}
            </Link>
          ))}
        </div>

        <DataRoomRequestsClient rows={rows} />

      </div>
    </main>
  )
}
