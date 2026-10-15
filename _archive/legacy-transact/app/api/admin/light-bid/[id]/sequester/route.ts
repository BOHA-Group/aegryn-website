/**
 * POST /api/admin/light-bid/[id]/sequester
 * Admin-only. Confirme la réception du séquestre pour un bid.
 * Passe le statut à 'sequester_received' → data room complète débloquée.
 *
 * Body: { admin_note?: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { getAdminUser }              from '@/lib/adminAuth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { id: bidId } = await params

  let adminNote: string | undefined
  try {
    const body = await req.json() as { admin_note?: string }
    adminNote = body.admin_note
  } catch { /* body optionnel */ }

  const supa = createServiceClient()

  /* Vérifier le statut courant */
  const { data: bid } = await supa
    .from('data_room_light_bids')
    .select('id, status')
    .eq('id', bidId)
    .single()

  if (!bid) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (!['approved', 'sequester_sent'].includes(bid.status)) {
    return NextResponse.json({ error: 'invalid_status', current: bid.status }, { status: 409 })
  }

  const { data: updated, error } = await supa
    .from('data_room_light_bids')
    .update({
      status:     'sequester_received',
      admin_note: adminNote ?? null,
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', bidId)
    .select('id, status, bid_amount_chf, sequester_amount_chf')
    .single()

  if (error || !updated) {
    console.error('[sequester confirm]', error)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, bid: updated })
}
