/**
 * lib/gradeAutoFill.ts
 *
 * USAGE ADMIN UNIQUEMENT — NE JAMAIS EXPOSER CÔTÉ CLIENT PUBLIC.
 *
 * inferGradeFromDocs() :
 *   Prend la liste des documents data room d'un actif (avec admin_quality)
 *   et produit :
 *     1. Les sous-codes CIFS à pré-cocher par dimension
 *     2. Les champs GradeInput booléens/énums déductibles des documents
 *     3. Un récapitulatif des sources (quel document a déclenché quoi)
 *
 * Les métriques chiffrées (ARR, NRR, churn, etc.) restent en saisie manuelle
 * car elles ne peuvent pas être extraites automatiquement d'un PDF.
 */

import { subcodesForDoc, gradeInputHintsForDoc, type DocQuality } from './docToSubcodeMap'
import type { GradeInput, ArrAuditLevel } from './gradeEngine'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DocSummary {
  code:       string
  file_name:  string
  quality:    DocQuality
  category:   string
}

export interface AutoFillSubcode {
  subcode:  string
  source:   'data_room'        // toujours data_room dans ce contexte
  docCode:  string             // code document qui a déclenché ce subcode
  quality:  DocQuality
}

export interface AutoFillResult {
  /** Sous-codes pré-cochés par dimension */
  subcodes: {
    code:     AutoFillSubcode[]
    ip:       AutoFillSubcode[]
    finance:  AutoFillSubcode[]
    security: AutoFillSubcode[]
  }
  /** Champs GradeInput déduits des documents (enum/bool uniquement) */
  gradeInputOverrides: Partial<GradeInput['code']>
    & Partial<GradeInput['ip']>
    & Partial<GradeInput['finance']>
    & Partial<GradeInput['security']>
  /** Récapitulatif lisible des sources par subcode */
  sources: Array<{
    subcode: string
    docCode: string
    docName: string
    quality: DocQuality
  }>
  /** Documents qui bloquent le grading (quality missing|insufficient + required_level blocking) */
  blockingDocs: DocSummary[]
  /** Nombre de documents évalués */
  docCount: number
  /** Nombre de documents sufficient */
  sufficientCount: number
}

const DIM_PREFIXES: Record<string, keyof AutoFillResult['subcodes']> = {
  C: 'code',
  I: 'ip',
  F: 'finance',
  S: 'security',
}

// ─────────────────────────────────────────────────────────────────────────────
// Fonction principale
// ─────────────────────────────────────────────────────────────────────────────

export function inferGradeFromDocs(docs: DocSummary[]): AutoFillResult {
  const result: AutoFillResult = {
    subcodes: { code: [], ip: [], finance: [], security: [] },
    gradeInputOverrides: {},
    sources: [],
    blockingDocs: [],
    docCount: docs.length,
    sufficientCount: 0,
  }

  // Dédupliquer les subcodes par dimension (un subcode ne peut être coché qu'une fois)
  const seen: Record<string, Set<string>> = {
    code: new Set(), ip: new Set(), finance: new Set(), security: new Set(),
  }

  for (const doc of docs) {
    const quality = doc.quality as DocQuality
    if (quality === 'sufficient') result.sufficientCount++

    // Marquer les docs bloquants
    if (quality === 'missing' || quality === 'insufficient') {
      result.blockingDocs.push(doc)
    }

    // Sous-codes à pré-cocher
    const subcodes = subcodesForDoc(doc.code, quality)
    for (const sc of subcodes) {
      const dimPrefix = sc[0] as string
      const dimKey = DIM_PREFIXES[dimPrefix]
      if (!dimKey) continue
      if (seen[dimKey].has(sc)) continue
      seen[dimKey].add(sc)
      result.subcodes[dimKey].push({
        subcode: sc,
        source:  'data_room',
        docCode: doc.code,
        quality,
      })
      result.sources.push({
        subcode: sc,
        docCode: doc.code,
        docName: doc.file_name,
        quality,
      })
    }

    // GradeInput hints (seulement pour les docs sufficient)
    const hints = gradeInputHintsForDoc(doc.code, quality)
    for (const [key, value] of Object.entries(hints)) {
      if (value !== undefined) {
        // On ne surcharge pas si un document précédent a déjà positionné ce champ
        // avec une valeur plus favorable (sufficient > insufficient)
        const existing = (result.gradeInputOverrides as Record<string, unknown>)[key]
        if (existing === undefined || quality === 'sufficient') {
          ;(result.gradeInputOverrides as Record<string, unknown>)[key] = value
        }
      }
    }
  }

  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper : merge autoFill dans un GradeInput existant (pour pré-alimenter le formulaire)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Applique les overrides déduits des documents sur un GradeInput de base.
 * Ne touche qu'aux champs couverts par la table de correspondance.
 * Les champs chiffrés (arr, nrr, churn, etc.) restent inchangés.
 */
export function applyAutoFillToGradeInput(
  base: GradeInput,
  overrides: AutoFillResult['gradeInputOverrides'],
): GradeInput {
  return {
    code: {
      ...base.code,
      ...(overrides.techDebtDocumented !== undefined  && { techDebtDocumented:  overrides.techDebtDocumented }),
      ...(overrides.ciCdFunctional      !== undefined  && { ciCdFunctional:      overrides.ciCdFunctional }),
      ...(overrides.apiDocumentation    !== undefined  && { apiDocumentation:    overrides.apiDocumentation }),
      ...(overrides.architecture        !== undefined  && { architecture:        overrides.architecture }),
    },
    ip: {
      ...base.ip,
      ...(overrides.activeIPLitigation      !== undefined && { activeIPLitigation:      overrides.activeIPLitigation }),
      ...(overrides.employeeIPRights        !== undefined && { employeeIPRights:        overrides.employeeIPRights }),
      ...(overrides.openSourceRisk          !== undefined && { openSourceRisk:          overrides.openSourceRisk }),
      ...(overrides.thirdPartyAPIContracted !== undefined && { thirdPartyAPIContracted: overrides.thirdPartyAPIContracted }),
      ...(overrides.rgpdCompliance          !== undefined && { rgpdCompliance:          overrides.rgpdCompliance }),
    },
    finance: {
      ...base.finance,
      ...(overrides.arrAudited !== undefined && { arrAudited: overrides.arrAudited as ArrAuditLevel }),
    },
    security: {
      ...base.security,
      ...(overrides.mfaOnAdminAccess        !== undefined && { mfaOnAdminAccess:        overrides.mfaOnAdminAccess }),
      ...(overrides.encryption              !== undefined && { encryption:              overrides.encryption }),
      ...(overrides.rgpdDocumented          !== undefined && { rgpdDocumented:          overrides.rgpdDocumented }),
      ...(overrides.activeSecurityIncident  !== undefined && { activeSecurityIncident:  overrides.activeSecurityIncident }),
      ...(overrides.externalCertification   !== undefined && { externalCertification:   overrides.externalCertification }),
      ...(overrides.criticalVulnsResolved   !== undefined && { criticalVulnsResolved:   overrides.criticalVulnsResolved }),
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper : flat list of all pre-checked subcodes (pour merge avec subcodes admin)
// ─────────────────────────────────────────────────────────────────────────────

export function flatSubcodesFromAutoFill(result: AutoFillResult): {
  code:     string[]
  ip:       string[]
  finance:  string[]
  security: string[]
} {
  return {
    code:     result.subcodes.code.map(s => s.subcode),
    ip:       result.subcodes.ip.map(s => s.subcode),
    finance:  result.subcodes.finance.map(s => s.subcode),
    security: result.subcodes.security.map(s => s.subcode),
  }
}
