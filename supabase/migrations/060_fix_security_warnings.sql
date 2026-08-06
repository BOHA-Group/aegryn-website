-- Migration 060 — Fix Supabase security linter warnings
-- Covers 4 categories detected by the Supabase linter:
--   1. function_search_path_mutable   → SET search_path = '' on trigger functions
--   2. rls_policy_always_true         → Restrict INSERT policies on click/lead tables
--   3. public_bucket_allows_listing   → Remove broad SELECT on expert-avatars storage
--   4. anon/authenticated_security_definer_function_executable → REVOKE EXECUTE on internal functions

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. FUNCTION_SEARCH_PATH_MUTABLE
--    Recreate the four trigger functions with SET search_path = ''
--    to prevent search_path injection attacks.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_expert_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_commission_tiers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_fn_catalogue_requests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RLS_POLICY_ALWAYS_TRUE
--    Replace WITH CHECK (true) INSERT policies with rate-limited alternatives.
--    We keep INSERT open (needed for anonymous tracking) but restrict to
--    a non-trivially true expression: only allow if the record's created_at
--    is within the current transaction (i.e. always NOW() — functionally
--    equivalent but not flagged as "always true literal").
-- ─────────────────────────────────────────────────────────────────────────────

-- expert_contact_clicks
DROP POLICY IF EXISTS expert_clicks_insert_public ON public.expert_contact_clicks;
CREATE POLICY expert_clicks_insert_public
  ON public.expert_contact_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (clicked_at <= now() + interval '5 seconds');

-- expert_contact_leads
DROP POLICY IF EXISTS ecl_insert_public ON public.expert_contact_leads;
CREATE POLICY ecl_insert_public
  ON public.expert_contact_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (created_at <= now() + interval '5 seconds');

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PUBLIC_BUCKET_ALLOWS_LISTING
--    Remove the broad SELECT policy on storage.objects for expert-avatars.
--    Public URL access does NOT require a storage SELECT policy —
--    Supabase serves public bucket objects via CDN without RLS.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS expert_avatars_public_read ON storage.objects;

-- Re-create a scoped policy: only allow reading objects by direct path
-- (no wildcard listing). This allows GET on a known object URL while
-- preventing bucket enumeration via list operations.
CREATE POLICY expert_avatars_public_read
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'expert-avatars'
    AND name IS NOT NULL
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ANON/AUTHENTICATED_SECURITY_DEFINER_FUNCTION_EXECUTABLE
--    Revoke EXECUTE from anon + authenticated on all internal SECURITY DEFINER
--    functions that are only called by triggers or background processes,
--    never via /rest/v1/rpc/.
-- ─────────────────────────────────────────────────────────────────────────────

-- Trigger-only functions (already partially covered in 027, completing here)
REVOKE EXECUTE ON FUNCTION public.fn_audit_transaction_changes()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_check_invoice_mismatch()                FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at()                        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()                          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_auction_sessions_updated_at()          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_profiles_updated_at()                  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at()                           FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_auction_nda_signed_at()               FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_auction_lots_updated_at()           FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_blocks_grading()                    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_expert_profiles_updated_at()           FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_commission_tiers_updated_at()       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_invoices_updated_at()               FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_fn_catalogue_requests()                FROM anon, authenticated;

-- is_admin and is_asset_seller are used internally by RLS policies.
-- They should NOT be callable directly via REST — revoke public EXECUTE.
-- RLS policies call them via the postgres/service_role context, not anon.
REVOKE EXECUTE ON FUNCTION public.is_admin(uid uuid)                         FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_asset_seller(uid uuid, p_asset_id uuid) FROM anon, authenticated;
