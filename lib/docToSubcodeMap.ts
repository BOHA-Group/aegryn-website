/**
 * lib/docToSubcodeMap.ts
 *
 * Table de correspondance CONFIDENTIELLE — USAGE ADMIN UNIQUEMENT
 *
 * Chaque entrée du catalogue documents (Cxx, Ixx, Fxx, Sxx, Txx) est mappée à :
 *   - subcodes[] : sous-codes Aegryn Grading System à pré-cocher si le doc est "sufficient"
 *   - unsubcodes[] : sous-codes à pré-cocher si le doc est "missing" ou "insufficient"
 *   - scoreHints : contributions partielles aux métriques de gradeEngine (si calculable)
 *
 * Ce fichier ne doit jamais être importé côté client public.
 */

export type DocQuality = 'sufficient' | 'insufficient' | 'missing' | 'pending_review'

export interface DocSubcodeRule {
  /** Sous-codes à cocher quand le document est sufficient */
  onSufficient: string[]
  /** Sous-codes à cocher quand le document est missing ou insufficient */
  onMissing: string[]
  /**
   * Contribution aux champs GradeInput quand sufficient.
   * Partial<GradeInput fields> — seulement les champs booléens/énums déductibles
   * des documents (pas les métriques chiffrées qui restent saisie manuelle).
   */
  gradeInputHints?: Partial<{
    techDebtDocumented: 'yes' | 'no'
    ciCdFunctional: 'yes' | 'no'
    apiDocumentation: 'complete' | 'partial' | 'absent'
    architecture: 'decoupled' | 'partial' | 'monolithic'
    activeIPLitigation: 'yes' | 'no'
    employeeIPRights: 'complete' | 'partial' | 'absent'
    openSourceRisk: 'yes' | 'no'
    thirdPartyAPIContracted: 'yes' | 'no'
    rgpdCompliance: 'complete' | 'partial' | 'absent'
    arrAudited: 'declarative' | 'verifiable' | 'audited'
    mfaOnAdminAccess: 'yes' | 'no'
    encryption: 'full' | 'partial' | 'none'
    rgpdDocumented: 'yes' | 'no'
    activeSecurityIncident: 'yes' | 'no'
    externalCertification: 'yes' | 'in_progress' | 'no'
    criticalVulnsResolved: 'yes' | 'no' | 'na'
  }>
}

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION C — CODE & ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────

export const DOC_TO_SUBCODE_MAP: Record<string, DocSubcodeRule> = {

  'C-01': {
    onSufficient: ['C-37'],              // Versionné correctement (Git clean)
    onMissing:    ['C-39'],              // Non versionné
  },

  'C-02': {
    onSufficient: ['C-23'],              // Documentation complète (README + architecture)
    onMissing:    ['C-24'],              // Documentation partielle → si absent complètement
    gradeInputHints: { apiDocumentation: 'partial' },  // README présent → documentation partielle au minimum
  },

  'C-03': {
    onSufficient: ['C-31'],              // Dépendances à jour (<12 mois)
    onMissing:    ['C-33'],              // Dépendances fortement obsolètes (>24 mois)
  },

  'C-04': {
    onSufficient: ['C-11'],              // Tests unitaires complets (>80% coverage) — admin ajustera
    onMissing:    ['C-14'],              // Tests absents
  },

  'C-05': {
    onSufficient: ['C-25'],              // Architecture scalable documentée
    onMissing:    [],
    gradeInputHints: { architecture: 'partial' },  // Schéma fourni → au moins partiel
  },

  'C-06': {
    onSufficient: ['C-17'],              // CI/CD configuré et fonctionnel
    onMissing:    ['C-19'],              // CI/CD absent
    gradeInputHints: { ciCdFunctional: 'yes' },
  },

  'C-07': {
    onSufficient: ['C-41'],              // Gestion des secrets sécurisée (vault) si couvert dans API doc
    onMissing:    [],
    gradeInputHints: { apiDocumentation: 'complete' },
  },

  'C-08': {
    onSufficient: [],                    // Historique incidents — pas de subcode direct
    onMissing:    [],
  },

  'C-09': {
    onSufficient: ['C-28'],              // Dette technique mineure identifiée
    onMissing:    [],
    gradeInputHints: { techDebtDocumented: 'yes' },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DIMENSION I — IP & DROITS
  // ─────────────────────────────────────────────────────────────────────────

  'I-01': {
    onSufficient: [],                    // Kbis — preuve existence, pas de subcode direct
    onMissing:    [],
  },

  'I-02': {
    onSufficient: [],                    // Statuts — structure légale, pas de subcode direct
    onMissing:    [],
  },

  'I-03': {
    onSufficient: [],                    // Cap table — métrique structurelle
    onMissing:    [],
  },

  'I-04': {
    onSufficient: ['I-19', 'I-22'],      // Droits logiciels totalement formalisés + contrats employés
    onMissing:    ['I-21', 'I-24'],      // Droits non formalisés + contrats absents
    gradeInputHints: { employeeIPRights: 'complete' },
  },

  'I-05': {
    onSufficient: ['I-11'],              // Marque verbale déposée
    onMissing:    ['I-15'],              // Marque non déposée (disponibilité vérifiée si présent du tout)
  },

  'I-06': {
    onSufficient: ['I-25'],              // Licences conformes uniquement
    onMissing:    ['I-41'],              // Licences non auditées (I-41 depuis CIFS v3.0)
    gradeInputHints: { openSourceRisk: 'no' },
  },

  'I-07': {
    onSufficient: ['I-30'],              // Contrats APIs tierces critiques en ordre
    onMissing:    ['I-31'],              // Contrats APIs partiels
    gradeInputHints: { thirdPartyAPIContracted: 'yes' },
  },

  'I-08': {
    onSufficient: [],                    // Brevets — subcode spécifique absent du catalogue actuel
    onMissing:    [],
  },

  'I-09': {
    onSufficient: ['I-30'],              // Licences entrants contractualisées
    onMissing:    ['I-32'],              // APIs critiques sans contrat
  },

  'I-10': {
    onSufficient: [],                    // Déclaration absence litige
    onMissing:    [],
    gradeInputHints: { activeIPLitigation: 'no' },  // Si doc "sufficient" → litige absent
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DIMENSION F — FINANCE
  // ─────────────────────────────────────────────────────────────────────────

  'F-01': {
    onSufficient: ['F-11'],              // ARR audité par expert-comptable co-signataire
    onMissing:    ['F-12'],              // ARR auto-déclaré (cohérence vérifiée)
    gradeInputHints: { arrAudited: 'audited' },
  },

  'F-02': {
    onSufficient: ['F-15'],              // MRR en croissance (à affiner par l'admin)
    onMissing:    ['F-13'],              // ARR non vérifié
  },

  'F-03': {
    onSufficient: ['F-37'],              // Base client diversifiée (à affiner par l'admin)
    onMissing:    [],
  },

  'F-04': {
    onSufficient: ['F-22'],              // Churn mensuel < 2% (admin ajustera)
    onMissing:    [],
  },

  'F-05': {
    onSufficient: ['F-35'],              // Burn rate documenté et maîtrisé
    onMissing:    ['F-36'],              // Burn rate non documenté
  },

  'F-06': {
    onSufficient: [],                    // Cap table détaillée — structurel
    onMissing:    [],
  },

  'F-07': {
    onSufficient: ['F-35'],              // Contrats dettes — burn rate documenté
    onMissing:    [],
  },

  'F-08': {
    onSufficient: [],                    // Relevés bancaires — métriques chiffrées
    onMissing:    [],
  },

  'F-09': {
    onSufficient: ['F-35'],              // Dashboard KPIs — burn rate maîtrisé
    onMissing:    [],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DIMENSION S — SÉCURITÉ
  // ─────────────────────────────────────────────────────────────────────────

  'S-01': {
    onSufficient: ['S-28'],              // RGPD/LPD conforme — DPA, registre
    onMissing:    ['S-30'],              // RGPD/LPD non évalué
    gradeInputHints: { rgpdDocumented: 'yes' },
  },

  'S-02': {
    onSufficient: ['S-28'],              // RGPD/LPD conforme
    onMissing:    ['S-30'],              // RGPD/LPD non évalué
    gradeInputHints: { rgpdDocumented: 'yes' },
  },

  'S-03': {
    onSufficient: ['S-28'],              // DPA signé → RGPD conforme
    onMissing:    ['S-29'],              // RGPD/LPD partiellement conforme
  },

  'S-04': {
    onSufficient: ['S-11'],              // Pentest < 6 mois — aucune vulnérabilité critique
    onMissing:    ['S-14'],              // Pentest absent
    gradeInputHints: { criticalVulnsResolved: 'yes' },
  },

  'S-05': {
    onSufficient: ['S-18', 'S-21'],      // MFA implémenté + RBAC
    onMissing:    ['S-20', 'S-22'],      // MFA absent + contrôle minimal
    gradeInputHints: { mfaOnAdminAccess: 'yes' },
  },

  'S-06': {
    onSufficient: ['S-23', 'S-26'],      // Chiffrement complet + gestion secrets sécurisée
    onMissing:    ['S-25', 'S-27'],      // Chiffrement absent + secrets insuffisants
    gradeInputHints: { encryption: 'full' },
  },

  'S-07': {
    onSufficient: ['S-33'],              // ISO 27001 ou SOC 2 certifié
    onMissing:    [],
    gradeInputHints: { externalCertification: 'yes' },
  },

  'S-08': {
    onSufficient: ['S-36'],              // Incident(s) passé(s) résolu(s) et documenté(s)
    onMissing:    [],
    gradeInputHints: { activeSecurityIncident: 'no' },
  },

  'S-09': {
    onSufficient: ['S-38'],              // Plan de continuité (PCA/PRA) documenté
    onMissing:    [],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pour un document donné et sa qualité admin, retourne les sous-codes à pré-cocher.
 */
export function subcodesForDoc(docCode: string, quality: DocQuality): string[] {
  const rule = DOC_TO_SUBCODE_MAP[docCode]
  if (!rule) return []
  if (quality === 'sufficient') return rule.onSufficient
  if (quality === 'missing' || quality === 'insufficient') return rule.onMissing
  return []
}

/**
 * Pour un document donné "sufficient", retourne les hints GradeInput déductibles.
 */
export function gradeInputHintsForDoc(
  docCode: string,
  quality: DocQuality,
): NonNullable<DocSubcodeRule['gradeInputHints']> {
  if (quality !== 'sufficient') return {}
  return DOC_TO_SUBCODE_MAP[docCode]?.gradeInputHints ?? {}
}
