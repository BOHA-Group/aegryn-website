-- ─── 089 : Ajout champs adresse postale à print_wishlist ───────────────────

alter table public.print_wishlist
  add column if not exists first_name  text,
  add column if not exists last_name   text,
  add column if not exists address     text,
  add column if not exists city        text,
  add column if not exists postal_code text,
  add column if not exists country     text;
