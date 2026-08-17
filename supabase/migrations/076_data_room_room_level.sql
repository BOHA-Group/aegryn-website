-- ════════════════════════════════════════════════════════════════════════
-- 076_data_room_room_level.sql
--
-- 1. Ajoute room_level ('light' | 'full') sur data_room_documents
-- 2. Étend la catégorie avec 'legal' (L-01…R-01)
-- 3. Table data_room_light_bids : offres de principe acheteur
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. room_level sur data_room_documents ─────────────────────────────
ALTER TABLE public.data_room_documents
  ADD COLUMN IF NOT EXISTS room_level TEXT NOT NULL DEFAULT 'full'
    CHECK (room_level IN ('light', 'full'));

CREATE INDEX IF NOT EXISTS idx_drd_room_level
  ON public.data_room_documents(asset_id, room_level);

COMMENT ON COLUMN public.data_room_documents.room_level IS
  'light = data room légère (12 docs, avant offre de principe). full = data room complète CIFS (post-séquestre).';

-- ── 2. Étendre la contrainte category avec 'legal' ───────────────────
ALTER TABLE public.data_room_documents
  DROP CONSTRAINT IF EXISTS data_room_documents_category_check;

ALTER TABLE public.data_room_documents
  ADD CONSTRAINT data_room_documents_category_check
    CHECK (category IN ('code', 'ip', 'finance', 'security', 'transversal', 'legal'));

COMMENT ON COLUMN public.data_room_documents.category IS
  'code|ip|finance|security|transversal = dimensions CIFS. legal = dimension légale data room light.';

-- ── 3. Table data_room_light_bids : offres de principe acheteur ───────
--   L'acheteur KYC validé soumet un bid_amount_chf après avoir consulté
--   la data room light. Le vendeur accepte/refuse.
--   Si accepté → séquestre 10% déclenché.
CREATE TABLE IF NOT EXISTS public.data_room_light_bids (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  bidder_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Montant offre de principe (CHF)
  bid_amount_chf  NUMERIC(16,2) NOT NULL CHECK (bid_amount_chf > 0),

  -- Séquestre calculé (10% – dénormalisé pour traçabilité)
  sequester_amount_chf NUMERIC(16,2) GENERATED ALWAYS AS (ROUND(bid_amount_chf * 0.10, 2)) STORED,

  -- Statut du cycle de vie
  status          TEXT        NOT NULL DEFAULT 'pending_seller'
                              CHECK (status IN (
                                'pending_seller',   -- soumis, en attente décision vendeur
                                'approved',         -- vendeur a accepté → séquestre requis
                                'rejected',         -- vendeur a refusé
                                'sequester_sent',   -- acheteur a envoyé le séquestre (auto ou manuel)
                                'sequester_received', -- admin a confirmé réception séquestre → DR complète
                                'withdrawn'         -- acheteur a retiré son offre
                              )),

  -- Notes libres
  buyer_note      TEXT,
  seller_note     TEXT,
  admin_note      TEXT,

  -- Qui a traité
  reviewed_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (asset_id, bidder_id)
);

CREATE INDEX IF NOT EXISTS idx_drlb_asset_id  ON public.data_room_light_bids(asset_id, status);
CREATE INDEX IF NOT EXISTS idx_drlb_bidder_id ON public.data_room_light_bids(bidder_id);

ALTER TABLE public.data_room_light_bids ENABLE ROW LEVEL SECURITY;

-- Service role : accès total
CREATE POLICY "service_role_drlb"
  ON public.data_room_light_bids FOR ALL
  USING (auth.role() = 'service_role');

-- Admin : lecture/écriture totale
CREATE POLICY "admin_drlb"
  ON public.data_room_light_bids FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Acheteur : créer + lire + modifier ses propres bids
CREATE POLICY "buyer_own_drlb_select"
  ON public.data_room_light_bids FOR SELECT
  TO authenticated
  USING (auth.uid() = bidder_id);

CREATE POLICY "buyer_own_drlb_insert"
  ON public.data_room_light_bids FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "buyer_own_drlb_update"
  ON public.data_room_light_bids FOR UPDATE
  TO authenticated
  USING (auth.uid() = bidder_id AND status = 'pending_seller');

-- Vendeur : lire les bids sur ses actifs + mettre à jour statut
CREATE POLICY "seller_read_drlb"
  ON public.data_room_light_bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assets a
      JOIN public.profiles p ON p.email = a.seller_email
      WHERE a.id = asset_id AND p.id = auth.uid()
    )
  );

CREATE POLICY "seller_update_drlb"
  ON public.data_room_light_bids FOR UPDATE
  TO authenticated
  USING (
    status = 'pending_seller'
    AND EXISTS (
      SELECT 1 FROM public.assets a
      JOIN public.profiles p ON p.email = a.seller_email
      WHERE a.id = asset_id AND p.id = auth.uid()
    )
  );

CREATE TRIGGER trg_drlb_updated_at
  BEFORE UPDATE ON public.data_room_light_bids
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 4. Grants ──────────────────────────────────────────────────────────
GRANT ALL ON public.data_room_light_bids TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.data_room_light_bids TO authenticated;

-- ── 5. Colonne data_room_light_complete sur assets ─────────────────────
--   Calculé dynamiquement en DB via vue ; la colonne est un cache admin.
--   TRUE quand tous les docs room_level='light' AND required_level='blocking'
--   ont admin_quality='sufficient'.
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS data_room_light_complete BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.assets.data_room_light_complete IS
  'Cache admin : true quand tous les documents light bloquants sont validés (admin_quality=sufficient). Calculé manuellement ou via trigger.';

-- ════════════════════════════════════════════════════════════════════════
-- FIN 076_data_room_room_level.sql
-- ════════════════════════════════════════════════════════════════════════
