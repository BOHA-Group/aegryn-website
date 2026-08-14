-- ============================================================
-- Migration 071 : Préférences cédant sur la table assets
-- Ces champs permettent au vendeur d'exprimer ses conditions
-- souhaitées (structure, earnout, management, timeline) qui
-- seront affichées aux acheteurs dans la fiche actif post-NDA.
-- ============================================================

-- ── 1. Structure de cession préférée ─────────────────────
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS seller_preferred_structure TEXT
    CHECK (seller_preferred_structure IN (
      'asset_deal', 'share_deal', 'merger', 'earnout_only', 'mixed', 'open'
    ));

-- ── 2. Préférences earnout ────────────────────────────────
-- Ex: { "open_to_earnout": true, "max_percentage": 30,
--        "preferred_duration_months": 24,
--        "preferred_kpi": "ARR cible ou EBITDA" }
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS seller_earnout_preference JSONB;

-- ── 3. Préférences management / transition ────────────────
-- Ex: { "available_for_transition": true,
--        "preferred_duration_months": 12,
--        "preferred_role": "Conseil stratégique",
--        "remote_ok": true }
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS seller_management_preference JSONB;

-- ── 4. Délai de closing souhaité (en semaines) ────────────
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS seller_timeline_weeks SMALLINT
    CHECK (seller_timeline_weeks IS NULL OR seller_timeline_weeks BETWEEN 4 AND 104);

-- ── 5. Message libre du cédant aux acquéreurs potentiels ──
-- Affiché dans la fiche actif post-NDA, remplace/complète
-- la section "mot du cédant".
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS seller_public_note TEXT
    CHECK (char_length(seller_public_note) <= 2000);

-- ── 6. Index léger sur preferred_structure ───────────────
CREATE INDEX IF NOT EXISTS idx_assets_seller_structure
  ON assets(seller_preferred_structure)
  WHERE seller_preferred_structure IS NOT NULL;
