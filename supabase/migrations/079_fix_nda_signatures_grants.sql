-- ============================================================
-- Migration 079 : Fix GRANTs manquants sur public.nda_signatures
-- ============================================================
--
-- La migration 034_nda_signatures.sql a créé la table avec RLS
-- activée mais sans GRANT explicite.
--
-- PostgREST exige un GRANT au niveau objet en plus du bypass RLS.
-- Sans ce GRANT, l'API route /api/nda/sign retourne :
--   code 42501 — "permission denied for table nda_signatures"
--   → affiché côté client : "Erreur lors de la signature."
--
-- Même problème pour nda_asset (scope = 'asset_specific').
-- ============================================================

-- ── Table nda_signatures ──────────────────────────────────────
GRANT ALL    ON public.nda_signatures TO service_role;
GRANT SELECT, INSERT ON public.nda_signatures TO authenticated;
