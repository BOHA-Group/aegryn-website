import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

/**
 * DELETE /api/admin/assets
 * Body: { ids: string[] }   — suppression en masse
 * Query: ?token=...         — auth admin
 */
export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? undefined
  try { await checkAdminAccess(token) }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const body = await req.json().catch(() => ({}))
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : []

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Aucun id fourni' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error, count } = await supa
    .from('assets')
    .delete({ count: 'exact' })
    .in('id', ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, deleted: count })
}
