import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }        from '@/lib/adminAuth'

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  /* 1. Token URL (rétrocompatibilité) */
  const { searchParams } = new URL(req.url)
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && searchParams.get('token') === adminToken) return true
  /* 2. Session Supabase admin */
  const user = await getAdminUser()
  return !!user
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('site_settings')
    .select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { key: string; value: unknown }
  if (!body.key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('site_settings')
    .upsert({ key: body.key, value: body.value, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
