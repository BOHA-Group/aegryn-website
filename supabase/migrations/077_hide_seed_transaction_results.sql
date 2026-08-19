-- ════════════════════════════════════════════════════════════════════════
-- 077_hide_seed_transaction_results.sql
--
-- Masque toutes les entrées de seed dans transaction_results.
-- Aucune vente réalisée à ce stade — la page /transact/results affichera
-- le message "En attente des premières clôtures" (état vide géré côté UI).
-- À republier manuellement via admin Supabase quand des transactions
-- réelles seront clôturées (is_public = true).
-- ════════════════════════════════════════════════════════════════════════

UPDATE transaction_results
SET is_public = false
WHERE is_public = true;
