-- ──────────────────────────────────────────────────────────────────────────────
-- 008_auction_lots.sql
-- Table des fiches actifs détaillées (AssetLotSheet) + contrôle d'accès acheteurs
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
--     Commande d'application : supabase db push (local) ou migration Supabase Dashboard.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── Table principale : fiche lot complète ────────────────────────────────────

create table if not exists auction_lots (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  lot_number      text not null,

  -- Champs publics (visibles dans le catalogue après NDA) ─────────────────────
  name            text not null,
  tagline         text,
  catalog_context text,           -- ex. "Session Q3 2026 · SaaS B2B"
  grade_letter    text,           -- A, AA, AAA, ★, B, etc.
  grade_label     text,           -- description qualitative du grade
  category        text,           -- SaaS B2B, Marketplace, etc.
  arr_range       text,           -- fourchette ARR obfusquée, ex. "€100k–€300k"

  -- Statut et fenêtre de session ───────────────────────────────────────────────
  status              text not null default 'draft'  -- draft | published | closed
    check (status in ('draft', 'published', 'closed')),
  session_opens_at    timestamptz,    -- début de la fenêtre d'accès 30 jours
  session_closes_at   timestamptz,    -- fin de session (cession réalisée ou non)

  -- Sections complètes de la fiche (JSONB — accès restreint via RLS) ──────────
  hero_stats            jsonb,   -- HeroStat[]
  executive_summary     jsonb,   -- { intro: string, items: SummaryItem[] }
  presentation_notice   jsonb,   -- { body: string[], meta: string }
  provenance            jsonb,   -- { body: string[] }
  rarity                jsonb,   -- { body: string[], highlight?: string }
  asset_state           jsonb,   -- { body: string[], specs: [string, string][], note?: string }
  capabilities          jsonb,   -- { intro: string, items: BulletItem[], pending?: string }
  target_segments       jsonb,   -- { intro: string, items: TargetItem[], note?: string }
  growth                jsonb,   -- { body: string[], items: BulletItem[], closing?: string }
  competitive_position  jsonb,   -- { body: string[], highlight?: string, closing?: string }
  traction              jsonb,   -- { body: string[] }
  maturity              jsonb,   -- { specs: [string, string][] }
  risks                 jsonb,   -- { intro: string, items: BulletItem[] }
  thesis                jsonb,   -- { body: string[], closing?: string }
  mentions              jsonb,   -- { body: string[] }

  -- Lien optionnel vers la table assets (soumission initiale) ─────────────────
  asset_id        uuid references assets(id) on delete set null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Table de contrôle d'accès ────────────────────────────────────────────────

create table if not exists auction_lot_access (
  id          uuid primary key default gen_random_uuid(),
  lot_id      uuid not null references auction_lots(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  granted_by  uuid references auth.users(id),   -- admin ayant accordé l'accès
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz not null,             -- session_opens_at + 30 jours
  status      text not null default 'active'
    check (status in ('active', 'revoked')),
  unique(lot_id, user_id)
);

-- ── Index ─────────────────────────────────────────────────────────────────────

create index if not exists idx_auction_lots_status  on auction_lots(status);
create index if not exists idx_auction_lots_slug    on auction_lots(slug);
create index if not exists idx_lot_access_user      on auction_lot_access(user_id, status);
create index if not exists idx_lot_access_lot       on auction_lot_access(lot_id);

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table auction_lots       enable row level security;
alter table auction_lot_access enable row level security;

-- Service role : accès total (API admin, backoffice)
create policy "service_role_all_auction_lots"
  on auction_lots for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

create policy "service_role_all_lot_access"
  on auction_lot_access for all
  using     (auth.role() = 'service_role')
  with check(auth.role() = 'service_role');

-- Acheteurs authentifiés : lecture de leurs propres records d'accès
create policy "buyers_own_access_records"
  on auction_lot_access for select
  using (auth.uid() = user_id);

-- Acheteurs : lecture du lot UNIQUEMENT si accès actif + non expiré
create policy "buyers_authorized_lots_full"
  on auction_lots for select
  using (
    status = 'published'
    and exists (
      select 1 from auction_lot_access ala
      where ala.lot_id = auction_lots.id
        and ala.user_id = auth.uid()
        and ala.status = 'active'
        and ala.expires_at > now()
    )
  );

-- ── Trigger updated_at ────────────────────────────────────────────────────────

create or replace function update_auction_lots_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger auction_lots_updated_at
  before update on auction_lots
  for each row execute function update_auction_lots_updated_at();

-- ──────────────────────────────────────────────────────────────────────────────
-- FIN — attendre validation Yohann avant db push
-- ──────────────────────────────────────────────────────────────────────────────
