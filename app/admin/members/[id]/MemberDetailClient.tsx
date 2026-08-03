'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Trash2, Save, ExternalLink, AlertTriangle } from 'lucide-react'

const ALL_ROLES = ['buyer', 'seller', 'partner', 'admin', 'super_admin'] as const
type Role = typeof ALL_ROLES[number]

const STATUS_NDA_COLORS: Record<string, string> = {
  pending:    'bg-yellow-50 text-yellow-700',
  approved:   'bg-blue-50 text-blue-700',
  nda_sent:   'bg-purple-50 text-purple-700',
  nda_signed: 'bg-emerald-50 text-emerald-700 font-semibold',
  rejected:   'bg-red-50 text-red-600',
}

const STATUS_KYC_COLORS: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700',
  in_review: 'bg-blue-50 text-blue-700',
  validated: 'bg-emerald-50 text-emerald-700',
  rejected:  'bg-red-50 text-red-600',
  expired:   'bg-orange-50 text-orange-600',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function fmtChf(n: unknown) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(Number(n))
}

const NDA_TYPE_LABELS: Record<string, string> = {
  seller:  'Cédant',
  buyer:   'Acquéreur',
  partner: 'Partenaire',
}

type Props = {
  profileId:       string
  currentRoles:    string[]
  adminNote:       string
  ndaRows:         Record<string, unknown>[]
  ndaSignatures:   Record<string, unknown>[]
  ndaAcceptances:  Record<string, unknown>[]
  kycDocs:         Record<string, unknown>[]
  introductions: Record<string, unknown>[]
  commissions:   Record<string, unknown>[]
  sellerAssets:  Record<string, unknown>[]
  token:         string
  tokenQs:       string
}

type Tab = 'roles' | 'nda' | 'kyc' | 'assets' | 'partner'

export default function MemberDetailClient({
  profileId, currentRoles, adminNote: initNote,
  ndaRows, ndaSignatures, ndaAcceptances, kycDocs, introductions, commissions, sellerAssets,
  token, tokenQs,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [tab, setTab] = useState<Tab>('roles')
  const [roles, setRoles] = useState<Role[]>(currentRoles as Role[])
  const [note, setNote] = useState(initNote)
  const [saving,      setSaving]      = useState(false)
  const [savedMsg,    setSavedMsg]    = useState('')
  const [deleting,    setDeleting]    = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function deleteAccount() {
    const confirmed = window.confirm(
      'Supprimer définitivement ce compte ?\n\nCette action est IRRÉVERSIBLE.\nToutes les données associées seront effacées (KYC, NDA, notifications, introductions, commissions).\nLes actifs et offres seront dissociés mais conservés.'
    )
    if (!confirmed) return
    setDeleting(true)
    setDeleteError('')
    const res = await fetch(`/api/admin/members/${profileId}${tokenQs ? `?${tokenQs.slice(1)}` : ''}`, { method: 'DELETE' })
    const data = await res.json() as { ok?: boolean; error?: string }
    if (data.ok) {
      router.push(`/admin/members${tokenQs}`)
    } else {
      setDeleteError(data.error ?? 'Erreur inconnue.')
      setDeleting(false)
    }
  }

  /* ── Patch helper ── */
  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/members/${profileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...body }),
    })
    return res.json()
  }

  /* ── Save roles + note ── */
  async function saveProfile() {
    setSaving(true)
    const r = await patch({ roles, admin_note: note })
    setSaving(false)
    if (r.ok) {
      setSavedMsg('Profil mis à jour')
      setTimeout(() => setSavedMsg(''), 3000)
      startTransition(() => router.refresh())
    }
  }

  /* ── Toggle role ── */
  function toggleRole(r: Role) {
    setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])
  }

  /* ── NDA status ── */
  async function updateNda(ndaId: string, status: string) {
    await patch({ nda_request_id: ndaId, nda_status: status })
    startTransition(() => router.refresh())
  }

  async function deleteNda(ndaId: string) {
    if (!confirm('Supprimer cette demande NDA ?')) return
    await patch({ delete_nda_request_id: ndaId })
    startTransition(() => router.refresh())
  }

  /* ── KYC doc status ── */
  async function updateKyc(docId: string, status: string) {
    await patch({ kyc_doc_id: docId, kyc_status: status })
    startTransition(() => router.refresh())
  }

  async function deleteKyc(docId: string) {
    if (!confirm('Supprimer ce document KYC ?')) return
    await patch({ delete_kyc_doc_id: docId })
    startTransition(() => router.refresh())
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'roles',   label: 'Rôles & Notes' },
    { key: 'nda',     label: 'NDA',     count: ndaRows.length },
    { key: 'kyc',     label: 'KYC',     count: kycDocs.length },
    { key: 'assets',  label: 'Actifs',  count: sellerAssets.length },
    { key: 'partner', label: 'Partenaire', count: (introductions.length + commissions.length) || undefined },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 bg-white">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 ${
              tab === key
                ? 'border-b-2 border-ag-navy text-ag-navy'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {label}
            {count != null && count > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 font-bold ${tab === key ? 'bg-ag-navy text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── ONGLET RÔLES ─────────────────────────────────────────── */}
      {tab === 'roles' && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rôles */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Rôles actifs</p>
            <div className="flex flex-col gap-2">
              {ALL_ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => toggleRole(r)}
                  className={`flex items-center gap-3 px-4 py-2.5 border text-left transition-colors ${
                    roles.includes(r)
                      ? 'bg-ag-navy border-ag-navy text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                  }`}
                >
                  <span className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                    roles.includes(r) ? 'border-ag-apex bg-ag-apex' : 'border-current'
                  }`}>
                    {roles.includes(r) && <Check size={10} className="text-ag-navy" />}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note admin */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Note interne admin</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={8}
              className="w-full border border-gray-200 p-3 font-sans text-[12px] text-gray-700 resize-y focus:outline-none focus:border-ag-navy transition-colors"
              placeholder="Note confidentielle sur ce profil..."
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={saving || isPending}
                className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-ag-navy/90 transition-colors disabled:opacity-50"
              >
                <Save size={12} />
                {saving ? 'Enregistrement…' : 'Sauvegarder'}
              </button>
              {savedMsg && (
                <span className="font-mono text-[10px] text-emerald-600">{savedMsg}</span>
              )}
            </div>
          </div>
        </div>

        {/* Zone de danger */}
        <div className="mt-6 border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 font-bold">Zone de danger</p>
              <p className="font-sans text-[12px] text-red-700 mt-1">
                La suppression efface définitivement le compte Auth, le profil, les documents KYC, les demandes NDA, les notifications et les données partenaire.
                Les actifs et offres sont dissociés mais <strong>conservés</strong>. Action irréversible.
              </p>
            </div>
          </div>
          <button
            onClick={deleteAccount}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={12} />
            {deleting ? 'Suppression…' : 'Supprimer le compte'}
          </button>
          {deleteError && (
            <p className="font-sans text-[12px] text-red-700 mt-3">{deleteError}</p>
          )}
        </div>
        </>
      )}

      {/* ─── ONGLET NDA ───────────────────────────────────────────── */}
      {tab === 'nda' && (
        <div className="space-y-6">

          {/* NDA profil — acceptations en ligne (seller/buyer/partner) */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">NDA profil — Acceptations en ligne</p>
              {ndaAcceptances.length > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold">
                  {ndaAcceptances.length} signature{ndaAcceptances.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {ndaAcceptances.length === 0 ? (
              <div className="px-5 py-6">
                <p className="font-sans text-[12px] text-gray-400">Aucun NDA profil accepté en ligne.</p>
              </div>
            ) : (
              <table className="w-full text-[12px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Rôle', 'Version', 'Date acceptation', 'IP', 'User Agent'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ndaAcceptances.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 bg-ag-navy/10 text-ag-navy">
                          {NDA_TYPE_LABELS[String(a.nda_type)] ?? String(a.nda_type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{String(a.nda_version ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-emerald-700 font-semibold">{fmtDate(a.accepted_at)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{String(a.ip_address ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-300 max-w-[200px] truncate" title={String(a.user_agent ?? '')}>
                        {String(a.user_agent ?? '—').slice(0, 60)}{String(a.user_agent ?? '').length > 60 ? '…' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* NDA Auction — signature plateforme */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">NDA Auction — Signature plateforme</p>
              {ndaSignatures.length > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold">
                  Signé
                </span>
              )}
            </div>
            {ndaSignatures.length === 0 ? (
              <div className="px-5 py-6">
                <p className="font-sans text-[12px] text-gray-400">Aucune signature NDA plateforme enregistrée.</p>
              </div>
            ) : (
              <table className="w-full text-[12px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Date signature', 'Version', 'Scope', 'IP', 'User Agent'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ndaSignatures.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-emerald-700 font-semibold">{fmtDate(s.signed_at)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{String(s.nda_version ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-500 uppercase">{String(s.scope ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{String(s.ip_address ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-300 max-w-[200px] truncate" title={String(s.user_agent ?? '')}>
                        {String(s.user_agent ?? '—').slice(0, 60)}{String(s.user_agent ?? '').length > 60 ? '…' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* NDA requests legacy */}
          <div className="bg-white border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Demandes NDA legacy (pré-plateforme)</p>
            </div>
          {ndaRows.length === 0 ? (
            <div className="px-5 py-6">
              <p className="font-sans text-[12px] text-gray-400">Aucune demande NDA legacy.</p>
            </div>
          ) : (
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Actif', 'Grade', 'Type', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ndaRows.map((r, i) => {
                  const asset = r.assets as Record<string, unknown> | null
                  const ndaId = String(r.id)
                  const status = String(r.status ?? '')
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {asset?.company_name ? String(asset.company_name) : (
                          <span className="font-mono text-[10px] text-gray-400">{String(r.asset_id ?? '').slice(0, 8)}…</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[13px]">
                        {asset?.official_grade ? String(asset.official_grade) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-500 uppercase">{String(r.buyer_type ?? '—')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${STATUS_NDA_COLORS[status] ?? 'bg-gray-50 text-gray-400'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {status === 'pending' && <>
                            <button onClick={() => updateNda(ndaId, 'approved')}
                              className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors">
                              Approuver
                            </button>
                            <button onClick={() => updateNda(ndaId, 'rejected')}
                              className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                              Rejeter
                            </button>
                          </>}
                          {status === 'approved' && (
                            <button onClick={() => updateNda(ndaId, 'nda_sent')}
                              className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                              NDA envoyé ✓
                            </button>
                          )}
                          {status === 'nda_sent' && (
                            <button onClick={() => updateNda(ndaId, 'nda_signed')}
                              className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors">
                              NDA signé ✓
                            </button>
                          )}
                          <button onClick={() => deleteNda(ndaId)}
                            className="p-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                            title="Supprimer (test data)">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          </div>
        </div>
      )}

      {/* ─── ONGLET KYC ───────────────────────────────────────────── */}
      {tab === 'kyc' && (
        <div className="bg-white border border-gray-200">
          {kycDocs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-sans text-[13px] text-gray-400">Aucun document KYC pour cet utilisateur.</p>
            </div>
          ) : (
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Type', 'Statut', 'Validé le', 'Fichier', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kycDocs.map((d, i) => {
                  const docId = String(d.id)
                  const status = String(d.status ?? '')
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(d.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-600">{String(d.doc_type ?? '—')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${STATUS_KYC_COLORS[status] ?? 'bg-gray-50 text-gray-400'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(d.validated_at)}</td>
                      <td className="px-4 py-3">
                        {d.file_url ? (
                          <a href={String(d.file_url)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 font-mono text-[10px] text-ag-navy hover:underline">
                            <ExternalLink size={10} /> Voir
                          </a>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {status !== 'validated' && (
                            <button onClick={() => updateKyc(docId, 'validated')}
                              className="font-mono text-[9px] uppercase px-2 py-1 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors">
                              Valider
                            </button>
                          )}
                          {status !== 'rejected' && (
                            <button onClick={() => updateKyc(docId, 'rejected')}
                              className="font-mono text-[9px] uppercase px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                              Rejeter
                            </button>
                          )}
                          <button onClick={() => deleteKyc(docId)}
                            className="p-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                            title="Supprimer (test data)">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ─── ONGLET ACTIFS VENDEUR ────────────────────────────────── */}
      {tab === 'assets' && (
        <div className="bg-white border border-gray-200">
          {sellerAssets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-sans text-[13px] text-gray-400">Aucun actif soumis par ce vendeur.</p>
            </div>
          ) : (
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Société', 'Type', 'ARR', 'Grade', 'Statut', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellerAssets.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(a.created_at)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{String(a.company_name ?? '—')}</td>
                    <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">{String(a.asset_type ?? '—')}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{fmtChf(a.arr)}</td>
                    <td className="px-4 py-3 font-mono font-bold">{a.official_grade ? String(a.official_grade) : <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] uppercase text-gray-500">{String(a.status ?? '—')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/assets${tokenQs ? tokenQs + '&' : '?'}id=${String(a.id)}`}
                        className="flex items-center gap-1 font-mono text-[10px] text-ag-navy hover:underline">
                        <ExternalLink size={10} /> Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ─── ONGLET PARTENAIRE ────────────────────────────────────── */}
      {tab === 'partner' && (
        <div className="flex flex-col gap-6">
          {/* Introductions */}
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Introductions ({introductions.length})</p>
            </div>
            {introductions.length === 0 ? (
              <div className="p-8 text-center"><p className="font-sans text-[12px] text-gray-400">Aucune introduction.</p></div>
            ) : (
              <table className="w-full text-[12px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date', 'Type', 'Contact', 'Statut', 'Note admin'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {introductions.map((intro, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(intro.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">{String(intro.introduction_type ?? '—')}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{String(intro.contact_name ?? '—')}</div>
                        <div className="text-[10px] text-gray-400">{String(intro.contact_email ?? '')}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">{String(intro.introduction_status ?? '—')}</td>
                      <td className="px-4 py-3 text-[11px] text-gray-500 max-w-[200px]">{String(intro.admin_note ?? '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Commissions */}
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Commissions ({commissions.length})</p>
            </div>
            {commissions.length === 0 ? (
              <div className="p-8 text-center"><p className="font-sans text-[12px] text-gray-400">Aucune commission.</p></div>
            ) : (
              <table className="w-full text-[12px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date', 'Type', 'Montant', 'Statut', 'Payé le'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {commissions.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(c.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">{String(c.type ?? '—')}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-gray-800">{fmtChf(c.amount_chf)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">{String(c.status ?? '—')}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(c.paid_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2">
          Mise à jour…
        </div>
      )}
    </div>
  )
}
