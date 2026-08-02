-- Migration 048 — Colonne expert_plan_interval sur profiles
-- Stocke la périodicité de l'abonnement expert : 'month' ou 'year'

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS expert_plan_interval TEXT CHECK (expert_plan_interval IN ('month', 'year'));
