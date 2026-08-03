import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin }      from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

type Ctx = { params: Promise<{ id: string }> }

/** PATCH /api/admin/sessions/[id] — mettre à jour */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const allowed = ['name', 'type', 'theme', 'session_date', 'location', 'format', 'status', 'notes']
  const update: Record<string, unknown> = {}
  for (const k of allowed) {
    if (k in body) update[k] = body[k] ?? null
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error } = await supa.from('auction_sessions').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** DELETE /api/admin/sessions/[id] */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { id } = await params
  const supa = createServiceClient()
  const { error } = await supa.from('auction_sessions').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
