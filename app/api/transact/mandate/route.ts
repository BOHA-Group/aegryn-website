import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

/* ── email helper (same pattern as transaction/submit) ──── */
async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  if (!key) return
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:     `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to:       [to],
      subject,
      text,
    }),
  })
  if (!res.ok) console.error('[transact/mandate] Resend error', await res.text())
}

/* ── Validation schema ─────────────────────────────────── */
const MANDATE_TYPES = ['sell', 'buy', 'fundraise', 'equity_stake'] as const
const VERTICALS     = ['saas_b2b','saas_b2c','marketplace','ecommerce','fintech','healthtech','edtech','deeptech','infra_devtools','media_content','other'] as const

const schema = z.object({
  /* ─ contact ─ */
  contactName:  z.string().min(2).max(120),
  contactEmail: z.string().email(),
  companyName:  z.string().max(120).optional(),

  /* ─ type de mandat ─ */
  type: z.enum(MANDATE_TYPES),

  /* ─ vertical ─ */
  vertical:      z.enum(VERTICALS).optional(),
  verticalOther: z.string().max(100).optional(),

  /* ─ budget / ticket (CHF) ─ */
  budgetMinChf: z.coerce.number().nonnegative().optional(),
  budgetMaxChf: z.coerce.number().nonnegative().optional(),

  /* ─ description libre ─ */
  description: z.string().max(3000).optional(),

  /* ─ critères spécifiques par type (JSONB) ─ */
  // sell      : arr_chf, yoy_growth_pct, team_size, has_ip
  // buy       : target_arr_min, target_countries, profitability
  // fundraise : current_mrr, use_of_funds, equity_offered_pct
  // equity    : stake_pct_max, partner_type, revenue_chf
  criteria: z.record(z.unknown()).optional(),

  /* ─ locale ─ */
  locale: z.string().max(5).optional(),
})

/* ── Labels lisibles pour les emails internes ──────────── */
const TYPE_LABELS: Record<typeof MANDATE_TYPES[number], string> = {
  sell:         'Mandat de cession',
  buy:          "Mandat d'acquisition",
  fundraise:    'Levée de fonds',
  equity_stake: 'Ouverture du capital',
}

function criteriaText(type: typeof MANDATE_TYPES[number], criteria?: Record<string, unknown>): string {
  if (!criteria || Object.keys(criteria).length === 0) return '—'
  const lines: string[] = []
  if (type === 'sell') {
    if (criteria.arr_chf)        lines.push(`ARR : ${criteria.arr_chf} CHF`)
    if (criteria.yoy_growth_pct) lines.push(`Croissance YoY : ${criteria.yoy_growth_pct}%`)
    if (criteria.team_size)      lines.push(`Équipe : ${criteria.team_size} pers.`)
    if (criteria.has_ip !== undefined) lines.push(`IP déposée : ${criteria.has_ip ? 'Oui' : 'Non'}`)
  } else if (type === 'buy') {
    if (criteria.target_arr_min) lines.push(`ARR cible min : ${criteria.target_arr_min} CHF`)
    if (criteria.target_countries && Array.isArray(criteria.target_countries))
      lines.push(`Pays cibles : ${(criteria.target_countries as string[]).join(', ')}`)
    if (criteria.profitability)  lines.push(`Rentabilité : ${criteria.profitability}`)
  } else if (type === 'fundraise') {
    if (criteria.current_mrr)        lines.push(`MRR actuel : ${criteria.current_mrr} CHF`)
    if (criteria.use_of_funds)       lines.push(`Usage des fonds : ${criteria.use_of_funds}`)
    if (criteria.equity_offered_pct) lines.push(`Capital offert : ${criteria.equity_offered_pct}%`)
  } else if (type === 'equity_stake') {
    if (criteria.stake_pct_max)  lines.push(`Part max cédée : ${criteria.stake_pct_max}%`)
    if (criteria.partner_type)   lines.push(`Type de partenaire : ${criteria.partner_type}`)
    if (criteria.revenue_chf)    lines.push(`CA : ${criteria.revenue_chf} CHF`)
  }
  return lines.join('\n') || JSON.stringify(criteria)
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    const supa = createServiceClient()

    /* ── Insert in mandates table ── */
    const { data: mandate, error: insertError } = await supa
      .from('mandates')
      .insert({
        contact_name:   body.contactName,
        contact_email:  body.contactEmail,
        company_name:   body.companyName  ?? null,
        type:           body.type,
        vertical:       body.vertical     ?? null,
        vertical_other: body.verticalOther ?? null,
        budget_min_chf: body.budgetMinChf ?? null,
        budget_max_chf: body.budgetMaxChf ?? null,
        description:    body.description  ?? null,
        criteria:       body.criteria     ?? null,
        source:         'transact_form',
        status:         'submitted',
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[transact/mandate] insert error:', insertError)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }

    const typeLabel = TYPE_LABELS[body.type]
    const internal  = process.env.Aegryn_INTERNAL_EMAIL ?? 'team@boha-group.com'

    await Promise.allSettled([
      /* ─ Email confirmation soumettant ─ */
      sendEmail(
        body.contactEmail,
        `Aegryn TRANSACT — Votre ${typeLabel} a été reçu`,
        `Bonjour ${body.contactName},\n\nNous avons bien reçu votre demande de ${typeLabel.toLowerCase()} via Aegryn TRANSACT.\n\nProchaine étape : notre équipe examinera votre dossier sous 48–72h ouvrées et vous contactera pour initier la procédure de qualification.\n\nType de mandat : ${typeLabel}\nRéférence : ${mandate?.id ?? "en cours d'attribution"}\n\nNote : toutes les transactions Aegryn TRANSACT opèrent sous mandat exclusif et NDA systématique, conformément au droit suisse.\n\nL'équipe Aegryn\nhttps://aegryn.com/transact`,
      ),
      /* ─ Email interne équipe ─ */
      sendEmail(
        internal,
        `[TRANSACT Mandat] ${typeLabel} — ${body.contactName} <${body.contactEmail}>`,
        `Nouvelle demande de mandat\n\nType : ${typeLabel}\nStatut : Soumis\n\n--- Contact ---\nNom : ${body.contactName}\nEmail : ${body.contactEmail}\nSociété : ${body.companyName ?? '—'}\n\n--- Actif / Cible ---\nVertical : ${body.vertical ?? '—'}\nBudget min : ${body.budgetMinChf ? `${body.budgetMinChf} CHF` : '—'}\nBudget max : ${body.budgetMaxChf ? `${body.budgetMaxChf} CHF` : '—'}\n\n--- Critères spécifiques ---\n${criteriaText(body.type, body.criteria)}\n\n--- Description ---\n${body.description ?? '—'}\n\nLocale : ${body.locale ?? '—'}\nID Supabase : ${mandate?.id ?? '—'}`,
      ),
    ])

    return NextResponse.json({ ok: true, id: mandate?.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[transact/mandate]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
