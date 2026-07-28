/**
 * POST /api/partner/subscribe
 * Crée une Stripe Checkout Session en mode subscription pour l'abonnement expert.
 *
 * Body JSON : { plan: 'monthly' | 'yearly' }
 * Réponse   : { url: string } — URL Checkout Stripe
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe                        from 'stripe'
import { z }                         from 'zod'
import { getUser }                   from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'

export const runtime = 'nodejs'

const schema = z.object({
  plan: z.enum(['monthly', 'yearly']),
})

/* Product IDs — configurables via env, fallback sur les IDs test */
const PRODUCT_IDS = {
  monthly: process.env.STRIPE_EXPERT_PRODUCT_MONTHLY ?? 'prod_UyAZJW8rkdOnfc',
  yearly:  process.env.STRIPE_EXPERT_PRODUCT_YEARLY  ?? 'prod_UyAd25AhCMh8K0',
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })

  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'validation' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* Récupérer le profil — email + stripe_customer_id existant éventuel */
  const { data: profile } = await supa
    .from('profiles')
    .select('email, stripe_customer_id, full_name')
    .eq('id', user.id)
    .single()

  const stripe    = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' })
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
  const productId = PRODUCT_IDS[body.plan]

  /* Récupérer le price actif du produit */
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 })
  if (!prices.data.length) {
    return NextResponse.json({ error: 'no_price_found' }, { status: 500 })
  }
  const priceId = prices.data[0].id

  /* Réutiliser ou créer un customer Stripe lié à l'utilisateur */
  let customerId = (profile as Record<string, unknown> | null)?.stripe_customer_id as string | null

  if (!customerId) {
    const customer = await stripe.customers.create({
      email:    (profile as Record<string, unknown> | null)?.email as string ?? user.email ?? undefined,
      name:     (profile as Record<string, unknown> | null)?.full_name as string ?? undefined,
      metadata: { supabase_uid: user.id },
    })
    customerId = customer.id
    /* Stocker immédiatement pour éviter les doublons */
    await supa.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  /* Créer la Checkout Session */
  const session = await stripe.checkout.sessions.create({
    mode:                'subscription',
    customer:            customerId,
    line_items:          [{ price: priceId, quantity: 1 }],
    success_url:         `${siteUrl}/client/partner/subscription?success=1`,
    cancel_url:          `${siteUrl}/client/partner/subscription?canceled=1`,
    metadata: {
      supabase_uid: user.id,
      plan:         body.plan,
    },
    subscription_data: {
      metadata: {
        supabase_uid: user.id,
        plan:         body.plan,
      },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
