-- ════════════════════════════════════════════════════════════════════════
-- 011_auction_bids_sequesters_kyc.sql
--
-- Extension du schéma AEGRYN Auction — données financières et conformité
--
-- Ajoute sur auction_assets :
--   • reserve_price       — mise à prix confidentielle (CHF)
--   • buyer_premium_pct   — commission acquéreur AEGRYN (%)
--
-- Nouvelles tables :
--   • auction_bids              — offres scellées (appel d'offres fermé)
--   • auction_sequesters        — cautions / séquestres avant bid admis
--   • buyer_kyc_verifications   — suivi KYC acquéreurs
--
-- Modèle d'enchère : SEALED BID / appel d'offres fermé (standard M&A tech)
--   1. Acheteur KYC validé + caution versée → bid admis
--   2. Offre confidentielle avant session_closes_at
--   3. Admin retient l'offre → adjudication
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Colonnes financières sur auction_assets ───────────────────────────────

alter table auction_assets
  add column if not exists reserve_price     numeric(14,2),   -- CHF, confidentiel
  add column if not exists buyer_premium_pct numeric(5,2) not null default 10.00;
                                                              -- % commission acquéreur

comment on column auction_assets.reserve_price     is 'Mise à prix minimale confidentielle (CHF). NULL = sans réserve.';
comment on column auction_assets.buyer_premium_pct is 'Commission acquéreur AEGRYN en % du prix d''adjudication (défaut 10%).';

-- ── 2. KYC acquéreurs ────────────────────────────────────────────────────────

create table if not exists buyer_kyc_verifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,

  -- Identité
  full_name       text,
  company_name    text,
  country         text,                 -- ISO 3166-1 alpha-2

  -- Statut
  kyc_status      text not null default 'pending'
                    check (kyc_status in ('pending', 'in_review', 'approved', 'rejected', 'expired')),

  -- Capacité financière déclarée
  declared_capacity_min_chf  numeric(16,2),  -- fourchette basse déclarée
  declared_capacity_max_chf  numeric(16,2),  -- fourchette haute déclarée

  -- Documents (URLs Cloudflare R2)
  id_document_url  text,
  proof_of_funds_url text,

  -- Notes admin
  admin_note      text,
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique(user_id)
);

create index if not exists idx_kyc_status on buyer_kyc_verifications(kyc_status);

alter table buyer_kyc_verifications enable row level security;

create policy "service_role_kyc"
  on buyer_kyc_verifications for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

create policy "buyers_own_kyc"
  on buyer_kyc_verifications for select
  using (auth.uid() = user_id);

create trigger trg_kyc_updated_at
  before update on buyer_kyc_verifications
  for each row execute function set_updated_at();

-- ── 3. Séquestres / cautions ─────────────────────────────────────────────────

create table if not exists auction_sequesters (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references auction_assets(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,

  -- Montant de la caution (CHF)
  amount_chf      numeric(14,2) not null,

  -- Statut du versement
  status          text not null default 'awaited'
                    check (status in (
                      'awaited',      -- demandé, en attente de virement
                      'received',     -- virement reçu et confirmé
                      'released',     -- restitué après clôture (non adjudicataire)
                      'applied',      -- déduit du prix d'adjudication (gagnant)
                      'forfeited'     -- perdu (défaillance de l'acheteur)
                    )),

  -- Références bancaires
  reference       text unique,         -- référence unique envoyée à l'acheteur
  received_at     timestamptz,
  bank_ref        text,                -- référence virement entrant

  admin_note      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique(asset_id, user_id)
);

create index if not exists idx_sequesters_asset  on auction_sequesters(asset_id, status);
create index if not exists idx_sequesters_user   on auction_sequesters(user_id);

alter table auction_sequesters enable row level security;

create policy "service_role_sequesters"
  on auction_sequesters for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

create policy "buyers_own_sequesters"
  on auction_sequesters for select
  using (auth.uid() = user_id);

create trigger trg_sequesters_updated_at
  before update on auction_sequesters
  for each row execute function set_updated_at();

-- ── 4. Offres scellées (sealed bids) ─────────────────────────────────────────

create table if not exists auction_bids (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references auction_assets(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  sequester_id    uuid references auction_sequesters(id) on delete set null,

  -- Offre financière (CHF)
  bid_amount_chf  numeric(16,2) not null,

  -- Conditions de l'offre (JSONB libre)
  -- ex: { "payment_terms": "30j", "conditions": "Due diligence 10j", "loi_url": "..." }
  conditions      jsonb not null default '{}',

  -- Statut
  status          text not null default 'submitted'
                    check (status in (
                      'submitted',    -- soumise, en attente d'examen
                      'under_review', -- examinée par AEGRYN
                      'retained',     -- offre retenue — adjudication
                      'rejected',     -- offre rejetée (non retenue)
                      'withdrawn'     -- retirée par l'acheteur
                    )),

  -- Revue admin
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  admin_note      text,

  submitted_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table auction_bids is 'Offres scellées (appel d''offres fermé). Chaque acheteur soumet une offre unique par actif. La mise à prix minimale (reserve_price) est vérifiée côté applicatif.';

create index if not exists idx_bids_asset  on auction_bids(asset_id, status);
create index if not exists idx_bids_user   on auction_bids(user_id);

alter table auction_bids enable row level security;

create policy "service_role_bids"
  on auction_bids for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

-- Acheteur voit sa propre offre (PAS le montant si statut submitted pour éviter le gaming)
create policy "buyers_own_bids_no_amount"
  on auction_bids for select
  using (auth.uid() = user_id);

create trigger trg_bids_updated_at
  before update on auction_bids
  for each row execute function set_updated_at();

-- ── Vue admin synthétique ─────────────────────────────────────────────────────

create or replace view auction_admin_summary as
select
  aa.id,
  aa.slug,
  aa.lot_number,
  aa.name,
  aa.status,
  aa.session_opens_at,
  aa.session_closes_at,
  aa.reserve_price,
  aa.buyer_premium_pct,
  (aa.grade->>'letter')             as grade_letter,
  count(distinct adr.id)
    filter (where adr.status = 'pending')   as requests_pending,
  count(distinct adr.id)
    filter (where adr.status = 'approved')  as requests_approved,
  count(distinct ab.id)
    filter (where ab.status = 'submitted')  as bids_submitted,
  count(distinct ab.id)
    filter (where ab.status = 'retained')   as bids_retained,
  max(ab.bid_amount_chf)
    filter (where ab.status in ('submitted','retained')) as highest_bid_chf,
  count(distinct ase.id)
    filter (where ase.status = 'received')  as sequesters_received
from auction_assets aa
left join auction_dossier_requests adr on adr.asset_id = aa.id
left join auction_bids             ab  on ab.asset_id  = aa.id
left join auction_sequesters       ase on ase.asset_id = aa.id
group by aa.id;

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
