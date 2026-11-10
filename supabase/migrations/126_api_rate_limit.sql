-- Limite de requêtes des formulaires publics (par adresse IP hachée) : évite l'inscription en masse, le spam de courriels et la saturation des listes de l'équipe.
CREATE TABLE IF NOT EXISTS public.api_rate_hits (
  id         bigserial PRIMARY KEY,
  bucket     text NOT NULL,
  subject    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS api_rate_hits_lookup ON public.api_rate_hits (bucket, subject, created_at DESC);
ALTER TABLE public.api_rate_hits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.api_rate_hits FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.api_rate_hits_id_seq FROM PUBLIC, anon, authenticated;

-- Retourne true si la requête est autorisée (dans la limite), false si la limite est dépassée. Appelée uniquement par le serveur (clé de service).
CREATE OR REPLACE FUNCTION public.api_rate_limit(p_bucket text, p_subject text, p_max integer, p_window_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_count integer;
BEGIN
  INSERT INTO public.api_rate_hits (bucket, subject) VALUES (left(p_bucket, 60), left(p_subject, 80));
  SELECT count(*) INTO v_count FROM public.api_rate_hits
   WHERE bucket = left(p_bucket, 60) AND subject = left(p_subject, 80) AND created_at > now() - make_interval(secs => p_window_seconds);
  IF random() < 0.02 THEN DELETE FROM public.api_rate_hits WHERE created_at < now() - interval '2 days'; END IF;
  RETURN v_count <= p_max;
END $$;
REVOKE ALL ON FUNCTION public.api_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.api_rate_limit(text, text, integer, integer) TO service_role;
