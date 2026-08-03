import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser }      from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

/** POST /api/admin/sessions — créer une session */
export async function POST(req: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { name, type, theme, session_date, location, format, status, notes } = body

  if (!name) return NextResponse.json({ error: 'name requis' }, { status: 400 })

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('auction_sessions')
    .insert({ name, type: type ?? 'main', theme, session_date: session_date || null, location, format: format ?? 'digital', status: status ?? 'planning', notes })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}
