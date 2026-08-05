-- Migration 059 — Leads qualifiés fiches experts (RGPD/LPD)
-- Objectif : tracer l'identité des visiteurs qui cliquent "Contacter" sur une fiche expert,
-- après consentement explicite, pour alimenter le pipeline commercial AEGRYN.

-- ── 1. Table expert_contact_leads ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.expert_contact_leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id       UUID        NOT NULL REFERENCES public.expert_profiles(id) ON DELETE CASCADE,
  -- Identité du demandeur
  first_name      TEXT        NOT NULL,
  last_name       TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  -- Consentement RGPD/LPD
  consent_given   BOOLEAN     NOT NULL DEFAULT false,
  consent_at      TIMESTAMPTZ,          -- timestamp exact du clic "J'accepte"
  consent_ip      TEXT,                 -- IP au moment du consentement
  consent_ua      TEXT,                 -- User-Agent au moment du consentement
  -- Contexte contextuel
  filter_category  TEXT,
  filter_domain    TEXT,
  filter_specialty TEXT,
  filter_country   TEXT,
  referrer         TEXT,
  -- Lien vers le clic KPI correspondant (optionnel, pour jointure)
  click_id         UUID REFERENCES public.expert_contact_clicks(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ecl_expert_id  ON public.expert_contact_leads(expert_id);
CREATE INDEX IF NOT EXISTS idx_ecl_email       ON public.expert_contact_leads(email);
CREATE INDEX IF NOT EXISTS idx_ecl_created_at  ON public.expert_contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ecl_consent     ON public.expert_contact_leads(consent_given);

-- ── 2. RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE public.expert_contact_leads ENABLE ROW LEVEL SECURITY;

-- Insert public (page publique, pas d'auth requise)
CREATE POLICY "ecl_insert_public"
  ON public.expert_contact_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Lecture : service_role uniquement (admin)
GRANT SELECT, INSERT ON public.expert_contact_leads TO anon;
GRANT SELECT, INSERT ON public.expert_contact_leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expert_contact_leads TO service_role;

-- ── 3. Vue agrégée admin — leads par expert ───────────────────────────────────

CREATE OR REPLACE VIEW public.expert_lead_stats AS
SELECT
  ep.id                                                    AS expert_id,
  ep.first_name                                            AS expert_first_name,
  ep.last_name                                             AS expert_last_name,
  ep.profession,
  ep.is_visible,
  COUNT(ecl.id)                                            AS total_leads,
  COUNT(ecl.id) FILTER (WHERE ecl.consent_given = true)   AS consented_leads,
  COUNT(ecl.id) FILTER (WHERE ecl.created_at >= NOW() - INTERVAL '7 days')  AS leads_7d,
  COUNT(ecl.id) FILTER (WHERE ecl.created_at >= NOW() - INTERVAL '30 days') AS leads_30d,
  MAX(ecl.created_at)                                      AS last_lead_at
FROM public.expert_profiles ep
LEFT JOIN public.expert_contact_leads ecl ON ecl.expert_id = ep.id
GROUP BY ep.id, ep.first_name, ep.last_name, ep.profession, ep.is_visible
ORDER BY total_leads DESC;

GRANT SELECT ON public.expert_lead_stats TO service_role;
