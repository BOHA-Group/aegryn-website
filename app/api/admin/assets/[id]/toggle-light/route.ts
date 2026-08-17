/**
 * POST /api/admin/assets/[id]/toggle-light
 * Admin-only. Active ou désactive la data room light pour un actif.
 * Body: { enabled: boolean }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }      from '@/lib/supabase'
import { getAdminUser }             from '@/lib/adminAuth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /* ── 1. Admin check ── */
  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { id: assetId } = await params

  /* ── 2. Body ── */
  let enabled: boolean
  try {
    const body = await req.json() as { enabled?: boolean }
    if (typeof body.enabled !== 'boolean') throw new Error('invalid')
    enabled = body.enabled
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  /* ── 3. Update ── */
  const supa = createServiceClient()
  const { error } = await supa
    .from('assets')
    .update({ data_room_light_enabled: enabled })
    .eq('id', assetId)

  if (error) {
    console.error('[toggle-light]', error)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data_room_light_enabled: enabled })
}
