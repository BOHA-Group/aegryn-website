import { checkAdminAccess }  from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { AnalyticsClient }      from './AnalyticsClient'
import type { Kpi, KpiDetail, Period } from './AnalyticsClient'

export const metadata: Metadata = {
  title: 'Analytics — Aegryn Admin',
  robots: { index: false, follow: false },
}

function periodStart(p: Period): string | null {
  if (p === 'all') return null
  const days = p === '7d' ? 7 : p === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}
function prevPeriodStart(p: Period): string | null {
  if (p === 'all') return null
  const days = p === '7d' ? 7 : p === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days * 2)
  return d.toISOString()
}

async function buildKpis(
  supa: ReturnType<typeof createServiceClient>,
  period: Period
): Promise<Kpi[]> {
  const from    = periodStart(period)
  const prevFrom = prevPeriodStart(period)
  const prevTo  = from   /* prev window ends where current starts */

  function addRange<T extends object>(q: T, col: string, from2: string | null, to: string | null): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let r: any = q
    if (from2) r = r.gte(col, from2)
    if (to)    r = r.lt(col, to)
    return r
  }

  /* ── Comptes utilisateurs ── */
  const profilesQ = supa.from('profiles').select('id, email, full_name, roles, created_at')
  const { data: allProfiles } = await profilesQ
  const profiles = allProfiles ?? []

  function inWindow(p: { created_at: string | null }, f: string | null, t: string | null) {
    if (!p.created_at) return false
    const d = p.created_at
    if (f && d < f) return false
    if (t && d >= t) return false
    return true
  }

  const buyers   = profiles.filter(p => Array.isArray(p.roles) && p.roles.includes('buyer'))
  const sellers  = profiles.filter(p => Array.isArray(p.roles) && p.roles.includes('seller'))
  const partners = profiles.filter(p => Array.isArray(p.roles) && p.roles.includes('partner'))

  const newBuyers  = from ? buyers.filter(p => inWindow(p, from, null)) : buyers
  const newSellers = from ? sellers.filter(p => inWindow(p, from, null)) : sellers
  const prevBuyers = prevFrom ? buyers.filter(p => inWindow(p, prevFrom, prevTo)) : []

  /* ── Assets ── */
  const { data: assetsData } = await supa
    .from('assets')
    .select('id, company_name, status, official_grade, created_at, arr')
  const assets = assetsData ?? []
  const inPeriod = (a: { created_at: string | null }) => !from || (a.created_at ?? '') >= from
  const inPrev   = (a: { created_at: string | null }) => prevFrom && (a.created_at ?? '') >= prevFrom && (!prevTo || (a.created_at ?? '') < prevTo)

  const assetsInPeriod = assets.filter(inPeriod)
  const assetsGraded   = assets.filter(a => a.official_grade)
  const assetsPrev     = assets.filter(a => inPrev(a))

  /* ── NDA requests ── */
  const { data: ndaData } = await (from
    ? supa.from('nda_requests').select('id, buyer_name, buyer_email, status, created_at').gte('created_at', from)
    : supa.from('nda_requests').select('id, buyer_name, buyer_email, status, created_at'))
  const ndaRows = ndaData ?? []
  const { data: ndaPrevData } = prevFrom
    ? await addRange(supa.from('nda_requests').select('id', { count: 'exact', head: true }), 'created_at', prevFrom, prevTo)
    : { data: null }
  const ndaPrev = (ndaPrevData as unknown as { count?: number })?.count ?? 0

  /* ── Transactions ── */
  const { data: txData } = await (from
    ? supa.from('transactions').select('id, status, created_at').gte('created_at', from)
    : supa.from('transactions').select('id, status, created_at'))
  const txRows = txData ?? []

  /* ── Term sheets ── */
  const { data: tsData } = await (from
    ? supa.from('term_sheets').select('id, status, created_at').gte('created_at', from)
    : supa.from('term_sheets').select('id, status, created_at'))
  const tsRows = tsData ?? []

  /* ── Expert applications ── */
  const { data: expAppData } = await (from
    ? supa.from('expert_applications').select('id, prenom, nom, email, profession, status, created_at').gte('created_at', from)
    : supa.from('expert_applications').select('id, prenom, nom, email, profession, status, created_at'))
  const expApps = expAppData ?? []

  /* ── Build KPI list ── */
  const kpis: Kpi[] = [
    {
      key:   'buyers',
      label: 'Acquéreurs',
      value: period === 'all' ? buyers.length : newBuyers.length,
      delta: period !== 'all' ? newBuyers.length - prevBuyers.length : null,
      href:  '/admin/members',
      detail: (period === 'all' ? buyers : newBuyers).slice(0, 50).map(p => ({
        id:    p.id,
        label: (p.full_name ?? p.email) as string,
        value: p.email as string,
        sub:   p.created_at ? new Date(p.created_at).toLocaleDateString('fr-CH') : null,
        href:  `/admin/members/${p.id}`,
      })) satisfies KpiDetail[],
    },
    {
      key:   'sellers',
      label: 'Cédants',
      value: period === 'all' ? sellers.length : newSellers.length,
      href:  '/admin/members',
      detail: (period === 'all' ? sellers : newSellers).slice(0, 50).map(p => ({
        id:    p.id,
        label: (p.full_name ?? p.email) as string,
        value: p.email as string,
        sub:   p.created_at ? new Date(p.created_at).toLocaleDateString('fr-CH') : null,
        href:  `/admin/members/${p.id}`,
      })) satisfies KpiDetail[],
    },
    {
      key:   'partners',
      label: 'Partenaires',
      value: partners.length,
      href:  '/admin/members',
      detail: partners.slice(0, 50).map(p => ({
        id:    p.id,
        label: (p.full_name ?? p.email) as string,
        value: p.email as string,
        href:  `/admin/members/${p.id}`,
      })) satisfies KpiDetail[],
    },
    {
      key:   'assets',
      label: 'Actifs soumis',
      value: assetsInPeriod.length,
      delta: period !== 'all' ? assetsInPeriod.length - assetsPrev.length : null,
      href:  '/admin/assets',
      detail: assetsInPeriod.slice(0, 50).map(a => ({
        id:    a.id,
        label: (a.company_name ?? a.id) as string,
        value: a.official_grade ?? a.status,
        sub:   a.arr ? `ARR ${a.arr}` : null,
        href:  `/admin/assets/${a.id}`,
      })) satisfies KpiDetail[],
    },
    {
      key:   'graded',
      label: 'Actifs gradés',
      value: assetsGraded.length,
      href:  '/admin/assets',
      detail: assetsGraded.slice(0, 50).map(a => ({
        id:    a.id,
        label: (a.company_name ?? a.id) as string,
        value: a.official_grade as string,
        href:  `/admin/assets/${a.id}`,
      })) satisfies KpiDetail[],
    },
    {
      key:   'nda',
      label: 'Demandes NDA',
      value: ndaRows.length,
      delta: period !== 'all' ? ndaRows.length - ndaPrev : null,
      href:  '/admin/members',
      detail: ndaRows.slice(0, 50).map(r => ({
        id:    r.id as string,
        label: (r.buyer_name ?? r.buyer_email ?? r.id) as string,
        value: r.status as string,
        sub:   r.created_at ? new Date(r.created_at as string).toLocaleDateString('fr-CH') : null,
      })) satisfies KpiDetail[],
    },
    {
      key:   'transactions',
      label: 'Transactions',
      value: txRows.length,
      href:  '/admin/transactions',
      detail: txRows.slice(0, 50).map(r => ({
        id:    r.id as string,
        label: r.id as string,
        value: r.status as string,
        sub:   r.created_at ? new Date(r.created_at as string).toLocaleDateString('fr-CH') : null,
        href:  `/admin/transactions`,
      })) satisfies KpiDetail[],
    },
    {
      key:   'termsheets',
      label: 'Term Sheets',
      value: tsRows.length,
      href:  '/admin/transactions',
      detail: tsRows.slice(0, 50).map(r => ({
        id:    r.id as string,
        label: r.id as string,
        value: r.status as string,
      })) satisfies KpiDetail[],
    },
    {
      key:   'expert_apps',
      label: 'Candidatures experts',
      value: expApps.length,
      href:  '/admin/experts',
      detail: expApps.slice(0, 50).map(a => ({
        id:    a.id as string,
        label: `${a.prenom ?? ''} ${a.nom ?? ''}`.trim(),
        value: (a.profession ?? a.status) as string,
        sub:   a.email as string,
        href:  '/admin/experts',
      })) satisfies KpiDetail[],
    },
  ]

  return kpis
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  await checkAdminAccess(sp.token)

  const supa = createServiceClient()

  /* Build all 4 period datasets in parallel */
  const [kpis7d, kpis30d, kpis90d, kpisAll] = await Promise.all([
    buildKpis(supa, '7d'),
    buildKpis(supa, '30d'),
    buildKpis(supa, '90d'),
    buildKpis(supa, 'all'),
  ])

  const kpisByPeriod = {
    '7d':  kpis7d,
    '30d': kpis30d,
    '90d': kpis90d,
    'all': kpisAll,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN · Pilotage</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Analytics</h1>
            <p className="text-[12px] text-gray-400 mt-1">KPIs opérationnels filtrables — cliquez un KPI pour voir le détail</p>
          </div>
          <Link
            href="/admin"
            className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        <AnalyticsClient kpisByPeriod={kpisByPeriod} />

      </div>
    </main>
  )
}
