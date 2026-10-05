import type { AdvisoryPageContent, AdvisoryKey } from './types'

/**
 * Contenu FR des cinq pages métiers ACCOMPAGNER, version 2 (octobre 2026).
 * Règles : un chiffre = une source ; durées en ordre de grandeur ; scénarios
 * étiquetés « illustratif » ; CIFSO mentionnée une seule fois, en bas de la
 * page M&A ; aucune formulation sur l'indépendance ni sur les commissions.
 */

const DIAG_LEVELS_PRIVACY =
  "Vos réponses restent dans votre navigateur. Rien n'est enregistré ni transmis sans votre accord. Le résultat tient sur une page : votre niveau et la prochaine action recommandée."

export const ADVISORY_FR: Record<AdvisoryKey, AdvisoryPageContent> = {

  /* ───────────────────────── 1. STRATÉGIE ───────────────────────── */
  strategy: {
    key:      'strategy',
    path:     '/advisory/strategy',
    image:    '/images/advisory/strategy-towers.jpg',
    imageAlt: "Tours de bureaux vues en contre-plongée, le cap et la hauteur de vue",
    meta: {
      title:       'Conseil en stratégie pour PME et ETI | Aegryn',
      description: "Cap, modèle économique, croissance externe, nouveaux marchés : Aegryn aide les dirigeants d'organisations de 10 à 300 M€ à arbitrer, chiffrer et tenir leurs décisions stratégiques. Suisse et Europe.",
      keywords:    ['conseil stratégie PME', 'conseil stratégie ETI', 'plan à trois ans', 'croissance externe', 'entrée nouveau marché', 'advisory stratégie Suisse'],
    },
    eyebrow:  'Stratégie d’entreprise & Innovation',
    h1:       'Choisir le bon cap, dans le bon ordre, avec les moyens que vous avez réellement.',
    subtitle: "Pour un dirigeant d'organisation de 10 à 300 M€, la stratégie n'est pas un exercice de planification : ce sont des arbitrages sous contrainte de capital, de temps de direction et de capacité d'exécution. Aegryn vous aide à les poser, les chiffrer et les tenir.",
    scope: [
      { label: "Équipe de direction : Talent & Organisation", href: '/advisory/talent-organization' },
      { label: "Exécution d'une acquisition : M&A", href: '/advisory/ma' },
      { label: "Choix d'architecture : Technologie", href: '/advisory/technology' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '≈ 9 000', label: 'missions de conseil Bpifrance en 2024, +50 % en un an', source: 'Bpifrance Presse, 2025' },
        { value: '−2 %',    label: 'marché français du conseil en 2025, hors inflation', source: 'Syntec Conseil' },
        { value: '−7,3',    label: 'points d’indice, baromètre des PME NZZ 2026, plus bas niveau depuis le lancement de l’enquête en 2021', source: 'NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule' },
      ],
      paragraphs: [
        "Les dirigeants de PME et d'ETI achètent du conseil, mais autrement. Bpifrance a réalisé près de 9 000 missions de conseil en 2024, en hausse de 50 % en un an, alors que le marché français du conseil recule de 2 % en 2025 hors inflation. En Suisse, l'indice composite du baromètre des PME NZZ 2026 (NZZ et haute école Kalaidos) tombe à −7,3 points, son plus bas niveau depuis le lancement de l'enquête en 2021 ; seule l'intégration des technologies progresse.",
      ],
      change:  "Quand le contexte se tend, le coût d'un mauvais arbitrage augmente. Le besoin n'est plus un grand programme, c'est une décision précise, prise vite, avec un regard senior.",
      sources: 'Sources : Bpifrance Presse (2025) · Syntec Conseil · NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule (relayé par le SECO).',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Une décision que votre comité peut défendre devant un banquier ou un actionnaire.',
        'Un cap documenté, qui existe sans vous.',
        'Une première action datée dans les trente jours.',
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: "Notre modèle s'érode.", decision: 'Pivoter, défendre ou changer de segment.', deliverable: 'Revue de position : économie unitaire par segment, concurrence, trois options chiffrées.', format: 'Mission courte', cycles: ['croissance', 'restructuration'], image: '/images/advisory/situations/dashboard-laptop.jpg' },
        { quote: "L'IA change notre métier.", decision: "Où l'intégrer, ce qu'il ne faut pas automatiser.", deliverable: 'Carte des usages IA par étape de la chaîne de valeur, classés par valeur créée et risque porté.', format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/developer-desk.jpg' },
        { quote: 'Un concurrent est à vendre, ou un partenaire pourrait nous racheter.', decision: 'Croissance organique, alliance ou acquisition.', deliverable: 'Thèse de croissance externe, critères de cible, cadre go / no-go.', format: 'Quelques semaines', cycles: ['acquisition'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'Nous ouvrons un nouveau marché (DACH, Benelux, Europe du Sud).', decision: 'Filiale, distributeur, partenaire, ou attendre.', deliverable: "Plan d'entrée par pays, avec exigences réglementaires locales et besoins en talents.", format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Mon conseil, ma banque ou mon actionnaire demande un plan à trois ans.', decision: 'Quelles hypothèses assumer, lesquelles tester.', deliverable: 'Plan défendable, sensibilités explicites, mémo de dix pages pour le comité.', format: 'Un à deux mois', cycles: ['lancement', 'croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'La stratégie est dans ma tête.', decision: 'Ce qui doit exister sans vous.', deliverable: 'Stratégie documentée en cinq priorités, avec responsables et jalons.', format: 'Quelques semaines', cycles: ['croissance', 'transmission'], image: '/images/advisory/situations/plan-writing.jpg' },
      ],
    },
    services: {
      title: 'Nos services',
      items: [
        'Revoir la position stratégique',
        'Arbitrer entre options',
        'Construire le plan à trois ans',
        'Préparer le comité (mémo conseil, banque, actionnaires)',
        "Cadrer l'entrée sur un nouveau marché",
        'Accompagner le board (advisory trimestriel)',
      ],
    },
    framework: {
      name:  'La Grille des quatre tests',
      intro: "Chaque option stratégique passe quatre tests avant d'être retenue.",
      axes: [
        { label: 'Valeur',        desc: "Que change-t-elle à la valeur de l'organisation dans trois ans ?" },
        { label: 'Réversibilité', desc: 'Si elle échoue, quel est le coût de sortie à douze mois ?' },
        { label: 'Capacité',      desc: "Avons-nous les personnes, la technologie et le capital pour l'exécuter, sans mobiliser le dirigeant à plein temps ?" },
        { label: 'Séquence',      desc: "Qu'est-ce qui doit être vrai avant, et qu'est-ce qui peut attendre ?" },
      ],
      deliverable: "Une fiche de décision d'une page qui note les options et nomme la première décision à prendre dans les trente jours.",
    },
    bySize: {
      title: 'Selon votre taille',
      items: [
        { label: 'PME · 10 à 50 M€',  desc: 'Le dirigeant décide avec deux ou trois personnes, sans direction de la stratégie. La contrainte est son temps. Nous livrons court, sans structure de projet, dans un format qui tient en dix pages.' },
        { label: 'ETI · 50 à 300 M€', desc: "Plusieurs activités, un comité exécutif, parfois un actionnaire familial ou un fonds. La contrainte est l'alignement. Nous animons l'arbitrage et documentons la décision pour le board." },
      ],
    },
    bySector: {
      title: 'Selon votre secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Désintermédiation par les nouveaux acteurs ; partenariats technologiques à arbitrer sous contraintes DORA et FINMA sur les tiers critiques.' },
        { cluster: 'Santé & Sciences de la vie',               desc: 'Passage du public au privé, entrée dans un pays soumise à un cadre MDR, HDS ou EHDS différent.' },
        { cluster: 'Industrie, Énergie & Infrastructures',     desc: 'Services autour du produit (maintenance prédictive, as-a-service) ; capter la valeur de la donnée ou la déléguer à un intégrateur.' },
        { cluster: 'Commerce, Services & Expérience client',   desc: 'Omnicanal, pricing, place de marque propre face aux plateformes tierces.' },
        { cluster: 'Tech, Innovation & Secteur public',        desc: 'Modèle product-led ou commercial, définition du client cible, entrée DACH, accès aux marchés publics.' },
      ],
    },
    scenario: {
      tag:  "Scénario type · illustratif, non issu d'une mission nommée",
      text: "ETI industrielle de 120 M€, Suisse romande et France. Le dirigeant hésite entre racheter un éditeur de maintenance prédictive et le développer en interne. En trois semaines, son comité dispose d'une fiche de décision : trois options, coût total sur trois ans, risques d'exécution, conditions de réversibilité, première décision à prendre sous trente jours.",
    },
    ai: {
      title: "Ce qu'un outil d'IA ne fera pas à votre place",
      text:  "Un assistant structure vos options. Il ne connaît ni votre actionnariat, ni votre équipe, ni ce que votre banquier acceptera. Il ne répond pas de la décision. Aegryn confronte vos hypothèses, assume un avis et revient mesurer l'écart quelques mois plus tard.",
    },
    diagnostic: {
      title: 'Où en êtes-vous ? Cinq questions.',
      intro: "Répondez par oui ou par non. Le résultat vous situe sur trois niveaux et nomme la prochaine action.",
      questions: [
        { q: 'Pouvez-vous écrire votre stratégie en une page, et vos cinq priorités sont-elles connues du comité de direction ?' },
        { q: 'Chaque priorité a-t-elle un responsable, un jalon et un indicateur ?' },
        { q: 'Avez-vous chiffré au moins deux alternatives à votre cap actuel ?' },
        { q: 'Savez-vous quelles décisions sont réversibles à douze mois et lesquelles ne le sont pas ?' },
        { q: 'Un regard extérieur a-t-il contesté vos hypothèses clés au cours des douze derniers mois ?' },
      ],
      levels: [
        { min: 0, label: 'À cadrer',          desc: "La stratégie existe, mais surtout dans la tête du dirigeant. Les options n'ont pas été chiffrées ni confrontées.", nextAction: 'Poser votre décision principale sur une fiche : options, coût de sortie, première action à trente jours.' },
        { min: 3, label: 'En construction',   desc: 'Les priorités sont connues et suivies. Il manque la mise à l’épreuve : alternatives chiffrées, réversibilité, regard extérieur.', nextAction: 'Faire passer votre cap actuel par la Grille des quatre tests, avec un contradicteur senior.' },
        { min: 5, label: 'Maîtrisé',          desc: 'Stratégie écrite, pilotée, testée. Le sujet devient le rythme : revue trimestrielle et préparation du comité.', nextAction: 'Mettre en place un advisory trimestriel pour tenir la trajectoire et préparer les arbitrages à venir.' },
      ],
      privacy: DIAG_LEVELS_PRIVACY,
    },
    perspectives: {
      title: 'Perspectives',
      items: [
        { title: 'État du marché M&A tech en Europe, mi-2026', href: '/blog/marche-ma-tech-europe-q3-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 01 · Built to Last',    href: '/magazine/issue-01',                   kind: 'magazine' },
      ],
    },
    cta: { primary: 'Poser votre décision', secondary: 'Demander une fiche de décision', subject: 'advisory' },
  },

  /* ───────────────────────── 2. RISQUES & CONFORMITÉ ───────────────────────── */
  riskCompliance: {
    key:      'riskCompliance',
    path:     '/advisory/risk-compliance',
    image:    '/images/advisory/risk-compliance.jpg',
    imageAlt: 'Revue de documents contractuels et réglementaires',
    meta: {
      title:       'Conformité réglementaire pour PME et ETI : NIS2, DORA, AI Act, LPD | Aegryn',
      description: "Quelles obligations s'appliquent à vous, lesquelles vos clients vous imposeront, lesquelles peuvent attendre. Cartographie, preuves opposables, gestion d'incident. France, Suisse, UE.",
      keywords:    ['NIS2 PME', 'DORA conformité', 'AI Act obligations', 'LPD RGPD Suisse', 'cartographie réglementaire', "gestion d'incident cyber", 'OFCS signalement 24 h'],
    },
    eyebrow:  'Risques & Conformité',
    h1:       "Savoir ce qui vous oblige aujourd'hui, ce que vos clients vous imposeront demain, et ce qui peut attendre.",
    subtitle: "NIS2 pas encore transposée en France, un régime suisse distinct, un AI Act aux échéances redessinées, des clients qui exigent déjà des preuves. La conformité n'est plus un sujet de juristes : c'est un arbitrage de direction.",
    scope: [
      { label: 'Architecture et hébergement : Technologie', href: '/advisory/technology' },
      { label: "Conformité d'une cible : M&A", href: '/advisory/ma' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '≈ 15 000', label: 'entités attendues dans le périmètre NIS2 en France, contre quelques centaines aujourd’hui', source: 'Commission européenne ; estimation' },
        { value: '24 h',     label: "délai de signalement d'une cyberattaque à l'OFCS pour les infrastructures critiques suisses, depuis le 1er avril 2025", source: 'OFCS, bacs.admin.ch' },
        { value: '35 M€ · 7 %', label: 'plafond des amendes AI Act pour les pratiques interdites ; 15 M€ ou 3 % pour la plupart des autres obligations', source: 'Règlement (UE) 2024/1689, art. 99' },
      ],
      paragraphs: [
        "France. NIS2 doit faire passer le nombre d'entités réglementées de quelques centaines à un ordre de 15 000, dans 18 secteurs, dès 50 salariés ou 10 M€. La loi de transposition n'est pas votée ; la Commission a saisi la Cour de justice le 8 juillet 2026. Attendre la loi est un pari, pas un plan.",
        "Suisse. NIS2 ne s'applique pas directement. Depuis le 1er avril 2025, les exploitants d'infrastructures critiques annoncent toute cyberattaque à l'OFCS sous 24 heures, avec une amende pouvant atteindre 100 000 CHF depuis le 1er octobre 2025. Six mois après l'entrée en vigueur, 164 signalements avaient été enregistrés. Hors infrastructures critiques, aucune obligation légale, mais vos clients de l'UE pourront vous l'imposer par contrat.",
        "IA. L'article 50 de l'AI Act est applicable depuis le 2 août 2026. Les obligations « haut risque » de l'Annexe III sont reportées au 2 décembre 2027 par le Règlement (UE) 2026/1744. Les amendes atteignent 35 M€ ou 7 % du chiffre d'affaires mondial pour les pratiques interdites, 15 M€ ou 3 % pour la plupart des autres obligations.",
      ],
      change:  "Trois calendriers, trois juridictions. La bonne question n'est pas « sommes-nous conformes ? » mais « à quoi sommes-nous tenus, vis-à-vis de qui, pour quand ? ».",
      sources: 'Sources : Directive (UE) 2022/2555 · Commission européenne · OFCS, communiqué du 29.09.2025 · Règlements (UE) 2024/1689 et 2026/1744.',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        "Une vue claire de ce qui s'applique, de ce qui est exigé par contrat et de ce qui peut attendre.",
        'Des preuves que vous remettez à un client sans les reconstituer.',
        'Un responsable nommé pour chaque obligation.',
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Un grand client nous envoie un questionnaire sécurité de quarante pages.', decision: 'Quel niveau de preuve fournir, sur quel référentiel.', deliverable: 'Dossier de preuves et plan de comblement des écarts, réutilisable pour les clients suivants.', format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/laptop-hands.jpg' },
        { quote: 'Nous ne savons pas si nous sommes dans le périmètre.', decision: "Ce qui s'applique à nous, ce qui nous sera imposé, ce qui peut attendre.", deliverable: "Carte d'exposition à trois voies.", format: 'Mission courte', cycles: ['lancement', 'croissance'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: "Nos équipes utilisent l'IA sans règle.", decision: 'Quels outils, avec quelles données, sous quelle responsabilité.', deliverable: "Politique d'usage, inventaire des systèmes, classification au regard de l'AI Act.", format: 'Mission courte', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
        { quote: 'Nous avons subi un incident.', decision: 'Qui informer (autorité, clients, assureur), dans quels délais.', deliverable: "Dossier d'incident documenté et plan d'amélioration, avec les experts de réponse à incident du réseau.", format: 'À la demande', cycles: ['restructuration'], image: '/images/advisory/situations/network-cables.jpg' },
        { quote: 'Un investisseur ou un acquéreur va nous auditer.', decision: "Ce qu'il faut régulariser avant, ce qu'il faut assumer.", deliverable: 'Dossier de conformité prêt pour la data room.', format: 'Quelques semaines', cycles: ['acquisition', 'transmission'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: "Nous vendons dans l'UE depuis la Suisse (ou l'inverse).", decision: 'Représentant, DPO, transferts de données.', deliverable: 'Matrice des juridictions (LPD / RGPD) et obligations associées.', format: 'Mission courte', cycles: ['croissance'], image: '/images/advisory/situations/office-corridor.jpg' },
      ],
    },
    services: {
      title: 'Nos services',
      items: [
        'Cartographier votre exposition réglementaire',
        'Constituer le dossier de preuves opposable à vos clients',
        "Encadrer l'usage de l'IA",
        "Documenter la gestion d'incident",
        'Piloter la remédiation',
        'Former le comité de direction à ses responsabilités',
      ],
    },
    framework: {
      name:  "La Carte d'exposition à trois voies",
      intro: "Chaque texte est classé sur l'une des trois voies, avec son échéance, son responsable interne et l'écart constaté.",
      axes: [
        { label: 'Obligatoire',  desc: "Ce que la loi vous impose aujourd'hui, selon votre rôle : entité essentielle ou importante, déployeur ou fournisseur d'IA, responsable de traitement." },
        { label: 'Contractuel',  desc: 'Ce que vos clients, assureurs et investisseurs exigent, même sans loi.' },
        { label: 'À surveiller', desc: 'Échéance connue, non applicable à ce jour.' },
      ],
      deliverable: 'Une page de synthèse, annexes détaillées par texte.',
    },
    bySize: {
      title: 'Selon votre taille',
      items: [
        { label: 'PME · 10 à 50 M€',  desc: 'Rarement de RSSI ni de DPO à temps plein. Nous visons un socle de contrôles opposables, pas un système de management complet, et mobilisons des fonctions externalisées du réseau.' },
        { label: 'ETI · 50 à 300 M€', desc: "Une direction des risques existe, plusieurs référentiels se superposent. Nous les consolidons en un seul plan et préparons l'audit interne." },
      ],
    },
    bySector: {
      title: 'Selon votre secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'DORA, applicable depuis le 17 janvier 2025 : tiers TIC critiques, tests de résilience, registre des prestataires. En Suisse, exigences FINMA sur les risques opérationnels et la résilience (circulaire 2023/1).' },
        { cluster: 'Santé & Sciences de la vie',               desc: "HDS en France, MDR/IVDR, EHDS. IA embarquée dans un dispositif médical : haut risque de l'Annexe I, échéance 2 août 2028." },
        { cluster: 'Industrie, Énergie & Infrastructures',     desc: 'NIS2 (énergie, eau, transport, fabrication) ; en Suisse, signalement OFCS sous 24 h ; segmentation IT/OT.' },
        { cluster: 'Commerce, Services & Expérience client',   desc: 'RGPD et LPD (fidélité, profilage) ; article 50 (agents conversationnels, contenus générés) ; outils de tri de candidatures : haut risque, Annexe III, 2 décembre 2027.' },
        { cluster: 'Tech, Innovation & Secteur public',        desc: 'Vos clients NIS2 et DORA vous demandent des preuves ; Cyber Resilience Act (obligations de notification dès septembre 2026, exigences produit en décembre 2027) ; éditeurs utilisés en infrastructure critique : vérifier si la LSI suisse vous concerne.' },
      ],
    },
    scenario: {
      tag:  'Scénario type · illustratif',
      text: "Éditeur de logiciel suisse de 25 M€ de CA, clients dans l'énergie en Allemagne et en France. Son plus gros client exige des preuves de sécurité de la chaîne d'approvisionnement avant renouvellement. En trois semaines : périmètre clarifié (obligatoire pour lui, contractuel pour ses clients), huit écarts classés, preuves réutilisables pour les trois autres clients.",
    },
    ai: {
      title: "Ce qu'un outil d'IA ne fera pas à votre place",
      text:  'Un assistant résume NIS2. Il ne portera pas votre dossier devant votre client, ne choisira pas les écarts que vous acceptez, ne répondra pas de la qualité de la preuve. Aegryn engage un expert nommé, responsable de son périmètre.',
      legal: 'Notre accompagnement ne remplace pas un avis juridique ; nous travaillons avec des cabinets partenaires.',
    },
    diagnostic: {
      title: 'Où en êtes-vous ? Cinq questions.',
      intro: 'Répondez par oui ou par non. Le résultat vous situe sur trois niveaux et nomme la prochaine action.',
      questions: [
        { q: "Avez-vous la liste des textes qui s'appliquent à vous (UE et Suisse) et leurs échéances ?" },
        { q: 'Savez-vous ce que vos trois plus gros clients vous imposent par contrat en matière de sécurité et de données ?' },
        { q: "Existe-t-il une procédure d'incident écrite, avec délais de notification et contacts ?" },
        { q: "Avez-vous une règle écrite sur les données saisies dans les outils d'IA ?" },
        { q: 'Un membre de la direction répond-il nommément de la conformité ?' },
      ],
      levels: [
        { min: 0, label: 'À cadrer',        desc: "Le périmètre n'est pas établi. L'exposition se découvre au moment où un client, un auditeur ou un incident la révèle.", nextAction: "Établir la Carte d'exposition à trois voies : obligatoire, contractuel, à surveiller." },
        { min: 3, label: 'En construction', desc: 'Les textes et les exigences clients sont identifiés. Il manque la preuve : dossier réutilisable, procédure d’incident, responsable nommé.', nextAction: 'Constituer le dossier de preuves opposable et désigner un responsable par obligation.' },
        { min: 5, label: 'Maîtrisé',        desc: "Périmètre, preuves, responsables : le socle existe. Le sujet devient l'entretien et les échéances à venir (AI Act 2027, CRA).", nextAction: 'Planifier une revue annuelle du périmètre et former le comité de direction à ses responsabilités.' },
      ],
      privacy: DIAG_LEVELS_PRIVACY,
    },
    perspectives: { title: 'Perspectives', items: [] },
    cta: { primary: 'Évaluer votre exposition', secondary: "Demander la Carte d'exposition", subject: 'advisory' },
  },

  /* ───────────────────────── 3. TECHNOLOGIE & SOUVERAINETÉ ───────────────────────── */
  technology: {
    key:      'technology',
    path:     '/advisory/technology',
    image:    '/images/advisory/technology.jpg',
    imageAlt: 'Baies de serveurs dans un centre de données',
    meta: {
      title:       'Conseil en technologie : architecture, dette, IA, hébergement | Aegryn',
      description: "Audit d'architecture, arbitrage construire-acheter-s'allier, gouvernance de l'IA, direction technique à temps partagé. Pour les PME et ETI de 10 à 300 M€. Suisse et Europe.",
      keywords:    ["audit d'architecture", 'dette technique', 'direction technique à temps partagé', 'CTO intérim', "gouvernance IA PME", 'hébergement souverain Suisse', 'réversibilité'],
    },
    eyebrow:  'Technologie & Souveraineté',
    h1:       "Votre technologie est un actif ou une dépendance. Mesurez lequel avant qu'un client, un investisseur ou une panne ne le fasse pour vous.",
    subtitle: 'Architecture, dette technique, IA, hébergement : les choix des trois premières années pèsent sur les dix suivantes. Aegryn intervient aux moments où ils se décident.',
    scope: [
      { label: 'Obligations légales : Risques & Conformité', href: '/advisory/risk-compliance' },
      { label: "Audit d'une cible : M&A", href: '/advisory/ma' },
      { label: 'Développement sur mesure : Construire', href: '/services/build' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '22 % → 34 %', label: "PME suisses utilisant l'IA, 2024 à 2025", source: 'SECO, kmu.admin.ch' },
        { value: '34 %',        label: 'disposent de règles sur les données saisies dans les outils IA ; 23 % chez les moins de 10 salariés', source: 'SECO, kmu.admin.ch' },
        { value: '2 août 2026', label: "obligations de transparence de l'AI Act (article 50) applicables", source: 'Règlement (UE) 2024/1689' },
      ],
      paragraphs: [
        "L'adoption devance la gouvernance. En Suisse, l'usage de l'IA par les PME est passé de 22 % à 34 % entre 2024 et 2025 ; 60 % y voient une opportunité. Mais 34 % seulement disposent de règles claires sur les données pouvant être saisies dans ces outils, et 23 % chez les entreprises de moins de dix salariés. Côté européen, les obligations de transparence de l'AI Act s'appliquent depuis le 2 août 2026.",
      ],
      change:  "Le risque ne vient pas de l'outil, mais de l'absence de règle autour de lui.",
      sources: 'Sources : SECO, « AI gains ground among Swiss SMEs » · Règlement (UE) 2024/1689.',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Des dépendances nommées, avec un plan pour chaque composant non réversible.',
        'Une dette technique chiffrée plutôt que ressentie.',
        "Des règles d'usage de l'IA que vos équipes appliquent.",
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Notre plateforme ralentit nos livraisons.', decision: 'Refactorer, refondre ou remplacer.', deliverable: "Audit d'architecture, dette technique chiffrée par domaine, trajectoire à douze mois.", format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/server-room-walk.jpg' },
        { quote: 'Une seule personne comprend le système.', decision: 'Documenter, doubler ou internaliser.', deliverable: 'Registre des dépendances (personnes, prestataires, licences) et plan de réduction.', format: 'Mission courte', cycles: ['croissance', 'transmission'], image: '/images/advisory/situations/developer-desk.jpg' },
        { quote: "Construire, acheter ou s'allier ?", decision: 'Le bon arbitrage, avec le coût de sortie.', deliverable: 'Analyse à critères pondérés, réversibilité comprise.', format: 'Mission courte', cycles: ['lancement', 'croissance'], image: '/images/advisory/situations/loft-office.jpg' },
        { quote: "Nos équipes utilisent l'IA sans cadre.", decision: 'Outils autorisés, données admises, hébergement.', deliverable: "Politique d'usage, inventaire, arbitrage des outils.", format: 'Mission courte', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
        { quote: "Nous n'avons plus de directeur technique.", decision: 'Intérim, recrutement, ou direction à temps partagé.', deliverable: 'Direction technique par intérim avec passation documentée.', format: 'Mission fractionnée', cycles: ['restructuration'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'Où sont nos données, et qui peut y accéder ?', decision: 'Hébergement UE ou Suisse, clauses de réversibilité, exposition aux lois extraterritoriales.', deliverable: "Revue d'hébergement et plan de réversibilité.", format: 'Mission courte', cycles: ['lancement', 'croissance'], image: '/images/advisory/situations/network-cables.jpg' },
      ],
    },
    services: {
      title: 'Nos services',
      items: [
        "Auditer l'architecture et la dette",
        "Arbitrer construire, acheter, s'allier",
        'Établir le registre des dépendances critiques',
        "Encadrer l'usage de l'IA",
        'Assurer la direction technique par intérim',
        "Préparer l'actif technologique au regard d'un tiers (investisseur, acquéreur)",
      ],
    },
    framework: {
      name:  'Le Test de réversibilité à 90 jours',
      intro: "Pour chaque composant critique (hébergeur, éditeur, prestataire, modèle d'IA, développeur clé), une question : s'il disparaît demain, en combien de jours, à quel coût et avec quelle perte de données le service repart-il ?",
      axes: [
        { label: 'Réversible en une semaine', desc: 'Alternative identifiée, données exportables, bascule documentée.' },
        { label: 'Réversible en un mois',     desc: 'Alternative connue, migration à planifier, dépendance fonctionnelle limitée.' },
        { label: 'Réversible en 90 jours',    desc: 'Remplacement possible mais coûteux : refonte partielle, renégociation, recrutement.' },
        { label: 'Non réversible',            desc: "Pas d'alternative crédible à ce jour. Le composant conditionne la continuité du service." },
      ],
      deliverable: 'Carte des dix composants les plus critiques et plan de traitement des non réversibles.',
    },
    bySize: {
      title: 'Selon votre taille',
      items: [
        { label: 'PME · 10 à 50 M€',  desc: 'Une pile construite par accumulation, quelques développeurs, des prestataires. Priorité : documentation minimale et réversibilité des trois composants critiques.' },
        { label: 'ETI · 50 à 300 M€', desc: "Système d'information hérité, plusieurs éditeurs, une DSI. Priorité : une trajectoire de modernisation arbitrée par le comité, et une gouvernance des données entre activités." },
      ],
    },
    bySector: {
      title: 'Selon votre secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Tiers TIC critiques et externalisation cloud (DORA) ; architecture de résilience.' },
        { cluster: 'Santé & Sciences de la vie',               desc: 'Hébergement HDS en France ; séparation des données de santé ; IA dans un dispositif médical (Annexe I, 2 août 2028).' },
        { cluster: 'Industrie, Énergie & Infrastructures',     desc: 'IT/OT, télémaintenance, propriété des données industrielles.' },
        { cluster: 'Commerce, Services & Expérience client',   desc: "Unifier les données clients entre canaux sans dépendre d'un seul CRM ; personnalisation par IA et RGPD." },
        { cluster: 'Tech, Innovation & Secteur public',        desc: 'Audit avant investissement ou cession ; licences à copyleft dans le cœur du produit ; hébergement imposé par les marchés publics.' },
      ],
    },
    scenario: {
      tag:  'Scénario type · illustratif',
      text: "Éditeur de logiciel pour cliniques, 18 M€ de CA, 14 développeurs dont 6 prestataires. Un fonds s'intéresse à l'entreprise. En quatre semaines : dépendances et dette cartographiées, trois composants non réversibles identifiés, plan de remédiation à six mois chiffré. Le dirigeant le présente au fonds avant que celui-ci ne le découvre seul.",
    },
    ai: {
      title: "Ce qu'un outil d'IA ne fera pas à votre place",
      text:  "Un assistant de code produit du code. Il ne répond pas du choix d'architecture, ne sait pas ce que votre contrat d'hébergement autorise, et ne tiendra pas le rôle de directeur technique devant votre conseil.",
    },
    diagnostic: {
      title: 'Où en êtes-vous ? Cinq questions.',
      intro: 'Répondez par oui ou par non. Le résultat vous situe sur trois niveaux et nomme la prochaine action.',
      questions: [
        { q: 'Votre architecture est-elle documentée à jour (schéma, flux de données) ?' },
        { q: 'Pouvez-vous nommer vos dix composants critiques et le délai de remplacement de chacun ?' },
        { q: "Plus d'une personne comprend-elle chaque composant critique ?" },
        { q: 'Les cessions de droits et licences de tout le code livré par des prestataires sont-elles archivées ?' },
        { q: 'Savez-vous où vos données sont hébergées et qui peut y accéder ?' },
      ],
      levels: [
        { min: 0, label: 'À cadrer',        desc: "Le système fonctionne, mais sa connaissance repose sur quelques personnes et sa documentation n'est pas à jour.", nextAction: 'Établir le registre des dépendances et faire passer les trois composants les plus critiques au Test de réversibilité.' },
        { min: 3, label: 'En construction', desc: 'Architecture et données sont connues. Il reste des angles morts : chaîne de droits, doublure des personnes clés, délais de remplacement.', nextAction: 'Compléter le registre (droits, licences, doublures) et chiffrer la dette par domaine.' },
        { min: 5, label: 'Maîtrisé',        desc: "L'actif technologique est documenté, réversible et lisible par un tiers. Le sujet devient la trajectoire : modernisation, IA, gouvernance des données.", nextAction: "Arbitrer la trajectoire à douze mois en comité et préparer l'actif au regard d'un investisseur ou d'un acquéreur." },
      ],
      privacy: DIAG_LEVELS_PRIVACY,
    },
    perspectives: {
      title: 'Perspectives',
      items: [
        { title: 'Ce qui rend un actif tech vraiment certifiable', href: '/blog/actif-tech-certifiable', kind: 'article' },
      ],
    },
    cta: { primary: 'Auditer votre architecture', secondary: 'Faire passer vos dix composants critiques au test', subject: 'tech' },
  },

  /* ───────────────────────── 4. TALENT & ORGANISATION ───────────────────────── */
  talentOrganization: {
    key:      'talentOrganization',
    path:     '/advisory/talent-organization',
    image:    '/images/advisory/talent.jpg',
    imageAlt: 'Salle de conseil vide, prête pour la prochaine séance',
    meta: {
      title:       'Succession, gouvernance, équipe de direction | Aegryn',
      description: 'Mesurer la dépendance au dirigeant, structurer le comité de direction, bâtir un plan de succession, retenir les profils clés. PME et ETI de 10 à 300 M€. Suisse et Europe.',
      keywords:    ['plan de succession PME', 'dépendance au dirigeant', 'gouvernance comité de direction', 'rétention profils clés', 'transmission entreprise familiale', 'organisation ETI'],
    },
    eyebrow:  'Talent & Organisation',
    h1:       "La valeur d'une organisation se mesure à ce qu'elle sait faire sans son dirigeant.",
    subtitle: "Succession, gouvernance, rétention, structuration de la direction : les décisions d'organisation pèsent le plus dans la durée et sont les plus souvent reportées.",
    scope: [
      { label: 'Recherche et placement : Recruter', href: '/talent' },
      { label: 'Choix de cap : Stratégie', href: '/advisory/strategy' },
      { label: "Équipe d'une cible : M&A", href: '/advisory/ma' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '40 %',    label: 'des dirigeants de TPE, PME et ETI français comptent transmettre d’ici cinq ans, soit 370 000 entreprises', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '130 000', label: 'transmissions effectives attendues au rythme actuel', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '47 %',    label: "des dirigeants d'entreprises familiales de 60 à 69 ans n'ont pas formalisé de plan de succession", source: 'Bpifrance Le Lab, entreprises familiales' },
      ],
      paragraphs: [
        "En France, 40 % des dirigeants de TPE, PME et ETI comptent transmettre leur entreprise d'ici cinq ans, soit un potentiel de 370 000 entreprises. Au rythme actuel, 130 000 changeraient réellement de mains. Parmi les dirigeants de PME et d'ETI familiales de 60 à 69 ans, 47 % n'ont pas formalisé de plan de succession.",
      ],
      change:  "L'écart entre l'intention et l'acte tient moins au marché qu'à la préparation. Une organisation qui dépend d'une personne se transmet mal, se finance mal et se pilote mal.",
      sources: "Sources : Bpifrance Le Lab, étude Transmission et reprise d'entreprise (27 novembre 2025) · Bpifrance Le Lab, entreprises familiales.",
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Une organisation qui tient trois mois sans son dirigeant.',
        'Des profils critiques doublés.',
        'Un plan de succession écrit, daté et partagé.',
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Tout passe par moi.', decision: 'Quoi déléguer en premier, à qui.', deliverable: 'Indice de dépendance et plan de délégation sur douze mois.', format: 'Quelques semaines', cycles: ['croissance', 'transmission'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: "Mon équipe de direction n'est pas encore une équipe.", decision: 'Rôles, rythmes de décision, délégations.', deliverable: 'Charte de gouvernance du comité de direction.', format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'Un profil clé veut partir.', decision: 'Retenir, remplacer ou doubler.', deliverable: 'Plan de rétention, doublure identifiée, transfert de savoir documenté.', format: 'Mission courte', cycles: ['restructuration'], image: '/images/advisory/situations/laptop-hands.jpg' },
        { quote: 'Je dois recruter un dirigeant (technique, financier, opérationnel, pays).', decision: 'Le bon profil, dans la bonne gouvernance.', deliverable: "Définition du poste et critères d'intégration, puis relais vers Recruter.", format: 'Mission courte', cycles: ['croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'Je pense transmettre dans deux à cinq ans.', decision: 'Famille, interne ou repreneur externe.', deliverable: 'Plan de succession et gouvernance de transition.', format: 'Un à deux mois', cycles: ['transmission'], image: '/images/advisory/situations/plan-writing.jpg' },
        { quote: 'Une acquisition arrive, deux cultures vont se rencontrer.', decision: "Qui reste, qui pilote, comment s'organiser.", deliverable: "Évaluation de l'équipe cible, organisation cible, plan de rétention.", format: 'Quelques semaines', cycles: ['acquisition'], image: '/images/advisory/situations/office-corridor.jpg' },
      ],
    },
    services: {
      title: 'Nos services',
      items: [
        'Mesurer la dépendance au dirigeant et aux profils clés',
        'Structurer le comité de direction et ses délégations',
        'Bâtir le plan de succession',
        'Sécuriser la rétention des profils critiques',
        'Documenter les savoir-faire critiques',
        "Préparer le recrutement d'un dirigeant",
      ],
    },
    framework: {
      name:  "L'Indice de dépendance",
      intro: 'Pour chaque personne critique, quatre axes, un score, un temps de substitution en semaines et un seuil d’alerte.',
      axes: [
        { label: 'Décisions', desc: 'Qui tranche.' },
        { label: 'Relations', desc: 'Qui détient les clients et partenaires clés.' },
        { label: 'Savoirs',   desc: 'Qui est seul à savoir.' },
        { label: 'Contrats',  desc: 'Quelles clauses sont attachées à un nom.' },
      ],
      deliverable: "Une carte des personnes dont le départ mettrait l'organisation en difficulté, et ce que chaque départ coûterait en continuité.",
    },
    bySize: {
      title: 'Selon votre taille',
      items: [
        { label: 'PME · 10 à 50 M€',  desc: 'Le dirigeant est souvent premier commercial et premier décideur produit. Priorité : déléguer les relations clients clés et documenter les dix processus critiques.' },
        { label: 'ETI · 50 à 300 M€', desc: 'Gouvernance familiale ou actionnaires. Priorité : plan de succession du directeur général et de ses N-1, comité de nomination, rôle de la famille.' },
      ],
    },
    bySector: {
      title: 'Selon votre secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: "Fonctions soumises à agrément ou notification au régulateur, dont le départ d'un titulaire déclenche des démarches." },
        { cluster: 'Santé & Sciences de la vie',               desc: 'Responsable de la conformité réglementaire (PRRC, MDR) et responsable qualité : fonctions réglementées à succession préparée.' },
        { cluster: 'Industrie, Énergie & Infrastructures',     desc: 'Savoir-faire tacite des anciens, départs en retraite en grappe, entreprises familiales.' },
        { cluster: 'Commerce, Services & Expérience client',   desc: 'Responsables de réseau, comptes clés, rétention des managers de proximité.' },
        { cluster: 'Tech, Innovation & Secteur public',        desc: "Directeur technique unique, développeurs dépositaires de l'architecture." },
      ],
    },
    scenario: {
      tag:  'Scénario type · illustratif',
      text: 'ETI familiale de 140 M€, dirigeant de 63 ans, deux enfants dont aucun ne souhaite diriger. En quatre semaines : Indice de dépendance (sept personnes critiques), trois scénarios de succession comparés, calendrier de transition sur vingt-quatre mois que le conseil de famille peut trancher.',
    },
    ai: {
      title: "Ce qu'un outil d'IA ne fera pas à votre place",
      text:  "Un assistant rédige une fiche de poste. Il ne mène pas l'entretien difficile avec le fondateur, n'arbitre pas entre deux N-1, et ne sait pas ce que la famille ne dit pas.",
    },
    diagnostic: {
      title: 'Où en êtes-vous ? Cinq questions.',
      intro: 'Répondez par oui ou par non. Le résultat vous situe sur trois niveaux et nomme la prochaine action.',
      questions: [
        { q: 'Votre organisation fonctionnerait-elle normalement pendant trois mois sans vous ?' },
        { q: 'Vos cinq clients ou partenaires clés ont-ils au moins deux interlocuteurs chez vous ?' },
        { q: 'Chaque fonction critique a-t-elle une doublure identifiée ?' },
        { q: 'Existe-t-il un plan de succession écrit pour le dirigeant et ses N-1 ?' },
        { q: 'Les savoir-faire critiques sont-ils documentés ailleurs que dans la tête de ceux qui les détiennent ?' },
      ],
      levels: [
        { min: 0, label: 'À cadrer',        desc: "L'organisation repose sur son dirigeant et sur quelques personnes. Un départ ou une absence prolongée la mettrait en difficulté.", nextAction: "Mesurer l'Indice de dépendance et déléguer les relations clients clés en premier." },
        { min: 3, label: 'En construction', desc: 'Les délégations existent et les clients ont plusieurs interlocuteurs. Il manque la formalisation : doublures, plan de succession écrit, savoirs documentés.', nextAction: 'Écrire le plan de succession du dirigeant et de ses N-1, et documenter les dix processus critiques.' },
        { min: 5, label: 'Maîtrisé',        desc: "L'organisation tient sans son dirigeant. Le sujet devient la transition : calendrier, gouvernance, rôle de la famille ou des actionnaires.", nextAction: 'Cadrer la gouvernance de transition et préparer le comité de nomination.' },
      ],
      privacy: DIAG_LEVELS_PRIVACY,
    },
    perspectives: { title: 'Perspectives', items: [] },
    cta: { primary: 'Mesurer votre dépendance', secondary: 'Cadrer votre succession', subject: 'advisory' },
  },

  /* ───────────────────────── 5. M&A, TRANSACTIONS & PMI ───────────────────────── */
  ma: {
    key:      'ma',
    path:     '/advisory/ma',
    image:    '/images/advisory/ma.jpg',
    imageAlt: 'Dirigeant se rendant à une réunion de négociation',
    meta: {
      title:       'Acquisition, cession, intégration : le conseil en amont des transactions | Aegryn',
      description: "Revue des angles morts d'une cible (code et droits, clauses de changement de contrôle, conformité, équipes), préparation du cédant, intégration à 100 jours. L'exécution financière revient à des partenaires agréés.",
      keywords:    ['conseil acquisition PME', 'revue de cible', 'clause de changement de contrôle', 'intégration post-acquisition', 'plan 100 jours', 'build-up', 'préparation cédant'],
    },
    eyebrow:  'M&A, Transactions & PMI',
    h1:       "Une acquisition se gagne dans la préparation. Elle se perd dans l'intégration.",
    subtitle: 'Aegryn regarde ce que les audits financiers et juridiques regardent peu : le code, les droits, les clauses de changement de contrôle, les équipes. L’exécution financière est confiée à des partenaires agréés.',
    scope: [
      { label: "Profondeur d'audit : Risques & Conformité", href: '/advisory/risk-compliance' },
      { label: "Profondeur d'audit : Technologie", href: '/advisory/technology' },
      { label: 'Équipes : Talent & Organisation', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '48 à 66 %', label: "taux d'échec des opérations de M&A selon les études compilées, l'essentiel à l'intégration", source: 'Wiley Encyclopedia of Management ; Kotter et al.' },
        { value: '208',       label: 'opérations de M&A de PME suisses en 2025, +16 % ; +28 % dans les services informatiques et le logiciel', source: 'SECO, kmu.admin.ch' },
        { value: '23 %',      label: "des cédants potentiels français relèvent un manque d'offres de reprise", source: 'Bpifrance Le Lab, 2025' },
      ],
      paragraphs: [
        "Les études compilées situent l'échec des opérations de M&A entre 48 et 66 % selon la définition retenue, et les observations de Kotter et de ses coauteurs placent l'essentiel des échecs à l'intégration. En Suisse, les opérations de M&A de PME ont rebondi de 16 % en 2025 (208 opérations), avec +28 % dans les services informatiques et le logiciel. En France, 23 % des cédants potentiels relèvent un manque d'offres de reprise.",
      ],
      change:  "Le marché a des cédants et des acquéreurs ; ce qui manque, c'est la préparation qui fait aboutir l'opération et tenir ses promesses.",
      sources: 'Sources : Wiley Encyclopedia of Management ; Kotter, Akhtar, Gupta, Change · SECO · Bpifrance Le Lab (2025).',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Une cible regardée sous quatre angles que la due diligence classique couvre peu.',
        "Des points de négociation chiffrés plutôt que des intuitions.",
        "Un plan d'intégration prêt avant la signature.",
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Nous avons repéré une cible.', decision: "Ce qu'il faut regarder avant la lettre d'intention.", deliverable: 'Revue des quatre angles morts, avec traitement proposé pour chacun : prix, garantie, condition suspensive.', format: 'Quelques semaines', cycles: ['acquisition'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'On nous approche pour nous acheter.', decision: "Jusqu'où se préparer avant de répondre.", deliverable: 'Diagnostic de préparation du cédant et position de négociation.', format: 'Quelques semaines', cycles: ['transmission'], image: '/images/advisory/situations/dashboard-laptop.jpg' },
        { quote: 'Nous voulons faire deux ou trois acquisitions en trois ans.', decision: 'Thèse, critères, processus.', deliverable: "Programme de build-up reproductible : critères, revue standard, playbook d'intégration.", format: 'Un à deux mois', cycles: ['acquisition'], image: '/images/advisory/situations/loft-office.jpg' },
        { quote: "L'acquisition est signée, l'intégration patine.", decision: 'Ce qui est urgent, ce qui peut attendre.', deliverable: 'Plan 30 / 60 / 100 jours et pilotage.', format: 'Mission de trois à six mois', cycles: ['acquisition'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'Nous devons céder une activité non stratégique.', decision: 'Périmètre et séparation des systèmes.', deliverable: 'Plan de séparation : périmètre, systèmes, personnes, accords de transition.', format: 'Un à deux mois', cycles: ['restructuration'], image: '/images/advisory/situations/industrial-engineer.jpg' },
        { quote: 'Mon fonds doit valider une cible technologique.', decision: 'Investir, négocier ou renoncer.', deliverable: 'Revue technique et organisationnelle indépendante, notée par angle mort.', format: 'Quelques semaines', cycles: ['acquisition'], image: '/images/advisory/situations/server-room-walk.jpg' },
      ],
    },
    services: {
      title: 'Nos services',
      items: [
        "Formuler la thèse d'acquisition et les critères de cible",
        'Passer la cible au crible de quatre angles morts',
        'Cadrer les points de négociation issus de la revue',
        "Préparer l'organisation à être regardée (côté cédant)",
        "Piloter l'intégration à 100 jours",
        'Structurer un programme de build-up',
      ],
    },
    framework: {
      name:  'La Revue des quatre angles morts',
      intro: 'Chaque constat est classé par impact et probabilité, puis traité : ajustement de prix, garantie spécifique, condition suspensive ou point accepté en connaissance de cause.',
      axes: [
        { label: 'Code et chaîne de droits',          desc: "Licences, cessions d'auteurs, dépendances." },
        { label: 'Contrats et changement de contrôle', desc: 'Clients, fournisseurs, licences cédées.' },
        { label: 'Conformité et sécurité',             desc: 'Périmètre réglementaire hérité, incidents, preuves disponibles.' },
        { label: 'Personnes et dépendances',           desc: 'Managers clés, rétention, culture.' },
      ],
      deliverable: 'Une matrice impact / probabilité par angle, et pour chaque constat le traitement proposé en négociation.',
    },
    bySize: {
      title: 'Selon votre taille',
      items: [
        { label: 'PME · 10 à 50 M€',  desc: "Reprise, MBO ou rachat par un acteur de taille proche, avec peu de conseils autour de la table. Nous concentrons la revue sur les quatre angles morts en quelques semaines, aux côtés de l'avocat et de l'expert-comptable." },
        { label: 'ETI · 50 à 300 M€', desc: "Programme de croissance externe, équipe M&A interne ou banque d'affaires. Aegryn intervient comme partenaire de revue technique, organisationnelle et d'intégration." },
      ],
    },
    bySector: {
      title: 'Selon votre secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: "Acquisition d'un acteur fintech ou assurtech ; agréments et autorisations de changement de contrôle ; portabilité des données ; DORA sur les tiers." },
        { cluster: 'Santé & Sciences de la vie',               desc: "Continuité du marquage CE (MDR) et de l'hébergement HDS ; contrats hospitaliers à clause de changement de contrôle." },
        { cluster: 'Industrie, Énergie & Infrastructures',     desc: 'Acquérir des compétences numériques ; propriété intellectuelle en environnement industriel ; fondateur-développeur.' },
        { cluster: 'Commerce, Services & Expérience client',   desc: 'Acteurs numériques pour compléter un réseau physique ; données clients ; intégration des équipes.' },
        { cluster: 'Tech, Innovation & Secteur public',        desc: 'Build-up de logiciels verticaux ; qualité du revenu récurrent ; clauses de changement de contrôle ; copyleft.' },
      ],
    },
    scenario: {
      tag:  'Scénario type · illustratif',
      text: "Groupe de services de 90 M€ qui veut racheter un éditeur de 8 M€ de CA. En trois semaines : deux contrats clients importants portent une clause de changement de contrôle, une bibliothèque sous licence copyleft est au cœur du produit, le directeur technique est seul dépositaire de l'architecture. Trois points partent en négociation : garantie spécifique, condition suspensive, plan de rétention.",
    },
    ai: {
      title: "Ce qu'un outil d'IA ne fera pas à votre place",
      text:  "Un assistant lit un contrat de cession. Il ne dira pas ce que vaut la clause de changement de contrôle du contrat de votre premier client, ne sera pas assis en face du directeur technique de la cible, et n'engage pas sa responsabilité.",
    },
    complement: {
      title: 'Pour aller plus loin',
      text:  'Quand le dossier le justifie, la revue peut s’appuyer sur la certification CIFSO 5000, indépendante, délivrée sur cinq dimensions.',
    },
    diagnostic: {
      title: 'Où en êtes-vous ? Cinq questions.',
      intro: 'Répondez par oui ou par non. Le résultat vous situe sur trois niveaux et nomme la prochaine action.',
      questions: [
        { q: "Disposez-vous d'une thèse écrite de croissance externe (critères de cible, budget, calendrier) ?" },
        { q: 'Savez-vous quelles clauses de changement de contrôle figurent dans vos contrats clients clés ?' },
        { q: 'La chaîne de droits sur votre code et vos marques est-elle documentée ?' },
        { q: "Un plan d'intégration à 100 jours existe-t-il avant toute signature ?" },
        { q: 'Si un acquéreur vous approchait demain, pourriez-vous ouvrir une data room en deux semaines ?' },
      ],
      levels: [
        { min: 0, label: 'À cadrer',        desc: "L'opération se traiterait au fil de l'eau. Les angles morts (droits, clauses, équipes) seraient découverts par l'autre partie.", nextAction: "Écrire la thèse ou le diagnostic de préparation, et relire les clauses de changement de contrôle de vos trois premiers contrats." },
        { min: 3, label: 'En construction', desc: 'Les bases existent : thèse ou préparation, contrats connus. Il manque la mécanique : chaîne de droits, plan à 100 jours, data room prête.', nextAction: "Documenter la chaîne de droits et rédiger le plan d'intégration avant la prochaine lettre d'intention." },
        { min: 5, label: 'Maîtrisé',        desc: "Vous êtes prêt à acheter ou à être regardé. Le sujet devient la répétabilité : programme de build-up, playbook d'intégration.", nextAction: "Structurer le programme de build-up et mesurer l'intégration à 100 jours sur la prochaine opération." },
      ],
      privacy: DIAG_LEVELS_PRIVACY,
    },
    perspectives: {
      title: 'Perspectives',
      items: [
        { title: 'Comment les acquéreurs PE évaluent un SaaS en 2026', href: '/blog/comment-acquereurs-pe-evaluent-saas-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 02 · The Exit Equation (avril 2027)', href: '/magazine', kind: 'magazine' },
      ],
    },
    cta: { primary: 'Passer une cible au crible', secondary: 'Préparer une intégration', subject: 'advisory' },
  },
}
