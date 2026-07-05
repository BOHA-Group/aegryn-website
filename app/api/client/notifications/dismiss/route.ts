/**
 * POST /api/client/notifications/dismiss
 * Marque une notification comme archivée (dismissed_at = now).
 * Utilisé par les 3 espaces (buyer, seller, partner).
 *
 * Body : { id: string }  — UUID de la notification
 *         ou { all: true } — archiver toutes les notifs lues
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                          from 'zod'
import { getUser }                    from '@/lib/supabaseServer'
import { createServiceClient }        from '@/lib/supabase'

const singleSchema = z.object({ id: z.string().uuid() })
const allSchema    = z.object({ all: z.literal(true) })

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await req.json().catch(() => null)
  const supa   = createServiceClient()
  const now    = new Date().toISOString()

  // dismiss all read
  const allParsed = allSchema.safeParse(body)
  if (allParsed.success) {
    const { error } = await supa
      .from('user_notifications')
      .update({ dismissed_at: now })
      .eq('user_id', user.id)
      .not('read_at', 'is', null)
      .is('dismissed_at', null)

    if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // dismiss single
  const parsed = singleSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const { error } = await supa
    .from('user_notifications')
    .update({ dismissed_at: now })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .is('dismissed_at', null)

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
