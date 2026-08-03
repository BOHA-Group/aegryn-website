import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser }      from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

type Ctx = { params: Promise<{ id: string }> }

/** GET /api/admin/sessions/[id]/results — charger session + lots */
export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supa = createServiceClient()

  const { data: session, error } = await supa
    .from('auction_sessions')
    .select('id, name, status, lots')
    .eq('id', id)
    .single()

  if (error || !session) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })

  const rawLots = Array.isArray(session.lots) ? session.lots as Record<string, unknown>[] : []

  return NextResponse.json({ session, lots: rawLots })
}

/** POST /api/admin/sessions/[id]/results — enregistrer résultats + publier */
export async function POST(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminUser())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { lots, status } = body

  const supa = createServiceClient()
  const { error } = await supa
    .from('auction_sessions')
    .update({
      lots:   lots ?? [],
      status: status ?? 'published',
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
