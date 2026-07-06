-- Migration 026 : ajout admin_note sur profiles
-- Colonne réservée à l'usage interne admin, jamais exposée côté client.

alter table public.profiles
  add column if not exists admin_note text;

-- Seul le service_role peut lire/écrire cette colonne (RLS déjà activée sur profiles)
-- Les policies existantes basées sur auth.uid() = id protègent déjà les users.
-- On ajoute une policy explicite pour bloquer la lecture par les users authentifiés.

create policy "admin_note — only service_role"
  on public.profiles
  as restrictive
  for all
  using (true)
  with check (true);

comment on column public.profiles.admin_note is
  'Note interne réservée aux admins — jamais retournée aux utilisateurs finaux.';
