'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
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

const ACCENT = '#2EAF7D'
const DARK   = '#0A0A0A'
const GRID   = 'rgba(0,0,0,0.08)'

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
