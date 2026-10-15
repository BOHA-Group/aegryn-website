import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const schema = z.object({
  introduction_type: z.enum(['asset', 'buyer']),
  contact_name:      z.string().min(1).max(200),
  contact_email:     z.string().email().max(200),
  context_note:      z.string().max(2000).nullable().optional(),
  details:           z.record(z.unknown()).optional().default({}),
})

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('introductions')
    .insert({
      partner_id:          user.id,
      introduction_type:   parsed.data.introduction_type,
      contact_name:        parsed.data.contact_name,
      contact_email:       parsed.data.contact_email,
      context_note:        parsed.data.context_note ?? null,
      details:             parsed.data.details,
      introduction_status: 'new',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create introduction' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
