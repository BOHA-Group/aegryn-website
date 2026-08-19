'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const DARK = '#0A0A0A'
const GRID = 'rgba(0,0,0,0.08)'

const tooltipStyle = {
  background: DARK, border: 'none', borderRadius: 0,
  color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
}
const tickStyle = (opacity = 0.45) => ({
  fontSize: 10, fill: DARK, opacity, fontFamily: 'var(--font-body)',
})

interface Props {
  data: Array<{ grade: string; pct: number; color: string }>
}

export function GradeDistributionChart({ data }: Props) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
            formatter={(v) => [`~${v ?? 0}%`, 'Estimated share']}
          />
          <Bar dataKey="pct" radius={0}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
