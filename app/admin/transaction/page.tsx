/**
 * /admin/transaction — Tableau de bord Aegryn Auction
 * Auth : Supabase session + rôle admin
 */
import Link                    from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { requireAdmin }        from '@/lib/adminAuth'
import type { Metadata }       from 'next'
import {
  Gavel, Users, FileText, Banknote,
  TrendingUp, Clock, CheckCircle, AlertCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transact Admin — Aegryn',
  robots: { index: false, follow: false },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fmt(n: number | null | undefined, suffix = '') {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M${suffix}`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K${suffix}`
  return `${n}${suffix}`
}

function fmtChf(n: number | null | undefined) {
  if (n == null) return '—'
  return `CHF ${new Intl.NumberFormat('fr-CH').format(n)}`
}

export default async function TransactAdminPage() {
  await requireAdmin()

  const qs   = ''
  const supa = createServiceClient()

  const [
    { data: lots },
    { count: kycPending },
    { count: requestsPending },
    { count: bidsSubmitted },
    { count: sequesters },
  ] = await Promise.all([
    supa.from('auction_assets')
        .select('id, slug, lot_number, name, status, session_opens_at, session_closes_at, grade, reserve_price, buyer_premium_pct')
        .order('created_at', { ascending: false })
        .limit(20) as unknown as Promise<{ data: Record<string, unknown>[] | null }>,
    supa.from('buyer_kyc_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', 'pending'),
    supa.from('auction_dossier_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    supa.from('auction_bids')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'submitted'),
    supa.from('auction_sequesters')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'awaited'),
  ])

  const now      = new Date()
  const activeLots  = (lots ?? []).filter(l => l.status === 'published' && l.session_opens_at && new Date(l.session_opens_at as string) <= now && l.session_closes_at && new Date(l.session_closes_at as string) >= now)
  const draftLots   = (lots ?? []).filter(l => l.status === 'draft')
  const closedLots  = (lots ?? []).filter(l => l.session_closes_at && new Date(l.session_closes_at as string) < now)

  const MODULES = [
    { href: `/admin/transaction/lots${qs}`,       icon: Gavel,       title: 'Gestion des actifs',  desc: `${(lots ?? []).length} actifs · ${activeLots.length} session(s) active(s)`, badge: draftLots.length, badgeLabel: 'brouillons' },
    { href: `/admin/transaction/buyers${qs}`,     icon: Users,       title: 'Acquéreurs & KYC',    desc: 'Vérification identité + capacité financière', badge: kycPending ?? 0, badgeLabel: 'KYC en attente' },
    { href: `/admin/transaction/requests${qs}`,   icon: FileText,    title: 'Demandes dossier',    desc: 'Approbation accès dossier complet', badge: requestsPending ?? 0, badgeLabel: 'en attente' },
    { href: `/admin/transaction/bids${qs}`,       icon: TrendingUp,  title: 'Offres (appel fermé)', desc: 'Appel d\'offres fermé — revue et sélection', badge: bidsSubmitted ?? 0, badgeLabel: 'à examiner' },
    { href: `/admin/transaction/sequesters${qs}`, icon: Banknote,    title: 'Séquestres / cautions', desc: 'Suivi des cautions bancaires', badge: sequesters ?? 0, badgeLabel: 'en attente' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
              Aegryn Transact · Back-office
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Transact</h1>
          </div>
          <Link
            href={`/admin${qs}`}
            className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-gray-700"
          >
            ← Admin général
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sessions actives',   value: activeLots.length,     icon: Clock,        color: 'text-emerald-600' },
            { label: 'KYC en attente',     value: kycPending ?? 0,        icon: AlertCircle,  color: 'text-amber-500'  },
            { label: 'Offres à examiner',  value: bidsSubmitted ?? 0,     icon: TrendingUp,   color: 'text-blue-600'   },
            { label: 'Sessions clôturées', value: closedLots.length,      icon: CheckCircle,  color: 'text-gray-400'   },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 p-5 rounded-sm">
              <s.icon size={18} className={`${s.color} mb-2`} />
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {MODULES.map(m => (
            <Link
              key={m.href}
              href={m.href}
              className="bg-white border border-gray-200 p-6 rounded-sm hover:border-gray-400 transition-colors flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <m.icon size={20} className="text-gray-700" />
                {m.badge > 0 && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {m.badge} {m.badgeLabel}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{m.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Lots table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Actifs Aegryn Transact</h2>
            <Link href={`/admin/transaction/lots${qs}`} className="text-xs text-gray-400 hover:text-gray-700">
              Gérer →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-mono uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Lot</th>
                  <th className="text-left px-4 py-3">Grade</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-left px-4 py-3">Session</th>
                  <th className="text-right px-6 py-3">Mise à prix</th>
                </tr>
              </thead>
              <tbody>
                {(lots ?? []).map((lot) => {
                  const grade  = (lot.grade as { letter?: string })?.letter ?? '—'
                  const opens  = lot.session_opens_at  ? new Date(lot.session_opens_at as string) : null
                  const closes = lot.session_closes_at ? new Date(lot.session_closes_at as string) : null
                  const isOpen = opens && closes && opens <= now && closes >= now
                  const isClosed = closes && closes < now

                  return (
                    <tr key={lot.id as string} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <Link href={`/admin/transaction/lots/${lot.id}${qs}`} className="font-semibold text-gray-900 hover:text-blue-600">
                          {lot.name as string}
                        </Link>
                        <span className="ml-2 text-gray-400">#{lot.lot_number as string}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-600">{grade}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          lot.status === 'published' ? 'bg-green-100 text-green-700'
                          : lot.status === 'draft'   ? 'bg-gray-100 text-gray-600'
                          : lot.status === 'archived'? 'bg-gray-100 text-gray-400'
                          : 'bg-red-100 text-red-600'
                        }`}>
                          {lot.status as string}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {isOpen   ? <span className="text-emerald-600 font-bold">● Session active</span>
                        : isClosed? <span className="text-gray-400">Clôturée</span>
                        : opens   ? <span>{opens.toLocaleDateString('fr-CH')}</span>
                        : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-gray-700">
                        {lot.reserve_price ? fmtChf(lot.reserve_price as number) : <span className="text-gray-300">Sans réserve</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
