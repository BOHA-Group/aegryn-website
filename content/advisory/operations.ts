/**
 * Métier OPÉRATIONS ET EXCELLENCE OPÉRATIONNELLE (/advisory/operations-excellence).
 * Contenu rédigé avec l'utilisateur en octobre 2026 ; structure des pages métier.
 * Les chiffres portent sur l'industrie (MEM, manufacturière) : c'est signalé dans
 * le texte de lecture, la cible couvrant aussi services et commerce.
 */
import type { AdvisoryPageContent } from './types'

export const ADVISORY_OPERATIONS: Record<string, AdvisoryPageContent> = {
  fr: {
    key: 'operationsExcellence',
    path: '/advisory/operations-excellence',
    image: '/images/advisory/operations.webp',
    imageAlt: 'Convoyeur aérien à galets dans une usine, mécanique du flux',
    meta: {
      title: 'Opérations et Excellence opérationnelle : coûts, délais, qualité, approvisionnement | Aegryn',
      description: 'Coûts, délais, qualité, capacité et fournisseurs : Aegryn cartographie votre flux de la commande à l’encaissement, tranche où agir en premier, puis conduit la mise en œuvre avec vos équipes. Suisse et Europe.',
      keywords: ['excellence opérationnelle PME', 'cartographie des flux', 'réduction des coûts', 'goulots de production', 'approvisionnement fournisseurs', 'conseil opérations Suisse'],
    },
    eyebrow: 'Opérations et Excellence opérationnelle',
    h1: 'Trouver le goulot qui limite tout le reste.',
    subtitle: 'Coûts, délais, qualité, capacité, fournisseurs : quand les marges se resserrent, l’opérationnel décide. Aegryn cartographie votre flux de la commande à l’encaissement, tranche où agir en premier, puis conduit la mise en œuvre avec vos équipes.',
    scope: [
      { label: 'La trésorerie et le fonds de roulement : Finance et Performance', href: '/advisory/finance-performance' },
      { label: 'Le plan d’intégration à 100 jours : M&A', href: '/advisory/ma' },
      { label: 'Un directeur des opérations de transition : Sélectionner', href: '/talent' },
      { label: 'Le projet ou programme ponctuel : Pilotage', href: '/advisory/project-program-management' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '≈ 1 sur 4', label: 'des entreprises de l’industrie MEM (machines, électrique, métaux) avaient une marge EBIT négative en 2025 ; 29 % de plus couvraient à peine leurs coûts de capital et de R&D', source: 'Swissmem, août 2026' },
        { value: '−3,8 %', label: 'de chiffre d’affaires pour les PME de l’industrie MEM au premier semestre 2026, contre +2,5 % pour l’ensemble du secteur ; utilisation des capacités de 81,1 % au T2 2026, pour une moyenne de long terme de 85,6 %', source: 'Swissmem, août 2026' },
        { value: '70,0', label: 'indice des prix d’achat de l’industrie suisse en septembre 2026 (seuil de 50 = stabilité), alors que l’indice d’ensemble reste en expansion à 55,3', source: 'procure.ch–UBS, relayé par Trading Economics, 1er oct. 2026' },
      ],
      paragraphs: [
        'La reprise est inégale : les commandes repartent et les grands groupes en profitent, tandis que les PME voient leur chiffre d’affaires reculer et leurs capacités tourner en dessous de leur niveau habituel. Dans le même temps, les prix d’achat restent sous tension.',
        'Près de trois PME de l’industrie MEM sur quatre jugent leur situation défavorable selon l’enquête Swissmechanic d’avril 2026, et environ quatre sur dix ont vu leur marge baisser au premier trimestre. L’écart ne se comble pas par l’effort de tous : il se comble en traitant le bon point d’abord.',
      ],
      change: 'Une amélioration que personne ne mesure disparaît en six mois. La question n’est pas « que pouvons-nous optimiser ? » mais « quel goulot limite l’ensemble, et comment saurons-nous qu’il est traité ? ».',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Un flux mesuré de bout en bout, avec un indicateur par étape.',
        'Des gains vérifiables, rattachés à un levier et à un responsable.',
        'Une organisation qui tient les améliorations après notre départ.',
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Nos coûts montent plus vite que nos prix.', decision: 'Où agir (achats, process, gamme) sans perdre en qualité.', deliverable: 'Carte des coûts par étape et plan de gains chiffré.', format: 'Quelques semaines', cycles: ['croissance'] },
        { quote: 'Nos délais et notre qualité varient d’une commande à l’autre.', decision: 'Quels processus standardiser, lesquels laisser sur mesure.', deliverable: 'Cartographie des processus clés, indicateurs de service, plan de standardisation.', format: 'Mission courte', cycles: ['croissance'] },
        { quote: 'Un fournisseur critique nous met en risque.', decision: 'Diversifier, stocker ou intégrer.', deliverable: 'Carte de dépendance aux fournisseurs et plan de sécurisation (seconde source, stock de sécurité).', format: 'Quelques semaines', cycles: ['croissance', 'restructuration'] },
        { quote: 'Nos capacités sont sous-utilisées, ou saturées.', decision: 'Investir, sous-traiter ou réorganiser.', deliverable: 'Analyse des goulots de capacité et trois scénarios chiffrés.', format: 'Un à deux mois', cycles: ['croissance'] },
        { quote: 'Nous devons réduire les coûts sans abîmer l’entreprise.', decision: 'Quels coûts, dans quel ordre, avec quel risque pour les équipes.', deliverable: 'Plan de réduction chiffré par levier, avec calendrier et critères d’arrêt, dans le respect des obligations d’information et de consultation du personnel.', format: 'Mission de trois à six mois', cycles: ['restructuration'] },
        { quote: 'Nous reprenons une activité : comment faire tourner l’ensemble ?', decision: 'Quels sites, processus et fournisseurs garder.', deliverable: 'Plan d’intégration opérationnelle (sites, achats, systèmes).', format: 'Un à deux mois', cycles: ['acquisition'] },
      ],
    },
    services: {
      title: 'Nos services : décider (Cadrer)',
      items: [
        'Cartographier le flux de la commande à l’encaissement et ses goulots.',
        'Diagnostiquer coûts, délais et qualité étape par étape.',
        'Analyser la capacité (sites, équipes, équipements) et arbitrer investir, sous-traiter ou réorganiser.',
        'Évaluer la dépendance aux fournisseurs critiques et définir le plan de sécurisation.',
        'Définir la politique d’achats et de stocks, en lien avec le plan de trésorerie (Finance et Performance).',
        'Dimensionner le plan de réduction de coûts et ses risques.',
      ],
    },
    framework: {
      name: 'La Carte du flux, de la commande à l’encaissement',
      intro: 'Un document de deux pages, mis à jour à chaque étape du programme.',
      axes: [
        { label: 'Commande réelle', desc: 'Suivre une commande réelle, de la demande client au paiement.' },
        { label: 'Mesure par étape', desc: 'Mesurer délai, qualité et coût à chaque étape.' },
        { label: 'Goulot', desc: 'Identifier le goulot qui limite l’ensemble.' },
        { label: 'Un à la fois', desc: 'Traiter un seul goulot à la fois, et mesurer le résultat avant de passer au suivant.' },
      ],
      deliverable: 'La carte du flux et son tableau d’indicateurs, relus chaque semaine par l’équipe.',
    },
    perspectives: {
      title: 'Pour aller plus loin',
      items: [
        { title: 'Industrie, Énergie & Infrastructure', href: '/industries/industrie-energie-infrastructure', kind: 'industrie' },
        { title: 'Commerce, Services & Expérience client', href: '/industries/commerce-services-experience-client', kind: 'industrie' },
      ],
    },
    cta: { metier: 'operations' },
  },

  en: {
    key: 'operationsExcellence',
    path: '/advisory/operations-excellence',
    image: '/images/advisory/operations.webp',
    imageAlt: 'Overhead roller conveyor in a factory, flow mechanics',
    meta: {
      title: 'Operations and Operational Excellence: costs, lead times, quality, supply | Aegryn',
      description: 'Costs, lead times, quality, capacity and suppliers: Aegryn maps your flow from order to cash, decides where to act first, then leads implementation with your teams. Switzerland and Europe.',
      keywords: ['operational excellence SME', 'value stream mapping', 'cost reduction', 'production bottlenecks', 'supplier risk', 'operations advisory Switzerland'],
    },
    eyebrow: 'Operations and Operational Excellence',
    h1: 'Find the bottleneck that limits everything else.',
    subtitle: 'Costs, lead times, quality, capacity, suppliers: when margins tighten, operations decide. Aegryn maps your flow from order to cash, decides where to act first, then leads implementation with your teams.',
    scope: [
      { label: 'Cash flow and working capital: Finance and Performance', href: '/advisory/finance-performance' },
      { label: 'The 100-day integration plan: M&A', href: '/advisory/ma' },
      { label: 'An interim operations director: Talent', href: '/talent' },
      { label: 'The one-off project or programme: Project Management', href: '/advisory/project-program-management' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '≈ 1 in 4', label: 'MEM industry companies (machinery, electrical, metals) had a negative EBIT margin in 2025; a further 29% barely covered their capital and R&D costs', source: 'Swissmem, August 2026' },
        { value: '−3.8%', label: 'revenue for MEM industry SMEs in the first half of 2026, versus +2.5% for the sector as a whole; capacity utilisation of 81.1% in Q2 2026 against a long-term average of 85.6%', source: 'Swissmem, August 2026' },
        { value: '70.0', label: 'Swiss industrial purchase price index in September 2026 (50 = stable), while the overall index remains in expansion at 55.3', source: 'procure.ch–UBS, via Trading Economics, 1 Oct. 2026' },
      ],
      paragraphs: [
        'The recovery is uneven: orders are returning and large groups benefit, while SMEs see revenue fall and capacity run below usual levels. Meanwhile, purchase prices remain under pressure.',
        'Nearly three in four MEM SMEs rate their situation as unfavourable in the April 2026 Swissmechanic survey, and about four in ten saw margins decline in the first quarter. The gap does not close through everyone’s effort: it closes by treating the right point first.',
      ],
      change: 'An improvement nobody measures disappears within six months. The question is not “what can we optimise?” but “which bottleneck limits the whole, and how will we know it is fixed?”.',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'A flow measured end to end, with one indicator per step.',
        'Verifiable gains, tied to a lever and an owner.',
        'An organisation that holds the improvements after we leave.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'Our costs are rising faster than our prices.', decision: 'Where to act (purchasing, processes, range) without losing quality.', deliverable: 'Cost map by step and a costed gains plan.', format: 'A few weeks', cycles: ['croissance'] },
        { quote: 'Our lead times and quality vary from order to order.', decision: 'Which processes to standardise, which to keep bespoke.', deliverable: 'Key-process mapping, service indicators, standardisation plan.', format: 'Short engagement', cycles: ['croissance'] },
        { quote: 'A critical supplier puts us at risk.', decision: 'Diversify, stock or integrate.', deliverable: 'Supplier-dependency map and securing plan (second source, safety stock).', format: 'A few weeks', cycles: ['croissance', 'restructuration'] },
        { quote: 'Our capacity is under-used, or saturated.', decision: 'Invest, outsource or reorganise.', deliverable: 'Capacity-bottleneck analysis and three costed scenarios.', format: 'One to two months', cycles: ['croissance'] },
        { quote: 'We must cut costs without damaging the company.', decision: 'Which costs, in what order, with what risk for the teams.', deliverable: 'A costed reduction plan by lever, with a timetable and stop criteria, respecting staff information and consultation duties.', format: 'Three to six months', cycles: ['restructuration'] },
        { quote: 'We are taking over an activity: how do we run the whole?', decision: 'Which sites, processes and suppliers to keep.', deliverable: 'Operational integration plan (sites, purchasing, systems).', format: 'One to two months', cycles: ['acquisition'] },
      ],
    },
    services: {
      title: 'What we do: deciding (Frame)',
      items: [
        'Map the flow from order to cash and its bottlenecks.',
        'Diagnose costs, lead times and quality step by step.',
        'Analyse capacity (sites, teams, equipment) and arbitrate investing, outsourcing or reorganising.',
        'Assess dependency on critical suppliers and define the securing plan.',
        'Define purchasing and inventory policy, linked to the cash plan (Finance and Performance).',
        'Size the cost-reduction plan and its risks.',
      ],
    },
    framework: {
      name: 'The Flow Map, from order to cash',
      intro: 'A two-page document, updated at every step of the programme.',
      axes: [
        { label: 'A real order', desc: 'Follow one real order, from customer request to payment.' },
        { label: 'Step-by-step measure', desc: 'Measure lead time, quality and cost at each step.' },
        { label: 'Bottleneck', desc: 'Identify the bottleneck that limits the whole.' },
        { label: 'One at a time', desc: 'Treat one bottleneck at a time, and measure the result before moving to the next.' },
      ],
      deliverable: 'The flow map and its indicators table, reviewed weekly by the team.',
    },
    perspectives: {
      title: 'Going further',
      items: [
        { title: 'Industry, Energy & Infrastructure', href: '/industries/industrie-energie-infrastructure', kind: 'industrie' },
        { title: 'Commerce, Services & Customer Experience', href: '/industries/commerce-services-experience-client', kind: 'industrie' },
      ],
    },
    cta: { metier: 'operations' },
  },

  de: {
    key: 'operationsExcellence',
    path: '/advisory/operations-excellence',
    image: '/images/advisory/operations.webp',
    imageAlt: 'Hängeförderer mit Rollen in einer Fabrik, Flussmechanik',
    meta: {
      title: 'Operations und operative Exzellenz: Kosten, Fristen, Qualität, Beschaffung | Aegryn',
      description: 'Kosten, Lieferfristen, Qualität, Kapazität und Lieferanten: Aegryn kartiert Ihren Fluss vom Auftrag bis zur Zahlung, entscheidet, wo zuerst zu handeln ist, und führt die Umsetzung mit Ihren Teams. Schweiz und Europa.',
      keywords: ['operative Exzellenz KMU', 'Wertstromkartierung', 'Kostensenkung', 'Engpässe in der Produktion', 'Lieferantenabhängigkeit', 'Operations-Beratung Schweiz'],
    },
    eyebrow: 'Operations und operative Exzellenz',
    h1: 'Den Engpass finden, der alles andere begrenzt.',
    subtitle: 'Kosten, Fristen, Qualität, Kapazität, Lieferanten: Wenn die Margen schrumpfen, entscheidet das Operative. Aegryn kartiert Ihren Fluss vom Auftrag bis zur Zahlung, entscheidet, wo zuerst zu handeln ist, und führt die Umsetzung mit Ihren Teams.',
    scope: [
      { label: 'Liquidität und Working Capital: Finanzen und Performance', href: '/advisory/finance-performance' },
      { label: 'Der 100-Tage-Integrationsplan: M&A', href: '/advisory/ma' },
      { label: 'Ein Interim-Operations-Direktor: Auswahl', href: '/talent' },
      { label: 'Das einmalige Projekt oder Programm: Projektsteuerung', href: '/advisory/project-program-management' },
    ],
    observation: {
      title: 'Was wir feststellen',
      cards: [
        { value: '≈ 1 von 4', label: 'Unternehmen der MEM-Industrie (Maschinen, Elektro, Metalle) hatten 2025 eine negative EBIT-Marge; weitere 29 % deckten kaum ihre Kapital- und F&E-Kosten', source: 'Swissmem, August 2026' },
        { value: '−3,8 %', label: 'Umsatz der MEM-KMU im ersten Halbjahr 2026, gegenüber +2,5 % für den Gesamtsektor; Kapazitätsauslastung 81,1 % im 2. Quartal 2026 gegenüber einem langfristigen Schnitt von 85,6 %', source: 'Swissmem, August 2026' },
        { value: '70,0', label: 'Einkaufspreisindex der Schweizer Industrie im September 2026 (50 = stabil), während der Gesamtindex bei 55,3 expandiert', source: 'procure.ch–UBS, via Trading Economics, 1. Okt. 2026' },
      ],
      paragraphs: [
        'Die Erholung ist ungleichmässig: Die Aufträge kehren zurück und die Grosskonzerne profitieren, während die KMU Umsatzrückgänge und eine unterdurchschnittliche Kapazitätsauslastung verzeichnen. Gleichzeitig bleiben die Einkaufspreise unter Spannung.',
        'Fast drei von vier MEM-KMU beurteilen ihre Lage als ungünstig, so die Swissmechanic-Umfrage vom April 2026, und rund vier von zehn verzeichneten im ersten Quartal sinkende Margen. Die Lücke schliesst sich nicht durch den Einsatz aller: Sie schliesst sich, indem man den richtigen Punkt zuerst behandelt.',
      ],
      change: 'Eine Verbesserung, die niemand misst, verschwindet in sechs Monaten. Die Frage lautet nicht «was können wir optimieren?», sondern «welcher Engpass begrenzt das Ganze, und woran erkennen wir, dass er behoben ist?».',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Einen von Anfang bis Ende gemessenen Fluss, mit einem Indikator je Etappe.',
        'Überprüfbare Gewinne, verknüpft mit einem Hebel und einer verantwortlichen Person.',
        'Eine Organisation, die die Verbesserungen nach unserem Abschluss hält.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Unsere Kosten steigen schneller als unsere Preise.', decision: 'Wo eingreifen (Einkauf, Prozesse, Sortiment), ohne Qualität zu verlieren.', deliverable: 'Kostenkarte je Etappe und bezifferter Gewinnplan.', format: 'Wenige Wochen', cycles: ['croissance'] },
        { quote: 'Unsere Fristen und unsere Qualität schwanken von Auftrag zu Auftrag.', decision: 'Welche Prozesse standardisieren, welche massgeschneidert lassen.', deliverable: 'Kartierung der Schlüsselprozesse, Serviceindikatoren, Standardisierungsplan.', format: 'Kurzer Einsatz', cycles: ['croissance'] },
        { quote: 'Ein kritischer Lieferant bringt uns in Gefahr.', decision: 'Diversifizieren, bevorraten oder integrieren.', deliverable: 'Karte der Lieferantenabhängigkeit und Absicherungsplan (Zweitquelle, Sicherheitsbestand).', format: 'Wenige Wochen', cycles: ['croissance', 'restructuration'] },
        { quote: 'Unsere Kapazitäten sind unterausgelastet, oder gesättigt.', decision: 'Investieren, fremdvergeben oder reorganisieren.', deliverable: 'Analyse der Kapazitätsengpässe und drei bezifferte Szenarien.', format: 'Ein bis zwei Monate', cycles: ['croissance'] },
        { quote: 'Wir müssen Kosten senken, ohne das Unternehmen zu beschädigen.', decision: 'Welche Kosten, in welcher Reihenfolge, mit welchem Risiko für die Teams.', deliverable: 'Bezifferter Senkungsplan je Hebel, mit Zeitplan und Abbruchkriterien, unter Beachtung der Informations- und Konsultationspflichten gegenüber dem Personal.', format: 'Drei bis sechs Monate', cycles: ['restructuration'] },
        { quote: 'Wir übernehmen eine Tätigkeit: wie bringen wir das Ganze zum Laufen?', decision: 'Welche Standorte, Prozesse und Lieferanten behalten werden.', deliverable: 'Operativer Integrationsplan (Standorte, Einkauf, Systeme).', format: 'Ein bis zwei Monate', cycles: ['acquisition'] },
      ],
    },
    services: {
      title: 'Unsere Leistungen: entscheiden (Rahmen setzen)',
      items: [
        'Den Fluss vom Auftrag bis zur Zahlung und seine Engpässe kartieren.',
        'Kosten, Fristen und Qualität Etappe für Etappe prüfen.',
        'Die Kapazität analysieren (Standorte, Teams, Anlagen) und zwischen Investieren, Fremdvergabe und Reorganisation vermitteln.',
        'Die Abhängigkeit von kritischen Lieferanten bewerten und den Absicherungsplan festlegen.',
        'Die Einkaufs- und Lagerpolitik definieren, im Zusammenhang mit dem Liquiditätsplan (Finanzen und Performance).',
        'Den Kostensenkungsplan und seine Risiken bemessen.',
      ],
    },
    framework: {
      name: 'Die Flusskarte, vom Auftrag bis zur Zahlung',
      intro: 'Ein zweiseitiges Dokument, das bei jeder Programmetappe aktualisiert wird.',
      axes: [
        { label: 'Echter Auftrag', desc: 'Einen echten Auftrag verfolgen, von der Kundenanfrage bis zur Zahlung.' },
        { label: 'Messung je Etappe', desc: 'Frist, Qualität und Kosten bei jeder Etappe messen.' },
        { label: 'Engpass', desc: 'Den Engpass identifizieren, der das Ganze begrenzt.' },
        { label: 'Einer nach dem anderen', desc: 'Nur einen Engpass nach dem anderen behandeln und das Ergebnis messen, bevor der nächste folgt.' },
      ],
      deliverable: 'Die Flusskarte und ihre Indikatorentafel, vom Team jede Woche gelesen.',
    },
    perspectives: {
      title: 'Um weiterzugehen',
      items: [
        { title: 'Industrie, Energie & Infrastruktur', href: '/industries/industrie-energie-infrastructure', kind: 'industrie' },
        { title: 'Handel, Dienstleistungen & Kundenerlebnis', href: '/industries/commerce-services-experience-client', kind: 'industrie' },
      ],
    },
    cta: { metier: 'operations' },
  },

  es: {
    key: 'operationsExcellence',
    path: '/advisory/operations-excellence',
    image: '/images/advisory/operations.webp',
    imageAlt: 'Transportador aéreo de rodillos en una fábrica, mecánica del flujo',
    meta: {
      title: 'Operaciones y Excelencia operativa: costes, plazos, calidad, suministro | Aegryn',
      description: 'Costes, plazos, calidad, capacidad y proveedores: Aegryn cartografía su flujo del pedido al cobro, decide dónde actuar primero y dirige la puesta en práctica con sus equipos. Suiza y Europa.',
      keywords: ['excelencia operativa pyme', 'mapa del flujo', 'reducción de costes', 'cuellos de botella', 'proveedores críticos', 'consultoría de operaciones Suiza'],
    },
    eyebrow: 'Operaciones y Excelencia operativa',
    h1: 'Encontrar el cuello de botella que lo limita todo.',
    subtitle: 'Costes, plazos, calidad, capacidad, proveedores: cuando los márgenes se estrechan, lo operativo decide. Aegryn cartografía su flujo del pedido al cobro, decide dónde actuar primero y dirige la puesta en práctica con sus equipos.',
    scope: [
      { label: 'La tesorería y el fondo de maniobra: Finanzas y Rendimiento', href: '/advisory/finance-performance' },
      { label: 'El plan de integración a 100 días: M&A', href: '/advisory/ma' },
      { label: 'Un director de operaciones interino: Selección', href: '/talent' },
      { label: 'El proyecto o programa puntual: Gestión de proyectos', href: '/advisory/project-program-management' },
    ],
    observation: {
      title: 'Lo que constatamos',
      cards: [
        { value: '≈ 1 de cada 4', label: 'empresas de la industria MEM (máquinas, electricidad, metales) tenían un margen EBIT negativo en 2025; un 29 % adicional apenas cubría sus costes de capital e I+D', source: 'Swissmem, agosto de 2026' },
        { value: '−3,8 %', label: 'de facturación de las pymes MEM en el primer semestre de 2026, frente a un +2,5 % del conjunto del sector; utilización de capacidades del 81,1 % en el T2 2026, frente a una media a largo plazo del 85,6 %', source: 'Swissmem, agosto de 2026' },
        { value: '70,0', label: 'índice de precios de compra de la industria suiza en septiembre de 2026 (50 = estabilidad), mientras el índice general sigue en expansión con 55,3', source: 'procure.ch–UBS, vía Trading Economics, 1 de oct. de 2026' },
      ],
      paragraphs: [
        'La recuperación es desigual: los pedidos repuntan y los grandes grupos se benefician, mientras las pymes ven caer su facturación y sus capacidades por debajo del nivel habitual. Al mismo tiempo, los precios de compra siguen tensos.',
        'Casi tres de cada cuatro pymes MEM consideran su situación desfavorable según la encuesta Swissmechanic de abril de 2026, y unas cuatro de cada diez vieron caer su margen en el primer trimestre. La brecha no se cierra con el esfuerzo de todos: se cierra tratando el punto correcto primero.',
      ],
      change: 'Una mejora que nadie mide desaparece en seis meses. La pregunta no es «¿qué podemos optimizar?», sino «¿qué cuello de botella limita el conjunto, y cómo sabremos que está resuelto?».',
    },
    outcomes: {
      title: 'Lo que usted obtiene',
      items: [
        'Un flujo medido de principio a fin, con un indicador por etapa.',
        'Ganancias verificables, ligadas a una palanca y a un responsable.',
        'Una organización que mantiene las mejoras después de nuestra salida.',
      ],
    },
    situations: {
      title: 'Dónde está usted. Cómo intervenimos.',
      items: [
        { quote: 'Nuestros costes suben más rápido que nuestros precios.', decision: 'Dónde actuar (compras, procesos, gama) sin perder calidad.', deliverable: 'Mapa de costes por etapa y plan de ganancias cifrado.', format: 'Algunas semanas', cycles: ['croissance'] },
        { quote: 'Nuestros plazos y nuestra calidad varían de un pedido a otro.', decision: 'Qué procesos estandarizar, cuáles dejar a medida.', deliverable: 'Cartografía de los procesos clave, indicadores de servicio, plan de estandarización.', format: 'Misión corta', cycles: ['croissance'] },
        { quote: 'Un proveedor crítico nos pone en riesgo.', decision: 'Diversificar, almacenar o integrar.', deliverable: 'Mapa de dependencia de proveedores y plan de segurización (segunda fuente, stock de seguridad).', format: 'Algunas semanas', cycles: ['croissance', 'restructuration'] },
        { quote: 'Nuestras capacidades están infrautilizadas, o saturadas.', decision: 'Invertir, subcontratar o reorganizar.', deliverable: 'Análisis de los cuellos de botella de capacidad y tres escenarios cifrados.', format: 'Uno a dos meses', cycles: ['croissance'] },
        { quote: 'Debemos reducir costes sin dañar la empresa.', decision: 'Qué costes, en qué orden, con qué riesgo para los equipos.', deliverable: 'Plan de reducción cifrado por palanca, con calendario y criterios de parada, respetando las obligaciones de información y consulta del personal.', format: 'Tres a seis meses', cycles: ['restructuration'] },
        { quote: 'Retomamos una actividad: ¿cómo hacer funcionar el conjunto?', decision: 'Qué sitios, procesos y proveedores conservar.', deliverable: 'Plan de integración operativa (sitios, compras, sistemas).', format: 'Uno a dos meses', cycles: ['acquisition'] },
      ],
    },
    services: {
      title: 'Nuestros servicios: decidir (Encuadrar)',
      items: [
        'Cartografiar el flujo del pedido al cobro y sus cuellos de botella.',
        'Diagnosticar costes, plazos y calidad etapa por etapa.',
        'Analizar la capacidad (sitios, equipos, instalaciones) y arbitrar entre invertir, subcontratar o reorganizar.',
        'Evaluar la dependencia de proveedores críticos y definir el plan de segurización.',
        'Definir la política de compras e inventarios, en relación con el plan de tesorería (Finanzas y Rendimiento).',
        'Dimensionar el plan de reducción de costes y sus riesgos.',
      ],
    },
    framework: {
      name: 'El Mapa del flujo, del pedido al cobro',
      intro: 'Un documento de dos páginas, actualizado en cada etapa del programa.',
      axes: [
        { label: 'Pedido real', desc: 'Seguir un pedido real, de la demanda del cliente al pago.' },
        { label: 'Medición por etapa', desc: 'Medir plazo, calidad y coste en cada etapa.' },
        { label: 'Cuello de botella', desc: 'Identificar el cuello de botella que limita el conjunto.' },
        { label: 'De uno en uno', desc: 'Tratar un solo cuello de botella cada vez, y medir el resultado antes de pasar al siguiente.' },
      ],
      deliverable: 'El mapa del flujo y su cuadro de indicadores, releídos cada semana por el equipo.',
    },
    perspectives: {
      title: 'Para ir más lejos',
      items: [
        { title: 'Industria, Energía e Infraestructuras', href: '/industries/industrie-energie-infrastructure', kind: 'industrie' },
        { title: 'Comercio, Servicios y Experiencia de cliente', href: '/industries/commerce-services-experience-client', kind: 'industrie' },
      ],
    },
    cta: { metier: 'operations' },
  },

  it: {
    key: 'operationsExcellence',
    path: '/advisory/operations-excellence',
    image: '/images/advisory/operations.webp',
    imageAlt: 'Trasportatore aereo a rulli in una fabbrica, meccanica del flusso',
    meta: {
      title: 'Operazioni ed Eccellenza operativa: costi, tempi, qualità, approvvigionamento | Aegryn',
      description: 'Costi, tempi di consegna, qualità, capacità e fornitori: Aegryn mappa il vostro flusso dall’ordine all’incasso, decide dove agire prima e guida l’attuazione con i vostri team. Svizzera ed Europa.',
      keywords: ['eccellenza operativa PMI', 'mappa del flusso', 'riduzione dei costi', 'colli di bottiglia produttivi', 'fornitori critici', 'consulenza operazioni Svizzera'],
    },
    eyebrow: 'Operazioni ed Eccellenza operativa',
    h1: 'Trovare il collo di bottiglia che limita tutto il resto.',
    subtitle: 'Costi, tempi, qualità, capacità, fornitori: quando i margini si assottigliano, l’operatività decide. Aegryn mappa il vostro flusso dall’ordine all’incasso, decide dove agire prima e guida l’attuazione con i vostri team.',
    scope: [
      { label: 'La tesoreria e il capitale circolante: Finanza e Performance', href: '/advisory/finance-performance' },
      { label: 'Il piano di integrazione a 100 giorni: M&A', href: '/advisory/ma' },
      { label: 'Un direttore delle operazioni ad interim: Selezione', href: '/talent' },
      { label: 'Il progetto o programma puntuale: Gestione progetti', href: '/advisory/project-program-management' },
    ],
    observation: {
      title: 'Cosa constatiamo',
      cards: [
        { value: '≈ 1 su 4', label: 'imprese dell’industria MEM (macchine, elettricità, metalli) avevano un margine EBIT negativo nel 2025; un altro 29 % copriva a malapena i costi di capitale e di R&S', source: 'Swissmem, agosto 2026' },
        { value: '−3,8 %', label: 'di fatturato delle PMI MEM nel primo semestre 2026, contro il +2,5 % dell’intero settore; utilizzo delle capacità all’81,1 % nel T2 2026, contro una media di lungo periodo dell’85,6 %', source: 'Swissmem, agosto 2026' },
        { value: '70,0', label: 'indice dei prezzi d’acquisto dell’industria svizzera a settembre 2026 (50 = stabilità), mentre l’indice complessivo resta in espansione a 55,3', source: 'procure.ch–UBS, via Trading Economics, 1° ott. 2026' },
      ],
      paragraphs: [
        'La ripresa è disomogenea: gli ordini ripartono e i grandi gruppi ne approfittano, mentre le PMI vedono calare il fatturato e le capacità girare sotto il livello abituale. Allo stesso tempo, i prezzi d’acquisto restano sotto tensione.',
        'Quasi tre PMI MEM su quattro giudicano sfavorevole la propria situazione secondo l’indagine Swissmechanic di aprile 2026, e circa quattro su dieci hanno visto calare il margine nel primo trimestre. Il divario non si colma con lo sforzo di tutti: si colma trattando prima il punto giusto.',
      ],
      change: 'Un miglioramento che nessuno misura scompare in sei mesi. La domanda non è «cosa possiamo ottimizzare?», ma «quale collo di bottiglia limita l’insieme, e come sapremo che è risolto?».',
    },
    outcomes: {
      title: 'Cosa ottenete',
      items: [
        'Un flusso misurato da un capo all’altro, con un indicatore per tappa.',
        'Guadagni verificabili, legati a una leva e a un responsabile.',
        'Un’organizzazione che mantiene i miglioramenti dopo la nostra uscita.',
      ],
    },
    situations: {
      title: 'Dove siete. Come interveniamo.',
      items: [
        { quote: 'I nostri costi salgono più in fretta dei nostri prezzi.', decision: 'Dove agire (acquisti, processi, gamma) senza perdere in qualità.', deliverable: 'Mappa dei costi per tappa e piano dei guadagni numerico.', format: 'Alcune settimane', cycles: ['croissance'] },
        { quote: 'I nostri tempi e la nostra qualità variano da un ordine all’altro.', decision: 'Quali processi standardizzare, quali lasciare su misura.', deliverable: 'Mappatura dei processi chiave, indicatori di servizio, piano di standardizzazione.', format: 'Mandato breve', cycles: ['croissance'] },
        { quote: 'Un fornitore critico ci mette a rischio.', decision: 'Diversificare, stoccare o integrare.', deliverable: 'Mappa della dipendenza dai fornitori e piano di messa in sicurezza (seconda fonte, scorta di sicurezza).', format: 'Alcune settimane', cycles: ['croissance', 'restructuration'] },
        { quote: 'Le nostre capacità sono sotto utilizzate, o sature.', decision: 'Investire, esternalizzare o riorganizzare.', deliverable: 'Analisi dei colli di bottiglia di capacità e tre scenari numerici.', format: 'Uno a due mesi', cycles: ['croissance'] },
        { quote: 'Dobbiamo ridurre i costi senza danneggiare l’impresa.', decision: 'Quali costi, in quale ordine, con quale rischio per i team.', deliverable: 'Piano di riduzione numerico per leva, con calendario e criteri di arresto, nel rispetto degli obblighi di informazione e consultazione del personale.', format: 'Tre a sei mesi', cycles: ['restructuration'] },
        { quote: 'Rileviamo un’attività: come far funzionare l’insieme?', decision: 'Quali siti, processi e fornitori mantenere.', deliverable: 'Piano di integrazione operativa (siti, acquisti, sistemi).', format: 'Uno a due mesi', cycles: ['acquisition'] },
      ],
    },
    services: {
      title: 'I nostri servizi: decidere (Inquadrare)',
      items: [
        'Mappare il flusso dall’ordine all’incasso e i suoi colli di bottiglia.',
        'Diagnosticare costi, tempi e qualità tappa per tappa.',
        'Analizzare la capacità (siti, team, impianti) e arbitrare tra investire, esternalizzare o riorganizzare.',
        'Valutare la dipendenza dai fornitori critici e definire il piano di messa in sicurezza.',
        'Definire la politica di acquisti e scorte, in relazione al piano di tesoreria (Finanza e Performance).',
        'Dimensionare il piano di riduzione dei costi e i suoi rischi.',
      ],
    },
    framework: {
      name: 'La Mappa del flusso, dall’ordine all’incasso',
      intro: 'Un documento di due pagine, aggiornato a ogni tappa del programma.',
      axes: [
        { label: 'Ordine reale', desc: 'Seguire un ordine reale, dalla richiesta del cliente al pagamento.' },
        { label: 'Misura per tappa', desc: 'Misurare tempi, qualità e costi a ogni tappa.' },
        { label: 'Collo di bottiglia', desc: 'Identificare il collo di bottiglia che limita l’insieme.' },
        { label: 'Uno alla volta', desc: 'Trattare un solo collo di bottiglia alla volta, e misurare il risultato prima di passare al successivo.' },
      ],
      deliverable: 'La mappa del flusso e il suo quadro di indicatori, riletti ogni settimana dal team.',
    },
    perspectives: {
      title: 'Per andare oltre',
      items: [
        { title: 'Industria, Energia & Infrastrutture', href: '/industries/industrie-energie-infrastructure', kind: 'industrie' },
        { title: 'Commercio, Servizi & Esperienza cliente', href: '/industries/commerce-services-experience-client', kind: 'industrie' },
      ],
    },
    cta: { metier: 'operations' },
  },

  nl: {
    key: 'operationsExcellence',
    path: '/advisory/operations-excellence',
    image: '/images/advisory/operations.webp',
    imageAlt: 'Hangende rollenbaan in een fabriek, stroommechanica',
    meta: {
      title: 'Operations en Operationele excellentie: kosten, doorlooptijden, kwaliteit, inkoop | Aegryn',
      description: 'Kosten, doorlooptijden, kwaliteit, capaciteit en leveranciers: Aegryn brengt uw stroom van bestelling tot betaling in kaart, beslist waar eerst te handelen en leidt de uitvoering met uw teams. Zwitserland en Europa.',
      keywords: ['operationele excellentie mkb', 'waardestroomkaart', 'kostenverlaging', 'knelpunten in de productie', 'kritieke leveranciers', 'operations advies Zwitserland'],
    },
    eyebrow: 'Operations en Operationele excellentie',
    h1: 'Vind het knelpunt dat al het andere begrenst.',
    subtitle: 'Kosten, doorlooptijden, kwaliteit, capaciteit, leveranciers: als de marges krimpen, beslissen de operaties. Aegryn brengt uw stroom van bestelling tot betaling in kaart, beslist waar eerst te handelen en leidt de uitvoering met uw teams.',
    scope: [
      { label: 'De liquiditeit en het werkkapitaal: Financiën en Prestaties', href: '/advisory/finance-performance' },
      { label: 'Het integratieplan van 100 dagen: M&A', href: '/advisory/ma' },
      { label: 'Een interim operations director: Selectie', href: '/talent' },
      { label: 'Het eenmalige project of programma: Projectmanagement', href: '/advisory/project-program-management' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '≈ 1 op 4', label: 'ondernemingen in de MEM-industrie (machines, elektro, metalen) hadden in 2025 een negatieve EBIT-marge; nog eens 29 % dekten nauwelijks hun kapitaal- en R&D-kosten', source: 'Swissmem, augustus 2026' },
        { value: '−3,8 %', label: 'omzet van MEM-mkb’s in het eerste halfjaar van 2026, tegenover +2,5 % voor de hele sector; capaciteitsbenutting van 81,1 % in het tweede kwartaal van 2026, tegenover een langetermijngemiddelde van 85,6 %', source: 'Swissmem, augustus 2026' },
        { value: '70,0', label: 'inkoopprijsindex van de Zwitserse industrie in september 2026 (50 = stabiel), terwijl de algemene index met 55,3 in expansie blijft', source: 'procure.ch–UBS, via Trading Economics, 1 okt. 2026' },
      ],
      paragraphs: [
        'Het herstel is ongelijk: de bestellingen keren terug en de groot concerns profiteren, terwijl het mkb zijn omzet ziet dalen en zijn capaciteit onder het gebruikelijke niveau draait. Tegelijk blijven de inkoopprijzen onder druk.',
        'Bijna drie van vier MEM-mkb’s beoordelen hun situatie als ongunstig, volgens de Swissmechanic-enquête van april 2026, en ongeveer vier van tien zagen hun marge in het eerste kwartaal dalen. De kloof sluit niet door inspanning van iedereen: hij sluit door eerst het juiste punt aan te pakken.',
      ],
      change: 'Een verbetering die niemand meet, verdwijnt binnen zes maanden. De vraag is niet «wat kunnen we optimaliseren?», maar «welk knelpunt begrenst het geheel, en hoe weten we dat het opgelost is?».',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een van begin tot eind gemeten stroom, met een indicator per etappe.',
        'Verifieerbare winst, gekoppeld aan een hefboom en een verantwoordelijke.',
        'Een organisatie die de verbeteringen na ons vertrek vasthoudt.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Onze kosten stijgen sneller dan onze prijzen.', decision: 'Waar ingrijpen (inkoop, processen, assortiment) zonder kwaliteitsverlies.', deliverable: 'Kostenkaart per etappe en becijferd winstplan.', format: 'Enkele weken', cycles: ['croissance'] },
        { quote: 'Onze doorlooptijden en kwaliteit variëren per bestelling.', decision: 'Welke processen standaardiseren, welke op maat houden.', deliverable: 'Kartering van de kernprocessen, service-indicatoren, standaardiseringsplan.', format: 'Korte opdracht', cycles: ['croissance'] },
        { quote: 'Een kritieke leverancier brengt ons in gevaar.', decision: 'Diversifiëren, opslaan of integreren.', deliverable: 'Kaart van leveranciersafhankelijkheid en beveiligingsplan (tweede bron, veiligheidsvoorraad).', format: 'Enkele weken', cycles: ['croissance', 'restructuration'] },
        { quote: 'Onze capaciteit is onderbenut, of verzadigd.', decision: 'Investeren, uitbesteden of reorganiseren.', deliverable: 'Analyse van de capaciteitsknelpunten en drie becijferde scenario’s.', format: 'Eén tot twee maanden', cycles: ['croissance'] },
        { quote: 'We moeten kosten verlagen zonder het bedrijf te beschadigen.', decision: 'Welke kosten, in welke volgorde, met welk risico voor de teams.', deliverable: 'Becijferd verlagingsplan per hefboom, met tijdschema en stopcriteria, met inachtneming van de informatie- en consultatieplichten jegens het personeel.', format: 'Drie tot zes maanden', cycles: ['restructuration'] },
        { quote: 'We nemen een activiteit over: hoe krijgen we het geheel draaiende?', decision: 'Welke vestigingen, processen en leveranciers behouden.', deliverable: 'Operationeel integratieplan (vestigingen, inkoop, systemen).', format: 'Eén tot twee maanden', cycles: ['acquisition'] },
      ],
    },
    services: {
      title: 'Onze diensten: beslissen (Kaderen)',
      items: [
        'De stroom van bestelling tot betaling en zijn knelpunten in kaart brengen.',
        'Kosten, doorlooptijden en kwaliteit etappe voor etappe diagnosticeren.',
        'De capaciteit analyseren (vestigingen, teams, installaties) en bemiddelen tussen investeren, uitbesteden of reorganiseren.',
        'De afhankelijkheid van kritieke leveranciers beoordelen en het beveiligingsplan definiëren.',
        'Het inkoop- en voorraadbeleid vastleggen, in verband met het kasplan (Financiën en Prestaties).',
        'Het kostenverlagingsplan en zijn risico’s dimensioneren.',
      ],
    },
    framework: {
      name: 'De Stroomkaart, van bestelling tot betaling',
      intro: 'Een document van twee pagina’s, bijgewerkt bij elke programma-etappe.',
      axes: [
        { label: 'Echte bestelling', desc: 'Een echte bestelling volgen, van klantvraag tot betaling.' },
        { label: 'Meting per etappe', desc: 'Doorlooptijd, kwaliteit en kosten meten bij elke etappe.' },
        { label: 'Knelpunt', desc: 'Het knelpunt identificeren dat het geheel begrenst.' },
        { label: 'Eén per keer', desc: 'Slechts één knelpunt per keer behandelen, en het resultaat meten voor de volgende.' },
      ],
      deliverable: 'De stroomkaart en zijn indicatorenbord, wekelijks gelezen door het team.',
    },
    perspectives: {
      title: 'Om verder te gaan',
      items: [
        { title: 'Industrie, Energie & Infrastructuur', href: '/industries/industrie-energie-infrastructure', kind: 'industrie' },
        { title: 'Handel, Diensten & Klantbeleving', href: '/industries/commerce-services-experience-client', kind: 'industrie' },
      ],
    },
    cta: { metier: 'operations' },
  },
}
