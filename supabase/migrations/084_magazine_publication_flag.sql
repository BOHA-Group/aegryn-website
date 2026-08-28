-- Migration 084 — Magazine publication flags
-- Table site_settings : clés/valeurs pour les flags de publication

CREATE TABLE IF NOT EXISTS public.site_settings (
  key   text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT 'false'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- RLS : lecture publique, écriture service_role uniquement
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT
  USING (true);

-- Seed : issue-01 non publiée par défaut
INSERT INTO public.site_settings (key, value)
  VALUES ('magazine_issue_01_public', 'false'::jsonb)
  ON CONFLICT (key) DO NOTHING;
