-- ════════════════════════════════════════════════════════════════════════
-- 009_auction_assets.sql
-- Table canonique du catalogue AEGRYN Auction, conforme au fichier
-- auction_assets.sql de référence livré dans le prompt Windsurf.
--
-- Extensions AEGRYN par rapport à la référence :
--   • session_opens_at / session_closes_at — fenêtre de session
--   • auction_asset_access — contrôle d'accès granulaire par acheteur (30j)
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
--     La table auction_lots (migration 008) est à conserver ou supprimer
--     manuellement selon que des données y ont été insérées.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists auction_assets (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text unique not null,             -- ex: 'subblink'
  lot_number              text not null,                    -- ex: '001'
  name                    text not null,
  tagline                 text,
  catalog_context         text,                             -- ex: "Session Q3 2026 · SaaS B2B"

  -- Blocs de contenu — structure identique à la fixture subblinkLot.js
  hero_stats              jsonb not null default '[]',      -- [{value,label}]
  grade                   jsonb not null default '{}',      -- {letter,label}
  executive_summary       jsonb not null default '{}',      -- {intro,items}

  presentation_notice     jsonb not null default '{}',      -- {body,meta}
  provenance              jsonb not null default '{}',      -- {body}
  rarity                  jsonb not null default '{}',      -- {body,highlight}
  asset_state             jsonb not null default '{}',      -- {body,specs,note}
  capabilities            jsonb not null default '{}',      -- {intro,items,pending}
  target_segments         jsonb not null default '{}',      -- {intro,items,note}
  growth                  jsonb not null default '{}',      -- {body,items,closing}
  competitive_position    jsonb not null default '{}',      -- {body,highlight,closing}
  traction                jsonb not null default '{}',      -- {body}
  maturity                jsonb not null default '{}',      -- {specs}
  risks                   jsonb not null default '{}',      -- {intro,items}
  thesis                  jsonb not null default '{}',      -- {body,closing}
  mentions                jsonb not null default '{}',      -- {body}

  -- Statut éditorial
  status                  text not null default 'draft'
                            check (status in ('draft', 'published', 'archived', 'withdrawn')),

  -- Cercle d'accès minimal (1=vendeurs, 2=acquéreurs qualifiés, 3=observateurs)
  access_circle           smallint not null default 2,

  -- Extension AEGRYN — fenêtre de session
  session_opens_at        timestamptz,   -- début de la période de cession
  session_closes_at       timestamptz,   -- fin (adjudication ou retrait)

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ── Index ─────────────────────────────────────────────────────────────────────

create index if not exists idx_auction_assets_slug   on auction_assets(slug);
create index if not exists idx_auction_assets_status on auction_assets(status);

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table auction_assets enable row level security;

create policy "Fiches publiées visibles par les acquéreurs authentifiés"
  on auction_assets for select
  using (status = 'published' and auth.role() = 'authenticated');

create policy "Lecture admin sans restriction"
  on auction_assets for select
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Écriture réservée aux admins"
  on auction_assets for all
  using     (auth.jwt() ->> 'role' = 'admin')
  with check(auth.jwt() ->> 'role' = 'admin');

-- ── Table d'accès granulaire par acheteur (extension AEGRYN — fenêtre 30j) ───

create table if not exists auction_asset_access (
  id          uuid primary key default gen_random_uuid(),
  asset_id    uuid not null references auction_assets(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  granted_by  uuid references auth.users(id),  -- admin ayant accordé l'accès
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz not null,             -- session_opens_at + 30 jours
  status      text not null default 'active'
                check (status in ('active', 'revoked')),
  unique(asset_id, user_id)
);

create index if not exists idx_asset_access_user  on auction_asset_access(user_id, status);
create index if not exists idx_asset_access_asset on auction_asset_access(asset_id);

alter table auction_asset_access enable row level security;

-- Service role : accès total
create policy "service_role_asset_access"
  on auction_asset_access for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

-- Acheteurs : lecture de leurs propres records
create policy "buyers_own_asset_access"
  on auction_asset_access for select
  using (auth.uid() = user_id);

-- ── Trigger updated_at ────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_auction_assets_updated_at
  before update on auction_assets
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- Note: auction_lots (008) peut être droppé si aucune donnée n'y a été insérée:
--   drop table if exists auction_lot_access;
--   drop table if exists auction_lots;
-- ════════════════════════════════════════════════════════════════════════
