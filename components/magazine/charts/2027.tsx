'use client'

/**
 * Charts — Aegryn Magazine, January 2027 Edition
 * Data sources: Software Equity Group, Aventis Advisors Q2 2026, Synergy AI 2026
 */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Legend,
} from 'recharts'

/* ── Constants ──────────────────────────────────────────── */
const ACCENT  = '#2EAF7D'
const DARK    = '#0A0A0A'
const GRID    = 'rgba(0,0,0,0.08)'
const US_CLR  = '#4A90D9'
const EU_CLR  = ACCENT

/* ── EU SaaS deal volume by quarter — 2023–Q1 2026 ─────── */
const dealVolumeData = [
  { q: 'Q1 23', v: 420 }, { q: 'Q2 23', v: 445 },
  { q: 'Q3 23', v: 480 }, { q: 'Q4 23', v: 510 },
  { q: 'Q1 24', v: 490 }, { q: 'Q2 24', v: 520 },
  { q: 'Q3 24', v: 560 }, { q: 'Q4 24', v: 580 },
  { q: 'Q1 25', v: 610 }, { q: 'Q2 25', v: 650 },
  { q: 'Q3 25', v: 746 }, { q: 'Q4 25', v: 692 },
  { q: 'Q1 26', v: 620 },
]

/* ── Median EV/ARR — Europe vs US, 2021–2026 ───────────── */
const multiplesData = [
  { year: '2021', EU: 7.2,  US: 9.8  },
  { year: '2022', EU: 4.8,  US: 6.5  },
  { year: '2023', EU: 3.4,  US: 4.9  },
  { year: '2024', EU: 3.8,  US: 5.4  },
  { year: '2025', EU: 4.2,  US: 5.8  },
  { year: '2026', EU: 4.7,  US: 6.1  },
]

/* ── AEGRYN Grade distribution (estimated) ──────────────── */
interface GradeBar { grade: string; pct: number; color: string }
const gradeData: GradeBar[] = [
  { grade: 'AEG ★', pct: 5,  color: '#2EAF7D' },
  { grade: 'AAA',   pct: 12, color: '#C9A84C' },
  { grade: 'AA',    pct: 27, color: '#9BA8B0' },
  { grade: 'A',     pct: 32, color: '#4A90D9' },
  { grade: 'B',     pct: 17, color: '#D4820A' },
]

const tooltipStyle = {
  background: DARK, border: 'none', borderRadius: 0,
  color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
}
const tickStyle = (opacity = 0.45) => ({
  fontSize: 10, fill: DARK, opacity, fontFamily: 'var(--font-body)',
})

/* ── Deal Volume Chart ──────────────────────────────────── */
export function DealVolumeChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dealVolumeData} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
          <XAxis dataKey="q" tick={tickStyle(0.4)} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle(0.4)} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={tooltipStyle}
            formatter={(v) => [`${v ?? 0} deals`, 'Volume']}
          />
          <Bar dataKey="v" radius={0}>
            {dealVolumeData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.q === 'Q3 25' ? ACCENT : DARK}
                opacity={entry.q === 'Q3 25' ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── EU vs US Multiples Chart ───────────────────────────── */
export function MultiplesChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={multiplesData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
          <XAxis dataKey="year" tick={tickStyle()} axisLine={false} tickLine={false} />
          <YAxis domain={[2, 12]} tickCount={6} unit="x" tick={tickStyle()} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: GRID, strokeWidth: 1 }}
            contentStyle={tooltipStyle}
            formatter={(v, name) => [`${v ?? '—'}x ARR`, String(name)]}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-body)', paddingTop: 16, opacity: 0.6 }}
            formatter={(v) => v === 'EU' ? 'Europe (median)' : 'United States (median)'}
          />
          <Line type="monotone" dataKey="EU" stroke={EU_CLR} strokeWidth={2} dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: EU_CLR }} />
          <Line type="monotone" dataKey="US" stroke={US_CLR} strokeWidth={2} strokeDasharray="4 3" dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: US_CLR }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Grade Distribution Chart ───────────────────────────── */
export function GradeDistributionChart() {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={gradeData}
          layout="vertical"
          barCategoryGap="25%"
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke={GRID} strokeWidth={1} />
          <XAxis type="number" domain={[0, 40]} unit="%" tick={tickStyle(0.4)} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="grade" width={50}
            tick={{ fontSize: 11, fill: DARK, fontFamily: 'var(--font-body)', fontWeight: 600 }}
            axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={tooltipStyle}
            formatter={(v) => [`~${v ?? 0}%`, 'Part estimée']}
          />
          <Bar dataKey="pct" radius={0}>
            {gradeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
