/**
 * subblinkLot.ts
 * Lot N° 001 — subblink.
 * Fixture de référence conforme à <AssetLotSheet />.
 *
 * En production, produit par mapRowToAsset() depuis auction_assets (table Supabase).
 *
 * ⚠️  grade.letter = "B+" est un grade préliminaire à confirmer par audit Aegryn.
 *     B+ n'est pas dans le barème officiel (★, AAA, AA, A, B) — couleur fallback
 *     (#9C7A3C) jusqu'à confirmation ou reclassement en "B" par le jury d'audit.
 */

import type { AssetLot } from '@/types/transaction'

export const subblinkLot: AssetLot = {
  lotNumber: "001",
  name: "subblink",
  tagline: "Intelligence contractuelle par IA — Plateforme SaaS B2B/B2C certifiée ContractScore™",
  catalogContext: "Session de Cession Privée · Genève · Catalogue Phase 0",

  heroStats: [
    { value: "CROISSANCE INITIALE", label: "Stade de maturité" },
    { value: "26 665", label: "Lignes de code (core)" },
    { value: "87", label: "Endpoints serverless" },
    { value: "6", label: "Langues déployées" },
  ],

  grade: {
    letter: "B",
    label:
      "Actif technologique mature, traction commerciale démontrée, marché non disputé. Grade préliminaire fondateur — à confirmer par audit Aegryn Transaction indépendant (KRYV Protocol + due diligence tierce) avant inscription définitive au catalogue.",
  },

  executiveSummary: {
    intro:
      "subblink est une plateforme propriétaire d'intelligence contractuelle par IA, opérant un algorithme de notation exclusif — le ContractScore™ — sans équivalent identifié sur le marché européen ou nord-américain. L'actif est en exploitation commerciale active, autofinancé depuis l'origine, et occupe un positionnement de marché structurellement non disputé : l'analyse du contrat du point de vue de celui qui le reçoit, et non de celui qui l'émet.",
    items: [
      { label: "Rareté", value: "Algorithme de grading propriétaire A–E (Nutri-Score appliqué au droit) — premier et seul du marché" },
      { label: "Marché adressé", value: "Particuliers, indépendants, PME, professionnels du droit — France, Suisse, Belgique, zone francophone UE" },
      { label: "Stade", value: "Croissance initiale — produit en production, premier partenariat signé, monétisation active" },
      { label: "Différenciation", value: "Positionnement récepteur unique, paiement à l'acte, suppression des données par conception" },
      { label: "Croissance", value: "6 langues déjà déployées — extension UE et internationale activable sans refonte produit" },
      { label: "Infrastructure", value: "87 endpoints API, marque blanche entreprise livrée, charges fixes ≈ 28,56 $/mois hors IA" },
      { label: "Grade préliminaire", value: "B+ — à confirmer par audit indépendant avant inscription définitive au catalogue" },
    ],
  },

  presentationNotice: {
    body: [
      "subblink est une plateforme d'intelligence contractuelle par intelligence artificielle, conçue et développée intégralement en interne par Aegryn Sàrl (Suisse). Le produit délivre en moins de soixante secondes une notation de risque contractuel — le ContractScore™, gradué de A à E selon un principe d'évaluation inspiré du Nutri-Score — accompagnée d'une analyse clause par clause, d'un verdict actionnable et d'une contre-proposition rédigée par l'IA.",
      "L'actif se distingue par un positionnement de marché qu'aucun concurrent identifié — européen ou américain — n'occupe à ce jour : l'analyse contractuelle du point de vue du récepteur du contrat, et non de son émetteur. Cette inversion de perspective, validée sur huit catégories contractuelles distinctes et calibrée pour les droits français, suisse et de l'Union européenne, constitue la thèse de différenciation centrale de l'actif.",
    ],
    meta: "Catégorie d'actif : SaaS vertical · Secteur : Legal-tech / Intelligence documentaire · Juridiction d'opération : France, Suisse, Belgique, zone francophone UE · Entité détentrice : Aegryn Sàrl (Suisse)",
  },

  provenance: {
    body: [
      "L'actif a été conçu, développé et exploité sans interruption par son fondateur depuis l'origine du projet. Il n'existe aucune dilution de la propriété intellectuelle, aucune dette technique héritée d'une équipe externe, et aucun litige de paternité du code. L'intégralité de la base de code, des prompts propriétaires d'analyse, de la méthodologie de scoring et des données de benchmark anonymisées appartient en pleine propriété à l'entité détentrice.",
      "La marque subblink fait l'objet d'un dépôt en cours auprès de l'INPI et de l'EUIPO en classes 42 et 45, ainsi qu'auprès de l'IGE pour la Suisse. La dénomination ContractScore™, jugée descriptive, n'est volontairement pas déposée à titre de marque mais protégée par documentation méthodologique versionnée constituant une antériorité opposable.",
    ],
  },

  rarity: {
    body: [
      "La valeur fondamentale de l'actif ne réside pas dans son interface ni dans son catalogue de fonctionnalités, mais dans son algorithme de notation propriétaire. Le ContractScore™ applique au document contractuel un principe d'évaluation directement inspiré du Nutri-Score — une lettre unique, A à E, immédiatement lisible par un non-juriste, fondée sur une pondération multicritère calibrée par type de contrat et par rôle de l'utilisateur.",
      "Cette rareté repose sur trois couches cumulatives, chacune difficile à répliquer indépendamment des deux autres : une matrice de pondération propriétaire couvrant huit catégories de contrats et deux rôles utilisateur, calibrée sur trois corpus juridiques distincts (droit civil français, code des obligations suisse, directives de l'Union européenne) ; un moteur de benchmark sectoriel alimenté par les analyses anonymisées des utilisateurs eux-mêmes, créant un effet de profondeur de données qui s'auto-renforce avec l'usage ; et une couche de prompts d'analyse affinés itérativement, non documentés publiquement, qui constituent le savoir-faire opérationnel du produit.",
      "C'est la combinaison de ces trois couches — et non l'une d'entre elles prise isolément — qui constitue la barrière à l'entrée réelle de l'actif. Un concurrent pourrait répliquer l'interface en quelques semaines ; il ne pourrait pas répliquer la profondeur de calibration juridique multi-juridictionnelle ni le volume de données de benchmark sans plusieurs années d'opération équivalente.",
    ],
    highlight:
      "À la date de la présente notice, aucun acteur du marché européen ou nord-américain n'a publié ni breveté un système de notation contractuelle grand public comparable. L'actif détient, de fait, une position de premier entrant absolu sur ce mécanisme de scoring.",
  },

  assetState: {
    body: [
      "L'actif repose sur une architecture monolithique mature et un stack technique entièrement géré : React 18.3.1 et Vite côté frontend, Supabase pour l'authentification et la persistance, Stripe pour la facturation, Vercel pour le déploiement serverless, Upstash Redis pour le cache et le benchmark communautaire, Resend pour la communication transactionnelle, et l'API Anthropic Claude comme moteur d'intelligence artificielle propriétaire.",
    ],
    specs: [
      ["Base de code principale", "26 665 lignes (src/App.jsx) — architecture monolithique stabilisée"],
      ["Feuille de styles", "3 841 lignes — design system à jeton CSS unique"],
      ["Écrans applicatifs", "34 écrans fonctionnels en production"],
      ["Endpoints serverless", "87 routes API déployées sur Vercel"],
      ["Couverture linguistique", "Français, anglais, allemand, espagnol, italien, néerlandais"],
      ["Infrastructure de paiement", "12 Price IDs Stripe — architecture EUR/CHF à parité nominale"],
      ["Conformité données", "RGPD + nLPD suisse — hébergement UE — suppression des données post-analyse par conception"],
      ["Charges fixes d'infrastructure", "≈ 28,56 $/mois hors consommation IA"],
    ],
    note: "L'intégralité du développement a été réalisée sans levée de fonds externe, en autofinancement intégral par le fondateur.",
  },

  capabilities: {
    intro:
      "Le produit est en exploitation commerciale active, non en phase de prototype. Les fonctionnalités suivantes sont opérationnelles et vérifiables en environnement de production :",
    items: [
      {
        label: "Moteur ContractScore™",
        text: "Algorithme de scoring asymétrique couvrant huit catégories de contrats et deux rôles utilisateur (récepteur et émetteur), avec pondération différenciée par profil — particulier, freelance, entreprise.",
      },
      {
        label: "Benchmark sectoriel",
        text: "Benchmark communautaire anonymisé alimenté en temps réel via Redis, avec ancrage statistique par quartile et garde-fou de volume minimal avant restitution d'un score comparatif.",
      },
      {
        label: "Module de négociation",
        text: "Génération automatique de contre-propositions et d'emails de négociation prêts à l'envoi, dans la langue de l'utilisateur.",
      },
      {
        label: "Portefeuille contractuel et alertes échéances",
        text: "Tableau de bord centralisant l'ensemble des contrats analysés par l'utilisateur, avec système d'alertes automatiques aux échéances clés — préavis à 90, 60 et 30 jours avant renouvellement ou expiration, déclenché par tâche planifiée et notifié par email et in-app.",
      },
      {
        label: "API Entreprise marque blanche",
        text: "API Entreprise Phase 1 livrée et testée — authentification HMAC-SHA256, stockage de secrets chiffré AES-256-GCM, système de crédits prépayés à décrément atomique, trente-et-un tests automatisés validés. Permet l'intégration du ContractScore™ en marque blanche dans l'environnement applicatif d'un partenaire tiers, sans exposition de la méthodologie propriétaire ni du code source.",
      },
      {
        label: "Infrastructure commerciale",
        text: "Système de notifications temps réel, tableau de bord de gestion des commissions commerciales, architecture de parrainage à deux niveaux (partenaire commercial et parrainage entre pairs).",
      },
      {
        label: "Monétisation",
        text: "Quatre paliers tarifaires opérationnels — du paiement à l'acte à l'abonnement multi-utilisateurs — avec une architecture de facturation Stripe entièrement automatisée.",
      },
    ],
    pending:
      "Sont en cours de développement et non encore livrés à la date de la présente notice : la Phase 2 de l'API Entreprise (endpoint de soumission asynchrone et webhook sortant), le réseau de validation par experts juristes à la demande, et la migration du site vitrine vers une infrastructure Astro/Cloudflare en remplacement de Webflow.",
  },

  targetSegments: {
    intro:
      "L'architecture du produit a été conçue dès l'origine pour servir quatre segments de clientèle distincts, chacun disposant d'un parcours, d'une grille tarifaire et d'une calibration de scoring adaptés à son profil de risque contractuel.",
    items: [
      { title: "Particuliers", desc: "Bail d'habitation, prêt immobilier ou personnel, assurance, contrat de prestation — analyse ponctuelle à l'acte, sans engagement." },
      { title: "Indépendants & freelances", desc: "Contrats de mission, NDA, CGV, SaaS — abonnement à volume d'analyses, profil de risque calibré côté récepteur de mission." },
      { title: "PME & entreprises", desc: "Baux commerciaux, partenariats, sous-traitance, pactes d'actionnaires — plan multi-utilisateurs, benchmark sectoriel, portefeuille d'alertes." },
      { title: "Professionnels du droit", desc: "Avocats, notaires, juristes — réseau d'experts à la demande, intégration API marque blanche pour leurs propres plateformes clients." },
    ],
    note: "Chaque segment dispose d'un prompt d'analyse et d'une pondération de risque distincts au sein du même moteur ContractScore™ — pas de duplication d'infrastructure entre segments.",
  },

  growth: {
    body: [
      "L'actif est aujourd'hui calibré et déployé sur trois juridictions francophones (France, Suisse, Belgique), mais son architecture technique est nativement conçue pour l'extension géographique sans refonte structurelle. Le cadre multilingue est déjà opérationnel sur six langues — français, anglais, allemand, espagnol, italien, néerlandais — couvrant une part significative du marché de l'Union européenne sans développement supplémentaire côté interface.",
      "L'extension à de nouvelles juridictions suit un protocole déjà éprouvé en interne sur les marchés belge et néerlandophone : ajout du cadre légal local au corpus de calibration, ajustement des modificateurs de risque par juridiction, et activation des signaux de détection de pays dans le moteur d'analyse. Ce protocole a été documenté et appliqué de façon répétable, ce qui réduit significativement le risque d'exécution d'une extension géographique future.",
    ],
    items: [
      {
        label: "Allemagne, Autriche, Pays-Bas, Espagne, Italie",
        text: "Marché immédiatement adressable sans développement majeur — cadre légal à documenter, infrastructure et langue déjà disponibles.",
      },
      {
        label: "Europe élargie — sprint d'extension planifié",
        text: "Protocole d'extension déjà conçu et partiellement engagé pour la Pologne, le Portugal, la Suède et le Danemark — corpus légal et signaux de détection à finaliser.",
      },
      {
        label: "Extension par API plutôt que par filiale",
        text: "Le modèle d'API Entreprise marque blanche constitue un vecteur d'extension internationale à coût marginal quasi nul : un partenaire local intègre le ContractScore™ dans sa propre offre sans que Aegryn n'ait à construire de présence commerciale directe sur le marché concerné.",
      },
    ],
    closing:
      "Le marché nord-américain a fait l'objet d'un premier test exploratoire mais n'est pas considéré comme une priorité d'extension à ce stade, le droit civil continental constituant le socle de calibration actuel de l'algorithme — une extension vers le common law nécessiterait une recalibration substantielle de la méthodologie de scoring.",
  },

  competitivePosition: {
    body: [
      "Une cartographie de douze acteurs européens et américains du secteur — Tomorro, Contractify, Oneflow, Limova, LegalOn, Spellbook, Robin AI, Juro, DiliTrust, Ironclad — établit un constat homogène : l'intégralité de ces solutions sert l'émetteur du contrat, s'arrête à la restitution d'un rapport sans accompagnement vers l'action, n'offre aucune option de paiement à l'acte, ne pratique pas la suppression systématique des données après analyse, et n'adresse pas nativement le marché suisse en francs.",
    ],
    highlight:
      "Aucun acteur cartographié ne combine positionnement récepteur, paiement à l'acte, suppression de données par conception et couverture native CH/FR/BE.",
    closing:
      "Ce terrain vacant constitue la thèse d'acquisition centrale de l'actif : non pas la conquête d'une part de marché disputée, mais l'occupation d'un segment structurellement délaissé par l'ensemble des acteurs établis.",
  },

  traction: {
    body: [
      "L'actif a établi son premier partenariat institutionnel majeur avec le réseau Village de la Justice / Legi Team — première audience juridique francophone, 1,2 à 1,4 million de visites mensuelles — formalisé par un code partenaire actif et un article de présentation publié. Le modèle de commission associé (10 % pendant 18 mois, puis 5 % à vie) est documenté et opérationnel.",
      "Des discussions techniques avancées sont engagées avec CyberCape pour une intégration API du ContractScore™ dans une solution d'analyse cybersécurité, et avec Néo-Justice pour une intégration de parcours croisé pré-signature / post-litige. Une candidature au programme Anthropic pour startups a été déposée sur la base de la traction et des partenariats existants, sans recours à un financement par capital-risque.",
      "L'ensemble du développement commercial — prospection institutionnelle (Barreau de Paris, CNB, CCI), prospection de plateformes freelances (Malt, Comet, Shine), et constitution d'un réseau d'influence sectoriel — a été mené en interne par une équipe réduite incluant deux stagiaires en prospection B2B et développement de contenu.",
    ],
  },

  maturity: {
    specs: [
      ["Stade", "Croissance initiale — produit en production, traction qualifiée, monétisation activée"],
      ["Revenus", "Modèle SaaS récurrent multi-palier en exploitation, premier partenariat de distribution signé"],
      ["Clientèle", "Particuliers, freelances, PME, professionnels du droit — France, Suisse, Belgique"],
      ["Acquisition", "Partenariats institutionnels et de plateforme — sans dépense média payante structurelle à ce stade"],
      ["Concurrence directe", "Aucune sur le positionnement récepteur identifié à ce jour"],
      ["Barrière à l'entrée", "Profondeur de calibration juridique multi-juridictionnelle (FR/CH/UE) et base de benchmark propriétaire"],
    ],
  },

  risks: {
    intro:
      "Par souci de rigueur curatoriale, la présente notice expose sans réserve les facteurs de risque identifiés à ce stade, conformément au principe de transparence qui fonde la crédibilité du label Aegryn.",
    items: [
      {
        label: "Profondeur de traction",
        text: "La base d'utilisateurs actifs et l'historique de revenus, bien que réels et croissants, n'ont pas encore atteint un volume permettant une projection actuarielle robuste sur plusieurs exercices.",
      },
      {
        label: "Dépendance fournisseur IA",
        text: "L'actif repose sur l'API Anthropic Claude comme moteur d'intelligence artificielle — une dépendance à un fournisseur tiers, structurellement gérée par un plafond de consommation mensuel mais non éliminable à ce stade.",
      },
      {
        label: "Concentration de la connaissance",
        text: "Le développement a été conduit par un fondateur unique appuyé d'une équipe de stagiaires — la transférabilité de la connaissance produit et de la relation partenariale constitue un point d'attention en cas de cession.",
      },
      {
        label: "Risque de marque",
        text: "Un domaine concurrent préexistant (subblink.co, activité distincte de suivi d'abonnements) a été identifié et analysé sans conflit fonctionnel avéré, mais représente un risque résiduel de confusion de marque à surveiller.",
      },
    ],
  },

  thesis: {
    body: [
      "subblink s'adresse à un acquéreur recherchant un actif SaaS vertical pleinement opérationnel, sur un segment de marché structurellement non disputé, avec une infrastructure technique éprouvée et un coût de possession marginal. L'actif convient en particulier à trois profils d'acquéreur : un acteur du legal-tech établi cherchant une extension de gamme côté récepteur de contrat ; un groupe d'édition juridique ou de conformité cherchant à intégrer une couche d'intelligence contractuelle dans une offre existante ; ou un investisseur stratégique souhaitant accélérer le déploiement européen d'un produit déjà calibré sur trois juridictions.",
    ],
    closing:
      "L'actif est présenté à un stade où la thèse est démontrée mais le potentiel d'échelle reste entier — c'est précisément l'équilibre que la maison Aegryn recherche pour son catalogue inaugural.",
  },

  mentions: {
    body: [
      "La présente notice constitue un document préparatoire de présentation d'actif établi à des fins d'information préliminaire. Elle ne constitue ni une offre, ni une sollicitation, ni un engagement contractuel de cession. Le grade préliminaire indiqué en première page est attribué par la maison Aegryn sur la base des éléments déclaratifs fournis par le détenteur de l'actif et reste soumis à confirmation par un processus d'audit indépendant — incluant notamment une certification technique du code source par KRYV Protocol et une revue contractuelle par subblink elle-même, dans une démarche d'auto-cohérence méthodologique propre au catalogue Aegryn.",
      "Toute donnée chiffrée, métrique de traction ou élément de partenariat mentionné dans la présente notice est fourni par le détenteur de l'actif et n'a pas, à ce stade, fait l'objet d'une vérification indépendante exhaustive. Une data room sécurisée sera mise à disposition des acquéreurs qualifiés admis au troisième cercle d'accès, sur présentation d'un justificatif de capacité financière et signature préalable d'un accord de confidentialité.",
      "Ce document est strictement confidentiel et destiné à la seule diffusion auprès des cercles d'accès définis par la maison Aegryn. Toute reproduction, transmission ou divulgation à un tiers non autorisé est interdite.",
    ],
  },
};
