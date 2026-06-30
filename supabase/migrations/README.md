# AEGRYN — Migrations Supabase

Toutes exécutées manuellement via **Supabase SQL Editor**.  
Convention de nommage : `NNN_nom_table.sql` (NNN = ordre d'exécution).

> **Important :** toujours exécuter dans l'ordre croissant.  
> La migration 005 dépend de `auth.users` (Supabase Auth activé) et du trigger `set_updated_at` créé en 004.

---

## Migrations exécutées en production

| # | Fichier | Table(s) créée(s) | Dépendances | Statut |
|---|---------|-------------------|-------------|--------|
| 001 | `001_valuation_leads.sql` | `valuation_leads` | — | ✅ exécuté |
| 002 | `002_catalog_waitlist.sql` | `catalog_waitlist` | — | ✅ exécuté |
| 003 | `003_bookings_and_alliances.sql` | `assessment_day_bookings`, `alliance_applications` | — | ✅ exécuté |
| 004 | `004_assets.sql` | `assets` | trigger `set_updated_at` | ✅ exécuté |
| 005 | `005_user_profiles.sql` | `user_profiles` + colonne `assets.seller_uid` | 004, Auth activé | ✅ exécuté |

---

## Migrations futures planifiées

| # | Fichier (à créer) | Objectif | Prérequis |
|---|-------------------|----------|-----------|
| 006 | `006_sessions.sql` | `auction_sessions` — sessions de vente planifiées | — |
| 007 | `007_bids.sql` | `bids` — offres d'acquéreurs sur actifs | 005, 006 |
| 008 | `008_transactions.sql` | `transactions` — clôture de vente, escrow | 004, 007 |
| 009 | `009_nda_requests.sql` | `nda_requests` — demandes d'accès NDA par acquéreur | 004, 005 |
| 010 | `010_notifications.sql` | `notifications` — alertes utilisateurs | 005 |

---

## Schéma des dépendances

```
auth.users (Supabase)
  └── 005_user_profiles (id FK)
        └── 004_assets (seller_uid FK)

001_valuation_leads   (indépendant)
002_catalog_waitlist  (indépendant)
003_bookings_and_alliances (indépendant)
```

---

## Commandes utiles

```sql
-- Vérifier toutes les tables du schema public
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Vérifier les policies RLS
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';

-- Vérifier les indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;
```
