-- ════════════════════════════════════════════════════════════════════════
-- 032_fix_missing_grants_auction_kyc_benchmark.sql
--
-- BUG CRITIQUE — Les migrations 008 à 016 créent leurs tables SANS jamais
-- délivrer de GRANT explicite à service_role. La RLS seule ne suffit pas
-- pour PostgREST (cf. migration 022, même piège reproduit sur newsletter_
-- subscribers en migration 031). Résultat : TOUTES les requêtes service_role
-- vers ces tables échouent avec `permission denied` (42501) depuis leur
-- création — c'est-à-dire que les pages suivantes sont actuellement cassées
-- en production :
--
--   • /admin (compteurs KYC pending, bids submitted)
--   • /admin/offers, /admin/offers/[id]
--   • /admin/analytics
--   • /admin/assets/[id]/grade (benchmark + comparables)
--   • /admin/sessions
--   • /admin/kyc, /admin/kyc/[memberId]
--   • /admin/auction
--   • /admin/settings/benchmark
--   • /client/buyer (dashboard — dernières offres)
--   • /client/buyer/catalogue/[id] (vérif offre existante)
--   • /client/buyer/offres, /offres/[id], /offres/new
--
-- Vérifié en direct par requête service_role sur la base réelle avant
-- correctif (25/07/2026) : 42501 permission denied sur les 9 relations
-- ci-dessous.
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── auction_lots / auction_lot_access (008 — legacy, non référencé dans le
--    code applicatif actuel qui utilise auction_assets, mais corrigé par
--    cohérence/sécurité au cas où les données existent encore) ──────────────
GRANT ALL ON public.auction_lots        TO service_role;
GRANT ALL ON public.auction_lot_access  TO service_role;

-- ── auction_assets / auction_asset_access (009) ─────────────────────────────
GRANT ALL    ON public.auction_assets        TO service_role;
GRANT SELECT ON public.auction_assets        TO authenticated;
GRANT ALL    ON public.auction_asset_access  TO service_role;
GRANT SELECT ON public.auction_asset_access  TO authenticated;

-- ── auction_dossier_requests / auction_access_log (010) ─────────────────────
GRANT ALL           ON public.auction_dossier_requests TO service_role;
GRANT SELECT, INSERT ON public.auction_dossier_requests TO authenticated;
GRANT ALL    ON public.auction_access_log    TO service_role;
GRANT SELECT ON public.auction_access_log    TO authenticated;

-- ── buyer_kyc_verifications / auction_sequesters / auction_bids (011) ───────
GRANT ALL    ON public.buyer_kyc_verifications TO service_role;
GRANT SELECT ON public.buyer_kyc_verifications TO authenticated;
GRANT ALL    ON public.auction_sequesters      TO service_role;
GRANT SELECT ON public.auction_sequesters      TO authenticated;
GRANT ALL    ON public.auction_bids            TO service_role;
GRANT SELECT ON public.auction_bids            TO authenticated;

-- ── auction_admin_summary — vue de synthèse admin (011) ─────────────────────
GRANT SELECT ON public.auction_admin_summary TO service_role;

-- ── auction_sessions (013) ──────────────────────────────────────────────────
GRANT ALL    ON public.auction_sessions TO service_role;
GRANT SELECT ON public.auction_sessions TO anon;
GRANT SELECT ON public.auction_sessions TO authenticated;

-- ── benchmark_data (014) ────────────────────────────────────────────────────
GRANT ALL    ON public.benchmark_data TO service_role;
GRANT SELECT ON public.benchmark_data TO anon;
GRANT SELECT ON public.benchmark_data TO authenticated;

-- ── transaction_results (015) ───────────────────────────────────────────────
GRANT ALL    ON public.transaction_results TO service_role;
GRANT SELECT ON public.transaction_results TO anon;
GRANT SELECT ON public.transaction_results TO authenticated;

-- ── Séquences éventuellement associées ──────────────────────────────────────
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;
