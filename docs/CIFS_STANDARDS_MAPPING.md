# AEGRYN CIFS Standards Mapping, v3.0 (Août 2026)

> Document éditorial interne, NE PAS exposer publiquement.  
> Référence : `lib/gradingSystem.ts` (source de vérité des sous-codes) et `lib/gradeEngine.ts` (logique de scoring).

---

## 1. Vue d'ensemble des améliorations CIFS v3.0

| Amélioration | Impact scoring | Fichiers modifiés |
|---|---|---|
| `proof_quality`, plafond de grade par niveau de preuve | Plafond global = min(niveau par dimension) | `gradingSystem.ts`, `gradeEngine.ts`, `GradeEngineForm.tsx`, `route.ts` |
| `arrAudited` 3 niveaux (déclaratif / vérifiable / audité) | +0/+1/+2 pts sur F | `gradeEngine.ts`, `docToSubcodeMap.ts`, `gradeAutoFill.ts`, `route.ts`, `GradeEngineForm.tsx` |
| I-27 RGPD Transfer Readiness (nouveau sous-code) | Blocage auto si `blocking`, -1 pt si `warning` | `gradingSystem.ts`, `gradeEngine.ts`, `GradeEngineForm.tsx`, `route.ts` |
| F-42 Founder Dependency Score (5 critères objectifs) | Pénalité -1/-2/-3 pts sur F | `gradingSystem.ts`, `gradeEngine.ts`, `GradeEngineForm.tsx`, `route.ts` |
| S-16 Qualification pentest (OWASP/PTES + OSCP/CREST) | Bonus +1 pt méthodo + +1 pt cert (max 7 pts pentest) | `gradingSystem.ts`, `gradeEngine.ts`, `GradeEngineForm.tsx`, `route.ts` |
| Renommage I-27→I-40, I-28→I-41, I-29→I-42 | Éditorial uniquement, 0 impact scoring | `gradingSystem.ts`, `docToSubcodeMap.ts` |

---

## 2. Proof Quality, Plafonds de grade

| Niveau | Définition | Plafond global |
|---|---|---|
| `declarative` | Toutes les données sont auto-déclarées par le cédant | **AA** (ni AAA ni ★ accessibles) |
| `verifiable` | Au moins une donnée vérifiable par tiers (export certifié, URL) | **AAA** (★ non accessible) |
| `audited` | Au moins une donnée auditée par tiers indépendant (CAC, expert certifié) | **★** (aucun plafond) |

> **Règle** : le plafond global est le **minimum** des plafonds des 4 dimensions (C/I/F/S).  
> Exemple : C=audited, I=audited, F=verifiable, S=declarative → plafond = AA.

---

## 3. ARR Audit Level, Mapping sous-codes (CIFS v3.0)

| Niveau `arrAudited` | Sous-code | Description | Points |
|---|---|---|---|
| `audited` | F-11a | ARR audité, Commissaire aux comptes co-signataire | +2 pts |
| `verifiable` | F-11b | ARR vérifiable, Export Stripe / Chargebee certifié tiers | +1 pt |
| `declarative` | F-11c | ARR déclaratif, Auto-déclaré, cohérence vérifiée | 0 pt |

> **Migration** : l'ancien booléen `arrAudited: 'yes'` est mappé sur `'audited'`, `'no'` sur `'declarative'`.  
> Les anciens enregistrements `input_json` (JSONB) avec `arrAudited: 'yes' | 'no'` restent lisibles, le moteur les traite comme `declarative` (comportement sûr par défaut).

---

## 4. Founder Dependency Score, F-42

| Critère | Champ `FounderDependencyInput` | Risque si `yes` |
|---|---|---|
| Fondateur présent dans >50% des appels commerciaux | `founderLeadsSales` | Concentration commerciale |
| Aucun N-1 capable de signer sans le fondateur | `noSigningDelegation` | Blocage opérationnel |
| Départ fondateur = perte >20% du CA estimée | `revenueAtRisk` | Risque de revenu direct |
| Pas de documentation opérationnelle | `noOperationalDocs` | Transfert de knowledge compromis |
| Aucun plan de succession documenté | `noSuccessionPlan` | Continuité non assurée |

**Barème** :
- 0 critère = 0 pt de pénalité (rationale positif)
- 1–2 critères = **-1 pt** sur F
- 3–4 critères = **-2 pts** sur F
- 5 critères = **-3 pts** sur F

---

## 5. RGPD Transfer Readiness, I-27/I-28/I-29

| Sous-code | Valeur `rgpdTransferReadiness` | Impact scoring |
|---|---|---|
| I-27 | `clean` | 0 pt (rationale positif) |
| I-28 | `warning` | **-1 pt** sur S |
| I-29 | `blocking` | **Refus automatique** (score S = 0, `autoRefusal: true`) |

> Note : I-40 (ex-I-27 LGPL), I-41 (ex-I-28 licences non auditées), I-42 (ex-I-29 vendor lock-in) sont des sous-codes éditoriaux IP sans impact direct sur le scoring.

---

## 6. Pentest Qualification, S-16

Le score pentest est désormais en deux temps :

1. **Base** (inchangée) :
   - ≤6 mois : 7 pts
   - ≤12 mois : 5 pts
   - ≤24 mois : 2 pts
   - Jamais : 0 pt

2. **Bonus qualification** (CIFS v3.0) :
   - Méthodologie OWASP/PTES : **+1 pt** (cappé à 7 pts max)
   - Auditeur certifié OSCP/CREST : **+1 pt** (cappé à 7 pts max)

> Un pentest ≤6 mois avec OWASP/PTES + OSCP/CREST reste plafonné à 7 pts (pas de dépassement).

---

## 7. Compatibilité ascendante, données existantes

| Champ | Ancien type | Nouveau type | Comportement sur ancien `input_json` |
|---|---|---|---|
| `arrAudited` | `'yes' \| 'no'` | `'declarative' \| 'verifiable' \| 'audited'` | `undefined` → traité comme `declarative` (0 pt) |
| `founderDependency` | absent | `FounderDependencyInput` (optionnel) | `undefined` → bloc fondateur ignoré (0 pénalité) |
| `pentestMethodology` | absent | optionnel | `undefined` → pas de bonus méthodo |
| `pentestAuditorCert` | absent | optionnel | `undefined` → pas de bonus cert |
| `rgpdTransferReadiness` | absent | optionnel | `undefined` → ni pénalité ni blocage |
| `proofQualities` | absent | optionnel | `undefined` → aucun plafond appliqué |

**Conclusion** : aucune migration SQL nécessaire. Les anciens `input_json` sont rétrocompatibles.

---

## 8. Fichiers impactés, résumé

| Fichier | Nature des changements |
|---|---|
| `lib/gradingSystem.ts` | Version 3.0, I-27→I-40, I-28→I-41, I-29→I-42, nouveaux I-27/I-28/I-29 (RGPD Transfer), F-11a/b/c, F-42 reformaté, S-16 enrichi, `ProofQuality` type + `capAegByProofQuality()` |
| `lib/gradeEngine.ts` | `ArrAuditLevel`, `FounderDependencyInput`, `PentestMethodology`, `PentestAuditorCert`, `rgpdTransferReadiness`, `proofQualities` dans `GradeInput`, `gradeCeiling` dans `GradeResult`, scoring mis à jour |
| `lib/docToSubcodeMap.ts` | `I-28→I-41` dans `onMissing`, `arrAudited: 'yes'→'audited'` |
| `lib/gradeAutoFill.ts` | Cast `ArrAuditLevel` |
| `app/api/…/grade-engine/route.ts` | Zod schemas : `arrAudited`, `founderDependencySchema`, pentest/rgpd champs optionnels, `proofQualityDimensionSchema` |
| `app/admin/…/GradeEngineForm.tsx` | Sélecteur 3 niveaux ARR, section F-42 checkboxes, champs S-16 + I-27, section proof_quality avec plafond live, sous-codes F-11a/b/c, S-16, affichage `gradeCeiling` |
| `docs/CIFS_STANDARDS_MAPPING.md` | Ce document |
