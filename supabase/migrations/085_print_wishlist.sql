-- ─── 085 : Table print_wishlist ────────────────────────────────────────────
-- Enregistre les demandes d'intérêt pour l'édition papier du magazine.
-- interests : CSV des clés de thèmes sélectionnés (ex: "market,techAi,build")

create table if not exists public.print_wishlist (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text        not null,
  email      text        not null,
  company    text,
  interests  text,           -- CSV des thèmes sélectionnés
  locale     text
);

-- Index sur email pour dédup rapide
create index if not exists print_wishlist_email_idx on public.print_wishlist (email);

-- RLS : lecture réservée au service_role (API admin), aucun accès public
alter table public.print_wishlist enable row level security;

-- Pas de policy SELECT publique — lecture via service_role uniquement
-- INSERT autorisé depuis l'API route (service_role bypasse RLS)
