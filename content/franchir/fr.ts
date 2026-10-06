/**
 * Contenu FR du bloc FRANCHIR — langue de référence.
 * Spec du 6 octobre 2026 : chaque page suit la structure des pages
 * ACCOMPAGNER (constat sourcé, situations, métiers, taille, secteur,
 * scénario illustratif, IA, diagnostic 5 questions, cycle suivant).
 * Les scénarios sont illustratifs et signalés comme tels.
 */

import type { CycleContent, FranchirIntro } from './types'

export const FRANCHIR_INTRO_FR: FranchirIntro = {
  meta: {
    title:       'Franchir — chaque cycle a sa décision | Aegryn',
    description: 'Lancement, croissance, pivot, acquisition, transmission : cinq cycles où une organisation de 10 à 300 M€ engage son avenir. Voici ce qui se joue, et qui mobiliser.',
  },
  eyebrow:   'Franchir',
  heroTitle: 'Chaque cycle a sa décision. Trouvez la vôtre.',
  heroSub:   'Lancement, croissance, pivot, acquisition, transmission : cinq cycles où une organisation de 10 à 300 M€ engage son avenir. Voici ce qui se joue, et qui mobiliser.',
  cycles: [
    { slug: 'lancement',       title: 'Lancement & Structuration',        stake: 'Des choix peu coûteux à faire maintenant, très coûteux à corriger plus tard.' },
    { slug: 'croissance',      title: 'Croissance & Mise à l’échelle',    stake: 'Ce qui marchait à dix personnes ralentit à cinquante.' },
    { slug: 'restructuration', title: 'Restructuration & Pivot',          stake: 'Le modèle, le marché ou la règle a changé : décider vite.' },
    { slug: 'acquisition',     title: 'Acquisition & Croissance externe', stake: 'Savoir ce que l’on reprend, et comment l’intégrer.' },
    { slug: 'transmission',    title: 'Transmission & Cession',           stake: 'Faire tenir l’organisation sans son dirigeant.' },
  ],
  overlap: {
    title: 'Vous traversez deux cycles à la fois ?',
    text:  'Croître par acquisition, restructurer avant de transmettre : les cycles se chevauchent. Aegryn construit un seul périmètre d’intervention, avec les métiers concernés.',
    examples: [
      { label: 'Croissance + Acquisition',       a: 'croissance',      b: 'acquisition' },
      { label: 'Restructuration + Transmission', a: 'restructuration', b: 'transmission' },
    ],
  },
  diagnostic: {
    title: 'Où en êtes-vous ?',
    questions: [
      { q: 'Votre organisation a-t-elle moins de 3 ans ou prépare-t-elle un nouveau produit ou une nouvelle entité ?', cycle: 'lancement' },
      { q: 'Votre activité a-t-elle plus que doublé en volume ou en effectifs récemment ?', cycle: 'croissance' },
      { q: 'Un client majeur, un marché, un incident ou une règle remet-il en cause votre modèle ?', cycle: 'restructuration' },
      { q: 'Étudiez-vous le rachat d’une organisation ou en avez-vous racheté une dans les 18 derniers mois ?', cycle: 'acquisition' },
      { q: 'Pensez-vous passer la main dans les cinq ans ?', cycle: 'transmission' },
    ],
  },
  assetsLink: { text: 'Pour mesurer et attester la valeur de vos actifs :', label: 'voir les actifs Aegryn' },
  cta:        { label: 'Échanger 30 minutes' },
}

export const FRANCHIR_FR: CycleContent[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'lancement',
    path: '/franchir/lancement',
    meta: {
      title:       'Lancement & Structuration — poser les bonnes bases avant de dépenser | Aegryn',
      description: 'Prestataires, technologies, propriété intellectuelle, conformité, gouvernance : les choix des premiers mois coûtent peu à décider et très cher à corriger.',
    },
    eyebrow:  'Franchir · Lancement & Structuration',
    h1:       'Poser les bonnes bases avant de dépenser.',
    subtitle: 'Prestataires, technologies, propriété intellectuelle, conformité, gouvernance : les choix des premiers mois coûtent peu à décider et très cher à corriger.',
    verbs:    ['Cadrer', 'Construire', 'Recruter'],
    constat: {
      text:   'Les obligations de transparence du règlement européen sur l’IA (art. 50) s’appliquent depuis le 2 août 2026, avec des amendes pouvant atteindre 15 M€ ou 3 % du chiffre d’affaires mondial pour les obligations hors pratiques interdites. Une organisation qui lance un produit utilisant l’IA est concernée dès le premier jour.',
      source: 'Règlement (UE) sur l’IA.',
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Mon prestataire a livré le code, mais je n’ai pas relu le contrat.', decision: 'À qui appartiennent le code et les données ? Que se passe-t-il si le prestataire part ?', metiers: ['technologie'], deliverable: 'Note de position sur la propriété et la réversibilité, avec les clauses à corriger' },
        { quote: 'On veut aller vite, on verra la conformité plus tard.', decision: 'Quelles obligations s’appliquent déjà, lesquelles peuvent attendre ?', metiers: ['conformite'], deliverable: 'Carte d’exposition : applicable maintenant / bientôt / pas concerné' },
        { quote: 'On hésite entre construire, acheter ou louer.', decision: 'Quel périmètre construire, lequel acheter ou louer ?', metiers: ['strategie', 'construire'], deliverable: 'Arbitrage écrit, avec ce qu’il faut renoncer à faire' },
        { quote: 'Mon associé et moi n’avons pas défini qui décide.', decision: 'Qui décide de quoi, qui détient quoi ?', metiers: ['talent'], deliverable: 'Cadre de décision à deux pages, à faire signer' },
        { quote: 'Il me faut un premier responsable technique.', decision: 'Profil, statut, rémunération, rôle face aux prestataires', metiers: ['recruter'], deliverable: 'Fiche de poste, vivier de profils' },
        { quote: 'Notre groupe crée une nouvelle activité à isoler.', decision: 'Quel périmètre isoler du système d’information du groupe ?', metiers: ['technologie', 'strategie'], deliverable: 'Plan d’isolement et feuille de route des 6 premiers mois' },
      ],
    },
    metiers: { mobilized: ['technologie', 'conformite', 'strategie', 'construire'], available: ['talent', 'recruter'] },
    bySize: {
      title: 'Selon la taille',
      items: [
        { label: 'PME', desc: 'Peu de ressources, arbitrages en quelques jours, un seul interlocuteur chez Aegryn.' },
        { label: 'ETI', desc: 'Nouvelle entité, spin-off : isoler la nouvelle activité du système d’information et de la gouvernance du groupe.' },
      ],
    },
    bySector: {
      title: 'Selon le secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Exigences d’exploitation et d’externalisation des systèmes dès la conception.' },
        { cluster: 'Santé & Sciences de la Vie',               desc: 'Données sensibles traitées dès le premier utilisateur.' },
        { cluster: 'Industrie, Énergie & Infrastructure',      desc: 'Logiciel embarqué, maintenance sur des dizaines d’années.' },
        { cluster: 'Commerce, Services & Expérience Client',   desc: 'Consentement et données clients.' },
        { cluster: 'Tech, Innovation & Secteur Public',        desc: 'Réversibilité des composants et des fournisseurs.' },
      ],
    },
    scenario: {
      tag:  'Scénario illustratif',
      text: 'Un éditeur de 3 M€ de CA dont le produit est développé par un prestataire externe prépare son premier grand compte. Le test de réversibilité montre que le dépôt de code est au nom du prestataire. Le correctif se règle en quelques semaines avant la signature, et coûterait bien plus après.',
    },
    ai: {
      title: 'Ce qu’un outil d’IA généraliste ne fera pas à votre place',
      text:  'Lire votre contrat avec le prestataire dans son contexte, arbitrer entre deux associés, et répondre de la décision devant votre conseil ou vos financeurs.',
    },
    diagnostic: {
      title: 'Auto-diagnostic',
      intro: 'Cinq questions oui/non pour situer vos bases.',
      questions: [
        { q: 'Le code et les données de votre produit sont-ils au nom de votre organisation ?' },
        { q: 'Pourriez-vous changer de prestataire principal en moins de 90 jours ?' },
        { q: 'Avez-vous listé les obligations réglementaires qui s’appliquent à votre produit ?' },
        { q: 'Les rôles et pouvoirs de décision entre associés sont-ils écrits ?' },
        { q: 'Quelqu’un en interne comprend-il l’architecture de bout en bout ?' },
      ],
      levels: [
        { min: 4, label: 'Bases posées',    desc: 'Vos bases sont posées. Un échange de 30 minutes peut confirmer les points qui restent.', nextAction: 'Échanger 30 minutes' },
        { min: 2, label: 'À sécuriser',     desc: 'Plusieurs points à sécuriser avant de grandir.', nextAction: 'Échanger 30 minutes' },
        { min: 0, label: 'Fondations',      desc: 'Priorité aux fondations.', nextAction: 'Échanger 30 minutes' },
      ],
      privacy: 'Aucune donnée n’est enregistrée : le diagnostic se calcule dans votre navigateur.',
    },
    nextLabel: 'Cycle suivant',
    next:      [{ label: 'Croissance & Mise à l’échelle', slug: 'croissance' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'croissance',
    path: '/franchir/croissance',
    meta: {
      title:       'Croissance & Mise à l’échelle — grandir sans casser ce qui fonctionne | Aegryn',
      description: 'À partir d’un certain volume, ce qui marchait à dix personnes ralentit à cinquante : outils, décisions, règles, dépendances.',
    },
    eyebrow:  'Franchir · Croissance & Mise à l’échelle',
    h1:       'Grandir sans casser ce qui fonctionne.',
    subtitle: 'À partir d’un certain volume, ce qui marchait à dix personnes ralentit à cinquante : outils, décisions, règles, dépendances.',
    verbs:    ['Structurer', 'Sécuriser', 'Renforcer'],
    constat: {
      text:   'En Suisse, l’usage de l’IA par les PME est passé de 22 % à 34 % entre 2024 et 2025, mais seules 34 % ont des règles sur les données saisies dans ces outils (23 % chez les moins de 10 collaborateurs). Le baromètre des PME 2026 est à −7,3, son plus bas niveau depuis 2021. La croissance se fait dans un contexte tendu, avec des pratiques encore peu encadrées.',
      source: 'SECO, Portail PME.',
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Mes équipes utilisent l’IA comme elles veulent.', decision: 'Quelles règles, quelles données, quels outils autorisés ?', metiers: ['conformite'], deliverable: 'Charte d’usage en trois règles, plan de déploiement' },
        { quote: 'Un grand client me demande des garanties de sécurité.', decision: 'Quel niveau de preuve, à quel coût ?', metiers: ['conformite', 'technologie'], deliverable: 'Carte d’exposition et plan de mise à niveau priorisé' },
        { quote: 'Tout passe encore par moi.', decision: 'Quelles décisions déléguer, à qui, dans quelles limites ?', metiers: ['talent'], deliverable: 'Indice de dépendance et matrice de délégation' },
        { quote: 'Notre outil actuel ne tiendra pas le double de volume.', decision: 'Réparer, refaire ou remplacer ?', metiers: ['technologie'], deliverable: 'Test de réversibilité et arbitrage chiffré' },
        { quote: 'Il me faut un directeur financier ou opérationnel.', decision: 'Profil, moment du recrutement, rôle face au dirigeant', metiers: ['recruter'], deliverable: 'Fiche de poste, vivier, grille d’entretien' },
        { quote: 'Je dois ouvrir un deuxième marché ou une deuxième filiale.', decision: 'Quel rythme, quelles priorités, quel renoncement ?', metiers: ['strategie'], deliverable: 'Grille des quatre tests appliquée aux options' },
      ],
    },
    metiers: { mobilized: ['conformite', 'technologie', 'talent', 'recruter'], available: ['strategie', 'ma', 'construire'] },
    bySize: {
      title: 'Selon la taille',
      items: [
        { label: 'PME', desc: 'Fixer trois règles simples plutôt qu’un cadre lourd ; premier niveau de délégation.' },
        { label: 'ETI', desc: 'Coordonner plusieurs sites ou filiales sur une même politique ; comité de direction structuré.' },
      ],
    },
    bySector: {
      title: 'Selon le secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Cadres d’externalisation et de résilience opérationnelle.' },
        { cluster: 'Santé & Sciences de la Vie',               desc: 'Données patients, traçabilité.' },
        { cluster: 'Industrie, Énergie & Infrastructure',      desc: 'Sécurité des systèmes industriels, obligations des opérateurs critiques.' },
        { cluster: 'Commerce, Services & Expérience Client',   desc: 'Pics d’activité, données clients.' },
        { cluster: 'Tech, Innovation & Secteur Public',        desc: 'Exigences croissantes des donneurs d’ordre.' },
      ],
    },
    scenario: {
      tag:  'Scénario illustratif',
      text: 'Un éditeur de 25 M€ dont les clients sont des énergéticiens reçoit une demande de mesures de sécurité avant renouvellement. La carte d’exposition distingue les obligations réellement applicables des craintes générales, et ordonne les travaux sur douze mois.',
    },
    ai: {
      title: 'Ce qu’un outil d’IA généraliste ne fera pas à votre place',
      text:  'Décider ce qui reste centralisé, négocier avec un grand compte sur ce que vous pouvez réellement garantir, convaincre vos équipes d’appliquer une règle.',
    },
    diagnostic: {
      title: 'Auto-diagnostic',
      intro: 'Cinq questions pour situer votre capacité à grandir.',
      questions: [
        { q: 'Les décisions courantes passent-elles encore majoritairement par le dirigeant ?', goodIf: 'no' },
        { q: 'Avez-vous une règle écrite sur les données saisies dans les outils d’IA ?' },
        { q: 'Un client majeur vous a-t-il demandé des garanties que vous peiniez à documenter ?', goodIf: 'no' },
        { q: 'Votre système principal peut-il absorber le double de volume sans refonte ?' },
        { q: 'Votre comité de direction compte-t-il les fonctions nécessaires à la taille que vous visez ?' },
      ],
      levels: [
        { min: 4, label: 'Rythme tenu',        desc: 'Votre organisation tient son rythme de croissance : un échange de 30 minutes peut confirmer les points qui restent.', nextAction: 'Échanger 30 minutes' },
        { min: 2, label: 'À structurer',       desc: 'La croissance s’appuie encore sur des habitudes informelles : plusieurs points à structurer.', nextAction: 'Échanger 30 minutes' },
        { min: 0, label: 'Structure requise',  desc: 'Votre organisation a besoin de structure pour tenir sa croissance.', nextAction: 'Échanger 30 minutes' },
      ],
      privacy: 'Aucune donnée n’est enregistrée : le diagnostic se calcule dans votre navigateur.',
    },
    nextLabel: 'Cycle suivant',
    next:      [
      { label: 'Restructuration & Pivot',          slug: 'restructuration' },
      { label: 'Acquisition & Croissance externe', slug: 'acquisition' },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'restructuration',
    path: '/franchir/restructuration',
    meta: {
      title:       'Restructuration & Pivot — changer de cap sans perdre le contrôle | Aegryn',
      description: 'Perte d’un client majeur, incident, injonction réglementaire, marché qui bascule : les premières décisions sont les plus lourdes.',
    },
    eyebrow:  'Franchir · Restructuration & Pivot',
    h1:       'Changer de cap sans perdre le contrôle.',
    subtitle: 'Perte d’un client majeur, incident, injonction réglementaire, marché qui bascule : les premières décisions sont les plus lourdes.',
    verbs:    ['Arbitrer', 'Stabiliser', 'Pivoter'],
    constat: {
      text:   'La Banque de France recense 70 605 défaillances d’entreprises sur les douze mois à fin juillet 2026. En Suisse, les exploitants d’infrastructures critiques doivent signaler une cyberattaque dans les 24 heures à l’OFCS depuis le 1er avril 2025, sous peine d’une amende pouvant aller jusqu’à 100 000 CHF depuis le 1er octobre 2025.',
      source: 'Banque de France ; OFCS.',
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Un client représente une part majeure de mon CA et il part.', decision: 'Quelles priorités sur 90 jours, quelle trésorerie à protéger ?', metiers: ['strategie'], deliverable: 'Plan 30/60/90 jours présentable au conseil et à la banque' },
        { quote: 'Nous avons subi un incident. Que devons-nous déclarer ?', decision: 'Qui notifier, dans quel délai, avec quelles preuves ?', metiers: ['conformite'], deliverable: 'Note de position et séquence de notification' },
        { quote: 'Mon marché bascule avec l’IA.', decision: 'Quel pivot, avec quels actifs existants ?', metiers: ['strategie', 'technologie'], deliverable: 'Options de pivot comparées sur la Grille des quatre tests' },
        { quote: 'Il faut céder une activité pour tenir.', decision: 'Quel périmètre isoler, quels systèmes partagés ?', metiers: ['ma'], deliverable: 'Périmètre d’isolement, liste des dépendances' },
        { quote: 'Je dois réduire les coûts sans casser l’exécution.', decision: 'Quels coûts, quels délais, quels risques sociaux ?', metiers: ['talent'], deliverable: 'Plan de réorganisation et risques de départ de profils clés' },
        { quote: 'Il me faut un dirigeant de transition.', decision: 'Profil, mandat, durée', metiers: ['recruter'], deliverable: 'Fiche de mission et profils présélectionnés' },
      ],
    },
    metiers: { mobilized: ['strategie', 'conformite', 'recruter'], available: ['technologie', 'talent', 'ma', 'construire'] },
    bySize: {
      title: 'Selon la taille',
      items: [
        { label: 'PME', desc: 'Décisions concentrées sur une personne, cadre de 30 jours.' },
        { label: 'ETI', desc: 'Coordination du conseil d’administration, des financeurs et des filiales.' },
      ],
    },
    bySector: {
      title: 'Selon le secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Exigences des autorités de surveillance.' },
        { cluster: 'Santé & Sciences de la Vie',               desc: 'Continuité des soins et des autorisations.' },
        { cluster: 'Industrie, Énergie & Infrastructure',      desc: 'Continuité de production et obligations de signalement.' },
        { cluster: 'Commerce, Services & Expérience Client',   desc: 'Trésorerie et saisonnalité.' },
        { cluster: 'Tech, Innovation & Secteur Public',        desc: 'Engagements contractuels de niveau de service.' },
      ],
    },
    scenario: {
      tag:  'Scénario illustratif',
      text: 'Une société de services B2B de 40 M€ perd un client représentant un tiers de son CA. En dix jours : cartographie des coûts évitables, recentrage de l’offre, point avec la banque. Le plan 30/60/90 jours est présenté au conseil.',
    },
    ai: {
      title: 'Ce qu’un outil d’IA généraliste ne fera pas à votre place',
      text:  'Choisir quoi sacrifier, parler à votre banque et à vos équipes, répondre de la décision en situation d’urgence.',
    },
    diagnostic: {
      title: 'Auto-diagnostic',
      intro: 'Cinq questions pour situer votre exposition.',
      questions: [
        { q: 'Un client ou un fournisseur représente-t-il une part critique de votre activité ?', goodIf: 'no' },
        { q: 'Un événement (incident, injonction, perte de client) impose-t-il une décision dans les 30 jours ?', goodIf: 'no' },
        { q: 'Votre trésorerie est-elle projetée à 90 jours ?' },
        { q: 'Savez-vous quelles obligations de déclaration s’appliquent à votre organisation ?' },
        { q: 'Disposez-vous d’un plan écrit en cas de départ d’une personne clé ?' },
      ],
      levels: [
        { min: 4, label: 'Préparé',          desc: 'Votre organisation est préparée aux bascules.', nextAction: 'Échanger 30 minutes' },
        { min: 2, label: 'Fragilités',       desc: 'Des points de fragilité à traiter avant qu’ils ne deviennent urgents.', nextAction: 'Échanger 30 minutes' },
        { min: 0, label: 'À stabiliser',     desc: 'Plusieurs signaux demandent une décision rapide : priorité à la stabilisation.', nextAction: 'Échanger 30 minutes' },
      ],
      privacy: 'Aucune donnée n’est enregistrée : le diagnostic se calcule dans votre navigateur.',
    },
    nextLabel: 'Cycle suivant',
    next:      [
      { label: 'Acquisition & Croissance externe', slug: 'acquisition' },
      { label: 'Transmission & Cession',           slug: 'transmission' },
    ],
    urgency: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'acquisition',
    path: '/franchir/acquisition',
    meta: {
      title:       'Acquisition & Croissance externe — acheter en sachant ce que vous reprenez | Aegryn',
      description: 'Une acquisition se joue autant sur l’intégration que sur le prix : quatre angles morts, un plan d’intégration, des engagements de rétention.',
    },
    eyebrow:  'Franchir · Acquisition & Croissance externe',
    h1:       'Acheter en sachant ce que vous reprenez.',
    subtitle: 'Une acquisition se joue autant sur l’intégration que sur le prix.',
    verbs:    ['Évaluer', 'Intégrer', 'Retenir'],
    constat: {
      text:   'Les études compilées dans la Wiley Encyclopedia of Management situent l’échec des opérations de fusion-acquisition entre 48 % et 66 %, avec pour causes récurrentes la synergie surestimée, l’absence de plan d’intégration et un rythme trop lent. En Suisse, les transactions de PME ont atteint 208 opérations en 2025 (+16 %), dont +28 % dans les services informatiques et le logiciel.',
      source: 'Wiley Encyclopedia of Management ; SECO.',
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Nous avons trouvé une cible. Que regarder au-delà des comptes ?', decision: 'Quels points vérifier avant de s’engager ?', metiers: ['ma'], deliverable: 'Revue des quatre angles morts, avec les conditions à négocier' },
        { quote: 'Le code et les systèmes de la cible sont-ils sains ?', decision: 'Dépendances, licences, réversibilité', metiers: ['technologie'], deliverable: 'Rapport technique et coût de mise à niveau estimé' },
        { quote: 'Allons-nous garder ses équipes clés ?', decision: 'Qui retenir, avec quels engagements ?', metiers: ['talent'], deliverable: 'Indice de dépendance de la cible, plan de rétention' },
        { quote: 'Comment intégrer sans bloquer l’activité ?', decision: 'Séquence des 100 premiers jours', metiers: ['ma', 'technologie'], deliverable: 'Plan d’intégration jalonné' },
        { quote: 'Cette acquisition est-elle cohérente avec notre stratégie ?', decision: 'Thèse, priorités, renoncements', metiers: ['strategie'], deliverable: 'Grille des quatre tests appliquée à la cible' },
        { quote: 'La cible est-elle conforme aux règles qui nous engageront demain ?', decision: 'Quelles obligations reprenons-nous ?', metiers: ['conformite'], deliverable: 'Carte d’exposition de la cible' },
      ],
    },
    metiers: { mobilized: ['ma', 'technologie', 'strategie'], available: ['conformite', 'talent', 'recruter'] },
    bySize: {
      title: 'Selon la taille',
      items: [
        { label: 'PME', desc: 'Une acquisition peut peser un quart de l’activité ; l’intégration repose sur quelques personnes.' },
        { label: 'ETI', desc: 'Programme d’acquisitions successives, intégration à systématiser.' },
      ],
    },
    bySector: {
      title: 'Selon le secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Agréments et autorisations à transférer.' },
        { cluster: 'Santé & Sciences de la Vie',               desc: 'Conformité des produits repris.' },
        { cluster: 'Industrie, Énergie & Infrastructure',      desc: 'Sites, chaînes d’approvisionnement, actifs lourds.' },
        { cluster: 'Commerce, Services & Expérience Client',   desc: 'Bases clients et contrats.' },
        { cluster: 'Tech, Innovation & Secteur Public',        desc: 'Propriété et maintenabilité du code.' },
      ],
    },
    scenario: {
      tag:  'Scénario illustratif',
      text: 'Un groupe de services de 90 M€ envisage de racheter un éditeur de 8 M€. La revue des angles morts révèle la dépendance à deux développeurs et un composant sous licence restrictive. Le prix ne change pas ; des conditions de rétention et un plan de remplacement sont ajoutés à l’accord.',
    },
    ai: {
      title: 'Ce qu’un outil d’IA généraliste ne fera pas à votre place',
      text:  'Évaluer la fiabilité de l’équipe en face, négocier les engagements de rétention, décider de renoncer.',
    },
    mandate: 'Aegryn ne réalise pas la transaction. L’exécution est confiée à des banques d’affaires, boutiques M&A et avocats agréés.',
    diagnostic: {
      title: 'Auto-diagnostic',
      intro: 'Cinq questions oui/non avant de vous engager.',
      questions: [
        { q: 'Avez-vous défini par écrit la thèse de cette acquisition ?' },
        { q: 'Un plan d’intégration existe-t-il avant la signature ?' },
        { q: 'Connaissez-vous les trois à cinq personnes dont dépend la valeur de la cible ?' },
        { q: 'Les systèmes de la cible sont-ils compatibles avec les vôtres ?' },
        { q: 'L’exécution de la transaction est-elle confiée à des conseils agréés ?' },
      ],
      levels: [
        { min: 4, label: 'Approche structurée', desc: 'Votre approche est structurée : un échange de 30 minutes peut vérifier les derniers angles morts.', nextAction: 'Échanger 30 minutes' },
        { min: 2, label: 'À cadrer',            desc: 'Plusieurs points à cadrer avant de vous engager.', nextAction: 'Échanger 30 minutes' },
        { min: 0, label: 'Avant signature',     desc: 'Avant la signature, sécurisez les fondamentaux.', nextAction: 'Échanger 30 minutes' },
      ],
      privacy: 'Aucune donnée n’est enregistrée : le diagnostic se calcule dans votre navigateur.',
    },
    nextLabel: 'Cycle suivant',
    next:      [{ label: 'Transmission & Cession', slug: 'transmission' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'transmission',
    path: '/franchir/transmission',
    meta: {
      title:       'Transmission & Cession — préparer l’organisation à tenir sans vous | Aegryn',
      description: 'La transmission se prépare des années à l’avance. Ce qui la conditionne, c’est la capacité de l’organisation à fonctionner sans son dirigeant.',
    },
    eyebrow:  'Franchir · Transmission & Cession',
    h1:       'Préparer l’organisation à tenir sans vous.',
    subtitle: 'La transmission se prépare des années à l’avance. Ce qui la conditionne, c’est la capacité de l’organisation à fonctionner sans son dirigeant.',
    verbs:    ['Documenter', 'Déléguer', 'Passer le relais'],
    constat: {
      text:   'Selon Bpifrance Le Lab (nov. 2025), 40 % des dirigeants de TPE, PME et ETI prévoient de transmettre dans les cinq ans, soit 370 000 entreprises, et 23 % des cédants constatent un manque de repreneurs. 47 % des dirigeants d’entreprises familiales de 60 à 69 ans n’ont pas de plan de succession formalisé.',
      source: 'Bpifrance Le Lab.',
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Tout repose sur moi.', decision: 'Qui peut reprendre quoi, dans quel ordre ?', metiers: ['talent'], deliverable: 'Indice de dépendance, plan de délégation sur 24 mois' },
        { quote: 'Ma famille ou mes cadres reprendront-ils ?', decision: 'Option familiale, interne ou tierce', metiers: ['strategie', 'ma'], deliverable: 'Comparatif des trois options et calendrier' },
        { quote: 'Mes contrats et mes droits sont-ils en ordre ?', decision: 'Ce qu’un repreneur contrôlera', metiers: ['ma', 'conformite'], deliverable: 'Revue des angles morts côté vendeur, liste des corrections' },
        { quote: 'Mon système repose sur une personne.', decision: 'Documentation et réversibilité', metiers: ['technologie'], deliverable: 'Test de réversibilité et plan de documentation' },
        { quote: 'Je veux partir dans 24 mois.', decision: 'Calendrier, jalons, rôle après le départ', metiers: ['ma'], deliverable: 'Feuille de route à rebours' },
        { quote: 'Mon comité de direction n’est pas prêt à prendre le relais.', decision: 'Qui recruter, qui faire monter ?', metiers: ['recruter', 'talent'], deliverable: 'Profils et plan de montée en responsabilité' },
      ],
    },
    metiers: { mobilized: ['talent', 'ma'], available: ['strategie', 'technologie', 'conformite', 'recruter'] },
    bySize: {
      title: 'Selon la taille',
      items: [
        { label: 'PME', desc: 'Dirigeant-fondateur, dépendance forte, horizon de 2 à 3 ans.' },
        { label: 'ETI', desc: 'Conseil de famille, gouvernance, actionnaires multiples.' },
      ],
    },
    bySector: {
      title: 'Selon le secteur',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Agréments liés aux personnes.' },
        { cluster: 'Santé & Sciences de la Vie',               desc: 'Titulaires de licences et d’autorisations.' },
        { cluster: 'Industrie, Énergie & Infrastructure',      desc: 'Savoir-faire concentré, actifs lourds.' },
        { cluster: 'Commerce, Services & Expérience Client',   desc: 'Relation client portée par le dirigeant.' },
        { cluster: 'Tech, Innovation & Secteur Public',        desc: 'Connaissance du code concentrée chez quelques personnes.' },
      ],
    },
    scenario: {
      tag:  'Scénario illustratif',
      text: 'Une ETI familiale de 140 M€ dont le dirigeant a 63 ans. L’indice de dépendance montre que de nombreuses décisions remontent à lui seul. Plan sur 24 mois : délégation progressive, comité de direction renforcé, documentation des relations clients clés.',
    },
    ai: {
      title: 'Ce qu’un outil d’IA généraliste ne fera pas à votre place',
      text:  'Parler à votre famille et à vos cadres, choisir un successeur, accepter de lâcher certaines décisions.',
    },
    mandate: 'Aegryn prépare l’organisation. La vente est exécutée avec la banque d’affaires, la boutique M&A ou l’avocat du client.',
    diagnostic: {
      title: 'Auto-diagnostic',
      intro: 'Cinq questions oui/non pour situer votre préparation.',
      questions: [
        { q: 'Une décision importante peut-elle être prise sans vous ?' },
        { q: 'Votre succession est-elle formalisée par écrit ?' },
        { q: 'Vos relations clients clés sont-elles portées par plus d’une personne ?' },
        { q: 'Vos contrats, droits et données sont-ils documentés et à jour ?' },
        { q: 'Avez-vous une date cible pour votre départ ?' },
      ],
      levels: [
        { min: 4, label: 'Transmission engagée',  desc: 'Votre transmission est engagée dans de bonnes conditions.', nextAction: 'Échanger 30 minutes' },
        { min: 2, label: 'À documenter',          desc: 'Des points à documenter avant d’engager le calendrier.', nextAction: 'Échanger 30 minutes' },
        { min: 0, label: 'À préparer',            desc: 'La préparation de votre transmission commence maintenant.', nextAction: 'Échanger 30 minutes' },
      ],
      privacy: 'Aucune donnée n’est enregistrée : le diagnostic se calcule dans votre navigateur.',
    },
    nextLabel: 'Cycle précédent',
    next:      [{ label: 'Acquisition & Croissance externe', slug: 'acquisition' }],
  },
]
