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

- Aegryn = cabinet de conseil intégré (cabinet de conseil, pas marketplace). 5 disciplines : ACCOMPAGNER, CONSTRUIRE, FRANCHIR, RECRUTER, INFORMER. 5 métiers conseil : Stratégie & Innovation, Risques & Conformité, Technologie & Souveraineté, Talent & Organisation, M&A & PMI. Ne pas répéter l'énumération à chaque page, privilégier des formulations de fond.
- `/transact/*` et le statut `escrow_paid` : archivés/désactivés (noindex, redirects, lecture seule) — ne pas réintroduire en UI active.

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
