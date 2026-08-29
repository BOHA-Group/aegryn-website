/**
 * Aegryn Grading System — Adapté du système Antiquorum — Version 3.0 (Août 2026)
 *
 * Référence : voir /grade/methodology pour le contenu public (storytelling).
 * Ce module centralise la logique interne (types, sous-codes, notation,
 * refus automatique) partagée entre le moteur admin et l'affichage public.
 *
 * Principe : Antiquorum a introduit son grading (C=Case, D=Dial, M=Movement
 * + Expert's Overall Opinion) dans ses catalogues d'enchères horlogères.
 * Aegryn adapte ce format aux actifs tech avec 4 dimensions (C/I/F/S) au
 * lieu de 3, la 4ème (Sécurité) n'ayant pas d'équivalent en horlogerie.
 */

/* ─────────────────────────────────────────────────────────────────────────
 * ÉCHELLE GÉNÉRALE 1-5 (équivalent des notes Antiquorum)
 * ────────────────────────────────────────────────────────────────────── */

export type GradeNote = 1 | 2 | 3 | 4 | 5

export const GRADE_NOTE_LABEL: Record<GradeNote, { fr: string; en: string }> = {
  1: { fr: 'Exceptionnel', en: 'Exceptional' },
  2: { fr: 'Excellent',    en: 'Excellent' },
  3: { fr: 'Bon',          en: 'Good' },
  4: { fr: 'Correct',      en: 'Fair' },
  5: { fr: 'Insuffisant',  en: 'Poor' },
}

/**
 * Convertit un score dimension (0-25, échelle interne conservée pour
 * compatibilité avec /valuation et le total /100) en note Antiquorum-style 1-5.
 */
export function scoreToNote(score: number): GradeNote {
  if (score >= 21) return 1
  if (score >= 16) return 2
  if (score >= 11) return 3
  if (score >= 6)  return 4
  return 5
}

/* ─────────────────────────────────────────────────────────────────────────
 * REMARQUES GÉNÉRALES (codes 01-10 — transversales aux 4 dimensions)
 * ────────────────────────────────────────────────────────────────────── */

export const GENERAL_REMARKS = [
  { code: '01', fr: 'Documenté intégralement',            en: 'Fully documented' },
  { code: '02', fr: 'Documenté partiellement',            en: 'Partially documented' },
  { code: '03', fr: 'Non documenté',                      en: 'Undocumented' },
  { code: '04', fr: 'Audité par tiers indépendant',       en: 'Audited by independent third party' },
  { code: '05', fr: 'Auto-déclaré (non vérifié)',         en: 'Self-declared (unverified)' },
  { code: '06', fr: "Légèrement dégradé depuis l'audit",  en: 'Slightly degraded since audit' },
  { code: '07', fr: "Dégradé depuis l'audit",             en: 'Degraded since audit' },
  { code: '08', fr: 'En cours de remédiation',            en: 'Under remediation' },
  { code: '09', fr: 'Remédié post-audit',                 en: 'Remediated post-audit' },
  { code: '10', fr: 'Remédiation recommandée',            en: 'Remediation recommended' },
] as const

/* ─────────────────────────────────────────────────────────────────────────
 * SOUS-CODES PAR DIMENSION
 * ────────────────────────────────────────────────────────────────────── */

export interface SubcodeDef {
  code: string
  fr: string
  en: string
  /** Groupe d'affichage (regroupement thématique dans l'UI admin) */
  group: string
}

export const CODE_SUBCODES: SubcodeDef[] = [
  // Tests
  { code: 'C-11', group: 'Tests', fr: 'Tests unitaires complets (>80% coverage)', en: 'Comprehensive unit tests (>80% coverage)' },
  { code: 'C-12', group: 'Tests', fr: 'Tests partiels (40–80% coverage)', en: 'Partial tests (40–80% coverage)' },
  { code: 'C-13', group: 'Tests', fr: 'Tests insuffisants (<40% coverage)', en: 'Insufficient tests (<40% coverage)' },
  { code: 'C-14', group: 'Tests', fr: 'Tests absents', en: 'No tests' },
  { code: 'C-15', group: 'Tests', fr: "Tests d'intégration présents", en: 'Integration tests present' },
  { code: 'C-16', group: 'Tests', fr: "Tests d'intégration absents", en: 'No integration tests' },
  // CI/CD & DevOps
  { code: 'C-17', group: 'CI/CD & DevOps', fr: 'CI/CD configuré et fonctionnel', en: 'CI/CD configured and functional' },
  { code: 'C-18', group: 'CI/CD & DevOps', fr: 'CI/CD partiel', en: 'Partial CI/CD' },
  { code: 'C-19', group: 'CI/CD & DevOps', fr: 'CI/CD absent', en: 'No CI/CD' },
  { code: 'C-20', group: 'CI/CD & DevOps', fr: 'Containerisé (Docker/Kubernetes)', en: 'Containerised (Docker/Kubernetes)' },
  { code: 'C-21', group: 'CI/CD & DevOps', fr: 'Infrastructure as Code', en: 'Infrastructure as Code' },
  { code: 'C-22', group: 'CI/CD & DevOps', fr: 'Déploiement manuel', en: 'Manual deployment' },
  // Documentation & Architecture
  { code: 'C-23', group: 'Documentation & Architecture', fr: 'Documentation complète (README + architecture)', en: 'Complete documentation (README + architecture)' },
  { code: 'C-24', group: 'Documentation & Architecture', fr: 'Documentation partielle', en: 'Partial documentation' },
  { code: 'C-25', group: 'Documentation & Architecture', fr: 'Architecture scalable documentée', en: 'Documented scalable architecture' },
  { code: 'C-26', group: 'Documentation & Architecture', fr: 'Architecture monolithique non modulaire', en: 'Non-modular monolithic architecture' },
  { code: 'C-27', group: 'Documentation & Architecture', fr: 'Microservices / API-first', en: 'Microservices / API-first' },
  // Dette technique & Dépendances
  { code: 'C-28', group: 'Dette technique & Dépendances', fr: 'Dette technique mineure identifiée', en: 'Minor technical debt identified' },
  { code: 'C-29', group: 'Dette technique & Dépendances', fr: 'Dette technique significative documentée', en: 'Significant technical debt documented' },
  { code: 'C-30', group: 'Dette technique & Dépendances', fr: 'Dette technique critique', en: 'Critical technical debt' },
  { code: 'C-31', group: 'Dette technique & Dépendances', fr: 'Dépendances à jour (<12 mois)', en: 'Dependencies up to date (<12 months)' },
  { code: 'C-32', group: 'Dette technique & Dépendances', fr: 'Dépendances partiellement obsolètes (12–24 mois)', en: 'Partially outdated dependencies (12–24 months)' },
  { code: 'C-33', group: 'Dette technique & Dépendances', fr: 'Dépendances fortement obsolètes (>24 mois)', en: 'Severely outdated dependencies (>24 months)' },
  { code: 'C-34', group: 'Dette technique & Dépendances', fr: 'CVE critiques identifiées (non résolues)', en: 'Critical CVEs identified (unresolved)' },
  { code: 'C-35', group: 'Dette technique & Dépendances', fr: 'Librairies non maintenues', en: 'Unmaintained libraries' },
  // Certification & Traçabilité
  { code: 'C-36', group: 'Certification & Traçabilité', fr: 'Code certifié KRYV Protocol', en: 'Code certified by KRYV Protocol' },
  { code: 'C-37', group: 'Certification & Traçabilité', fr: 'Versionné correctement (Git clean)', en: 'Properly versioned (clean Git)' },
  { code: 'C-38', group: 'Certification & Traçabilité', fr: 'Versionné partiellement', en: 'Partially versioned' },
  { code: 'C-39', group: 'Certification & Traçabilité', fr: 'Non versionné', en: 'Unversioned' },
  { code: 'C-40', group: 'Certification & Traçabilité', fr: 'Secrets exposés (credentials en dur)', en: 'Exposed secrets (hardcoded credentials)' },
  { code: 'C-41', group: 'Certification & Traçabilité', fr: 'Gestion des secrets sécurisée (vault)', en: 'Secure secrets management (vault)' },
  // Spécial
  { code: 'C-*',  group: 'Spécial', fr: "Revue technique recommandée, à la charge de l'acquéreur", en: "Technical review recommended, at buyer's expense" },
  { code: 'C-**', group: 'Spécial', fr: 'Refactoring requis, à chiffrer avant signing', en: 'Refactoring required, to be costed before signing' },
]

export const IP_SUBCODES: SubcodeDef[] = [
  // Marques & Identité
  { code: 'I-11', group: 'Marques & Identité', fr: 'Marque verbale déposée (pays principal)', en: 'Verbal trademark registered (main country)' },
  { code: 'I-12', group: 'Marques & Identité', fr: 'Marque combinée déposée', en: 'Combined trademark registered' },
  { code: 'I-13', group: 'Marques & Identité', fr: 'Marque déposée — extension internationale (EUIPO/WIPO)', en: 'Trademark — international extension (EUIPO/WIPO)' },
  { code: 'I-14', group: 'Marques & Identité', fr: 'Marque en cours de dépôt', en: 'Trademark application pending' },
  { code: 'I-15', group: 'Marques & Identité', fr: 'Marque non déposée (disponibilité vérifiée)', en: 'Trademark not registered (availability verified)' },
  { code: 'I-16', group: 'Marques & Identité', fr: 'Marque non déposée (disponibilité non vérifiée)', en: 'Trademark not registered (availability unverified)' },
  { code: 'I-17', group: 'Marques & Identité', fr: 'Opposition de marque en cours', en: 'Trademark opposition pending' },
  { code: 'I-18', group: 'Marques & Identité', fr: 'Contentieux de marque identifié', en: 'Trademark dispute identified' },
  // Droits logiciels & Contrats
  { code: 'I-19', group: 'Droits logiciels & Contrats', fr: 'Droits logiciels totalement formalisés (cessions signées)', en: 'Software rights fully formalised (assignments signed)' },
  { code: 'I-20', group: 'Droits logiciels & Contrats', fr: 'Droits logiciels partiellement formalisés', en: 'Software rights partially formalised' },
  { code: 'I-21', group: 'Droits logiciels & Contrats', fr: 'Droits logiciels non formalisés', en: 'Software rights not formalised' },
  { code: 'I-22', group: 'Droits logiciels & Contrats', fr: 'Contrats employés/prestataires avec cession de droits', en: 'Employee/contractor contracts with IP assignment' },
  { code: 'I-23', group: 'Droits logiciels & Contrats', fr: 'Contrats partiels — régularisation recommandée', en: 'Partial contracts — regularisation recommended' },
  { code: 'I-24', group: 'Droits logiciels & Contrats', fr: 'Contrats absents — prestataires tiers identifiés', en: 'Contracts absent — third-party contributors identified' },
  // Licences open source
  { code: 'I-25', group: 'Licences open source', fr: 'Licences conformes uniquement (MIT / Apache / BSD)', en: 'Compliant licences only (MIT / Apache / BSD)' },
  { code: 'I-26', group: 'Licences open source', fr: 'Licence GPL présente — risque de contamination', en: 'GPL licence present — contamination risk' },
  { code: 'I-27', group: 'RGPD Transfer', fr: 'Transferts RGPD conformes (SCCs / adéquation)', en: 'GDPR transfers compliant (SCCs / adequacy)' },
  { code: 'I-28', group: 'RGPD Transfer', fr: 'Transferts RGPD en attente de conformité', en: 'GDPR transfers pending compliance' },
  { code: 'I-29', group: 'RGPD Transfer', fr: 'Transferts RGPD bloquants — remédiation requise', en: 'GDPR transfers blocking — remediation required' },
  { code: 'I-40', group: 'Licences open source', fr: 'Licence LGPL présente — usage restreint', en: 'LGPL licence present — restricted use' },
  { code: 'I-41', group: 'Licences open source', fr: 'Licences non auditées', en: 'Licences unaudited' },
  { code: 'I-42', group: 'Licences open source', fr: 'Dépendance propriétaire critique (vendor lock-in)', en: 'Critical proprietary dependency (vendor lock-in)' },
  // APIs & Contrats tiers
  { code: 'I-30', group: 'APIs & Contrats tiers', fr: 'Contrats APIs tierces critiques en ordre', en: 'Critical third-party API contracts in order' },
  { code: 'I-31', group: 'APIs & Contrats tiers', fr: 'Contrats APIs partiels', en: 'Partial API contracts' },
  { code: 'I-32', group: 'APIs & Contrats tiers', fr: 'APIs critiques sans contrat formel', en: 'Critical APIs without formal contract' },
  { code: 'I-33', group: 'APIs & Contrats tiers', fr: 'Dépendance API unique critique non contractualisée', en: 'Single critical API dependency without contract' },
  // RGPD & Données
  { code: 'I-34', group: 'RGPD & Données', fr: 'RGPD/LPD conforme (DPA, mentions, consentements)', en: 'GDPR/LPD compliant (DPA, notices, consents)' },
  { code: 'I-35', group: 'RGPD & Données', fr: 'RGPD/LPD partiellement conforme', en: 'GDPR/LPD partially compliant' },
  { code: 'I-36', group: 'RGPD & Données', fr: 'RGPD/LPD non évalué', en: 'GDPR/LPD not assessed' },
  { code: 'I-37', group: 'RGPD & Données', fr: 'Transfert de données utilisateurs complexe', en: 'Complex user data transfer' },
  // Outils Aegryn
  { code: 'I-38', group: 'Outils Aegryn', fr: 'Analyse contractuelle subblink réalisée', en: 'subblink contractual analysis completed' },
  { code: 'I-39', group: 'Outils Aegryn', fr: 'Analyse subblink partielle', en: 'Partial subblink analysis' },
  // Spécial
  { code: 'I-*',  group: 'Spécial', fr: 'Régularisation IP recommandée, avant ou après signing', en: 'IP regularisation recommended, before or after signing' },
  { code: 'I-**', group: 'Spécial', fr: 'Régularisation IP requise avant tout transfert', en: 'IP regularisation required before any transfer' },
]

export const FINANCE_SUBCODES: SubcodeDef[] = [
  // Base de revenus
  { code: 'F-11a', group: 'Base de revenus', fr: 'ARR audité — commissaire aux comptes co-signataire (niveau Audited)', en: 'ARR audited — co-signatory statutory auditor (Audited level)' },
  { code: 'F-11b', group: 'Base de revenus', fr: 'ARR vérifiable — export Stripe / Chargebee certifié tiers (niveau Verifiable)', en: 'ARR verifiable — certified Stripe / Chargebee export (Verifiable level)' },
  { code: 'F-11c', group: 'Base de revenus', fr: 'ARR déclaratif — auto-déclaré, cohérence vérifiée (niveau Declarative)', en: 'ARR declarative — self-declared, consistency verified (Declarative level)' },
  { code: 'F-12', group: 'Base de revenus', fr: 'ARR auto-déclaré (cohérence vérifiée)', en: 'ARR self-declared (consistency verified)' },
  { code: 'F-13', group: 'Base de revenus', fr: 'ARR non vérifié', en: 'ARR unverified' },
  { code: 'F-14', group: 'Base de revenus', fr: 'Pre-revenue (pas d\'ARR)', en: 'Pre-revenue (no ARR)' },
  { code: 'F-15', group: 'Base de revenus', fr: 'MRR en croissance (>3 mois consécutifs)', en: 'MRR growing (>3 consecutive months)' },
  { code: 'F-16', group: 'Base de revenus', fr: 'MRR stable', en: 'MRR stable' },
  { code: 'F-17', group: 'Base de revenus', fr: 'MRR en décroissance', en: 'MRR declining' },
  // Rétention
  { code: 'F-18', group: 'Rétention', fr: 'NRR > 120%', en: 'NRR > 120%' },
  { code: 'F-19', group: 'Rétention', fr: 'NRR 100–120%', en: 'NRR 100–120%' },
  { code: 'F-20', group: 'Rétention', fr: 'NRR 90–100%', en: 'NRR 90–100%' },
  { code: 'F-21', group: 'Rétention', fr: 'NRR < 90%', en: 'NRR < 90%' },
  { code: 'F-22', group: 'Rétention', fr: 'Churn mensuel < 2%', en: 'Monthly churn < 2%' },
  { code: 'F-23', group: 'Rétention', fr: 'Churn mensuel 2–5%', en: 'Monthly churn 2–5%' },
  { code: 'F-24', group: 'Rétention', fr: 'Churn mensuel > 5%', en: 'Monthly churn > 5%' },
  // Croissance
  { code: 'F-25', group: 'Croissance', fr: 'Croissance YoY > 40%', en: 'YoY growth > 40%' },
  { code: 'F-26', group: 'Croissance', fr: 'Croissance YoY 25–40%', en: 'YoY growth 25–40%' },
  { code: 'F-27', group: 'Croissance', fr: 'Croissance YoY 10–25%', en: 'YoY growth 10–25%' },
  { code: 'F-28', group: 'Croissance', fr: 'Croissance stable (0–10%)', en: 'Stable growth (0–10%)' },
  { code: 'F-29', group: 'Croissance', fr: 'Décroissance YoY', en: 'YoY decline' },
  // Rentabilité & Marges
  { code: 'F-30', group: 'Rentabilité & Marges', fr: 'Marges brutes > 75%', en: 'Gross margins > 75%' },
  { code: 'F-31', group: 'Rentabilité & Marges', fr: 'Marges brutes 55–75%', en: 'Gross margins 55–75%' },
  { code: 'F-32', group: 'Rentabilité & Marges', fr: 'Marges brutes 35–55%', en: 'Gross margins 35–55%' },
  { code: 'F-33', group: 'Rentabilité & Marges', fr: 'Marges brutes < 35%', en: 'Gross margins < 35%' },
  { code: 'F-34', group: 'Rentabilité & Marges', fr: 'EBITDA positif', en: 'Positive EBITDA' },
  { code: 'F-35', group: 'Rentabilité & Marges', fr: 'Burn rate documenté et maîtrisé', en: 'Documented and controlled burn rate' },
  { code: 'F-36', group: 'Rentabilité & Marges', fr: 'Burn rate non documenté', en: 'Undocumented burn rate' },
  // Structure client
  { code: 'F-37', group: 'Structure client', fr: 'Base client diversifiée (aucun > 20%)', en: 'Diversified client base (none > 20%)' },
  { code: 'F-38', group: 'Structure client', fr: 'Concentration modérée (1 client 20–30%)', en: 'Moderate concentration (1 client 20–30%)' },
  { code: 'F-39', group: 'Structure client', fr: 'Concentration élevée (1 client > 30%)', en: 'High concentration (1 client > 30%)' },
  { code: 'F-40', group: 'Structure client', fr: 'LTV:CAC > 5:1', en: 'LTV:CAC > 5:1' },
  { code: 'F-41', group: 'Structure client', fr: 'LTV:CAC 3:1–5:1', en: 'LTV:CAC 3:1–5:1' },
  { code: 'F-42', group: 'Dépendance fondateur', fr: 'Score dépendance fondateur — 5 critères objectifs (voir protocole CIFS v3.0)', en: 'Founder dependency score — 5 objective criteria (see CIFS v3.0 protocol)' },
  // Ancienneté & Piste
  { code: 'F-43', group: 'Ancienneté & Piste', fr: 'Revenus prouvés > 24 mois', en: 'Revenues proven > 24 months' },
  { code: 'F-44', group: 'Ancienneté & Piste', fr: 'Revenus prouvés 12–24 mois', en: 'Revenues proven 12–24 months' },
  { code: 'F-45', group: 'Ancienneté & Piste', fr: 'Revenus prouvés < 12 mois', en: 'Revenues proven < 12 months' },
  { code: 'F-46', group: 'Ancienneté & Piste', fr: 'Pipeline commercial documenté', en: 'Documented sales pipeline' },
  // Spécial
  { code: 'F-*',  group: 'Spécial', fr: "Due diligence financière approfondie recommandée à l'acquéreur", en: 'Detailed financial due diligence recommended for buyer' },
  { code: 'F-**', group: 'Spécial', fr: 'Audit comptable indépendant requis avant closing', en: 'Independent accounting audit required before closing' },
]

export const SECURITY_SUBCODES: SubcodeDef[] = [
  // Tests de sécurité
  { code: 'S-11', group: 'Tests de sécurité', fr: 'Pentest < 6 mois — aucune vulnérabilité critique', en: 'Pentest < 6 months — no critical vulnerabilities' },
  { code: 'S-12', group: 'Tests de sécurité', fr: 'Pentest 6–12 mois — résultats satisfaisants', en: 'Pentest 6–12 months — satisfactory results' },
  { code: 'S-13', group: 'Tests de sécurité', fr: 'Pentest > 12 mois', en: 'Pentest > 12 months' },
  { code: 'S-14', group: 'Tests de sécurité', fr: 'Pentest absent', en: 'No pentest' },
  { code: 'S-15', group: 'Tests de sécurité', fr: 'Vulnérabilités critiques résolues', en: 'Critical vulnerabilities resolved' },
  { code: 'S-16', group: 'Tests de sécurité', fr: 'Pentest qualifié — méthodologie OWASP/PTES, auditeur certifié (OSCP/CREST)', en: 'Qualified pentest — OWASP/PTES methodology, certified auditor (OSCP/CREST)' },
  { code: 'S-17', group: 'Tests de sécurité', fr: 'Vulnérabilités critiques non résolues', en: 'Unresolved critical vulnerabilities' },
  // Authentification & Accès
  { code: 'S-18', group: 'Authentification & Accès', fr: 'MFA implémenté (admin + utilisateurs)', en: 'MFA implemented (admin + users)' },
  { code: 'S-19', group: 'Authentification & Accès', fr: 'MFA partiel (admin uniquement)', en: 'Partial MFA (admin only)' },
  { code: 'S-20', group: 'Authentification & Accès', fr: 'MFA absent', en: 'No MFA' },
  { code: 'S-21', group: 'Authentification & Accès', fr: "Contrôle d'accès par rôle (RBAC)", en: 'Role-based access control (RBAC)' },
  { code: 'S-22', group: 'Authentification & Accès', fr: "Contrôle d'accès minimal", en: 'Minimal access control' },
  // Chiffrement & Infrastructure
  { code: 'S-23', group: 'Chiffrement & Infrastructure', fr: 'Chiffrement au repos et en transit', en: 'Encryption at rest and in transit' },
  { code: 'S-24', group: 'Chiffrement & Infrastructure', fr: 'Chiffrement en transit uniquement', en: 'Encryption in transit only' },
  { code: 'S-25', group: 'Chiffrement & Infrastructure', fr: 'Chiffrement absent ou partiel', en: 'Absent or partial encryption' },
  { code: 'S-26', group: 'Chiffrement & Infrastructure', fr: 'Gestion des secrets sécurisée (vault, HSM)', en: 'Secure secrets management (vault, HSM)' },
  { code: 'S-27', group: 'Chiffrement & Infrastructure', fr: 'Gestion des secrets insuffisante', en: 'Insufficient secrets management' },
  // Conformité réglementaire
  { code: 'S-28', group: 'Conformité réglementaire', fr: 'RGPD/LPD conforme — DPA, registre de traitement', en: 'GDPR/LPD compliant — DPA, processing register' },
  { code: 'S-29', group: 'Conformité réglementaire', fr: 'RGPD/LPD partiellement conforme', en: 'GDPR/LPD partially compliant' },
  { code: 'S-30', group: 'Conformité réglementaire', fr: 'RGPD/LPD non évalué', en: 'GDPR/LPD not assessed' },
  { code: 'S-31', group: 'Conformité réglementaire', fr: 'NIS2 conforme (si applicable)', en: 'NIS2 compliant (if applicable)' },
  { code: 'S-32', group: 'Conformité réglementaire', fr: 'NIS2 non évalué', en: 'NIS2 not assessed' },
  { code: 'S-33', group: 'Conformité réglementaire', fr: 'ISO 27001 ou SOC 2 certifié', en: 'ISO 27001 or SOC 2 certified' },
  { code: 'S-34', group: 'Conformité réglementaire', fr: 'Certification en cours', en: 'Certification in progress' },
  // Historique de sécurité
  { code: 'S-35', group: 'Historique de sécurité', fr: 'Aucun incident de sécurité déclaré', en: 'No declared security incidents' },
  { code: 'S-36', group: 'Historique de sécurité', fr: 'Incident(s) passé(s) résolu(s) et documenté(s)', en: 'Past incident(s) resolved and documented' },
  { code: 'S-37', group: 'Historique de sécurité', fr: 'Incident(s) en cours ou non résolu(s)', en: 'Ongoing or unresolved incident(s)' },
  { code: 'S-38', group: 'Historique de sécurité', fr: 'Plan de continuité (PCA/PRA) documenté', en: 'Business continuity plan (BCP/DRP) documented' },
  // Certification partenaire
  { code: 'S-39', group: 'Certification partenaire', fr: 'Audit co-signé partenaire cybersécurité Aegryn', en: 'Audit co-signed by Aegryn cybersecurity partner' },
  { code: 'S-40', group: 'Certification partenaire', fr: 'Audit partenaire en cours', en: 'Partner audit in progress' },
  // Spécial
  { code: 'S-*',  group: 'Spécial', fr: "Audit de sécurité approfondi recommandé, à la charge de l'acquéreur", en: "Detailed security audit recommended, at buyer's expense" },
  { code: 'S-**', group: 'Spécial', fr: 'Remédiation sécurité requise avant transfert', en: 'Security remediation required before transfer' },
]

export const SUBCODES_BY_DIMENSION = {
  code:     CODE_SUBCODES,
  ip:       IP_SUBCODES,
  finance:  FINANCE_SUBCODES,
  security: SECURITY_SUBCODES,
} as const

export type DimensionKey = keyof typeof SUBCODES_BY_DIMENSION

/* ─────────────────────────────────────────────────────────────────────────
 * AEG — Aegryn EXPERT GRADE
 * ────────────────────────────────────────────────────────────────────── */

export type AEGGrade = 'star' | 'aaa' | 'aa' | 'a' | 'b' | 'refused'

export const AEG_LABEL: Record<AEGGrade, { symbol: string; fr: string; en: string; threshold: string }> = {
  star:    { symbol: '★',   fr: 'Exceptionnel', en: 'Exceptional', threshold: '≥ 90/100 + rareté significative' },
  aaa:     { symbol: 'AAA', fr: 'Excellent',     en: 'Excellent',  threshold: '≥ 75/100' },
  aa:      { symbol: 'AA',  fr: 'Très bon',      en: 'Very good',  threshold: '≥ 60/100' },
  a:       { symbol: 'A',   fr: 'Bon',           en: 'Good',       threshold: '≥ 45/100' },
  b:       { symbol: 'B',   fr: 'Correct',       en: 'Fair',       threshold: '≥ 30/100' },
  refused: { symbol: '✕',   fr: 'Refusé',        en: 'Refused',    threshold: '< 30/100 ou déficience rédhibitoire' },
}

export const AEG_COLORS: Record<AEGGrade, string> = {
  star:    'var(--grade-star)',
  aaa:     'var(--grade-aaa)',
  aa:      'var(--grade-aa)',
  a:       'var(--grade-a)',
  b:       'var(--grade-b)',
  refused: 'var(--grade-refused, #C0392B)',
}

/** Suggestion algorithmique — l'expert reste libre d'attribuer un AEG différent */
export function suggestAegFromScore(total: number): AEGGrade {
  if (total >= 90) return 'star'
  if (total >= 75) return 'aaa'
  if (total >= 60) return 'aa'
  if (total >= 45) return 'a'
  if (total >= 30) return 'b'
  return 'refused'
}

/* ─────────────────────────────────────────────────────────────────────────
 * REFUS AUTOMATIQUE — indépendant du score, quel que soit le total
 * ────────────────────────────────────────────────────────────────────── */

export interface AutoRefusalResult {
  refused: boolean
  reasons: string[]
}

export function checkAutoRefusal(subcodes: {
  code: string[]
  ip: string[]
  finance: string[]
  security: string[]
}): AutoRefusalResult {
  const reasons: string[] = []

  if (subcodes.code.includes('C-40') && subcodes.code.includes('C-34')) {
    reasons.push('Secrets exposés + CVE critiques non résolues (C-40 + C-34)')
  }
  if (subcodes.ip.includes('I-18')) {
    reasons.push('Contentieux de marque actif (I-18)')
  }
  if (subcodes.ip.includes('I-21')) {
    reasons.push('Droits logiciels non formalisés sur codebase produit par des tiers (I-21)')
  }
  if (subcodes.security.includes('S-17')) {
    reasons.push('Vulnérabilités critiques de sécurité non résolues (S-17)')
  }
  if (subcodes.security.includes('S-37')) {
    reasons.push('Incident de sécurité en cours non résolu (S-37)')
  }

  return { refused: reasons.length > 0, reasons }
}

/* ─────────────────────────────────────────────────────────────────────────
 * RÈGLES D'ÉLIGIBILITÉ PAR MATURITÉ (équivalent des règles d'âge Antiquorum)
 * ────────────────────────────────────────────────────────────────────── */

export type MaturityTier = 'pre_revenue' | 'm6_12' | 'm12_24' | 'gt24' | 'pre_revenue_ip'

export interface MaturityRule {
  tier: MaturityTier
  label: string
  maxAeg: AEGGrade | null   // null = pas de plafond
  rule: string
}

export const MATURITY_RULES: MaturityRule[] = [
  {
    tier: 'pre_revenue',
    label: 'Pre-revenue / < 6 mois de traction',
    maxAeg: 'a',
    rule: "Grade ★/AAA/AA impossible sur F. Grade C possible uniquement si I=1 et C=1. AEG maximum : A.",
  },
  {
    tier: 'm6_12',
    label: '6–12 mois de revenus',
    maxAeg: null,
    rule: 'NRR non significatif (période trop courte). F basé sur croissance et qualité des métriques unitaires (LTV:CAC, churn).',
  },
  {
    tier: 'm12_24',
    label: '12–24 mois de revenus',
    maxAeg: null,
    rule: 'Évaluation standard complète. Tous les grades possibles.',
  },
  {
    tier: 'gt24',
    label: '> 24 mois de revenus',
    maxAeg: null,
    rule: 'ARR audité requis pour F-1 ou F-2. Historique de rétention NRR sur au moins 4 trimestres.',
  },
  {
    tier: 'pre_revenue_ip',
    label: 'Pre-revenue avec IP exceptionnelle',
    maxAeg: 'a',
    rule: 'Valorisation sur actifs tangibles uniquement. Dimension F note spéciale "Pre-revenue" sans note numérique. AEG maximum : A.',
  },
]

export function deriveMaturityTier(revenueTrackMonths: number | null | undefined): MaturityTier {
  if (revenueTrackMonths == null || revenueTrackMonths <= 0) return 'pre_revenue'
  if (revenueTrackMonths < 12) return 'm6_12'
  if (revenueTrackMonths < 24) return 'm12_24'
  return 'gt24'
}

const AEG_RANK: Record<AEGGrade, number> = { refused: 0, b: 1, a: 2, aa: 3, aaa: 4, star: 5 }

/** Plafonne un AEG suggéré selon la règle de maturité applicable */
export function capAegByMaturity(aeg: AEGGrade, tier: MaturityTier): AEGGrade {
  const rule = MATURITY_RULES.find(r => r.tier === tier)
  if (!rule?.maxAeg) return aeg
  return AEG_RANK[aeg] > AEG_RANK[rule.maxAeg] ? rule.maxAeg : aeg
}

/* ─────────────────────────────────────────────────────────────────────────
 * PROOF QUALITY — plafond de grade par niveau de preuve (CIFS v3.0)
 * ────────────────────────────────────────────────────────────────────── */

/**
 * Niveau de preuve par dimension :
 *   declarative → toutes les données sont auto-déclarées → plafond AA
 *   verifiable  → au moins une donnée vérifiable (export certifié, URL) → plafond AAA
 *   audited     → au moins une donnée auditée par tiers indépendant → grade ★ accessible
 */
export type ProofQuality = 'declarative' | 'verifiable' | 'audited'

export const PROOF_QUALITY_LABEL: Record<ProofQuality, { fr: string; en: string; ceiling: AEGGrade }> = {
  declarative: { fr: 'Déclaratif',   en: 'Declarative',  ceiling: 'aa' },
  verifiable:  { fr: 'Vérifiable',   en: 'Verifiable',   ceiling: 'aaa' },
  audited:     { fr: 'Audité',       en: 'Audited',      ceiling: 'star' },
}

/**
 * Calcule le plafond de grade résultant des niveaux de preuve des 4 dimensions.
 * Règle : le plafond global = min(plafond de chaque dimension)
 */
export function capAegByProofQuality(
  aeg: AEGGrade,
  proofQualities: { code: ProofQuality; ip: ProofQuality; finance: ProofQuality; security: ProofQuality },
): AEGGrade {
  const ceilings = [
    PROOF_QUALITY_LABEL[proofQualities.code].ceiling,
    PROOF_QUALITY_LABEL[proofQualities.ip].ceiling,
    PROOF_QUALITY_LABEL[proofQualities.finance].ceiling,
    PROOF_QUALITY_LABEL[proofQualities.security].ceiling,
  ]
  const minCeiling = ceilings.reduce((min, c) =>
    AEG_RANK[c] < AEG_RANK[min] ? c : min
  )
  return AEG_RANK[aeg] > AEG_RANK[minCeiling] ? minCeiling : aeg
}

/* ─────────────────────────────────────────────────────────────────────────
 * FORMATAGE NOTATION — style Antiquorum : "C 2-11-14-17  I 1-11-16-25 ..."
 * ────────────────────────────────────────────────────────────────────── */

export function formatDimensionNotation(prefix: 'C' | 'I' | 'F' | 'S', note: GradeNote, subcodes: string[]): string {
  const numbers = subcodes
    .map(c => c.split('-')[1])
    .filter(Boolean)
  return numbers.length > 0 ? `${prefix} ${note}-${numbers.join('-')}` : `${prefix} ${note}`
}

export function formatGradeNotation(input: {
  scoreCode: number; scoreIp: number; scoreFinance: number; scoreSecurity: number
  subcodesCode: string[]; subcodesIp: string[]; subcodesFinance: string[]; subcodesSecurity: string[]
}): string {
  return [
    formatDimensionNotation('C', scoreToNote(input.scoreCode),     input.subcodesCode),
    formatDimensionNotation('I', scoreToNote(input.scoreIp),       input.subcodesIp),
    formatDimensionNotation('F', scoreToNote(input.scoreFinance),  input.subcodesFinance),
    formatDimensionNotation('S', scoreToNote(input.scoreSecurity), input.subcodesSecurity),
  ].join('   ')
}
