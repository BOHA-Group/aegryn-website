import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { CATEGORY_LABELS } from '@/lib/dataRoom'
import type { DataRoomCategory } from '@/lib/dataRoom'

export const metadata: Metadata = {
  title: 'Consultations Data Room — Espace Cédant Aegryn',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ id: string }> }

interface ConsultationRow {
  document_id: string
  asset_id: string
  file_name: string
  category: DataRoomCategory
  document_type: string
  consulted_by: string | null
  consulted_by_email: string | null
  url_generated_count: number
  suspicious_count: number
  last_accessed_at: string | null
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleString('fr-CH', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function DataRoomConsultationsPage({ params }: Props) {
  const { id } = await params
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  /* Vérifier propriété */
  const { data: asset } = await supa
    .from('assets')
    .select('id, name, seller_email')
    .eq('id', id)
    .single() as { data: { id: string; name: string; seller_email: string } | null }

  if (!asset) notFound()

  const { data: profile } = await supa
    .from('profiles')
    .select('email, role, roles')
    .eq('id', user.id)
    .single() as { data: { email: string; role: string; roles: string[] | null } | null }

  if (!profile) redirect('/client/login')

  const isAdmin = profile.role === 'admin' || (profile.roles ?? []).some((r) => ['admin', 'super_admin'].includes(r))
  if (!isAdmin && profile.email !== asset.seller_email) {
    redirect('/client/seller/actifs')
  }

  /* Vue consultations */
  const { data: rows } = await supa
    .from('v_data_room_consultations')
    .select('*')
    .eq('asset_id', id)
    .order('last_accessed_at', { ascending: false, nullsFirst: false }) as { data: ConsultationRow[] | null }

  const consultations = rows ?? []
  const totalSuspicious = consultations.reduce((s, r) => s + (r.suspicious_count ?? 0), 0)
  const totalViews = consultations.reduce((s, r) => s + (r.url_generated_count ?? 0), 0)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href={`/client/seller/actifs/${id}/documents`}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={13} /> Retour à la data room
          </Link>
          <span className="text-gray-200">|</span>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Consultations</p>
            <p className="text-[13px] font-semibold text-gray-900">{asset.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Résumé chiffres clés */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Accès générés" value={totalViews} />
          <StatCard label="Documents consultés" value={new Set(consultations.filter((r) => r.url_generated_count > 0).map((r) => r.document_id)).size} />
          <StatCard
            label="Activités suspectes"
            value={totalSuspicious}
            alert={totalSuspicious > 0}
          />
        </div>

        {totalSuspicious > 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-5 py-4">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              <span className="font-semibold">{totalSuspicious} activité(s) suspecte(s)</span> détectée(s)
              (tentative de capture, DevTools, perte de focus fenêtre).
              Ces événements sont journalisés avec IP et user agent pour valeur légale en cas de litige.
            </p>
          </div>
        )}

        {consultations.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <p className="text-[13px] text-gray-400">Aucune consultation enregistrée pour le moment.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Document</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Dimension</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Consulté par</th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Accès</th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Suspect</th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Dernier accès</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consultations.map((row, i) => (
                  <tr key={`${row.document_id}-${row.consulted_by ?? i}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                      {row.file_name}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {CATEGORY_LABELS[row.category] ?? row.category}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {row.consulted_by_email ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">
                      {row.url_generated_count}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {row.suspicious_count > 0 ? (
                        <span className="font-semibold text-amber-600">{row.suspicious_count}</span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400">
                      {fmtDate(row.last_accessed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

function StatCard({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className={`bg-white border p-5 ${alert ? 'border-amber-200' : 'border-gray-200'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">{label}</p>
      <p className={`text-[28px] font-bold tracking-[-0.03em] ${alert ? 'text-amber-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}
