/**
 * Migration 023 — Security Hardening (Supabase Linter fixes)
 *
 * Corrige TOUTES les alertes du Supabase Database Linter :
 *
 * ERROR:
 *   - security_definer_view : buyer_commission_dues → recréée en SECURITY INVOKER
 *
 * WARN:
 *   - function_search_path_mutable : 5 fonctions → ajout SET search_path = ''
 *   - rls_policy_always_true       : 6 tables → INSERT WITH CHECK (true) remplacé par check métier
 *   - anon_security_definer_function_executable : handle_new_user, rls_auto_enable
 *   - authenticated_security_definer_function_executable : idem
 *
 * Note auth_leaked_password_protection : à activer manuellement dans
 * Supabase Dashboard → Auth → Password Settings → Enable leaked password protection
 */

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. VUE SECURITY DEFINER → SECURITY INVOKER
--    buyer_commission_dues ne doit pas élever les privilèges
-- ═══════════════════════════════════════════════════════════════════════════

DROP VIEW IF EXISTS public.buyer_commission_dues;

CREATE VIEW public.buyer_commission_dues
  WITH (security_invoker = true)
AS
  SELECT
    c.id,
    c.transaction_id,
    c.buyer_id,
    c.amount_chf,
    c.eligible_at,
    c.status,
    c.commission_type,
    c.created_at,
    c.updated_at,
    c.asset_id,
    t.status AS transaction_stage
  FROM public.commissions c
  LEFT JOIN public.transactions t ON t.id = c.transaction_id
  WHERE c.commission_type = 'buyer_transaction_fee'
    AND c.buyer_id IS NOT NULL;

COMMENT ON VIEW public.buyer_commission_dues IS
  'Commission de transaction dues par l''acheteur à AEGRYN (Flux 2). SECURITY INVOKER. Read-only.';

GRANT SELECT ON public.buyer_commission_dues TO service_role;
GRANT SELECT ON public.buyer_commission_dues TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. FONCTIONS search_path MUTABLE → SET search_path = ''
-- ═══════════════════════════════════════════════════════════════════════════

-- handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- set_updated_at (alias)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_auction_lots_updated_at
CREATE OR REPLACE FUNCTION public.update_auction_lots_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- set_auction_sessions_updated_at
CREATE OR REPLACE FUNCTION public.set_auction_sessions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- set_profiles_updated_at
CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. FONCTIONS SECURITY DEFINER EXPOSÉES PUBLIQUEMENT
--    handle_new_user et rls_auto_enable → REVOKE EXECUTE anon/authenticated
--    Ces fonctions sont appelées par triggers internes uniquement.
-- ═══════════════════════════════════════════════════════════════════════════

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. RLS INSERT WITH CHECK (true) → checks métier
--    Ces tables acceptent des soumissions publiques (forms) mais on doit
--    limiter à des données cohérentes (email non nul, champs requis).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── valuation_leads ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS valuation_leads_insert_public ON public.valuation_leads;
CREATE POLICY valuation_leads_insert_public
  ON public.valuation_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
  );

-- ── assets (soumission dossier vendeur) ───────────────────────────────────────
DROP POLICY IF EXISTS assets_insert_public ON public.assets;
CREATE POLICY assets_insert_public
  ON public.assets FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    seller_email IS NOT NULL
    AND seller_email <> ''
  );

-- ── catalog_waitlist ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS catalog_waitlist_insert_public ON public.catalog_waitlist;
CREATE POLICY catalog_waitlist_insert_public
  ON public.catalog_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
  );

-- ── nda_requests ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS nda_requests_insert_public ON public.nda_requests;
CREATE POLICY nda_requests_insert_public
  ON public.nda_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
  );

-- ── alliance_applications ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS alliance_applications_insert_public ON public.alliance_applications;
CREATE POLICY alliance_applications_insert_public
  ON public.alliance_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
  );

-- ── assessment_day_bookings ───────────────────────────────────────────────────
DROP POLICY IF EXISTS assessment_bookings_insert_public ON public.assessment_day_bookings;
CREATE POLICY assessment_bookings_insert_public
  ON public.assessment_day_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
  );
