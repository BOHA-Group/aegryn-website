'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Trash2, CheckSquare, Square, Loader2 } from 'lucide-react'
import InviteButton from './InviteButton'

type Asset = Record<string, unknown>

function evalColor(e: string) {
  return e === 'full_certification' ? 'bg-gray-100 text-gray-600'
    : e === 'review_internal'       ? 'bg-blue-50 text-blue-700'
    : e === 'review_partner'        ? 'bg-indigo-50 text-indigo-700'
    : 'bg-gray-50 text-gray-400'
}
function evalLabel(e: string) {
  return e === 'full_certification' ? 'Certification'
    : e === 'review_internal'       ? 'Review'
    : e === 'review_partner'        ? 'Review+'
    : e
}
function statusColor(s: string) {
  return s === 'submitted'    ? 'bg-blue-50 text-blue-700'
    : s === 'under_review'    ? 'bg-yellow-50 text-yellow-700'
    : s === 'graded'          ? 'bg-purple-50 text-purple-700'
    : s === 'published'       ? 'bg-emerald-50 text-emerald-700'
    : s === 'sold'            ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-500'
}
function gradeColor(g: string) {
  return g === '★'   ? 'bg-emerald-100 text-emerald-800'
    : g === 'AAA'    ? 'bg-blue-100 text-blue-800'
    : g === 'AA'     ? 'bg-green-100 text-green-800'
    : g === 'A'      ? 'bg-yellow-100 text-yellow-800'
    : g === 'B'      ? 'bg-gray-100 text-gray-700'
    : g              ? 'bg-red-50 text-red-600'
    : 'bg-gray-50 text-gray-400'
}
function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

type Props = {
  rows: Asset[]
}

export default function AssetsAdminClient({ rows: initialRows }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rows, setRows] = useState<Asset[]>(initialRows)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allIds = rows.map(r => String(r.id))
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(allIds))
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  async function deleteSelected() {
    const ids = [...selected]
    if (ids.length === 0) return
    const confirmed = window.confirm(
      `Supprimer définitivement ${ids.length} actif${ids.length > 1 ? 's' : ''} ? Cette action est irréversible.`
    )
    if (!confirmed) return

    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/assets`, {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ids }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      setRows(prev => prev.filter(r => !ids.includes(String(r.id))))
      setSelected(new Set())
      startTransition(() => router.refresh())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setDeleting(false)
    }
  }

  async function deleteOne(id: string, name: string) {
    const confirmed = window.confirm(`Supprimer "${name}" ? Cette action est irréversible.`)
    if (!confirmed) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/assets`, {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ids: [id] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      setRows(prev => prev.filter(r => String(r.id) !== id))
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
      startTransition(() => router.refresh())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Barre d'actions masse */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 bg-red-50 border border-red-200 px-4 py-3">
          <span className="font-mono text-[11px] text-red-700 font-semibold">
            {selected.size} actif{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
          </span>
          <button
            onClick={deleteSelected}
            disabled={deleting || isPending}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
            Supprimer la sélection
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-mono text-[10px] text-red-500 hover:text-red-700 underline ml-auto"
          >
            Désélectionner tout
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mb-4 text-[12px] text-red-700">{error}</div>
      )}

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <p className="text-[13px] text-gray-400">Aucun actif correspondant.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] bg-white border border-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll} className="flex items-center justify-center text-gray-400 hover:text-gray-700">
                    {allSelected
                      ? <CheckSquare size={15} className="text-red-600" />
                      : <Square size={15} />
                    }
                  </button>
                </th>
                {['Soumis', 'Vendeur', 'Société', 'Type', 'ARR', 'Grade', 'Score', 'Évaluation', 'Statut', 'Accès client', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => {
                const id   = String(r.id)
                const name = String(r.company_name ?? r.seller_name ?? id.slice(0, 8))
                const isChecked = selected.has(id)
                return (
                  <tr key={id} className={`hover:bg-gray-50 ${isChecked ? 'bg-red-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleOne(id)} className="flex items-center justify-center text-gray-400 hover:text-gray-700">
                        {isChecked
                          ? <CheckSquare size={15} className="text-red-600" />
                          : <Square size={15} />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">{fmtDate(r.submitted_at)}</td>
                    <td className="px-4 py-3">
                      <div>{String(r.seller_name ?? '—')}</div>
                      <div className="text-[11px] text-gray-400">{String(r.seller_email ?? '')}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{String(r.company_name ?? '—')}</td>
                    <td className="px-4 py-3 text-gray-600 uppercase text-[10px]">{String(r.asset_type ?? '—')}</td>
                    <td className="px-4 py-3 font-mono">
                      {r.arr ? `${Math.round(Number(r.arr) / 1000)}K€` : <em className="text-gray-300">—</em>}
                    </td>
                    <td className="px-4 py-3">
                      {r.official_grade
                        ? <span className={`px-2 py-0.5 text-[11px] font-bold ${gradeColor(String(r.official_grade))}`}>{String(r.official_grade)}</span>
                        : <span className="text-gray-300 text-[10px]">non gradé</span>}
                    </td>
                    <td className="px-4 py-3 font-mono">{r.score_total != null ? String(r.score_total) : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold ${evalColor(String(r.evaluation_type ?? 'full_certification'))}`}>
                        {evalLabel(String(r.evaluation_type ?? 'full_certification'))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>
                        {String(r.status ?? '—')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <InviteButton
                        assetId={id}
                        sellerEmail={String(r.seller_email ?? '')}
                        sellerName={String(r.seller_name ?? '')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <Link
                          href={`/admin/assets/${id}/grade`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800">
                          Grader <ArrowUpRight size={10} />
                        </Link>
                        <button
                          onClick={() => deleteOne(id, name)}
                          disabled={deleting}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
                        >
                          <Trash2 size={10} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
