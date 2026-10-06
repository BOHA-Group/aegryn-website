-- 120_advisory_leads_cycles.sql
-- Bloc FRANCHIR (/franchir/*) : les demandes ?cycle=<slug>&action=<slug>
-- des pages de cycle de vie et ?action=echange de l'intro (/valoriser)
-- postent dans advisory_leads avec metier = slug de cycle ou 'general'.

ALTER TABLE public.advisory_leads
  DROP CONSTRAINT IF EXISTS advisory_leads_metier_check;

ALTER TABLE public.advisory_leads
  ADD CONSTRAINT advisory_leads_metier_check
  CHECK (metier IN (
    'strategie', 'conformite', 'technologie', 'talent', 'ma',
    'general', 'lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'
  ));
