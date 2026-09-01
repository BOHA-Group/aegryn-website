-- Migration 094: Normaliser les numéros de téléphone
-- Format cible: +XX XXXXXXXXX (indicatif + espace + numéro)

-- 1. Ajouter indicatif +41 (Suisse) si manquant pour talent_hiring_requests
UPDATE talent_hiring_requests
SET phone = '+41 ' || regexp_replace(phone, '^\+?0?', '')
WHERE phone IS NOT NULL 
  AND phone != ''
  AND phone NOT LIKE '+%';

-- 2. Ajouter indicatif +41 (Suisse) si manquant pour talent_candidates
UPDATE talent_candidates
SET phone = '+41 ' || regexp_replace(phone, '^\+?0?', '')
WHERE phone IS NOT NULL 
  AND phone != ''
  AND phone NOT LIKE '+%';

-- 3. Nettoyer espaces multiples et caractères spéciaux pour talent_hiring_requests
UPDATE talent_hiring_requests
SET phone = regexp_replace(
  regexp_replace(phone, '[^+0-9\s]', '', 'g'),  -- Retirer caractères spéciaux sauf + et espaces
  '\s+', ' ', 'g'                                 -- Normaliser espaces multiples
)
WHERE phone IS NOT NULL AND phone != '';

-- 4. Nettoyer espaces multiples et caractères spéciaux pour talent_candidates
UPDATE talent_candidates
SET phone = regexp_replace(
  regexp_replace(phone, '[^+0-9\s]', '', 'g'),
  '\s+', ' ', 'g'
)
WHERE phone IS NOT NULL AND phone != '';

-- 5. Trim espaces début/fin pour talent_hiring_requests
UPDATE talent_hiring_requests
SET phone = trim(phone)
WHERE phone IS NOT NULL AND phone != '';

-- 6. Trim espaces début/fin pour talent_candidates
UPDATE talent_candidates
SET phone = trim(phone)
WHERE phone IS NOT NULL AND phone != '';

-- 7. Ajouter contrainte CHECK pour format (optionnel, commenté par défaut)
-- ALTER TABLE talent_hiring_requests
-- ADD CONSTRAINT phone_format_check 
-- CHECK (phone IS NULL OR phone ~ '^\+\d{1,3}\s\d');

-- ALTER TABLE talent_candidates
-- ADD CONSTRAINT phone_format_check 
-- CHECK (phone IS NULL OR phone ~ '^\+\d{1,3}\s\d');

-- 8. Créer fonction de validation téléphone (réutilisable)
CREATE OR REPLACE FUNCTION is_valid_phone(phone_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Format attendu: +XX XXXXXXXXX ou +XXX XXXXXXXXX
  RETURN phone_number IS NULL 
    OR phone_number = '' 
    OR phone_number ~ '^\+\d{1,3}\s\d{7,15}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 9. Commentaire sur les colonnes
COMMENT ON COLUMN talent_hiring_requests.phone IS 'Format: +XX XXXXXXXXX (ex: +41 79 123 45 67)';
COMMENT ON COLUMN talent_candidates.phone IS 'Format: +XX XXXXXXXXX (ex: +41 79 123 45 67)';

-- 10. Index pour recherche par indicatif pays
CREATE INDEX IF NOT EXISTS idx_talent_hiring_requests_phone_country 
ON talent_hiring_requests ((substring(phone from '^\+\d{1,3}')));

CREATE INDEX IF NOT EXISTS idx_talent_candidates_phone_country 
ON talent_candidates ((substring(phone from '^\+\d{1,3}')));

-- Rapport de migration
DO $$
DECLARE
  hiring_count INTEGER;
  candidate_count INTEGER;
  hiring_invalid INTEGER;
  candidate_invalid INTEGER;
BEGIN
  -- Compter les enregistrements normalisés
  SELECT COUNT(*) INTO hiring_count
  FROM talent_hiring_requests
  WHERE phone IS NOT NULL AND phone != '';
  
  SELECT COUNT(*) INTO candidate_count
  FROM talent_candidates
  WHERE phone IS NOT NULL AND phone != '';
  
  -- Compter les formats invalides restants
  SELECT COUNT(*) INTO hiring_invalid
  FROM talent_hiring_requests
  WHERE phone IS NOT NULL 
    AND phone != ''
    AND NOT is_valid_phone(phone);
  
  SELECT COUNT(*) INTO candidate_invalid
  FROM talent_candidates
  WHERE phone IS NOT NULL 
    AND phone != ''
    AND NOT is_valid_phone(phone);
  
  RAISE NOTICE '=== Migration 094: Normalisation téléphones ===';
  RAISE NOTICE 'Hiring requests avec téléphone: %', hiring_count;
  RAISE NOTICE 'Candidates avec téléphone: %', candidate_count;
  RAISE NOTICE 'Hiring requests format invalide: %', hiring_invalid;
  RAISE NOTICE 'Candidates format invalide: %', candidate_invalid;
  
  IF hiring_invalid > 0 OR candidate_invalid > 0 THEN
    RAISE WARNING 'Formats invalides détectés. Vérifier manuellement.';
  ELSE
    RAISE NOTICE '✓ Tous les numéros sont au format correct';
  END IF;
END $$;
