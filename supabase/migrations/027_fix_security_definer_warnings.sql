-- Migration 027 — Fix SECURITY DEFINER function exposure via REST API
-- Revoke EXECUTE from anon + authenticated on internal trigger functions.
-- These functions are called by triggers only — never via /rest/v1/rpc/.

REVOKE EXECUTE ON FUNCTION public.handle_new_user()                    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at()                  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at()                     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_profiles_updated_at()            FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_auction_sessions_updated_at()    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_auction_lots_updated_at()     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()                    FROM anon, authenticated;
