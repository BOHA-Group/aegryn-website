-- ════════════════════════════════════════════════════════════════════════
-- 030 — Traçabilité forte escrow_amount_chf + audit trail transactions
-- ════════════════════════════════════════════════════════════════════════
--
-- Objectif : créer une table d'audit immuable (append-only via RLS)
-- pour tracer chaque modification du montant d'escrow et des étapes clés
-- de la transaction (bid, séquestre, validation, closing).
--
-- La valeur d'achat/vente qui FAIT FOI est `escrow_amount_chf` figée
-- à `escrow_confirmed_at`. Ce log permet de retrouver chaque version
-- avec son contexte (qui, quand, pourquoi, taux de change BCE du jour).
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Table d'audit immuable ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transaction_audit_log (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id   UUID        NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,

  -- Qui
  actor_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role       TEXT        NOT NULL DEFAULT 'admin'
                               CHECK (actor_role IN ('admin', 'system', 'buyer', 'seller', 'partner')),

  -- Quoi
  event_type       TEXT        NOT NULL
                               CHECK (event_type IN (
                                 'escrow_amount_set',       -- Premier enregistrement du montant
                                 'escrow_amount_updated',   -- Modification du montant (justification obligatoire)
                                 'escrow_confirmed',        -- Séquestre confirmé — valeur figée
                                 'bid_registered',          -- Offre enregistrée
                                 'bid_accepted',            -- Offre acceptée (AP signé)
                                 'status_changed',          -- Changement de statut
                                 'closing',                 -- Transaction closée
                                 'cancelled'                -- Transaction annulée
                               )),

  -- Valeurs
  old_amount_chf   NUMERIC(14,2),   -- Valeur avant (null si premier enregistrement)
  new_amount_chf   NUMERIC(14,2),   -- Valeur après
  old_status       TEXT,
  new_status       TEXT,

  -- Taux de change BCE au moment de l'événement
  eur_rate         NUMERIC(8,6),    -- 1 CHF = X EUR (ex: 0.952100)
  eur_rate_date    DATE,            -- Date de publication du taux
  amount_eur_approx NUMERIC(14,2),  -- Conversion indicative (non contractuelle)

  -- Justification (obligatoire pour escrow_amount_updated)
  note             TEXT,

  -- Immuabilité
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.transaction_audit_log IS
  'Log immuable de toutes les modifications de montant escrow et des étapes clés de transaction. Append-only via RLS.';

COMMENT ON COLUMN public.transaction_audit_log.amount_eur_approx IS
  'Conversion EUR indicative au taux BCE du jour de l''événement. La valeur contractuelle est toujours new_amount_chf.';

-- ── 2. Index ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_audit_log_transaction
  ON public.transaction_audit_log(transaction_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_event
  ON public.transaction_audit_log(event_type, created_at DESC);

-- ── 3. RLS — append-only : lecture admin uniquement, pas de UPDATE/DELETE ──
ALTER TABLE public.transaction_audit_log ENABLE ROW LEVEL SECURITY;

-- Service role peut tout faire (insert depuis API admin)
-- Pas de policy pour les users normaux → accès interdit par défaut

-- ── 4. Grants ────────────────────────────────────────────────────────────
GRANT SELECT, INSERT ON public.transaction_audit_log TO service_role;
REVOKE UPDATE, DELETE ON public.transaction_audit_log FROM service_role;

-- ── 5. Trigger automatique sur transactions.escrow_amount_chf ────────────
-- Loggue automatiquement chaque changement de montant escrow ET de statut
-- Note: le trigger insère sans taux de change (eur_rate = null) —
-- la route API enrichit le log avec le taux BCE en temps réel.

CREATE OR REPLACE FUNCTION public.fn_audit_transaction_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Changement de escrow_amount_chf
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

  -- Confirmation séquestre
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

  -- Changement de statut
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
END;
$$;

CREATE TRIGGER trg_audit_transaction_changes
  AFTER UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_audit_transaction_changes();

COMMENT ON TRIGGER trg_audit_transaction_changes ON public.transactions IS
  'Log automatique de chaque changement de escrow_amount_chf et de statut dans transaction_audit_log.';
