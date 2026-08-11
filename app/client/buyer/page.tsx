import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { BookOpen, Gavel, ArrowRightLeft, ShieldCheck, Bell, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Buyer Space Aegryn',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

const BID_STATUS_COLOR: Record<string, string> = {
  draft:     'text-gray-400 bg-gray-50 border-gray-200',
  submitted: 'text-blue-600 bg-blue-50 border-blue-200',
  retained:  'text-emerald-600 bg-emerald-50 border-emerald-200',
  rejected:  'text-red-500 bg-red-50 border-red-100',
  withdrawn: 'text-gray-400 bg-gray-50 border-gray-200',
}

export default async function BuyerDashboardPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'client.buyer' })
  const tc = await getTranslations({ locale, namespace: 'client.common' })

  const supa = createServiceClient()

  const results = await Promise.allSettled([
    supa.from('profiles').select('full_name, roles').eq('id', user.id).single(),
    supa.from('assets').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supa.from('auction_bids').select('id, amount_chf, status, created_at, asset_id, assets(company_name)').eq('bidder_id', user.id).order('created_at', { ascending: false }).limit(3),
    supa.from('transactions').select('id, status, created_at, asset_id, assets(company_name), escrow_amount_chf').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(3),
    supa.from('kyc_documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['pending', 'in_review', 'rejected']),
    supa.from('user_notifications').select('id, title, body, link, created_at, read_at')
      .eq('user_id', user.id)
      .or('target_role.eq.buyer,target_role.is.null')
      .is('dismissed_at', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const profile      = results[0].status === 'fulfilled' ? results[0].value.data : null
  const catalogCount = results[1].status === 'fulfilled' ? results[1].value.count : null
  const bids         = results[2].status === 'fulfilled' ? results[2].value.data : null
  const transactions = results[3].status === 'fulfilled' ? results[3].value.data : null
  const kycPending   = results[4].status === 'fulfilled' ? results[4].value.count : null
  const notifications= results[5].status === 'fulfilled' ? results[5].value.data : null

  const displayName = profile?.full_name ?? user.email ?? ''
  const kycAlertCount = kycPending ?? 0
  const unreadNotifCount = (notifications ?? []).filter(n => !n.read_at).length

  const bidStatusLabel = (s: string) => t(`bidStatus.${s}` as Parameters<typeof t>[0]) || s
  const txStatusLabel  = (s: string) => t(`txStatus.${s}` as Parameters<typeof t>[0]) || s

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">{t('areaLabel')}</p>
        <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">
          {t('hello', { name: displayName.split(' ')[0] || t('fallbackName') })}
        </h1>
        <p className="font-sans text-[13px] text-gray-400 mt-0.5">{user.email}</p>
      </div>

      {/* KYC / Notif alerts */}
      {(kycAlertCount > 0 || unreadNotifCount > 0) && (
        <div className="flex flex-col gap-2 mb-8">
          {kycAlertCount > 0 && (
            <Link href="/client/buyer/kyc"
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3 hover:bg-amber-100 transition-colors">
              <ShieldCheck size={14} className="text-amber-600 shrink-0" />
              <p className="font-sans text-[12px] text-amber-800">
                {kycAlertCount > 1 ? t('kycPendingPlural', { count: kycAlertCount }) : t('kycPending', { count: kycAlertCount })}
              </p>
              <ArrowUpRight size={12} className="text-amber-500 ml-auto" />
            </Link>
          )}
          {unreadNotifCount > 0 && (
            <Link href="/client/buyer/notifications"
              className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 hover:bg-blue-100 transition-colors">
              <Bell size={14} className="text-blue-600 shrink-0" />
              <p className="font-sans text-[12px] text-blue-800">
                {unreadNotifCount > 1 ? tc('unreadNotifPlural', { count: unreadNotifCount }) : tc('unreadNotif', { count: unreadNotifCount })}
              </p>
              <ArrowUpRight size={12} className="text-blue-500 ml-auto" />
            </Link>
          )}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
        <Link href="/client/buyer/catalogue" className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <BookOpen size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{catalogCount ?? 0}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('kpiPublished' as Parameters<typeof t>[0]) || 'Assets'}</p>
        </Link>

        <Link href="/client/buyer/offres" className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <Gavel size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{bids?.length ?? 0}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('kpiOffres')}</p>
        </Link>

        <Link href="/client/buyer/transactions" className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <ArrowRightLeft size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{transactions?.length ?? 0}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('kpiTransactions')}</p>
        </Link>

        <Link href="/client/buyer/kyc" className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <ShieldCheck size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className={`font-mono font-bold text-[22px] ${kycAlertCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {kycAlertCount > 0 ? kycAlertCount : '✓'}
          </p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">
            {kycAlertCount > 0 ? t('kpiKycIncomplete') : t('kpiKycOk')}
          </p>
        </Link>
      </div>

      {/* Dernières offres */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-gray-900 text-[14px]">{t('lastOffres')}</h2>
          <Link href="/client/buyer/offres" className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
            {tc('viewAll')} <ArrowUpRight size={10} />
          </Link>
        </div>
        {!bids || bids.length === 0 ? (
          <div className="bg-white border border-gray-200 px-6 py-8 text-center">
            <p className="font-sans text-[13px] text-gray-400">{t('noOffres')}</p>
            <Link href="/client/buyer/catalogue"
              className="inline-flex items-center gap-1.5 mt-3 font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors">
              {t('exploreCatalog')} <ArrowUpRight size={10} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {(bids as unknown as { id: string; amount_chf: number | null; status: string; created_at: string; assets: { company_name: string | null } | null }[]).map(bid => (
              <Link key={bid.id} href={`/client/buyer/offres/${bid.id}`}
                className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans font-medium text-gray-900 text-[13px]">
                    {bid.assets?.company_name ?? `#${bid.id.slice(0, 8)}`}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">{fmtDate(bid.created_at, locale)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-mono font-semibold text-[13px] text-gray-700">{fmtChf(bid.amount_chf)}</p>
                  <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${BID_STATUS_COLOR[bid.status] ?? 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                    {bidStatusLabel(bid.status)}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Transactions actives */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-gray-900 text-[14px]">{t('activeTransactions')}</h2>
          <Link href="/client/buyer/transactions" className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
            {tc('viewAll')} <ArrowUpRight size={10} />
          </Link>
        </div>
        {!transactions || transactions.length === 0 ? (
          <div className="bg-white border border-gray-200 px-6 py-8 text-center">
            <p className="font-sans text-[13px] text-gray-400">{t('noTransactions')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {(transactions as unknown as { id: string; status: string; created_at: string; escrow_amount_chf: number | null; assets: { company_name: string | null } | null }[]).map(tx => (
              <Link key={tx.id} href={`/client/buyer/transactions/${tx.id}`}
                className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans font-medium text-gray-900 text-[13px]">
                    {tx.assets?.company_name ?? `#${tx.id.slice(0, 8)}`}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">{fmtDate(tx.created_at, locale)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {tx.escrow_amount_chf != null && (
                    <p className="font-mono font-semibold text-[13px] text-gray-700">{fmtChf(tx.escrow_amount_chf)}</p>
                  )}
                  <span className="border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gray-500">
                    {txStatusLabel(tx.status)}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Notifications récentes */}
      {notifications && notifications.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">{t('recentNotifs')}</h2>
            <Link href="/client/buyer/notifications" className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
              {tc('viewAll')} <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-1.5">
            {(notifications as { id: string; title: string; body: string | null; link: string | null; created_at: string; read_at: string | null }[]).map(n => (
              <div key={n.id} className={`bg-white border px-5 py-3 flex items-start gap-3 ${n.read_at ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'}`}>
                <Bell size={13} className={`mt-0.5 shrink-0 ${n.read_at ? 'text-gray-300' : 'text-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[12px] text-gray-800 font-medium truncate">{n.title}</p>
                  {n.body && <p className="font-sans text-[11px] text-gray-400 mt-0.5 line-clamp-1">{n.body}</p>}
                </div>
                <p className="font-mono text-[9px] text-gray-300 shrink-0">{fmtDate(n.created_at, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
