import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/sendEmail'
import { emailClientAck } from '@/lib/emailAck'
import { ack } from '@/content/emails/ack'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  subject: z.enum(['general', 'advisory', 'tech', 'grade', 'transaction', 'partnership', 'press', 'media', 'investor', 'career', 'other']),
  message: z.string().min(10).max(5000),
  locale: z.string().optional(),
  /** Libellé lisible du sujet, fourni par le formulaire dans la langue du visiteur */
  subjectLabel: z.string().max(100).optional(),
  phone: z.string().max(40).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const resendKey   = process.env.RESEND_API_KEY
    const fromEmail   = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
    const internalTo  = process.env.AEGRYN_INTERNAL_EMAIL ?? 'tech@boha-group.com'

    if (!resendKey) {
      console.warn('[contact] RESEND_API_KEY not set — logging submission:', data)
      return NextResponse.json({ ok: true })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${fromEmail}>`,
        to: [internalTo],
        reply_to: data.email,
        subject: `[Aegryn] ${data.subject} — ${data.name}`,
        text: `
Nom: ${data.name}
Email: ${data.email}
Entreprise: ${data.company ?? '—'}
Sujet: ${data.subject}
Locale: ${data.locale ?? '—'}

Message:
${data.message}
        `.trim(),
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('[contact] Resend error', res.status, errBody)
      return NextResponse.json({ error: 'send_failed', detail: errBody }, { status: 500 })
    }

    /* ── Accusé de réception au visiteur, gabarit client commun ── */
    const a = ack('contact', data.locale)
    const confirmation = emailClientAck({
      lang: data.locale, subject: a.subject, kicker: a.kicker, title: a.title, name: data.name, intro: a.intro,
      rows: [[a.subjectLabel, data.subjectLabel ?? data.subject], [a.company, data.company], [a.message, data.message]],
      paragraphs: [a.next],
    })
    await sendEmail(data.email, confirmation.subject, confirmation.html, 'contact-ack')
      .catch(e => console.error('[contact] ack email error', e))

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[contact] Unexpected error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
