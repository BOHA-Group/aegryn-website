-- ─── 086 : Flag early access magazine ─────────────────────────────────────
-- Accès anticipé 48h pour les inscrits (newsletter + wishlist) avant publication publique.

insert into public.site_settings (key, value)
values ('magazine_issue_01_early_access', 'false'::jsonb)
on conflict (key) do nothing;
