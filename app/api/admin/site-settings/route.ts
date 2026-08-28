import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { checkAdminAccess } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  await checkAdminAccess(searchParams.get('token') ?? undefined)

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('site_settings')
    .select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  await checkAdminAccess(searchParams.get('token') ?? undefined)

  const body = await req.json() as { key: string; value: unknown }
  if (!body.key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('site_settings')
    .upsert({ key: body.key, value: body.value, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
