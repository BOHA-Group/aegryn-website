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
    fr: 'Finance & Capital | Aegryn',
    en: 'Finance & Capital | Aegryn',
    de: 'Finanzen & Kapital | Aegryn',
    es: 'Finanzas y Capital | Aegryn',
    it: 'Finanza & Capitale | Aegryn',
    nl: 'Financiën & Kapitaal | Aegryn',
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
    fr: 'Santé & Sciences de la Vie | Aegryn',
    en: 'Health & Life Sciences | Aegryn',
    de: 'Gesundheit & Life Sciences | Aegryn',
    es: 'Salud y Ciencias de la Vida | Aegryn',
    it: 'Salute & Scienze della Vita | Aegryn',
    nl: 'Gezondheid & Life Sciences | Aegryn',
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
      img: '/images/industries/sector-biotech-lab.jpg',
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
    fr: 'Industrie, Énergie & Infrastructure | Aegryn',
    en: 'Industry, Energy & Infrastructure | Aegryn',
    de: 'Industrie, Energie & Infrastruktur | Aegryn',
    es: 'Industria, Energía e Infraestructura | Aegryn',
    it: 'Industria, Energia & Infrastrutture | Aegryn',
    nl: 'Industrie, Energie & Infrastructuur | Aegryn',
  },
  vision: {
    fr: `Les organisations industrielles, énergétiques et d'infrastructure reposent sur des actifs que les bilans montrent mal : savoir-faire opérationnel, contrats de long terme, réseaux de sous-traitants stratégiques, dépendance à quelques personnes clés. Leur robustesse décide de leur capacité à investir, à se financer et à se transmettre.

Trois enjeux reviennent à chaque cycle : la transition énergétique et numérique des sites, la sécurité et la résilience des systèmes d'exploitation (NIS2), et la relève des dirigeants et des détenteurs de savoir-faire. Qu'il s'agisse d'ouvrir un site, de changer d'échelle, de redresser une activité, de reprendre un concurrent ou de transmettre l'entreprise, Aegryn aide à décider, puis pilote le projet avec vos équipes d'exploitation, de technologie et de direction, jusqu'à sa mise en œuvre.`,
    en: `Industrial, energy and infrastructure organisations rest on assets that balance sheets barely show: operational know-how, long-term contracts, networks of strategic subcontractors, dependency on a few key people. Their robustness decides their capacity to invest, to raise financing and to be transferred.

Three issues return at every cycle: the energy and digital transition of sites, the security and resilience of operating systems (NIS2), and the succession of leaders and know-how holders. Whether opening a site, scaling up, turning around an activity, acquiring a competitor or transferring the company, Aegryn helps decide, then steers the project with your operations, technology and leadership teams through to implementation.`,
    de: `Industrie-, Energie- und Infrastrukturorganisationen ruhen auf Vermögenswerten, die Bilanzen kaum zeigen: operatives Know-how, langfristige Verträge, Netzwerke strategischer Zulieferer, Abhängigkeit von wenigen Schlüsselpersonen. Ihre Robustheit entscheidet über ihre Fähigkeit zu investieren, sich zu finanzieren und übertragen zu werden.

Drei Themen kehren in jedem Zyklus wieder: die energetische und digitale Transformation der Standorte, die Sicherheit und Resilienz der Betriebssysteme (NIS2) und die Nachfolge von Führungskräften und Know-how-Trägern. Ob ein Standort eröffnet, die Grösse geändert, ein Geschäft saniert, ein Wettbewerber übernommen oder das Unternehmen übergeben wird: Aegryn hilft entscheiden und steuert das Projekt dann mit Ihren Betriebs-, Technologie- und Geschäftsleitungsteams bis zur Umsetzung.`,
    es: `Las organizaciones industriales, energéticas y de infraestructura descansan sobre activos que los balances apenas muestran: saber hacer operativo, contratos a largo plazo, redes de subcontratistas estratégicos, dependencia de unas pocas personas clave. Su robustez decide su capacidad de invertir, financiarse y transmitirse.

Tres cuestiones reaparecen en cada ciclo: la transición energética y digital de los sitios, la seguridad y resiliencia de los sistemas de explotación (NIS2), y el relevo de los dirigentes y depositarios del saber hacer. Ya se trate de abrir un sitio, cambiar de escala, enderezar una actividad, adquirir un competidor o transmitir la empresa, Aegryn ayuda a decidir y luego pilota el proyecto con sus equipos de explotación, tecnología y dirección hasta su ejecución.`,
    it: `Le organizzazioni industriali, energetiche e delle infrastrutture poggiano su asset che i bilanci mostrano poco: know-how operativo, contratti di lungo periodo, reti di subappaltatori strategici, dipendenza da poche persone chiave. La loro robustezza decide la capacità di investire, finanziarsi e trasmettersi.

Tre temi tornano a ogni ciclo: la transizione energetica e digitale dei siti, la sicurezza e la resilienza dei sistemi operativi (NIS2) e la successione dei dirigenti e dei detentori di know-how. Che si tratti di aprire un sito, cambiare scala, risanare un'attività, rilevare un concorrente o trasmettere l'azienda, Aegryn aiuta a decidere, poi pilota il progetto con i vostri team di operations, tecnologia e direzione fino all'attuazione.`,
    nl: `Industriële, energie- en infrastructuurorganisaties rusten op activa die balansen nauwelijks tonen: operationele knowhow, langetermijncontracten, netwerken van strategische toeleveranciers, afhankelijkheid van enkele sleutelpersonen. Hun robuustheid bepaalt hun vermogen om te investeren, zich te financieren en over te dragen.

Drie thema's keren in elke cyclus terug: de energetische en digitale transitie van sites, de veiligheid en weerbaarheid van bedrijfssystemen (NIS2) en de opvolging van leiders en dragers van knowhow. Of het nu gaat om het openen van een site, van schaal veranderen, een activiteit saneren, een concurrent overnemen of de onderneming overdragen: Aegryn helpt beslissen en stuurt het project vervolgens met uw exploitatie-, technologie- en directieteams tot de uitvoering.`,
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
        fr: 'Industrie 4.0, maintenance prédictive, MES/ERP, normes qualité ISO, reprise de sites et d\'ateliers.',
        en: 'Industry 4.0, predictive maintenance, MES/ERP, ISO quality standards, takeover of sites and workshops.',
        de: 'Industrie 4.0, vorausschauende Wartung, MES/ERP, ISO-Qualitätsnormen, Übernahme von Standorten und Werkstätten.',
        es: 'Industria 4.0, mantenimiento predictivo, MES/ERP, normas de calidad ISO, adquisición de plantas y talleres.',
        it: 'Industria 4.0, manutenzione predittiva, MES/ERP, norme qualità ISO, acquisizione di siti e officine.',
        nl: 'Industrie 4.0, predictief onderhoud, MES/ERP, ISO-kwaliteitsnormen, overname van sites en werkplaatsen.',
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
        fr: 'Visibilité temps réel, optimisation des flux par l\'IA, conformité douanière, 3PL/4PL et contrats récurrents.',
        en: 'Real-time visibility, AI flow optimisation, customs compliance, 3PL/4PL and recurring contracts.',
        de: 'Echtzeit-Transparenz, KI-gestützte Flussoptimierung, Zoll-Compliance, 3PL/4PL und wiederkehrende Verträge.',
        es: 'Visibilidad en tiempo real, optimización de flujos por IA, cumplimiento aduanero, 3PL/4PL y contratos recurrentes.',
        it: 'Visibilità in tempo reale, ottimizzazione dei flussi con l\'IA, conformità doganale, 3PL/4PL e contratti ricorrenti.',
        nl: 'Realtime-zichtbaarheid, AI-gestuurde stroomoptimalisatie, douanecompliance, 3PL/4PL en terugkerende contracten.',
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
        fr: 'Systèmes embarqués, IA de mission, contrôle des exportations, sous-traitants stratégiques et confidentialité des programmes.',
        en: 'Embedded systems, mission AI, export controls, strategic subcontractors and programme confidentiality.',
        de: 'Eingebettete Systeme, Missions-KI, Exportkontrolle, strategische Zulieferer und Programmvertraulichkeit.',
        es: 'Sistemas embarcados, IA de misión, control de exportaciones, subcontratistas estratégicos y confidencialidad de los programas.',
        it: 'Sistemi embedded, IA di missione, controllo delle esportazioni, subappaltatori strategici e riservatezza dei programmi.',
        nl: 'Embedded systemen, missie-AI, exportcontrole, strategische toeleveranciers en programmavertrouwelijkheid.',
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
        fr: 'IA embarquée, Tier-1/2, électrification et MaaS, opportunités M&A inter-constructeurs.',
        en: 'Embedded AI, Tier-1/2 suppliers, electrification and MaaS, cross-OEM M&A opportunities.',
        de: 'Eingebettete KI, Tier-1/2-Zulieferer, Elektrifizierung und MaaS, M&A-Chancen zwischen Herstellern.',
        es: 'IA embarcada, proveedores Tier-1/2, electrificación y MaaS, oportunidades M&A entre fabricantes.',
        it: 'IA embedded, fornitori Tier-1/2, elettrificazione e MaaS, opportunità M&A tra costruttori.',
        nl: 'Embedded AI, Tier-1/2-leveranciers, elektrificatie en MaaS, M&A-kansen tussen fabrikanten.',
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
        fr: 'Traçabilité, IA de rendement, conformité sanitaire, savoir-faire propriétaires et reprise d\'exploitations.',
        en: 'Traceability, yield AI, sanitary compliance, proprietary know-how and farm takeovers.',
        de: 'Rückverfolgbarkeit, Ertrags-KI, Lebensmittel-Compliance, proprietäres Know-how und Übernahme von Betrieben.',
        es: 'Trazabilidad, IA de rendimiento, cumplimiento sanitario, saber hacer propietario y adquisición de explotaciones.',
        it: 'Tracciabilità, IA per i rendimenti, conformità sanitaria, know-how proprietario e acquisizione di aziende.',
        nl: 'Traceerbaarheid, opbrengst-AI, voedselveiligheidscompliance, propriëtaire knowhow en overname van bedrijven.',
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
        fr: 'Optimisation de flotte, conformité transport, plateformes digitales et rachats d\'opérateurs.',
        en: 'Fleet optimisation, transport compliance, digital platforms and operator acquisitions.',
        de: 'Flottenoptimierung, Transport-Compliance, digitale Plattformen und Übernahmen von Betreibern.',
        es: 'Optimización de flotas, cumplimiento del transporte, plataformas digitales y adquisición de operadores.',
        it: 'Ottimizzazione della flotta, conformità dei trasporti, piattaforme digitali e acquisizione di operatori.',
        nl: 'Vlootoptimalisatie, transportcompliance, digitale platforms en overnames van operators.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Consolidation, transition & modèle industriel',
        en: 'Consolidation, transition & industrial model',
        de: 'Konsolidierung, Transition & industrielles Modell',
        es: 'Consolidación, transición y modelo industrial',
        it: 'Consolidamento, transizione & modello industriale',
        nl: 'Consolidatie, transitie & industrieel model',
      },
      desc: {
        fr: 'Positionnement dans les vagues de consolidation (énergie, logistique, agroalimentaire), choix d\'investissement (site, capacité, électrification), gouvernance dirigeante, planification de la transition industrielle et numérique. Livrable : grille des quatre tests appliquée aux options, et plan à 12-18 mois.',
        en: 'Positioning in consolidation waves (energy, logistics, agri-food), investment choices (site, capacity, electrification), executive governance, planning of industrial and digital transition. Deliverable: four-test grid applied to the options, and a 12-18 month plan.',
        de: 'Positionierung in Konsolidierungswellen (Energie, Logistik, Ernährung), Investitionsentscheide (Standort, Kapazität, Elektrifizierung), Führungs-Governance, Planung der industriellen und digitalen Transformation. Lieferung: Vier-Tests-Raster angewendet auf die Optionen und 12-18-Monats-Plan.',
        es: 'Posicionamiento en las olas de consolidación (energía, logística, agroalimentación), elección de inversiones (planta, capacidad, electrificación), gobernanza directiva, planificación de la transición industrial y digital. Entregable: cuadrícula de las cuatro pruebas aplicada a las opciones y plan a 12-18 meses.',
        it: 'Posizionamento nelle ondate di consolidamento (energia, logistica, agroalimentare), scelte di investimento (sito, capacità, elettrificazione), governance dirigenziale, pianificazione della transizione industriale e digitale. Deliverable: griglia dei quattro test applicata alle opzioni e piano a 12-18 mesi.',
        nl: 'Positionering in consolidatiegolven (energie, logistiek, voeding), investeringskeuzes (site, capaciteit, elektrificatie), directiegovernance, planning van de industriële en digitale transitie. Deliverable: vier-toetsen-raster toegepast op de opties en een 12-18-maandenplan.',
      },
    },
    {
      title: {
        fr: 'Conformité sectorielle & continuité d\'exploitation',
        en: 'Sector compliance & operational continuity',
        de: 'Sektorale Compliance & Betriebskontinuität',
        es: 'Cumplimiento sectorial y continuidad de explotación',
        it: 'Conformità di settore & continuità operativa',
        nl: 'Sectorale compliance & bedrijfscontinuïteit',
      },
      desc: {
        fr: 'Cartographie des exigences applicables (NIS2, EU ETS, REACH, normes ISO, douane et transport, contrôle des exportations), sûreté des sites, continuité d\'exploitation et plan de reprise, préparation aux audits et aux inspections. Livrable : carte « applicable maintenant / bientôt / pas concerné » et plan de remédiation priorisé.',
        en: 'Mapping of applicable requirements (NIS2, EU ETS, REACH, ISO standards, customs and transport, export controls), site security, operational continuity and recovery plan, preparation for audits and inspections. Deliverable: "applies now / soon / not concerned" map and prioritised remediation plan.',
        de: 'Kartierung der anwendbaren Anforderungen (NIS2, EU ETS, REACH, ISO-Normen, Zoll und Transport, Exportkontrolle), Standortsicherheit, Betriebskontinuität und Wiederanlaufplan, Vorbereitung auf Audits und Inspektionen. Lieferung: Karte «jetzt anwendbar / bald / nicht betroffen» und priorisierter Remediationsplan.',
        es: 'Mapeo de los requisitos aplicables (NIS2, EU ETS, REACH, normas ISO, aduanas y transporte, control de exportaciones), seguridad de los sitios, continuidad de explotación y plan de recuperación, preparación para auditorías e inspecciones. Entregable: mapa «aplicable ahora / pronto / no afectado» y plan de remediación priorizado.',
        it: 'Mappatura dei requisiti applicabili (NIS2, EU ETS, REACH, norme ISO, dogane e trasporti, controllo delle esportazioni), sicurezza dei siti, continuità operativa e piano di ripresa, preparazione ad audit e ispezioni. Deliverable: mappa «applicabile ora / presto / non interessati» e piano di remediation prioritizzato.',
        nl: 'In kaart brengen van toepasselijke eisen (NIS2, EU ETS, REACH, ISO-normen, douane en transport, exportcontrole), siteveiligheid, bedrijfscontinuïteit en herstelplan, voorbereiding op audits en inspecties. Deliverable: kaart «nu van toepassing / binnenkort / niet van toepassing» en geprioriteerd herstelplan.',
      },
    },
    {
      title: {
        fr: 'Systèmes industriels, données d\'exploitation & souveraineté',
        en: 'Industrial systems, operational data & sovereignty',
        de: 'Industriesysteme, Betriebsdaten & Souveränität',
        es: 'Sistemas industriales, datos de explotación y soberanía',
        it: 'Sistemi industriali, dati operativi & sovranità',
        nl: 'Industriële systemen, operationele data & soevereiniteit',
      },
      desc: {
        fr: 'Architecture Industrie 4.0, intégration MES/ERP, maintenance prédictive, cybersécurité des systèmes d\'exploitation, intégrateurs et prestataires critiques avec plan de sortie, souveraineté des données industrielles. Outils sur mesure seulement lorsque le marché n\'en propose pas. Livrable : test de réversibilité et arbitrage chiffré.',
        en: 'Industry 4.0 architecture, MES/ERP integration, predictive maintenance, cybersecurity of operating systems, critical integrators and providers with exit plan, sovereignty of industrial data. Custom tools only when the market does not offer them. Deliverable: reversibility test and quantified trade-off.',
        de: 'Industrie-4.0-Architektur, MES-/ERP-Integration, vorausschauende Wartung, Cybersicherheit der Betriebssysteme, kritische Integratoren und Dienstleister mit Exit-Plan, Souveränität der Industriedaten. Massgeschneiderte Tools nur, wenn der Markt keine anbietet. Lieferung: Reversibilitätstest und bezifferte Abwägung.',
        es: 'Arquitectura Industria 4.0, integración MES/ERP, mantenimiento predictivo, ciberseguridad de los sistemas de explotación, integradores y proveedores críticos con plan de salida, soberanía de los datos industriales. Herramientas a medida solo cuando el mercado no las ofrece. Entregable: prueba de reversibilidad y arbitraje cifrado.',
        it: 'Architettura Industria 4.0, integrazione MES/ERP, manutenzione predittiva, cybersicurezza dei sistemi operativi, integratori e fornitori critici con piano di uscita, sovranità dei dati industriali. Strumenti su misura solo quando il mercato non li offre. Deliverable: test di reversibilità e arbitrato quantificato.',
        nl: 'Industrie 4.0-architectuur, MES/ERP-integratie, predictief onderhoud, cyberbeveiliging van bedrijfssystemen, kritieke integratoren en leveranciers met exitplan, soevereiniteit van industriële data. Maatwerk alleen als de markt het niet aanbiedt. Deliverable: omkeerbaarheidstest en onderbouwde afweging.',
      },
    },
    {
      title: {
        fr: 'Savoir-faire, relève & direction d\'exploitation',
        en: 'Know-how, succession & operational leadership',
        de: 'Know-how, Nachfolge & Betriebsleitung',
        es: 'Saber hacer, relevo y dirección de explotación',
        it: 'Know-how, successione & direzione operativa',
        nl: 'Knowhow, opvolging & operationele leiding',
      },
      desc: {
        fr: 'Directeurs de site, responsables qualité et sécurité, directeurs techniques, transfert du savoir-faire des détenteurs clés, succession familiale ou managériale. Livrable : fiche de poste, profils présélectionnés, plan de succession.',
        en: 'Site directors, quality and safety officers, technical directors, transfer of know-how from key holders, family or managerial succession. Deliverable: job description, shortlisted profiles, succession plan.',
        de: 'Standortleiter, Qualitäts- und Sicherheitsverantwortliche, technische Direktoren, Transfer des Know-hows von Schlüsselträgern, familiäre oder managerielle Nachfolge. Lieferung: Stellenprofil, vorausgewählte Profile, Nachfolgeplan.',
        es: 'Directores de planta, responsables de calidad y seguridad, directores técnicos, transferencia del saber hacer de los depositarios clave, sucesión familiar o directiva. Entregable: ficha de puesto, perfiles preseleccionados, plan de sucesión.',
        it: 'Direttori di sito, responsabili qualità e sicurezza, direttori tecnici, trasferimento del know-how dei detentori chiave, successione familiare o manageriale. Deliverable: scheda di posizione, profili preselezionati, piano di successione.',
        nl: 'Sitedirecteuren, kwaliteits- en veiligheidsverantwoordelijken, technisch directeuren, overdracht van knowhow van sleuteldragers, familiale of managementopvolging. Deliverable: functieprofiel, voorgeselecteerde profielen, opvolgingsplan.',
      },
    },
    {
      title: {
        fr: 'Reprise, transmission & cession d\'ETI industrielles',
        en: 'Acquisition, succession & sale of industrial mid-caps',
        de: 'Übernahme, Übergabe & Veräusserung industrieller Mid-Caps',
        es: 'Adquisición, transmisión y venta de ETI industriales',
        it: 'Acquisizione, trasmissione & cessione di mid-cap industriali',
        nl: 'Overname, overdracht & verkoop van industriële midcaps',
      },
      desc: {
        fr: 'Revue d\'une cible avant l\'offre : carnet de commandes, contrats de long terme et clauses de changement de contrôle, état des sites et passif environnemental, dépendance aux sous-traitants et aux personnes clés. Transmission familiale, à un fonds ou à un repreneur industriel, puis intégration. La certification CIFSO 5000 reste possible en appui. Livrable : traitement proposé pour chaque point (prix, garantie, condition suspensive) et plan d\'intégration ou de transmission jalonné. L\'exécution revient à votre banque d\'affaires et à vos avocats.',
        en: 'Review of a target before the offer: order book, long-term contracts and change-of-control clauses, site condition and environmental liabilities, dependency on subcontractors and key people. Family succession, sale to a fund or an industrial buyer, then integration. CIFSO 5000 certification remains available in support. Deliverable: proposed treatment for each point (price, warranty, suspensive condition) and a milestone-based integration or transfer plan. Execution remains with your investment bank and your lawyers.',
        de: 'Prüfung einer Zielgesellschaft vor dem Angebot: Auftragsbestand, langfristige Verträge und Change-of-Control-Klauseln, Zustand der Standorte und Umweltlasten, Abhängigkeit von Zulieferern und Schlüsselpersonen. Familiäre Übergabe, Übergabe an einen Fonds oder einen industriellen Nachfolger, dann Integration. Die CIFSO-5000-Zertifizierung bleibt unterstützend möglich. Lieferung: vorgeschlagene Behandlung für jeden Punkt (Preis, Garantie, aufschiebende Bedingung) und ein Meilensteinplan für Integration oder Übergabe. Die Ausführung obliegt Ihrer Investmentbank und Ihren Anwälten.',
        es: 'Revisión de una empresa objetivo antes de la oferta: cartera de pedidos, contratos a largo plazo y cláusulas de cambio de control, estado de las plantas y pasivo ambiental, dependencia de subcontratistas y personas clave. Transmisión familiar, a un fondo o a un comprador industrial, luego integración. La certificación CIFSO 5000 sigue siendo posible como apoyo. Entregable: tratamiento propuesto para cada punto (precio, garantía, condición suspensiva) y plan de integración o transmisión por hitos. La ejecución corresponde a su banco de inversión y a sus abogados.',
        it: 'Revisione di un target prima dell\'offerta: portafoglio ordini, contratti di lungo periodo e clausole di change of control, stato dei siti e passività ambientali, dipendenza da subappaltatori e persone chiave. Trasmissione familiare, a un fondo o a un acquirente industriale, poi integrazione. La certificazione CIFSO 5000 resta possibile a supporto. Deliverable: trattamento proposto per ogni punto (prezzo, garanzia, condizione sospensiva) e piano di integrazione o trasmissione a tappe. L\'esecuzione spetta alla vostra banca d\'affari e ai vostri avvocati.',
        nl: 'Beoordeling van een doelwit vóór het bod: orderboek, langetermijncontracten en change-of-control-clausules, staat van de sites en milieulasten, afhankelijkheid van toeleveranciers en sleutelpersonen. Familiale overdracht, overdracht aan een fonds of een industriële overnemer, daarna integratie. De CIFSO 5000-certificering blijft ter ondersteuning mogelijk. Deliverable: voorgestelde behandeling voor elk punt (prijs, garantie, opschortende voorwaarde) en een plan voor integratie of overdracht met mijlpalen. De uitvoering komt toe aan uw investeringsbank en uw advocaten.',
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
      icon: 'Factory',
      label: {
        fr: 'ETI & PME industrielles : cycles Croissance et Transmission',
        en: 'Industrial mid-caps & SMEs: Growth and Succession cycles',
        de: 'Industrielle Mid-Caps & KMU: Zyklen Wachstum und Übergabe',
        es: 'ETI y pymes industriales: ciclos Crecimiento y Transmisión',
        it: 'Mid-cap e PMI industriali: cicli Crescita e Trasmissione',
        nl: 'Industriële midcaps & mkb: cycli Groei en Overdracht',
      },
      story: {
        fr: 'Vous dirigez une ETI industrielle en Suisse ou en Europe. La transmission approche : familiale, à un fonds ou à un repreneur industriel. Le savoir-faire, les contrats de long terme et les dépendances aux sous-traitants vivent dans quelques têtes, et les banques comme les acquéreurs posent des questions.',
        en: 'You run an industrial mid-cap in Switzerland or Europe. Succession is approaching: family, a fund or an industrial buyer. Know-how, long-term contracts and subcontractor dependencies live in a few heads, and banks and acquirers alike are asking questions.',
        de: 'Sie führen einen industriellen Mid-Cap in der Schweiz oder in Europa. Die Übergabe naht: familienintern, an einen Fonds oder an einen industriellen Nachfolger. Know-how, langfristige Verträge und Zulieferer-Abhängigkeiten leben in wenigen Köpfen, und Banken wie Käufer stellen Fragen.',
        es: 'Dirige una ETI industrial en Suiza o Europa. La transmisión se acerca: familiar, a un fondo o a un comprador industrial. El saber hacer, los contratos a largo plazo y las dependencias de los subcontratistas viven en unas pocas cabezas, y tanto los bancos como los compradores hacen preguntas.',
        it: 'Dirigete una mid-cap industriale in Svizzera o in Europa. La trasmissione si avvicina: familiare, a un fondo o a un acquirente industriale. Know-how, contratti di lungo periodo e dipendenze dai subappaltatori vivono in poche teste, e banche e acquirenti fanno domande.',
        nl: 'U leidt een industriële midcap in Zwitserland of Europa. De overdracht nadert: familiair, aan een fonds of aan een industriële overnemer. Knowhow, langetermijncontracten en toeleveranciersafhankelijkheden leven in enkele hoofden, en banken en kopers stellen vragen.',
      },
      problems: [
        {
          fr: 'Choisir la voie de transmission (famille, fonds, repreneur industriel) et son calendrier → arbitrage écrit, avec les conséquences de chaque option.',
          en: 'Choose the succession path (family, fund, industrial buyer) and its timeline → written trade-off, with the consequences of each option.',
          de: 'Übergabeweg und Zeitplan wählen (Familie, Fonds, industrieller Nachfolger) → schriftliche Abwägung mit den Konsequenzen jeder Option.',
          es: 'Elegir la vía de transmisión (familia, fondo, comprador industrial) y su calendario → arbitraje escrito, con las consecuencias de cada opción.',
          it: 'Scegliere la via di trasmissione (famiglia, fondo, acquirente industriale) e il suo calendario → arbitrato scritto, con le conseguenze di ogni opzione.',
          nl: 'De overdrachtsroute kiezen (familie, fonds, industriële overnemer) en de planning ervan → schriftelijke afweging, met de gevolgen van elke optie.',
        },
        {
          fr: 'Rendre l\'entreprise transmissible : processus clés, dépendances aux personnes et aux sous-traitants → carte des dépendances et plan de réduction.',
          en: 'Make the company transferable: key processes, dependencies on people and subcontractors → dependency map and reduction plan.',
          de: 'Das Unternehmen übertragbar machen: Schlüsselprozesse, Abhängigkeiten von Personen und Zulieferern → Abhängigkeitskarte und Reduktionsplan.',
          es: 'Hacer la empresa transmisible: procesos clave, dependencias de personas y subcontratistas → mapa de dependencias y plan de reducción.',
          it: 'Rendere l\'azienda trasmissibile: processi chiave, dipendenze da persone e subappaltatori → mappa delle dipendenze e piano di riduzione.',
          nl: 'De onderneming overdraagbaar maken: sleutelprocessen, afhankelijkheden van personen en toeleveranciers → afhankelijkheidskaart en reductieplan.',
        },
        {
          fr: 'Préparer la relève de la direction → plan de succession sur 24 mois.',
          en: 'Prepare the leadership succession → 24-month succession plan.',
          de: 'Die Führungsnachfolge vorbereiten → 24-Monats-Nachfolgeplan.',
          es: 'Preparar el relevo de la dirección → plan de sucesión a 24 meses.',
          it: 'Preparare la successione della direzione → piano di successione a 24 mesi.',
          nl: 'De directieopvolging voorbereiden → 24-maanden-opvolgingsplan.',
        },
      ],
    },
    {
      icon: 'TrendingUp',
      label: {
        fr: 'Fonds PE & infrastructure : cycle Acquisition (Reprise)',
        en: 'PE & infrastructure funds: Acquisition (Takeover) cycle',
        de: 'PE- & Infrastrukturfonds: Zyklus Akquisition (Übernahme)',
        es: 'Fondos PE e infraestructura: ciclo Adquisición (Toma de control)',
        it: 'Fondi PE & infrastrutture: ciclo Acquisizione (Subentro)',
        nl: 'PE- & infrastructuurfondsen: cyclus Overname',
      },
      story: {
        fr: 'Vous investissez dans une cible industrielle ou d\'infrastructure en Europe. Savoir-faire, contrats fournisseurs, personnes clés et processus propriétaires sont difficiles à auditer, et l\'état des sites pèse sur le prix.',
        en: 'You are investing in an industrial or infrastructure target in Europe. Know-how, supplier contracts, key people and proprietary processes are difficult to audit, and the condition of the sites weighs on the price.',
        de: 'Sie investieren in eine Industrie- oder Infrastruktur-Beteiligung in Europa. Know-how, Lieferantenverträge, Schlüsselpersonen und proprietäre Prozesse sind schwer zu auditieren, und der Zustand der Standorte belastet den Preis.',
        es: 'Invierte en una empresa industrial o de infraestructura en Europa. El saber hacer, los contratos con proveedores, las personas clave y los procesos propietarios son difíciles de auditar, y el estado de las plantas pesa sobre el precio.',
        it: 'Investite in un target industriale o infrastrutturale in Europa. Know-how, contratti con i fornitori, persone chiave e processi proprietari sono difficili da verificare, e lo stato dei siti pesa sul prezzo.',
        nl: 'U investeert in een industrieel of infrastructuur-overnamedoel in Europa. Knowhow, leverancierscontracten, sleutelpersonen en propriëtaire processen zijn moeilijk te auditen, en de staat van de sites drukt op de prijs.',
      },
      problems: [
        {
          fr: 'Passer la cible au crible : contrats, dépendance aux personnes clés, état des sites, conformité (NIS2, environnement) → traitement proposé pour chaque point : prix, garantie, condition suspensive.',
          en: 'Screen the target: contracts, dependency on key people, site condition, compliance (NIS2, environment) → proposed treatment for each point: price, warranty, suspensive condition.',
          de: 'Die Zielgesellschaft prüfen: Verträge, Abhängigkeit von Schlüsselpersonen, Zustand der Standorte, Compliance (NIS2, Umwelt) → vorgeschlagene Behandlung für jeden Punkt: Preis, Garantie, aufschiebende Bedingung.',
          es: 'Examinar la empresa objetivo: contratos, dependencia de personas clave, estado de las plantas, cumplimiento (NIS2, medio ambiente) → tratamiento propuesto para cada punto: precio, garantía, condición suspensiva.',
          it: 'Esaminare il target: contratti, dipendenza da persone chiave, stato dei siti, conformità (NIS2, ambiente) → trattamento proposto per ogni punto: prezzo, garanzia, condizione sospensiva.',
          nl: 'Het doelwit doorlichten: contracten, afhankelijkheid van sleutelpersonen, staat van de sites, compliance (NIS2, milieu) → voorgestelde behandeling voor elk punt: prijs, garantie, opschortende voorwaarde.',
        },
        {
          fr: 'Préparer l\'intégration et les 100 premiers jours → plan d\'intégration jalonné.',
          en: 'Prepare the integration and the first 100 days → milestone-based integration plan.',
          de: 'Die Integration und die ersten 100 Tage vorbereiten → Integrationsplan mit Meilensteinen.',
          es: 'Preparar la integración y los primeros 100 días → plan de integración por hitos.',
          it: 'Preparare l\'integrazione e i primi 100 giorni → piano di integrazione a tappe.',
          nl: 'De integratie en de eerste 100 dagen voorbereiden → integratieplan met mijlpalen.',
        },
        {
          fr: 'Sécuriser la relève de la direction de la cible → plan de rétention et de relève sur 24 mois.',
          en: 'Secure the target\'s leadership succession → 24-month retention and succession plan.',
          de: 'Die Führungsnachfolge der Zielgesellschaft absichern → 24-Monats-Retentions- und Nachfolgeplan.',
          es: 'Asegurar el relevo de la dirección de la empresa adquirida → plan de retención y relevo a 24 meses.',
          it: 'Assicurare la successione della direzione del target → piano di retention e successione a 24 mesi.',
          nl: 'De directieopvolging van het doelwit borgen → 24-maanden-retentie- en opvolgingsplan.',
        },
      ],
    },
    {
      icon: 'Zap',
      label: {
        fr: 'Opérateurs énergie & utilities : cycles Croissance et Restructuration',
        en: 'Energy & utility operators: Growth and Restructuring cycles',
        de: 'Energie- & Versorgungsbetreiber: Zyklen Wachstum und Restrukturierung',
        es: 'Operadores de energía y utilities: ciclos Crecimiento y Reestructuración',
        it: 'Operatori energia & utilities: cicli Crescita e Ristrutturazione',
        nl: 'Energie- & utilityoperatoren: cycli Groei en Herstructurering',
      },
      story: {
        fr: 'Vous gérez des actifs d\'infrastructure critique : smart grid, production renouvelable, réseau de distribution. Vos régulateurs attendent des preuves de résilience, vos financeurs attendent une documentation ESG, et vos plateformes digitales dépendent de quelques prestataires.',
        en: 'You manage critical infrastructure assets: smart grid, renewable generation, distribution networks. Your regulators expect proof of resilience, your financiers expect ESG documentation, and your digital platforms depend on a few providers.',
        de: 'Sie betreiben kritische Infrastruktur: Smart Grid, Erneuerbare-Energien-Erzeugung, Verteilnetze. Ihre Regulatoren erwarten Resilienznachweise, Ihre Finanzierer eine ESG-Dokumentation, und Ihre digitalen Plattformen hängen von wenigen Dienstleistern ab.',
        es: 'Gestiona activos de infraestructura crítica: smart grid, generación renovable, redes de distribución. Sus reguladores esperan pruebas de resiliencia, sus financiadores una documentación ESG, y sus plataformas digitales dependen de unos pocos proveedores.',
        it: 'Gestite asset di infrastruttura critica: smart grid, produzione rinnovabile, reti di distribuzione. I regolatori si aspettano prove di resilienza, i finanziatori una documentazione ESG, e le vostre piattaforme digitali dipendono da pochi fornitori.',
        nl: 'U beheert kritieke-infrastructuuractiva: smart grid, hernieuwbare opwekking, distributienetwerken. Uw toezichthouders verwachten weerbaarheidsbewijs, uw financiers ESG-documentatie, en uw digitale platforms zijn afhankelijk van enkele leveranciers.',
      },
      problems: [
        {
          fr: 'Démontrer la résilience opérationnelle devant le régulateur (NIS2, exigences sectorielles) → plan de remédiation à 12 mois et suivi pour le comité de direction.',
          en: 'Demonstrate operational resilience to the regulator (NIS2, sector requirements) → 12-month remediation plan and tracking for the executive committee.',
          de: 'Operative Resilienz gegenüber dem Regulator nachweisen (NIS2, sektorale Anforderungen) → 12-Monats-Remediationsplan und Bericht an den Geschäftsleitungsausschuss.',
          es: 'Demostrar la resiliencia operativa ante el regulador (NIS2, exigencias sectoriales) → plan de remediación a 12 meses y seguimiento para el comité de dirección.',
          it: 'Dimostrare la resilienza operativa al regolatore (NIS2, requisiti di settore) → piano di remediation a 12 mesi e monitoraggio per il comitato di direzione.',
          nl: 'Operationele weerbaarheid aantonen aan de toezichthouder (NIS2, sectorale eisen) → 12-maanden-herstelplan en rapportage aan het directiecomité.',
        },
        {
          fr: 'Cartographier les prestataires et plateformes critiques et préparer leur plan de sortie → registre des dépendances et plan de sortie par prestataire.',
          en: 'Map critical providers and platforms and prepare their exit plan → dependency register and exit plan per provider.',
          de: 'Kritische Dienstleister und Plattformen kartieren und deren Exit-Plan vorbereiten → Abhängigkeitsregister und Exit-Plan pro Dienstleister.',
          es: 'Mapear los proveedores y plataformas críticos y preparar su plan de salida → registro de dependencias y plan de salida por proveedor.',
          it: 'Mappare fornitori e piattaforme critici e preparare il loro piano di uscita → registro delle dipendenze e piano di uscita per fornitore.',
          nl: 'Kritieke leveranciers en platforms in kaart brengen en hun exitplan voorbereiden → afhankelijkhedenregister en exitplan per leverancier.',
        },
        {
          fr: 'Monter le dossier de financement (green bond, fonds d\'infrastructure) → plan d\'investissement et indicateurs ESG de suivi.',
          en: 'Build the financing case (green bond, infrastructure fund) → investment plan and ESG tracking indicators.',
          de: 'Die Finanzierungsakte erstellen (Green Bond, Infrastrukturfonds) → Investitionsplan und ESG-Kennzahlen zum Monitoring.',
          es: 'Montar el expediente de financiación (green bond, fondo de infraestructura) → plan de inversión e indicadores ESG de seguimiento.',
          it: 'Costruire il dossier di finanziamento (green bond, fondo infrastrutture) → piano di investimento e indicatori ESG di monitoraggio.',
          nl: 'Het financieringsdossier opbouwen (green bond, infrastructuurfonds) → investeringsplan en ESG-monitoringindicatoren.',
        },
      ],
    },
  ],
  segmentsFootnote: {
    fr: 'L\'exécution de la transaction reste confiée à votre banque d\'affaires ou à vos avocats.',
    en: 'Transaction execution remains with your investment bank or your lawyers.',
    de: 'Die Transaktionsausführung obliegt Ihrer Investmentbank oder Ihren Anwälten.',
    es: 'La ejecución de la transacción queda a cargo de su banco de inversión o de sus abogados.',
    it: 'L\'esecuzione della transazione resta affidata alla vostra banca d\'affari o ai vostri avvocati.',
    nl: 'De transactie-uitvoering blijft bij uw investeringsbank of uw advocaten.',
  },
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
    fr: 'Commerce, Services & Expérience Client | Aegryn',
    en: 'Commerce, Services & Customer Experience | Aegryn',
    de: 'Handel, Dienstleistungen & Kundenerlebnis | Aegryn',
    es: 'Comercio, Servicios y Experiencia de Cliente | Aegryn',
    it: 'Commercio, Servizi & Customer Experience | Aegryn',
    nl: 'Handel, Diensten & Klantervaring | Aegryn',
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
    fr: 'Tech, Innovation & Secteur Public | Aegryn',
    en: 'Tech, Innovation & Public Sector | Aegryn',
    de: 'Tech, Innovation & öffentlicher Sektor | Aegryn',
    es: 'Tech, Innovación y Sector Público | Aegryn',
    it: 'Tech, Innovazione & Settore Pubblico | Aegryn',
    nl: 'Tech, Innovatie & Publieke Sector | Aegryn',
  },
  vision: {
    fr: `Les organisations technologiques, innovantes et du secteur public numérique construisent sur des actifs immatériels : code, données, algorithmes, équipes. Leur crédibilité auprès des investisseurs, des clients publics et des régulateurs tient à la maîtrise de ces actifs : qui détient le code, où sont hébergées les données, de qui dépend la plateforme.

Trois enjeux reviennent à chaque cycle : la souveraineté et la réversibilité des plateformes, la conformité (AI Act, NIS2, exigences des marchés publics), et la dépendance à quelques fondateurs et ingénieurs clés. Lever des fonds, changer d'échelle, répondre à un marché public, fusionner, reprendre une équipe ou préparer une cession : Aegryn aide à décider, puis pilote le projet avec vos équipes produit, technologie et direction, jusqu'à sa mise en œuvre.`,
    en: `Technology, innovation and digital public-sector organisations build on intangible assets: code, data, algorithms, teams. Their credibility with investors, public buyers and regulators rests on their control of these assets: who owns the code, where the data is hosted, whom the platform depends on.

Three issues return at every cycle: platform sovereignty and reversibility, compliance (AI Act, NIS2, public procurement requirements), and dependency on a few founders and key engineers. Raising funds, scaling, responding to a public tender, merging, acquiring a team or preparing a sale: Aegryn helps decide, then steers the project with your product, technology and leadership teams through to implementation.`,
    de: `Technologie-, Innovations- und Digitalverwaltungsorganisationen bauen auf immaterielle Vermögenswerte: Code, Daten, Algorithmen, Teams. Ihre Glaubwürdigkeit gegenüber Investoren, öffentlichen Auftraggebern und Regulatoren beruht auf der Beherrschung dieser Vermögenswerte: wem der Code gehört, wo die Daten gehostet sind, von wem die Plattform abhängt.

Drei Themen kehren in jedem Zyklus wieder: Souveränität und Reversibilität der Plattformen, Compliance (AI Act, NIS2, Anforderungen öffentlicher Aufträge) und die Abhängigkeit von wenigen Gründern und Schlüsselingenieuren. Kapital aufnehmen, die Grösse ändern, auf eine öffentliche Ausschreibung antworten, fusionieren, ein Team übernehmen oder einen Verkauf vorbereiten: Aegryn hilft entscheiden und steuert das Projekt dann mit Ihren Produkt-, Technologie- und Geschäftsleitungsteams bis zur Umsetzung.`,
    es: `Las organizaciones tecnológicas, innovadoras y del sector público digital construyen sobre activos intangibles: código, datos, algoritmos, equipos. Su credibilidad ante inversores, clientes públicos y reguladores depende del dominio de estos activos: quién posee el código, dónde se alojan los datos, de quién depende la plataforma.

Tres retos vuelven en cada ciclo: la soberanía y la reversibilidad de las plataformas, el cumplimiento (AI Act, NIS2, exigencias de la contratación pública) y la dependencia de unos pocos fundadores e ingenieros clave. Levantar fondos, cambiar de escala, responder a una licitación pública, fusionarse, adquirir un equipo o preparar una cesión: Aegryn ayuda a decidir y luego pilota el proyecto con sus equipos de producto, tecnología y dirección, hasta su implementación.`,
    it: `Le organizzazioni tecnologiche, innovative e del settore pubblico digitale costruiscono su asset immateriali: codice, dati, algoritmi, team. La loro credibilità presso investitori, clienti pubblici e regolatori dipende dal controllo di questi asset: chi possiede il codice, dove sono ospitati i dati, da chi dipende la piattaforma.

Tre sfide tornano a ogni ciclo: la sovranità e la reversibilità delle piattaforme, la conformità (AI Act, NIS2, requisiti degli appalti pubblici) e la dipendenza da pochi fondatori e ingegneri chiave. Raccogliere fondi, cambiare scala, rispondere a un appalto pubblico, fondersi, acquisire un team o preparare una cessione: Aegryn aiuta a decidere e poi pilota il progetto con i vostri team di prodotto, tecnologia e direzione, fino all'implementazione.`,
    nl: `Technologie-, innovatie- en digitale-overheidsorganisaties bouwen op immateriële activa: code, data, algoritmen, teams. Hun geloofwaardigheid bij investeerders, publieke opdrachtgevers en toezichthouders berust op de beheersing van deze activa: wie bezit de code, waar worden de data gehost, van wie hangt het platform af.

Drie vraagstukken keren in elke cyclus terug: soevereiniteit en omkeerbaarheid van de platforms, compliance (AI Act, NIS2, eisen van overheidsopdrachten) en de afhankelijkheid van enkele oprichters en sleutelingenieurs. Kapitaal ophalen, opschalen, inschrijven op een overheidsopdracht, fuseren, een team overnemen of een verkoop voorbereiden: Aegryn helpt beslissen en stuurt het project vervolgens met uw product-, technologie- en directieteams tot aan de implementatie.`,
  },
  keyMetrics: [
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
        fr: 'Métriques SaaS (NRR, churn, LTV/CAC), scalabilité, dette technique et dépendance aux fournisseurs de modèles d\'IA.',
        en: 'SaaS metrics (NRR, churn, LTV/CAC), scalability, technical debt and dependency on AI model providers.',
        de: 'SaaS-Kennzahlen (NRR, Churn, LTV/CAC), Skalierbarkeit, technische Schulden und Abhängigkeit von KI-Modellanbietern.',
        es: 'Métricas SaaS (NRR, churn, LTV/CAC), escalabilidad, deuda técnica y dependencia de los proveedores de modelos de IA.',
        it: 'Metriche SaaS (NRR, churn, LTV/CAC), scalabilità, debito tecnico e dipendenza dai fornitori di modelli di IA.',
        nl: 'SaaS-metrics (NRR, churn, LTV/CAC), schaalbaarheid, technische schuld en afhankelijkheid van AI-modelleveranciers.',
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
        fr: 'Marchés publics suisses et européens, exigences DINUM/ANSSI pour la France, cloud souverain et interopérabilité.',
        en: 'Swiss and European public procurement, DINUM/ANSSI requirements for France, sovereign cloud and interoperability.',
        de: 'Öffentliche Aufträge in der Schweiz und Europa, DINUM-/ANSSI-Anforderungen für Frankreich, souveräne Cloud und Interoperabilität.',
        es: 'Contratación pública suiza y europea, exigencias DINUM/ANSSI para Francia, cloud soberano e interoperabilidad.',
        it: 'Appalti pubblici svizzeri ed europei, requisiti DINUM/ANSSI per la Francia, cloud sovrano e interoperabilità.',
        nl: 'Zwitserse en Europese overheidsopdrachten, DINUM-/ANSSI-eisen voor Frankrijk, soevereine cloud en interoperabiliteit.',
      },
    },
    {
      img: '/images/blog/robot-ai.jpg',
      name: {
        fr: 'IA & Deeptech',
        en: 'AI & Deeptech',
        de: 'KI & Deeptech',
        es: 'IA y Deeptech',
        it: 'IA & Deeptech',
        nl: 'AI & Deeptech',
      },
      tag: {
        fr: 'Innovation', en: 'Innovation', de: 'Innovation',
        es: 'Innovación', it: 'Innovazione', nl: 'Innovatie',
      },
      desc: {
        fr: 'Modèles propriétaires, dépendance aux fournisseurs de modèles, AI Act, financement et reprises d\'équipes.',
        en: 'Proprietary models, dependency on model providers, AI Act, financing and team acquisitions.',
        de: 'Proprietäre Modelle, Abhängigkeit von Modellanbietern, AI Act, Finanzierung und Team-Übernahmen.',
        es: 'Modelos propietarios, dependencia de los proveedores de modelos, AI Act, financiación y adquisición de equipos.',
        it: 'Modelli proprietari, dipendenza dai fornitori di modelli, AI Act, finanziamento e acquisizione di team.',
        nl: 'Eigen modellen, afhankelijkheid van modelleveranciers, AI Act, financiering en teamovernames.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Produit, modèle économique & trajectoire de croissance',
        en: 'Product, business model & growth trajectory',
        de: 'Produkt, Geschäftsmodell & Wachstumstrajektorie',
        es: 'Producto, modelo económico y trayectoria de crecimiento',
        it: 'Prodotto, modello economico & traiettoria di crescita',
        nl: 'Product, verdienmodel & groeitraject',
      },
      desc: {
        fr: 'Positionnement, modèle économique (abonnement, usage), choix de marchés, croissance externe, gouvernance du conseil, préparation d\'une levée. Livrable : grille des quatre tests appliquée aux options, et plan à 12-18 mois.',
        en: 'Positioning, business model (subscription, usage), market selection, external growth, board governance, preparation of a funding round. Deliverable: four-test grid applied to the options, and a 12-18 month plan.',
        de: 'Positionierung, Geschäftsmodell (Abo, nutzungsbasiert), Marktwahl, externes Wachstum, Governance des Verwaltungsrats, Vorbereitung einer Finanzierungsrunde. Lieferung: Vier-Test-Raster auf die Optionen angewandt, und 12-18-Monats-Plan.',
        es: 'Posicionamiento, modelo económico (suscripción, uso), elección de mercados, crecimiento externo, gobernanza del consejo, preparación de una ronda. Entregable: rejilla de las cuatro pruebas aplicada a las opciones, y plan a 12-18 meses.',
        it: 'Posizionamento, modello economico (abbonamento, uso), scelta dei mercati, crescita esterna, governance del consiglio, preparazione di un round. Deliverable: griglia dei quattro test applicata alle opzioni, e piano a 12-18 mesi.',
        nl: 'Positionering, verdienmodel (abonnement, gebruik), marktkeuze, externe groei, raadsgovernance, voorbereiding van een financieringsronde. Deliverable: vier-testenraster toegepast op de opties, en een 12-18-maandenplan.',
      },
    },
    {
      title: {
        fr: 'Conformité, sécurité & propriété intellectuelle',
        en: 'Compliance, security & intellectual property',
        de: 'Compliance, Sicherheit & geistiges Eigentum',
        es: 'Cumplimiento, seguridad y propiedad intelectual',
        it: 'Conformità, sicurezza & proprietà intellettuale',
        nl: 'Compliance, beveiliging & intellectueel eigendom',
      },
      desc: {
        fr: 'Cartographie des exigences applicables (AI Act, NIS2, LPD, RGPD, exigences des marchés publics), sécurité de la plateforme, propriété du code et licences open source, protection des algorithmes et des données. Livrable : carte « applicable maintenant / bientôt / pas concerné » et plan de remédiation priorisé.',
        en: 'Mapping of applicable requirements (AI Act, NIS2, FADP, GDPR, public procurement requirements), platform security, code ownership and open-source licences, protection of algorithms and data. Deliverable: "applicable now / soon / not concerned" map and prioritised remediation plan.',
        de: 'Kartierung der anwendbaren Anforderungen (AI Act, NIS2, DSG, DSGVO, Anforderungen öffentlicher Aufträge), Plattformsicherheit, Code-Eigentum und Open-Source-Lizenzen, Schutz von Algorithmen und Daten. Lieferung: Karte «jetzt anwendbar / bald / nicht betroffen» und priorisierter Remediationsplan.',
        es: 'Cartografía de las exigencias aplicables (AI Act, NIS2, LPD, RGPD, exigencias de la contratación pública), seguridad de la plataforma, propiedad del código y licencias open source, protección de algoritmos y datos. Entregable: mapa «aplicable ahora / pronto / no concernido» y plan de remediación priorizado.',
        it: 'Mappatura dei requisiti applicabili (AI Act, NIS2, LPD, GDPR, requisiti degli appalti pubblici), sicurezza della piattaforma, proprietà del codice e licenze open source, protezione di algoritmi e dati. Deliverable: mappa «applicabile ora / presto / non interessato» e piano di remediation prioritizzato.',
        nl: 'In kaart brengen van toepasselijke eisen (AI Act, NIS2, Zwitserse DPA, AVG, eisen van overheidsopdrachten), platformbeveiliging, code-eigendom en open-sourcelicenties, bescherming van algoritmen en data. Deliverable: kaart «nu van toepassing / binnenkort / niet betrokken» en geprioriteerd herstelplan.',
      },
    },
    {
      title: {
        fr: 'Architecture, cloud souverain & dette technique',
        en: 'Architecture, sovereign cloud & technical debt',
        de: 'Architektur, souveräne Cloud & technische Schulden',
        es: 'Arquitectura, cloud soberano y deuda técnica',
        it: 'Architettura, cloud sovrano & debito tecnico',
        nl: 'Architectuur, soevereine cloud & technische schuld',
      },
      desc: {
        fr: 'Architecture SaaS multi-tenant, migration vers un cloud souverain suisse ou européen, réduction de la dette technique, dépendance aux fournisseurs de modèles d\'IA avec plan de sortie, plateformes interopérables pour le secteur public. Outils sur mesure seulement lorsque le marché n\'en propose pas. Livrable : test de réversibilité et arbitrage chiffré.',
        en: 'Multi-tenant SaaS architecture, migration to a Swiss or European sovereign cloud, technical debt reduction, dependency on AI model providers with exit plan, interoperable platforms for the public sector. Custom-built tools only where the market offers none. Deliverable: reversibility test and costed trade-off.',
        de: 'Multi-Tenant-SaaS-Architektur, Migration in eine souveräne Schweizer oder europäische Cloud, Abbau technischer Schulden, Abhängigkeit von KI-Modellanbietern mit Exit-Plan, interoperable Plattformen für den öffentlichen Sektor. Massgeschneiderte Werkzeuge nur dort, wo der Markt keine anbietet. Lieferung: Reversibilitätstest und bezifferte Abwägung.',
        es: 'Arquitectura SaaS multi-tenant, migración a un cloud soberano suizo o europeo, reducción de la deuda técnica, dependencia de los proveedores de modelos de IA con plan de salida, plataformas interoperables para el sector público. Herramientas a medida solo cuando el mercado no las ofrece. Entregable: prueba de reversibilidad y arbitraje cuantificado.',
        it: 'Architettura SaaS multi-tenant, migrazione verso un cloud sovrano svizzero o europeo, riduzione del debito tecnico, dipendenza dai fornitori di modelli di IA con piano di uscita, piattaforme interoperabili per il settore pubblico. Strumenti su misura solo quando il mercato non ne offre. Deliverable: test di reversibilità e arbitrato quantificato.',
        nl: 'Multi-tenant SaaS-architectuur, migratie naar een Zwitserse of Europese soevereine cloud, afbouw van technische schuld, afhankelijkheid van AI-modelleveranciers met exitplan, interoperabele platforms voor de publieke sector. Maatwerk alleen waar de markt niets biedt. Deliverable: omkeerbaarheidstest en gekwantificeerde afweging.',
      },
    },
    {
      title: {
        fr: 'Fondateurs, CTO & équipes clés',
        en: 'Founders, CTOs & key teams',
        de: 'Gründer, CTOs & Schlüsselteams',
        es: 'Fundadores, CTO y equipos clave',
        it: 'Fondatori, CTO & team chiave',
        nl: 'Oprichters, CTO\'s & sleutelteams',
      },
      desc: {
        fr: 'CTO, responsables produit, data et IA, sécurité, dirigeants de transition, rétention des ingénieurs clés, succession des fondateurs. Livrable : fiche de poste, profils présélectionnés, plan de rétention et de succession.',
        en: 'CTOs, heads of product, data and AI, security, interim executives, retention of key engineers, founder succession. Deliverable: job description, shortlisted profiles, retention and succession plan.',
        de: 'CTOs, Produkt-, Daten- und KI-Verantwortliche, Sicherheit, Interimsführungskräfte, Bindung von Schlüsselingenieuren, Gründernachfolge. Lieferung: Stellenprofil, vorausgewählte Profile, Bindungs- und Nachfolgeplan.',
        es: 'CTO, responsables de producto, datos e IA, seguridad, directivos de transición, retención de ingenieros clave, sucesión de los fundadores. Entregable: ficha de puesto, perfiles preseleccionados, plan de retención y sucesión.',
        it: 'CTO, responsabili prodotto, data e IA, sicurezza, dirigenti di transizione, retention degli ingegneri chiave, successione dei fondatori. Deliverable: scheda di posizione, profili preselezionati, piano di retention e successione.',
        nl: 'CTO\'s, product-, data- en AI-verantwoordelijken, beveiliging, interim-directeuren, behoud van sleutelingenieurs, opvolging van oprichters. Deliverable: functieprofiel, voorgeselecteerde profielen, retentie- en opvolgingsplan.',
      },
    },
    {
      title: {
        fr: 'Levée, rapprochement & cession d\'actifs tech',
        en: 'Fundraising, merger & tech asset divestment',
        de: 'Finanzierung, Zusammenschluss & Veräusserung von Tech-Assets',
        es: 'Ronda, agrupación y cesión de activos tech',
        it: 'Raccolta, aggregazione & cessione di asset tech',
        nl: 'Financieringsronde, fusie & verkoop van tech-activa',
      },
      desc: {
        fr: 'Revue d\'une cible avant l\'offre : propriété du code, licences open source, clauses de changement de contrôle, qualité des revenus récurrents, dépendance aux fondateurs. Préparation de la data room côté vendeur, fusion, spin-off, intégration. La certification CIFSO 5000 reste possible en appui. Livrable : traitement proposé pour chaque point (prix, garantie, condition suspensive) et plan d\'intégration ou de séparation jalonné. L\'exécution revient à votre banque d\'affaires et à vos avocats.',
        en: 'Review of a target before the offer: code ownership, open-source licences, change-of-control clauses, quality of recurring revenue, founder dependency. Sell-side data room preparation, merger, spin-off, integration. CIFSO 5000 certification remains available in support. Deliverable: proposed treatment for each point (price, warranty, suspensive condition) and a milestone-based integration or separation plan. Execution remains with your investment bank and your lawyers.',
        de: 'Prüfung einer Zielgesellschaft vor dem Angebot: Code-Eigentum, Open-Source-Lizenzen, Change-of-Control-Klauseln, Qualität der wiederkehrenden Umsätze, Abhängigkeit von den Gründern. Vorbereitung des Datenraums auf Verkäuferseite, Fusion, Spin-off, Integration. Die CIFSO-5000-Zertifizierung bleibt unterstützend möglich. Lieferung: vorgeschlagene Behandlung für jeden Punkt (Preis, Garantie, aufschiebende Bedingung) und ein Meilensteinplan für Integration oder Abspaltung. Die Ausführung obliegt Ihrer Investmentbank und Ihren Anwälten.',
        es: 'Revisión de una empresa objetivo antes de la oferta: propiedad del código, licencias open source, cláusulas de cambio de control, calidad de los ingresos recurrentes, dependencia de los fundadores. Preparación del data room del lado vendedor, fusión, spin-off, integración. La certificación CIFSO 5000 sigue siendo posible como apoyo. Entregable: tratamiento propuesto para cada punto (precio, garantía, condición suspensiva) y plan de integración o separación por hitos. La ejecución corresponde a su banco de inversión y a sus abogados.',
        it: 'Revisione di un target prima dell\'offerta: proprietà del codice, licenze open source, clausole di cambio di controllo, qualità dei ricavi ricorrenti, dipendenza dai fondatori. Preparazione della data room lato venditore, fusione, spin-off, integrazione. La certificazione CIFSO 5000 resta possibile a supporto. Deliverable: trattamento proposto per ogni punto (prezzo, garanzia, condizione sospensiva) e piano di integrazione o separazione a tappe. L\'esecuzione spetta alla vostra banca d\'affari e ai vostri avvocati.',
        nl: 'Beoordeling van een doelwit vóór het bod: code-eigendom, open-sourcelicenties, change-of-control-clausules, kwaliteit van terugkerende omzet, afhankelijkheid van de oprichters. Voorbereiding van de dataroom aan verkoperszijde, fusie, spin-off, integratie. De CIFSO 5000-certificering blijft ter ondersteuning mogelijk. Deliverable: voorgestelde behandeling voor elk punt (prijs, garantie, opschortende voorwaarde) en een plan voor integratie of afsplitsing met mijlpalen. De uitvoering komt toe aan uw investeringsbank en uw advocaten.',
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
        fr: 'Fondateurs SaaS & scale-ups : cycles Croissance et Transmission',
        en: 'SaaS founders & scale-ups: Growth and Succession cycles',
        de: 'SaaS-Gründer & Scale-ups: Zyklen Wachstum und Übergabe',
        es: 'Fundadores SaaS y scale-ups: ciclos Crecimiento y Transmisión',
        it: 'Fondatori SaaS & scale-up: cicli Crescita e Trasmissione',
        nl: 'SaaS-oprichters & scale-ups: cycli Groei en Overdracht',
      },
      icon: 'Rocket',
      story: {
        fr: 'Vous avez construit un SaaS B2B avec des revenus récurrents solides. Un fonds ou un acquéreur stratégique entre en process et demande la propriété du code, la gouvernance de l\'IP, l\'architecture et vos métriques avant d\'engager ses juristes. Le calendrier est serré.',
        en: 'You have built a B2B SaaS with solid recurring revenue. A fund or strategic acquirer has entered the process and is asking about code ownership, IP governance, architecture and your metrics before engaging its lawyers. The timeline is tight.',
        de: 'Sie haben ein B2B-SaaS mit soliden wiederkehrenden Umsätzen aufgebaut. Ein Fonds oder strategischer Käufer ist in den Prozess eingestiegen und verlangt Angaben zu Code-Eigentum, IP-Governance, Architektur und Ihren Kennzahlen, bevor er seine Juristen einschaltet. Der Zeitplan ist eng.',
        es: 'Ha construido un SaaS B2B con ingresos recurrentes sólidos. Un fondo o un comprador estratégico ha entrado en el proceso y pide la propiedad del código, la gobernanza de la IP, la arquitectura y sus métricas antes de movilizar a sus juristas. El calendario es ajustado.',
        it: 'Avete costruito un SaaS B2B con ricavi ricorrenti solidi. Un fondo o un acquirente strategico è entrato nel processo e chiede la proprietà del codice, la governance dell\'IP, l\'architettura e le vostre metriche prima di coinvolgere i suoi legali. I tempi sono stretti.',
        nl: 'U heeft een B2B-SaaS opgebouwd met solide terugkerende omzet. Een fonds of strategische koper is in het proces gestapt en vraagt naar code-eigendom, IP-governance, architectuur en uw metrics voordat het zijn juristen inschakelt. De tijdlijn is krap.',
      },
      problems: [
        {
          fr: 'Passer votre propre société au crible avant l\'acheteur : propriété du code, licences open source, clauses de changement de contrôle → liste des points faibles et correctif pour chacun.',
          en: 'Screen your own company before the buyer does: code ownership, open-source licences, change-of-control clauses → list of weak points and a fix for each.',
          de: 'Das eigene Unternehmen vor dem Käufer prüfen: Code-Eigentum, Open-Source-Lizenzen, Change-of-Control-Klauseln → Liste der Schwachstellen und Korrektur für jede.',
          es: 'Examinar su propia sociedad antes que el comprador: propiedad del código, licencias open source, cláusulas de cambio de control → lista de puntos débiles y corrección para cada uno.',
          it: 'Esaminare la vostra società prima dell\'acquirente: proprietà del codice, licenze open source, clausole di cambio di controllo → elenco dei punti deboli e correttivo per ciascuno.',
          nl: 'Uw eigen bedrijf doorlichten vóór de koper: code-eigendom, open-sourcelicenties, change-of-control-clausules → lijst van zwakke punten en een correctie voor elk.',
        },
        {
          fr: 'Préparer la data room et la lecture des métriques (NRR, churn, LTV/CAC) → data room complète et note d\'explication des chiffres.',
          en: 'Prepare the data room and the reading of your metrics (NRR, churn, LTV/CAC) → complete data room and explanatory note on the figures.',
          de: 'Datenraum und Lektüre der Kennzahlen vorbereiten (NRR, Churn, LTV/CAC) → vollständiger Datenraum und Erläuterungsnote zu den Zahlen.',
          es: 'Preparar el data room y la lectura de las métricas (NRR, churn, LTV/CAC) → data room completo y nota explicativa de las cifras.',
          it: 'Preparare la data room e la lettura delle metriche (NRR, churn, LTV/CAC) → data room completa e nota esplicativa delle cifre.',
          nl: 'De dataroom en de lezing van uw metrics voorbereiden (NRR, churn, LTV/CAC) → volledige dataroom en toelichtende notitie bij de cijfers.',
        },
        {
          fr: 'Sécuriser la rétention des fondateurs et de l\'équipe technique → plan de rétention.',
          en: 'Secure retention of founders and the technical team → retention plan.',
          de: 'Die Bindung der Gründer und des Technikteams sichern → Bindungsplan.',
          es: 'Asegurar la retención de los fundadores y del equipo técnico → plan de retención.',
          it: 'Assicurare la retention dei fondatori e del team tecnico → piano di retention.',
          nl: 'Het behoud van oprichters en het technische team borgen → retentieplan.',
        },
      ],
    },
    {
      label: {
        fr: 'Fonds venture & growth : cycles Croissance et Acquisition (Reprise)',
        en: 'Venture & growth funds: Growth and Acquisition (Takeover) cycles',
        de: 'Venture- & Growth-Fonds: Zyklen Wachstum und Akquisition (Übernahme)',
        es: 'Fondos venture y growth: ciclos Crecimiento y Adquisición (Toma de control)',
        it: 'Fondi venture & growth: cicli Crescita e Acquisizione (Subentro)',
        nl: 'Venture- & growth-fondsen: cycli Groei en Overname',
      },
      icon: 'TrendingUp',
      story: {
        fr: 'Vous gérez un portefeuille de SaaS B2B européens. Sur plusieurs participations, les métriques déclarées sont difficiles à vérifier et la gouvernance de l\'IP est peu documentée. Vous préparez un tour de table ou une sortie.',
        en: 'You manage a portfolio of European B2B SaaS companies. Across several holdings, reported metrics are difficult to verify and IP governance is poorly documented. You are preparing a funding round or an exit.',
        de: 'Sie verwalten ein Portfolio europäischer B2B-SaaS-Unternehmen. Bei mehreren Beteiligungen sind die gemeldeten Kennzahlen schwer zu verifizieren und die IP-Governance ist kaum dokumentiert. Sie bereiten eine Finanzierungsrunde oder einen Exit vor.',
        es: 'Gestiona una cartera de SaaS B2B europeos. En varias participaciones, las métricas declaradas son difíciles de verificar y la gobernanza de la IP está poco documentada. Prepara una ronda de financiación o una salida.',
        it: 'Gestite un portafoglio di SaaS B2B europei. In diverse partecipazioni le metriche dichiarate sono difficili da verificare e la governance dell\'IP è scarsamente documentata. State preparando un round o un\'uscita.',
        nl: 'U beheert een portefeuille van Europese B2B-SaaS-bedrijven. Bij meerdere deelnemingen zijn de gerapporteerde metrics moeilijk te verifiëren en is IP-governance nauwelijks gedocumenteerd. U bereidt een financieringsronde of een exit voor.',
      },
      problems: [
        {
          fr: 'Vérifier une participation ou une cible : qualité des revenus, propriété du code, dépendance aux fondateurs → traitement proposé pour chaque point : prix, garantie, condition suspensive.',
          en: 'Verify a holding or a target: revenue quality, code ownership, founder dependency → proposed treatment for each point: price, warranty, suspensive condition.',
          de: 'Eine Beteiligung oder Zielgesellschaft verifizieren: Umsatzqualität, Code-Eigentum, Gründerabhängigkeit → vorgeschlagene Behandlung für jeden Punkt: Preis, Garantie, aufschiebende Bedingung.',
          es: 'Verificar una participación o una empresa objetivo: calidad de los ingresos, propiedad del código, dependencia de los fundadores → tratamiento propuesto para cada punto: precio, garantía, condición suspensiva.',
          it: 'Verificare una partecipazione o un target: qualità dei ricavi, proprietà del codice, dipendenza dai fondatori → trattamento proposto per ogni punto: prezzo, garanzia, condizione sospensiva.',
          nl: 'Een deelneming of doelwit verifiëren: omzetkwaliteit, code-eigendom, oprichterafhankelijkheid → voorgestelde behandeling voor elk punt: prijs, garantie, opschortende voorwaarde.',
        },
        {
          fr: 'Remettre une participation au niveau d\'une levée de série B ou C : gouvernance, architecture, équipe dirigeante → plan de remédiation priorisé.',
          en: 'Bring a holding up to Series B or C fundraising standard: governance, architecture, leadership team → prioritised remediation plan.',
          de: 'Eine Beteiligung auf das Niveau einer Series-B- oder -C-Finanzierung bringen: Governance, Architektur, Führungsteam → priorisierter Remediationsplan.',
          es: 'Poner una participación al nivel de una ronda serie B o C: gobernanza, arquitectura, equipo directivo → plan de remediación priorizado.',
          it: 'Portare una partecipazione al livello di un round Serie B o C: governance, architettura, team dirigenziale → piano di remediation prioritizzato.',
          nl: 'Een deelneming op het niveau van een Series-B- of -C-ronde brengen: governance, architectuur, directieteam → geprioriteerd herstelplan.',
        },
        {
          fr: 'Préparer la sortie, secondaire ou dual-track → calendrier et dossier de sortie.',
          en: 'Prepare the exit, secondary or dual-track → timetable and exit file.',
          de: 'Den Exit vorbereiten, Secondary oder Dual-Track → Zeitplan und Exit-Dossier.',
          es: 'Preparar la salida, secundaria o dual-track → calendario y expediente de salida.',
          it: 'Preparare l\'uscita, secondaria o dual-track → calendario e dossier di uscita.',
          nl: 'De exit voorbereiden, secundair of dual-track → tijdschema en exitdossier.',
        },
      ],
    },
    {
      label: {
        fr: 'Acteurs GovTech & EdTech : cycles Croissance et Acquisition (Reprise)',
        en: 'GovTech & EdTech players: Growth and Acquisition (Takeover) cycles',
        de: 'GovTech- & EdTech-Akteure: Zyklen Wachstum und Akquisition (Übernahme)',
        es: 'Actores GovTech y EdTech: ciclos Crecimiento y Adquisición (Toma de control)',
        it: 'Operatori GovTech & EdTech: cicli Crescita e Acquisizione (Subentro)',
        nl: 'GovTech- & EdTech-spelers: cycli Groei en Overname',
      },
      icon: 'Landmark',
      story: {
        fr: 'Vous opérez une plateforme numérique pour le secteur public ou l\'éducation. Un marché public exige un hébergement souverain, un partenaire industriel veut fusionner et une administration envisage une reprise partielle.',
        en: 'You operate a digital platform for the public sector or education. A public tender requires sovereign hosting, an industrial partner wants to merge and an administration is considering a partial takeover.',
        de: 'Sie betreiben eine digitale Plattform für den öffentlichen Sektor oder die Bildung. Eine öffentliche Ausschreibung verlangt souveränes Hosting, ein industrieller Partner will fusionieren und eine Verwaltung erwägt eine Teilübernahme.',
        es: 'Opera una plataforma digital para el sector público o la educación. Una licitación pública exige un alojamiento soberano, un socio industrial quiere fusionarse y una administración considera una toma parcial.',
        it: 'Operate una piattaforma digitale per il settore pubblico o l\'istruzione. Un appalto pubblico richiede un hosting sovrano, un partner industriale vuole fondersi e un\'amministrazione valuta un\'acquisizione parziale.',
        nl: 'U exploiteert een digitaal platform voor de publieke sector of het onderwijs. Een overheidsopdracht eist soevereine hosting, een industriële partner wil fuseren en een overheid overweegt een gedeeltelijke overname.',
      },
      problems: [
        {
          fr: 'Qualifier l\'éligibilité aux marchés publics : exigences de souveraineté et d\'hébergement (DINUM/ANSSI, équivalents suisses) → carte des écarts et plan de mise en conformité.',
          en: 'Assess eligibility for public tenders: sovereignty and hosting requirements (DINUM/ANSSI, Swiss equivalents) → gap map and compliance plan.',
          de: 'Die Zulassung zu öffentlichen Aufträgen qualifizieren: Souveränitäts- und Hosting-Anforderungen (DINUM/ANSSI, Schweizer Äquivalente) → Lücken-Karte und Konformitätsplan.',
          es: 'Cualificar la elegibilidad a la contratación pública: exigencias de soberanía y alojamiento (DINUM/ANSSI, equivalentes suizos) → mapa de brechas y plan de conformidad.',
          it: 'Qualificare l\'ammissibilità agli appalti pubblici: requisiti di sovranità e hosting (DINUM/ANSSI, equivalenti svizzeri) → mappa dei gap e piano di conformità.',
          nl: 'De toelating tot overheidsopdrachten kwalificeren: soevereiniteits- en hostingeisen (DINUM/ANSSI, Zwitserse equivalenten) → lacunekaart en complianceplan.',
        },
        {
          fr: 'Cadrer la fusion ou le rapprochement : organisation, gouvernance, systèmes → plan de rapprochement jalonné.',
          en: 'Frame the merger or consolidation: organisation, governance, systems → milestone-based consolidation plan.',
          de: 'Die Fusion oder den Zusammenschluss strukturieren: Organisation, Governance, Systeme → Zusammenschlussplan mit Meilensteinen.',
          es: 'Enmarcar la fusión o la agrupación: organización, gobernanza, sistemas → plan de agrupación por hitos.',
          it: 'Inquadrare la fusione o l\'aggregazione: organizzazione, governance, sistemi → piano di aggregazione a tappe.',
          nl: 'De fusie of samenvoeging kaderen: organisatie, governance, systemen → samenvoegingsplan met mijlpalen.',
        },
        {
          fr: 'Préparer un spin-off ou une reprise partielle par une administration → périmètre proposé, avec transferts de contrats et de personnel.',
          en: 'Prepare a spin-off or partial takeover by an administration → proposed perimeter, including contract and staff transfers.',
          de: 'Ein Spin-off oder eine Teilübernahme durch eine Verwaltung vorbereiten → vorgeschlagener Umfang, einschliesslich Vertrags- und Personalübertragungen.',
          es: 'Preparar un spin-off o una toma parcial por una administración → perímetro propuesto, con transferencias de contratos y personal.',
          it: 'Preparare uno spin-off o un\'acquisizione parziale da parte di un\'amministrazione → perimetro proposto, con trasferimenti di contratti e personale.',
          nl: 'Een spin-off of gedeeltelijke overname door een overheid voorbereiden → voorgestelde scope, inclusief contract- en personeelsoverdrachten.',
        },
      ],
    },
  ],
  segmentsFootnote: {
    fr: 'L\'exécution de la transaction reste confiée à votre banque d\'affaires ou à vos avocats.',
    en: 'Transaction execution remains with your investment bank or your lawyers.',
    de: 'Die Transaktionsausführung obliegt Ihrer Investmentbank oder Ihren Anwälten.',
    es: 'La ejecución de la transacción queda a cargo de su banco de inversión o de sus abogados.',
    it: 'L\'esecuzione della transazione resta affidata alla vostra banca d\'affari o ai vostri avvocati.',
    nl: 'De transactie-uitvoering blijft bij uw investeringsbank of uw advocaten.',
  },
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
