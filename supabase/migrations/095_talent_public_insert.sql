-- Migration 095: Allow public INSERT on talent tables
-- Permet aux formulaires publics (rôle anon) d'insérer des candidatures et mandats

-- Policy: Permettre INSERT public sur talent_candidates
CREATE POLICY "talent_candidates_public_insert"
  ON talent_candidates FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Permettre INSERT public sur talent_hiring_requests
CREATE POLICY "talent_hiring_public_insert"
  ON talent_hiring_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Note: Les SELECT/UPDATE/DELETE restent réservés aux admins (policy existante)
-- Seul l'INSERT est autorisé pour les utilisateurs non authentifiés
