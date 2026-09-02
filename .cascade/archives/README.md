# Archives — Aegryn Website

Dossier de sauvegarde des pages supprimées ou refondues.
Ne pas modifier ces fichiers — ils servent de référence pour une éventuelle restauration.

---

## 📁 `experts-network/` — Ancienne page Réseau d'Experts

**Archivé le :** 2026 (session refonte /network)
**Remplacé par :** `/app/[locale]/network/` (page fusionnée experts + partenaires)
**Commit de refonte :** voir git log sur `app/[locale]/network/`

### Contenu archivé
| Fichier | Description |
|---|---|
| `ExpertsContent.tsx` | Composant principal de la page `/experts` (annuaire, filtres, fiches) |
| `page.tsx` | Page Next.js `/app/[locale]/experts/page.tsx` |
| `AlliancesContent.tsx` | Composant de la page `/alliances` (partenaires) |

### Fonctionnalités archivées
- Annuaire public des experts avec filtres par domaine (stratégie / tech / M&A)
- Fiches experts individuelles avec photo, spécialités, langues, tarif
- Workflow de publication : soumission partenaire → validation admin → publication
- Abonnement expert (89 CHF/mois via Stripe)
- KYC partner requis avant publication

### Pourquoi désactivé
La page réseau d'experts a été refondue en `/network` qui fusionne experts et partenaires.
Le workflow de publication de fiches (validation + paiement) est suspendu le temps de la migration.
Les profils existants en base (`expert_profiles`) sont conservés intacts.

---

## 📁 `asset-catalogue/` — Archives ventes / catalogues publiés

**Statut :** à compléter si des pages de catalogues sont archivées.

> Ajouter ici les snapshots de pages de catalogue d'actifs au moment de leur dépublication.

---

## Convention de nommage
```
.cascade/archives/
  {feature-name}/
    {ComponentName}.tsx     ← composant React archivé
    page.tsx                ← page Next.js archivée
    README.md               ← notes spécifiques si nécessaire
```
