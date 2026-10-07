-- Migration 122: Refonte RECRUTER (/talent)
-- Nouveaux champs candidats : famille de fonctions, cycle de vie, type de poste, pays
-- Nouveaux champs mandats : type de mission, cycle de vie, confidentialité, taille entreprise

ALTER TABLE talent_candidates
  ADD COLUMN IF NOT EXISTS function_family TEXT,
  ADD COLUMN IF NOT EXISTS lifecycle_cycle TEXT CHECK (lifecycle_cycle IN ('lancement','croissance','restructuration','acquisition','transmission')),
  ADD COLUMN IF NOT EXISTS profile_type TEXT CHECK (profile_type IN ('permanent','transition')),
  ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE talent_hiring_requests
  ADD COLUMN IF NOT EXISTS mission_type TEXT CHECK (mission_type IN ('permanent','transition')),
  ADD COLUMN IF NOT EXISTS lifecycle_cycle TEXT CHECK (lifecycle_cycle IN ('lancement','croissance','restructuration','acquisition','transmission')),
  ADD COLUMN IF NOT EXISTS confidential BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS company_size TEXT;

-- Bucket privé pour les CV des candidats (PDF/Word, 10 Mo)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'talent-cvs',
  'talent-cvs',
  false,
  10485760,
  ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Le service role gère l'upload côté API (pas de policy publique) ;
-- accès admin via policies storage existantes si nécessaire.
