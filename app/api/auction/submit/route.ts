import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  if (!key) return
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to: [to],
      subject,
      text,
    }),
  })
  if (!res.ok) console.error('[auction/submit] Resend error', await res.text())
}

const schema = z.object({
  fullName:       z.string().min(2).max(100),
  email:          z.string().email(),
  company:        z.string().max(150).optional(),
  country:        z.string().max(80).optional(),
  assetName:      z.string().min(1).max(200),
  assetType:      z.string().max(50),
  assetUrl:       z.string().url().optional().or(z.literal('')),
  techStack:      z.string().max(200).optional(),
  devStage:       z.string().max(50),
  arr:            z.coerce.number().nonnegative().optional(),
  askPrice:       z.coerce.number().nonnegative().optional(),
  ipFiled:        z.enum(['yes', 'no', 'pending']).optional(),
  motivation:     z.string().max(50),
  timeline:       z.string().max(50),
  targetSession:  z.string().max(50).optional(),
  swissLawAccept: z.literal('true'),
  message:        z.string().max(2000).optional(),
  locale:         z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    const supa = createServiceClient()

    /* ── Doublon check (seller_email + company_name) ── */
    const { data: existing } = await supa
      .from('assets')
      .select('id')
      .eq('seller_email', body.email)
      .ilike('company_name', body.assetName)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'duplicate', message: 'Un actif avec ce nom a déjà été soumis pour cet email.', assetId: existing.id },
        { status: 409 }
      )
    }

    const { data: asset, error: insertError } = await supa
      .from('assets')
      .insert({
        seller_name:  body.fullName,
        seller_email: body.email,
        company_name: body.assetName,
        website:      body.assetUrl || null,
        asset_type:   body.assetType,
        arr:          body.arr ?? null,
        asking_price: body.askPrice ?? null,
        description:  [
          body.techStack     ? `Stack: ${body.techStack}`         : '',
          body.devStage      ? `Stade: ${body.devStage}`          : '',
          body.ipFiled       ? `IP: ${body.ipFiled}`              : '',
          body.motivation    ? `Motivation: ${body.motivation}`   : '',
          body.timeline      ? `Timeline: ${body.timeline}`       : '',
          body.targetSession ? `Session: ${body.targetSession}`   : '',
          body.country       ? `Pays: ${body.country}`            : '',
          body.message       ? body.message                       : '',
        ].filter(Boolean).join('\n') || null,
        locale:  body.locale ?? null,
        status:  'submitted',
      })
      .select('id')
      .single()

    if (insertError) console.error('[auction/submit] insert error:', insertError)

    const internal = process.env.Aegryn_INTERNAL_EMAIL ?? 'team@boha-group.com'
    await Promise.allSettled([
      sendEmail(
        body.email,
        'Aegryn Auction Switzerland — Votre dossier de cession a été reçu',
        `Bonjour ${body.fullName},\n\nNous avons bien reçu votre dossier de soumission pour "${body.assetName}" via Aegryn Auction Switzerland.\n\nProchaine étape : notre équipe examinera votre dossier sous 48–72h ouvrées et vous contactera pour lancer la phase de certification Aegryn Grade.\n\nNote : le droit suisse s'applique à toutes les transactions Aegryn Auction Switzerland.\n\nRéférence dossier : ${asset?.id ?? "en cours d'attribution"}\n\nL'équipe Aegryn\nhttps://aegryn.com/auction`,
      ),
      sendEmail(
        internal,
        `[Auction Submit] ${body.assetName} — ${body.email}`,
        `Nouvelle soumission Aegryn Auction Switzerland\n\nVendeur : ${body.fullName}\nEmail : ${body.email}\nPays : ${body.country ?? '—'}\nSociété : ${body.company ?? '—'}\n\nActif : ${body.assetName} (${body.assetType})\nSite : ${body.assetUrl || '—'}\nStade : ${body.devStage}\nStack : ${body.techStack ?? '—'}\nARR : ${body.arr ? `${body.arr} €` : '—'}\nPrix souhaité : ${body.askPrice ? `${body.askPrice} €` : '—'}\nIP : ${body.ipFiled ?? '—'}\nMotivation : ${body.motivation}\nTimeline : ${body.timeline}\nSession souhaitée : ${body.targetSession ?? '—'}\nMessage : ${body.message ?? '—'}\nLocale : ${body.locale ?? '—'}\nID Supabase : ${asset?.id ?? '—'}`,
      ),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[auction/submit]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
