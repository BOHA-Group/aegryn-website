# Parking lot — chantiers en attente

Décisions produit / technique reportées, avec le contexte nécessaire pour reprendre sans réexploration.

---

## 1. Analyse automatique du contenu des pièces (OCR + IA) pour le scoring CIFSO

**Statut : en attente de décision (fournisseur IA, cadre contractuel).**

### Ce qui existe déjà
- Pré-scoring documentaire (`lib/prescore.ts`) : complétude, qualité de preuve suggérée et état
  par dimension à partir de la **présence et de la vérification** des pièces (`admin_quality`),
  recalculé à chaque dépôt et décision admin. Ne lit pas le contenu des fichiers.
- Moteur de grade (`lib/gradeEngine.ts`) : `GradeInput` typé par dimension (C, I, F, S, O),
  alimenté manuellement dans `app/admin/assets/[id]/grade-engine/GradeEngineForm.tsx`.
- Catalogue `documents_catalog` : chaque code (F-01, O-02…) porte une `note_admin` indiquant
  le critère du moteur qu'il documente.

### Cible
1. **Extraction** côté serveur, depuis le bucket privé `data-room` (URL signée interne) :
   PDF texte (`pdf-parse`), tableurs (`xlsx`), OCR pour les scans (Tesseract ou service managé).
   Jamais d'exposition du fichier au client ni à un tiers non contractualisé.
2. **Structuration par IA** : un prompt par code catalogue produisant un JSON strict mappé sur
   `GradeInput` (ex. F-01 → `arr`, `nrr`, `monthlyChurn` ; O-01 → `keyPersonCount` ;
   S-03 → `lastPentestMonthsAgo`, `pentestMethodology`), avec pour chaque valeur :
   `confidence` (0–1), `evidence` (extrait textuel + page), `source_document_id`.
3. **Contrôles croisés** : cohérence inter-pièces (ARR déclaré vs export Stripe vs comptes),
   dates de validité (pentest < 18 mois, Kbis < 3 mois), écarts signalés à l'analyste.
4. **Pré-remplissage du moteur** : valeurs extraites injectées dans le formulaire admin et dans
   l'espace de l'expert mandaté (sa dimension uniquement), marquées « extraites automatiquement »,
   à confirmer ou corriger. Le calcul reste celui du moteur ; la publication reste humaine.
5. **Traçabilité** : table `document_extractions` (asset_id, document_id, code, json, model,
   prompt_version, created_at) pour l'audit et la contestation (15 jours).

### Prérequis / décisions
- Fournisseur IA et clé API (aucune clé présente dans `.env.local` au 2026-09-13).
  Critères : hébergement UE/CH, zéro rétention des données, DPA signé.
- Mention dans CGV / NDA du traitement automatisé par un sous-traitant.
- Coût par dossier estimé (≈ 30–60 pages × 5 dimensions) et quota par pack.
- Politique de fallback si extraction impossible (scan illisible) : saisie manuelle.

### Points d'entrée code
- `lib/prescore.ts`, `lib/prescoreServer.ts` (à étendre avec `contentScore`).
- `app/api/admin/assets/[id]/prescore/route.ts` (déclenchement).
- `app/admin/assets/[id]/grade-engine/PrescorePanel.tsx` (affichage).
- `app/api/data-room/signed-url/route.ts` (accès fichier côté serveur).

---

## 2. Supabase Auth — SMTP personnalisé

**Statut : action manuelle dashboard requise.**

Les invitations d'experts (`/api/admin/assets/[id]/assign-expert`) passent par
`auth.admin.inviteUserByEmail`, donc par le SMTP de Supabase Auth (limite ≈ 3–4 emails/heure
par défaut → `email rate limit exceeded`). Resend est déjà opérationnel pour les emails applicatifs.

À faire : Dashboard Supabase → Authentication → SMTP Settings →
host `smtp.resend.com`, port 465, user `resend`, password = clé API Resend,
sender = `contact@boha-group.com` (puis `aegryn.com` une fois le domaine vérifié).

---

## 3. Domaine d'envoi `aegryn.com`

`RESEND_FROM` = `contact@boha-group.com`. Basculer sur `aegryn.com` après vérification DNS
(SPF, DKIM) dans Resend. Emails concernés : confirmation de demande, publication du grade,
mandats experts, notifications pièces.

## Abonnement CIFSO Valuation Index (paiement à brancher)

- Modèle retenu : freemium. Accès libre = estimation illustrative (fourchette large, benchmarks partiels) ; abonnement mensuel = séries complètes (essai 3 jours, annulation gratuite avant activation). Bannière « Bientôt disponible » et liste d'attente (`cifso_index_waitlist`) en place sur `/valuation`.
- Moteur de benchmarks : table `cifso_index_benchmarks` (migration 108, appliquée), taxonomie `lib/indexTaxonomy.ts` (5 clusters, 40 verticaux, 9 métriques), instantané `lib/cifsoIndex.ts` (`getIndexSnapshot({ full })`), API `/api/valuation/index` en mode aperçu. Les colonnes `source_internal` / `internal_notes` ne sortent jamais ; source affichée : « Aegryn CIFSO Valuation Index ».
- À faire au lancement : Stripe Checkout mode subscription (`trial_period_days: 3`), statut d'abonnement sur `profiles` (ou table dédiée), passer `full: true` dans `/api/valuation/index` et lever les `LockedOverlay` de `CifsoValuationIndex.tsx` / `ValuationCalculator.tsx` selon ce statut. Webhook Stripe existant : `/api/webhooks/stripe`.
- Alimentation des séries : automatique, chaque lundi 06:00 (Europe/Zurich) via `/api/cron/index-refresh` → `lib/cifsoIndexRefresh.ts`. Connecteurs de flux officiels ouverts dans `lib/indexConnectors.ts` (BCE SDMX : taux 10 ans, taux de dépôt, Euro Stoxx ; Eurostat : PIB, HICP ; BNS : taux directeurs). Statut par source dans `cifso_index_sources`, journal dans `cifso_index_refresh_log`, page admin `/admin/index` (Pilotage › Valuation Index) avec rafraîchissement à la demande.
- Sources publiques en place (13) : BNS (taux directeurs, Confédération 10 ans, EUR/CHF, SPI), BCE (10 ans, dépôt, Euro Stoxx, crédit entreprises, change), Eurostat (PIB annuel et trimestriel, HICP, adoption IA et sécurité TIC par pays, défaillances et créations par secteur, marges et productivité SBS par secteur), SEC EDGAR (comparables cotés : prix / revenu et croissance par cluster, panier de 110 sociétés dans `SEC_BASKET`), séries curées et dossiers certifiés.
- Limite connue : aucun flux officiel ouvert ne publie de multiples de transactions privées ; ces séries restent issues des données curées Aegryn et des dossiers certifiés. Pour brancher un fournisseur sous licence (FactSet, PitchBook, Dealroom), ajouter un connecteur dans `CONNECTORS` avec sa clé en variable d'environnement.
- Indicateur « conditions de marché » (0 à 100) dérivé des flux macro : lecture pour l'analyste, n'ajuste pas les multiples automatiquement (décision à prendre avant toute application au moteur de valorisation).
- **À construire — email de lancement à la liste d'attente.** Aujourd'hui, `/api/valuation/waitlist` inscrit l'email dans `cifso_index_waitlist` et envoie une confirmation d'inscription (`emailCifsoWaitlistConfirmation`, `lib/sendEmail.ts`) ; l'admin voit la liste dans `/admin/leads?source=cifso_waitlist` (`AdminLeadsClient.tsx`, table `CifsoWaitlistTable`) mais il n'existe aucun envoi groupé. À faire : bouton « Envoyer l'annonce de lancement » sur cette page admin, appelant une nouvelle route (ex. `/api/admin/valuation/waitlist/notify`) qui parcourt `cifso_index_waitlist` par lot et envoie un nouveau template email (`emailCifsoIndexLaunch`) avec lien direct vers l'abonnement ; marquer les lignes notifiées (`notified_at`) pour éviter les doublons si le bouton est utilisé plusieurs fois.
- **À construire — alimentation de l'Index par les données saisies par les abonnés.** Vérifié dans `lib/cifsoIndex.ts` (`getIndexSnapshot`) : l'Index n'agrège aujourd'hui que `cifso_index_benchmarks` (sources officielles + séries curées) et `grade_assessments` où `status = 'published'` (dossiers certifiés). Rien n'alimente l'Index à partir des données qu'un client abonné saisirait lui-même dans l'Index (une fois l'abonnement actif) ni des soumissions du calculateur illustratif (`valuation_leads`, `app/api/valuation/submit/route.ts`) — ces dernières restent des leads commerciaux, jamais anonymisées ni agrégées. À faire au lancement de l'abonnement : (1) définir l'écran de saisie abonné (probablement une extension de `ValuationCalculator.tsx` ou un nouveau formulaire dans `/valuation`, réservé aux comptes avec abonnement actif) ; (2) à la soumission, écrire une ligne anonymisée (secteur/cluster, vertical, métriques déclarées, score CIFSO si fourni — jamais le nom de l'entreprise ni l'email) dans une nouvelle table interne, ex. `cifso_index_contributed_data`, distincte de `valuation_leads` (qui garde l'email pour le suivi commercial) ; (3) inclure ces séries contribuées dans `getIndexSnapshot` au même titre que les dossiers certifiés, avec une taille d'échantillon minimale avant affichage (cohérent avec la logique déjà en place « dès 10 dossiers » pour les dimensions C/I/F/S/O) ; (4) effet recherché : plus un secteur a de contributeurs abonnés, plus ses benchmarks sont précis — boucle de valeur incitant à contribuer pour affiner ses propres comparables (le mécanisme de viralité). Point d'attention RGPD/LPD : anonymisation à la source (pas de nom client, pas de pseudonymisation réversible), et mention claire dans les CGU d'abonnement que les données saisies contribuent de façon anonyme à l'Index.
- **Point d'attention confirmé — le connecteur SEC EDGAR (`sec_public_comps`, `lib/indexConnectors.ts`) n'est pas Suisse/Europe.** Le panier `SEC_BASKET` (~110 tickers) est très majoritairement composé de sociétés cotées et domiciliées aux États-Unis (Salesforce, Adobe, PayPal, ServiceNow, etc.) ; `region: 'INTL'` le reflète déjà correctement dans le code. Ces séries (`public_comps_p_revenue`, `public_comps_revenue_growth`) sont collectées et stockées mais **ne sont affichées nulle part** sur le site public aujourd'hui (aucune requête dessus dans `lib/cifsoIndex.ts`) — donc pas de correction visible à faire dans l'immédiat, mais à ne jamais mélanger avec les séries Suisse/Europe si un jour surfacées (onglet « Comparables internationaux » distinct).
  Piste d'alternative européenne identifiée (recherche faite, non implémentée) : **filings.xbrl.org** (maintenu par XBRL International, adossé aux standards ESMA), API publique JSON:API sans clé (`https://filings.xbrl.org/api/filings`, `/api/entities`), qui indexe les dépôts **ESEF** (European Single Electronic Format, format XBRL obligatoire pour les émetteurs cotés sur marchés réglementés UE) de plusieurs pays UE + UK + Ukraine, depuis l'exercice 2020. Existe aussi une lib Python tierce (`xbrl-filings-api`, PyPI) qui simplifie l'accès. Limite à vérifier avant intégration : couverture pays incomplète (dépend des dépôts nationaux disponibles sur la plateforme), pas de couverture confirmée pour la Suisse (SIX n'est pas soumis à ESEF, qui est un mandat UE) — pour la Suisse spécifiquement, il faudrait une source séparée (ex. SIX Exchange Regulation, données financières des sociétés cotées suisses). Construire un connecteur équivalent à `secPublicComps()` sur cette base est un chantier à part entière (mapping taxonomie ESEF → nos métriques, gestion multi-pays/multi-devises, filtrage aux émetteurs pertinents par cluster) ; pas fait dans cette session.
- **Autres pistes de sources EU mid-market transmises par l'utilisateur (non vérifiées indépendamment, à valider avant toute intégration ou mention publique) :** Argos Index (Argos Wityu + Epsilon Research, `argos.fund` — indice trimestriel EV/EBITDA du mid-market européen non cotées), Dealsuite European M&A Monitor (`dealsuite.com/blog` — multiples mid-market EU par pays/secteur, semestriel), Aventis Advisors (`aventis-advisors.com` — multiples SaaS privés/publics), Software Equity Group Quarterly SaaS Report, BVP Cloud Index (`cloudindex.bvp.com` — multiples SaaS cotés, CSV téléchargeable, seule source de cette liste avec un format d'export directement automatisable), Discoperi (`discoperi.com` — transactions M&A avec licence CC BY 4.0 revendiquée, CSV/JSON), mynth Capital, France Invest, SECA (Suisse), Invest Europe, Eurostat/data.europa.eu (déjà partiellement utilisés). **Avant toute intégration :** vérifier soi-même les conditions d'usage et de republication de chaque source (licence, attribution requise, fraîcheur réelle des données, couverture Suisse effective), et ne jamais afficher un chiffre ou un nom de source ("Powered by X") sur le site public sans connecteur réellement implémenté et vérifié — cf. l'erreur évitée sur SEC EDGAR ci-dessus. Les chiffres précis (multiples médians, nombre de transactions, dates) transmis avec cette liste n'ont pas été revérifiés par recherche web indépendante et ne doivent pas être répétés comme des faits établis.
- **Tentative de câblage automatique des sources EU mid-market — abandonnée après vérification technique.** Demande initiale : câbler toutes les sources ci-dessus avec refresh automatique, sans jamais citer de nom ni de logo publiquement (seule source affichée : « Aegryn CIFSO Valuation Index » + date de rafraîchissement — cohérent avec la politique déjà en place de ne jamais exposer `source_internal`). Vérification faite avant tout code : Argos Index et Dealsuite sont des rapports PDF trimestriels/semestriels (pas d'API, détail chiffré d'Argos réservé aux abonnés Epsilon Eurozone Data) ; BVP Cloud Index est en réalité le « BVP Nasdaq Emerging Cloud Index », un indice Nasdaq officiel distribué via une infrastructure propriétaire (FTP/GIFFD/GIDS), pas un CSV public ; Aventis, SEG, mynth, France Invest, SECA, Invest Europe n'ont pas d'API. Seule Discoperi avait un format technique favorable (CSV/JSON, licence CC BY 4.0, sans inscription) — mais (1) son endpoint `/api/datasets/` est explicitement bloqué au crawl dans son `robots.txt`, le lien de téléchargement direct n'a pas pu être identifié (déclenché en JavaScript côté client, pas une URL fixe), et (2) surtout, un exemple de fiche deal inspecté (« Clearlake Acquires Databricks Assets for $5B ») s'est révélé être un tour de financement (`deal_type: "investment"`) mal étiqueté comme acquisition dans le titre et l'URL, avec 12 investisseurs mélangés dans un seul champ « acquéreur » — signe d'une donnée insuffisamment fiable pour alimenter un index destiné à être opposable face à des banques et fonds. **Décision : ne rien câbler automatiquement pour l'instant.** Deux pistes retenues à la place :
  1. **Checklist trimestrielle manuelle.** Un analyste Aegryn consulte les rapports PDF publics (Argos Index, Dealsuite European M&A Monitor) chaque trimestre et ajuste `cifso_market_multiples` en conséquence si les tendances observées le justifient. Pas d'automatisation, mais une donnée réellement relue et validée avant d'impacter le moteur de valorisation — cohérent avec le fonctionnement actuel de `cifso_market_multiples` (saisie analyste). À faire : formaliser cette checklist (calendrier, sources à consulter, seuils de mise à jour) dans une procédure interne dédiée, et l'associer à un rappel admin (ex. tâche périodique visible dans `/admin/index`).
  2. **Fournisseur sous licence payante.** Pour une donnée à la fois automatisable et défendable, évaluer un abonnement à un fournisseur reconnu — Epsilon Research EMAT (10 000+ transactions EU analysées), PitchBook, ou FactSet (déjà cité comme piste dans ce document pour les multiples de transactions privées). Coût réel (typiquement 5 à 20 K€/an selon le niveau d'accès), mais données vérifiées par un tiers professionnel, citables sans risque de qualité ni de marque si un accord de licence couvre la republication. Décision de budget à prendre séparément, hors périmètre code.
