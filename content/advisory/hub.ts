/**
 * Page hub /advisory : les huit métiers du cabinet (menu Nos métiers, colonne Cadrer et réaliser).
 * Les noms et accroches des métiers viennent de advisory.pillars.* (même source que l'accueil) ;
 * les libellés de navigation viennent de nav.* ; ce fichier porte le reste du texte de la page.
 */
export interface HubCopy {
  metaTitle: string
  metaDesc: string
  h1: string
  sub: string
  label: string
  networkTitle: string
  networkDesc: string
}

export const ADVISORY_HUB: Record<string, HubCopy> = {
  fr: {
    metaTitle: 'Nos huit métiers : décider, piloter, mettre en œuvre | Aegryn',
    metaDesc: 'Stratégie, risques, finance, technologie, opérations, talents, projets, M&A : huit métiers pour décider, piloter et mettre en œuvre, jusqu’à la réception. Suisse et Europe.',
    h1: 'Décider, piloter et mettre en œuvre.',
    sub: 'Huit métiers, un seul interlocuteur. Un nombre limité de mandats, une réponse sous deux jours ouvrés, des experts du réseau coordonnés quand le sujet l’exige.',
    label: 'Nos huit métiers',
    networkTitle: 'Les bons experts, au bon moment.',
    networkDesc: 'Pour les missions spécialisées, nous mobilisons des experts indépendants du réseau, nommés et responsables de leur périmètre. Nous les coordonnons : vous gardez un seul interlocuteur.',
  },
  en: {
    metaTitle: 'Our eight disciplines: decide, steer, implement | Aegryn',
    metaDesc: 'Strategy, risk, finance, technology, operations, talent, projects, M&A: eight disciplines to decide, steer and implement, through to acceptance. Switzerland and Europe.',
    h1: 'Decide, steer and implement.',
    sub: 'Eight disciplines, one point of contact. A limited number of engagements, a reply within two working days, network experts coordinated when the subject requires it.',
    label: 'Our eight disciplines',
    networkTitle: 'The right experts, at the right time.',
    networkDesc: 'For specialised assignments, we bring in independent network experts, named and accountable for their scope. We coordinate them: you keep a single point of contact.',
  },
  de: {
    metaTitle: 'Unsere acht Fachgebiete: entscheiden, steuern, umsetzen | Aegryn',
    metaDesc: 'Strategie, Risiken, Finanzen, Technologie, Operations, Talente, Projekte, M&A: acht Fachgebiete, um zu entscheiden, zu steuern und umzusetzen, bis zur Abnahme. Schweiz und Europa.',
    h1: 'Entscheiden, steuern und umsetzen.',
    sub: 'Acht Fachgebiete, ein Ansprechpartner. Eine begrenzte Zahl von Mandaten, eine Antwort innerhalb von zwei Werktagen, Netzwerkexperten, die bei Bedarf koordiniert werden.',
    label: 'Unsere acht Fachgebiete',
    networkTitle: 'Die richtigen Experten, zur richtigen Zeit.',
    networkDesc: 'Für spezialisierte Aufträge ziehen wir unabhängige Netzwerkexperten bei, namentlich benannt und für ihren Bereich verantwortlich. Wir koordinieren sie: Sie behalten einen einzigen Ansprechpartner.',
  },
  es: {
    metaTitle: 'Nuestros ocho oficios: decidir, dirigir, ejecutar | Aegryn',
    metaDesc: 'Estrategia, riesgos, finanzas, tecnología, operaciones, talento, proyectos, M&A: ocho oficios para decidir, dirigir y ejecutar, hasta la entrega. Suiza y Europa.',
    h1: 'Decidir, dirigir y ejecutar.',
    sub: 'Ocho oficios, un solo interlocutor. Un número limitado de encargos, respuesta en dos días hábiles, expertos de la red coordinados cuando el tema lo exige.',
    label: 'Nuestros ocho oficios',
    networkTitle: 'Los expertos adecuados, en el momento adecuado.',
    networkDesc: 'Para los encargos especializados, movilizamos a expertos independientes de la red, nombrados y responsables de su ámbito. Los coordinamos: usted mantiene un solo interlocutor.',
  },
  it: {
    metaTitle: 'I nostri otto mestieri: decidere, guidare, attuare | Aegryn',
    metaDesc: 'Strategia, rischi, finanza, tecnologia, operazioni, talenti, progetti, M&A: otto mestieri per decidere, guidare e attuare, fino alla consegna. Svizzera ed Europa.',
    h1: 'Decidere, guidare e attuare.',
    sub: 'Otto mestieri, un solo interlocutore. Un numero limitato di mandati, risposta entro due giorni lavorativi, esperti della rete coordinati quando il tema lo richiede.',
    label: 'I nostri otto mestieri',
    networkTitle: 'Gli esperti giusti, al momento giusto.',
    networkDesc: 'Per gli incarichi specialistici mobilitiamo esperti indipendenti della rete, nominati e responsabili del proprio ambito. Li coordiniamo: voi mantenete un solo interlocutore.',
  },
  nl: {
    metaTitle: 'Onze acht vakgebieden: beslissen, sturen, uitvoeren | Aegryn',
    metaDesc: 'Strategie, risico’s, financiën, technologie, operations, talent, projecten, M&A: acht vakgebieden om te beslissen, te sturen en uit te voeren, tot en met de oplevering. Zwitserland en Europa.',
    h1: 'Beslissen, sturen en uitvoeren.',
    sub: 'Acht vakgebieden, één aanspreekpunt. Een beperkt aantal opdrachten, antwoord binnen twee werkdagen, netwerkexperts die gecoördineerd worden wanneer het onderwerp dat vraagt.',
    label: 'Onze acht vakgebieden',
    networkTitle: 'De juiste experts, op het juiste moment.',
    networkDesc: 'Voor gespecialiseerde opdrachten schakelen we onafhankelijke netwerkexperts in, bij naam genoemd en verantwoordelijk voor hun domein. Wij coördineren hen: u behoudt één aanspreekpunt.',
  },
}
