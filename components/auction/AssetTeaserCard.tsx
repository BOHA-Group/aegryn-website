import Link        from 'next/link'
import { Lock, ArrowUpRight, CalendarClock } from 'lucide-react'
import type { AssetLotTeaser } from '@/types/auction'

const GRADE_PALETTE: Record<string, { bg: string; text: string; border: string }> = {
  '★':  { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' },
  'AAA': { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
  'AA':  { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'A':   { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  'B':   { bg: '#FFFBEB', text: '#92400E', border: '#FCD34D' },
}

function gradeStyle(letter: string) {
  return GRADE_PALETTE[letter] ?? { bg: '#F9FAFB', text: '#374151', border: '#D1D5DB' }
}

function sessionLabel(opensAt: string | null) {
  if (!opensAt) return null
  const d = new Date(opensAt)
  const q = Math.ceil((d.getMonth() + 1) / 3)
  return `Session Q${q} ${d.getFullYear()}`
}

interface Props {
  lot:    AssetLotTeaser
  locale: string
  labels: {
    accessLabel:  string    // "Accéder au dossier"
    ndaLabel:     string    // "NDA requis"
    confidential: string    // "Dossier confidentiel"
    lotRef:       string    // "Lot"
  }
}

export default function AssetTeaserCard({ lot, locale, labels }: Props) {
  const { bg, text, border } = gradeStyle(lot.grade_letter)
  const session = sessionLabel(lot.session_opens_at)

  return (
    <article className="bg-ag-white flex flex-col gap-5 p-8 hover:bg-ag-off-white transition-colors group">

      {/* Top row: grade + lot ref */}
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-sm"
          style={{ backgroundColor: bg, color: text, borderColor: border }}>
          <span className="font-sans font-bold text-[18px] leading-none">{lot.grade_letter || '—'}</span>
          {lot.grade_label && (
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] hidden sm:inline">
              {lot.grade_label}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-ag-gray-light uppercase">
          {labels.lotRef} {lot.lotNumber}
        </span>
      </div>

      {/* Category chip + ARR */}
      <div className="flex flex-wrap items-center gap-2">
        {lot.category && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light border border-ag-border px-2 py-0.5">
            {lot.category}
          </span>
        )}
        {lot.arr_range && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-apex">
            {lot.arr_range}
          </span>
        )}
      </div>

      {/* Context label */}
      {lot.catalogContext && (
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light">
          {lot.catalogContext}
        </p>
      )}

      {/* Tagline */}
      {lot.tagline && (
        <p className="font-sans text-[14px] text-ag-black leading-relaxed line-clamp-3">
          {lot.tagline}
        </p>
      )}

      {/* Session badge */}
      {session && (
        <div className="flex items-center gap-2">
          <CalendarClock size={12} className="text-ag-apex" />
          <span className="font-mono text-[10px] tracking-[0.14em] text-ag-apex uppercase">
            {session}
          </span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-4 border-t border-ag-border">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={11} className="text-ag-gray-light" />
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ag-gray-light">
            {labels.ndaLabel}
          </span>
        </div>
        <Link
          href={`/${locale}/auction/lot/${lot.slug}`}
          className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-[0.16em] px-5 py-2.5 hover:bg-ag-navy-mid transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          {labels.accessLabel} <ArrowUpRight size={11} />
        </Link>
      </div>
    </article>
  )
}
