-- ════════════════════════════════════════════════════════════════════════
-- 010_auction_access_tracking.sql
--
-- Deux tables :
--   1. auction_dossier_requests — demandes d'accès dossier par les acquéreurs
--   2. auction_access_log      — tracking des ouvertures (stats par auction)
--
-- Règle d'accès (appliquée côté applicatif dans /api/auction/grant-access) :
--   expires_at = LEAST(granted_at + INTERVAL '30 days', session_closes_at)
--   L'accès est automatiquement invalide dès session_closes_at.
--   Le lien URL n'est révélé que dans l'espace client (/client/auction).
--   Aucun envoi email du lien — par conception.
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Demandes d'accès dossier ──────────────────────────────────────────────

create table if not exists auction_dossier_requests (
  id          uuid primary key default gen_random_uuid(),
  asset_id    uuid not null references auction_assets(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  note        text,                             -- message optionnel de l'acquéreur
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),  -- admin ayant statué
  reviewed_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(asset_id, user_id)
);

create index if not exists idx_dossier_req_asset  on auction_dossier_requests(asset_id, status);
create index if not exists idx_dossier_req_user   on auction_dossier_requests(user_id);

alter table auction_dossier_requests enable row level security;

-- Service role : accès total (pour les API routes admin)
create policy "service_role_dossier_requests"
  on auction_dossier_requests for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

-- Acquéreurs : lecture de leurs propres demandes
create policy "buyers_own_dossier_requests"
  on auction_dossier_requests for select
  using (auth.uid() = user_id);

-- Acquéreurs : création d'une demande
create policy "buyers_insert_dossier_requests"
  on auction_dossier_requests for insert
  with check (auth.uid() = user_id);

create trigger trg_dossier_requests_updated_at
  before update on auction_dossier_requests
  for each row execute function set_updated_at();

-- ── 2. Log d'accès au dossier (stats par session d'enchère) ──────────────────

create table if not exists auction_access_log (
  id          uuid primary key default gen_random_uuid(),
  asset_id    uuid not null references auction_assets(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  access_id   uuid references auction_asset_access(id) on delete set null,
  page        text not null default 'dossier'
                check (page in ('dossier', 'teaser')),
  ip_hash     text,           -- SHA-256 de l'IP + salt — RGPD/nLPD compliant
  user_agent  text,
  accessed_at timestamptz not null default now()
);

create index if not exists idx_access_log_asset   on auction_access_log(asset_id, accessed_at desc);
create index if not exists idx_access_log_user    on auction_access_log(user_id);
create index if not exists idx_access_log_session on auction_access_log(asset_id, user_id, accessed_at);

alter table auction_access_log enable row level security;

-- Service role : accès total
create policy "service_role_access_log"
  on auction_access_log for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

-- Acquéreurs : lecture de leurs propres logs
create policy "buyers_own_access_log"
  on auction_access_log for select
  using (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
