/* ── Industries Aegryn — données statiques ─────────────────────────────── */

export type IndustrySlug =
  | 'finance-capital'
  | 'sante-sciences-de-la-vie'
  | 'industrie-energie-infrastructure'
  | 'commerce-services-experience-client'
  | 'tech-innovation-secteur-public'

export interface IndustrySector {
  name: string
  tag:  string
  desc: string
}

export interface IndustryExpertise {
  title: string
  desc:  string
}

export interface IndustrySegment {
  label:    string
  story:    string   // storytelling contextuel 1-2 phrases
  problems: string[]
}

export interface IndustryData {
  slug:        IndustrySlug
  clusterId:   string
  img:         string
  imgAlt:      string
  vision:      string
  keyMetrics:  { value: string; label: string }[]
  sectors:     IndustrySector[]
  expertise:   IndustryExpertise[]
  segments:    IndustrySegment[]
  articleSlugs: string[]
}

export const INDUSTRIES: IndustryData[] = [

  /* ════════════════════════════════════════════════════════════
     1. Finance & Capital
  ════════════════════════════════════════════════════════════ */
  {
    slug:      "finance-capital",
    clusterId: "finance",
    img:       "/images/theme_fintech.jpg",
    imgAlt:    "Finance & Capital — Aegryn",
    vision: `Les organisations financières opèrent dans un environnement de conformité permanente où chaque décision de valeur est exposée à un scrutin réglementaire et à une pression acheteur croissante. Leur valeur repose sur la qualité des données, la robustesse de la gouvernance et la crédibilité des métriques financières.

La Certification CIFSO 5000 est particulièrement pertinente pour documenter et défendre ce que les audits réglementaires ne capturent pas : l'intégrité opérationnelle, la souveraineté des données et la transmissibilité réelle.`,
    keyMetrics: [
      { value: "4,1 Tn EUR",  label: "actifs gérés par les fonds PE en Europe (Preqin 2024)" },
      { value: "47 Mrd EUR",  label: "investissement FinTech Europe 2023 (KPMG Pulse)" },
      { value: "3 ans",       label: "calendrier moyen de mise en conformité DORA (EBA 2024)" },
      { value: "68%",         label: "des deals M&A financiers bloqués par des lacunes de data governance (PwC 2024)" },
    ],
    sectors: [
      { name: "Banque & Services Financiers", tag: "Réglementé", desc: "Conformité DORA, Bâle IV, IA de risque crédit, modernisation back-office et résilience opérationnelle." },
      { name: "FinTech & Paiements",          tag: "Croissance", desc: "PSD2, open banking, AML/KYC, architectures paiement temps réel, tokenisation et métriques SaaS défendables." },
      { name: "PropTech & Immobilier",        tag: "Hybride",    desc: "Valorisation des actifs, IA scoring locataire, plateforme transaction, données ESG et dualité logiciel/actif physique." },
    ],
    expertise: [
      { title: "Certification CIFSO 5000", desc: "Évaluation indépendante des 5 dimensions CIFSO sur les actifs financiers et technologiques — documentation opposable en due diligence réglementaire, auprès des LPs et des régulateurs (EBA, FINMA, DORA)." },
      { title: "Conseil en Stratégie",     desc: "Positionnement face aux nouveaux entrants FinTech, refonte du modèle économique, gouvernance conseil d'administration et planification de la transformation réglementaire." },
      { title: "Conseil en Technologie",   desc: "Architecture système résiliente, migration cloud souverain européen, souveraineté des données financières et conformité technique DORA, NIS2, AI Act EBA." },
      { title: "M&A Advisory",             desc: "Préparation à la cession ou à l'acquisition dans le secteur financier : valorisation des actifs data, structuration transaction, accompagnement closing avec fonds PE et acquéreurs stratégiques." },
    ],
    segments: [
      {
        label: "Fonds de Private Equity",
        story: "Vous étudiez une cible dans les services financiers. La data room est incomplète, la gouvernance des données peu documentée et les régulateurs posent des questions. Vous avez besoin d'une évaluation indépendante pour sécuriser votre thèse avant le closing.",
        problems: [
          "Vérifier la qualité et la traçabilité des données d'une cible financière",
          "Obtenir une documentation de gouvernance opposable avant closing",
          "Défendre la thèse d'investissement face aux LPs avec un grade certifié",
        ],
      },
      {
        label: "FinTech en croissance",
        story: "Votre FinTech lève ou cherche un acquéreur. Vos métriques sont solides, mais votre algorithme de scoring, vos contrats PSD2 et votre IP ne sont pas documentés de façon défendable. Un investisseur veut une certification indépendante avant de s'engager.",
        problems: [
          "Préparer un dossier investisseur avec certification de la propriété algorithmique",
          "Documenter la conformité PSD2/DORA pour rassurer un acquéreur bancaire",
          "Structurer la valeur des données AML/KYC en actif certifiable",
        ],
      },
      {
        label: "Banques & Établissements financiers",
        story: "Vous gérez une transformation numérique dans un contexte DORA/NIS2 et devez démontrer votre résilience opérationnelle aux régulateurs. Vos dépendances technologiques critiques sont peu cartographiées et les risques IA non gouvernés selon les guidelines EBA.",
        problems: [
          "Gouverner les risques IA et les modèles d'alerte selon les EBA guidelines",
          "Documenter et certifier la résilience opérationnelle pour un audit DORA",
          "Cartographier et maîtriser les dépendances technologiques critiques",
        ],
      },
    ],
    articleSlugs: ["fintech-europe-ma-valorisation-2026", "family-office-investissement-actifs-tech", "fintech-finance-capital-enjeux-certification-cifso-2025"],
  },

  /* ════════════════════════════════════════════════════════════
     2. Santé & Sciences de la Vie
  ════════════════════════════════════════════════════════════ */
  {
    slug:      "sante-sciences-de-la-vie",
    clusterId: "sante",
    img:       "/images/grade-usecases/uc-due-diligence.jpg",
    imgAlt:    "Santé & Sciences de la Vie — Aegryn",
    vision: `Les organisations de santé et de sciences de la vie opèrent avec des exigences de conformité parmi les plus strictes au monde. Leur valeur tient à leur capital data clinique, à leurs protocoles propriétaires et à la solidité de leur gouvernance réglementaire.

La Certification CIFSO 5000 s'applique avec une granularité adaptée à ces contraintes : documenter la valeur des données de santé, la robustesse des process qualité et la transmissibilité de l'organisation à l'horizon d'une cession, d'un financement ou d'un partenariat industriel.`,
    keyMetrics: [
      { value: "278 Mrd EUR", label: "marché santé numérique mondial 2028 (Grand View Research 2024)" },
      { value: "2 ans",       label: "délai moyen certification MDR/IVDR pour un dispositif médical (CE 2023)" },
      { value: "+42%",        label: "croissance M&A HealthTech Europe 2022-2024 (Dealroom 2024)" },
      { value: "89%",         label: "des due diligences pharma bloquées par des manques de documentation données (EY 2023)" },
    ],
    sectors: [
      { name: "Santé & Pharmaceutique", tag: "Très réglementé", desc: "Données RGPD/HIPAA, interopérabilité HL7/FHIR, conformité EMA, chaîne d'approvisionnement et IP clinique." },
      { name: "HealthTech & MedTech",   tag: "Croissance",      desc: "IA diagnostique, conformité MDR/IVDR, données de santé, interopérabilité et valorisation pour M&A." },
    ],
    expertise: [
      { title: "Certification CIFSO 5000", desc: "Documentation certifiée de la valeur des données cliniques, des protocoles propriétaires et de la gouvernance qualité — opposable face à un acquéreur industriel, un régulateur EMA ou un partenaire pharmaceutique." },
      { title: "Conseil en Technologie",   desc: "Architecture HealthTech souveraine, conformité MDR/IVDR, intégration HL7/FHIR, gouvernance des données patients et sécurité des systèmes critiques de santé." },
      { title: "Solutions sur-mesure",     desc: "Plateformes de gestion clinique, outils d'IA diagnostique, systèmes d'interopérabilité et data rooms sécurisées — conçus pour les contraintes réglementaires de la santé." },
      { title: "M&A Advisory",             desc: "Structuration et accompagnement des deals pharma et HealthTech, valorisation des IP cliniques et algorithmes diagnostiques, préparation due diligence acquéreur industriel ou fonds." },
    ],
    segments: [
      {
        label: "MedTech en croissance",
        story: "Vous avez développé un dispositif médical avec IA diagnostique. Un industriel pharmaceutique s'intéresse à une acquisition, mais exige une documentation MDR/IVDR complète et une certification de la valeur de vos algorithmes avant d'engager ses équipes de due diligence.",
        problems: [
          "Préparer un dossier M&A défendable incluant la certification des algorithmes IA diagnostiques",
          "Documenter la conformité MDR/IVDR de façon opposable pour un investisseur industriel",
          "Structurer la valeur IP (brevets, datasets cliniques) en actif certifiable et transmissible",
        ],
      },
      {
        label: "Groupes pharmaceutiques",
        story: "Vous cédez une division ou externalisez un actif de R&D. Vos brevets, vos données cliniques et vos contrats fournisseurs sont dispersés. L'acquéreur exige une data room solide et une documentation de gouvernance des données qui tient face à un audit EMA.",
        problems: [
          "Documenter et certifier la valeur des brevets et datasets cliniques propriétaires",
          "Gouverner les transferts de données sensibles dans le cadre d'une cession d'actifs",
          "Préparer une data room certifiée défendable face à une due diligence pharmaceutique",
        ],
      },
      {
        label: "Investisseurs HealthTech",
        story: "Vous étudiez une cible HealthTech prometteuse dont la gouvernance réglementaire et la qualité des données sont difficiles à évaluer. Avant de signer, vous avez besoin d'une évaluation indépendante qui va au-delà des audits financiers classiques.",
        problems: [
          "Vérifier la robustesse réglementaire MDR/IVDR et RGPD santé d'une cible avant investissement",
          "Évaluer la qualité et la souveraineté des données patients comme actif de valeur",
          "Quantifier les actifs immatériels (IP clinique, algorithmes, protocoles) avec un référentiel certifié",
        ],
      },
    ],
    articleSlugs: ["actif-tech-certifiable", "certification-independante-saas-avant-cession", "sante-sciences-vie-valorisation-actifs-certification-2025"],
  },

  /* ════════════════════════════════════════════════════════════
     3. Industrie, Énergie & Infrastructure
  ════════════════════════════════════════════════════════════ */
  {
    slug:      "industrie-energie-infrastructure",
    clusterId: "industrie",
    img:       "/images/theme_marketplace.jpg",
    imgAlt:    "Industrie, Énergie & Infrastructure — Aegryn",
    vision: `Les organisations industrielles ont une valeur souvent sous-documentée : savoir-faire opérationnel, contrats long terme, propriété intellectuelle sur les processus, réseaux de sous-traitants stratégiques. Le CIFSO 5000 donne un langage commun entre le dirigeant qui connaît sa valeur et l'investisseur qui a besoin de la vérifier.

Dans les secteurs de la transition énergétique et de l'infrastructure, la robustesse des actifs et leur transmissibilité deviennent des critères de financement décisifs.`,
    keyMetrics: [
      { value: "1 Tn EUR",    label: "investissements infrastructure Europe 2021-2027 (Commission Européenne)" },
      { value: "500 Mrd EUR", label: "financements transition énergétique prévus en Europe d'ici 2030 (AIE 2024)" },
      { value: "+31%",        label: "croissance M&A industrie 4.0 Europe 2023-2024 (Mergermarket 2024)" },
      { value: "73%",         label: "des PME industrielles sans documentation de valeur transmissible (CCI France 2023)" },
    ],
    sectors: [
      { name: "Énergie & Utilities",          tag: "Stratégique",    desc: "Transition énergétique, smart grid, EU ETS, IA de gestion des actifs et résilience des infrastructures critiques." },
      { name: "Industrie & Manufacturing",    tag: "Consolidation",  desc: "Industrie 4.0, maintenance prédictive, MES/ERP, ISO qualité et base de valeur opposable." },
      { name: "Logistique & Supply Chain",    tag: "Récurrent",      desc: "Visibilité temps réel, IA optimisation flux, conformité douanière, 3PL/4PL et valeur récurrente." },
      { name: "Construction & Infrastructure",tag: "Complexe",       desc: "BIM, maintenance prédictive, contrats complexes, sous-traitants multi-niveaux et gouvernance." },
      { name: "Aérospatiale & Défense",       tag: "Confidentiel",   desc: "Systèmes embarqués, IA mission, ITAR/EAR, sous-traitants stratégiques et certification confidentielle." },
      { name: "Automobile & Mobilité",        tag: "Transformation", desc: "IA embarquée, Tier-1/2, électrification et MaaS — opportunités M&A inter-constructeurs." },
      { name: "Agriculture & Agroalimentaire",tag: "ESG",            desc: "Traçabilité, IA rendement, conformité sanitaire et IP propriétaires à certifier." },
      { name: "Chimie & Matériaux Avancés",   tag: "IP forte",       desc: "R&D data, REACH, contrats fournisseurs et propriété intellectuelle spécialisée." },
      { name: "Transport & Fret",             tag: "Consolidation",  desc: "Optimisation de flotte, conformité transport, plateformes digitales et valeur documentée." },
    ],
    expertise: [
      { title: "Certification CIFSO 5000", desc: "Documentation certifiée du savoir-faire opérationnel, des contrats long terme, des processus propriétaires et de la gouvernance industrielle — base défendable pour tout financement, cession ou succession d'ETI." },
      { title: "Conseil en Stratégie",     desc: "Positionnement dans les vagues de consolidation sectorielle (énergie, logistique, agroalimentaire), gouvernance dirigeante et planification de la transition industrielle et numérique." },
      { title: "Conseil en Technologie",   desc: "Architecture Industrie 4.0, intégration MES/ERP, surveillance prédictive, conformité NIS2 et souveraineté des données industrielles opérationnelles." },
      { title: "M&A Advisory",             desc: "Préparation à la cession d'ETI industrielle, structuration des processus acheteur/vendeur, valorisation des actifs opérationnels incorporels et accompagnement closing." },
    ],
    segments: [
      {
        label: "ETI & PME industrielles",
        story: "Vous dirigez une ETI industrielle en Suisse ou en Europe. La transmission approche — familiale, à un fonds ou à un repreneur industriel. Votre valeur est réelle mais peu documentée : savoir-faire, contrats long terme, dépendances sous-traitants. Les banques et les acquéreurs demandent des preuves.",
        problems: [
          "Documenter et certifier la valeur transmissible avant une cession ou une succession familiale",
          "Obtenir un financement bancaire basé sur les actifs incorporels opérationnels",
          "Préparer une due diligence acheteur industriel ou fonds dans les délais d'un process M&A",
        ],
      },
      {
        label: "Fonds PE & Infrastructure",
        story: "Vous investissez dans une cible industrielle ou d'infrastructure en Europe. La valorisation repose sur des actifs opérationnels difficiles à auditer : savoir-faire, contrats fournisseurs, personnes-clés, processus propriétaires. Vous avez besoin d'une évaluation indépendante avant de signer.",
        problems: [
          "Vérifier la robustesse opérationnelle et la dépendance aux personnes-clés d'une cible industrielle",
          "Évaluer les actifs incorporels (process, IP opérationnelle, contrats) avec un référentiel certifié",
          "Défendre la thèse de valeur auprès des co-investisseurs et des LPs avec une certification opposable",
        ],
      },
      {
        label: "Opérateurs énergie & utilities",
        story: "Vous gérez des actifs d'infrastructure critique — smart grid, production renouvelable, réseau de distribution. Vos régulateurs demandent des preuves de résilience, vos financeurs green bond exigent une documentation ESG et vous envisagez de valoriser vos plateformes digitales propriétaires.",
        problems: [
          "Documenter et certifier la résilience opérationnelle pour un audit réglementaire sectoriel",
          "Préparer les actifs digitaux propriétaires à un financement green bond ou infrastructure fund",
          "Valoriser les plateformes de gestion énergétique comme actifs certifiables et transmissibles",
        ],
      },
    ],
    articleSlugs: ["small-mid-cap-enjeux-entreprises-50-300m", "preparer-organisation-cession-levee-5-points", "industrie-energie-infrastructure-valeur-transmissible-2025"],
  },

  /* ════════════════════════════════════════════════════════════
     4. Commerce, Services & Expérience Client
  ════════════════════════════════════════════════════════════ */
  {
    slug:      "commerce-services-experience-client",
    clusterId: "commerce",
    img:       "/images/theme_saas.jpg",
    imgAlt:    "Commerce, Services & Expérience Client — Aegryn",
    vision: `Les organisations du commerce, des services et de l'expérience client naviguent entre des cycles d'innovation très courts, des attentes consommateurs en transformation permanente et une pression réglementaire croissante sur les données et la publicité numérique.

Leur valeur repose sur la fidélité client, les données propriétaires et la robustesse des plateformes. La Certification CIFSO 5000 structure ce capital immatériel en un référentiel indépendant et défendable face aux investisseurs et acquéreurs.`,
    keyMetrics: [
      { value: "887 Mrd EUR",  label: "e-commerce Europe 2024 (Eurostat / E-commerce Europe)" },
      { value: "11,5 Mrd EUR", label: "M&A retail & services Europe 2023 (Refinitiv 2024)" },
      { value: "66%",          label: "des deals retail bloqués par des manques de documentation data clients (Gartner 2023)" },
      { value: "4,6 Mrd EUR",  label: "tourisme & hôtellerie M&A Europe 2023 (UNWTO / Dealroom)" },
    ],
    sectors: [
      { name: "Retail & E-commerce",           tag: "Masse",        desc: "Plateformes omnicanales, IA personnalisation, logistique last-mile et données first-party défendables." },
      { name: "Hôtellerie & Tourisme",          tag: "Récupération", desc: "Revenue management, expérience digitale, ESG et valorisation des marques hôtelières pour cession." },
      { name: "Luxe & Retail Premium",          tag: "IP forte",     desc: "Marques, exclusivité, données clientèle premium et gouvernance IP dans les structures de groupe." },
      { name: "Médias & Entertainment",         tag: "Disruption",   desc: "Streaming, gaming, IP contenus, monétisation et régulation DSA/droits voisins." },
      { name: "Télécommunications",             tag: "Réglementé",   desc: "Infrastructures, conformité BEREC, déploiement fibre/5G et valorisation des bases abonnés." },
    ],
    expertise: [
      { title: "Certification CIFSO 5000", desc: "Documentation certifiée des données clients first-party, des marques, des plateformes propriétaires et des IP contenus — base opposable pour M&A, financement ou succession dans les secteurs du commerce et des services." },
      { title: "Conseil en Stratégie",     desc: "Positionnement omnicanal, transformation du modèle économique face aux plateformes, consolidation sectorielle retail et planification de la croissance internationale." },
      { title: "Solutions sur-mesure",     desc: "Plateformes e-commerce propriétaires, outils de personnalisation IA, systèmes de fidélité avancés et intégrations ERP/CRM — conçus pour la performance et la certification." },
      { title: "M&A Advisory",             desc: "Valorisation des actifs digitaux et des IP contenus, accompagnement des cessions retail et médias, structuration des deals sur droits numériques et due diligence acheteur." },
    ],
    segments: [
      {
        label: "Retailers & e-commerçants",
        story: "Vous avez construit une base client propriétaire et une plateforme e-commerce performante. Un fonds PE ou un acquéreur stratégique s'intéresse à votre actif. Mais vos données first-party, votre plateforme et vos métriques de fidélité ne sont pas documentées de façon défendable pour une due diligence.",
        problems: [
          "Certifier la valeur des données clients first-party comme actif indépendant transmissible",
          "Documenter la plateforme propriétaire et ses métriques pour un investisseur PE",
          "Préparer la due diligence sur les indicateurs de rétention, LTV et performance omnicanale",
        ],
      },
      {
        label: "Groupes médias & divertissement",
        story: "Vous gérez un catalogue de contenus ou une base d'abonnés significative. Un acquéreur ou un partenaire de distribution veut comprendre la valeur de vos droits, de votre audience et de vos IP. La documentation est fragmentée entre vos équipes créatives, juridiques et techniques.",
        problems: [
          "Certifier la valeur des IP contenus et des droits numériques pour un deal de cession ou de licence",
          "Documenter et valoriser la base abonnés comme actif défendable face à un acquéreur ou distributeur",
          "Structurer un deal sur droits avec une documentation de gouvernance IP complète et certifiable",
        ],
      },
      {
        label: "Opérateurs télécoms & services",
        story: "Vous opérez une infrastructure ou une base d'abonnés B2B significative et envisagez un rapprochement ou une cession partielle. La conformité BEREC, la documentation de vos actifs d'infrastructure et la valorisation de vos contrats long terme sont des prérequis que votre acquéreur potentiel exige dès la phase d'exclusivité.",
        problems: [
          "Documenter et certifier les actifs d'infrastructure pour un financement ou une opération de fusion",
          "Préparer la conformité réglementaire BEREC dans le cadre d'un rapprochement transfrontalier",
          "Valoriser une base abonnés B2B avec des métriques de récurrence certifiables et transmissibles",
        ],
      },
    ],
    articleSlugs: ["valoriser-application-mobile-cession", "marche-ma-tech-europe-q4-2026", "commerce-services-experience-client-capital-donnees-2025"],
  },

  /* ════════════════════════════════════════════════════════════
     5. Tech, Innovation & Secteur Public
  ════════════════════════════════════════════════════════════ */
  {
    slug:      "tech-innovation-secteur-public",
    clusterId: "tech",
    img:       "/images/theme_AI.jpg",
    imgAlt:    "Tech, Innovation & Secteur Public — Aegryn",
    vision: `Les organisations technologiques et innovantes font face à un paradoxe structurel : une valeur intrinsèque élevée mais souvent indéfendable face aux investisseurs et régulateurs. Leur capital repose sur des actifs immatériels — code, données, algorithmes, équipes — dont la documentation est insuffisante.

La Certification CIFSO 5000 résout ce paradoxe en fournissant une évaluation indépendante sur 5 dimensions adaptée aux réalités des SaaS, de l'IA et du secteur public numérique.`,
    keyMetrics: [
      { value: "131 Mrd EUR", label: "investissement VC tech Europe 2023 (Atomico State of European Tech 2023)" },
      { value: "52 Mrd EUR",  label: "M&A software & SaaS Europe 2023 (Refinitiv / Dealroom)" },
      { value: "4,5x ARR",    label: "multiple médian SaaS B2B Europe mid-market 2024 (SaaS Capital 2024)" },
      { value: "41 Mrd EUR",  label: "marché cloud souverain Europe 2028 estimé (IDC / Gartner 2024)" },
    ],
    sectors: [
      { name: "Technologie & SaaS",       tag: "Coeur de métier", desc: "Multiples ARR, métriques SaaS (NRR, churn, LTV/CAC), scalabilité et dette technique." },
      { name: "Éducation & EdTech",       tag: "Croissance",      desc: "LMS, IA pédagogique, marchés B2B/B2G et modèles freemium à monétisation mixte." },
      { name: "GovTech & Secteur Public", tag: "Souveraineté",    desc: "Marchés publics, conformité DINUM/ANSSI, cloud souverain et interopérabilité." },
    ],
    expertise: [
      { title: "Certification CIFSO 5000", desc: "Évaluation indépendante des actifs SaaS et IA sur les 5 dimensions CIFSO — métriques ARR/NRR, gouvernance IP, architecture et organisation — base certifiée défendable face à tout investisseur, acquéreur ou régulateur." },
      { title: "Conseil en Technologie",   desc: "Architecture SaaS multi-tenant, migration cloud souverain européen, réduction de la dette technique avant cession et conformité AI Act / NIS2 pour les organisations technologiques." },
      { title: "Solutions sur-mesure",     desc: "Développement de produits SaaS B2B, plateformes IA propriétaires certifiables et systèmes GovTech adaptés aux contraintes d'interopérabilité et de souveraineté du secteur public." },
      { title: "M&A Advisory",             desc: "Préparation à la cession SaaS ou IA, valorisation et documentation des métriques (ARR, NRR, churn, LTV/CAC), constitution data room et accompagnement du closing avec fonds PE ou acquéreur stratégique." },
    ],
    segments: [
      {
        label: "Fondateurs SaaS & scale-ups tech",
        story: "Vous avez construit un SaaS B2B avec de solides métriques ARR. Un fonds PE ou un acquéreur stratégique entre en process. Ils demandent une certification indépendante de vos métriques, de votre gouvernance IP et de votre architecture avant d'engager leurs équipes juridiques. Vous avez 90 jours.",
        problems: [
          "Certifier et défendre les métriques NRR, churn et LTV/CAC face à un acquéreur PE exigeant",
          "Documenter la propriété du code, des algorithmes et des données en actifs IP certifiés",
          "Préparer une data room complète et défendable dans les délais d'un process M&A SaaS",
        ],
      },
      {
        label: "Fonds venture & growth",
        story: "Vous gérez un portefeuille de SaaS B2B européens. Sur plusieurs participations, les métriques déclarées sont difficiles à auditer indépendamment et la gouvernance IP est insuffisamment documentée. Vous préparez un exit secondaire ou un tour de table et avez besoin d'une base certifiée.",
        problems: [
          "Vérifier indépendamment la qualité et la robustesse des métriques SaaS d'une participation",
          "Documenter et certifier la gouvernance et l'architecture avant une levée de fond série B ou C",
          "Préparer les conditions d'un exit secondaire ou d'un processus dual-track dans les meilleures conditions",
        ],
      },
      {
        label: "Acteurs GovTech & EdTech",
        story: "Vous opérez une plateforme numérique pour le secteur public ou l'éducation. Un marché public exige une certification cloud souverain, un partenaire industriel veut fusionner et une administration régionale envisage une reprise partielle. Chaque scénario exige une documentation différente mais toutes reposent sur les mêmes actifs.",
        problems: [
          "Certifier la conformité cloud souverain DINUM/ANSSI pour l'éligibilité aux marchés publics",
          "Documenter l'organisation et la gouvernance avant une fusion ou un rapprochement inter-acteurs",
          "Valoriser un actif numérique public ou parapublic dans un contexte de privatisation ou de spin-off",
        ],
      },
    ],
    articleSlugs: ["ai-native-saas-valorisation-multiples-2026", "nrr-churn-ltv-cac-metriques-valorisation-saas", "tech-innovation-secteur-public-certification-saas-ia-2025"],
  },
]

export function getIndustry(slug: string): IndustryData | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}

export function getOtherIndustries(currentSlug: string): IndustryData[] {
  return INDUSTRIES.filter(i => i.slug !== currentSlug)
}
