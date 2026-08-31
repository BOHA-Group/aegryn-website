'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  email: string
  full_name: string | null
  roles: string[] | null
  created_at: string | null
  updated_at: string | null
  admin_note: string | null
}

type NdaRow = {
  id: string
  buyer_name: string | null
  buyer_email: string | null
  buyer_company: string | null
  buyer_type: string | null
  capacity: string | null
  status: string | null
  created_at: string | null
  asset_id: string | null
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function RoleBadge({ role }: { role: string }) {
  const color =
    role === 'admin' || role === 'super_admin'
      ? 'bg-red-100 text-red-700 border-red-200'
      : role === 'buyer'   ? 'bg-blue-50 text-blue-700 border-blue-200'
      : role === 'seller'  ? 'bg-amber-50 text-amber-700 border-amber-200'
      : role === 'partner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-gray-50 text-gray-500 border-gray-200'
  return (
    <span className={`inline-block font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${color}`}>
      {role}
    </span>
  )
}

function statusColor(s: string | null) {
  return s === 'pending'    ? 'bg-yellow-50 text-yellow-700'
    : s === 'approved'      ? 'bg-blue-50 text-blue-700'
    : s === 'nda_sent'      ? 'bg-purple-50 text-purple-700'
    : s === 'nda_signed'    ? 'bg-emerald-50 text-emerald-700 font-semibold'
    : s === 'rejected'      ? 'bg-red-50 text-red-600'
    : 'bg-gray-50 text-gray-400'
}

function buyerTypeLabel(t: string | null) {
  return t === 'pe'          ? 'Fonds PE/VC'
    : t === 'strategic'      ? 'Stratégique'
    : t === 'family_office'  ? 'Family office'
    : t === 'individual'     ? 'Particulier'
    : t ?? '—'
}

/* ── Delete confirmation inline ── */
function DeleteButton({ id, name }: { id: string; name: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/members/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
      else alert('Erreur lors de la suppression')
    })
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="font-mono text-[9px] uppercase tracking-widest text-red-400 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors whitespace-nowrap"
      >
        Supprimer
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] text-red-600 font-semibold whitespace-nowrap">Confirmer ?</span>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="font-mono text-[9px] uppercase tracking-widest text-white bg-red-600 border border-red-600 px-2 py-1 hover:bg-red-700 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {isPending ? '…' : 'Oui, supprimer'}
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="font-mono text-[9px] text-gray-500 border border-gray-200 px-2 py-1 hover:bg-gray-50 transition-colors"
      >
        Annuler
      </button>
    </div>
  )
}

export function MembersClient({
  profiles,
  ndaRows,
  profileIdByEmail,
}: {
  profiles: Profile[]
  ndaRows: NdaRow[]
  profileIdByEmail: Record<string, string>
}) {
  const [tab, setTab] = useState<'users' | 'nda'>('users')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  /* ── Filtrage profiles ── */
  const filtered = profiles.filter(p => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      (p.email ?? '').toLowerCase().includes(q) ||
      (p.full_name ?? '').toLowerCase().includes(q)
    const matchRole =
      roleFilter === 'all' ||
      (p.roles ?? []).includes(roleFilter)
    return matchSearch && matchRole
  })

  /* ── Stats ── */
  const counts = {
    total:   profiles.length,
    buyers:  profiles.filter(p => (p.roles ?? []).includes('buyer')).length,
    sellers: profiles.filter(p => (p.roles ?? []).includes('seller')).length,
    partners:profiles.filter(p => (p.roles ?? []).includes('partner')).length,
    noRole:  profiles.filter(p => !(p.roles ?? []).length).length,
  }

  const ndaCounts = {
    pending:    ndaRows.filter(r => r.status === 'pending').length,
    approved:   ndaRows.filter(r => r.status === 'approved').length,
    nda_sent:   ndaRows.filter(r => r.status === 'nda_sent').length,
    nda_signed: ndaRows.filter(r => r.status === 'nda_signed').length,
  }

  return (
    <div>
      {/* ── Onglets ── */}
      <div className="flex items-center gap-0 border-b border-gray-200 mb-6">
        {([['users', 'Utilisateurs'], ['nda', 'Demandes NDA']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-[#0F1A2B] text-[#0F1A2B] font-bold'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {label}
            <span className="ml-1.5 font-sans text-[10px] opacity-60">
              ({key === 'users' ? profiles.length : ndaRows.length})
            </span>
          </button>
        ))}
      </div>

      {/* ══ TAB : UTILISATEURS ══════════════════════════════════ */}
      {tab === 'users' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Total',     count: counts.total,    color: 'border-gray-200 bg-white' },
              { label: 'Acheteurs', count: counts.buyers,   color: 'border-blue-200 bg-blue-50' },
              { label: 'Vendeurs',  count: counts.sellers,  color: 'border-amber-200 bg-amber-50' },
              { label: 'Partenaires', count: counts.partners, color: 'border-emerald-200 bg-emerald-50' },
              { label: 'Sans rôle', count: counts.noRole,   color: 'border-gray-100 bg-gray-50' },
            ].map(({ label, count, color }) => (
              <div key={label} className={`border p-4 ${color}`}>
                <p className="text-[24px] font-bold text-gray-900">{count}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Rechercher par nom ou email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-[12px] font-sans w-72 focus:outline-none focus:border-gray-400"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-[11px] font-mono uppercase tracking-wide focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="all">Tous les rôles</option>
              <option value="buyer">Acheteur</option>
              <option value="seller">Vendeur</option>
              <option value="partner">Partenaire</option>
              <option value="admin">Admin</option>
            </select>
            <span className="font-mono text-[10px] text-gray-400">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <p className="text-[13px] text-gray-400">Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] bg-white border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Nom', 'Email', 'Rôles', 'Créé le', 'Mis à jour', 'Note admin', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/members/${p.id}`}
                          className="font-semibold text-gray-900 hover:text-[#0F1A2B] hover:underline"
                        >
                          {p.full_name ?? <span className="italic text-gray-400">—</span>}
                        </Link>
                        <div className="font-mono text-[9px] text-gray-300 mt-0.5">{p.id.slice(0, 8)}…</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-[11px]">{p.email}</td>
                      <td className="px-4 py-3">
                        {(p.roles ?? []).length > 0
                          ? <div className="flex flex-wrap gap-1">{(p.roles ?? []).map(r => <RoleBadge key={r} role={r} />)}</div>
                          : <span className="text-gray-300 text-[10px] italic">aucun rôle</span>
                        }
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-400 whitespace-nowrap">{fmtDate(p.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-gray-400 whitespace-nowrap">{fmtDate(p.updated_at)}</td>
                      <td className="px-4 py-3 max-w-[160px]">
                        {p.admin_note
                          ? <span className="text-[11px] text-gray-500 line-clamp-2">{p.admin_note}</span>
                          : <span className="text-gray-300 text-[10px]">—</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <Link
                            href={`/admin/members/${p.id}`}
                            className="font-mono text-[9px] uppercase tracking-widest text-[#0F1A2B] border border-[#0F1A2B]/20 px-2 py-1 hover:bg-[#0F1A2B] hover:text-white transition-colors whitespace-nowrap text-center"
                          >
                            Détail →
                          </Link>
                          <DeleteButton id={p.id} name={p.full_name ?? p.email} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ══ TAB : DEMANDES NDA ══════════════════════════════════ */}
      {tab === 'nda' && (
        <>
          {/* Stats NDA */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'En attente',  count: ndaCounts.pending,    color: 'border-yellow-200 bg-yellow-50' },
              { label: 'Approuvés',   count: ndaCounts.approved,   color: 'border-blue-200 bg-blue-50' },
              { label: 'NDA envoyé',  count: ndaCounts.nda_sent,   color: 'border-purple-200 bg-purple-50' },
              { label: 'NDA signé',   count: ndaCounts.nda_signed, color: 'border-emerald-200 bg-emerald-50' },
            ].map(({ label, count, color }) => (
              <div key={label} className={`border p-4 ${color}`}>
                <p className="text-[24px] font-bold text-gray-900">{count}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {ndaRows.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <p className="text-[13px] text-gray-400">Aucune demande NDA reçue.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] bg-white border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date', 'Acquéreur', 'Société', 'Type', 'Capacité', 'Actif ID', 'Statut', 'Profil'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ndaRows.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-400 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{r.buyer_name ?? '—'}</div>
                        <div className="text-[10px] text-gray-400">{r.buyer_email ?? ''}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.buyer_company ?? '—'}</td>
                      <td className="px-4 py-3 text-[10px] uppercase tracking-wide text-gray-500">{buyerTypeLabel(r.buyer_type)}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{r.capacity ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{(r.asset_id ?? '').slice(0, 8)}…</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${statusColor(r.status)}`}>
                          {r.status ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.buyer_email && profileIdByEmail[r.buyer_email] ? (
                          <Link
                            href={`/admin/members/${profileIdByEmail[r.buyer_email]}`}
                            className="font-mono text-[9px] uppercase tracking-widest text-[#0F1A2B] border border-[#0F1A2B]/20 px-2 py-1 hover:bg-[#0F1A2B] hover:text-white transition-colors whitespace-nowrap"
                          >
                            Profil →
                          </Link>
                        ) : (
                          <span className="text-gray-300 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
