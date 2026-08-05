-- 056_fix_email_broadcasts_admin_nullable.sql
-- Rend admin_id nullable dans email_broadcasts
-- La contrainte NOT NULL était incorrecte : l'API insère sans session admin (token URL)

ALTER TABLE public.email_broadcasts
  ALTER COLUMN admin_id DROP NOT NULL;
