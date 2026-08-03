'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'

type Subscriber = {
  id:               string
  email:            string
  user_id:          string | null
  locale:           string | null
  status:           string
  last_sent_slug:   string | null
  last_sent_at:     string | null
  subscribed_at:    string | null
  unsubscribed_at:  string | null
}

function fmtDate(v: unknown): string {
  if (!v) return '—'
  return new Date(v as string).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function NewsletterClient({
  subscribers: initial,
  tokenQs,
}: {
  subscribers: Subscriber[]
  tokenQs:     string
}) {
  const [rows,     setRows]     = useState(initial)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState('')
  const [filter,   setFilter]   = useState<'all' | 'active' | 'unsubscribed' | 'prospects'>('all')

  const filtered = rows.filter(r => {
    if (filter === 'active')       return r.status === 'active'
    if (filter === 'unsubscribed') return r.status === 'unsubscribed'
    if (filter === 'prospects')    return !r.user_id
    return true
  })

  const counts = {
    total:        rows.length,
    active:       rows.filter(r => r.status === 'active').length,
    unsubscribed: rows.filter(r => r.status === 'unsubscribed').length,
    prospects:    rows.filter(r => !r.user_id).length,
    withAccount:  rows.filter(r => !!r.user_id).length,
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(r => r.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function deleteSelected() {
    if (selected.size === 0) return
    if (!window.confirm(`Supprimer définitivement ${selected.size} abonné${selected.size > 1 ? 's' : ''} ? Action irréversible.`)) return
    setDeleting(true)
    setError('')
    const res = await fetch(`/api/admin/bulk-delete${tokenQs}`, {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'newsletter_subscribers', ids: [...selected] }),
    })
    const data = await res.json() as { ok?: boolean; error?: string }
    if (data.ok) {
      setRows(prev => prev.filter(r => !selected.has(r.id)))
      setSelected(new Set())
    } else {
      setError(data.error ?? 'Erreur inconnue.')
    }
    setDeleting(false)
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {([
          { key: 'all',          label: 'Total',       count: counts.total,        color: 'border-gray-200 bg-white' },
          { key: 'active',       label: 'Actifs',      count: counts.active,       color: 'border-emerald-200 bg-emerald-50' },
          { key: 'unsubscribed', label: 'Désabonnés',  count: counts.unsubscribed, color: 'border-red-100 bg-red-50' },
          { key: 'prospects',    label: 'Prospects',   count: counts.prospects,    color: 'border-amber-200 bg-amber-50' },
          { key: 'all',          label: 'Avec compte', count: counts.withAccount,  color: 'border-blue-200 bg-blue-50' },
        ] as const).map(({ label, count, color }, i) => (
          <div key={i} className={`border p-5 cursor-pointer transition-colors ${color} ${i < 4 ? 'hover:opacity-80' : ''}`}>
            <p className="text-[28px] font-bold text-gray-900">{count}</p>
            <p className="text-[11px] text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtres + actions */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'unsubscribed', 'prospects'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setSelected(new Set()) }}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                filter === f ? 'bg-ag-navy text-white border-ag-navy' : 'border-gray-300 text-gray-500 hover:border-gray-500'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'unsubscribed' ? 'Désabonnés' : 'Prospects'}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
            Supprimer ({selected.size})
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700 mb-4">{error}</div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <p className="text-[13px] text-gray-400">Aucun abonné.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="cursor-pointer"
                  />
                </th>
                {['Email', 'Type', 'Langue', 'Statut', 'Dernier article', 'Envoyé le', 'Inscrit le'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(sub => (
                <tr
                  key={sub.id}
                  className={`hover:bg-gray-50 cursor-pointer ${selected.has(sub.id) ? 'bg-red-50' : ''}`}
                  onClick={() => toggleOne(sub.id)}
                >
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(sub.id)}
                      onChange={() => toggleOne(sub.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 font-sans text-gray-800">{sub.email}</td>
                  <td className="px-4 py-3">
                    {sub.user_id ? (
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 font-bold">Membre</span>
                    ) : (
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-700 font-bold">Prospect</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">{sub.locale ?? '—'}</td>
                  <td className="px-4 py-3">
                    {sub.status === 'active' ? (
                      <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold">Actif</span>
                    ) : (
                      <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-red-50 text-red-500 font-bold">Désabonné</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-gray-500 max-w-[160px] truncate">{sub.last_sent_slug ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-gray-500 whitespace-nowrap">{fmtDate(sub.last_sent_at)}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-gray-500 whitespace-nowrap">{fmtDate(sub.subscribed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
        <strong>Prospects</strong> = abonnés sans compte AEGRYN — inscrits via le formulaire newsletter public.<br />
        <strong>Membres</strong> = abonnés avec un compte connecté au moment de l&apos;inscription.
      </div>
    </>
  )
}
