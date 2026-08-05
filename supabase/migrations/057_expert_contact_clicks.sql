-- Migration 057 — Suivi des clics sur les fiches experts
-- Objectif : tracer chaque clic "Contact" (email) ou "Site" depuis la page publique /experts
-- pour piloter la traction du réseau et identifier les experts les plus sollicités.

-- ── 1. Table expert_contact_clicks ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.expert_contact_clicks (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id      UUID        NOT NULL REFERENCES public.expert_profiles(id) ON DELETE CASCADE,
  click_type     TEXT        NOT NULL CHECK (click_type IN ('email', 'website')),
  -- Contexte visitor (anonyme — pas de user_id : page publique)
  ip_address     TEXT,
  user_agent     TEXT,
  referrer       TEXT,
  -- Filtres actifs au moment du clic (pour analyser les intentions)
  filter_category  TEXT,
  filter_domain    TEXT,
  filter_specialty TEXT,
  filter_country   TEXT,
  clicked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expert_clicks_expert_id  ON public.expert_contact_clicks(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_clicks_type       ON public.expert_contact_clicks(click_type);
CREATE INDEX IF NOT EXISTS idx_expert_clicks_clicked_at ON public.expert_contact_clicks(clicked_at DESC);

-- ── 2. RLS — lecture admin uniquement (via service_role), insert public ────────

ALTER TABLE public.expert_contact_clicks ENABLE ROW LEVEL SECURITY;

-- Tout visiteur peut insérer (page publique, pas d'auth requise)
CREATE POLICY "expert_clicks_insert_public"
  ON public.expert_contact_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Lecture : service_role uniquement (admin)
GRANT SELECT, INSERT ON public.expert_contact_clicks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expert_contact_clicks TO service_role;
GRANT INSERT ON public.expert_contact_clicks TO authenticated;

-- ── 3. Vue agrégée pour dashboard admin ─────────────────────────────────────

CREATE OR REPLACE VIEW public.expert_click_stats AS
SELECT
  ep.id                                          AS expert_id,
  ep.first_name,
  ep.last_name,
  ep.profession,
  ep.is_visible,
  COUNT(*)                                       AS total_clicks,
  COUNT(*) FILTER (WHERE ecc.click_type = 'email')   AS email_clicks,
  COUNT(*) FILTER (WHERE ecc.click_type = 'website') AS website_clicks,
  COUNT(*) FILTER (WHERE ecc.clicked_at >= NOW() - INTERVAL '7 days')  AS clicks_7d,
  COUNT(*) FILTER (WHERE ecc.clicked_at >= NOW() - INTERVAL '30 days') AS clicks_30d,
  MAX(ecc.clicked_at)                            AS last_click_at
FROM public.expert_profiles ep
LEFT JOIN public.expert_contact_clicks ecc ON ecc.expert_id = ep.id
GROUP BY ep.id, ep.first_name, ep.last_name, ep.profession, ep.is_visible
ORDER BY total_clicks DESC;

GRANT SELECT ON public.expert_click_stats TO service_role;
