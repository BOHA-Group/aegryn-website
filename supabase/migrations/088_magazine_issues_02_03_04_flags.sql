-- ─── 088 : Flags publication issues 02, 03, 04 ────────────────────────────

insert into public.site_settings (key, value) values
  ('magazine_issue_02_public',       'false'::jsonb),
  ('magazine_issue_02_early_access', 'false'::jsonb),
  ('magazine_issue_02_featured',     'false'::jsonb),
  ('magazine_issue_03_public',       'false'::jsonb),
  ('magazine_issue_03_early_access', 'false'::jsonb),
  ('magazine_issue_03_featured',     'false'::jsonb),
  ('magazine_issue_04_public',       'false'::jsonb),
  ('magazine_issue_04_early_access', 'false'::jsonb),
  ('magazine_issue_04_featured',     'false'::jsonb)
on conflict (key) do nothing;
