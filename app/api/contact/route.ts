import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  subject: z.enum(['advisory', 'partnership', 'press', 'other']),
  message: z.string().min(10).max(5000),
  locale: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const resendKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM ?? 'contact@aegryn.com'

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
        from: `Aegryn Contact <${fromEmail}>`,
        to: ['contact@aegryn.com'],
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
      console.error('[contact] Resend error', await res.text())
      return NextResponse.json({ error: 'send_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[contact] Unexpected error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
