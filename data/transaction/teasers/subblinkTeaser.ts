/**
 * subblinkTeaser.ts
 * Données du teaser confidentiel — Lot N° 001 subblink.
 * Consommé par <AssetTeaserDocument />.
 *
 * Personnalisation : pour un envoi nominatif, dupliquer ce fichier
 * (`subblinkTeaser.[nomProspect].ts`) et modifier uniquement `recipientName`.
 * Ne jamais modifier `pitch`, `tags` ou `stats` entre destinataires.
 *
 * Ne contient JAMAIS de données issues de : risks, provenance, assetState.
 * C'est la limite volontaire entre le teaser et le dossier complet (AssetLotSheet).
 */

import type { AssetTeaser } from '@/types/transaction'

export const subblinkTeaser: AssetTeaser = {
  lotNumber:     '001',
  name:          'subblink',
  tagline:       "Intelligence contractuelle par IA — l'algorithme qui n'a pas d'équivalent",
  catalogContext:'Aperçu privé · Catalogue Aegryn Auction · Phase 0',
  recipientName:  null,

  pitch:
    "subblink détient et opère le seul algorithme de notation contractuelle grand public du marché — le ContractScore™, un grading A à E directement inspiré du Nutri-Score, appliqué pour la première fois au droit. Aucun acteur européen ou nord-américain n'a publié de système comparable à ce jour. L'actif est en exploitation commerciale active depuis son lancement, autofinancé, et occupe un positionnement de marché que la cartographie concurrentielle confirme structurellement non disputé.",

  tags: [
    'Algorithme propriétaire unique',
    'Croissance initiale',
    'Autofinancé',
    'Marché non disputé',
    'Extension internationale prête',
  ],

  stats: [
    { value: 'B',  label: 'Grade préliminaire' },
    { value: '6',  label: 'Langues déployées' },
    { value: '3',  label: 'Juridictions calibrées' },
    { value: '87', label: 'Endpoints API' },
  ],

  investmentNote:
    "Plus de 1 500 heures de développement engagé à ce jour — algorithme propriétaire, infrastructure technique complète, conformité réglementaire (RGPD/nLPD), API Entreprise marque blanche — hors valorisation du potentiel de marché. Ce montant reflète le coût de reconstruction de l'actif, non sa valeur de cession.",
}
