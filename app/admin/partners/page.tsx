import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import PartnersTableClient     from './PartnersTableClient'

export const metadata: Metadata = {
  title: 'Partenaires — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()

  const { data, error } = await supa
    .from('profiles')
    .select('id, full_name, email, roles, created_at')
    .contains('roles', ['partner'])
    .order('created_at', { ascending: false })

  const rows = (data ?? []) as Record<string, unknown>[]

  const partnerIds = rows.map(r => String(r.id))
  const [{ data: certs }, { data: refs }] = await Promise.all([
    partnerIds.length ? supa.from('partner_certifications').select('partner_id, status').in('partner_id', partnerIds) : Promise.resolve({ data: [] }),
    partnerIds.length ? supa.from('introductions').select('partner_id, introduction_status').in('partner_id', partnerIds) : Promise.resolve({ data: [] }),
  ])

  function statsFor(id: string) {
    const c = (certs ?? []).filter((x: Record<string, unknown>) => x.partner_id === id)
    const r = (refs ?? []).filter((x: Record<string, unknown>) => x.partner_id === id)
    return {
      pendingCerts: c.filter((x: Record<string, unknown>) => x.status === 'assigned' || x.status === 'in_review').length,
      introductions: r.length,
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-6 md:px-10 md:py-10">
      <div className="max-w-7xl mx-auto w-full">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Partenaires</h1>
            <p className="text-[12px] text-gray-400 mt-1">Cabinets juridiques, experts-comptables, cybersécurité et apporteurs d'affaires</p>
          </div>
          <Link href={`/admin`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}. La migration 017 doit être appliquée pour activer cette page.
          </div>
        )}

        <PartnersTableClient
          rows={rows.map(r => ({
            id:           String(r.id),
            full_name:    r.full_name != null ? String(r.full_name) : null,
            email:        r.email     != null ? String(r.email)     : null,
            ...statsFor(String(r.id)),
          }))}
        />

      </div>
    </main>
  )
}
