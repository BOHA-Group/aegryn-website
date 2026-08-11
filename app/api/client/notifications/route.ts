/**
 * GET    /api/client/notifications       — liste des notifs + unread_count (filtrée par role query param)
 * PATCH  /api/client/notifications       — marquer lue(s)
 * DELETE /api/client/notifications       — suppression manuelle (deleted_at = now)
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                          from 'zod'
import { getUser }                    from '@/lib/supabaseServer'
import { createServiceClient }        from '@/lib/supabase'

const VALID_ROLES = ['buyer', 'seller', 'partner', 'admin'] as const
type Role = typeof VALID_ROLES[number]

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = req.nextUrl.searchParams.get('role') as Role | null

  const supa = createServiceClient()

  let query = supa
    .from('user_notifications')
    .select('id, type, title, body, link, read_at, dismissed_at, created_at, payload')
    .eq('user_id', user.id)
    .is('dismissed_at', null)
    .is('deleted_at', null)

  if (role && VALID_ROLES.includes(role)) {
    query = query.or(`target_role.eq.${role},target_role.is.null`)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })

  const notifications = data ?? []
  const unread_count  = notifications.filter(n => !n.read_at).length

  return NextResponse.json({ notifications, unread_count })
}

const patchSchema = z.union([
  z.object({ id: z.string().uuid(), action: z.literal('read') }),
  z.object({ action: z.literal('read_all') }),
])

export async function PATCH(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()
  const now  = new Date().toISOString()

  if (parsed.data.action === 'read_all') {
    const { error } = await supa
      .from('user_notifications')
      .update({ read_at: now })
      .eq('user_id', user.id)
      .is('read_at', null)
    if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const { error } = await supa
    .from('user_notifications')
    .update({ read_at: now })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .is('read_at', null)

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

const deleteSchema = z.union([
  z.object({ id: z.string().uuid() }),
  z.object({ all: z.literal(true) }),
])

export async function DELETE(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await req.json().catch(() => null)
  const parsed = deleteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()
  const now  = new Date().toISOString()

  if ('all' in parsed.data) {
    const { error } = await supa
      .from('user_notifications')
      .update({ deleted_at: now })
      .eq('user_id', user.id)
      .is('deleted_at', null)
    if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const { error } = await supa
    .from('user_notifications')
    .update({ deleted_at: now })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
