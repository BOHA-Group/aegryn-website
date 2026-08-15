/**
 * POST /api/intelligence/subscribe
 * Enregistre un abonné à The AEGRYN Report.
 * Insère dans newsletter_subscribers (email, source).
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'

export const runtime = 'nodejs'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const supa = createServiceClient()

  const { error } = await supa
    .from('newsletter_subscribers')
    .upsert({ email: body.email, source: 'intelligence_report' }, { onConflict: 'email' })

  if (error) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
