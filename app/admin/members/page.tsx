import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Members — Aegryn Admin',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function statusColor(s: string) {
  return s === 'pending'    ? 'bg-yellow-50 text-yellow-700'
    : s === 'approved'      ? 'bg-emerald-50 text-emerald-700'
    : s === 'rejected'      ? 'bg-red-50 text-red-600'
    : s === 'nda_sent'      ? 'bg-blue-50 text-blue-700'
    : s === 'nda_signed'    ? 'bg-green-50 text-green-800 font-semibold'
    : 'bg-gray-50 text-gray-400'
}

function buyerTypeLabel(t: string) {
  return t === 'pe'            ? 'Fonds PE/VC'
    : t === 'strategic'        ? 'Stratégique'
    : t === 'family_office'    ? 'Family office'
    : t === 'individual'       ? 'Particulier'
    : t || '—'
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; action?: string; id?: string; status?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  /* ── Action : changer le statut d'une demande NDA ── */
  if (params.action && params.id && params.status) {
    const allowed = ['approved', 'rejected', 'nda_sent', 'nda_signed']
    if (allowed.includes(params.status)) {
      const update: Record<string, unknown> = { status: params.status }
      if (params.status === 'nda_sent')   update.nda_sent_at   = new Date().toISOString()
      if (params.status === 'nda_signed') update.nda_signed_at = new Date().toISOString()
      update.reviewed_by = 'admin'
      update.reviewed_at = new Date().toISOString()
      await supa.from('nda_requests').update(update).eq('id', params.id)
    }
    redirect(`/admin/members${tokenQs}`)
  }

  /* ── Fetch demandes NDA avec info actif ── */
  const { data, error } = await supa
    .from('nda_requests')
    .select('id, buyer_name, buyer_email, buyer_company, buyer_type, capacity, message, status, nda_sent_at, nda_signed_at, created_at, asset_id, assets(official_grade, asset_type, arr)')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as Record<string, unknown>[]

  /* ── Récupère les profils par email pour lier vers /admin/members/[id] ── */
  const emails = [...new Set(rows.map(r => String(r.buyer_email ?? '')).filter(Boolean))]
  const { data: profilesByEmail } = emails.length
    ? await supa.from('profiles').select('id, email').in('email', emails)
    : { data: [] }
  const profileIdByEmail = Object.fromEntries(
    (profilesByEmail ?? []).map((p: { id: string; email: string }) => [p.email, p.id])
  )

  const counts = {
    pending:    rows.filter(r => r.status === 'pending').length,
    approved:   rows.filter(r => r.status === 'approved').length,
    nda_sent:   rows.filter(r => r.status === 'nda_sent').length,
    nda_signed: rows.filter(r => r.status === 'nda_signed').length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Members — Demandes NDA</h1>
            <p className="text-[12px] text-gray-400 mt-1">Qualification des acquéreurs et suivi des accords de confidentialité</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/assets${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Assets
            </Link>
            <Link href={`/admin/catalog${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Catalogue
            </Link>
            <Link href={`/admin/leads${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Leads
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'En attente',    count: counts.pending,    color: 'border-yellow-200 bg-yellow-50' },
            { label: 'Approuvés',     count: counts.approved,   color: 'border-blue-200 bg-blue-50' },
            { label: 'NDA envoyé',    count: counts.nda_sent,   color: 'border-purple-200 bg-purple-50' },
            { label: 'NDA signé',     count: counts.nda_signed, color: 'border-emerald-200 bg-emerald-50' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`border p-5 ${color}`}>
              <p className="text-[28px] font-bold text-gray-900">{count}</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucune demande NDA reçue pour le moment.</p>
            <p className="text-[11px] text-gray-300 mt-2">
              Les demandes apparaissent ici dès qu'un acquéreur remplit le formulaire NDA sur /auction/catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Acquéreur', 'Société', 'Type', 'Détail', 'Capacité', 'Actif ciblé', 'Grade', 'Statut', 'Message', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => {
                  const asset = r.assets as Record<string, unknown> | null
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{String(r.buyer_name ?? '—')}</div>
                        <div className="text-[10px] text-gray-400">{String(r.buyer_email ?? '')}</div>
                      </td>

                      <td className="px-4 py-3 text-gray-600">{String(r.buyer_company ?? '—')}</td>
                      <td className="px-4 py-3 text-[10px] uppercase tracking-wide text-gray-500">{buyerTypeLabel(String(r.buyer_type ?? ''))}</td>
                      <td className="px-4 py-3">
                        {profileIdByEmail[String(r.buyer_email ?? '')] ? (
                          <Link
                            href={`/admin/members/${profileIdByEmail[String(r.buyer_email ?? '')]}${tokenQs}`}
                            className="font-mono text-[9px] uppercase tracking-widest text-ag-navy border border-ag-navy/20 px-2 py-1 hover:bg-ag-navy hover:text-white transition-colors whitespace-nowrap"
                          >
                            Profil →
                          </Link>
                        ) : (
                          <span className="text-gray-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{String(r.capacity ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{String(r.asset_id ?? '').slice(0, 8)}…</td>
                      <td className="px-4 py-3">
                        {asset?.official_grade
                          ? <span className="font-mono font-bold text-[12px]">{String(asset.official_grade)}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${statusColor(String(r.status ?? ''))}`}>
                          {String(r.status ?? '—')}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        {r.message
                          ? <span className="text-gray-500 line-clamp-2 text-[11px]">{String(r.message)}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 min-w-[130px]">
                          {r.status === 'pending' && (
                            <>
                              <Link href={`/admin/members?action=update&id=${r.id}&status=approved${params.token ? `&token=${params.token}` : ''}`}
                                className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-2 py-1 text-center hover:border-emerald-400 transition-colors">
                                Approuver
                              </Link>
                              <Link href={`/admin/members?action=update&id=${r.id}&status=rejected${params.token ? `&token=${params.token}` : ''}`}
                                className="text-[10px] font-semibold text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 text-center hover:border-red-400 transition-colors">
                                Rejeter
                              </Link>
                            </>
                          )}
                          {r.status === 'approved' && (
                            <Link href={`/admin/members?action=update&id=${r.id}&status=nda_sent${params.token ? `&token=${params.token}` : ''}`}
                              className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 px-2 py-1 text-center hover:border-blue-400 transition-colors">
                              NDA envoyé ✓
                            </Link>
                          )}
                          {r.status === 'nda_sent' && (
                            <Link href={`/admin/members?action=update&id=${r.id}&status=nda_signed${params.token ? `&token=${params.token}` : ''}`}
                              className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 px-2 py-1 text-center hover:border-purple-400 transition-colors">
                              NDA signé ✓
                            </Link>
                          )}
                          {(r.status === 'nda_signed' || r.status === 'rejected') && (
                            <span className="text-[10px] text-gray-300 italic px-2">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          <strong>Workflow NDA :</strong> pending → approuvé → NDA envoyé manuellement par email → NDA signé → accès data room.
          <br />
          Les acquéreurs <em>nda_signed</em> ont accès aux informations complètes de l'actif via /contact ou data room dédiée.
        </div>

      </div>
    </main>
  )
}
