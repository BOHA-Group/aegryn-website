-- Migration 096: Enhanced Talent Management
-- Amélioration du système de gestion des candidatures et mandats

-- 1. Ajouter colonnes financières et de gestion aux mandats
ALTER TABLE talent_hiring_requests
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS salary_gross_annual NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'CHF' CHECK (salary_currency IN ('CHF', 'EUR')),
  ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC(5,2) CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  ADD COLUMN IF NOT EXISTS commission_amount_calculated NUMERIC(12,2) GENERATED ALWAYS AS (
    CASE 
      WHEN salary_gross_annual IS NOT NULL AND commission_percentage IS NOT NULL 
      THEN salary_gross_annual * (commission_percentage / 100)
      ELSE NULL
    END
  ) STORED;

-- Mettre à jour les statuts possibles pour les mandats
ALTER TABLE talent_hiring_requests
  DROP CONSTRAINT IF EXISTS talent_hiring_requests_status_check;

ALTER TABLE talent_hiring_requests
  ADD CONSTRAINT talent_hiring_requests_status_check 
  CHECK (status IN ('new', 'in_progress', 'placed', 'closed', 'cancelled'));

-- 2. Améliorer les statuts des candidats
ALTER TABLE talent_candidates
  DROP CONSTRAINT IF EXISTS talent_candidates_status_check;

ALTER TABLE talent_candidates
  ADD CONSTRAINT talent_candidates_status_check 
  CHECK (status IN ('new', 'reviewed', 'shortlisted', 'placed', 'archived'));

-- Ajouter colonne notes séparée pour les candidats
ALTER TABLE talent_candidates
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Table de liaison: candidats assignés aux mandats
CREATE TABLE IF NOT EXISTS talent_candidate_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Relations
  hiring_request_id UUID NOT NULL REFERENCES talent_hiring_requests(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES talent_candidates(id) ON DELETE CASCADE,
  
  -- Statut de l'assignation
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN (
    'proposed',      -- Candidat proposé au client
    'submitted',     -- CV soumis au client
    'interview',     -- En entretien
    'offer',         -- Offre faite
    'accepted',      -- Offre acceptée
    'placed',        -- Candidat placé
    'rejected',      -- Rejeté par le client
    'withdrawn'      -- Candidat s'est retiré
  )),
  
  -- Informations financières spécifiques à cette assignation
  proposed_salary NUMERIC(12,2),
  proposed_salary_currency TEXT DEFAULT 'CHF' CHECK (proposed_salary_currency IN ('CHF', 'EUR')),
  actual_salary NUMERIC(12,2),
  actual_salary_currency TEXT DEFAULT 'CHF' CHECK (actual_salary_currency IN ('CHF', 'EUR')),
  
  -- Notes et suivi
  notes TEXT,
  interview_date TIMESTAMPTZ,
  offer_date TIMESTAMPTZ,
  placement_date TIMESTAMPTZ,
  
  -- Metadata
  assigned_by UUID REFERENCES profiles(id),
  
  UNIQUE(hiring_request_id, candidate_id)
);

-- Index pour recherche et filtrage
CREATE INDEX idx_talent_assignments_hiring ON talent_candidate_assignments(hiring_request_id);
CREATE INDEX idx_talent_assignments_candidate ON talent_candidate_assignments(candidate_id);
CREATE INDEX idx_talent_assignments_status ON talent_candidate_assignments(status);
CREATE INDEX idx_talent_assignments_created ON talent_candidate_assignments(created_at DESC);

-- RLS: Admin only
ALTER TABLE talent_candidate_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "talent_assignments_admin_all"
  ON talent_candidate_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger: updated_at auto-update
CREATE TRIGGER talent_assignments_updated_at
  BEFORE UPDATE ON talent_candidate_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_updated_at();

-- Grant service_role full access
GRANT ALL ON talent_candidate_assignments TO service_role;

-- 4. Vue pour faciliter les requêtes admin
CREATE OR REPLACE VIEW talent_hiring_requests_with_stats AS
SELECT 
  hr.*,
  COUNT(DISTINCT tca.candidate_id) FILTER (WHERE tca.status NOT IN ('rejected', 'withdrawn')) as active_candidates_count,
  COUNT(DISTINCT tca.candidate_id) FILTER (WHERE tca.status = 'placed') as placed_candidates_count,
  MAX(tca.placement_date) as last_placement_date
FROM talent_hiring_requests hr
LEFT JOIN talent_candidate_assignments tca ON tca.hiring_request_id = hr.id
GROUP BY hr.id;

GRANT SELECT ON talent_hiring_requests_with_stats TO authenticated, service_role;

-- 5. Vue pour les candidats avec leurs assignations
CREATE OR REPLACE VIEW talent_candidates_with_stats AS
SELECT 
  tc.*,
  COUNT(DISTINCT tca.hiring_request_id) FILTER (WHERE tca.status NOT IN ('rejected', 'withdrawn')) as active_assignments_count,
  COUNT(DISTINCT tca.hiring_request_id) FILTER (WHERE tca.status = 'placed') as placements_count,
  MAX(tca.placement_date) as last_placement_date
FROM talent_candidates tc
LEFT JOIN talent_candidate_assignments tca ON tca.candidate_id = tc.id
GROUP BY tc.id;

GRANT SELECT ON talent_candidates_with_stats TO authenticated, service_role;

-- Comments
COMMENT ON TABLE talent_candidate_assignments IS 'Liaison entre candidats et mandats de recrutement avec suivi détaillé';
COMMENT ON COLUMN talent_hiring_requests.salary_gross_annual IS 'Salaire annuel brut proposé pour le poste';
COMMENT ON COLUMN talent_hiring_requests.commission_percentage IS 'Pourcentage de commission Aegryn (ex: 20 pour 20%)';
COMMENT ON COLUMN talent_hiring_requests.commission_amount_calculated IS 'Montant de commission calculé automatiquement';
COMMENT ON VIEW talent_hiring_requests_with_stats IS 'Mandats avec statistiques de candidatures';
COMMENT ON VIEW talent_candidates_with_stats IS 'Candidats avec statistiques d\'assignations';
