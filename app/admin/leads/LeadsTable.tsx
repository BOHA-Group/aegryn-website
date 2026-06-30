'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback }                              from 'react'
import type { Lead }                               from './page'

const GRADES  = ['all', '★', 'AAA', 'AA', 'A', 'B', 'NG'] as const
const STATUSES = ['all', 'new', 'contacted', 'submitted', 'closed'] as const

function fmtEur(n: number | null) {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K€`
  return `${Math.round(n)} €`
}

function gradeColor(g: string) {
  return g === '★'   ? 'bg-emerald-100 text-emerald-800'
    : g === 'AAA'    ? 'bg-blue-100 text-blue-800'
    : g === 'AA'     ? 'bg-green-100 text-green-800'
    : g === 'A'      ? 'bg-yellow-100 text-yellow-800'
    : g === 'B'      ? 'bg-gray-100 text-gray-700'
    : 'bg-red-50 text-red-600'
}

function statusColor(s: string) {
  return s === 'new'       ? 'bg-blue-50 text-blue-700'
    : s === 'contacted'    ? 'bg-yellow-50 text-yellow-700'
    : s === 'submitted'    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-gray-100 text-gray-500'
}

export default function LeadsTable({
  leads, currentGrade, currentStatus, adminToken,
}: {
  leads: Lead[]
  currentGrade: string
  currentStatus: string
  adminToken?: string
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const sp       = useSearchParams()

  const setFilter = useCallback((key: string, val: string) => {
    const params = new URLSearchParams(sp.toString())
    params.set(key, val)
    if (adminToken) params.set('token', adminToken)
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname, adminToken])

  return (
    <div className="flex flex-col gap-6">

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white border border-gray-200 p-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Grade</p>
          <div className="flex flex-wrap gap-2">
            {GRADES.map(g => (
              <button key={g} onClick={() => setFilter('grade', g)}
                className={`px-3 py-1 text-[11px] font-semibold border transition-colors ${
                  currentGrade === g ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}>
                {g === 'all' ? 'Tous' : g}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Statut</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter('status', s)}
                className={`px-3 py-1 text-[11px] font-semibold border transition-colors ${
                  currentStatus === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}>
                {s === 'all' ? 'Tous' : s}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-auto self-end text-[12px] text-gray-400 font-mono">
          {leads.length} résultat{leads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-[14px] text-gray-400">Aucun lead pour ces filtres.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] bg-white border border-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Date', 'Email', 'Grade', 'Score', 'ARR', 'Valorisation', 'Statut', 'Locale'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${lead.email}`}
                      className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold ${gradeColor(lead.estimated_grade)}`}>
                      {lead.estimated_grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {lead.score_total}/100
                    {lead.score_breakdown && (
                      <span className="text-gray-400 ml-1">
                        F{lead.score_breakdown.finance}·C{lead.score_breakdown.code}·I{lead.score_breakdown.ip}·S{lead.score_breakdown.security}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {lead.pre_revenue
                      ? <span className="text-gray-400 italic">pre-rev</span>
                      : fmtEur(lead.arr)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {lead.valuation_low && lead.valuation_high
                      ? `${fmtEur(lead.valuation_low)} — ${fmtEur(lead.valuation_high)}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">
                    {lead.locale ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
