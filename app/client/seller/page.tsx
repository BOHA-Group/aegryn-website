import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { FileText, ArrowRightLeft, ShieldCheck, Bell, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tableau de bord — Espace Cédant AEGRYN',
  robots: { index: false, follow: false },
}

const ASSET_STATUS_LABELS: Record<string, string> = {
  submitted:    'Reçu',
  under_review: 'En analyse',
  graded:       'Gradé',
  published:    'Publié',
  sold:         'Vendu',
  withdrawn:    'Retiré',
}

const TX_STATUS_LABELS: Record<string, string> = {
  ei_submitted:   'EI reçue',
  ap_signed:      'AP signé',
  escrow_paid:    'Séquestre',
  dd_in_progress: 'Due Diligence',
  signing:        'Signing',
  closed:         'Clôturé',
  cancelled:      'Annulé',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default async function SellerDashboardPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const [
    { data: profile },
    { data: assets },
    { data: transactions },
    { count: kycPending },
    { data: notifications },
  ] = await Promise.all([
    supa.from('profiles').select('full_name').eq('id', user.id).single(),
    supa.from('assets')
      .select('id, company_name, status, official_grade, submitted_at, published_at, arr')
      .or(`seller_email.eq.${user.email},seller_uid.eq.${user.id}`)
      .order('submitted_at', { ascending: false })
      .limit(5),
    supa.from('transactions')
      .select('id, status, created_at, escrow_amount_chf, assets(company_name)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supa.from('kyc_documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['pending', 'in_review', 'rejected']),
    supa.from('user_notifications')
      .select('id, title, body, created_at, read_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const displayName   = profile?.full_name ?? user.email ?? ''
  const kycAlertCount = kycPending ?? 0
  const unreadCount   = (notifications ?? []).filter(n => !n.read_at).length

  const publishedCount = (assets ?? []).filter(a => a.status === 'published' || a.status === 'sold').length

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Cédant</p>
        <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">
          Bonjour, {displayName.split(' ')[0] || 'Cédant'}
        </h1>
        <p className="font-sans text-[13px] text-gray-400 mt-0.5">{user.email}</p>
      </div>

      {/* Alertes */}
      {(kycAlertCount > 0 || unreadCount > 0) && (
        <div className="flex flex-col gap-2 mb-8">
          {kycAlertCount > 0 && (
            <Link href="/client/seller/kyc"
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3 hover:bg-amber-100 transition-colors">
              <ShieldCheck size={14} className="text-amber-600 shrink-0" />
              <p className="font-sans text-[12px] text-amber-800">
                {kycAlertCount} document{kycAlertCount > 1 ? 's' : ''} KYC en attente ou à corriger
              </p>
              <ArrowUpRight size={12} className="text-amber-500 ml-auto" />
            </Link>
          )}
          {unreadCount > 0 && (
            <Link href="/client/seller/notifications"
              className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 hover:bg-blue-100 transition-colors">
              <Bell size={14} className="text-blue-600 shrink-0" />
              <p className="font-sans text-[12px] text-blue-800">
                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
              </p>
              <ArrowUpRight size={12} className="text-blue-500 ml-auto" />
            </Link>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
        <Link href="/client/seller/actifs"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <FileText size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{assets?.length ?? 0}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">Dossiers soumis</p>
        </Link>

        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <FileText size={16} className="text-emerald-400" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{publishedCount}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">Publiés / vendus</p>
        </div>

        <Link href="/client/seller/transactions"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <ArrowRightLeft size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{transactions?.length ?? 0}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">Transactions</p>
        </Link>

        <Link href="/client/seller/kyc"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <ShieldCheck size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className={`font-mono font-bold text-[22px] ${kycAlertCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {kycAlertCount > 0 ? kycAlertCount : '✓'}
          </p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">
            {kycAlertCount > 0 ? 'KYC incomplet' : 'KYC validé'}
          </p>
        </Link>
      </div>

      {/* Mes dossiers récents */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-gray-900 text-[14px]">Dossiers de certification</h2>
          <Link href="/client/seller/actifs" className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
            Voir tout <ArrowUpRight size={10} />
          </Link>
        </div>
        {!assets || assets.length === 0 ? (
          <div className="bg-white border border-gray-200 px-6 py-8 text-center">
            <p className="font-sans text-[13px] text-gray-400 mb-3">Aucun dossier soumis pour le moment.</p>
            <Link href="/grade/submit"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors">
              Soumettre un actif <ArrowUpRight size={10} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {assets.map(asset => (
              <Link key={asset.id} href={`/client/seller/actifs/${asset.id}`}
                className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans font-medium text-gray-900 text-[13px]">
                    {asset.company_name ?? `Actif #${asset.id.slice(0, 8)}`}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                    Soumis le {fmtDate(asset.submitted_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {asset.official_grade && (
                    <span className="font-mono font-bold text-[12px] text-gray-600 border border-gray-300 px-2 py-0.5">
                      {asset.official_grade}
                    </span>
                  )}
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                    {ASSET_STATUS_LABELS[asset.status] ?? asset.status}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Transactions récentes */}
      {transactions && transactions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">Transactions actives</h2>
            <Link href="/client/seller/transactions" className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
              Voir tout <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {(transactions as unknown as { id: string; status: string; created_at: string; escrow_amount_chf: number | null; assets: { company_name: string | null } | null }[]).map(tx => (
              <Link key={tx.id} href={`/client/seller/transactions/${tx.id}`}
                className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans font-medium text-gray-900 text-[13px]">
                    {tx.assets?.company_name ?? `Transaction #${tx.id.slice(0, 8)}`}
                  </p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">{fmtDate(tx.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {tx.escrow_amount_chf != null && (
                    <span className="font-mono font-semibold text-[12px] text-gray-700">{fmtChf(tx.escrow_amount_chf)}</span>
                  )}
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
                    {TX_STATUS_LABELS[tx.status] ?? tx.status}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Notifications récentes */}
      {notifications && notifications.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">Notifications récentes</h2>
            <Link href="/client/seller/notifications" className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
              Voir tout <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-1.5">
            {(notifications as { id: string; title: string; body: string | null; created_at: string; read_at: string | null }[]).map(n => (
              <div key={n.id}
                className={`bg-white border px-5 py-3 flex items-start gap-3 ${n.read_at ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'}`}>
                <Bell size={13} className={`mt-0.5 shrink-0 ${n.read_at ? 'text-gray-300' : 'text-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[12px] text-gray-800 font-medium truncate">{n.title}</p>
                  {n.body && <p className="font-sans text-[11px] text-gray-400 mt-0.5 line-clamp-1">{n.body}</p>}
                </div>
                <p className="font-mono text-[9px] text-gray-300 shrink-0">{fmtDate(n.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
