import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }      from '@/lib/supabase'
import { checkAdminAccess }         from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? undefined
  await checkAdminAccess(token)

  const supa = createServiceClient()

  const [{ data: applications }, { data: profiles }] = await Promise.all([
    supa
      .from('expert_applications')
      .select('*')
      .order('created_at', { ascending: false }),
    supa
      .from('expert_profiles')
      .select(`
        *,
        profile:user_id (
          email,
          roles,
          expert_plan,
          expert_plan_start
        )
      `)
      .order('created_at', { ascending: false }),
  ])

  return NextResponse.json({ applications: applications ?? [], profiles: profiles ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? undefined
  await checkAdminAccess(token)

  const body = await req.json()
  const { table, id, ...updates } = body as {
    table: 'expert_applications' | 'expert_profiles' | 'expert_plan'
    id:    string
    [k: string]: unknown
  }

  const supa = createServiceClient()

  if (table === 'expert_plan') {
    const { plan } = body as { plan: 'active' | 'suspended' | null }
    const { error } = await supa
      .from('profiles')
      .update({
        expert_plan:       plan,
        expert_plan_start: plan === 'active' ? new Date().toISOString() : null,
      })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (table === 'expert_applications') {
    const { status, admin_note } = updates as { status?: string; admin_note?: string }
    const patch: Record<string, unknown> = { reviewed_at: new Date().toISOString(), reviewed_by: 'admin' }
    if (status)     patch.status     = status
    if (admin_note !== undefined) patch.admin_note = admin_note

    const { error } = await supa.from('expert_applications').update(patch).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (status === 'approved') {
      const { data: app } = await supa
        .from('expert_applications')
        .select('email, prenom, nom')
        .eq('id', id)
        .single()

      if (app?.email) {
        const { data: userRow } = await supa
          .from('profiles')
          .select('id, roles')
          .eq('email', app.email)
          .maybeSingle()

        if (userRow) {
          /* Compte existant → ajouter le rôle expert */
          const currentRoles: string[] = Array.isArray(userRow.roles) ? userRow.roles : []
          if (!currentRoles.includes('expert')) {
            await supa
              .from('profiles')
              .update({ roles: [...currentRoles, 'expert'] })
              .eq('id', userRow.id)
          }
        } else {
          /* Pas de compte → envoyer une invitation magic link → /client/partner */
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
          const { error: inviteError } = await supa.auth.admin.inviteUserByEmail(
            app.email,
            {
              redirectTo: `${siteUrl}/api/auth/callback?next=/client/set-password`,
              data: {
                full_name: [app.prenom, app.nom].filter(Boolean).join(' '),
                role:      'partner',
              },
            }
          )
          if (inviteError) console.error('[experts/approve] invite:', inviteError)
        }
      }
    }

    return NextResponse.json({ ok: true })
  }

  if (table === 'expert_profiles') {
    const {
      is_visible,
      hidden_reason,
      skip_email: _skip,
      ...rest
    } = updates as {
      is_visible?:    boolean
      hidden_reason?: string | null
      skip_email?:    boolean
      [k: string]:    unknown
    }

    const patch: Record<string, unknown> = { ...rest }
    if (is_visible !== undefined) {
      patch.is_visible    = is_visible
      patch.verified_at   = is_visible ? new Date().toISOString() : null
      patch.hidden_reason = is_visible ? null : (hidden_reason ?? null)
    }

    const { error } = await supa.from('expert_profiles').update(patch).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'unknown_table' }, { status: 400 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? undefined
  await checkAdminAccess(token)

  const { table, id } = await req.json() as { table: string; id: string }
  const supa = createServiceClient()

  if (table === 'expert_applications') {
    const { error } = await supa.from('expert_applications').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (table === 'expert_profiles') {
    const { error } = await supa.from('expert_profiles').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'unknown_table' }, { status: 400 })
}
