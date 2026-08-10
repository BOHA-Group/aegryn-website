-- ── Migration 063 — Fix RLS expert_referrals + expert_subscription_credits ──
--
-- Le service_role Supabase bypass normalement la RLS automatiquement,
-- mais seulement si le client est créé avec auth.persistSession = false
-- ET que la policy n'utilise pas auth.role() qui renvoie 'anon' côté server.
-- Solution : désactiver RLS sur ces tables et se reposer sur le service_role.
-- Les données sont protégées par le fait que seul le service_role y accède.
-- Les utilisateurs ne peuvent lire que via les API routes (pas d'accès direct).

-- Désactiver RLS sur expert_referrals
ALTER TABLE public.expert_referrals DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur expert_subscription_credits
ALTER TABLE public.expert_subscription_credits DISABLE ROW LEVEL SECURITY;
