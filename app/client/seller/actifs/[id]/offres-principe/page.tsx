/**
 * /client/seller/actifs/[id]/offres-principe
 * ──────────────────────────────────────────────────────────────────
 * Liste des offres de principe (data_room_light_bids) pour cet actif.
 * Le vendeur peut approuver ou refuser chaque offre.
 */
import type { Metadata }      from 'next'
import { redirect, notFound } from 'next/navigation'
import Link                   from 'next/link'
import { ArrowLeft }          from 'lucide-react'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import SellerBidsClient        from './SellerBidsClient'

export const metadata: Metadata = {
  title: 'Offres de principe — Espace Cédant Aegryn',
  robots: { index: false, follow: false },
}

export default async function SellerOfferesPrincipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { id: assetId } = await params
  const supa = createServiceClient()

  /* Vérifier que c'est bien le vendeur */
  const { data: profile } = await supa
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single() as { data: { email: string } | null }

  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, seller_email')
    .eq('id', assetId)
    .single() as { data: { id: string; company_name: string | null; seller_email: string } | null }

  if (!asset) notFound()
  if (!profile || profile.email !== asset.seller_email) redirect('/client/seller/actifs')

  /* Offres de principe */
  const { data: bids } = await supa
    .from('data_room_light_bids')
    .select(`
      id, status, bid_amount_chf, sequester_amount_chf, buyer_note, seller_note,
      created_at, reviewed_at,
      profiles:bidder_id ( email, first_name, last_name, kyc_status )
    `)
    .eq('asset_id', assetId)
    .order('created_at', { ascending: false })

  const rows = ((bids ?? []) as unknown[]).map((item) => {
    const r = item as Record<string, unknown>
    const rawP = r.profiles
    const p    = Array.isArray(rawP) ? rawP[0] ?? null : rawP ?? null
    return {
      id:                   String(r.id),
      status:               String(r.status),
      bid_amount_chf:       Number(r.bid_amount_chf),
      sequester_amount_chf: Number(r.sequester_amount_chf),
      buyer_note:           r.buyer_note != null ? String(r.buyer_note) : null,
      seller_note:          r.seller_note != null ? String(r.seller_note) : null,
      created_at:           String(r.created_at),
      reviewed_at:          r.reviewed_at != null ? String(r.reviewed_at) : null,
      profiles: p ? {
        email:      (p as Record<string, unknown>).email      != null ? String((p as Record<string, unknown>).email)      : null,
        first_name: (p as Record<string, unknown>).first_name != null ? String((p as Record<string, unknown>).first_name) : null,
        last_name:  (p as Record<string, unknown>).last_name  != null ? String((p as Record<string, unknown>).last_name)  : null,
        kyc_status: (p as Record<string, unknown>).kyc_status != null ? String((p as Record<string, unknown>).kyc_status) : null,
      } : null,
    }
  })

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href={`/client/seller/actifs/${assetId}`}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8"
      >
        <ArrowLeft size={12} /> Retour au dossier
      </Link>

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Cédant</p>
        <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
          Offres de principe
        </h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          {asset.company_name ?? assetId.slice(0, 8)} — {rows.length} offre{rows.length !== 1 ? 's' : ''}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-10 text-center">
          <p className="font-sans text-[13px] text-gray-400">
            Aucune offre de principe reçue pour le moment. Assurez-vous que la data room light est activée et complète.
          </p>
        </div>
      ) : (
        <SellerBidsClient bids={rows} assetId={assetId} />
      )}
    </div>
  )
}
