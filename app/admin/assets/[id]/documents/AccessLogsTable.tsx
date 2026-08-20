import { Shield, Eye, LogOut, AlertTriangle, Link2 } from 'lucide-react'
import type { DataRoomDocument } from '@/lib/dataRoom'

export type AccessLog = {
  id:                      string
  action:                  string
  detail:                  string | null
  ip_address:              string | null
  user_agent:              string | null
  session_duration_seconds: number | null
  created_at:              string
  document_id:             string
  /* Supabase retourne les FK joins comme un tableau ou un objet selon la cardinalité */
  profiles:                { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null
}

function resolveProfile(profiles: AccessLog['profiles']): { full_name: string | null; email: string | null } | null {
  if (!profiles) return null
  if (Array.isArray(profiles)) return profiles[0] ?? null
  return profiles
}

const ACTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  signed_url_generated: {
    label: 'Accès initié',
    icon:  <Link2 size={11} />,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  view_start: {
    label: 'Ouverture viewer',
    icon:  <Eye size={11} />,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  view_end: {
    label: 'Fermeture viewer',
    icon:  <LogOut size={11} />,
    color: 'text-gray-500 bg-gray-50 border-gray-200',
  },
  suspicious_activity: {
    label: 'Activité suspecte',
    icon:  <AlertTriangle size={11} />,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  session_end: {
    label: 'Fin de session',
    icon:  <LogOut size={11} />,
    color: 'text-gray-400 bg-gray-50 border-gray-200',
  },
}

const DETAIL_LABELS: Record<string, string> = {
  capture_attempt_key:       'Tentative capture clavier (PrintScreen / Cmd+Shift)',
  window_blur:               'Fenêtre perdu le focus',
  tab_hidden:                'Changement d\'onglet',
  unauthorized_access_attempt: 'Tentative d\'accès non autorisé',
  watermarked_pdf_served:    'PDF watermarké servi',
}

function fmtDuration(s: number | null) {
  if (s == null) return '—'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const r = s % 60
  return r > 0 ? `${m}min ${r}s` : `${m}min`
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('fr-CH', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function parseUA(ua: string | null) {
  if (!ua) return '—'
  /* Extraction simplifiée du navigateur + OS */
  const browser =
    ua.includes('Edg/')    ? 'Edge' :
    ua.includes('Chrome/') ? 'Chrome' :
    ua.includes('Safari/') && !ua.includes('Chrome') ? 'Safari' :
    ua.includes('Firefox/') ? 'Firefox' :
    'Autre'
  const os =
    ua.includes('Windows') ? 'Windows' :
    ua.includes('Mac OS')  ? 'macOS' :
    ua.includes('iPhone')  ? 'iPhone' :
    ua.includes('Android') ? 'Android' :
    ua.includes('Linux')   ? 'Linux' :
    'Autre'
  return `${browser} / ${os}`
}

interface Props {
  logs:      AccessLog[]
  documents: DataRoomDocument[]
}

export default function AccessLogsTable({ logs, documents }: Props) {
  const docMap = Object.fromEntries(documents.map((d) => [d.id, d.file_name]))

  const suspicious = logs.filter((l) => l.action === 'suspicious_activity')

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Shield size={14} className="text-ag-navy" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600 font-semibold">
          Journal des consultations data room
        </p>
        <span className="font-mono text-[9px] text-gray-400 border border-gray-200 px-1.5 py-0.5">
          {logs.length} entrée{logs.length !== 1 ? 's' : ''}
        </span>
        {suspicious.length > 0 && (
          <span className="font-mono text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 flex items-center gap-1">
            <AlertTriangle size={9} /> {suspicious.length} suspecte{suspicious.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="bg-white border border-gray-100 px-5 py-8 text-center">
          <p className="font-sans text-[12px] text-gray-400">Aucune consultation enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Horodatage', 'Identité', 'Document', 'Action', 'Détail', 'IP', 'Navigateur / OS', 'Durée'].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 font-mono text-[9px] uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => {
                const meta = ACTION_META[log.action] ?? { label: log.action, icon: null, color: 'text-gray-500 bg-gray-50 border-gray-200' }
                const isSuspicious = log.action === 'suspicious_activity'

                return (
                  <tr key={log.id} className={isSuspicious ? 'bg-red-50/40' : 'hover:bg-gray-50/50'}>
                    {/* Horodatage */}
                    <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                      {fmtDate(log.created_at)}
                    </td>

                    {/* Identité */}
                    <td className="px-3 py-2.5 min-w-[160px]">
                      {(() => {
                        const profile = resolveProfile(log.profiles)
                        return profile ? (
                          <div>
                            <p className="font-semibold text-gray-800 truncate max-w-[180px]">
                              {profile.full_name ?? '—'}
                            </p>
                            <p className="text-gray-400 truncate max-w-[180px]">
                              {profile.email ?? '—'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      })()}
                    </td>

                    {/* Document */}
                    <td className="px-3 py-2.5 max-w-[160px]">
                      <span className="truncate block text-gray-600" title={docMap[log.document_id] ?? log.document_id}>
                        {docMap[log.document_id] ?? <span className="text-gray-300 font-mono text-[9px]">{log.document_id.slice(0, 8)}…</span>}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-semibold uppercase px-1.5 py-0.5 border ${meta.color}`}>
                        {meta.icon}
                        {meta.label}
                      </span>
                    </td>

                    {/* Détail */}
                    <td className="px-3 py-2.5 max-w-[180px]">
                      {log.detail ? (
                        <span className={`text-[10px] ${isSuspicious ? 'text-red-700 font-semibold' : 'text-gray-500'}`}>
                          {DETAIL_LABELS[log.detail] ?? log.detail}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* IP */}
                    <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                      {log.ip_address ?? '—'}
                    </td>

                    {/* Navigateur / OS */}
                    <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                      {parseUA(log.user_agent)}
                    </td>

                    {/* Durée */}
                    <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                      {fmtDuration(log.session_duration_seconds)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
