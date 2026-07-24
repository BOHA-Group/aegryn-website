-- ════════════════════════════════════════════════════════════════════════
-- 028_partner_workflow.sql
--
-- Modèle hybride partenaire — 3 cas distincts :
--
--   CAS 1 — Contribution au grading (co-certification CIFS)
--     Le partenaire facture AEGRYN directement. Forfait fixe par dossier.
--     Pas de commission variable. Déclenché à la signature de l'avis.
--     → Géré via partner_certifications (existant) + commission type 'cosignature'
--
--   CAS 2 — Apport d'affaires (partenaire amène vendeur ou acheteur)
--     AEGRYN reverse 20% de sa commission de transaction au partenaire.
--     Déclenché au closing effectif (transaction.status = 'closed').
--     → Géré via introductions (existant) + commission type 'introduction'
--
--   CAS 3 — Accompagnement mandat client (partenaire facture son client)
--     Le partenaire facture son client directement, reverse 15% à AEGRYN.
--     Déclenché sur chaque facture émise dans le cadre du mandat.
--     → Géré via partner_mandates (nouveau) + commission type 'mandate_retrocession'
--
-- Ajoute :
--   • Colonne dimension 'code' dans partner_certifications
--   • Alignement statuts partner_certifications
--   • Colonnes validated_by, rejection_reason sur partner_certifications
--   • Table partner_mandates (CAS 3)
--   • Table partner_mandate_invoices (suivi factures CAS 3)
--   • Table partner_mandate_messages (messagerie interne)
--   • Colonne mandate_id FK sur commissions
--   • Colonne cosignature_amount_chf sur partner_certifications (CAS 1)
--   • Vue partner_commission_summary
-- ════════════════════════════════════════════════════════════════════════


-- ── 1. partner_certifications — alignement dimension + statuts ────────────

-- Ajouter la dimension 'code' (C dans CIFS — code source, architecture)
ALTER TABLE public.partner_certifications
  DROP CONSTRAINT IF EXISTS partner_certifications_dimension_check;

ALTER TABLE public.partner_certifications
  ADD CONSTRAINT partner_certifications_dimension_check
    CHECK (dimension IN ('code', 'ip', 'finance', 'security'));

-- Aligner les statuts : ajouter 'validated', 'rejected', 'expired'
-- (on garde 'assigned', 'in_review', 'submitted', 'signed', 'declined' pour compatibilité)
ALTER TABLE public.partner_certifications
  DROP CONSTRAINT IF EXISTS partner_certifications_status_check;

ALTER TABLE public.partner_certifications
  ADD CONSTRAINT partner_certifications_status_check
    CHECK (status IN (
      'assigned',   -- assignée, non démarrée
      'in_review',  -- partenaire travaille dessus
      'submitted',  -- partenaire a soumis son avis
      'validated',  -- AEGRYN a validé (=signed dans ancien schéma)
      'rejected',   -- AEGRYN a rejeté (=declined dans ancien schéma)
      'expired'     -- deadline dépassée sans soumission
    ));

-- Migrer les anciens statuts vers les nouveaux
UPDATE public.partner_certifications SET status = 'validated' WHERE status = 'signed';
UPDATE public.partner_certifications SET status = 'rejected'  WHERE status = 'declined';

-- Colonnes manquantes
ALTER TABLE public.partner_certifications
  ADD COLUMN IF NOT EXISTS validated_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS validated_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS cosignature_amount_chf NUMERIC(10,2);

COMMENT ON COLUMN public.partner_certifications.validated_by IS
  'Admin AEGRYN ayant validé l''avis du partenaire (CAS 1).';

COMMENT ON COLUMN public.partner_certifications.cosignature_amount_chf IS
  'Montant forfaitaire dû au partenaire pour cette co-certification (CAS 1). Renseigné par admin.';

-- ── 2. partner_mandates — CAS 3 (mandat client accompagné) ───────────────
CREATE TABLE IF NOT EXISTS public.partner_mandates (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Qui est le client du partenaire ?
  client_name     TEXT        NOT NULL,
  client_email    TEXT        NOT NULL,
  client_type     TEXT        NOT NULL DEFAULT 'seller'
                              CHECK (client_type IN ('seller', 'buyer', 'other')),

  -- Nature de la mission du partenaire pour son client
  mandate_type    TEXT        NOT NULL DEFAULT 'advisory'
                              CHECK (mandate_type IN (
                                'advisory',       -- conseil stratégique
                                'due_diligence',  -- due diligence vendeur
                                'fundraising',    -- levée de fonds accompagnée
                                'other'
                              )),

  description     TEXT,
  asset_id        UUID        REFERENCES public.assets(id) ON DELETE SET NULL,

  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'completed', 'cancelled')),

  -- Rétrocession AEGRYN (CAS 3) : partenaire reverse 15% de ses honoraires
  retrocession_pct NUMERIC(5,2) NOT NULL DEFAULT 15.00,

  started_at      DATE,
  ended_at        DATE,

  admin_note      TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_mandates_partner ON public.partner_mandates(partner_id, status);
CREATE INDEX IF NOT EXISTS idx_partner_mandates_asset   ON public.partner_mandates(asset_id) WHERE asset_id IS NOT NULL;

ALTER TABLE public.partner_mandates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_partner_mandates"
  ON public.partner_mandates FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_own_mandates"
  ON public.partner_mandates FOR SELECT
  USING (auth.uid() = partner_id);

CREATE TRIGGER trg_partner_mandates_updated_at
  BEFORE UPDATE ON public.partner_mandates
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 3. partner_mandate_invoices — suivi factures CAS 3 ───────────────────
CREATE TABLE IF NOT EXISTS public.partner_mandate_invoices (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id      UUID        NOT NULL REFERENCES public.partner_mandates(id) ON DELETE CASCADE,
  partner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Facture que le partenaire émet à son client
  invoice_ref     TEXT,                    -- référence de la facture partenaire
  invoice_amount_chf NUMERIC(14,2) NOT NULL, -- total facturé par le partenaire à son client
  invoice_date    DATE          NOT NULL,

  -- Rétrocession due à AEGRYN = invoice_amount_chf × retrocession_pct / 100
  retrocession_amount_chf NUMERIC(14,2),  -- calculé ou saisi manuellement

  status          TEXT        NOT NULL DEFAULT 'declared'
                              CHECK (status IN (
                                'declared',   -- partenaire a déclaré la facture
                                'confirmed',  -- AEGRYN a confirmé la réception
                                'received'    -- AEGRYN a reçu la rétrocession
                              )),

  admin_note      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mandate_invoices_mandate  ON public.partner_mandate_invoices(mandate_id);
CREATE INDEX IF NOT EXISTS idx_mandate_invoices_partner  ON public.partner_mandate_invoices(partner_id, status);

ALTER TABLE public.partner_mandate_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_mandate_invoices"
  ON public.partner_mandate_invoices FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_own_mandate_invoices"
  ON public.partner_mandate_invoices FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "partners_insert_mandate_invoices"
  ON public.partner_mandate_invoices FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE TRIGGER trg_mandate_invoices_updated_at
  BEFORE UPDATE ON public.partner_mandate_invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 4. partner_mandate_messages — messagerie interne partenaire↔admin ────
CREATE TABLE IF NOT EXISTS public.partner_mandate_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id  UUID        NOT NULL REFERENCES public.partner_mandates(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body        TEXT        NOT NULL,
  is_admin    BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mandate_messages_mandate ON public.partner_mandate_messages(mandate_id, created_at);

ALTER TABLE public.partner_mandate_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_mandate_messages"
  ON public.partner_mandate_messages FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_read_own_mandate_messages"
  ON public.partner_mandate_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM public.partner_mandates pm
      WHERE pm.id = mandate_id AND pm.partner_id = auth.uid()
    )
  );

CREATE POLICY "partners_send_mandate_messages"
  ON public.partner_mandate_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.partner_mandates pm
      WHERE pm.id = mandate_id AND pm.partner_id = auth.uid()
    )
  );

-- ── 5. commissions — ajouter mandate_id FK + aligner les types ───────────

ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS mandate_id UUID REFERENCES public.partner_mandates(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.commissions.mandate_id IS
  'Lien vers le mandat partenaire (CAS 3). Renseigné pour type = mandate_retrocession.';

CREATE INDEX IF NOT EXISTS commissions_mandate_idx
  ON public.commissions(mandate_id) WHERE mandate_id IS NOT NULL;

-- Aligner le CHECK sur le champ type existant pour inclure les nouveaux cas
ALTER TABLE public.commissions
  DROP CONSTRAINT IF EXISTS commissions_type_check;

ALTER TABLE public.commissions
  ADD CONSTRAINT commissions_type_check
    CHECK (type IN (
      'cosignature',          -- CAS 1 : AEGRYN doit au partenaire (forfait co-certification)
      'introduction',         -- CAS 2 : AEGRYN reverse 20% commission de transaction
      'mandate_retrocession'  -- CAS 3 : AEGRYN reçoit 15% des honoraires partenaire
    ));

-- Note : les anciens types 'introduction_asset' / 'introduction_buyer' / 'cosignature'
-- sont consolidés. Migrer si des lignes existent :
UPDATE public.commissions
  SET type = 'introduction'
  WHERE type IN ('introduction_asset', 'introduction_buyer');

-- ── 6. Vue partner_commission_summary ────────────────────────────────────
CREATE OR REPLACE VIEW public.partner_commission_summary AS
  SELECT
    c.id,
    c.partner_id,
    c.type,
    c.mandate_id,
    c.introduction_id,
    c.certification_id,
    c.transaction_id,
    c.asset_id,
    c.amount_chf,
    c.eligible_at,
    c.status,
    c.invoiced_at,
    c.paid_at,
    c.created_at,
    -- Libellé lisible
    CASE c.type
      WHEN 'cosignature'         THEN 'Co-certification CIFS (CAS 1)'
      WHEN 'introduction'        THEN 'Apport d''affaires (CAS 2)'
      WHEN 'mandate_retrocession' THEN 'Rétrocession mandat (CAS 3)'
      ELSE c.type
    END AS type_label
  FROM public.commissions c
  WHERE c.partner_id IS NOT NULL;

COMMENT ON VIEW public.partner_commission_summary IS
  'Vue consolidée des commissions partenaires (CAS 1/2/3). Read-only.';

-- ── 7. Grants service_role ───────────────────────────────────────────────
GRANT ALL ON public.partner_mandates            TO service_role;
GRANT ALL ON public.partner_mandate_invoices    TO service_role;
GRANT ALL ON public.partner_mandate_messages    TO service_role;
GRANT SELECT ON public.partner_commission_summary TO service_role;
GRANT SELECT ON public.partner_commission_summary TO authenticated;
