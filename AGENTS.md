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
- **B — Page de rubrique** (navy, `pt-24/32 pb-20`) : `clamp(36px,5vw,72px)` — advisory, acquisition-support, industries, portfolio, magazine, workforce, roadmap, valuation
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
- Menu **Nos métiers** : **Cadrer et réaliser** (huit métiers, sur deux colonnes : Stratégie, Risques et Conformité, Finance et Performance, Technologie et Souveraineté, Opérations et Excellence opérationnelle, Talent et Organisation, Pilotage de projets et de programmes, M&A) · **Par situation** (cinq cycles de vie, `/accompagner/*`) · lien « Nos industries » en pied de panneau. Sélectionner n'a plus de colonne : c'est un bloc de la page Talent et Organisation (`#selectionner`, `components/advisory/SelectBlock.tsx`) et les pages `/talent/*`.
- `/advisory` est la page hub des huit métiers (`content/advisory/hub.ts`). Les noms, descriptions et dimensions des huit métiers viennent de `advisory.pillars.*` (même source que la section d'accueil).
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

- Deux voix : le **cabinet de conseil intégré** (navigation Nos métiers) et **La Boutique** (`/boutique`, remplace « Portfolio » dans la barre). Les cinq métiers (Cadrer, Réaliser, Accompagner, Sélectionner, S'informer) restent le récit du cabinet (voir Positionnement pour la structure réelle du menu) ; Cadrer → Réaliser → Accompagner est la méthode de La Boutique. Cibles : PME et ETI jusqu'à CHF 300M (cabinet) ; entrepreneurs, investisseurs et family offices, institutions et grands groupes, industriels et marques (Boutique).
- `/boutique` : hero : une vidéo plein cadre alternée sur le tempo de la musique (`content/boutique/clips.ts` : 20 clips horizontaux, 105,76 BPM, une vidéo tous les 2 temps soit 1,13 s (`beatsPerClip`), boucle ; les 2 clips verticaux sont dans le corps de page, `PortraitScroll`). Le lecteur (`components/boutique/BoutiqueAudio.tsx`) vit dans `app/[locale]/boutique/layout.tsx` : démarre à l'entrée, s'arrête en quittant. Savoir-faire complets : `content/boutique/savoirFaire.ts` (6 phases, 5 thèmes, 5 cycles).
- Navigation bureau : barre épurée (libellés + icônes FAQ, langue, compte) ; au survol ou au clic d'un menu, un bandeau blanc sans bordure ni image s'ouvre sous la barre (même fond, colonnes de texte centrées, page floutée derrière). Contenu dans `components/layout/NavPanel.tsx`, liens dans `components/layout/navData.ts`. Le panneau latéral vert (`SideDrawerLauncher`) suit la même charte (blanc, sans bordure, fond flouté).
- Barre de navigation : transparente sur les heros vidéo (`/` et `/boutique`), fond blanc progressif au scroll, blanche partout ailleurs (`Nav.tsx`, `data-onhero`).
- NDA : mutuel, numérique, signé par lien personnel sans compte (`lib/nda/*`, `/nda/[token]`, `/admin/nda`). Envoi **manuel** depuis l'admin ; contresignature automatique (Yohann Bollack, CEO) ; PDF archivé (bucket `nda-signed`). Accès certification et data room = rôle ouvert par l'admin **et** NDA signé (`lib/nda/access.ts`, y compris les API data room). L'ancien NDA par compte est retiré.
- Catalogue, transactions, enchères, espace acheteur : archivés dans `_archive/legacy-transact/` (redirections 301 dans `next.config.ts`). Ne pas réintroduire.
- Dev : ne pas lancer de requêtes en parallèle sur le serveur de développement (corruption du cache `.next`) ; Chromium de Puppeteer ne lit pas le H.264, tester la vidéo avec Google Chrome.

## Langue de navigation

- Tout lien interne passe par `Link` de `@/i18n/navigation` (ou un préfixe `/${locale}` explicite). Jamais de `<a href="/...">` ni de `next/link` avec un chemin sans préfixe de langue : l'utilisateur doit rester dans la langue choisie sur tout le site.
- `proxy.ts` : la langue de la page visitée met à jour le cookie `ag-locale-pref`, et un lien sans préfixe reprend la langue du Referer.
