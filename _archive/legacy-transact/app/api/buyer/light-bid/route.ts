/**
 * POST /api/buyer/light-bid
 * Soumet une offre de principe (bid_amount_chf) dans data_room_light_bids.
 *
 * Conditions :
 *  1. Utilisateur authentifié
 *  2. KYC approuvé
 *  3. Actif publié + data_room_light_enabled + data_room_light_complete
 *  4. Pas de bid déjà existant pour cet actif
 *
 * Body: { asset_id: string, bid_amount_chf: number, buyer_note?: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { getUser }                   from '@/lib/supabaseServer'

const schema = z.object({
  asset_id:       z.string().uuid(),
  bid_amount_chf: z.number().positive().min(10000),
  buyer_note:     z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  /* ── 1. Auth ── */
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  /* ── 2. Body ── */
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* ── 3. KYC check ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('kyc_status')
    .eq('id', user.id)
    .single() as { data: { kyc_status: string | null } | null }

  if (profile?.kyc_status !== 'approved') {
    return NextResponse.json({ error: 'kyc_required' }, { status: 403 })
  }

  /* ── 4. Actif valide ── */
  const { data: asset } = await supa
    .from('assets')
    .select('id, data_room_light_enabled, data_room_light_complete, status')
    .eq('id', body.asset_id)
    .eq('status', 'published')
    .single() as { data: {
      id: string
      data_room_light_enabled: boolean
      data_room_light_complete: boolean
      status: string
    } | null }

  if (!asset) return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })
  if (!asset.data_room_light_enabled)  return NextResponse.json({ error: 'light_not_enabled' }, { status: 403 })
  if (!asset.data_room_light_complete) return NextResponse.json({ error: 'light_not_ready' },   { status: 403 })

  /* ── 5. Vérifier doublon ── */
  const { data: existing } = await supa
    .from('data_room_light_bids')
    .select('id, status')
    .eq('asset_id', body.asset_id)
    .eq('bidder_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'bid_already_exists', status: existing.status }, { status: 409 })
  }

  /* ── 6. Insérer le bid ── */
  const { data: inserted, error: insertErr } = await supa
    .from('data_room_light_bids')
    .insert({
      asset_id:       body.asset_id,
      bidder_id:      user.id,
      bid_amount_chf: body.bid_amount_chf,
      buyer_note:     body.buyer_note ?? null,
      status:         'pending_seller',
    })
    .select('id, status, bid_amount_chf, sequester_amount_chf')
    .single()

  if (insertErr || !inserted) {
    console.error('[light-bid] insert:', insertErr)
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, bid: inserted })
}
