/**
 * Migration 021 — grade_assessments
 *
 * Table d'audit trail pour les évaluations AEGRYN Grade.
 * Stocke :
 *   - les données factuelles saisies par l'admin (input_json)
 *   - le résultat brut du moteur (engine_result_json)
 *   - le grade calculé automatiquement
 *   - le grade final retenu (peut différer si override admin)
 *   - la note interne d'override (jamais exposée client)
 *   - le rationnel public généré (exposable dans la fiche actif)
 *   - qui a fait quoi et quand
 */

CREATE TABLE IF NOT EXISTS public.grade_assessments (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id              UUID          NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  admin_id              UUID          NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Données factuelles brutes saisies (JSON structuré, 4 dimensions)
  input_json            JSONB         NOT NULL,

  -- Résultat brut du moteur (scores par dimension, rationnel, refus auto)
  engine_result_json    JSONB         NOT NULL,

  -- Grade calculé par le moteur
  computed_grade        TEXT          NOT NULL
                                      CHECK (computed_grade IN ('star','aaa','aa','a','b','refused')),
  computed_score        NUMERIC(5,2)  NOT NULL,  -- 0-100

  -- Grade final retenu (peut être overridé par l'admin)
  final_grade           TEXT          NOT NULL
                                      CHECK (final_grade IN ('star','aaa','aa','a','b','refused')),
  final_score           NUMERIC(5,2)  NOT NULL,

  -- Override admin (obligatoire si final_grade ≠ computed_grade)
  is_overridden         BOOLEAN       NOT NULL DEFAULT false,
  override_note         TEXT,         -- note interne admin, jamais exposée client

  -- Rationnel public (généré par le moteur, éditable par admin avant publication)
  public_rationale      TEXT,

  -- Statut de l'évaluation
  status                TEXT          NOT NULL DEFAULT 'draft'
                                      CHECK (status IN ('draft', 'validated', 'published', 'superseded')),

  created_at            TIMESTAMPTZ   NOT NULL DEFAULT now(),
  validated_at          TIMESTAMPTZ,
  published_at          TIMESTAMPTZ,

  CONSTRAINT override_note_required
    CHECK (NOT is_overridden OR override_note IS NOT NULL)
);

COMMENT ON TABLE public.grade_assessments IS
  'Audit trail complet des évaluations AEGRYN Grade. Chaque ligne = une session de notation admin.
   La logique de pondération reste dans lib/gradeEngine.ts (serveur uniquement), jamais en base.';

COMMENT ON COLUMN public.grade_assessments.input_json IS
  'Données factuelles brutes saisies par l''admin : testCoverage, criticalVulnOpen, arr, churn, etc.';

COMMENT ON COLUMN public.grade_assessments.engine_result_json IS
  'Résultat complet du moteur de calcul : scores C/I/F/S, autoRefusal, rationale par dimension.';

COMMENT ON COLUMN public.grade_assessments.override_note IS
  'Justification obligatoire si le grade final diffère du grade calculé. Usage interne AEGRYN uniquement.';

COMMENT ON COLUMN public.grade_assessments.public_rationale IS
  'Résumé qualitatif exposable dans la fiche actif cataloguée. Sans chiffres de pondération.';

-- Index
CREATE INDEX IF NOT EXISTS grade_assessments_asset_idx
  ON public.grade_assessments (asset_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS grade_assessments_admin_idx
  ON public.grade_assessments (admin_id, created_at DESC);

-- RLS — service_role uniquement (les admins passent par les routes API serveur)
ALTER TABLE public.grade_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_grade_assessments"
  ON public.grade_assessments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
