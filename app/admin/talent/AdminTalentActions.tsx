'use client'

import { useState }      from 'react'
import { useRouter }     from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  new:         'Nouveau',
  in_progress: 'En cours',
  closed:      'Clôturé',
}
const STATUS_STYLES: Record<string, string> = {
  new:         'border-amber-500 text-amber-700',
  in_progress: 'border-ag-apex text-ag-apex-ink',
  closed:      'border-ag-line text-ag-gray',
}

/** Select de statut de suivi — PATCH /api/admin/talent puis refresh serveur. */
export function TalentStatusSelect({ id, kind, status }: { id: string; kind: 'candidate' | 'hiring'; status: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusy(true)
    await fetch('/api/admin/talent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, id, status: e.target.value }),
    })
    setBusy(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      disabled={busy}
      onChange={onChange}
      className={`font-sans font-semibold text-[10px] uppercase tracking-[0.08em] border rounded-sm px-2 py-1 bg-transparent cursor-pointer disabled:opacity-50 ${STATUS_STYLES[status] ?? STATUS_STYLES.new}`}
    >
      {Object.keys(STATUS_LABELS).map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  )
}

/** Suppression candidat : ligne + fichier CV dans le bucket privé. */
export function TalentCandidateDelete({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const onDelete = async () => {
    if (!confirm('Supprimer cette candidature et son CV ? Action irréversible.')) return
    setBusy(true)
    await fetch('/api/admin/talent', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'candidate', id }),
    })
    setBusy(false)
    router.refresh()
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      title="Supprimer la candidature et le CV"
      className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.08em] text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Suppr.
    </button>
  )
}
