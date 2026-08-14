-- ============================================================
-- Migration 070 : Term Sheets M&A structurées
-- Remplace la logique d'offre simple (auction_bids) pour les
-- transactions M&A. Système asynchrone, multi-paramètres,
-- sans temps réel.
-- ============================================================

-- ── 1. Type ENUM workflow ──────────────────────────────────
CREATE TYPE term_sheet_status AS ENUM (
  'pending',      -- soumis par l'acheteur, en attente de lecture
  'viewed',       -- ouvert par le vendeur
  'accepted',     -- accepté → déclenche le processus PTT
  'refused',      -- refusé
  'countered',    -- contre-proposition émise (version + 1)
  'expired'       -- délai 72h dépassé sans réponse
);

-- ── 2. Type ENUM structure de cession ─────────────────────
CREATE TYPE deal_structure AS ENUM (
  'asset_deal',        -- cession d'actifs
  'share_deal',        -- cession de titres
  'merger',            -- fusion
  'earnout_only',      -- basé exclusivement sur earnout
  'mixed'              -- combinaison
);

-- ── 3. Table principale ────────────────────────────────────
CREATE TABLE IF NOT EXISTS term_sheets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Références
  asset_id              UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  buyer_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Versioning (pour le workflow asynchrone : max 2 rounds)
  version               SMALLINT NOT NULL DEFAULT 1 CHECK (version BETWEEN 1 AND 3),
  parent_id             UUID REFERENCES term_sheets(id) ON DELETE SET NULL,

  -- Statut du workflow
  status                term_sheet_status NOT NULL DEFAULT 'pending',

  -- ── Prix & structure ──────────────────────────────────
  proposed_price_chf    NUMERIC(14,2) NOT NULL CHECK (proposed_price_chf > 0),
  structure             deal_structure NOT NULL DEFAULT 'share_deal',
  price_comment         TEXT,

  -- ── Earnout ───────────────────────────────────────────
  -- Ex: { "included": true, "percentage": 20, "duration_months": 24,
  --        "kpi": "ARR > 1.2M CHF à 24 mois", "cap_chf": 500000 }
  earnout               JSONB,

  -- ── Reprise de management ─────────────────────────────
  -- Ex: { "included": true, "duration_months": 12, "compensation_chf": 120000,
  --        "role": "Directeur technique", "note": "Transition opérationnelle" }
  management_contract   JSONB,

  -- ── Clause de non-concurrence ─────────────────────────
  -- Ex: { "included": true, "duration_months": 36, "geographic_scope": "Europe",
  --        "sectors_covered": ["SaaS", "infrastructure"], "penalty_chf": 300000 }
  non_compete           JSONB,

  -- ── Garanties & représentations ───────────────────────
  -- Ex: { "warranty_retention_pct": 10, "retention_duration_months": 18,
  --        "rep_and_warranty_insurance": false, "indemnity_cap_pct": 30 }
  warranties            JSONB,

  -- ── Processus & conditions ────────────────────────────
  dd_duration_days      SMALLINT CHECK (dd_duration_days IS NULL OR dd_duration_days BETWEEN 14 AND 180),
  closing_weeks         SMALLINT CHECK (closing_weeks IS NULL OR closing_weeks BETWEEN 4 AND 52),
  conditions_precedent  TEXT[],   -- ex: ['Financement bancaire confirmé', 'Validation conseil d'administration']
  buyer_profile_note    TEXT,     -- présentation courte de l'acheteur (max 1000 car.)

  -- ── Méta ──────────────────────────────────────────────
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '72 hours'),
  seller_response_note  TEXT,     -- message du vendeur lors d'un refus ou contre-proposition
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Contraintes métier
  CONSTRAINT buyer_profile_note_length CHECK (char_length(buyer_profile_note) <= 1000),
  CONSTRAINT seller_note_length        CHECK (char_length(seller_response_note) <= 1000)
);

-- ── 4. Index ──────────────────────────────────────────────
CREATE INDEX idx_term_sheets_asset_id   ON term_sheets(asset_id);
CREATE INDEX idx_term_sheets_buyer_id   ON term_sheets(buyer_id);
CREATE INDEX idx_term_sheets_status     ON term_sheets(status);
CREATE INDEX idx_term_sheets_expires_at ON term_sheets(expires_at) WHERE status = 'pending';

-- ── 5. Trigger updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION update_term_sheets_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_term_sheets_updated_at
  BEFORE UPDATE ON term_sheets
  FOR EACH ROW EXECUTE FUNCTION update_term_sheets_updated_at();

-- ── 6. RLS ───────────────────────────────────────────────
ALTER TABLE term_sheets ENABLE ROW LEVEL SECURITY;

-- Acheteur : voir ses propres term sheets
CREATE POLICY "buyer_own_term_sheets" ON term_sheets
  FOR SELECT
  USING (buyer_id = auth.uid());

-- Acheteur : insérer une term sheet (actif publié uniquement)
CREATE POLICY "buyer_insert_term_sheet" ON term_sheets
  FOR INSERT
  WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM assets
      WHERE assets.id = asset_id
        AND assets.status = 'published'
    )
  );

-- Vendeur : voir les term sheets de ses actifs (ANONYMISÉ côté app)
-- La politique donne accès côté DB ; l'anonymisation est faite en app
CREATE POLICY "seller_view_own_asset_term_sheets" ON term_sheets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assets
      WHERE assets.id = asset_id
        AND assets.owner_id = auth.uid()
    )
  );

-- Vendeur : mettre à jour le statut (accept / refuse / counter)
CREATE POLICY "seller_update_term_sheet_status" ON term_sheets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM assets
      WHERE assets.id = asset_id
        AND assets.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    status IN ('viewed', 'accepted', 'refused', 'countered')
  );

-- Admin (service role) : accès total via service client (bypass RLS)
-- Pas de politique admin nécessaire car le service client bypasse RLS.

-- ── 7. Vue acheteur (masque les métadonnées vendeur) ─────
CREATE OR REPLACE VIEW buyer_term_sheets_view AS
SELECT
  ts.id,
  ts.asset_id,
  ts.version,
  ts.parent_id,
  ts.status,
  ts.proposed_price_chf,
  ts.structure,
  ts.price_comment,
  ts.earnout,
  ts.management_contract,
  ts.non_compete,
  ts.warranties,
  ts.dd_duration_days,
  ts.closing_weeks,
  ts.conditions_precedent,
  ts.buyer_profile_note,
  ts.expires_at,
  -- Le vendeur peut joindre un message uniquement si statut visible
  CASE WHEN ts.status IN ('accepted', 'refused', 'countered')
    THEN ts.seller_response_note
    ELSE NULL
  END AS seller_response_note,
  ts.created_at,
  ts.updated_at
FROM term_sheets ts
WHERE ts.buyer_id = auth.uid();

-- ── 8. Vue vendeur (anonymise l'identité acheteur) ───────
CREATE OR REPLACE VIEW seller_term_sheets_view AS
SELECT
  ts.id,
  ts.asset_id,
  ts.version,
  ts.parent_id,
  ts.status,
  ts.proposed_price_chf,
  ts.structure,
  ts.price_comment,
  ts.earnout,
  ts.management_contract,
  ts.non_compete,
  ts.warranties,
  ts.dd_duration_days,
  ts.closing_weeks,
  ts.conditions_precedent,
  ts.buyer_profile_note,
  ts.expires_at,
  ts.seller_response_note,
  ts.created_at,
  ts.updated_at,
  -- Identifiant anonyme stable par asset : Acheteur A, B, C…
  -- calculé côté application via rang par asset_id + created_at
  row_number() OVER (
    PARTITION BY ts.asset_id
    ORDER BY ts.created_at
  ) AS buyer_rank
FROM term_sheets ts
WHERE EXISTS (
  SELECT 1 FROM assets
  WHERE assets.id = ts.asset_id
    AND assets.owner_id = auth.uid()
);
