import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import { Suspense }            from 'react'
import AdminLeadsClient        from './AdminLeadsClient'
import { checkAdminAccess }   from '@/lib/adminAuth'

export const metadata: Metadata = {
  title: 'Leads — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; source?: string; grade?: string; status?: string }>
}) {
  const params = await searchParams

  // Accepte : token URL valide OU cookie admin httpOnly OU session Supabase admin
  await checkAdminAccess(params.token)

  const supa   = createServiceClient()
  const source = params.source ?? 'valuation'

  /* ── Fetch selon la source ── */
  let rows: Record<string, unknown>[] = []
  let fetchError: string | null = null

  try {
    if (source === 'valuation') {
      let q = supa
        .from('valuation_leads')
        .select('id, email, estimated_grade, score_total, arr, valuation_low, valuation_high, pre_revenue, status, locale, created_at')
        .order('created_at', { ascending: false }).limit(200)
      if (params.grade && params.grade !== 'all') q = q.eq('estimated_grade', params.grade)
      if (params.status && params.status !== 'all') q = q.eq('status', params.status)
      const { data, error } = await q
      if (error) fetchError = error.message
      rows = (data ?? []) as Record<string, unknown>[]
    }

    if (source === 'catalog') {
      const { data, error } = await supa
        .from('catalog_waitlist')
        .select('id, email, acquirer_type, capacity_range, sectors_interest, status, locale, created_at')
        // id est requis par AdminLeadsClient pour l'action "Inviter" (création de compte acquéreur)
        .order('created_at', { ascending: false }).limit(200)
      if (error) fetchError = error.message
      rows = (data ?? []) as Record<string, unknown>[]
    }

    if (source === 'alliances') {
      let q = supa
        .from('alliance_applications')
        .select('id, organization_name, alliance_type, email, country, status, locale, created_at')
        .order('created_at', { ascending: false }).limit(200)
      if (params.status && params.status !== 'all') q = q.eq('status', params.status)
      const { data, error } = await q
      if (error) fetchError = error.message
      rows = (data ?? []) as Record<string, unknown>[]
    }

    if (source === 'prospects') {
      let q = supa
        .from('prospects')
        .select('id, first_name, last_name, email, profile_type, ticket_range, sectors_interest, marketing_consent, status, source, created_at')
        .order('created_at', { ascending: false }).limit(200)
      if (params.status && params.status !== 'all') q = q.eq('status', params.status)
      const { data, error } = await q
      if (error) fetchError = error.message
      rows = (data ?? []) as Record<string, unknown>[]
    }

    if (source === 'auction_access') {
      let q = supa
        .from('auction_access_requests')
        .select('id, full_name, email, company, buyer_type, capacity, message, status, locale, created_at')
        .order('created_at', { ascending: false }).limit(200)
      if (params.status && params.status !== 'all') q = q.eq('status', params.status)
      const { data, error } = await q
      if (error) fetchError = error.message
      rows = (data ?? []) as Record<string, unknown>[]
    }
  } catch (e) {
    fetchError = String(e)
  }

  /* ── Counts pour badges : leads non traités (new + pending) ── */
  // Le badge affiche les leads qui requièrent une action, pas le total brut.
  // "converted", "approved", "invited", "closed", "declined" sont exclus.
  const counts: Record<string, number> = {}
  const PENDING_STATUSES = ['new', 'pending']
  try {
    const tables = [
      { key: 'valuation',      table: 'valuation_leads'        },
      { key: 'catalog',        table: 'catalog_waitlist'        },
      // assessment_day_bookings exclu — feature archivée (API 410 Gone)
      { key: 'alliances',      table: 'alliance_applications'   },
      { key: 'prospects',      table: 'prospects'               },
      { key: 'auction_access', table: 'auction_access_requests' },
    ]
    await Promise.all(tables.map(async ({ key, table }) => {
      const { count } = await supa
        .from(table)
        .select('id', { count: 'exact', head: true })
        .in('status', PENDING_STATUSES)
      counts[key] = count ?? 0
    }))
  } catch { /* silencieux */ }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Leads & Prospects</h1>
          <p className="text-[12px] text-gray-400 mt-1">Service-role · RLS bypass · lecture seule</p>
        </div>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {fetchError}
            {!process.env.SUPABASE_SERVICE_ROLE_KEY && <span className="ml-2 font-bold">— SUPABASE_SERVICE_ROLE_KEY manquant</span>}
          </div>
        )}

        <Suspense fallback={<div className="h-32 flex items-center justify-center text-gray-400 text-sm">Chargement…</div>}>
          <AdminLeadsClient
            rows={rows}
            source={source}
            counts={counts}
            currentGrade={params.grade ?? 'all'}
            currentStatus={params.status ?? 'all'}
          />
        </Suspense>
      </div>
    </main>
  )
}
