import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import ReferralsAdminClient, { type ReferralRow, type CreditRow } from './ReferralsAdminClient'

export const metadata: Metadata = {
  title: 'Parrainages — Admin AEGRYN',
  robots: { index: false, follow: false },
}

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const [{ data: referrals }, { data: credits }, { data: partners }] = await Promise.all([
    supa
      .from('expert_referrals')
      .select(`
        id, status, code_used_at, code_expires_at,
        payment_confirmed_at, rewarded_at, cancelled_at,
        referrer:referrer_id ( id, full_name, email ),
        referred:referred_id ( id, full_name, email )
      `)
      .order('code_used_at', { ascending: false })
      .limit(200),

    supa
      .from('expert_subscription_credits')
      .select(`
        id, months, source, note, applied, applied_at, created_at,
        user:user_id ( id, full_name, email )
      `)
      .order('created_at', { ascending: false })
      .limit(200),

    supa
      .from('profiles')
      .select('id, full_name, email, expert_plan, referral_months_credit')
      .eq('expert_plan', 'active')
      .order('full_name', { ascending: true }),
  ])

  return (
    <ReferralsAdminClient
      referrals={(referrals ?? []) as unknown as ReferralRow[]}
      credits={(credits ?? []) as unknown as CreditRow[]}
      activePartners={(partners ?? []) as { id: string; full_name: string | null; email: string }[]}
      tokenQs={tokenQs}
    />
  )
}
