/**
 * POST /api/newsletter/subscribe
 *
 * Route canonique unique pour toutes les inscriptions Aegryn :
 * - Newsletter articles (blog, insights)
 * - Magazine digital (parutions trimestrielles)
 *
 * Table : newsletter_subscribers (source de vérité unique).
 * Envoie un email de confirmation via Resend.
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

  const locale   = body.locale ?? 'fr'
  const supabase = createServiceClient()

  const { data: subRow, error: dbErr } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email, user_id: user?.id ?? null, locale, status: 'active', unsubscribed_at: null },
      { onConflict: 'email' },
    )
    .select('unsubscribe_token')
    .single()

  if (dbErr) {
    console.error('[newsletter/subscribe] Supabase error', dbErr)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  /* ── Email de confirmation ── */
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  const fromName  = process.env.RESEND_FROM_NAME ?? 'Aegryn'

  if (resendKey) {
    /* IMPORTANT : le token doit être présent dans l'URL — la route
       /api/newsletter/unsubscribe rejette toute requête sans ?token=,
       sans quoi le lien de désabonnement est toujours "invalide". */
    const unsubUrl = `https://aegryn.com/api/newsletter/unsubscribe?token=${subRow.unsubscribe_token}`
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    `${fromName} <${fromEmail}>`,
        to:      [email],
        subject: "Aegryn \u2014 Vous \u00eates inscrit(e).",
        text: [
          "Votre inscription est confirm\u00e9e.",
          '',
          "Vous recevrez d\u00e9sormais les communications Aegryn suivantes :",
          '',
          "\u2014 Articles & Insights : analyses march\u00e9, M&A, tech (fr\u00e9quence hebdomadaire)",
          "\u2014 Aegryn Magazine : chaque num\u00e9ro trimestriel d\u00e8s parution",
          '    Issue 01 \u2014 Built to Last \u2014 janvier 2027',
          '    Issue 02 \u2014 The Exit Equation \u2014 avril 2027',
          '',
          "D\u00e9sabonnement en un clic.",
          '',
          '\u2014',
          'Aegryn Editorial',
          'media@boha-group.com',
          `Se d\u00e9sabonner : ${unsubUrl}`,
        ].join('\n'),
      }),
    }).catch(err => console.error('[newsletter/subscribe] Resend error', err))
  } else {
    console.warn('[newsletter/subscribe] RESEND_API_KEY not set \u2014 confirmation skipped for', email)
  }

  return NextResponse.json({ ok: true })
}
