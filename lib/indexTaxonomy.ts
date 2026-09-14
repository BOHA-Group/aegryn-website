/**
 * lib/indexTaxonomy.ts — Taxonomie du CIFSO Valuation Index
 *
 * 5 clusters × verticaux. Les verticaux « benchmark » (benchmarkCategory) sont ceux pour
 * lesquels une série de multiples ARR par profil existe (table benchmark_data) ; les autres
 * héritent des multiples de leur cluster. Libellés dans les 6 langues de l'interface.
 */
import type { ClusterKey } from '@/lib/cifsoValuation'

export type IndexLocale = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
export interface IndexVertical {
  key:      string
  cluster:  ClusterKey
  label:    Record<IndexLocale, string>
  /** catégorie benchmark_data si une série dédiée existe */
  benchmarkCategory?: string
}

const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): Record<IndexLocale, string> => ({ fr, en, de, es, it, nl })

export const INDEX_VERTICALS: IndexVertical[] = [
  /* Tech & Innovation */
  { key: 'saas_vertical',    cluster: 'tech_innovation', benchmarkCategory: 'saas_vertical',   label: L('SaaS vertical', 'Vertical SaaS', 'Vertikales SaaS', 'SaaS vertical', 'SaaS verticale', 'Verticale SaaS') },
  { key: 'saas_horizontal',  cluster: 'tech_innovation', benchmarkCategory: 'saas_horizontal', label: L('SaaS horizontal', 'Horizontal SaaS', 'Horizontales SaaS', 'SaaS horizontal', 'SaaS orizzontale', 'Horizontale SaaS') },
  { key: 'ai_native',        cluster: 'tech_innovation', benchmarkCategory: 'ai_native',       label: L('IA native & applications verticales', 'AI-native & vertical AI apps', 'KI-native & vertikale KI', 'IA nativa & aplicaciones verticales', 'IA nativa & applicazioni verticali', 'AI-native & verticale AI') },
  { key: 'marketplace',      cluster: 'tech_innovation', benchmarkCategory: 'marketplace',     label: L('Marketplaces & plateformes', 'Marketplaces & platforms', 'Marktplätze & Plattformen', 'Marketplaces & plataformas', 'Marketplace & piattaforme', 'Marktplaatsen & platforms') },
  { key: 'mobile_app',       cluster: 'tech_innovation', benchmarkCategory: 'mobile_app',      label: L('Applications mobiles & consumer', 'Mobile & consumer apps', 'Mobile & Consumer-Apps', 'Apps móviles & consumer', 'App mobili & consumer', 'Mobiele & consumer apps') },
  { key: 'devtools',         cluster: 'tech_innovation', label: L('Outils développeurs & infrastructure', 'Developer tools & infrastructure', 'Entwicklertools & Infrastruktur', 'Herramientas dev & infraestructura', 'Strumenti dev & infrastruttura', 'Developer tools & infrastructuur') },
  { key: 'cybersecurity',    cluster: 'tech_innovation', label: L('Cybersécurité', 'Cybersecurity', 'Cybersicherheit', 'Ciberseguridad', 'Cybersicurezza', 'Cyberbeveiliging') },
  { key: 'data_analytics',   cluster: 'tech_innovation', label: L('Data & analytics', 'Data & analytics', 'Data & Analytics', 'Datos & analítica', 'Dati & analytics', 'Data & analytics') },
  { key: 'iot_industry40',   cluster: 'tech_innovation', label: L('IoT & industrie 4.0', 'IoT & Industry 4.0', 'IoT & Industrie 4.0', 'IoT & industria 4.0', 'IoT & industria 4.0', 'IoT & industrie 4.0') },
  { key: 'web3',             cluster: 'tech_innovation', benchmarkCategory: 'web3',            label: L('Web3 & actifs numériques', 'Web3 & digital assets', 'Web3 & digitale Vermögenswerte', 'Web3 & activos digitales', 'Web3 & asset digitali', 'Web3 & digitale activa') },
  { key: 'adtech_martech',   cluster: 'tech_innovation', label: L('AdTech & MarTech', 'AdTech & MarTech', 'AdTech & MarTech', 'AdTech & MarTech', 'AdTech & MarTech', 'AdTech & MarTech') },
  { key: 'edtech',           cluster: 'tech_innovation', label: L('EdTech', 'EdTech', 'EdTech', 'EdTech', 'EdTech', 'EdTech') },
  /* Finance & Capital */
  { key: 'fintech',          cluster: 'finance_capital', benchmarkCategory: 'fintech',         label: L('FinTech & paiements', 'FinTech & payments', 'FinTech & Zahlungen', 'FinTech & pagos', 'FinTech & pagamenti', 'FinTech & betalingen') },
  { key: 'regtech',          cluster: 'finance_capital', benchmarkCategory: 'regtech',         label: L('RegTech & conformité', 'RegTech & compliance', 'RegTech & Compliance', 'RegTech & cumplimiento', 'RegTech & compliance', 'RegTech & compliance') },
  { key: 'insurtech',        cluster: 'finance_capital', label: L('InsurTech', 'InsurTech', 'InsurTech', 'InsurTech', 'InsurTech', 'InsurTech') },
  { key: 'wealth_asset',     cluster: 'finance_capital', label: L('Gestion de patrimoine & d\'actifs', 'Wealth & asset management', 'Vermögensverwaltung', 'Gestión patrimonial & de activos', 'Gestione patrimoniale & asset', 'Vermogens- & assetbeheer') },
  { key: 'lending_credit',   cluster: 'finance_capital', label: L('Crédit & financement', 'Lending & credit', 'Kredit & Finanzierung', 'Crédito & financiación', 'Credito & finanziamento', 'Krediet & financiering') },
  { key: 'proptech',         cluster: 'finance_capital', label: L('PropTech & immobilier', 'PropTech & real estate', 'PropTech & Immobilien', 'PropTech & inmobiliario', 'PropTech & immobiliare', 'PropTech & vastgoed') },
  { key: 'legaltech',        cluster: 'finance_capital', benchmarkCategory: 'legaltech',       label: L('LegalTech', 'LegalTech', 'LegalTech', 'LegalTech', 'LegalTech', 'LegalTech') },
  { key: 'accounting_erp',   cluster: 'finance_capital', label: L('Comptabilité, ERP & gestion', 'Accounting, ERP & back-office', 'Buchhaltung, ERP & Verwaltung', 'Contabilidad, ERP & gestión', 'Contabilità, ERP & gestione', 'Boekhouding, ERP & beheer') },
  /* Santé & Sciences */
  { key: 'healthtech',       cluster: 'sante_sciences',  benchmarkCategory: 'healthtech',      label: L('HealthTech & santé digitale', 'HealthTech & digital health', 'HealthTech & digitale Gesundheit', 'HealthTech & salud digital', 'HealthTech & sanità digitale', 'HealthTech & digitale zorg') },
  { key: 'medtech_devices',  cluster: 'sante_sciences',  label: L('MedTech & dispositifs', 'MedTech & devices', 'MedTech & Geräte', 'MedTech & dispositivos', 'MedTech & dispositivi', 'MedTech & apparatuur') },
  { key: 'biotech_pharma',   cluster: 'sante_sciences',  label: L('Biotech & pharma', 'Biotech & pharma', 'Biotech & Pharma', 'Biotech & farma', 'Biotech & farma', 'Biotech & farma') },
  { key: 'clinics_care',     cluster: 'sante_sciences',  label: L('Cliniques & soins', 'Clinics & care providers', 'Kliniken & Pflege', 'Clínicas & cuidados', 'Cliniche & cura', 'Klinieken & zorg') },
  { key: 'diagnostics_labs', cluster: 'sante_sciences',  label: L('Diagnostic & laboratoires', 'Diagnostics & labs', 'Diagnostik & Labore', 'Diagnóstico & laboratorios', 'Diagnostica & laboratori', 'Diagnostiek & laboratoria') },
  { key: 'wellness_sport',   cluster: 'sante_sciences',  label: L('Bien-être & sport', 'Wellness & sports', 'Wellness & Sport', 'Bienestar & deporte', 'Benessere & sport', 'Welzijn & sport') },
  /* Industrie & Infrastructure */
  { key: 'manufacturing',    cluster: 'industrie_infra', label: L('Industrie manufacturière', 'Manufacturing', 'Fertigungsindustrie', 'Industria manufacturera', 'Industria manifatturiera', 'Maakindustrie') },
  { key: 'energy_climate',   cluster: 'industrie_infra', label: L('Énergie & climat', 'Energy & climate tech', 'Energie & Klima', 'Energía & clima', 'Energia & clima', 'Energie & klimaat') },
  { key: 'logistics_mobility', cluster: 'industrie_infra', label: L('Logistique & mobilité', 'Logistics & mobility', 'Logistik & Mobilität', 'Logística & movilidad', 'Logistica & mobilità', 'Logistiek & mobiliteit') },
  { key: 'construction_building', cluster: 'industrie_infra', label: L('Construction & bâtiment', 'Construction & building products', 'Bau & Gebäudetechnik', 'Construcción & edificación', 'Costruzioni & edilizia', 'Bouw & gebouwen') },
  { key: 'engineering_services', cluster: 'industrie_infra', label: L('Ingénierie & services techniques', 'Engineering & technical services', 'Ingenieur- & technische Dienste', 'Ingeniería & servicios técnicos', 'Ingegneria & servizi tecnici', 'Engineering & technische diensten') },
  { key: 'agri_food',        cluster: 'industrie_infra', label: L('Agroalimentaire', 'Agri & food', 'Agrar & Lebensmittel', 'Agroalimentario', 'Agroalimentare', 'Agri & food') },
  { key: 'defense_aero',     cluster: 'industrie_infra', label: L('Défense & aéronautique', 'Defense & aerospace', 'Verteidigung & Luftfahrt', 'Defensa & aeronáutica', 'Difesa & aerospazio', 'Defensie & luchtvaart') },
  /* Commerce & Services */
  { key: 'ecommerce_retail', cluster: 'commerce_services', label: L('E-commerce & retail', 'E-commerce & retail', 'E-Commerce & Handel', 'E-commerce & retail', 'E-commerce & retail', 'E-commerce & retail') },
  { key: 'b2b_services',     cluster: 'commerce_services', label: L('Services B2B & conseil', 'B2B services & consulting', 'B2B-Dienste & Beratung', 'Servicios B2B & consultoría', 'Servizi B2B & consulenza', 'B2B-diensten & advies') },
  { key: 'agencies_media',   cluster: 'commerce_services', label: L('Agences & médias', 'Agencies & media', 'Agenturen & Medien', 'Agencias & medios', 'Agenzie & media', 'Agentschappen & media') },
  { key: 'hospitality_travel', cluster: 'commerce_services', label: L('Hôtellerie & voyage', 'Hospitality & travel', 'Gastgewerbe & Reisen', 'Hostelería & viajes', 'Ospitalità & viaggi', 'Horeca & reizen') },
  { key: 'hr_staffing',      cluster: 'commerce_services', label: L('RH, recrutement & formation', 'HR, staffing & training', 'HR, Personal & Weiterbildung', 'RR. HH., selección & formación', 'HR, recruiting & formazione', 'HR, werving & opleiding') },
  { key: 'franchise_networks', cluster: 'commerce_services', label: L('Franchises & réseaux', 'Franchises & networks', 'Franchise & Netzwerke', 'Franquicias & redes', 'Franchising & reti', 'Franchises & netwerken') },
  { key: 'facility_services', cluster: 'commerce_services', label: L('Services aux entreprises & facility', 'Business & facility services', 'Unternehmens- & Facility-Services', 'Servicios a empresas & facility', 'Servizi alle imprese & facility', 'Bedrijfs- & facilitydiensten') },
]

/* Libellés et slugs alignés sur les 5 pages /industries (data/industries.ts) pour que
   l'Index et le hub Industries partagent exactement la même segmentation et vocabulaire. */
export const INDEX_CLUSTERS: { key: ClusterKey; slug: string; label: Record<IndexLocale, string> }[] = [
  { key: 'tech_innovation',   slug: 'tech-innovation-secteur-public',
    label: L('Tech, Innovation & Secteur Public', 'Tech, Innovation & Public Sector', 'Tech, Innovation & öffentlicher Sektor', 'Tech, Innovación y Sector Público', 'Tech, Innovazione & Settore Pubblico', 'Tech, Innovatie & Publieke Sector') },
  { key: 'finance_capital',   slug: 'finance-capital',
    label: L('Finance & Capital', 'Finance & Capital', 'Finanzen & Kapital', 'Finanzas y Capital', 'Finanza & Capitale', 'Financiën & Kapitaal') },
  { key: 'sante_sciences',    slug: 'sante-sciences-de-la-vie',
    label: L('Santé & Sciences de la Vie', 'Health & Life Sciences', 'Gesundheit & Life Sciences', 'Salud y Ciencias de la Vida', 'Salute & Scienze della Vita', 'Gezondheid & Life Sciences') },
  { key: 'industrie_infra',   slug: 'industrie-energie-infrastructure',
    label: L('Industrie, Énergie & Infrastructure', 'Industry, Energy & Infrastructure', 'Industrie, Energie & Infrastruktur', 'Industria, Energía e Infraestructura', 'Industria, Energia & Infrastrutture', 'Industrie, Energie & Infrastructuur') },
  { key: 'commerce_services', slug: 'commerce-services-experience-client',
    label: L('Commerce, Services & Expérience Client', 'Commerce, Services & Customer Experience', 'Handel, Dienstleistungen & Kundenerlebnis', 'Comercio, Servicios y Experiencia de Cliente', 'Commercio, Servizi & Customer Experience', 'Handel, Diensten & Klantervaring') },
]

/** Cluster key -> slug /industries/[slug], pour le cross-link Index <-> Industries. */
export const INDEX_CLUSTER_SLUGS: Record<ClusterKey, string> = Object.fromEntries(
  INDEX_CLUSTERS.map(c => [c.key, c.slug])
) as Record<ClusterKey, string>

/** Métriques couvertes par l'Index (clé, unité, réservé abonnés) */
export const INDEX_METRICS: { key: string; unit: 'x' | '%' | 'pts' | 'eur'; locked: boolean }[] = [
  { key: 'ev_revenue',     unit: 'x',   locked: false },
  { key: 'ev_ebitda',      unit: 'x',   locked: true },
  { key: 'arr_multiple',   unit: 'x',   locked: true },
  { key: 'growth_yoy',     unit: '%',   locked: true },
  { key: 'nrr',            unit: '%',   locked: true },
  { key: 'gross_margin',   unit: '%',   locked: true },
  { key: 'rule_of_40',     unit: 'pts', locked: true },
  { key: 'cifso_score',    unit: 'pts', locked: false },
  { key: 'dimension_uplift', unit: '%', locked: true },
]

/** Cluster public en aperçu (accès libre) */
export const TEASER_CLUSTER: ClusterKey = 'tech_innovation'
export const TEASER_VERTICAL = 'saas_horizontal'
