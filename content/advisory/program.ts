/**
 * Métier PILOTAGE DE PROJETS ET DE PROGRAMMES (/advisory/project-program-management).
 * Contenu rédigé avec l'utilisateur en octobre 2026 ; structure des pages métier.
 * « Piloter » n'apparaît que dans le bloc Mettre en œuvre ; le cadrage parle de
 * gouvernance, comme convenu. Le chiffre McKinsey/Oxford date de 2012 (grands
 * projets informatiques) : signalé dans la ligne des sources.
 */
import type { AdvisoryPageContent } from './types'

export const ADVISORY_PROGRAM: Record<string, AdvisoryPageContent> = {
  fr: {
    key: 'projectProgram',
    path: '/advisory/project-program-management',
    image: '/images/advisory/program.webp',
    imageAlt: 'Responsable de projet devant un tableau de pilotage à post-its',
    meta: {
      title: 'Pilotage de projets et de programmes : cadrage, gouvernance, redressement | Aegryn',
      description: 'Cadrage, gouvernance et redressement de projets et de programmes : Aegryn cadre vos initiatives, arbitre le portefeuille et conduit l’exécution avec vos équipes. Suisse et Europe.',
      keywords: ['pilotage de projet', 'cadrage de projet', 'gouvernance de programme', 'redressement de projet', 'PMO', 'conseil gestion de projet Suisse'],
    },
    eyebrow: 'Pilotage de projets et de programmes',
    h1: 'Un projet se gagne au cadrage, pas à la livraison.',
    subtitle: 'Un projet qui dérape l’a presque toujours fait dès le départ : périmètre flou, bénéfice non défini, décideur absent. Aegryn cadre vos projets et vos programmes, arbitre le portefeuille, puis met en place la gouvernance et conduit l’exécution avec vos équipes.',
    scope: [
      { label: 'L’amélioration continue (processus, achats, coûts) : Opérations', href: '/advisory/operations-excellence' },
      { label: 'Le développement sur mesure et ses sprints : Technologie', href: '/advisory/technology' },
      { label: 'La conduite du changement : Talent et Organisation', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '+45 % / −56 %', label: 'les grands projets informatiques (plus de 15 M USD) dépassent leur budget de 45 % en moyenne et livrent 56 % de valeur en moins que prévu', source: 'McKinsey et Université d’Oxford, 2012' },
        { value: '18 %', label: 'des professionnels de projet seulement ont un haut niveau de compréhension du business ; les équipes qui l’ont atteignent leurs objectifs dans 83 % des cas, contre 78 %', source: 'PMI, Pulse of the Profession, mars 2025' },
        { value: '24 rapports', label: 'du Contrôle fédéral des finances sur les projets informatiques clés de la Confédération (2024-2025) : planification incomplète, utilité mal expliquée, passage en exploitation mal préparé. « Les mêmes erreurs qu’il y a dix ans »', source: 'CDF, 8 juillet 2026' },
      ],
      paragraphs: [
        'Les trois constats disent la même chose : l’exécution est rarement le problème. Les causes se trouvent avant : un bénéfice qui n’a jamais été chiffré, un périmètre qui bouge, une exploitation qui n’a pas été préparée.',
        'Ces erreurs ne tiennent pas à la taille de l’organisation : l’administration fédérale les répète depuis dix ans, et une PME les paie plus vite, faute de marge pour absorber le dérapage.',
      ],
      change: 'Une méthode de gestion de projet ne suffit pas. Il faut un cadrage qui nomme le bénéfice attendu, un décideur qui tranche, et un seuil à partir duquel on arrête ou on corrige.',
      sources: 'Sources : McKinsey & Université d’Oxford, 2012 (grands projets informatiques de plus de 15 M USD) · PMI, Pulse of the Profession, mars 2025 · Contrôle fédéral des finances, 8 juillet 2026 (24 rapports sur les projets informatiques de la Confédération, 2024-2025).',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Un projet cadré : bénéfice chiffré, périmètre, décideur et critères d’arrêt.',
        'Une gouvernance légère, qui produit des décisions et pas seulement des rapports.',
        'Une livraison qui passe en exploitation, avec une équipe prête à la reprendre.',
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Nous avons trop de projets en parallèle, et rien n’avance.', decision: 'Lesquels poursuivre, suspendre, arrêter.', deliverable: 'Revue de portefeuille priorisée, avec capacité et bénéfice par projet.', format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'Un projet important démarre : comment le lancer proprement ?', decision: 'Quel périmètre, quel bénéfice, quel décideur.', deliverable: 'Note de cadrage : bénéfice, périmètre, jalons, budget, risques, critères d’arrêt.', format: 'Quelques semaines', cycles: ['lancement'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Notre projet dérape (délai, budget, qualité).', decision: 'Corriger, redimensionner ou arrêter.', deliverable: 'Diagnostic de redressement et plan de reprise en trente jours.', format: 'Deux à quatre semaines', cycles: ['restructuration'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'Nous lançons une transformation qui touche plusieurs équipes.', decision: 'Comment gouverner, qui décide, à quel rythme.', deliverable: 'Modèle de gouvernance : instances, rôles, décisions réservées, tableau de bord.', format: 'Un à deux mois', cycles: ['croissance'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'Le fournisseur ou l’intégrateur ne tient pas ses engagements.', decision: 'Renégocier, renforcer, remplacer.', deliverable: 'Revue du contrat et du plan de livraison, avec options chiffrées.', format: 'Quelques semaines', cycles: ['restructuration', 'croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'Le projet est livré, mais personne ne s’en sert.', decision: 'Comment réussir le passage en exploitation.', deliverable: 'Plan de transfert à l’exploitation : critères de réception, formation, responsabilités.', format: 'Quelques semaines', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
      ],
    },
    services: {
      title: 'Nos services : décider (Cadrer)',
      items: [
        'Rédiger la note de cadrage d’un projet ou d’un programme : bénéfice, périmètre, jalons, budget, risques.',
        'Évaluer et prioriser le portefeuille de projets selon bénéfice et capacité.',
        'Définir le modèle de gouvernance : instances, rôles, seuils de décision.',
        'Diagnostiquer un projet en difficulté et recommander : corriger, redimensionner, arrêter.',
        'Revoir un contrat ou un plan de livraison avec un fournisseur ou un intégrateur.',
        'Définir les critères de réception et le plan de transfert à l’exploitation.',
      ],
    },
    framework: {
      name: 'Le Test des trois questions',
      intro: 'Avant de lancer, de poursuivre ou d’arrêter un projet, trois questions, par écrit.',
      axes: [
        { label: 'Quel bénéfice ?', desc: 'Mesuré comment, et d’ici quand ? Sans chiffre, le projet n’est pas cadré.' },
        { label: 'Qui tranche ?', desc: 'Un nom, pas une instance.' },
        { label: 'À quel signal arrête-t-on ?', desc: 'Un seuil fixé avant de commencer, pas après.' },
      ],
      deliverable: 'La note de cadrage : trois réponses écrites, signées par le décideur.',
    },
    perspectives: { title: 'Pour aller plus loin', items: [] },
    cta: { metier: 'program' },
  },

  en: {
    key: 'projectProgram',
    path: '/advisory/project-program-management',
    image: '/images/advisory/program.webp',
    imageAlt: 'Project lead in front of a sticky-note steering board',
    meta: {
      title: 'Project and Programme Management: framing, governance, turnaround | Aegryn',
      description: 'Framing, governance and turnaround of projects and programmes: Aegryn frames your initiatives, arbitrates the portfolio and leads delivery with your teams. Switzerland and Europe.',
      keywords: ['project steering', 'project framing', 'programme governance', 'project turnaround', 'PMO', 'project management advisory Switzerland'],
    },
    eyebrow: 'Project and Programme Management',
    h1: 'A project is won at framing, not at delivery.',
    subtitle: 'A project that drifts has almost always done so from the start: blurred scope, undefined benefit, absent sponsor. Aegryn frames your projects and programmes, arbitrates the portfolio, then installs governance and leads delivery with your teams.',
    scope: [
      { label: 'Continuous improvement (processes, purchasing, costs): Operations', href: '/advisory/operations-excellence' },
      { label: 'Custom development and its sprints: Technology', href: '/advisory/technology' },
      { label: 'Change management: Talent and Organisation', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '+45% / −56%', label: 'large IT projects (over USD 15M) overrun their budget by 45% on average and deliver 56% less value than expected', source: 'McKinsey and University of Oxford, 2012' },
        { value: '18%', label: 'of project professionals have a high level of business acumen; teams that do meet their objectives in 83% of cases, versus 78%', source: 'PMI, Pulse of the Profession, March 2025' },
        { value: '24 reports', label: 'from the Swiss Federal Audit Office on the Confederation’s key IT projects (2024-2025): incomplete planning, poorly explained usefulness, badly prepared handover to operations. “The same mistakes as ten years ago”', source: 'SFAO, 8 July 2026' },
      ],
      paragraphs: [
        'All three findings say the same thing: execution is rarely the problem. The causes lie upstream: a benefit that was never costed, a scope that keeps moving, an operations handover that was never prepared.',
        'These mistakes do not depend on size: the federal administration has repeated them for ten years, and an SME pays for them sooner, lacking the margin to absorb the drift.',
      ],
      change: 'A project-management method is not enough. You need a framing that names the expected benefit, a decider who rules, and a threshold at which you stop or correct.',
      sources: 'Sources: McKinsey & University of Oxford, 2012 (large IT projects over USD 15M) · PMI, Pulse of the Profession, March 2025 · Swiss Federal Audit Office, 8 July 2026 (24 reports on Confederation IT projects, 2024-2025).',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'A framed project: costed benefit, scope, decider and stop criteria.',
        'A light governance that produces decisions, not just reports.',
        'A delivery that goes live, with a team ready to take it over.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'We have too many projects running in parallel, and nothing moves.', decision: 'Which to continue, pause or stop.', deliverable: 'A prioritised portfolio review, with capacity and benefit per project.', format: 'A few weeks', cycles: ['croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'An important project is starting: how do we launch it properly?', decision: 'Which scope, which benefit, which decider.', deliverable: 'Framing note: benefit, scope, milestones, budget, risks, stop criteria.', format: 'A few weeks', cycles: ['lancement'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Our project is drifting (deadline, budget, quality).', decision: 'Correct, rescope or stop.', deliverable: 'Turnaround diagnosis and a thirty-day recovery plan.', format: 'Two to four weeks', cycles: ['restructuration'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'We are launching a transformation that touches several teams.', decision: 'How to govern, who decides, at what pace.', deliverable: 'Governance model: bodies, roles, reserved decisions, dashboard.', format: 'One to two months', cycles: ['croissance'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'The vendor or integrator is not keeping its commitments.', decision: 'Renegotiate, reinforce or replace.', deliverable: 'Review of the contract and delivery plan, with costed options.', format: 'A few weeks', cycles: ['restructuration', 'croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'The project is delivered, but nobody uses it.', decision: 'How to succeed in the handover to operations.', deliverable: 'Operations transfer plan: acceptance criteria, training, responsibilities.', format: 'A few weeks', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
      ],
    },
    services: {
      title: 'What we do: deciding (Frame)',
      items: [
        'Write the framing note for a project or programme: benefit, scope, milestones, budget, risks.',
        'Assess and prioritise the project portfolio by benefit and capacity.',
        'Define the governance model: bodies, roles, decision thresholds.',
        'Diagnose a struggling project and recommend: correct, rescope, stop.',
        'Review a contract or delivery plan with a vendor or integrator.',
        'Define acceptance criteria and the transfer plan to operations.',
      ],
    },
    framework: {
      name: 'The Three-Question Test',
      intro: 'Before launching, continuing or stopping a project, three questions, in writing.',
      axes: [
        { label: 'What benefit?', desc: 'Measured how, and by when? Without a figure, the project is not framed.' },
        { label: 'Who decides?', desc: 'A name, not a committee.' },
        { label: 'At what signal do we stop?', desc: 'A threshold set before starting, not after.' },
      ],
      deliverable: 'The framing note: three written answers, signed by the decider.',
    },
    perspectives: { title: 'Going further', items: [] },
    cta: { metier: 'program' },
  },

  de: {
    key: 'projectProgram',
    path: '/advisory/project-program-management',
    image: '/images/advisory/program.webp',
    imageAlt: 'Projektverantwortlicher vor einem Steuerungsboard mit Haftnotizen',
    meta: {
      title: 'Projekt- und Programmsteuerung: Rahmung, Governance, Sanierung | Aegryn',
      description: 'Rahmung, Governance und Sanierung von Projekten und Programmen: Aegryn rahmt Ihre Initiativen ein, vermittelt das Portfolio und leitet die Umsetzung mit Ihren Teams. Schweiz und Europa.',
      keywords: ['Projektsteuerung', 'Projektrahmung', 'Programm-Governance', 'Projektsanierung', 'PMO', 'Projektmanagement-Beratung Schweiz'],
    },
    eyebrow: 'Projekt- und Programmsteuerung',
    h1: 'Ein Projekt wird bei der Rahmung gewonnen, nicht bei der Lieferung.',
    subtitle: 'Ein Projekt, das aus dem Ruder läuft, tut das fast immer von Anfang an: unklarer Umfang, nicht definierter Nutzen, fehlender Entscheider. Aegryn rahmt Ihre Projekte und Programme ein, vermittelt das Portfolio, führt dann die Governance ein und leitet die Umsetzung mit Ihren Teams.',
    scope: [
      { label: 'Kontinuierliche Verbesserung (Prozesse, Einkauf, Kosten): Operationen', href: '/advisory/operations-excellence' },
      { label: 'Massgeschneiderte Entwicklung und ihre Sprints: Technologie', href: '/advisory/technology' },
      { label: 'Change Management: Talent und Organisation', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Was wir feststellen',
      cards: [
        { value: '+45 % / −56 %', label: 'grosse IT-Projekte (über 15 Mio. USD) überschreiten ihr Budget im Schnitt um 45 % und liefern 56 % weniger Wert als geplant', source: 'McKinsey und Universität Oxford, 2012' },
        { value: '18 %', label: 'der Projektfachleute verfügen nur über ein hohes Geschäftsverständnis; Teams, die es haben, erreichen ihre Ziele in 83 % der Fälle, gegenüber 78 %', source: 'PMI, Pulse of the Profession, März 2025' },
        { value: '24 Berichte', label: 'der Eidgenössischen Finanzkontrolle zu den zentralen IT-Projekten des Bundes (2024-2025): unvollständige Planung, schlecht erklärter Nutzen, unvorbereiteter Betriebsübergang. «Dieselben Fehler wie vor zehn Jahren»', source: 'EFK, 8. Juli 2026' },
      ],
      paragraphs: [
        'Die drei Feststellungen sagen dasselbe: Die Umsetzung ist selten das Problem. Die Ursachen liegen davor: ein nie bezifferter Nutzen, ein sich bewegender Umfang, ein nicht vorbereiteter Betriebsübergang.',
        'Diese Fehler hängen nicht von der Grösse der Organisation ab: Die Bundesverwaltung wiederholt sie seit zehn Jahren, und ein KMU bezahlt sie schneller, ohne die Marge, um den Rutsch aufzufangen.',
      ],
      change: 'Eine Projektmanagement-Methode reicht nicht. Es braucht eine Rahmung, die den erwarteten Nutzen benennt, eine Entscheiderin oder einen Entscheider, und eine Schwelle, ab der gestoppt oder korrigiert wird.',
      sources: 'Quellen: McKinsey & Universität Oxford, 2012 (grosse IT-Projekte über 15 Mio. USD) · PMI, Pulse of the Profession, März 2025 · Eidgenössische Finanzkontrolle, 8. Juli 2026 (24 Berichte zu den IT-Projekten des Bundes, 2024-2025).',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Ein eingerahmtes Projekt: bezifferter Nutzen, Umfang, Entscheider und Abbruchkriterien.',
        'Eine schlanke Governance, die Entscheidungen hervorbringt, nicht nur Berichte.',
        'Eine Lieferung, die in den Betrieb geht, mit einem Team, das bereit ist, sie zu übernehmen.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Wir haben zu viele Projekte parallel, und nichts kommt voran.', decision: 'Welche weiterführen, pausieren oder stoppen.', deliverable: 'Priorisierte Portfolioüberprüfung, mit Kapazität und Nutzen je Projekt.', format: 'Wenige Wochen', cycles: ['croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'Ein wichtiges Projekt beginnt: wie starten wir es sauber?', decision: 'Welcher Umfang, welcher Nutzen, welcher Entscheider.', deliverable: 'Rahmungsnotiz: Nutzen, Umfang, Meilensteine, Budget, Risiken, Abbruchkriterien.', format: 'Wenige Wochen', cycles: ['lancement'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Unser Projekt läuft aus dem Ruder (Frist, Budget, Qualität).', decision: 'Korrigieren, neu bemessen oder stoppen.', deliverable: 'Sanierungsdiagnose und Wiederaufnahmeplan in dreissig Tagen.', format: 'Zwei bis vier Wochen', cycles: ['restructuration'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'Wir starten eine Transformation, die mehrere Teams berührt.', decision: 'Wie steuern, wer entscheidet, in welchem Rhythmus.', deliverable: 'Governance-Modell: Gremien, Rollen, vorbehaltene Entscheide, Dashboard.', format: 'Ein bis zwei Monate', cycles: ['croissance'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'Der Anbieter oder Integrator hält seine Zusagen nicht ein.', decision: 'Neu verhandeln, verstärken oder ersetzen.', deliverable: 'Überprüfung von Vertrag und Lieferplan, mit bezifferten Optionen.', format: 'Wenige Wochen', cycles: ['restructuration', 'croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'Das Projekt ist geliefert, aber niemand nutzt es.', decision: 'Wie der Übergang in den Betrieb gelingt.', deliverable: 'Betriebsübergabeplan: Abnahmekriterien, Schulung, Verantwortlichkeiten.', format: 'Wenige Wochen', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
      ],
    },
    services: {
      title: 'Unsere Leistungen: entscheiden (Rahmen)',
      items: [
        'Die Rahmungsnotiz eines Projekts oder Programms schreiben: Nutzen, Umfang, Meilensteine, Budget, Risiken.',
        'Das Projektportfolio nach Nutzen und Kapazität bewerten und priorisieren.',
        'Das Governance-Modell festlegen: Gremien, Rollen, Entscheidungsschwellen.',
        'Ein Projekt in Schwierigkeiten diagnostizieren und empfehlen: korrigieren, neu bemessen, stoppen.',
        'Einen Vertrag oder Lieferplan mit einem Anbieter oder Integrator prüfen.',
        'Die Abnahmekriterien und den Übergabeplan an den Betrieb festlegen.',
      ],
    },
    framework: {
      name: 'Der Drei-Fragen-Test',
      intro: 'Vor dem Start, der Fortsetzung oder dem Stopp eines Projekts, drei Fragen, schriftlich.',
      axes: [
        { label: 'Welcher Nutzen?', desc: 'Gemessen wie, und bis wann? Ohne Zahl ist das Projekt nicht eingerahmt.' },
        { label: 'Wer entscheidet?', desc: 'Ein Name, kein Gremium.' },
        { label: 'Bei welchem Signal wird gestoppt?', desc: 'Eine vor dem Beginn festgelegte Schwelle, nicht danach.' },
      ],
      deliverable: 'Die Rahmungsnotiz: drei schriftliche Antworten, vom Entscheider unterzeichnet.',
    },
    perspectives: { title: 'Um weiterzugehen', items: [] },
    cta: { metier: 'program' },
  },

  es: {
    key: 'projectProgram',
    path: '/advisory/project-program-management',
    image: '/images/advisory/program.webp',
    imageAlt: 'Responsable de proyecto ante un tablero de dirección con notas adhesivas',
    meta: {
      title: 'Gestión de proyectos y programas: encuadre, gobierno, reflotamiento | Aegryn',
      description: 'Encuadre, gobierno y reflotamiento de proyectos y programas: Aegryn encuadra sus iniciativas, arbitra la cartera y dirige la ejecución con sus equipos. Suiza y Europa.',
      keywords: ['dirección de proyectos', 'encuadre de proyecto', 'gobierno de programas', 'reflotamiento de proyecto', 'PMO', 'consultoría de gestión de proyectos Suiza'],
    },
    eyebrow: 'Gestión de proyectos y programas',
    h1: 'Un proyecto se gana en el encuadre, no en la entrega.',
    subtitle: 'Un proyecto que se desvía casi siempre lo hizo desde el inicio: alcance difuso, beneficio no definido, decisor ausente. Aegryn encuadra sus proyectos y programas, arbitra la cartera, establece el gobierno y dirige la ejecución con sus equipos.',
    scope: [
      { label: 'La mejora continua (procesos, compras, costes): Operaciones', href: '/advisory/operations-excellence' },
      { label: 'El desarrollo a medida y sus sprints: Tecnología', href: '/advisory/technology' },
      { label: 'La gestión del cambio: Talento y Organización', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Lo que constatamos',
      cards: [
        { value: '+45 % / −56 %', label: 'los grandes proyectos informáticos (más de 15 M USD) superan su presupuesto en un 45 % de media y entregan un 56 % menos de valor de lo previsto', source: 'McKinsey y Universidad de Oxford, 2012' },
        { value: '18 %', label: 'de los profesionales de proyecto tienen un alto nivel de comprensión del negocio; los equipos que lo tienen alcanzan sus objetivos en el 83 % de los casos, frente al 78 %', source: 'PMI, Pulse of the Profession, marzo de 2025' },
        { value: '24 informes', label: 'del Control Federal de Finanzas sobre los proyectos informáticos clave de la Confederación (2024-2025): planificación incompleta, utilidad mal explicada, traspaso a explotación mal preparado. «Los mismos errores que hace diez años»', source: 'CDF, 8 de julio de 2026' },
      ],
      paragraphs: [
        'Los tres constatos dicen lo mismo: la ejecución rara vez es el problema. Las causas están antes: un beneficio que nunca se cifró, un alcance que se mueve, una explotación que no se preparó.',
        'Estos errores no dependen del tamaño de la organización: la administración federal los repite desde hace diez años, y una pyme los paga antes, sin margen para absorber el desvío.',
      ],
      change: 'Un método de gestión de proyectos no basta. Hace falta un encuadre que nombre el beneficio esperado, un decisor que dicte, y un umbral a partir del cual se para o se corrige.',
      sources: 'Fuentes: McKinsey y Universidad de Oxford, 2012 (grandes proyectos informáticos de más de 15 M USD) · PMI, Pulse of the Profession, marzo de 2025 · Control Federal de Finanzas, 8 de julio de 2026 (24 informes sobre proyectos informáticos de la Confederación, 2024-2025).',
    },
    outcomes: {
      title: 'Lo que obtiene',
      items: [
        'Un proyecto encuadrado: beneficio cifrado, alcance, decisor y criterios de parada.',
        'Un gobierno ligero, que produce decisiones y no solo informes.',
        'Una entrega que pasa a explotación, con un equipo listo para retomarla.',
      ],
    },
    situations: {
      title: 'Dónde se encuentra. Cómo intervenimos.',
      items: [
        { quote: 'Tenemos demasiados proyectos en paralelo y nada avanza.', decision: 'Cuáles seguir, suspender o parar.', deliverable: 'Revisión de cartera priorizada, con capacidad y beneficio por proyecto.', format: 'Algunas semanas', cycles: ['croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'Empieza un proyecto importante: ¿cómo lanzarlo correctamente?', decision: 'Qué alcance, qué beneficio, qué decisor.', deliverable: 'Nota de encuadre: beneficio, alcance, hitos, presupuesto, riesgos, criterios de parada.', format: 'Algunas semanas', cycles: ['lancement'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Nuestro proyecto se desvía (plazo, presupuesto, calidad).', decision: 'Corregir, redimensionar o parar.', deliverable: 'Diagnóstico de reflotamiento y plan de reanudación en treinta días.', format: 'Dos a cuatro semanas', cycles: ['restructuration'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'Lanzamos una transformación que toca a varios equipos.', decision: 'Cómo gobernar, quién decide, a qué ritmo.', deliverable: 'Modelo de gobierno: instancias, roles, decisiones reservadas, cuadro de mando.', format: 'Uno a dos meses', cycles: ['croissance'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'El proveedor o el integrador no cumple sus compromisos.', decision: 'Renegociar, reforzar o reemplazar.', deliverable: 'Revisión del contrato y del plan de entrega, con opciones cifradas.', format: 'Algunas semanas', cycles: ['restructuration', 'croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'El proyecto está entregado, pero nadie lo usa.', decision: 'Cómo lograr el traspaso a explotación.', deliverable: 'Plan de traspaso a explotación: criterios de recepción, formación, responsabilidades.', format: 'Algunas semanas', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
      ],
    },
    services: {
      title: 'Nuestros servicios: decidir (Encuadrar)',
      items: [
        'Redactar la nota de encuadre de un proyecto o programa: beneficio, alcance, hitos, presupuesto, riesgos.',
        'Evaluar y priorizar la cartera de proyectos según beneficio y capacidad.',
        'Definir el modelo de gobierno: instancias, roles, umbrales de decisión.',
        'Diagnosticar un proyecto en dificultades y recomendar: corregir, redimensionar, parar.',
        'Revisar un contrato o un plan de entrega con un proveedor o integrador.',
        'Definir los criterios de recepción y el plan de traspaso a explotación.',
      ],
    },
    framework: {
      name: 'La Prueba de las tres preguntas',
      intro: 'Antes de lanzar, seguir o parar un proyecto, tres preguntas, por escrito.',
      axes: [
        { label: '¿Qué beneficio?', desc: '¿Medido cómo, y para cuándo? Sin cifra, el proyecto no está encuadrado.' },
        { label: '¿Quién decide?', desc: 'Un nombre, no una instancia.' },
        { label: '¿Con qué señal paramos?', desc: 'Un umbral fijado antes de empezar, no después.' },
      ],
      deliverable: 'La nota de encuadre: tres respuestas escritas, firmadas por el decisor.',
    },
    perspectives: { title: 'Para ir más lejos', items: [] },
    cta: { metier: 'program' },
  },

  it: {
    key: 'projectProgram',
    path: '/advisory/project-program-management',
    image: '/images/advisory/program.webp',
    imageAlt: 'Responsabile di progetto davanti a una lavagna di direzione con post-it',
    meta: {
      title: 'Gestione di progetti e programmi: inquadramento, governance, risanamento | Aegryn',
      description: 'Inquadramento, governance e risanamento di progetti e programmi: Aegryn inquadra le vostre iniziative, arbitra il portafoglio e guida l’esecuzione con i vostri team. Svizzera ed Europa.',
      keywords: ['direzione di progetto', 'inquadramento di progetto', 'governance di programma', 'risanamento di progetto', 'PMO', 'consulenza gestione progetti Svizzera'],
    },
    eyebrow: 'Gestione di progetti e programmi',
    h1: 'Un progetto si vince nell’inquadramento, non nella consegna.',
    subtitle: 'Un progetto che deraglia lo fa quasi sempre fin dall’inizio: perimetro sfumato, beneficio non definito, decisore assente. Aegryn inquadra i vostri progetti e programmi, arbitra il portafoglio, instaura la governance e guida l’esecuzione con i vostri team.',
    scope: [
      { label: 'Il miglioramento continuo (processi, acquisti, costi): Operazioni', href: '/advisory/operations-excellence' },
      { label: 'Lo sviluppo su misura e i suoi sprint: Tecnologia', href: '/advisory/technology' },
      { label: 'La gestione del cambiamento: Talento e Organizzazione', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Cosa constatiamo',
      cards: [
        { value: '+45 % / −56 %', label: 'i grandi progetti informatici (oltre 15 M USD) superano il budget del 45 % in media e consegnano il 56 % di valore in meno del previsto', source: 'McKinsey e Università di Oxford, 2012' },
        { value: '18 %', label: 'dei professionisti di progetto ha un alto livello di comprensione del business; i team che ce l’hanno raggiungono gli obiettivi nell’83 % dei casi, contro il 78 %', source: 'PMI, Pulse of the Profession, marzo 2025' },
        { value: '24 rapporti', label: 'del Controllo federale delle finanze sui principali progetti informatici della Confederazione (2024-2025): pianificazione incompleta, utilità mal spiegata, passaggio all’esercizio mal preparato. «Gli stessi errori di dieci anni fa»', source: 'CDF, 8 luglio 2026' },
      ],
      paragraphs: [
        'I tre constati dicono la stessa cosa: l’esecuzione è raramente il problema. Le cause stanno prima: un beneficio mai quantificato, un perimetro che si sposta, un passaggio all’esercizio mai preparato.',
        'Questi errori non dipendono dalle dimensioni dell’organizzazione: l’amministrazione federale li ripete da dieci anni, e una PMI li paga prima, senza il margine per assorbire lo scostamento.',
      ],
      change: 'Un metodo di gestione dei progetti non basta. Serve un inquadramento che nomini il beneficio atteso, un decisore che tranchi, e una soglia oltre la quale si arresta o si corregge.',
      sources: 'Fonti: McKinsey e Università di Oxford, 2012 (grandi progetti informatici oltre 15 M USD) · PMI, Pulse of the Profession, marzo 2025 · Controllo federale delle finanze, 8 luglio 2026 (24 rapporti sui progetti informatici della Confederazione, 2024-2025).',
    },
    outcomes: {
      title: 'Cosa ottenete',
      items: [
        'Un progetto inquadrato: beneficio quantificato, perimetro, decisore e criteri di arresto.',
        'Una governance leggera, che produce decisioni e non solo report.',
        'Una consegna che entra in esercizio, con un team pronto a riprenderla.',
      ],
    },
    situations: {
      title: 'Dove vi trovate. Come interveniamo.',
      items: [
        { quote: 'Abbiamo troppi progetti in parallelo e nulla avanza.', decision: 'Quali proseguire, sospendere o fermare.', deliverable: 'Revisione del portafoglio prioritizzata, con capacità e beneficio per progetto.', format: 'Alcune settimane', cycles: ['croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'Parte un progetto importante: come lanciarlo correttamente?', decision: 'Quale perimetro, quale beneficio, quale decisore.', deliverable: 'Nota di inquadramento: beneficio, perimetro, tappe, budget, rischi, criteri di arresto.', format: 'Alcune settimane', cycles: ['lancement'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Il nostro progetto deraglia (tempi, budget, qualità).', decision: 'Correggere, ridimensionare o fermare.', deliverable: 'Diagnosi di risanamento e piano di ripresa in trenta giorni.', format: 'Da due a quattro settimane', cycles: ['restructuration'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'Lanciamo una trasformazione che tocca diversi team.', decision: 'Come governare, chi decide, a quale ritmo.', deliverable: 'Modello di governance: istanze, ruoli, decisioni riservate, cruscotto.', format: 'Da uno a due mesi', cycles: ['croissance'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'Il fornitore o l’integratore non mantiene gli impegni.', decision: 'Rinegoziare, rafforzare o sostituire.', deliverable: 'Revisione del contratto e del piano di consegna, con opzioni numeriche.', format: 'Alcune settimane', cycles: ['restructuration', 'croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'Il progetto è consegnato, ma nessuno lo usa.', decision: 'Come riuscire il passaggio all’esercizio.', deliverable: 'Piano di trasferimento all’esercizio: criteri di collaudo, formazione, responsabilità.', format: 'Alcune settimane', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
      ],
    },
    services: {
      title: 'I nostri servizi: decidere (Inquadrare)',
      items: [
        'Redigere la nota di inquadramento di un progetto o programma: beneficio, perimetro, tappe, budget, rischi.',
        'Valutare e ordinare il portafoglio progetti per beneficio e capacità.',
        'Definire il modello di governance: istanze, ruoli, soglie di decisione.',
        'Diagnosticare un progetto in difficoltà e raccomandare: correggere, ridimensionare, fermare.',
        'Rivedere un contratto o un piano di consegna con un fornitore o integratore.',
        'Definire i criteri di collaudo e il piano di trasferimento all’esercizio.',
      ],
    },
    framework: {
      name: 'Il Test delle tre domande',
      intro: 'Prima di lanciare, proseguire o fermare un progetto, tre domande, per iscritto.',
      axes: [
        { label: 'Quale beneficio?', desc: 'Misurato come, ed entro quando? Senza cifra, il progetto non è inquadrato.' },
        { label: 'Chi decide?', desc: 'Un nome, non un’istanza.' },
        { label: 'A quale segnale ci fermiamo?', desc: 'Una soglia fissata prima di iniziare, non dopo.' },
      ],
      deliverable: 'La nota di inquadramento: tre risposte scritte, firmate dal decisore.',
    },
    perspectives: { title: 'Per andare oltre', items: [] },
    cta: { metier: 'program' },
  },

  nl: {
    key: 'projectProgram',
    path: '/advisory/project-program-management',
    image: '/images/advisory/program.webp',
    imageAlt: 'Projectverantwoordelijke voor een sturingsbord met post-its',
    meta: {
      title: 'Project- en programmamanagement: kadering, governance, sanering | Aegryn',
      description: 'Kadering, governance en sanering van projecten en programma’s: Aegryn kadert uw initiatieven, bemiddelt de portefeuille en leidt de uitvoering met uw teams. Zwitserland en Europa.',
      keywords: ['projectsturing', 'projectkadering', 'programmagovernance', 'projectsanering', 'PMO', 'projectmanagementadvies Zwitserland'],
    },
    eyebrow: 'Project- en programmamanagement',
    h1: 'Een project win je bij de kadering, niet bij de oplevering.',
    subtitle: 'Een project dat ontspoort, doet dat bijna altijd vanaf het begin: een vage scope, niet-gedefinieerde baten, een afwezige beslisser. Aegryn kadert uw projecten en programma’s, bemiddelt de portefeuille, richt vervolgens de governance in en leidt de uitvoering met uw teams.',
    scope: [
      { label: 'De continue verbetering (processen, inkoop, kosten): Operations', href: '/advisory/operations-excellence' },
      { label: 'Maatwerkontwikkeling en haar sprints: Technologie', href: '/advisory/technology' },
      { label: 'De veranderbegeleiding: Talent en Organisatie', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Wat wij constateren',
      cards: [
        { value: '+45 % / −56 %', label: 'grote IT-projecten (meer dan 15 mln USD) overschrijden hun budget gemiddeld met 45 % en leveren 56 % minder waarde dan gepland', source: 'McKinsey en Universiteit van Oxford, 2012' },
        { value: '18 %', label: 'van de projectprofessionals heeft een hoog zakelijk begrip; teams die dat hebben, bereiken hun doelen in 83 % van de gevallen, tegenover 78 %', source: 'PMI, Pulse of the Profession, maart 2025' },
        { value: '24 rapporten', label: 'van de federale Financiëncontrole over de belangrijkste IT-projecten van de Bondsstaat (2024-2025): onvolledige planning, slecht uitgelegd nut, slecht voorbereide overdracht naar beheer. «Dezelfde fouten als tien jaar geleden»', source: 'EFK, 8 juli 2026' },
      ],
      paragraphs: [
        'De drie constateringen zeggen hetzelfde: de uitvoering is zelden het probleem. De oorzaken liggen ervoor: een baten die nooit werd becijferd, een scope die beweegt, een overdracht naar beheer die niet werd voorbereid.',
        'Deze fouten hangen niet af van de omvang van de organisatie: de federale administratie herhaalt ze al tien jaar, en een mkb betaalt ze eerder, zonder de marge om de ontsporing op te vangen.',
      ],
      change: 'Een projectmanagementmethode is niet genoeg. Er is een kadering nodig die de verwachte baten benoemt, een beslisser die beslist, en een drempel waarop gestopt of bijgestuurd wordt.',
      sources: 'Bronnen: McKinsey en Universiteit van Oxford, 2012 (grote IT-projecten van meer dan 15 mln USD) · PMI, Pulse of the Profession, maart 2025 · Federale Financiëncontrole, 8 juli 2026 (24 rapporten over IT-projecten van de Bondsstaat, 2024-2025).',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een gekaderd project: becijferde baten, scope, beslisser en stopcriteria.',
        'Een lichte governance, die beslissingen oplevert en niet alleen rapporten.',
        'Een oplevering die in beheer overgaat, met een team dat klaar is om het over te nemen.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'We hebben te veel projecten tegelijk lopen, en niets komt vooruit.', decision: 'Welke voortzetten, pauzeren of stoppen.', deliverable: 'Een geprioriteerde portefeuillereview, met capaciteit en baten per project.', format: 'Enkele weken', cycles: ['croissance'], image: '/images/advisory/situations/planning-laptops.jpg' },
        { quote: 'Een belangrijk project start: hoe lanceren we het goed?', decision: 'Welke scope, welke baten, welke beslisser.', deliverable: 'Kaderingsnotitie: baten, scope, mijlpalen, budget, risico’s, stopcriteria.', format: 'Enkele weken', cycles: ['lancement'], image: '/images/advisory/situations/meeting-room.jpg' },
        { quote: 'Ons project ontspoort (termijn, budget, kwaliteit).', decision: 'Corrigeren, opschonen of stoppen.', deliverable: 'Saneringsdiagnose en herstelplan in dertig dagen.', format: 'Twee tot vier weken', cycles: ['restructuration'], image: '/images/advisory/situations/discussion-hands.jpg' },
        { quote: 'We lanceren een transformatie die meerdere teams raakt.', decision: 'Hoe sturen, wie beslist, in welk tempo.', deliverable: 'Governancemodel: organen, rollen, voorbehouden beslissingen, dashboard.', format: 'Eén tot twee maanden', cycles: ['croissance'], image: '/images/advisory/situations/open-office.jpg' },
        { quote: 'De leverancier of integrator houdt zijn toezeggingen niet na.', decision: 'Heronderhandelen, versterken of vervangen.', deliverable: 'Beoordeling van het contract en het leveringsplan, met becijferde opties.', format: 'Enkele weken', cycles: ['restructuration', 'croissance'], image: '/images/advisory/situations/handshake.jpg' },
        { quote: 'Het project is opgeleverd, maar niemand gebruikt het.', decision: 'Hoe de overdracht naar beheer lukt.', deliverable: 'Overdrachtsplan naar beheer: acceptatiecriteria, training, verantwoordelijkheden.', format: 'Enkele weken', cycles: ['croissance'], image: '/images/advisory/situations/laptop-phone.jpg' },
      ],
    },
    services: {
      title: 'Onze diensten: beslissen (Kaderen)',
      items: [
        'De kaderingsnotitie van een project of programma schrijven: baten, scope, mijlpalen, budget, risico’s.',
        'De projectenportefeuille beoordelen en prioriteren op baten en capaciteit.',
        'Het governancemodel definiëren: organen, rollen, beslissingsdrempels.',
        'Een project in moeilijkheden diagnosticeren en aanbevelen: corrigeren, opschonen, stoppen.',
        'Een contract of leveringsplan met een leverancier of integrator beoordelen.',
        'De acceptatiecriteria en het overdrachtsplan naar beheer definiëren.',
      ],
    },
    framework: {
      name: 'De Drie-vragen-test',
      intro: 'Voordat u een project start, voortzet of stopt, drie vragen, schriftelijk.',
      axes: [
        { label: 'Welke baten?', desc: 'Hoe gemeten, en tegen wanneer? Zonder cijfer is het project niet gekaderd.' },
        { label: 'Wie beslist?', desc: 'Een naam, geen orgaan.' },
        { label: 'Bij welk signaal stoppen we?', desc: 'Een drempel die vooraf wordt vastgesteld, niet achteraf.' },
      ],
      deliverable: 'De kaderingsnotitie: drie schriftelijke antwoorden, ondertekend door de beslisser.',
    },
    perspectives: { title: 'Om verder te gaan', items: [] },
    cta: { metier: 'program' },
  },
}
