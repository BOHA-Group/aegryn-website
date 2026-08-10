/**
 * POST /api/webhooks/stripe
 * Webhook Stripe — abonnements expert + paiements one-time évaluation
 *
 * Événements traités :
 *  checkout.session.completed          → activation abonnement expert OU paiement évaluation
 *  customer.subscription.created/updated → sync statut + dates
 *  customer.subscription.deleted       → désactivation
 *
 * Logique parrainage (checkout.session.completed, mode subscription) :
 *  Si l'utilisateur a un parrain (profiles.referred_by) et qu'un expert_referrals
 *  en status=pending existe, on confirme le paiement et on applique les crédits
 *  (1 mois parrain + 1 mois filleul) dès lors que le filleul a un abonnement actif.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe                        from 'stripe'
import { createServiceClient }       from '@/lib/supabase'
import { syncExpertVisibility }      from '@/lib/expertVisibility'

export const runtime = 'nodejs'

const REFERRAL_MONTHS_CAP = 6

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  const name = process.env.RESEND_FROM_NAME ?? 'Aegryn'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      from:     `${name} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to:       [to],
      subject,
      text,
    }),
  })
}

/**
 * Applique le crédit parrainage pour un filleul qui vient de payer son 1er mois.
 * Condition : filleul a un abonnement actif (expert_plan = 'active').
 * Récompense : +1 mois filleul (expert_plan_end + 30j) + +1 mois parrain (si cap non atteint).
 */
async function applyReferralReward(uid: string, periodEnd: string | null) {
  const supa = createServiceClient()

  const { data: referral } = await supa
    .from('expert_referrals')
    .select('id, referrer_id, status')
    .eq('referred_id', uid)
    .eq('status', 'pending')
    .maybeSingle()

  if (!referral) return

  const now = new Date()

  /* Crédit filleul */
  const filleulEnd = periodEnd ? new Date(periodEnd) : now
  filleulEnd.setDate(filleulEnd.getDate() + 30)

  await Promise.allSettled([
    supa.from('expert_subscription_credits').insert({
      user_id:     uid,
      months:      1,
      source:      'referral_referred',
      referral_id: referral.id,
      note:        'Mois offert parrainage — filleul',
      applied:     true,
      applied_at:  now.toISOString(),
    }),
    supa.from('profiles')
      .update({ expert_plan_end: filleulEnd.toISOString() })
      .eq('id', uid),
  ])

  /* Crédit parrain — si cap non atteint */
  const { data: sponsorProfile } = await supa
    .from('profiles')
    .select('referral_months_credit, expert_plan, expert_plan_end, email')
    .eq('id', referral.referrer_id)
    .single()

  const currentCredit = (sponsorProfile as Record<string, unknown> | null)?.referral_months_credit as number ?? 0
  const sponsorActive = (sponsorProfile as Record<string, unknown> | null)?.expert_plan === 'active'

  if (currentCredit < REFERRAL_MONTHS_CAP && sponsorActive) {
    const sponsorEnd = (sponsorProfile as Record<string, unknown> | null)?.expert_plan_end as string | null
    const newSponsorEnd = sponsorEnd ? new Date(sponsorEnd) : now
    newSponsorEnd.setDate(newSponsorEnd.getDate() + 30)

    await Promise.allSettled([
      supa.from('expert_subscription_credits').insert({
        user_id:     referral.referrer_id,
        months:      1,
        source:      'referral_sponsor',
        referral_id: referral.id,
        note:        'Mois offert parrainage — parrain',
        applied:     true,
        applied_at:  now.toISOString(),
      }),
      supa.from('profiles').update({
        referral_months_credit: currentCredit + 1,
        expert_plan_end:        newSponsorEnd.toISOString(),
      }).eq('id', referral.referrer_id),
    ])
  }

  /* Clore le referral */
  await supa.from('expert_referrals').update({
    status:              'rewarded',
    payment_confirmed_at: now.toISOString(),
    rewarded_at:         now.toISOString(),
  }).eq('id', referral.id)
}

export async function POST(req: NextRequest) {
  const stripeKey     = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
  }

  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* ══════════════════════════════════════════════════════════════════
   * 1. CHECKOUT COMPLÉTÉ (one-time évaluation OU abonnement expert)
   * ══════════════════════════════════════════════════════════════════ */
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta    = session.metadata ?? {}
    const assetId = meta.draft_asset_id
    const email   = session.customer_email ?? ''

    if (assetId) {
      /* ── One-time : paiement évaluation vendeur ── */
      const paymentIntentId = session.payment_intent as string | null ?? null

      const { data: existing } = await supa
        .from('assets')
        .select('id, evaluation_fee_paid')
        .eq('id', assetId)
        .maybeSingle()

      if (existing?.evaluation_fee_paid === true) {
        return NextResponse.json({ received: true })
      }

      await supa.from('assets').update({
        status:                   'submitted',
        evaluation_fee_paid:      true,
        evaluation_fee_paid_at:   new Date().toISOString(),
        stripe_payment_intent_id: paymentIntentId,
      }).eq('id', assetId)

      const internal  = process.env.Aegryn_INTERNAL_EMAIL ?? 'tech@boha-group.com'
      const typeLabel = meta.evaluationType === 'review_partner' ? 'Aegryn Review+' : 'Aegryn Review'

      await Promise.allSettled([
        sendEmail(
          email,
          `Aegryn — Paiement confirmé — ${typeLabel}`,
          `Bonjour,\n\nVotre paiement ${typeLabel} a bien été reçu.\n\nNotre équipe va analyser votre dossier et vous contactera sous les délais convenus.\n\nL'équipe Aegryn\nhttps://aegryn.com`
        ),
        sendEmail(
          internal,
          `[Paiement] ${typeLabel} — ${email}`,
          `Nouveau paiement reçu\n\nType : ${typeLabel}\nEmail : ${email}\nPartner type : ${meta.partnerType || '—'}\nAsset ID : ${assetId}\nStripe session : ${session.id}`
        ),
      ])

    } else if (session.mode === 'subscription' && meta.supabase_uid) {
      /* ── Abonnement expert — activation immédiate ── */
      const uid    = meta.supabase_uid
      const stripe2 = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' })
      const sub    = session.subscription
        ? await stripe2.subscriptions.retrieve(session.subscription as string)
        : null

      const periodEnd = (() => {
        const pe = (sub?.items?.data?.[0] as unknown as Record<string, unknown> | undefined)?.current_period_end
        return typeof pe === 'number' ? new Date(pe * 1000).toISOString() : null
      })()

      const patch: Record<string, unknown> = {
        expert_plan:            'active',
        expert_plan_start:      sub
          ? new Date(((sub as unknown as Record<string, unknown>).start_date as number) * 1000).toISOString()
          : new Date().toISOString(),
        stripe_subscription_id: sub?.id ?? (session.subscription as string | null),
      }
      if (periodEnd) patch.expert_plan_end = periodEnd
      const interval = (sub?.items?.data?.[0]?.plan?.interval as string | undefined) ?? null
      if (interval) patch.expert_plan_interval = interval

      await supa.from('profiles').update(patch).eq('id', uid)

      /* Hook parrainage : filleul vient de payer → appliquer les crédits */
      await applyReferralReward(uid, periodEnd)

      /* Sync visibilité fiche expert */
      await syncExpertVisibility(supa, uid)
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 2. ABONNEMENT EXPERT — MISE À JOUR / RENOUVELLEMENT
   * ══════════════════════════════════════════════════════════════════ */
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const sub  = event.data.object as Stripe.Subscription
    const uid  = sub.metadata?.supabase_uid
    if (!uid) return NextResponse.json({ received: true })

    const isActive = sub.status === 'active' || sub.status === 'trialing'
    const interval = (sub.items?.data?.[0]?.plan?.interval as string | undefined) ?? null

    /* Résiliation programmée : cancel_at_period_end=true → reste actif jusqu'à current_period_end */
    const cancelAtPeriodEnd = (sub as unknown as Record<string, unknown>).cancel_at_period_end === true
    const cancelAt          = (sub as unknown as Record<string, unknown>).cancel_at
    const cancelAtDate      = typeof cancelAt === 'number'
      ? new Date(cancelAt * 1000).toISOString()
      : null

    const patch: Record<string, unknown> = {
      expert_plan:             isActive ? 'active' : 'inactive',
      stripe_subscription_id:  sub.id,
      expert_plan_interval:    interval,
      /* NULL si renouvellement actif, date si résiliation programmée */
      expert_plan_cancel_at:   cancelAtPeriodEnd ? cancelAtDate : null,
    }
    if (isActive) patch.expert_plan_start = new Date(sub.start_date * 1000).toISOString()

    const periodEnd = (sub.items?.data?.[0] as unknown as Record<string, unknown> | undefined)?.current_period_end
    if (typeof periodEnd === 'number') patch.expert_plan_end = new Date(periodEnd * 1000).toISOString()

    await supa.from('profiles').update(patch).eq('id', uid)

    /* Sync visibilité fiche expert */
    await syncExpertVisibility(supa, uid)

    if (event.type === 'customer.subscription.created' && isActive) {
      const { data: profile } = await supa.from('profiles').select('email').eq('id', uid).single()
      const email = (profile as Record<string, unknown> | null)?.email as string | undefined
      if (email) {
        await sendEmail(
          email,
          'Aegryn — Votre abonnement expert est activé',
          `Bonjour,\n\nVotre abonnement expert Aegryn est maintenant actif.\nVotre fiche expert sera visible dans l'annuaire et les clients pourront vous contacter directement dès que votre fiche expert et votre vérification KYC seront validées.\n\nSi ces étapes sont déjà complétées, votre fiche est publiée automatiquement.\n\nAccédez à votre espace partenaire : https://aegryn.com/client/partner\n\nL'équipe Aegryn`
        )
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 3. RÉSILIATION ABONNEMENT EXPERT — fin effective
   * Stripe envoie cet événement quand la période payée est réellement
   * écoulée (après cancel_at_period_end). On utilise la date Stripe
   * (ended_at ou current_period_end) et non now() pour ne pas tronquer
   * la période déjà payée.
   * ══════════════════════════════════════════════════════════════════ */
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const uid = sub.metadata?.supabase_uid
    if (uid) {
      const subRaw    = sub as unknown as Record<string, unknown>
      const endedAt   = typeof subRaw.ended_at === 'number'
        ? new Date(subRaw.ended_at * 1000).toISOString()
        : null
      const periodEnd = (sub.items?.data?.[0] as unknown as Record<string, unknown> | undefined)?.current_period_end
      const finalEnd  = endedAt
        ?? (typeof periodEnd === 'number' ? new Date(periodEnd * 1000).toISOString() : new Date().toISOString())

      await supa.from('profiles').update({
        expert_plan:           'inactive',
        expert_plan_end:       finalEnd,
        expert_plan_cancel_at: null,
      }).eq('id', uid)
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 4. PAIEMENT ÉCHOUÉ — alerte expert + statut past_due
   * ══════════════════════════════════════════════════════════════════ */
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const invoiceRaw = invoice as unknown as Record<string, unknown>
    const subId = (invoiceRaw.subscription as string | null) ?? null
    if (subId) {
      const { data: profile } = await supa
        .from('profiles')
        .select('id, email')
        .eq('stripe_subscription_id', subId)
        .maybeSingle()

      if (profile) {
        const uid   = (profile as Record<string, unknown>).id   as string
        const email = (profile as Record<string, unknown>).email as string | undefined

        await supa.from('profiles').update({ expert_plan: 'past_due' }).eq('id', uid)

        if (email) {
          await sendEmail(
            email,
            'Aegryn — Échec de paiement de votre abonnement expert',
            `Bonjour,\n\nNous n'avons pas pu encaisser le paiement de votre abonnement expert Aegryn.\n\nVeuillez mettre à jour votre moyen de paiement dans votre espace partenaire pour éviter la suspension de votre fiche expert.\n\nAccédez à votre espace : https://aegryn.com/client/partner/subscription\n\nL'équipe Aegryn`
          )
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 5. ABONNEMENT EN PAUSE — masquer la fiche expert
   * ══════════════════════════════════════════════════════════════════ */
  if (event.type === 'customer.subscription.paused') {
    const sub = event.data.object as Stripe.Subscription
    const uid = sub.metadata?.supabase_uid
    if (uid) {
      await supa.from('profiles').update({ expert_plan: 'paused' }).eq('id', uid)

      await supa
        .from('expert_profiles')
        .update({ is_visible: false, hidden_reason: 'subscription_paused' })
        .eq('user_id', uid)
    }
  }

  return NextResponse.json({ received: true })
}
