/**
 * POST /api/advisory/lead
 *
 * Demandes issues des boutons des pages métiers ACCOMPAGNER (/advisory/*) :
 * un bouton "échange" (cadrage de 30 minutes) ou un bouton d'action
 * spécifique à la page. Chaque demande est étiquetée (métier, action) et
 * stockée dans advisory_leads (voir supabase/migrations/119_advisory_leads.sql),
 * visible dans /admin/leads.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail, emailAdvisoryLeadConfirmation } from '@/lib/sendEmail'
import { getAction, REVENUE_BANDS, type Metier, type ActionSlug } from '@/content/advisory/actions'
import { getCycleAction } from '@/content/franchir/actions'
import { ACTION_FORM_UI } from '@/content/advisory/actionForm'

const CYCLE_SLUGS = ['general', 'lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const

const schema = z.object({
  metier:   z.enum(['strategie', 'conformite', 'technologie', 'talent', 'ma', ...CYCLE_SLUGS]),
  action:   z.string().min(1).max(60),
  fullName: z.string().min(2).max(120),
  email:    z.string().email(),
  revenueBand: z.enum(['10_50m', '50_300m', 'autre']).optional(),
  sector:      z.string().max(120).optional(),
  answer:      z.string().max(2000).optional(),
  newsletterOptin: z.boolean().optional(),
  locale:   z.enum(['fr', 'en', 'de', 'es', 'it', 'nl']).optional(),
})

export async function POST(req: NextRequest) {
  let data: z.infer<typeof schema>
  try {
    data = schema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const locale = data.locale ?? 'fr'
  const isCycle = (CYCLE_SLUGS as readonly string[]).includes(data.metier)
  const actionDef = isCycle
    ? getCycleAction(locale, data.metier, data.action)
    : getAction(locale, data.metier as Metier, data.action as ActionSlug)
  const supa = createServiceClient()

  const { error: dbErr } = await supa.from('advisory_leads').insert({
    metier:           data.metier,
    action:           data.action,
    locale,
    full_name:        data.fullName,
    email:            data.email,
    revenue_band:     data.revenueBand ?? null,
    sector_cluster:   data.sector ?? null,
    answer:           data.answer ?? null,
    newsletter_optin: data.newsletterOptin ?? false,
  })
  if (dbErr) {
    console.error('[advisory/lead] Supabase error', dbErr)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  /* ── Newsletter, opt-in explicite uniquement ── */
  if (data.newsletterOptin) {
    await supa.from('newsletter_subscribers')
      .upsert({ email: data.email, locale, status: 'active', unsubscribed_at: null }, { onConflict: 'email' })
      .select('id').maybeSingle()
      .then(({ error }) => { if (error) console.error('[advisory/lead] newsletter upsert error', error) })
  }

  /* ── Notification interne ── */
  const internalTo = 'contact@boha-group.com'
  await sendEmail(
    internalTo,
    `[Aegryn ${isCycle ? 'Franchir' : 'Advisory'}] ${data.metier} / ${data.action} — ${data.fullName}`,
    `
      <p><strong>Métier :</strong> ${data.metier}</p>
      <p><strong>Action :</strong> ${actionDef?.label ?? data.action}</p>
      <p><strong>Nom :</strong> ${data.fullName}</p>
      <p><strong>Email :</strong> ${data.email}</p>
      <p><strong>Chiffre d'affaires :</strong> ${data.revenueBand ?? '—'}</p>
      <p><strong>Secteur :</strong> ${data.sector ?? '—'}</p>
      <p><strong>Réponse :</strong> ${(data.answer ?? '—').replace(/</g, '&lt;')}</p>
      <p><strong>Langue :</strong> ${locale}</p>
      <p><strong>Newsletter :</strong> ${data.newsletterOptin ? 'oui' : 'non'}</p>
    `,
    'advisory-lead-internal',
  ).catch(err => console.error('[advisory/lead] internal email error', err))

  /* ── Accusé de réception au visiteur, avec rappel de sa demande ── */
  const ui = ACTION_FORM_UI[locale] ?? ACTION_FORM_UI.fr
  const revenueLabel = (REVENUE_BANDS[locale] ?? REVENUE_BANDS.fr).find(r => r.value === data.revenueBand)?.label ?? null
  const confirmation = emailAdvisoryLeadConfirmation({
    ui: ui.email_,
    lang:        locale,
    fullName:    data.fullName,
    actionLabel: actionDef?.label ?? data.action,
    question:    actionDef?.question ?? '',
    answer:      data.answer ?? null,
    revenueLabel,
    sector:      data.sector ?? null,
  })
  await sendEmail(data.email, confirmation.subject, confirmation.html, 'advisory-lead-confirmation')
    .catch(err => console.error('[advisory/lead] confirmation email error', err))

  return NextResponse.json({ ok: true })
}
