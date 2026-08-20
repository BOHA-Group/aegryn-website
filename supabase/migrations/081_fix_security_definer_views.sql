-- ============================================================
-- Migration 081 : Corriger les vues SECURITY DEFINER
-- ============================================================
--
-- Supabase Linter — 3 erreurs SECURITY DEFINER détectées :
--   - public.buyer_term_sheets_view
--   - public.seller_term_sheets_view
--   - public.my_mandates
--
-- Problème : PostgreSQL applique SECURITY DEFINER par défaut sur
-- les vues. Cela signifie que la RLS est évaluée avec les droits
-- du créateur de la vue (postgres/service_role), non de l'appelant.
-- Un utilisateur peut potentiellement voir des lignes qui ne lui
-- appartiennent pas si une policy est permissive.
--
-- Solution : recréer les vues avec WITH (security_invoker = true)
-- → la RLS est évaluée avec les droits de l'utilisateur appelant.
-- Les filtres WHERE auth.uid() dans ces vues sont déjà corrects
-- mais security_invoker garantit que RLS de term_sheets/mandates
-- s'applique aussi en double protection.
-- ============================================================


-- ── buyer_term_sheets_view ────────────────────────────────────

CREATE OR REPLACE VIEW public.buyer_term_sheets_view
  WITH (security_invoker = true)
AS
SELECT
  ts.id,
  ts.asset_id,
  ts.version,
  ts.parent_id,
  ts.status,
  ts.proposed_price_chf,
  ts.structure,
  ts.price_comment,
  ts.earnout,
  ts.management_contract,
  ts.non_compete,
  ts.warranties,
  ts.dd_duration_days,
  ts.closing_weeks,
  ts.conditions_precedent,
  ts.buyer_profile_note,
  ts.expires_at,
  CASE WHEN ts.status IN ('accepted', 'refused', 'countered')
    THEN ts.seller_response_note
    ELSE NULL
  END AS seller_response_note,
  ts.created_at,
  ts.updated_at
FROM public.term_sheets ts
WHERE ts.buyer_id = auth.uid();

GRANT SELECT ON public.buyer_term_sheets_view TO authenticated;
GRANT SELECT ON public.buyer_term_sheets_view TO service_role;


-- ── seller_term_sheets_view ───────────────────────────────────

CREATE OR REPLACE VIEW public.seller_term_sheets_view
  WITH (security_invoker = true)
AS
SELECT
  ts.id,
  ts.asset_id,
  ts.version,
  ts.parent_id,
  ts.status,
  ts.proposed_price_chf,
  ts.structure,
  ts.price_comment,
  ts.earnout,
  ts.management_contract,
  ts.non_compete,
  ts.warranties,
  ts.dd_duration_days,
  ts.closing_weeks,
  ts.conditions_precedent,
  ts.buyer_profile_note,
  ts.expires_at,
  ts.seller_response_note,
  ts.created_at,
  ts.updated_at,
  row_number() OVER (
    PARTITION BY ts.asset_id
    ORDER BY ts.created_at
  ) AS buyer_rank
FROM public.term_sheets ts
WHERE EXISTS (
  SELECT 1 FROM public.assets
  WHERE assets.id = ts.asset_id
    AND assets.seller_uid = auth.uid()
);

GRANT SELECT ON public.seller_term_sheets_view TO authenticated;
GRANT SELECT ON public.seller_term_sheets_view TO service_role;


-- ── my_mandates ───────────────────────────────────────────────

CREATE OR REPLACE VIEW public.my_mandates
  WITH (security_invoker = true)
AS
SELECT
  id,
  type,
  status,
  vertical,
  vertical_other,
  budget_min_chf,
  budget_max_chf,
  description,
  criteria,
  exclusivity,
  exclusivity_months,
  nda_signed_at,
  mandate_signed_at,
  asset_id,
  contact_email,
  contact_name,
  company_name,
  source,
  created_at,
  updated_at
FROM public.mandates
WHERE user_id = auth.uid();

GRANT SELECT ON public.my_mandates TO authenticated;
GRANT SELECT ON public.my_mandates TO service_role;
