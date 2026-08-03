import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

const SOURCE_TABLE: Record<string, string> = {
  valuation:     'valuation_leads',
  catalog:       'catalog_waitlist',
  assessment:    'assessment_day_bookings',
  alliances:     'alliance_applications',
  prospects:     'prospects',
  auction_access:'auction_access_requests',
}

/**
 * DELETE /api/admin/leads
 * Body: { source: string, ids: string[] }
 */
export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? undefined
  try { await checkAdminAccess(token) }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const body   = await req.json().catch(() => ({}))
  const source: string = body?.source ?? ''
  const ids: string[]  = Array.isArray(body?.ids) ? body.ids : []

  if (!SOURCE_TABLE[source]) {
    return NextResponse.json({ error: `Source inconnue : ${source}` }, { status: 400 })
  }
  if (ids.length === 0) {
    return NextResponse.json({ error: 'Aucun id fourni' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error, count } = await supa
    .from(SOURCE_TABLE[source])
    .delete({ count: 'exact' })
    .in('id', ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, deleted: count })
}
