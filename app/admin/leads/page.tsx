import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import { headers }             from 'next/headers'
import type { Metadata }       from 'next'
import LeadsTable              from './LeadsTable'

export const metadata: Metadata = {
  title: 'Valuation Leads — AEGRYN Admin',
  robots: { index: false, follow: false },
}

/* ─── Basic token gate (header X-Admin-Token ou query ?token=) ── */
async function checkAccess(): Promise<boolean> {
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (!adminToken) return true  // dev : pas de token requis

  const hdrs = await headers()
  const headerToken = hdrs.get('x-admin-token')
  if (headerToken === adminToken) return true

  return false
}

export type Lead = {
  id:               string
  email:            string
  estimated_grade:  string
  score_total:      number
  score_breakdown:  { finance: number; code: number; ip: number; security: number } | null
  arr:              number | null
  valuation_low:    number | null
  valuation_high:   number | null
  pre_revenue:      boolean
  status:           string
  locale:           string | null
  created_at:       string
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; grade?: string; status?: string }>
}) {
  const params = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  /* Token gate via query param (pour accès direct navigateur) */
  if (adminToken && params.token !== adminToken) {
    const hasAccess = await checkAccess()
    if (!hasAccess) redirect('/')
  }

  /* Fetch leads via service_role */
  const supa = createServiceClient()

  let query = supa
    .from('valuation_leads')
    .select('id, email, estimated_grade, score_total, score_breakdown, arr, valuation_low, valuation_high, pre_revenue, status, locale, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (params.grade && params.grade !== 'all') {
    query = query.eq('estimated_grade', params.grade)
  }
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  const { data: leads, error } = await query

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Valuation Leads</h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Prospects ayant utilisé le simulateur /valuation et soumis leur email.
            Lecture seule · Service-role Supabase · RLS bypass.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[13px] text-red-700">
            Erreur Supabase : {error.message}
            {!process.env.SUPABASE_SERVICE_ROLE_KEY && (
              <p className="mt-1 font-semibold">SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local</p>
            )}
          </div>
        )}

        {/* Stats rapides */}
        {leads && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {(['★', 'AAA', 'AA', 'A', 'B'] as const).map(g => {
              const count = leads.filter(l => l.estimated_grade === g).length
              return (
                <div key={g} className="bg-white border border-gray-200 p-4">
                  <p className="text-[22px] font-bold text-gray-900">{count}</p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest">Grade {g}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Table avec filtres client-side */}
        <LeadsTable
          leads={(leads ?? []) as Lead[]}
          currentGrade={params.grade ?? 'all'}
          currentStatus={params.status ?? 'all'}
          adminToken={params.token}
        />

      </div>
    </main>
  )
}
