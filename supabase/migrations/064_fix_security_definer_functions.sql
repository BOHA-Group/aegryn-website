-- ── Migration 064 — Révoquer EXECUTE anon/authenticated sur fonctions SECURITY DEFINER ──
--
-- Ces fonctions sont des triggers internes — elles ne doivent pas être
-- appelables via l'API REST (/rest/v1/rpc/...) par des utilisateurs anonymes
-- ou authentifiés. On révoque EXECUTE pour anon et authenticated.
-- Les triggers continuent de les appeler normalement (via le moteur PG).

REVOKE EXECUTE ON FUNCTION public.fn_audit_transaction_changes()          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_check_invoice_mismatch()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at()                     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()                       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_auction_sessions_updated_at()       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_expert_profiles_updated_at()        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_profiles_updated_at()               FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at()                        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_auction_nda_signed_at()            FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_fn_catalogue_requests()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_auction_lots_updated_at()        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_blocks_grading()                 FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_commission_tiers_updated_at()    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_invoices_updated_at()            FROM anon, authenticated;

-- is_admin et is_asset_seller sont utilisées dans les policies RLS —
-- authenticated peut les appeler (c'est intentionnel), mais pas anon.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid)                          FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_asset_seller(uuid, uuid)             FROM anon;
