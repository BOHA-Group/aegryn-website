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

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const meta     = session.metadata ?? {}
    const assetId  = meta.draft_asset_id
    const email    = session.customer_email ?? ''
    const supa     = createServiceClient()

    if (assetId) {
      const { error } = await supa
        .from('assets')
        .update({
          status:                    'submitted',
          evaluation_fee_paid:       true,
          evaluation_fee_paid_at:    new Date().toISOString(),
          stripe_payment_intent_id:  session.payment_intent as string ?? null,
        })
        .eq('id', assetId)

      if (error) console.error('[stripe/webhook] asset update:', error)

      /* Emails */
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
    }
  }

  return NextResponse.json({ received: true })
}
