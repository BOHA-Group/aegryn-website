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
      from: `${process.env.RESEND_FROM_NAME ?? 'AEGRYN'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to: [to],
      subject,
      text,
    }),
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
  evaluationType:  z.enum(['review_internal', 'review_partner', 'full_certification']).optional(),
  partnerType:     z.enum(['legal', 'accounting', 'cyber']).optional(),
  sourceLeadId:    z.string().uuid().optional(),
  /* ── Données entrantes requises pour l'analyse interne (grading system v1.0) ── */
  sector:               z.string().max(100).optional(),
  arrGrowth:            z.coerce.number().optional(),
  teamSize:             z.coerce.number().int().nonnegative().optional(),
  foundedYear:          z.coerce.number().int().optional(),
  revenueTrackMonths:   z.coerce.number().int().nonnegative().optional(),
  grossMargin:          z.coerce.number().optional(),
  nrr:                  z.coerce.number().optional(),
  benchmarkCategory:    z.string().max(50).optional(),
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
        sector:               body.sector             ?? null,
        arr_growth:           body.arrGrowth           ?? null,
        team_size:            body.teamSize            ?? null,
        founded_year:         body.foundedYear         ?? null,
        revenue_track_months: body.revenueTrackMonths  ?? null,
        gross_margin:         body.grossMargin         ?? null,
        nrr:                  body.nrr                 ?? null,
        benchmark_category:   body.benchmarkCategory   || null,
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
    const internal = process.env.AEGRYN_INTERNAL_EMAIL ?? 'team@boha-group.com'
    await Promise.allSettled([
      sendEmail(
        body.email,
        'AEGRYN — Votre dossier de certification a été reçu',
        `Bonjour ${body.fullName},\n\nNous avons bien reçu votre dossier de certification pour "${body.assetName}".\n\nNotre équipe va l'examiner dans les prochaines 48-72h ouvrées et vous recontactera pour planifier la phase d'audit initiale.\n\nRéférence dossier : ${asset?.id ?? "en cours d'attribution"}\n\nL'équipe AEGRYN\nhttps://aegryn.com/grade`,
      ),
      sendEmail(
        internal,
        `[Grade Submit] Nouveau dossier — ${body.assetName} (${body.email}) [${body.evaluationType ?? 'full_certification'}]`,
        `Nouveau dossier de certification\nType d'évaluation : ${body.evaluationType ?? 'full_certification'}${body.partnerType ? ` — partenaire : ${body.partnerType}` : ''}\nVendeur : ${body.fullName}\nEmail : ${body.email}\nActif : ${body.assetName} (${body.assetType})\nSite : ${body.assetUrl || '—'}\nARR : ${body.arr ? `${body.arr}€` : '—'}\nIP : ${body.ipFiled ?? '—'}\nMotivation : ${body.motivation ?? '—'}\nTimeline : ${body.timeline ?? '—'}\nValorisation cible : ${body.targetValuation ? `${body.targetValuation}€` : '—'}\nStack : ${body.techStack ?? '—'}\nMessage : ${body.message ?? '—'}\nLocale : ${body.locale ?? '—'}\nID Supabase : ${asset?.id ?? '—'}\n\n── Données pour analyse interne (AEGRYN Grading System v1.0) ──\nSecteur : ${body.sector ?? '\u26a0\ufe0f manquant'}\nCroissance ARR YoY : ${body.arrGrowth != null ? `${body.arrGrowth}%` : '\u26a0\ufe0f manquant'}\nÉquipe : ${body.teamSize != null ? `${body.teamSize} pers.` : '\u26a0\ufe0f manquant'}\nFondé en : ${body.foundedYear ?? '\u26a0\ufe0f manquant'}\nAncienneté revenus (mois) : ${body.revenueTrackMonths ?? '\u26a0\ufe0f manquant — requis pour règles de maturité (Partie 9)'}\nMarge brute : ${body.grossMargin != null ? `${body.grossMargin}%` : '\u26a0\ufe0f manquant — requis pour benchmark marché'}\nNRR : ${body.nrr != null ? `${body.nrr}%` : '\u26a0\ufe0f manquant — requis pour benchmark marché'}\nCatégorie benchmark : ${body.benchmarkCategory ?? '\u26a0\ufe0f à déterminer par l\'analyste avant grading'}\n\nRappel checklist avant attribution du grade (/admin/assets/${asset?.id ?? '[id]'}/grade) :\n- Sous-codes C/I/F/S à cocher par dimension\n- Vérifier les conditions de refus automatique (C-40+C-34, I-18, I-21, S-17, S-37)\n- Renseigner ancienneté des revenus pour appliquer le plafond de maturité\n- Sélectionner la catégorie de benchmark marché pour comparaison`,
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
