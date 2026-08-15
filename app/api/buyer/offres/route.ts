import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const schema = z.object({
  asset_id:   z.string().uuid(),
  amount_chf: z.number().positive(),
  message:    z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const { asset_id, amount_chf, message } = parsed.data
  const supa = createServiceClient()

  const { data: asset } = await supa
    .from('assets')
    .select('id, status')
    .eq('id', asset_id)
    .eq('status', 'published')
    .single()

  if (!asset) return NextResponse.json({ error: 'Asset not found or not published' }, { status: 404 })

  const { data: existing } = await supa
    .from('term_sheets')
    .select('id')
    .eq('asset_id', asset_id)
    .eq('buyer_id', user.id)
    .in('status', ['pending', 'viewed', 'countered'])
    .single()

  if (existing) return NextResponse.json({ error: 'Offer already exists for this asset' }, { status: 409 })

  const { data: bid, error } = await supa
    .from('term_sheets')
    .insert({
      asset_id,
      buyer_id: user.id,
      proposed_price_chf: amount_chf,
      status: 'pending',
      ...(message ? { buyer_profile_note: message } : {}),
    })
    .select('id')
    .single()

  if (error) {
    console.error('[buyer/offres] insert error:', error)
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
  }

  await supa.from('user_notifications').insert({
    user_id:     user.id,
    type:        'offer_submitted',
    title:       'Votre Expression d\'Intérêt a été soumise',
    body:        `Montant : CHF ${amount_chf.toLocaleString('fr-CH')}. L'équipe Aegryn vous répondra dans les 48h ouvrables.`,
    link:        `/client/buyer/offres/${bid.id}`,
    payload:     { bid_id: bid.id, asset_id, amount_chf },
    target_role: 'buyer',
  })

  return NextResponse.json({ id: bid.id }, { status: 201 })
}
