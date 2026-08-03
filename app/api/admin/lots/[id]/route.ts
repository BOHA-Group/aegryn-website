import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin }      from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

type Ctx = { params: Promise<{ id: string }> }

/** PATCH /api/admin/lots/[id] — mettre à jour un lot */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const allowed = ['name', 'tagline', 'catalog_context', 'status', 'lot_number', 'slug',
                   'session_opens_at', 'session_closes_at', 'reserve_price', 'buyer_premium_pct', 'access_circle']
  const update: Record<string, unknown> = {}
  for (const k of allowed) {
    if (k in body) update[k] = body[k] ?? null
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error } = await supa.from('auction_assets').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** DELETE /api/admin/lots/[id] */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { id } = await params
  const supa = createServiceClient()
  const { error } = await supa.from('auction_assets').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
