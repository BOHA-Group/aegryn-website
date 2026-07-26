-- ════════════════════════════════════════════════════════════════════════
-- 037_fix_security_definer_views.sql
--
-- Corrige l'alerte Supabase Security Advisor : 3 vues détectées comme
-- SECURITY DEFINER (comportement implicite hérité de fonctions SECURITY
-- DEFINER dans la chaîne de dépendances).
--
-- Fix : recréer les vues avec security_invoker = true.
-- La vue s'exécute alors avec les droits du querying user → RLS respectée.
--
-- Vues concernées :
--   1. public.partner_commission_summary  (028)
--   2. public.v_data_room_consultations   (033)
--   3. public.v_document_completeness     (035 + 036)
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. partner_commission_summary ────────────────────────────────────────

DROP VIEW IF EXISTS public.partner_commission_summary;

CREATE VIEW public.partner_commission_summary
  WITH (security_invoker = true)
AS
SELECT
  c.id,
  c.partner_id,
  c.type,
  c.mandate_id,
  c.introduction_id,
  c.certification_id,
  c.transaction_id,
  c.asset_id,
  c.amount_chf,
  c.eligible_at,
  c.status,
  c.invoiced_at,
  c.paid_at,
  c.created_at,
  CASE c.type
    WHEN 'cosignature'          THEN 'Co-certification CIFS (CAS 1)'
    WHEN 'introduction'         THEN 'Apport d''affaires (CAS 2)'
    WHEN 'mandate_retrocession' THEN 'Rétrocession mandat (CAS 3)'
    ELSE c.type
  END AS type_label
FROM public.commissions c
WHERE c.partner_id IS NOT NULL;

COMMENT ON VIEW public.partner_commission_summary IS
  'Vue consolidée des commissions partenaires (CAS 1/2/3). security_invoker = true — RLS de l''appelant appliquée.';

GRANT SELECT ON public.partner_commission_summary TO service_role, authenticated;

-- ── 2. v_data_room_consultations ─────────────────────────────────────────

DROP VIEW IF EXISTS public.v_data_room_consultations;

CREATE VIEW public.v_data_room_consultations
  WITH (security_invoker = true)
AS
SELECT
  d.id               AS document_id,
  d.asset_id,
  d.file_name,
  d.category,
  d.document_type,
  l.user_id          AS consulted_by,
  p.email            AS consulted_by_email,
  COUNT(*) FILTER (WHERE l.action = 'signed_url_generated') AS url_generated_count,
  COUNT(*) FILTER (WHERE l.action = 'suspicious_activity')  AS suspicious_count,
  MAX(l.created_at)  FILTER (WHERE l.action = 'signed_url_generated') AS last_accessed_at
FROM public.data_room_documents d
LEFT JOIN public.data_room_access_log l ON l.document_id = d.id
LEFT JOIN public.profiles p             ON p.id = l.user_id
GROUP BY d.id, d.asset_id, d.file_name, d.category, d.document_type, l.user_id, p.email;

COMMENT ON VIEW public.v_data_room_consultations IS
  'Résumé des consultations par document. security_invoker = true — RLS de l''appelant appliquée.';

GRANT SELECT ON public.v_data_room_consultations TO service_role, authenticated;

-- ── 3. v_document_completeness ────────────────────────────────────────────

DROP VIEW IF EXISTS public.v_document_completeness;

CREATE VIEW public.v_document_completeness
  WITH (security_invoker = true)
AS
SELECT
  d.asset_id,
  c.dimension,
  CASE WHEN c.code LIKE 'TX-%' THEN 'transaction' ELSE 'grading' END AS phase,
  COUNT(c.code)                                                           AS total_catalog,
  COUNT(c.code) FILTER (WHERE c.required_level = 'blocking')             AS blocking_total,
  COUNT(d2.id)  FILTER (WHERE c.required_level = 'blocking'
    AND d2.admin_quality = 'sufficient')                                  AS blocking_ok,
  COUNT(d2.id)  FILTER (WHERE c.required_level = 'recommended')          AS recommended_uploaded,
  COUNT(c.code) FILTER (WHERE c.required_level = 'recommended')          AS recommended_total,
  BOOL_OR(d2.blocks_grading)                                             AS has_blocking_doc,
  STRING_AGG(c.code, ', ') FILTER (WHERE d2.blocks_grading IS TRUE)      AS blocking_codes
FROM public.documents_catalog c
CROSS JOIN (SELECT DISTINCT asset_id FROM public.data_room_documents) d
LEFT JOIN public.data_room_documents d2
  ON d2.asset_id = d.asset_id AND d2.document_code = c.code
GROUP BY
  d.asset_id,
  c.dimension,
  CASE WHEN c.code LIKE 'TX-%' THEN 'transaction' ELSE 'grading' END;

COMMENT ON VIEW public.v_document_completeness IS
  'Complétude documentaire par actif, dimension et phase. security_invoker = true — RLS de l''appelant appliquée.';

GRANT SELECT ON public.v_document_completeness TO service_role, authenticated;
