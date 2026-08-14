/**
 * Migration 068 — grade_assessments TRS + recommendations (CIFS v3.0 Sprint 4)
 *
 * Persiste les nouveaux champs calculés par gradeEngine.ts :
 *   - trs             : Transaction Readiness Score (ready/conditional/remediation/blocked)
 *   - trs_reasons     : Justifications du TRS (tableau JSON)
 *   - recommendations : Actions actionnables par sous-code en défaut (tableau JSON)
 *
 * Ces colonnes permettent d'afficher TRS et recommandations dans le rapport
 * vendeur, le dossier acheteur post-NDA, et l'espace admin — sans recalcul.
 *
 * Compatibilité ascendante : colonnes nullable avec DEFAULT approprié.
 */

ALTER TABLE public.grade_assessments
  ADD COLUMN IF NOT EXISTS trs TEXT
    CHECK (trs IN ('ready', 'conditional', 'remediation', 'blocked') OR trs IS NULL),
  ADD COLUMN IF NOT EXISTS trs_reasons   JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.grade_assessments.trs IS
  'Transaction Readiness Score calculé par le moteur : ready | conditional | remediation | blocked.
   NULL pour les assessments antérieurs à CIFS v3.0.';

COMMENT ON COLUMN public.grade_assessments.trs_reasons IS
  'Justifications du TRS — tableau de strings générées par computeTRS().
   Exemple : ["Runway effectif < 3 mois", "Dépendance fondateur maximale"]';

COMMENT ON COLUMN public.grade_assessments.recommendations IS
  'Recommandations actionnables générées par buildRecommendations().
   Format : [{ dimension, subcode, priority, action, effort, impact }]
   Exposables dans le rapport vendeur et le dossier acheteur post-NDA.';

-- Index TRS pour filtrer les actifs par readiness
CREATE INDEX IF NOT EXISTS grade_assessments_trs_idx
  ON public.grade_assessments (trs, status)
  WHERE trs IS NOT NULL AND status IN ('validated', 'published');
