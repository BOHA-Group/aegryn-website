import { useTranslations } from 'next-intl'
import type { AssetStatus } from '@/data/assets'

const LABELS = { live: 'live', beta: 'beta', pilot: 'pilot', dev: 'dev', not_started: 'concept' } as const

export function ProjectStage({ status, onDark = false }: { status: AssetStatus; onDark?: boolean }) {
  const t = useTranslations('assetStatus')
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] ${onDark ? 'text-white/80' : 'text-ag-apex-ink'}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${status === 'pilot' || status === 'live' ? 'bg-ag-apex' : 'bg-current opacity-60'}`} />
      {t(LABELS[status])}
    </span>
  )
}
