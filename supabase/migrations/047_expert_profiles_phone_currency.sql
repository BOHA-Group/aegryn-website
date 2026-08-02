-- Migration 047 — Ajout colonnes phone_country et rate_currency sur expert_profiles
-- phone_country : code pays de l'indicatif téléphonique (ex: 'CH', 'FR')
-- rate_currency : devise des honoraires indicatifs (CHF ou EUR)

ALTER TABLE expert_profiles
  ADD COLUMN IF NOT EXISTS phone_country  TEXT NOT NULL DEFAULT 'CH' CHECK (char_length(phone_country) <= 4),
  ADD COLUMN IF NOT EXISTS rate_currency  TEXT NOT NULL DEFAULT 'CHF' CHECK (rate_currency IN ('CHF', 'EUR'));
