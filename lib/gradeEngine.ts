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

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — ENTRÉES FACTUELLES
// ─────────────────────────────────────────────────────────────────────────────

export type YesNo         = 'yes' | 'no'
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

export interface FinanceInput {
  arr: number                        // ARR en €
  revenueAgeMonths: number           // ancienneté revenus
  arrAudited: YesNo
  nrr: number | null                 // % ou null si <12 mois
  monthlyChurn: number               // %
  grossMargin: number                // %
  yoyGrowth: number                  // %
  topClientConcentration: number     // % du top 1 client
  runwayMonths: number               // mois
}

export interface SecurityInput {
  lastPentestMonthsAgo: number       // 9999 = jamais
  criticalVulnsResolved: YesNoNA
  mfaOnAdminAccess: YesNo
  encryption: Encryption
  rgpdDocumented: YesNo
  activeSecurityIncident: YesNo
  externalCertification: Certification
}

export interface GradeInput {
  code:     CodeInput
  ip:       IPInput
  finance:  FinanceInput
  security: SecurityInput
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — SORTIES
// ─────────────────────────────────────────────────────────────────────────────

export interface DimensionResult {
  score:         number          // 0-25
  autoRefusal:   boolean
  refusalReason?: string
  rationale:     string[]        // constats qualitatifs — exposables client (sans pondération)
}

export type GradeLetter = 'star' | 'aaa' | 'aa' | 'a' | 'b' | 'refused'

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
  autoRefusal:     boolean
  refusalReasons:  string[]
  publicRationale: string        // résumé qualitatif exposable côté actif catalogué
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

  // ARR audité — max 2 pts
  if (input.arrAudited === 'yes') { score += 2; rationale.push('ARR audité par un tiers indépendant') }
  else                            {             rationale.push('ARR non audité') }

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

  // Pentest — max 7 pts
  if      (input.lastPentestMonthsAgo <= 6)   { score += 7; rationale.push('Pentest récent (≤6 mois)') }
  else if (input.lastPentestMonthsAgo <= 12)   { score += 5; rationale.push('Pentest dans l\'année (≤12 mois)') }
  else if (input.lastPentestMonthsAgo <= 24)   { score += 2; rationale.push(`Pentest ancien (${input.lastPentestMonthsAgo} mois) — renouvellement recommandé`) }
  else                                          {             rationale.push('Aucun pentest réalisé') }

  // Vulnérabilités critiques résolues — max 5 pts
  if      (input.criticalVulnsResolved === 'yes') { score += 5; rationale.push('Toutes les vulnérabilités critiques résolues') }
  else if (input.criticalVulnsResolved === 'na')  { score += 3; rationale.push('Aucune vulnérabilité critique identifiée (N/A)') }
  else                                            {             rationale.push('Vulnérabilités critiques non résolues') }

  // MFA admin — max 5 pts
  if (input.mfaOnAdminAccess === 'yes') { score += 5; rationale.push('MFA actif sur tous les accès admin') }
  else                                  {             rationale.push('MFA absent sur les accès admin — non-conformité critique') }

  // Chiffrement — max 4 pts
  if      (input.encryption === 'full')    { score += 4; rationale.push('Chiffrement complet (repos + transit)') }
  else if (input.encryption === 'partial') { score += 2; rationale.push('Chiffrement partiel') }
  else                                     {             rationale.push('Absence de chiffrement documenté') }

  // RGPD documenté — max 2 pts
  if (input.rgpdDocumented === 'yes') { score += 2; rationale.push('Conformité RGPD/LPD documentée') }
  else                                {             rationale.push('Documentation RGPD/LPD absente') }

  // Certification externe — max 2 pts
  if      (input.externalCertification === 'yes')         { score += 2; rationale.push('Certification externe obtenue (ISO 27001 / SOC 2)') }
  else if (input.externalCertification === 'in_progress') { score += 1; rationale.push('Certification externe en cours') }
  else                                                     {             rationale.push('Aucune certification externe') }

  return { score: Math.max(0, Math.min(score, 25)), autoRefusal: false, rationale }
}

// ─────────────────────────────────────────────────────────────────────────────
// AGRÉGATION FINALE + GRADE
// ─────────────────────────────────────────────────────────────────────────────

function calculateGrade(total: number, anyRefusal: boolean): { grade: GradeLetter; gradeLabel: string } {
  if (anyRefusal) return { grade: 'refused', gradeLabel: 'Non certifiable en l\'état' }
  if (total >= 90) return { grade: 'star', gradeLabel: 'AEG ★' }
  if (total >= 75) return { grade: 'aaa',  gradeLabel: 'AAA' }
  if (total >= 60) return { grade: 'aa',   gradeLabel: 'AA' }
  if (total >= 45) return { grade: 'a',    gradeLabel: 'A' }
  if (total >= 30) return { grade: 'b',    gradeLabel: 'B' }
  return { grade: 'refused', gradeLabel: 'Non certifiable en l\'état' }
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
  const code     = scoreCode(input.code)
  const ip       = scoreIP(input.ip)
  const finance  = scoreFinance(input.finance)
  const security = scoreSecurity(input.security)

  const anyRefusal = code.autoRefusal || ip.autoRefusal || finance.autoRefusal || security.autoRefusal
  const refusalReasons = [code, ip, finance, security]
    .filter(d => d.autoRefusal && d.refusalReason)
    .map(d => d.refusalReason!)

  const totalScore = anyRefusal
    ? 0
    : code.score + ip.score + finance.score + security.score

  const { grade, gradeLabel } = calculateGrade(totalScore, anyRefusal)

  const dimensions = { code, ip, finance, security }

  return {
    dimensions,
    totalScore,
    grade,
    gradeLabel,
    autoRefusal: anyRefusal,
    refusalReasons,
    publicRationale: anyRefusal ? '' : buildPublicRationale(dimensions),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS INTERNES
// ─────────────────────────────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k€`
  return `${n}€`
}
