-- ─── 091 : Grants service_role sur print_wishlist ──────────────────────────

-- S'assurer que service_role peut lire/écrire/supprimer (bypass RLS)
grant select, insert, update, delete on public.print_wishlist to service_role;

-- S'assurer que les séquences sont accessibles
grant usage, select on all sequences in schema public to service_role;

-- Idempotent : ajouter les colonnes si elles n'existent pas encore (089 + 090)
alter table public.print_wishlist
  add column if not exists first_name   text,
  add column if not exists last_name    text,
  add column if not exists address      text,
  add column if not exists city         text,
  add column if not exists postal_code  text,
  add column if not exists country      text,
  add column if not exists civility     text,
  add column if not exists phone        text,
  add column if not exists rgpd_consent boolean not null default false;
