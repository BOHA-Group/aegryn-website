'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ── Types ── */
export type KpiDetail = {
  id: string
  label: string
  value: string | number | null
  sub?: string | null
  href?: string
}

export type Kpi = {
  key: string
  label: string
  value: number
  delta?: number | null
  unit?: string
  href?: string
  detail?: KpiDetail[]
}

export type Period = '7d' | '30d' | '90d' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  '7d':  '7 jours',
  '30d': '30 jours',
  '90d': '90 jours',
  'all': 'Tout',
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta >= 0
  return (
    <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
      {positive ? '+' : ''}{delta}
    </span>
  )
}

function KpiCard({ kpi, onClick, active }: { kpi: Kpi; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`text-left border p-5 transition-all w-full ${
        active
          ? 'border-[#0F1A2B] bg-white shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{kpi.label}</p>
        {kpi.delta != null && <DeltaBadge delta={kpi.delta} />}
      </div>
      <p className="text-[30px] font-bold text-gray-900 leading-none">
        {kpi.value}{kpi.unit && <span className="text-[14px] font-normal text-gray-400 ml-1">{kpi.unit}</span>}
      </p>
      {kpi.href && (
        <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mt-2">
          {active ? 'Cliquer pour fermer ↑' : 'Voir le détail ↓'}
        </p>
      )}
    </button>
  )
}

export function AnalyticsClient({
  kpisByPeriod,
}: {
  kpisByPeriod: Record<Period, Kpi[]>
}) {
  const [period, setPeriod] = useState<Period>('30d')
  const [activeKpi, setActiveKpi] = useState<string | null>(null)

  const kpis = kpisByPeriod[period] ?? []
  const activeData = kpis.find(k => k.key === activeKpi)

  function toggleKpi(key: string) {
    setActiveKpi(prev => (prev === key ? null : key))
  }

  return (
    <div>
      {/* Filtre période */}
      <div className="flex items-center gap-0 mb-6 border border-gray-200 w-fit bg-white">
        {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setActiveKpi(null) }}
            className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest transition-colors ${
              period === p
                ? 'bg-[#0F1A2B] text-white'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Grille KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {kpis.map(kpi => (
          <KpiCard
            key={kpi.key}
            kpi={kpi}
            active={activeKpi === kpi.key}
            onClick={() => kpi.detail?.length ? toggleKpi(kpi.key) : kpi.href ? undefined : undefined}
          />
        ))}
      </div>

      {/* Panneau détail */}
      {activeKpi && activeData?.detail && activeData.detail.length > 0 && (
        <div className="border border-[#0F1A2B]/20 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              {activeData.label} — détail ({activeData.detail.length})
            </p>
            <button
              onClick={() => setActiveKpi(null)}
              className="font-mono text-[9px] text-gray-400 hover:text-gray-700 border border-gray-200 px-2 py-1 transition-colors"
            >
              Fermer ×
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <tbody className="divide-y divide-gray-100">
                {activeData.detail.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="py-2.5 pr-4 font-semibold text-gray-800">
                      {row.href
                        ? <Link href={row.href} className="hover:underline text-[#0F1A2B]">{row.label}</Link>
                        : row.label
                      }
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-gray-500 text-[11px]">{row.value ?? '—'}</td>
                    {row.sub && <td className="py-2.5 text-[10px] text-gray-400">{row.sub}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeData.href && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link
                href={activeData.href}
                className="font-mono text-[9px] uppercase tracking-widest text-[#0F1A2B] border border-[#0F1A2B]/20 px-3 py-1.5 hover:bg-[#0F1A2B] hover:text-white transition-colors"
              >
                Voir tout →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      <p className="font-mono text-[9px] text-gray-300 mt-2">
        Les deltas indiquent la variation par rapport à la période précédente équivalente.
      </p>
    </div>
  )
}
