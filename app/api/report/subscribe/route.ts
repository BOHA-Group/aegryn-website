/**
 * POST /api/report/subscribe
 *
 * Inscrit un visiteur aux notifications de parution de Aegryn Magazine.
 * Table : report_subscribers (migration 073) — DISTINCT de newsletter_subscribers.
 *
 * Règles :
 *   - Sans compte : email obligatoire dans le body.
 *   - Avec compte connecté : email dérivé de la session ; body.email ignoré.
 *   - Idempotent : upsert sur email — réactiver un ancien abonné est autorisé.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { getUser }                   from '@/lib/supabaseServer'

export const runtime = 'nodejs'

const schema = z.object({
  email:  z.string().email().optional(),
  locale: z.enum(['fr', 'en', 'de', 'es', 'it', 'nl']).optional(),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json().catch(() => ({})))
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const user  = await getUser()
  const email = user?.email ?? body.email

  if (!email) {
    return NextResponse.json({ error: 'email_required' }, { status: 400 })
  }

  const locale = body.locale ?? 'en'
  const supa   = createServiceClient()

  const payload = {
    email,
    user_id:         user?.id ?? null,
    status:          'active',
    unsubscribed_at: null,
  }

  const [{ error: errReport }, { error: errNewsletter }] = await Promise.all([
    supa
      .from('report_subscribers')
      .upsert({ ...payload, locale }, { onConflict: 'email' }),
    supa
      .from('newsletter_subscribers')
      .upsert({ ...payload, locale: locale === 'en' ? 'fr' : locale }, { onConflict: 'email' }),
  ])

  if (errReport || errNewsletter) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
