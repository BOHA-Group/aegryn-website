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

## Positionnement

- Aegryn = cabinet de conseil intégré (cabinet de conseil, pas marketplace). 5 disciplines : ACCOMPAGNER, CONSTRUIRE, FRANCHIR, RECRUTER, INFORMER. 5 métiers conseil : Stratégie & Innovation, Risques & Conformité, Technologie & Souveraineté, Talent & Organisation, M&A & PMI. Ne pas répéter l'énumération à chaque page, privilégier des formulations de fond.
- `/transact/*` et le statut `escrow_paid` : archivés/désactivés (noindex, redirects, lecture seule) — ne pas réintroduire en UI active.
