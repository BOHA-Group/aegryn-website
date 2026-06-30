import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'contact@aegryn.com'
  if (!key) return
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `${process.env.RESEND_FROM_NAME ?? 'AEGRYN'} <${from}>`, to: [to], subject, text }),
  })
  if (!res.ok) console.error('[grade/submit] Resend error', await res.text())
}

const schema = z.object({
  fullName:        z.string().min(2).max(100),
  email:           z.string().email(),
  company:         z.string().max(150).optional(),
  assetName:       z.string().min(1).max(200),
  assetType:       z.string().max(50),
  assetUrl:        z.string().url().optional().or(z.literal('')),
  techStack:       z.string().max(200).optional(),
  status:          z.string().max(50).optional(),
  arr:             z.coerce.number().nonnegative().optional(),
  ipFiled:         z.enum(['yes', 'no', 'pending']).optional(),
  motivation:      z.string().max(50).optional(),
  targetValuation: z.coerce.number().nonnegative().optional(),
  timeline:        z.string().max(50).optional(),
  message:         z.string().max(2000).optional(),
  locale:          z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    /* ── 1. Insert dans la table assets ── */
    const supa = createServiceClient()
    const { data: asset, error: insertError } = await supa
      .from('assets')
      .insert({
        seller_name:  body.fullName,
        seller_email: body.email,
        company_name: body.assetName,
        website:      body.assetUrl || null,
        asset_type:   body.assetType,
        arr:          body.arr ?? null,
        description:  [
          body.techStack   ? `Stack: ${body.techStack}`   : '',
          body.status      ? `Statut: ${body.status}`     : '',
          body.ipFiled     ? `IP: ${body.ipFiled}`        : '',
          body.motivation  ? `Motivation: ${body.motivation}` : '',
          body.timeline    ? `Timeline: ${body.timeline}` : '',
          body.message     ? body.message                 : '',
        ].filter(Boolean).join('\n') || null,
        asking_price: body.targetValuation ?? null,
        locale:       body.locale ?? null,
        status:       'submitted',
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[grade/submit] insert error:', insertError)
    }

    /* ── 2. Emails ── */
    const internal = process.env.AEGRYN_INTERNAL_EMAIL ?? 'team@aegryn.com'
    await Promise.allSettled([
      sendEmail(
        body.email,
        'AEGRYN — Votre dossier de certification a été reçu',
        `Bonjour ${body.fullName},\n\nNous avons bien reçu votre dossier de certification pour "${body.assetName}".\n\nNotre équipe va l'examiner dans les prochaines 48-72h ouvrées et vous recontactera pour planifier la phase d'audit initiale.\n\nRéférence dossier : ${asset?.id ?? "en cours d'attribution"}\n\nL'équipe AEGRYN\nhttps://aegryn.com/grade`,
      ),
      sendEmail(
        internal,
        `[Grade Submit] Nouveau dossier — ${body.assetName} (${body.email})`,
        `Nouveau dossier de certification\nVendeur : ${body.fullName}\nEmail : ${body.email}\nActif : ${body.assetName} (${body.assetType})\nSite : ${body.assetUrl || '—'}\nARR : ${body.arr ? `${body.arr}€` : '—'}\nIP : ${body.ipFiled ?? '—'}\nMotivation : ${body.motivation ?? '—'}\nTimeline : ${body.timeline ?? '—'}\nValorisation cible : ${body.targetValuation ? `${body.targetValuation}€` : '—'}\nStack : ${body.techStack ?? '—'}\nMessage : ${body.message ?? '—'}\nLocale : ${body.locale ?? '—'}\nID Supabase : ${asset?.id ?? '—'}`,
      ),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[grade/submit]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
