import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'

const updateSchema = z.object({
  first_name:             z.string().min(1).max(80),
  last_name:              z.string().min(1).max(80),
  profession:             z.string().min(1).max(100),
  specialties:            z.array(z.string().max(80)).max(10).optional(),
  expertise_dimension:    z.enum(['tech', 'transaction', 'both']).optional().nullable(),
  expertise_categories:   z.array(z.string().max(60)).max(5).optional(),
  expertise_specialties:  z.array(z.string().max(60)).max(6).optional(),
  city:                   z.string().max(100).optional(),
  country_code:           z.string().max(4).optional(),
  bio:                    z.string().max(1200).optional(),
  organization:           z.string().max(150).optional(),
  email_public:           z.string().email().optional().or(z.literal('')),
  phone:                  z.string().max(30).optional(),
  phone_country:          z.string().max(4).optional(),
  website:                z.string().url().optional().or(z.literal('')),
  min_rate_eur:           z.number().int().min(0).max(99999).optional().nullable(),
  rate_currency:          z.enum(['CHF', 'EUR']).optional(),
  languages:              z.array(z.string().max(10)).max(6).optional(),
  avatar_url:             z.string().url().optional().nullable(),
})

async function notifyAdminExpertSubmission(
  supa: ReturnType<typeof createServiceClient>,
  partnerName: string,
  isNew: boolean,
  userId: string,
) {
  const title = isNew
    ? `Nouvelle fiche expert soumise — ${partnerName}`
    : `Fiche expert mise à jour — ${partnerName}`
  const body = isNew
    ? `${partnerName} a soumis sa fiche expert. À valider dans l'espace Experts réseau.`
    : `${partnerName} a modifié sa fiche expert. Elle est en attente de révision.`

  // Récupérer tous les admins
  const { data: admins } = await supa
    .from('profiles')
    .select('id')
    .contains('roles', ['admin'])

  if (admins && admins.length > 0) {
    await supa.from('user_notifications').insert(
      admins.map(a => ({
        user_id: a.id,
        type:    'broadcast_action',
        title,
        body,
        link:    `/admin/experts#expert-${userId}`,
      }))
    )
  }
}

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('expert_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'internal' }, { status: 500 })
  return NextResponse.json({ profile: data })
}

async function requirePartnerWithPrereqs(userId: string) {
  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('roles')
    .eq('id', userId)
    .single() as { data: { roles: string[] | null } | null }

  const roles = profile?.roles ?? []
  if (!roles.includes('partner')) {
    return { error: NextResponse.json({ error: 'Rôle partenaire requis.' }, { status: 403 }) }
  }
  /* KYC et abonnement non requis pour soumettre — la validation et publication sont gérées par l'admin. */
  return { error: null }
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { error: guardErr } = await requirePartnerWithPrereqs(user.id)
  if (guardErr) return guardErr

  const supa = createServiceClient()

  const { data: existing } = await supa
    .from('expert_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'already_exists' }, { status: 409 })
  }

  try {
    const body = updateSchema.parse(await req.json())
    const { error } = await supa.from('expert_profiles').insert({
      user_id:       user.id,
      ...body,
      is_visible:    false,
      verified_at:   null,
      review_status: 'pending_review',
    })
    if (error) throw error

    const { data: profile } = await supa
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .maybeSingle() as { data: { full_name?: string; email?: string } | null }

    await notifyAdminExpertSubmission(
      supa,
      profile?.full_name ?? `${body.first_name} ${body.last_name}`,
      true,
      user.id,
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { error: guardErr } = await requirePartnerWithPrereqs(user.id)
  if (guardErr) return guardErr

  const supa = createServiceClient()

  const { data: existing } = await supa
    .from('expert_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!existing) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  try {
    const body = updateSchema.partial().parse(await req.json())
    const { error } = await supa
      .from('expert_profiles')
      .update({
        ...body,
        is_visible:    false,
        verified_at:   null,
        hidden_reason: null,
        review_status: 'pending_review',
      })
      .eq('user_id', user.id)

    if (error) throw error

    const { data: profile } = await supa
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .maybeSingle() as { data: { full_name?: string; email?: string } | null }

    await notifyAdminExpertSubmission(
      supa,
      profile?.full_name ?? `${body.first_name ?? ''} ${body.last_name ?? ''}`.trim(),
      false,
      user.id,
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
