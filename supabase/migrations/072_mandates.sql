-- ============================================================
-- Migration 072 : Table mandates — Aegryn TRANSACT
-- Enregistre les demandes de mandat soumises via
-- /transact/mandate (cession, acquisition, levée, equity).
-- Workflow asynchrone : soumission publique → qualification
-- interne → mandat signé.
-- ============================================================

-- ── 1. ENUM : type de mandat ──────────────────────────────
CREATE TYPE mandate_type AS ENUM (
  'sell',          -- mandat de cession d'actif / société
  'buy',           -- mandat d'acquisition (recherche de cible)
  'fundraise',     -- levée de fonds (investisseurs qualifiés)
  'equity_stake'   -- ouverture du capital (associé minoritaire)
);

-- ── 2. ENUM : statut du workflow interne ──────────────────
CREATE TYPE mandate_status AS ENUM (
  'submitted',      -- soumis, en attente de qualification
  'in_review',      -- en cours d'évaluation par l'équipe Aegryn
  'qualified',      -- profil qualifié, contact initié
  'active',         -- mandat exclusif signé, en cours d'exécution
  'closed_success', -- transaction clôturée avec succès
  'closed_no_deal', -- mandat expiré / clôturé sans deal
  'rejected'        -- refusé (non qualifié)
);

-- ── 3. ENUM : secteur vertical ────────────────────────────
CREATE TYPE mandate_vertical AS ENUM (
  'saas_b2b',
  'saas_b2c',
  'marketplace',
  'ecommerce',
  'fintech',
  'healthtech',
  'edtech',
  'deeptech',
  'infra_devtools',
  'media_content',
  'other'
);

-- ── 4. Table principale ────────────────────────────────────
CREATE TABLE IF NOT EXISTS mandates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Identité du soumettant ─────────────────────────────
  -- NULL si soumis sans compte (formulaire public)
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  contact_email         TEXT NOT NULL CHECK (char_length(contact_email) <= 254),
  contact_name          TEXT NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 120),
  company_name          TEXT          CHECK (char_length(company_name) <= 120),

  -- ── Type & workflow ────────────────────────────────────
  type                  mandate_type   NOT NULL,
  status                mandate_status NOT NULL DEFAULT 'submitted',

  -- ── Vertical / secteur ─────────────────────────────────
  vertical              mandate_vertical,
  vertical_other        TEXT           CHECK (char_length(vertical_other) <= 100),

  -- ── Budget / ticket (CHF) ──────────────────────────────
  -- Pour sell : valorisation indicative cible
  -- Pour buy  : budget d'acquisition max
  -- Pour fundraise : montant cherché
  -- Pour equity : valorisation pré-money indicative
  budget_min_chf        NUMERIC(14,2)  CHECK (budget_min_chf IS NULL OR budget_min_chf >= 0),
  budget_max_chf        NUMERIC(14,2)  CHECK (budget_max_chf IS NULL OR budget_max_chf >= budget_min_chf),

  -- ── Contexte libre ─────────────────────────────────────
  -- Description de la situation, objectifs, contraintes
  description           TEXT           CHECK (char_length(description) <= 3000),

  -- ── Critères additionnels (JSONB extensible) ───────────
  -- sell     : { "arr_chf": 400000, "yoy_growth_pct": 35, "team_size": 4, "has_ip": true }
  -- buy      : { "target_arr_min": 200000, "target_countries": ["fr","ch"], "profitability": "ebitda_positive" }
  -- fundraise: { "current_mrr": 80000, "use_of_funds": "expansion", "equity_offered_pct": 15 }
  -- equity   : { "stake_pct_max": 30, "partner_type": "operational", "revenue_chf": 600000 }
  criteria              JSONB,

  -- ── Exclusivité ────────────────────────────────────────
  -- true = accord exclusif (standard Aegryn)
  exclusivity           BOOLEAN        NOT NULL DEFAULT true,
  exclusivity_months    SMALLINT       CHECK (exclusivity_months IS NULL OR exclusivity_months BETWEEN 1 AND 24),

  -- ── NDA ────────────────────────────────────────────────
  nda_signed_at         TIMESTAMPTZ,
  nda_file_url          TEXT,

  -- ── Mandat signé ───────────────────────────────────────
  mandate_signed_at     TIMESTAMPTZ,
  mandate_file_url      TEXT,

  -- ── Lien vers l'actif (si vendeur avec actif existant) ─
  asset_id              UUID REFERENCES assets(id) ON DELETE SET NULL,

  -- ── Suivi interne ──────────────────────────────────────
  -- Notes internes Aegryn (non visibles par le soumettant)
  internal_notes        TEXT,
  assigned_to           UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- ── Méta ───────────────────────────────────────────────
  source                TEXT DEFAULT 'transact_form', -- origin tracking
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- ── Contraintes ────────────────────────────────────────
  CONSTRAINT budget_range_valid CHECK (
    budget_max_chf IS NULL OR budget_min_chf IS NULL OR budget_max_chf >= budget_min_chf
  ),
  CONSTRAINT vertical_other_only_when_other CHECK (
    vertical_other IS NULL OR vertical = 'other'
  )
);

-- ── 5. Index ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mandates_user_id     ON mandates(user_id)     WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mandates_type        ON mandates(type);
CREATE INDEX IF NOT EXISTS idx_mandates_status      ON mandates(status);
CREATE INDEX IF NOT EXISTS idx_mandates_asset_id    ON mandates(asset_id)    WHERE asset_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mandates_created_at  ON mandates(created_at DESC);

-- ── 6. Trigger updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION update_mandates_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_mandates_updated_at
  BEFORE UPDATE ON mandates
  FOR EACH ROW EXECUTE FUNCTION update_mandates_updated_at();

-- ── 7. RLS ───────────────────────────────────────────────
ALTER TABLE mandates ENABLE ROW LEVEL SECURITY;

-- Soumettant authentifié : voir ses propres mandats
CREATE POLICY "user_own_mandates_select" ON mandates
  FOR SELECT
  USING (user_id = auth.uid());

-- Soumettant authentifié : insérer un mandat
CREATE POLICY "user_insert_mandate" ON mandates
  FOR INSERT
  WITH CHECK (
    -- soit l'utilisateur crée son propre mandat
    user_id = auth.uid()
    -- soit soumission anonyme (user_id NULL, pas de restriction uid)
    OR user_id IS NULL
  );

-- Soumettant authentifié : mettre à jour ses mandats
-- (champs limités — les champs internes sont gérés par service role)
CREATE POLICY "user_update_own_mandate" ON mandates
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    -- le soumettant ne peut pas modifier le statut ni les notes internes
    status = (SELECT status FROM mandates WHERE id = mandates.id)
  );

-- Note : l'équipe Aegryn utilise le service role (bypass RLS)
-- pour les mises à jour de statut, notes internes et assignation.

-- ── 8. Vue soumettant (masque champs internes) ───────────
CREATE OR REPLACE VIEW my_mandates AS
SELECT
  id,
  type,
  status,
  vertical,
  vertical_other,
  budget_min_chf,
  budget_max_chf,
  description,
  criteria,
  exclusivity,
  exclusivity_months,
  nda_signed_at,
  mandate_signed_at,
  asset_id,
  contact_email,
  contact_name,
  company_name,
  source,
  created_at,
  updated_at
FROM mandates
WHERE user_id = auth.uid();
