/**
 * PATCH /api/admin/data-room-requests/[id]
 * Admin-only. Approuve, rejette ou révoque une demande data room light.
 * Body: { action: 'approve' | 'reject' | 'revoke', bid_amount_chf?: number, admin_note?: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { getAdminUser }              from '@/lib/adminAuth'

const schema = z.object({
  action:        z.enum(['approve', 'reject', 'revoke']),
  bid_amount_chf: z.number().positive().optional(),
  admin_note:    z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /* ── 1. Admin check ── */
  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { id: reqId } = await params

  /* ── 2. Body ── */
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* ── 3. Récupérer la demande ── */
  const { data: existing } = await supa
    .from('data_room_light_requests')
    .select('id, status, user_id, asset_id')
    .eq('id', reqId)
    .single()

  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  /* ── 4. Calculer le nouveau statut ── */
  const newStatus =
    body.action === 'approve' ? 'approved'
    : body.action === 'reject'  ? 'rejected'
    : 'revoked'

  const patch: Record<string, unknown> = {
    status:      newStatus,
    reviewed_by: adminUser.id,
    reviewed_at: new Date().toISOString(),
  }
  if (body.admin_note !== undefined) patch.admin_note = body.admin_note
  if (body.bid_amount_chf !== undefined) patch.bid_amount_chf = body.bid_amount_chf

  const { data: updated, error } = await supa
    .from('data_room_light_requests')
    .update(patch)
    .eq('id', reqId)
    .select('id, status, bid_amount_chf, admin_note, reviewed_at')
    .single()

  if (error || !updated) {
    console.error('[data-room-requests PATCH]', error)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, request: updated })
}
