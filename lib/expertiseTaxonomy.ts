// lib/expertiseTaxonomy.ts
// NE JAMAIS modifier cette taxonomy sans validation explicite de Yohann Bollack

export type Dimension = 'tech' | 'transaction' | 'both'

export interface Specialty {
  id: string
  label: string
  labelFr: string
  labelEn: string
  labelDe: string
  labelEs: string
  labelIt: string
  labelNl: string
  description: string
  descriptionFr: string
  cifs?: ('C' | 'I' | 'F' | 'S')[]
  regulatory?: boolean
}

export interface Category {
  id: string
  label: string
  labelFr: string
  labelEn: string
  labelDe: string
  labelEs: string
  labelIt: string
  labelNl: string
  dimension: Dimension
  specialties: Specialty[]
}

export const EXPERTISE_TAXONOMY: Category[] = [

  // ── DIMENSION TECH ──────────────────────────────────────────────────────────

  {
    id: 'security',
    label: 'Security & Cybersecurity',
    labelFr: 'Sécurité & Cybersécurité',
    labelEn: 'Security & Cybersecurity',
    labelDe: 'Sicherheit & Cybersicherheit',
    labelEs: 'Seguridad & Ciberseguridad',
    labelIt: 'Sicurezza & Cybersicurezza',
    labelNl: 'Beveiliging & Cyberbeveiliging',
    dimension: 'tech',
    specialties: [
      {
        id: 'sec-pentest',
        label: 'Penetration Testing',
        labelFr: 'Tests d\'intrusion (Pentest)',
        labelEn: 'Penetration Testing',
        labelDe: 'Penetrationstests',
        labelEs: 'Pruebas de intrusión (Pentest)',
        labelIt: 'Test di intrusione (Pentest)',
        labelNl: 'Penetratietesten',
        description: 'Black/grey/white box, attack surface — application & cloud',
        descriptionFr: 'Black/grey/white box, surface d\'attaque applicative et cloud',
        cifs: ['C', 'S'],
      },
      {
        id: 'sec-appsec',
        label: 'Application Security',
        labelFr: 'Sécurité applicative',
        labelEn: 'Application Security',
        labelDe: 'Anwendungssicherheit',
        labelEs: 'Seguridad de aplicaciones',
        labelIt: 'Sicurezza applicativa',
        labelNl: 'Applicatiebeveiliging',
        description: 'OWASP, SAST/DAST, secure code review',
        descriptionFr: 'OWASP, SAST/DAST, revue de code sécurisé',
        cifs: ['C', 'S'],
      },
      {
        id: 'sec-cloud',
        label: 'Cloud Security',
        labelFr: 'Sécurité cloud',
        labelEn: 'Cloud Security',
        labelDe: 'Cloud-Sicherheit',
        labelEs: 'Seguridad en la nube',
        labelIt: 'Sicurezza cloud',
        labelNl: 'Cloudbeveiliging',
        description: 'AWS/GCP/Azure security posture, IAM, encryption',
        descriptionFr: 'AWS/GCP/Azure security posture, IAM, chiffrement',
        cifs: ['S'],
      },
      {
        id: 'sec-nis2',
        label: 'NIS2 Compliance',
        labelFr: 'Conformité NIS2',
        labelEn: 'NIS2 Compliance',
        labelDe: 'NIS2-Konformität',
        labelEs: 'Conformidad NIS2',
        labelIt: 'Conformità NIS2',
        labelNl: 'NIS2-naleving',
        description: 'NIS2 directive — requirements for critical tech assets',
        descriptionFr: 'Directive NIS2 — exigences applicables aux actifs tech critiques',
        cifs: ['S'],
        regulatory: true,
      },
    ],
  },

  {
    id: 'architecture',
    label: 'Technical Architecture & Engineering',
    labelFr: 'Architecture technique & Ingénierie',
    labelEn: 'Technical Architecture & Engineering',
    labelDe: 'Technische Architektur & Engineering',
    labelEs: 'Arquitectura técnica & Ingeniería',
    labelIt: 'Architettura tecnica & Ingegneria',
    labelNl: 'Technische architectuur & Engineering',
    dimension: 'tech',
    specialties: [
      {
        id: 'arch-cto',
        label: 'CTO as a Service',
        labelFr: 'CTO externalisé',
        labelEn: 'CTO as a Service',
        labelDe: 'CTO als Dienstleistung',
        labelEs: 'CTO como servicio',
        labelIt: 'CTO come servizio',
        labelNl: 'CTO als dienst',
        description: 'Technical leadership, stack review, technology choices',
        descriptionFr: 'Direction technique, revue stack, choix technologiques',
        cifs: ['C'],
      },
      {
        id: 'arch-scalability',
        label: 'Scalability & Performance',
        labelFr: 'Scalabilité & Performance',
        labelEn: 'Scalability & Performance',
        labelDe: 'Skalierbarkeit & Performance',
        labelEs: 'Escalabilidad & Rendimiento',
        labelIt: 'Scalabilità & Performance',
        labelNl: 'Schaalbaarheid & Prestaties',
        description: 'Load audit, distributed architecture, optimisation',
        descriptionFr: 'Audit de charge, architecture distribuée, optimisation',
        cifs: ['C'],
      },
      {
        id: 'arch-devsecops',
        label: 'DevSecOps & Software Quality',
        labelFr: 'DevSecOps & Qualité logicielle',
        labelEn: 'DevSecOps & Software Quality',
        labelDe: 'DevSecOps & Softwarequalität',
        labelEs: 'DevSecOps & Calidad de software',
        labelIt: 'DevSecOps & Qualità del software',
        labelNl: 'DevSecOps & Softwarekwaliteit',
        description: 'CI/CD, test coverage, technical debt, observability',
        descriptionFr: 'CI/CD, couverture tests, dette technique, observabilité',
        cifs: ['C'],
      },
      {
        id: 'arch-migration',
        label: 'Cloud Migration & Modernisation',
        labelFr: 'Migration cloud & Modernisation',
        labelEn: 'Cloud Migration & Modernisation',
        labelDe: 'Cloud-Migration & Modernisierung',
        labelEs: 'Migración a la nube & Modernización',
        labelIt: 'Migrazione cloud & Modernizzazione',
        labelNl: 'Cloudmigratie & Modernisering',
        description: 'Refactoring, infrastructure migration, containerisation',
        descriptionFr: 'Refactoring, migration infrastructure, containerisation',
        cifs: ['C'],
      },
    ],
  },

  {
    id: 'data-ai',
    label: 'Data & Artificial Intelligence',
    labelFr: 'Data & Intelligence Artificielle',
    labelEn: 'Data & Artificial Intelligence',
    labelDe: 'Daten & Künstliche Intelligenz',
    labelEs: 'Datos & Inteligencia Artificial',
    labelIt: 'Dati & Intelligenza Artificiale',
    labelNl: 'Data & Kunstmatige intelligentie',
    dimension: 'tech',
    specialties: [
      {
        id: 'data-strategy',
        label: 'AI Strategy & Automation',
        labelFr: 'Stratégie IA & Automatisation',
        labelEn: 'AI Strategy & Automation',
        labelDe: 'KI-Strategie & Automatisierung',
        labelEs: 'Estrategia IA & Automatización',
        labelIt: 'Strategia IA & Automazione',
        labelNl: 'AI-strategie & Automatisering',
        description: 'AI roadmap, use case identification, ROI',
        descriptionFr: 'Feuille de route IA, identification cas d\'usage, ROI',
        cifs: ['C'],
      },
      {
        id: 'data-mlops',
        label: 'ML Engineering & MLOps',
        labelFr: 'Ingénierie ML & MLOps',
        labelEn: 'ML Engineering & MLOps',
        labelDe: 'ML-Engineering & MLOps',
        labelEs: 'Ingeniería ML & MLOps',
        labelIt: 'Ingegneria ML & MLOps',
        labelNl: 'ML-engineering & MLOps',
        description: 'ML pipelines, model deployment, drift monitoring',
        descriptionFr: 'Pipelines ML, déploiement modèles, monitoring drift',
        cifs: ['C'],
      },
      {
        id: 'data-governance',
        label: 'Data Governance & Architecture',
        labelFr: 'Gouvernance & Architecture data',
        labelEn: 'Data Governance & Architecture',
        labelDe: 'Data Governance & Architektur',
        labelEs: 'Gobernanza & Arquitectura de datos',
        labelIt: 'Governance & Architettura dati',
        labelNl: 'Data governance & Architectuur',
        description: 'Data warehouse, data lake, sovereignty, modelling',
        descriptionFr: 'Data warehouse, data lake, souveraineté, modélisation',
        cifs: ['C', 'S'],
      },
      {
        id: 'data-eu-ai-act',
        label: 'EU AI Act Compliance',
        labelFr: 'Conformité EU AI Act',
        labelEn: 'EU AI Act Compliance',
        labelDe: 'EU-KI-Gesetz-Konformität',
        labelEs: 'Conformidad EU AI Act',
        labelIt: 'Conformità EU AI Act',
        labelNl: 'EU AI Act-naleving',
        description: 'AI system classification, regulatory documentation, red-teaming',
        descriptionFr: 'Classification systèmes IA, documentation réglementaire, red-teaming',
        cifs: ['C', 'S'],
        regulatory: true,
      },
    ],
  },

  {
    id: 'product-ux',
    label: 'Product & User Experience',
    labelFr: 'Produit & Expérience utilisateur',
    labelEn: 'Product & User Experience',
    labelDe: 'Produkt & Nutzererfahrung',
    labelEs: 'Producto & Experiencia de usuario',
    labelIt: 'Prodotto & Esperienza utente',
    labelNl: 'Product & Gebruikerservaring',
    dimension: 'tech',
    specialties: [
      {
        id: 'prod-management',
        label: 'Product Management',
        labelFr: 'Product Management',
        labelEn: 'Product Management',
        labelDe: 'Produktmanagement',
        labelEs: 'Gestión de producto',
        labelIt: 'Product Management',
        labelNl: 'Productmanagement',
        description: 'Backlog, roadmap, activation/retention metrics',
        descriptionFr: 'Backlog, roadmap, métriques activation/rétention',
        cifs: ['C'],
      },
      {
        id: 'prod-ux-design',
        label: 'UX/UI Design',
        labelFr: 'Design UX/UI',
        labelEn: 'UX/UI Design',
        labelDe: 'UX/UI-Design',
        labelEs: 'Diseño UX/UI',
        labelIt: 'Design UX/UI',
        labelNl: 'UX/UI-ontwerp',
        description: 'User journeys, design system, usability testing',
        descriptionFr: 'Parcours utilisateurs, design system, tests d\'utilisabilité',
        cifs: ['C'],
      },
      {
        id: 'prod-accessibility',
        label: 'Digital Accessibility (EAA)',
        labelFr: 'Accessibilité numérique (EAA)',
        labelEn: 'Digital Accessibility (EAA)',
        labelDe: 'Digitale Barrierefreiheit (EAA)',
        labelEs: 'Accesibilidad digital (EAA)',
        labelIt: 'Accessibilità digitale (EAA)',
        labelNl: 'Digitale toegankelijkheid (EAA)',
        description: 'WCAG 2.1 AA — European Accessibility Act, mandatory EU June 2025',
        descriptionFr: 'WCAG 2.1 AA — European Accessibility Act, obligatoire UE juin 2025',
        cifs: ['C'],
        regulatory: true,
      },
      {
        id: 'prod-rgpd',
        label: 'RGPD / LPD & Privacy by Design',
        labelFr: 'RGPD / LPD & Privacy by Design',
        labelEn: 'GDPR / LPD & Privacy by Design',
        labelDe: 'DSGVO / DSG & Privacy by Design',
        labelEs: 'RGPD / LPD & Privacy by Design',
        labelIt: 'RGPD / LPD & Privacy by Design',
        labelNl: 'AVG / LPD & Privacy by Design',
        description: 'Processing register, DPA, Swiss LPD, cross-border transfers',
        descriptionFr: 'Registre traitements, DPA, conformité suisse LPD, transferts hors UE',
        cifs: ['S'],
        regulatory: true,
      },
    ],
  },

  // ── DIMENSION TRANSACTION ───────────────────────────────────────────────────

  {
    id: 'transaction',
    label: 'M&A Transaction Advisory',
    labelFr: 'Advisory Transaction M&A',
    labelEn: 'M&A Transaction Advisory',
    labelDe: 'M&A-Transaktionsberatung',
    labelEs: 'Asesoría en transacciones M&A',
    labelIt: 'Advisory transazioni M&A',
    labelNl: 'M&A transactieadvies',
    dimension: 'transaction',
    specialties: [
      {
        id: 'trans-valuation',
        label: 'Valuation & Market Benchmark',
        labelFr: 'Valorisation & Benchmark marché',
        labelEn: 'Valuation & Market Benchmark',
        labelDe: 'Bewertung & Markt-Benchmark',
        labelEs: 'Valoración & Benchmark de mercado',
        labelIt: 'Valutazione & Benchmark di mercato',
        labelNl: 'Waardering & Marktbenchmark',
        description: 'ARR multiple, Quality of Earnings, sector comparables',
        descriptionFr: 'ARR multiple, Quality of Earnings, comparables sectoriels',
        cifs: ['F'],
      },
      {
        id: 'trans-vendor-readiness',
        label: 'Vendor Readiness',
        labelFr: 'Préparation dossier vendeur',
        labelEn: 'Vendor Readiness',
        labelDe: 'Verkäufer-Vorbereitung',
        labelEs: 'Preparación del dossier vendedor',
        labelIt: 'Preparazione dossier venditore',
        labelNl: 'Voorbereiding verkoopsdossier',
        description: 'Pre-submission audit, data room, compliance',
        descriptionFr: 'Audit du dossier avant soumission Aegryn, data room, conformité',
        cifs: ['C', 'I', 'F', 'S'],
      },
      {
        id: 'trans-ip-law',
        label: 'Digital Law & IP',
        labelFr: 'Droit numérique & Propriété intellectuelle',
        labelEn: 'Digital Law & IP',
        labelDe: 'Digitalrecht & geistiges Eigentum',
        labelEs: 'Derecho digital & Propiedad intelectual',
        labelIt: 'Diritto digitale & Proprietà intellettuale',
        labelNl: 'Digitaal recht & Intellectueel eigendom',
        description: 'IP ownership chain, open-source licences, trademarks, contracts',
        descriptionFr: 'Chaîne de propriété IP, licences open-source, marques, contrats',
        cifs: ['I'],
      },
      {
        id: 'trans-spa',
        label: 'Transaction Law & M&A Docs',
        labelFr: 'Droit des transactions & Documentation M&A',
        labelEn: 'Transaction Law & M&A Docs',
        labelDe: 'Transaktionsrecht & M&A-Dokumentation',
        labelEs: 'Derecho de transacciones & Documentación M&A',
        labelIt: 'Diritto delle transazioni & Documentazione M&A',
        labelNl: 'Transactierecht & M&A-documentatie',
        description: 'SPA, SHA, LOI, APA, conditions precedent, reps & warranties',
        descriptionFr: 'SPA, SHA, LOI, APA, conditions suspensives, reps & warranties',
        cifs: ['F', 'I'],
      },
      {
        id: 'trans-hr-dd',
        label: 'HR & Employment Due Diligence',
        labelFr: 'Due diligence RH & Social',
        labelEn: 'HR & Employment Due Diligence',
        labelDe: 'HR & Arbeitsrecht Due Diligence',
        labelEs: 'Due diligence laboral & RRHH',
        labelIt: 'Due diligence HR & Lavoro',
        labelNl: 'HR & arbeidsrecht due diligence',
        description: 'Key contracts, BSPCE, social liabilities, contractor classification',
        descriptionFr: 'Contrats clés, BSPCE, passifs sociaux, classification prestataires',
        cifs: ['F'],
      },
      {
        id: 'trans-sectoral',
        label: 'Sectoral Regulatory Due Diligence',
        labelFr: 'Due diligence réglementaire sectorielle',
        labelEn: 'Sectoral Regulatory Due Diligence',
        labelDe: 'Sektorale regulatorische Due Diligence',
        labelEs: 'Due diligence regulatoria sectorial',
        labelIt: 'Due diligence regolatoria settoriale',
        labelNl: 'Sectorale regelgevende due diligence',
        description: 'FinTech (DORA/FINMA), HealthTech (HDS), LegalTech (UPL), EdTech',
        descriptionFr: 'FinTech (DORA/FINMA), HealthTech (HDS), LegalTech (UPL), EdTech',
        cifs: ['S'],
        regulatory: true,
      },
      {
        id: 'trans-wi',
        label: 'Warranty & Indemnity Insurance',
        labelFr: 'Assurance W&I',
        labelEn: 'Warranty & Indemnity Insurance',
        labelDe: 'Gewährleistungs- & Freistellungsversicherung',
        labelEs: 'Seguro de garantías e indemnizaciones (W&I)',
        labelIt: 'Assicurazione Warranty & Indemnity',
        labelNl: 'Garantie- en vrijwaringsverzekering (W&I)',
        description: 'Insurer introduction for transactions +500K€',
        descriptionFr: 'Introduction assureurs pour transactions +500K€',
      },
      {
        id: 'trans-tax',
        label: 'Tax & Corporate Structuring',
        labelFr: 'Structuration fiscale & Corporate',
        labelEn: 'Tax & Corporate Structuring',
        labelDe: 'Steuerliche & gesellschaftsrechtliche Strukturierung',
        labelEs: 'Estructuración fiscal & Corporativa',
        labelIt: 'Strutturazione fiscale & Corporate',
        labelNl: 'Fiscale & vennootschapsrechtelijke structurering',
        description: 'Seller exit optimisation, holding/SPV, France/Switzerland/Luxembourg',
        descriptionFr: 'Optimisation sortie vendeurs, holding/SPV, France/Suisse/Luxembourg',
        cifs: ['F'],
      },
      {
        id: 'trans-financing',
        label: 'Financing & Financial Partners',
        labelFr: 'Financement & Partenaires financiers',
        labelEn: 'Financing & Financial Partners',
        labelDe: 'Finanzierung & Finanzpartner',
        labelEs: 'Financiación & Socios financieros',
        labelIt: 'Finanziamento & Partner finanziari',
        labelNl: 'Financiering & Financiële partners',
        description: 'Bridge, co-investment, mezzanine debt',
        descriptionFr: 'Bridge, co-investissement, dette mezzanine',
        cifs: ['F'],
      },
      {
        id: 'trans-earnout',
        label: 'Earn-out Design & KPI Framework',
        labelFr: 'Design d\'earnout & Cadre KPI',
        labelEn: 'Earn-out Design & KPI Framework',
        labelDe: 'Earn-out-Design & KPI-Rahmen',
        labelEs: 'Diseño de earn-out & Marco KPI',
        labelIt: 'Design earn-out & Framework KPI',
        labelNl: 'Earn-out ontwerp & KPI-kader',
        description: 'Earn-out mechanisms, seller protection, dispute resolution',
        descriptionFr: 'Mécanismes d\'earnout, protection vendeur, résolution litiges',
        cifs: ['F'],
      },
      {
        id: 'trans-integration',
        label: 'Post-acquisition Integration',
        labelFr: 'Intégration post-acquisition',
        labelEn: 'Post-acquisition Integration',
        labelDe: 'Post-Akquisitions-Integration',
        labelEs: 'Integración post-adquisición',
        labelIt: 'Integrazione post-acquisizione',
        labelNl: 'Post-acquisitie integratie',
        description: '30/60/100-day plan: stack, HR, clients, suppliers',
        descriptionFr: 'Plan 30/60/100 jours : stack, RH, clients, fournisseurs',
      },
      {
        id: 'trans-exec-hr',
        label: 'Executive HR Support',
        labelFr: 'Support RH dirigeants',
        labelEn: 'Executive HR Support',
        labelDe: 'HR-Unterstützung für Führungskräfte',
        labelEs: 'Soporte RRHH directivos',
        labelIt: 'Supporto HR dirigenti',
        labelNl: 'HR-ondersteuning voor leidinggevenden',
        description: 'Post-sale management contract, non-compete, transition',
        descriptionFr: 'Contrat de management post-cession, non-concurrence, transition',
      },
      {
        id: 'trans-exit-tax',
        label: 'Exit Tax Filing',
        labelFr: 'Déclaration fiscale de cession',
        labelEn: 'Exit Tax Filing',
        labelDe: 'Steuerliche Abgangserklärung',
        labelEs: 'Declaración fiscal de salida',
        labelIt: 'Dichiarazione fiscale di cessione',
        labelNl: 'Belastingaangifte bij verkoop',
        description: 'Capital gains, CH/FR/LU, apport-cession, reinvestment, PEA-PME',
        descriptionFr: 'Plus-values, CH/FR/LU, apport-cession, réinvestissement, PEA-PME',
        cifs: ['F'],
      },
    ],
  },
]

// ── Utilitaires ──────────────────────────────────────────────────────────────

export function getCategoriesByDimension(dim: Dimension): Category[] {
  if (dim === 'both') return EXPERTISE_TAXONOMY
  return EXPERTISE_TAXONOMY.filter(c => c.dimension === dim || c.dimension === 'both')
}

export function getCategoryIdsByDimension(dim: Dimension): string[] {
  return getCategoriesByDimension(dim).map(c => c.id)
}

export function getSpecialtyIdsByDimension(dim: Dimension): string[] {
  return getCategoriesByDimension(dim).flatMap(c => c.specialties.map(s => s.id))
}

export function getAllCategoryIds(): string[] {
  return EXPERTISE_TAXONOMY.map(c => c.id)
}

export function getAllSpecialtyIds(): string[] {
  return EXPERTISE_TAXONOMY.flatMap(c => c.specialties.map(s => s.id))
}

export function getSpecialtyById(id: string): Specialty | undefined {
  for (const cat of EXPERTISE_TAXONOMY) {
    const found = cat.specialties.find(s => s.id === id)
    if (found) return found
  }
  return undefined
}

export function getCategoryBySpecialtyId(specialtyId: string): Category | undefined {
  return EXPERTISE_TAXONOMY.find(cat =>
    cat.specialties.some(s => s.id === specialtyId)
  )
}

export type LocaleKey = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'

export function getCategoryLabel(cat: Category, locale: LocaleKey): string {
  const map: Record<LocaleKey, string> = {
    fr: cat.labelFr,
    en: cat.labelEn,
    de: cat.labelDe,
    es: cat.labelEs,
    it: cat.labelIt,
    nl: cat.labelNl,
  }
  return map[locale] ?? cat.labelFr
}

export function getSpecialtyLabel(spec: Specialty, locale: LocaleKey): string {
  const map: Record<LocaleKey, string> = {
    fr: spec.labelFr,
    en: spec.labelEn,
    de: spec.labelDe,
    es: spec.labelEs,
    it: spec.labelIt,
    nl: spec.labelNl,
  }
  return map[locale] ?? spec.labelFr
}
