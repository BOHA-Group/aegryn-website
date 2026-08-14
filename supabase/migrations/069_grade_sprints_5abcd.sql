/**
 * Migration 069 — Sprints 5A / 5B / 5C / 5D (CIFS v3.0)
 *
 * 5A — Pre-Grade
 *   assets.status : ajout 'pre_grade' dans le CHECK existant
 *   assets.pre_grade_actions JSONB : 3 actions prioritaires + grade estimé post-remédiation
 *   assets.pre_grade_issued_at TIMESTAMPTZ
 *
 * 5B — Auction Ready
 *   assets.auction_ready BOOLEAN DEFAULT FALSE
 *   assets.auction_ready_at TIMESTAMPTZ
 *   assets.trs TEXT : TRS de la dernière évaluation publiée (dénormalisé pour perf catalogue)
 *   assets.aeg_grade TEXT : grade machine (star/aaa/aa/a/b/refused) — alias du official_grade
 *
 * 5C — Delta Report
 *   grade_assessments.delta JSONB : diff scores C/I/F/S + sous-codes entre v_n et v_(n-1)
 *   grade_assessments.version_number INTEGER : numéro de version séquentiel par asset
 *
 * 5D — Benchmark sectoriel
 *   sector_benchmarks : table de référence des multiples ARR par secteur
 */

-- ─────────────────────────────────────────────────────────────────────────────
-- 5A — PRE-GRADE
-- ─────────────────────────────────────────────────────────────────────────────

-- Étendre la contrainte status pour inclure 'pre_grade'
-- PostgreSQL ne supporte pas ALTER CONSTRAINT — on recrée la contrainte
ALTER TABLE public.assets
  DROP CONSTRAINT IF EXISTS assets_status_check;

ALTER TABLE public.assets
  ADD CONSTRAINT assets_status_check
    CHECK (status IN ('submitted','under_review','pre_grade','graded','published','sold','withdrawn'));

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS pre_grade_actions  JSONB,
  ADD COLUMN IF NOT EXISTS pre_grade_issued_at TIMESTAMPTZ;

COMMENT ON COLUMN public.assets.pre_grade_actions IS
  'Actions prioritaires émises par le Pre-Grade. Format :
   { estimatedGrade: GradeLetter, actions: [{ subcode, priority, action, effort, impact }] }
   Généré par gradeEngine.buildRecommendations() quand le grade final est refusé ou B.';

COMMENT ON COLUMN public.assets.pre_grade_issued_at IS
  'Date d''émission du Pre-Grade. NULL si aucun Pre-Grade émis.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5B — AUCTION READY
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS auction_ready          BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS auction_ready_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS auction_ready_blockers  JSONB,
  ADD COLUMN IF NOT EXISTS trs                     TEXT
    CHECK (trs IN ('ready','conditional','remediation','blocked') OR trs IS NULL),
  ADD COLUMN IF NOT EXISTS aeg_grade               TEXT
    CHECK (aeg_grade IN ('star','aaa','aa','a','b','refused') OR aeg_grade IS NULL);

COMMENT ON COLUMN public.assets.auction_ready_blockers IS
  'Tableau des conditions non remplies pour l\'Auction Ready.
   NULL si auction_ready = TRUE (aucun bloqueur).
   Exemple : ["KYC vendeur non validé", "Prix demandé non renseigné"]
   Affiché au vendeur comme checklist de remédiation.';

COMMENT ON COLUMN public.assets.auction_ready IS
  'TRUE si l''actif remplit tous les critères pour entrer en session d''enchères.
   Calculé automatiquement par la route grade-engine/publish :
   grade IN (a,aa,aaa,star) AND trs IN (ready,conditional)
   AND kyc_validated = TRUE AND mandate_signed = TRUE';

COMMENT ON COLUMN public.assets.trs IS
  'TRS dénormalisé depuis la dernière évaluation publiée. Mis à jour au publish.
   Permet de filtrer le catalogue sans JOIN sur grade_assessments.';

COMMENT ON COLUMN public.assets.aeg_grade IS
  'Grade machine (clé DB) dénormalisé depuis la dernière évaluation publiée.
   star | aaa | aa | a | b | refused. Distinct de official_grade (symbole ★/AAA/etc.)';

-- Index catalogue
CREATE INDEX IF NOT EXISTS assets_auction_ready_idx
  ON public.assets (auction_ready, trs, aeg_grade)
  WHERE auction_ready = TRUE AND status = 'published';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5C — DELTA REPORT
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.grade_assessments
  ADD COLUMN IF NOT EXISTS delta          JSONB,
  ADD COLUMN IF NOT EXISTS version_number INTEGER NOT NULL DEFAULT 1;

COMMENT ON COLUMN public.grade_assessments.delta IS
  'Diff entre cette version et la précédente. Format :
   { scoresDelta: { code: Δ, ip: Δ, finance: Δ, security: Δ, total: Δ },
     subcodesAdded: string[], subcodesRemoved: string[],
     gradeBefore: GradeLetter, gradeAfter: GradeLetter,
     trsBefore: TRSLevel, trsAfter: TRSLevel }
   NULL pour la version 1 (pas de précédent).';

COMMENT ON COLUMN public.grade_assessments.version_number IS
  'Numéro de version séquentiel par asset. 1 = première évaluation.
   Incrémenté automatiquement à chaque nouveau compute sur le même asset.';

-- Index version
CREATE INDEX IF NOT EXISTS grade_assessments_version_idx
  ON public.grade_assessments (asset_id, version_number DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5D — BENCHMARK SECTORIEL
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sector_benchmarks (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  sector                   TEXT         NOT NULL UNIQUE,
  arr_multiple_median      NUMERIC(6,2),   -- multiple ARR médian (ex: 4.5x)
  arr_multiple_top_quartile NUMERIC(6,2),  -- multiple ARR top quartile
  ebitda_multiple_median   NUMERIC(6,2),   -- multiple EBITDA médian (optionnel)
  sample_size              INTEGER,        -- nombre de transactions dans le dataset
  source                   TEXT,           -- ex: 'Aventis Advisors 2024'
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sector_benchmarks IS
  'Données de marché par secteur pour contextualiser le grade dans le rapport.
   Alimenté manuellement par l''équipe AEGRYN depuis Aventis Advisors et
   les transactions internes. Affiché dans le rapport vendeur et post-NDA.';

-- Seed initial — données Aventis Advisors 2024 (à mettre à jour)
INSERT INTO public.sector_benchmarks (sector, arr_multiple_median, arr_multiple_top_quartile, sample_size, source)
VALUES
  ('saas_b2b',       5.0,  9.0,  120, 'Aventis Advisors Q2 2026'),
  ('saas_b2c',       3.5,  6.5,   80, 'Aventis Advisors Q2 2026'),
  ('marketplace',    3.0,  5.5,   45, 'Aventis Advisors Q2 2026'),
  ('api_infra',      6.0, 11.0,   30, 'Aventis Advisors Q2 2026'),
  ('platform',       4.0,  7.5,   60, 'Aventis Advisors Q2 2026'),
  ('other',          2.5,  4.5,   90, 'Aventis Advisors Q2 2026')
ON CONFLICT (sector) DO UPDATE SET
  source     = EXCLUDED.source,
  updated_at = now();

-- RLS — lecture publique (pour le catalogue), écriture service_role
ALTER TABLE public.sector_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sector_benchmarks_read_all"
  ON public.sector_benchmarks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "sector_benchmarks_write_service"
  ON public.sector_benchmarks FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
