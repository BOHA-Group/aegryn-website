import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'

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
  if (!res.ok) console.error('[grade/submit] Resend error', await res.text())
}

const ORG_SIZE_TEAM: Record<string, number> = { '1_10': 5, '11_20': 15, '21_100': 60, '101_500': 300, '500plus': 500 }

const schema = z.object({
  fullName:        z.string().min(2).max(100),
  email:           z.string().email(),
  company:         z.string().max(150).optional(),
  assetName:       z.string().min(1).max(200),
  assetType:       z.string().max(50),
  assetUrl:        z.string().url().optional().or(z.literal('')),
  /* ── Formulaire certification CIFSO 5000 (/grade/submit) ── */
  phone:           z.string().max(40).optional(),
  role:            z.string().max(120).optional(),
  orgSize:         z.string().max(20).optional(),
  orgCountry:      z.string().max(100).optional(),
  objective:       z.string().max(50).optional(),
  pack:            z.enum(['express', 'standard', 'premium']).optional(),
  cgvAgreed:       z.boolean().optional(),
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
    const isCertification = body.assetType === 'certification_cifso'

    /* ── 0. Lier au compte connecté si présent (espace client : Mes dossiers / Data Room) ── */
    let sellerUid: string | null = null
    try { sellerUid = (await getUser())?.id ?? null } catch { /* visiteur anonyme */ }

    /* ── 1. Vérification doublon (seller_email + company_name) ── */
    const supa = createServiceClient()
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

    /* ── 2. Insert dans la table assets ── */
    const { data: asset, error: insertError } = await supa
      .from('assets')
      .insert({
        seller_name:  body.fullName,
        seller_uid:   sellerUid,
        seller_email: body.email,
        company_name: body.assetName,
        website:      body.assetUrl || null,
        asset_type:   body.assetType,
        dossier_type: isCertification ? 'certification' : 'transaction',
        arr:          body.arr ?? null,
        sector:               body.sector             ?? null,
        arr_growth:           body.arrGrowth           ?? null,
        team_size:            body.teamSize ?? (body.orgSize ? ORG_SIZE_TEAM[body.orgSize] ?? null : null),
        founded_year:         body.foundedYear         ?? null,
        revenue_track_months: body.revenueTrackMonths  ?? null,
        gross_margin:         body.grossMargin         ?? null,
        nrr:                  body.nrr                 ?? null,
        benchmark_category:   body.benchmarkCategory   || null,
        description:  [
          body.pack        ? `Pack: ${body.pack}`         : '',
          body.objective   ? `Objectif: ${body.objective}` : '',
          body.orgSize     ? `Effectif: ${body.orgSize}`  : '',
          body.orgCountry  ? `Pays: ${body.orgCountry}`   : '',
          body.role        ? `Fonction: ${body.role}`     : '',
          body.phone       ? `Tél: ${body.phone}`         : '',
          body.cgvAgreed   ? 'CGV acceptées + NDA consenti' : '',
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
    const internal = process.env.AEGRYN_INTERNAL_EMAIL ?? 'tech@boha-group.com'
    const ref = asset?.id ?? "en cours d'attribution"
    const clientBody = isCertification
      ? `Bonjour ${body.fullName},\n\nNous avons bien reçu votre demande de Certification CIFSO 5000 pour "${body.assetName}"${body.pack ? ` (pack ${body.pack})` : ''}.\n\nProchaines étapes :\n1. Pré-qualification sous 5 jours ouvrés, puis envoi du devis et de l'accord de confidentialité (NDA).\n2. Après acceptation, ouverture de votre Data Room sécurisée pour le dépôt des pièces justificatives.\n3. Audit CIFSO sur les cinq dimensions (15 à 35 jours ouvrés selon la taille de l'organisation).\n4. Remise du certificat, du rapport détaillé et de la feuille de route dans votre espace client.\n\nSuivez l'avancement de votre dossier : https://aegryn.com/client/login\nRéférence dossier : ${ref}\n\nAegryn. Organisme de certification indépendant. Suisse.\nhttps://aegryn.com/grade/brochure`
      : `Bonjour ${body.fullName},\n\nNous avons bien reçu votre dossier de certification pour "${body.assetName}".\n\nNotre équipe va l'examiner dans les prochaines 48-72h ouvrées et vous recontactera pour planifier la phase d'audit initiale.\n\nRéférence dossier : ${ref}\n\nL'équipe Aegryn\nhttps://aegryn.com/grade`
    await Promise.allSettled([
      sendEmail(
        body.email,
        isCertification ? 'Aegryn. Votre demande de Certification CIFSO 5000 a été reçue' : 'Aegryn — Votre dossier de certification a été reçu',
        clientBody,
      ),
      sendEmail(
        internal,
        `[Grade Submit] Nouveau dossier — ${body.assetName} (${body.email}) [${body.evaluationType ?? 'full_certification'}]`,
        `Nouveau dossier de certification\nType d'évaluation : ${body.evaluationType ?? 'full_certification'}${body.partnerType ? ` — partenaire : ${body.partnerType}` : ''}\nDemandeur : ${body.fullName}${body.role ? ` (${body.role})` : ''}\nEmail : ${body.email}\nTéléphone : ${body.phone ?? '—'}\nCompte lié : ${sellerUid ?? 'non connecté'}\nOrganisation : ${body.assetName} (${body.assetType})\nEffectif : ${body.orgSize ?? '—'} · Pays : ${body.orgCountry ?? '—'}\nPack : ${body.pack ?? '—'} · Objectif : ${body.objective ?? '—'}\nSite : ${body.assetUrl || '—'}\nARR : ${body.arr ? `${body.arr}€` : '—'}\nIP : ${body.ipFiled ?? '—'}\nMotivation : ${body.motivation ?? '—'}\nTimeline : ${body.timeline ?? '—'}\nValorisation cible : ${body.targetValuation ? `${body.targetValuation}€` : '—'}\nStack : ${body.techStack ?? '—'}\nMessage : ${body.message ?? '—'}\nLocale : ${body.locale ?? '—'}\nID Supabase : ${asset?.id ?? '—'}\n\n── Données pour analyse interne (Aegryn Grading System CIFSO v4.0) ──\nSecteur : ${body.sector ?? '\u26a0\ufe0f manquant'}\nCroissance ARR YoY : ${body.arrGrowth != null ? `${body.arrGrowth}%` : '\u26a0\ufe0f manquant'}\nÉquipe : ${body.teamSize != null ? `${body.teamSize} pers.` : '\u26a0\ufe0f manquant'}\nFondé en : ${body.foundedYear ?? '\u26a0\ufe0f manquant'}\nAncienneté revenus (mois) : ${body.revenueTrackMonths ?? '\u26a0\ufe0f manquant — requis pour règles de maturité (Partie 9)'}\nMarge brute : ${body.grossMargin != null ? `${body.grossMargin}%` : '\u26a0\ufe0f manquant — requis pour benchmark marché'}\nNRR : ${body.nrr != null ? `${body.nrr}%` : '\u26a0\ufe0f manquant — requis pour benchmark marché'}\nCatégorie benchmark : ${body.benchmarkCategory ?? '\u26a0\ufe0f à déterminer par l\'analyste avant grading'}\n\nRappel checklist avant attribution du grade (/admin/assets/${asset?.id ?? '[id]'}/grade) :\n- Sous-codes C/I/F/S/O à cocher par dimension (5 dims)\n- Vérifier les conditions de refus automatique (C-40+C-34, I-18, I-21, S-17, S-37)\n- Renseigner ancienneté des revenus pour appliquer le plafond de maturité\n- Sélectionner la catégorie de benchmark marché pour comparaison`,
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
