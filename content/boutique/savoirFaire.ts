/**
 * Savoir-faire de La Boutique, de bout en bout, selon la norme du projet :
 * 6 phases du cycle de vie, 5 thèmes (sujets) transverses, 5 cycles.
 * Chaque savoir-faire est rattaché à une phase et à un thème ; Risques/Conformité et
 * Talent/Organisation sont transverses, ils reviennent à chaque phase.
 * Cycles : Lancement = Cadrer à Lancer ; Croissance et Restructuration = Grandir ;
 * Acquisition et Transmission = Transmettre.
 */
export type Lang = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
export type L6 = Record<Lang, string>
const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): L6 => ({ fr, en, de, es, it, nl })

export const CYCLES = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const
export type Cycle = typeof CYCLES[number]
export const THEMES = ['strategy', 'compliance', 'tech', 'talent', 'reprise'] as const
export type Theme = typeof THEMES[number]
export const PHASE_KEYS = ['cadrer', 'concevoir', 'construire', 'lancer', 'grandir', 'transmettre'] as const
export type PhaseKey = typeof PHASE_KEYS[number]

export const THEME_LABELS: Record<Theme, L6> = {
  strategy:   L('Stratégie', 'Strategy', 'Strategie', 'Estrategia', 'Strategia', 'Strategie'),
  compliance: L('Conformité', 'Compliance', 'Compliance', 'Cumplimiento', 'Conformità', 'Compliance'),
  tech:       L('Technologie', 'Technology', 'Technologie', 'Tecnología', 'Tecnologia', 'Technologie'),
  talent:     L('Talent', 'Talent', 'Talente', 'Talento', 'Talenti', 'Talent'),
  reprise:    L('Reprise', 'Takeover', 'Übernahme', 'Adquisición', 'Subentro', 'Overname'),
}

export const CYCLE_LABELS: Record<Cycle, L6> = {
  lancement:       L('Lancement', 'Launch', 'Gründung', 'Lanzamiento', 'Lancio', 'Lancering'),
  croissance:      L('Croissance', 'Growth', 'Wachstum', 'Crecimiento', 'Crescita', 'Groei'),
  restructuration: L('Restructuration', 'Restructuring', 'Restrukturierung', 'Reestructuración', 'Ristrutturazione', 'Herstructurering'),
  acquisition:     L('Acquisition', 'Acquisition', 'Übernahme', 'Adquisición', 'Acquisizione', 'Overname'),
  transmission:    L('Transmission', 'Transfer', 'Übergabe', 'Transmisión', 'Trasmissione', 'Overdracht'),
}

export const PHASES: { key: PhaseKey; label: L6; desc: L6; cycles: Cycle[] }[] = [
  { key: 'cadrer',     cycles: ['lancement'], label: L('Cadrer', 'Frame', 'Rahmen setzen', 'Encuadrar', 'Inquadrare', 'Kaderen'), desc: L('Du concept au projet exécutable', 'From concept to an executable project', 'Vom Konzept zum umsetzbaren Projekt', 'Del concepto al proyecto ejecutable', 'Dal concept al progetto eseguibile', 'Van concept naar uitvoerbaar project') },
  { key: 'concevoir',  cycles: ['lancement'], label: L('Concevoir', 'Design', 'Konzipieren', 'Concebir', 'Progettare', 'Ontwerpen'), desc: L('Marque, expérience, architecture', 'Brand, experience, architecture', 'Marke, Erlebnis, Architektur', 'Marca, experiencia, arquitectura', 'Marchio, esperienza, architettura', 'Merk, ervaring, architectuur') },
  { key: 'construire', cycles: ['lancement'], label: L('Construire', 'Build', 'Aufbauen', 'Construir', 'Costruire', 'Bouwen'), desc: L('Produit, plateforme, partenaires', 'Product, platform, partners', 'Produkt, Plattform, Partner', 'Producto, plataforma, socios', 'Prodotto, piattaforma, partner', 'Product, platform, partners') },
  { key: 'lancer',     cycles: ['lancement'], label: L('Lancer', 'Launch', 'Starten', 'Lanzar', 'Lanciare', 'Lanceren'), desc: L('Mise en marché', 'Going to market', 'Markteinführung', 'Salida al mercado', 'Messa sul mercato', 'Marktintroductie') },
  { key: 'grandir',    cycles: ['croissance', 'restructuration'], label: L('Grandir', 'Grow', 'Wachsen', 'Crecer', 'Crescere', 'Groeien'), desc: L('Croissance et repositionnement', 'Growth and repositioning', 'Wachstum und Neupositionierung', 'Crecimiento y reposicionamiento', 'Crescita e riposizionamento', 'Groei en herpositionering') },
  { key: 'transmettre', cycles: ['acquisition', 'transmission'], label: L('Transmettre', 'Hand over', 'Übergeben', 'Transmitir', 'Trasmettere', 'Overdragen'), desc: L('Reprise, héritage, transmission', 'Takeover, legacy, transfer', 'Übernahme, Erbe, Übergabe', 'Adquisición, herencia, transmisión', 'Subentro, eredità, trasmissione', 'Overname, nalatenschap, overdracht') },
]

export interface Item { phase: PhaseKey; theme: Theme; text: L6; cycles?: Cycle[] }

export const ITEMS: Item[] = [
  /* Cadrer */
  { phase: 'cadrer', theme: 'strategy', text: L('Concept et faisabilité', 'Concept and feasibility', 'Konzept und Machbarkeit', 'Concepto y viabilidad', 'Concept e fattibilità', 'Concept en haalbaarheid') },
  { phase: 'cadrer', theme: 'strategy', text: L('Étude de marché et zones de lancement', 'Market study and launch zones', 'Marktstudie und Einführungsregionen', 'Estudio de mercado y zonas de lanzamiento', 'Studio di mercato e aree di lancio', 'Marktonderzoek en lanceringszones') },
  { phase: 'cadrer', theme: 'strategy', text: L('Positionnement stratégique', 'Strategic positioning', 'Strategische Positionierung', 'Posicionamiento estratégico', 'Posizionamento strategico', 'Strategische positionering') },
  { phase: 'cadrer', theme: 'strategy', text: L('Business plan, modèle de revenus et pricing', 'Business plan, revenue model and pricing', 'Businessplan, Erlösmodell und Pricing', 'Plan de negocio, modelo de ingresos y precios', 'Business plan, modello di ricavi e pricing', 'Businessplan, verdienmodel en prijsstelling') },
  { phase: 'cadrer', theme: 'compliance', text: L('Cadre juridique et réglementaire', 'Legal and regulatory framework', 'Rechtlicher und regulatorischer Rahmen', 'Marco jurídico y regulatorio', 'Quadro giuridico e normativo', 'Juridisch en regelgevend kader') },
  { phase: 'cadrer', theme: 'compliance', text: L('Protection des données', 'Data protection', 'Datenschutz', 'Protección de datos', 'Protezione dei dati', 'Gegevensbescherming') },
  { phase: 'cadrer', theme: 'compliance', text: L('Stratégie de propriété intellectuelle', 'Intellectual property strategy', 'Strategie für geistiges Eigentum', 'Estrategia de propiedad intelectual', 'Strategia di proprietà intellettuale', 'Strategie voor intellectueel eigendom') },
  { phase: 'cadrer', theme: 'compliance', text: L('Cartographie des risques', 'Risk mapping', 'Risikokartierung', 'Mapa de riesgos', 'Mappatura dei rischi', 'Risicokaart') },
  { phase: 'cadrer', theme: 'talent', text: L('Gouvernance fondatrice', 'Founding governance', 'Gründungs-Governance', 'Gobernanza fundacional', 'Governance fondativa', 'Oprichtingsgovernance') },
  { phase: 'cadrer', theme: 'talent', text: L('Organisation cible et profils clés', 'Target organisation and key profiles', 'Zielorganisation und Schlüsselprofile', 'Organización objetivo y perfiles clave', 'Organizzazione target e profili chiave', 'Doelorganisatie en sleutelprofielen') },
  /* Concevoir */
  { phase: 'concevoir', theme: 'strategy', text: L('Marque, naming et storytelling', 'Brand, naming and storytelling', 'Marke, Naming und Storytelling', 'Marca, naming y storytelling', 'Marchio, naming e storytelling', 'Merk, naming en storytelling') },
  { phase: 'concevoir', theme: 'strategy', text: L('Positionnement de marque', 'Brand positioning', 'Markenpositionierung', 'Posicionamiento de marca', 'Posizionamento del marchio', 'Merkpositionering') },
  { phase: 'concevoir', theme: 'tech', text: L('Architecture cible et souveraineté', 'Target architecture and sovereignty', 'Zielarchitektur und Souveränität', 'Arquitectura objetivo y soberanía', 'Architettura target e sovranità', 'Doelarchitectuur en soevereiniteit') },
  { phase: 'concevoir', theme: 'tech', text: L('Spécifications produit, technique et packaging', 'Product, technical and packaging specifications', 'Produkt-, Technik- und Verpackungsspezifikationen', 'Especificaciones de producto, técnicas y de embalaje', 'Specifiche di prodotto, tecniche e di packaging', 'Product-, technische en verpakkingsspecificaties') },
  { phase: 'concevoir', theme: 'tech', text: L('Design d’expérience et de service', 'Experience and service design', 'Experience- und Service-Design', 'Diseño de experiencia y de servicio', 'Design dell’esperienza e del servizio', 'Experience- en servicedesign') },
  { phase: 'concevoir', theme: 'tech', text: L('Design industriel et produit', 'Industrial and product design', 'Industrie- und Produktdesign', 'Diseño industrial y de producto', 'Design industriale e di prodotto', 'Industrieel en productontwerp') },
  { phase: 'concevoir', theme: 'compliance', text: L('Protection des données et sécurité dès la conception', 'Privacy and security by design', 'Datenschutz und Sicherheit von Anfang an', 'Privacidad y seguridad desde el diseño', 'Privacy e sicurezza fin dalla progettazione', 'Privacy en beveiliging by design') },
  /* Construire */
  { phase: 'construire', theme: 'tech', text: L('Prototype et MVP', 'Prototype and MVP', 'Prototyp und MVP', 'Prototipo y MVP', 'Prototipo e MVP', 'Prototype en MVP') },
  { phase: 'construire', theme: 'tech', text: L('Développement technique, plateformes et applications', 'Technical development, platforms and applications', 'Technische Entwicklung, Plattformen und Anwendungen', 'Desarrollo técnico, plataformas y aplicaciones', 'Sviluppo tecnico, piattaforme e applicazioni', 'Technische ontwikkeling, platformen en applicaties') },
  { phase: 'construire', theme: 'tech', text: L('Données, IA et intégrations', 'Data, AI and integrations', 'Daten, KI und Integrationen', 'Datos, IA e integraciones', 'Dati, IA e integrazioni', 'Data, AI en integraties') },
  { phase: 'construire', theme: 'tech', text: L('Automatisation', 'Automation', 'Automatisierung', 'Automatización', 'Automazione', 'Automatisering') },
  { phase: 'construire', theme: 'talent', text: L('Équipe produit et recrutement clé', 'Product team and key hires', 'Produktteam und Schlüsselbesetzungen', 'Equipo de producto y contrataciones clave', 'Team di prodotto e assunzioni chiave', 'Productteam en sleutelwerving') },
  { phase: 'construire', theme: 'talent', text: L('Sourcing et qualification des partenaires de réalisation', 'Sourcing and qualification of delivery partners', 'Sourcing und Qualifizierung von Umsetzungspartnern', 'Búsqueda y cualificación de socios de realización', 'Sourcing e qualifica dei partner di realizzazione', 'Sourcing en kwalificatie van uitvoeringspartners') },
  { phase: 'construire', theme: 'compliance', text: L('Documentation et contrats', 'Documentation and contracts', 'Dokumentation und Verträge', 'Documentación y contratos', 'Documentazione e contratti', 'Documentatie en contracten') },
  /* Lancer */
  { phase: 'lancer', theme: 'strategy', text: L('Go-to-market et entrée de marché', 'Go-to-market and market entry', 'Go-to-Market und Markteintritt', 'Go-to-market y entrada en el mercado', 'Go-to-market e ingresso nel mercato', 'Go-to-market en marktintrede') },
  { phase: 'lancer', theme: 'strategy', text: L('Distribution et développement commercial', 'Distribution and commercial development', 'Vertrieb und Geschäftsentwicklung', 'Distribución y desarrollo comercial', 'Distribuzione e sviluppo commerciale', 'Distributie en commerciële ontwikkeling') },
  { phase: 'lancer', theme: 'strategy', text: L('Acquisition digitale, SEO et CRM', 'Digital acquisition, SEO and CRM', 'Digitale Akquise, SEO und CRM', 'Captación digital, SEO y CRM', 'Acquisizione digitale, SEO e CRM', 'Digitale acquisitie, SEO en CRM') },
  { phase: 'lancer', theme: 'strategy', text: L('Réseaux sociaux, relations presse et événements', 'Social media, press relations and events', 'Soziale Medien, Pressearbeit und Events', 'Redes sociales, relaciones con la prensa y eventos', 'Social media, relazioni con la stampa ed eventi', 'Sociale media, perscontacten en evenementen') },
  { phase: 'lancer', theme: 'compliance', text: L('Conformité opérationnelle', 'Operational compliance', 'Operative Compliance', 'Cumplimiento operativo', 'Conformità operativa', 'Operationele compliance') },
  { phase: 'lancer', theme: 'talent', text: L('Organisation de support et passation', 'Support organisation and handover', 'Support-Organisation und Übergabe', 'Organización de soporte y traspaso', 'Organizzazione di supporto e passaggio di consegne', 'Supportorganisatie en overdracht') },
  /* Grandir */
  { phase: 'grandir', theme: 'strategy', cycles: ['croissance'], text: L('Développement et diversification', 'Development and diversification', 'Entwicklung und Diversifikation', 'Desarrollo y diversificación', 'Sviluppo e diversificazione', 'Ontwikkeling en diversificatie') },
  { phase: 'grandir', theme: 'strategy', cycles: ['croissance'], text: L('Mise en marché à l’échelle et international', 'Go-to-market at scale and international', 'Skalierte Markteinführung und Internationalisierung', 'Salida al mercado a escala e internacional', 'Messa sul mercato su larga scala e internazionale', 'Marktintroductie op schaal en internationaal') },
  { phase: 'grandir', theme: 'strategy', cycles: ['croissance'], text: L('Extension de marque', 'Brand extension', 'Markenerweiterung', 'Extensión de marca', 'Estensione del marchio', 'Merkuitbreiding') },
  { phase: 'grandir', theme: 'strategy', cycles: ['restructuration'], text: L('Repositionnement et pivot', 'Repositioning and pivot', 'Neupositionierung und Pivot', 'Reposicionamiento y pivote', 'Riposizionamento e pivot', 'Herpositionering en pivot') },
  { phase: 'grandir', theme: 'tech', text: L('Scalabilité', 'Scalability', 'Skalierbarkeit', 'Escalabilidad', 'Scalabilità', 'Schaalbaarheid') },
  { phase: 'grandir', theme: 'talent', text: L('Organisation, dirigeants et rétention', 'Organisation, executives and retention', 'Organisation, Führungskräfte und Bindung', 'Organización, directivos y retención', 'Organizzazione, dirigenti e retention', 'Organisatie, leidinggevenden en behoud') },
  { phase: 'grandir', theme: 'talent', text: L('Missions de transition et operating partner', 'Transition assignments and operating partner', 'Transition-Mandate und Operating Partner', 'Misiones de transición y operating partner', 'Missioni di transizione e operating partner', 'Transitiemissies en operating partner') },
  { phase: 'grandir', theme: 'compliance', text: L('Gouvernance et gestion des risques', 'Governance and risk management', 'Governance und Risikomanagement', 'Gobernanza y gestión de riesgos', 'Governance e gestione dei rischi', 'Governance en risicobeheer') },
  { phase: 'grandir', theme: 'compliance', text: L('Tableaux de bord financiers et reporting', 'Financial dashboards and reporting', 'Finanz-Dashboards und Reporting', 'Cuadros de mando financieros y reporting', 'Dashboard finanziari e reporting', 'Financiële dashboards en rapportage') },
  /* Transmettre */
  { phase: 'transmettre', theme: 'reprise', text: L('Valorisation et due diligence', 'Valuation and due diligence', 'Bewertung und Due Diligence', 'Valoración y due diligence', 'Valutazione e due diligence', 'Waardering en due diligence') },
  { phase: 'transmettre', theme: 'reprise', cycles: ['acquisition'], text: L('Reprise d’un actif et intégration de sa marque', 'Taking over an asset and integrating its brand', 'Übernahme eines Assets und Integration seiner Marke', 'Adquisición de un activo e integración de su marca', 'Rilievo di un asset e integrazione del suo marchio', 'Overname van een asset en integratie van het merk') },
  { phase: 'transmettre', theme: 'reprise', cycles: ['acquisition'], text: L('Intégration après reprise', 'Post-acquisition integration', 'Integration nach der Übernahme', 'Integración posterior a la adquisición', 'Integrazione dopo l’acquisizione', 'Integratie na de overname') },
  { phase: 'transmettre', theme: 'reprise', cycles: ['transmission'], text: L('Préparation à la reprise ou à l’héritage', 'Preparing for takeover or legacy', 'Vorbereitung auf Übernahme oder Erbe', 'Preparación para la adquisición o la herencia', 'Preparazione al subentro o all’eredità', 'Voorbereiding op overname of nalatenschap') },
  { phase: 'transmettre', theme: 'compliance', text: L('Data room documentaire', 'Documentary data room', 'Dokumentarischer Datenraum', 'Data room documental', 'Data room documentale', 'Documentaire dataroom') },
  { phase: 'transmettre', theme: 'talent', text: L('Succession et continuité', 'Succession and continuity', 'Nachfolge und Kontinuität', 'Sucesión y continuidad', 'Successione e continuità', 'Opvolging en continuïteit') },
  { phase: 'transmettre', theme: 'talent', cycles: ['transmission'], text: L('Préparation du transfert', 'Preparing the transfer', 'Vorbereitung der Übergabe', 'Preparación del traspaso', 'Preparazione del trasferimento', 'Voorbereiding van de overdracht') },
]

export const SF_UI = {
  title:    L('Savoir-faire', 'Know-how', 'Know-how', 'Savoir-faire', 'Know-how', 'Expertise'),
  titleLead: L('Savoir', 'Know', 'Know', 'Savoir', 'Know', 'Expertise'),
  titleAccent: L('-faire', '-how', '-how', '-faire', '-how', ''),
  intro:    L(
    'Un même socle, de l’idée à la transmission. Chaque projet en mobilise une partie, selon son cycle et ses enjeux.',
    'One foundation, from idea to handover. Each project draws on part of it, depending on its cycle and its stakes.',
    'Ein Fundament, von der Idee bis zur Übergabe. Jedes Projekt nutzt einen Teil davon, je nach Zyklus und Anforderungen.',
    'Un mismo cimiento, de la idea a la transmisión. Cada proyecto moviliza una parte, según su ciclo y sus retos.',
    'Un’unica base, dall’idea alla trasmissione. Ogni progetto ne mobilita una parte, secondo il suo ciclo e le sue sfide.',
    'Eén basis, van idee tot overdracht. Elk project put uit een deel ervan, naargelang cyclus en uitdagingen.'),
  byCycle:  L('Par cycle', 'By cycle', 'Nach Zyklus', 'Por ciclo', 'Per ciclo', 'Per cyclus'),
  byTheme:  L('Par thème', 'By theme', 'Nach Thema', 'Por tema', 'Per tema', 'Per thema'),
  allCycles: L('Tous les cycles', 'All cycles', 'Alle Zyklen', 'Todos los ciclos', 'Tutti i cicli', 'Alle cycli'),
  allThemes: L('Tous les thèmes', 'All themes', 'Alle Themen', 'Todos los temas', 'Tutti i temi', 'Alle thema’s'),
}
