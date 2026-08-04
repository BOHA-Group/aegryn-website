-- 055_expert_expertise_taxonomy.sql
-- Ajout des colonnes taxonomy structurée sur expert_profiles
-- Rétrocompatible : les colonnes "specialties" text[] existantes sont conservées

ALTER TABLE expert_profiles
  ADD COLUMN IF NOT EXISTS expertise_dimension  text        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS expertise_categories text[]      DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS expertise_specialties text[]     DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS review_status        text        DEFAULT 'draft'
    CHECK (review_status IN ('draft', 'pending_review', 'approved', 'rejected'));

-- Index pour filtrage admin
CREATE INDEX IF NOT EXISTS idx_expert_profiles_review_status
  ON expert_profiles (review_status);

CREATE INDEX IF NOT EXISTS idx_expert_profiles_expertise_dimension
  ON expert_profiles (expertise_dimension);
