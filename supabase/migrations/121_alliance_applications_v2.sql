-- ============================================================
-- 121 — alliance_applications v2
-- Nouveau formulaire « Devenir partenaire » (/alliances) :
-- type (expert | auditeur | apporteur), métier, dimension CIFSO,
-- nom du candidat, expérience, consentement.
-- alliance_type conserve la valeur de applicant_type (compat admin).
-- ============================================================

ALTER TABLE public.alliance_applications
  ADD COLUMN IF NOT EXISTS applicant_name TEXT,
  ADD COLUMN IF NOT EXISTS metier         TEXT,
  ADD COLUMN IF NOT EXISTS dimension      TEXT,
  ADD COLUMN IF NOT EXISTS consent        BOOLEAN DEFAULT false;
