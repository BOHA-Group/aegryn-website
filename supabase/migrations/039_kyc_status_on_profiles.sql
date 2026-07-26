-- Migration 039 — KYC status on profiles + signed URL security
-- Ajoute kyc_status sur profiles pour synchronisation post-validation admin.
-- Le bucket kyc-documents doit être configuré en PRIVÉ dans Supabase Storage.
-- Les accès se font via signed URLs générées côté serveur (service role).

-- 1. Ajouter kyc_status sur profiles si absent
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS kyc_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (kyc_status IN ('pending', 'in_review', 'approved', 'rejected'));

-- 2. Index pour les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles (kyc_status);

-- 3. Commentaires
COMMENT ON COLUMN profiles.kyc_status IS
  'Statut KYC global du profil : pending | in_review | approved | rejected. '
  'Mis à jour par l''admin lors de la validation globale du dossier KYC. '
  'Requis = approved pour accéder au catalogue auction.';

-- 4. RLS : l'utilisateur peut lire son propre kyc_status, l'admin peut tout mettre à jour.
-- (La table profiles doit déjà avoir RLS activée — cette migration étend uniquement la colonne.)
