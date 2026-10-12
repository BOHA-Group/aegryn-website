/* ════════════════════════════════════════════════════════════════════
   INDUSTRIES — 5 clusters sectoriels
   Contenu éditorial par industrie, multilingue (fr/en/de/es/it/nl).
   Pattern LocaleText identique à data/articles.ts.
   Consommé par : app/[locale]/industries/[slug]/page.tsx
   ════════════════════════════════════════════════════════════════════ */

export type LocaleText = {
  fr: string
  en: string
  de: string
  es: string
  it: string
  nl: string
}

export function getLocaleText(text: LocaleText, locale: string): string {
  const key = locale as keyof LocaleText
  return text[key] ?? text.en
}

export interface IndustryMetric {
  value: string
  label: LocaleText
}

export interface IndustrySector {
  img:   string
  name:  LocaleText
  tag:   LocaleText
  desc:  LocaleText
}

export interface IndustryExpertise {
  title: LocaleText
  desc:  LocaleText
}

export interface IndustrySegment {
  label:    LocaleText
  story:    LocaleText
  problems: LocaleText[]
  /** Nom d'icone Lucide representant le profil (optionnel, voir IndustrySegments) */
  icon?:    string
}

export interface Industry {
  slug:              string
  clusterId:         string
  name:              LocaleText
  img:               string
  imgAlt:            LocaleText
  vision:            LocaleText
  keyMetrics:        IndustryMetric[]
  sectors:           IndustrySector[]
  expertise:         IndustryExpertise[]
  /** Ligne de pied sous la grille expertise (optionnel) */
  expertiseFootnote?: LocaleText
  /** Surcharge du libellé de liste des segments, ex. « Ce que nous pilotons » (optionnel) */
  problemsLabel?:    LocaleText
  segments:          IndustrySegment[]
  /** Ligne finale sous la grille segments (optionnel) */
  segmentsFootnote?: LocaleText
  articleSlugs:      string[]
}

/* ════════════════════════════════════════════════════════════════════
   1. FINANCE & CAPITAL
   ════════════════════════════════════════════════════════════════════ */
const finance: Industry = {
  slug:      'finance-capital',
  clusterId: 'finance',
  name: {
    fr: 'Finance & Capital',
    en: 'Finance & Capital',
    de: 'Finanzen & Kapital',
    es: 'Finanzas y Capital',
    it: 'Finanza & Capitale',
    nl: 'Financiën & Kapitaal',
  },
  img: '/images/industries/theme_fintech.webp',
  imgAlt: {
    fr: 'Finance & Capital — Aegryn',
    en: 'Finance & Capital — Aegryn',
    de: 'Finanzen & Kapital — Aegryn',
    es: 'Finanzas y Capital — Aegryn',
    it: 'Finanza & Capitale — Aegryn',
    nl: 'Financiën & Kapitaal — Aegryn',
  },
  vision: {
    fr: `Les organisations financières travaillent sous contrôle réglementaire permanent : chaque décision de structure, d'externalisation ou de cession est examinée par le régulateur, les clients et les investisseurs. Leur crédibilité repose sur la qualité des données, la solidité de la gouvernance et la fiabilité des chiffres.

Trois points ne laissent pas de droit à l'erreur : la résilience opérationnelle, la maîtrise des prestataires technologiques critiques et la gouvernance des données. Ils reviennent à chaque cycle : lancer une activité ou obtenir une autorisation, changer d'échelle, remédier après un incident ou une injonction, reprendre un acteur, préparer la transmission d'une société de gestion. Aegryn aide à décider, puis pilote le projet avec vos équipes de conformité, de technologie et de direction, jusqu'à sa mise en œuvre.`,
    en: `Financial organisations operate under permanent regulatory oversight: every decision on structure, outsourcing or divestment is examined by the regulator, clients and investors. Their credibility rests on data quality, governance strength and the reliability of their figures.

Three points leave no room for error: operational resilience, control of critical technology providers and data governance. They return at every cycle: launching an activity or obtaining a licence, scaling up, remediating after an incident or an injunction, acquiring a player, preparing the succession of an asset manager. Aegryn helps decide, then steers the project with your compliance, technology and leadership teams through to implementation.`,
    de: `Finanzorganisationen arbeiten unter permanenter regulatorischer Aufsicht: jede Entscheidung zu Struktur, Auslagerung oder Veräusserung wird von Regulator, Kunden und Investoren geprüft. Ihre Glaubwürdigkeit beruht auf Datenqualität, robuster Governance und der Zuverlässigkeit der Zahlen.

Drei Punkte lassen keinen Spielraum für Fehler: operative Resilienz, Beherrschung kritischer Technologie-Dienstleister und Data Governance. Sie kehren in jedem Zyklus wieder: eine Aktivität lancieren oder eine Bewilligung erhalten, die Grösse ändern, nach einem Zwischenfall oder einer Anordnung remediieren, einen Akteur übernehmen, die Übergabe einer Gesellschaft vorbereiten. Aegryn hilft entscheiden und steuert das Projekt dann mit Ihren Compliance-, Technologie- und Geschäftsleitungsteams bis zur Umsetzung.`,
    es: `Las organizaciones financieras trabajan bajo control regulatorio permanente: cada decisión de estructura, externalización o cesión es examinada por el regulador, los clientes y los inversores. Su credibilidad descansa en la calidad de los datos, la solidez de la gobernanza y la fiabilidad de las cifras.

Tres puntos no admiten margen de error: la resiliencia operativa, el control de los proveedores tecnológicos críticos y la gobernanza de los datos. Reaparecen en cada ciclo: lanzar una actividad u obtener una autorización, cambiar de escala, remediar tras un incidente o una orden, adquirir un actor, preparar la transmisión de una sociedad de gestión. Aegryn ayuda a decidir y luego pilota el proyecto con sus equipos de cumplimiento, tecnología y dirección hasta su ejecución.`,
    it: `Le organizzazioni finanziarie lavorano sotto controllo regolamentare permanente: ogni decisione di struttura, esternalizzazione o cessione è esaminata dal regolatore, dai clienti e dagli investitori. La loro credibilità si fonda sulla qualità dei dati, sulla solidità della governance e sull'affidabilità dei numeri.

Tre punti non lasciano margine di errore: la resilienza operativa, il controllo dei fornitori tecnologici critici e la governance dei dati. Tornano a ogni ciclo: lanciare un'attività o ottenere un'autorizzazione, cambiare scala, rimediare dopo un incidente o un'inibizione, rilevare un attore, preparare la trasmissione di una società di gestione. Aegryn aiuta a decidere, poi pilota il progetto con i vostri team di conformità, tecnologia e direzione fino alla sua attuazione.`,
    nl: `Financiële organisaties werken onder permanent regelgevend toezicht: elke beslissing over structuur, uitbesteding of verkoop wordt beoordeeld door de toezichthouder, klanten en investeerders. Hun geloofwaardigheid berust op datakwaliteit, solide governance en de betrouwbaarheid van de cijfers.

Drie punten laten geen ruimte voor fouten: operationele weerbaarheid, beheersing van kritieke technologie-leveranciers en datagovernance. Ze keren terug in elke cyclus: een activiteit lanceren of een vergunning verkrijgen, van schaal veranderen, herstellen na een incident of een maatregel, een speler overnemen, de overdracht van een beheermaatschappij voorbereiden. Aegryn helpt beslissen en stuurt vervolgens het project met uw compliance-, technologie- en directieteams tot de uitvoering.`,
  },
  keyMetrics: [
    { value: '47 Mrd EUR', label: {
      fr: 'investissement FinTech Europe 2023 (KPMG Pulse)',
      en: 'FinTech investment Europe 2023 (KPMG Pulse)',
      de: 'FinTech-Investitionen Europa 2023 (KPMG Pulse)',
      es: 'inversión FinTech Europa 2023 (KPMG Pulse)',
      it: 'investimenti FinTech Europa 2023 (KPMG Pulse)',
      nl: 'FinTech-investeringen Europa 2023 (KPMG Pulse)',
    }},
    { value: 'Janv. 2025', label: {
      fr: 'DORA applicable dans l\'UE',
      en: 'DORA applicable in the EU',
      de: 'DORA in der EU anwendbar',
      es: 'DORA aplicable en la UE',
      it: 'DORA applicabile nell\'UE',
      nl: 'DORA van toepassing in de EU',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/finance-trading.jpg',
      name: {
        fr: 'Banque & Services Financiers',
        en: 'Banking & Financial Services',
        de: 'Banken & Finanzdienstleistungen',
        es: 'Banca y Servicios Financieros',
        it: 'Banche & Servizi Finanziari',
        nl: 'Banken & Financiële Diensten',
      },
      tag: {
        fr: 'Réglementé', en: 'Regulated', de: 'Reguliert',
        es: 'Regulado',   it: 'Regolamentato', nl: 'Gereguleerd',
      },
      desc: {
        fr: 'Conformité DORA, Bâle IV, IA de risque crédit, modernisation back-office et résilience opérationnelle.',
        en: 'DORA compliance, Basel IV, credit risk AI, back-office modernisation and operational resilience.',
        de: 'DORA-Compliance, Basel IV, KI für Kreditrisiko, Backoffice-Modernisierung und operative Resilienz.',
        es: 'Cumplimiento DORA, Basilea IV, IA de riesgo crediticio, modernización de back-office y resiliencia operativa.',
        it: 'Conformità DORA, Basilea IV, IA per il rischio di credito, modernizzazione del back-office e resilienza operativa.',
        nl: 'DORA-compliance, Bazel IV, AI voor kredietrisico, back-office-modernisering en operationele weerbaarheid.',
      },
    },
    {
      img: '/images/blog/fintech-app.jpg',
      name: {
        fr: 'FinTech & Paiements',
        en: 'FinTech & Payments',
        de: 'FinTech & Zahlungsverkehr',
        es: 'FinTech y Pagos',
        it: 'FinTech & Pagamenti',
        nl: 'FinTech & Betalingen',
      },
      tag: {
        fr: 'Croissance', en: 'Growth', de: 'Wachstum',
        es: 'Crecimiento', it: 'Crescita', nl: 'Groei',
      },
      desc: {
        fr: 'PSD2, open banking, AML/KYC, architectures paiement temps réel, tokenisation et métriques SaaS défendables.',
        en: 'PSD2, open banking, AML/KYC, real-time payment architectures, tokenisation and defensible SaaS metrics.',
        de: 'PSD2, Open Banking, AML/KYC, Echtzeit-Zahlungsarchitekturen, Tokenisierung und belastbare SaaS-Kennzahlen.',
        es: 'PSD2, open banking, AML/KYC, arquitecturas de pago en tiempo real, tokenización y métricas SaaS defendibles.',
        it: 'PSD2, open banking, AML/KYC, architetture di pagamento in tempo reale, tokenizzazione e metriche SaaS difendibili.',
        nl: 'PSD2, open banking, AML/KYC, realtime-betaalarchitecturen, tokenisatie en verdedigbare SaaS-metrics.',
      },
    },
    {
      img: '/images/industries/sector-proptech.jpg',
      name: {
        fr: 'PropTech & Immobilier',
        en: 'PropTech & Real Estate',
        de: 'PropTech & Immobilien',
        es: 'PropTech e Inmobiliario',
        it: 'PropTech & Immobiliare',
        nl: 'PropTech & Vastgoed',
      },
      tag: {
        fr: 'Hybride', en: 'Hybrid', de: 'Hybrid',
        es: 'Híbrido', it: 'Ibrido', nl: 'Hybride',
      },
      desc: {
        fr: 'Valorisation des actifs, IA scoring locataire, plateforme transaction, données ESG et dualité logiciel/actif physique.',
        en: 'Asset valuation, tenant-scoring AI, transaction platforms, ESG data and the software/physical-asset duality.',
        de: 'Asset-Bewertung, KI für Mieter-Scoring, Transaktionsplattformen, ESG-Daten und die Dualität Software/physisches Asset.',
        es: 'Valoración de activos, IA de scoring de inquilinos, plataformas de transacción, datos ESG y dualidad software/activo físico.',
        it: 'Valorizzazione degli asset, IA per lo scoring degli inquilini, piattaforme di transazione, dati ESG e dualità software/asset fisico.',
        nl: 'Vastgoedwaardering, AI voor huurders-scoring, transactieplatforms, ESG-data en de dualiteit software/fysiek actief.',
      },
    },
    {
      img: '/images/blog/investment-coins.jpg',
      name: {
        fr: 'Gestion d\'actifs, fonds & family offices',
        en: 'Asset management, funds & family offices',
        de: 'Asset Management, Fonds & Family Offices',
        es: 'Gestión de activos, fondos y family offices',
        it: 'Gestione patrimoniale, fondi & family office',
        nl: 'Vermogensbeheer, fondsen & family offices',
      },
      tag: {
        fr: 'Capital', en: 'Capital', de: 'Kapital',
        es: 'Capital', it: 'Capitale', nl: 'Kapitaal',
      },
      desc: {
        fr: 'Sociétés de gestion, fonds, family offices : revue de cibles, gouvernance des participations, transmission des fondateurs.',
        en: 'Asset managers, funds, family offices: target review, governance of holdings, founder succession.',
        de: 'Gesellschaften, Fonds, Family Offices: Zielprüfung, Governance der Beteiligungen, Übergabe der Gründer.',
        es: 'Sociedades de gestión, fondos, family offices: revisión de objetivos, gobernanza de participaciones, transmisión de fundadores.',
        it: 'Società di gestione, fondi, family office: revisione dei target, governance delle partecipazioni, trasmissione dei fondatori.',
        nl: 'Beheerders, fondsen, family offices: beoordeling van doelwitten, governance van deelnemingen, opvolging van oprichters.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Face aux nouveaux entrants : stratégie et modèle',
        en: 'Facing new entrants: strategy and model',
        de: 'Gegen neue Wettbewerber: Strategie und Modell',
        es: 'Frente a los nuevos entrantes: estrategia y modelo',
        it: 'Di fronte ai nuovi entranti: strategia e modello',
        nl: 'Tegenover nieuwe toetreders: strategie en model',
      },
      desc: {
        fr: 'Positionnement face aux FinTech, revue du modèle économique, nouveaux produits et marchés, fonctionnement du conseil d\'administration, thèse d\'acquisition ou d\'investissement. Livrable : grille des quatre tests appliquée aux options, et plan à 12-18 mois.',
        en: 'Positioning against FinTechs, business model review, new products and markets, board operations, acquisition or investment thesis. Deliverable: four-test grid applied to the options, and a 12-18 month plan.',
        de: 'Positionierung gegenüber FinTechs, Überprüfung des Geschäftsmodells, neue Produkte und Märkte, Arbeitsweise des Verwaltungsrats, Akquisitions- oder Investmentthese. Lieferung: Vier-Tests-Raster angewendet auf die Optionen und 12-18-Monats-Plan.',
        es: 'Posicionamiento frente a las FinTech, revisión del modelo económico, nuevos productos y mercados, funcionamiento del consejo, tesis de adquisición o inversión. Entregable: cuadrícula de las cuatro pruebas aplicada a las opciones y plan a 12-18 meses.',
        it: 'Posizionamento rispetto alle FinTech, revisione del modello economico, nuovi prodotti e mercati, funzionamento del consiglio di amministrazione, tesi di acquisizione o investimento. Deliverable: griglia dei quattro test applicata alle opzioni e piano a 12-18 mesi.',
        nl: 'Positionering tegenover FinTechs, herziening van het verdienmodel, nieuwe producten en markten, werking van de raad van bestuur, overname- of investeringsthese. Deliverable: vier-toetsen-raster toegepast op de opties en een 12-18-maandenplan.',
      },
    },
    {
      title: {
        fr: 'Conformité réglementaire & résilience opérationnelle',
        en: 'Regulatory compliance & operational resilience',
        de: 'Regulatorische Compliance & operative Resilienz',
        es: 'Cumplimiento regulatorio y resiliencia operativa',
        it: 'Conformità regolamentare & resilienza operativa',
        nl: 'Regelgevingscompliance & operationele weerbaarheid',
      },
      desc: {
        fr: 'Cartographie des exigences applicables (FINMA, DORA, NIS2, AI Act, LPD, lutte contre le blanchiment), plan de mise en conformité, continuité d\'activité, gestion des incidents et obligations de signalement, préparation aux inspections et aux audits. Livrable : carte « applicable maintenant / bientôt / pas concerné » et plan de remédiation priorisé.',
        en: 'Mapping of applicable requirements (FINMA, DORA, NIS2, AI Act, Swiss FADP, anti-money laundering), compliance plan, business continuity, incident management and reporting obligations, preparation for inspections and audits. Deliverable: "applies now / soon / not concerned" map and prioritised remediation plan.',
        de: 'Kartierung der anwendbaren Anforderungen (FINMA, DORA, NIS2, AI Act, DSG, Geldwäschereibekämpfung), Compliance-Plan, Betriebskontinuität, Incident-Management und Meldepflichten, Vorbereitung auf Inspektionen und Audits. Lieferung: Karte «jetzt anwendbar / bald / nicht betroffen» und priorisierter Remediationsplan.',
        es: 'Mapeo de los requisitos aplicables (FINMA, DORA, NIS2, AI Act, LPD suiza, prevención del blanqueo), plan de cumplimiento, continuidad de la actividad, gestión de incidentes y obligaciones de notificación, preparación para inspecciones y auditorías. Entregable: mapa «aplicable ahora / pronto / no afectado» y plan de remediación priorizado.',
        it: 'Mappatura dei requisiti applicabili (FINMA, DORA, NIS2, AI Act, LPD, lotta al riciclaggio), piano di conformità, continuità operativa, gestione degli incidenti e obblighi di segnalazione, preparazione a ispezioni e audit. Deliverable: mappa «applicabile ora / presto / non interessati» e piano di remediation prioritizzato.',
        nl: 'In kaart brengen van toepasselijke eisen (FINMA, DORA, NIS2, AI Act, Zwitserse WBG, anti-witwasregels), complianceplan, bedrijfscontinuïteit, incidentmanagement en meldplichten, voorbereiding op inspecties en audits. Deliverable: kaart «nu van toepassing / binnenkort / niet van toepassing» en geprioriteerd herstelplan.',
      },
    },
    {
      title: {
        fr: 'Prestataires critiques, systèmes & souveraineté des données',
        en: 'Critical providers, systems & data sovereignty',
        de: 'Kritische Dienstleister, Systeme & Datensouveränität',
        es: 'Proveedores críticos, sistemas y soberanía de los datos',
        it: 'Fornitori critici, sistemi & sovranità dei dati',
        nl: 'Kritieke leveranciers, systemen & datasoevereiniteit',
      },
      desc: {
        fr: 'Cartographie des prestataires critiques et plan de sortie, architecture résiliente, cloud souverain, gouvernance des modèles d\'IA (scoring, alertes). Outils sur mesure seulement lorsque le marché n\'en propose pas. Livrable : test de réversibilité et arbitrage chiffré.',
        en: 'Mapping of critical providers and exit plan, resilient architecture, sovereign cloud, governance of AI models (scoring, alerting). Custom tools only when the market does not offer them. Deliverable: reversibility test and quantified trade-off.',
        de: 'Kartierung kritischer Dienstleister und Exit-Plan, resiliente Architektur, souveräne Cloud, Governance der KI-Modelle (Scoring, Alerts). Massgeschneiderte Tools nur, wenn der Markt keine anbietet. Lieferung: Reversibilitätstest und bezifferte Abwägung.',
        es: 'Mapeo de proveedores críticos y plan de salida, arquitectura resiliente, cloud soberano, gobernanza de los modelos de IA (scoring, alertas). Herramientas a medida solo cuando el mercado no las ofrece. Entregable: prueba de reversibilidad y arbitraje cifrado.',
        it: 'Mappatura dei fornitori critici e piano di uscita, architettura resiliente, cloud sovrano, governance dei modelli di IA (scoring, alerting). Strumenti su misura solo quando il mercato non li offre. Deliverable: test di reversibilità e arbitrato quantificato.',
        nl: 'In kaart brengen van kritieke leveranciers en exitplan, weerbare architectuur, soevereine cloud, governance van AI-modellen (scoring, alerting). Maatwerk alleen als de markt het niet aanbiedt. Deliverable: omkeerbaarheidstest en onderbouwde afweging.',
      },
    },
    {
      title: {
        fr: 'Fonctions réglementées & succession des gérants',
        en: 'Regulated roles & management succession',
        de: 'Regulierte Funktionen & Nachfolge der Geschäftsleitung',
        es: 'Funciones reguladas y sucesión de los gestores',
        it: 'Funzioni regolamentate & successione dei gestori',
        nl: 'Gereguleerde functies & opvolging van het management',
      },
      desc: {
        fr: 'Responsables du risque, de la conformité, de la technologie et de la finance, gérants et responsables de portefeuille, succession du fondateur d\'une société de gestion. Livrable : fiche de poste, profils présélectionnés, plan de succession.',
        en: 'Risk, compliance, technology and finance officers, managers and portfolio leads, succession of an asset manager founder. Deliverable: job description, shortlisted profiles, succession plan.',
        de: 'Verantwortliche für Risiko, Compliance, Technologie und Finanzen, Geschäftsführer und Portfoliomanager, Nachfolge des Gründers einer Gesellschaft. Lieferung: Stellenprofil, vorausgewählte Profile, Nachfolgeplan.',
        es: 'Responsables de riesgo, cumplimiento, tecnología y finanzas, gestores y responsables de cartera, sucesión del fundador de una sociedad de gestión. Entregable: ficha de puesto, perfiles preseleccionados, plan de sucesión.',
        it: 'Responsabili di rischio, conformità, tecnologia e finanza, gestori e responsabili di portafoglio, successione del fondatore di una società di gestione. Deliverable: scheda di posizione, profili preselezionati, piano di successione.',
        nl: 'Verantwoordelijken voor risico, compliance, technologie en financiën, managers en portfoliobehouders, opvolging van de oprichter van een beheermaatschappij. Deliverable: functieprofiel, voorgeselecteerde profielen, opvolgingsplan.',
      },
    },
    {
      title: {
        fr: 'Reprise, séparation & cession d\'activités financières',
        en: 'Acquisition, carve-out & divestment of financial activities',
        de: 'Übernahme, Abspaltung & Veräusserung von Finanzaktivitäten',
        es: 'Adquisición, separación y cesión de actividades financieras',
        it: 'Acquisizione, separazione & cessione di attività finanziarie',
        nl: 'Overname, afsplitsing & verkoop van financiële activiteiten',
      },
      desc: {
        fr: 'Revue d\'une cible ou d\'une fintech avant l\'offre : agréments à transférer, qualité des données, contrats à clause de changement de contrôle, dépendance aux gérants et aux développeurs clés. Intégration, séparation ou cession. La certification CIFSO 5000 reste possible en appui. Livrable : traitement proposé pour chaque point (prix, garantie, condition suspensive) et plan d\'intégration ou de séparation jalonné. L\'exécution revient à votre banque d\'affaires et à vos avocats.',
        en: 'Review of a target or a fintech before the offer: licences to transfer, data quality, contracts with change-of-control clauses, dependency on key managers and developers. Integration, carve-out or divestment. CIFSO 5000 certification remains available in support. Deliverable: proposed treatment for each point (price, warranty, suspensive condition) and a milestone-based integration or separation plan. Execution remains with your investment bank and your lawyers.',
        de: 'Prüfung einer Zielgesellschaft oder eines FinTechs vor dem Angebot: zu übertragende Bewilligungen, Datenqualität, Verträge mit Change-of-Control-Klauseln, Abhängigkeit von Führungskräften und Schlüsselentwicklern. Integration, Abspaltung oder Veräusserung. Die CIFSO-5000-Zertifizierung bleibt unterstützend möglich. Lieferung: vorgeschlagene Behandlung für jeden Punkt (Preis, Garantie, aufschiebende Bedingung) und ein Meilensteinplan für Integration oder Abspaltung. Die Ausführung obliegt Ihrer Investmentbank und Ihren Anwälten.',
        es: 'Revisión de una empresa objetivo o una fintech antes de la oferta: autorizaciones a transferir, calidad de los datos, contratos con cláusula de cambio de control, dependencia de gestores y desarrolladores clave. Integración, separación o cesión. La certificación CIFSO 5000 sigue siendo posible como apoyo. Entregable: tratamiento propuesto para cada punto (precio, garantía, condición suspensiva) y plan de integración o separación por hitos. La ejecución corresponde a su banco de inversión y a sus abogados.',
        it: 'Revisione di un target o di una fintech prima dell\'offerta: autorizzazioni da trasferire, qualità dei dati, contratti con clausola di cambio di controllo, dipendenza da gestori e sviluppatori chiave. Integrazione, separazione o cessione. La certificazione CIFSO 5000 resta possibile a supporto. Deliverable: trattamento proposto per ogni punto (prezzo, garanzia, condizione sospensiva) e piano di integrazione o separazione a tappe. L\'esecuzione spetta alla vostra banca d\'affari e ai vostri avvocati.',
        nl: 'Beoordeling van een doelwit of een fintech vóór het bod: over te dragen vergunningen, datakwaliteit, contracten met change-of-control-clausules, afhankelijkheid van managers en sleutelontwikkelaars. Integratie, afsplitsing of verkoop. De CIFSO 5000-certificering blijft ter ondersteuning mogelijk. Deliverable: voorgestelde behandeling voor elk punt (prijs, garantie, opschortende voorwaarde) en een plan voor integratie of afsplitsing met mijlpalen. De uitvoering komt toe aan uw investeringsbank en uw advocaten.',
      },
    },
  ],
  expertiseFootnote: {
    fr: 'Mobilisables seules, ou réunies en un programme que nous pilotons.',
    en: 'Available individually, or combined into a single programme we steer.',
    de: 'Einzeln einsetzbar oder vereint zu einem Programm, das wir steuern.',
    es: 'Movilizables por separado, o reunidas en un programa que pilotamos.',
    it: 'Mobilitabili singolarmente, o riunite in un programma che pilotiamo.',
    nl: 'Afzonderlijk inzetbaar, of gebundeld in een programma dat wij sturen.',
  },
  problemsLabel: {
    fr: 'Ce que nous pilotons',
    en: 'What we steer',
    de: 'Was wir steuern',
    es: 'Lo que pilotamos',
    it: 'Ciò che pilotiamo',
    nl: 'Wat wij sturen',
  },
  segments: [
    {
      label: {
        fr: 'Banques, assureurs & établissements financiers : cycles Croissance et Restructuration',
        en: 'Banks, insurers & financial institutions: Growth and Restructuring cycles',
        de: 'Banken, Versicherer & Finanzinstitute: Zyklen Wachstum und Restrukturierung',
        es: 'Bancos, aseguradoras y entidades financieras: ciclos Crecimiento y Reestructuración',
        it: 'Banche, assicurazioni & istituzioni finanziarie: cicli Crescita e Ristrutturazione',
        nl: 'Banken, verzekeraars & financiële instellingen: cycli Groei en Herstructurering',
      },
      icon: 'Landmark',
      story: {
        fr: 'Vous externalisez des services critiques (cloud, paiement, données) et votre conseil ou le régulateur vous demande de démontrer votre résilience. Les dépendances sont mal cartographiées et les responsabilités se dispersent entre risque, informatique et métiers.',
        en: 'You outsource critical services (cloud, payments, data) and your board or the regulator asks you to demonstrate your resilience. Dependencies are poorly mapped and responsibilities are scattered across risk, IT and business lines.',
        de: 'Sie lagern kritische Dienste aus (Cloud, Zahlungsverkehr, Daten) und Ihr Verwaltungsrat oder der Regulator verlangt einen Resilienznachweis. Die Abhängigkeiten sind kaum kartiert und die Verantwortlichkeiten verteilen sich auf Risiko, Informatik und Fachbereiche.',
        es: 'Externaliza servicios críticos (cloud, pagos, datos) y su consejo o el regulador le pide demostrar su resiliencia. Las dependencias están mal mapeadas y las responsabilidades se dispersan entre riesgo, informática y negocio.',
        it: 'Esternalizzate servizi critici (cloud, pagamenti, dati) e il vostro consiglio o il regolatore vi chiede di dimostrare la resilienza. Le dipendenze sono poco mappate e le responsabilità si disperdono tra rischio, informatica e business.',
        nl: 'U besteedt kritieke diensten uit (cloud, betalingen, data) en uw raad of de toezichthouder vraagt u uw weerbaarheid aan te tonen. Afhankelijkheden zijn slecht in kaart gebracht en verantwoordelijkheden versnipperen tussen risico, IT en business.',
      },
      problems: [
        {
          fr: 'Cartographier les prestataires critiques et préparer leur plan de sortie → registre des dépendances et plan de sortie par prestataire.',
          en: 'Map critical providers and prepare their exit plan → dependency register and per-provider exit plan.',
          de: 'Kritische Dienstleister kartieren und ihren Exit-Plan vorbereiten → Abhängigkeitsregister und Exit-Plan pro Dienstleister.',
          es: 'Mapear los proveedores críticos y preparar su plan de salida → registro de dependencias y plan de salida por proveedor.',
          it: 'Mappare i fornitori critici e preparare il loro piano di uscita → registro delle dipendenze e piano di uscita per fornitore.',
          nl: 'Kritieke leveranciers in kaart brengen en hun exitplan voorbereiden → afhankelijkhedenregister en exitplan per leverancier.',
        },
        {
          fr: 'Remédier aux écarts de conformité (DORA pour les entités de l\'UE, exigences de la FINMA en Suisse) → plan de remédiation à 12 mois et suivi pour le comité de direction.',
          en: 'Remediate compliance gaps (DORA for EU entities, FINMA requirements in Switzerland) → 12-month remediation plan and executive committee tracking.',
          de: 'Compliance-Lücken beheben (DORA für EU-Einheiten, FINMA-Anforderungen in der Schweiz) → 12-Monats-Remediationsplan und Monitoring für die Geschäftsleitung.',
          es: 'Remediar las brechas de cumplimiento (DORA para entidades UE, requisitos FINMA en Suiza) → plan de remediación a 12 meses y seguimiento para el comité de dirección.',
          it: 'Rimediate ai gap di conformità (DORA per le entità UE, requisiti FINMA in Svizzera) → piano di remediation a 12 mesi e monitoraggio per il comitato direzionale.',
          nl: 'Compliance-lacunes herstellen (DORA voor EU-entiteiten, FINMA-eisen in Zwitserland) → 12-maanden-herstelplan en monitoring voor de directie.',
        },
        {
          fr: 'Encadrer les modèles d\'IA de scoring et d\'alerte → charte d\'usage et registre des modèles.',
          en: 'Govern AI scoring and alerting models → usage charter and model register.',
          de: 'KI-Scoring- und Alarmmodelle steuern → Nutzungs-Charta und Modellregister.',
          es: 'Encuadrar los modelos de IA de scoring y alerta → carta de uso y registro de modelos.',
          it: 'Inquadrare i modelli di IA di scoring e alerting → carta d\'uso e registro dei modelli.',
          nl: 'AI-scoring- en alertmodellen kaderen → gebruikscharter en modelregister.',
        },
      ],
    },
    {
      label: {
        fr: 'FinTech, paiement & RegTech : cycles Lancement et Croissance',
        en: 'FinTech, payments & RegTech: Launch and Growth cycles',
        de: 'FinTech, Zahlungsverkehr & RegTech: Zyklen Lancierung und Wachstum',
        es: 'FinTech, pagos y RegTech: ciclos Lanzamiento y Crecimiento',
        it: 'FinTech, pagamenti & RegTech: cicli Lancio e Crescita',
        nl: 'FinTech, betalingen & RegTech: cycli Lancering en Groei',
      },
      icon: 'CreditCard',
      story: {
        fr: 'Vous lancez un produit de paiement ou de crédit, ou vous ouvrez un deuxième pays. Autorisation ou partenariat bancaire, KYC/AML, hébergement, premiers recrutements : chaque exigence a son propre interlocuteur.',
        en: 'You are launching a payment or credit product, or opening a second country. Licence or banking partnership, KYC/AML, hosting, first hires: each requirement has its own counterpart.',
        de: 'Sie lancieren ein Zahlungs- oder Kreditprodukt oder erschliessen ein zweites Land. Bewilligung oder Bankpartnerschaft, KYC/AML, Hosting, erste Anstellungen: jede Anforderung hat ihren eigenen Ansprechpartner.',
        es: 'Lanza un producto de pago o crédito, o abre un segundo país. Autorización o alianza bancaria, KYC/AML, alojamiento, primeras contrataciones: cada requisito tiene su propio interlocutor.',
        it: 'Lanciate un prodotto di pagamento o di credito, o aprite un secondo paese. Autorizzazione o partnership bancaria, KYC/AML, hosting, prime assunzioni: ogni requisito ha il suo interlocutore.',
        nl: 'U lanceert een betaal- of kredietproduct, of opent een tweede land. Vergunning of bankpartnerschap, KYC/AML, hosting, eerste aanwervingen: elke eis heeft zijn eigen gesprekspartner.',
      },
      problems: [
        {
          fr: 'Choisir le modèle réglementaire (autorisation propre ou partenariat avec un établissement agréé) → arbitrage écrit, avec ce qu\'il faut renoncer à faire.',
          en: 'Choose the regulatory model (own licence or partnership with a licensed institution) → written trade-off, including what to give up.',
          de: 'Das regulatorische Modell wählen (eigene Bewilligung oder Partnerschaft mit einem zugelassenen Institut) → schriftliche Abwägung, inklusive dessen, worauf verzichtet werden muss.',
          es: 'Elegir el modelo regulatorio (autorización propia o alianza con una entidad autorizada) → arbitraje escrito, con lo que hay que renunciar a hacer.',
          it: 'Scegliere il modello regolamentare (autorizzazione propria o partnership con un istituto autorizzato) → arbitrato scritto, con ciò a cui rinunciare.',
          nl: 'Het regelgevingsmodel kiezen (eigen vergunning of partnerschap met een vergunde instelling) → schriftelijke afweging, inclusief wat u moet laten.',
        },
        {
          fr: 'Sécuriser plateforme et prestataires : propriété du code, réversibilité, hébergement → note de position et clauses à corriger.',
          en: 'Secure platform and providers: code ownership, reversibility, hosting → position note and clauses to fix.',
          de: 'Plattform und Dienstleister absichern: Code-Eigentum, Reversibilität, Hosting → Positionspapier und zu korrigierende Klauseln.',
          es: 'Asegurar plataforma y proveedores: propiedad del código, reversibilidad, alojamiento → nota de posición y cláusulas a corregir.',
          it: 'Mettere in sicurezza piattaforma e fornitori: proprietà del codice, reversibilità, hosting → nota di posizione e clausole da correggere.',
          nl: 'Platform en leveranciers borgen: code-eigendom, omkeerbaarheid, hosting → positienotitie en te corrigeren clausules.',
        },
        {
          fr: 'Sélectionner les responsables de la conformité, du risque et de la technologie → fiches de poste et profils présélectionnés.',
          en: 'Select compliance, risk and technology officers → job descriptions and shortlisted profiles.',
          de: 'Verantwortliche für Compliance, Risiko und Technologie auswählen → Stellenprofile und vorausgewählte Profile.',
          es: 'Seleccionar los responsables de cumplimiento, riesgo y tecnología → fichas de puesto y perfiles preseleccionados.',
          it: 'Selezionare i responsabili di conformità, rischio e tecnologia → schede di posizione e profili preselezionati.',
          nl: 'Compliance-, risico- en technologieverantwoordelijken selecteren → functieprofielen en voorgeselecteerde profielen.',
        },
      ],
    },
    {
      label: {
        fr: 'Fonds, family offices & sociétés de gestion : cycles Acquisition (Reprise) et Transmission',
        en: 'Funds, family offices & asset managers: Acquisition (Takeover) and Succession cycles',
        de: 'Fonds, Family Offices & Gesellschaften: Zyklen Akquisition (Übernahme) und Übergabe',
        es: 'Fondos, family offices y sociedades de gestión: ciclos Adquisición (Toma de control) y Transmisión',
        it: 'Fondi, family office & società di gestione: cicli Acquisizione (Subentro) e Trasmissione',
        nl: 'Fondsen, family offices & beheerders: cycli Overname en Overdracht',
      },
      icon: 'Briefcase',
      story: {
        fr: 'Vous étudiez une cible dans les services financiers, ou le fondateur de votre société de gestion prépare son départ. Data room incomplète, dépendance à quelques gérants, agréments à transférer.',
        en: 'You are assessing a target in financial services, or the founder of your asset manager is preparing to leave. Incomplete data room, dependency on a few managers, licences to transfer.',
        de: 'Sie prüfen eine Zielgesellschaft im Finanzdienstleistungsbereich, oder der Gründer Ihrer Gesellschaft bereitet seinen Ausstieg vor. Unvollständiger Datenraum, Abhängigkeit von wenigen Managern, zu übertragende Bewilligungen.',
        es: 'Analiza una empresa objetivo en servicios financieros, o el fundador de su sociedad de gestión prepara su salida. Data room incompleto, dependencia de unos pocos gestores, autorizaciones a transferir.',
        it: 'Valutate un target nei servizi finanziari, o il fondatore della vostra società di gestione prepara la sua uscita. Data room incompleta, dipendenza da pochi gestori, autorizzazioni da trasferire.',
        nl: 'U beoordeelt een doelwit in financiële dienstverlening, of de oprichter van uw beheermaatschappij bereidt zijn vertrek voor. Incomplete dataroom, afhankelijkheid van enkele managers, over te dragen vergunningen.',
      },
      problems: [
        {
          fr: 'Passer la cible au crible : agréments, qualité des données, contrats, personnes clés → traitement proposé pour chaque point : prix, garantie, condition suspensive.',
          en: 'Screen the target: licences, data quality, contracts, key people → proposed treatment for each point: price, warranty, suspensive condition.',
          de: 'Die Zielgesellschaft prüfen: Bewilligungen, Datenqualität, Verträge, Schlüsselpersonen → vorgeschlagene Behandlung für jeden Punkt: Preis, Garantie, aufschiebende Bedingung.',
          es: 'Examinar la empresa objetivo: autorizaciones, calidad de datos, contratos, personas clave → tratamiento propuesto para cada punto: precio, garantía, condición suspensiva.',
          it: 'Esaminare il target: autorizzazioni, qualità dei dati, contratti, persone chiave → trattamento proposto per ogni punto: prezzo, garanzia, condizione sospensiva.',
          nl: 'Het doelwit doorlichten: vergunningen, datakwaliteit, contracten, sleutelpersonen → voorgestelde behandeling voor elk punt: prijs, garantie, opschortende voorwaarde.',
        },
        {
          fr: 'Préparer l\'intégration ou la séparation → plan d\'intégration jalonné.',
          en: 'Prepare integration or separation → milestone-based integration plan.',
          de: 'Integration oder Abspaltung vorbereiten → Integrationsplan mit Meilensteinen.',
          es: 'Preparar la integración o la separación → plan de integración por hitos.',
          it: 'Preparare l\'integrazione o la separazione → piano di integrazione a tappe.',
          nl: 'Integratie of afsplitsing voorbereiden → integratieplan met mijlpalen.',
        },
        {
          fr: 'Organiser la succession et la rétention des gérants → plan de succession sur 24 mois.',
          en: 'Organise management succession and retention → 24-month succession plan.',
          de: 'Nachfolge und Bindung der Führungskräfte organisieren → 24-Monats-Nachfolgeplan.',
          es: 'Organizar la sucesión y la retención de los gestores → plan de sucesión a 24 meses.',
          it: 'Organizzare la successione e la retention dei gestori → piano di successione a 24 mesi.',
          nl: 'Opvolging en behoud van het management organiseren → 24-maanden-opvolgingsplan.',
        },
      ],
    },
  ],
  segmentsFootnote: {
    fr: 'L\'exécution de la transaction reste confiée à votre banque d\'affaires ou à vos avocats. Aegryn ne fournit ni conseil en investissement ni gestion de fortune.',
    en: 'Transaction execution remains with your investment bank or your lawyers. Aegryn provides neither investment advice nor wealth management.',
    de: 'Die Transaktionsausführung obliegt Ihrer Investmentbank oder Ihren Anwälten. Aegryn bietet weder Anlageberatung noch Vermögensverwaltung.',
    es: 'La ejecución de la transacción queda a cargo de su banco de inversión o de sus abogados. Aegryn no ofrece asesoramiento de inversión ni gestión patrimonial.',
    it: 'L\'esecuzione della transazione resta affidata alla vostra banca d\'affari o ai vostri avvocati. Aegryn non fornisce consulenza sugli investimenti né gestione patrimoniale.',
    nl: 'De transactie-uitvoering blijft bij uw investeringsbank of uw advocaten. Aegryn biedt geen beleggingsadvies noch vermogensbeheer.',
  },
  articleSlugs: [
    'fintech-europe-ma-valorisation-2026',
    'family-office-investissement-actifs-tech',
    'succession-transmission-entreprise-numerique-fondateur',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   2. SANTÉ & SCIENCES DE LA VIE
   ════════════════════════════════════════════════════════════════════ */
const sante: Industry = {
  slug:      'sante-sciences-de-la-vie',
  clusterId: 'sante',
  name: {
    fr: 'Santé & Sciences de la Vie',
    en: 'Health & Life Sciences',
    de: 'Gesundheit & Life Sciences',
    es: 'Salud y Ciencias de la Vida',
    it: 'Salute & Scienze della Vita',
    nl: 'Gezondheid & Life Sciences',
  },
  img: '/images/industries/cluster-sante.jpg',
  imgAlt: {
    fr: 'Santé & Sciences de la Vie — Aegryn',
    en: 'Health & Life Sciences — Aegryn',
    de: 'Gesundheit & Life Sciences — Aegryn',
    es: 'Salud y Ciencias de la Vida — Aegryn',
    it: 'Salute & Scienze della Vita — Aegryn',
    nl: 'Gezondheid & Life Sciences — Aegryn',
  },
  vision: {
    fr: `Les organisations de santé et de sciences de la vie opèrent sous des exigences de conformité parmi les plus strictes au monde. Leur crédibilité tient à la qualité de leurs données cliniques, à la rigueur de leurs protocoles et à la solidité de leur gouvernance réglementaire.

Trois points décident du calendrier : l'autorisation de mise sur le marché (MDR/IVDR, Swissmedic, EMA), la protection et la souveraineté des données de santé, et la dépendance à quelques experts cliniques ou réglementaires. Ils reviennent à chaque cycle : lancer un dispositif, changer d'échelle, remédier après un audit, reprendre un acteur, préparer la cession d'une division ou d'une société. Aegryn aide à décider, puis pilote le projet avec vos équipes qualité, réglementaires, technologiques et de direction, jusqu'à sa mise en œuvre.`,
    en: `Health and life sciences organisations operate under some of the strictest compliance requirements in the world. Their credibility rests on the quality of their clinical data, the rigour of their protocols and the strength of their regulatory governance.

Three points decide the timeline: market authorisation (MDR/IVDR, Swissmedic, EMA), the protection and sovereignty of health data, and dependency on a few clinical or regulatory experts. They return at every cycle: launching a device, scaling up, remediating after an audit, acquiring a player, preparing the divestment of a division or a company. Aegryn helps decide, then steers the project with your quality, regulatory, technology and leadership teams through to implementation.`,
    de: `Organisationen im Gesundheitswesen und in den Life Sciences arbeiten unter einigen der strengsten Compliance-Anforderungen weltweit. Ihre Glaubwürdigkeit beruht auf der Qualität ihrer klinischen Daten, der Rigorosität ihrer Protokolle und der Stärke ihrer regulatorischen Governance.

Drei Punkte bestimmen den Zeitplan: die Marktzulassung (MDR/IVDR, Swissmedic, EMA), der Schutz und die Souveränität der Gesundheitsdaten und die Abhängigkeit von wenigen klinischen oder regulatorischen Experten. Sie kehren in jedem Zyklus wieder: ein Produkt lancieren, die Grösse ändern, nach einem Audit remediieren, einen Akteur übernehmen, die Veräusserung einer Division oder einer Gesellschaft vorbereiten. Aegryn hilft entscheiden und steuert das Projekt dann mit Ihren Qualitäts-, Regulatory-, Technologie- und Geschäftsleitungsteams bis zur Umsetzung.`,
    es: `Las organizaciones de salud y ciencias de la vida operan bajo unos requisitos de cumplimiento entre los más estrictos del mundo. Su credibilidad depende de la calidad de sus datos clínicos, del rigor de sus protocolos y de la solidez de su gobernanza regulatoria.

Tres puntos deciden el calendario: la autorización de comercialización (MDR/IVDR, Swissmedic, EMA), la protección y soberanía de los datos de salud, y la dependencia de unos pocos expertos clínicos o regulatorios. Reaparecen en cada ciclo: lanzar un dispositivo, cambiar de escala, remediar tras una auditoría, adquirir un actor, preparar la cesión de una división o una sociedad. Aegryn ayuda a decidir y luego pilota el proyecto con sus equipos de calidad, regulación, tecnología y dirección hasta su ejecución.`,
    it: `Le organizzazioni sanitarie e delle scienze della vita operano con requisiti di conformità tra i più severi al mondo. La loro credibilità dipende dalla qualità dei dati clinici, dal rigore dei protocolli e dalla solidità della governance regolamentare.

Tre punti decidono il calendario: l'autorizzazione all'immissione sul mercato (MDR/IVDR, Swissmedic, EMA), la protezione e la sovranità dei dati sanitari e la dipendenza da pochi esperti clinici o regolatori. Tornano a ogni ciclo: lanciare un dispositivo, cambiare scala, rimediare dopo un audit, rilevare un attore, preparare la cessione di una divisione o di una società. Aegryn aiuta a decidere, poi pilota il progetto con i vostri team di qualità, affari regolatori, tecnologia e direzione fino all'attuazione.`,
    nl: `Zorg- en life-sciences-organisaties werken onder enkele van de strengste compliance-eisen ter wereld. Hun geloofwaardigheid hangt af van de kwaliteit van hun klinische data, de strengheid van hun protocollen en de robuustheid van hun regelgevende governance.

Drie punten bepalen de planning: markttoelating (MDR/IVDR, Swissmedic, EMA), de bescherming en soevereiniteit van gezondheidsdata en de afhankelijkheid van enkele klinische of regelgevende experts. Ze keren terug in elke cyclus: een hulpmiddel lanceren, van schaal veranderen, herstellen na een audit, een speler overnemen, de verkoop van een divisie of onderneming voorbereiden. Aegryn helpt beslissen en stuurt het project vervolgens met uw kwaliteits-, regelgevings-, technologie- en directieteams tot de uitvoering.`,
  },
  keyMetrics: [
    { value: '278 Mrd EUR', label: {
      fr: 'marché santé numérique mondial 2028 (Grand View Research 2024)',
      en: 'global digital health market 2028 (Grand View Research 2024)',
      de: 'weltweiter Digital-Health-Markt 2028 (Grand View Research 2024)',
      es: 'mercado mundial de salud digital 2028 (Grand View Research 2024)',
      it: 'mercato globale della salute digitale 2028 (Grand View Research 2024)',
      nl: 'wereldwijde digitale-gezondheidsmarkt 2028 (Grand View Research 2024)',
    }},
    { value: '2 ans', label: {
      fr: 'délai moyen de marquage CE d\'un dispositif médical (MDR/IVDR)',
      en: 'average CE marking time for a medical device (MDR/IVDR)',
      de: 'durchschnittliche Dauer der CE-Kennzeichnung für ein Medizinprodukt (MDR/IVDR)',
      es: 'plazo medio de marcado CE de un dispositivo médico (MDR/IVDR)',
      it: 'tempo medio di marcatura CE di un dispositivo medico (MDR/IVDR)',
      nl: 'gemiddelde CE-markeringstijd voor een medisch hulpmiddel (MDR/IVDR)',
    }},
    { value: '+42%', label: {
      fr: 'croissance M&A HealthTech Europe 2022-2024 (Dealroom 2024)',
      en: 'HealthTech M&A growth Europe 2022-2024 (Dealroom 2024)',
      de: 'HealthTech-M&A-Wachstum Europa 2022-2024 (Dealroom 2024)',
      es: 'crecimiento M&A HealthTech Europa 2022-2024 (Dealroom 2024)',
      it: 'crescita M&A HealthTech Europa 2022-2024 (Dealroom 2024)',
      nl: 'HealthTech M&A-groei Europa 2022-2024 (Dealroom 2024)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/healthcare-lab.jpg',
      name: {
        fr: 'Santé & Pharmaceutique',
        en: 'Health & Pharmaceutical',
        de: 'Gesundheit & Pharma',
        es: 'Salud y Farmacéutica',
        it: 'Salute & Farmaceutico',
        nl: 'Gezondheid & Farmacie',
      },
      tag: {
        fr: 'Très réglementé', en: 'Highly regulated', de: 'Stark reguliert',
        es: 'Muy regulado',      it: 'Fortemente regolamentato', nl: 'Sterk gereguleerd',
      },
      desc: {
        fr: 'Données de santé (LPD, RGPD), interopérabilité HL7/FHIR, autorisations Swissmedic et EMA, chaîne d\'approvisionnement, cession de divisions et d\'actifs de R&D.',
        en: 'Health data (Swiss FADP, GDPR), HL7/FHIR interoperability, Swissmedic and EMA authorisations, supply chain, divestment of divisions and R&D assets.',
        de: 'Gesundheitsdaten (DSG, DSGVO), HL7-/FHIR-Interoperabilität, Swissmedic- und EMA-Zulassungen, Lieferkette, Veräusserung von Divisionen und F&E-Assets.',
        es: 'Datos de salud (LPD suiza, RGPD), interoperabilidad HL7/FHIR, autorizaciones Swissmedic y EMA, cadena de suministro, cesión de divisiones y activos de I+D.',
        it: 'Dati sanitari (LPD, GDPR), interoperabilità HL7/FHIR, autorizzazioni Swissmedic ed EMA, catena di approvvigionamento, cessione di divisioni e asset di R&S.',
        nl: 'Gezondheidsdata (Zwitserse WBG, AVG), HL7/FHIR-interoperabiliteit, Swissmedic- en EMA-vergunningen, toeleveringsketen, verkoop van divisies en R&D-activa.',
      },
    },
    {
      img: '/images/industries/sector-healthtech.jpg',
      name: {
        fr: 'HealthTech & MedTech',
        en: 'HealthTech & MedTech',
        de: 'HealthTech & MedTech',
        es: 'HealthTech y MedTech',
        it: 'HealthTech & MedTech',
        nl: 'HealthTech & MedTech',
      },
      tag: {
        fr: 'Croissance', en: 'Growth', de: 'Wachstum',
        es: 'Crecimiento', it: 'Crescita', nl: 'Groei',
      },
      desc: {
        fr: 'IA diagnostique, conformité MDR/IVDR, données de santé, interopérabilité, reprise par un industriel ou un fonds.',
        en: 'Diagnostic AI, MDR/IVDR compliance, health data, interoperability, takeover by an industrial player or a fund.',
        de: 'Diagnose-KI, MDR-/IVDR-Compliance, Gesundheitsdaten, Interoperabilität, Übernahme durch einen Industriellen oder einen Fonds.',
        es: 'IA diagnóstica, cumplimiento MDR/IVDR, datos de salud, interoperabilidad, adquisición por un industrial o un fondo.',
        it: 'IA diagnostica, conformità MDR/IVDR, dati sanitari, interoperabilità, acquisizione da parte di un industriale o di un fondo.',
        nl: 'Diagnostische AI, MDR-/IVDR-compliance, gezondheidsdata, interoperabiliteit, overname door een industriële speler of een fonds.',
      },
    },
    {
      img: '/images/industries/sector-chimie.jpg',
      name: {
        fr: 'Biotech, laboratoires & CRO',
        en: 'Biotech, laboratories & CROs',
        de: 'Biotech, Labore & CROs',
        es: 'Biotech, laboratorios y CRO',
        it: 'Biotech, laboratori & CRO',
        nl: 'Biotech, laboratoria & CRO\'s',
      },
      tag: {
        fr: 'R&D', en: 'R&D', de: 'F&E',
        es: 'I+D',  it: 'R&S',  nl: 'R&D',
      },
      desc: {
        fr: 'Recherche clinique, protocoles propriétaires, brevets et jeux de données : financement, partenariats industriels, cession de licences.',
        en: 'Clinical research, proprietary protocols, patents and datasets: financing, industrial partnerships, licensing.',
        de: 'Klinische Forschung, proprietäre Protokolle, Patente und Datensätze: Finanzierung, industrielle Partnerschaften, Lizenzvergabe.',
        es: 'Investigación clínica, protocolos propietarios, patentes y conjuntos de datos: financiación, alianzas industriales, cesión de licencias.',
        it: 'Ricerca clinica, protocolli proprietari, brevetti e dataset: finanziamento, partnership industriali, cessione di licenze.',
        nl: 'Klinisch onderzoek, propriëtaire protocollen, patenten en datasets: financiering, industriële partnerships, licentieverkoop.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Du produit au marché : stratégie, accès et modèle économique',
        en: 'From product to market: strategy, access and business model',
        de: 'Vom Produkt zum Markt: Strategie, Zugang und Geschäftsmodell',
        es: 'Del producto al mercado: estrategia, acceso y modelo económico',
        it: 'Dal prodotto al mercato: strategia, accesso e modello economico',
        nl: 'Van product naar markt: strategie, toegang en verdienmodel',
      },
      desc: {
        fr: 'Positionnement du produit, choix des marchés et des voies d\'autorisation, modèle économique (remboursement, licences, partenariats industriels), gouvernance de la R&D, thèse d\'acquisition. Livrable : grille des quatre tests appliquée aux options, et plan à 12-18 mois.',
        en: 'Product positioning, choice of markets and authorisation routes, business model (reimbursement, licensing, industrial partnerships), R&D governance, acquisition thesis. Deliverable: four-test grid applied to the options, and a 12-18 month plan.',
        de: 'Produktpositionierung, Wahl der Märkte und Zulassungswege, Geschäftsmodell (Erstattung, Lizenzen, industrielle Partnerschaften), F&E-Governance, Akquisitionsthese. Lieferung: Vier-Tests-Raster angewendet auf die Optionen und 12-18-Monats-Plan.',
        es: 'Posicionamiento del producto, elección de mercados y vías de autorización, modelo económico (reembolso, licencias, alianzas industriales), gobernanza de la I+D, tesis de adquisición. Entregable: cuadrícula de las cuatro pruebas aplicada a las opciones y plan a 12-18 meses.',
        it: 'Posizionamento del prodotto, scelta dei mercati e delle vie di autorizzazione, modello economico (rimborso, licenze, partnership industriali), governance della R&S, tesi di acquisizione. Deliverable: griglia dei quattro test applicata alle opzioni e piano a 12-18 mesi.',
        nl: 'Productpositionering, keuze van markten en toelatingsroutes, verdienmodel (vergoeding, licenties, industriële partnerships), R&D-governance, overnamethese. Deliverable: vier-toetsen-raster toegepast op de opties en een 12-18-maandenplan.',
      },
    },
    {
      title: {
        fr: 'Conformité réglementaire & qualité',
        en: 'Regulatory compliance & quality',
        de: 'Regulatorische Compliance & Qualität',
        es: 'Cumplimiento regulatorio y calidad',
        it: 'Conformità regolamentare & qualità',
        nl: 'Regelgevingscompliance & kwaliteit',
      },
      desc: {
        fr: 'Cartographie des exigences applicables (MDR/IVDR, Swissmedic, EMA, AI Act pour l\'IA diagnostique, LPD, RGPD), système de gestion de la qualité, vigilance, préparation aux audits et aux inspections. Livrable : carte « applicable maintenant / bientôt / pas concerné » et plan de remédiation priorisé.',
        en: 'Mapping of applicable requirements (MDR/IVDR, Swissmedic, EMA, AI Act for diagnostic AI, Swiss FADP, GDPR), quality management system, vigilance, preparation for audits and inspections. Deliverable: "applies now / soon / not concerned" map and prioritised remediation plan.',
        de: 'Kartierung der anwendbaren Anforderungen (MDR/IVDR, Swissmedic, EMA, AI Act für Diagnose-KI, DSG, DSGVO), Qualitätsmanagementsystem, Vigilanz, Vorbereitung auf Audits und Inspektionen. Lieferung: Karte «jetzt anwendbar / bald / nicht betroffen» und priorisierter Remediationsplan.',
        es: 'Mapeo de los requisitos aplicables (MDR/IVDR, Swissmedic, EMA, AI Act para la IA diagnóstica, LPD suiza, RGPD), sistema de gestión de la calidad, vigilancia, preparación para auditorías e inspecciones. Entregable: mapa «aplicable ahora / pronto / no afectado» y plan de remediación priorizado.',
        it: 'Mappatura dei requisiti applicabili (MDR/IVDR, Swissmedic, EMA, AI Act per l\'IA diagnostica, LPD, GDPR), sistema di gestione della qualità, vigilanza, preparazione ad audit e ispezioni. Deliverable: mappa «applicabile ora / presto / non interessati» e piano di remediation prioritizzato.',
        nl: 'In kaart brengen van toepasselijke eisen (MDR/IVDR, Swissmedic, EMA, AI Act voor diagnostische AI, Zwitserse WBG, AVG), kwaliteitsmanagementsysteem, vigilance, voorbereiding op audits en inspecties. Deliverable: kaart «nu van toepassing / binnenkort / niet van toepassing» en geprioriteerd herstelplan.',
      },
    },
    {
      title: {
        fr: 'Données de santé, interopérabilité & souveraineté',
        en: 'Health data, interoperability & sovereignty',
        de: 'Gesundheitsdaten, Interoperabilität & Souveränität',
        es: 'Datos de salud, interoperabilidad y soberanía',
        it: 'Dati sanitari, interoperabilità & sovranità',
        nl: 'Gezondheidsdata, interoperabiliteit & soevereiniteit',
      },
      desc: {
        fr: 'Architecture HealthTech souveraine hébergée en Suisse ou dans l\'UE, intégration HL7/FHIR, gouvernance des données patients, prestataires critiques et plan de sortie, encadrement des modèles d\'IA diagnostique. Outils sur mesure seulement lorsque le marché n\'en propose pas. Livrable : test de réversibilité et arbitrage chiffré.',
        en: 'Sovereign HealthTech architecture hosted in Switzerland or the EU, HL7/FHIR integration, patient data governance, critical providers and exit plan, governance of diagnostic AI models. Custom tools only when the market does not offer them. Deliverable: reversibility test and quantified trade-off.',
        de: 'Souveräne HealthTech-Architektur mit Hosting in der Schweiz oder der EU, HL7-/FHIR-Integration, Governance von Patientendaten, kritische Dienstleister und Exit-Plan, Steuerung der Diagnose-KI-Modelle. Massgeschneiderte Tools nur, wenn der Markt keine anbietet. Lieferung: Reversibilitätstest und bezifferte Abwägung.',
        es: 'Arquitectura HealthTech soberana alojada en Suiza o en la UE, integración HL7/FHIR, gobernanza de datos de pacientes, proveedores críticos y plan de salida, encuadre de los modelos de IA diagnóstica. Herramientas a medida solo cuando el mercado no las ofrece. Entregable: prueba de reversibilidad y arbitraje cifrado.',
        it: 'Architettura HealthTech sovrana ospitata in Svizzera o nell\'UE, integrazione HL7/FHIR, governance dei dati dei pazienti, fornitori critici e piano di uscita, inquadramento dei modelli di IA diagnostica. Strumenti su misura solo quando il mercato non li offre. Deliverable: test di reversibilità e arbitrato quantificato.',
        nl: 'Soevereine HealthTech-architectuur gehost in Zwitserland of de EU, HL7/FHIR-integratie, governance van patiëntendata, kritieke leveranciers en exitplan, kadering van diagnostische AI-modellen. Maatwerk alleen als de markt het niet aanbiedt. Deliverable: omkeerbaarheidstest en onderbouwde afweging.',
      },
    },
    {
      title: {
        fr: 'Experts réglementaires, qualité & direction scientifique',
        en: 'Regulatory experts, quality & scientific leadership',
        de: 'Regulatorische Experten, Qualität & wissenschaftliche Leitung',
        es: 'Expertos regulatorios, calidad y dirección científica',
        it: 'Esperti regolatori, qualità & direzione scientifica',
        nl: 'Regelgevende experts, kwaliteit & wetenschappelijke leiding',
      },
      desc: {
        fr: 'Responsables des affaires réglementaires et de la qualité, pharmacovigilance, directeurs médicaux, data scientists cliniques, succession du fondateur scientifique. Livrable : fiche de poste, profils présélectionnés, plan de succession.',
        en: 'Regulatory affairs and quality officers, pharmacovigilance, medical directors, clinical data scientists, succession of the scientific founder. Deliverable: job description, shortlisted profiles, succession plan.',
        de: 'Verantwortliche für Regulatory Affairs und Qualität, Pharmakovigilanz, Medical Directors, klinische Data Scientists, Nachfolge des wissenschaftlichen Gründers. Lieferung: Stellenprofil, vorausgewählte Profile, Nachfolgeplan.',
        es: 'Responsables de asuntos regulatorios y calidad, farmacovigilancia, directores médicos, data scientists clínicos, sucesión del fundador científico. Entregable: ficha de puesto, perfiles preseleccionados, plan de sucesión.',
        it: 'Responsabili degli affari regolatori e della qualità, farmacovigilanza, direttori medici, data scientist clinici, successione del fondatore scientifico. Deliverable: scheda di posizione, profili preselezionati, piano di successione.',
        nl: 'Verantwoordelijken voor regelgeving en kwaliteit, farmacovigilantie, medisch directeuren, klinische data scientists, opvolging van de wetenschappelijke oprichter. Deliverable: functieprofiel, voorgeselecteerde profielen, opvolgingsplan.',
      },
    },
    {
      title: {
        fr: 'Reprise, séparation & cession d\'actifs de santé',
        en: 'Acquisition, carve-out & divestment of health assets',
        de: 'Übernahme, Abspaltung & Veräusserung von Gesundheits-Assets',
        es: 'Adquisición, separación y cesión de activos de salud',
        it: 'Acquisizione, separazione & cessione di asset sanitari',
        nl: 'Overname, afsplitsing & verkoop van zorgactiva',
      },
      desc: {
        fr: 'Revue d\'une cible avant l\'offre : autorisations et certificats transférables, propriété des brevets et des jeux de données, consentements des patients, contrats fournisseurs, dépendance aux chercheurs clés. Intégration, séparation d\'une division ou cession. La certification CIFSO 5000 reste possible en appui. Livrable : traitement proposé pour chaque point (prix, garantie, condition suspensive) et plan d\'intégration ou de séparation jalonné. L\'exécution revient à votre banque d\'affaires et à vos avocats.',
        en: 'Review of a target before the offer: transferable authorisations and certificates, ownership of patents and datasets, patient consents, supplier contracts, dependency on key researchers. Integration, division carve-out or divestment. CIFSO 5000 certification remains available in support. Deliverable: proposed treatment for each point (price, warranty, suspensive condition) and a milestone-based integration or separation plan. Execution remains with your investment bank and your lawyers.',
        de: 'Prüfung einer Zielgesellschaft vor dem Angebot: übertragbare Zulassungen und Zertifikate, Eigentum an Patenten und Datensätzen, Patienteneinwilligungen, Lieferantenverträge, Abhängigkeit von Schlüsselforschern. Integration, Abspaltung einer Division oder Veräusserung. Die CIFSO-5000-Zertifizierung bleibt unterstützend möglich. Lieferung: vorgeschlagene Behandlung für jeden Punkt (Preis, Garantie, aufschiebende Bedingung) und ein Meilensteinplan für Integration oder Abspaltung. Die Ausführung obliegt Ihrer Investmentbank und Ihren Anwälten.',
        es: 'Revisión de una empresa objetivo antes de la oferta: autorizaciones y certificados transferibles, propiedad de patentes y conjuntos de datos, consentimientos de pacientes, contratos con proveedores, dependencia de investigadores clave. Integración, separación de una división o cesión. La certificación CIFSO 5000 sigue siendo posible como apoyo. Entregable: tratamiento propuesto para cada punto (precio, garantía, condición suspensiva) y plan de integración o separación por hitos. La ejecución corresponde a su banco de inversión y a sus abogados.',
        it: 'Revisione di un target prima dell\'offerta: autorizzazioni e certificati trasferibili, proprietà di brevetti e dataset, consensi dei pazienti, contratti con i fornitori, dipendenza dai ricercatori chiave. Integrazione, separazione di una divisione o cessione. La certificazione CIFSO 5000 resta possibile a supporto. Deliverable: trattamento proposto per ogni punto (prezzo, garanzia, condizione sospensiva) e piano di integrazione o separazione a tappe. L\'esecuzione spetta alla vostra banca d\'affari e ai vostri avvocati.',
        nl: 'Beoordeling van een doelwit vóór het bod: overdraagbare vergunningen en certificaten, eigendom van patenten en datasets, patiëntentoestemmingen, leverancierscontracten, afhankelijkheid van sleutelonderzoekers. Integratie, afsplitsing van een divisie of verkoop. De CIFSO 5000-certificering blijft ter ondersteuning mogelijk. Deliverable: voorgestelde behandeling voor elk punt (prijs, garantie, opschortende voorwaarde) en een plan voor integratie of afsplitsing met mijlpalen. De uitvoering komt toe aan uw investeringsbank en uw advocaten.',
      },
    },
  ],
  expertiseFootnote: {
    fr: 'Mobilisables seules, ou réunies en un programme que nous pilotons.',
    en: 'Available individually, or combined into a programme we steer.',
    de: 'Einzeln einsetzbar oder zu einem Programm gebündelt, das wir steuern.',
    es: 'Movilizables por separado, o reunidas en un programa que pilotamos.',
    it: 'Attivabili singolarmente, o riunite in un programma che pilotiamo.',
    nl: 'Afzonderlijk inzetbaar, of gebundeld in een programma dat wij sturen.',
  },
  problemsLabel: {
    fr: 'Ce que nous pilotons',
    en: 'What we steer',
    de: 'Was wir steuern',
    es: 'Lo que pilotamos',
    it: 'Ciò che pilotiamo',
    nl: 'Wat wij sturen',
  },
  segments: [
    {
      icon: 'HeartPulse',
      label: {
        fr: 'MedTech & HealthTech en croissance : cycles Lancement et Croissance',
        en: 'Growing MedTech & HealthTech: Launch and Growth cycles',
        de: 'Wachsende MedTech & HealthTech: Zyklen Lancierung und Wachstum',
        es: 'MedTech y HealthTech en crecimiento: ciclos Lanzamiento y Crecimiento',
        it: 'MedTech & HealthTech in crescita: cicli Lancio e Crescita',
        nl: 'Groeiende MedTech & HealthTech: cycli Lancering en Groei',
      },
      story: {
        fr: 'Vous avez développé un dispositif médical avec IA diagnostique. Marquage CE ou autorisation Swissmedic, hébergement des données, premiers recrutements qualité : chaque exigence a son interlocuteur, et un industriel commence à s\'intéresser à vous.',
        en: 'You have developed a medical device with diagnostic AI. CE marking or Swissmedic authorisation, data hosting, first quality hires: each requirement has its counterpart, and an industrial player is starting to take an interest.',
        de: 'Sie haben ein Medizinprodukt mit Diagnose-KI entwickelt. CE-Kennzeichnung oder Swissmedic-Zulassung, Daten-Hosting, erste Qualitäts-Anstellungen: jede Anforderung hat ihren Ansprechpartner, und ein Industrieller beginnt sich für Sie zu interessieren.',
        es: 'Ha desarrollado un dispositivo médico con IA diagnóstica. Marcado CE o autorización Swissmedic, alojamiento de datos, primeras contrataciones de calidad: cada requisito tiene su interlocutor, y un industrial empieza a interesarse por usted.',
        it: 'Avete sviluppato un dispositivo medico con IA diagnostica. Marcatura CE o autorizzazione Swissmedic, hosting dei dati, prime assunzioni qualità: ogni requisito ha il suo interlocutore, e un industriale comincia a interessarsi a voi.',
        nl: 'U heeft een medisch hulpmiddel met diagnostische AI ontwikkeld. CE-markering of Swissmedic-vergunning, datahosting, eerste kwaliteitsaanwervingen: elke eis heeft zijn gesprekspartner, en een industriële speler begint belangstelling te tonen.',
      },
      problems: [
        {
          fr: 'Choisir la voie d\'autorisation et le calendrier (marquage CE, Swissmedic, puis marchés suivants) → arbitrage écrit, avec ce qu\'il faut renoncer à faire.',
          en: 'Choose the authorisation route and timeline (CE marking, Swissmedic, then next markets) → written trade-off, including what to give up.',
          de: 'Zulassungsweg und Zeitplan wählen (CE-Kennzeichnung, Swissmedic, dann weitere Märkte) → schriftliche Abwägung, inklusive dessen, worauf verzichtet werden muss.',
          es: 'Elegir la vía de autorización y el calendario (marcado CE, Swissmedic, luego mercados siguientes) → arbitraje escrito, con lo que hay que renunciar a hacer.',
          it: 'Scegliere la via di autorizzazione e il calendario (marcatura CE, Swissmedic, poi i mercati successivi) → arbitrato scritto, con ciò a cui rinunciare.',
          nl: 'De toelatingsroute en planning kiezen (CE-markering, Swissmedic, daarna volgende markten) → schriftelijke afweging, inclusief wat u moet laten.',
        },
        {
          fr: 'Sécuriser plateforme et données : propriété du code, hébergement, réversibilité → note de position et clauses à corriger.',
          en: 'Secure platform and data: code ownership, hosting, reversibility → position note and clauses to fix.',
          de: 'Plattform und Daten absichern: Code-Eigentum, Hosting, Reversibilität → Positionspapier und zu korrigierende Klauseln.',
          es: 'Asegurar plataforma y datos: propiedad del código, alojamiento, reversibilidad → nota de posición y cláusulas a corregir.',
          it: 'Mettere in sicurezza piattaforma e dati: proprietà del codice, hosting, reversibilità → nota di posizione e clausole da correggere.',
          nl: 'Platform en data borgen: code-eigendom, hosting, omkeerbaarheid → positienotitie en te corrigeren clausules.',
        },
        {
          fr: 'Sélectionner les responsables des affaires réglementaires et de la qualité → fiches de poste et profils présélectionnés.',
          en: 'Select regulatory affairs and quality officers → job descriptions and shortlisted profiles.',
          de: 'Verantwortliche für Regulatory Affairs und Qualität auswählen → Stellenprofile und vorausgewählte Profile.',
          es: 'Seleccionar los responsables de asuntos regulatorios y calidad → fichas de puesto y perfiles preseleccionados.',
          it: 'Selezionare i responsabili degli affari regolatori e della qualità → schede di posizione e profili preselezionati.',
          nl: 'Verantwoordelijken voor regelgeving en kwaliteit selecteren → functieprofielen en voorgeselecteerde profielen.',
        },
      ],
    },
    {
      icon: 'Pill',
      label: {
        fr: 'Groupes pharmaceutiques & laboratoires : cycles Restructuration et Transmission',
        en: 'Pharmaceutical groups & laboratories: Restructuring and Succession cycles',
        de: 'Pharmakonzerne & Labore: Zyklen Restrukturierung und Übergabe',
        es: 'Grupos farmacéuticos y laboratorios: ciclos Reestructuración y Transmisión',
        it: 'Gruppi farmaceutici & laboratori: cicli Ristrutturazione e Trasmissione',
        nl: 'Farmaceutische groepen & laboratoria: cycli Herstructurering en Overdracht',
      },
      story: {
        fr: 'Vous cédez une division ou externalisez un actif de R&D. Brevets, données cliniques et contrats fournisseurs sont dispersés, et l\'acquéreur attend une data room solide et un transfert de données maîtrisé.',
        en: 'You are divesting a division or outsourcing an R&D asset. Patents, clinical data and supplier contracts are scattered, and the acquirer expects a solid data room and a controlled data transfer.',
        de: 'Sie veräussern eine Division oder lagern ein F&E-Asset aus. Patente, klinische Daten und Lieferantenverträge sind verstreut, und der Käufer erwartet einen soliden Datenraum und einen kontrollierten Datentransfer.',
        es: 'Está cediendo una división o externalizando un activo de I+D. Patentes, datos clínicos y contratos con proveedores están dispersos, y el comprador espera un data room sólido y una transferencia de datos controlada.',
        it: 'State cedendo una divisione o esternalizzando un asset di R&S. Brevetti, dati clinici e contratti con i fornitori sono dispersi, e l\'acquirente si aspetta una data room solida e un trasferimento dei dati controllato.',
        nl: 'U verkoopt een divisie of besteedt een R&D-actief uit. Patenten, klinische data en leverancierscontracten zijn versnipperd, en de koper verwacht een solide dataroom en een beheerste data-overdracht.',
      },
      problems: [
        {
          fr: 'Inventorier ce qui part avec l\'actif : brevets, jeux de données, contrats, autorisations → inventaire et traitement proposé pour chaque élément.',
          en: 'Inventory what goes with the asset: patents, datasets, contracts, authorisations → inventory and proposed treatment for each item.',
          de: 'Inventarisieren, was mit dem Asset geht: Patente, Datensätze, Verträge, Zulassungen → Inventar und vorgeschlagene Behandlung für jedes Element.',
          es: 'Inventariar lo que se lleva el activo: patentes, conjuntos de datos, contratos, autorizaciones → inventario y tratamiento propuesto para cada elemento.',
          it: 'Inventariare ciò che parte con l\'asset: brevetti, dataset, contratti, autorizzazioni → inventario e trattamento proposto per ogni elemento.',
          nl: 'Inventariseren wat met het actief meegaat: patenten, datasets, contracten, vergunningen → inventaris en voorgestelde behandeling voor elk element.',
        },
        {
          fr: 'Encadrer les transferts de données sensibles : consentements, flux transfrontaliers → plan de transfert validé par votre responsable de la protection des données.',
          en: 'Govern sensitive data transfers: consents, cross-border flows → transfer plan validated by your data protection officer.',
          de: 'Sensible Datentransfers steuern: Einwilligungen, grenzüberschreitende Flüsse → von Ihrem Datenschutzbeauftragten validierter Transferplan.',
          es: 'Encuadrar las transferencias de datos sensibles: consentimientos, flujos transfronterizos → plan de transferencia validado por su responsable de protección de datos.',
          it: 'Inquadrare i trasferimenti di dati sensibili: consensi, flussi transfrontalieri → piano di trasferimento validato dal vostro responsabile della protezione dei dati.',
          nl: 'Gevoelige data-overdrachten kaderen: toestemmingen, grensoverschrijdende stromen → overdrachtsplan gevalideerd door uw functionaris voor gegevensbescherming.',
        },
        {
          fr: 'Planifier la séparation des équipes et des systèmes → plan de séparation jalonné.',
          en: 'Plan the separation of teams and systems → milestone-based separation plan.',
          de: 'Die Abspaltung von Teams und Systemen planen → Abspaltungsplan mit Meilensteinen.',
          es: 'Planificar la separación de equipos y sistemas → plan de separación por hitos.',
          it: 'Pianificare la separazione di team e sistemi → piano di separazione a tappe.',
          nl: 'De afsplitsing van teams en systemen plannen → afsplitsingsplan met mijlpalen.',
        },
      ],
    },
    {
      icon: 'Search',
      label: {
        fr: 'Fonds & industriels qui reprennent : cycle Acquisition (Reprise)',
        en: 'Acquiring funds & industrials: Acquisition (Takeover) cycle',
        de: 'Übernehmende Fonds & Industrielle: Zyklus Akquisition (Übernahme)',
        es: 'Fondos e industriales que adquieren: ciclo Adquisición (Toma de control)',
        it: 'Fondi & industriali che acquisiscono: ciclo Acquisizione (Subentro)',
        nl: 'Overnemende fondsen & industriëlen: cyclus Overname',
      },
      story: {
        fr: 'Vous étudiez une cible HealthTech prometteuse dont la conformité réglementaire et la qualité des données sont difficiles à évaluer. Avant de signer, vous voulez une lecture indépendante qui va au-delà de l\'audit financier.',
        en: 'You are assessing a promising HealthTech target whose regulatory compliance and data quality are difficult to evaluate. Before signing, you want an independent read that goes beyond the financial audit.',
        de: 'Sie prüfen eine vielversprechende HealthTech-Zielgesellschaft, deren regulatorische Compliance und Datenqualität schwer zu beurteilen sind. Vor der Unterzeichnung wollen Sie eine unabhängige Einschätzung, die über das Finanzaudit hinausgeht.',
        es: 'Analiza una empresa HealthTech prometedora cuyo cumplimiento regulatorio y calidad de datos son difíciles de evaluar. Antes de firmar, quiere una lectura independiente que vaya más allá de la auditoría financiera.',
        it: 'Valutate un promettente target HealthTech la cui conformità regolamentare e qualità dei dati sono difficili da valutare. Prima di firmare, volete una lettura indipendente che vada oltre l\'audit finanziario.',
        nl: 'U beoordeelt een veelbelovend HealthTech-doelwit waarvan de regelgevende compliance en datakwaliteit moeilijk te beoordelen zijn. Vóór ondertekening wilt u een onafhankelijke beoordeling die verder gaat dan de financiële audit.',
      },
      problems: [
        {
          fr: 'Passer la cible au crible : autorisations, qualité et souveraineté des données, propriété intellectuelle, personnes clés → traitement proposé pour chaque point : prix, garantie, condition suspensive.',
          en: 'Screen the target: authorisations, data quality and sovereignty, intellectual property, key people → proposed treatment for each point: price, warranty, suspensive condition.',
          de: 'Die Zielgesellschaft prüfen: Zulassungen, Datenqualität und -souveränität, geistiges Eigentum, Schlüsselpersonen → vorgeschlagene Behandlung für jeden Punkt: Preis, Garantie, aufschiebende Bedingung.',
          es: 'Examinar la empresa objetivo: autorizaciones, calidad y soberanía de los datos, propiedad intelectual, personas clave → tratamiento propuesto para cada punto: precio, garantía, condición suspensiva.',
          it: 'Esaminare il target: autorizzazioni, qualità e sovranità dei dati, proprietà intellettuale, persone chiave → trattamento proposto per ogni punto: prezzo, garanzia, condizione sospensiva.',
          nl: 'Het doelwit doorlichten: vergunningen, datakwaliteit en -soevereiniteit, intellectueel eigendom, sleutelpersonen → voorgestelde behandeling voor elk punt: prijs, garantie, opschortende voorwaarde.',
        },
        {
          fr: 'Préparer l\'intégration → plan d\'intégration jalonné.',
          en: 'Prepare the integration → milestone-based integration plan.',
          de: 'Die Integration vorbereiten → Integrationsplan mit Meilensteinen.',
          es: 'Preparar la integración → plan de integración por hitos.',
          it: 'Preparare l\'integrazione → piano di integrazione a tappe.',
          nl: 'De integratie voorbereiden → integratieplan met mijlpalen.',
        },
        {
          fr: 'Organiser la rétention des chercheurs et experts clés → plan de rétention sur 24 mois.',
          en: 'Organise retention of researchers and key experts → 24-month retention plan.',
          de: 'Die Bindung von Forschern und Schlüsselexperten organisieren → 24-Monats-Retentionsplan.',
          es: 'Organizar la retención de los investigadores y expertos clave → plan de retención a 24 meses.',
          it: 'Organizzare la retention dei ricercatori e degli esperti chiave → piano di retention a 24 mesi.',
          nl: 'Het behoud van onderzoekers en sleutelexperts organiseren → 24-maanden-retentieplan.',
        },
      ],
    },
  ],
  segmentsFootnote: {
    fr: 'L\'exécution de la transaction reste confiée à votre banque d\'affaires ou à vos avocats. Aegryn ne fournit pas de conseil médical et ne se substitue pas à votre responsable réglementaire.',
    en: 'Transaction execution remains with your investment bank or your lawyers. Aegryn does not provide medical advice and does not substitute for your regulatory officer.',
    de: 'Die Transaktionsausführung obliegt Ihrer Investmentbank oder Ihren Anwälten. Aegryn bietet keine medizinische Beratung und ersetzt nicht Ihren regulatorischen Verantwortlichen.',
    es: 'La ejecución de la transacción queda a cargo de su banco de inversión o de sus abogados. Aegryn no ofrece asesoramiento médico ni sustituye a su responsable regulatorio.',
    it: 'L\'esecuzione della transazione resta affidata alla vostra banca d\'affari o ai vostri avvocati. Aegryn non fornisce consulenza medica e non si sostituisce al vostro responsabile regolatorio.',
    nl: 'De transactie-uitvoering blijft bij uw investeringsbank of uw advocaten. Aegryn biedt geen medisch advies en vervangt uw regelgevende verantwoordelijke niet.',
  },
  articleSlugs: [
    'rgpd-cession-transfert-donnees-utilisateurs',
    'conseil-technologie-architecture-cloud-souverainete-donnees-2025',
    'ip-checklist-avant-cession-actif-tech',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   3. INDUSTRIE, ÉNERGIE & INFRASTRUCTURE
   ════════════════════════════════════════════════════════════════════ */
const industrie: Industry = {
  slug:      'industrie-energie-infrastructure',
  clusterId: 'industrie',
  name: {
    fr: 'Industrie, Énergie & Infrastructure',
    en: 'Industry, Energy & Infrastructure',
    de: 'Industrie, Energie & Infrastruktur',
    es: 'Industria, Energía e Infraestructura',
    it: 'Industria, Energia & Infrastrutture',
    nl: 'Industrie, Energie & Infrastructuur',
  },
  img: '/images/industries/cluster-industrie.jpg',
  imgAlt: {
    fr: 'Industrie, Énergie & Infrastructure — Aegryn',
    en: 'Industry, Energy & Infrastructure — Aegryn',
    de: 'Industrie, Energie & Infrastruktur — Aegryn',
    es: 'Industria, Energía e Infraestructura — Aegryn',
    it: 'Industria, Energia & Infrastrutture — Aegryn',
    nl: 'Industrie, Energie & Infrastructuur — Aegryn',
  },
  vision: {
    fr: `Les organisations industrielles ont une valeur souvent sous-documentée : savoir-faire opérationnel, contrats long terme, propriété intellectuelle sur les processus, réseaux de sous-traitants stratégiques. Le CIFSO 5000 donne un langage commun entre le dirigeant qui connaît sa valeur et l'investisseur qui a besoin de la vérifier.

Dans les secteurs de la transition énergétique et de l'infrastructure, la robustesse des actifs et leur transmissibilité deviennent des critères de financement décisifs.`,
    en: `Industrial organisations often have under-documented value: operational know-how, long-term contracts, intellectual property on processes, networks of strategic subcontractors. CIFSO 5000 provides a common language between the executive who knows their value and the investor who needs to verify it.

In the energy transition and infrastructure sectors, asset robustness and transferability are becoming decisive financing criteria.`,
    de: `Industrielle Organisationen haben oft einen unzureichend dokumentierten Wert: operatives Know-how, langfristige Verträge, geistiges Eigentum an Prozessen, Netzwerke strategischer Zulieferer. CIFSO 5000 schafft eine gemeinsame Sprache zwischen dem Geschäftsführer, der seinen Wert kennt, und dem Investor, der ihn verifizieren muss.

In den Bereichen Energiewende und Infrastruktur werden Robustheit und Übertragbarkeit von Assets zu entscheidenden Finanzierungskriterien.`,
    es: `Las organizaciones industriales tienen a menudo un valor insuficientemente documentado: saber hacer operativo, contratos a largo plazo, propiedad intelectual sobre los procesos, redes de subcontratistas estratégicos. CIFSO 5000 ofrece un lenguaje común entre el dirigente que conoce su valor y el inversor que necesita verificarlo.

En los sectores de la transición energética y la infraestructura, la robustez de los activos y su transmisibilidad se convierten en criterios de financiación decisivos.`,
    it: `Le organizzazioni industriali hanno spesso un valore sotto-documentato: know-how operativo, contratti di lungo periodo, proprietà intellettuale sui processi, reti di subappaltatori strategici. CIFSO 5000 offre un linguaggio comune tra il dirigente che conosce il proprio valore e l'investitore che deve verificarlo.

Nei settori della transizione energetica e delle infrastrutture, la robustezza degli asset e la loro trasmissibilità diventano criteri di finanziamento decisivi.`,
    nl: `Industriële organisaties hebben vaak een ondergedocumenteerde waarde: operationele knowhow, langetermijncontracten, intellectueel eigendom op processen, netwerken van strategische toeleveranciers. CIFSO 5000 biedt een gemeenschappelijke taal tussen de directeur die zijn waarde kent en de investeerder die die moet verifiëren.

In de sectoren energietransitie en infrastructuur worden robuustheid en overdraagbaarheid van activa beslissende financieringscriteria.`,
  },
  keyMetrics: [
    { value: '1 Tn EUR', label: {
      fr: 'investissements infrastructure Europe 2021-2027 (Commission Européenne)',
      en: 'infrastructure investment Europe 2021-2027 (European Commission)',
      de: 'Infrastrukturinvestitionen Europa 2021-2027 (Europäische Kommission)',
      es: 'inversiones en infraestructura Europa 2021-2027 (Comisión Europea)',
      it: 'investimenti in infrastrutture Europa 2021-2027 (Commissione Europea)',
      nl: 'infrastructuurinvesteringen Europa 2021-2027 (Europese Commissie)',
    }},
    { value: '500 Mrd EUR', label: {
      fr: 'financements transition énergétique prévus en Europe d\'ici 2030 (AIE 2024)',
      en: 'energy transition financing planned in Europe by 2030 (IEA 2024)',
      de: 'geplante Finanzierung der Energiewende in Europa bis 2030 (IEA 2024)',
      es: 'financiación de la transición energética prevista en Europa hasta 2030 (AIE 2024)',
      it: 'finanziamenti per la transizione energetica previsti in Europa entro il 2030 (AIE 2024)',
      nl: 'geplande financiering van de energietransitie in Europa tot 2030 (IEA 2024)',
    }},
    { value: '+31%', label: {
      fr: 'croissance M&A industrie 4.0 Europe 2023-2024 (Mergermarket 2024)',
      en: 'Industry 4.0 M&A growth Europe 2023-2024 (Mergermarket 2024)',
      de: 'Industrie-4.0-M&A-Wachstum Europa 2023-2024 (Mergermarket 2024)',
      es: 'crecimiento M&A industria 4.0 Europa 2023-2024 (Mergermarket 2024)',
      it: 'crescita M&A industria 4.0 Europa 2023-2024 (Mergermarket 2024)',
      nl: 'Industrie 4.0 M&A-groei Europa 2023-2024 (Mergermarket 2024)',
    }},
    { value: '73%', label: {
      fr: 'des PME industrielles sans documentation de valeur transmissible (CCI France 2023)',
      en: 'of industrial SMEs without transferable value documentation (CCI France 2023)',
      de: 'der industriellen KMU ohne Dokumentation übertragbaren Werts (CCI Frankreich 2023)',
      es: 'de las pymes industriales sin documentación de valor transmisible (CCI Francia 2023)',
      it: 'delle PMI industriali senza documentazione di valore trasmissibile (CCI Francia 2023)',
      nl: 'van industriële mkb-bedrijven zonder documentatie van overdraagbare waarde (CCI Frankrijk 2023)',
    }},
  ],
  sectors: [
    {
      img: '/images/industries/sector-energie.jpg',
      name: {
        fr: 'Énergie & Utilities',
        en: 'Energy & Utilities',
        de: 'Energie & Versorger',
        es: 'Energía y Utilities',
        it: 'Energia & Utilities',
        nl: 'Energie & Utilities',
      },
      tag: {
        fr: 'Stratégique', en: 'Strategic', de: 'Strategisch',
        es: 'Estratégico',  it: 'Strategico', nl: 'Strategisch',
      },
      desc: {
        fr: 'Transition énergétique, smart grid, EU ETS, IA de gestion des actifs et résilience des infrastructures critiques.',
        en: 'Energy transition, smart grid, EU ETS, asset management AI and critical infrastructure resilience.',
        de: 'Energiewende, Smart Grid, EU ETS, KI für Asset Management und Resilienz kritischer Infrastrukturen.',
        es: 'Transición energética, smart grid, EU ETS, IA de gestión de activos y resiliencia de infraestructuras críticas.',
        it: 'Transizione energetica, smart grid, EU ETS, IA per la gestione degli asset e resilienza delle infrastrutture critiche.',
        nl: 'Energietransitie, smart grid, EU ETS, AI voor assetbeheer en weerbaarheid van kritieke infrastructuur.',
      },
    },
    {
      img: '/images/blog/factory-industry.jpg',
      name: {
        fr: 'Industrie & Manufacturing',
        en: 'Industry & Manufacturing',
        de: 'Industrie & Fertigung',
        es: 'Industria y Manufactura',
        it: 'Industria & Manifattura',
        nl: 'Industrie & Productie',
      },
      tag: {
        fr: 'Consolidation', en: 'Consolidation', de: 'Konsolidierung',
        es: 'Consolidación',  it: 'Consolidamento', nl: 'Consolidatie',
      },
      desc: {
        fr: 'Industrie 4.0, maintenance prédictive, MES/ERP, ISO qualité et base de valeur opposable.',
        en: 'Industry 4.0, predictive maintenance, MES/ERP, ISO quality and enforceable value base.',
        de: 'Industrie 4.0, vorausschauende Wartung, MES/ERP, ISO-Qualität und belastbare Wertbasis.',
        es: 'Industria 4.0, mantenimiento predictivo, MES/ERP, calidad ISO y base de valor oponible.',
        it: 'Industria 4.0, manutenzione predittiva, MES/ERP, qualità ISO e base di valore opponibile.',
        nl: 'Industrie 4.0, predictief onderhoud, MES/ERP, ISO-kwaliteit en een aantoombare waardebasis.',
      },
    },
    {
      img: '/images/industries/sector-logistique.jpg',
      name: {
        fr: 'Logistique & Supply Chain',
        en: 'Logistics & Supply Chain',
        de: 'Logistik & Lieferkette',
        es: 'Logística y Cadena de Suministro',
        it: 'Logistica & Supply Chain',
        nl: 'Logistiek & Supply Chain',
      },
      tag: {
        fr: 'Récurrent', en: 'Recurring', de: 'Wiederkehrend',
        es: 'Recurrente',  it: 'Ricorrente', nl: 'Terugkerend',
      },
      desc: {
        fr: 'Visibilité temps réel, IA optimisation flux, conformité douanière, 3PL/4PL et valeur récurrente.',
        en: 'Real-time visibility, flow optimisation AI, customs compliance, 3PL/4PL and recurring value.',
        de: 'Echtzeit-Transparenz, KI zur Flussoptimierung, Zoll-Compliance, 3PL/4PL und wiederkehrender Wert.',
        es: 'Visibilidad en tiempo real, IA de optimización de flujos, cumplimiento aduanero, 3PL/4PL y valor recurrente.',
        it: 'Visibilità in tempo reale, IA per l\'ottimizzazione dei flussi, conformità doganale, 3PL/4PL e valore ricorrente.',
        nl: 'Realtime-zichtbaarheid, AI voor stroomoptimalisatie, douanecompliance, 3PL/4PL en terugkerende waarde.',
      },
    },
    {
      img: '/images/blog/city-buildings.jpg',
      name: {
        fr: 'Construction & Infrastructure',
        en: 'Construction & Infrastructure',
        de: 'Bau & Infrastruktur',
        es: 'Construcción e Infraestructura',
        it: 'Costruzioni & Infrastrutture',
        nl: 'Bouw & Infrastructuur',
      },
      tag: {
        fr: 'Complexe', en: 'Complex', de: 'Komplex',
        es: 'Complejo',  it: 'Complesso', nl: 'Complex',
      },
      desc: {
        fr: 'BIM, maintenance prédictive, contrats complexes, sous-traitants multi-niveaux et gouvernance.',
        en: 'BIM, predictive maintenance, complex contracts, multi-level subcontractors and governance.',
        de: 'BIM, vorausschauende Wartung, komplexe Verträge, mehrstufige Subunternehmer und Governance.',
        es: 'BIM, mantenimiento predictivo, contratos complejos, subcontratistas multinivel y gobernanza.',
        it: 'BIM, manutenzione predittiva, contratti complessi, subappaltatori multilivello e governance.',
        nl: 'BIM, predictief onderhoud, complexe contracten, meervoudige onderaannemers en governance.',
      },
    },
    {
      img: '/images/industries/sector-aero.jpg',
      name: {
        fr: 'Aérospatiale & Défense',
        en: 'Aerospace & Defence',
        de: 'Luft- und Raumfahrt & Verteidigung',
        es: 'Aeroespacial y Defensa',
        it: 'Aerospazio & Difesa',
        nl: 'Luchtvaart & Defensie',
      },
      tag: {
        fr: 'Confidentiel', en: 'Confidential', de: 'Vertraulich',
        es: 'Confidencial',  it: 'Riservato', nl: 'Vertrouwelijk',
      },
      desc: {
        fr: 'Systèmes embarqués, IA mission, ITAR/EAR, sous-traitants stratégiques et certification confidentielle.',
        en: 'Embedded systems, mission AI, ITAR/EAR, strategic subcontractors and confidential certification.',
        de: 'Eingebettete Systeme, Missions-KI, ITAR/EAR, strategische Zulieferer und vertrauliche Zertifizierung.',
        es: 'Sistemas embarcados, IA de misión, ITAR/EAR, subcontratistas estratégicos y certificación confidencial.',
        it: 'Sistemi embedded, IA di missione, ITAR/EAR, subappaltatori strategici e certificazione riservata.',
        nl: 'Embedded systemen, missie-AI, ITAR/EAR, strategische toeleveranciers en vertrouwelijke certificering.',
      },
    },
    {
      img: '/images/industries/sector-auto.jpg',
      name: {
        fr: 'Automobile & Mobilité',
        en: 'Automotive & Mobility',
        de: 'Automobil & Mobilität',
        es: 'Automoción y Movilidad',
        it: 'Automotive & Mobilità',
        nl: 'Automotive & Mobiliteit',
      },
      tag: {
        fr: 'Transformation', en: 'Transformation', de: 'Transformation',
        es: 'Transformación',  it: 'Trasformazione', nl: 'Transformatie',
      },
      desc: {
        fr: 'IA embarquée, Tier-1/2, électrification et MaaS — opportunités M&A inter-constructeurs.',
        en: 'Embedded AI, Tier-1/2 suppliers, electrification and MaaS — cross-OEM M&A opportunities.',
        de: 'Eingebettete KI, Tier-1/2-Zulieferer, Elektrifizierung und MaaS — M&A-Chancen zwischen Herstellern.',
        es: 'IA embarcada, proveedores Tier-1/2, electrificación y MaaS — oportunidades M&A entre fabricantes.',
        it: 'IA embedded, fornitori Tier-1/2, elettrificazione e MaaS — opportunità M&A tra costruttori.',
        nl: 'Embedded AI, Tier-1/2-leveranciers, elektrificatie en MaaS — M&A-kansen tussen fabrikanten.',
      },
    },
    {
      img: '/images/industries/sector-agriculture.jpg',
      name: {
        fr: 'Agriculture & Agroalimentaire',
        en: 'Agriculture & Agri-food',
        de: 'Landwirtschaft & Ernährung',
        es: 'Agricultura y Agroalimentación',
        it: 'Agricoltura & Agroalimentare',
        nl: 'Landbouw & Voeding',
      },
      tag: {
        fr: 'ESG', en: 'ESG', de: 'ESG',
        es: 'ESG',  it: 'ESG', nl: 'ESG',
      },
      desc: {
        fr: 'Traçabilité, IA rendement, conformité sanitaire et IP propriétaires à certifier.',
        en: 'Traceability, yield AI, sanitary compliance and proprietary IP to certify.',
        de: 'Rückverfolgbarkeit, Ertrags-KI, Lebensmittel-Compliance und zu zertifizierendes proprietäres geistiges Eigentum.',
        es: 'Trazabilidad, IA de rendimiento, cumplimiento sanitario e IP propietaria por certificar.',
        it: 'Tracciabilità, IA per i rendimenti, conformità sanitaria e IP proprietarie da certificare.',
        nl: 'Traceerbaarheid, opbrengst-AI, voedselveiligheidscompliance en te certificeren propriëtaire IP.',
      },
    },
    {
      img: '/images/industries/sector-chimie.jpg',
      name: {
        fr: 'Chimie & Matériaux Avancés',
        en: 'Chemicals & Advanced Materials',
        de: 'Chemie & Hochleistungsmaterialien',
        es: 'Química y Materiales Avanzados',
        it: 'Chimica & Materiali Avanzati',
        nl: 'Chemie & Geavanceerde Materialen',
      },
      tag: {
        fr: 'IP forte', en: 'Strong IP', de: 'Starke IP',
        es: 'IP fuerte',  it: 'Forte IP', nl: 'Sterke IP',
      },
      desc: {
        fr: 'R&D data, REACH, contrats fournisseurs et propriété intellectuelle spécialisée.',
        en: 'R&D data, REACH, supplier contracts and specialised intellectual property.',
        de: 'F&E-Daten, REACH, Lieferantenverträge und spezialisiertes geistiges Eigentum.',
        es: 'Datos de I+D, REACH, contratos con proveedores y propiedad intelectual especializada.',
        it: 'Dati di R&S, REACH, contratti con i fornitori e proprietà intellettuale specializzata.',
        nl: 'R&D-data, REACH, leverancierscontracten en gespecialiseerd intellectueel eigendom.',
      },
    },
    {
      img: '/images/industries/sector-fret.jpg',
      name: {
        fr: 'Transport & Fret',
        en: 'Transport & Freight',
        de: 'Transport & Fracht',
        es: 'Transporte y Carga',
        it: 'Trasporti & Merci',
        nl: 'Transport & Vracht',
      },
      tag: {
        fr: 'Consolidation', en: 'Consolidation', de: 'Konsolidierung',
        es: 'Consolidación',  it: 'Consolidamento', nl: 'Consolidatie',
      },
      desc: {
        fr: 'Optimisation de flotte, conformité transport, plateformes digitales et valeur documentée.',
        en: 'Fleet optimisation, transport compliance, digital platforms and documented value.',
        de: 'Flottenoptimierung, Transport-Compliance, digitale Plattformen und dokumentierter Wert.',
        es: 'Optimización de flotas, cumplimiento del transporte, plataformas digitales y valor documentado.',
        it: 'Ottimizzazione della flotta, conformità dei trasporti, piattaforme digitali e valore documentato.',
        nl: 'Vlootoptimalisatie, transportcompliance, digitale platforms en gedocumenteerde waarde.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Documentation certifiée du savoir-faire opérationnel, des contrats long terme, des processus propriétaires et de la gouvernance industrielle — base défendable pour tout financement, cession ou succession d\'ETI.',
        en: 'Certified documentation of operational know-how, long-term contracts, proprietary processes and industrial governance — a defensible basis for any financing, sale or mid-cap succession.',
        de: 'Zertifizierte Dokumentation von operativem Know-how, langfristigen Verträgen, proprietären Prozessen und industrieller Governance — belastbare Basis für jede Finanzierung, jeden Verkauf oder jede Nachfolge eines Mid-Cap.',
        es: 'Documentación certificada del saber hacer operativo, los contratos a largo plazo, los procesos propietarios y la gobernanza industrial — base defendible para cualquier financiación, venta o sucesión de una ETI.',
        it: 'Documentazione certificata del know-how operativo, dei contratti di lungo periodo, dei processi proprietari e della governance industriale — base difendibile per qualsiasi finanziamento, cessione o successione di una mid-cap.',
        nl: 'Gecertificeerde documentatie van operationele knowhow, langetermijncontracten, propriëtaire processen en industriële governance — een verdedigbare basis voor elke financiering, verkoop of opvolging van een midcap.',
      },
    },
    {
      title: {
        fr: 'Conseil en Stratégie',
        en: 'Strategy Advisory',
        de: 'Strategieberatung',
        es: 'Consultoría de Estrategia',
        it: 'Consulenza Strategica',
        nl: 'Strategieadvies',
      },
      desc: {
        fr: 'Positionnement dans les vagues de consolidation sectorielle (énergie, logistique, agroalimentaire), gouvernance dirigeante et planification de la transition industrielle et numérique.',
        en: 'Positioning in sector consolidation waves (energy, logistics, agri-food), executive governance and planning of industrial and digital transition.',
        de: 'Positionierung in sektoralen Konsolidierungswellen (Energie, Logistik, Ernährung), Führungs-Governance und Planung der industriellen und digitalen Transformation.',
        es: 'Posicionamiento en las olas de consolidación sectorial (energía, logística, agroalimentación), gobernanza directiva y planificación de la transición industrial y digital.',
        it: 'Posizionamento nelle ondate di consolidamento settoriale (energia, logistica, agroalimentare), governance dirigenziale e pianificazione della transizione industriale e digitale.',
        nl: 'Positionering in sectorale consolidatiegolven (energie, logistiek, voeding), directiegovernance en planning van de industriële en digitale transitie.',
      },
    },
    {
      title: {
        fr: 'Conseil en Technologie',
        en: 'Technology Advisory',
        de: 'Technologieberatung',
        es: 'Consultoría Tecnológica',
        it: 'Consulenza Tecnologica',
        nl: 'Technologieadvies',
      },
      desc: {
        fr: 'Architecture Industrie 4.0, intégration MES/ERP, surveillance prédictive, conformité NIS2 et souveraineté des données industrielles opérationnelles.',
        en: 'Industry 4.0 architecture, MES/ERP integration, predictive monitoring, NIS2 compliance and sovereignty of operational industrial data.',
        de: 'Industrie-4.0-Architektur, MES-/ERP-Integration, vorausschauende Überwachung, NIS2-Compliance und Souveränität über operative Industriedaten.',
        es: 'Arquitectura Industria 4.0, integración MES/ERP, monitorización predictiva, cumplimiento NIS2 y soberanía de los datos industriales operativos.',
        it: 'Architettura Industria 4.0, integrazione MES/ERP, monitoraggio predittivo, conformità NIS2 e sovranità dei dati industriali operativi.',
        nl: 'Industrie 4.0-architectuur, MES/ERP-integratie, predictieve monitoring, NIS2-compliance en soevereiniteit van operationele industriële data.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Préparation à la cession d\'ETI industrielle, structuration des processus acheteur/vendeur, valorisation des actifs opérationnels incorporels et accompagnement closing.',
        en: 'Preparation for the sale of an industrial mid-cap, structuring of buyer/seller processes, valuation of intangible operational assets and closing support.',
        de: 'Vorbereitung auf den Verkauf eines industriellen Mid-Cap, Strukturierung der Käufer-/Verkäuferprozesse, Bewertung immaterieller operativer Assets und Closing-Begleitung.',
        es: 'Preparación para la venta de una ETI industrial, estructuración de los procesos comprador/vendedor, valoración de los activos operativos intangibles y acompañamiento del cierre.',
        it: 'Preparazione alla cessione di una mid-cap industriale, strutturazione dei processi acquirente/venditore, valorizzazione degli asset operativi intangibili e supporto al closing.',
        nl: 'Voorbereiding op de verkoop van een industriële midcap, structurering van koper-/verkoperprocessen, waardering van immateriële operationele activa en closing-begeleiding.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'ETI & PME industrielles',
        en: 'Industrial mid-caps & SMEs',
        de: 'Industrielle Mid-Caps & KMU',
        es: 'ETI y pymes industriales',
        it: 'Mid-cap e PMI industriali',
        nl: 'Industriële midcaps & mkb',
      },
      story: {
        fr: 'Vous dirigez une ETI industrielle en Suisse ou en Europe. La transmission approche — familiale, à un fonds ou à un repreneur industriel. Votre valeur est réelle mais peu documentée : savoir-faire, contrats long terme, dépendances sous-traitants. Les banques et les acquéreurs demandent des preuves.',
        en: 'You run an industrial mid-cap in Switzerland or Europe. Succession is approaching — family, a fund or an industrial buyer. Your value is real but poorly documented: know-how, long-term contracts, subcontractor dependencies. Banks and acquirers are asking for proof.',
        de: 'Sie führen einen industriellen Mid-Cap in der Schweiz oder in Europa. Die Übergabe naht — familienintern, an einen Fonds oder an einen industriellen Nachfolger. Ihr Wert ist real, aber kaum dokumentiert: Know-how, langfristige Verträge, Zulieferer-Abhängigkeiten. Banken und Käufer verlangen Nachweise.',
        es: 'Dirige una ETI industrial en Suiza o Europa. La transmisión se acerca — familiar, a un fondo o a un comprador industrial. Su valor es real pero está poco documentado: saber hacer, contratos a largo plazo, dependencias de subcontratistas. Los bancos y los compradores piden pruebas.',
        it: 'Dirigete una mid-cap industriale in Svizzera o in Europa. Il passaggio si avvicina — familiare, a un fondo o a un acquirente industriale. Il valore è reale ma poco documentato: know-how, contratti di lungo periodo, dipendenze da subappaltatori. Banche e acquirenti chiedono prove.',
        nl: 'U leidt een industriële midcap in Zwitserland of Europa. De overdracht nadert — familiair, aan een fonds of aan een industriële overnemer. Uw waarde is reëel maar slecht gedocumenteerd: knowhow, langetermijncontracten, toeleveranciersafhankelijkheden. Banken en kopers vragen om bewijs.',
      },
      problems: [
        {
          fr: 'Documenter et certifier la valeur transmissible avant une cession ou une succession familiale',
          en: 'Document and certify transferable value before a sale or family succession',
          de: 'Übertragbaren Wert vor einem Verkauf oder einer familiären Nachfolge dokumentieren und zertifizieren',
          es: 'Documentar y certificar el valor transmisible antes de una venta o una sucesión familiar',
          it: 'Documentare e certificare il valore trasmissibile prima di una cessione o di una successione familiare',
          nl: 'Overdraagbare waarde documenteren en certificeren vóór een verkoop of familiale opvolging',
        },
        {
          fr: 'Obtenir un financement bancaire basé sur les actifs incorporels opérationnels',
          en: 'Obtain bank financing based on operational intangible assets',
          de: 'Bankfinanzierung auf Basis operativer immaterieller Vermögenswerte erhalten',
          es: 'Obtener financiación bancaria basada en los activos intangibles operativos',
          it: 'Ottenere un finanziamento bancario basato sugli asset intangibili operativi',
          nl: 'Bankfinanciering verkrijgen op basis van immateriële operationele activa',
        },
        {
          fr: 'Préparer une due diligence acheteur industriel ou fonds dans les délais d\'un process M&A',
          en: 'Prepare for industrial buyer or fund due diligence within M&A process timelines',
          de: 'Eine Due Diligence für industrielle Käufer oder Fonds innerhalb der M&A-Fristen vorbereiten',
          es: 'Preparar una due diligence de comprador industrial o fondo dentro de los plazos de un proceso M&A',
          it: 'Preparare una due diligence per acquirente industriale o fondo entro i tempi di un processo M&A',
          nl: 'Een due diligence voor een industriële koper of fonds voorbereiden binnen de termijnen van een M&A-proces',
        },
      ],
    },
    {
      label: {
        fr: 'Fonds PE & Infrastructure',
        en: 'PE & Infrastructure funds',
        de: 'PE- & Infrastrukturfonds',
        es: 'Fondos PE e Infraestructura',
        it: 'Fondi PE & Infrastrutture',
        nl: 'PE- & infrastructuurfondsen',
      },
      story: {
        fr: 'Vous investissez dans une cible industrielle ou d\'infrastructure en Europe. La valorisation repose sur des actifs opérationnels difficiles à auditer : savoir-faire, contrats fournisseurs, personnes-clés, processus propriétaires. Vous avez besoin d\'une évaluation indépendante avant de signer.',
        en: 'You are investing in an industrial or infrastructure target in Europe. The valuation rests on operational assets that are difficult to audit: know-how, supplier contracts, key people, proprietary processes. You need an independent assessment before signing.',
        de: 'Sie investieren in eine Industrie- oder Infrastruktur-Beteiligung in Europa. Die Bewertung beruht auf schwer auditierbaren operativen Assets: Know-how, Lieferantenverträge, Schlüsselpersonen, proprietäre Prozesse. Sie benötigen eine unabhängige Bewertung vor der Unterzeichnung.',
        es: 'Invierte en una empresa industrial o de infraestructura en Europa. La valoración descansa en activos operativos difíciles de auditar: saber hacer, contratos con proveedores, personas clave, procesos propietarios. Necesita una evaluación independiente antes de firmar.',
        it: 'Investite in un target industriale o infrastrutturale in Europa. La valutazione si fonda su asset operativi difficili da verificare: know-how, contratti con i fornitori, persone chiave, processi proprietari. Serve una valutazione indipendente prima della firma.',
        nl: 'U investeert in een industrieel of infrastructuur-overnamedoel in Europa. De waardering berust op moeilijk te auditen operationele activa: knowhow, leverancierscontracten, sleutelfiguren, propriëtaire processen. U heeft een onafhankelijke beoordeling nodig vóór ondertekening.',
      },
      problems: [
        {
          fr: 'Vérifier la robustesse opérationnelle et la dépendance aux personnes-clés d\'une cible industrielle',
          en: 'Verify the operational robustness and key-person dependency of an industrial target',
          de: 'Operative Robustheit und Schlüsselpersonen-Abhängigkeit einer Industrie-Zielgesellschaft prüfen',
          es: 'Verificar la robustez operativa y la dependencia de personas clave de una empresa industrial objetivo',
          it: 'Verificare la robustezza operativa e la dipendenza da persone chiave di un target industriale',
          nl: 'De operationele robuustheid en sleutelfiguur-afhankelijkheid van een industrieel overnamedoel verifiëren',
        },
        {
          fr: 'Évaluer les actifs incorporels (process, IP opérationnelle, contrats) avec un référentiel certifié',
          en: 'Assess intangible assets (processes, operational IP, contracts) with a certified framework',
          de: 'Immaterielle Vermögenswerte (Prozesse, operative IP, Verträge) mit einem zertifizierten Referenzrahmen bewerten',
          es: 'Evaluar los activos intangibles (procesos, IP operativa, contratos) con un marco certificado',
          it: 'Valutare gli asset immateriali (processi, IP operativa, contratti) con un framework certificato',
          nl: 'Immateriële activa (processen, operationele IP, contracten) beoordelen met een gecertificeerd raamwerk',
        },
        {
          fr: 'Défendre la thèse de valeur auprès des co-investisseurs et des LPs avec une certification opposable',
          en: 'Defend the value thesis to co-investors and LPs with enforceable certification',
          de: 'Die Wertthese gegenüber Co-Investoren und LPs mit einer belastbaren Zertifizierung verteidigen',
          es: 'Defender la tesis de valor ante co-inversores y LP con una certificación oponible',
          it: 'Difendere la tesi di valore presso co-investitori e LP con una certificazione opponibile',
          nl: 'De waardethese verdedigen bij co-investeerders en LP\'s met een aantoombare certificering',
        },
      ],
    },
    {
      label: {
        fr: 'Opérateurs énergie & utilities',
        en: 'Energy & utility operators',
        de: 'Energie- & Versorgungsbetreiber',
        es: 'Operadores de energía y utilities',
        it: 'Operatori energia & utilities',
        nl: 'Energie- & utilityoperatoren',
      },
      story: {
        fr: 'Vous gérez des actifs d\'infrastructure critique — smart grid, production renouvelable, réseau de distribution. Vos régulateurs demandent des preuves de résilience, vos financeurs green bond exigent une documentation ESG et vous envisagez de valoriser vos plateformes digitales propriétaires.',
        en: 'You manage critical infrastructure assets — smart grid, renewable generation, distribution networks. Your regulators demand proof of resilience, your green bond financiers require ESG documentation, and you are considering monetising your proprietary digital platforms.',
        de: 'Sie betreiben kritische Infrastruktur — Smart Grid, Erneuerbare-Energien-Erzeugung, Verteilnetze. Ihre Regulatoren verlangen Resilienznachweise, Ihre Green-Bond-Finanzierer ESG-Dokumentation, und Sie erwägen, Ihre proprietären digitalen Plattformen zu monetarisieren.',
        es: 'Gestiona activos de infraestructura crítica — smart grid, generación renovable, redes de distribución. Sus reguladores piden pruebas de resiliencia, sus financiadores de green bonds exigen documentación ESG y usted considera valorizar sus plataformas digitales propietarias.',
        it: 'Gestite asset di infrastruttura critica — smart grid, produzione rinnovabile, reti di distribuzione. I regolatori chiedono prove di resilienza, i finanziatori green bond esigono documentazione ESG e state valutando di valorizzare le vostre piattaforme digitali proprietarie.',
        nl: 'U beheert kritieke-infrastructuuractiva — smart grid, hernieuwbare opwekking, distributienetwerken. Uw toezichthouders eisen weerbaarheidsbewijs, uw green-bond-financiers eisen ESG-documentatie en u overweegt uw propriëtaire digitale platforms te monetariseren.',
      },
      problems: [
        {
          fr: 'Documenter et certifier la résilience opérationnelle pour un audit réglementaire sectoriel',
          en: 'Document and certify operational resilience for a sector regulatory audit',
          de: 'Operative Resilienz für ein sektorales Regulierungsaudit dokumentieren und zertifizieren',
          es: 'Documentar y certificar la resiliencia operativa para una auditoría regulatoria sectorial',
          it: 'Documentare e certificare la resilienza operativa per un audit regolamentare di settore',
          nl: 'Operationele weerbaarheid documenteren en certificeren voor een sectorale regelgevende audit',
        },
        {
          fr: 'Préparer les actifs digitaux propriétaires à un financement green bond ou infrastructure fund',
          en: 'Prepare proprietary digital assets for green bond or infrastructure fund financing',
          de: 'Proprietäre digitale Assets für eine Green-Bond- oder Infrastrukturfonds-Finanzierung vorbereiten',
          es: 'Preparar los activos digitales propietarios para una financiación green bond o fondo de infraestructura',
          it: 'Preparare gli asset digitali proprietari per un finanziamento green bond o fondo infrastrutture',
          nl: 'Propriëtaire digitale activa voorbereiden op green-bond- of infrastructuurfondsfinanciering',
        },
        {
          fr: 'Valoriser les plateformes de gestion énergétique comme actifs certifiables et transmissibles',
          en: 'Value energy management platforms as certifiable and transferable assets',
          de: 'Energiemanagement-Plattformen als zertifizierbare und übertragbare Assets bewerten',
          es: 'Valorizar las plataformas de gestión energética como activos certificables y transmisibles',
          it: 'Valorizzare le piattaforme di gestione energetica come asset certificabili e trasmissibili',
          nl: 'Energiebeheerplatforms waarderen als certificeerbare en overdraagbare activa',
        },
      ],
    },
  ],
  articleSlugs: [
    'small-mid-cap-enjeux-entreprises-50-300m',
    'preparer-organisation-cession-levee-5-points',
    'industrie-energie-infrastructure-valeur-transmissible-2025',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   4. COMMERCE, SERVICES & EXPÉRIENCE CLIENT
   ════════════════════════════════════════════════════════════════════ */
const commerce: Industry = {
  slug:      'commerce-services-experience-client',
  clusterId: 'commerce',
  name: {
    fr: 'Commerce, Services & Expérience Client',
    en: 'Commerce, Services & Customer Experience',
    de: 'Handel, Dienstleistungen & Kundenerlebnis',
    es: 'Comercio, Servicios y Experiencia de Cliente',
    it: 'Commercio, Servizi & Customer Experience',
    nl: 'Handel, Diensten & Klantervaring',
  },
  img: '/images/industries/theme_marketplace.webp',
  imgAlt: {
    fr: 'Commerce, Services & Expérience Client — Aegryn',
    en: 'Commerce, Services & Customer Experience — Aegryn',
    de: 'Handel, Dienstleistungen & Kundenerlebnis — Aegryn',
    es: 'Comercio, Servicios y Experiencia de Cliente — Aegryn',
    it: 'Commercio, Servizi & Customer Experience — Aegryn',
    nl: 'Handel, Diensten & Klantervaring — Aegryn',
  },
  vision: {
    fr: `Les organisations du commerce, des services et de l'expérience client naviguent entre des cycles d'innovation très courts, des attentes consommateurs en transformation permanente et une pression réglementaire croissante sur les données et la publicité numérique.

Dans ces secteurs, la pression sur les marges, la saisonnalité de la demande ou la rotation des équipes pèsent différemment selon les métiers. Point commun : les clients passent de plus en plus par des plateformes (places de marché, réservation en ligne, distribution digitale) qui captent une part de la relation et des données. Ce qui fait la différence : une clientèle fidèle, des données dont vous êtes propriétaire, une marque et des équipes stables. Cela se joue à chaque cycle : lancer un concept, changer d'échelle, repositionner un établissement, en reprendre un autre ou préparer la transmission d'une enseigne. Aegryn aide à décider, puis pilote le projet jusqu'à sa mise en œuvre.`,
    en: `Commerce, services and customer experience organisations navigate between very short innovation cycles, permanently evolving consumer expectations and growing regulatory pressure on data and digital advertising.

Across these sectors, margin pressure, seasonal demand or staff turnover weigh differently depending on the business. The common thread: customers increasingly come through platforms (marketplaces, online booking, digital distribution) that capture part of the relationship and the data. What makes the difference: a loyal customer base, data you own, a brand and stable teams. This plays out at every cycle: launching a concept, scaling up, repositioning a site, taking over another or preparing the transfer of a brand. Aegryn helps you decide, then steers the project through to implementation.`,
    de: `Organisationen aus Handel, Dienstleistungen und Kundenerlebnis bewegen sich zwischen sehr kurzen Innovationszyklen, sich permanent wandelnden Verbrauchererwartungen und wachsendem regulatorischem Druck auf Daten und digitale Werbung.

In diesen Branchen wiegen Margendruck, saisonale Nachfrage oder Teamfluktuation je nach Geschäft unterschiedlich. Gemeinsamer Nenner: Kunden kommen zunehmend über Plattformen (Marktplätze, Online-Buchung, digitale Distribution), die einen Teil der Beziehung und der Daten abschöpfen. Den Unterschied machen: ein loyaler Kundenstamm, Daten, die Ihnen gehören, eine Marke und stabile Teams. Das entscheidet sich in jedem Zyklus: ein Konzept lancieren, skalieren, einen Standort neu positionieren, einen anderen übernehmen oder die Übergabe einer Marke vorbereiten. Aegryn hilft bei der Entscheidung und steuert das Projekt bis zur Umsetzung.`,
    es: `Las organizaciones de comercio, servicios y experiencia de cliente navegan entre ciclos de innovación muy cortos, expectativas de consumidores en transformación permanente y una presión regulatoria creciente sobre los datos y la publicidad digital.

En estos sectores, la presión sobre los márgenes, la estacionalidad de la demanda o la rotación de los equipos pesan de forma distinta según el oficio. Punto en común: los clientes llegan cada vez más a través de plataformas (marketplaces, reservas en línea, distribución digital) que capturan parte de la relación y de los datos. Lo que marca la diferencia: una clientela fiel, datos de su propiedad, una marca y equipos estables. Esto se juega en cada ciclo: lanzar un concepto, cambiar de escala, reposicionar un establecimiento, adquirir otro o preparar la transmisión de una enseña. Aegryn ayuda a decidir y luego pilota el proyecto hasta su implementación.`,
    it: `Le organizzazioni del commercio, dei servizi e della customer experience navigano tra cicli di innovazione molto brevi, aspettative dei consumatori in trasformazione permanente e una pressione regolamentare crescente su dati e pubblicità digitale.

In questi settori, la pressione sui margini, la stagionalità della domanda o il turnover dei team pesano in modo diverso a seconda del mestiere. Il punto comune: i clienti arrivano sempre più attraverso piattaforme (marketplace, prenotazioni online, distribuzione digitale) che catturano parte della relazione e dei dati. Ciò che fa la differenza: una clientela fedele, dati di vostra proprietà, un marchio e team stabili. Questo si gioca a ogni ciclo: lanciare un concept, cambiare scala, riposizionare un esercizio, rilevarne un altro o preparare la trasmissione di un'insegna. Aegryn aiuta a decidere, poi pilota il progetto fino alla sua attuazione.`,
    nl: `Organisaties in handel, diensten en klantervaring bewegen zich tussen zeer korte innovatiecycli, permanent veranderende consumentenverwachtingen en groeiende regelgevende druk op data en digitale reclame.

In deze sectoren wegen margedruk, seizoensgebonden vraag of personeelsverloop per vakgebied verschillend. De gemene deler: klanten komen steeds vaker via platforms (marktplaatsen, online reserveren, digitale distributie) die een deel van de relatie en de data wegkapen. Wat het verschil maakt: een loyale klantenkring, data die u bezit, een merk en stabiele teams. Dit speelt in elke cyclus: een concept lanceren, opschalen, een vestiging herpositioneren, een andere overnemen of de overdracht van een merk voorbereiden. Aegryn helpt beslissen en stuurt het project vervolgens tot de implementatie.`,
  },
  keyMetrics: [
    { value: '887 Mrd EUR', label: {
      fr: 'e-commerce Europe 2024 (Eurostat / E-commerce Europe)',
      en: 'e-commerce Europe 2024 (Eurostat / E-commerce Europe)',
      de: 'E-Commerce Europa 2024 (Eurostat / E-commerce Europe)',
      es: 'e-commerce Europa 2024 (Eurostat / E-commerce Europe)',
      it: 'e-commerce Europa 2024 (Eurostat / E-commerce Europe)',
      nl: 'e-commerce Europa 2024 (Eurostat / E-commerce Europe)',
    }},
    { value: '11,5 Mrd EUR', label: {
      fr: 'M&A retail & services Europe 2023 (Refinitiv 2024)',
      en: 'retail & services M&A Europe 2023 (Refinitiv 2024)',
      de: 'Retail- & Services-M&A Europa 2023 (Refinitiv 2024)',
      es: 'M&A retail y servicios Europa 2023 (Refinitiv 2024)',
      it: 'M&A retail e servizi Europa 2023 (Refinitiv 2024)',
      nl: 'retail- & diensten-M&A Europa 2023 (Refinitiv 2024)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/ecommerce-shop.jpg',
      name: {
        fr: 'Retail & E-commerce',
        en: 'Retail & E-commerce',
        de: 'Retail & E-Commerce',
        es: 'Retail y E-commerce',
        it: 'Retail & E-commerce',
        nl: 'Retail & E-commerce',
      },
      tag: {
        fr: 'Omnicanal', en: 'Omnichannel', de: 'Omnichannel',
        es: 'Omnicanal',  it: 'Omnicanale',  nl: 'Omnikanaal',
      },
      desc: {
        fr: 'Plateformes omnicanales, IA personnalisation, logistique last-mile et données first-party défendables.',
        en: 'Omnichannel platforms, personalisation AI, last-mile logistics and defensible first-party data.',
        de: 'Omnichannel-Plattformen, Personalisierungs-KI, Last-Mile-Logistik und belastbare First-Party-Daten.',
        es: 'Plataformas omnicanal, IA de personalización, logística last-mile y datos first-party defendibles.',
        it: 'Piattaforme omnicanale, IA di personalizzazione, logistica last-mile e dati first-party difendibili.',
        nl: 'Omnichannel-platforms, personalisatie-AI, last-mile-logistiek en verdedigbare first-party-data.',
      },
    },
    {
      img: '/images/industries/sector-hotel.jpg',
      name: {
        fr: 'Hôtellerie & Tourisme',
        en: 'Hospitality & Tourism',
        de: 'Hotellerie & Tourismus',
        es: 'Hotelería y Turismo',
        it: 'Hotellerie & Turismo',
        nl: 'Horeca & Toerisme',
      },
      tag: {
        fr: 'Saisonnier', en: 'Seasonal', de: 'Saisonal',
        es: 'Estacional',  it: 'Stagionale', nl: 'Seizoensgebonden',
      },
      desc: {
        fr: 'Revenue management, expérience digitale, ESG et valorisation des marques hôtelières pour cession.',
        en: 'Revenue management, digital experience, ESG and hotel brand valuation for sale.',
        de: 'Revenue Management, digitales Erlebnis, ESG und Bewertung von Hotelmarken für den Verkauf.',
        es: 'Revenue management, experiencia digital, ESG y valoración de marcas hoteleras para la venta.',
        it: 'Revenue management, esperienza digitale, ESG e valorizzazione dei marchi alberghieri per la cessione.',
        nl: 'Revenue management, digitale ervaring, ESG en waardering van hotelmerken voor verkoop.',
      },
    },
    {
      img: '/images/industries/sector-luxe.jpg',
      name: {
        fr: 'Luxe & Retail Premium',
        en: 'Luxury & Premium Retail',
        de: 'Luxus & Premium-Retail',
        es: 'Lujo y Retail Premium',
        it: 'Lusso & Retail Premium',
        nl: 'Luxe & Premium Retail',
      },
      tag: {
        fr: 'IP forte', en: 'Strong IP', de: 'Starke IP',
        es: 'IP fuerte',  it: 'Forte IP', nl: 'Sterke IP',
      },
      desc: {
        fr: 'Marques, exclusivité, données clientèle premium et gouvernance IP dans les structures de groupe.',
        en: 'Brands, exclusivity, premium customer data and IP governance within group structures.',
        de: 'Marken, Exklusivität, Premium-Kundendaten und IP-Governance in Konzernstrukturen.',
        es: 'Marcas, exclusividad, datos de clientela premium y gobernanza de IP en estructuras de grupo.',
        it: 'Marchi, esclusività, dati di clientela premium e governance IP nelle strutture di gruppo.',
        nl: 'Merken, exclusiviteit, premium-klantdata en IP-governance binnen groepsstructuren.',
      },
    },
    {
      img: '/images/industries/sector-medias.jpg',
      name: {
        fr: 'Médias & Entertainment',
        en: 'Media & Entertainment',
        de: 'Medien & Entertainment',
        es: 'Medios y Entretenimiento',
        it: 'Media & Entertainment',
        nl: 'Media & Entertainment',
      },
      tag: {
        fr: 'Disruption', en: 'Disruption', de: 'Disruption',
        es: 'Disrupción',  it: 'Disruption', nl: 'Disruptie',
      },
      desc: {
        fr: 'Streaming, gaming, IP contenus, monétisation et régulation DSA/droits voisins.',
        en: 'Streaming, gaming, content IP, monetisation and DSA/neighbouring rights regulation.',
        de: 'Streaming, Gaming, Content-IP, Monetarisierung und DSA-/Leistungsschutzrechte-Regulierung.',
        es: 'Streaming, gaming, IP de contenidos, monetización y regulación DSA/derechos conexos.',
        it: 'Streaming, gaming, IP dei contenuti, monetizzazione e regolazione DSA/diritti connessi.',
        nl: 'Streaming, gaming, content-IP, monetisatie en DSA-/naburige-rechten-regulering.',
      },
    },
    {
      img: '/images/industries/sector-telecom.jpg',
      name: {
        fr: 'Télécommunications',
        en: 'Telecommunications',
        de: 'Telekommunikation',
        es: 'Telecomunicaciones',
        it: 'Telecomunicazioni',
        nl: 'Telecommunicatie',
      },
      tag: {
        fr: 'Réglementé', en: 'Regulated', de: 'Reguliert',
        es: 'Regulado',   it: 'Regolamentato', nl: 'Gereguleerd',
      },
      desc: {
        fr: 'Infrastructures, conformité BEREC, déploiement fibre/5G et valorisation des bases abonnés.',
        en: 'Infrastructure, BEREC compliance, fibre/5G rollout and subscriber base valuation.',
        de: 'Infrastruktur, BEREC-Compliance, Glasfaser-/5G-Ausbau und Bewertung der Abonnentenbasis.',
        es: 'Infraestructuras, cumplimiento BEREC, despliegue fibra/5G y valoración de las bases de abonados.',
        it: 'Infrastrutture, conformità BEREC, deployment fibra/5G e valorizzazione delle basi abbonati.',
        nl: 'Infrastructuur, BEREC-compliance, glasvezel-/5G-uitrol en waardering van abonneebases.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Face aux places de marché : stratégie et modèle',
        en: 'Facing marketplaces: strategy and model',
        de: 'Gegenüber den Marktplätzen: Strategie und Modell',
        es: 'Frente a los marketplaces: estrategia y modelo',
        it: 'Di fronte ai marketplace: strategia e modello',
        nl: 'Tegenover marktplaatsen: strategie en model',
      },
      desc: {
        fr: 'Ouvrir un deuxième pays, développer un canal en propre face aux places de marché, lancer un nouveau concept. Arbitrer entre exploitation en propre, franchise ou contrat de gestion. Livrable : plan à 12-18 mois et grille de décision.',
        en: 'Open a second country, build a direct channel against marketplaces, launch a new concept. Choose between own operations, franchise or management contract. Deliverable: 12-18 month plan and decision grid.',
        de: 'Ein zweites Land erschliessen, einen eigenen Kanal gegenüber den Marktplätzen aufbauen, ein neues Konzept lancieren. Abwägen zwischen Eigenbetrieb, Franchise oder Managementvertrag. Lieferung: 12-18-Monats-Plan und Entscheidungsraster.',
        es: 'Abrir un segundo país, desarrollar un canal propio frente a los marketplaces, lanzar un nuevo concepto. Arbitrar entre explotación propia, franquicia o contrato de gestión. Entregable: plan a 12-18 meses y cuadrícula de decisión.',
        it: 'Aprire un secondo paese, sviluppare un canale proprio contro i marketplace, lanciare un nuovo concept. Arbitrare tra gestione diretta, franchising o contratto di gestione. Deliverable: piano a 12-18 mesi e griglia decisionale.',
        nl: 'Een tweede land openen, een eigen kanaal opbouwen tegenover marktplaatsen, een nieuw concept lanceren. Afwegen tussen eigen exploitatie, franchise of managementcontract. Deliverable: 12-18-maandenplan en beslisraster.',
      },
    },
    {
      title: {
        fr: 'Données clients, consentement & conformité',
        en: 'Customer data, consent & compliance',
        de: 'Kundendaten, Einwilligung & Compliance',
        es: 'Datos de clientes, consentimiento y cumplimiento',
        it: 'Dati clienti, consenso & conformità',
        nl: 'Klantdata, toestemming & compliance',
      },
      desc: {
        fr: 'Données clients first-party et consentement (RGPD, LPD), règles de la publicité numérique, obligations propres au secteur (autorisations d\'exploitation, sécurité des lieux, régulateur télécoms). Livrable : carte d\'exposition et plan de mise à niveau priorisé.',
        en: 'First-party customer data and consent (GDPR, Swiss FADP), digital advertising rules, sector-specific obligations (operating licences, premises safety, telecoms regulator). Deliverable: exposure map and prioritised upgrade plan.',
        de: 'First-Party-Kundendaten und Einwilligung (DSGVO, DSG), Regeln der digitalen Werbung, branchenspezifische Pflichten (Betriebsbewilligungen, Sicherheit der Räumlichkeiten, Fernmelderegulator). Lieferung: Expositionskarte und priorisierter Upgrade-Plan.',
        es: 'Datos de clientes first-party y consentimiento (RGPD, LPD suiza), reglas de la publicidad digital, obligaciones propias del sector (autorizaciones de explotación, seguridad de los locales, regulador de telecomunicaciones). Entregable: mapa de exposición y plan de actualización priorizado.',
        it: 'Dati clienti first-party e consenso (GDPR, LPD svizzera), regole della pubblicità digitale, obblighi propri del settore (autorizzazioni di esercizio, sicurezza dei locali, regolatore telecomunicazioni). Deliverable: mappa di esposizione e piano di aggiornamento prioritizzato.',
        nl: 'First-party-klantdata en toestemming (AVG, Zwitserse WBG), regels voor digitale reclame, sectorspecifieke verplichtingen (exploitatievergunningen, veiligheid van de locaties, telecomregulator). Deliverable: blootstellingskaart en geprioriteerd upgradeplan.',
      },
    },
    {
      title: {
        fr: 'Plateformes, outils & indépendance vis-à-vis des places de marché',
        en: 'Platforms, tooling & independence from marketplaces',
        de: 'Plattformen, Tools & Unabhängigkeit von Marktplätzen',
        es: 'Plataformas, herramientas e independencia frente a los marketplaces',
        it: 'Piattaforme, strumenti & indipendenza dai marketplace',
        nl: 'Platforms, tools & onafhankelijkheid van marktplaatsen',
      },
      desc: {
        fr: 'Choix et réversibilité des outils (e-commerce, ERP/CRM, systèmes de réservation et de gestion hôtelière), canal en propre face aux places de marché, personnalisation par l\'IA. Outils sur mesure seulement lorsque le marché n\'en propose pas. Livrable : test de réversibilité et arbitrage chiffré.',
        en: 'Tooling choices and reversibility (e-commerce, ERP/CRM, booking and hotel management systems), a direct channel against marketplaces, AI personalisation. Custom-built tools only when the market does not offer them. Deliverable: reversibility test and quantified trade-off.',
        de: 'Auswahl und Reversibilität der Tools (E-Commerce, ERP/CRM, Reservierungs- und Hotelmanagementsysteme), eigener Kanal gegenüber den Marktplätzen, KI-Personalisierung. Massgeschneiderte Tools nur, wenn der Markt keine anbietet. Lieferung: Reversibilitätstest und bezifferte Abwägung.',
        es: 'Elección y reversibilidad de las herramientas (e-commerce, ERP/CRM, sistemas de reservas y gestión hotelera), canal propio frente a los marketplaces, personalización por IA. Herramientas a medida solo cuando el mercado no las ofrece. Entregable: prueba de reversibilidad y arbitraje cifrado.',
        it: 'Scelta e reversibilità degli strumenti (e-commerce, ERP/CRM, sistemi di prenotazione e gestione alberghiera), canale proprio rispetto ai marketplace, personalizzazione tramite IA. Strumenti su misura solo quando il mercato non li offre. Deliverable: test di reversibilità e arbitrato quantificato.',
        nl: 'Keuze en omkeerbaarheid van tools (e-commerce, ERP/CRM, reserverings- en hotelmanagementsystemen), eigen kanaal tegenover marktplaatsen, AI-personalisatie. Maatwerk alleen als de markt het niet aanbiedt. Deliverable: omkeerbaarheidstest en onderbouwde afweging.',
      },
    },
    {
      title: {
        fr: 'Fonctions terrain & succession : talent et organisation',
        en: 'Field roles & succession: talent and organisation',
        de: 'Operative Funktionen & Nachfolge: Talent und Organisation',
        es: 'Funciones operativas y sucesión: talento y organización',
        it: 'Funzioni operative & successione: talent e organizzazione',
        nl: 'Operationele functies & opvolging: talent en organisatie',
      },
      desc: {
        fr: 'Directeur d\'exploitation ou de site, responsable e-commerce, directeur d\'hôtel ou de restaurant. Équipes saisonnières, rétention des postes clés, succession d\'une enseigne familiale. Livrable : fiche de poste, vivier, plan de rétention.',
        en: 'Operations or site director, e-commerce manager, hotel or restaurant director. Seasonal teams, retention of key positions, succession of a family business. Deliverable: job description, talent pool, retention plan.',
        de: 'Betriebs- oder Standortleiter, E-Commerce-Verantwortlicher, Hotel- oder Restaurantdirektor. Saisonale Teams, Bindung von Schlüsselpositionen, Nachfolge eines Familienbetriebs. Lieferung: Stellenprofil, Talentpool, Retentionsplan.',
        es: 'Director de explotación o de establecimiento, responsable e-commerce, director de hotel o restaurante. Equipos estacionales, retención de puestos clave, sucesión de una enseña familiar. Entregable: ficha de puesto, cantera, plan de retención.',
        it: 'Direttore di esercizio o di sede, responsabile e-commerce, direttore di hotel o ristorante. Team stagionali, retention delle posizioni chiave, successione di un\'attività familiare. Deliverable: scheda di posizione, serbatoio di talenti, piano di retention.',
        nl: 'Operationeel of vestigingsdirecteur, e-commerceverantwoordelijke, hotel- of restaurantdirecteur. Seizoensteams, behoud van sleutelposities, opvolging van een familiebedrijf. Deliverable: functieprofiel, talentpool, retentieplan.',
      },
    },
    {
      title: {
        fr: 'Reprise, intégration & cession d\'activités commerciales',
        en: 'Acquisition, integration & divestment of commercial activities',
        de: 'Übernahme, Integration & Veräusserung kommerzieller Aktivitäten',
        es: 'Adquisición, integración y cesión de actividades comerciales',
        it: 'Acquisizione, integrazione & cessione di attività commerciali',
        nl: 'Overname, integratie & verkoop van commerciële activiteiten',
      },
      desc: {
        fr: 'Revue d\'un hôtel, d\'une enseigne ou d\'une plateforme avant la lettre d\'intention : bail et autorisations, contrats de gestion ou de franchise, clauses de changement de contrôle, dépendance aux équipes clés. Plan d\'intégration à 100 jours. La certification CIFSO 5000 reste possible en appui si le dossier le justifie.',
        en: 'Review of a hotel, a chain or a platform before the letter of intent: lease and permits, management or franchise contracts, change-of-control clauses, key-team dependency. 100-day integration plan. CIFSO 5000 certification remains available in support where the case warrants it.',
        de: 'Prüfung eines Hotels, einer Kette oder einer Plattform vor der Absichtserklärung: Mietvertrag und Bewilligungen, Management- oder Franchiseverträge, Change-of-Control-Klauseln, Abhängigkeit von Schlüsselteams. 100-Tage-Integrationsplan. Die CIFSO-5000-Zertifizierung bleibt unterstützend möglich, wenn das Dossier es rechtfertigt.',
        es: 'Revisión de un hotel, una enseña o una plataforma antes de la carta de intención: arrendamiento y autorizaciones, contratos de gestión o franquicia, cláusulas de cambio de control, dependencia de equipos clave. Plan de integración a 100 días. La certificación CIFSO 5000 sigue siendo posible como apoyo si el expediente lo justifica.',
        it: 'Revisione di un hotel, di un\'insegna o di una piattaforma prima della lettera di intenti: affitto e autorizzazioni, contratti di gestione o franchising, clausole di cambio di controllo, dipendenza dai team chiave. Piano di integrazione a 100 giorni. La certificazione CIFSO 5000 resta possibile a supporto se il dossier lo giustifica.',
        nl: 'Beoordeling van een hotel, een formule of een platform vóór de intentieverklaring: huur en vergunningen, management- of franchisecontracten, change-of-control-clausules, afhankelijkheid van sleutelteams. 100-dagen-integratieplan. De CIFSO 5000-certificering blijft ter ondersteuning mogelijk als het dossier dat rechtvaardigt.',
      },
    },
  ],
  expertiseFootnote: {
    fr: 'Mobilisables seules, ou réunies en un programme que nous pilotons.',
    en: 'Available individually, or combined into a single programme we steer.',
    de: 'Einzeln einsetzbar oder vereint zu einem Programm, das wir steuern.',
    es: 'Movilizables por separado, o reunidas en un programa que pilotamos.',
    it: 'Mobilitabili singolarmente, o riunite in un programma che pilotiamo.',
    nl: 'Afzonderlijk inzetbaar, of gebundeld in een programma dat wij sturen.',
  },
  problemsLabel: {
    fr: 'Ce que nous pilotons',
    en: 'What we steer',
    de: 'Was wir steuern',
    es: 'Lo que pilotamos',
    it: 'Ciò che pilotiamo',
    nl: 'Wat wij sturen',
  },
  segments: [
    {
      label: {
        fr: 'Retailers, e-commerçants & enseignes : cycle Croissance',
        en: 'Retailers, e-merchants & chains: Growth cycle',
        de: 'Retailer, E-Händler & Filialketten: Zyklus Wachstum',
        es: 'Retailers, e-comerciantes y enseñas: ciclo Crecimiento',
        it: 'Retailer, e-commerce e insegne: ciclo Crescita',
        nl: 'Retailers, e-commercebedrijven & ketens: cyclus Groei',
      },
      icon: 'Store',
      story: {
        fr: 'Vous réalisez l\'essentiel de votre chiffre en ligne et vous voulez ouvrir un deuxième pays et quelques boutiques en 18 mois. Plateforme, TVA et livraison multi-pays, consentement, logistique, recrutement : chaque chantier avance seul.',
        en: 'You generate most of your revenue online and you want to open a second country and a few stores within 18 months. Platform, VAT and multi-country delivery, consent, logistics, recruitment: each workstream moves forward on its own.',
        de: 'Sie erzielen den Grossteil Ihres Umsatzes online und wollen in 18 Monaten ein zweites Land und einige Filialen eröffnen. Plattform, MwSt. und Lieferung in mehrere Länder, Einwilligung, Logistik, Rekrutierung: jede Baustelle läuft für sich.',
        es: 'Realiza la mayor parte de su facturación en línea y quiere abrir un segundo país y algunas tiendas en 18 meses. Plataforma, IVA y entrega multipaís, consentimiento, logística, contratación: cada obra avanza por su cuenta.',
        it: 'Realizzate la maggior parte del fatturato online e volete aprire un secondo paese e alcuni negozi in 18 mesi. Piattaforma, IVA e consegne multi-paese, consenso, logistica, reclutamento: ogni cantiere avanza da solo.',
        nl: 'U realiseert het grootste deel van uw omzet online en wilt binnen 18 maanden een tweede land en enkele winkels openen. Platform, btw en levering in meerdere landen, toestemming, logistiek, werving: elke werf loopt op zichzelf door.',
      },
      problems: [
        {
          fr: 'Décider quel pays et quel canal en premier → grille de décision et calendrier à 18 mois.',
          en: 'Decide which country and which channel first → decision grid and 18-month roadmap.',
          de: 'Entscheiden, welches Land und welcher Kanal zuerst → Entscheidungsraster und 18-Monats-Kalender.',
          es: 'Decidir qué país y qué canal primero → cuadrícula de decisión y calendario a 18 meses.',
          it: 'Decidere quale paese e quale canale per primi → griglia decisionale e calendario a 18 mesi.',
          nl: 'Beslissen welk land en welk kanaal eerst → beslisraster en 18-maandenkalender.',
        },
        {
          fr: 'Mettre la plateforme et les données à niveau pour plusieurs pays → feuille de route technique et test de réversibilité.',
          en: 'Upgrade the platform and data for multiple countries → technical roadmap and reversibility test.',
          de: 'Plattform und Daten für mehrere Länder auf den Stand bringen → technische Roadmap und Reversibilitätstest.',
          es: 'Poner la plataforma y los datos a nivel para varios países → hoja de ruta técnica y prueba de reversibilidad.',
          it: 'Adeguare piattaforma e dati per più paesi → roadmap tecnica e test di reversibilità.',
          nl: 'Platform en data op niveau brengen voor meerdere landen → technische roadmap en omkeerbaarheidstest.',
        },
        {
          fr: 'Recruter le responsable pays ou le directeur des opérations → fiche de poste et vivier.',
          en: 'Recruit the country manager or operations director → job description and talent pool.',
          de: 'Den Länderverantwortlichen oder Betriebsleiter rekrutieren → Stellenprofil und Talentpool.',
          es: 'Contratar al responsable de país o al director de operaciones → ficha de puesto y cantera.',
          it: 'Reclutare il responsabile paese o il direttore delle operazioni → scheda di posizione e serbatoio.',
          nl: 'De landverantwoordelijke of operationeel directeur werven → functieprofiel en talentpool.',
        },
      ],
    },
    {
      label: {
        fr: 'Hôtellerie, restauration & lieux d\'exception : cycles Lancement et Reprise',
        en: 'Hospitality, dining & exceptional venues: Launch and Acquisition cycles',
        de: 'Hotellerie, Gastronomie & Ausnahmeorte: Zyklen Lancierung und Übernahme',
        es: 'Hotelería, restauración y lugares excepcionales: ciclos Lanzamiento y Adquisición',
        it: 'Hotellerie, ristorazione e luoghi d\'eccezione: cicli Lancio e Acquisizione',
        nl: 'Horeca & bijzondere locaties: cycli Lancering en Overname',
      },
      icon: 'Hotel',
      story: {
        fr: 'Vous reprenez un hôtel indépendant d\'une quarantaine de chambres à rénover et à repositionner. Entre le bail, les autorisations, les travaux, le recrutement et l\'ouverture, une dizaine d\'intervenants avancent chacun de leur côté.',
        en: 'You are taking over an independent hotel of about forty rooms to renovate and reposition. Between the lease, permits, works, recruitment and the opening, a dozen parties each move forward on their own side.',
        de: 'Sie übernehmen ein unabhängiges Hotel mit rund vierzig Zimmern, das renoviert und neu positioniert werden soll. Zwischen Mietvertrag, Bewilligungen, Arbeiten, Rekrutierung und Eröffnung arbeitet ein Dutzend Beteiligter jeder für sich.',
        es: 'Usted adquiere un hotel independiente de una cuarentena de habitaciones para renovar y reposicionar. Entre el arrendamiento, las autorizaciones, las obras, la contratación y la apertura, una decena de intervinientes avanza cada uno por su lado.',
        it: 'Rilevate un hotel indipendente di una quarantina di camere da ristrutturare e riposizionare. Tra affitto, autorizzazioni, lavori, reclutamento e apertura, una decina di soggetti avanza ciascuno per conto proprio.',
        nl: 'U neemt een onafhankelijk hotel met een veertigtal kamers over om te renoveren en te herpositioneren. Tussen huur, vergunningen, werkzaamheden, werving en opening schiet een tiental partijen elk hun eigen kant op.',
      },
      problems: [
        {
          fr: 'Avant l\'offre : revue des angles morts (propriété ou bail, autorisations d\'exploitation, contrats de gestion ou de franchise, distribution en ligne, équipes clés) → traitement proposé pour chacun : prix, garantie, condition suspensive.',
          en: 'Before the offer: review of blind spots (freehold or lease, operating permits, management or franchise contracts, online distribution, key teams) → proposed treatment for each: price, warranty, condition precedent.',
          de: 'Vor dem Angebot: Prüfung der blinden Flecken (Eigentum oder Miete, Betriebsbewilligungen, Management- oder Franchiseverträge, Online-Vertrieb, Schlüsselteams) → vorgeschlagene Behandlung für jeden: Preis, Garantie, aufschiebende Bedingung.',
          es: 'Antes de la oferta: revisión de los ángulos muertos (propiedad o arrendamiento, autorizaciones de explotación, contratos de gestión o franquicia, distribución en línea, equipos clave) → tratamiento propuesto para cada uno: precio, garantía, condición suspensiva.',
          it: 'Prima dell\'offerta: revisione dei punti ciechi (proprietà o affitto, autorizzazioni di esercizio, contratti di gestione o franchising, distribuzione online, team chiave) → trattamento proposto per ciascuno: prezzo, garanzia, condizione sospensiva.',
          nl: 'Vóór het bod: beoordeling van de blinde vlekken (eigendom of huur, exploitatievergunningen, management- of franchisecontracten, online distributie, sleutelteams) → voorgestelde behandeling voor elk: prijs, garantie, opschortende voorwaarde.',
        },
        {
          fr: 'De la signature à l\'ouverture : planning intégré travaux, recrutement, marque et commercialisation → budget par lot et jalons.',
          en: 'From signing to opening: integrated planning of works, recruitment, brand and go-to-market → budget per lot and milestones.',
          de: 'Von der Unterzeichnung bis zur Eröffnung: integrierter Zeitplan für Arbeiten, Rekrutierung, Marke und Vermarktung → Budget pro Los und Meilensteine.',
          es: 'De la firma a la apertura: planificación integrada de obras, contratación, marca y comercialización → presupuesto por lote e hitos.',
          it: 'Dalla firma all\'apertura: pianificazione integrata di lavori, reclutamento, marchio e commercializzazione → budget per lotto e milestone.',
          nl: 'Van ondertekening tot opening: geïntegreerde planning van werkzaamheden, werving, merk en commercialisering → budget per lot en mijlpalen.',
        },
        {
          fr: 'Après l\'ouverture : sélection du directeur et plan de rétention des équipes → fiche de poste, profils présélectionnés.',
          en: 'After opening: selection of the director and team retention plan → job description, preselected profiles.',
          de: 'Nach der Eröffnung: Auswahl des Direktors und Retentionsplan für die Teams → Stellenprofil, vorausgewählte Profile.',
          es: 'Tras la apertura: selección del director y plan de retención de los equipos → ficha de puesto, perfiles preseleccionados.',
          it: 'Dopo l\'apertura: selezione del direttore e piano di retention dei team → scheda di posizione, profili preselezionati.',
          nl: 'Na de opening: selectie van de directeur en retentieplan voor de teams → functieprofiel, voorgeselecteerde profielen.',
        },
      ],
    },
    {
      label: {
        fr: 'Groupes médias, télécoms & services : cycles Transmission et Restructuration',
        en: 'Media, telecom & services groups: Transfer and Restructuring cycles',
        de: 'Medien-, Telekom- & Dienstleistungsgruppen: Zyklen Übergabe und Restrukturierung',
        es: 'Grupos de medios, telecom y servicios: ciclos Transmisión y Reestructuración',
        it: 'Gruppi media, telecom e servizi: cicli Trasmissione e Ristrutturazione',
        nl: 'Media-, telecom- & dienstengroepen: cycli Overdracht en Herstructurering',
      },
      icon: 'Radio',
      story: {
        fr: 'Vous exploitez un catalogue de droits ou une base d\'abonnés B2B et vous envisagez de céder une activité. Contrats long terme, droits, systèmes partagés, exigences du régulateur : l\'activité doit pouvoir tenir sans vous.',
        en: 'You operate a rights catalogue or a B2B subscriber base and are considering divesting an activity. Long-term contracts, rights, shared systems, regulator requirements: the activity must be able to stand without you.',
        de: 'Sie betreiben einen Rechtekatalog oder eine B2B-Abonnentenbasis und erwägen die Veräusserung einer Aktivität. Langfristige Verträge, Rechte, geteilte Systeme, Auflagen der Regulierungsbehörde: die Aktivität muss ohne Sie bestehen können.',
        es: 'Explota un catálogo de derechos o una base de abonados B2B y considera ceder una actividad. Contratos a largo plazo, derechos, sistemas compartidos, exigencias del regulador: la actividad debe poder sostenerse sin usted.',
        it: 'Gestite un catalogo di diritti o una base abbonati B2B e valutate di cedere un\'attività. Contratti di lungo periodo, diritti, sistemi condivisi, requisiti del regolatore: l\'attività deve poter reggere senza di voi.',
        nl: 'U exploiteert een rechtencatalogus of een B2B-abonneebasis en overweegt een activiteit af te stoten. Langetermijncontracten, rechten, gedeelde systemen, eisen van de toezichthouder: de activiteit moet zonder u kunnen bestaan.',
      },
      problems: [
        {
          fr: 'Dossier côté vendeur : droits, contrats long terme, clauses de changement de contrôle, conformité sectorielle (OFCOM en Suisse, BEREC dans l\'UE) → revue et liste des corrections.',
          en: 'Vendor-side file: rights, long-term contracts, change-of-control clauses, sector compliance (OFCOM in Switzerland, BEREC in the EU) → review and list of corrections.',
          de: 'Verkäuferseitiges Dossier: Rechte, langfristige Verträge, Change-of-Control-Klauseln, sektorale Compliance (OFCOM in der Schweiz, BEREC in der EU) → Prüfung und Liste der Korrekturen.',
          es: 'Expediente del lado vendedor: derechos, contratos a largo plazo, cláusulas de cambio de control, cumplimiento sectorial (OFCOM en Suiza, BEREC en la UE) → revisión y lista de correcciones.',
          it: 'Dossier lato venditore: diritti, contratti di lungo periodo, clausole di cambio di controllo, conformità settoriale (OFCOM in Svizzera, BEREC nell\'UE) → revisione e lista delle correzioni.',
          nl: 'Dossier aan verkoperszijde: rechten, langetermijncontracten, change-of-control-clausules, sectorale compliance (OFCOM in Zwitserland, BEREC in de EU) → beoordeling en lijst van correcties.',
        },
        {
          fr: 'Séparation de l\'activité cédée : systèmes, personnes, accords de transition → plan de séparation.',
          en: 'Separation of the divested activity: systems, people, transition agreements → separation plan.',
          de: 'Abspaltung der veräusserten Aktivität: Systeme, Personen, Übergangsvereinbarungen → Separationsplan.',
          es: 'Separación de la actividad cedida: sistemas, personas, acuerdos de transición → plan de separación.',
          it: 'Separazione dell\'attività ceduta: sistemi, persone, accordi di transizione → piano di separazione.',
          nl: 'Afsplitsing van de verkochte activiteit: systemen, mensen, overgangsafspraken → afsplitsingsplan.',
        },
        {
          fr: 'Équipe de direction : successeurs, montée en responsabilité → plan sur 24 mois.',
          en: 'Leadership team: successors, stepping up in responsibility → 24-month plan.',
          de: 'Führungsteam: Nachfolger, Verantwortungsübernahme → 24-Monats-Plan.',
          es: 'Equipo de dirección: sucesores, ascenso en responsabilidad → plan a 24 meses.',
          it: 'Team dirigenziale: successori, crescita in responsabilità → piano a 24 mesi.',
          nl: 'Directieteam: opvolgers, groei in verantwoordelijkheid → 24-maandenplan.',
        },
      ],
    },
  ],
  segmentsFootnote: {
    fr: 'L\'exécution de la transaction reste confiée à votre banque d\'affaires ou à vos avocats.',
    en: 'Execution of the transaction remains with your investment bank or your lawyers.',
    de: 'Die Ausführung der Transaktion bleibt Ihrer Investmentbank oder Ihren Anwälten überlassen.',
    es: 'La ejecución de la transacción queda en manos de su banca de negocios o de sus abogados.',
    it: 'L\'esecuzione della transazione resta affidata alla vostra banca d\'affari o ai vostri avvocati.',
    nl: 'De uitvoering van de transactie blijft bij uw zakenbank of uw advocaten.',
  },
  articleSlugs: [
    'valoriser-application-mobile-cession',
    'marche-ma-tech-europe-q4-2026',
    'commerce-services-experience-client-capital-donnees-2025',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   5. TECH, INNOVATION & SECTEUR PUBLIC
   ════════════════════════════════════════════════════════════════════ */
const tech: Industry = {
  slug:      'tech-innovation-secteur-public',
  clusterId: 'tech',
  name: {
    fr: 'Tech, Innovation & Secteur Public',
    en: 'Tech, Innovation & Public Sector',
    de: 'Tech, Innovation & öffentlicher Sektor',
    es: 'Tech, Innovación y Sector Público',
    it: 'Tech, Innovazione & Settore Pubblico',
    nl: 'Tech, Innovatie & Publieke Sector',
  },
  img: '/images/industries/theme_AI.webp',
  imgAlt: {
    fr: 'Tech, Innovation & Secteur Public — Aegryn',
    en: 'Tech, Innovation & Public Sector — Aegryn',
    de: 'Tech, Innovation & öffentlicher Sektor — Aegryn',
    es: 'Tech, Innovación y Sector Público — Aegryn',
    it: 'Tech, Innovazione & Settore Pubblico — Aegryn',
    nl: 'Tech, Innovatie & Publieke Sector — Aegryn',
  },
  vision: {
    fr: `Les organisations technologiques et innovantes font face à un paradoxe structurel : une valeur intrinsèque élevée mais souvent indéfendable face aux investisseurs et régulateurs. Leur capital repose sur des actifs immatériels — code, données, algorithmes, équipes — dont la documentation est insuffisante.

La Certification CIFSO 5000 résout ce paradoxe en fournissant une évaluation indépendante sur 5 dimensions adaptée aux réalités des SaaS, de l'IA et du secteur public numérique.`,
    en: `Technology and innovation organisations face a structural paradox: high intrinsic value that is often indefensible to investors and regulators. Their capital rests on intangible assets — code, data, algorithms, teams — whose documentation is insufficient.

CIFSO 5000 Certification resolves this paradox by providing an independent 5-dimension assessment adapted to the realities of SaaS, AI and the digital public sector.`,
    de: `Technologie- und Innovationsorganisationen stehen vor einem strukturellen Paradox: ein hoher intrinsischer Wert, der gegenüber Investoren und Regulatoren oft nicht verteidigbar ist. Ihr Kapital beruht auf immateriellen Vermögenswerten — Code, Daten, Algorithmen, Teams — deren Dokumentation unzureichend ist.

Die CIFSO-5000-Zertifizierung löst dieses Paradox mit einer unabhängigen Bewertung über 5 Dimensionen, angepasst an die Realitäten von SaaS, KI und dem digitalen öffentlichen Sektor.`,
    es: `Las organizaciones tecnológicas e innovadoras se enfrentan a una paradoja estructural: un valor intrínseco elevado pero a menudo indefendible ante inversores y reguladores. Su capital descansa en activos intangibles — código, datos, algoritmos, equipos — cuya documentación es insuficiente.

La Certificación CIFSO 5000 resuelve esta paradoja proporcionando una evaluación independiente en 5 dimensiones adaptada a las realidades del SaaS, la IA y el sector público digital.`,
    it: `Le organizzazioni tecnologiche e innovative affrontano un paradosso strutturale: un valore intrinseco elevato ma spesso indifendibile di fronte a investitori e regolatori. Il loro capitale si fonda su asset immateriali — codice, dati, algoritmi, team — la cui documentazione è insufficiente.

La Certificazione CIFSO 5000 risolve questo paradosso fornendo una valutazione indipendente su 5 dimensioni, adattata alle realtà del SaaS, dell'IA e del settore pubblico digitale.`,
    nl: `Technologie- en innovatieorganisaties staan voor een structurele paradox: een hoge intrinsieke waarde die vaak onverdedigbaar is tegenover investeerders en toezichthouders. Hun kapitaal berust op immateriële activa — code, data, algoritmen, teams — waarvan de documentatie onvoldoende is.

De CIFSO 5000-certificering lost deze paradox op met een onafhankelijke beoordeling over 5 dimensies, afgestemd op de realiteit van SaaS, AI en de digitale publieke sector.`,
  },
  keyMetrics: [
    { value: '131 Mrd EUR', label: {
      fr: 'investissement VC tech Europe 2023 (Atomico State of European Tech 2023)',
      en: 'tech VC investment Europe 2023 (Atomico State of European Tech 2023)',
      de: 'Tech-VC-Investitionen Europa 2023 (Atomico State of European Tech 2023)',
      es: 'inversión VC tech Europa 2023 (Atomico State of European Tech 2023)',
      it: 'investimenti VC tech Europa 2023 (Atomico State of European Tech 2023)',
      nl: 'tech-VC-investeringen Europa 2023 (Atomico State of European Tech 2023)',
    }},
    { value: '52 Mrd EUR', label: {
      fr: 'M&A software & SaaS Europe 2023 (Refinitiv / Dealroom)',
      en: 'software & SaaS M&A Europe 2023 (Refinitiv / Dealroom)',
      de: 'Software- & SaaS-M&A Europa 2023 (Refinitiv / Dealroom)',
      es: 'M&A software y SaaS Europa 2023 (Refinitiv / Dealroom)',
      it: 'M&A software e SaaS Europa 2023 (Refinitiv / Dealroom)',
      nl: 'software- & SaaS-M&A Europa 2023 (Refinitiv / Dealroom)',
    }},
    { value: '4,5x ARR', label: {
      fr: 'multiple médian SaaS B2B Europe mid-market 2024 (SaaS Capital 2024)',
      en: 'median B2B SaaS multiple Europe mid-market 2024 (SaaS Capital 2024)',
      de: 'medianes B2B-SaaS-Multiple Europa Mid-Market 2024 (SaaS Capital 2024)',
      es: 'múltiple mediano SaaS B2B Europa mid-market 2024 (SaaS Capital 2024)',
      it: 'multiplo mediano SaaS B2B Europa mid-market 2024 (SaaS Capital 2024)',
      nl: 'mediaan B2B-SaaS-multiple Europa mid-market 2024 (SaaS Capital 2024)',
    }},
    { value: '41 Mrd EUR', label: {
      fr: 'marché cloud souverain Europe 2028 estimé (IDC / Gartner 2024)',
      en: 'estimated sovereign cloud market Europe 2028 (IDC / Gartner 2024)',
      de: 'geschätzter Sovereign-Cloud-Markt Europa 2028 (IDC / Gartner 2024)',
      es: 'mercado estimado de cloud soberano Europa 2028 (IDC / Gartner 2024)',
      it: 'mercato stimato del cloud sovrano Europa 2028 (IDC / Gartner 2024)',
      nl: 'geschatte soevereine-cloudmarkt Europa 2028 (IDC / Gartner 2024)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/coding-screen.jpg',
      name: {
        fr: 'Technologie & SaaS',
        en: 'Technology & SaaS',
        de: 'Technologie & SaaS',
        es: 'Tecnología y SaaS',
        it: 'Tecnologia & SaaS',
        nl: 'Technologie & SaaS',
      },
      tag: {
        fr: 'Coeur de métier', en: 'Core business', de: 'Kerngeschäft',
        es: 'Core business',    it: 'Core business', nl: 'Kernactiviteit',
      },
      desc: {
        fr: 'Multiples ARR, métriques SaaS (NRR, churn, LTV/CAC), scalabilité et dette technique.',
        en: 'ARR multiples, SaaS metrics (NRR, churn, LTV/CAC), scalability and technical debt.',
        de: 'ARR-Multiples, SaaS-Kennzahlen (NRR, Churn, LTV/CAC), Skalierbarkeit und technische Schulden.',
        es: 'Múltiplos ARR, métricas SaaS (NRR, churn, LTV/CAC), escalabilidad y deuda técnica.',
        it: 'Multipli ARR, metriche SaaS (NRR, churn, LTV/CAC), scalabilità e debito tecnico.',
        nl: 'ARR-multiples, SaaS-metrics (NRR, churn, LTV/CAC), schaalbaarheid en technische schuld.',
      },
    },
    {
      img: '/images/industries/sector-education.jpg',
      name: {
        fr: 'Éducation & EdTech',
        en: 'Education & EdTech',
        de: 'Bildung & EdTech',
        es: 'Educación y EdTech',
        it: 'Istruzione & EdTech',
        nl: 'Onderwijs & EdTech',
      },
      tag: {
        fr: 'Croissance', en: 'Growth', de: 'Wachstum',
        es: 'Crecimiento', it: 'Crescita', nl: 'Groei',
      },
      desc: {
        fr: 'LMS, IA pédagogique, marchés B2B/B2G et modèles freemium à monétisation mixte.',
        en: 'LMS, educational AI, B2B/B2G markets and freemium models with mixed monetisation.',
        de: 'LMS, Bildungs-KI, B2B-/B2G-Märkte und Freemium-Modelle mit gemischter Monetarisierung.',
        es: 'LMS, IA pedagógica, mercados B2B/B2G y modelos freemium de monetización mixta.',
        it: 'LMS, IA pedagogica, mercati B2B/B2G e modelli freemium a monetizzazione mista.',
        nl: 'LMS, educatieve AI, B2B-/B2G-markten en freemium-modellen met gemengde monetisatie.',
      },
    },
    {
      img: '/images/industries/sector-govtech.jpg',
      name: {
        fr: 'GovTech & Secteur Public',
        en: 'GovTech & Public Sector',
        de: 'GovTech & öffentlicher Sektor',
        es: 'GovTech y Sector Público',
        it: 'GovTech & Settore Pubblico',
        nl: 'GovTech & Publieke Sector',
      },
      tag: {
        fr: 'Souveraineté', en: 'Sovereignty', de: 'Souveränität',
        es: 'Soberanía',    it: 'Sovranità', nl: 'Soevereiniteit',
      },
      desc: {
        fr: 'Marchés publics, conformité DINUM/ANSSI, cloud souverain et interopérabilité.',
        en: 'Public procurement, DINUM/ANSSI compliance, sovereign cloud and interoperability.',
        de: 'Öffentliche Aufträge, DINUM-/ANSSI-Compliance, souveräne Cloud und Interoperabilität.',
        es: 'Contratación pública, cumplimiento DINUM/ANSSI, cloud soberano e interoperabilidad.',
        it: 'Appalti pubblici, conformità DINUM/ANSSI, cloud sovrano e interoperabilità.',
        nl: 'Overheidsopdrachten, DINUM-/ANSSI-compliance, soevereine cloud en interoperabiliteit.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Évaluation indépendante des actifs SaaS et IA sur les 5 dimensions CIFSO — métriques ARR/NRR, gouvernance IP, architecture et organisation — base certifiée défendable face à tout investisseur, acquéreur ou régulateur.',
        en: 'Independent assessment of SaaS and AI assets across the 5 CIFSO dimensions — ARR/NRR metrics, IP governance, architecture and organisation — a certified basis defensible to any investor, acquirer or regulator.',
        de: 'Unabhängige Bewertung von SaaS- und KI-Assets über die 5 CIFSO-Dimensionen — ARR-/NRR-Kennzahlen, IP-Governance, Architektur und Organisation — eine zertifizierte Basis, die gegenüber jedem Investor, Käufer oder Regulator Bestand hat.',
        es: 'Evaluación independiente de los activos SaaS e IA en las 5 dimensiones CIFSO — métricas ARR/NRR, gobernanza de IP, arquitectura y organización — base certificada defendible ante cualquier inversor, comprador o regulador.',
        it: 'Valutazione indipendente degli asset SaaS e IA sulle 5 dimensioni CIFSO — metriche ARR/NRR, governance IP, architettura e organizzazione — base certificata difendibile verso qualsiasi investitore, acquirente o regolatore.',
        nl: 'Onafhankelijke beoordeling van SaaS- en AI-activa over de 5 CIFSO-dimensies — ARR/NRR-metrics, IP-governance, architectuur en organisatie — een gecertificeerde basis die verdedigbaar is tegenover elke investeerder, koper of toezichthouder.',
      },
    },
    {
      title: {
        fr: 'Conseil en Technologie',
        en: 'Technology Advisory',
        de: 'Technologieberatung',
        es: 'Consultoría Tecnológica',
        it: 'Consulenza Tecnologica',
        nl: 'Technologieadvies',
      },
      desc: {
        fr: 'Architecture SaaS multi-tenant, migration cloud souverain européen, réduction de la dette technique avant cession et conformité AI Act / NIS2 pour les organisations technologiques.',
        en: 'Multi-tenant SaaS architecture, European sovereign cloud migration, technical debt reduction before sale and AI Act / NIS2 compliance for technology organisations.',
        de: 'Multi-Tenant-SaaS-Architektur, Migration in souveräne europäische Clouds, Abbau technischer Schulden vor dem Verkauf und AI-Act-/NIS2-Compliance für Technologieorganisationen.',
        es: 'Arquitectura SaaS multi-tenant, migración a cloud soberano europeo, reducción de la deuda técnica antes de la venta y cumplimiento AI Act / NIS2 para organizaciones tecnológicas.',
        it: 'Architettura SaaS multi-tenant, migrazione verso cloud sovrano europeo, riduzione del debito tecnico prima della cessione e conformità AI Act / NIS2 per le organizzazioni tecnologiche.',
        nl: 'Multi-tenant SaaS-architectuur, migratie naar Europese soevereine cloud, afbouw van technische schuld vóór verkoop en AI-Act-/NIS2-compliance voor technologieorganisaties.',
      },
    },
    {
      title: {
        fr: 'Solutions sur-mesure',
        en: 'Custom Solutions',
        de: 'Massgeschneiderte Lösungen',
        es: 'Soluciones a medida',
        it: 'Soluzioni su misura',
        nl: 'Maatwerkoplossingen',
      },
      desc: {
        fr: 'Développement de produits SaaS B2B, plateformes IA propriétaires certifiables et systèmes GovTech adaptés aux contraintes d\'interopérabilité et de souveraineté du secteur public.',
        en: 'B2B SaaS product development, certifiable proprietary AI platforms and GovTech systems adapted to public sector interoperability and sovereignty constraints.',
        de: 'Entwicklung von B2B-SaaS-Produkten, zertifizierbare proprietäre KI-Plattformen und GovTech-Systeme, angepasst an Interoperabilitäts- und Souveränitätsanforderungen des öffentlichen Sektors.',
        es: 'Desarrollo de productos SaaS B2B, plataformas de IA propietarias certificables y sistemas GovTech adaptados a las exigencias de interoperabilidad y soberanía del sector público.',
        it: 'Sviluppo di prodotti SaaS B2B, piattaforme IA proprietarie certificabili e sistemi GovTech adattati ai vincoli di interoperabilità e sovranità del settore pubblico.',
        nl: 'Ontwikkeling van B2B-SaaS-producten, certificeerbare propriëtaire AI-platforms en GovTech-systemen afgestemd op de interoperabiliteits- en soevereiniteitseisen van de publieke sector.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Préparation à la cession SaaS ou IA, valorisation et documentation des métriques (ARR, NRR, churn, LTV/CAC), constitution data room et accompagnement du closing avec fonds PE ou acquéreur stratégique.',
        en: 'Preparation for SaaS or AI sale, valuation and documentation of metrics (ARR, NRR, churn, LTV/CAC), data room buildout and closing support with PE funds or strategic acquirers.',
        de: 'Vorbereitung auf den SaaS- oder KI-Verkauf, Bewertung und Dokumentation der Kennzahlen (ARR, NRR, Churn, LTV/CAC), Datenraum-Aufbau und Closing-Begleitung mit PE-Fonds oder strategischen Käufern.',
        es: 'Preparación para la venta SaaS o IA, valoración y documentación de las métricas (ARR, NRR, churn, LTV/CAC), constitución del data room y acompañamiento del cierre con fondos PE o compradores estratégicos.',
        it: 'Preparazione alla cessione SaaS o IA, valorizzazione e documentazione delle metriche (ARR, NRR, churn, LTV/CAC), costituzione della data room e supporto al closing con fondi PE o acquirenti strategici.',
        nl: 'Voorbereiding op SaaS- of AI-verkoop, waardering en documentatie van metrics (ARR, NRR, churn, LTV/CAC), opbouw van de dataroom en closing-begeleiding met PE-fondsen of strategische kopers.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'Fondateurs SaaS & scale-ups tech',
        en: 'SaaS founders & tech scale-ups',
        de: 'SaaS-Gründer & Tech-Scale-ups',
        es: 'Fundadores SaaS y scale-ups tech',
        it: 'Fondatori SaaS & scale-up tech',
        nl: 'SaaS-oprichters & tech-scale-ups',
      },
      story: {
        fr: 'Vous avez construit un SaaS B2B avec de solides métriques ARR. Un fonds PE ou un acquéreur stratégique entre en process. Ils demandent une certification indépendante de vos métriques, de votre gouvernance IP et de votre architecture avant d\'engager leurs équipes juridiques. Vous avez 90 jours.',
        en: 'You have built a B2B SaaS with solid ARR metrics. A PE fund or strategic acquirer has entered the process. They require independent certification of your metrics, IP governance and architecture before engaging their legal teams. You have 90 days.',
        de: 'Sie haben ein B2B-SaaS mit soliden ARR-Kennzahlen aufgebaut. Ein PE-Fonds oder strategischer Käufer ist in den Prozess eingestiegen. Sie verlangen eine unabhängige Zertifizierung Ihrer Kennzahlen, IP-Governance und Architektur, bevor sie ihre Rechtsteams einschalten. Sie haben 90 Tage.',
        es: 'Ha construido un SaaS B2B con métricas ARR sólidas. Un fondo PE o un comprador estratégico ha entrado en el proceso. Exigen una certificación independiente de sus métricas, su gobernanza de IP y su arquitectura antes de movilizar sus equipos jurídicos. Tiene 90 días.',
        it: 'Avete costruito un SaaS B2B con solide metriche ARR. Un fondo PE o un acquirente strategico è entrato nel processo. Richiedono una certificazione indipendente delle metriche, della governance IP e dell\'architettura prima di coinvolgere i team legali. Avete 90 giorni.',
        nl: 'U heeft een B2B-SaaS opgebouwd met solide ARR-metrics. Een PE-fonds of strategische koper is in het proces gestapt. Ze eisen een onafhankelijke certificering van uw metrics, IP-governance en architectuur voordat ze hun juridische teams inschakelen. U heeft 90 dagen.',
      },
      problems: [
        {
          fr: 'Certifier et défendre les métriques NRR, churn et LTV/CAC face à un acquéreur PE exigeant',
          en: 'Certify and defend NRR, churn and LTV/CAC metrics to a demanding PE acquirer',
          de: 'NRR-, Churn- und LTV/CAC-Kennzahlen gegenüber einem anspruchsvollen PE-Käufer zertifizieren und verteidigen',
          es: 'Certificar y defender las métricas NRR, churn y LTV/CAC ante un comprador PE exigente',
          it: 'Certificare e difendere le metriche NRR, churn e LTV/CAC di fronte a un acquirente PE esigente',
          nl: 'NRR-, churn- en LTV/CAC-metrics certificeren en verdedigen tegenover een veeleisende PE-koper',
        },
        {
          fr: 'Documenter la propriété du code, des algorithmes et des données en actifs IP certifiés',
          en: 'Document ownership of code, algorithms and data as certified IP assets',
          de: 'Das Eigentum an Code, Algorithmen und Daten als zertifizierte IP-Assets dokumentieren',
          es: 'Documentar la propiedad del código, los algoritmos y los datos como activos de IP certificados',
          it: 'Documentare la proprietà di codice, algoritmi e dati come asset IP certificati',
          nl: 'Het eigendom van code, algoritmen en data documenteren als gecertificeerde IP-activa',
        },
        {
          fr: 'Préparer une data room complète et défendable dans les délais d\'un process M&A SaaS',
          en: 'Prepare a complete, defensible data room within SaaS M&A process timelines',
          de: 'Einen vollständigen, belastbaren Datenraum innerhalb der Fristen eines SaaS-M&A-Prozesses vorbereiten',
          es: 'Preparar un data room completo y defendible dentro de los plazos de un proceso M&A SaaS',
          it: 'Preparare una data room completa e difendibile entro i tempi di un processo M&A SaaS',
          nl: 'Een volledige, verdedigbare dataroom voorbereiden binnen de termijnen van een SaaS-M&A-proces',
        },
      ],
    },
    {
      label: {
        fr: 'Fonds venture & growth',
        en: 'Venture & growth funds',
        de: 'Venture- & Growth-Fonds',
        es: 'Fondos venture y growth',
        it: 'Fondi venture & growth',
        nl: 'Venture- & growth-fondsen',
      },
      story: {
        fr: 'Vous gérez un portefeuille de SaaS B2B européens. Sur plusieurs participations, les métriques déclarées sont difficiles à auditer indépendamment et la gouvernance IP est insuffisamment documentée. Vous préparez un exit secondaire ou un tour de table et avez besoin d\'une base certifiée.',
        en: 'You manage a portfolio of European B2B SaaS companies. Across several holdings, reported metrics are difficult to audit independently and IP governance is insufficiently documented. You are preparing a secondary exit or a funding round and need a certified basis.',
        de: 'Sie verwalten ein Portfolio europäischer B2B-SaaS-Unternehmen. Bei mehreren Beteiligungen sind die gemeldeten Kennzahlen schwer unabhängig zu auditieren und die IP-Governance ist unzureichend dokumentiert. Sie bereiten einen Secondary Exit oder eine Finanzierungsrunde vor und benötigen eine zertifizierte Basis.',
        es: 'Gestiona una cartera de SaaS B2B europeos. En varias participaciones, las métricas declaradas son difíciles de auditar de forma independiente y la gobernanza de IP está insuficientemente documentada. Prepara un exit secundario o una ronda de financiación y necesita una base certificada.',
        it: 'Gestite un portafoglio di SaaS B2B europei. In diverse partecipazioni, le metriche dichiarate sono difficili da verificare in modo indipendente e la governance IP è insufficientemente documentata. State preparando un exit secondario o un round e avete bisogno di una base certificata.',
        nl: 'U beheert een portefeuille van Europese B2B-SaaS-bedrijven. Bij meerdere deelnemingen zijn gerapporteerde metrics moeilijk onafhankelijk te auditen en is IP-governance onvoldoende gedocumenteerd. U bereidt een secundaire exit of financieringsronde voor en heeft een gecertificeerde basis nodig.',
      },
      problems: [
        {
          fr: 'Vérifier indépendamment la qualité et la robustesse des métriques SaaS d\'une participation',
          en: 'Independently verify the quality and robustness of a holding\'s SaaS metrics',
          de: 'Qualität und Robustheit der SaaS-Kennzahlen einer Beteiligung unabhängig verifizieren',
          es: 'Verificar independientemente la calidad y robustez de las métricas SaaS de una participación',
          it: 'Verificare in modo indipendente qualità e robustezza delle metriche SaaS di una partecipazione',
          nl: 'De kwaliteit en robuustheid van de SaaS-metrics van een deelneming onafhankelijk verifiëren',
        },
        {
          fr: 'Documenter et certifier la gouvernance et l\'architecture avant une levée de fond série B ou C',
          en: 'Document and certify governance and architecture before a Series B or C round',
          de: 'Governance und Architektur vor einer Series-B- oder -C-Runde dokumentieren und zertifizieren',
          es: 'Documentar y certificar la gobernanza y la arquitectura antes de una ronda serie B o C',
          it: 'Documentare e certificare governance e architettura prima di un round Serie B o C',
          nl: 'Governance en architectuur documenteren en certificeren vóór een Series-B- of -C-ronde',
        },
        {
          fr: 'Préparer les conditions d\'un exit secondaire ou d\'un processus dual-track dans les meilleures conditions',
          en: 'Prepare optimal conditions for a secondary exit or a dual-track process',
          de: 'Die besten Bedingungen für einen Secondary Exit oder einen Dual-Track-Prozess vorbereiten',
          es: 'Preparar las mejores condiciones para un exit secundario o un proceso dual-track',
          it: 'Preparare le migliori condizioni per un exit secondario o un processo dual-track',
          nl: 'De beste voorwaarden voorbereiden voor een secundaire exit of een dual-track-proces',
        },
      ],
    },
    {
      label: {
        fr: 'Acteurs GovTech & EdTech',
        en: 'GovTech & EdTech players',
        de: 'GovTech- & EdTech-Akteure',
        es: 'Actores GovTech y EdTech',
        it: 'Operatori GovTech & EdTech',
        nl: 'GovTech- & EdTech-spelers',
      },
      story: {
        fr: 'Vous opérez une plateforme numérique pour le secteur public ou l\'éducation. Un marché public exige une certification cloud souverain, un partenaire industriel veut fusionner et une administration régionale envisage une reprise partielle. Chaque scénario exige une documentation différente mais toutes reposent sur les mêmes actifs.',
        en: 'You operate a digital platform for the public sector or education. A public tender requires sovereign cloud certification, an industrial partner wants to merge and a regional administration is considering a partial takeover. Each scenario requires different documentation but all rest on the same assets.',
        de: 'Sie betreiben eine digitale Plattform für den öffentlichen Sektor oder die Bildung. Eine öffentliche Ausschreibung verlangt eine Sovereign-Cloud-Zertifizierung, ein industrieller Partner will fusionieren und eine Regionalverwaltung erwägt eine Teilübernahme. Jedes Szenario erfordert andere Dokumentation, aber alle beruhen auf denselben Assets.',
        es: 'Opera una plataforma digital para el sector público o la educación. Una licitación pública exige una certificación de cloud soberano, un socio industrial quiere fusionarse y una administración regional considera una toma parcial. Cada escenario exige una documentación diferente, pero todas descansan sobre los mismos activos.',
        it: 'Operate una piattaforma digitale per il settore pubblico o l\'istruzione. Un appalto pubblico richiede una certificazione di cloud sovrano, un partner industriale vuole fondersi e un\'amministrazione regionale valuta un\'acquisizione parziale. Ogni scenario richiede documentazione diversa, ma tutti si fondano sugli stessi asset.',
        nl: 'U exploiteert een digitaal platform voor de publieke sector of het onderwijs. Een overheidsaanbesteding eist een soevereine-cloudcertificering, een industriële partner wil fuseren en een regionale overheid overweegt een gedeeltelijke overname. Elk scenario vereist andere documentatie, maar alle berusten op dezelfde activa.',
      },
      problems: [
        {
          fr: 'Certifier la conformité cloud souverain DINUM/ANSSI pour l\'éligibilité aux marchés publics',
          en: 'Certify DINUM/ANSSI sovereign cloud compliance for public tender eligibility',
          de: 'DINUM-/ANSSI-Sovereign-Cloud-Compliance für die Zulassung zu öffentlichen Ausschreibungen zertifizieren',
          es: 'Certificar el cumplimiento de cloud soberano DINUM/ANSSI para la elegibilidad a licitaciones públicas',
          it: 'Certificare la conformità cloud sovrano DINUM/ANSSI per l\'ammissibilità agli appalti pubblici',
          nl: 'DINUM-/ANSSI-soevereine-cloudcompliance certificeren voor toelating tot overheidsaanbestedingen',
        },
        {
          fr: 'Documenter l\'organisation et la gouvernance avant une fusion ou un rapprochement inter-acteurs',
          en: 'Document organisation and governance before a merger or inter-player consolidation',
          de: 'Organisation und Governance vor einer Fusion oder einem Zusammenschluss zwischen Akteuren dokumentieren',
          es: 'Documentar la organización y la gobernanza antes de una fusión o agrupación entre actores',
          it: 'Documentare organizzazione e governance prima di una fusione o aggregazione tra operatori',
          nl: 'Organisatie en governance documenteren vóór een fusie of samenvoeging tussen spelers',
        },
        {
          fr: 'Valoriser un actif numérique public ou parapublic dans un contexte de privatisation ou de spin-off',
          en: 'Value a public or semi-public digital asset in a privatisation or spin-off context',
          de: 'Ein öffentliches oder halböffentliches digitales Asset im Kontext einer Privatisierung oder Ausgliederung bewerten',
          es: 'Valorizar un activo digital público o parapúblico en un contexto de privatización o spin-off',
          it: 'Valorizzare un asset digitale pubblico o parapubblico in un contesto di privatizzazione o spin-off',
          nl: 'Een publiek of semi-publiek digitaal actief waarderen in een context van privatisering of spin-off',
        },
      ],
    },
  ],
  articleSlugs: [
    'ai-native-saas-valorisation-multiples-2026',
    'nrr-churn-ltv-cac-metriques-valorisation-saas',
    'tech-innovation-secteur-public-certification-saas-ia-2025',
  ],
}

export const INDUSTRIES: Industry[] = [
  finance,
  sante,
  industrie,
  commerce,
  tech,
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}

export function getOtherIndustries(slug: string): Industry[] {
  return INDUSTRIES.filter(i => i.slug !== slug)
}
