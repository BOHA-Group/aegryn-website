/**
 * POST /api/admin/expert/subscription
 * Attribution ou prolongation manuelle d'abonnement expert par un admin.
 *
 * Body : { user_id, months, note? }
 *   months > 0 : prolonge expert_plan_end de N mois (ou démarre depuis aujourd'hui)
 *   L'admin peut agir que le partenaire ait un abonnement Stripe ou non.
 *   stripe_customer_id reste inchangé — l'admin ne bypasse pas Stripe, il complète.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { getAdminUser }              from '@/lib/adminAuth'
import { createServiceClient }       from '@/lib/supabase'
import { syncExpertVisibility }      from '@/lib/expertVisibility'

const schema = z.object({
  user_id: z.string().uuid(),
  months:  z.number().int().min(1).max(24),
  note:    z.string().max(300).optional(),
})

export async function POST(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'validation', details: parsed.error.flatten() }, { status: 400 })

  const { user_id, months, note } = parsed.data
  const supa = createServiceClient()

  const { data: profile } = await supa
    .from('profiles')
    .select('expert_plan, expert_plan_end')
    .eq('id', user_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const base   = profile.expert_plan_end && new Date(profile.expert_plan_end) > new Date()
    ? new Date(profile.expert_plan_end)
    : new Date()
  base.setMonth(base.getMonth() + months)
  const newEnd = base.toISOString()

  const [creditResult, profileResult] = await Promise.all([
    supa.from('expert_subscription_credits').insert({
      user_id,
      months,
      source:   'admin',
      note:     note ?? null,
      admin_id: admin.id,
      applied:  true,
      applied_at: new Date().toISOString(),
    }),
    supa.from('profiles').update({
      expert_plan:     'active',
      expert_plan_end: newEnd,
    }).eq('id', user_id),
  ])

  if (creditResult.error) return NextResponse.json({ error: creditResult.error.message }, { status: 500 })
  if (profileResult.error) return NextResponse.json({ error: profileResult.error.message }, { status: 500 })

  // Sync visibility : publie automatiquement si fiche approuvée + KYC OK
  const isVisible = await syncExpertVisibility(supa, user_id)

  return NextResponse.json({ ok: true, expert_plan_end: newEnd, is_visible: isVisible })
}
