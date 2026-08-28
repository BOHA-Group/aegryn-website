'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Loader2 } from 'lucide-react'

type PartnerRow = {
  id: string
  full_name: string | null
  email: string | null
  pendingCerts: number
  introductions: number
}

export default function PartnersTableClient({ rows: initial }: { rows: PartnerRow[] }) {
  const router = useRouter()
  const [rows, setRows] = useState<PartnerRow[]>(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  async function removePartner(id: string, name: string) {
    if (!window.confirm(`Retirer le rôle partenaire de "${name}" ?\nLe compte reste actif mais n'aura plus accès à l'espace partenaire.`)) return
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur serveur')
      setRows(prev => prev.filter(r => r.id !== id))
      startTransition(() => router.refresh())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setDeletingId(null)
    }
  }

  if (rows.length === 0) return (
    <div className="bg-white border border-gray-200 p-16 text-center">
      <p className="text-[13px] text-gray-400">Aucun partenaire pour le moment.</p>
      <p className="text-[11px] text-gray-300 mt-2">Un partenaire est un profil dont le tableau roles[] contient &apos;partner&apos;.</p>
    </div>
  )

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 px-4 py-2 text-[12px] text-red-700">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] bg-white border border-gray-200 min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Nom', 'Email', 'Dossiers en cours', 'Apports', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{r.full_name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{r.email ?? '—'}</td>
                <td className="px-4 py-3 font-mono text-[11px]">{r.pendingCerts}</td>
                <td className="px-4 py-3 font-mono text-[11px]">{r.introductions}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/partners/${r.id}`}
                      className="text-[10px] font-semibold text-gray-700 border border-gray-300 px-2 py-1 hover:border-gray-500 transition-colors"
                    >
                      Ouvrir →
                    </Link>
                    <button
                      onClick={() => removePartner(r.id, r.full_name ?? r.email ?? r.id)}
                      disabled={deletingId === r.id}
                      className="flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 transition-colors disabled:opacity-40"
                    >
                      {deletingId === r.id
                        ? <Loader2 size={10} className="animate-spin" />
                        : <Trash2 size={10} />}
                      Retirer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
