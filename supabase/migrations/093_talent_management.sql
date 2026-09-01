-- Migration 093: Talent Management (Headhunting & Transition)
-- Tables pour gérer les mandats de recrutement et les candidatures

-- Table: talent_hiring_requests
-- Mandats de recrutement soumis par les entreprises
CREATE TABLE IF NOT EXISTS talent_hiring_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Informations entreprise
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Détails du poste
  role_title TEXT NOT NULL,
  role_description TEXT NOT NULL,
  location TEXT NOT NULL,
  budget_annual_chf TEXT,
  
  -- Urgence
  urgency TEXT NOT NULL CHECK (urgency IN ('immediate', 'month', 'quarter', 'flexible')),
  
  -- Statut et gestion
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  admin_note TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'website',
  locale TEXT DEFAULT 'fr'
);

-- Index pour recherche et filtrage
CREATE INDEX idx_talent_hiring_status ON talent_hiring_requests(status);
CREATE INDEX idx_talent_hiring_created ON talent_hiring_requests(created_at DESC);
CREATE INDEX idx_talent_hiring_email ON talent_hiring_requests(email);

-- RLS: Admin only
ALTER TABLE talent_hiring_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on talent_hiring_requests"
  ON talent_hiring_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Table: talent_candidates
-- Candidatures soumises par les professionnels en transition
CREATE TABLE IF NOT EXISTS talent_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Informations candidat
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  
  -- CV et motivation
  cv_url TEXT,
  cv_filename TEXT,
  motivation TEXT NOT NULL,
  availability TEXT,
  
  -- Statut et gestion
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  admin_note TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'website',
  locale TEXT DEFAULT 'fr'
);

-- Index pour recherche et filtrage
CREATE INDEX idx_talent_candidates_status ON talent_candidates(status);
CREATE INDEX idx_talent_candidates_created ON talent_candidates(created_at DESC);
CREATE INDEX idx_talent_candidates_email ON talent_candidates(email);

-- RLS: Admin only
ALTER TABLE talent_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on talent_candidates"
  ON talent_candidates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Trigger: updated_at auto-update
CREATE OR REPLACE FUNCTION update_talent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER talent_hiring_updated_at
  BEFORE UPDATE ON talent_hiring_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_updated_at();

CREATE TRIGGER talent_candidates_updated_at
  BEFORE UPDATE ON talent_candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_updated_at();

-- Grant service_role full access (pour API routes)
GRANT ALL ON talent_hiring_requests TO service_role;
GRANT ALL ON talent_candidates TO service_role;

-- Comments
COMMENT ON TABLE talent_hiring_requests IS 'Mandats de recrutement soumis par les entreprises via /talent';
COMMENT ON TABLE talent_candidates IS 'Candidatures soumises par les professionnels en transition via /talent';
