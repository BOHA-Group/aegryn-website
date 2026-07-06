import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

const schema = z.object({
  userId:    z.string().uuid().nullable().optional(),
  email:     z.string().email(),
  fullName:  z.string().min(2).max(200),
  company:   z.string().max(200).optional(),
  buyerType: z.enum(['pe', 'strategic', 'family_office', 'individual']).optional(),
  capacity:  z.string().max(50).optional(),
  message:   z.string().max(2000).optional(),
  locale:    z.string().max(5).default('fr'),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const supa = createServiceClient()

    const { error } = await supa
      .from('auction_access_requests')
      .insert({
        user_id:    body.userId ?? null,
        email:      body.email,
        full_name:  body.fullName,
        company:    body.company    ?? null,
        buyer_type: body.buyerType  ?? null,
        capacity:   body.capacity   ?? null,
        message:    body.message    ?? null,
        locale:     body.locale,
        status:     'pending',
      })

    if (error) {
      console.error('[auction/access-request]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[auction/access-request]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
