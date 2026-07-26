-- ════════════════════════════════════════════════════════════════════════
-- 033_data_room.sql
--
-- Data room sécurisée pour due diligence et grading AEGRYN.
-- Documents organisés par dimension CIFS, RLS à 3 niveaux :
--   admin_only       → admin + vendeur (propriétaire de l'actif)
--   assigned_partner → + partenaire assigné sur la dimension concernée
--   nda_buyers       → + acheteurs ayant signé le NDA Auction
--
-- Watermarking dynamique + viewer intégré côté front (jamais DL direct).
-- Log exhaustif de toute consultation et activité suspecte.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Table principale : documents de la data room ──────────────────────

CREATE TABLE IF NOT EXISTS public.data_room_documents (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Actif concerné (assets.id)
  asset_id             UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,

  -- Dimension CIFS
  category             TEXT        NOT NULL
                                   CHECK (category IN ('code', 'ip', 'finance', 'security', 'transversal')),

  -- Type de document (ex: 'comptes_annuels', 'certificat_marque', 'rapport_pentest')
  document_type        TEXT        NOT NULL,

  -- Stockage
  file_path            TEXT        NOT NULL,   -- chemin Supabase Storage bucket 'data-room'
  file_name            TEXT        NOT NULL,
  file_size_bytes      BIGINT,
  mime_type            TEXT,

  -- Qui a uploadé (profil vendeur ou admin)
  uploaded_by          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,

  -- Niveau de visibilité acheteur
  visible_to           TEXT        NOT NULL DEFAULT 'admin_only'
                                   CHECK (visible_to IN ('admin_only', 'assigned_partner', 'nda_buyers')),

  -- Gestion de la visibilité
  visibility_set_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  visibility_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Marqué sensible → watermark renforcé (finance, contrats)
  is_sensitive         BOOLEAN     NOT NULL DEFAULT false,

  -- Métadonnées
  notes                TEXT,
  uploaded_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Rétention : NULL = pas de purge programmée
  -- Documents deal CLOSE : 10 ans (obligation LCB-FT)
  -- Documents dossier non abouti : 24 mois recommandés
  expires_at           TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_drd_asset_id    ON public.data_room_documents(asset_id);
CREATE INDEX IF NOT EXISTS idx_drd_category    ON public.data_room_documents(asset_id, category);
CREATE INDEX IF NOT EXISTS idx_drd_visible_to  ON public.data_room_documents(visible_to);
CREATE INDEX IF NOT EXISTS idx_drd_expires_at  ON public.data_room_documents(expires_at)
  WHERE expires_at IS NOT NULL;

ALTER TABLE public.data_room_documents ENABLE ROW LEVEL SECURITY;

-- ── 1a. Helper : vérifier si l'utilisateur est admin ─────────────────────

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid
      AND (
        role = 'admin'
        OR 'admin'       = ANY(roles)
        OR 'super_admin' = ANY(roles)
      )
  );
$$;

-- ── 1b. Helper : vérifier propriété vendeur d'un actif ───────────────────
-- Les actifs n'ont pas de seller_id direct : on passe par profiles.email
-- et assets.seller_email.

CREATE OR REPLACE FUNCTION public.is_asset_seller(uid UUID, p_asset_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.assets a
    JOIN public.profiles p ON p.email = a.seller_email
    WHERE a.id = p_asset_id
      AND p.id = uid
  );
$$;

-- ── 1c. RLS Policies ─────────────────────────────────────────────────────

-- Service role : accès total (admin backend)
CREATE POLICY "service_role_data_room"
  ON public.data_room_documents FOR ALL
  USING (auth.role() = 'service_role');

-- Admin AEGRYN : accès total lecture/écriture
CREATE POLICY "admin_full_access_data_room"
  ON public.data_room_documents FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Vendeur : peut uploader et voir ses propres documents
CREATE POLICY "seller_own_documents"
  ON public.data_room_documents FOR ALL
  TO authenticated
  USING (public.is_asset_seller(auth.uid(), asset_id));

-- Partenaire assigné : SELECT sur assigned_partner + nda_buyers
CREATE POLICY "partner_assigned_documents"
  ON public.data_room_documents FOR SELECT
  TO authenticated
  USING (
    visible_to IN ('assigned_partner', 'nda_buyers')
    AND EXISTS (
      SELECT 1 FROM public.partner_certifications pc
      WHERE pc.asset_id = data_room_documents.asset_id
        AND pc.partner_id = auth.uid()
        AND pc.status IN ('assigned', 'in_review', 'submitted', 'validated')
    )
  );

-- Acheteur NDA : SELECT sur nda_buyers seulement
-- Le NDA Auction est global (pas par actif) : tout acheteur ayant signé
-- le NDA (auction_nda_signed_at non null) accède aux documents nda_buyers.
-- Le vendeur contrôle la granularité via le toggle visible_to.
CREATE POLICY "buyer_nda_documents"
  ON public.data_room_documents FOR SELECT
  TO authenticated
  USING (
    visible_to = 'nda_buyers'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.auction_nda_signed_at IS NOT NULL
    )
  );

-- ── 2. Table de log des consultations ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.data_room_access_log (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id              UUID        NOT NULL REFERENCES public.data_room_documents(id) ON DELETE CASCADE,
  user_id                  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Type d'événement
  action                   TEXT        NOT NULL
                                       CHECK (action IN (
                                         'signed_url_generated',  -- URL signée générée (= accès initié)
                                         'view_start',            -- viewer ouvert côté client
                                         'view_end',              -- viewer fermé
                                         'suspicious_activity',   -- détection capture/devtools
                                         'session_end'            -- fin de session
                                       )),

  -- Détail libre (ex: 'capture_attempt', 'devtools_opened', 'tab_blur', 'printscreen_key')
  detail                   TEXT,

  -- Contexte réseau
  ip_address               INET,
  user_agent               TEXT,

  -- Durée de consultation (en secondes, renseigné sur view_end)
  session_duration_seconds INTEGER,

  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dral_document_id  ON public.data_room_access_log(document_id);
CREATE INDEX IF NOT EXISTS idx_dral_user_id      ON public.data_room_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_dral_action       ON public.data_room_access_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dral_suspicious   ON public.data_room_access_log(created_at DESC)
  WHERE action = 'suspicious_activity';

ALTER TABLE public.data_room_access_log ENABLE ROW LEVEL SECURITY;

-- Service role : accès total
CREATE POLICY "service_role_data_room_log"
  ON public.data_room_access_log FOR ALL
  USING (auth.role() = 'service_role');

-- Admin : lecture totale
CREATE POLICY "admin_read_access_log"
  ON public.data_room_access_log FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Vendeur : voir qui a consulté ses documents
CREATE POLICY "seller_read_own_asset_log"
  ON public.data_room_access_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.data_room_documents d
      WHERE d.id = document_id
        AND public.is_asset_seller(auth.uid(), d.asset_id)
    )
  );

-- Utilisateur : peut insérer ses propres logs (view_start, suspicious_activity, etc.)
CREATE POLICY "user_insert_own_log"
  ON public.data_room_access_log FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ── 3. Grants ─────────────────────────────────────────────────────────────

GRANT ALL  ON public.data_room_documents  TO service_role;
GRANT ALL  ON public.data_room_access_log TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.data_room_documents  TO authenticated;
GRANT SELECT, INSERT         ON public.data_room_access_log TO authenticated;

-- ── 4. Vue pour vendeur : résumé consultations par document ──────────────

CREATE OR REPLACE VIEW public.v_data_room_consultations AS
SELECT
  d.id               AS document_id,
  d.asset_id,
  d.file_name,
  d.category,
  d.document_type,
  l.user_id          AS consulted_by,
  p.email            AS consulted_by_email,
  COUNT(*)           FILTER (WHERE l.action = 'signed_url_generated') AS url_generated_count,
  COUNT(*)           FILTER (WHERE l.action = 'suspicious_activity')  AS suspicious_count,
  MAX(l.created_at)  FILTER (WHERE l.action = 'signed_url_generated') AS last_accessed_at
FROM public.data_room_documents d
LEFT JOIN public.data_room_access_log l ON l.document_id = d.id
LEFT JOIN public.profiles p             ON p.id = l.user_id
GROUP BY d.id, d.asset_id, d.file_name, d.category, d.document_type, l.user_id, p.email;

GRANT SELECT ON public.v_data_room_consultations TO service_role;
GRANT SELECT ON public.v_data_room_consultations TO authenticated;

-- ── 5. Trigger updated_at sur data_room_documents ────────────────────────

CREATE TRIGGER trg_data_room_documents_updated_at
  BEFORE UPDATE ON public.data_room_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 6. Commentaires de documentation ─────────────────────────────────────

COMMENT ON TABLE public.data_room_documents IS
  'Documents de la data room AEGRYN — due diligence et grading CIFS. Jamais publics. Accès via URL signée uniquement (expiration 1h).';

COMMENT ON COLUMN public.data_room_documents.visible_to IS
  'admin_only: vendeur+admin. assigned_partner: +partenaire CIFS assigné. nda_buyers: +acheteurs NDA signé.';

COMMENT ON COLUMN public.data_room_documents.is_sensitive IS
  'Si true, déclenche le watermarking renforcé lors de la génération de l''URL signée (finance, contrats).';

COMMENT ON COLUMN public.data_room_documents.expires_at IS
  'Date de purge programmée. NULL = pas de purge. Deals closés: +10 ans. Dossiers non aboutis: +24 mois recommandés.';

COMMENT ON TABLE public.data_room_access_log IS
  'Log exhaustif de toutes les consultations et activités suspectes — valeur légale en cas de litige (IP, user agent, horodatage).';

COMMENT ON COLUMN public.data_room_access_log.detail IS
  'Détail libre: capture_attempt, devtools_opened, tab_blur, window_blur, printscreen_key, etc.';
