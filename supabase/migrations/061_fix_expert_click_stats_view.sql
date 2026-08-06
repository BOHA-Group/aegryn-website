-- ── Fix vue expert_click_stats : JOIN sur user_id au lieu de ep.id ──────────
-- La colonne expert_contact_clicks.expert_id stocke le user_id (auth.users.id)
-- et non l'expert_profiles.id (UUID de ligne).

CREATE OR REPLACE VIEW public.expert_click_stats AS
SELECT
  ep.user_id                                     AS expert_id,
  ep.first_name,
  ep.last_name,
  ep.profession,
  ep.is_visible,
  COUNT(ecc.id)                                              AS total_clicks,
  COUNT(ecc.id) FILTER (WHERE ecc.click_type = 'email')     AS email_clicks,
  COUNT(ecc.id) FILTER (WHERE ecc.click_type = 'website')   AS website_clicks,
  COUNT(ecc.id) FILTER (WHERE ecc.clicked_at >= NOW() - INTERVAL '7 days')  AS clicks_7d,
  COUNT(ecc.id) FILTER (WHERE ecc.clicked_at >= NOW() - INTERVAL '30 days') AS clicks_30d,
  MAX(ecc.clicked_at)                                        AS last_click_at
FROM public.expert_profiles ep
LEFT JOIN public.expert_contact_clicks ecc ON ecc.expert_id = ep.user_id
GROUP BY ep.user_id, ep.first_name, ep.last_name, ep.profession, ep.is_visible
ORDER BY total_clicks DESC;

GRANT SELECT ON public.expert_click_stats TO service_role;
