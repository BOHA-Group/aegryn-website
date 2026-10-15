import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/sendEmail'
import { getNdaNotifyEmail } from '@/lib/nda/config'
import { emailClientAck } from '@/lib/emailAck'
import { ack } from '@/content/emails/ack'
import { Aegryn_ASSETS } from '@/data/assets'
import {
  CONTACT_SUBJECTS, LEGACY_SUBJECTS, FIELD_LABELS, NDA_ROLE_BY_SUBJECT, SUBJECT_LABEL_FR, describeExtra, normalizeLang,
  type ContactSubject,
} from '@/content/contact/fields'

/** Lien admin de création du NDA, prérempli depuis la demande de contact */
function ndaCreationLink(d: { name: string; email: string; subject: string }): string {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
  const q = new URLSearchParams({
    new: '1', name: d.name, email: d.email,
    project: `${SUBJECT_LABEL_FR[d.subject] ?? 'Projet'} (${d.name})`,
    role: NDA_ROLE_BY_SUBJECT[d.subject as ContactSubject] ?? 'project_owner',
  })
  return `${site}/admin/nda?${q.toString()}`
}

const ASSET_NAMES = Object.fromEntries(Aegryn_ASSETS.map(a => [a.id, a.name]))

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  subject: z.enum([...CONTACT_SUBJECTS, ...LEGACY_SUBJECTS]),
  message: z.string().min(10).max(5000),
  locale: z.string().optional(),
  /** Libellé lisible du sujet, fourni par le formulaire dans la langue du visiteur */
  subjectLabel: z.string().max(100).optional(),
  phone: z.string().max(40).optional(),
  /** Cycle de vie FRANCHIR prérempli via ?cycle= (liens talent) */
  cycle: z.string().max(40).optional(),
  /** Champs additionnels du sujet choisi (facultatifs), clés connues uniquement */
  extra: z.record(z.string().max(300)).optional()
    .refine(v => !v || (Object.keys(v).length <= 8 && Object.keys(v).every(k => k in FIELD_LABELS)), 'extra'),
  /** Case « accord de confidentialité avant d'écrire plus » : NDA projet à envoyer */
  ndaRequested: z.boolean().optional(),
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
        to: [...new Set([internalTo, ...(data.ndaRequested ? [getNdaNotifyEmail()] : [])])],
        reply_to: data.email,
        subject: `[Aegryn]${data.ndaRequested ? ' [NDA projet]' : ''} ${SUBJECT_LABEL_FR[data.subject] ?? data.subject} - ${data.name}`,
        text: `
Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone ?? '-'}
Entreprise: ${data.company ?? '-'}
Sujet: ${SUBJECT_LABEL_FR[data.subject] ?? data.subject}
Cycle: ${data.cycle ?? '-'}
Locale: ${data.locale ?? '-'}
${describeExtra(data.extra, 'fr', ASSET_NAMES).map(([k, v]) => `${k}: ${v}`).join('\n')}
${data.ndaRequested ? `\nNDA PROJET DEMANDÉ : accord de confidentialité à envoyer avant tout échange détaillé.\nPréparer le NDA (brouillon, envoi manuel depuis l'admin) : ${ndaCreationLink(data)}\n` : ''}
Message:
${data.message}
        `.replace(/\n{3,}/g, '\n\n').trim(),
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
      rows: [
        [a.subjectLabel, data.subjectLabel ?? data.subject],
        [a.company, data.company],
        ...describeExtra(data.extra, normalizeLang(data.locale), ASSET_NAMES),
        [a.message, data.message],
      ],
      paragraphs: [a.next, ...(data.ndaRequested ? [a.ndaNote] : [])],
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
