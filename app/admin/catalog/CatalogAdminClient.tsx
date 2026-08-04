'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, X, Check, Loader2 } from 'lucide-react'

type CatalogRow = {
  id: string
  company_name: string | null
  asset_type: string | null
  arr: number | null
  official_grade: string | null
  score_total: number | null
  public_summary: string | null
  status: string
  graded_at: string | null
  published_at: string | null
}

const GRADE_OPTIONS = ['star', 'aaa', 'aa', 'a', 'b', 'refused'] as const
const GRADE_LABELS: Record<string, string> = {
  star: 'AEG ★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'Non certifiable',
}

function gradeColor(g: string) {
  return g === 'star' || g === '★' ? 'bg-emerald-100 text-emerald-800'
    : g === 'aaa' || g === 'AAA'  ? 'bg-blue-100 text-blue-800'
    : g === 'aa'  || g === 'AA'   ? 'bg-green-100 text-green-800'
    : g === 'a'   || g === 'A'    ? 'bg-yellow-100 text-yellow-800'
    : g === 'b'   || g === 'B'    ? 'bg-gray-100 text-gray-700'
    : g ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function fmtEur(n: unknown) {
  if (!n) return '—'
  const v = Number(n)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} M€`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)} K€`
  return `${Math.round(v)} €`
}

type EditState = {
  company_name: string
  official_grade: string
  score_total: string
  public_summary: string
  asset_type: string
}

interface Props {
  rows: CatalogRow[]
  adminToken: string
  tokenQs: string
}

export default function CatalogAdminClient({ rows: initial, adminToken, tokenQs }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [rows, setRows] = useState<CatalogRow[]>(initial)
  const [editId, setEditId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openEdit(row: CatalogRow) {
    setEditId(row.id)
    setEditState({
      company_name:    row.company_name ?? '',
      official_grade:  row.official_grade ?? '',
      score_total:     row.score_total != null ? String(row.score_total) : '',
      public_summary:  row.public_summary ?? '',
      asset_type:      row.asset_type ?? '',
    })
    setError(null)
  }

  function closeEdit() {
    setEditId(null)
    setEditState(null)
    setError(null)
  }

  async function saveEdit(id: string) {
    if (!editState) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/assets/${id}/catalog`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: adminToken,
          company_name:   editState.company_name || null,
          official_grade: editState.official_grade || null,
          score_total:    editState.score_total !== '' ? Number(editState.score_total) : null,
          public_summary: editState.public_summary || null,
          asset_type:     editState.asset_type || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur serveur')
      setRows(prev => prev.map(r => r.id !== id ? r : {
        ...r,
        company_name:   editState.company_name || null,
        official_grade: editState.official_grade || null,
        score_total:    editState.score_total !== '' ? Number(editState.score_total) : null,
        public_summary: editState.public_summary || null,
        asset_type:     editState.asset_type || null,
      }))
      closeEdit()
      startTransition(() => router.refresh())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setSaving(false)
    }
  }

  if (!rows.length) return (
    <div className="bg-white border border-gray-200 p-16 text-center">
      <p className="text-[13px] text-gray-400">Aucun actif gradé pour l&apos;instant.</p>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 px-4 py-2 text-[12px] text-red-700">{error}</div>
      )}
      <table className="w-full text-[12px] bg-white border border-gray-200">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Gradé le', 'Actif', 'Type', 'ARR', 'Grade', 'Score', 'Résumé public', 'Statut', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(r => {
            const isEditing = editId === r.id
            return (
              <tr key={r.id} className={isEditing ? 'bg-blue-50/40' : 'hover:bg-gray-50'}>
                <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{fmtDate(r.graded_at)}</td>

                {/* Actif */}
                <td className="px-4 py-3">
                  {isEditing && editState ? (
                    <input
                      value={editState.company_name}
                      onChange={e => setEditState(s => s ? { ...s, company_name: e.target.value } : s)}
                      className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-ag-navy"
                      placeholder="Nom anonymisé…"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">
                      {r.company_name ?? `Actif #${r.id.slice(0, 8)}`}
                    </span>
                  )}
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  {isEditing && editState ? (
                    <input
                      value={editState.asset_type}
                      onChange={e => setEditState(s => s ? { ...s, asset_type: e.target.value } : s)}
                      className="w-24 border border-gray-300 px-2 py-1 text-[11px] focus:outline-none focus:border-ag-navy uppercase"
                      placeholder="saas…"
                    />
                  ) : (
                    <span className="uppercase text-[10px] text-gray-500">{r.asset_type ?? '—'}</span>
                  )}
                </td>

                <td className="px-4 py-3 font-mono">{fmtEur(r.arr)}</td>

                {/* Grade */}
                <td className="px-4 py-3">
                  {isEditing && editState ? (
                    <select
                      value={editState.official_grade}
                      onChange={e => setEditState(s => s ? { ...s, official_grade: e.target.value } : s)}
                      className="border border-gray-300 px-2 py-1 text-[11px] bg-white focus:outline-none focus:border-ag-navy"
                    >
                      <option value="">—</option>
                      {GRADE_OPTIONS.map(g => (
                        <option key={g} value={g}>{GRADE_LABELS[g]}</option>
                      ))}
                    </select>
                  ) : (
                    r.official_grade ? (
                      <span className={`px-2 py-0.5 text-[11px] font-bold ${gradeColor(r.official_grade)}`}>
                        {GRADE_LABELS[r.official_grade] ?? r.official_grade}
                      </span>
                    ) : <span className="text-gray-300 text-[10px]">—</span>
                  )}
                </td>

                {/* Score */}
                <td className="px-4 py-3 font-mono">
                  {isEditing && editState ? (
                    <input
                      type="number" min={0} max={100}
                      value={editState.score_total}
                      onChange={e => setEditState(s => s ? { ...s, score_total: e.target.value } : s)}
                      className="w-16 border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-ag-navy"
                    />
                  ) : (
                    r.score_total != null ? `${r.score_total}/100` : '—'
                  )}
                </td>

                {/* Résumé public */}
                <td className="px-4 py-3 max-w-[240px]">
                  {isEditing && editState ? (
                    <textarea
                      value={editState.public_summary}
                      onChange={e => setEditState(s => s ? { ...s, public_summary: e.target.value } : s)}
                      rows={3}
                      className="w-full border border-gray-300 px-2 py-1 text-[12px] focus:outline-none focus:border-ag-navy resize-none"
                      placeholder="Résumé public affiché aux acheteurs…"
                    />
                  ) : (
                    r.public_summary
                      ? <span className="text-gray-600 line-clamp-2">{r.public_summary}</span>
                      : <span className="text-amber-500 text-[10px]">⚠ Résumé manquant</span>
                  )}
                </td>

                {/* Statut */}
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    r.status === 'published' ? 'bg-emerald-50 text-emerald-700'
                    : r.status === 'graded'  ? 'bg-purple-50 text-purple-700'
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                    {r.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(r.id)}
                          disabled={saving}
                          className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 border border-emerald-200 px-2 py-1 hover:border-emerald-400 disabled:opacity-50 transition-colors"
                        >
                          {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          Sauvegarder
                        </button>
                        <button
                          onClick={closeEdit}
                          className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 border border-gray-200 px-2 py-1 hover:border-gray-400 transition-colors"
                        >
                          <X size={10} /> Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openEdit(r)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-700 border border-blue-100 px-2 py-1 hover:border-blue-300 transition-colors"
                        >
                          <Pencil size={10} /> Éditer
                        </button>
                        {r.status === 'graded' && (
                          <Link
                            href={`/admin/catalog?action=publish&id=${r.id}${tokenQs ? `&${tokenQs.replace('?','').replace(/^&/,'')}` : ''}`}
                            className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-2 py-1 hover:border-emerald-400 transition-colors"
                          >
                            Publier
                          </Link>
                        )}
                        {r.status === 'published' && (
                          <Link
                            href={`/admin/catalog?action=unpublish&id=${r.id}${tokenQs ? `&${tokenQs.replace('?','').replace(/^&/,'')}` : ''}`}
                            className="text-[10px] font-semibold text-orange-600 hover:text-orange-800 border border-orange-200 px-2 py-1 hover:border-orange-400 transition-colors"
                          >
                            Dépublier
                          </Link>
                        )}
                        <Link
                          href={`/admin/catalog?action=withdraw&id=${r.id}${tokenQs ? `&${tokenQs.replace('?','').replace(/^&/,'')}` : ''}`}
                          className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 hover:border-gray-400 transition-colors"
                        >
                          Retirer
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
