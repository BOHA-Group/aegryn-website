import { checkAdminAccess }  from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { redirect }             from 'next/navigation'
import type { Metadata }        from 'next'
import CommissionsClient        from './CommissionsClient'
import type { CommissionTier }  from '@/lib/calcCommission'

export const metadata: Metadata = {
  title: 'Commissions Aegryn — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminCommissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; toggle?: string }>
}) {
  const params  = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  if (params.toggle) {
    const { data: tx } = await supa
      .from('transactions')
      .select('commission_paid')
      .eq('id', params.toggle)
      .maybeSingle()
    if (tx) {
      await supa
        .from('transactions')
        .update({ commission_paid: !(tx as Record<string, unknown>).commission_paid })
        .eq('id', params.toggle)
    }
    redirect(`/admin/commissions${tokenQs}`)
  }

  const [
    { data: txRaw },
    { data: tiersRaw },
  ] = await Promise.all([
    supa
      .from('transactions')
      .select(`
        id, status, created_at, closed_at, commission_paid,
        transaction_price,
        assets ( company_name ),
        seller:seller_id ( full_name, email )
      `)
      .order('created_at', { ascending: false })
      .limit(200),
    supa
      .from('commission_tiers')
      .select('*')
      .eq('active', true)
      .order('min_amount', { ascending: true }),
  ])

  const transactions = ((txRaw ?? []) as Record<string, unknown>[]).map(t => ({
    id:               String(t.id),
    asset_name:       (t.assets as Record<string, unknown> | null)?.company_name as string | null ?? null,
    transaction_price: t.transaction_price as number | null ?? null,
    status:           String(t.status ?? ''),
    seller_name:      (t.seller as Record<string, unknown> | null)?.full_name as string | null ?? null,
    seller_email:     (t.seller as Record<string, unknown> | null)?.email as string | null ?? null,
    closed_at:        t.closed_at as string | null ?? null,
    created_at:       String(t.created_at ?? ''),
    commission_paid:  Boolean(t.commission_paid),
  }))

  const tiers = ((tiersRaw ?? []) as Record<string, unknown>[]).map(t => ({
    min_amount:  Number(t.min_amount),
    max_amount:  t.max_amount != null ? Number(t.max_amount) : null,
    rate:        t.rate != null ? Number(t.rate) : null,
    minimum_fee: Number(t.minimum_fee ?? 25000),
    label:       String(t.label ?? ''),
  })) as CommissionTier[]

  return (
    <CommissionsClient
      transactions={transactions}
      tiers={tiers}
      tokenQs={tokenQs}
    />
  )
}
