-- ── Migration 064 — Passer toutes les fonctions SECURITY DEFINER en SECURITY INVOKER ──
--
-- REVOKE EXECUTE ne persiste pas : CREATE OR REPLACE FUNCTION réinitialise les grants
-- à PUBLIC. La seule solution durable est de changer SECURITY DEFINER en SECURITY INVOKER.
-- Les fonctions trigger n'ont pas besoin d'élévation de privilèges — SECURITY INVOKER suffit.
-- Les triggers continuent de les appeler normalement.

-- ── Fonctions trigger updated_at (corps trivial) ─────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_expert_profiles_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_auction_sessions_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_auction_lots_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_commission_tiers_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.trg_fn_catalogue_requests()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN RETURN NEW; END; $$;

-- ── update_blocks_grading ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_blocks_grading()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  NEW.blocks_grading := (
    NEW.required_level = 'blocking'
    AND NEW.admin_quality IN ('missing', 'insufficient')
  );
  RETURN NEW;
END; $$;

-- ── handle_new_user ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_app_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

-- ── fn_audit_transaction_changes ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.fn_audit_transaction_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF (OLD.escrow_amount_chf IS DISTINCT FROM NEW.escrow_amount_chf) THEN
    INSERT INTO public.transaction_audit_log (
      transaction_id, actor_role, event_type,
      old_amount_chf, new_amount_chf, note
    ) VALUES (
      NEW.id, 'system',
      CASE WHEN OLD.escrow_amount_chf IS NULL THEN 'escrow_amount_set' ELSE 'escrow_amount_updated' END,
      OLD.escrow_amount_chf, NEW.escrow_amount_chf,
      'Trigger automatique — acteur réel dans API audit log'
    );
  END IF;
  IF (OLD.escrow_confirmed_at IS NULL AND NEW.escrow_confirmed_at IS NOT NULL) THEN
    INSERT INTO public.transaction_audit_log (
      transaction_id, actor_role, event_type,
      new_amount_chf, note
    ) VALUES (
      NEW.id, 'system', 'escrow_confirmed',
      NEW.escrow_amount_chf,
      'Séquestre confirmé — montant figé comme valeur de référence contractuelle'
    );
  END IF;
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.transaction_audit_log (
      transaction_id, actor_role, event_type,
      old_status, new_status, new_amount_chf, note
    ) VALUES (
      NEW.id, 'system', 'status_changed',
      OLD.status, NEW.status,
      NEW.escrow_amount_chf,
      'Changement de statut automatique'
    );
  END IF;
  RETURN NEW;
END; $$;

-- ── fn_check_invoice_mismatch ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.fn_check_invoice_mismatch()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE diff_pct NUMERIC;
BEGIN
  IF NEW.fees_chf IS NOT NULL AND NEW.client_invoice_amount_chf IS NOT NULL THEN
    diff_pct := ABS(NEW.fees_chf - NEW.client_invoice_amount_chf)
                / NULLIF(NEW.fees_chf, 0) * 100;
    IF diff_pct > 2 THEN
      NEW.invoice_mismatch := TRUE;
      NEW.invoice_mismatch_note :=
        'ALERTE écart factures : prestataire déclare CHF '
        || NEW.fees_chf::TEXT
        || ' — mandant déclare CHF '
        || NEW.client_invoice_amount_chf::TEXT
        || ' — écart '
        || ROUND(diff_pct, 1)::TEXT
        || '% (seuil 2%)';
    ELSE
      NEW.invoice_mismatch := FALSE;
      NEW.invoice_mismatch_note := NULL;
    END IF;
  ELSE
    NEW.invoice_mismatch := FALSE;
  END IF;
  RETURN NEW;
END; $$;

-- ── sync_auction_nda_signed_at ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.sync_auction_nda_signed_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF NEW.scope = 'catalog_general' AND NEW.signed_at IS NOT NULL THEN
    UPDATE public.profiles
    SET auction_nda_signed_at = NEW.signed_at
    WHERE id = NEW.buyer_id
      AND auction_nda_signed_at IS NULL;
  END IF;
  RETURN NEW;
END; $$;

-- ── is_admin / is_asset_seller → SECURITY INVOKER ───────────────────────────
-- Utilisées dans les policies RLS — SECURITY INVOKER suffit car elles
-- lisent uniquement des tables accessibles aux rôles appelants.

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid
      AND (role = 'admin' OR 'admin' = ANY(roles) OR 'super_admin' = ANY(roles))
  );
$$;

CREATE OR REPLACE FUNCTION public.is_asset_seller(uid UUID, p_asset_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.assets a
    JOIN public.profiles p ON p.email = a.seller_email
    WHERE a.id = p_asset_id AND p.id = uid
  );
$$;
