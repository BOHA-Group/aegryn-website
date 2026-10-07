-- Migration 123: motivation facultative pour les candidatures talent
-- Le formulaire /talent/candidats rend la lettre de motivation optionnelle ;
-- la colonne etait NOT NULL depuis la migration 093, ce qui renvoyait un
-- insert en erreur quand le champ restait vide.

ALTER TABLE talent_candidates
  ALTER COLUMN motivation DROP NOT NULL;
