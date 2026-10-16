import type { AdvisoryKey } from './types'

/**
 * Visuels des cartes « Six situations », par métier, dans l'ordre des situations.
 * Centralisés ici : une image ne dépend pas de la langue.
 * Zéro doublon sur tout le site : chaque image n'apparaît qu'une fois, dans une seule page
 * métier ; aucune image de hero (`/images/advisory/*.webp`), ni image utilisée ailleurs
 * (handshake, meeting-room : page Talent / blog — elles restent dans le dossier, hors usage).
 * Crédits et sources : public/images/advisory/CREDITS.md
 */
const S = '/images/advisory/situations'
export const SITUATION_IMAGES: Record<AdvisoryKey, string[]> = {
  strategy: [
    `${S}/dashboard-graph.jpg`,   // modèle qui s'érode
    `${S}/developer-desk.jpg`,     // l'IA change le métier
    `${S}/discussion-hands.jpg`,   // concurrent à vendre, alliance
    `${S}/office-corridor.jpg`,    // nouveau marché
    `${S}/planning-laptops.jpg`,   // plan à trois ans
    `${S}/plan-writing.jpg`,       // stratégie dans ma tête
  ],
  riskCompliance: [
    `${S}/laptop-hands.jpg`,        // questionnaire sécurité
    `${S}/risk-doc-review.jpg`,     // périmètre réglementaire
    `${S}/laptop-phone.jpg`,        // IA sans règle
    `${S}/network-cables.jpg`,      // incident
    `${S}/risk-audit-docs.jpg`,     // audit investisseur ou acquéreur
    `${S}/risk-port-aerial.jpg`,// vente UE / Suisse
  ],
  technology: [
    `${S}/server-room-walk.jpg`,   // plateforme qui ralentit
    `${S}/tech-solo-coder.jpg`,    // une seule personne comprend
    `${S}/loft-office.jpg`,        // construire, acheter, s'allier
    `${S}/tech-code-dark.jpg`,   // IA sans cadre
    `${S}/open-office.jpg`,        // plus de directeur technique
    `${S}/tech-server-rack.jpg`,   // où sont nos données
  ],
  talentOrganization: [
    `${S}/tal-overloaded-folders.jpg`,  // tout passe par moi
    `${S}/tal-colleagues-office.jpg`,   // équipe de direction pas encore une équipe
    `${S}/tal-serious-talk.jpg`,        // profil clé veut partir
    `${S}/tal-interview.jpg`,           // recruter un dirigeant
    `${S}/tal-family-meeting.jpg`,      // transmettre dans deux à cinq ans
    `${S}/tal-cultures-meeting.jpg`,    // deux cultures se rencontrent
  ],
  ma: [
    `${S}/ma-deal-handshake.jpg`,       // cible repérée
    `${S}/ma-contract-signing.jpg`,     // on nous approche
    `${S}/ma-growth-presentation.jpg`,  // programme de build-up
    `${S}/ma-board-presentation.jpg`,   // intégration qui patine
    `${S}/industrial-engineer.jpg`,     // cession d'activité, séparation
    `${S}/ma-tech-audit.jpg`,           // cible technologique
  ],
  financePerformance: [
    `${S}/fin-swiss-francs.jpg`,       // trésorerie qui se tend
    `${S}/fin-calculator-docs.jpg`,    // clients qui paient en retard
    `${S}/fin-signing-table.jpg`,      // banquier ou investisseur
    `${S}/fin-revenue-report.jpg`,     // rentabilité par activité
    `${S}/fin-budget-flatlay.jpg`,     // situation qui se dégrade
    `${S}/fin-archive-files.jpg`,      // qualité des résultats, data room
  ],
  operationsExcellence: [
    `${S}/ops-machine-operator.jpg`,        // coûts qui montent plus vite que les prix
    `${S}/ops-steel-measure.jpg`,        // délais et qualité variables
    `${S}/ops-warehouse-forklift.jpg`,   // fournisseur critique
    `${S}/ops-food-production.jpg`,      // capacités sous-utilisées ou saturées
    `${S}/ops-engineer-site.jpg`,        // réduire les coûts sans abîmer
    `${S}/ops-industrial-machine.jpg`,   // reprise d'une activité
  ],
  projectProgram: [
    `${S}/pm-task-board.jpg`,              // trop de projets en parallèle
    `${S}/pm-site-plans.jpg`,              // lancer un projet proprement
    `${S}/pm-sticky-discussion.jpg`,       // projet qui dérape
    `${S}/pm-transformation-workshop.jpg`, // transformation multi-équipes
    `${S}/pm-site-walkway.jpg`,            // fournisseur ou intégrateur défaillant
    `${S}/pm-launch-screen.jpg`,     // livré mais pas adopté
  ],
}
