import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'
import { EXPERT_PROFILE_BLANK }     from '@/lib/expertProfileDefaults'
import { syncExpertVisibility }     from '@/lib/expertVisibility'

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

  const { data: admins } = await supa
    .from('profiles')
    .select('id')
    .contains('roles', ['admin'])

  if (admins && admins.length > 0) {
    await supa.from('user_notifications').insert(
      admins.map(a => ({
        user_id:     a.id,
        type:        'broadcast_action',
        title,
        body,
        link:        `/admin/experts#expert-${userId}`,
        target_role: 'admin',
      }))
    )
  }

  /* ── Email admin ── */
  const resendKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.Aegryn_ADMIN_EMAIL ?? 'admin@boha-group.com'
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from:    `Aegryn <${process.env.RESEND_FROM ?? 'no-reply@boha-group.com'}>`,
        to:      [adminEmail],
        subject: `[Experts] ${isNew ? 'Nouvelle fiche soumise' : 'Fiche mise à jour'} — ${partnerName}`,
        html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
  <div style="padding:20px 24px 16px;border-bottom:1px solid #e5e7eb;">
    <p style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5ADDA4;margin:0;font-weight:700;">Aegryn ADMIN · Experts</p>
  </div>
  <div style="padding:24px;">
    <p style="font-size:17px;font-weight:700;color:#0a0f1e;margin:0 0 12px 0;">${isNew ? 'Nouvelle fiche expert soumise' : 'Fiche expert mise à jour'}</p>
    <table style="font-size:13px;color:#374151;border-collapse:collapse;width:100%;">
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;width:80px;">Expert</td><td style="padding:6px 0;color:#0a0f1e;">${partnerName}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;">ID</td><td style="padding:6px 0;color:#9ca3af;font-size:11px;">${userId}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;">Action</td><td style="padding:6px 0;color:#0a0f1e;">${body}</td></tr>
    </table>
    <p style="margin:20px 0 0 0;">
      <a href="https://aegryn.com/admin/experts" style="font-size:12px;color:#0a0f1e;text-decoration:underline;">Traiter dans l'admin →</a>
    </p>
  </div>
</div>`,
      }),
    }).catch(() => {})
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
    const rawBody = await req.json() as Record<string, unknown>
    const isSubmit = rawBody.submit === true
    delete rawBody.submit

    const body = updateSchema.parse(rawBody)

    const { error } = await supa.from('expert_profiles').insert({
      user_id:       user.id,
      ...body,
      is_visible:    false,
      verified_at:   null,
      review_status: isSubmit ? 'pending_review' : 'draft',
    })
    if (error) throw error

    if (isSubmit) {
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
    }

    return NextResponse.json({ ok: true, submitted: isSubmit })
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
    const rawBody = await req.json() as Record<string, unknown>

    if (rawBody.reset === true) {
      const { error: resetErr } = await supa
        .from('expert_profiles')
        .update(EXPERT_PROFILE_BLANK)
        .eq('user_id', user.id)
      if (resetErr) throw resetErr
      return NextResponse.json({ ok: true, reset: true })
    }

    if (rawBody.unpublish === true) {
      /* Le partenaire masque volontairement sa fiche — review_status inchangé */
      const { error: hideErr } = await supa
        .from('expert_profiles')
        .update({ is_visible: false, hidden_reason: 'self_hidden' })
        .eq('user_id', user.id)
      if (hideErr) throw hideErr
      return NextResponse.json({ ok: true, unpublished: true })
    }

    if (rawBody.republish === true) {
      /* Le partenaire souhaite réafficher sa fiche — lever le masquage self_hidden */
      const { error: showErr } = await supa
        .from('expert_profiles')
        .update({ hidden_reason: null })
        .eq('user_id', user.id)
      if (showErr) throw showErr
      /* Recalculer la visibilité : publie automatiquement si tous les prérequis sont réunis */
      const visible = await syncExpertVisibility(supa, user.id)
      return NextResponse.json({ ok: true, is_visible: visible })
    }

    const isSubmit = rawBody.submit === true
    delete rawBody.submit

    const body = updateSchema.partial().parse(rawBody)

    const { data: currentEp } = await supa
      .from('expert_profiles')
      .select('review_status')
      .eq('user_id', user.id)
      .maybeSingle()

    const alreadyApproved = currentEp?.review_status === 'approved'

    const updatePayload: Record<string, unknown> = { ...body }

    if (isSubmit) {
      updatePayload.hidden_reason = null
      if (alreadyApproved) {
        updatePayload.review_status = 'approved'
      } else {
        updatePayload.is_visible    = false
        updatePayload.verified_at   = null
        updatePayload.review_status = 'pending_review'
      }
    }

    const { error } = await supa
      .from('expert_profiles')
      .update(updatePayload)
      .eq('user_id', user.id)

    if (error) throw error

    if (isSubmit && alreadyApproved) {
      await syncExpertVisibility(supa, user.id)
    } else if (isSubmit) {
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
    }

    return NextResponse.json({ ok: true, submitted: isSubmit, auto_published: isSubmit && alreadyApproved })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
