/**
 * Migration 067 — grade_assessments integrity (CIFS v3.0 Sprint 3)
 *
 * Ajoute sur grade_assessments :
 *   - input_hash      : SHA-256 des inputs bruts au moment du save officiel
 *                       Permet de détecter toute modification a posteriori des inputs
 *   - engine_analyst_id : UUID de l'analyste qui a rempli le moteur
 *   - grade_validator_id : UUID de l'analyste qui a validé le grade officiel
 *
 * Règle de gouvernance (non bloquante) :
 *   Pour les grades AAA et ★, engine_analyst_id ≠ grade_validator_id est recommandé.
 *   Cet écart est signalé dans l'UI mais n'est pas une contrainte CHECK (à ce stade).
 *
 * Compatibilité ascendante : toutes les colonnes sont nullable avec DEFAULT NULL.
 */

ALTER TABLE public.grade_assessments
  ADD COLUMN IF NOT EXISTS input_hash          TEXT,
  ADD COLUMN IF NOT EXISTS engine_analyst_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS grade_validator_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.grade_assessments.input_hash IS
  'SHA-256 hexadécimal de JSON.stringify(input_json) calculé au moment du save officiel (validate).
   Permet de vérifier l''intégrité des inputs après coup sans blockchain.
   Si input_json est modifié post-save, le hash diverge.';

COMMENT ON COLUMN public.grade_assessments.engine_analyst_id IS
  'UUID de l''admin qui a rempli le moteur (saisi les inputs et lancé le calcul).
   Peut être identique à grade_validator_id — dans ce cas un avertissement UI est affiché
   pour les grades AAA et ★ (gouvernance, pas contrainte dure).';

COMMENT ON COLUMN public.grade_assessments.grade_validator_id IS
  'UUID de l''admin qui a validé et signé le grade officiel.
   Pour maximiser la crédibilité des grades AAA/★, cet ID devrait différer de engine_analyst_id.';

-- Index sur l'analyste moteur
CREATE INDEX IF NOT EXISTS grade_assessments_engine_analyst_idx
  ON public.grade_assessments (engine_analyst_id)
  WHERE engine_analyst_id IS NOT NULL;

-- Index sur le validateur grade
CREATE INDEX IF NOT EXISTS grade_assessments_validator_idx
  ON public.grade_assessments (grade_validator_id)
  WHERE grade_validator_id IS NOT NULL;
