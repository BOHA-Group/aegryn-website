'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const ACCENT = '#2EAF7D'
const DARK   = '#0A0A0A'
const GRID   = 'rgba(0,0,0,0.08)'

const tooltipStyle = {
  background: DARK, border: 'none', borderRadius: 0,
  color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
}
const tickStyle = (opacity = 0.45) => ({
  fontSize: 10, fill: DARK, opacity, fontFamily: 'var(--font-body)',
})

interface Props {
  data: Array<{ q: string; v: number }>
  highlightQ?: string
}

export function DealVolumeChart({ data, highlightQ }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
          <XAxis dataKey="q" tick={tickStyle(0.4)} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle(0.4)} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={tooltipStyle}
            formatter={(v) => [`${v ?? 0} deals`, 'Volume']}
          />
          <Bar dataKey="v" radius={0}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.q === highlightQ ? ACCENT : DARK}
                opacity={entry.q === highlightQ ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
