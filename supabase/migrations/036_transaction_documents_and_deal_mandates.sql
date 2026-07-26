-- ════════════════════════════════════════════════════════════════════════
-- 036_transaction_documents_and_deal_mandates.sql
--
-- 1. Codes TX dans documents_catalog (phase transaction — 10 codes)
--    documents déposés dans data_room_documents, même table, phase distincte
--    via le préfixe TX- du code.
--
-- 2. partner_deal_requests — mise en relation vendeur/acheteur avec un
--    prestataire pour accompagnement transaction (indépendant du grading).
--    Le prestataire dépose une preuve de facture et reverse une commission
--    à AEGRYN (15% par défaut).
--
-- RAPPEL DES RÈGLES MÉTIER IMMUABLES :
--   • Le grading est UNIQUEMENT porté par AEGRYN (partner_certifications).
--   • Une transaction ne peut être initiée que si assets.status = 'graded'
--     ou 'published' — contrôle applicatif dans l'API, pas en DB.
--   • Les documents KYC acheteur (identité, preuve de fonds) restent dans
--     kyc_documents / buyer_kyc_verifications — jamais dans data_room_documents.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Codes TX dans documents_catalog ───────────────────────────────────
-- phase = 'transaction' identifiée par le préfixe TX- du code.
-- Une colonne phase calculée est ajoutée à la vue v_document_completeness.

INSERT INTO public.documents_catalog
  (code, dimension, label_fr, label_en, required_level, format_hint, note_seller, note_admin, sort_order)
VALUES

('TX-01', 'T', 'Lettre d''intention signée (LOI)',
  'Signed Letter of Intent (LOI)',
  'blocking',
  'PDF signé par les deux parties ou par l''acheteur seul si unilatérale',
  'Document confidentiel — visible uniquement par l''admin AEGRYN. Requis avant toute validation de l''accord de principe.',
  'Bloquant pour le passage en ap_signed. Vérifier : montant indicatif, conditions suspensives, exclusivité et durée.',
  50),

('TX-02', 'T', 'Term sheet / Accord de Principe signé',
  'Signed Term Sheet / Heads of Terms',
  'blocking',
  'PDF signé par acheteur et vendeur',
  'Ce document marque votre accord formel sur les conditions principales. Il précède le SPA.',
  'Bloquant pour ap_signed. Vérifier : prix, conditions de closing, garanties principales, date de signature.',
  51),

('TX-03', 'T', 'Rapport de due diligence juridique (acheteur)',
  'Legal due diligence report (buyer)',
  'blocking',
  'PDF — rapport du cabinet juridique de l''acheteur',
  'Déposé par l''acheteur ou son conseil. Peut contenir des réserves — les déclarer à AEGRYN.',
  'Bloquant pour passage en signing. Vérifier : réserves bloquantes, litige IP, conformité statutaire.',
  52),

('TX-04', 'T', 'Rapport de due diligence financière (acheteur)',
  'Financial due diligence report (buyer)',
  'blocking',
  'PDF — rapport de l''expert-comptable ou cabinet de l''acheteur',
  'Déposé par l''acheteur ou son conseil.',
  'Bloquant pour signing. Vérifier : réconciliation avec F-01/F-02, ajustements de prix identifiés.',
  53),

('TX-05', 'T', 'Rapport de due diligence technique (acheteur)',
  'Technical due diligence report (buyer)',
  'recommended',
  'PDF — rapport partenaire technique de l''acheteur',
  'Recommandé pour les actifs de grade ★/AAA. Peut entraîner une renégociation si des risques sont identifiés.',
  'Recommandé. Si absent : noter dans admin_note. Bloquant si l''actif est grade ★ et que le score C > 22.',
  54),

('TX-06', 'T', 'Draft SPA (Protocole de cession)',
  'Share Purchase Agreement draft',
  'blocking',
  'PDF — version de travail rédigée par le cabinet juridique',
  'Version de travail avant signature définitive. Peut évoluer plusieurs fois.',
  'Bloquant pour signing. Vérifier : clauses GAP, earn-out, non-concurrence, séquestre.',
  55),

('TX-07', 'T', 'Convention GAP (Garantie Actif et Passif)',
  'Asset and Liability Guarantee Agreement',
  'blocking',
  'PDF — signé ou en cours de négociation',
  'Document juridique critique — protège l''acheteur contre les passifs cachés.',
  'Bloquant pour signing. Peut être intégré dans le SPA ou séparé. Vérifier le plafond et la durée.',
  56),

('TX-08', 'T', 'SPA définitif signé',
  'Final signed Share Purchase Agreement',
  'blocking',
  'PDF final signé par toutes les parties',
  'Version définitive signée — c''est l''acte de cession. Déposez le fichier signé ici.',
  'Bloquant pour closed. La date de signature devient la date de closing.',
  57),

('TX-09', 'T', 'Attestation de virement escrow',
  'Escrow wire transfer confirmation',
  'blocking',
  'PDF ou capture banque — preuve du virement vers le compte séquestre',
  'Preuve que le montant convenu a été transféré vers le compte séquestre AEGRYN.',
  'Bloquant pour escrow_paid. Croiser avec escrow_amount_chf dans transactions.',
  58),

('TX-10', 'T', 'Procès-verbal de closing',
  'Closing memorandum',
  'blocking',
  'PDF signé par toutes les parties',
  'Document récapitulatif du closing — confirme la cession effective.',
  'Bloquant pour closed. Déclenche la libération du séquestre et le calcul des commissions.',
  59)

ON CONFLICT (code) DO NOTHING;

-- ── 2. Vue mise à jour : v_document_completeness avec phase ──────────────
-- DROP + CREATE obligatoire : CREATE OR REPLACE interdit de changer l'ordre
-- ou le nom des colonnes existantes (erreur 42P16).

DROP VIEW IF EXISTS public.v_document_completeness;

CREATE VIEW public.v_document_completeness AS
SELECT
  d.asset_id,
  c.dimension,
  CASE WHEN c.code LIKE 'TX-%' THEN 'transaction' ELSE 'grading' END AS phase,
  COUNT(c.code)                                                           AS total_catalog,
  COUNT(c.code) FILTER (WHERE c.required_level = 'blocking')             AS blocking_total,
  COUNT(d2.id)  FILTER (WHERE c.required_level = 'blocking'
    AND d2.admin_quality = 'sufficient')                                  AS blocking_ok,
  COUNT(d2.id)  FILTER (WHERE c.required_level = 'recommended')          AS recommended_uploaded,
  COUNT(c.code) FILTER (WHERE c.required_level = 'recommended')          AS recommended_total,
  BOOL_OR(d2.blocks_grading)                                             AS has_blocking_doc,
  STRING_AGG(c.code, ', ') FILTER (WHERE d2.blocks_grading IS TRUE)      AS blocking_codes
FROM public.documents_catalog c
CROSS JOIN (SELECT DISTINCT asset_id FROM public.data_room_documents) d
LEFT JOIN public.data_room_documents d2
  ON d2.asset_id = d.asset_id AND d2.document_code = c.code
GROUP BY d.asset_id, c.dimension,
         CASE WHEN c.code LIKE 'TX-%' THEN 'transaction' ELSE 'grading' END;

GRANT SELECT ON public.v_document_completeness TO service_role, authenticated;

-- ── 3. partner_deal_requests — mise en relation transaction ───────────────
--
-- Workflow simplifié :
--   1. Vendeur OU acheteur demande un accompagnement transaction
--      (indépendant du grading — AEGRYN gère le grading seul)
--   2. AEGRYN met en relation avec un prestataire de la plateforme
--   3. Le prestataire envoie ses conditions (fees_chf) hors plateforme
--   4. Paiement direct vendeur/acheteur → prestataire (RIB hors plateforme)
--   5. Prestataire dépose une preuve de facture ici (invoice_proof_url)
--   6. Prestataire reverse 15% à AEGRYN (commission_amount_chf)
--   7. Admin confirme la réception de la commission

CREATE TABLE IF NOT EXISTS public.partner_deal_requests (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui demande l'accompagnement
  requester_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_role   TEXT        NOT NULL DEFAULT 'seller'
                               CHECK (requester_role IN ('seller', 'buyer')),

  -- Actif concerné
  asset_id         UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,

  -- Type d'accompagnement demandé
  service_type     TEXT        NOT NULL DEFAULT 'transaction_advisory'
                               CHECK (service_type IN (
                                 'transaction_advisory',   -- conseil M&A généraliste
                                 'legal_dd',               -- due diligence juridique
                                 'financial_dd',           -- due diligence financière
                                 'technical_dd',           -- due diligence technique
                                 'negotiation_support'     -- support à la négociation
                               )),

  -- Description libre du besoin
  description      TEXT,

  -- Prestataire mis en relation par AEGRYN (NULL jusqu'à mise en relation)
  partner_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Statut du parcours
  status           TEXT        NOT NULL DEFAULT 'requested'
                               CHECK (status IN (
                                 'requested',      -- demande reçue, en attente de mise en relation
                                 'matched',        -- AEGRYN a mis en relation avec un prestataire
                                 'in_progress',    -- prestataire travaille
                                 'completed',      -- mission terminée
                                 'cancelled'       -- annulé
                               )),

  -- Honoraires du prestataire (communiqués directement à son client)
  fees_chf         NUMERIC(14,2),              -- montant honoraires hors plateforme

  -- Commission AEGRYN = 15% des honoraires prestataire
  commission_pct   NUMERIC(5,2)  NOT NULL DEFAULT 15.00,
  commission_amount_chf NUMERIC(14,2)          -- calculé : fees_chf * commission_pct / 100

    GENERATED ALWAYS AS (
      CASE WHEN fees_chf IS NOT NULL
        THEN ROUND(fees_chf * commission_pct / 100, 2)
        ELSE NULL
      END
    ) STORED,

  -- Preuve de facture déposée par le PRESTATAIRE (côté mandaté)
  invoice_proof_url      TEXT,                 -- URL Cloudflare R2
  invoice_ref            TEXT,                 -- Référence facture prestataire
  invoice_date           DATE,

  -- Preuve de facture déposée par le MANDANT (côté qui a payé)
  -- Permet le contrôle croisé admin : si écart → alerte automatique
  client_invoice_url     TEXT,                 -- URL Cloudflare R2 — côté mandant
  client_invoice_ref     TEXT,                 -- Référence facture côté mandant
  client_invoice_date    DATE,
  client_invoice_amount_chf NUMERIC(14,2),     -- Montant déclaré par le mandant

  -- Suivi commission AEGRYN
  commission_status TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (commission_status IN (
                                  'pending',     -- rien reçu
                                  'declared',    -- prestataire a déclaré avoir payé
                                  'received'     -- AEGRYN a confirmé la réception
                                )),

  -- Alerte écart de montant (calculée par trigger)
  invoice_mismatch       BOOLEAN NOT NULL DEFAULT false,
  invoice_mismatch_note  TEXT,                 -- détail de l'écart — admin uniquement

  -- Notes
  admin_note        TEXT,        -- note interne AEGRYN (jamais visible client)
  matched_at        TIMESTAMPTZ, -- date de mise en relation
  completed_at      TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.partner_deal_requests IS
  'Demandes d''accompagnement transaction (acheteur ou vendeur). Indépendant du grading.
   AEGRYN met en relation avec un prestataire. Prestataire facture son client directement
   et reverse 15% à AEGRYN avec preuve de facture.';

COMMENT ON COLUMN public.partner_deal_requests.commission_amount_chf IS
  'Calculé automatiquement : fees_chf × commission_pct / 100. Non contractuel tant que invoice_proof_url est NULL.';

COMMENT ON COLUMN public.partner_deal_requests.invoice_proof_url IS
  'URL R2 de la preuve de facture déposée par le prestataire (mandaté). Croiser avec client_invoice_url.'
;

COMMENT ON COLUMN public.partner_deal_requests.client_invoice_url IS
  'URL R2 de la preuve de paiement déposée par le mandant (vendeur/acheteur). Contrôle croisé admin.'
;

COMMENT ON COLUMN public.partner_deal_requests.invoice_mismatch IS
  'TRUE si écart détecté entre fees_chf (prestataire) et client_invoice_amount_chf (mandant). Déclenché par trigger.'
;

CREATE INDEX IF NOT EXISTS idx_pdr_asset       ON public.partner_deal_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_pdr_requester   ON public.partner_deal_requests(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_pdr_partner     ON public.partner_deal_requests(partner_id, status)
  WHERE partner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pdr_commission  ON public.partner_deal_requests(commission_status)
  WHERE commission_status != 'received';

-- ── 4. RLS partner_deal_requests ─────────────────────────────────────────

ALTER TABLE public.partner_deal_requests ENABLE ROW LEVEL SECURITY;

-- Service role : accès total
CREATE POLICY "service_role_partner_deal_requests"
  ON public.partner_deal_requests FOR ALL
  USING (auth.role() = 'service_role');

-- Admin AEGRYN : accès total
CREATE POLICY "admin_full_partner_deal_requests"
  ON public.partner_deal_requests FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Demandeur (vendeur ou acheteur) : voit sa propre demande
CREATE POLICY "requester_own_deal_request"
  ON public.partner_deal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id);

-- Prestataire assigné : voit la demande + peut déposer sa preuve de facture
CREATE POLICY "partner_assigned_deal_request_select"
  ON public.partner_deal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

CREATE POLICY "partner_assigned_deal_request_update"
  ON public.partner_deal_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner_id)
  WITH CHECK (
    auth.uid() = partner_id
    -- Le prestataire ne peut modifier que les champs liés à sa facture et statut
    -- (enforcement fin côté API — la policy autorise l'UPDATE ligne entière pour simplicité)
  );

-- Demandeur : peut créer une demande
CREATE POLICY "requester_insert_deal_request"
  ON public.partner_deal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

-- ── 5. Trigger updated_at + détection écart de factures ─────────────────

CREATE TRIGGER trg_partner_deal_requests_updated_at
  BEFORE UPDATE ON public.partner_deal_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- Trigger : détecte l'écart entre la facture prestataire (fees_chf) et
-- la facture mandant (client_invoice_amount_chf) dès que les deux sont renseignées.
-- Écart toléré : 2% (arrondis, TVA, frais bancaires).
-- Si écart > 2% → invoice_mismatch = TRUE + note admin automatique.

CREATE OR REPLACE FUNCTION public.fn_check_invoice_mismatch()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  diff_pct NUMERIC;
BEGIN
  IF NEW.fees_chf IS NOT NULL AND NEW.client_invoice_amount_chf IS NOT NULL THEN
    diff_pct := ABS(NEW.fees_chf - NEW.client_invoice_amount_chf)
                / NULLIF(NEW.fees_chf, 0) * 100;

    IF diff_pct > 2 THEN
      NEW.invoice_mismatch := TRUE;
      NEW.invoice_mismatch_note :=
        'ALERTE écart factures : prestataire déclare CHF '
        || NEW.fees_chf::TEXT
        || ' — mandant déclare CHF '
        || NEW.client_invoice_amount_chf::TEXT
        || ' — écart '
        || ROUND(diff_pct, 1)::TEXT
        || '% (seuil 2%)';
    ELSE
      NEW.invoice_mismatch := FALSE;
      NEW.invoice_mismatch_note := NULL;
    END IF;
  ELSE
    NEW.invoice_mismatch := FALSE;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_invoice_mismatch_check
  BEFORE INSERT OR UPDATE ON public.partner_deal_requests
  FOR EACH ROW EXECUTE FUNCTION public.fn_check_invoice_mismatch();

-- ── 6. Vue admin synthétique des demandes en attente ─────────────────────

CREATE OR REPLACE VIEW public.v_pending_deal_requests AS
SELECT
  pdr.id,
  pdr.created_at,
  pdr.status,
  pdr.requester_role,
  pdr.service_type,
  pdr.description,
  pdr.fees_chf,
  pdr.commission_amount_chf,
  pdr.commission_status,
  pdr.invoice_proof_url,
  pdr.invoice_ref,
  pdr.invoice_date,
  pdr.client_invoice_url,
  pdr.client_invoice_amount_chf,
  pdr.invoice_mismatch,
  pdr.invoice_mismatch_note,
  a.company_name,
  a.seller_email,
  a.official_grade,
  a.status                     AS asset_status,
  rp.email                     AS requester_email,
  pp.email                     AS partner_email
FROM public.partner_deal_requests pdr
JOIN public.assets   a   ON a.id  = pdr.asset_id
JOIN public.profiles rp  ON rp.id = pdr.requester_id
LEFT JOIN public.profiles pp ON pp.id = pdr.partner_id
WHERE pdr.status NOT IN ('completed', 'cancelled');

COMMENT ON VIEW public.v_pending_deal_requests IS
  'Vue admin : demandes d''accompagnement actives — mise en relation, suivi commission.';

GRANT SELECT ON public.v_pending_deal_requests TO service_role;

-- ── 7. Grants ─────────────────────────────────────────────────────────────

GRANT ALL    ON public.partner_deal_requests TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.partner_deal_requests TO authenticated;
