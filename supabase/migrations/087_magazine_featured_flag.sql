-- ─── 087 : Flag "à la une" par issue magazine ──────────────────────────────
-- Détermine quelle issue est mise en avant (hero) sur la page /magazine.
-- Une seule issue devrait être featured à la fois (géré côté admin).

insert into public.site_settings (key, value)
values ('magazine_issue_01_featured', 'true'::jsonb)
on conflict (key) do nothing;
