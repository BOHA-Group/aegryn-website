'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const ACCENT  = '#5ADDA4'
const DARK    = '#0A0A0A'
const GRID    = 'rgba(0,0,0,0.08)'
const US_CLR  = '#4A90D9'
const EU_CLR  = ACCENT

const tooltipStyle = {
  background: DARK, border: 'none', borderRadius: 0,
  color: '#fff', fontSize: 11, fontFamily: 'var(--font-body)',
}
const tickStyle = (opacity = 0.45) => ({
  fontSize: 10, fill: DARK, opacity, fontFamily: 'var(--font-body)',
})

interface Props {
  data: Array<{ year: string; EU: number; US: number }>
}

export function MultiplesChart({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
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
