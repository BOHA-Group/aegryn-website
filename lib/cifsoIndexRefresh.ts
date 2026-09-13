/**
 * lib/cifsoIndexRefresh.ts — Rafraîchissement du moteur de benchmarks CIFSO Valuation Index
 *
 * Exécuté chaque lundi à 06:00 (Europe/Zurich) par /api/cron/index-refresh, ou à la demande
 * par l'admin. Recalcule et ré-écrit les séries dérivées dans cifso_index_benchmarks :
 *
 *   1. Séries de marché par cluster (EV/Revenue, EV/EBITDA, coefficients CIFSO) depuis les
 *      données curées par Aegryn (cifso_market_multiples) ;
 *   2. Séries par vertical (multiple ARR, NRR, croissance, marge brute) depuis benchmark_data ;
 *   3. Séries vivantes sur les cinq dimensions CIFSO (score médian C, I, F, S, O, p25/p75,
 *      échantillon) et par grade, depuis les évaluations publiées ;
 *   4. Distribution des grades et écart de multiple B → AAA par dimension.
 *
 * Les sources internes restent dans source_internal (jamais exposées). Journal dans
 * cifso_index_refresh_log.
 */
import { createServiceClient } from '@/lib/supabase'
import { DIMENSION_META, type ValuationDimension } from '@/lib/cifsoValuation'

const MIN_SAMPLE = 10

type Upsert = {
  scope_type: string; scope_key: string; metric: string; period: string
  p25: number | null; p50: number | null; p75: number | null; sample_size: number | null
  unit: string; is_public: boolean; source_internal: string
}

function pct(sorted: number[], q: number): number | null {
  if (!sorted.length) return null
  const i = (sorted.length - 1) * q
  const lo = Math.floor(i), hi = Math.ceil(i)
  return Math.round((sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)) * 100) / 100
}

export async function refreshCifsoIndex(): Promise<{ ok: boolean; period: string; upserted: number; dimensions: Record<string, unknown>; error?: string }> {
  const supa = createServiceClient()
  const { data: log } = await supa.from('cifso_index_refresh_log').insert({}).select('id').single()
  const logId = log?.id as string | undefined

  try {
    const now = new Date()
    const period = `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`
    const rows: Upsert[] = []

    /* 1. Clusters depuis cifso_market_multiples */
    const { data: mult } = await supa.from('cifso_market_multiples').select('*').eq('is_active', true)
    for (const m of mult ?? []) {
      const per = (m.reference_period as string) ?? period
      rows.push({ scope_type: 'cluster', scope_key: m.cluster_key, metric: 'ev_revenue', period: per, p25: m.ev_revenue_low, p50: r2((m.ev_revenue_low + m.ev_revenue_high) / 2), p75: m.ev_revenue_high, sample_size: null, unit: 'x', is_public: m.cluster_key === 'tech_innovation', source_internal: 'cifso_market_multiples' })
      if (m.ev_ebitda_low != null) rows.push({ scope_type: 'cluster', scope_key: m.cluster_key, metric: 'ev_ebitda', period: per, p25: m.ev_ebitda_low, p50: r2((m.ev_ebitda_low + m.ev_ebitda_high) / 2), p75: m.ev_ebitda_high, sample_size: null, unit: 'x', is_public: false, source_internal: 'cifso_market_multiples' })
      rows.push({ scope_type: 'cluster', scope_key: m.cluster_key, metric: 'cifso_coeff', period: per, p25: m.cifso_coeff_score_40, p50: m.cifso_coeff_score_60, p75: m.cifso_coeff_score_80, sample_size: null, unit: 'x', is_public: true, source_internal: 'cifso_market_multiples' })
    }

    /* 2. Verticaux depuis benchmark_data */
    const { data: bd } = await supa.from('benchmark_data').select('*')
    const byCat = new Map<string, Record<string, Record<string, number | string>>>()
    for (const b of bd ?? []) {
      if (!byCat.has(b.category)) byCat.set(b.category, {})
      byCat.get(b.category)![b.profile_tier] = b
    }
    for (const [cat, tiers] of byCat) {
      const med = tiers.median, top = tiers.top, weak = tiers.weak
      if (!med) continue
      const per = (med.source_date as string) ?? period
      rows.push({ scope_type: 'vertical', scope_key: cat, metric: 'arr_multiple', period: per, p25: Number(med.multiple_low), p50: r2((Number(med.multiple_low) + Number(med.multiple_high)) / 2), p75: Number(top?.multiple_low ?? med.multiple_high), sample_size: null, unit: 'x', is_public: cat === 'saas_horizontal', source_internal: 'benchmark_data' })
      for (const [metric, col] of [['nrr', 'nrr_min'], ['growth_yoy', 'growth_min'], ['gross_margin', 'gross_margin_min']] as const) {
        if (weak && top) rows.push({ scope_type: 'vertical', scope_key: cat, metric, period: per, p25: Number(weak[col]), p50: Number(med[col]), p75: Number(top[col]), sample_size: null, unit: '%', is_public: false, source_internal: 'benchmark_data' })
      }
    }

    /* 3. Dimensions CIFSO et grades depuis les évaluations publiées */
    const { data: pub } = await supa.from('grade_assessments').select('final_grade, final_score, engine_result_json').eq('status', 'published')
    const P = (pub ?? []) as { final_grade: string; final_score: number | null; engine_result_json: { dimensions?: Record<string, { score?: number }> } | null }[]
    const dimSummary: Record<string, unknown> = {}
    for (const d of Object.keys(DIMENSION_META) as ValuationDimension[]) {
      const scores = P.map(p => p.engine_result_json?.dimensions?.[d]?.score).filter((x): x is number => typeof x === 'number').sort((a, b) => a - b)
      dimSummary[d] = { n: scores.length, p50: pct(scores, 0.5) }
      if (scores.length >= MIN_SAMPLE) {
        rows.push({ scope_type: 'dimension', scope_key: d, metric: 'cifso_score', period, p25: pct(scores, 0.25), p50: pct(scores, 0.5), p75: pct(scores, 0.75), sample_size: scores.length, unit: 'pts', is_public: false, source_internal: 'grade_assessments:published' })
      }
      /* Écart de multiple par dimension : dérivé des coefficients du cluster de référence, pondéré */
      const ref = (mult ?? []).find(m => m.cluster_key === 'tech_innovation')
      if (ref) {
        const uplift = r2(((ref.cifso_coeff_score_80 / ref.cifso_coeff_score_40) - 1) * DIMENSION_META[d].weight * 100)
        rows.push({ scope_type: 'dimension', scope_key: d, metric: 'dimension_uplift', period, p25: null, p50: uplift, p75: null, sample_size: null, unit: '%', is_public: false, source_internal: 'derived:cifso_market_multiples×weights' })
      }
    }
    const total = P.map(p => p.final_score).filter((x): x is number => typeof x === 'number').sort((a, b) => a - b)
    if (total.length >= MIN_SAMPLE) {
      rows.push({ scope_type: 'market', scope_key: 'certified', metric: 'cifso_score', period, p25: pct(total, 0.25), p50: pct(total, 0.5), p75: pct(total, 0.75), sample_size: total.length, unit: 'pts', is_public: true, source_internal: 'grade_assessments:published' })
    }
    const byGrade: Record<string, number> = {}
    for (const p of P) byGrade[p.final_grade] = (byGrade[p.final_grade] ?? 0) + 1
    for (const [g, n] of Object.entries(byGrade)) {
      rows.push({ scope_type: 'grade', scope_key: g, metric: 'deal_count', period, p25: null, p50: n, p75: null, sample_size: n, unit: 'count', is_public: false, source_internal: 'grade_assessments:published' })
    }

    /* Upsert */
    let upserted = 0
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50).map(r => ({ ...r, is_active: true, updated_at: new Date().toISOString() }))
      const { error } = await supa.from('cifso_index_benchmarks').upsert(chunk, { onConflict: 'scope_type,scope_key,metric,period' })
      if (error) throw new Error(error.message)
      upserted += chunk.length
    }

    if (logId) await supa.from('cifso_index_refresh_log').update({ finished_at: new Date().toISOString(), status: 'ok', period, series_upserted: upserted, dimensions_json: { ...dimSummary, byGrade } }).eq('id', logId)
    return { ok: true, period, upserted, dimensions: { ...dimSummary, byGrade } }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (logId) await supa.from('cifso_index_refresh_log').update({ finished_at: new Date().toISOString(), status: 'error', error: msg }).eq('id', logId)
    return { ok: false, period: '', upserted: 0, dimensions: {}, error: msg }
  }
}

const r2 = (v: number) => Math.round(v * 100) / 100
