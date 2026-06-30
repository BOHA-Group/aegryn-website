/**
 * POST /api/grade/checkout
 *
 * full_certification → passe directement à /api/grade/submit (pas de paiement)
 * review_internal    → Stripe Checkout 2 000 € HT
 * review_partner     → Stripe Checkout 5 000 € HT
 *
 * Le formulaire envoie un draft dans assets (status='pending_payment')
 * AVANT la redirection Stripe — pour ne pas perdre les données.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import Stripe                       from 'stripe'
import { createServiceClient }      from '@/lib/supabase'

const schema = z.object({
  evaluationType: z.enum(['review_internal', 'review_partner', 'full_certification']),
  partnerType:    z.enum(['legal', 'accounting']).optional(),
  locale:         z.string().max(5).default('fr'),
  /* Données actif (draft) */
  fullName:        z.string().min(2),
  email:           z.string().email(),
  company:         z.string().optional(),
  assetName:       z.string().min(1),
  assetType:       z.string(),
  assetUrl:        z.string().optional(),
  techStack:       z.string().optional(),
  status:          z.string().optional(),
  arr:             z.coerce.number().optional(),
  ipFiled:         z.string().optional(),
  motivation:      z.string().optional(),
  targetValuation: z.coerce.number().optional(),
  timeline:        z.string().optional(),
  message:         z.string().optional(),
  sourceLeadId:    z.string().uuid().optional(),
})

const PRICES: Record<string, number> = {
  review_internal: 200000,  // 2 000 € en centimes
  review_partner:  500000,  // 5 000 € en centimes
}

const LABELS: Record<string, string> = {
  review_internal: 'AEGRYN Review — Évaluation analytique (2 000 € HT)',
  review_partner:  'AEGRYN Review+ — Évaluation co-signée (5 000 € HT)',
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.boha-group.com'
    const supa    = createServiceClient()

    /* ── full_certification : pas de paiement, submit direct ── */
    if (body.evaluationType === 'full_certification') {
      return NextResponse.json({ redirect: null, direct: true })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
    }

    /* ── 1. Sauvegarder un draft avant de partir sur Stripe ── */
    const { data: draft, error: draftError } = await supa
      .from('assets')
      .insert({
        seller_name:          body.fullName,
        seller_email:         body.email,
        company_name:         body.company ?? null,
        asset_name:           body.assetName,
        asset_type:           body.assetType,
        asset_url:            body.assetUrl ?? null,
        tech_stack:           body.techStack ?? null,
        current_status:       body.status ?? null,
        arr:                  body.arr ?? null,
        ip_filed:             body.ipFiled ?? null,
        motivation:           body.motivation ?? null,
        target_valuation:     body.targetValuation ?? null,
        timeline:             body.timeline ?? null,
        message:              body.message ?? null,
        evaluation_type:      body.evaluationType,
        partner_reviewer_type: body.partnerType ?? null,
        evaluation_fee_amount: PRICES[body.evaluationType] / 100,
        evaluation_fee_paid:  false,
        locale:               body.locale,
        status:               'pending_payment',
        source_valuation_lead_id: body.sourceLeadId ?? null,
      })
      .select('id')
      .single()

    if (draftError || !draft) {
      console.error('[checkout] draft insert:', draftError)
      return NextResponse.json({ error: 'draft_failed' }, { status: 500 })
    }

    /* ── 2. Créer la Stripe Checkout Session ── */
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' })

    const session = await stripe.checkout.sessions.create({
      mode:        'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency:     'eur',
          unit_amount:  PRICES[body.evaluationType],
          product_data: {
            name:        LABELS[body.evaluationType],
            description: `Actif : ${body.assetName} — ${body.email}`,
          },
        },
      }],
      customer_email: body.email,
      metadata: {
        evaluationType:   body.evaluationType,
        partnerType:      body.partnerType ?? '',
        draft_asset_id:   draft.id,
        locale:           body.locale,
      },
      success_url: `${siteUrl}/${body.locale}/grade/submit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${siteUrl}/${body.locale}/grade/submit?cancelled=true`,
    })

    return NextResponse.json({ redirect: session.url })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
