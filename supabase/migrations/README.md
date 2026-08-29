# AEGRYN, Migrations Supabase

Toutes exécutées manuellement via **Supabase SQL Editor**.  
Convention de nommage : `NNN_nom_table.sql` (NNN = ordre d'exécution).

> **Important :** toujours exécuter dans l'ordre croissant.  
> La migration 005 dépend de `auth.users` (Supabase Auth activé) et du trigger `set_updated_at` créé en 004.
> La migration 006 dépend de la table `assets` créée en 004.

---

## Migrations exécutées en production

| # | Fichier | Objectif principal | Statut |
|---|---------|-------------------|--------|
| 001 | `001_valuation_leads.sql` | Table `valuation_leads` | ✅ |
| 002 | `002_catalog_waitlist.sql` | Table `catalog_waitlist` | ✅ |
| 003 | `003_bookings_and_alliances.sql` | `assessment_day_bookings`, `alliance_applications` | ✅ |
| 004 | `004_assets.sql` | Table `assets` + trigger `set_updated_at` | ✅ |
| 005 | `005_user_profiles.sql` | `user_profiles` + colonne `assets.seller_uid` | ✅ |
| 006 | `006_nda_requests.sql` | `nda_requests`, accès NDA acquéreurs | ✅ |
| 007 | `007_evaluation_tiers.sql` | Colonnes evaluation sur `assets` | ✅ |
| 008–065 | *(voir fichiers SQL)* | Profils, KYC, parrainage, grades, auction, invoices, sécurité RLS | ✅ |
| 086 | `086_magazine_early_access_flag.sql` | Flag `magazine_early_access` dans `site_settings` | ✅ |
| 087 | `087_magazine_featured_flag.sql` | Flag `magazine_featured_issue` dans `site_settings` | ✅ |
| 088 | `088_magazine_issues_02_03_04_flags.sql` | Flags issues 02/03/04 dans `site_settings` | ✅ |
| 089 | `089_print_wishlist_address.sql` | Colonnes adresse (`first_name`, `last_name`, `address`, `city`, `postal_code`, `country`) sur `print_wishlist` | ✅ |
| 090 | `090_print_wishlist_civility_phone_rgpd.sql` | Colonnes `civility`, `phone`, `rgpd_consent` sur `print_wishlist` | ✅ |
| 091 | `091_print_wishlist_grants.sql` | Grants `service_role` sur `print_wishlist` + colonnes idempotentes (089+090) | ✅ |

> **Note :** Les migrations 008–065 couvrent notamment : `profiles`, `kyc_documents`, `expert_subscriptions`, `referral_codes`, `assets` (grade engine, CIFS), `auction_sessions`, `bids`, `invoices`, `user_notifications`, `buyer_commission_dues`, policies RLS avancées et sécurité colonnes (`admin_note`).

---

## Migrations futures planifiées

| # | Objectif | Prérequis |
|---|----------|-----------|
| 092+ | À définir selon évolution produit |, |

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
