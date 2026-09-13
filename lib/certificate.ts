/**
 * lib/certificate.ts — Lecture publique d'un certificat CIFSO 5000
 *
 * Expose uniquement ce qui figure sur le certificat : organisation, grade,
 * score global, scores par dimension, dates, validité, résumé certifié.
 * Aucune donnée de la data room, aucun indicateur financier brut.
 */
import { createServiceClient } from '@/lib/supabase'

export type CertificateStatus = 'valid' | 'expired' | 'superseded' | 'not_found'

export interface PublicCertificate {
  code:          string
  status:        CertificateStatus
  organisation:  string
  grade:         string          // ★ AAA AA A B
  gradeKey:      string          // star aaa aa a b
  score:         number | null
  dimensions:    { letter: string; label: string; score: number | null; max: number }[]
  issuedAt:      string | null
  validUntil:    string | null
  summary:       string | null
  sector:        string | null
  country:       string | null
  version:       string
}

export const GRADE_SYMBOL: Record<string, string> = { star: '★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B' }
const DIMS = [
  { key: 'code',         letter: 'C', label: 'Code & Architecture',   max: 20 },
  { key: 'ip',           letter: 'I', label: 'IP & Droits',           max: 20 },
  { key: 'finance',      letter: 'F', label: 'Finance',               max: 20 },
  { key: 'security',     letter: 'S', label: 'Sécurité',              max: 20 },
  { key: 'organisation', letter: 'O', label: 'Organisation & Talent', max: 20 },
]

export function normaliseCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')
}

export async function getPublicCertificate(rawCode: string): Promise<PublicCertificate | null> {
  const code = normaliseCode(rawCode)
  if (!/^CIFSO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return null

  const supa = createServiceClient()
  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, aeg_grade, public_summary, published_at, graded_at, certificate_valid_until, status, sector, grading_version')
    .eq('verification_code', code)
    .maybeSingle()
  if (!asset || !asset.aeg_grade || asset.aeg_grade === 'refused') return null

  const { data: assessment } = await supa
    .from('grade_assessments')
    .select('final_score, computed_score, engine_result_json, published_at')
    .eq('asset_id', asset.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const engine = (assessment?.engine_result_json ?? {}) as { dimensions?: Record<string, { score?: number }> }
  const validUntil = asset.certificate_valid_until as string | null
  const status: CertificateStatus =
    asset.status === 'withdrawn'                          ? 'superseded'
    : validUntil && new Date(validUntil) < new Date()      ? 'expired'
    : 'valid'

  return {
    code,
    status,
    organisation: asset.company_name ?? 'Organisation certifiée',
    grade:        GRADE_SYMBOL[asset.aeg_grade] ?? asset.aeg_grade,
    gradeKey:     asset.aeg_grade,
    score:        (assessment?.final_score ?? assessment?.computed_score ?? null) as number | null,
    dimensions:   DIMS.map(d => ({ letter: d.letter, label: d.label, max: d.max, score: engine.dimensions?.[d.key]?.score ?? null })),
    issuedAt:     (assessment?.published_at ?? asset.published_at ?? asset.graded_at) as string | null,
    validUntil,
    summary:      asset.public_summary ?? null,
    sector:       asset.sector ?? null,
    country:      null,
    version:      (asset.grading_version as string | null) ?? 'CIFSO 5000',
  }
}
