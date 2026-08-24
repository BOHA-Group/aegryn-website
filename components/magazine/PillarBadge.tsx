import type { Pillar } from '@/lib/magazine/types'

interface Props {
  pillar: Pillar
}

const PILLAR_CONFIG: Record<Pillar, { label: string; color: string }> = {
  build:  { label: 'BUILD',  color: '#5ADDA4' },
  money:  { label: 'MONEY',  color: '#C9A84C' },
  ai:     { label: 'AI',     color: '#4A90D9' },
  people: { label: 'PEOPLE', color: '#9BA8B0' },
  life:   { label: 'LIFE',   color: '#D4820A' },
}

/**
 * Displays a pillar badge (BUILD / MONEY / AI / PEOPLE / LIFE)
 * with the corresponding brand colour.
 */
export function PillarBadge({ pillar }: Props) {
  const { label, color } = PILLAR_CONFIG[pillar]
  return (
    <span
      className="inline-block text-[9px] font-mono font-semibold uppercase tracking-[0.2em] px-2 py-0.5 border"
      style={{ color, borderColor: `${color}40` }}
    >
      {label}
    </span>
  )
}
