import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const schema = z.object({
  full_name: z.string().min(1).max(200),
})

export async function PATCH(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('profiles')
    .update({ full_name: parsed.data.full_name })
    .eq('id', user.id)

  if (error) {
    console.error('[client/account] update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
