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
      { title: "Certification CIFSO 5000", desc: "Évaluation indépendante des 5 dimensions Capital, Intégrité, Finance, Sécurité, Organisation — opposable en due diligence et auprès des régulateurs." },
      { title: "Conseil en Stratégie",     desc: "Positionnement, gouvernance et modèle économique face aux nouveaux entrants FinTech et à la pression réglementaire." },
      { title: "Conseil en Technologie",   desc: "Architecture système, migration cloud, souveraineté des données et conformité technique (DORA, NIS2, AI Act)." },
      { title: "M&A Advisory",             desc: "Préparation à la cession, structuration transaction et documentation valeur pour fonds PE et acquéreurs stratégiques." },
    ],
    segments: [
      { label: "Fonds de Private Equity", problems: [
        "Vérification de la qualité de données cibles",
        "Documentation de la gouvernance avant closing",
        "Défense de la thèse d'investissement face aux LPs",
      ]},
      { label: "FinTech en croissance", problems: [
        "Préparer un audit investisseur défendable",
        "Documenter la propriété intellectuelle des algorithmes",
        "Démontrer la conformité PSD2/DORA à un acquéreur",
      ]},
      { label: "Banques & Établissements", problems: [
        "Gouverner les risques IA selon EBA guidelines",
        "Documenter la résilience opérationnelle",
        "Gérer les dépendances technologiques critiques",
      ]},
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
      { title: "Certification CIFSO 5000", desc: "Documentation de la valeur des données cliniques, des protocoles et de la gouvernance qualité — opposable face à un acquéreur ou un partenaire industriel." },
      { title: "Conseil en Technologie",   desc: "Architecture HealthTech, conformité MDR, intégration HL7/FHIR, souveraineté des données patients." },
      { title: "Logiciels sur-mesure",     desc: "Plateformes de gestion clinique, outils d'IA diagnostique, systèmes d'interopérabilité adaptés aux contraintes réglementaires." },
      { title: "M&A Advisory",             desc: "Structuration des deals pharma et HealthTech, valorisation des IP cliniques, accompagnement due diligence acquéreur." },
    ],
    segments: [
      { label: "MedTech en croissance", problems: [
        "Préparer un dossier M&A défendable face à un industriel",
        "Documenter la conformité MDR/IVDR pour un investisseur",
        "Certifier la valeur des algorithmes diagnostiques",
      ]},
      { label: "Groupes pharmaceutiques", problems: [
        "Documenter la valeur des brevets et données cliniques",
        "Gouverner les transferts de données dans les cessions",
        "Préparer la due diligence data room",
      ]},
      { label: "Investisseurs HealthTech", problems: [
        "Vérifier la robustesse réglementaire d'une cible",
        "Évaluer la qualité de la gouvernance données",
        "Quantifier la valeur des actifs immatériels",
      ]},
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
      { title: "Certification CIFSO 5000", desc: "Documentation du savoir-faire opérationnel, des contrats long terme et de la gouvernance industrielle — base défendable pour tout financement ou cession." },
      { title: "Conseil en Stratégie",     desc: "Positionnement dans les consolidations sectorielles, gouvernance et planification de la transition." },
      { title: "Conseil en Technologie",   desc: "Architecture Industrie 4.0, intégration MES/ERP, conformité NIS2, souveraineté des données industrielles." },
      { title: "M&A Advisory",             desc: "Préparation cession ETI industrielle, structuration et accompagnement des processus acheteur/vendeur." },
    ],
    segments: [
      { label: "ETI & PME industrielles", problems: [
        "Documenter la valeur avant une cession ou une transmission",
        "Obtenir un financement bancaire sur la base des actifs incorporels",
        "Préparer une due diligence acheteur industriel",
      ]},
      { label: "Fonds PE / Infrastructure", problems: [
        "Vérifier la robustesse opérationnelle d'une cible",
        "Évaluer la dépendance aux personnes-clés",
        "Défendre la thèse de valeur face aux co-investisseurs",
      ]},
      { label: "Opérateurs énergie & utilities", problems: [
        "Documenter la résilience pour les régulateurs",
        "Préparer les actifs à un financement green bond",
        "Valoriser les plateformes digitales propriétaires",
      ]},
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
      { title: "Certification CIFSO 5000", desc: "Documentation des données clients, des marques et des plateformes propriétaires — base opposable pour M&A, financement ou succession." },
      { title: "Conseil en Stratégie",     desc: "Positionnement omnicanal, transformation du modèle économique et planification de la croissance." },
      { title: "Logiciels sur-mesure",     desc: "Plateformes e-commerce, outils de personnalisation IA, systèmes de fidélité et intégrations ERP/CRM." },
      { title: "M&A Advisory",             desc: "Valorisation des actifs digitaux, accompagnement des cessions retail et due diligence acheteur." },
    ],
    segments: [
      { label: "Retailers & e-commerçants", problems: [
        "Valoriser les données first-party avant une cession",
        "Documenter la plateforme pour un investisseur PE",
        "Préparer la due diligence sur les métriques clients",
      ]},
      { label: "Groupes médias & divertissement", problems: [
        "Certifier la valeur des IP contenus",
        "Documenter la base abonnés pour un acquéreur",
        "Préparer un deal structuré sur les droits",
      ]},
      { label: "Opérateurs télécoms", problems: [
        "Documenter les actifs d'infrastructure pour financement",
        "Préparer la conformité BEREC pour un rapprochement",
        "Valoriser une base abonnés B2B",
      ]},
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
      { title: "Certification CIFSO 5000", desc: "Évaluation indépendante des actifs SaaS et IA — métriques, gouvernance, IP et organisation — base défendable pour tout investisseur ou acquéreur." },
      { title: "Conseil en Technologie",   desc: "Architecture SaaS, migration cloud souverain, conformité AI Act/NIS2, réduction de la dette technique avant cession." },
      { title: "Logiciels sur-mesure",     desc: "Développement de produits SaaS, plateformes IA propriétaires et systèmes GovTech adaptés aux contraintes secteur public." },
      { title: "M&A Advisory",             desc: "Préparation à la cession SaaS, valorisation des métriques, data room et accompagnement closing." },
    ],
    segments: [
      { label: "Fondateurs SaaS & scale-ups", problems: [
        "Défendre les métriques NRR/churn face à un acquéreur PE",
        "Certifier la valeur du code et des IP avant due diligence",
        "Préparer une data room défendable en 90 jours",
      ]},
      { label: "Fonds venture & growth", problems: [
        "Vérifier la qualité des métriques d'un portefeuille",
        "Documenter la gouvernance avant une levée de fond",
        "Préparer un exit secondaire dans les meilleures conditions",
      ]},
      { label: "Acteurs GovTech & EdTech", problems: [
        "Certifier la conformité cloud souverain pour un marché public",
        "Documenter l'organisation avant une fusion",
        "Valoriser un actif public dans un contexte de privatisation",
      ]},
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
