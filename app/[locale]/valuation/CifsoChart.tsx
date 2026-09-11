'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  Label,
} from 'recharts'
import { useTranslations } from 'next-intl'

// Données de corrélation simulées (Score CIFSO → Multiple EV/Revenue médian)
// Basées sur l'analyse des transactions M&A EU lower mid-market et les
// résultats agrégés anonymisés des certifications CIFSO 5000.
// À terme, alimentées automatiquement par les certifications réelles.
const CURVE_DATA = [
  { score: 0,  multiple: 0.6 },
  { score: 10, multiple: 0.9 },
  { score: 20, multiple: 1.2 },
  { score: 30, multiple: 1.6 },
  { score: 40, multiple: 2.1 },
  { score: 50, multiple: 2.6 },
  { score: 55, multiple: 3.0 },
  { score: 60, multiple: 3.4 },
  { score: 65, multiple: 3.8 },
  { score: 70, multiple: 4.0 },
  { score: 75, multiple: 4.4 },
  { score: 80, multiple: 4.8 },
  { score: 85, multiple: 5.1 },
  { score: 90, multiple: 5.4 },
  { score: 95, multiple: 5.7 },
  { score: 100, multiple: 6.0 },
]

// Points de certification anonymisés (simulation)
const CERT_POINTS = [
  { score: 42, multiple: 1.9, sector: 'Commerce' },
  { score: 51, multiple: 2.4, sector: 'Industrie' },
  { score: 58, multiple: 2.9, sector: 'Services' },
  { score: 63, multiple: 3.2, sector: 'SaaS' },
  { score: 67, multiple: 3.7, sector: 'Services' },
  { score: 71, multiple: 4.1, sector: 'Tech' },
  { score: 74, multiple: 4.3, sector: 'SaaS' },
  { score: 82, multiple: 4.9, sector: 'Tech' },
  { score: 88, multiple: 5.3, sector: 'SaaS' },
]

const ANNOTATION_COLOR = '#4ADDA5'
const CURVE_COLOR = '#4ADDA5'
const DOT_COLOR = '#0D1F3C'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-ag-navy border border-white/10 px-4 py-3 rounded-lg shadow-xl">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 mb-1">
        Score CIFSO : <span className="text-ag-apex font-bold">{d.score}</span>
      </p>
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">
        Multiple : <span className="text-white font-bold">{d.multiple}x</span>
      </p>
      {d.sector && (
        <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/30 mt-1">
          {d.sector}
        </p>
      )}
    </div>
  )
}

export function CifsoChart() {
  const t = useTranslations('valuation.chart')

  return (
    <div className="w-full">
      {/* Labels Y-axis annotations */}
      <div className="relative w-full" style={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={CURVE_DATA}
            margin={{ top: 20, right: 40, bottom: 40, left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2d4a"
              vertical={false}
            />

            <XAxis
              dataKey="score"
              type="number"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fill: '#6b8099', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1e2d4a' }}
              tickLine={false}
            >
              <Label
                value={t('xAxis')}
                position="insideBottom"
                offset={-24}
                fill="#6b8099"
                style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              />
            </XAxis>

            <YAxis
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6]}
              tickFormatter={(v) => `${v}x`}
              tick={{ fill: '#6b8099', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference lines pour les 3 zones */}
            <ReferenceLine y={2.1} stroke={ANNOTATION_COLOR} strokeOpacity={0.25} strokeDasharray="4 4" />
            <ReferenceLine y={3.4} stroke={ANNOTATION_COLOR} strokeOpacity={0.25} strokeDasharray="4 4" />
            <ReferenceLine y={4.8} stroke={ANNOTATION_COLOR} strokeOpacity={0.25} strokeDasharray="4 4" />

            {/* Vertical score reference lines */}
            <ReferenceLine x={45} stroke="#1e2d4a" strokeDasharray="4 4" />
            <ReferenceLine x={65} stroke="#1e2d4a" strokeDasharray="4 4" />
            <ReferenceLine x={85} stroke="#1e2d4a" strokeDasharray="4 4" />

            {/* Courbe principale */}
            <Line
              type="monotone"
              dataKey="multiple"
              stroke={CURVE_COLOR}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: CURVE_COLOR, stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Points certifications anonymisés */}
            {CERT_POINTS.map((p, i) => (
              <ReferenceDot
                key={i}
                x={p.score}
                y={p.multiple}
                r={4}
                fill={DOT_COLOR}
                stroke={CURVE_COLOR}
                strokeWidth={1.5}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Annotations flottantes sur les 3 niveaux */}
        <div className="absolute top-[calc(100%-52px)] right-8 flex flex-col items-end gap-0 pointer-events-none" style={{ bottom: 60, top: 'auto' }}>
          {/* Ces positions correspondent aux lignes Y 4.8, 3.4, 2.1 */}
        </div>
      </div>

      {/* Annotations textuelles sous le graphique */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { score: '40–55', mult: t('annotationLow'), color: '#6b8099' },
          { score: '60–70', mult: t('annotationMid'), color: '#7bb8e8' },
          { score: '80–90', mult: t('annotationHigh'), color: ANNOTATION_COLOR },
        ].map(({ score, mult, color }) => (
          <div key={score} className="flex flex-col items-center gap-1 border border-white/8 px-3 py-2 rounded-lg bg-white/[0.03]">
            <span className="font-mono text-[9px] tracking-[0.16em] text-white/40 uppercase">Score {score}</span>
            <span className="font-mono text-[13px] font-bold" style={{ color }}>{mult}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
