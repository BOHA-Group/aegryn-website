/** Textes de la page d'accueil de La Boutique, 6 langues (valeurs, segments et projets viennent des messages). */
import type { L6 } from './savoirFaire'
const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): L6 => ({ fr, en, de, es, it, nl })

export const BOUTIQUE = {
  metaTitle: L('La Boutique, projets emblématiques | Aegryn', 'La Boutique, emblematic projects | Aegryn', 'La Boutique, emblematische Projekte | Aegryn', 'La Boutique, proyectos emblemáticos | Aegryn', 'La Boutique, progetti emblematici | Aegryn', 'La Boutique, emblematische projecten | Aegryn'),
  metaDesc: L(
    'La boutique entrepreneuriale d’Aegryn : nous cadrons, réalisons et accompagnons un nombre limité de projets signature. Rare par sélection. Discret par principe.',
    'Aegryn’s entrepreneurial boutique: we frame, deliver and accompany a limited number of signature projects. Rare by selection. Discreet by principle.',
    'Die unternehmerische Boutique von Aegryn: Wir rahmen, setzen um und begleiten eine begrenzte Zahl von Signature-Projekten. Selten durch Auswahl. Diskret aus Prinzip.',
    'La boutique emprendedora de Aegryn: encuadramos, realizamos y acompañamos un número limitado de proyectos insignia. Raro por selección. Discreto por principio.',
    'La boutique imprenditoriale di Aegryn: inquadriamo, realizziamo e accompagniamo un numero limitato di progetti signature. Raro per selezione. Discreto per principio.',
    'De ondernemende boutique van Aegryn: wij kaderen, realiseren en begeleiden een beperkt aantal signatuurprojecten. Zeldzaam door selectie. Discreet uit principe.'),
  label: L('La Boutique', 'La Boutique', 'La Boutique', 'La Boutique', 'La Boutique', 'La Boutique'),
  h1: L('La boutique entrepreneuriale de projets emblématiques.', 'The entrepreneurial boutique for emblematic projects.', 'Die unternehmerische Boutique für emblematische Projekte.', 'La boutique emprendedora de proyectos emblemáticos.', 'La boutique imprenditoriale dei progetti emblematici.', 'De ondernemende boutique voor emblematische projecten.'),
  signature: L('Rare par sélection. Discret par principe.', 'Rare by selection. Discreet by principle.', 'Selten durch Auswahl. Diskret aus Prinzip.', 'Raro por selección. Discreto por principio.', 'Raro per selezione. Discreto per principio.', 'Zeldzaam door selectie. Discreet uit principe.'),
  sub: L(
    'Nous cadrons, réalisons et accompagnons un nombre limité de projets signature, pour des entrepreneurs, des investisseurs, des institutions et des marques qui voient grand.',
    'We frame, deliver and accompany a limited number of signature projects, for entrepreneurs, investors, institutions and brands that think big.',
    'Wir rahmen, setzen um und begleiten eine begrenzte Zahl von Signature-Projekten, für Unternehmer, Investoren, Institutionen und Marken, die groß denken.',
    'Encuadramos, realizamos y acompañamos un número limitado de proyectos insignia, para emprendedores, inversores, instituciones y marcas que piensan en grande.',
    'Inquadriamo, realizziamo e accompagniamo un numero limitato di progetti signature, per imprenditori, investitori, istituzioni e marchi che pensano in grande.',
    'Wij kaderen, realiseren en begeleiden een beperkt aantal signatuurprojecten, voor ondernemers, investeerders, instellingen en merken die groot denken.'),
  cta1: L('Échanger en toute confidentialité', 'Talk in full confidence', 'Vertraulich sprechen', 'Hablar con total confidencialidad', 'Parlarne in piena riservatezza', 'Vertrouwelijk spreken'),
  cta2: L('Voir les projets', 'See the projects', 'Projekte ansehen', 'Ver los proyectos', 'Vedere i progetti', 'Projecten bekijken'),
  scroll: L('Défiler', 'Scroll', 'Scrollen', 'Desplazar', 'Scorri', 'Scrollen'),

  conceptTitle: L('Peu de projets. Tout de bout en bout.', 'Few projects. End to end.', 'Wenige Projekte. Von Anfang bis Ende.', 'Pocos proyectos. De principio a fin.', 'Pochi progetti. Dall’inizio alla fine.', 'Weinig projecten. Van begin tot eind.'),
  conceptText: L(
    'Autour de chaque projet signature, un interlocuteur nommé et les meilleurs experts, du concept à la réception, puis dans la durée. Nous traitons un nombre limité de mandats à la fois ; rien n’est dévoilé sans votre accord.',
    'Around each signature project, a named contact and the best experts, from concept to delivery, then over time. We handle a limited number of mandates at a time; nothing is disclosed without your agreement.',
    'Rund um jedes Signature-Projekt: ein benannter Ansprechpartner und die besten Experten, vom Konzept bis zur Abnahme, danach dauerhaft. Wir bearbeiten jeweils nur eine begrenzte Zahl von Mandaten; ohne Ihre Zustimmung wird nichts offengelegt.',
    'Alrededor de cada proyecto insignia, un interlocutor designado y los mejores expertos, del concepto a la entrega y después en el tiempo. Tratamos un número limitado de mandatos a la vez; nada se revela sin su acuerdo.',
    'Intorno a ogni progetto signature, un referente nominativo e i migliori esperti, dal concept alla consegna e poi nel tempo. Trattiamo un numero limitato di mandati alla volta; nulla viene rivelato senza il vostro consenso.',
    'Rond elk signatuurproject een vast aanspreekpunt en de beste experts, van concept tot oplevering en daarna in de tijd. Wij behandelen telkens een beperkt aantal mandaten; zonder uw akkoord wordt niets onthuld.'),
  participation: L(
    'Selon les projets, nous nous engageons aussi à leurs côtés, y compris par une prise de participation.',
    'Depending on the project, we also commit alongside it, including through an equity stake.',
    'Je nach Projekt engagieren wir uns auch an ihrer Seite, auch durch eine Beteiligung.',
    'Según el proyecto, también nos comprometemos a su lado, incluso mediante una toma de participación.',
    'A seconda dei progetti, ci impegniamo anche al loro fianco, anche con una partecipazione.',
    'Afhankelijk van het project engageren wij ons ook aan hun zijde, onder meer via een deelneming.'),
  bandCaption: L(
    'Chaque projet signature a sa propre histoire. Nous aidons à l’écrire.',
    'Every signature project has its own story. We help write it.',
    'Jedes Signature-Projekt hat seine eigene Geschichte. Wir helfen, sie zu schreiben.',
    'Cada proyecto insignia tiene su propia historia. Ayudamos a escribirla.',
    'Ogni progetto signature ha la sua storia. Aiutiamo a scriverla.',
    'Elk signatuurproject heeft zijn eigen verhaal. Wij helpen het te schrijven.'),

  methodTitle: L('Cadrer. Réaliser. Accompagner.', 'Frame. Deliver. Accompany.', 'Rahmen setzen. Umsetzen. Begleiten.', 'Encuadrar. Realizar. Acompañar.', 'Inquadrare. Realizzare. Accompagnare.', 'Kaderen. Realiseren. Begeleiden.'),
  steps: [
    { title: L('Cadrer', 'Frame', 'Rahmen setzen', 'Encuadrar', 'Inquadrare', 'Kaderen'),
      desc: L('Du concept au projet exécutable : faisabilité, marché, business plan, marque, cadre légal.', 'From concept to executable project: feasibility, market, business plan, brand, legal framework.', 'Vom Konzept zum umsetzbaren Projekt: Machbarkeit, Markt, Businessplan, Marke, rechtlicher Rahmen.', 'Del concepto al proyecto ejecutable: viabilidad, mercado, plan de negocio, marca, marco legal.', 'Dal concept al progetto eseguibile: fattibilità, mercato, business plan, marchio, quadro legale.', 'Van concept naar uitvoerbaar project: haalbaarheid, markt, businessplan, merk, juridisch kader.') },
    { title: L('Réaliser', 'Deliver', 'Umsetzen', 'Realizar', 'Realizzare', 'Realiseren'),
      desc: L('Jusqu’à la réception : produit ou plateforme, marque et contenus, partenaires que nous orchestrons, mise en marché.', 'Through to delivery: product or platform, brand and content, partners we orchestrate, go-to-market.', 'Bis zur Abnahme: Produkt oder Plattform, Marke und Inhalte, Partner, die wir orchestrieren, Markteinführung.', 'Hasta la entrega: producto o plataforma, marca y contenidos, socios que orquestamos, salida al mercado.', 'Fino alla consegna: prodotto o piattaforma, marchio e contenuti, partner che orchestriamo, messa sul mercato.', 'Tot de oplevering: product of platform, merk en content, partners die wij orkestreren, marktintroductie.') },
    { title: L('Accompagner', 'Accompany', 'Begleiten', 'Acompañar', 'Accompagnare', 'Begeleiden'),
      desc: L('Dans la durée : lancement, croissance, repositionnement, reprise, transmission.', 'Over time: launch, growth, repositioning, takeover, handover.', 'Dauerhaft: Start, Wachstum, Neupositionierung, Übernahme, Übergabe.', 'En el tiempo: lanzamiento, crecimiento, reposicionamiento, adquisición, transmisión.', 'Nel tempo: lancio, crescita, riposizionamento, subentro, trasmissione.', 'In de tijd: lancering, groei, herpositionering, overname, overdracht.') },
  ],

  valuesTitle: L('Nos valeurs', 'Our values', 'Unsere Werte', 'Nuestros valores', 'I nostri valori', 'Onze waarden'),
  projectsLabel: L('Projets emblématiques', 'Emblematic projects', 'Emblematische Projekte', 'Proyectos emblemáticos', 'Progetti emblematici', 'Emblematische projecten'),
  projectsAll: L('Voir tous les projets', 'See all projects', 'Alle Projekte ansehen', 'Ver todos los proyectos', 'Vedere tutti i progetti', 'Alle projecten bekijken'),
  placesLabel: L('Les lieux de rencontre', 'Meeting places', 'Begegnungsorte', 'Los lugares de encuentro', 'I luoghi d’incontro', 'Ontmoetingsplekken'),
  placesTitle: L('Des lieux d’exception, pour se retrouver autrement.', 'Exceptional places, to meet differently.', 'Außergewöhnliche Orte, um sich anders zu begegnen.', 'Lugares excepcionales, para reunirse de otra manera.', 'Luoghi eccezionali, per ritrovarsi in modo diverso.', 'Uitzonderlijke plekken om elkaar anders te ontmoeten.'),
  soon: L('Bientôt', 'Coming soon', 'Demnächst', 'Próximamente', 'Prossimamente', 'Binnenkort'),
  forWhoTitle: L('Pour qui', 'Who it is for', 'Für wen', 'Para quién', 'Per chi', 'Voor wie'),
  magazineLabel: L('Magazine · La Boutique', 'Magazine · La Boutique', 'Magazin · La Boutique', 'Magazine · La Boutique', 'Magazine · La Boutique', 'Magazine · La Boutique'),
  magazineTitle: L('Tendances, projets, bâtisseurs.', 'Trends, projects, builders.', 'Trends, Projekte, Macher.', 'Tendencias, proyectos, constructores.', 'Tendenze, progetti, costruttori.', 'Trends, projecten, bouwers.'),
  magazineLink: L('Voir tous les articles', 'See all articles', 'Alle Artikel ansehen', 'Ver todos los artículos', 'Vedere tutti gli articoli', 'Alle artikelen bekijken'),
  submitTitle: L('Un projet à confier ? Échangeons en toute confidentialité.', 'A project to entrust? Let’s talk in full confidence.', 'Ein Projekt anzuvertrauen? Sprechen wir vertraulich.', '¿Un proyecto que confiarnos? Hablemos con total confidencialidad.', 'Un progetto da affidarci? Parliamone in piena riservatezza.', 'Een project toe te vertrouwen? Laten we vertrouwelijk praten.'),
  submitText: L(
    'Un accord de confidentialité précède tout échange détaillé. Réponse personnelle sous 2 jours ouvrés.',
    'A confidentiality agreement precedes any detailed exchange. Personal reply within 2 business days.',
    'Eine Vertraulichkeitsvereinbarung geht jedem detaillierten Austausch voraus. Persönliche Antwort innerhalb von 2 Werktagen.',
    'Un acuerdo de confidencialidad precede a cualquier intercambio detallado. Respuesta personal en 2 días hábiles.',
    'Un accordo di riservatezza precede ogni scambio dettagliato. Risposta personale entro 2 giorni lavorativi.',
    'Een geheimhoudingsovereenkomst gaat elke gedetailleerde uitwisseling vooraf. Persoonlijk antwoord binnen 2 werkdagen.'),
}
