# Aegryn — Plan de recette sécurité

Périmètre : site `aegryn.com` (Next.js, 101 routes API) et base Supabase `regdgeodxwpqekhcfmmp`. Les écritures du site passent par les routes serveur avec la clé de service ; le navigateur n'écrit jamais directement dans les tables.
Méthode : attaques réelles avec un compte jetable ou la seule clé publique, serveur local branché sur la base ; aucun secret n'est reproduit ici.
Test versionné : `scripts/security-attack-test.mjs` (dépôt d'images, insertions anonymes).

## 1. Journal des exécutions

| N° | Date | Environnement | Résultat |
|---|---|---|---|
| S-01 | 10/11/2026 | Site local + base de production, courriel réel vers la boîte support neediu | Préinscription des prestataires de bout en bout : 34 contrôles OK (validations, limites, confirmation, reprise à la création du compte, suppression, purge à 60 jours). Cas « courriel non parti » : avant correctif, réponse « ok » à tort. |
| S-02 | 10/11/2026 | Base, clé anonyme | **Avant correctif** : n'importe qui, anonyme compris, déposait ou écrasait des images dans le stockage public des avatars d'experts (politiques ouvertes à tous). Insertions anonymes possibles dans 14 tables de formulaires. Le profil d'un utilisateur connecté n'est pas modifiable (aucun droit de table pour `authenticated`). |
| S-03 | 10/11/2026 | idem, après migration 125 | Dépôt anonyme et dépôt dans le dossier d'un autre : refusés ; insertion anonyme de mandat : refusée (42501) ; fichiers de test supprimés. |
| S-04 | 10/11/2026 | Serveur local | 62 requêtes sans connexion sur 55 routes admin, client, salle de données et vérification d'identité : aucun succès. Pages `/admin` : redirection vers la connexion. Webhook Stripe : faux paiement refusé (400, signature). |
| S-05 | 10/11/2026 | Serveur local | Limite de requêtes sur 16 formulaires publics : 3 demandes acceptées puis refus 429 (experts/apply). Avant : aucune limite ni protection anti-robot. |
| S-06 | 10/11/2026 | Dépendances | Next.js 16.3.3 vulnérable (exécution de code à distance dans `next/og`, cache empoisonné) : mis à 16.4.3 ; sharp 0.35.5, puppeteer-core 25.16 ; compilation complète réussie (861 pages), tsc et eslint propres. Reste zod 3 (mémoire sur très grandes collections), correctif en version majeure. |
| S-07 | 10/11/2026 | Production (en-têtes) | CSP, HSTS (2 ans, preload), X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy présents ; la CSP autorise `unsafe-inline` et `unsafe-eval` (Next et balises de mesure). |
| S-08 | 10/11/2026 | Production actuelle (`aegryn.com`, ancien code), script `scripts/preview-security-check.mjs` | Avant déploiement : en-têtes, redirections `/admin`, routes admin et client refusées, faux paiement refusé (400), préinscription fermée (404) ; **1 écart attendu** : les formulaires publics ne sont pas encore limités (5 demandes acceptées). Le déploiement de test est protégé par Vercel : rejouer le script avec `VERCEL_BYPASS` ou protection levée temporairement ; le CI (tsc, lint) a échoué sur une variable inutilisée du script d'attaque, corrigé (`e94f9f1a`). |

## 2. Anomalies

| N° | Anomalie | Correctif | État |
|---|---|---|---|
| AE-01 | Dépôt et écrasement d'images ouverts à tous (stockage public des avatars) | Migration 125 : politiques supprimées (le dépôt passe par `app/api/experts/avatar`) | Corrigé, appliqué en production le 10/11/2026 |
| AE-02 | Droits d'écriture directs pour anonyme et connecté sur les tables | Migration 125 : retirés, ainsi que TRUNCATE ; droits par défaut des futures tables fermés | Corrigé, appliqué |
| AE-03 | 16 formulaires publics sans limite (courriels, comptes, listes) | Migration 126 (table et fonction `api_rate_limit`) et `lib/rateLimit.ts` : limite par IP hachée | Base appliquée ; **code à déployer** |
| AE-04 | Next.js vulnérable | Next.js 16.4.3 | Corrigé dans le code, **à déployer** |
| AE-05 | Préinscription : « ok » même si le courriel n'est pas parti | 502 `email_failed`, limite libérée, ligne conservée | Corrigé dans le code, **à déployer** |
| AE-06 | Fonction `rls_auto_enable` appelable par l'anonyme (fonction vide) | `REVOKE EXECUTE` (migration 125) | Corrigé |

## 3. Reste à faire (au 10/11/2026)

À ton action (propriétaire) :
1. Donner l'accès de contrôle au déploiement de test (protégé par Vercel) : jeton de contournement dans « Deployment Protection » du projet, puis `VERCEL_BYPASS=<jeton> node scripts/preview-security-check.mjs <URL>`, ou protection levée le temps du test.
2. Vérifier que la CI GitHub de la branche `preview` repasse (tsc, lint, compilation).
3. Valider la fusion de `preview` dans `main` (mise en production) après contrôle.
4. Pour ouvrir la préinscription des prestataires : `NEEDIU_PRO_PUBLIC=true`, clé de service de la base neediu, clé d'envoi d'e-mails, `IP_HASH_SALT`.

À tester ou décider :
5. Inscription complète du portail client avec la limite de requêtes (non testée).
6. Resserrer la politique de contenu (`unsafe-eval`) si possible.
7. Protection anti-robot (type Turnstile) sur les formulaires qui envoient des courriels.
8. Zod 3 : le correctif est en version majeure, à planifier.
9. Quota Supabase : le projet `aegryn-auction` pèse 19 Mo, sans enjeu ; son coût est celui d'un calcul Micro (6,05 $ par mois).
