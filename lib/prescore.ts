/**
 * lib/prescore.ts — Pré-scoring documentaire automatique CIFSO 5000
 *
 * À partir des pièces déposées dans la data room et de leur vérification
 * (admin_quality), calcule pour chaque dimension C, I, F, S, O :
 *   - la complétude (bloquants / recommandés),
 *   - la qualité de preuve suggérée (declarative / verifiable / audited),
 *     qui plafonne le grade dans le moteur (lib/gradingSystem),
 *   - l'état : blocked (pièce bloquante manquante ou insuffisante),
 *              partial (pièces en attente de vérification), ready.
 *
 * Ce pré-scoring ne remplace pas le moteur (lib/gradeEngine) : il prépare
 * la revue manuelle de l'admin ou de l'expert mandaté et bloque la
 * publication tant qu'une dimension est « blocked ».
 */

export type PrescoreDimension = 'code' | 'ip' | 'finance' | 'security' | 'organisation'
export type ProofQuality = 'declarative' | 'verifiable' | 'audited'

export interface PrescoreDoc {
  document_code: string | null
  admin_quality: string | null
  required_level: string | null
  dimension: string | null
  category: string | null
}
export interface PrescoreCatalogEntry { code: string; dimension: string; required_level: string }

export interface DimensionPrescore {
  dimension:        PrescoreDimension
  letter:           string
  blockingTotal:    number
  blockingOk:       number
  blockingPending:  number
  blockingFailed:   number   // insuffisant
  blockingMissing:  number   // aucun dépôt
  recommendedTotal: number
  recommendedOk:    number
  completeness:     number   // 0..100
  proofQuality:     ProofQuality
  state:            'blocked' | 'partial' | 'ready'
  missingCodes:     string[]
}

export interface Prescore {
  version:      'prescore-1'
  computedAt:   string
  dimensions:   DimensionPrescore[]
  completeness: number
  canGrade:     boolean            // aucune dimension blocked
  needsReview:  string[]           // codes en attente de vérification
  proofQualities: Record<PrescoreDimension, ProofQuality>
}

const LETTER_TO_DIM: Record<string, PrescoreDimension> = { C: 'code', I: 'ip', F: 'finance', S: 'security', O: 'organisation' }
const DIM_TO_LETTER: Record<PrescoreDimension, string> = { code: 'C', ip: 'I', finance: 'F', security: 'S', organisation: 'O' }

export function computePrescore(catalog: PrescoreCatalogEntry[], docs: PrescoreDoc[]): Prescore {
  const dims = (Object.keys(DIM_TO_LETTER) as PrescoreDimension[]).map((dim) => {
    const letter   = DIM_TO_LETTER[dim]
    const entries  = catalog.filter(c => LETTER_TO_DIM[c.dimension] === dim)
    const blocking = entries.filter(c => c.required_level === 'blocking')
    const recomm   = entries.filter(c => c.required_level === 'recommended')

    const best = (code: string) => {
      const q = docs.filter(d => d.document_code === code).map(d => d.admin_quality ?? 'pending_review')
      if (q.includes('sufficient'))     return 'sufficient'
      if (q.includes('pending_review')) return 'pending_review'
      if (q.length)                     return 'insufficient'
      return 'missing'
    }
    const bq = blocking.map(c => ({ code: c.code, q: best(c.code) }))
    const blockingOk      = bq.filter(x => x.q === 'sufficient').length
    const blockingPending = bq.filter(x => x.q === 'pending_review').length
    const blockingFailed  = bq.filter(x => x.q === 'insufficient').length
    const blockingMissing = bq.filter(x => x.q === 'missing').length
    const recommendedOk   = recomm.filter(c => best(c.code) === 'sufficient').length

    const bScore = blocking.length ? blockingOk / blocking.length : 1
    const rScore = recomm.length   ? recommendedOk / recomm.length : 1
    const completeness = Math.round((bScore * 0.7 + rScore * 0.3) * 100)

    const allBlockingOk = blocking.length > 0 && blockingOk === blocking.length
    const proofQuality: ProofQuality =
      allBlockingOk && rScore >= 0.8 ? 'audited'
      : allBlockingOk                ? 'verifiable'
      : 'declarative'
    const state: DimensionPrescore['state'] =
      blockingFailed + blockingMissing > 0 ? 'blocked'
      : blockingPending > 0                ? 'partial'
      : 'ready'

    return {
      dimension: dim, letter,
      blockingTotal: blocking.length, blockingOk, blockingPending, blockingFailed, blockingMissing,
      recommendedTotal: recomm.length, recommendedOk,
      completeness, proofQuality, state,
      missingCodes: bq.filter(x => x.q !== 'sufficient').map(x => x.code),
    } satisfies DimensionPrescore
  })

  const needsReview = docs
    .filter(d => (d.admin_quality ?? 'pending_review') === 'pending_review' && d.document_code)
    .map(d => d.document_code as string)

  return {
    version: 'prescore-1',
    computedAt: new Date().toISOString(),
    dimensions: dims,
    completeness: Math.round(dims.reduce((a, d) => a + d.completeness, 0) / dims.length),
    canGrade: dims.every(d => d.state !== 'blocked'),
    needsReview: Array.from(new Set(needsReview)),
    proofQualities: Object.fromEntries(dims.map(d => [d.dimension, d.proofQuality])) as Record<PrescoreDimension, ProofQuality>,
  }
}
