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
import { sendEmail }                 from '@/lib/sendEmail'
import { refreshPrescore }           from '@/lib/prescoreServer'
import { computeCifsoValuation, clusterFromSector, type CifsoValuation, type ClusterKey, type MarketMultiples } from '@/lib/cifsoValuation'

function fmtEurRange(lo: number, hi: number) {
  const f = (n: number) => new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
  return `${f(lo)} à ${f(hi)}`
}

/** CIFSO-XXXX-XXXX : alphabet sans caractères ambigus */
function generateVerificationCode(): string {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part = () => Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join('')
  return `CIFSO-${part()}-${part()}`
}

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

const organisationInputSchema = z.object({
  keyPersonCount:           z.number().int().min(0),
  successionPlanDocumented: z.enum(['yes', 'no']),
  operationalDocsComplete:  z.enum(['yes', 'no']),
  lowKeyTalentTurnover:     z.enum(['yes', 'no']),
  formalizedManagement:     z.enum(['yes', 'no']),
  founderLeadsSales:        z.enum(['yes', 'no']),
  cultureDocumented:        z.enum(['yes', 'no']),
  independentAdvisor:       z.enum(['yes', 'no']),
})

const proofQualityDimensionSchema = z.object({
  code:         z.enum(['declarative', 'verifiable', 'audited']),
  ip:           z.enum(['declarative', 'verifiable', 'audited']),
  finance:      z.enum(['declarative', 'verifiable', 'audited']),
  security:     z.enum(['declarative', 'verifiable', 'audited']),
  organisation: z.enum(['declarative', 'verifiable', 'audited']).optional(),
})

const bodySchema = z.object({
  token:           z.string().optional(),
  action:          z.enum(['compute', 'validate', 'publish']).default('compute'),
  input:           z.object({
    code:           codeInputSchema,
    ip:             ipInputSchema,
    finance:        financeInputSchema,
    security:       securityInputSchema,
    organisation:   organisationInputSchema,
    proofQualities: proofQualityDimensionSchema.optional(),
  }),
  assessmentId:    z.string().uuid().optional(),
  finalGrade:      z.enum(['star','aaa','aa','a','b','refused']).optional(),
  overrideNote:    z.string().max(2000).optional(),
  publicRationale: z.string().max(3000).optional(),
  emitPreGrade:    z.boolean().optional(),  // C2 — Pre-Grade explicite admin, uniquement si grade=refused
  /* Valorisation indicative : cluster de multiples (déduit du secteur si absent) */
  valuationCluster: z.enum(['tech_innovation', 'finance_capital', 'sante_sciences', 'industrie_infra', 'commerce_services']).optional(),
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
  const adminUser = await getAdminUser()
  if (!tokenOk && !adminUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const supa = createServiceClient()

  // ── Vérifier que l'asset existe ──────────────────────────────────────────
  const { data: asset } = await supa
    .from('assets').select('id').eq('id', assetId).single()
  if (!asset) return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })

  // ── admin_id (FK auth.users, NOT NULL) : session admin (cookie), sinon Bearer JWT,
  //    sinon premier compte admin (mode token machine) ────────────────────────
  let adminId: string | null = adminUser?.id ?? null
  if (!adminId) {
    const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim()
    if (jwt) {
      const { data: { user } } = await supa.auth.getUser(jwt)
      if (user) adminId = user.id
    }
  }
  if (!adminId) {
    const { data: fallbackAdmin } = await supa
      .from('profiles').select('id').contains('roles', ['admin']).limit(1).maybeSingle()
    adminId = fallbackAdmin?.id ?? null
  }
  if (!adminId) return NextResponse.json({ error: 'no_admin_identity' }, { status: 401 })

  // ── ACTION: compute ──────────────────────────────────────────────────────
  if (body.action === 'compute') {
    const result = runGradeEngine(body.input as GradeInput)

    // Hash SHA-256 des inputs bruts pour garantir l'intégrité post-save (Sprint 3I)
    const inputHash = createHash('sha256').update(JSON.stringify(body.input)).digest('hex')

    // 5C — Version number + Delta : récupérer la dernière évaluation publiée ou validée
    const { data: prevAssessment } = await supa
      .from('grade_assessments')
      .select('version_number, computed_score, dimensions:engine_result_json')
      .eq('asset_id', assetId)
      .in('status', ['published', 'validated', 'draft'])
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    const versionNumber = (prevAssessment?.version_number ?? 0) + 1

    // Calcul du delta si version précédente existe
    let delta: Record<string, unknown> | null = null
    if (prevAssessment && prevAssessment.dimensions) {
      const prev = prevAssessment.dimensions as { dimensions?: { code?: { score?: number }; ip?: { score?: number }; finance?: { score?: number }; security?: { score?: number } }; grade?: string; trs?: string }
      const prevDims = prev?.dimensions
      if (prevDims) {
        delta = {
          scoresDelta: {
            code:     result.dimensions.code.score - (prevDims.code?.score ?? 0),
            ip:       result.dimensions.ip.score - (prevDims.ip?.score ?? 0),
            finance:  result.dimensions.finance.score - (prevDims.finance?.score ?? 0),
            security: result.dimensions.security.score - (prevDims.security?.score ?? 0),
            total:    result.totalScore - (prevAssessment.computed_score ?? 0),
          },
          gradeBefore: prev?.grade ?? null,
          gradeAfter:  result.grade,
          trsBefore:   prev?.trs ?? null,
          trsAfter:    result.trs,
        }
      }
    }

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
        engine_analyst_id:   adminId,
        // TRS + recommendations — persistance Sprint 4 (V1)
        trs:                 result.trs,
        trs_reasons:         result.trsReasons,
        recommendations:     result.recommendations,
        // 5C — Version + Delta
        version_number:      versionNumber,
        delta:               delta,
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
        grade_validator_id:  adminId,
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
      .select('final_grade, final_score, public_rationale, status, trs, recommendations, engine_result_json, input_json')
      .eq('id', body.assessmentId)
      .eq('asset_id', assetId)
      .single()

    if (!assessment) return NextResponse.json({ error: 'assessment_not_found' }, { status: 404 })
    if (assessment.status !== 'validated') {
      return NextResponse.json({ error: 'must_validate_before_publish' }, { status: 422 })
    }

    // Dossier + KYC/KYB du demandeur + mandat signé
    const { data: assetFull } = await supa
      .from('assets')
      .select('asking_price, status, company_name, seller_name, seller_email, seller_uid, dossier_type, verification_code, sector, benchmark_category, valuation_cluster, arr')
      .eq('id', assetId)
      .maybeSingle()

    const [{ data: sellerProfile }, { count: signedMandates }] = await Promise.all([
      assetFull?.seller_uid
        ? supa.from('profiles').select('kyc_status').eq('id', assetFull.seller_uid).maybeSingle()
        : assetFull?.seller_email
          ? supa.from('profiles').select('kyc_status').eq('email', assetFull.seller_email).maybeSingle()
          : Promise.resolve({ data: null }),
      supa.from('mandates').select('id', { count: 'exact', head: true }).eq('asset_id', assetId).not('mandate_signed_at', 'is', null),
    ])

    /* ── Garde KYC/KYB : aucun grade publié (certification ou transaction) sans identification
          approuvée du demandeur. Le calcul et la validation restent possibles en amont. ── */
    if (sellerProfile?.kyc_status !== 'approved' && !body.emitPreGrade) {
      return NextResponse.json({ error: 'kyc_required', message: 'KYC/KYB du demandeur non approuvé : publication bloquée.' }, { status: 422 })
    }

    /* ── Garde documentaire : pièces bloquantes vérifiées (pré-scoring), sauf Pre-Grade explicite ── */
    const prescore = await refreshPrescore(assetId)
    if (!prescore.canGrade && !body.emitPreGrade) {
      return NextResponse.json({
        error: 'documents_blocking',
        message: 'Pièces bloquantes manquantes ou insuffisantes dans la Data Room.',
        blocked: prescore.dimensions.filter(d => d.state === 'blocked').map(d => ({ dimension: d.letter, missing: d.missingCodes })),
      }, { status: 422 })
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

    // 5B — Transaction Ready : 4 conditions métier + 2 corrections (C1)
    const transactionReadyGrades = ['star', 'aaa', 'aa', 'a']
    const transactionReadyTrs    = ['ready', 'conditional']

    // C1-b : documents bloquants manquants dans la data room
    const { count: blockingCount } = await supa
      .from('data_room_documents')
      .select('*', { count: 'exact', head: true })
      .eq('asset_id', assetId)
      .eq('required_level', 'blocking')
      .neq('admin_quality', 'sufficient')

    const gradeOk    = transactionReadyGrades.includes(assessment.final_grade)
    const trsOk      = transactionReadyTrs.includes(assessment.trs ?? '')
    const kycOk      = sellerProfile?.kyc_status === 'approved'
    const mandateOk  = (signedMandates ?? 0) > 0
    const docsOk     = (blockingCount ?? 1) === 0
    const priceOk    = assetFull?.asking_price != null

    const transactionReady = gradeOk && trsOk && kycOk && mandateOk && docsOk && priceOk

    // Construire la checklist des bloqueurs (visible vendeur)
    const transactionReadyBlockers: string[] = []
    if (!gradeOk)   transactionReadyBlockers.push(`Grade ${assessment.final_grade} insuffisant — minimum requis : A`)
    if (!trsOk)     transactionReadyBlockers.push(`TRS ${assessment.trs ?? 'non calculé'} — minimum requis : conditional`)
    if (!kycOk)     transactionReadyBlockers.push('KYC vendeur non validé')
    if (!mandateOk) transactionReadyBlockers.push('Mandat de vente non signé')
    if (!docsOk)    transactionReadyBlockers.push(`${blockingCount ?? '?'} document(s) bloquant(s) manquant(s) dans la data room`)
    if (!priceOk)   transactionReadyBlockers.push('Prix demandé non renseigné')

    // C2 — Pre-Grade : uniquement sur grade=refused + demande explicite admin
    // Grade B = grade officiel certifié (30-44/100), ne devient PAS pre_grade
    const isRefused   = assessment.final_grade === 'refused'
    const emitPreGrade = isRefused && body.emitPreGrade === true && !!assessment.recommendations
    const preGradeActions = emitPreGrade
      ? { estimatedGrade: 'b', actions: assessment.recommendations }
      : null

    /* Statut dossier : le grade certifié rend le dossier "graded" (visible client : fiche de grade,
       rapport, feuille de route). Les statuts aval (published/sold) sont conservés. */
    const keepStatus = ['published', 'sold', 'withdrawn'].includes(assetFull?.status ?? '')
    const now = new Date().toISOString()
    const isRefusedGrade = assessment.final_grade === 'refused'
    /* Certificat : code public de vérification (stable pour le dossier) + validité 12 mois */
    const verificationCode = assetFull?.verification_code ?? generateVerificationCode()
    const validUntil = new Date(Date.now() + 365 * 86_400_000).toISOString()

    const { error: assetErr } = await supa
      .from('assets')
      .update({
        aeg_grade:              assessment.final_grade,
        official_grade:         GRADE_TO_SYMBOL[assessment.final_grade] ?? assessment.final_grade,
        public_summary:         assessment.public_rationale ?? undefined,
        graded_at:              now,
        published_at:           now,
        ...(!isRefusedGrade ? { verification_code: verificationCode, certificate_valid_until: validUntil } : {}),
        ...(!keepStatus && !preGradeActions ? { status: 'graded' } : {}),
        // 5B
        trs:                    assessment.trs ?? null,
        auction_ready:          transactionReady,
        auction_ready_at:       transactionReady ? new Date().toISOString() : null,
        auction_ready_blockers: transactionReadyBlockers.length > 0 ? transactionReadyBlockers : null,
        // 5A C2 — Pre-Grade explicite sur refused uniquement
        ...(preGradeActions ? {
          status:              'pre_grade',
          pre_grade_actions:   preGradeActions,
          pre_grade_issued_at: new Date().toISOString(),
        } : {}),
      })
      .eq('id', assetId)

    if (assetErr) return NextResponse.json({ error: assetErr.message }, { status: 500 })

    /* ── Valorisation indicative CIFSO : conclusion chiffrée du grade (client uniquement) ── */
    let valuation: CifsoValuation | null = null
    if (!isRefusedGrade) {
      const engine = (assessment.engine_result_json ?? {}) as { dimensions?: Record<string, { score?: number }>; totalScore?: number; effectiveProofQualities?: Record<string, 'declarative' | 'verifiable' | 'audited'> }
      const inputJ = (assessment.input_json ?? {}) as { finance?: { arr?: number } }
      const arr = inputJ.finance?.arr ?? (assetFull?.arr as number | null) ?? null
      const cluster = body.valuationCluster
        ?? (assetFull?.valuation_cluster as ClusterKey | null)
        ?? (['tech_innovation','finance_capital','sante_sciences','industrie_infra','commerce_services'].includes(assetFull?.benchmark_category ?? '') ? assetFull?.benchmark_category as ClusterKey : null)
        ?? clusterFromSector(assetFull?.sector)
      if (arr && arr > 0 && cluster && engine.dimensions) {
        const { data: mult } = await supa.from('cifso_market_multiples').select('*').eq('cluster_key', cluster).eq('is_active', true).maybeSingle()
        if (mult) {
          const ds = engine.dimensions
          valuation = computeCifsoValuation({
            arr,
            totalScore: assessment.final_score ?? engine.totalScore ?? 0,
            dimensionScores: { code: ds.code?.score ?? 0, ip: ds.ip?.score ?? 0, finance: ds.finance?.score ?? 0, security: ds.security?.score ?? 0, organisation: ds.organisation?.score ?? 0 },
            multiples: mult as unknown as MarketMultiples,
            proofQualities: engine.effectiveProofQualities,
          })
          await Promise.all([
            supa.from('assets').update({ valuation_cluster: cluster, valuation_json: valuation, valuation_at: now }).eq('id', assetId),
            supa.from('grade_assessments').update({ valuation_json: valuation }).eq('id', body.assessmentId),
          ])
        }
      }
    }

    /* ── Retour au client demandeur : notification in-app + email avec les livrables ── */
    const symbol   = GRADE_TO_SYMBOL[assessment.final_grade] ?? assessment.final_grade
    const orgName  = assetFull?.company_name ?? `Dossier ${assetId.slice(0, 8)}`
    const dossier  = `/client/seller/actifs/${assetId}`
    const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
    const title    = preGradeActions
      ? `Pre-Grade émis pour ${orgName}`
      : `Certification CIFSO 5000 : grade ${symbol} attribué à ${orgName}`
    const bodyTxt  = preGradeActions
      ? 'Votre dossier ne remplit pas encore les conditions de certification. Un plan d\'actions prioritaires est disponible dans votre espace.'
      : `Votre certificat, le rapport détaillé par dimension (C, I, F, S, O), la feuille de route et le résumé certifié sont disponibles dans votre espace client. Validité : 12 mois. Contestation possible sous 15 jours.`

    let clientUid: string | null = assetFull?.seller_uid ?? null
    if (!clientUid && assetFull?.seller_email) {
      const { data: prof } = await supa.from('profiles').select('id').eq('email', assetFull.seller_email).maybeSingle()
      clientUid = prof?.id ?? null
    }

    const [notifRes] = await Promise.allSettled([
      clientUid
        ? supa.from('user_notifications').insert({
            user_id: clientUid,
            type:    'certification_update',
            title,
            body:    bodyTxt,
            link:    dossier,
            payload: { asset_id: assetId, grade: assessment.final_grade, trs: assessment.trs ?? null, pre_grade: !!preGradeActions },
          })
        : Promise.resolve(),
      assetFull?.seller_email
        ? sendEmail(
            assetFull.seller_email,
            `Aegryn. ${title}`,
            `<p>Bonjour ${assetFull.seller_name ?? ''},</p>
<p>${bodyTxt}</p>
<ul>
  <li>Grade : <strong>${symbol}</strong>${assessment.final_score != null ? ` (${assessment.final_score}/100)` : ''}</li>
  ${assessment.public_rationale ? `<li>Résumé certifié : ${assessment.public_rationale}</li>` : ''}
  ${valuation ? `<li>Valorisation indicative : ${fmtEurRange(valuation.value.low, valuation.value.high)} (multiple ${valuation.multiple.low}x à ${valuation.multiple.high}x du revenu récurrent)</li>` : ''}
</ul>
<p><a href="${siteUrl}${dossier}">Consulter le dossier, télécharger la fiche de grade et le kit de communication</a></p>
${!isRefusedGrade ? `<p>Vérification publique du certificat : <a href="${siteUrl}/fr/verify/${verificationCode}">${siteUrl}/fr/verify/${verificationCode}</a></p>` : ''}
<p>Aegryn. Organisme de certification indépendant. Suisse.</p>`,
            'grade-publish',
          )
        : Promise.resolve(),
    ])
    if (notifRes.status === 'fulfilled' && notifRes.value && 'error' in notifRes.value && notifRes.value.error) {
      console.error('[grade-engine/publish] notification', notifRes.value.error)
    }

    return NextResponse.json({ ok: true, grade: assessment.final_grade, transactionReady, transactionReadyBlockers, valuation })
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
