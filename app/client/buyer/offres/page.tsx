import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, Gavel } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My bids — Buyer Space Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_LABELS: Record<string, string> = {
  draft:     'Brouillon',
  submitted: 'Soumise',
  retained:  'Retenue',
  rejected:  'Rejetée',
  withdrawn: 'Retirée',
}

const STATUS_COLOR: Record<string, string> = {
  draft:     'text-gray-400 bg-gray-50 border-gray-200',
  submitted: 'text-blue-600 bg-blue-50 border-blue-200',
  retained:  'text-emerald-600 bg-emerald-50 border-emerald-200',
  rejected:  'text-red-500 bg-red-50 border-red-100',
  withdrawn: 'text-gray-400 bg-gray-50 border-gray-200',
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Bid = {
  id: string
  amount_chf: number | null
  status: string
  created_at: string
  admin_note: string | null
  assets: { id: string; company_name: string | null; official_grade: string | null } | null
}

export default async function BuyerOffresPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'client.buyer.offres' })
  const tc = await getTranslations({ locale, namespace: 'client.common' })


  const supa = createServiceClient()
  const { data: bids } = await supa
    .from('auction_bids')
    .select('id, amount_chf, status, created_at, admin_note, assets(id, company_name, official_grade)')
    .eq('bidder_id', user.id)
    .order('created_at', { ascending: false })

  const counts = (bids ?? []).reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">{t('areaLabel')}</p>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">{t('title')}</h1>
          <p className="font-sans text-[13px] text-gray-400 mt-1">
            Expressions d&apos;Intérêt et offres soumises à l&apos;équipe Aegryn.
          </p>
        </div>
        <Link href="/client/buyer/catalogue"
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors">
          <Gavel size={11} /> Nouvelle offre
        </Link>
      </div>

      {/* Compteurs par statut */}
      {bids && bids.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(STATUS_LABELS).map(([key, label]) => counts[key] ? (
            <div key={key} className={`border px-3 py-1.5 flex items-center gap-2 ${STATUS_COLOR[key]}`}>
              <span className="font-mono font-bold text-[13px]">{counts[key]}</span>
              <span className="font-sans text-[11px]">{label}</span>
            </div>
          ) : null)}
        </div>
      )}

      {/* Liste */}
      {!bids || bids.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <Gavel size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400 mb-4">
            Vous n&apos;avez pas encore soumis d&apos;offre.
          </p>
          <Link href="/client/buyer/catalogue"
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors">
            {t('exploreCatalog')} <ArrowUpRight size={10} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(bids as unknown as Bid[]).map(bid => (
            <Link key={bid.id} href={`/client/buyer/offres/${bid.id}`}
              className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-sans font-semibold text-gray-900 text-[14px] truncate">
                      {bid.assets?.company_name ?? `Actif #${bid.id.slice(0, 8)}`}
                    </p>
                    {bid.assets?.official_grade && (
                      <span className="font-mono text-[9px] text-gray-500 border border-gray-200 px-1.5 py-0.5">
                        {bid.assets.official_grade}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-gray-400">
                    Soumise le {fmtDate(bid.created_at, locale)}
                  </p>
                  {bid.admin_note && bid.status === 'rejected' && (
                    <p className="font-sans text-[11px] text-red-500 mt-1.5 italic">
                      Note admin : {bid.admin_note}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="font-mono font-bold text-[14px] text-gray-800">{fmtChf(bid.amount_chf)}</p>
                  <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${STATUS_COLOR[bid.status] ?? 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                    {STATUS_LABELS[bid.status] ?? bid.status}
                  </span>
                  <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
