/**
 * Migration 022 — GRANTs service_role manquants
 *
 * Les tables créées dans les migrations 017-021 n'avaient pas de GRANT explicite
 * pour service_role sur PostgREST. La RLS seule ne suffit pas — PostgREST
 * nécessite aussi un GRANT au niveau objet.
 *
 * Toutes les tables applicatives sont accessibles uniquement via le service_role
 * (API routes serveur Next.js). Les utilisateurs authentifiés passent par RLS.
 */

-- ── Table profiles (migration 005) — CRITIQUE pour le routing par rôle ───────
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT ON public.profiles TO authenticated;

-- ── Migrations 017 — client spaces ───────────────────────────────────────────
GRANT ALL ON public.partner_certifications  TO service_role;
GRANT ALL ON public.introductions           TO service_role;
GRANT ALL ON public.commissions             TO service_role;
GRANT ALL ON public.kyc_documents           TO service_role;
GRANT ALL ON public.transactions            TO service_role;
GRANT ALL ON public.user_notifications      TO service_role;

-- ── Migration 018 — escrow / referrals ───────────────────────────────────────
-- (tables renommées, GRANTs déjà couverts ci-dessus si même noms)

-- ── Migration 019 — email broadcasts ─────────────────────────────────────────
GRANT ALL ON public.email_broadcasts        TO service_role;

-- ── Migration 020 — buyer commission / dismissed_at ──────────────────────────
-- dismissed_at est une colonne sur user_notifications (déjà couvert)
-- buyer_commission_dues est une vue
GRANT SELECT ON public.buyer_commission_dues TO service_role;
GRANT SELECT ON public.buyer_commission_dues TO authenticated;

-- ── Migration 021 — grade assessments ────────────────────────────────────────
GRANT ALL ON public.grade_assessments       TO service_role;

-- ── Séquences associées ───────────────────────────────────────────────────────
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ── Accès authenticated aux tables RLS-protégées ─────────────────────────────
-- (SELECT seulement — les mutations passent par service_role via API routes)
GRANT SELECT ON public.user_notifications   TO authenticated;
GRANT SELECT ON public.commissions          TO authenticated;
GRANT SELECT ON public.kyc_documents        TO authenticated;
GRANT SELECT ON public.transactions         TO authenticated;
GRANT SELECT ON public.introductions        TO authenticated;
GRANT SELECT ON public.partner_certifications TO authenticated;
GRANT SELECT ON public.email_broadcasts     TO authenticated;
