-- ════════════════════════════════════════════════════════════════════════
-- 034_nda_signatures.sql
--
-- Signatures NDA acquéreur — condition préalable d'accès au catalogue.
-- scope = 'catalog_general' : NDA global (1 fois par acheteur)
-- scope = 'asset_specific'  : NDA spécifique à un actif (futur)
--
-- ip_address et user_agent capturés côté serveur au moment du clic.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.nda_signatures (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nda_version   TEXT        NOT NULL DEFAULT 'v1.0-2026-07',
  signed_at     TIMESTAMPTZ,
  ip_address    TEXT,
  user_agent    TEXT,
  scope         TEXT        NOT NULL DEFAULT 'catalog_general'
                            CHECK (scope IN ('catalog_general', 'asset_specific')),
  asset_id      UUID        REFERENCES public.assets(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (buyer_id, scope, asset_id)
);

ALTER TABLE public.nda_signatures ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE  public.nda_signatures IS 'Signatures NDA acquéreur AEGRYN Auction — traçabilité légale (LCB-FT / RGPD)';
COMMENT ON COLUMN public.nda_signatures.nda_version IS 'Version sémantique du texte NDA affiché au moment de la signature';
COMMENT ON COLUMN public.nda_signatures.ip_address  IS 'IP capturée côté serveur (x-forwarded-for) — jamais côté client';
COMMENT ON COLUMN public.nda_signatures.scope       IS 'catalog_general = NDA global ; asset_specific = NDA par actif';

-- ── RLS ──────────────────────────────────────────────────────────────────

-- Acheteur : lecture et insertion de ses propres signatures uniquement
CREATE POLICY "buyer_own_nda"
  ON public.nda_signatures FOR ALL
  TO authenticated
  USING  (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Admin : lecture totale
CREATE POLICY "admin_all_nda"
  ON public.nda_signatures FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND (
          role = 'admin'
          OR 'admin'       = ANY(roles)
          OR 'super_admin' = ANY(roles)
        )
    )
  );

-- Service role : accès total pour les API routes Next.js
CREATE POLICY "service_role_nda"
  ON public.nda_signatures FOR ALL
  USING (auth.role() = 'service_role');

-- ── Index ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS nda_signatures_buyer_idx
  ON public.nda_signatures (buyer_id, scope, signed_at)
  WHERE signed_at IS NOT NULL;

-- ── Sync profiles.auction_nda_signed_at ──────────────────────────────────
-- Trigger : dès qu'une signature catalog_general est insérée,
-- on met à jour profiles.auction_nda_signed_at pour compatibilité
-- avec les RLS existantes (data_room, auction_access_gate).

CREATE OR REPLACE FUNCTION public.sync_auction_nda_signed_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.scope = 'catalog_general' AND NEW.signed_at IS NOT NULL THEN
    UPDATE public.profiles
    SET auction_nda_signed_at = NEW.signed_at
    WHERE id = NEW.buyer_id
      AND auction_nda_signed_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_auction_nda ON public.nda_signatures;
CREATE TRIGGER trg_sync_auction_nda
  AFTER INSERT OR UPDATE ON public.nda_signatures
  FOR EACH ROW EXECUTE FUNCTION public.sync_auction_nda_signed_at();
