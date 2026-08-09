import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }      from '@/lib/supabase'
import { checkAdminAccess }         from '@/lib/adminAuth'
import { syncExpertVisibility }     from '@/lib/expertVisibility'

const PERIOD_INTERVALS: Record<string, string | null> = {
  '1d':  '1 day',
  '1w':  '7 days',
  '1m':  '1 month',
  '3m':  '3 months',
  '6m':  '6 months',
  'ytd': null,
  '1y':  '1 year',
  '2y':  '2 years',
  '5y':  '5 years',
  '10y': '10 years',
  'all': null,
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token  = searchParams.get('token')  ?? undefined
  const period = searchParams.get('period') ?? 'all'
  try { await checkAdminAccess(token) } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supa = createServiceClient()

  const now = new Date()
  let since: string | null = null
  if (period === 'ytd') {
    since = new Date(now.getFullYear(), 0, 1).toISOString()
  } else if (period !== 'all' && PERIOD_INTERVALS[period]) {
    const ms: Record<string, number> = {
      '1d': 1, '1w': 7, '1m': 30, '3m': 91, '6m': 183,
      '1y': 365, '2y': 730, '5y': 1825, '10y': 3650,
    }
    const days = ms[period]
    if (days) {
      const d = new Date(now)
      d.setDate(d.getDate() - days)
      since = d.toISOString()
    }
  }

  const clicksQuery = supa
    .from('expert_contact_clicks')
    .select('expert_id, click_type, clicked_at')
  if (since) clicksQuery.gte('clicked_at', since)
  const { data: rawClicks } = await clicksQuery

  const [{ data: applications }, { data: rawProfiles }, { data: epList }] = await Promise.all([
    supa
      .from('expert_applications')
      .select('*')
      .order('created_at', { ascending: false }),
    supa
      .from('expert_profiles')
      .select('*')
      .order('created_at', { ascending: false }),
    supa
      .from('expert_profiles')
      .select('id, user_id, first_name, last_name, profession, is_visible'),
  ])

  const userIds = (rawProfiles ?? []).map(p => p.user_id)
  const { data: relatedProfiles } = userIds.length
    ? await supa
        .from('profiles')
        .select('id, email, roles, kyc_status, expert_plan, expert_plan_start, expert_plan_end')
        .in('id', userIds)
    : { data: [] }

  const profileMap = new Map((relatedProfiles ?? []).map(p => [p.id, p]))
  const profiles = (rawProfiles ?? []).map(ep => ({
    ...ep,
    profile: profileMap.get(ep.user_id) ?? null,
  }))

  const clicks = rawClicks ?? []
  type ClickRow = { expert_id: string; click_type: string; clicked_at: string }
  const statsMap = new Map<string, {
    total_clicks: number; email_clicks: number; website_clicks: number; last_click_at: string | null
  }>()
  for (const c of clicks as ClickRow[]) {
    const s = statsMap.get(c.expert_id) ?? { total_clicks: 0, email_clicks: 0, website_clicks: 0, last_click_at: null }
    s.total_clicks++
    if (c.click_type === 'email')   s.email_clicks++
    if (c.click_type === 'website') s.website_clicks++
    if (!s.last_click_at || c.clicked_at > s.last_click_at) s.last_click_at = c.clicked_at
    statsMap.set(c.expert_id, s)
  }

  const clickStats = (epList ?? []).map((ep: { id: string; user_id: string; first_name: string; last_name: string; profession: string; is_visible: boolean }) => ({
    expert_id:      ep.user_id,
    first_name:     ep.first_name,
    last_name:      ep.last_name,
    profession:     ep.profession,
    is_visible:     ep.is_visible,
    ...(statsMap.get(ep.user_id) ?? { total_clicks: 0, email_clicks: 0, website_clicks: 0, last_click_at: null }),
  }))

  return NextResponse.json({ applications: applications ?? [], profiles, clickStats, period })
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? undefined
  try { await checkAdminAccess(token) } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

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
    const isVisible = await syncExpertVisibility(supa, id)
    return NextResponse.json({ ok: true, is_visible: isVisible })
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
        .select('email, prenom, nom, profession, specialties, city, country, bio, organization, website')
        .eq('id', id)
        .single()

      if (app?.email) {
        const { data: userRow } = await supa
          .from('profiles')
          .select('id, roles')
          .eq('email', app.email)
          .maybeSingle()

        if (userRow) {
          /* Compte existant → ajouter les rôles partner + expert */
          const currentRoles: string[] = Array.isArray(userRow.roles) ? userRow.roles : []
          const newRoles = [...new Set([...currentRoles, 'partner', 'expert'])]
          await supa.from('profiles').update({ roles: newRoles }).eq('id', userRow.id)

          /* Pré-créer la fiche expert si elle n'existe pas encore */
          const { data: existingProfile } = await supa
            .from('expert_profiles')
            .select('id')
            .eq('user_id', userRow.id)
            .maybeSingle()

          if (!existingProfile) {
            await supa.from('expert_profiles').insert({
              user_id:       userRow.id,
              first_name:    app.prenom,
              last_name:     app.nom,
              profession:    app.profession ?? '',
              specialties:   app.specialties ?? [],
              city:          app.city        ?? null,
              country_code:  app.country     ?? 'CH',
              bio:           app.bio         ?? null,
              organization:  app.organization ?? null,
              website:       app.website     ?? null,
              is_visible:    false,
              verified_at:   null,
              review_status: 'pending_review',
            })
          }
        } else {
          /* Pas de compte → envoyer une invitation magic link → /client/partner */
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
          await supa.auth.admin.inviteUserByEmail(
            app.email,
            {
              redirectTo: `${siteUrl}/api/auth/callback?next=/client/set-password&expert_app_id=${id}`,
              data: {
                full_name:      [app.prenom, app.nom].filter(Boolean).join(' '),
                role:           'partner',
                expert_app_id:  id,
              },
            }
          )
        }
      }
    }

    return NextResponse.json({ ok: true })
  }

  if (table === 'expert_profiles') {
    const {
      hidden_reason,
      review_status,
      skip_email: _skip,
      ...rest
    } = updates as {
      hidden_reason?: string | null
      review_status?: 'pending_review' | 'approved' | 'rejected'
      skip_email?:    boolean
      [k: string]:    unknown
    }

    const { data: before } = await supa
      .from('expert_profiles')
      .select('user_id, is_visible')
      .eq('id', id)
      .maybeSingle()

    const patch: Record<string, unknown> = { ...rest }
    if (review_status !== undefined) patch.review_status = review_status
    if (hidden_reason  !== undefined) patch.hidden_reason  = hidden_reason

    // Refus explicite : la fiche est immédiatement masquée, aucune republication auto tant que non re-soumise
    if (review_status === 'rejected') {
      patch.is_visible  = false
      patch.verified_at = null
    }

    const { error } = await supa.from('expert_profiles').update(patch).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Publication automatique : recalcule is_visible selon les 3 prérequis
    // (review approuvé + KYC approuvé + abonnement actif), sauf en cas de refus explicite
    let finalVisible: boolean | null = review_status === 'rejected' ? false : null
    if (before?.user_id && review_status !== 'rejected') {
      finalVisible = await syncExpertVisibility(supa, before.user_id)
    }

    // Notif in-app vers le partenaire propriétaire de la fiche
    if (before?.user_id && (review_status !== undefined || hidden_reason !== undefined)) {
      const becamePublished = finalVisible === true && !before.is_visible
      const wasRejected      = review_status === 'rejected'
      const wasSilentHidden  = hidden_reason === 'admin_hidden'
      const approvedPending  = review_status === 'approved' && finalVisible === false

      let notifTitle: string | null = null
      let notifBody = ''
      if (becamePublished) {
        notifTitle = 'Votre fiche expert a été validée et publiée'
        notifBody  = 'Votre profil est maintenant visible dans l\'annuaire AEGRYN.'
      } else if (wasRejected) {
        notifTitle = 'Votre fiche expert a été refusée'
        notifBody  = `Motif : ${hidden_reason}. Mettez à jour votre fiche et soumettez à nouveau.`
      } else if (wasSilentHidden) {
        notifTitle = 'Votre fiche expert a été masquée'
        notifBody  = 'Votre fiche a été temporairement masquée par l\'administration.'
      } else if (approvedPending) {
        notifTitle = 'Votre fiche expert a été validée par l\'équipe AEGRYN'
        notifBody  = 'Elle sera publiée automatiquement dès que votre KYC et votre abonnement seront actifs.'
      }

      if (notifTitle) {
        await supa.from('user_notifications').insert({
          user_id: before.user_id,
          type:    (becamePublished || approvedPending) ? 'broadcast_info' : 'broadcast_alert',
          title:   notifTitle,
          body:    notifBody,
          link:    '/client/partner/expert-profile',
        })
      }
    }

    return NextResponse.json({ ok: true, is_visible: finalVisible })
  }

  return NextResponse.json({ error: 'unknown_table' }, { status: 400 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? undefined
  try { await checkAdminAccess(token) } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { table: string; id?: string; expert_id?: string; purge_all?: boolean }
  const { table, id, expert_id, purge_all } = body
  const supa = createServiceClient()

  if (table === 'expert_applications') {
    const { error } = await supa.from('expert_applications').delete().eq('id', id!)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (table === 'expert_profiles') {
    const { error } = await supa.from('expert_profiles').delete().eq('id', id!)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (table === 'expert_contact_clicks') {
    if (purge_all) {
      const { error } = await supa.from('expert_contact_clicks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, purged: 'all' })
    }
    if (expert_id) {
      const { error } = await supa.from('expert_contact_clicks').delete().eq('expert_id', expert_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, purged: expert_id })
    }
    return NextResponse.json({ error: 'expert_id or purge_all required' }, { status: 400 })
  }

  return NextResponse.json({ error: 'unknown_table' }, { status: 400 })
}
