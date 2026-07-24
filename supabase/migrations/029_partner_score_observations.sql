-- ════════════════════════════════════════════════════════════════════════
-- 029_partner_score_observations.sql
--
-- Deltas post-exécution de 028 (appliqué avant ces ajouts) :
--   • Colonne observations sur partner_certifications
--   • Contrainte UNIQUE (partner_id, asset_id, dimension) pour upsert
-- ════════════════════════════════════════════════════════════════════════

-- Colonne observations (notes internes admin sur la contribution partenaire)
ALTER TABLE public.partner_certifications
  ADD COLUMN IF NOT EXISTS observations TEXT;

COMMENT ON COLUMN public.partner_certifications.observations IS
  'Notes internes AEGRYN sur la contribution du partenaire — archivage, non visibles client.';

-- Contrainte unique pour permettre l'upsert par (partenaire, actif, dimension)
ALTER TABLE public.partner_certifications
  DROP CONSTRAINT IF EXISTS partner_certifications_partner_asset_dim_unique;

ALTER TABLE public.partner_certifications
  ADD CONSTRAINT partner_certifications_partner_asset_dim_unique
    UNIQUE (partner_id, asset_id, dimension);
