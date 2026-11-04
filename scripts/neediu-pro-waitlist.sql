-- ============================================================
-- Préinscription des pros neediu (formulaire aegryn.com/<langue>/neediu/pro)
--
-- À APPLIQUER dans le projet Supabase neediu-react (ref ttiqahbkzigkogcxmmsg), le maître des données :
-- jamais dans aegryn-auction (base du site Aegryn). Le site Aegryn n'écrit qu'ici, depuis son API serveur
-- (POST /api/neediu/waitlist), avec NEEDIU_SUPABASE_SERVICE_ROLE_KEY. Aucune clé n'est exposée au navigateur.
--
-- S'insère dans l'existant, sans rien recréer :
--   * colonnes alignées sur provider_profiles : business_name, vat_number, city (city_name), service_keys ;
--   * service_keys validées contre service_categories.name : le catalogue neediu décide des services valides ;
--   * téléphone : même contrainte E.164 que profiles_phone_e164 ;
--   * accès admin : public.is_admin() existant (admin@boha-group.com + aal2), comme les autres tables admin ;
--   * à la création du profil prestataire, les champs sont repris dans provider_profiles et la
--     préinscription passe à « activated » ;
--   * purge planifiée avec pg_cron, comme 20260713090014_data_retention_purge.sql ;
--   * table ajoutée à supabase_realtime comme 20261106000000_admin_realtime.sql.
--
-- Statuts : pending_email (e-mail de confirmation envoyé, lien pas encore ouvert), confirmed (lien ouvert :
-- l'adresse est vérifiée), invited (invitation d'ouverture envoyée par l'admin), activated (compte
-- prestataire créé), rejected, archived.
--
-- À tracer ensuite dans docs/plan-recette-exploitation.md (règle du projet neediu-app) et à valider par un test
-- sous supabase/tests/.
-- ============================================================

-- ── 1. Table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.provider_preregistrations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name         text        NOT NULL,
  last_name          text        NOT NULL,
  email              text        NOT NULL,                       -- minuscules (l'API les normalise)
  phone              text        NOT NULL,
  business_name      text        NOT NULL,                       -- = provider_profiles.business_name
  vat_number         text        NOT NULL,                       -- = provider_profiles.vat_number
  country_code       text        NOT NULL,                       -- = service_coverage.country_code (ISO 3166-1 alpha-2), déduit de la ville
  city_name          text        NOT NULL,                       -- = service_coverage.city_name (Bruxelles, Paris, Genève, Lausanne : le formulaire n'en propose pas d'autres pour l'instant)
  city_group         text,                                       -- regroupement si des villes libres sont ouvertes plus tard
  service_keys       text[]      NOT NULL DEFAULT '{}',          -- = provider_profiles.service_keys (service_categories.name)
  locale             text        NOT NULL DEFAULT 'fr',          -- = profiles.lang
  consent_at         timestamptz NOT NULL,
  consent_version    text        NOT NULL,
  status             text        NOT NULL DEFAULT 'pending_email',
  confirm_token_hash text,
  confirm_expires_at timestamptz,
  confirmed_at       timestamptz,
  invited_at         timestamptz,
  activated_at       timestamptz,
  activated_user_id  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_note         text,
  source             text        NOT NULL DEFAULT 'aegryn-neediu-pro',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT provider_prereg_status_check CHECK (status IN ('pending_email', 'confirmed', 'invited', 'activated', 'rejected', 'archived')),
  CONSTRAINT provider_prereg_phone_e164   CHECK (phone ~ '^\+[1-9]\d{7,14}$'),
  CONSTRAINT provider_prereg_services_min CHECK (cardinality(service_keys) >= 1),
  CONSTRAINT provider_prereg_email_lower  CHECK (email = lower(email)),
  CONSTRAINT provider_prereg_email_key    UNIQUE (email)                -- cible de l'upsert de l'API
);

CREATE INDEX IF NOT EXISTS provider_prereg_status_idx ON public.provider_preregistrations (status, created_at DESC);
CREATE INDEX IF NOT EXISTS provider_prereg_city_idx   ON public.provider_preregistrations (country_code, city_name);

DROP TRIGGER IF EXISTS provider_prereg_updated_at ON public.provider_preregistrations;
CREATE TRIGGER provider_prereg_updated_at
  BEFORE UPDATE ON public.provider_preregistrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 2. Le catalogue neediu décide des services valides ───────
CREATE OR REPLACE FUNCTION public.trg_fn_provider_prereg_check_services()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_unknown text[];
BEGIN
  SELECT array_agg(k) INTO v_unknown
  FROM unnest(NEW.service_keys) AS k
  WHERE NOT EXISTS (SELECT 1 FROM public.service_categories sc WHERE sc.name = k);
  IF v_unknown IS NOT NULL THEN
    RAISE EXCEPTION 'unknown service_keys: %', v_unknown USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS provider_prereg_check_services ON public.provider_preregistrations;
CREATE TRIGGER provider_prereg_check_services
  BEFORE INSERT OR UPDATE OF service_keys ON public.provider_preregistrations
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_provider_prereg_check_services();

-- ── 3. RLS : admin seul (le service_role de l'API Aegryn contourne la RLS) ──
ALTER TABLE public.provider_preregistrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "provider_prereg_admin_all" ON public.provider_preregistrations;
CREATE POLICY "provider_prereg_admin_all" ON public.provider_preregistrations
  FOR ALL
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON public.provider_preregistrations FROM anon;

-- ── 4. Pilotage depuis l'espace admin mobile ─────────────────
-- Les jetons de confirmation ne sortent jamais de la base.
CREATE OR REPLACE FUNCTION public.admin_list_provider_preregistrations(
  p_status text DEFAULT NULL,
  p_city   text DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_limit  int  DEFAULT 100,
  p_offset int  DEFAULT 0
)
RETURNS TABLE (
  id uuid, first_name text, last_name text, email text, phone text, business_name text, vat_number text,
  country_code text, city_name text, city_group text, service_keys text[], locale text, status text,
  consent_at timestamptz, confirmed_at timestamptz, invited_at timestamptz, activated_at timestamptz,
  activated_user_id uuid, admin_note text, created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  RETURN QUERY
  SELECT r.id, r.first_name, r.last_name, r.email, r.phone, r.business_name, r.vat_number,
         r.country_code, r.city_name, r.city_group, r.service_keys, r.locale, r.status,
         r.consent_at, r.confirmed_at, r.invited_at, r.activated_at, r.activated_user_id, r.admin_note, r.created_at
  FROM public.provider_preregistrations r
  WHERE (p_status IS NULL OR r.status = p_status)
    AND (p_city   IS NULL OR r.city_name ILIKE p_city OR r.city_group ILIKE p_city)
    AND (p_search IS NULL OR r.email ILIKE '%' || p_search || '%' OR r.last_name ILIKE '%' || p_search || '%'
                          OR r.business_name ILIKE '%' || p_search || '%')
  ORDER BY r.created_at DESC
  LIMIT greatest(least(p_limit, 500), 1) OFFSET greatest(p_offset, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_provider_preregistration_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object(
    'by_status', coalesce((SELECT jsonb_object_agg(status, n) FROM (
        SELECT status, count(*) AS n FROM public.provider_preregistrations GROUP BY status) s), '{}'::jsonb),
    'by_city', coalesce((SELECT jsonb_agg(jsonb_build_object('country', country_code, 'city', city, 'n', n) ORDER BY n DESC) FROM (
        SELECT country_code, coalesce(city_group, city_name) AS city, count(*) AS n
        FROM public.provider_preregistrations WHERE status IN ('confirmed', 'invited')
        GROUP BY 1, 2 ORDER BY n DESC LIMIT 30) c), '[]'::jsonb),
    'by_service', coalesce((SELECT jsonb_agg(jsonb_build_object('service', k, 'n', n) ORDER BY n DESC) FROM (
        SELECT unnest(service_keys) AS k, count(*) AS n
        FROM public.provider_preregistrations WHERE status IN ('confirmed', 'invited') GROUP BY 1) v), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_provider_preregistration_status(
  p_id     uuid,
  p_status text,
  p_note   text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  IF p_status NOT IN ('confirmed', 'invited', 'rejected', 'archived') THEN
    RAISE EXCEPTION 'invalid status %', p_status USING ERRCODE = '22023';
  END IF;
  UPDATE public.provider_preregistrations
  SET status     = p_status,
      invited_at = CASE WHEN p_status = 'invited' THEN now() ELSE invited_at END,
      admin_note = coalesce(p_note, admin_note)
  WHERE id = p_id AND status <> 'pending_email' AND status <> 'activated';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_city_provider_preregistrations(p_city text, p_country text DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE v int;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  -- Invite toutes les préinscriptions confirmées d'une ville (à l'ouverture de la ville).
  UPDATE public.provider_preregistrations
  SET status = 'invited', invited_at = now()
  WHERE status = 'confirmed'
    AND (city_name ILIKE p_city OR city_group ILIKE p_city)
    AND (p_country IS NULL OR country_code = upper(p_country));
  GET DIAGNOSTICS v = ROW_COUNT;
  RETURN v;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_provider_preregistration(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  DELETE FROM public.provider_preregistrations WHERE id = p_id;   -- effacement (RGPD / LPD)
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_provider_preregistrations(text, text, text, int, int) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_provider_preregistration_stats()                           FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_set_provider_preregistration_status(uuid, text, text)      FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_city_provider_preregistrations(text, text)                 FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_delete_provider_preregistration(uuid)                      FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_provider_preregistrations(text, text, text, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_provider_preregistration_stats()                           TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_provider_preregistration_status(uuid, text, text)      TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_city_provider_preregistrations(text, text)                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_provider_preregistration(uuid)                      TO authenticated;
-- (chaque fonction vérifie public.is_admin() : un utilisateur authentifié non admin reçoit « forbidden »)

-- ── 5. Reprise dans provider_profiles à la création du compte prestataire ──
-- Rapproche par e-mail ; ne remplace jamais une valeur déjà saisie.
CREATE OR REPLACE FUNCTION public.trg_fn_link_provider_preregistration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_email text;
  v_reg   public.provider_preregistrations%ROWTYPE;
BEGIN
  SELECT lower(email) INTO v_email FROM auth.users WHERE id = NEW.id;
  IF v_email IS NULL THEN RETURN NEW; END IF;

  SELECT * INTO v_reg
  FROM public.provider_preregistrations
  WHERE lower(email) = v_email AND status IN ('confirmed', 'invited')
  LIMIT 1;
  IF NOT FOUND THEN RETURN NEW; END IF;

  UPDATE public.provider_profiles pp
  SET business_name = coalesce(pp.business_name, v_reg.business_name),
      vat_number    = coalesce(pp.vat_number,    v_reg.vat_number),
      city          = coalesce(pp.city,          v_reg.city_name),
      service_keys  = CASE WHEN coalesce(cardinality(pp.service_keys), 0) = 0 THEN v_reg.service_keys ELSE pp.service_keys END
  WHERE pp.id = NEW.id;

  UPDATE public.provider_preregistrations
  SET status = 'activated', activated_at = now(), activated_user_id = NEW.id
  WHERE id = v_reg.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS provider_profiles_link_prereg ON public.provider_profiles;
CREATE TRIGGER provider_profiles_link_prereg
  AFTER INSERT ON public.provider_profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_link_provider_preregistration();

-- ── 6. Purge : préinscriptions non confirmées supprimées après 60 jours ──
-- « Non confirmée » = statut pending_email : le lien de confirmation reçu par e-mail n'a pas été ouvert.
CREATE OR REPLACE FUNCTION public.purge_unconfirmed_provider_preregistrations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v int;
BEGIN
  DELETE FROM public.provider_preregistrations
  WHERE status = 'pending_email' AND created_at < now() - INTERVAL '60 days';
  GET DIAGNOSTICS v = ROW_COUNT;
  RETURN v;
END;
$$;
REVOKE ALL ON FUNCTION public.purge_unconfirmed_provider_preregistrations() FROM public, anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('purge-unconfirmed-provider-preregistrations', '30 3 * * *',
                          $cron$SELECT public.purge_unconfirmed_provider_preregistrations();$cron$);
  END IF;
END $$;

-- ── 7. Temps réel pour l'espace admin mobile ─────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (SELECT 1 FROM pg_publication_tables
                      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'provider_preregistrations') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.provider_preregistrations;
  END IF;
END $$;
