-- ── Migration 043 — data_room_documents : champ dimension + RLS anti-fuite ──
--
-- PROBLÈME : la RLS "partner_assigned_documents" donnait accès à un partenaire
-- assigné à une dimension (ex: code) à TOUS les documents assigned_partner de
-- l'actif, y compris ceux des dimensions finance/security/ip.
--
-- CORRECTION :
--   1. Ajouter colonne dimension TEXT sur data_room_documents
--      (nullable pour compatibilité documents existants + documents libres)
--   2. Remplacer la RLS par une version qui croise la dimension du document
--      avec la dimension assignée dans partner_certifications.
--      Exception : si dimension IS NULL → document transversal → visible par
--      tout partenaire assigné sur l'actif (comportement conservateur).

-- ── 1. Ajouter la colonne dimension ──────────────────────────────────────────

ALTER TABLE public.data_room_documents
  ADD COLUMN IF NOT EXISTS dimension TEXT
    CHECK (dimension IN ('code', 'ip', 'finance', 'security', NULL));

COMMENT ON COLUMN public.data_room_documents.dimension IS
  'Dimension CIFS concernée par ce document. NULL = transversal (visible par tout partenaire assigné sur l''actif).';

-- ── 2. Supprimer l'ancienne policy trop permissive ───────────────────────────

DROP POLICY IF EXISTS "partner_assigned_documents" ON public.data_room_documents;

-- ── 3. Nouvelle RLS : croisement dimension document × dimension assignée ──────

CREATE POLICY "partner_assigned_documents"
  ON public.data_room_documents FOR SELECT
  TO authenticated
  USING (
    visible_to IN ('assigned_partner', 'nda_buyers')
    AND EXISTS (
      SELECT 1 FROM public.partner_certifications pc
      WHERE pc.asset_id   = data_room_documents.asset_id
        AND pc.partner_id = auth.uid()
        AND pc.status     IN ('assigned', 'in_review', 'submitted', 'validated')
        -- Croisement dimension : document transversal (NULL) ou même dimension
        AND (
          data_room_documents.dimension IS NULL
          OR pc.dimension = data_room_documents.dimension
        )
    )
  );
