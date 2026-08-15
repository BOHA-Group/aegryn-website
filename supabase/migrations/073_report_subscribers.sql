-- ════════════════════════════════════════════════════════════════════════
-- 073_report_subscribers.sql
--
-- The AEGRYN Report — abonnements aux notifications de parution annuelle.
--
-- DISTINCT de newsletter_subscribers (031) qui gère le blog hebdomadaire.
--
-- Fonctionnement :
--   • Tout visiteur (connecté ou non) peut s'inscrire via email seul.
--   • Avec compte : inscription liée via user_id (opt-in explicite requis).
--   • À chaque nouvelle édition : email d'annonce via Resend
--     avec lien vers la page web + lien PDF.
--   • Pas de curseur d'articles — une notification par édition annuelle.
--   • Désabonnement via token dans l'email.
--
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.report_subscribers (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  email              TEXT        NOT NULL UNIQUE,
  user_id            UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  locale             TEXT        NOT NULL DEFAULT 'en'
                                  CHECK (locale IN ('fr','en','de','es','it','nl')),

  status             TEXT        NOT NULL DEFAULT 'active'
                                  CHECK (status IN ('active','unsubscribed')),
  unsubscribe_token  UUID        NOT NULL DEFAULT gen_random_uuid(),

  -- Dernière édition notifiée (ex: '2026')
  last_notified_edition  TEXT,
  last_notified_at       TIMESTAMPTZ,

  subscribed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at    TIMESTAMPTZ
);

COMMENT ON TABLE public.report_subscribers IS
  'Abonnés aux notifications de parution annuelle de The AEGRYN Report. '
  'Distinct de newsletter_subscribers (blog hebdomadaire). '
  'Un email par édition — pas de curseur d''articles.';

COMMENT ON COLUMN public.report_subscribers.last_notified_edition IS
  'Identifiant de la dernière édition notifiée (ex: ''2026'') — évite les doublons d''envoi.';

CREATE INDEX IF NOT EXISTS report_subscribers_status_idx ON public.report_subscribers (status);
CREATE INDEX IF NOT EXISTS report_subscribers_email_idx  ON public.report_subscribers (email);
CREATE INDEX IF NOT EXISTS report_subscribers_user_idx   ON public.report_subscribers (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS report_subscribers_token_idx
  ON public.report_subscribers (unsubscribe_token);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.report_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_report_subscribers"
  ON public.report_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.report_subscribers TO service_role;
