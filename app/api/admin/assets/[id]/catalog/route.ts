import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const ALLOWED = ['public_summary', 'company_name', 'official_grade', 'score_total', 'asset_type'] as const

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const body = await req.json() as Record<string, unknown>

  if (adminToken && body.token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const patch: Record<string, unknown> = {}
  for (const field of ALLOWED) {
    if (field in body) {
      patch[field] = body[field]
    }
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error } = await supa.from('assets').update(patch).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
