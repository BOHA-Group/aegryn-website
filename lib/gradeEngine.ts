/**
 * lib/gradeEngine.ts — Moteur de calcul Aegryn Grade
 *
 * USAGE ADMIN EXCLUSIVEMENT — NE JAMAIS IMPORTER CÔTÉ CLIENT PUBLIC.
 *
 * Architecture :
 *  - Couche 1 : types d'entrée (données factuelles brutes)
 *  - Couche 2 : fonctions de scoring par dimension (pondération propriétaire)
 *  - Couche 3 : agrégation + grade final
 *  - Couche 4 : génération du rationnel qualitatif (exposable client, sans chiffres de pondération)
 *
 * Les seuils et pondérations internes ne doivent jamais être exposés
 * dans une interface publique ou dans la documentation externe.
 */

import type { ProofQuality, AEGGrade } from './gradingSystem'
import { capAegByProofQuality } from './gradingSystem'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — ENTRÉES FACTUELLES
// ─────────────────────────────────────────────────────────────────────────────

export type YesNo         = 'yes' | 'no'

/** Niveau de preuve pour l'ARR — remplace le booléen arrAudited (CIFS v3.0) */
export type ArrAuditLevel = 'declarative' | 'verifiable' | 'audited'
export type YesNoNA       = 'yes' | 'no' | 'na'
export type Coverage      = 'complete' | 'partial' | 'absent'
export type Architecture  = 'decoupled' | 'partial' | 'monolithic'
export type DocLevel      = 'complete' | 'partial' | 'absent'
export type MoatType      = 'network' | 'data' | 'regulatory' | 'none'
export type Encryption    = 'full' | 'partial' | 'none'
export type Certification = 'yes' | 'in_progress' | 'no'

export interface CodeInput {
  testCoverage: number               // 0-100 %
  techDebtDocumented: YesNo
  criticalVulnOpen: number           // count, 0 = idéal
  majorVulnOpen: number              // count
  architecture: Architecture
  ciCdFunctional: YesNo
  apiDocumentation: DocLevel
  obsoleteDependencies: number       // count ou %
  lastCodeAuditMonthsAgo: number     // 9999 = jamais
}

export interface IPInput {
  trademarksJurisdictions: number    // nb de juridictions
  activeIPLitigation: YesNo
  employeeIPRights: Coverage
  openSourceRisk: YesNo              // dépendances GPL critiques
  thirdPartyAPIContracted: YesNo     // API tierce critique contractualisée
  moat: MoatType
  rgpdCompliance: Coverage
}

/** Score de dépendance fondateur — 5 critères objectifs (CIFS v3.0 F-42) */
export interface FounderDependencyInput {
  /** Fondateur présent dans >50% des appels commerciaux */
  founderLeadsSales: YesNo
  /** Aucun N-1 capable de signer un contrat sans le fondateur */
  noSigningDelegation: YesNo
  /** Départ fondateur = perte >20% du CA estimée */
  revenueAtRisk: YesNo
  /** Pas de documentation opérationnelle (runbooks, SOPs) */
  noOperationalDocs: YesNo
  /** Aucun plan de succession documenté */
  noSuccessionPlan: YesNo
}

export interface FinanceInput {
  arr: number                        // ARR en €
  revenueAgeMonths: number           // ancienneté revenus
  arrAudited: ArrAuditLevel          // niveau de preuve ARR (CIFS v3.0)
  nrr: number | null                 // % ou null si <12 mois
  monthlyChurn: number               // %
  grossMargin: number                // %
  yoyGrowth: number                  // %
  topClientConcentration: number     // % du top 1 client (ancien champ — déprécié)
  runwayMonths: number               // mois (valeur manuelle — déprécié)
  founderDependency?: FounderDependencyInput  // optionnel — CIFS v3.0
  // ── Nouveaux champs Sprint 1 ──
  topCustomerPct?: number            // % CA du 1er client (0-100)
  top3CustomerPct?: number           // % CA des 3 premiers clients (0-100)
  cashOnHand?: number                // trésorerie en €
  monthlyBurn?: number               // burn rate mensuel brut en €
  monthlyNewMrr?: number             // nouvelle MRR mensuelle en €
}

export type PentestMethodology = 'owasp_ptes' | 'custom' | 'unknown'
export type PentestAuditorCert = 'oscp_crest' | 'other_cert' | 'none'

export interface SecurityInput {
  lastPentestMonthsAgo: number       // 9999 = jamais
  criticalVulnsResolved: YesNoNA
  mfaOnAdminAccess: YesNo
  encryption: Encryption
  rgpdDocumented: YesNo
  activeSecurityIncident: YesNo
  externalCertification: Certification
  pentestMethodology?: PentestMethodology  // CIFS v3.0
  pentestAuditorCert?: PentestAuditorCert  // CIFS v3.0
  rgpdTransferReadiness?: 'clean' | 'warning' | 'blocking'  // CIFS v3.0 I-27
  /** S-15 — Politique de gestion des accès documentée (RBAC/IAM) */
  accessManagement?: YesNo            // CIFS v3.0 V3 — règle MFA/S-15
}

export interface GradeInput {
  code:     CodeInput
  ip:       IPInput
  finance:  FinanceInput
  security: SecurityInput
  /** Niveau de preuve par dimension — pilote le plafond de grade (CIFS v3.0) */
  proofQualities?: {
    code:     ProofQuality
    ip:       ProofQuality
    finance:  ProofQuality
    security: ProofQuality
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — SORTIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NIVEAUX DE VISIBILITÉ DU RAPPORT AEGRYN (Sprint 4 / Point H)
 *
 * PUBLIC (catalogue, avant NDA) :
 *   grade, gradeLabel, totalScore, scores par dimension, trs, secteur
 *
 * POST-NDA (acheteur qualifié après double NDA) :
 *   + subcodes détaillés, proofQuality par dimension, gradeCeiling,
 *     founderDependency score (F-42), recommendations[], trsReasons[]
 *
 * ADMIN UNIQUEMENT :
 *   + input_hash, engineAnalystId, gradeValidatorId, internalNotes,
 *     inputs bruts (GradeInput), historique versions
 *
 * Ces types TypeScript matérialisent la frontière — les queries Supabase
 * doivent sélectionner uniquement les colonnes correspondant au niveau.
 */

/** Niveau PUBLIC — exposé dans le catalogue avant NDA */
export interface GradeResultPublic {
  grade:       GradeLetter
  gradeLabel:  string
  totalScore:  number
  scoreC:      number
  scoreI:      number
  scoreF:      number
  scoreS:      number
  trs:         TRSLevel
  autoRefusal: boolean
}

/** Niveau POST-NDA — exposé à l'acheteur qualifié après double NDA */
export interface GradeResultPostNda extends GradeResultPublic {
  gradeCeiling?:          GradeLetter
  proofQualities?:        { code: ProofQuality; ip: ProofQuality; finance: ProofQuality; security: ProofQuality }
  founderDependencyScore: number  // 0-5 critères à risque
  trsReasons:             string[]
  recommendations:        GradeRecommendation[]
  rationaleByDimension:   { code: string[]; ip: string[]; finance: string[]; security: string[] }
}

/** Niveau ADMIN UNIQUEMENT — ne jamais exposer hors routes authentifiées admin */
export interface GradeResultAdmin extends GradeResultPostNda {
  inputHash?:          string   // SHA-256 de l'input_json
  engineAnalystId?:    string   // UUID admin qui a saisi
  gradeValidatorId?:   string   // UUID admin qui a validé
  refusalReasons:      string[]
  rawInput?:           GradeInput
}

/** Helper : projette GradeResult → GradeResultPublic */
export function toPublicResult(r: GradeResult): GradeResultPublic {
  return {
    grade:       r.grade,
    gradeLabel:  r.gradeLabel,
    totalScore:  r.totalScore,
    scoreC:      r.dimensions.code.score,
    scoreI:      r.dimensions.ip.score,
    scoreF:      r.dimensions.finance.score,
    scoreS:      r.dimensions.security.score,
    trs:         r.trs,
    autoRefusal: r.autoRefusal,
  }
}

/** Helper : projette GradeResult → GradeResultPostNda */
export function toPostNdaResult(r: GradeResult, input?: GradeInput): GradeResultPostNda {
  const founderDependencyScore = input?.finance?.founderDependency
    ? Object.values(input.finance.founderDependency).filter(v => v === 'yes').length
    : 0
  return {
    ...toPublicResult(r),
    gradeCeiling:          r.gradeCeiling,
    proofQualities:        r.effectiveProofQualities,
    founderDependencyScore,
    trsReasons:            r.trsReasons,
    recommendations:       r.recommendations,
    rationaleByDimension: {
      code:     r.dimensions.code.rationale,
      ip:       r.dimensions.ip.rationale,
      finance:  r.dimensions.finance.rationale,
      security: r.dimensions.security.rationale,
    },
  }
}

export interface DimensionResult {
  score:         number          // 0-25
  autoRefusal:   boolean
  refusalReason?: string
  rationale:     string[]        // constats qualitatifs — exposables client (sans pondération)
}

export type GradeLetter = 'star' | 'aaa' | 'aa' | 'a' | 'b' | 'refused'

/** Niveau de readiness transactionnelle */
export type TRSLevel = 'ready' | 'conditional' | 'remediation' | 'blocked'

/** Recommandation actionnable générée automatiquement par le moteur */
export interface GradeRecommendation {
  dimension: 'C' | 'I' | 'F' | 'S'
  subcode:   string
  priority:  'blocking' | 'high' | 'medium'
  action:    string
  effort:    'days' | 'weeks' | 'months'
  impact:    string
}

export interface GradeResult {
  dimensions: {
    code:     DimensionResult
    ip:       DimensionResult
    finance:  DimensionResult
    security: DimensionResult
  }
  totalScore:      number        // 0-100
  grade:           GradeLetter
  gradeLabel:      string        // AEG ★ | AAA | AA | A | B | Non certifiable
  gradeCeiling?:   GradeLetter   // plafond appliqué par proof_quality (CIFS v3.0)
  /** Transaction Readiness Score — readiness opérationnelle à transiger */
  trs:             TRSLevel
  trsReasons:      string[]       // justifications du TRS
  recommendations: GradeRecommendation[]  // actions actionnables par sous-code
  autoRefusal:     boolean
  refusalReasons:  string[]
  publicRationale: string        // résumé qualitatif exposable côté actif catalogué
  /** Métadonnées proof_quality dérivées effectivement appliquées (après règle ARR) */
  effectiveProofQualities?: {
    code:     ProofQuality
    ip:       ProofQuality
    finance:  ProofQuality
    security: ProofQuality
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION C — CODE (25 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreCode(input: CodeInput): DimensionResult {
  const rationale: string[] = []

  // ── Refus automatique ─────────────────────────────────────────────────────
  if (input.criticalVulnOpen > 0 && input.lastCodeAuditMonthsAgo >= 9999) {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Vulnérabilités critiques ouvertes sans audit de code externe récent',
      rationale: [],
    }
  }
  if (input.testCoverage < 10 && input.criticalVulnOpen > 5) {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Couverture de tests quasi-nulle combinée à de multiples vulnérabilités critiques',
      rationale: [],
    }
  }

  let score = 0

  // Couverture tests — max 7 pts
  if      (input.testCoverage >= 80) { score += 7; rationale.push('Couverture de tests élevée (≥80%)') }
  else if (input.testCoverage >= 70) { score += 5; rationale.push('Couverture de tests satisfaisante (≥70%)') }
  else if (input.testCoverage >= 40) { score += 2; rationale.push('Couverture de tests partielle (40-70%)') }
  else                               {             rationale.push('Couverture de tests insuffisante (<40%)') }

  // Vulnérabilités — max 5 pts
  if      (input.criticalVulnOpen === 0 && input.majorVulnOpen === 0) { score += 5; rationale.push('Aucune vulnérabilité critique ou majeure ouverte') }
  else if (input.criticalVulnOpen === 0 && input.majorVulnOpen <= 3)  { score += 3; rationale.push('Pas de vulnérabilités critiques, quelques vulnérabilités majeures en cours') }
  else if (input.criticalVulnOpen <= 2)                                { score += 1; rationale.push(`${input.criticalVulnOpen} vulnérabilité(s) critique(s) ouverte(s)`) }
  else                                                                 {             rationale.push(`${input.criticalVulnOpen} vulnérabilités critiques ouvertes — situation préoccupante`) }

  // Architecture — max 4 pts
  if      (input.architecture === 'decoupled')  { score += 4; rationale.push('Architecture découplée et scalable') }
  else if (input.architecture === 'partial')    { score += 2; rationale.push('Architecture partiellement découplée') }
  else                                          {             rationale.push('Architecture monolithique non scalable') }

  // CI/CD — max 3 pts
  if (input.ciCdFunctional === 'yes') { score += 3; rationale.push('Pipeline CI/CD fonctionnel') }
  else                                {             rationale.push('Absence de CI/CD automatisé') }

  // Documentation API — max 2 pts
  if      (input.apiDocumentation === 'complete') { score += 2; rationale.push('Documentation technique complète') }
  else if (input.apiDocumentation === 'partial')  { score += 1; rationale.push('Documentation technique partielle') }
  else                                            {             rationale.push('Documentation technique absente') }

  // Dette technique documentée — max 2 pts
  if (input.techDebtDocumented === 'yes') { score += 2; rationale.push('Dette technique documentée et maîtrisée') }
  else                                    {             rationale.push('Dette technique non documentée') }

  // Dépendances obsolètes — max 2 pts (pénalités)
  if      (input.obsoleteDependencies === 0)   { score += 2; rationale.push('Aucune dépendance obsolète (>24 mois)') }
  else if (input.obsoleteDependencies <= 3)    { score += 1; rationale.push(`${input.obsoleteDependencies} dépendance(s) obsolète(s)`) }
  else                                         {             rationale.push(`${input.obsoleteDependencies} dépendances obsolètes — remédiation nécessaire`) }

  // Audit code externe — bonus/malus
  if      (input.lastCodeAuditMonthsAgo <= 12)  { score = Math.min(25, score + 1); rationale.push('Audit de code externe récent (≤12 mois)') }
  else if (input.lastCodeAuditMonthsAgo >= 9999) {                                  rationale.push('Aucun audit de code externe réalisé') }

  return { score: Math.min(score, 25), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION I — IP & DROITS (25 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreIP(input: IPInput): DimensionResult {
  const rationale: string[] = []

  // ── Refus automatique ─────────────────────────────────────────────────────
  if (input.activeIPLitigation === 'yes' && input.employeeIPRights === 'absent') {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Litige IP actif combiné à une absence de cession de droits employés/prestataires',
      rationale: [],
    }
  }

  let score = 0

  // Marques déposées — max 5 pts
  if      (input.trademarksJurisdictions >= 3) { score += 5; rationale.push(`Marques déposées dans ${input.trademarksJurisdictions} juridictions`) }
  else if (input.trademarksJurisdictions === 2) { score += 4; rationale.push('Marques déposées dans 2 juridictions') }
  else if (input.trademarksJurisdictions === 1) { score += 2; rationale.push('Marque déposée dans 1 juridiction') }
  else                                          {             rationale.push('Aucune marque déposée') }

  // Litige IP — max 5 pts (pénalité)
  if      (input.activeIPLitigation === 'no')  { score += 5; rationale.push('Aucun litige IP en cours') }
  else                                          { score -= 3; rationale.push('Litige IP actif — risque significatif') }

  // Droits cession — max 6 pts
  if      (input.employeeIPRights === 'complete') { score += 6; rationale.push('Droits de cession employés et prestataires complets') }
  else if (input.employeeIPRights === 'partial')  { score += 3; rationale.push('Droits de cession partiellement couverts') }
  else                                            {             rationale.push('Droits de cession absents — risque de revendication') }

  // Risque open source GPL — max 3 pts
  if (input.openSourceRisk === 'no') { score += 3; rationale.push('Aucune dépendance open source à risque (GPL)') }
  else                               {             rationale.push('Dépendances GPL critiques identifiées') }

  // API tierce contractualisée — max 2 pts
  if      (input.thirdPartyAPIContracted === 'yes') { score += 2; rationale.push('API tierce critique contractualisée') }
  else                                              {             rationale.push('API tierce critique sans contrat formalisé') }

  // Moat — max 2 pts
  if      (input.moat === 'network' || input.moat === 'data') { score += 2; rationale.push(`Moat identifiable : ${input.moat === 'network' ? 'effet réseau' : 'data propriétaire'}`) }
  else if (input.moat === 'regulatory')                        { score += 2; rationale.push('Moat réglementaire identifié') }
  else                                                         {             rationale.push('Aucun moat défensif identifié') }

  // Conformité RGPD/LPD — max 2 pts
  if      (input.rgpdCompliance === 'complete') { score += 2; rationale.push('Conformité RGPD/LPD complète') }
  else if (input.rgpdCompliance === 'partial')  { score += 1; rationale.push('Conformité RGPD/LPD partielle') }
  else                                          {             rationale.push('Non-conformité RGPD/LPD documentée') }

  return { score: Math.max(0, Math.min(score, 25)), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION F — FINANCE (25 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreFinance(input: FinanceInput): DimensionResult {
  const rationale: string[] = []

  // ── Refus automatique ─────────────────────────────────────────────────────
  if (input.runwayMonths < 3 && input.arr < 100_000) {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Runway inférieur à 3 mois combiné à un ARR insuffisant pour viabilité',
      rationale: [],
    }
  }
  if (input.monthlyChurn > 15) {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Churn mensuel supérieur à 15% — modèle économique non viable',
      rationale: [],
    }
  }

  let score = 0

  // ARR — max 6 pts
  if      (input.arr >= 5_000_000) { score += 6; rationale.push(`ARR de ${fmtK(input.arr)} — position mature`) }
  else if (input.arr >= 1_000_000) { score += 5; rationale.push(`ARR de ${fmtK(input.arr)} — traction significative`) }
  else if (input.arr >= 500_000)   { score += 4; rationale.push(`ARR de ${fmtK(input.arr)} — revenus établis`) }
  else if (input.arr >= 100_000)   { score += 2; rationale.push(`ARR de ${fmtK(input.arr)} — revenus en construction`) }
  else                             {             rationale.push('ARR insuffisant pour une évaluation fiable') }

  // Ancienneté des revenus — max 3 pts
  if      (input.revenueAgeMonths >= 24) { score += 3; rationale.push(`Revenus établis depuis ${input.revenueAgeMonths} mois`) }
  else if (input.revenueAgeMonths >= 12) { score += 2; rationale.push(`Historique de revenus de ${input.revenueAgeMonths} mois`) }
  else if (input.revenueAgeMonths >=  6) { score += 1; rationale.push(`Revenus récents (${input.revenueAgeMonths} mois)`) }
  else                                   {             rationale.push('Historique de revenus insuffisant (<6 mois)') }

  // ARR — niveau de preuve (CIFS v3.0) — max 2 pts
  if      (input.arrAudited === 'audited')    { score += 2; rationale.push('ARR audité par commissaire aux comptes co-signataire') }
  else if (input.arrAudited === 'verifiable') { score += 1; rationale.push('ARR vérifiable (export certifié Stripe/Chargebee)') }
  else                                        {             rationale.push('ARR déclaratif non audité') }

  // NRR — max 3 pts
  if (input.nrr !== null) {
    if      (input.nrr >= 120) { score += 3; rationale.push(`NRR exceptionnel (${input.nrr}%) — expansion nette des revenus`) }
    else if (input.nrr >= 100) { score += 2; rationale.push(`NRR positif (${input.nrr}%) — rétention satisfaisante`) }
    else if (input.nrr >=  80) { score += 1; rationale.push(`NRR en contraction (${input.nrr}%)`) }
    else                       {             rationale.push(`NRR défavorable (${input.nrr}%) — churn revenu significatif`) }
  } else {
    rationale.push('NRR non applicable (historique <12 mois)')
  }

  // Churn mensuel — max 4 pts (pénalité croissante)
  if      (input.monthlyChurn < 1)  { score += 4; rationale.push('Churn mensuel excellent (<1%)') }
  else if (input.monthlyChurn < 3)  { score += 3; rationale.push(`Churn mensuel maîtrisé (${input.monthlyChurn}%)`) }
  else if (input.monthlyChurn < 5)  { score += 1; rationale.push(`Churn mensuel élevé (${input.monthlyChurn}%) — vigilance requise`) }
  else                              {             rationale.push(`Churn mensuel critique (${input.monthlyChurn}%)`) }

  // Concentration client (topCustomerPct) — pénalité jusqu'à -2 pts
  if (input.topCustomerPct !== undefined) {
    if (input.topCustomerPct > 50) {
      score -= 2; rationale.push(`Client principal hyper-dominant (${input.topCustomerPct}% du CA) — risque de dépendance critique`)
    } else if (input.topCustomerPct > 30) {
      score -= 1; rationale.push(`Concentration client modérée (${input.topCustomerPct}% pour le 1er client)`)
    } else {
      rationale.push(`Base client diversifiée (1er client : ${input.topCustomerPct}%)`)
    }
  }
  if (input.top3CustomerPct !== undefined && input.top3CustomerPct > 60) {
    rationale.push(`Concentration élevée sur les 3 premiers clients (${input.top3CustomerPct}% du CA)`)
  }

  // Runway effectif (calculé) — signal bloquant si < 3 mois
  if (input.cashOnHand !== undefined && input.monthlyBurn !== undefined) {
    const effectiveBurn = (input.monthlyBurn ?? 0) - (input.monthlyNewMrr ?? 0)
    if (effectiveBurn <= 0) {
      score += 1; rationale.push('Actif self-funding (burn net ≤0) — autonomie financière confirmée')
    } else {
      const runway = Math.round(input.cashOnHand / effectiveBurn)
      if (runway < 3) {
        rationale.push(`Runway critique (${runway} mois) — ferme la fenêtre AAA/★`)
      } else if (runway < 6) {
        rationale.push(`Runway limité (${runway} mois) — surveiller avant closing`)
      } else {
        rationale.push(`Runway confortable (${runway} mois)`)
      }
    }
  }

  // Score dépendance fondateur — pénalité max -3 pts (CIFS v3.0 F-42)
  if (input.founderDependency) {
    const fd = input.founderDependency
    const riskCount = [fd.founderLeadsSales, fd.noSigningDelegation, fd.revenueAtRisk, fd.noOperationalDocs, fd.noSuccessionPlan]
      .filter(v => v === 'yes').length
    if (riskCount === 0) {
      rationale.push('Aucune dépendance fondateur identifiée — risque clé minimal')
    } else if (riskCount <= 2) {
      score -= 1; rationale.push(`Dépendance fondateur modérée (${riskCount}/5 critères)`)
    } else if (riskCount <= 4) {
      score -= 2; rationale.push(`Dépendance fondateur significative (${riskCount}/5 critères) — plan de succession recommandé`)
    } else {
      score -= 3; rationale.push('Dépendance fondateur critique (5/5 critères) — risque clé majeur pour l\'acquéreur')
    }
  }

  // Marge brute — max 3 pts
  if      (input.grossMargin >= 70) { score += 3; rationale.push(`Marge brute élevée (${input.grossMargin}%)`) }
  else if (input.grossMargin >= 50) { score += 2; rationale.push(`Marge brute satisfaisante (${input.grossMargin}%)`) }
  else if (input.grossMargin >= 30) { score += 1; rationale.push(`Marge brute en développement (${input.grossMargin}%)`) }
  else                              {             rationale.push(`Marge brute insuffisante (${input.grossMargin}%)`) }

  // Croissance YoY — max 2 pts
  if      (input.yoyGrowth >= 100) { score += 2; rationale.push(`Croissance YoY exceptionnelle (+${input.yoyGrowth}%)`) }
  else if (input.yoyGrowth >= 50)  { score += 2; rationale.push(`Forte croissance YoY (+${input.yoyGrowth}%)`) }
  else if (input.yoyGrowth >= 20)  { score += 1; rationale.push(`Croissance YoY modérée (+${input.yoyGrowth}%)`) }
  else if (input.yoyGrowth >= 0)   {             rationale.push(`Croissance YoY faible (+${input.yoyGrowth}%)`) }
  else                             {             rationale.push(`Décroissance YoY (${input.yoyGrowth}%)`) }

  // Concentration client top 1 — max 2 pts (risque)
  if      (input.topClientConcentration <= 10) { score += 2; rationale.push('Base clients diversifiée (top 1 ≤10%)') }
  else if (input.topClientConcentration <= 25) { score += 1; rationale.push(`Concentration client modérée (top 1 = ${input.topClientConcentration}%)`) }
  else                                         {             rationale.push(`Forte concentration client (top 1 = ${input.topClientConcentration}%) — risque de départ`) }

  return { score: Math.max(0, Math.min(score, 25)), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION S — SÉCURITÉ (25 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreSecurity(input: SecurityInput): DimensionResult {
  const rationale: string[] = []

  // ── Refus automatique ─────────────────────────────────────────────────────
  if (input.activeSecurityIncident === 'yes') {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Incident de sécurité actif en cours — certification suspendue',
      rationale: [],
    }
  }
  if (input.mfaOnAdminAccess === 'no' && input.lastPentestMonthsAgo >= 9999) {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Absence de MFA sur les accès admin et aucun pentest réalisé',
      rationale: [],
    }
  }

  let score = 0

  // Pentest — max 7 pts de base + bonus qualification (CIFS v3.0)
  let pentestBase = 0
  if      (input.lastPentestMonthsAgo <= 6)   { pentestBase = 7; rationale.push('Pentest récent (≤6 mois)') }
  else if (input.lastPentestMonthsAgo <= 12)   { pentestBase = 5; rationale.push('Pentest dans l\'année (≤12 mois)') }
  else if (input.lastPentestMonthsAgo <= 24)   { pentestBase = 2; rationale.push(`Pentest ancien (${input.lastPentestMonthsAgo} mois) — renouvellement recommandé`) }
  else                                          {                  rationale.push('Aucun pentest réalisé') }
  // Bonus qualification pentest (max +1 pt)
  if (pentestBase > 0 && input.pentestMethodology === 'owasp_ptes') {
    pentestBase = Math.min(pentestBase + 1, 7); rationale.push('Méthodologie OWASP/PTES utilisée')
  }
  if (pentestBase > 0 && input.pentestAuditorCert === 'oscp_crest') {
    pentestBase = Math.min(pentestBase + 1, 7); rationale.push('Auditeur certifié OSCP/CREST')
  }
  score += pentestBase

  // Vulnérabilités critiques résolues — max 5 pts
  if      (input.criticalVulnsResolved === 'yes') { score += 5; rationale.push('Toutes les vulnérabilités critiques résolues') }
  else if (input.criticalVulnsResolved === 'na')  { score += 3; rationale.push('Aucune vulnérabilité critique identifiée (N/A)') }
  else                                            {             rationale.push('Vulnérabilités critiques non résolues') }

  // MFA admin — max 5 pts (CIFS v3.0 V3 : pénalité S-15 si accessManagement sans MFA)
  if (input.mfaOnAdminAccess === 'yes') {
    score += 5; rationale.push('MFA actif sur tous les accès admin')
  } else {
    rationale.push('MFA absent sur les accès admin — non-conformité critique')
    // Règle V3 : accessManagement=true sans MFA = contrôle incomplet → S-15 pénalisé
    if (input.accessManagement === 'yes') {
      score -= 1; rationale.push('⚠️ Politique d\'accès documentée (S-15) mais MFA absent — contrôle incomplet, pénalité appliquée')
    }
  }

  // Chiffrement — max 4 pts
  if      (input.encryption === 'full')    { score += 4; rationale.push('Chiffrement complet (repos + transit)') }
  else if (input.encryption === 'partial') { score += 2; rationale.push('Chiffrement partiel') }
  else                                     {             rationale.push('Absence de chiffrement documenté') }

  // RGPD documenté — max 2 pts
  if (input.rgpdDocumented === 'yes') { score += 2; rationale.push('Conformité RGPD/LPD documentée') }
  else                                {             rationale.push('Documentation RGPD/LPD absente') }

  // Transferts RGPD (I-27) — blocage auto ou pénalité (CIFS v3.0)
  if (input.rgpdTransferReadiness === 'blocking') {
    return { score: 0, autoRefusal: true, refusalReason: 'Transferts de données RGPD bloquants non résolus (I-29)', rationale: [] }
  }
  if (input.rgpdTransferReadiness === 'warning') {
    score -= 1; rationale.push('Transferts RGPD en attente de conformité — points d\'attention identifiés')
  } else if (input.rgpdTransferReadiness === 'clean') {
    rationale.push('Transferts RGPD conformes (SCCs / décision d\'adéquation)')
  }

  // Certification externe — max 2 pts
  if      (input.externalCertification === 'yes')         { score += 2; rationale.push('Certification externe obtenue (ISO 27001 / SOC 2)') }
  else if (input.externalCertification === 'in_progress') { score += 1; rationale.push('Certification externe en cours') }
  else                                                     {             rationale.push('Aucune certification externe') }

  return { score: Math.max(0, Math.min(score, 25)), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// AGRÉGATION FINALE + GRADE
// ─────────────────────────────────────────────────────────────────────────────

function calculateGrade(total: number, anyRefusal: boolean, forcedGrade?: GradeLetter): { grade: GradeLetter; gradeLabel: string } {
  if (anyRefusal) return { grade: 'refused', gradeLabel: 'Non certifiable en l\'état' }
  const g = forcedGrade ?? (
    total >= 90 ? 'star' :
    total >= 75 ? 'aaa'  :
    total >= 60 ? 'aa'   :
    total >= 45 ? 'a'    :
    total >= 30 ? 'b'    : 'refused'
  )
  const LABELS: Record<GradeLetter, string> = { star: 'AEG ★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'Non certifiable en l\'état' }
  return { grade: g, gradeLabel: LABELS[g] }
}

function buildPublicRationale(results: GradeResult['dimensions']): string {
  const lines: string[] = []

  // Code
  const codePts = results.code.rationale
  if (codePts.some(r => r.includes('élevée') || r.includes('satisfaisante'))) {
    lines.push('Cet actif présente une architecture technique solide avec une couverture de tests robuste.')
  } else if (codePts.some(r => r.includes('CI/CD'))) {
    lines.push('L\'infrastructure technique dispose d\'un pipeline de déploiement automatisé.')
  } else {
    lines.push('La base technique de cet actif présente des axes d\'amélioration identifiés.')
  }

  // IP
  if (results.ip.rationale.some(r => r.includes('Aucun litige'))) {
    lines.push('La propriété intellectuelle est correctement protégée et sans litige en cours.')
  } else {
    lines.push('La situation de propriété intellectuelle fait l\'objet d\'une attention particulière.')
  }

  // Finance
  if (results.finance.rationale.some(r => r.includes('mature') || r.includes('significative'))) {
    lines.push('Les métriques financières témoignent d\'une traction commerciale établie.')
  } else if (results.finance.rationale.some(r => r.includes('construction'))) {
    lines.push('Les métriques financières montrent une traction réelle mais un historique encore en construction.')
  } else {
    lines.push('Les indicateurs financiers sont en cours de consolidation.')
  }

  // Security
  if (results.security.rationale.some(r => r.includes('Pentest récent') || r.includes('complet'))) {
    lines.push('Le dispositif de sécurité répond aux standards attendus avec des contrôles récents.')
  } else {
    lines.push('Le dispositif de sécurité présente des points d\'attention à adresser.')
  }

  return lines.join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export function runGradeEngine(input: GradeInput): GradeResult {
  // ── Règle de dérivation ArrAuditLevel → ProofQuality.finance (Sprint 1A) ─────
  // L'ARR est la donnée centrale de F. Si elle est déclarative, toute la dimension F est déclarative.
  let effectivePQ = input.proofQualities
    ? { ...input.proofQualities }
    : undefined
  let arrForceNote: string | undefined
  if (effectivePQ && input.finance.arrAudited === 'declarative' && effectivePQ.finance !== 'declarative') {
    effectivePQ = { ...effectivePQ, finance: 'declarative' }
    arrForceNote = 'Proof quality F forcée à Declarative car ARR auto-déclaré (règle de dérivation Sprint 1A)'
  }

  const code     = scoreCode(input.code)
  const ip       = scoreIP(input.ip)
  const finance  = scoreFinance(input.finance)
  const security = scoreSecurity(input.security)

  // ── Règles de cohérence entre sous-codes contradictoires (Sprint 3C) ────────
  const consistencyWarnings: string[] = []
  // Règle 1 : testCoverage ≥80 + techDebtDocumented = 'no' (dette non documentée + coverage haute = suspect)
  if (input.code.testCoverage >= 80 && input.code.techDebtDocumented === 'no') {
    consistencyWarnings.push('Coverage ≥80% + dette technique non documentée : vérifier que les tests couvrent le code critique, pas uniquement le code trivial')
  }
  // Règle 2 : MFA absent + criticalVulnsResolved = 'na' (prétend qu'il n'y a pas de vuln + pas de MFA = incohérence)
  if (input.security.mfaOnAdminAccess === 'no' && input.security.criticalVulnsResolved === 'na') {
    consistencyWarnings.push('MFA absent + aucune vuln critique identifiée (N/A) : incohérence — un pentest est recommandé pour valider l\'absence de vuln')
  }
  // Règle 3 : criticalVulnsResolved = 'no' && externalCertification = 'yes' (certifié avec vulns ouvertes = impossible)
  if (input.security.criticalVulnsResolved === 'no' && input.security.externalCertification === 'yes') {
    consistencyWarnings.push('Vulnérabilités critiques non résolues + certification externe obtenue : incohérence — vérifier les dates de certification et de scan')
  }

  const anyRefusal = code.autoRefusal || ip.autoRefusal || finance.autoRefusal || security.autoRefusal
  const refusalReasons = [code, ip, finance, security]
    .filter(d => d.autoRefusal && d.refusalReason)
    .map(d => d.refusalReason!)

  const totalScore = anyRefusal
    ? 0
    : code.score + ip.score + finance.score + security.score

  const { grade: rawGrade } = calculateGrade(totalScore, anyRefusal)

  // ── Plafond proof_quality avec effectivePQ (CIFS v3.0 + Sprint 1A) ─────────
  let grade = rawGrade
  let gradeCeiling: GradeLetter | undefined
  if (!anyRefusal && effectivePQ) {
    const cappedGrade = capAegByProofQuality(rawGrade as AEGGrade, effectivePQ) as GradeLetter
    if (cappedGrade !== rawGrade) {
      gradeCeiling = cappedGrade
      grade = cappedGrade
    }
  }
  const { gradeLabel } = calculateGrade(totalScore, anyRefusal, grade)

  const dimensions = { code, ip, finance, security }

  // ── TRS — Transaction Readiness Score (Sprint 1D) ─────────────────────
  const { trs, trsReasons } = computeTRS(input, grade, effectivePQ)

  // ── Recommendations (Sprint 2A) ───────────────────────────────────
  const recommendations = buildRecommendations(input, dimensions)

  // Injecter les warnings de cohérence dans le rationale Code/Sécu
  if (consistencyWarnings.length > 0) {
    consistencyWarnings.forEach(w => {
      if (w.includes('Coverage') || w.includes('dette')) dimensions.code.rationale.push(`⚠️ ${w}`)
      else dimensions.security.rationale.push(`⚠️ ${w}`)
    })
  }
  if (arrForceNote) dimensions.finance.rationale.push(`⚠️ ${arrForceNote}`)

  return {
    dimensions,
    totalScore,
    grade,
    gradeLabel,
    gradeCeiling,
    trs,
    trsReasons,
    recommendations,
    autoRefusal: anyRefusal,
    refusalReasons,
    publicRationale: anyRefusal ? '' : buildPublicRationale(dimensions),
    effectiveProofQualities: effectivePQ,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRS — TRANSACTION READINESS SCORE (Sprint 1D)
// ─────────────────────────────────────────────────────────────────────────────

function computeTRS(
  input: GradeInput,
  grade: GradeLetter,
  effectivePQ?: { code: ProofQuality; ip: ProofQuality; finance: ProofQuality; security: ProofQuality },
): { trs: TRSLevel; trsReasons: string[] } {
  const reasons: string[] = []

  // — Bloquants durs
  if (input.security.rgpdTransferReadiness === 'blocking') {
    reasons.push('Transferts RGPD bloquants non résolus (I-29)')
  }
  if (input.security.activeSecurityIncident === 'yes') {
    reasons.push('Incident de sécurité actif en cours')
  }
  if (input.ip.activeIPLitigation === 'yes') {
    reasons.push('Litige IP actif (I-18)')
  }
  if (input.ip.employeeIPRights === 'absent') {
    reasons.push('Droits IP employés/prestataires absents (I-21)')
  }
  if (input.code.criticalVulnOpen > 0 && input.code.lastCodeAuditMonthsAgo >= 9999) {
    reasons.push('Vulnérabilités critiques ouvertes sans audit externe (C-34/C-40)')
  }
  // Runway < 3 mois
  if (input.finance.cashOnHand !== undefined && input.finance.monthlyBurn !== undefined) {
    const effectiveBurn = (input.finance.monthlyBurn ?? 0) - (input.finance.monthlyNewMrr ?? 0)
    if (effectiveBurn > 0 && input.finance.cashOnHand / effectiveBurn < 3) {
      reasons.push('Runway effectif < 3 mois — ferme la fenêtre AAA/★')
    }
  }

  if (reasons.length > 0) return { trs: 'blocked', trsReasons: reasons }

  // — Conditionnel
  const founderScore = input.finance.founderDependency
    ? Object.values(input.finance.founderDependency).filter(v => v === 'yes').length
    : 0
  if (founderScore >= 5) {
    reasons.push('Dépendance fondateur maximale (5/5 critères) — plan de succession requis avant closing')
  }
  if (effectivePQ && (['code', 'ip', 'finance', 'security'] as const).every(d => effectivePQ![d] === 'declarative')) {
    reasons.push('Toutes les dimensions en proof quality Déclaratif — due diligence étendue recommandée')
  }
  if (input.finance.topCustomerPct !== undefined && input.finance.topCustomerPct > 50) {
    reasons.push(`Client principal représente ${input.finance.topCustomerPct}% du CA — clause earn-out recommandée`)
  }
  if (grade === 'b') {
    reasons.push('Grade B — conditions de transition à négocier')
  }

  if (reasons.length > 0) return { trs: 'conditional', trsReasons: reasons }

  // — Ready conditionnel avec actions pré-closing
  const hasRemediation =
    input.security.rgpdTransferReadiness === 'warning' ||
    input.security.lastPentestMonthsAgo > 12 ||
    founderScore >= 3
  if (hasRemediation) {
    return { trs: 'remediation', trsReasons: ['Points d\'attention identifiés — actions de remédiation recommandées avant closing'] }
  }

  return { trs: 'ready', trsReasons: [] }
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATIONS (Sprint 2A)
// ─────────────────────────────────────────────────────────────────────────────

function buildRecommendations(
  input: GradeInput,
  dims: { code: DimensionResult; ip: DimensionResult; finance: DimensionResult; security: DimensionResult },
): GradeRecommendation[] {
  const recs: GradeRecommendation[] = []

  // S-16 : Pentest absent ou non qualifié
  if (input.security.lastPentestMonthsAgo > 12) {
    recs.push({
      dimension: 'S', subcode: 'S-16', priority: input.security.lastPentestMonthsAgo >= 9999 ? 'blocking' : 'high',
      action: 'Commander un pentest gray box auprès d\'un auditeur certifié OSCP ou CREST, en méthodologie OWASP/PTES.',
      effort: 'weeks',
      impact: '+4 à +6 pts sur dimension S selon ancienneté du dernier pentest',
    })
  } else if (input.security.pentestMethodology !== 'owasp_ptes' || input.security.pentestAuditorCert !== 'oscp_crest') {
    recs.push({
      dimension: 'S', subcode: 'S-16', priority: 'medium',
      action: 'Faire certifier l\'auditeur pentest (OSCP/CREST) et adopter une méthodologie OWASP/PTES pour le prochain pentest.',
      effort: 'months',
      impact: '+1 à +2 pts sur dimension S (bonus qualification)',
    })
  }

  // I-27 : Transferts RGPD warning
  if (input.security.rgpdTransferReadiness === 'warning') {
    recs.push({
      dimension: 'I', subcode: 'I-27', priority: 'high',
      action: 'Mettre en place des Clauses Contractuelles Types (SCCs) ou vérifier la décision d\'adéquation applicable. Rédaction juridique : 1-2 jours.',
      effort: 'days',
      impact: 'Élimine le warning I-28, réduit le risque bloquant pré-closing',
    })
  }

  // C-14 : Coverage test insuffisante
  if (input.code.testCoverage < 40) {
    recs.push({
      dimension: 'C', subcode: 'C-14', priority: dims.code.score < 10 ? 'high' : 'medium',
      action: 'Mettre en place un plan de tests unitaires et d\'intégration visant 70% de coverage sur les modules critiques.',
      effort: 'months',
      impact: '+3 à +7 pts sur dimension C selon le niveau atteint',
    })
  }

  // F-11 : ARR déclaratif
  if (input.finance.arrAudited === 'declarative') {
    recs.push({
      dimension: 'F', subcode: 'F-11', priority: 'medium',
      action: 'Obtenir un export certifié Stripe/Chargebee ou faire co-signer les revenus par un expert-comptable pour passer au niveau Verifiable ou Audité.',
      effort: 'days',
      impact: '+1 pt (Verifiable) ou +2 pts (Audité) sur dimension F — déverrouille proof quality F',
    })
  }

  // F-42 : Dépendance fondateur ≥3 critères
  if (input.finance.founderDependency) {
    const riskCount = Object.values(input.finance.founderDependency).filter(v => v === 'yes').length
    if (riskCount >= 3) {
      recs.push({
        dimension: 'F', subcode: 'F-42', priority: riskCount >= 5 ? 'blocking' : 'high',
        action: 'Documenter les runbooks opérationnels, déléguer la signature de contrats à un N-1, et rédiger un plan de succession.',
        effort: 'months',
        impact: `Réduction pénalité fondateur de -${riskCount >= 5 ? 3 : 2} à 0 pts sur F, améliore le TRS`,
      })
    }
  }

  return recs
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS INTERNES
// ─────────────────────────────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k€`
  return `${n}€`
}
