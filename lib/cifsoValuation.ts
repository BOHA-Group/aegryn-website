/**
 * lib/cifsoValuation.ts — Valorisation indicative CIFSO 5000
 *
 * Complément quantitatif au grade : traduit le score CIFSO en fourchette de valeur
 * d'entreprise (EV) à partir des multiples de marché européens par cluster
 * (table cifso_market_multiples, source CIFSO Valuation Index) :
 *
 *   EV = ARR × multiple de cluster × coefficient CIFSO global × (1 + Σ ajustements par dimension)
 *
 *   - Coefficient global : interpolation linéaire des coefficients du cluster aux
 *     scores 40 / 60 / 80 (borné en dessous de 40 et prolongé au-dessus de 80).
 *   - Ajustements par dimension (C, I, F, S, O) : chaque dimension pèse sur le
 *     multiple selon son écart à la médiane (10/20), pondéré par son influence
 *     transactionnelle. La somme est bornée à ±20 %.
 *   - Potentiel : valeur atteignable si une dimension est remontée à 16/20, pour
 *     relier la feuille de route (recommandations) à un impact chiffré.
 *
 * Il s'agit d'une valorisation indicative de marché, jamais d'une évaluation
 * contractuelle : le grade certifie la qualité et la transmissibilité, la
 * valorisation en tire une conclusion chiffrée que la transaction confirme.
 */

export type ValuationDimension = 'code' | 'ip' | 'finance' | 'security' | 'organisation'
export type ClusterKey = 'tech_innovation' | 'finance_capital' | 'sante_sciences' | 'industrie_infra' | 'commerce_services'

export interface MarketMultiples {
  cluster_key:           string
  ev_revenue_low:        number
  ev_revenue_high:       number
  ev_ebitda_low:         number | null
  ev_ebitda_high:        number | null
  cifso_coeff_score_40:  number
  cifso_coeff_score_60:  number
  cifso_coeff_score_80:  number
  reference_period?:     string | null
  sample_size?:          number | null
}

export interface ValuationInput {
  arr:              number                                 // revenu récurrent annuel (EUR)
  ebitda?:          number | null
  totalScore:       number                                 // 0..100
  dimensionScores:  Record<ValuationDimension, number>     // 0..20
  multiples:        MarketMultiples
  proofQualities?:  Partial<Record<ValuationDimension, 'declarative' | 'verifiable' | 'audited'>>
}

export interface DimensionImpact {
  dimension:     ValuationDimension
  letter:        string
  label:         string
  score:         number
  weight:        number
  adjustmentPct: number        // ex. +4.5 → +4,5 % sur le multiple
  valueImpactMid: number       // EUR, contribution au point médian
  upliftTo16Mid:  number       // EUR gagnés au point médian si la dimension passe à 16/20 (0 si déjà ≥ 16)
}

export interface CifsoValuation {
  version:        'cifso-valuation-1'
  computedAt:     string
  cluster:        string
  basis:          { arr: number; ebitda: number | null }
  market:         { evRevenueLow: number; evRevenueHigh: number; evEbitdaLow: number | null; evEbitdaHigh: number | null; referencePeriod: string | null; sampleSize: number | null }
  globalCoeff:    number
  dimensionAdjustmentPct: number
  multiple:       { low: number; mid: number; high: number }
  value:          { low: number; mid: number; high: number }
  valueEbitda:    { low: number; high: number } | null
  impacts:        DimensionImpact[]
  upliftTotalMid: number
  confidence:     'low' | 'medium' | 'high'
  confidenceNote: string
}

export const DIMENSION_META: Record<ValuationDimension, { letter: string; label: string; weight: number }> = {
  finance:      { letter: 'F', label: 'Finance',               weight: 0.30 },
  code:         { letter: 'C', label: 'Code & Architecture',   weight: 0.20 },
  ip:           { letter: 'I', label: 'IP & Droits',           weight: 0.20 },
  organisation: { letter: 'O', label: 'Organisation & Talent', weight: 0.15 },
  security:     { letter: 'S', label: 'Sécurité',              weight: 0.15 },
}

/** Amplitude maximale de l'ajustement cumulé des dimensions sur le multiple */
const DIM_ADJ_CAP = 0.20
/** Sensibilité : une dimension à 20/20 avec un poids de 1 vaudrait +25 % ; à 0/20, -25 % */
const DIM_SENSITIVITY = 0.50

export function globalCoefficient(score: number, m: MarketMultiples): number {
  const s = Math.max(0, Math.min(100, score))
  if (s <= 40) return round4(m.cifso_coeff_score_40 * Math.max(0.5, s / 40))
  if (s <= 60) return round4(lerp(m.cifso_coeff_score_40, m.cifso_coeff_score_60, (s - 40) / 20))
  if (s <= 80) return round4(lerp(m.cifso_coeff_score_60, m.cifso_coeff_score_80, (s - 60) / 20))
  const slope = (m.cifso_coeff_score_80 - m.cifso_coeff_score_60) / 20
  return round4(m.cifso_coeff_score_80 + slope * (s - 80) * 0.5)
}

export function computeCifsoValuation(input: ValuationInput): CifsoValuation {
  const { arr, multiples: m, totalScore, dimensionScores } = input
  const coeff = globalCoefficient(totalScore, m)

  /* Ajustements par dimension */
  const rawAdj: Record<ValuationDimension, number> = { finance: 0, code: 0, ip: 0, organisation: 0, security: 0 }
  for (const d of Object.keys(DIMENSION_META) as ValuationDimension[]) {
    const s = clamp(dimensionScores[d] ?? 0, 0, 20)
    rawAdj[d] = ((s - 10) / 10) * DIM_SENSITIVITY * DIMENSION_META[d].weight
  }
  const rawSum = Object.values(rawAdj).reduce((a, b) => a + b, 0)
  const scale  = Math.abs(rawSum) > DIM_ADJ_CAP ? DIM_ADJ_CAP / Math.abs(rawSum) : 1
  const dimAdj = rawSum * scale

  const factor   = coeff * (1 + dimAdj)
  const multiple = { low: round2(m.ev_revenue_low * factor), high: round2(m.ev_revenue_high * factor), mid: 0 }
  multiple.mid   = round2((multiple.low + multiple.high) / 2)
  const value    = { low: Math.round(arr * multiple.low), mid: Math.round(arr * multiple.mid), high: Math.round(arr * multiple.high) }

  const valueEbitda = input.ebitda && input.ebitda > 0 && m.ev_ebitda_low != null && m.ev_ebitda_high != null
    ? { low: Math.round(input.ebitda * m.ev_ebitda_low * coeff), high: Math.round(input.ebitda * m.ev_ebitda_high * coeff) }
    : null

  /* Impacts et potentiel par dimension (au point médian, toutes choses égales par ailleurs) */
  const baseMid = arr * ((m.ev_revenue_low + m.ev_revenue_high) / 2) * coeff
  const impacts: DimensionImpact[] = (Object.keys(DIMENSION_META) as ValuationDimension[]).map(d => {
    const s = clamp(dimensionScores[d] ?? 0, 0, 20)
    const adj = rawAdj[d] * scale
    const target = 16
    const adjAt16 = ((target - 10) / 10) * DIM_SENSITIVITY * DIMENSION_META[d].weight * scale
    const uplift = s < target ? Math.round(baseMid * (adjAt16 - adj)) : 0
    return {
      dimension: d, letter: DIMENSION_META[d].letter, label: DIMENSION_META[d].label, score: s,
      weight: DIMENSION_META[d].weight,
      adjustmentPct: round2(adj * 100),
      valueImpactMid: Math.round(baseMid * adj),
      upliftTo16Mid: uplift,
    }
  })

  /* Confiance : qualité de preuve dominante */
  const pq = Object.values(input.proofQualities ?? {})
  const audited    = pq.filter(x => x === 'audited').length
  const verifiable = pq.filter(x => x === 'verifiable').length
  const confidence: CifsoValuation['confidence'] = pq.length === 0 ? 'low' : audited >= 3 ? 'high' : audited + verifiable >= 3 ? 'medium' : 'low'
  const confidenceNote = confidence === 'high'
    ? 'Preuves majoritairement auditées : fourchette resserrée et défendable.'
    : confidence === 'medium'
      ? 'Preuves vérifiables : fourchette indicative, à confirmer par les pièces auditées.'
      : 'Preuves déclaratives : fourchette large, à confirmer en due diligence.'

  return {
    version: 'cifso-valuation-1',
    computedAt: new Date().toISOString(),
    cluster: m.cluster_key,
    basis: { arr, ebitda: input.ebitda ?? null },
    market: { evRevenueLow: m.ev_revenue_low, evRevenueHigh: m.ev_revenue_high, evEbitdaLow: m.ev_ebitda_low, evEbitdaHigh: m.ev_ebitda_high, referencePeriod: m.reference_period ?? null, sampleSize: m.sample_size ?? null },
    globalCoeff: coeff,
    dimensionAdjustmentPct: round2(dimAdj * 100),
    multiple, value, valueEbitda, impacts,
    upliftTotalMid: impacts.reduce((a, i) => a + i.upliftTo16Mid, 0),
    confidence, confidenceNote,
  }
}

/** Mapping secteur libre → cluster de multiples (mots-clés, insensible à la casse) */
export function clusterFromSector(sector: string | null | undefined): ClusterKey | null {
  if (!sector) return null
  const s = sector.toLowerCase()
  if (/tech|saas|logiciel|software|ia\b|ai\b|digital|numérique|plateforme|platform|cyber|data/.test(s)) return 'tech_innovation'
  if (/financ|banque|bank|assur|insur|capital|fintech|invest/.test(s)) return 'finance_capital'
  if (/sant|health|pharma|medic|biotech|science|clinique/.test(s)) return 'sante_sciences'
  if (/industr|infra|énergie|energy|manufactur|construction|logisti|transport/.test(s)) return 'industrie_infra'
  if (/commerce|retail|service|distribution|hôtel|hotel|tourism|conseil|consult/.test(s)) return 'commerce_services'
  return null
}

export const CLUSTER_LABELS_FR: Record<ClusterKey, string> = {
  tech_innovation: 'Tech & Innovation', finance_capital: 'Finance & Capital', sante_sciences: 'Santé & Sciences',
  industrie_infra: 'Industrie & Infrastructure', commerce_services: 'Commerce & Services',
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function round2(v: number) { return Math.round(v * 100) / 100 }
function round4(v: number) { return Math.round(v * 10000) / 10000 }
