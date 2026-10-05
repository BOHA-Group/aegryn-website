-- 119_advisory_leads.sql
-- Demandes issues des pages metiers ACCOMPAGNER (/advisory/*).
-- Chaque bouton (echange ou action specifique) poste ici, etiquete par
-- metier + action, avec une reponse a la question specifique de l'action.

CREATE TABLE IF NOT EXISTS public.advisory_leads (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Origine de la demande
  metier      TEXT        NOT NULL
                          CHECK (metier IN ('strategie', 'conformite', 'technologie', 'talent', 'ma')),
  action      TEXT        NOT NULL,
  locale      TEXT        NOT NULL DEFAULT 'fr',

  -- Contact
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,

  -- Champs communs
  revenue_band TEXT       CHECK (revenue_band IS NULL OR revenue_band IN ('10_50m', '50_300m', 'autre')),
  sector_cluster TEXT,

  -- Reponse a la question specifique de l'action
  answer      TEXT,

  -- Consentement newsletter, case separee non cochee par defaut
  newsletter_optin BOOLEAN NOT NULL DEFAULT false,

  status      TEXT        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'spam')),
  notes       TEXT
);

CREATE INDEX IF NOT EXISTS idx_advisory_leads_created_at ON public.advisory_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_advisory_leads_metier     ON public.advisory_leads (metier);

CREATE TRIGGER trg_advisory_leads_updated_at
  BEFORE UPDATE ON public.advisory_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.advisory_leads ENABLE ROW LEVEL SECURITY;

-- Insertion publique depuis le formulaire de contact (pas de lecture publique)
CREATE POLICY "advisory_leads_insert_public"
  ON public.advisory_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email <> '' AND full_name IS NOT NULL AND full_name <> '');

GRANT INSERT ON public.advisory_leads TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advisory_leads TO service_role;
