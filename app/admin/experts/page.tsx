import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata } from 'next'
import ExpertsAdminClient from './ExpertsAdminClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Experts — AEGRYN Admin',
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

  const [{ data: applications }, { data: profiles }, { data: clickStats }] = await Promise.all([
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
          kyc_status,
          expert_plan,
          expert_plan_start,
          expert_plan_end
        )
      `)
      .order('created_at', { ascending: false }),
    supa
      .from('expert_click_stats')
      .select('*'),
  ])

  const tokenQs = params.token ? `?token=${params.token}` : ''

  return (
    <ExpertsAdminClient
      applications={applications ?? []}
      profiles={profiles ?? []}
      clickStats={clickStats ?? []}
      tokenQs={tokenQs}
    />
  )
}
