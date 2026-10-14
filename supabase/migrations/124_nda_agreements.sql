-- 124_nda_agreements.sql
-- NDA mutuel numérique, indépendant de l'espace compte.
--   nda_agreements  : un accord (projet, langue, durée, version du modèle)
--   nda_signatories : un signataire par ligne, avec lien personnel (hash du jeton),
--                     profils, preuves de signature et contresignature Aegryn
--   nda_events      : journal d'audit, en ajout seul
--
-- Conservation : aucune suppression en cascade ; created_by passe à NULL si le
-- compte admin est supprimé (cf. 054_nda_legal_retention). Les preuves d'une
-- signature enregistrée sont immuables (trigger). Accès réservé au service_role.
-- À exécuter dans le SQL Editor Supabase, après 123.

-- ── Référence lisible : NDA-2026-0001 ────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.nda_reference_seq START 1;

CREATE OR REPLACE FUNCTION public.next_nda_reference()
RETURNS text LANGUAGE sql AS $$
  SELECT 'NDA-' || to_char(now() AT TIME ZONE 'UTC', 'YYYY') || '-'
         || lpad(nextval('public.nda_reference_seq')::text, 4, '0')
$$;

-- ── nda_agreements ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.nda_agreements (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference            TEXT        NOT NULL UNIQUE DEFAULT public.next_nda_reference(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  project_label        TEXT        NOT NULL CHECK (char_length(project_label) BETWEEN 2 AND 200),
  lang                 TEXT        NOT NULL DEFAULT 'fr' CHECK (lang IN ('fr', 'en')),
  term_years           INT         NOT NULL DEFAULT 5 CHECK (term_years BETWEEN 1 AND 20),
  penalty_chf          INT         CHECK (penalty_chf IS NULL OR penalty_chf > 0),
  template_version     TEXT        NOT NULL,

  status               TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'revoked')),
  source_contact_email TEXT,
  note                 TEXT
);

-- ── nda_signatories ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.nda_signatories (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id          UUID        NOT NULL REFERENCES public.nda_agreements(id) ON DELETE RESTRICT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Identité attendue et profils (annexes du modèle)
  full_name             TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  company               TEXT,
  email                 TEXT        NOT NULL CHECK (position('@' IN email) > 1),
  roles                 TEXT[]      NOT NULL
                                    CHECK (cardinality(roles) >= 1 AND roles <@ ARRAY[
                                      'project_owner','investor','institution','industrial','partner','profile','certification'
                                    ]::text[]),

  -- Lien personnel : seul le hash SHA-256 du jeton est stocké
  token_hash            TEXT        NOT NULL UNIQUE,
  token_expires_at      TIMESTAMPTZ NOT NULL,
  status                TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'signed', 'revoked', 'expired')),
  sent_at               TIMESTAMPTZ,
  last_reminder_at      TIMESTAMPTZ,

  -- Preuves de signature (immuables une fois renseignées)
  signed_name           TEXT,
  signed_at             TIMESTAMPTZ,
  ip_address            TEXT,
  user_agent            TEXT,
  content_sha256        TEXT,
  template_version      TEXT,

  -- Contresignature automatique d'Aegryn
  countersigned_by_name  TEXT,
  countersigned_by_title TEXT,
  countersigned_at       TIMESTAMPTZ,

  -- Exemplaire PDF archivé (bucket privé nda-signed)
  pdf_path              TEXT,
  pdf_sha256            TEXT
);

CREATE INDEX IF NOT EXISTS idx_nda_signatories_agreement ON public.nda_signatories (agreement_id);
CREATE INDEX IF NOT EXISTS idx_nda_signatories_email     ON public.nda_signatories (lower(email));
CREATE INDEX IF NOT EXISTS idx_nda_signatories_status    ON public.nda_signatories (status);

-- ── nda_events : journal d'audit en ajout seul ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.nda_events (
  id            BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  agreement_id  UUID        NOT NULL REFERENCES public.nda_agreements(id) ON DELETE RESTRICT,
  signatory_id  UUID        REFERENCES public.nda_signatories(id) ON DELETE RESTRICT,
  event         TEXT        NOT NULL,
  actor         TEXT        NOT NULL DEFAULT 'system',
  ip_address    TEXT,
  meta          JSONB       NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_nda_events_agreement ON public.nda_events (agreement_id, created_at);

-- ── Triggers ─────────────────────────────────────────────────────────────────
CREATE TRIGGER trg_nda_agreements_updated_at
  BEFORE UPDATE ON public.nda_agreements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_nda_signatories_updated_at
  BEFORE UPDATE ON public.nda_signatories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Une signature enregistrée ne se modifie ni ne se supprime ; le PDF ne peut être renseigné qu'une fois.
CREATE OR REPLACE FUNCTION public.nda_signatory_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.signed_at IS NOT NULL THEN
      RAISE EXCEPTION 'nda_signatories: une signature enregistrée ne peut pas être supprimée';
    END IF;
    RETURN OLD;
  END IF;

  IF OLD.signed_at IS NOT NULL AND (
       NEW.signed_at              IS DISTINCT FROM OLD.signed_at
    OR NEW.signed_name            IS DISTINCT FROM OLD.signed_name
    OR NEW.ip_address             IS DISTINCT FROM OLD.ip_address
    OR NEW.user_agent             IS DISTINCT FROM OLD.user_agent
    OR NEW.content_sha256         IS DISTINCT FROM OLD.content_sha256
    OR NEW.template_version       IS DISTINCT FROM OLD.template_version
    OR NEW.countersigned_at       IS DISTINCT FROM OLD.countersigned_at
    OR NEW.countersigned_by_name  IS DISTINCT FROM OLD.countersigned_by_name
    OR NEW.countersigned_by_title IS DISTINCT FROM OLD.countersigned_by_title
    OR NEW.agreement_id           IS DISTINCT FROM OLD.agreement_id
    OR NEW.full_name              IS DISTINCT FROM OLD.full_name
    OR NEW.email                  IS DISTINCT FROM OLD.email
    OR NEW.roles                  IS DISTINCT FROM OLD.roles
    OR (OLD.pdf_path   IS NOT NULL AND NEW.pdf_path   IS DISTINCT FROM OLD.pdf_path)
    OR (OLD.pdf_sha256 IS NOT NULL AND NEW.pdf_sha256 IS DISTINCT FROM OLD.pdf_sha256)
  ) THEN
    RAISE EXCEPTION 'nda_signatories: les preuves d''une signature enregistrée sont immuables';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_nda_signatory_guard
  BEFORE UPDATE OR DELETE ON public.nda_signatories
  FOR EACH ROW EXECUTE FUNCTION public.nda_signatory_guard();

CREATE OR REPLACE FUNCTION public.nda_events_append_only()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'nda_events: journal en ajout seul (modification et suppression interdites)';
END $$;

CREATE TRIGGER trg_nda_events_append_only
  BEFORE UPDATE OR DELETE ON public.nda_events
  FOR EACH ROW EXECUTE FUNCTION public.nda_events_append_only();

-- ── RLS : aucune politique publique, accès service_role uniquement ───────────
ALTER TABLE public.nda_agreements  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nda_signatories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nda_events      ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nda_agreements  TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nda_signatories TO service_role;
GRANT SELECT, INSERT                 ON public.nda_events      TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.nda_reference_seq TO service_role;

-- ── Bucket privé pour les exemplaires PDF signés ─────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('nda-signed', 'nda-signed', false)
ON CONFLICT (id) DO NOTHING;
