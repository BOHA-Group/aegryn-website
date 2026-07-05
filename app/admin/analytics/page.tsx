import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Analytics — AEGRYN Admin',
  robots: { index: false, follow: false },
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const [
    { count: assetsTotal },
    { count: assetsGraded },
    { count: buyers },
    { count: sellers },
    { count: partners },
    { count: offersTotal },
    { count: transactionsClosed },
  ] = await Promise.all([
    supa.from('assets').select('*', { count: 'exact', head: true }),
    supa.from('assets').select('*', { count: 'exact', head: true }).not('aeg_grade', 'is', null),
    supa.from('profiles').select('*', { count: 'exact', head: true }).contains('roles', ['buyer']),
    supa.from('profiles').select('*', { count: 'exact', head: true }).contains('roles', ['seller']),
    supa.from('profiles').select('*', { count: 'exact', head: true }).contains('roles', ['partner']),
    supa.from('auction_bids').select('*', { count: 'exact', head: true }),
    supa.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
  ])

  const kpis = [
    { label: 'Actifs soumis',          value: assetsTotal ?? 0 },
    { label: 'Actifs gradés',          value: assetsGraded ?? 0 },
    { label: 'Acquéreurs',             value: buyers ?? 0 },
    { label: 'Vendeurs',               value: sellers ?? 0 },
    { label: 'Partenaires',            value: partners ?? 0 },
    { label: 'Offres soumises',        value: offersTotal ?? 0 },
    { label: 'Transactions clôturées', value: transactionsClosed ?? 0 },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Analytics</h1>
            <p className="text-[12px] text-gray-400 mt-1">KPIs opérationnels — vue d'ensemble</p>
          </div>
          <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value }) => (
            <div key={label} className="bg-white border border-gray-200 p-6">
              <p className="text-[30px] font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          Vue KPI de base. Des graphiques d'évolution (funnel, cohortes, revenus) pourront être ajoutés dans une itération suivante.
        </div>

      </div>
    </main>
  )
}
