-- ════════════════════════════════════════════════════════════════════════
-- 042_expert_category_domain.sql
--
-- Ajoute les colonnes `category` et `domain` sur expert_profiles
-- et expert_applications pour permettre le filtrage par :
--   • catégorie : advisory_tech | advisory_transaction | network
--   • domaine   : valeurs libres (TEXT[]) — ex. cybersecurity, m_and_a, tax…
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.expert_profiles
  ADD COLUMN IF NOT EXISTS category TEXT
    CHECK (category IS NULL OR category IN ('advisory_tech', 'advisory_transaction', 'network')),
  ADD COLUMN IF NOT EXISTS domain TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.expert_applications
  ADD COLUMN IF NOT EXISTS category TEXT
    CHECK (category IS NULL OR category IN ('advisory_tech', 'advisory_transaction', 'network')),
  ADD COLUMN IF NOT EXISTS domain TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_expert_profiles_category
  ON public.expert_profiles (category) WHERE is_visible = true;

COMMENT ON COLUMN public.expert_profiles.category IS
  'Catégorie principale : advisory_tech (cybersécurité, IA, stratégie digitale), advisory_transaction (M&A, valorisation, acquisition), network (partenaires réseau)';

COMMENT ON COLUMN public.expert_profiles.domain IS
  'Domaines de compétence : ex. ["cybersecurity","ai","m_and_a","tax","law","hr","insurance","real_estate","finance"]';

COMMENT ON COLUMN public.expert_applications.category IS
  'Catégorie souhaitée lors de la candidature';
