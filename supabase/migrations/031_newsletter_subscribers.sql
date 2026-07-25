-- ════════════════════════════════════════════════════════════════════════
-- 031_newsletter_subscribers.sql
--
-- Newsletter blog AEGRYN — abonnement email + envoi hebdomadaire automatique.
--
-- Fonctionnement :
--   • Un visiteur (connecté ou non) s'abonne via /api/newsletter/subscribe.
--   • Un cron hebdomadaire (/api/cron/newsletter) envoie à chaque abonné actif
--     le PROCHAIN article (par ordre chronologique) qu'il n'a pas encore reçu.
--   • Une fois tous les articles existants envoyés, l'abonné est "à jour" —
--     il ne reçoit plus rien jusqu'à la publication d'un nouvel article.
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  email              TEXT        NOT NULL UNIQUE,
  user_id            UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  locale             TEXT        NOT NULL DEFAULT 'fr'
                                  CHECK (locale IN ('fr','en','de','es','it','nl')),

  status             TEXT        NOT NULL DEFAULT 'active'
                                  CHECK (status IN ('active','unsubscribed')),
  unsubscribe_token  UUID        NOT NULL DEFAULT gen_random_uuid(),

  -- Curseur de progression dans le backlog d'articles (data/articles.ts)
  last_sent_slug     TEXT,
  last_sent_at       TIMESTAMPTZ,

  subscribed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at    TIMESTAMPTZ
);

COMMENT ON TABLE public.newsletter_subscribers IS
  'Abonnés à la newsletter blog AEGRYN. Un article par semaine, rattrapage automatique du backlog puis bascule sur les nouvelles publications.';
COMMENT ON COLUMN public.newsletter_subscribers.last_sent_slug IS
  'Slug (data/articles.ts) du dernier article envoyé — sert de curseur pour déterminer le prochain envoi hebdomadaire.';

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx ON public.newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx  ON public.newsletter_subscribers (email);
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_token_idx ON public.newsletter_subscribers (unsubscribe_token);

-- ── RLS — accès exclusivement via service_role (API routes) ────────────────
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
