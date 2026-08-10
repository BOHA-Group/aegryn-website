-- ── Migration 063 — Fix RLS expert_referrals + expert_subscription_credits ──
--
-- Le service_role Supabase bypass la RLS nativement sans policy dédiée.
-- Les policies *_service_all avec auth.role() étaient incorrectes (auth.role()
-- renvoie 'anon' côté API Next.js même avec la service key).
-- Solution : réactiver RLS + supprimer les policies service_role inutiles.
-- Le service_role bypasse toujours RLS nativement — pas besoin de policy pour lui.
-- Les utilisateurs authentifiés peuvent lire leurs propres données via *_own_read.

-- ── expert_referrals ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "referrals_service_all" ON public.expert_referrals;
ALTER TABLE public.expert_referrals ENABLE ROW LEVEL SECURITY;
GRANT INSERT, UPDATE, DELETE, SELECT ON public.expert_referrals TO service_role;

-- ── expert_subscription_credits ───────────────────────────────────────────────
DROP POLICY IF EXISTS "credits_service_all" ON public.expert_subscription_credits;
ALTER TABLE public.expert_subscription_credits ENABLE ROW LEVEL SECURITY;
GRANT INSERT, UPDATE, DELETE, SELECT ON public.expert_subscription_credits TO service_role;
