'use client'

import { useState, useMemo } from 'react'
import NextLink from 'next/link'
import { ArrowUpRight, SlidersHorizontal, X } from 'lucide-react'
import CatalogNotifyForm from './CatalogNotifyForm'

type Asset = {
  id:             string
  asset_type:     string | null
  arr:            number | null
  official_grade: string | null
  score_total:    number | null
  public_summary: string | null
  published_at:   string | null
  company_name:   string | null
}

type Props = {
  assets:  Asset[]
  locale:  string
  labels: {
    filterAll:    string
    filterStar:   string
    filterAAA:    string
    filterAA:     string
    filterA:      string
    filterB:      string
    count:        string
    session:      string
    arrRanges:    string[]
    categories:   string[]
    noResults:    string
    resetFilters: string
  }
}

const GRADE_KEYS = ['', '★', 'AAA', 'AA', 'A', 'B'] as const

const ARR_RANGES = [
  { label: 'Tous',     min: 0,          max: Infinity  },
  { label: '< 100K',  min: 0,          max: 100_000   },
  { label: '100K–1M', min: 100_000,    max: 1_000_000 },
  { label: '1M–5M',   min: 1_000_000,  max: 5_000_000 },
  { label: '> 5M',    min: 5_000_000,  max: Infinity  },
] as const

function gradeColor(g: string) {
  return g === '★'  ? 'text-ag-grade-star border-ag-grade-star/30'
    : g === 'AAA'   ? 'text-ag-grade-aaa  border-ag-grade-aaa/30'
    : g === 'AA'    ? 'text-ag-grade-aa   border-ag-grade-aa/30'
    : g === 'A'     ? 'text-ag-grade-a    border-ag-grade-a/30'
    : g === 'B'     ? 'text-ag-grade-b    border-ag-grade-b/30'
    : 'text-ag-gray-light border-ag-border'
}

function gradeActiveColor(g: string) {
  return g === '★'  ? 'border-ag-grade-star bg-ag-grade-star/10 text-ag-grade-star'
    : g === 'AAA'   ? 'border-ag-grade-aaa  bg-ag-grade-aaa/10  text-ag-grade-aaa'
    : g === 'AA'    ? 'border-ag-grade-aa   bg-ag-grade-aa/10   text-ag-grade-aa'
    : g === 'A'     ? 'border-ag-grade-a    bg-ag-grade-a/10    text-ag-grade-a'
    : g === 'B'     ? 'border-ag-grade-b    bg-ag-grade-b/10    text-ag-grade-b'
    : 'border-ag-black bg-ag-black text-white'
}

function fmtArr(n: unknown) {
  if (!n) return null
  const v = Number(n)
  if (v >= 1_000_000) return `ARR ${(v / 1_000_000).toFixed(1)}M€`
  if (v >= 1_000)     return `ARR ${(v / 1_000).toFixed(0)}K€`
  return null
}


export default function CatalogFilters({ assets, locale, labels }: Props) {
  const [grade,    setGrade]    = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [arrRange, setArrRange] = useState<number>(0)

  /* Catégories distinctes présentes dans les actifs */
  const categories = useMemo(() => {
    const seen = new Set<string>()
    assets.forEach(a => { if (a.asset_type) seen.add(a.asset_type) })
    return Array.from(seen).sort()
  }, [assets])

  const filtered = useMemo(() => {
    return assets.filter(a => {
      if (grade    && a.official_grade !== grade) return false
      if (category && a.asset_type    !== category) return false
      const range = ARR_RANGES[arrRange]
      if (range && arrRange > 0) {
        const v = a.arr ?? 0
        if (v < range.min || v >= range.max) return false
      }
      return true
    })
  }, [assets, grade, category, arrRange])

  const hasFilters = grade !== '' || category !== '' || arrRange !== 0

  function reset() {
    setGrade('')
    setCategory('')
    setArrRange(0)
  }

  return (
    <>
      {/* ── Barre de filtres sticky ── */}
      <section className="border-b border-ag-border bg-ag-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2">

          {/* Filtres grade */}
          <div className="flex items-center gap-1 flex-wrap">
            {GRADE_KEYS.map((g) => (
              <button
                key={g || 'all'}
                onClick={() => setGrade(g)}
                className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${
                  grade === g ? gradeActiveColor(g) : `border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black ${g ? gradeColor(g) : ''}`
                }`}
              >
                {g ? (g === '★' ? 'AEG ★' : g) : labels.filterAll}
              </button>
            ))}
          </div>

          {/* Séparateur */}
          {categories.length > 0 && (
            <div className="w-px h-5 bg-ag-border mx-1 shrink-0" />
          )}

          {/* Filtres catégorie */}
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={`font-mono text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${
                category === cat
                  ? 'border-ag-navy bg-ag-navy text-white'
                  : 'border-ag-border text-ag-gray-light hover:border-ag-black hover:text-ag-black'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Séparateur */}
          <div className="w-px h-5 bg-ag-border mx-1 shrink-0" />

          {/* Filtre ARR */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal size={11} className="text-ag-gray-light shrink-0" />
            {ARR_RANGES.map((r, i) => (
              <button
                key={i}
                onClick={() => setArrRange(i)}
                className={`font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${
                  arrRange === i
                    ? 'border-ag-navy bg-ag-navy text-white'
                    : 'border-ag-border text-ag-gray-light hover:border-ag-black hover:text-ag-black'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-ag-gray-light hover:text-red-500 transition-colors ml-2"
            >
              <X size={10} /> Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* ── Résultats ── */}
      <section id="notify" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {filtered.length} actif{filtered.length > 1 ? 's' : ''} — session en cours
                {hasFilters && (
                  <span className="ml-2 text-ag-apex">
                    ({assets.length - filtered.length} masqué{assets.length - filtered.length > 1 ? 's' : ''} par les filtres)
                  </span>
                )}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-16">
                {filtered.map((asset) => (
                  <div key={asset.id} className="bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`border px-3 py-1 font-mono font-bold text-[14px] ${gradeColor(asset.official_grade ?? '')}`}>
                        {asset.official_grade === '★' ? 'AEG ★' : (asset.official_grade ?? '—')}
                      </div>
                      {asset.score_total != null && (
                        <span className="font-mono text-[10px] text-ag-gray-light">{asset.score_total}/100</span>
                      )}
                    </div>

                    {asset.company_name && (
                      <p className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em]">
                        {asset.company_name}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {asset.asset_type && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light border border-ag-border px-2 py-0.5">
                          {asset.asset_type}
                        </span>
                      )}
                      {fmtArr(asset.arr) && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-apex">
                          {fmtArr(asset.arr)}
                        </span>
                      )}
                    </div>

                    {asset.public_summary && (
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed line-clamp-3">
                        {asset.public_summary}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-ag-border">
                      <NextLink
                        href={`/${locale}/client/buyer/catalogue`}
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ag-black hover:text-ag-apex transition-colors"
                      >
                        Accéder au dossier complet <ArrowUpRight size={10} />
                      </NextLink>
                    </div>
                  </div>
                ))}
              </div>
              <CatalogNotifyForm locale={locale} />
            </>
          ) : assets.length > 0 ? (
            <div className="py-12 text-center">
              <p className="font-mono text-[11px] uppercase tracking-widest text-ag-gray-light mb-4">
                {labels.noResults}
              </p>
              <button
                onClick={reset}
                className="font-mono text-[10px] uppercase tracking-widest border border-ag-border px-5 py-2.5 text-ag-gray hover:border-ag-black hover:text-ag-black transition-colors"
              >
                {labels.resetFilters}
              </button>
            </div>
          ) : (
            <CatalogNotifyForm locale={locale} />
          )}
        </div>
      </section>
    </>
  )
}
