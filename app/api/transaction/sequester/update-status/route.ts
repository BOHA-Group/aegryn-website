/**
 * POST /api/transaction/sequester/update-status
 * Admin-only. Updates the status of an auction_sequesters row (Supabase table).
 * Status 'received' → unlocks due diligence for the buyer.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { createAuthClient }          from '@/lib/supabaseServer'
import { z }                         from 'zod'

const VALID_STATUSES = ['awaited', 'received', 'released', 'applied', 'forfeited'] as const

const schema = z.object({
  sequester_id: z.string().uuid(),
  status:       z.enum(VALID_STATUSES),
  admin_note:   z.string().max(1000).optional(),
  bank_ref:     z.string().max(200).optional(),
  received_at:  z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    /* ── 1. Auth + admin role ── */
    const authClient = await createAuthClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })

    const supa = createServiceClient()
    const { data: { user: fullUser } } = await supa.auth.admin.getUserById(user.id)
    const role = (fullUser?.app_metadata as { role?: string } | undefined)?.role
    if (role !== 'admin') return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })

    /* ── 2. Validation ── */
    const body   = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })

    const { sequester_id, status, admin_note, bank_ref, received_at } = parsed.data

    /* ── 3. Fetch sequester ── */
    const { data: seq } = await supa
      .from('auction_sequesters')
      .select('id, status, user_id, asset_id, bid_id')
      .eq('id', sequester_id)
      .single()

    if (!seq) return NextResponse.json({ error: 'Séquestre introuvable.' }, { status: 404 })

    /* ── 4. Build update payload ── */
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at:  new Date().toISOString(),
      reviewed_by: user.id,
    }
    if (admin_note  !== undefined) updatePayload.admin_note  = admin_note
    if (bank_ref    !== undefined) updatePayload.bank_ref    = bank_ref
    if (status === 'received' && received_at) updatePayload.received_at = received_at
    if (status === 'received' && !received_at) updatePayload.received_at = new Date().toISOString()

    const { error: updateErr } = await supa
      .from('auction_sequesters')
      .update(updatePayload)
      .eq('id', sequester_id)

    if (updateErr) {
      console.error('[sequester/update-status]', updateErr)
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    /* ── 5. If status = 'received', update linked bid to 'due_diligence' ── */
    if (status === 'received' && seq.bid_id) {
      await supa
        .from('auction_bids')
        .update({ status: 'due_diligence', updated_at: new Date().toISOString() })
        .eq('id', seq.bid_id)
    }

    /* ── 6. If status revoked (forfeited/released), revert bid if still due_diligence ── */
    if ((status === 'forfeited' || status === 'released') && seq.bid_id) {
      await supa
        .from('auction_bids')
        .update({ status: 'retained', updated_at: new Date().toISOString() })
        .eq('id', seq.bid_id)
        .eq('status', 'due_diligence')
    }

    return NextResponse.json({ ok: true, status })
  } catch (err) {
    console.error('[sequester/update-status]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
