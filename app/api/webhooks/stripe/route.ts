/**
 * POST /api/webhooks/stripe
 * Webhook Stripe — checkout.session.completed
 *
 * Sur paiement réussi :
 *  1. Met à jour l'asset draft → evaluation_fee_paid = true, status = submitted
 *  2. Envoie les emails de confirmation (vendeur + interne)
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe                        from 'stripe'
import { createServiceClient }       from '@/lib/supabase'

export const runtime = 'nodejs'

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  const name = process.env.RESEND_FROM_NAME ?? 'AEGRYN'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      from: `${name} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to: [to],
      subject,
      text,
    }),
  })
}

export async function POST(req: NextRequest) {
  const stripeKey    = process.env.STRIPE_SECRET_KEY
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
  } catch (err) {
    console.error('[stripe/webhook] signature invalid:', err)
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  /* ── Point 7 : log systématique ── */
  console.log(`[stripe/webhook] event.type=${event.type} event.id=${event.id}`)

  const supa = createServiceClient()

  /* ══════════════════════════════════════════════════════════════════
   * 1. PAIEMENT ACTIF (évaluation vendeur — one-time)
   * ══════════════════════════════════════════════════════════════════ */
  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const meta     = session.metadata ?? {}
    const assetId  = meta.draft_asset_id
    const email    = session.customer_email ?? ''
    const paymentIntentId = session.payment_intent as string | null ?? null

    if (assetId) {
      const { data: existing } = await supa
        .from('assets')
        .select('id, evaluation_fee_paid')
        .eq('id', assetId)
        .maybeSingle()

      if (existing?.evaluation_fee_paid === true) {
        console.log(`[stripe/webhook] idempotent skip — asset ${assetId} already paid`)
        return NextResponse.json({ received: true })
      }

      const { error } = await supa
        .from('assets')
        .update({
          status:                   'submitted',
          evaluation_fee_paid:      true,
          evaluation_fee_paid_at:   new Date().toISOString(),
          stripe_payment_intent_id: paymentIntentId,
        })
        .eq('id', assetId)

      if (error) console.error('[stripe/webhook] asset update error (non-blocking):', error)

      const internal  = process.env.AEGRYN_INTERNAL_EMAIL ?? 'tech@boha-group.com'
      const typeLabel = meta.evaluationType === 'review_partner' ? 'AEGRYN Review+' : 'AEGRYN Review'

      await Promise.allSettled([
        sendEmail(
          email,
          `AEGRYN — Paiement confirmé — ${typeLabel}`,
          `Bonjour,\n\nVotre paiement ${typeLabel} a bien été reçu.\n\nNotre équipe va analyser votre dossier et vous contactera sous les délais convenus.\n\nL'équipe AEGRYN\nhttps://aegryn.com`
        ),
        sendEmail(
          internal,
          `[Paiement] ${typeLabel} — ${email}`,
          `Nouveau paiement reçu\n\nType : ${typeLabel}\nEmail : ${email}\nPartner type : ${meta.partnerType || '—'}\nAsset ID : ${assetId}\nStripe session : ${session.id}`
        ),
      ])
    } else {
      console.log(`[stripe/webhook] no draft_asset_id in metadata — may be subscription checkout, ignoring`)
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 2. ABONNEMENT EXPERT PARTENAIRE
   * ══════════════════════════════════════════════════════════════════ */
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const sub  = event.data.object as Stripe.Subscription
    const meta = sub.metadata ?? {}
    const uid  = meta.supabase_uid

    if (uid) {
      const isActive = sub.status === 'active' || sub.status === 'trialing'
      const patch: Record<string, unknown> = {
        expert_plan:             isActive ? 'active' : 'inactive',
        stripe_subscription_id:  sub.id,
      }
      if (isActive) {
        patch.expert_plan_start = new Date(sub.start_date * 1000).toISOString()
      }
      /* current_period_end est sur chaque item dans l'API Stripe 2026 */
      const periodEnd = (sub.items?.data?.[0] as unknown as Record<string, unknown> | undefined)?.current_period_end
      if (typeof periodEnd === 'number') {
        patch.expert_plan_end = new Date(periodEnd * 1000).toISOString()
      }

      const { error } = await supa.from('profiles').update(patch).eq('id', uid)
      if (error) console.error('[stripe/webhook] subscription update error:', error)
      else console.log(`[stripe/webhook] expert_plan=${patch.expert_plan} for uid=${uid}`)

      /* Email de confirmation à l'activation */
      if (event.type === 'customer.subscription.created' && isActive) {
        const { data: profile } = await supa.from('profiles').select('email').eq('id', uid).single()
        const email = (profile as Record<string, unknown> | null)?.email as string | undefined
        if (email) {
          await sendEmail(
            email,
            'AEGRYN — Votre abonnement expert est activé',
            `Bonjour,\n\nVotre abonnement expert AEGRYN est maintenant actif.\nVotre fiche expert est visible dans l'annuaire et les clients peuvent vous contacter directement.\n\nAccédez à votre espace partenaire : https://aegryn.com/client/partner\n\nL'équipe AEGRYN`
          )
        }
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const uid = sub.metadata?.supabase_uid

    if (uid) {
      const { error } = await supa.from('profiles').update({
        expert_plan:    'inactive',
        expert_plan_end: new Date().toISOString(),
      }).eq('id', uid)
      if (error) console.error('[stripe/webhook] subscription delete error:', error)
      else console.log(`[stripe/webhook] expert_plan=inactive (deleted) for uid=${uid}`)
    }
  }

  /* ── Toujours 200 après vérification signature ── */
  return NextResponse.json({ received: true })
}
