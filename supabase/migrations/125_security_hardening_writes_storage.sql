-- Durcissement sécurité (audit du 10/11/2026).
-- Toutes les écritures du site passent par les routes serveur (clé de service) ; le navigateur n'écrit jamais directement dans les tables.

-- 1. Stockage : le dépôt d'avatars d'experts passe par app/api/experts/avatar (clé de service). Les politiques ouvertes à tous (y compris anonyme)
--    permettaient de déposer ou d'écraser n'importe quelle image du bucket public. La lecture publique reste.
DROP POLICY IF EXISTS expert_avatars_owner_insert ON storage.objects;
DROP POLICY IF EXISTS expert_avatars_owner_update ON storage.objects;

-- 2. Tables : plus aucun droit d'écriture ni de TRUNCATE pour anon et authenticated (les formulaires passent par l'API, avec limites et contrôles).
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT c.relname FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind IN ('r','p') LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.%I FROM anon, authenticated', r.relname);
  END LOOP;
END $$;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- 3. Fonction d'événement sans usage côté API.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
