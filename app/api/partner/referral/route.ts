/**
 * GET  /api/partner/referral          → état parrainage du partenaire connecté
 * POST /api/partner/referral          → valider un code parrain (filleul saisit le code)
 * DELETE /api/partner/referral?id=…   → révoquer un referral en pending (parrain annule)
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { getUser }                   from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'

const REFERRAL_MONTHS_CAP = 6
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let code = ''
  for (let i = 0; i < 8; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return code
}

/* ── GET ── */
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const supa = createServiceClient()

  /* Générer le code parrain si absent */
  let { data: profile } = await supa
    .from('profiles')
    .select('referral_code, referral_months_credit, referred_by, expert_plan, expert_plan_end')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'profile_not_found' }, { status: 404 })

  if (!profile.referral_code) {
    let code = generateCode()
    let attempts = 0
    while (attempts < 5) {
      const { error } = await supa.from('profiles').update({ referral_code: code }).eq('id', user.id)
      if (!error) break
      code = generateCode()
      attempts++
    }
    profile = { ...profile, referral_code: code }
  }

  /* Filleuls parrainés */
  const { data: referrals } = await supa
    .from('expert_referrals')
    .select('id, referred_id, status, code_used_at, code_expires_at, payment_confirmed_at, rewarded_at')
    .eq('referrer_id', user.id)
    .order('code_used_at', { ascending: false })

  /* Crédits reçus */
  const { data: credits } = await supa
    .from('expert_subscription_credits')
    .select('id, months, source, note, applied, applied_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  /* Statut filleul (suis-je moi-même un filleul ?) */
  let filleulStatus = null
  if (profile.referred_by) {
    const { data: myReferral } = await supa
      .from('expert_referrals')
      .select('status, payment_confirmed_at, rewarded_at, code_expires_at')
      .eq('referred_id', user.id)
      .maybeSingle()
    filleulStatus = myReferral
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'

  return NextResponse.json({
    referral_code:          profile.referral_code,
    referral_link:          `${siteUrl}/?ref=${profile.referral_code}`,
    referral_months_credit: profile.referral_months_credit ?? 0,
    months_cap:             REFERRAL_MONTHS_CAP,
    expert_plan:            profile.expert_plan,
    expert_plan_end:        profile.expert_plan_end,
    referrals:              referrals ?? [],
    credits:                credits ?? [],
    filleul_status:         filleulStatus,
  })
}

/* ── POST — saisie d'un code parrain par un filleul ── */
const validateSchema = z.object({
  code:    z.string().length(8),
  consent: z.boolean().optional().default(false),
})

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body   = await req.json().catch(() => null)
  const parsed = validateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'validation' }, { status: 400 })

  const { code, consent } = parsed.data
  const supa = createServiceClient()

  /* Profil du filleul */
  const { data: myProfile } = await supa
    .from('profiles')
    .select('referred_by, expert_plan, referral_code')
    .eq('id', user.id)
    .single()

  if (!myProfile) return NextResponse.json({ error: 'profile_not_found' }, { status: 404 })

  /* Déjà un parrain */
  if (myProfile.referred_by) return NextResponse.json({ error: 'already_referred' }, { status: 409 })

  /* Trouver le parrain par code */
  const { data: sponsor } = await supa
    .from('profiles')
    .select('id, referral_code, expert_plan')
    .eq('referral_code', code.toUpperCase())
    .maybeSingle()

  if (!sponsor) return NextResponse.json({ error: 'invalid_code' }, { status: 404 })

  /* Auto-parrainage interdit */
  if (sponsor.id === user.id) return NextResponse.json({ error: 'self_referral' }, { status: 400 })

  /* Parrainage croisé interdit : vérifier que le sponsor n'est pas filleul du user */
  const { data: crossCheck } = await supa
    .from('expert_referrals')
    .select('id')
    .eq('referrer_id', user.id)
    .eq('referred_id', sponsor.id)
    .maybeSingle()
  if (crossCheck) return NextResponse.json({ error: 'cross_referral' }, { status: 400 })

  /* Parrain doit avoir fiche active */
  if (sponsor.expert_plan !== 'active') return NextResponse.json({ error: 'sponsor_not_active' }, { status: 400 })

  /* Créer le referral */
  const { error: insertError } = await supa.from('expert_referrals').insert({
    referrer_id:           sponsor.id,
    referred_id:           user.id,
    status:                'pending',
    referral_data_consent: consent,
  })

  if (insertError) {
    console.error('[referral/POST] insert error', { code: insertError.code, message: insertError.message, details: insertError.details, hint: insertError.hint })
    if (insertError.code === '23505') return NextResponse.json({ error: 'already_referred_by_this_sponsor' }, { status: 409 })
    return NextResponse.json({ error: insertError.message, code: insertError.code }, { status: 500 })
  }

  /* Stocker le parrain sur le profil filleul */
  await supa.from('profiles').update({ referred_by: sponsor.id }).eq('id', user.id)

  return NextResponse.json({ ok: true })
}

/* ── DELETE — révocation d'un referral pending par le parrain ── */
export async function DELETE(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

  const supa = createServiceClient()

  const { data: referral } = await supa
    .from('expert_referrals')
    .select('id, referrer_id, status')
    .eq('id', id)
    .maybeSingle()

  if (!referral) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (referral.referrer_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  if (referral.status !== 'pending') return NextResponse.json({ error: 'not_revocable' }, { status: 400 })

  await supa.from('expert_referrals').update({
    status:       'cancelled',
    cancelled_at: new Date().toISOString(),
  }).eq('id', id)

  return NextResponse.json({ ok: true })
}
