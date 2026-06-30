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
  const from = process.env.RESEND_FROM ?? 'contact@boha-group.com'
  const name = process.env.RESEND_FROM_NAME ?? 'AEGRYN'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ from: `${name} <${from}>`, to: [to], subject, text }),
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

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const meta     = session.metadata ?? {}
    const assetId  = meta.draft_asset_id
    const email    = session.customer_email ?? ''
    const paymentIntentId = session.payment_intent as string | null ?? null
    const supa     = createServiceClient()

    if (assetId) {
      /* ── Point 5 : idempotence — ignorer si déjà payé ── */
      const { data: existing } = await supa
        .from('assets')
        .select('id, evaluation_fee_paid')
        .eq('id', assetId)
        .maybeSingle()

      if (existing?.evaluation_fee_paid === true) {
        console.log(`[stripe/webhook] idempotent skip — asset ${assetId} already paid`)
        return NextResponse.json({ received: true })
      }

      /* ── Point 4 : erreur Supabase → 200 quand même, logger ── */
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

      /* Emails — Point 4 : erreurs email non-bloquantes */
      const internal  = process.env.AEGRYN_INTERNAL_EMAIL ?? 'tech@boha-group.com'
      const typeLabel = meta.evaluationType === 'review_partner' ? 'AEGRYN Review+' : 'AEGRYN Review'

      await Promise.allSettled([
        sendEmail(
          email,
          `AEGRYN — Paiement confirmé — ${typeLabel}`,
          `Bonjour,\n\nVotre paiement ${typeLabel} a bien été reçu.\n\nNotre équipe va analyser votre dossier et vous contactera sous les délais convenus.\n\nL'équipe AEGRYN\nhttps://aegryn.boha-group.com`
        ),
        sendEmail(
          internal,
          `[Paiement] ${typeLabel} — ${email}`,
          `Nouveau paiement reçu\n\nType : ${typeLabel}\nEmail : ${email}\nPartner type : ${meta.partnerType || '—'}\nAsset ID : ${assetId}\nStripe session : ${session.id}`
        ),
      ])
    } else {
      /* Test webhook Stripe sans metadata.draft_asset_id — ignorer silencieusement */
      console.log(`[stripe/webhook] no draft_asset_id in metadata — test event, ignoring`)
    }
  }

  /* ── Point 4 : toujours 200 après vérification de signature réussie ── */
  return NextResponse.json({ received: true })
}
