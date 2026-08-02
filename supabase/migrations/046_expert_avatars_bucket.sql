-- Migration 046 — Bucket public expert-avatars
-- Les photos de profil expert doivent être accessibles publiquement (annuaire web).
-- Distinct du bucket kyc-documents qui reste privé.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'expert-avatars',
  'expert-avatars',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- RLS : lecture publique
CREATE POLICY "expert_avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'expert-avatars');

-- RLS : upload uniquement par le propriétaire (service role bypasse RLS)
CREATE POLICY "expert_avatars_owner_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'expert-avatars');

CREATE POLICY "expert_avatars_owner_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'expert-avatars');
