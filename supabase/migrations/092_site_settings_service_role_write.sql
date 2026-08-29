-- Migration 092 — site_settings : accès écriture service_role
-- La migration 084 a activé RLS sans policy d'écriture → PATCH /api/admin/site-settings → 500
-- Fix : policy INSERT/UPDATE pour service_role + GRANT explicite

CREATE POLICY "site_settings_service_role_write"
  ON public.site_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO service_role;
