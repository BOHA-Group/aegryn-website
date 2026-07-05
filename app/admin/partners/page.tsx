import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Partenaires — AEGRYN Admin',
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
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const { data, error } = await supa
    .from('profiles')
    .select('id, full_name, email, roles, created_at')
    .contains('roles', ['partner'])
    .order('created_at', { ascending: false })

  const rows = (data ?? []) as Record<string, unknown>[]

  const partnerIds = rows.map(r => String(r.id))
  const [{ data: certs }, { data: refs }, { data: comms }] = await Promise.all([
    partnerIds.length ? supa.from('partner_certifications').select('partner_id, status').in('partner_id', partnerIds) : Promise.resolve({ data: [] }),
    partnerIds.length ? supa.from('introductions').select('partner_id, introduction_status').in('partner_id', partnerIds) : Promise.resolve({ data: [] }),
    partnerIds.length ? supa.from('commissions').select('partner_id, amount_chf, status').in('partner_id', partnerIds) : Promise.resolve({ data: [] }),
  ])

  function statsFor(id: string) {
    const c = (certs ?? []).filter((x: Record<string, unknown>) => x.partner_id === id)
    const r = (refs ?? []).filter((x: Record<string, unknown>) => x.partner_id === id)
    const m = (comms ?? []).filter((x: Record<string, unknown>) => x.partner_id === id)
    return {
      pendingCerts: c.filter((x: Record<string, unknown>) => x.status === 'assigned' || x.status === 'in_review').length,
      introductions: r.length,
      commissionsDue: m.filter((x: Record<string, unknown>) => x.status !== 'paid').reduce((s: number, x: Record<string, unknown>) => s + Number(x.amount_chf ?? 0), 0),
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Partenaires Alliance</h1>
            <p className="text-[12px] text-gray-400 mt-1">Cabinets juridiques, experts-comptables, cybersécurité et apporteurs d'affaires</p>
          </div>
          <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}. La migration 017 doit être appliquée pour activer cette page.
          </div>
        )}

        {rows.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucun partenaire pour le moment.</p>
            <p className="text-[11px] text-gray-300 mt-2">Un partenaire est un profil dont le tableau roles[] contient 'partner'.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Nom', 'Email', 'Dossiers en cours', 'Apports', 'Commissions dues', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => {
                  const s = statsFor(String(r.id))
                  return (
                    <tr key={String(r.id)} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{String(r.full_name ?? '—')}</td>
                      <td className="px-4 py-3 text-gray-500">{String(r.email ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{s.pendingCerts}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{s.introductions}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{s.commissionsDue.toLocaleString('fr-CH')} CHF</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/partners/${r.id}${tokenQs}`}
                          className="text-[10px] font-semibold text-gray-700 border border-gray-300 px-2 py-1 hover:border-gray-500 transition-colors">
                          Ouvrir →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  )
}
