-- Migration 118 — NDA client (demande de certification CIFSO)
--
-- Les rôles buyer/seller ne sont plus attribués (plus d'achat/vente d'actifs
-- tech en libre-service). Le NDA demandé en espace compte devient générique :
-- accès à des données confidentielles (dossiers de certification, data room,
-- rapports CIFSO) sans dépendance aux rôles acquéreur/cédant.
--
--   1. Colonnes de signature sur profiles pour le type 'client'
--   2. Élargissement du CHECK nda_acceptances.nda_type

-- ── 1. Champs sur profiles ─────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS client_nda_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS client_nda_version     TEXT;

-- ── 2. CHECK nda_type : ajouter 'client' ────────────────────────────────────
ALTER TABLE public.nda_acceptances
  DROP CONSTRAINT IF EXISTS nda_acceptances_nda_type_check;

ALTER TABLE public.nda_acceptances
  ADD CONSTRAINT nda_acceptances_nda_type_check
  CHECK (nda_type IN ('seller', 'buyer', 'partner', 'client'));
