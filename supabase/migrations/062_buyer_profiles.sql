-- ── Table pré-qualification acheteurs AEGRYN Auction ─────────────────────────
-- Stocke les demandes d'accès au deal flow envoyées depuis /auction/buyers.
-- Statut initial : 'pending' → 'approved' | 'rejected' par l'admin.
-- Un acheteur approuvé + NDA signé reçoit les alertes matching (secteur/grade uniquement).

CREATE TABLE IF NOT EXISTS public.buyer_profiles (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identité
  full_name       TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  organization    TEXT,
  country         TEXT        NOT NULL DEFAULT 'CH',

  -- Profil acquisition
  buyer_type      TEXT        NOT NULL
                    CHECK (buyer_type IN ('founder', 'fund', 'family_office', 'corporate', 'other')),
  ticket_min_eur  INTEGER,
  ticket_max_eur  INTEGER,
  sectors         TEXT[]      NOT NULL DEFAULT '{}',
  geographies     TEXT[]      NOT NULL DEFAULT '{}',
  operation_types TEXT[]      NOT NULL DEFAULT '{}',

  -- Capacité financière
  funds_proof     TEXT        NOT NULL
                    CHECK (funds_proof IN ('bank_statement', 'fund_commitment', 'self_declared', 'other')),
  funds_amount    TEXT,

  -- Message libre
  message         TEXT,

  -- Statut admin
  status          TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note      TEXT,
  reviewed_by     TEXT,
  reviewed_at     TIMESTAMPTZ,

  -- NDA
  nda_signed_at   TIMESTAMPTZ,

  -- Métadonnées
  locale          TEXT        NOT NULL DEFAULT 'fr',
  source_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_status
  ON public.buyer_profiles (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_email
  ON public.buyer_profiles (lower(email));

ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Service role uniquement (données sensibles)
CREATE POLICY "service_role_buyer_profiles"
  ON public.buyer_profiles FOR ALL
  USING (auth.role() = 'service_role');

GRANT SELECT, INSERT, UPDATE, DELETE ON public.buyer_profiles TO service_role;
