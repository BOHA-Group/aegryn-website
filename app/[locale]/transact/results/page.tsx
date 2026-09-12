import type { Metadata }    from 'next'
import { getTranslations }  from 'next-intl/server'
import { BarChart2 }        from 'lucide-react'
import { createServiceClient } from '@/lib/supabase'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transactResults.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/results',
    locale,
  })
}

const GRADE_LABELS: Record<string, string> = {
  star: 'AEG ★',
  aaa:  'AAA',
  aa:   'AA',
  a:    'A',
  b:    'B',
}

const GRADE_COLORS: Record<string, string> = {
  star: '#5ADDA4',
  aaa:  '#C9A84C',
  aa:   '#9BA8B0',
  a:    '#4A90D9',
  b:    '#D4820A',
}

const FORMAT_KEYS = ['private_transaction', 'competitive_bid', 'equity_stake', 'club_deal'] as const

function fmtEur(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K€`
  return `${Math.round(n)} €`
}

export default async function TransactResultsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transactResults' })

  const supa = createServiceClient()
  const { data: results } = await supa
    .from('transaction_results')
    .select('*')
    .eq('is_public', true)
    .order('closed_at', { ascending: false })

  const hasResults = results && results.length > 0
  const formatLabel = (f: string) =>
    (FORMAT_KEYS as readonly string[]).includes(f) ? t(`formats.${f}`) : f

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            Aegryn TRANSACT
          </p>
          <h1 className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5" style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}>
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl">
            {t('heroDesc')}
          </p>
          {hasResults && (
            <p className="mt-6 font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-ag-apex">
              {t('publishedCount', { count: results.length })}
            </p>
          )}
        </div>
      </section>

      {/* Results grid or empty state */}
      {hasResults ? (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Legend */}
            <div className="flex items-center gap-6 mb-10 border-b border-ag-border pb-6">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light">{t('gradesLabel')}</p>
              {Object.entries(GRADE_LABELS).map(([key, label]) => (
                <span key={key} className="font-sans font-bold text-[11px]" style={{ color: GRADE_COLORS[key] }}>
                  {label}
                </span>
              ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r) => {
                const vr = r.valuation_range as { min?: number; max?: number } | null
                return (
                  <div key={r.id} className="border border-ag-border p-6 flex flex-col gap-4">
                    {/* Grade */}
                    <div className="flex items-center justify-between">
                      <span
                        className="font-sans font-bold text-[18px]"
                        style={{ color: GRADE_COLORS[r.grade_aeg] ?? '#6B6B6B' }}
                      >
                        {GRADE_LABELS[r.grade_aeg] ?? r.grade_aeg.toUpperCase()}
                      </span>
                      <span className="rounded-lg font-sans text-[10px] uppercase tracking-[0.12em] text-ag-gray-light border border-ag-border px-2 py-1">
                        {formatLabel(r.format)}
                      </span>
                    </div>

                    {/* Category + Sector */}
                    <div>
                      <p className="font-sans font-semibold text-[13px] text-ag-black">{r.sector}</p>
                      <p className="font-sans text-[11px] text-ag-gray-light">{r.category}</p>
                    </div>

                    {/* Valuation range */}
                    {vr && (vr.min != null || vr.max != null) && (
                      <div className="border-t border-ag-border/50 pt-4">
                        <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-ag-gray-light mb-1">{t('rangeLabel')}</p>
                        <p className="font-sans font-bold text-ag-black text-[15px]">
                          {vr.min != null ? fmtEur(vr.min) : '—'}
                          {vr.min != null && vr.max != null ? ' – ' : ''}
                          {vr.max != null ? fmtEur(vr.max) : ''}
                        </p>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-6 border-t border-ag-border/50 pt-4 mt-auto">
                      {r.process_duration_weeks && (
                        <div>
                          <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-ag-gray-light">{t('durationLabel')}</p>
                          <p className="font-sans font-semibold text-ag-black text-[12px]">{r.process_duration_weeks} {t('durationUnit')}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-ag-gray-light">{t('closedLabel')}</p>
                        <p className="font-sans font-semibold text-ag-black text-[12px]">
                          {new Date(r.closed_at).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="mt-10 font-sans text-[11px] text-ag-gray-light text-center">
              {t('disclaimer')}
            </p>
          </div>
        </section>
      ) : (
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="w-16 h-16 border border-ag-border flex items-center justify-center mb-8">
              <BarChart2 size={20} className="text-ag-gray-light" />
            </div>
            <p className="font-sans text-[15px] text-ag-gray max-w-md">
              {t('emptyState')}
            </p>
          </div>
        </section>
      )}

    </main>
  )
}
