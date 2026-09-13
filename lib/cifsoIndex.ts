/**
 * lib/cifsoIndex.ts — Moteur de benchmarks du CIFSO Valuation Index (côté serveur)
 *
 * Agrège les séries normalisées (cifso_index_benchmarks) et les médianes vivantes des
 * dossiers certifiés (grade_assessments publiées) en un instantané unique. En mode
 * aperçu (accès libre), seules les séries marquées is_public sont chiffrées ; les autres
 * sont renvoyées verrouillées (valeurs nulles). Les sources internes ne sortent jamais :
 * la source affichée est « Aegryn CIFSO Valuation Index ».
 */
import { createServiceClient } from '@/lib/supabase'
import { INDEX_CLUSTERS, INDEX_VERTICALS, TEASER_CLUSTER, TEASER_VERTICAL, type IndexLocale } from '@/lib/indexTaxonomy'
import { DIMENSION_META, type ClusterKey, type ValuationDimension } from '@/lib/cifsoValuation'

export const INDEX_SOURCE_LABEL = 'Aegryn CIFSO Valuation Index'

export interface Range { p25: number | null; p50: number | null; p75: number | null; locked: boolean; sampleSize?: number | null }
export interface IndexCluster {
  key: ClusterKey; label: string
  evRevenue: Range; evEbitda: Range
  coeff: { score40: number | null; score60: number | null; score80: number | null; locked: boolean }
  verticals: { key: string; label: string; arrMultiple: Range | null; nrr: Range | null; growth: Range | null; grossMargin: Range | null }[]
}
export interface IndexDimension {
  key: ValuationDimension; letter: string; label: string; weight: number
  /** médiane du score des organisations certifiées (vivant), null si échantillon insuffisant */
  medianScore: number | null; sampleSize: number
  /** écart de multiple entre les organisations B et AAA, en % (abonnés) */
  upliftPct: number | null; locked: boolean
}
export interface IndexSnapshot {
  source: string
  period: string | null
  mode: 'teaser' | 'full'
  clusters: IndexCluster[]
  dimensions: IndexDimension[]
  certified: { count: number; byGrade: Record<string, number> }
  coverage: { clusters: number; verticals: number; metrics: number }
}

type Row = { scope_type: string; scope_key: string; metric: string; period: string; p25: number | null; p50: number | null; p75: number | null; sample_size: number | null; is_public: boolean }

const MIN_SAMPLE = 10

function toRange(r: Row | undefined, full: boolean): Range {
  if (!r) return { p25: null, p50: null, p75: null, locked: true }
  const open = full || r.is_public
  return open
    ? { p25: num(r.p25), p50: num(r.p50), p75: num(r.p75), locked: false, sampleSize: r.sample_size }
    : { p25: null, p50: null, p75: null, locked: true, sampleSize: r.sample_size }
}
const num = (v: unknown) => (v == null ? null : Number(v))

export async function getIndexSnapshot(opts: { locale?: IndexLocale; full?: boolean } = {}): Promise<IndexSnapshot> {
  const locale = opts.locale ?? 'fr'
  const full   = opts.full ?? false
  const supa   = createServiceClient()

  const [{ data: rows }, { data: published }] = await Promise.all([
    supa.from('cifso_index_benchmarks')
      .select('scope_type, scope_key, metric, period, p25, p50, p75, sample_size, is_public')
      .eq('is_active', true),
    supa.from('grade_assessments')
      .select('final_grade, final_score, engine_result_json')
      .eq('status', 'published'),
  ])
  const R = (rows ?? []) as Row[]
  const find = (scope: string, key: string, metric: string) => R.find(r => r.scope_type === scope && r.scope_key === key && r.metric === metric)
  const period = R.map(r => r.period).sort().at(-1) ?? null

  const clusters: IndexCluster[] = INDEX_CLUSTERS.map(c => {
    const coeffRow = find('cluster', c.key, 'cifso_coeff')
    const coeffOpen = full || coeffRow?.is_public
    return {
      key: c.key, label: c.label[locale],
      evRevenue: toRange(find('cluster', c.key, 'ev_revenue'), full),
      evEbitda:  toRange(find('cluster', c.key, 'ev_ebitda'), full),
      coeff: coeffOpen && coeffRow
        ? { score40: num(coeffRow.p25), score60: num(coeffRow.p50), score80: num(coeffRow.p75), locked: false }
        : { score40: null, score60: null, score80: null, locked: true },
      verticals: INDEX_VERTICALS.filter(v => v.cluster === c.key).map(v => {
        const cat = v.benchmarkCategory
        const open = full || v.key === TEASER_VERTICAL
        const rng = (m: string) => cat ? (open ? toRange(find('vertical', cat, m), true) : { p25: null, p50: null, p75: null, locked: true }) : null
        return { key: v.key, label: v.label[locale], arrMultiple: rng('arr_multiple'), nrr: rng('nrr'), growth: rng('growth_yoy'), grossMargin: rng('gross_margin') }
      }),
    }
  })

  /* Dimensions : médianes vivantes des dossiers certifiés publiés */
  const pub = (published ?? []) as { final_grade: string; final_score: number | null; engine_result_json: { dimensions?: Record<string, { score?: number }> } | null }[]
  const byGrade: Record<string, number> = {}
  for (const p of pub) byGrade[p.final_grade] = (byGrade[p.final_grade] ?? 0) + 1
  const dimensions: IndexDimension[] = (Object.keys(DIMENSION_META) as ValuationDimension[]).map(d => {
    const scores = pub.map(p => p.engine_result_json?.dimensions?.[d]?.score).filter((x): x is number => typeof x === 'number').sort((a, b) => a - b)
    const median = scores.length >= MIN_SAMPLE ? scores[Math.floor(scores.length / 2)] : null
    /* Écart de multiple B → AAA : dérivé des coefficients du cluster d'aperçu, pondéré par le poids de la dimension */
    const c = find('cluster', TEASER_CLUSTER, 'cifso_coeff')
    const uplift = c && c.p25 != null && c.p75 != null ? Math.round(((Number(c.p75) / Number(c.p25)) - 1) * DIMENSION_META[d].weight * 100) : null
    return {
      key: d, letter: DIMENSION_META[d].letter, label: DIMENSION_META[d].label, weight: DIMENSION_META[d].weight,
      medianScore: full ? median : null, sampleSize: scores.length,
      upliftPct: full ? uplift : null, locked: !full,
    }
  })

  return {
    source: INDEX_SOURCE_LABEL, period, mode: full ? 'full' : 'teaser',
    clusters, dimensions,
    certified: { count: pub.length, byGrade },
    coverage: { clusters: INDEX_CLUSTERS.length, verticals: INDEX_VERTICALS.length, metrics: 9 },
  }
}
