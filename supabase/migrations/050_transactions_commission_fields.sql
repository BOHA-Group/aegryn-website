-- Migration 050 — Champs commission sur transactions
-- transaction_price : prix ferme de cession à la date du closing
-- commission_paid   : marqueur de suivi encaissement AEGRYN

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS transaction_price NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS commission_paid   BOOLEAN NOT NULL DEFAULT false;
