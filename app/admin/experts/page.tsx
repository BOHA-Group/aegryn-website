import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata } from 'next'
import ExpertsAdminClient from './ExpertsAdminClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Experts — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminExpertsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()

  const [{ data: applications }, { data: rawProfiles }, { data: clickStats }] = await Promise.all([
    supa
      .from('expert_applications')
      .select('*')
      .order('created_at', { ascending: false }),
    supa
      .from('expert_profiles')
      .select('*')
      .order('created_at', { ascending: false }),
    supa
      .from('expert_click_stats')
      .select('*'),
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

  // Comptes éligibles à un crédit d'abonnement expert : rôle "expert" ou
  // expert_plan déjà renseigné — même sans fiche expert_profiles associée
  // (ex: abonnement actif mais fiche jamais soumise ou supprimée depuis).
  const { data: creditableProfiles } = await supa
    .from('profiles')
    .select('id, email, full_name, expert_plan, expert_plan_end')
    .or('roles.cs.{expert},expert_plan.not.is.null')
    .order('email', { ascending: true })

  const expertProfileNameMap = new Map(
    (rawProfiles ?? []).map(ep => [ep.user_id, `${ep.first_name ?? ''} ${ep.last_name ?? ''}`.trim()])
  )
  const creditablePartners = (creditableProfiles ?? []).map(p => ({
    user_id:     p.id,
    email:       p.email,
    display_name: expertProfileNameMap.get(p.id) || p.full_name || p.email,
    expert_plan: p.expert_plan,
  }))

  return (
    <ExpertsAdminClient
      applications={applications ?? []}
      profiles={profiles}
      clickStats={clickStats ?? []}
      creditablePartners={creditablePartners}
    />
  )
}
