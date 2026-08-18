'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Legend,
} from 'recharts'

/* ── Data ───────────────────────────────────────────────── */
const dealVolumeData = [
  { q: 'Q1 23', v: 420 }, { q: 'Q2 23', v: 445 }, { q: 'Q3 23', v: 480 }, { q: 'Q4 23', v: 510 },
  { q: 'Q1 24', v: 490 }, { q: 'Q2 24', v: 520 }, { q: 'Q3 24', v: 560 }, { q: 'Q4 24', v: 580 },
  { q: 'Q1 25', v: 610 }, { q: 'Q2 25', v: 650 }, { q: 'Q3 25', v: 746 }, { q: 'Q4 25', v: 692 },
  { q: 'Q1 26', v: 620 },
]

interface GradeBar { grade: string; pct: number; color: string }
const gradeData: GradeBar[] = [
  { grade: 'AEG ★', pct: 5,  color: '#2EAF7D' },
  { grade: 'AAA',   pct: 12, color: '#C9A84C' },
  { grade: 'AA',    pct: 27, color: '#9BA8B0' },
  { grade: 'A',     pct: 32, color: '#4A90D9' },
  { grade: 'B',     pct: 17, color: '#D4820A' },
]

const ACCENT  = '#2EAF7D'
const DARK    = '#0A0A0A'
const GRID    = 'rgba(0,0,0,0.08)'
const GRID_W  = 'rgba(255,255,255,0.08)'
const US_CLR  = '#4A90D9'
const EU_CLR  = ACCENT

/* ── EU vs US multiples 2021-2026 ─────────────────────────
   Source: SEG SaaS Report 2026, Aventis Advisors Q2 2026
   Median EV/ARR private SaaS deals
──────────────────────────────────────────────────────────── */
const multiplesData = [
  { year: '2021', EU: 7.2,  US: 9.8  },
  { year: '2022', EU: 4.8,  US: 6.5  },
  { year: '2023', EU: 3.4,  US: 4.9  },
  { year: '2024', EU: 3.8,  US: 5.4  },
  { year: '2025', EU: 4.2,  US: 5.8  },
  { year: '2026', EU: 4.7,  US: 6.1  },
]

/* ── EU vs US Multiples Chart ──────────────────────────── */
export function MultiplesChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={multiplesData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: DARK, opacity: 0.45, fontFamily: 'var(--font-body)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[2, 12]} tickCount={6} unit="x"
            tick={{ fontSize: 10, fill: DARK, opacity: 0.45, fontFamily: 'var(--font-body)' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: GRID, strokeWidth: 1 }}
            contentStyle={{
              background: DARK, border: 'none', borderRadius: 0,
              color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
            }}
            formatter={(v, name) => [`${v ?? '—'}x ARR`, String(name)]}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-body)', paddingTop: 16, opacity: 0.6 }}
            formatter={(v) => v === 'EU' ? 'Europe (median)' : 'United States (median)'}
          />
          <Line
            type="monotone" dataKey="EU" stroke={EU_CLR} strokeWidth={2}
            dot={{ fill: EU_CLR, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone" dataKey="US" stroke={US_CLR} strokeWidth={2}
            strokeDasharray="4 3"
            dot={{ fill: US_CLR, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Volume Chart ───────────────────────────────────────── */
export function DealVolumeChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dealVolumeData} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
          <XAxis
            dataKey="q"
            tick={{ fontSize: 10, fill: '#0A0A0A', opacity: 0.4, fontFamily: 'var(--font-body)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#0A0A0A', opacity: 0.4, fontFamily: 'var(--font-body)' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={{
              background: '#0A0A0A', border: 'none', borderRadius: 0,
              color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
            }}
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
          <XAxis
            type="number" domain={[0, 40]} unit="%"
            tick={{ fontSize: 10, fill: '#0A0A0A', opacity: 0.4, fontFamily: 'var(--font-body)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category" dataKey="grade" width={50}
            tick={{ fontSize: 11, fill: '#0A0A0A', fontFamily: 'var(--font-body)', fontWeight: 600 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={{
              background: '#0A0A0A', border: 'none', borderRadius: 0,
              color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
            }}
            formatter={(v) => [`~${v ?? 0}%`, 'Part estimée']}
          />
          <Bar dataKey="pct" radius={0}>
            {gradeData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
