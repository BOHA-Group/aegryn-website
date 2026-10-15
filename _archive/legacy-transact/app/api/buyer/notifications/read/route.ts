import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const schema = z.object({ id: z.string().uuid() })

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('user_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .is('read_at', null)

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
