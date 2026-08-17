/**
 * PATCH /api/seller/light-bid/[id]
 * Vendeur — approuve ou refuse une offre de principe.
 * Body: { action: 'approve' | 'reject', seller_note?: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { getUser }                   from '@/lib/supabaseServer'

const schema = z.object({
  action:      z.enum(['approve', 'reject']),
  seller_note: z.string().max(2000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /* ── 1. Auth ── */
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { id: bidId } = await params

  /* ── 2. Body ── */
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* ── 3. Récupérer le bid + vérifier propriété vendeur ── */
  const { data: bid } = await supa
    .from('data_room_light_bids')
    .select('id, status, asset_id')
    .eq('id', bidId)
    .single() as { data: { id: string; status: string; asset_id: string } | null }

  if (!bid) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (bid.status !== 'pending_seller') {
    return NextResponse.json({ error: 'bid_not_pending' }, { status: 409 })
  }

  /* Vérifier que l'utilisateur est bien le vendeur de cet actif */
  const { data: profile } = await supa
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single() as { data: { email: string } | null }

  const { data: asset } = await supa
    .from('assets')
    .select('seller_email')
    .eq('id', bid.asset_id)
    .single() as { data: { seller_email: string } | null }

  if (!profile || !asset || profile.email !== asset.seller_email) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  /* ── 4. Mise à jour ── */
  const newStatus = body.action === 'approve' ? 'approved' : 'rejected'

  const { data: updated, error } = await supa
    .from('data_room_light_bids')
    .update({
      status:      newStatus,
      seller_note: body.seller_note ?? null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', bidId)
    .select('id, status, bid_amount_chf, sequester_amount_chf, seller_note, reviewed_at')
    .single()

  if (error || !updated) {
    console.error('[seller/light-bid PATCH]', error)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, bid: updated })
}
