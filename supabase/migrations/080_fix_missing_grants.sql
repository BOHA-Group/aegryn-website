-- ============================================================
-- Migration 080 : Fix GRANTs manquants — audit complet
-- ============================================================
--
-- Constat : plusieurs tables créées avec RLS sans GRANT explicite.
-- PostgREST exige un GRANT objet en plus du bypass RLS.
-- Sans GRANT → code 42501 "permission denied" même avec service_role.
--
-- Tables concernées identifiées par audit (migration 001→079) :
--
--   term_sheets         (070) — 4 policies RLS, 0 GRANT → ❌
--   rgpd_requests       (040) — 1 policy RLS,  0 GRANT → ❌
--   buyer_profiles      (062) — service_role OK, authenticated manquant
--   expert_applications (041) — service_role OK, authenticated manquant
--   expert_profiles     (041) — service_role OK, authenticated manquant
--   sector_benchmarks   (069) — ✅ déjà OK (SELECT anon/authenticated)
--
-- Vues sans GRANT authenticated :
--   buyer_term_sheets_view   (070) → ❌
--   seller_term_sheets_view  (070) → ❌
--   auction_admin_summary    (032) → admin-only OK (service_role)
--   expert_click_stats       (057/061) → admin-only OK (service_role)
--   expert_lead_stats        (059) → admin-only OK (service_role)
-- ============================================================


-- ── term_sheets ───────────────────────────────────────────────
-- Workflow : acquéreur soumet une offre de principe, vendeur
-- accepte/refuse/contre-propose. RLS restricte par profil.

GRANT ALL                       ON public.term_sheets TO service_role;
GRANT SELECT, INSERT            ON public.term_sheets TO authenticated;
-- UPDATE et DELETE via RLS policy "seller_update_term_sheet_status"
-- (UPDATE côté authenticated couvert par la policy, le GRANT suit)
GRANT UPDATE                    ON public.term_sheets TO authenticated;


-- ── Vues term_sheets ──────────────────────────────────────────
-- buyer_term_sheets_view : l'acquéreur ne voit que ses propres term sheets
-- seller_term_sheets_view : le vendeur voit les term sheets sur ses actifs

GRANT SELECT ON public.buyer_term_sheets_view  TO authenticated;
GRANT SELECT ON public.buyer_term_sheets_view  TO service_role;
GRANT SELECT ON public.seller_term_sheets_view TO authenticated;
GRANT SELECT ON public.seller_term_sheets_view TO service_role;


-- ── rgpd_requests ─────────────────────────────────────────────
-- Workflow : utilisateur connecté soumet une demande de suppression
-- de compte (RGPD art. 17). L'admin traite via service_role.

GRANT ALL                       ON public.rgpd_requests TO service_role;
GRANT SELECT, INSERT            ON public.rgpd_requests TO authenticated;


-- ── buyer_profiles ────────────────────────────────────────────
-- Profil enrichi acquéreur (origine, secteur, budget, etc.)
-- Actuellement service_role seul — authenticated ne peut pas
-- lire ni écrire son propre profil enrichi.

GRANT SELECT, INSERT, UPDATE    ON public.buyer_profiles TO authenticated;


-- ── expert_applications ───────────────────────────────────────
-- Candidature réseau expert. Le candidat doit pouvoir soumettre
-- et relire sa propre candidature.

GRANT SELECT, INSERT            ON public.expert_applications TO authenticated;


-- ── expert_profiles ───────────────────────────────────────────
-- Profil public/privé expert. Les policies RLS gèrent déjà
-- is_visible=true pour le public, own pour l'expert lui-même.
-- Le GRANT manquait pour permettre la lecture/écriture authenticated.

GRANT SELECT, INSERT, UPDATE    ON public.expert_profiles TO authenticated;


-- ── newsletter_subscribers / report_subscribers ───────────────
-- Formulaires publics d'inscription. Le visiteur non connecté
-- (anon) et l'utilisateur connecté (authenticated) doivent
-- pouvoir s'inscrire.

GRANT INSERT                    ON public.newsletter_subscribers TO anon;
GRANT INSERT                    ON public.newsletter_subscribers TO authenticated;

GRANT INSERT                    ON public.report_subscribers TO anon;
GRANT INSERT                    ON public.report_subscribers TO authenticated;
