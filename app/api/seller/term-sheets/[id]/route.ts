import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const PatchSchema = z.object({
  status:               z.enum(['viewed', 'accepted', 'refused', 'countered']),
  seller_response_note: z.string().max(1000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const { status, seller_response_note } = parsed.data
  const supa = createServiceClient()

  // Vérifier que la term sheet appartient à un actif du vendeur
  const { data: ts } = await supa
    .from('term_sheets')
    .select('id, status, version, asset_id, buyer_id, proposed_price_chf, assets!inner(id, owner_id, seller_uid, seller_email, company_name)')
    .eq('id', id)
    .single()

  if (!ts) return NextResponse.json({ error: 'Term sheet not found' }, { status: 404 })

  const asset = (ts.assets as unknown as { id: string; owner_id: string | null; seller_uid: string | null; seller_email: string | null; company_name: string | null } | null)
  const isOwner = asset?.owner_id === user.id || asset?.seller_uid === user.id

  if (!isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Empêcher les transitions invalides
  const allowedFrom: Record<string, string[]> = {
    viewed:    ['pending'],
    accepted:  ['pending', 'viewed'],
    refused:   ['pending', 'viewed'],
    countered: ['pending', 'viewed'],
  }
  if (!allowedFrom[status]?.includes(ts.status)) {
    return NextResponse.json({ error: `Cannot transition from '${ts.status}' to '${status}'` }, { status: 409 })
  }

  // Contre-proposition : max version 2 (1 counter allowed)
  if (status === 'countered' && ts.version >= 2) {
    return NextResponse.json({ error: 'Maximum counter-proposal rounds reached' }, { status: 409 })
  }

  const { error: updateError } = await supa
    .from('term_sheets')
    .update({
      status,
      seller_response_note: seller_response_note ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) return NextResponse.json({ error: 'Update failed' }, { status: 500 })

  // Notification acheteur
  const notifBody =
    status === 'accepted'  ? `Votre term sheet pour ${asset?.company_name ?? 'l\'actif'} a été acceptée. L\'équipe Aegryn vous contactera pour la suite.`
    : status === 'refused'   ? `Votre term sheet pour ${asset?.company_name ?? 'l\'actif'} a été refusée.${seller_response_note ? ` Note : ${seller_response_note}` : ''}`
    : status === 'countered' ? `Une contre-proposition a été émise pour ${asset?.company_name ?? 'l\'actif'}. Consultez votre espace acheteur.`
    : ''

  if (notifBody) {
    await supa.from('user_notifications').insert({
      user_id:     ts.buyer_id,
      type:        `term_sheet_${status}`,
      title:       status === 'accepted' ? 'Term Sheet acceptée' : status === 'refused' ? 'Term Sheet refusée' : 'Contre-proposition reçue',
      body:        notifBody,
      link:        `/client/buyer/propositions/${id}`,
      payload:     { term_sheet_id: id, asset_id: ts.asset_id, status },
      target_role: 'buyer',
    })
  }

  return NextResponse.json({ id, status }, { status: 200 })
}
