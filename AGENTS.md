# Aegryn website — règles projet

## Style de rédaction (obligatoire, toutes langues)

- **Jamais de tiret cadratin « — » dans les textes visibles** (titres, descriptions, i18n, emails). Utiliser virgule, deux-points ou point. La règle s'applique à tout nouveau contenu, toutes locales.
- Pas de mention de rémunération, abonnement ou flux de dossiers promis pour rejoindre le réseau.
- Pas de vocabulaire de transaction financière sur les pages publiques : séquestre, escrow, notaire/notariat, assurance W&I, financement relais. Articles éditoriaux (`data/articles.ts`) et namespaces legacy `transact*`/`client` exemptés.

## i18n

- 6 locales obligatoires : `fr`, `en`, `de`, `es`, `it`, `nl` — tout nouveau texte va dans `i18n/messages/*.json` pour les 6.

## Vérification

- `npx tsc --noEmit` et `npx eslint` doivent passer avant commit.
- Dev local : `http://127.0.0.1:55570` (ex. `/fr/alliances`).

## Emails

- `AEGRYN_INTERNAL_EMAIL` override global ; `internalTo` par formulaire dans `EmailConfig` (`partnerships@boha-group.com` pour `/api/alliances/apply`) ; fallback `contact@boha-group.com`.

## Norme titres H1 (4 gabarits)

- **A — Landing éditorial** (navy, `py-32`) : `clamp(48px,6vw,86px)` — alliances, career, talent, services/build, about, blog
- **B — Page de rubrique** (navy, `pt-24/32 pb-20`) : `clamp(36px,5vw,72px)` — advisory, industries, portfolio, magazine, workforce, roadmap, valuation
- **C — Page standard** (blanc, `pt-24 pb-20`) : `clamp(32px,4.5vw,64px)` — experts, investisseurs, audit, annuaire, assets/[slug], grade/submit, contact
- **D — Compact référence** (navy, `pt-24 pb-14/16`) : `clamp(28px,3.5vw,52px)` — privacy, security, terms, faq, glossaire, verify
- Legacy `/transact/*` : hors norme

## Norme typographique (corps et sous-niveaux)

- **H2 section** : `clamp(26px,3vw,44px)` — tous les h2 de section hors cartes
- **Sous-titre hero / lead** (premier `<p>` après h1) : `text-[16px]` — hors pages documents signature (brochure CIFSO, teaser)
- **Corps de texte** : `text-[15px]` minimum — hors cartes, tableaux, formulaires, méta, captions, disclaimers (11–13px)
- **Sous-titres de bloc / cartes** (h2/h3 fixes ≤24px) : taille libre selon densité
- **Labels** : mono uppercase 9–11px (signature visuelle, jamais de corps)
- Signatures assumées : h1 home `clamp(90px,14vw,190px)`, cover magazine, brochure CIFSO `clamp(52px,8vw,88px)`

## Positionnement

- Aegryn = cabinet de conseil intégré (cabinet de conseil, pas marketplace). Le modèle en cinq temps (Cadrer · Réaliser · Accompagner · Sélectionner · S'informer) reste le récit de l'accueil et de La Boutique ; il n'est plus la structure du menu.
- Vocabulaire : **huit métiers** de conseil (EN « disciplines », DE « Fachgebiete », ES « oficios », IT « mestieri », NL « vakgebieden ») et **cinq façons d'agir** (EN « ways of working », DE « Arten zu handeln », ES « formas de actuar », IT « modi di agire », NL « manieren van handelen »). Ne jamais appeler les cinq « métiers » ni « disciplines ». Industries : 22 clusters (« 22+ »).
- Menu **Nos métiers** : **Cadrer et réaliser** (huit métiers, sur deux colonnes : Stratégie, Risques et Conformité, Finance et Performance, Technologie et Souveraineté, Opérations et Excellence opérationnelle, Talent et Organisation, Pilotage de projets et de programmes, M&A) · **Par situation** (cinq cycles de vie, `/accompagner/*`) · lien « Nos industries » en pied de panneau. Sélectionner n'a plus de colonne : c'est un bloc de la page Talent et Organisation (`#selectionner`, `components/advisory/SelectBlock.tsx`) et les pages `/talent/*`.
- `/advisory` est la page hub des huit métiers (`content/advisory/hub.ts`). Les noms, descriptions et dimensions des huit métiers viennent de `advisory.pillars.*` (même source que la section d'accueil).
- Accueil, section Cadrer et réaliser (`components/sections/MetiersScroller.tsx`, styles `.mw-*` dans `styles/globals.css`) : transcription de la section « Selected work » de scene-studio.webflow.io. Vidéo `sailboat-rope` qui s'ouvre en plein écran, puis grille des huit métiers (photo du hero de chaque page) en défilement horizontal épinglé avec traits verts en escalier. La vidéo n'est plus sur la page Technologie.
- Pages métier : `AdvisoryPillarPage` + `content/advisory/*.ts` (fr, en, de, es, it, nl pour les cinq historiques ; `finance.ts`, `operations.ts`, `program.ts` pour les trois autres). Pas de vignette par situation (cartes texte), pas de ligne « Sources » répétant les cartes, un seul bouton dans le bandeau final.
- `/transact/*` et le statut `escrow_paid` : archivés/désactivés (noindex, redirects, lecture seule) — ne pas réintroduire en UI active.

## Norme savoir-faire de bout en bout (fiches projets)

Chaque fiche projet liste les savoir-faire mobilisés, rattachés en interne à une
phase du cycle de vie (`SKILL_PHASES` + `skillPhases` dans `data/assets.ts` —
non affichés en UI). 6 phases, chacune mobilisant des métiers :

1. **Cadrer** (lancement) — Stratégie : concept, étude de marché, business plan · Conformité : faisabilité réglementaire, cadre juridique · Talent : gouvernance fondatrice
2. **Concevoir** (pré-construction) — Stratégie : marque, positionnement · Technologie : architecture cible, design d'expérience · Conformité : privacy/security by design
3. **Construire** (développement) — Technologie : développement, souveraineté, intégrations · Talent : équipe produit, recrutement clé · Conformité : documentation, contrats
4. **Lancer** (mise en marché) — Stratégie : go-to-market, marque · Conformité : conformité opérationnelle · Talent : organisation de support
5. **Grandir** (croissance, restructuration) — Stratégie : développement, diversification · Talent : organisation, dirigeants, rétention · Conformité : gouvernance, gestion des risques · Technologie : scalabilité
6. **Transmettre** (acquisition, cession) — M&A & PMI : valorisation, due diligence, intégration · Conformité : data room documentaire · Talent : succession, continuité

Risques & Conformité et Talent & Organisation sont des savoirs **transverses**
mobilisables à chaque phase, pas des étapes séquentielles.

## Heroes avec image en header — hauteur standard

Toutes les pages à hero photo pleine (`Image fill` sur fond navy) utilisent
le même plancher de hauteur pour garantir une harmonie visuelle :

- `style={{ minHeight: 'clamp(460px,50vw,620px)' }}` sur la section hero
- Templates concernés : `AdvisoryPillarPage`, `franchir/CyclePage`, `industries/[slug]`
- Le contenu long (h1 3 lignes, locales DE/NL) peut dépasser : le plancher
  assure l'uniformité sans tronquer.
- Exclus volontairement : heroes signature `/` (96vh) et `/about` (88vh) —
  format landing distinct.

Toute nouvelle page avec image en header doit réutiliser ce minHeight.

## La Boutique, NDA et archives (octobre 2026)

- Deux voix : le **cabinet de conseil intégré** (navigation Nos métiers) et **La Boutique** (`/boutique`, remplace « Portfolio » dans la barre). Les cinq façons d'agir (Cadrer, Réaliser, Accompagner, Sélectionner, S'informer) restent le récit du cabinet (voir Positionnement pour la structure réelle du menu) ; Cadrer → Réaliser → Accompagner est la méthode de La Boutique. Cibles : dirigeants de PME et d'ETI, sans plafond de chiffre d'affaires (cabinet) ; entrepreneurs, investisseurs et family offices, institutions et grands groupes, industriels et marques (Boutique). Ne pas réintroduire de plafond de CA dans les textes ni les propositions.
- `/boutique` : hero : une vidéo plein cadre alternée sur le tempo de la musique (`content/boutique/clips.ts` : 26 clips horizontaux, 105,76 BPM, une vidéo tous les 2 temps soit 1,13 s (`beatsPerClip`), boucle ; les 2 clips verticaux sont dans le corps de page, `PortraitScroll`). Le lecteur (`components/boutique/BoutiqueAudio.tsx`) vit dans `app/[locale]/boutique/layout.tsx` : démarre à l'entrée, s'arrête en quittant. Savoir-faire complets : `content/boutique/savoirFaire.ts` (6 phases, 5 thèmes, 5 cycles).
- Navigation bureau : barre épurée (libellés + icônes FAQ, langue, compte) ; au survol ou au clic d'un menu, un bandeau blanc sans bordure ni image s'ouvre sous la barre (même fond, colonnes de texte centrées, page floutée derrière). Contenu dans `components/layout/NavPanel.tsx`, liens dans `components/layout/navData.ts`. Le panneau latéral vert (`SideDrawerLauncher`) suit la même charte (blanc, sans bordure, fond flouté).
- Barre de navigation : transparente sur les heros vidéo (`/` et `/boutique`), fond blanc progressif au scroll, blanche partout ailleurs (`Nav.tsx`, `data-onhero`).
- NDA : mutuel, numérique, signé par lien personnel sans compte (`lib/nda/*`, `/nda/[token]`, `/admin/nda`). Envoi **manuel** depuis l'admin ; contresignature automatique (Yohann Bollack, CEO) ; PDF archivé (bucket `nda-signed`). Accès certification et data room = rôle ouvert par l'admin **et** NDA signé (`lib/nda/access.ts`, y compris les API data room). L'ancien NDA par compte est retiré.
- Catalogue, transactions, enchères, espace acheteur : archivés dans `_archive/legacy-transact/` (redirections 301 dans `next.config.ts`). Ne pas réintroduire.
- Archivés en octobre 2026 (redirections 301 dans `next.config.ts`, ne pas réintroduire) : `/services/acquisition-support` (→ `/advisory/ma`, dans `_archive/legacy-transact/`) ; abonnement « Fiche Expert », parrainage et fiche expert partenaire (`/client/partner/subscription`, `/client/partner/expert-profile`, APIs `partner/subscribe|portal|referral`, `admin/expert/subscription`, cron `expert-expiry`, admin Parrainages, dans `_archive/legacy-partner-subscription/`). Le réseau n'a ni abonnement ni parrainage ; seules les commissions d'apport d'affaires restent prévues.
- i18n : les textes inutilisés (anciens `transact*`, `nda` par compte, `partner`, `accessForm`, `waitlist`, etc.) ont été supprimés des 6 locales ; vérifier qu'un nouveau texte est bien référencé dans le code.
- Dev : ne pas lancer de requêtes en parallèle sur le serveur de développement (corruption du cache `.next`) ; Chromium de Puppeteer ne lit pas le H.264, tester la vidéo avec Google Chrome.

## Langue de navigation

- Tout lien interne passe par `Link` de `@/i18n/navigation` (ou un préfixe `/${locale}` explicite). Jamais de `<a href="/...">` ni de `next/link` avec un chemin sans préfixe de langue : l'utilisateur doit rester dans la langue choisie sur tout le site.
- `proxy.ts` : la langue de la page visitée met à jour le cookie `ag-locale-pref`, et un lien sans préfixe reprend la langue du Referer.

## Culture et valeurs

- `/culture` (fr `/culture-et-valeurs`) : page blanche sans hero navy, dans « Qui sommes-nous » après « À propos ». Elle complète `/about` (identité, signe) et `/career` (qui renvoie vers elle) : cabinet d'entrepreneurs, résultat plutôt que documents d'archive, qualité des relations, vision partagée, travail flexible. Pas de promesse d'avantages (rémunération, programmes internes) : les textes LinkedIn restent indicatifs.
- `/about`, section « Notre signe » : récit du logo original (`public/images/brand/logo.svg`), composant `AboutSign`, textes `about.sign` dans les six locales. Au défilement desktop : A noir, coupe diagonale, éclat vert `#5ADDA5`, puis texte intégral. Mobile : texte condensé et logo statique. Mouvement réduit : rendu statique. Les six cartes `about.values` sont réservées à La Boutique.

## Harmonisation du site public (18 octobre 2026)

- Portfolio : neediu et Movtoo en pilote, Primiom/Heritix/Chrosium en développement, Hobconnect/Insertdry au stade du concept. `ProjectStage` affiche les phases sur les cartes, le scroller et les fiches ; les fonctionnalités sont présentées selon la phase du projet.
- `/what-we-build` et ses chemins traduits redirigent vers `/boutique/projets`, hors sitemap. Le code historique est conservé. `/assets` présente les outils opérationnels.
- Les deux scrollers `.mw-*` utilisent des traits vert clair et du texte de survol `ag-apex-ink` sur blanc. Le bloc hybride redondant est retiré de l'accueil.
- Vidéos décoratives : pause hors écran et onglet masqué, poster en mouvement réduit. Hero Boutique : reprise sur l'horloge musicale, toujours deux temps par clip. L'accueil dispose d'une variante vidéo mobile.
- Magazine : édition web par défaut sur mobile, flipbook sur desktop. Le HTML de l'édition 01 est harmonisé à la lecture par `prepareMagazineHtml`, après le contrôle d'accès existant ; ancres et pagination conservées.
- Partage : `/api/og` produit des visuels avec logo original, nom, titre localisé et photographie ; les métadonnées des articles utilisent la même photographie que leur carte.
- Les articles historiques identifiés dans `HISTORICAL_ARTICLE_SLUGS` sont contextualisés ; ils ne décrivent pas une offre active de transactions ou d'accès prioritaire à des actifs.

## SEO, GEO et LLM

- Sitemap : `app/sitemap.ts` (routes statiques × 6 locales, `CONTENT_UPDATED` à mettre à jour après une refonte de contenu). Ne jamais y mettre une page `noindex` (magazine cover/flipbook, success, verify/[code]).
- `app/robots.ts` : zones privées (`/api`, `/admin`, `/client`, `/nda`, `/annuaire`) exclues, crawlers IA autorisés ; `next-sitemap.config.js` n'est plus utilisé.
- JSON-LD : Organization/WebSite/navigation dans `lib/seo.ts` (injectés par `app/[locale]/layout.tsx`) ; pages Boutique, Conseil et Culture ajoutent WebPage/Service via `generateWebPageSchema`/`generateServiceSchema`/`pageUrl`.
- LLM : `public/llms.txt` (index court), `llms-full.txt` (contexte complet), `llms-updated.txt` (changements récents). À réviser à chaque changement de positionnement, de métiers ou d'URL. Même règles de style (pas de tiret cadratin, pas de vocabulaire de transaction financière).
- Titre/description de l'accueil : clés `hero.metaTitle` et `hero.metaDescription` (6 locales).
