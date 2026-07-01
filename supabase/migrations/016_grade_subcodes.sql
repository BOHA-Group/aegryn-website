-- ════════════════════════════════════════════════════════════════════════
-- 016_grade_subcodes.sql
--
-- AEGRYN Grading System v1.0 (Antiquorum-inspired) — sous-codes détaillés
-- par dimension, données de maturité pour les règles d'éligibilité, et
-- catégorie de benchmark marché pour comparaison dans l'admin de grading.
--
-- Ne modifie PAS le modèle de score existant (score_code/ip/finance/security
-- 0-25, score_total généré, official_grade) afin de rester cohérent avec
-- /valuation qui partage la même grille (estimateGrade / lib/valuationEngine.ts).
-- Les sous-codes sont une couche de granularité ADDITIONNELLE (tags),
-- affichée en notation Antiquorum-style ("C 2-11-17-23 ...") sur les
-- fiches de lot, sans changer le calcul du score total.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.assets
  -- Sous-codes sélectionnés par dimension (ex: '{C-11,C-17,C-23}')
  ADD COLUMN IF NOT EXISTS subcodes_code        TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subcodes_ip          TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subcodes_finance     TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subcodes_security    TEXT[] NOT NULL DEFAULT '{}',

  -- Refus automatique (Partie 7) — renseigné par l'API lors du calcul,
  -- jamais choisi manuellement par l'admin
  ADD COLUMN IF NOT EXISTS auto_refusal_reasons TEXT[] NOT NULL DEFAULT '{}',

  -- Maturité de l'actif — pilote les règles d'éligibilité au catalogue (Partie 9)
  ADD COLUMN IF NOT EXISTS revenue_track_months INTEGER,

  -- Métriques utilisées pour le benchmark marché (auto-déclarées ou auditées)
  ADD COLUMN IF NOT EXISTS gross_margin         NUMERIC,   -- %
  ADD COLUMN IF NOT EXISTS nrr                  NUMERIC,   -- % Net Revenue Retention

  -- Catégorie de comparaison marché — doit correspondre à benchmark_data.category
  ADD COLUMN IF NOT EXISTS benchmark_category   TEXT
                            CHECK (benchmark_category IS NULL OR benchmark_category IN (
                              'saas_vertical', 'saas_horizontal', 'ai_native',
                              'marketplace', 'mobile_app', 'fintech', 'legaltech',
                              'healthtech', 'regtech', 'web3'
                            )),

  -- AEG (AEGRYN Expert Grade) — clé normalisée alignée sur transaction_results.grade_aeg
  -- ('star'|'aaa'|'aa'|'a'|'b'|'refused'). Coexiste avec official_grade (symbole '★'/'AAA'/...)
  -- conservé pour compatibilité ascendante avec l'UI existante.
  ADD COLUMN IF NOT EXISTS aeg_grade             TEXT
                            CHECK (aeg_grade IS NULL OR aeg_grade IN (
                              'star', 'aaa', 'aa', 'a', 'b', 'refused'
                            )),

  -- Version du référentiel de grading appliqué (traçabilité si évolution future)
  ADD COLUMN IF NOT EXISTS grading_version       TEXT NOT NULL DEFAULT '1.0';

CREATE INDEX IF NOT EXISTS assets_benchmark_category_idx ON public.assets (benchmark_category);
CREATE INDEX IF NOT EXISTS assets_aeg_grade_idx           ON public.assets (aeg_grade);

COMMENT ON COLUMN public.assets.subcodes_code     IS 'Sous-codes AEGRYN Grading System v1.0 — dimension Code (voir lib/gradingSystem.ts)';
COMMENT ON COLUMN public.assets.subcodes_ip       IS 'Sous-codes AEGRYN Grading System v1.0 — dimension IP & Droits';
COMMENT ON COLUMN public.assets.subcodes_finance  IS 'Sous-codes AEGRYN Grading System v1.0 — dimension Finance';
COMMENT ON COLUMN public.assets.subcodes_security IS 'Sous-codes AEGRYN Grading System v1.0 — dimension Sécurité';
COMMENT ON COLUMN public.assets.auto_refusal_reasons IS 'Raisons de refus automatique détectées (C-40+C-34, I-18, I-21, S-17, S-37) — calculé, jamais saisi manuellement';
COMMENT ON COLUMN public.assets.revenue_track_months IS 'Ancienneté des revenus en mois — pilote les règles d''éligibilité au catalogue (Partie 9 méthodologie)';
COMMENT ON COLUMN public.assets.benchmark_category   IS 'Catégorie de comparaison marché — doit correspondre à benchmark_data.category';

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
