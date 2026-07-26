-- ════════════════════════════════════════════════════════════════════════
-- 038_fix_security_warnings.sql
--
-- Corrige tous les WARN du Supabase Security Advisor :
--
-- 1. REVOKE EXECUTE sur anon/authenticated pour toutes les fonctions
--    SECURITY DEFINER internes (triggers, helpers RLS, utilitaires).
--    Ces fonctions ne doivent JAMAIS être appelées via /rest/v1/rpc.
--
-- 2. SET search_path = public sur update_blocks_grading()
--    (function_search_path_mutable warning).
--
-- 3. RLS INSERT toujours TRUE sur auction_access_requests :
--    restreindre au minimum requis (email NOT NULL).
--
-- IMPORTANT : is_admin() et is_asset_seller() restent SECURITY DEFINER
-- (nécessaire pour les RLS policies qui les appellent dans USING/WITH CHECK).
-- On révoque uniquement leur appel RPC direct par anon/authenticated.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. REVOKE EXECUTE sur toutes les fonctions trigger/utilitaires ───────
-- Ces fonctions sont appelées UNIQUEMENT par des triggers ou du code serveur
-- (service_role). Jamais via REST RPC public.

REVOKE EXECUTE ON FUNCTION public.set_updated_at()                    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_profiles_updated_at()           FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at()                 FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_auction_sessions_updated_at()   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_auction_lots_updated_at()    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_audit_transaction_changes()      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_check_invoice_mismatch()         FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_blocks_grading()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_auction_nda_signed_at()        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()                   FROM anon, authenticated;

-- Helpers RLS : restent SECURITY DEFINER mais révocation appel RPC direct
REVOKE EXECUTE ON FUNCTION public.is_admin(uid uuid)                        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_asset_seller(uid uuid, p_asset_id uuid) FROM anon, authenticated;

-- ── 2. Fix search_path mutable sur update_blocks_grading() ───────────────
-- Le trigger function n'a pas de SET search_path — risque d'injection via
-- search_path manipulation. On recrée la fonction avec SET search_path.

CREATE OR REPLACE FUNCTION public.update_blocks_grading()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.blocks_grading := (
    NEW.required_level = 'blocking'
    AND NEW.admin_quality IN ('missing', 'insufficient')
  );
  RETURN NEW;
END;
$$;

-- Révoquer à nouveau après recréation (CREATE OR REPLACE reset les grants)
REVOKE EXECUTE ON FUNCTION public.update_blocks_grading() FROM anon, authenticated;

-- ── 3. RLS INSERT auction_access_requests — restreindre WITH CHECK ────────
-- Le formulaire de demande d'accès au catalogue est public (anon + auth)
-- mais on exige au minimum que email et full_name soient renseignés.
-- Cela évite le WITH CHECK (true) trop permissif tout en gardant
-- la soumission accessible sans compte.

DROP POLICY IF EXISTS "auction_access_req_insert_public" ON public.auction_access_requests;

CREATE POLICY "auction_access_req_insert_public"
  ON public.auction_access_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email    IS NOT NULL AND length(trim(email))    > 0
    AND full_name IS NOT NULL AND length(trim(full_name)) > 0
  );
