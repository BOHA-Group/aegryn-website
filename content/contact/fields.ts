/**
 * Formulaire de contact dynamique : sujets, champs additionnels par sujet,
 * libellés dans les 6 langues. Utilisé côté client (formulaire) et côté
 * serveur (e-mail interne en français, accusé de réception dans la langue
 * du visiteur). Une liste plate de sujets, un sujet par type de demande ;
 * deux champs facultatifs au maximum par sujet.
 */

export type Lang = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'

export const CONTACT_SUBJECTS = [
  'project', 'cycle', 'profile', 'transition', 'join', 'certification',
  'partnership', 'press', 'career', 'general', 'other',
] as const
export type ContactSubject = typeof CONTACT_SUBJECTS[number]

/** Sujets historiques encore acceptés par l'API (anciens formulaires en cache) */
export const LEGACY_SUBJECTS = [
  'advisory', 'tech', 'grade', 'transaction', 'investor', 'recruter', 'media',
] as const

/** Anciennes valeurs de ?subject= redirigées vers les nouveaux sujets */
export const LEGACY_SUBJECT_ALIAS: Record<string, ContactSubject> = {
  advisory: 'project', tech: 'project',
  transaction: 'cycle', acquisition: 'cycle',
  investor: 'join', grade: 'certification', recruter: 'profile', media: 'press',
}

/** Alias ?type= (liens depuis /talent et les pages cycle) */
export const TYPE_TO_SUBJECT: Record<string, ContactSubject> = {
  recruter: 'profile', transition: 'transition', candidat: 'career', candidate: 'career',
}

/** Sujets où une idée ou un projet confidentiel peut être décrit : case NDA projet */
export const NDA_SUBJECTS: readonly ContactSubject[] = ['project', 'cycle', 'join']

/** Profil NDA suggéré selon le sujet (préremplissage de la création côté admin) */
export const NDA_ROLE_BY_SUBJECT: Partial<Record<ContactSubject, string>> = {
  project: 'project_owner', cycle: 'project_owner', join: 'investor',
}

export type FieldDef = { key: string; kind: 'select' | 'text'; options?: readonly string[] }

export const CYCLES = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const
export const SECTORS = [
  'finance-capital', 'sante-sciences-de-la-vie', 'industrie-energie-infrastructure',
  'commerce-services-experience-client', 'tech-innovation-secteur-public', 'all',
] as const
export const PARTNER_ACTIVITIES = [
  'legal', 'finance', 'strategy', 'engineering',
  'design', 'tech', 'manufacturing', 'logistics', 'distribution',
  'organization', 'restructuring', 'risk', 'other',
] as const

export const SUBJECT_FIELDS: Partial<Record<ContactSubject, readonly FieldDef[]>> = {
  project:       [
    { key: 'scope', kind: 'select', options: ['frame', 'frameLead', 'deliver', 'undefined'] },
    { key: 'stage', kind: 'select', options: ['idea', 'concept', 'prototype', 'launched'] },
  ],
  cycle:         [{ key: 'cycle', kind: 'select', options: CYCLES }],
  profile:       [{ key: 'profileWanted', kind: 'text' }],
  transition:    [{ key: 'profileWanted', kind: 'text' }],
  join:          [
    { key: 'interest', kind: 'select', options: ['participation', 'codevelopment', 'operating'] },
    { key: 'portfolioProject', kind: 'select' },
  ],
  certification: [{ key: 'certTarget', kind: 'text' }],
  partnership:   [
    { key: 'activity', kind: 'select', options: PARTNER_ACTIVITIES },
    { key: 'sector', kind: 'select', options: SECTORS },
  ],
}

type L6 = Record<Lang, string>
const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): L6 => ({ fr, en, de, es, it, nl })

export const FIELD_LABELS: Record<string, L6> = {
  scope:            L('Périmètre souhaité', 'Desired scope', 'Gewünschter Umfang', 'Alcance deseado', 'Perimetro desiderato', 'Gewenste scope'),
  stage:            L('Où en êtes-vous ?', 'Where do you stand?', 'Wo stehen Sie?', '¿En qué punto está?', 'A che punto siete?', 'Waar staat u?'),
  cycle:            L('Cycle concerné', 'Cycle concerned', 'Betroffener Zyklus', 'Ciclo afectado', 'Ciclo interessato', 'Betrokken cyclus'),
  profileWanted:    L('Profil recherché', 'Profile sought', 'Gesuchtes Profil', 'Perfil buscado', 'Profilo ricercato', 'Gezocht profiel'),
  interest:         L('Votre intérêt', 'Your interest', 'Ihr Interesse', 'Su interés', 'Il vostro interesse', 'Uw interesse'),
  portfolioProject: L('Projet du portfolio concerné', 'Portfolio project concerned', 'Betroffenes Portfolio-Projekt', 'Proyecto del portfolio concernido', 'Progetto del portfolio interessato', 'Betrokken portfolioproject'),
  certTarget:       L('Ce que vous souhaitez faire certifier', 'What you wish to have certified', 'Was Sie zertifizieren lassen möchten', 'Lo que desea certificar', 'Ciò che desiderate certificare', 'Wat u wilt laten certificeren'),
  activity:         L('Votre activité', 'Your activity', 'Ihre Tätigkeit', 'Su actividad', 'La vostra attività', 'Uw activiteit'),
  sector:           L('Secteur principal', 'Main sector', 'Hauptbranche', 'Sector principal', 'Settore principale', 'Hoofdsector'),
}

export const OPTION_LABELS: Record<string, L6> = {
  'scope.frame':      L('Cadrer seulement', 'Frame only', 'Nur rahmen', 'Solo encuadrar', 'Solo inquadrare', 'Alleen kaderen'),
  'scope.frameLead':  L('Cadrer et conduire', 'Frame and lead', 'Rahmen setzen und führen', 'Encuadrar y conducir', 'Inquadrare e condurre', 'Kaderen en leiden'),
  'scope.deliver':    L('Réaliser tout ou partie', 'Deliver all or part', 'Ganz oder teilweise umsetzen', 'Realizar todo o parte', 'Realizzare tutto o in parte', 'Geheel of gedeeltelijk realiseren'),
  'scope.undefined':  L('Pas encore défini', 'Not yet defined', 'Noch nicht festgelegt', 'Aún sin definir', 'Non ancora definito', 'Nog niet bepaald'),

  'stage.idea':       L('Une idée', 'An idea', 'Eine Idee', 'Una idea', 'Un\'idea', 'Een idee'),
  'stage.concept':    L('Un concept défini', 'A defined concept', 'Ein definiertes Konzept', 'Un concepto definido', 'Un concept definito', 'Een uitgewerkt concept'),
  'stage.prototype':  L('Un prototype', 'A prototype', 'Ein Prototyp', 'Un prototipo', 'Un prototipo', 'Een prototype'),
  'stage.launched':   L('Déjà lancé', 'Already launched', 'Bereits gestartet', 'Ya lanzado', 'Già lanciato', 'Al gelanceerd'),

  'cycle.lancement':       L('Lancement', 'Launch', 'Gründung', 'Lanzamiento', 'Lancio', 'Lancering'),
  'cycle.croissance':      L('Croissance', 'Growth', 'Wachstum', 'Crecimiento', 'Crescita', 'Groei'),
  'cycle.restructuration': L('Restructuration', 'Restructuring', 'Restrukturierung', 'Reestructuración', 'Ristrutturazione', 'Herstructurering'),
  'cycle.acquisition':     L('Acquisition', 'Acquisition', 'Übernahme', 'Adquisición', 'Acquisizione', 'Overname'),
  'cycle.transmission':    L('Transmission', 'Transfer', 'Übergabe', 'Transmisión', 'Trasmissione', 'Overdracht'),

  'interest.participation':  L('Participation', 'Equity stake', 'Beteiligung', 'Participación', 'Partecipazione', 'Deelneming'),
  'interest.codevelopment':  L('Co-développement', 'Co-development', 'Co-Entwicklung', 'Codesarrollo', 'Co-sviluppo', 'Co-ontwikkeling'),
  'interest.operating':      L('Operating partner pour mes participations', 'Operating partner for my holdings', 'Operating Partner für meine Beteiligungen', 'Operating partner para mis participadas', 'Operating partner per le mie partecipazioni', 'Operating partner voor mijn deelnemingen'),

  'portfolioProject.none':   L('Aucun en particulier', 'None in particular', 'Keines im Besonderen', 'Ninguno en particular', 'Nessuno in particolare', 'Geen in het bijzonder'),

  'activity.legal':        L('Juridique, propriété intellectuelle et réglementaire', 'Legal, intellectual property and regulatory', 'Recht, geistiges Eigentum und Regulatorik', 'Jurídico, propiedad intelectual y regulatorio', 'Legale, proprietà intellettuale e regolamentare', 'Juridisch, intellectuele eigendom en regelgeving'),
  'activity.finance':      L('Finance, fiscalité et audit', 'Finance, tax and audit', 'Finanzen, Steuern und Revision', 'Finanzas, fiscalidad y auditoría', 'Finanza, fiscalità e revisione', 'Financiën, fiscaliteit en audit'),
  'activity.strategy':     L('Stratégie, études de marché et conseil sectoriel', 'Strategy, market research and sector advisory', 'Strategie, Marktforschung und Branchenberatung', 'Estrategia, estudios de mercado y asesoría sectorial', 'Strategia, ricerche di mercato e consulenza settoriale', 'Strategie, marktonderzoek en sectoradvies'),
  'activity.engineering':  L('Ingénierie, R&D et laboratoires', 'Engineering, R&D and laboratories', 'Ingenieurwesen, F&E und Labore', 'Ingeniería, I+D y laboratorios', 'Ingegneria, R&S e laboratori', 'Engineering, R&D en laboratoria'),
  'activity.design':       L('Design, marque et communication', 'Design, brand and communication', 'Design, Marke und Kommunikation', 'Diseño, marca y comunicación', 'Design, marchio e comunicazione', 'Design, merk en communicatie'),
  'activity.tech':         L('Technologie, données et cybersécurité', 'Technology, data and cybersecurity', 'Technologie, Daten und Cybersicherheit', 'Tecnología, datos y ciberseguridad', 'Tecnologia, dati e cybersicurezza', 'Technologie, data en cyberbeveiliging'),
  'activity.manufacturing': L('Fabrication et industrialisation', 'Manufacturing and industrialisation', 'Fertigung und Industrialisierung', 'Fabricación e industrialización', 'Produzione e industrializzazione', 'Productie en industrialisatie'),
  'activity.logistics':    L('Achats, logistique et supply chain', 'Procurement, logistics and supply chain', 'Einkauf, Logistik und Supply Chain', 'Compras, logística y cadena de suministro', 'Acquisti, logistica e supply chain', 'Inkoop, logistiek en supply chain'),
  'activity.distribution': L('Distribution et mise en marché', 'Distribution and go-to-market', 'Vertrieb und Markteinführung', 'Distribución y salida al mercado', 'Distribuzione e go-to-market', 'Distributie en marktintroductie'),
  'activity.organization': L('Organisation, talents et transition', 'Organisation, talent and transition', 'Organisation, Talente und Transition', 'Organización, talento y transición', 'Organizzazione, talenti e transizione', 'Organisatie, talent en transitie'),
  'activity.restructuring': L('Reprise, restructuration et transmission', 'Acquisition, restructuring and transfer', 'Übernahme, Restrukturierung und Übergabe', 'Adquisición, reestructuración y transmisión', 'Acquisizione, ristrutturazione e trasmissione', 'Overname, herstructurering en overdracht'),
  'activity.risk':         L('Assurance, risques et durabilité', 'Insurance, risk and sustainability', 'Versicherung, Risiken und Nachhaltigkeit', 'Seguros, riesgos y sostenibilidad', 'Assicurazioni, rischi e sostenibilità', 'Verzekering, risico\'s en duurzaamheid'),
  'activity.other':        L('Autre activité', 'Other activity', 'Andere Tätigkeit', 'Otra actividad', 'Altra attività', 'Andere activiteit'),

  'sector.finance-capital':                    L('Finance & Capital', 'Finance & Capital', 'Finanzen & Kapital', 'Finanzas y Capital', 'Finanza & Capitale', 'Financiën & Kapitaal'),
  'sector.sante-sciences-de-la-vie':           L('Santé & Sciences de la Vie', 'Health & Life Sciences', 'Gesundheit & Life Sciences', 'Salud y Ciencias de la Vida', 'Salute & Scienze della Vita', 'Gezondheid & Life Sciences'),
  'sector.industrie-energie-infrastructure':   L('Industrie, Énergie & Infrastructure', 'Industry, Energy & Infrastructure', 'Industrie, Energie & Infrastruktur', 'Industria, Energía e Infraestructura', 'Industria, Energia & Infrastrutture', 'Industrie, Energie & Infrastructuur'),
  'sector.commerce-services-experience-client': L('Commerce, Services & Expérience Client', 'Commerce, Services & Customer Experience', 'Handel, Dienstleistungen & Kundenerlebnis', 'Comercio, Servicios y Experiencia de Cliente', 'Commercio, Servizi & Customer Experience', 'Handel, Diensten & Klantervaring'),
  'sector.tech-innovation-secteur-public':     L('Tech, Innovation & Secteur Public', 'Tech, Innovation & Public Sector', 'Tech, Innovation & öffentlicher Sektor', 'Tech, Innovación y Sector Público', 'Tech, Innovazione & Settore Pubblico', 'Tech, Innovatie & Publieke Sector'),
  'sector.all':                                L('Tous secteurs', 'All sectors', 'Alle Branchen', 'Todos los sectores', 'Tutti i settori', 'Alle sectoren'),
}

export const UI: Record<string, L6> = {
  optional:    L('facultatif', 'optional', 'optional', 'opcional', 'facoltativo', 'optioneel'),
  choose:      L('Choisir', 'Choose', 'Auswählen', 'Elegir', 'Scegliere', 'Kiezen'),
  detailsHint: L('Pour mieux vous répondre', 'To help us reply better', 'Damit wir besser antworten können', 'Para responderle mejor', 'Per rispondervi meglio', 'Om u beter te kunnen antwoorden'),
  ndaLabel:    L(
    'Je souhaite un accord de confidentialité avant de détailler mon projet.',
    'I would like a confidentiality agreement before detailing my project.',
    'Ich wünsche eine Vertraulichkeitsvereinbarung, bevor ich mein Projekt im Detail beschreibe.',
    'Deseo un acuerdo de confidencialidad antes de detallar mi proyecto.',
    'Desidero un accordo di riservatezza prima di dettagliare il mio progetto.',
    'Ik wil een geheimhoudingsovereenkomst voordat ik mijn project in detail beschrijf.',
  ),
  ndaHelp:     L(
    'Pour une idée ou un projet confidentiel, nous vous adressons un accord de confidentialité adapté avant tout échange détaillé. Décrivez-le ici en une ou deux lignes, sans détail sensible.',
    'For a confidential idea or project, we send you a suitable confidentiality agreement before any detailed exchange. Describe it here in a line or two, without sensitive details.',
    'Für eine vertrauliche Idee oder ein vertrauliches Projekt senden wir Ihnen vor jedem detaillierten Austausch eine passende Vertraulichkeitsvereinbarung. Beschreiben Sie es hier in ein bis zwei Zeilen, ohne sensible Details.',
    'Para una idea o un proyecto confidencial, le enviamos un acuerdo de confidencialidad adecuado antes de cualquier intercambio detallado. Descríbalo aquí en una o dos líneas, sin detalles sensibles.',
    'Per un\'idea o un progetto riservato, vi inviamo un accordo di riservatezza adeguato prima di qualsiasi scambio dettagliato. Descrivetelo qui in una o due righe, senza dettagli sensibili.',
    'Voor een vertrouwelijk idee of project sturen wij u vóór elke gedetailleerde uitwisseling een passende geheimhoudingsovereenkomst. Beschrijf het hier in een of twee regels, zonder gevoelige details.',
  ),
}

/** Libellés des sujets en français, pour l'objet de l'e-mail interne */
export const SUBJECT_LABEL_FR: Record<string, string> = {
  project: 'Travailler avec La Boutique', cycle: 'Accompagner un cycle', profile: 'Sélectionner un profil',
  transition: 'Mission de transition', join: 'Rejoindre ou soutenir un projet',
  certification: 'Certification CIFSO', partnership: 'Partenariat', press: 'Presse et médias',
  career: 'Candidature', general: 'Demande générale', other: 'Autre',
}

export function normalizeLang(locale: string | undefined): Lang {
  return (['fr', 'en', 'de', 'es', 'it', 'nl'] as const).includes(locale as Lang) ? (locale as Lang) : 'fr'
}

/** Libellé lisible d'une valeur de champ dans une langue donnée */
export function valueLabel(field: string, value: string, lang: Lang, assetNames?: Record<string, string>): string {
  if (field === 'portfolioProject' && value !== 'none') return assetNames?.[value] ?? value
  const key = `${field}.${value}`
  return OPTION_LABELS[key]?.[lang] ?? value
}

/** Rend les champs additionnels en paires [libellé, valeur] lisibles */
export function describeExtra(extra: Record<string, string> | undefined, lang: Lang, assetNames?: Record<string, string>): [string, string][] {
  if (!extra) return []
  return Object.entries(extra)
    .filter(([k, v]) => FIELD_LABELS[k] && v)
    .map(([k, v]) => [FIELD_LABELS[k][lang], valueLabel(k, v, lang, assetNames)])
}
