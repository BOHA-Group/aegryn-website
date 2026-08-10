-- 065_restrict_profiles_admin_note.sql
--
-- Security fix: profiles.admin_note (internal admin notes about a user)
-- was readable by the user themselves via the `authenticated` role SELECT
-- grant, since RLS is row-level only (profiles_self_read: auth.uid() = id
-- allows the full row, including admin_note). Verified exploitable via a
-- direct PostgREST call (anon key + user's own JWT), bypassing all app code.
--
-- The existing RESTRICTIVE policy "admin_note — only service_role" has
-- qual = true, which is a no-op (a RESTRICTIVE policy with an
-- always-true condition adds no restriction). RLS cannot enforce
-- column-level restrictions — only column-level GRANT/REVOKE can.
--
-- Fix: `authenticated` holds a TABLE-LEVEL SELECT grant (relacl = rDxtm),
-- which covers every column. A column-level REVOKE cannot subtract from
-- a table-level GRANT — Postgres has no "all columns except X" primitive
-- for REVOKE. The correct approach: revoke the table-level SELECT, then
-- re-grant SELECT explicitly on every column except admin_note.
-- (anon has no table-level SELECT on profiles already — relacl = Dxtm —
-- so no action needed for anon.)

REVOKE SELECT ON public.profiles FROM authenticated;

GRANT SELECT (
  id, email, full_name, role, created_at, updated_at, roles,
  email_notifications_enabled, non_circumvention_signed_at,
  auction_nda_signed_at, auction_cgv_accepted_at, converted_from_prospect_id,
  kyc_status, expert_plan, expert_plan_start, stripe_customer_id,
  stripe_subscription_id, expert_plan_end, expert_plan_interval,
  seller_nda_accepted_at, seller_nda_version, buyer_nda_accepted_at,
  buyer_nda_version, partner_nda_accepted_at, partner_nda_version,
  referral_code, referral_months_credit, referred_by, expert_plan_cancel_at
) ON public.profiles TO authenticated;

-- service_role (used by all app/admin/** server code and API routes) is
-- unaffected — it bypasses RLS and column grants natively.
