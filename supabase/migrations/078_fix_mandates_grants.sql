-- ============================================================
-- Migration 078 : Fix GRANTs manquants sur public.mandates
-- ============================================================
--
-- La migration 072_mandates.sql a créé la table avec RLS activée
-- mais sans GRANT explicite au rôle service_role.
--
-- PostgREST exige un GRANT au niveau objet en plus du bypass RLS.
-- Sans ce GRANT, l'API route /api/transact/mandate retourne :
--   code 42501 — "permission denied for table mandates"
--
-- La vue my_mandates a également besoin d'être accessible.
-- ============================================================

-- ── Table mandates ────────────────────────────────────────────
GRANT ALL   ON public.mandates TO service_role;
GRANT SELECT, INSERT ON public.mandates TO authenticated;
GRANT INSERT ON public.mandates TO anon;

-- ── Vue my_mandates ───────────────────────────────────────────
GRANT SELECT ON public.my_mandates TO authenticated;
GRANT SELECT ON public.my_mandates TO service_role;

-- ── ENUMs : pas de GRANT nécessaire (accessible via la table) ─
-- mandate_type, mandate_status, mandate_vertical déjà utilisables.
