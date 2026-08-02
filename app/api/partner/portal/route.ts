import { NextResponse }       from 'next/server'
import Stripe                  from 'stripe'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export async function POST() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const customerId = (profile as Record<string, unknown> | null)?.stripe_customer_id as string | null
  if (!customerId) return NextResponse.json({ error: 'no_customer' }, { status: 404 })

  const stripe  = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' })
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const siteUrl   = vercelUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'

  const session = await stripe.billingPortal.sessions.create({
    customer:   customerId,
    return_url: `${siteUrl}/client/partner/subscription`,
  })

  return NextResponse.json({ url: session.url })
}
