import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  const body = await req.json() as {
    token?: string
    admin_quality?: string
    admin_note?: string
    required_level?: string
  }

  if (adminToken && body.token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowed_qualities = ['pending_review', 'sufficient', 'insufficient', 'missing']
  const allowed_levels    = ['blocking', 'recommended', 'optional']

  const patch: Record<string, unknown> = {}

  if (body.admin_quality !== undefined) {
    if (!allowed_qualities.includes(body.admin_quality))
      return NextResponse.json({ error: 'Invalid admin_quality' }, { status: 400 })
    patch.admin_quality = body.admin_quality
  }

  if (body.admin_note !== undefined) patch.admin_note = body.admin_note

  if (body.required_level !== undefined) {
    if (!allowed_levels.includes(body.required_level))
      return NextResponse.json({ error: 'Invalid required_level' }, { status: 400 })
    patch.required_level = body.required_level
  }

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: 'Nothing to patch' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('data_room_documents')
    .update(patch)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
