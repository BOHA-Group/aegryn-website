import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'KYC — Aegryn Admin',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function statusColor(s: string) {
  return s === 'pending'    ? 'bg-yellow-50 text-yellow-700'
    : s === 'in_review'     ? 'bg-blue-50 text-blue-700'
    : s === 'approved'      ? 'bg-emerald-50 text-emerald-700'
    : s === 'rejected'      ? 'bg-red-50 text-red-600'
    : s === 'expired'       ? 'bg-orange-50 text-orange-600'
    : 'bg-gray-50 text-gray-400'
}

export default async function AdminKycPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const [
    { data: kycData, error },
    { data: docCounts },
    { data: partnerDocs },
  ] = await Promise.all([
    supa
      .from('buyer_kyc_verifications')
      .select('id, user_id, full_name, company_name, country, kyc_status, declared_capacity_min_chf, declared_capacity_max_chf, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    supa.from('kyc_documents').select('user_id, status'),
    supa.from('kyc_documents').select('user_id').eq('status', 'pending'),
  ])

  /* IDs de partenaires avec docs pending mais sans entrée buyer_kyc_verifications */
  const kycUserIds = new Set((kycData ?? []).map((r: Record<string, unknown>) => String(r.user_id)))
  const partnerOnlyIds = [...new Set(
    (partnerDocs ?? [])
      .map((d: Record<string, unknown>) => String(d.user_id))
      .filter(uid => !kycUserIds.has(uid))
  )]

  /* Profiles partenaires sans buyer_kyc_verifications */
  const { data: partnerProfiles } = partnerOnlyIds.length
    ? await supa.from('profiles').select('id, full_name, kyc_status, roles').in('id', partnerOnlyIds)
    : { data: [] }

  const partnerRows: Record<string, unknown>[] = (partnerProfiles ?? [])
    .filter((p: Record<string, unknown>) => {
      const roles = Array.isArray(p.roles) ? p.roles : []
      return roles.includes('partner') || roles.includes('seller') || roles.includes('buyer')
    })
    .map((p: Record<string, unknown>) => ({
      id:          null,
      user_id:     p.id,
      full_name:   p.full_name ?? '—',
      company_name: null,
      country:     null,
      kyc_status:  p.kyc_status ?? 'pending',
      declared_capacity_min_chf: null,
      declared_capacity_max_chf: null,
      created_at:  null,
      _roles:      Array.isArray(p.roles) ? p.roles : [],
    }))

  const rows = [...(kycData ?? []) as Record<string, unknown>[], ...partnerRows]

  const docsByUser = new Map<string, { total: number; validated: number }>()
  for (const d of (docCounts ?? []) as { user_id: string; status: string }[]) {
    const cur = docsByUser.get(d.user_id) ?? { total: 0, validated: 0 }
    cur.total += 1
    if (d.status === 'validated') cur.validated += 1
    docsByUser.set(d.user_id, cur)
  }

  const counts = {
    pending:   rows.filter(r => r.kyc_status === 'pending').length,
    in_review: rows.filter(r => r.kyc_status === 'in_review').length,
    approved:  rows.filter(r => r.kyc_status === 'approved').length,
    rejected:  rows.filter(r => r.kyc_status === 'rejected').length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">KYC — File à traiter</h1>
            <p className="text-[12px] text-gray-400 mt-1">Validation des documents d&apos;identité, KYC et UBO — Acquéreurs, Cédants et Partenaires</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'En attente',   count: counts.pending,   color: 'border-yellow-200 bg-yellow-50' },
            { label: 'En revue',     count: counts.in_review, color: 'border-blue-200 bg-blue-50' },
            { label: 'Approuvés',    count: counts.approved,  color: 'border-emerald-200 bg-emerald-50' },
            { label: 'Rejetés',      count: counts.rejected,  color: 'border-red-200 bg-red-50' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`border p-5 ${color}`}>
              <p className="text-[28px] font-bold text-gray-900">{count}</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}. La migration 017 doit être appliquée pour activer cette page.
          </div>
        )}

        {rows.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucune vérification KYC pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Nom', 'Société', 'Pays', 'Capacité déclarée', 'Documents', 'Statut', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => {
                  const docs = docsByUser.get(String(r.user_id)) ?? { total: 0, validated: 0 }
                  return (
                    <tr key={String(r.id ?? r.user_id)} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {String(r.full_name ?? '—')}
                        {Array.isArray(r._roles) && (r._roles as string[]).length > 0 && (() => {
                          const roles = r._roles as string[]
                          const label = roles.includes('seller') && !roles.includes('buyer') ? 'Cédant'
                            : roles.includes('partner') ? 'Partenaire'
                            : roles.includes('seller') ? 'Cédant'
                            : 'Utilisateur'
                          const cls = roles.includes('seller') && !roles.includes('partner')
                            ? 'text-amber-700 border-amber-300'
                            : 'text-ag-apex border-ag-apex/30'
                          return <span className={`ml-2 font-mono text-[9px] uppercase tracking-widest border px-1 py-0.5 ${cls}`}>{label}</span>
                        })()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{String(r.company_name ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{String(r.country ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">
                        {r.declared_capacity_min_chf ? `${r.declared_capacity_min_chf} – ${r.declared_capacity_max_chf} CHF` : '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{docs.validated}/{docs.total || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${statusColor(String(r.kyc_status ?? ''))}`}>
                          {String(r.kyc_status ?? '—')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/kyc/${r.user_id}${tokenQs}`}
                          className="text-[10px] font-semibold text-gray-700 border border-gray-300 px-2 py-1 hover:border-gray-500 transition-colors">
                          Ouvrir dossier →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          <strong>Process manuel :</strong> chaque document est validé/rejeté individuellement dans le dossier membre.
          Le statut global KYC (pending → in_review → approved) est ensuite mis à jour manuellement une fois tous les documents requis validés.
        </div>

      </div>
    </main>
  )
}
