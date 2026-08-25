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

  /* ── Email de confirmation ── */
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  const fromName  = process.env.RESEND_FROM_NAME ?? 'Aegryn Magazine'

  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    `${fromName} <${fromEmail}>`,
        to:      [email],
        subject: "Aegryn Magazine \u2014 You're on the list.",
        text: [
          "You're confirmed.",
          '',
          "We've registered your address for Aegryn Magazine digital access.",
          '',
          'Issue 01 — Built to Last — is available now at aegryn.com/magazine/issue-01',
          'Issue 02 — The Exit Equation — arrives in April 2027.',
          '',
          'No paywall. No advertising. Published quarterly.',
          '',
          '—',
          'Aegryn Magazine Editorial',
          'media@boha-group.com',
          'aegryn.com/magazine',
        ].join('\n'),
      }),
    }).catch(err => console.error('[report/subscribe] Resend error', err))
  } else {
    console.warn('[report/subscribe] RESEND_API_KEY not set — confirmation email skipped for', email)
  }

  return NextResponse.json({ ok: true })
}
