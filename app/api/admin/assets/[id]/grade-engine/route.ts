/**
 * POST /api/admin/assets/[id]/grade-engine
 *
 * Lance le moteur de calcul Aegryn Grade à partir de données factuelles brutes.
 * Stocke le résultat complet dans grade_assessments (audit trail).
 *
 * Body : { input: GradeInput, finalGrade?: GradeLetter, overrideNote?: string,
 *          publicRationale?: string, action: 'compute' | 'validate' | 'publish' }
 *
 * - action='compute'  → calcule + sauvegarde en draft (pas d'override possible)
 * - action='validate' → finalise le grade (override + note si différent)
 * - action='publish'  → publie le rationnel public sur la fiche actif
 *
 * ADMIN UNIQUEMENT — authentifié via ADMIN_LEADS_TOKEN.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createHash }                from 'crypto'
import { createServiceClient }       from '@/lib/supabase'
import { runGradeEngine, type GradeInput, type GradeLetter } from '@/lib/gradeEngine'
import { getAdminUser }              from '@/lib/adminAuth'

// ── Schéma de validation Zod ──────────────────────────────────────────────────

const codeInputSchema = z.object({
  testCoverage:           z.number().min(0).max(100),
  techDebtDocumented:     z.enum(['yes', 'no']),
  criticalVulnOpen:       z.number().int().min(0),
  majorVulnOpen:          z.number().int().min(0),
  architecture:           z.enum(['decoupled', 'partial', 'monolithic']),
  ciCdFunctional:         z.enum(['yes', 'no']),
  apiDocumentation:       z.enum(['complete', 'partial', 'absent']),
  obsoleteDependencies:   z.number().min(0),
  lastCodeAuditMonthsAgo: z.number().min(0),
})

const ipInputSchema = z.object({
  trademarksJurisdictions:    z.number().int().min(0),
  activeIPLitigation:         z.enum(['yes', 'no']),
  employeeIPRights:           z.enum(['complete', 'partial', 'absent']),
  openSourceRisk:             z.enum(['yes', 'no']),
  thirdPartyAPIContracted:    z.enum(['yes', 'no']),
  moat:                       z.enum(['network', 'data', 'regulatory', 'none']),
  rgpdCompliance:             z.enum(['complete', 'partial', 'absent']),
})

const founderDependencySchema = z.object({
  founderLeadsSales:    z.enum(['yes', 'no']),
  noSigningDelegation:  z.enum(['yes', 'no']),
  revenueAtRisk:        z.enum(['yes', 'no']),
  noOperationalDocs:    z.enum(['yes', 'no']),
  noSuccessionPlan:     z.enum(['yes', 'no']),
})

const financeInputSchema = z.object({
  arr:                      z.number().min(0),
  revenueAgeMonths:         z.number().int().min(0),
  arrAudited:               z.enum(['declarative', 'verifiable', 'audited']),
  nrr:                      z.number().nullable(),
  monthlyChurn:             z.number().min(0),
  grossMargin:              z.number(),
  yoyGrowth:                z.number(),
  topClientConcentration:   z.number().min(0).max(100),
  runwayMonths:             z.number().min(0),
  founderDependency:        founderDependencySchema.optional(),
  topCustomerPct:            z.number().min(0).max(100).optional(),
  top3CustomerPct:           z.number().min(0).max(100).optional(),
  cashOnHand:                z.number().min(0).optional(),
  monthlyBurn:               z.number().min(0).optional(),
  monthlyNewMrr:             z.number().min(0).optional(),
})

const securityInputSchema = z.object({
  lastPentestMonthsAgo:     z.number().min(0),
  criticalVulnsResolved:    z.enum(['yes', 'no', 'na']),
  mfaOnAdminAccess:         z.enum(['yes', 'no']),
  encryption:               z.enum(['full', 'partial', 'none']),
  rgpdDocumented:           z.enum(['yes', 'no']),
  activeSecurityIncident:   z.enum(['yes', 'no']),
  externalCertification:    z.enum(['yes', 'in_progress', 'no']),
  accessManagement:          z.enum(['yes', 'no']).optional(),
  pentestMethodology:       z.enum(['owasp_ptes', 'custom', 'unknown']).optional(),
  pentestAuditorCert:       z.enum(['oscp_crest', 'other_cert', 'none']).optional(),
  rgpdTransferReadiness:    z.enum(['clean', 'warning', 'blocking']).optional(),
})

const proofQualityDimensionSchema = z.object({
  code:     z.enum(['declarative', 'verifiable', 'audited']),
  ip:       z.enum(['declarative', 'verifiable', 'audited']),
  finance:  z.enum(['declarative', 'verifiable', 'audited']),
  security: z.enum(['declarative', 'verifiable', 'audited']),
})

const bodySchema = z.object({
  token:           z.string().optional(),
  action:          z.enum(['compute', 'validate', 'publish']).default('compute'),
  input:           z.object({
    code:           codeInputSchema,
    ip:             ipInputSchema,
    finance:        financeInputSchema,
    security:       securityInputSchema,
    proofQualities: proofQualityDimensionSchema.optional(),
  }),
  assessmentId:    z.string().uuid().optional(),
  finalGrade:      z.enum(['star','aaa','aa','a','b','refused']).optional(),
  overrideNote:    z.string().max(2000).optional(),
  publicRationale: z.string().max(3000).optional(),
})

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assetId } = await params

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  let body: z.infer<typeof bodySchema>

  try {
    body = bodySchema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const tokenOk = adminToken && body.token === adminToken
  if (!tokenOk) {
    const adminUser = await getAdminUser()
    if (!adminUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supa = createServiceClient()

  // ── Vérifier que l'asset existe ──────────────────────────────────────────
  const { data: asset } = await supa
    .from('assets').select('id').eq('id', assetId).single()
  if (!asset) return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })

  // ── Récupérer l'admin_id via le token Supabase auth ─────────────────────
  const authHeader = req.headers.get('authorization') ?? ''
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim()
  let adminId: string = '00000000-0000-0000-0000-000000000000'
  if (jwt) {
    const { data: { user } } = await supa.auth.getUser(jwt)
    if (user) adminId = user.id
  }

  // ── ACTION: compute ──────────────────────────────────────────────────────
  if (body.action === 'compute') {
    const result = runGradeEngine(body.input as GradeInput)

    // Hash SHA-256 des inputs bruts pour garantir l'intégrité post-save (Sprint 3I)
    const inputHash = createHash('sha256').update(JSON.stringify(body.input)).digest('hex')

    const { data, error } = await supa
      .from('grade_assessments')
      .insert({
        asset_id:            assetId,
        admin_id:            adminId,
        input_json:          body.input,
        engine_result_json:  result,
        computed_grade:      result.grade,
        computed_score:      result.totalScore,
        final_grade:         result.grade,
        final_score:         result.totalScore,
        is_overridden:       false,
        public_rationale:    result.publicRationale,
        status:              'draft',
        input_hash:          inputHash,
        engine_analyst_id:   adminId !== '00000000-0000-0000-0000-000000000000' ? adminId : null,
        // TRS + recommendations — persistance Sprint 4 (V1)
        trs:                 result.trs,
        trs_reasons:         result.trsReasons,
        recommendations:     result.recommendations,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[grade-engine/compute]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, assessmentId: data.id, result })
  }

  // ── ACTION: validate ─────────────────────────────────────────────────────
  if (body.action === 'validate') {
    if (!body.assessmentId) {
      return NextResponse.json({ error: 'assessmentId_required' }, { status: 400 })
    }

    const { data: existing } = await supa
      .from('grade_assessments')
      .select('computed_grade, computed_score')
      .eq('id', body.assessmentId)
      .eq('asset_id', assetId)
      .single()

    if (!existing) return NextResponse.json({ error: 'assessment_not_found' }, { status: 404 })

    const finalGrade = (body.finalGrade ?? existing.computed_grade) as GradeLetter
    const isOverridden = finalGrade !== existing.computed_grade

    if (isOverridden && !body.overrideNote) {
      return NextResponse.json({ error: 'override_note_required_when_grade_changed' }, { status: 422 })
    }

    const { error } = await supa
      .from('grade_assessments')
      .update({
        final_grade:         finalGrade,
        final_score:         existing.computed_score,
        is_overridden:       isOverridden,
        override_note:       isOverridden ? body.overrideNote : null,
        public_rationale:    body.publicRationale ?? undefined,
        status:              'validated',
        validated_at:        new Date().toISOString(),
        grade_validator_id:  adminId !== '00000000-0000-0000-0000-000000000000' ? adminId : null,
      })
      .eq('id', body.assessmentId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, finalGrade, isOverridden })
  }

  // ── ACTION: publish ──────────────────────────────────────────────────────
  if (body.action === 'publish') {
    if (!body.assessmentId) {
      return NextResponse.json({ error: 'assessmentId_required' }, { status: 400 })
    }

    const { data: assessment } = await supa
      .from('grade_assessments')
      .select('final_grade, final_score, public_rationale, status')
      .eq('id', body.assessmentId)
      .eq('asset_id', assetId)
      .single()

    if (!assessment) return NextResponse.json({ error: 'assessment_not_found' }, { status: 404 })
    if (assessment.status !== 'validated') {
      return NextResponse.json({ error: 'must_validate_before_publish' }, { status: 422 })
    }

    // Supersede les évaluations précédentes publiées
    await supa
      .from('grade_assessments')
      .update({ status: 'superseded' })
      .eq('asset_id', assetId)
      .eq('status', 'published')
      .neq('id', body.assessmentId)

    // Publier cette évaluation
    const { error: pubErr } = await supa
      .from('grade_assessments')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', body.assessmentId)

    if (pubErr) return NextResponse.json({ error: pubErr.message }, { status: 500 })

    // Mettre à jour la fiche actif avec le grade final
    const GRADE_TO_SYMBOL: Record<string, string> = {
      star: '★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'NG',
    }
    const { error: assetErr } = await supa
      .from('assets')
      .update({
        aeg_grade:      assessment.final_grade,
        official_grade: GRADE_TO_SYMBOL[assessment.final_grade] ?? assessment.final_grade,
        public_summary: assessment.public_rationale ?? undefined,
        published_at:   new Date().toISOString(),
      })
      .eq('id', assetId)

    if (assetErr) return NextResponse.json({ error: assetErr.message }, { status: 500 })

    return NextResponse.json({ ok: true, grade: assessment.final_grade })
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
}

// GET — historique des évaluations pour un actif
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assetId } = await params
  const token = new URL(req.url).searchParams.get('token')
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  const tokenOk = adminToken && token === adminToken
  if (!tokenOk) {
    const adminUser = await getAdminUser()
    if (!adminUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('grade_assessments')
    .select('id, computed_grade, computed_score, final_grade, final_score, is_overridden, status, created_at, validated_at, published_at')
    .eq('asset_id', assetId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ assessments: data })
}
