import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase'
import { getUser } from '@/lib/supabaseServer'

const schema = z.object({
  email:  z.string().email().optional(),
  locale: z.enum(['fr', 'en', 'de', 'es', 'it', 'nl']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const data = schema.parse(body)

    /* Utilisateur connecté → email dérivé de la session (jamais du body) */
    const user  = await getUser()
    const email = user?.email ?? data.email

    if (!email) {
      return NextResponse.json({ error: 'email_required' }, { status: 400 })
    }

    const locale = data.locale ?? 'fr'
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email,
          user_id: user?.id ?? null,
          locale,
          status: 'active',
          unsubscribed_at: null,
        },
        { onConflict: 'email' },
      )

    if (error) {
      console.error('[newsletter/subscribe] Supabase error', error)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[newsletter/subscribe] Unexpected error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
