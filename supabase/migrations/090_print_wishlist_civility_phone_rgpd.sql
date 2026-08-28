-- ─── 090 : Ajout civilité, téléphone, consentement RGPD/LPD ────────────────

alter table public.print_wishlist
  add column if not exists civility    text,           -- 'M' | 'Mme' | null
  add column if not exists phone       text,
  add column if not exists rgpd_consent boolean not null default false;
