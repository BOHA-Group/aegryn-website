-- ── Migration 045 — Enchères : créneau bid + visibilité RLS ─────────────────
--
-- MODÈLE AEGRYN AUCTION :
--   • session_opens_at  → J-30 : ouverture du dossier confidentiel (NDA + accès)
--   • session_closes_at → J    : clôture de la session (accès dossier révoqué)
--   • bid_opens_at      → J (ex: 09:00 CET) : début du créneau d'offres (ex: 8h)
--   • bid_closes_at     → J (ex: 17:00 CET) : fin du créneau d'offres (ex: 8h)
--
-- VISIBILITÉ DES BIDS :
--   • Bids soumis       → visible admin (service_role) + vendeur de l'actif
--                         mais SANS montant (sealed bid)
--   • Bid retenu        → montant visible de tous les acheteurs ayant eu accès
--                         (résultat final de la session)
--
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Créneau bid sur auction_assets ────────────────────────────────────────

ALTER TABLE public.auction_assets
  ADD COLUMN IF NOT EXISTS bid_opens_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bid_closes_at TIMESTAMPTZ;

COMMENT ON COLUMN public.auction_assets.bid_opens_at  IS
  'Début du créneau horaire de soumission des offres (jour J, ex: 09:00 CET).
   NULL = pas de restriction intra-journalière (toute la période session).';

COMMENT ON COLUMN public.auction_assets.bid_closes_at IS
  'Fin du créneau horaire de soumission des offres (jour J, ex: 17:00 CET).
   Doit être ≤ session_closes_at.';

-- ── 2. Champ seller_user_id sur auction_assets ───────────────────────────────
-- Permet à la RLS de retrouver le vendeur pour la visibilité des bids

ALTER TABLE public.auction_assets
  ADD COLUMN IF NOT EXISTS seller_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.auction_assets.seller_user_id IS
  'Profil Supabase du vendeur — utilisé pour la RLS des auction_bids (visibilité vendeur).';

-- ── 3. RLS auction_bids — reconstruire proprement ───────────────────────────

ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "service_role_bids"          ON public.auction_bids;
DROP POLICY IF EXISTS "buyers_own_bids_no_amount"  ON public.auction_bids;

-- 3a. Service role : accès total (admin)
CREATE POLICY "service_role_bids"
  ON public.auction_bids FOR ALL
  USING     (auth.role() = 'service_role')
  WITH CHECK(auth.role() = 'service_role');

-- 3b. Acheteur : voir UNIQUEMENT son propre bid, sans le montant
--     → le montant est masqué via la vue buyer_bids_view (créée ci-dessous)
CREATE POLICY "buyer_own_bid_status"
  ON public.auction_bids FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3c. Vendeur : voir les bids soumis sur SES actifs (statut uniquement, pas montant)
--     → même principe, montant masqué via vue
CREATE POLICY "seller_sees_bids_on_own_asset"
  ON public.auction_bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.auction_assets aa
      WHERE aa.id = auction_bids.asset_id
        AND aa.seller_user_id = auth.uid()
    )
  );

-- ── 4. Vue buyer_bids_view — masque bid_amount_chf tant que non retenu ───────

CREATE OR REPLACE VIEW public.buyer_bids_view AS
SELECT
  ab.id,
  ab.asset_id,
  ab.user_id,
  ab.bid_model,
  ab.status,
  ab.submitted_at,
  ab.updated_at,
  /* Montant visible uniquement si bid retenu (résultat final publié) */
  CASE
    WHEN ab.status = 'retained' THEN ab.bid_amount_chf
    ELSE NULL
  END AS bid_amount_chf,
  /* Conditions visibles uniquement si retenu */
  CASE
    WHEN ab.status = 'retained' THEN ab.conditions
    ELSE '{}'::jsonb
  END AS conditions
FROM public.auction_bids ab;

COMMENT ON VIEW public.buyer_bids_view IS
  'Vue sécurisée des bids pour acheteurs et vendeurs :
   - bid_amount_chf masqué (NULL) tant que statut ≠ retained
   - Résultat (bid retenu) visible de tous les ayants droit via auction_asset_access';

-- ── 5. Vue seller_bids_view — vendeur voit nombre de bids + bid retenu ────────

CREATE OR REPLACE VIEW public.seller_bids_view AS
SELECT
  aa.id              AS asset_id,
  aa.name            AS asset_name,
  aa.slug,
  aa.seller_user_id,
  COUNT(ab.id)       AS total_bids,
  COUNT(ab.id) FILTER (WHERE ab.status = 'submitted')  AS bids_pending,
  COUNT(ab.id) FILTER (WHERE ab.status = 'retained')   AS bids_retained,
  /* Montant du bid retenu — visible du vendeur après adjudication */
  MAX(ab.bid_amount_chf) FILTER (WHERE ab.status = 'retained') AS winning_bid_chf
FROM public.auction_assets aa
LEFT JOIN public.auction_bids ab ON ab.asset_id = aa.id
GROUP BY aa.id, aa.name, aa.slug, aa.seller_user_id;

COMMENT ON VIEW public.seller_bids_view IS
  'Vue vendeur : nombre total de bids reçus sur son actif + montant du bid retenu.
   Ne révèle pas les montants des bids non retenus (sealed bid).';

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation avant db push
-- ════════════════════════════════════════════════════════════════════════
