-- ════════════════════════════════════════════════════════════════════════
-- 075_data_room_light.sql
--
-- Data room "light" — accès partiel avant versement du séquestre.
--
-- Logique :
--   1. L'admin active la data room light par actif (assets.data_room_light_enabled)
--   2. Certains documents sont marqués visible_to = 'light_buyers'
--   3. Un acquéreur KYC validé peut demander l'accès light (data_room_light_requests)
--   4. L'accès light lui donne un bid_amount_chf indicatif pour calculer le séquestre 10%
--   5. À reception du séquestre (auction_sequesters.status = 'received'), la data room
--      complète (visible_to = 'nda_buyers') est débloquée automatiquement côté admin
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Étendre visible_to avec 'light_buyers' ─────────────────────────
--   (alter check constraint)
ALTER TABLE public.data_room_documents
  DROP CONSTRAINT IF EXISTS data_room_documents_visible_to_check;

ALTER TABLE public.data_room_documents
  ADD CONSTRAINT data_room_documents_visible_to_check
    CHECK (visible_to IN ('admin_only', 'assigned_partner', 'nda_buyers', 'light_buyers'));

COMMENT ON COLUMN public.data_room_documents.visible_to IS
  'admin_only: vendeur+admin. assigned_partner: +partenaire CIFS assigné. nda_buyers: +acheteurs NDA + séquestre reçu. light_buyers: +acheteurs KYC validés (data room light).';

-- ── 2. Flag data_room_light_enabled sur assets ────────────────────────
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS data_room_light_enabled BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.assets.data_room_light_enabled IS
  'Si true, les acquéreurs KYC validés peuvent demander l''accès à la data room light (documents visible_to = ''light_buyers'').';

-- ── 3. Table data_room_light_requests ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.data_room_light_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id    UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Statut de la demande
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),

  -- Montant indicatif communiqué à l'acquéreur (pour calculer séquestre 10%)
  bid_amount_chf  NUMERIC(16,2),

  -- Notes admin
  admin_note  TEXT,
  reviewed_by UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (asset_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_drlr_asset_id ON public.data_room_light_requests(asset_id, status);
CREATE INDEX IF NOT EXISTS idx_drlr_user_id  ON public.data_room_light_requests(user_id);

ALTER TABLE public.data_room_light_requests ENABLE ROW LEVEL SECURITY;

-- Service role : accès total
CREATE POLICY "service_role_drlr"
  ON public.data_room_light_requests FOR ALL
  USING (auth.role() = 'service_role');

-- Admin : lecture/écriture
CREATE POLICY "admin_drlr"
  ON public.data_room_light_requests FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Acquéreur : peut créer + voir sa propre demande
CREATE POLICY "buyer_own_drlr_select"
  ON public.data_room_light_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "buyer_own_drlr_insert"
  ON public.data_room_light_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_drlr_updated_at
  BEFORE UPDATE ON public.data_room_light_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 4. RLS light_buyers sur data_room_documents ───────────────────────
-- Acheteur KYC approuvé + demande light approuvée → accès documents light
CREATE POLICY "buyer_light_documents"
  ON public.data_room_documents FOR SELECT
  TO authenticated
  USING (
    visible_to = 'light_buyers'
    AND EXISTS (
      SELECT 1 FROM public.data_room_light_requests r
      WHERE r.asset_id = data_room_documents.asset_id
        AND r.user_id  = auth.uid()
        AND r.status   = 'approved'
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.kyc_status = 'approved'
    )
  );

-- ── 5. Grants ──────────────────────────────────────────────────────────
GRANT ALL    ON public.data_room_light_requests TO service_role;
GRANT SELECT, INSERT ON public.data_room_light_requests TO authenticated;

-- ════════════════════════════════════════════════════════════════════════
-- FIN 075_data_room_light.sql
-- ════════════════════════════════════════════════════════════════════════
