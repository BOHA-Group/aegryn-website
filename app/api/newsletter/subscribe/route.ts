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
import { sendEmail }                 from '@/lib/sendEmail'
import { emailClientAck }            from '@/lib/emailAck'
import { ack }                       from '@/content/emails/ack'

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

  /* ── Email de confirmation, gabarit client commun, langue du visiteur ── */
  /* IMPORTANT : le token doit être présent dans l'URL — la route
     /api/newsletter/unsubscribe rejette toute requête sans ?token=. */
  const unsubUrl = `https://aegryn.com/api/newsletter/unsubscribe?token=${subRow.unsubscribe_token}`
  const a = ack('newsletter', locale)
  const confirmation = emailClientAck({
    lang: locale, subject: a.subject, kicker: a.kicker, title: a.title, intro: a.intro,
    rows: [['01', a.item1], ['02', a.item2]],
    paragraphs: [a.next],
    footerLine: `<a href="${unsubUrl}" style="color:#94a3b8;text-decoration:underline;">${a.unsubscribe}</a>`,
  })
  await sendEmail(email, confirmation.subject, confirmation.html, 'newsletter-ack')
    .catch(err => console.error('[newsletter/subscribe] Resend error', err))

  return NextResponse.json({ ok: true })
}
