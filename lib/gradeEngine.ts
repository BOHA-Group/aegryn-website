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

/** Niveau de preuve pour l'ARR — remplace le booléen arrAudited (CIFSO v4.0) */
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
  /* ── CIFSO v4.1 — Conformité réglementaire produit ── */
  /** C-50 — CRA : SBOM, processus de gestion des vulnérabilités, sécurité by design (si sellsDigitalProducts) */
  craCompliance?: RegComplianceStatus
  /** C-51 — Data Act technique : interfaces d'accès direct/gratuit/défaut aux données produit, formats d'export documentés (si sellsConnectedProducts) */
  dataActTechnical?: RegComplianceStatus
}

export interface IPInput {
  trademarksJurisdictions: number    // nb de juridictions
  activeIPLitigation: YesNo
  employeeIPRights: Coverage
  openSourceRisk: YesNo              // dépendances GPL critiques
  thirdPartyAPIContracted: YesNo     // API tierce critique contractualisée
  moat: MoatType
  rgpdCompliance: Coverage
  /* ── CIFSO v4.1 — Conformité réglementaire contractuelle & juridique ── */
  /** I-50 — Data Act contractuel : conditions de partage B2B FRAND, protection secrets d'affaires, clauses non déloyales (si sellsConnectedProducts) */
  dataActB2BTerms?: RegComplianceStatus
  /** I-51 — ePrivacy/cookies : consentement conforme, registre des trackers (si processesEUData) */
  eprivacyCompliance?: RegComplianceStatus
  /** I-52 — DSA/P2B : transparence, conditions équitables pour les business users (si operatesPlatform) */
  platformFairTerms?: RegComplianceStatus
  /** I-53 — Sanctions & embargos : déclaration d'absence d'exposition (universel) */
  sanctionsDeclaration?: 'declared_clean' | 'exposed' | 'not_declared'
  /** I-54 — AML : politique anti-blanchiment documentée (si isFinancialEntityOrICT) */
  amlPolicy?: RegComplianceStatus
}

/** Score de dépendance fondateur — 5 critères objectifs (CIFSO v4.0 F-42) */
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
  arrAudited: ArrAuditLevel          // niveau de preuve ARR (CIFSO v4.0)
  nrr: number | null                 // % ou null si <12 mois
  monthlyChurn: number               // %
  grossMargin: number                // %
  yoyGrowth: number                  // %
  topClientConcentration: number     // % du top 1 client (ancien champ — déprécié)
  runwayMonths: number               // mois (valeur manuelle — déprécié)
  founderDependency?: FounderDependencyInput  // optionnel — CIFSO v4.0
  // ── Nouveaux champs Sprint 1 ──
  topCustomerPct?: number            // % CA du 1er client (0-100)
  top3CustomerPct?: number           // % CA des 3 premiers clients (0-100)
  cashOnHand?: number                // trésorerie en €
  monthlyBurn?: number               // burn rate mensuel brut en €
  monthlyNewMrr?: number             // nouvelle MRR mensuelle en €
}

export type PentestMethodology = 'owasp_ptes' | 'custom' | 'unknown'
export type PentestAuditorCert = 'oscp_crest' | 'other_cert' | 'none'

/* ─────────────────────────────────────────────────────────────────────────────
 * CIFSO v4.1 — CONFORMITÉ RÉGLEMENTAIRE (matrice d'applicabilité)
 *
 * Principe : une régulation n'est évaluée que si elle est applicable à l'actif.
 * `na` = non applicable ou non évalué → aucun effet sur le score.
 * `non_compliant` sur une régulation applicable → pénalité dans la dimension
 * + plafond de grade AA + impact TRS. AUCUN refus automatique : le rapport
 * CIFSO reste toujours produisible ; les manquements se traduisent en
 * pénalités de score et en impact sur le grade.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Statut de conformité d'une régulation applicable à l'actif */
export type RegComplianceStatus = 'na' | 'compliant' | 'partial' | 'non_compliant'

/** Profil d'applicabilité réglementaire — déclaré vendeur, validé analyste */
export interface RegulatoryProfile {
  /** Fabrique/vend des produits connectés ou détient des données générées par les opérations clients (EU Data Act 2023/2854) */
  sellsConnectedProducts:  YesNo
  /** Traite des données personnelles UE/CH (RGPD/nLPD + ePrivacy) */
  processesEUData:         YesNo
  /** Entité financière ou prestataire TIC du secteur financier (DORA, AML) */
  isFinancialEntityOrICT:  YesNo
  /** Développe ou fournit des systèmes d'IA (EU AI Act 2024/1689) */
  providesAISystems:       YesNo
  /** Secteur essentiel ou important au sens NIS2 (santé, énergie, transport, admin, finance, numérique) */
  operatesCriticalSector:  YesNo
  /** Produit avec éléments numériques mis sur le marché UE (Cyber Resilience Act 2024/2847) */
  sellsDigitalProducts:    YesNo
  /** Plateforme en ligne (DSA / P2B — transparence, conditions équitables) */
  operatesPlatform:        YesNo
}

/** Vrai si au moins une régulation est applicable — active la gouvernance conformité (O) */
export function hasRegulatoryScope(profile?: RegulatoryProfile): boolean {
  if (!profile) return false
  return Object.values(profile).some(v => v === 'yes')
}

export interface SecurityInput {
  lastPentestMonthsAgo: number       // 9999 = jamais
  criticalVulnsResolved: YesNoNA
  mfaOnAdminAccess: YesNo
  encryption: Encryption
  rgpdDocumented: YesNo
  activeSecurityIncident: YesNo
  externalCertification: Certification
  pentestMethodology?: PentestMethodology  // CIFSO v4.0
  pentestAuditorCert?: PentestAuditorCert  // CIFSO v4.0
  rgpdTransferReadiness?: 'clean' | 'warning' | 'blocking'  // CIFSO v4.0 I-27
  /** S-15 — Politique de gestion des accès documentée (RBAC/IAM) */
  accessManagement?: YesNo            // CIFSO v4.0 V3 — règle MFA/S-15
  /* ── Exposition IA (S-41 à S-46) : maîtrise des actifs, des données et de la protection des clients ── */
  /** Niveau d'usage de solutions IA tierces non souveraines (hébergées hors UE/CH, sans engagement contractuel de non-entraînement) */
  aiExposure?: AiExposure
  /** Inventaire des services IA et des flux de données associés (S-41) */
  aiInventory?: YesNo
  /** Politique d'usage IA formalisée : données autorisées, interdiction des données clients/sensibles sans cadre (S-42) */
  aiPolicy?: YesNo
  /** Données clients transmises à des modèles tiers sans contrat de traitement / clause de non-entraînement (S-45) */
  aiClientDataExposed?: YesNo
  /* ── CIFSO v4.1 — Conformité réglementaire sectorielle ── */
  /** S-52 — NIS2 : enregistrement, mesures de gestion des risques, notification incidents 24h/72h (si operatesCriticalSector) */
  nis2Compliance?: RegComplianceStatus
  /** S-53 — DORA : registre TIC, tests de résilience, clauses prestataires TIC (si isFinancialEntityOrICT) */
  doraCompliance?: RegComplianceStatus
  /** S-54 — AI Act : classification de risque documentée, obligations GPAI, transparence (si providesAISystems) */
  aiActCompliance?: RegComplianceStatus
  /** S-54b — Le système IA fourni est classé haut risque (AI Act annexe III) */
  aiActHighRisk?: YesNo
}

/** Exposition IA : none = pas d'IA tierce ; sovereign = fournisseurs UE/CH ou auto-hébergés ; mixed = usage encadré de fournisseurs non souverains ; massive_non_sovereign = dépendance forte à des fournisseurs non souverains */
export type AiExposure = 'none' | 'sovereign' | 'mixed' | 'massive_non_sovereign'

/** CIFSO v4.0 — Dimension O : Organisation & Talent (20 pts) */
export interface OrganisationInput {
  keyPersonCount:           number   // nb de N-1 autonomes
  successionPlanDocumented: YesNo
  operationalDocsComplete:  YesNo
  lowKeyTalentTurnover:     YesNo
  formalizedManagement:     YesNo
  founderLeadsSales:        YesNo
  cultureDocumented:        YesNo
  independentAdvisor:       YesNo
  /* ── CIFSO v4.1 — O-50 : gouvernance conformité (si au moins une régulation applicable) ── */
  /** Responsable conformité désigné (DPO, référent NIS2/DORA, ou équivalent) et accountability documentée au niveau direction */
  complianceGovernance?:    RegComplianceStatus
}

export interface GradeInput {
  code:         CodeInput
  ip:           IPInput
  finance:      FinanceInput
  security:     SecurityInput
  organisation: OrganisationInput
  /** CIFSO v4.1 — Matrice d'applicabilité réglementaire (déclarée vendeur, validée analyste) */
  regulatoryProfile?: RegulatoryProfile
  proofQualities?: {
    code:         ProofQuality
    ip:           ProofQuality
    finance:      ProofQuality
    security:     ProofQuality
    organisation?: ProofQuality
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
  scoreO:      number
  trs:         TRSLevel
  autoRefusal: boolean
}

/** Niveau POST-NDA — exposé à l'acheteur qualifié après double NDA */
export interface GradeResultPostNda extends GradeResultPublic {
  gradeCeiling?:          GradeLetter
  proofQualities?:        { code: ProofQuality; ip: ProofQuality; finance: ProofQuality; security: ProofQuality; organisation?: ProofQuality }
  founderDependencyScore: number  // 0-5 critères à risque
  trsReasons:             string[]
  recommendations:        GradeRecommendation[]
  rationaleByDimension:   { code: string[]; ip: string[]; finance: string[]; security: string[]; organisation: string[] }
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
    scoreO:      r.dimensions.organisation.score,
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
      code:         r.dimensions.code.rationale,
      ip:           r.dimensions.ip.rationale,
      finance:      r.dimensions.finance.rationale,
      security:     r.dimensions.security.rationale,
      organisation: r.dimensions.organisation.rationale,
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
  dimension: 'C' | 'I' | 'F' | 'S' | 'O'
  subcode:   string
  priority:  'blocking' | 'high' | 'medium'
  action:    string
  effort:    'days' | 'weeks' | 'months'
  impact:    string
}

export interface GradeResult {
  dimensions: {
    code:         DimensionResult
    ip:           DimensionResult
    finance:      DimensionResult
    security:     DimensionResult
    organisation: DimensionResult
  }
  totalScore:      number        // 0-100
  grade:           GradeLetter
  gradeLabel:      string        // AEG ★ | AAA | AA | A | B | Non certifiable
  gradeCeiling?:   GradeLetter   // plafond appliqué par proof_quality (CIFSO v4.0)
  /** Transaction Readiness Score — readiness opérationnelle à transiger */
  trs:             TRSLevel
  trsReasons:      string[]       // justifications du TRS
  recommendations: GradeRecommendation[]  // actions actionnables par sous-code
  autoRefusal:     boolean
  refusalReasons:  string[]
  publicRationale: string        // résumé qualitatif exposable côté actif catalogué
  /** Métadonnées proof_quality dérivées effectivement appliquées (après règle ARR) */
  effectiveProofQualities?: {
    code:          ProofQuality
    ip:            ProofQuality
    finance:       ProofQuality
    organisation?: ProofQuality
    security: ProofQuality
  }
  /** CIFSO v4.1 — Constats réglementaires applicables (vides si aucun périmètre applicable) */
  regulatoryFindings:  string[]
  /** CIFSO v4.1 — Vrai si une régulation applicable est non conforme → plafond AA appliqué */
  regulatoryCapped:    boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION C — CODE (20 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreCode(input: CodeInput, profile?: RegulatoryProfile): DimensionResult {
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

  // Couverture tests — max 6 pts
  if      (input.testCoverage >= 80) { score += 6; rationale.push('Couverture de tests élevée (≥80%)') }
  else if (input.testCoverage >= 70) { score += 4; rationale.push('Couverture de tests satisfaisante (≥70%)') }
  else if (input.testCoverage >= 40) { score += 2; rationale.push('Couverture de tests partielle (40-70%)') }
  else                               {             rationale.push('Couverture de tests insuffisante (<40%)') }

  // Vulnérabilités — max 4 pts
  if      (input.criticalVulnOpen === 0 && input.majorVulnOpen === 0) { score += 4; rationale.push('Aucune vulnérabilité critique ou majeure ouverte') }
  else if (input.criticalVulnOpen === 0 && input.majorVulnOpen <= 3)  { score += 2; rationale.push('Pas de vulnérabilités critiques, quelques vulnérabilités majeures en cours') }
  else if (input.criticalVulnOpen <= 2)                                { score += 1; rationale.push(`${input.criticalVulnOpen} vulnérabilité(s) critique(s) ouverte(s)`) }
  else                                                                 {             rationale.push(`${input.criticalVulnOpen} vulnérabilités critiques ouvertes — situation préoccupante`) }

  // Architecture — max 3 pts
  if      (input.architecture === 'decoupled')  { score += 3; rationale.push('Architecture découplée et scalable') }
  else if (input.architecture === 'partial')    { score += 2; rationale.push('Architecture partiellement découplée') }
  else                                          {             rationale.push('Architecture monolithique non scalable') }

  // CI/CD — max 3 pts
  if (input.ciCdFunctional === 'yes') { score += 3; rationale.push('Pipeline CI/CD fonctionnel') }
  else                                {             rationale.push('Absence de CI/CD automatisé') }

  // Documentation API — max 2 pts
  if      (input.apiDocumentation === 'complete') { score += 2; rationale.push('Documentation technique complète') }
  else if (input.apiDocumentation === 'partial')  { score += 1; rationale.push('Documentation technique partielle') }
  else                                            {             rationale.push('Documentation technique absente') }

  // Dette technique documentée — max 1 pt
  if (input.techDebtDocumented === 'yes') { score += 1; rationale.push('Dette technique documentée et maîtrisée') }
  else                                    {             rationale.push('Dette technique non documentée') }

  // Dépendances obsolètes — max 1 pt
  if      (input.obsoleteDependencies === 0)   { score += 1; rationale.push('Aucune dépendance obsolète (>24 mois)') }
  else if (input.obsoleteDependencies <= 3)    {             rationale.push(`${input.obsoleteDependencies} dépendance(s) obsolète(s)`) }
  else                                         {             rationale.push(`${input.obsoleteDependencies} dépendances obsolètes — remédiation nécessaire`) }

  // Audit code externe — bonus/malus
  if      (input.lastCodeAuditMonthsAgo <= 12)  { score = Math.min(20, score + 1); rationale.push('Audit de code externe récent (≤12 mois)') }
  else if (input.lastCodeAuditMonthsAgo >= 9999) {                                  rationale.push('Aucun audit de code externe réalisé') }

  /* ── CIFSO v4.1 — C-50 : Cyber Resilience Act (si produit avec éléments numériques) ── */
  if (profile?.sellsDigitalProducts === 'yes' && input.craCompliance && input.craCompliance !== 'na') {
    if      (input.craCompliance === 'compliant')     { score += 1; rationale.push('CRA : SBOM à jour et processus de gestion des vulnérabilités conformes (C-50)') }
    else if (input.craCompliance === 'partial')       { score -= 1; rationale.push('CRA : conformité partielle — SBOM ou processus de vulnérabilités incomplet (C-50)') }
    else                                              { score -= 2; rationale.push('CRA : non conforme — produit numérique sans SBOM ni processus de gestion des vulnérabilités (C-50)') }
  }

  /* ── CIFSO v4.1 — C-51 : Data Act technique (si produit connecté) ── */
  if (profile?.sellsConnectedProducts === 'yes' && input.dataActTechnical && input.dataActTechnical !== 'na') {
    if      (input.dataActTechnical === 'compliant')     { score += 1; rationale.push('Data Act : accès direct, gratuit et par défaut aux données produit implémenté (C-51)') }
    else if (input.dataActTechnical === 'partial')       { score -= 1; rationale.push('Data Act : accès aux données produit partiel — pas direct, gratuit et par défaut (C-51)') }
    else                                                 { score -= 2; rationale.push('Data Act : aucun accès by design aux données générées par le produit (C-51)') }
  }

  return { score: Math.min(score, 20), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION I — IP & DROITS (20 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreIP(input: IPInput, profile?: RegulatoryProfile): DimensionResult {
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

  // Marques déposées — max 4 pts
  if      (input.trademarksJurisdictions >= 3) { score += 4; rationale.push(`Marques déposées dans ${input.trademarksJurisdictions} juridictions`) }
  else if (input.trademarksJurisdictions === 2) { score += 3; rationale.push('Marques déposées dans 2 juridictions') }
  else if (input.trademarksJurisdictions === 1) { score += 2; rationale.push('Marque déposée dans 1 juridiction') }
  else                                          {             rationale.push('Aucune marque déposée') }

  // Litige IP — max 4 pts (pénalité)
  if      (input.activeIPLitigation === 'no')  { score += 4; rationale.push('Aucun litige IP en cours') }
  else                                          { score -= 3; rationale.push('Litige IP actif — risque significatif') }

  // Droits cession — max 6 pts
  if      (input.employeeIPRights === 'complete') { score += 6; rationale.push('Droits de cession employés et prestataires complets') }
  else if (input.employeeIPRights === 'partial')  { score += 3; rationale.push('Droits de cession partiellement couverts') }
  else                                            {             rationale.push('Droits de cession absents — risque de revendication') }

  // Risque open source GPL — max 2 pts
  if (input.openSourceRisk === 'no') { score += 2; rationale.push('Aucune dépendance open source à risque (GPL)') }
  else                               {             rationale.push('Dépendances GPL critiques identifiées') }

  // API tierce contractualisée — max 2 pts
  if      (input.thirdPartyAPIContracted === 'yes') { score += 2; rationale.push('API tierce critique contractualisée') }
  else                                              {             rationale.push('API tierce critique sans contrat formalisé') }

  // Moat — max 1 pt
  if      (input.moat === 'network' || input.moat === 'data') { score += 1; rationale.push(`Moat identifiable : ${input.moat === 'network' ? 'effet réseau' : 'data propriétaire'}`) }
  else if (input.moat === 'regulatory')                        { score += 1; rationale.push('Moat réglementaire identifié') }
  else                                                         {             rationale.push('Aucun moat défensif identifié') }

  // Conformité RGPD/LPD — max 1 pt
  if      (input.rgpdCompliance === 'complete') { score += 1; rationale.push('Conformité RGPD/LPD complète') }
  else if (input.rgpdCompliance === 'partial')  {             rationale.push('Conformité RGPD/LPD partielle') }
  else                                          {             rationale.push('Non-conformité RGPD/LPD documentée') }

  /* ── CIFSO v4.1 — I-50 : Data Act contractuel (si produit connecté) ── */
  if (profile?.sellsConnectedProducts === 'yes' && input.dataActB2BTerms && input.dataActB2BTerms !== 'na') {
    if      (input.dataActB2BTerms === 'compliant')     { score += 1; rationale.push('Data Act : conditions de partage B2B FRAND documentées (I-50)') }
    else if (input.dataActB2BTerms === 'partial')       { score -= 1; rationale.push('Data Act : conditions B2B partiellement conformes — FRAND ou protection secrets d\'affaires incomplets (I-50)') }
    else                                                { score -= 2; rationale.push('Data Act : conditions de partage B2B non conformes — pas de termes FRAND (I-50)') }
  }

  /* ── CIFSO v4.1 — I-51 : ePrivacy / cookies (si données UE) ── */
  if (profile?.processesEUData === 'yes' && input.eprivacyCompliance && input.eprivacyCompliance !== 'na') {
    if      (input.eprivacyCompliance === 'compliant')     { score += 1; rationale.push('ePrivacy : consentement et registre des trackers conformes (I-51)') }
    else if (input.eprivacyCompliance === 'partial')       {             rationale.push('ePrivacy : conformité partielle (I-51)') }
    else                                                   { score -= 1; rationale.push('ePrivacy : consentement cookies non conforme (I-51)') }
  }

  /* ── CIFSO v4.1 — I-52 : DSA/P2B (si plateforme) ── */
  if (profile?.operatesPlatform === 'yes' && input.platformFairTerms && input.platformFairTerms !== 'na') {
    if      (input.platformFairTerms === 'compliant')     { score += 1; rationale.push('DSA/P2B : conditions équitables et transparence documentées (I-52)') }
    else if (input.platformFairTerms === 'partial')       {             rationale.push('DSA/P2B : conformité partielle (I-52)') }
    else                                                  { score -= 1; rationale.push('DSA/P2B : conditions business users non conformes (I-52)') }
  }

  /* ── CIFSO v4.1 — I-53 : Sanctions & embargos (universel) ── */
  if (input.sanctionsDeclaration === 'declared_clean') {
    rationale.push('Absence d\'exposition sanctions/embargos déclarée (I-53)')
  } else if (input.sanctionsDeclaration === 'exposed') {
    score -= 3; rationale.push('Exposition sanctions/embargos identifiée — risque juridique majeur (I-53)')
  } else if (input.sanctionsDeclaration === 'not_declared') {
    score -= 1; rationale.push('Aucune déclaration sanctions/embargos fournie (I-53)')
  }

  /* ── CIFSO v4.1 — I-54 : AML (si entité financière/TIC) ── */
  if (profile?.isFinancialEntityOrICT === 'yes' && input.amlPolicy && input.amlPolicy !== 'na') {
    if      (input.amlPolicy === 'compliant')     { score += 1; rationale.push('AML : politique anti-blanchiment documentée (I-54)') }
    else if (input.amlPolicy === 'partial')       {             rationale.push('AML : politique partielle (I-54)') }
    else                                          { score -= 2; rationale.push('AML : aucune politique anti-blanchiment (I-54)') }
  }

  return { score: Math.max(0, Math.min(score, 20)), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION F — FINANCE (20 pts)
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

  // ARR — max 5 pts
  if      (input.arr >= 5_000_000) { score += 5; rationale.push(`ARR de ${fmtK(input.arr)} — position mature`) }
  else if (input.arr >= 1_000_000) { score += 4; rationale.push(`ARR de ${fmtK(input.arr)} — traction significative`) }
  else if (input.arr >= 500_000)   { score += 3; rationale.push(`ARR de ${fmtK(input.arr)} — revenus établis`) }
  else if (input.arr >= 100_000)   { score += 1; rationale.push(`ARR de ${fmtK(input.arr)} — revenus en construction`) }
  else                             {             rationale.push('ARR insuffisant pour une évaluation fiable') }

  // Ancienneté des revenus — max 2 pts
  if      (input.revenueAgeMonths >= 24) { score += 2; rationale.push(`Revenus établis depuis ${input.revenueAgeMonths} mois`) }
  else if (input.revenueAgeMonths >= 12) { score += 1; rationale.push(`Historique de revenus de ${input.revenueAgeMonths} mois`) }
  else if (input.revenueAgeMonths >=  6) { score += 1; rationale.push(`Revenus récents (${input.revenueAgeMonths} mois)`) }
  else                                   {             rationale.push('Historique de revenus insuffisant (<6 mois)') }

  // ARR — niveau de preuve (CIFSO v4.0) — max 2 pts
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

  // Churn mensuel — max 3 pts (pénalité croissante)
  if      (input.monthlyChurn < 1)  { score += 3; rationale.push('Churn mensuel excellent (<1%)') }
  else if (input.monthlyChurn < 3)  { score += 2; rationale.push(`Churn mensuel maîtrisé (${input.monthlyChurn}%)`) }
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

  // Score dépendance fondateur — pénalité max -3 pts (CIFSO v4.0 F-42)
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

  // Marge brute — max 2 pts
  if      (input.grossMargin >= 70) { score += 2; rationale.push(`Marge brute élevée (${input.grossMargin}%)`) }
  else if (input.grossMargin >= 50) { score += 1; rationale.push(`Marge brute satisfaisante (${input.grossMargin}%)`) }
  else if (input.grossMargin >= 30) {             rationale.push(`Marge brute en développement (${input.grossMargin}%)`) }
  else                              {             rationale.push(`Marge brute insuffisante (${input.grossMargin}%)`) }

  // Croissance YoY — max 1 pt
  if      (input.yoyGrowth >= 50)  { score += 1; rationale.push(`Forte croissance YoY (+${input.yoyGrowth}%)`) }
  else if (input.yoyGrowth >= 20)  { score += 1; rationale.push(`Croissance YoY modérée (+${input.yoyGrowth}%)`) }
  else if (input.yoyGrowth >= 0)   {             rationale.push(`Croissance YoY faible (+${input.yoyGrowth}%)`) }
  else                             {             rationale.push(`Décroissance YoY (${input.yoyGrowth}%)`) }

  // Concentration client top 1 — max 2 pts (risque)
  if      (input.topClientConcentration <= 10) { score += 2; rationale.push('Base clients diversifiée (top 1 ≤10%)') }
  else if (input.topClientConcentration <= 25) { score += 1; rationale.push(`Concentration client modérée (top 1 = ${input.topClientConcentration}%)`) }
  else                                         {             rationale.push(`Forte concentration client (top 1 = ${input.topClientConcentration}%) — risque de départ`) }

  return { score: Math.max(0, Math.min(score, 20)), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION S — SÉCURITÉ (20 pts)
// ─────────────────────────────────────────────────────────────────────────────

function scoreSecurity(input: SecurityInput, profile?: RegulatoryProfile): DimensionResult {
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

  // Pentest — max 6 pts de base + bonus qualification (CIFSO v4.0)
  let pentestBase = 0
  if      (input.lastPentestMonthsAgo <= 6)   { pentestBase = 6; rationale.push('Pentest récent (≤6 mois)') }
  else if (input.lastPentestMonthsAgo <= 12)   { pentestBase = 4; rationale.push('Pentest dans l\'année (≤12 mois)') }
  else if (input.lastPentestMonthsAgo <= 24)   { pentestBase = 2; rationale.push(`Pentest ancien (${input.lastPentestMonthsAgo} mois) — renouvellement recommandé`) }
  else                                          {                  rationale.push('Aucun pentest réalisé') }
  // Bonus qualification pentest (max +1 pt)
  if (pentestBase > 0 && input.pentestMethodology === 'owasp_ptes') {
    pentestBase = Math.min(pentestBase + 1, 6); rationale.push('Méthodologie OWASP/PTES utilisée')
  }
  if (pentestBase > 0 && input.pentestAuditorCert === 'oscp_crest') {
    pentestBase = Math.min(pentestBase + 1, 6); rationale.push('Auditeur certifié OSCP/CREST')
  }
  score += pentestBase

  // Vulnérabilités critiques résolues — max 4 pts
  if      (input.criticalVulnsResolved === 'yes') { score += 4; rationale.push('Toutes les vulnérabilités critiques résolues') }
  else if (input.criticalVulnsResolved === 'na')  { score += 2; rationale.push('Aucune vulnérabilité critique identifiée (N/A)') }
  else                                            {             rationale.push('Vulnérabilités critiques non résolues') }

  // MFA admin — max 4 pts (CIFSO v4.0 V3 : pénalité S-15 si accessManagement sans MFA)
  if (input.mfaOnAdminAccess === 'yes') {
    score += 4; rationale.push('MFA actif sur tous les accès admin')
  } else {
    rationale.push('MFA absent sur les accès admin — non-conformité critique')
    // Règle V3 : accessManagement=true sans MFA = contrôle incomplet → S-15 pénalisé
    if (input.accessManagement === 'yes') {
      score -= 1; rationale.push('⚠️ Politique d\'accès documentée (S-15) mais MFA absent — contrôle incomplet, pénalité appliquée')
    }
  }

  // Chiffrement — max 3 pts
  if      (input.encryption === 'full')    { score += 3; rationale.push('Chiffrement complet (repos + transit)') }
  else if (input.encryption === 'partial') { score += 1; rationale.push('Chiffrement partiel') }
  else                                     {             rationale.push('Absence de chiffrement documenté') }

  // RGPD documenté — max 2 pts
  if (input.rgpdDocumented === 'yes') { score += 2; rationale.push('Conformité RGPD/LPD documentée') }
  else                                {             rationale.push('Documentation RGPD/LPD absente') }

  // Transferts RGPD (I-27) — blocage auto ou pénalité (CIFSO v4.0)
  if (input.rgpdTransferReadiness === 'blocking') {
    return { score: 0, autoRefusal: true, refusalReason: 'Transferts de données RGPD bloquants non résolus (I-29)', rationale: [] }
  }
  if (input.rgpdTransferReadiness === 'warning') {
    score -= 1; rationale.push('Transferts RGPD en attente de conformité — points d\'attention identifiés')
  } else if (input.rgpdTransferReadiness === 'clean') {
    rationale.push('Transferts RGPD conformes (SCCs / décision d\'adéquation)')
  }

  // ── Exposition IA (S-41 à S-46) : maîtrise des actifs, des données et protection des clients ──
  if (input.aiClientDataExposed === 'yes') {
    score -= 3; rationale.push('Données clients transmises à des modèles IA tiers sans contrat de traitement ni clause de non-entraînement (S-45) : risque public, pénalité forte')
  }
  if (input.aiExposure === 'massive_non_sovereign') {
    score -= 2; rationale.push('Dépendance forte à des solutions IA non souveraines (S-44) : maîtrise des actifs et des données affaiblie')
  } else if (input.aiExposure === 'mixed') {
    if (input.aiPolicy === 'yes' && input.aiInventory === 'yes') rationale.push('Usage encadré de fournisseurs IA non souverains : inventaire et politique en place (S-43)')
    else { score -= 1; rationale.push('Usage de fournisseurs IA non souverains sans cadre complet (S-43) : pénalité') }
  } else if (input.aiExposure === 'sovereign') {
    if (input.aiInventory === 'yes') { score = Math.min(score + 1, 20); rationale.push('IA souveraine ou auto-hébergée, inventoriée (S-46) : bonus') }
    else rationale.push('IA souveraine ou auto-hébergée (S-46)')
  } else if (input.aiExposure === 'none') {
    rationale.push('Aucune IA tierce dans la chaîne de valeur')
  }
  if (input.aiExposure && input.aiExposure !== 'none') {
    if (input.aiInventory !== 'yes') rationale.push('Inventaire des services IA absent (S-41)')
    if (input.aiPolicy !== 'yes')    rationale.push('Politique d\'usage IA non formalisée (S-42)')
  }

  // Certification externe — max 1 pt
  if      (input.externalCertification === 'yes')         { score += 1; rationale.push('Certification externe obtenue (ISO 27001 / SOC 2)') }
  else if (input.externalCertification === 'in_progress') { score += 1; rationale.push('Certification externe en cours') }
  else                                                     {             rationale.push('Aucune certification externe') }

  /* ── CIFSO v4.1 — S-52 : NIS2 (si secteur essentiel/important) ── */
  if (profile?.operatesCriticalSector === 'yes' && input.nis2Compliance && input.nis2Compliance !== 'na') {
    if      (input.nis2Compliance === 'compliant')     { score += 1; rationale.push('NIS2 : enregistrement, gestion des risques et notification d\'incidents conformes (S-52)') }
    else if (input.nis2Compliance === 'partial')       { score -= 1; rationale.push('NIS2 : conformité partielle — mesures incomplètes (S-52)') }
    else                                               { score -= 2; rationale.push('NIS2 : non conforme — pas de mesures de gestion des risques ni de notification 24h/72h (S-52)') }
  }

  /* ── CIFSO v4.1 — S-53 : DORA (si entité financière / prestataire TIC) ── */
  if (profile?.isFinancialEntityOrICT === 'yes' && input.doraCompliance && input.doraCompliance !== 'na') {
    if      (input.doraCompliance === 'compliant')     { score += 1; rationale.push('DORA : registre TIC, tests de résilience et clauses prestataires conformes (S-53)') }
    else if (input.doraCompliance === 'partial')       { score -= 1; rationale.push('DORA : conformité partielle (S-53)') }
    else                                               { score -= 2; rationale.push('DORA : non conforme — registre TIC ou tests de résilience absents (S-53)') }
  }

  /* ── CIFSO v4.1 — S-54 : EU AI Act (si fournisseur de systèmes IA) ── */
  if (profile?.providesAISystems === 'yes' && input.aiActCompliance && input.aiActCompliance !== 'na') {
    const hr = input.aiActHighRisk === 'yes'
    if      (input.aiActCompliance === 'compliant')     { score += 1; rationale.push(`AI Act : classification de risque documentée${hr ? ' (haut risque)' : ''}, obligations remplies (S-54)`) }
    else if (input.aiActCompliance === 'partial')       { score -= 1; rationale.push('AI Act : conformité partielle — classification ou obligations incomplètes (S-54)') }
    else if (hr)                                        { score -= 3; rationale.push('AI Act : système haut risque sans évaluation de conformité — exposition juridique majeure (S-54)') }
    else                                                { score -= 2; rationale.push('AI Act : non conforme — aucune classification de risque documentée (S-54)') }
  }

  return { score: Math.max(0, Math.min(score, 20)), autoRefusal: false, rationale }
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
// DIMENSION O — ORGANISATION & TALENT (20 pts) — CIFSO v4.0
// ─────────────────────────────────────────────────────────────────────────────

function scoreOrganisation(input: OrganisationInput, profile?: RegulatoryProfile): DimensionResult {
  const rationale: string[] = []

  if (input.founderLeadsSales === 'yes' && input.operationalDocsComplete === 'no'
      && input.successionPlanDocumented === 'no' && input.keyPersonCount === 0) {
    return {
      score: 0, autoRefusal: true,
      refusalReason: 'Dépendance fondateur totale : aucun N-1, aucune documentation, aucun plan de succession',
      rationale: [],
    }
  }

  let score = 0

  if      (input.keyPersonCount >= 3) { score += 5; rationale.push(`Équipe de direction autonome (${input.keyPersonCount} N-1 opérationnels)`) }
  else if (input.keyPersonCount === 2) { score += 3; rationale.push('2 dirigeants N-1 identifiés — autonomie partielle') }
  else if (input.keyPersonCount === 1) { score += 1; rationale.push('1 seul N-1 identifié — autonomie fragile') }
  else                                 {             rationale.push('Aucun N-1 capable de piloter sans le fondateur') }

  if (input.successionPlanDocumented === 'yes') { score += 4; rationale.push('Plan de succession documenté et formalisé') }
  else                                          {             rationale.push('Aucun plan de succession documenté') }

  if (input.operationalDocsComplete === 'yes') { score += 3; rationale.push('Runbooks et SOPs couvrant les processus critiques') }
  else                                         {             rationale.push('Documentation opérationnelle absente ou incomplète') }

  if (input.lowKeyTalentTurnover === 'yes') { score += 3; rationale.push('Faible turnover des talents clés sur 24 mois') }
  else                                      {             rationale.push('Turnover élevé des talents clés — risque post-closing') }

  if (input.formalizedManagement === 'yes') { score += 2; rationale.push('Comité de direction formalisé avec comptes-rendus réguliers') }
  else                                      {             rationale.push('Absence de comité de direction formalisé') }

  if (input.founderLeadsSales === 'yes') { score -= 2; rationale.push('Fondateur pilote >50% du CA commercial — risque de perte revenu post-closing') }
  else                                   { score += 1; rationale.push('Ventes indépendantes du fondateur') }

  if (input.cultureDocumented === 'yes') { score += 1; rationale.push('Culture d\'entreprise documentée (valeurs, handbook, onboarding)') }

  if (input.independentAdvisor === 'yes') { score += 2; rationale.push('Administrateur indépendant ou conseil consultatif actif') }
  else                                    {             rationale.push('Aucun administrateur ou conseil consultatif externe') }

  /* ── CIFSO v4.1 — O-50 : gouvernance conformité (si périmètre réglementaire applicable) ── */
  if (hasRegulatoryScope(profile) && input.complianceGovernance && input.complianceGovernance !== 'na') {
    if      (input.complianceGovernance === 'compliant')     { score += 1; rationale.push('Gouvernance conformité formalisée : responsable désigné et accountability au niveau direction (O-50)') }
    else if (input.complianceGovernance === 'partial')       {             rationale.push('Gouvernance conformité partielle (O-50)') }
    else                                                     { score -= 1; rationale.push('Aucune gouvernance conformité malgré un périmètre réglementaire applicable (O-50)') }
  }

  return { score: Math.max(0, Math.min(score, 20)), autoRefusal: false, rationale }
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

  const code         = scoreCode(input.code, input.regulatoryProfile)
  const ip           = scoreIP(input.ip, input.regulatoryProfile)
  const finance      = scoreFinance(input.finance)
  const security     = scoreSecurity(input.security, input.regulatoryProfile)
  const organisation = scoreOrganisation(input.organisation, input.regulatoryProfile)

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

  const anyRefusal = code.autoRefusal || ip.autoRefusal || finance.autoRefusal || security.autoRefusal || organisation.autoRefusal
  const refusalReasons = [code, ip, finance, security, organisation]
    .filter(d => d.autoRefusal && d.refusalReason)
    .map(d => d.refusalReason!)

  const totalScore = anyRefusal
    ? 0
    : code.score + ip.score + finance.score + security.score + organisation.score

  const { grade: rawGrade } = calculateGrade(totalScore, anyRefusal)

  // ── Plafond proof_quality avec effectivePQ (CIFSO v4.0 + Sprint 1A) ─────────
  let grade = rawGrade
  let gradeCeiling: GradeLetter | undefined
  if (!anyRefusal && effectivePQ) {
    const cappedGrade = capAegByProofQuality(rawGrade as AEGGrade, effectivePQ) as GradeLetter
    if (cappedGrade !== rawGrade) {
      gradeCeiling = cappedGrade
      grade = cappedGrade
    }
  }

  // ── CIFSO v4.1 — Plafond réglementaire : régulation applicable non conforme → grade ≤ AA ──
  // Le rapport est TOUJOURS produit (jamais de refus) : les manquements se traduisent
  // en pénalités de score, un plafond de grade et un impact TRS.
  const regulatoryFindings = collectRegulatoryFindings(input)
  const regulatoryCapped = regulatoryFindings.some(f => f.severity !== 'info')
  if (!anyRefusal && regulatoryCapped) {
    const ORDER: GradeLetter[] = ['refused', 'b', 'a', 'aa', 'aaa', 'star']
    if (ORDER.indexOf(grade) > ORDER.indexOf('aa')) {
      gradeCeiling = 'aa'
      grade = 'aa'
    }
  }

  const { gradeLabel } = calculateGrade(totalScore, anyRefusal, grade)

  const dimensions = { code, ip, finance, security, organisation }

  // ── TRS — Transaction Readiness Score (Sprint 1D) ─────────────────────
  const { trs, trsReasons } = computeTRS(input, grade, effectivePQ, regulatoryFindings)

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
    regulatoryFindings: regulatoryFindings.map(f => f.label),
    regulatoryCapped,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CIFSO v4.1 — CONSTATS RÉGLEMENTAIRES (matrice d'applicabilité)
// ─────────────────────────────────────────────────────────────────────────────

interface RegulatoryFinding {
  code:        string
  severity:    'blocking' | 'conditional' | 'remediation' | 'info'
  label:       string
}

/** Collecte les manquements réglementaires applicables. Jamais bloquant pour la production du rapport. */
function collectRegulatoryFindings(input: GradeInput): RegulatoryFinding[] {
  const p = input.regulatoryProfile
  if (!p) return []
  const findings: RegulatoryFinding[] = []
  const nc = (s?: RegComplianceStatus) => s === 'non_compliant'
  const pa = (s?: RegComplianceStatus) => s === 'partial'

  // Data Act — technique (C-51) + contractuel (I-50)
  if (p.sellsConnectedProducts === 'yes') {
    if (nc(input.code.dataActTechnical) || nc(input.ip.dataActB2BTerms)) {
      findings.push({ code: 'C-51/I-50', severity: 'blocking',
        label: 'EU Data Act non conforme : accès aux données produit ou conditions B2B FRAND manquants — plafond AA + TRS bloqué' })
    } else if (pa(input.code.dataActTechnical) || pa(input.ip.dataActB2BTerms)) {
      findings.push({ code: 'C-51/I-50', severity: 'remediation',
        label: 'EU Data Act partiellement conforme — remédiation recommandée avant closing' })
    }
  }

  // AI Act — haut risque non conforme = bloquant TRS ; autre = conditionnel
  if (p.providesAISystems === 'yes') {
    if (nc(input.security.aiActCompliance)) {
      const hr = input.security.aiActHighRisk === 'yes'
      findings.push({ code: 'S-54', severity: hr ? 'blocking' : 'conditional',
        label: `EU AI Act non conforme${hr ? ' — système haut risque sans évaluation de conformité' : ' — classification de risque absente'}` })
    } else if (pa(input.security.aiActCompliance)) {
      findings.push({ code: 'S-54', severity: 'remediation', label: 'EU AI Act partiellement conforme' })
    }
  }

  // CRA — produits avec éléments numériques
  if (p.sellsDigitalProducts === 'yes' && nc(input.code.craCompliance)) {
    findings.push({ code: 'C-50', severity: 'conditional',
      label: 'Cyber Resilience Act non conforme — SBOM ou processus de vulnérabilités absent' })
  }

  // NIS2 — secteurs essentiels
  if (p.operatesCriticalSector === 'yes' && nc(input.security.nis2Compliance)) {
    findings.push({ code: 'S-52', severity: 'conditional',
      label: 'NIS2 non conforme — mesures de gestion des risques ou notification d\'incidents absentes' })
  }

  // DORA + AML — entités financières
  if (p.isFinancialEntityOrICT === 'yes') {
    if (nc(input.security.doraCompliance)) {
      findings.push({ code: 'S-53', severity: 'conditional',
        label: 'DORA non conforme — registre TIC ou tests de résilience absents' })
    }
    if (nc(input.ip.amlPolicy)) {
      findings.push({ code: 'I-54', severity: 'conditional',
        label: 'AML : aucune politique anti-blanchiment documentée' })
    }
  }

  // DSA/P2B — plateformes
  if (p.operatesPlatform === 'yes' && nc(input.ip.platformFairTerms)) {
    findings.push({ code: 'I-52', severity: 'remediation',
      label: 'DSA/P2B : conditions business users non conformes' })
  }

  // ePrivacy — données UE
  if (p.processesEUData === 'yes' && nc(input.ip.eprivacyCompliance)) {
    findings.push({ code: 'I-51', severity: 'remediation',
      label: 'ePrivacy : consentement cookies non conforme' })
  }

  // Sanctions — universel
  if (input.ip.sanctionsDeclaration === 'exposed') {
    findings.push({ code: 'I-53', severity: 'blocking',
      label: 'Exposition sanctions/embargos identifiée — transaction à suspendre' })
  } else if (input.ip.sanctionsDeclaration === 'not_declared') {
    findings.push({ code: 'I-53', severity: 'remediation',
      label: 'Déclaration sanctions/embargos non fournie' })
  }

  return findings
}

// ─────────────────────────────────────────────────────────────────────────────
// TRS — TRANSACTION READINESS SCORE (Sprint 1D)
// ─────────────────────────────────────────────────────────────────────────────

function computeTRS(
  input: GradeInput,
  grade: GradeLetter,
  effectivePQ?: { code: ProofQuality; ip: ProofQuality; finance: ProofQuality; security: ProofQuality },
  regulatoryFindings: RegulatoryFinding[] = [],
): { trs: TRSLevel; trsReasons: string[] } {
  const reasons: string[] = []
  // CIFSO v4.1 — constats réglementaires par sévérité
  const regBlocking    = regulatoryFindings.filter(f => f.severity === 'blocking').map(f => f.label)
  const regConditional = regulatoryFindings.filter(f => f.severity === 'conditional').map(f => f.label)
  const regRemediation = regulatoryFindings.filter(f => f.severity === 'remediation').map(f => f.label)

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
  // CIFSO v4.1 — manquements réglementaires bloquants (Data Act, AI Act haut risque, sanctions)
  reasons.push(...regBlocking)

  if (reasons.length > 0) return { trs: 'blocked', trsReasons: reasons }

  // — Conditionnel
  const founderScore = input.finance.founderDependency
    ? Object.values(input.finance.founderDependency).filter(v => v === 'yes').length
    : 0
  if (founderScore >= 5) {
    reasons.push('Dépendance fondateur maximale (5/5 critères) — plan de succession requis avant closing')
  }
  reasons.push(...regConditional)
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
    founderScore >= 3 ||
    regRemediation.length > 0
  if (hasRemediation) {
    return { trs: 'remediation', trsReasons: [...regRemediation, 'Points d\'attention identifiés — actions de remédiation recommandées avant closing'] }
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

  /* ── CIFSO v4.1 — Recommandations réglementaires ── */
  const p = input.regulatoryProfile
  if (p) {
    // Data Act — produit connecté
    if (p.sellsConnectedProducts === 'yes') {
      if (input.code.dataActTechnical === 'non_compliant' || input.code.dataActTechnical === 'partial') {
        recs.push({
          dimension: 'C', subcode: 'C-51', priority: 'high',
          action: 'Implémenter l\'accès direct, gratuit et par défaut aux données générées par le produit (interface utilisateur ou API), et documenter les formats d\'export.',
          effort: 'months',
          impact: '+2 à +3 pts sur dimension C — lève le plafond AA et le blocage TRS Data Act',
        })
      }
      if (input.ip.dataActB2BTerms === 'non_compliant' || input.ip.dataActB2BTerms === 'partial') {
        recs.push({
          dimension: 'I', subcode: 'I-50', priority: 'high',
          action: 'Rédiger des conditions de partage de données B2B conformes FRAND (fair, reasonable, non-discriminatory) avec protection des secrets d\'affaires.',
          effort: 'weeks',
          impact: '+2 à +3 pts sur dimension I — lève le plafond AA et le blocage TRS Data Act',
        })
      }
    }
    // AI Act
    if (p.providesAISystems === 'yes' && (input.security.aiActCompliance === 'non_compliant' || input.security.aiActCompliance === 'partial')) {
      recs.push({
        dimension: 'S', subcode: 'S-54', priority: input.security.aiActHighRisk === 'yes' ? 'blocking' : 'high',
        action: 'Documenter la classification de risque AI Act du système (annexe III), la documentation technique et les obligations de transparence/GPAI applicables.',
        effort: 'months',
        impact: '+3 à +4 pts sur dimension S — lève le blocage TRS si haut risque',
      })
    }
    // CRA
    if (p.sellsDigitalProducts === 'yes' && (input.code.craCompliance === 'non_compliant' || input.code.craCompliance === 'partial')) {
      recs.push({
        dimension: 'C', subcode: 'C-50', priority: 'high',
        action: 'Produire une SBOM à jour et formaliser le processus de gestion des vulnérabilités (coordinated disclosure, correctifs).',
        effort: 'weeks',
        impact: '+2 à +3 pts sur dimension C',
      })
    }
    // NIS2
    if (p.operatesCriticalSector === 'yes' && (input.security.nis2Compliance === 'non_compliant' || input.security.nis2Compliance === 'partial')) {
      recs.push({
        dimension: 'S', subcode: 'S-52', priority: 'high',
        action: 'Vérifier l\'enregistrement NIS2, documenter les mesures de gestion des risques et le processus de notification d\'incidents 24h/72h.',
        effort: 'months',
        impact: '+2 à +3 pts sur dimension S',
      })
    }
    // DORA
    if (p.isFinancialEntityOrICT === 'yes') {
      if (input.security.doraCompliance === 'non_compliant' || input.security.doraCompliance === 'partial') {
        recs.push({
          dimension: 'S', subcode: 'S-53', priority: 'high',
          action: 'Constituer le registre TIC, planifier les tests de résilience et aligner les clauses contractuelles prestataires TIC sur DORA.',
          effort: 'months',
          impact: '+2 à +3 pts sur dimension S',
        })
      }
      if (input.ip.amlPolicy === 'non_compliant' || input.ip.amlPolicy === 'partial') {
        recs.push({
          dimension: 'I', subcode: 'I-54', priority: 'high',
          action: 'Documenter la politique AML/KYC : procédures d\'identification, filtrage des bénéficiaires effectifs, reporting.',
          effort: 'weeks',
          impact: '+2 pts sur dimension I',
        })
      }
    }
    // DSA/P2B
    if (p.operatesPlatform === 'yes' && (input.ip.platformFairTerms === 'non_compliant' || input.ip.platformFairTerms === 'partial')) {
      recs.push({
        dimension: 'I', subcode: 'I-52', priority: 'medium',
        action: 'Aligner les conditions générales plateforme sur P2B (transparence ranking, préavis de modification, médiation).',
        effort: 'weeks',
        impact: '+1 à +2 pts sur dimension I',
      })
    }
    // ePrivacy
    if (p.processesEUData === 'yes' && (input.ip.eprivacyCompliance === 'non_compliant' || input.ip.eprivacyCompliance === 'partial')) {
      recs.push({
        dimension: 'I', subcode: 'I-51', priority: 'medium',
        action: 'Déployer un bandeau de consentement conforme (refus aussi simple que l\'acceptation) et tenir le registre des trackers.',
        effort: 'days',
        impact: '+1 pt sur dimension I',
      })
    }
    // Sanctions — universel
    if (input.ip.sanctionsDeclaration === 'not_declared') {
      recs.push({
        dimension: 'I', subcode: 'I-53', priority: 'high',
        action: 'Fournir une déclaration d\'absence d\'exposition aux sanctions et embargos (dirigeants, bénéficiaires effectifs, contreparties).',
        effort: 'days',
        impact: '+1 pt sur dimension I — requis pour la transaction',
      })
    } else if (input.ip.sanctionsDeclaration === 'exposed') {
      recs.push({
        dimension: 'I', subcode: 'I-53', priority: 'blocking',
        action: 'Résoudre l\'exposition sanctions/embargos identifiée avant toute transaction — conseil juridique spécialisé requis.',
        effort: 'months',
        impact: 'Débloque le TRS — transaction suspendue en l\'état',
      })
    }
    // Gouvernance conformité (O-50) — si périmètre applicable sans gouvernance
    if (hasRegulatoryScope(p) && (input.organisation.complianceGovernance === 'non_compliant' || input.organisation.complianceGovernance === 'partial')) {
      recs.push({
        dimension: 'O', subcode: 'O-50', priority: 'medium',
        action: 'Désigner un responsable conformité (DPO, référent réglementaire) et formaliser l\'accountability au niveau direction.',
        effort: 'days',
        impact: '+1 pt sur dimension O',
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
