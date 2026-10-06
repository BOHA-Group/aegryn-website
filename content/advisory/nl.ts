import type { AdvisoryPageContent, AdvisoryKey } from './types'

/** Nederlandse inhoud van de vijf ACCOMPAGNER-pagina's, vertaald uit fr.ts (referentie). */

const PRIVACY =
  'Uw antwoorden blijven in uw browser. Niets wordt opgeslagen of verzonden zonder uw toestemming. Het resultaat past op één pagina: uw niveau en de aanbevolen volgende stap.'

const S = '/images/advisory/situations/'

export const ADVISORY_NL: Record<AdvisoryKey, AdvisoryPageContent> = {

  strategy: {
    key: 'strategy', path: '/advisory/strategy',
    image: '/images/advisory/strategy-towers.webp',
    imageAlt: 'Kantoortorens van onderaf gezien, de koers en het overzicht',
    meta: {
      title: 'Strategieadvies voor kmo’s en middelgrote bedrijven | Aegryn',
      description: 'Koers, verdienmodel, externe groei, nieuwe markten: Aegryn helpt leiders van organisaties van 10 tot 300 M€ om strategische keuzes te maken, te becijferen en vol te houden. Zwitserland en Europa.',
      keywords: ['strategieadvies kmo', 'strategieadvies middelgroot bedrijf', 'driejarenplan', 'externe groei', 'markttoetreding', 'strategy advisory Zwitserland'],
    },
    eyebrow: 'Bedrijfsstrategie & Innovatie',
    h1: 'De juiste koers kiezen, in de juiste volgorde, met de middelen die u werkelijk heeft.',
    subtitle: 'Voor wie een organisatie van 10 tot 300 M€ leidt, is strategie geen planningsoefening: het zijn afwegingen onder beperkingen van kapitaal, managementtijd en uitvoeringscapaciteit. Aegryn helpt u ze te stellen, te becijferen en vol te houden.',
    scope: [
      { label: 'Directieteam: Talent & Organisatie', href: '/advisory/talent-organization' },
      { label: 'Uitvoering van een overname: M&A', href: '/advisory/ma' },
      { label: 'Architectuurkeuzes: Technologie', href: '/advisory/technology' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '≈ 9 000', label: 'adviesopdrachten van Bpifrance in 2024, +50 % in één jaar', source: 'Bpifrance Presse, 2025' },
        { value: '−2 %', label: 'Franse adviesmarkt in 2025, gecorrigeerd voor inflatie', source: 'Syntec Conseil' },
        { value: '−7,3', label: 'indexpunten, NZZ-kmo-barometer 2026, laagste stand sinds de start van de enquête in 2021', source: 'NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule' },
      ],
      paragraphs: [
        'Leiders van kmo’s en middelgrote bedrijven kopen advies, maar anders. Bpifrance voerde in 2024 bijna 9 000 adviesopdrachten uit, 50 % meer dan een jaar eerder, terwijl de Franse adviesmarkt in 2025 gecorrigeerd voor inflatie met 2 % krimpt. In Zwitserland daalt de samengestelde index van de NZZ-kmo-barometer 2026 (NZZ en Kalaidos Fachhochschule) naar −7,3 punten, de laagste stand sinds de start van de enquête in 2021; alleen de integratie van technologie gaat vooruit.',
      ],
      change: 'Wanneer de context verstrakt, stijgen de kosten van een verkeerde afweging. Er is geen groot programma meer nodig, maar één precieze beslissing, snel genomen, met een ervaren blik.',
      sources: 'Bronnen: Bpifrance Presse (2025) · Syntec Conseil · NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule (overgenomen door SECO).',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een beslissing die uw comité kan verdedigen tegenover een bankier of een aandeelhouder.',
        'Een koers die uw comité in uw afwezigheid kan toepassen, zonder u te bellen.',
        'Een eerste gedateerde actie binnen dertig dagen.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Ons model erodeert.', decision: 'Pivoteren, verdedigen of van segment veranderen.', deliverable: 'Positiebeoordeling: unit economics per segment, concurrentie, drie becijferde opties.', format: 'Korte opdracht', cycles: ['croissance', 'restructuration'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'AI verandert ons vak.', decision: 'Waar integreren, wat niet automatiseren.', deliverable: 'Kaart van AI-toepassingen per stap in de waardeketen, gerangschikt naar gecreëerde waarde en gedragen risico.', format: 'Enkele weken', cycles: ['croissance'], image: `${S}developer-desk.jpg` },
        { quote: 'Een concurrent staat te koop, of een partner zou ons kunnen overnemen.', decision: 'Organische groei, alliantie of overname.', deliverable: 'Externe-groeithese, doelcriteria, go / no-go-kader.', format: 'Enkele weken', cycles: ['acquisition'], image: `${S}handshake.jpg` },
        { quote: 'We betreden een nieuwe markt (DACH, Benelux, Zuid-Europa).', decision: 'Dochteronderneming, distributeur, partner, of wachten.', deliverable: 'Toetredingsplan per land, met lokale regelgevende eisen en talentbehoeften.', format: 'Enkele weken', cycles: ['croissance'], image: `${S}meeting-room.jpg` },
        { quote: 'Mijn raad, mijn bank of mijn aandeelhouder vraagt een driejarenplan.', decision: 'Welke hypothesen aannemen, welke toetsen.', deliverable: 'Verdedigbaar plan, expliciete gevoeligheden, memo van tien pagina’s voor het comité.', format: 'Eén tot twee maanden', cycles: ['lancement', 'croissance'], image: `${S}planning-laptops.jpg` },
        { quote: 'De strategie zit in mijn hoofd.', decision: 'Wat moet bestaan zonder u.', deliverable: 'Strategie gedocumenteerd in vijf prioriteiten, met verantwoordelijken en mijlpalen.', format: 'Enkele weken', cycles: ['croissance', 'transmission'], image: `${S}plan-writing.jpg` },
      ],
    },
    services: {
      title: 'Onze diensten',
      items: [
        'De strategische positie herzien',
        'Kiezen tussen opties',
        'Het driejarenplan opstellen',
        'Het comité voorbereiden (memo voor raad, bank, aandeelhouders)',
        'De toetreding tot een nieuwe markt kaderen',
        'De raad begeleiden (kwartaaladvies)',
      ],
    },
    framework: {
      name: 'Het Raster van de vier toetsen',
      intro: 'Elke strategische optie doorloopt vier toetsen voordat ze wordt weerhouden.',
      axes: [
        { label: 'Waarde', desc: 'Wat verandert ze aan de waarde van de organisatie over drie jaar?' },
        { label: 'Omkeerbaarheid', desc: 'Als ze mislukt, wat zijn de uitstapkosten na twaalf maanden?' },
        { label: 'Capaciteit', desc: 'Hebben we de mensen, de technologie en het kapitaal om ze uit te voeren, zonder de leider voltijds in te zetten?' },
        { label: 'Volgorde', desc: 'Wat moet eerst waar zijn, en wat kan wachten?' },
      ],
      deliverable: 'Een beslissingsfiche van één pagina die de opties beoordeelt en de eerste beslissing binnen dertig dagen benoemt.',
    },
    bySize: {
      title: 'Naar omvang',
      items: [
        { label: 'Kmo · 10 tot 50 M€', desc: 'De leider beslist met twee of drie mensen, zonder strategieafdeling. De beperking is zijn tijd. Wij leveren kort, zonder projectstructuur, in een formaat dat in tien pagina’s past.' },
        { label: 'Middelgroot bedrijf · 50 tot 300 M€', desc: 'Meerdere activiteiten, een directiecomité, soms een familiale aandeelhouder of een fonds. De beperking is afstemming. Wij begeleiden de afweging en documenteren de beslissing voor de raad.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Disintermediatie door nieuwe spelers; technologiepartnerschappen af te wegen onder DORA- en FINMA-beperkingen op kritieke derden.' },
        { cluster: 'Gezondheid & Life Sciences', desc: 'Overgang van publiek naar privaat, toetreding tot een land met een ander MDR-, HDS- of EHDS-kader.' },
        { cluster: 'Industrie, Energie & Infrastructuur', desc: 'Diensten rond het product (voorspellend onderhoud, as-a-service); de waarde van data zelf verzilveren of aan een integrator delegeren.' },
        { cluster: 'Handel, Diensten & Klantbeleving', desc: 'Omnichannel, pricing, de plaats van het eigen merk tegenover platforms van derden.' },
        { cluster: 'Tech, Innovatie & Publieke sector', desc: 'Product-led of commercieel model, definitie van de doelklant, DACH-toetreding, toegang tot overheidsopdrachten.' },
      ],
    },
    scenario: {
      tag: 'Typisch scenario · illustratief, niet uit een benoemde opdracht',
      text: 'Industrieel middelgroot bedrijf van 120 M€, Franstalig Zwitserland en Frankrijk. De leider twijfelt tussen de overname van een leverancier van voorspellend onderhoud en interne ontwikkeling. Binnen drie weken beschikt zijn comité over een beslissingsfiche: drie opties, totale kosten over drie jaar, uitvoeringsrisico’s, voorwaarden voor omkeerbaarheid, eerste beslissing binnen dertig dagen.',
    },
    ai: {
      title: 'Wat een AI-tool niet voor u doet',
      text: 'Een assistent structureert uw opties. Hij kent uw aandeelhouders niet, noch uw team, noch wat uw bankier zal aanvaarden. Hij staat niet in voor de beslissing. Aegryn toetst uw hypothesen, neemt een standpunt in en komt enkele maanden later de afwijking meten.',
    },
    diagnostic: {
      title: 'Waar staat u? Vijf vragen.',
      intro: 'Antwoord met ja of nee. Het resultaat plaatst u op een van drie niveaus en benoemt de volgende stap.',
      questions: [
        { q: 'Kunt u uw strategie op één pagina schrijven, en kent het directiecomité uw vijf prioriteiten?' },
        { q: 'Heeft elke prioriteit een verantwoordelijke, een mijlpaal en een indicator?' },
        { q: 'Heeft u minstens twee alternatieven voor uw huidige koers becijferd?' },
        { q: 'Weet u welke beslissingen binnen twaalf maanden omkeerbaar zijn en welke niet?' },
        { q: 'Heeft een externe blik uw kernhypothesen in de afgelopen twaalf maanden in vraag gesteld?' },
      ],
      levels: [
        { min: 0, label: 'Te kaderen', desc: 'De strategie bestaat, maar vooral in het hoofd van de leider. De opties zijn niet becijferd of getoetst.', nextAction: 'Uw hoofdbeslissing op één fiche zetten: opties, uitstapkosten, eerste actie binnen dertig dagen.' },
        { min: 3, label: 'In opbouw', desc: 'De prioriteiten zijn bekend en worden opgevolgd. Wat ontbreekt is de toets: becijferde alternatieven, omkeerbaarheid, externe blik.', nextAction: 'Uw huidige koers door het Raster van de vier toetsen halen, met een ervaren tegenspreker.' },
        { min: 5, label: 'Beheerst', desc: 'Strategie geschreven, gestuurd, getoetst. Het thema wordt het ritme: kwartaalreview en voorbereiding van het comité.', nextAction: 'Een kwartaaladvies opzetten om het traject vast te houden en de volgende afwegingen voor te bereiden.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectieven',
      items: [
        { title: 'Stand van de Europese tech-M&A-markt, medio 2026', href: '/blog/marche-ma-tech-europe-q3-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 01 · Built to Last', href: '/magazine/issue-01', kind: 'magazine' },
      ],
    },
    cta: { metier: 'strategie' },
  },

  riskCompliance: {
    key: 'riskCompliance', path: '/advisory/risk-compliance',
    image: '/images/advisory/risk-compliance.webp',
    imageAlt: 'Beoordeling van contractuele en regelgevende documenten',
    meta: {
      title: 'Regelgevende compliance voor kmo’s en middelgrote bedrijven: NIS2, DORA, AI Act, DSG | Aegryn',
      description: 'Welke verplichtingen op u van toepassing zijn, welke uw klanten u zullen opleggen, welke kunnen wachten. Kartering, tegenwerpbaar bewijs, incidentbeheer. Frankrijk, Zwitserland, EU.',
      keywords: ['NIS2 kmo', 'DORA compliance', 'AI Act verplichtingen', 'DSG AVG Zwitserland', 'regelgevende kartering', 'cyberincidentbeheer', 'NCSC melding 24 u'],
    },
    eyebrow: 'Risico’s & Compliance',
    h1: 'Anticiperen op wat u bindt, voordat het u wordt opgelegd.',
    subtitle: 'NIS2 nog niet omgezet in Frankrijk, een apart Zwitsers regime, een AI Act met hertekende termijnen, klanten die nu al bewijs eisen. Compliance is niet langer een zaak van juristen: het is een directieafweging.',
    scope: [
      { label: 'Architectuur en hosting: Technologie', href: '/advisory/technology' },
      { label: 'Compliance van een doelwit: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '≈ 15 000', label: 'entiteiten verwacht binnen het NIS2-toepassingsgebied in Frankrijk, tegenover enkele honderden vandaag', source: 'Europese Commissie; raming' },
        { value: '24 u', label: 'termijn om een cyberaanval te melden aan het NCSC voor Zwitserse kritieke infrastructuur, sinds 1 april 2025', source: 'NCSC, ncsc.admin.ch' },
        { value: '35 M€ · 7 %', label: 'plafond van de AI Act-boetes voor verboden praktijken; 15 M€ of 3 % voor de meeste andere verplichtingen', source: 'Verordening (EU) 2024/1689, art. 99' },
      ],
      paragraphs: [
        'Frankrijk. NIS2 moet het aantal gereguleerde entiteiten van enkele honderden naar ongeveer 15 000 brengen, in 18 sectoren, vanaf 50 werknemers of 10 M€. De omzettingswet is niet gestemd; de Commissie heeft op 8 juli 2026 het Hof van Justitie ingeschakeld. Wachten op de wet is een gok, geen plan.',
        'Zwitserland. NIS2 is niet rechtstreeks van toepassing. Sinds 1 april 2025 melden exploitanten van kritieke infrastructuur elke cyberaanval binnen 24 uur aan het NCSC, met een boete tot 100 000 CHF sinds 1 oktober 2025. Zes maanden na inwerkingtreding waren 164 meldingen geregistreerd. Buiten kritieke infrastructuur geen wettelijke verplichting, maar uw EU-klanten kunnen ze u contractueel opleggen.',
        'AI. Artikel 50 van de AI Act is van toepassing sinds 2 augustus 2026. De verplichtingen voor «hoog risico» van bijlage III zijn door Verordening (EU) 2026/1744 uitgesteld tot 2 december 2027. De boetes lopen op tot 35 M€ of 7 % van de wereldwijde omzet voor verboden praktijken, 15 M€ of 3 % voor de meeste andere verplichtingen.',
      ],
      change: 'Drie kalenders, drie rechtsgebieden. De juiste vraag is niet «zijn we conform?» maar «waartoe zijn we gehouden, tegenover wie, tegen wanneer?».',
      sources: 'Bronnen: Richtlijn (EU) 2022/2555 · Europese Commissie · NCSC, persbericht van 29.09.2025 · Verordeningen (EU) 2024/1689 en 2026/1744.',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een helder zicht op wat van toepassing is, wat contractueel wordt geëist en wat kan wachten.',
        'Bewijs dat u aan een klant overhandigt zonder het opnieuw samen te stellen.',
        'Een benoemde verantwoordelijke voor elke verplichting.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Een grote klant stuurt ons een beveiligingsvragenlijst van veertig pagina’s.', decision: 'Welk bewijsniveau leveren, volgens welk referentiekader.', deliverable: 'Bewijsdossier en plan om de lacunes te dichten, herbruikbaar voor de volgende klanten.', format: 'Enkele weken', cycles: ['croissance'], image: `${S}laptop-hands.jpg` },
        { quote: 'We weten niet of we binnen het toepassingsgebied vallen.', decision: 'Wat op ons van toepassing is, wat ons zal worden opgelegd, wat kan wachten.', deliverable: 'Blootstellingskaart met drie sporen.', format: 'Korte opdracht', cycles: ['lancement', 'croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Onze teams gebruiken AI zonder regels.', decision: 'Welke tools, met welke data, onder wiens verantwoordelijkheid.', deliverable: 'Gebruiksbeleid, systeeminventaris, classificatie volgens de AI Act.', format: 'Korte opdracht', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'We hebben een incident gehad.', decision: 'Wie informeren (autoriteit, klanten, verzekeraar), binnen welke termijnen.', deliverable: 'Gedocumenteerd incidentdossier en verbeterplan, met incident-responsexperts uit het netwerk.', format: 'Op aanvraag', cycles: ['restructuration'], image: `${S}network-cables.jpg` },
        { quote: 'Een investeerder of een overnemer gaat ons auditen.', decision: 'Wat vooraf regulariseren, wat op zich nemen.', deliverable: 'Compliancedossier klaar voor de dataroom.', format: 'Enkele weken', cycles: ['acquisition', 'transmission'], image: `${S}planning-laptops.jpg` },
        { quote: 'We verkopen in de EU vanuit Zwitserland (of omgekeerd).', decision: 'Vertegenwoordiger, DPO, gegevensoverdrachten.', deliverable: 'Matrix van rechtsgebieden (DSG / AVG) en bijbehorende verplichtingen.', format: 'Korte opdracht', cycles: ['croissance'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Onze diensten',
      items: [
        'Uw regelgevende blootstelling in kaart brengen',
        'Het bewijsdossier opbouwen dat tegenwerpbaar is aan uw klanten',
        'Het gebruik van AI kaderen',
        'Het incidentbeheer documenteren',
        'De remediëring sturen',
        'Het directiecomité opleiden in zijn verantwoordelijkheden',
      ],
    },
    framework: {
      name: 'De Blootstellingskaart met drie sporen',
      intro: 'Elke tekst wordt op een van de drie sporen geplaatst, met zijn termijn, zijn interne verantwoordelijke en de vastgestelde lacune.',
      axes: [
        { label: 'Verplicht', desc: 'Wat de wet u vandaag oplegt, volgens uw rol: essentiële of belangrijke entiteit, gebruiksverantwoordelijke of aanbieder van AI, verwerkingsverantwoordelijke.' },
        { label: 'Contractueel', desc: 'Wat uw klanten, verzekeraars en investeerders eisen, ook zonder wet.' },
        { label: 'Op te volgen', desc: 'Gekende termijn, vandaag niet van toepassing.' },
      ],
      deliverable: 'Eén synthesepagina, gedetailleerde bijlagen per tekst.',
    },
    bySize: {
      title: 'Naar omvang',
      items: [
        { label: 'Kmo · 10 tot 50 M€', desc: 'Zelden een voltijdse CISO of DPO. Wij mikken op een basis van tegenwerpbare controles, geen volledig managementsysteem, en zetten uitbestede functies uit het netwerk in.' },
        { label: 'Middelgroot bedrijf · 50 tot 300 M€', desc: 'Er is een risicoafdeling, meerdere referentiekaders overlappen. Wij consolideren ze in één plan en bereiden de interne audit voor.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'DORA, van toepassing sinds 17 januari 2025: kritieke ICT-derden, weerbaarheidstests, register van dienstverleners. In Zwitserland, FINMA-eisen inzake operationele risico’s en weerbaarheid (circulaire 2023/1).' },
        { cluster: 'Gezondheid & Life Sciences', desc: 'HDS in Frankrijk, MDR/IVDR, EHDS. AI ingebed in een medisch hulpmiddel: hoog risico van bijlage I, termijn 2 augustus 2028.' },
        { cluster: 'Industrie, Energie & Infrastructuur', desc: 'NIS2 (energie, water, vervoer, productie); in Zwitserland, NCSC-melding binnen 24 u; IT/OT-segmentering.' },
        { cluster: 'Handel, Diensten & Klantbeleving', desc: 'AVG en DSG (loyaliteit, profilering); artikel 50 (conversatie-agenten, gegenereerde inhoud); tools voor cv-screening: hoog risico, bijlage III, 2 december 2027.' },
        { cluster: 'Tech, Innovatie & Publieke sector', desc: 'Uw NIS2- en DORA-klanten vragen u om bewijs; Cyber Resilience Act (meldingsverplichtingen vanaf september 2026, producteisen in december 2027); softwareleveranciers gebruikt in kritieke infrastructuur: nagaan of de Zwitserse ISG op u van toepassing is.' },
      ],
    },
    scenario: {
      tag: 'Typisch scenario · illustratief',
      text: 'Zwitserse softwareleverancier met 25 M€ omzet, klanten in de energiesector in Duitsland en Frankrijk. Zijn grootste klant eist bewijs van beveiliging van de toeleveringsketen vóór verlenging. Binnen drie weken: toepassingsgebied verduidelijkt (verplicht voor de klant, contractueel voor de leverancier), acht lacunes gerangschikt, bewijs herbruikbaar voor de drie andere klanten.',
    },
    ai: {
      title: 'Wat een AI-tool niet voor u doet',
      text: 'Een assistent vat NIS2 samen. Hij draagt uw dossier niet voor bij uw klant, kiest niet welke lacunes u aanvaardt, staat niet in voor de kwaliteit van het bewijs. Aegryn zet een met naam genoemde expert in, verantwoordelijk voor zijn domein.',
      legal: 'Onze begeleiding vervangt geen juridisch advies; wij werken met partnerkantoren.',
    },
    diagnostic: {
      title: 'Waar staat u? Vijf vragen.',
      intro: 'Antwoord met ja of nee. Het resultaat plaatst u op een van drie niveaus en benoemt de volgende stap.',
      questions: [
        { q: 'Heeft u de lijst van teksten die op u van toepassing zijn (EU en Zwitserland) en hun termijnen?' },
        { q: 'Weet u wat uw drie grootste klanten u contractueel opleggen inzake beveiliging en data?' },
        { q: 'Bestaat er een schriftelijke incidentprocedure, met meldingstermijnen en contacten?' },
        { q: 'Heeft u een schriftelijke regel over de data die in AI-tools worden ingevoerd?' },
        { q: 'Staat een met naam genoemd directielid in voor de compliance?' },
      ],
      levels: [
        { min: 0, label: 'Te kaderen', desc: 'Het toepassingsgebied is niet vastgelegd. De blootstelling wordt ontdekt op het moment dat een klant, een auditor of een incident ze blootlegt.', nextAction: 'De Blootstellingskaart met drie sporen opstellen: verplicht, contractueel, op te volgen.' },
        { min: 3, label: 'In opbouw', desc: 'De teksten en klanteneisen zijn geïdentificeerd. Wat ontbreekt is het bewijs: herbruikbaar dossier, incidentprocedure, benoemde verantwoordelijke.', nextAction: 'Het tegenwerpbare bewijsdossier opbouwen en per verplichting een verantwoordelijke aanwijzen.' },
        { min: 5, label: 'Beheerst', desc: 'Toepassingsgebied, bewijs, verantwoordelijken: de basis bestaat. Het thema wordt het onderhoud en de komende termijnen (AI Act 2027, CRA).', nextAction: 'Een jaarlijkse herziening van het toepassingsgebied plannen en het directiecomité opleiden in zijn verantwoordelijkheden.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspectieven', items: [] },
    cta: { metier: 'conformite' },
  },

  technology: {
    key: 'technology', path: '/advisory/technology',
    image: '/images/advisory/technology.webp',
    imageAlt: 'Serverkasten in een datacenter',
    meta: {
      title: 'Technologieadvies: architectuur, schuld, AI, hosting | Aegryn',
      description: 'Architectuuraudit, afweging bouwen-kopen-samenwerken, AI-governance, technische leiding in deeltijd. Voor kmo’s en middelgrote bedrijven van 10 tot 300 M€. Zwitserland en Europa.',
      keywords: ['architectuuraudit', 'technische schuld', 'technische leiding in deeltijd', 'interim-CTO', 'AI-governance kmo', 'soevereine hosting Zwitserland', 'omkeerbaarheid'],
    },
    eyebrow: 'Technologie & Soevereiniteit',
    h1: 'Uw technologie is een actief of een afhankelijkheid. Meet welke.',
    subtitle: 'Architectuur, technische schuld, AI, hosting: de keuzes van de eerste drie jaar wegen op de volgende tien. Aegryn grijpt in op de momenten waarop ze worden beslist.',
    scope: [
      { label: 'Wettelijke verplichtingen: Risico’s & Compliance', href: '/advisory/risk-compliance' },
      { label: 'Audit van een doelwit: M&A', href: '/advisory/ma' },
      { label: 'Ontwikkeling op maat: Build', href: '/services/build' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '22 % → 34 %', label: 'Zwitserse kmo’s die AI gebruiken, 2024 tot 2025', source: 'SECO, kmu.admin.ch' },
        { value: '34 %', label: 'beschikken over regels voor de data die in AI-tools worden ingevoerd; 23 % bij bedrijven met minder dan 10 werknemers', source: 'SECO, kmu.admin.ch' },
        { value: '2 aug 2026', label: 'transparantieverplichtingen van de AI Act (artikel 50) van toepassing', source: 'Verordening (EU) 2024/1689' },
      ],
      paragraphs: [
        'De adoptie loopt voor op de governance. In Zwitserland steeg het AI-gebruik bij kmo’s van 22 % naar 34 % tussen 2024 en 2025; 60 % ziet er een kans in. Maar slechts 34 % beschikt over duidelijke regels voor de data die in deze tools mogen worden ingevoerd, en 23 % bij bedrijven met minder dan tien werknemers. Aan Europese zijde gelden de transparantieverplichtingen van de AI Act sinds 2 augustus 2026.',
      ],
      change: 'Het risico komt niet van de tool, maar van het ontbreken van een regel eromheen.',
      sources: 'Bronnen: SECO, «AI gains ground among Swiss SMEs» · Verordening (EU) 2024/1689.',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Benoemde afhankelijkheden, met een plan voor elke niet-omkeerbare component.',
        'Technische schuld die becijferd is in plaats van aangevoeld.',
        'AI-gebruiksregels die uw teams toepassen.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Ons platform vertraagt onze opleveringen.', decision: 'Refactoren, herbouwen of vervangen.', deliverable: 'Architectuuraudit, technische schuld becijferd per domein, traject over twaalf maanden.', format: 'Enkele weken', cycles: ['croissance'], image: `${S}server-room-walk.jpg` },
        { quote: 'Eén enkele persoon begrijpt het systeem.', decision: 'Documenteren, dubbel bezetten of internaliseren.', deliverable: 'Afhankelijkhedenregister (personen, dienstverleners, licenties) en reductieplan.', format: 'Korte opdracht', cycles: ['croissance', 'transmission'], image: `${S}developer-desk.jpg` },
        { quote: 'Bouwen, kopen of samenwerken?', decision: 'De juiste afweging, met de uitstapkosten.', deliverable: 'Analyse met gewogen criteria, omkeerbaarheid inbegrepen.', format: 'Korte opdracht', cycles: ['lancement', 'croissance'], image: `${S}loft-office.jpg` },
        { quote: 'Onze teams gebruiken AI zonder kader.', decision: 'Toegelaten tools, toegestane data, hosting.', deliverable: 'Gebruiksbeleid, inventaris, afweging van tools.', format: 'Korte opdracht', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'We hebben geen technisch directeur meer.', decision: 'Interim, aanwerving of leiding in deeltijd.', deliverable: 'Technische interim-leiding met gedocumenteerde overdracht.', format: 'Deeltijdopdracht', cycles: ['restructuration'], image: `${S}open-office.jpg` },
        { quote: 'Waar zijn onze data, en wie heeft er toegang toe?', decision: 'Hosting in de EU of Zwitserland, omkeerbaarheidsclausules, blootstelling aan extraterritoriale wetten.', deliverable: 'Hostingbeoordeling en omkeerbaarheidsplan.', format: 'Korte opdracht', cycles: ['lancement', 'croissance'], image: `${S}network-cables.jpg` },
      ],
    },
    services: {
      title: 'Onze diensten',
      items: [
        'De architectuur en de schuld auditen',
        'Kiezen tussen bouwen, kopen en samenwerken',
        'Het register van kritieke afhankelijkheden opstellen',
        'Het gebruik van AI kaderen',
        'De technische interim-leiding verzekeren',
        'Het technologische actief voorbereiden op de blik van een derde (investeerder, overnemer)',
      ],
    },
    framework: {
      name: 'De 90-dagen-omkeerbaarheidstoets',
      intro: 'Voor elke kritieke component (hoster, leverancier, dienstverlener, AI-model, sleutelontwikkelaar) één vraag: als hij morgen verdwijnt, in hoeveel dagen, tegen welke kosten en met welk dataverlies start de dienst opnieuw?',
      axes: [
        { label: 'Omkeerbaar binnen een week', desc: 'Alternatief geïdentificeerd, data exporteerbaar, overschakeling gedocumenteerd.' },
        { label: 'Omkeerbaar binnen een maand', desc: 'Alternatief gekend, migratie te plannen, beperkte functionele afhankelijkheid.' },
        { label: 'Omkeerbaar binnen 90 dagen', desc: 'Vervanging mogelijk maar duur: gedeeltelijke herbouw, heronderhandeling, aanwerving.' },
        { label: 'Niet omkeerbaar', desc: 'Vandaag geen geloofwaardig alternatief. De component bepaalt de continuïteit van de dienst.' },
      ],
      deliverable: 'Kaart van de tien meest kritieke componenten en behandelplan voor de niet-omkeerbare.',
    },
    bySize: {
      title: 'Naar omvang',
      items: [
        { label: 'Kmo · 10 tot 50 M€', desc: 'Een stack die door opeenstapeling is gebouwd, enkele ontwikkelaars, dienstverleners. Prioriteit: minimale documentatie en omkeerbaarheid van de drie kritieke componenten.' },
        { label: 'Middelgroot bedrijf · 50 tot 300 M€', desc: 'Geërfd informatiesysteem, meerdere leveranciers, een IT-afdeling. Prioriteit: een moderniseringstraject afgewogen door het comité, en datagovernance over de activiteiten heen.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Kritieke ICT-derden en clouduitbesteding (DORA); weerbaarheidsarchitectuur.' },
        { cluster: 'Gezondheid & Life Sciences', desc: 'HDS-hosting in Frankrijk; scheiding van gezondheidsgegevens; AI in een medisch hulpmiddel (bijlage I, 2 augustus 2028).' },
        { cluster: 'Industrie, Energie & Infrastructuur', desc: 'IT/OT, onderhoud op afstand, eigendom van industriële data.' },
        { cluster: 'Handel, Diensten & Klantbeleving', desc: 'Klantgegevens over kanalen heen verenigen zonder van één CRM af te hangen; AI-personalisatie en AVG.' },
        { cluster: 'Tech, Innovatie & Publieke sector', desc: 'Audit vóór investering of verkoop; copyleft-licenties in de kern van het product; hosting opgelegd door overheidsopdrachten.' },
      ],
    },
    scenario: {
      tag: 'Typisch scenario · illustratief',
      text: 'Softwareleverancier voor klinieken, 18 M€ omzet, 14 ontwikkelaars waarvan 6 externen. Een fonds toont interesse in het bedrijf. Binnen vier weken: afhankelijkheden en schuld in kaart gebracht, drie niet-omkeerbare componenten geïdentificeerd, remediëringsplan over zes maanden becijferd. De leider legt het voor aan het fonds voordat dit het zelf ontdekt.',
    },
    ai: {
      title: 'Wat een AI-tool niet voor u doet',
      text: 'Een code-assistent produceert code. Hij staat niet in voor de architectuurkeuze, weet niet wat uw hostingcontract toelaat, en zal de rol van technisch directeur niet opnemen tegenover uw raad.',
    },
    diagnostic: {
      title: 'Waar staat u? Vijf vragen.',
      intro: 'Antwoord met ja of nee. Het resultaat plaatst u op een van drie niveaus en benoemt de volgende stap.',
      questions: [
        { q: 'Is uw architectuur actueel gedocumenteerd (schema, datastromen)?' },
        { q: 'Kunt u uw tien kritieke componenten benoemen en de vervangingstermijn van elk?' },
        { q: 'Begrijpt meer dan één persoon elke kritieke component?' },
        { q: 'Zijn de rechtenoverdrachten en licenties van alle door dienstverleners geleverde code gearchiveerd?' },
        { q: 'Weet u waar uw data gehost worden en wie er toegang toe heeft?' },
      ],
      levels: [
        { min: 0, label: 'Te kaderen', desc: 'Het systeem werkt, maar de kennis ervan rust op enkele personen en de documentatie is niet actueel.', nextAction: 'Het afhankelijkhedenregister opstellen en de drie meest kritieke componenten door de Omkeerbaarheidstoets halen.' },
        { min: 3, label: 'In opbouw', desc: 'Architectuur en data zijn gekend. Er blijven blinde vlekken: rechtenketen, back-up van sleutelpersonen, vervangingstermijnen.', nextAction: 'Het register aanvullen (rechten, licenties, back-ups) en de schuld per domein becijferen.' },
        { min: 5, label: 'Beheerst', desc: 'Het technologische actief is gedocumenteerd, omkeerbaar en leesbaar voor een derde. Het thema wordt het traject: modernisering, AI, datagovernance.', nextAction: 'Het traject over twaalf maanden afwegen in het comité en het actief voorbereiden op de blik van een investeerder of overnemer.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectieven',
      items: [
        { title: 'Wat een tech-actief echt certificeerbaar maakt', href: '/blog/actif-tech-certifiable', kind: 'article' },
      ],
    },
    cta: { metier: 'technologie' },
  },

  talentOrganization: {
    key: 'talentOrganization', path: '/advisory/talent-organization',
    image: '/images/advisory/talent.webp',
    imageAlt: 'Lege bestuurskamer, klaar voor de volgende vergadering',
    meta: {
      title: 'Opvolging, governance, directieteam | Aegryn',
      description: 'De afhankelijkheid van de leider meten, het directiecomité structureren, een opvolgingsplan opbouwen, sleutelprofielen behouden. Kmo’s en middelgrote bedrijven van 10 tot 300 M€. Zwitserland en Europa.',
      keywords: ['opvolgingsplan kmo', 'afhankelijkheid van de oprichter', 'governance directiecomité', 'retentie sleutelprofielen', 'overdracht familiebedrijf', 'organisatie middelgroot bedrijf'],
    },
    eyebrow: 'Talent & Organisatie',
    h1: 'De waarde van een organisatie wordt gemeten aan wat ze kan zonder haar leider.',
    subtitle: 'Opvolging, governance, retentie, structurering van de directie: organisatiebeslissingen wegen op termijn het zwaarst en worden het vaakst uitgesteld.',
    scope: [
      { label: 'Zoeken en plaatsen: Rekruteren', href: '/talent' },
      { label: 'Koerskeuze: Strategie', href: '/advisory/strategy' },
      { label: 'Team van een doelwit: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '40 %', label: 'van de Franse leiders van micro-, kleine, middelgrote en intermediaire bedrijven willen binnen vijf jaar overdragen, goed voor 370 000 bedrijven', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '130 000', label: 'effectieve overdrachten verwacht aan het huidige tempo', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '47 %', label: 'van de leiders van familiebedrijven van 60 tot 69 jaar hebben geen geformaliseerd opvolgingsplan', source: 'Bpifrance Le Lab, familiebedrijven' },
      ],
      paragraphs: [
        'In Frankrijk wil 40 % van de leiders van micro-, kleine, middelgrote en intermediaire bedrijven hun bedrijf binnen vijf jaar overdragen, een potentieel van 370 000 bedrijven. Aan het huidige tempo zouden er 130 000 werkelijk van eigenaar veranderen. Onder de leiders van familiale kmo’s en middelgrote bedrijven van 60 tot 69 jaar heeft 47 % geen geformaliseerd opvolgingsplan.',
      ],
      change: 'De kloof tussen intentie en daad heeft minder met de markt te maken dan met voorbereiding. Een organisatie die van één persoon afhangt, draagt slecht over, financiert slecht en stuurt slecht.',
      sources: 'Bronnen: Bpifrance Le Lab, studie Overdracht en overname van bedrijven (27 november 2025) · Bpifrance Le Lab, familiebedrijven.',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een organisatie die drie maanden standhoudt zonder haar leider.',
        'Kritieke profielen met een back-up.',
        'Een opvolgingsplan dat geschreven, gedateerd en gedeeld is.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Alles loopt via mij.', decision: 'Wat eerst delegeren, aan wie.', deliverable: 'Afhankelijkheidsindex en delegatieplan over twaalf maanden.', format: 'Enkele weken', cycles: ['croissance', 'transmission'], image: `${S}meeting-room.jpg` },
        { quote: 'Mijn directieteam is nog geen team.', decision: 'Rollen, beslissingsritmes, delegaties.', deliverable: 'Governancehandvest van het directiecomité.', format: 'Enkele weken', cycles: ['croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Een sleutelprofiel wil vertrekken.', decision: 'Behouden, vervangen of dubbel bezetten.', deliverable: 'Retentieplan, geïdentificeerde back-up, gedocumenteerde kennisoverdracht.', format: 'Korte opdracht', cycles: ['restructuration'], image: `${S}laptop-hands.jpg` },
        { quote: 'Ik moet een leidinggevende aanwerven (technisch, financieel, operationeel, land).', decision: 'Het juiste profiel, in de juiste governance.', deliverable: 'Functieomschrijving en integratiecriteria, daarna overdracht aan Rekruteren.', format: 'Korte opdracht', cycles: ['croissance'], image: `${S}handshake.jpg` },
        { quote: 'Ik overweeg over te dragen binnen twee tot vijf jaar.', decision: 'Familie, intern of externe overnemer.', deliverable: 'Opvolgingsplan en transitiegovernance.', format: 'Eén tot twee maanden', cycles: ['transmission'], image: `${S}plan-writing.jpg` },
        { quote: 'Er komt een overname aan, twee culturen gaan elkaar ontmoeten.', decision: 'Wie blijft, wie leidt, hoe organiseren.', deliverable: 'Beoordeling van het doelteam, doelorganisatie, retentieplan.', format: 'Enkele weken', cycles: ['acquisition'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Onze diensten',
      items: [
        'De afhankelijkheid van de leider en van sleutelprofielen meten',
        'Het directiecomité en zijn delegaties structureren',
        'Het opvolgingsplan opbouwen',
        'De retentie van kritieke profielen verzekeren',
        'Kritieke knowhow documenteren',
        'De aanwerving van een leidinggevende voorbereiden',
      ],
    },
    framework: {
      name: 'De Afhankelijkheidsindex',
      intro: 'Voor elke kritieke persoon vier assen, een score, een vervangingstijd in weken en een alarmdrempel.',
      axes: [
        { label: 'Beslissingen', desc: 'Wie beslist.' },
        { label: 'Relaties', desc: 'Wie de sleutelklanten en -partners in handen heeft.' },
        { label: 'Kennis', desc: 'Wie als enige weet.' },
        { label: 'Contracten', desc: 'Welke clausules aan een naam gekoppeld zijn.' },
      ],
      deliverable: 'Een kaart van de personen wier vertrek de organisatie in moeilijkheden zou brengen, en wat elk vertrek aan continuïteit zou kosten.',
    },
    bySize: {
      title: 'Naar omvang',
      items: [
        { label: 'Kmo · 10 tot 50 M€', desc: 'De leider is vaak eerste verkoper en eerste productbeslisser. Prioriteit: de relaties met sleutelklanten delegeren en de tien kritieke processen documenteren.' },
        { label: 'Middelgroot bedrijf · 50 tot 300 M€', desc: 'Familiale governance of aandeelhouders. Prioriteit: opvolgingsplan voor de algemeen directeur en zijn N-1, benoemingscomité, rol van de familie.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Functies onderworpen aan vergunning of kennisgeving aan de toezichthouder, waarvan het vertrek van de titularis formaliteiten in gang zet.' },
        { cluster: 'Gezondheid & Life Sciences', desc: 'Verantwoordelijke voor de naleving van de regelgeving (PRRC, MDR) en kwaliteitsverantwoordelijke: gereguleerde functies met voorbereide opvolging.' },
        { cluster: 'Industrie, Energie & Infrastructuur', desc: 'Impliciete knowhow van de ervaren medewerkers, geclusterde pensioneringen, familiebedrijven.' },
        { cluster: 'Handel, Diensten & Klantbeleving', desc: 'Netwerkverantwoordelijken, key accounts, retentie van leidinggevenden op de werkvloer.' },
        { cluster: 'Tech, Innovatie & Publieke sector', desc: 'Eén technisch directeur, ontwikkelaars die de architectuur in hun hoofd hebben.' },
      ],
    },
    scenario: {
      tag: 'Typisch scenario · illustratief',
      text: 'Familiaal middelgroot bedrijf van 140 M€, leider van 63 jaar, twee kinderen van wie geen van beiden wil leiden. Binnen vier weken: Afhankelijkheidsindex (zeven kritieke personen), drie opvolgingsscenario’s vergeleken, transitiekalender over vierentwintig maanden waarover de familieraad kan beslissen.',
    },
    ai: {
      title: 'Wat een AI-tool niet voor u doet',
      text: 'Een assistent schrijft een functieomschrijving. Hij voert het moeilijke gesprek met de oprichter niet, kiest niet tussen twee N-1’s, en weet niet wat de familie niet zegt.',
    },
    diagnostic: {
      title: 'Waar staat u? Vijf vragen.',
      intro: 'Antwoord met ja of nee. Het resultaat plaatst u op een van drie niveaus en benoemt de volgende stap.',
      questions: [
        { q: 'Zou uw organisatie drie maanden normaal functioneren zonder u?' },
        { q: 'Hebben uw vijf sleutelklanten of -partners minstens twee aanspreekpunten bij u?' },
        { q: 'Heeft elke kritieke functie een geïdentificeerde back-up?' },
        { q: 'Bestaat er een schriftelijk opvolgingsplan voor de leider en zijn N-1?' },
        { q: 'Is kritieke knowhow elders gedocumenteerd dan in het hoofd van wie ze bezit?' },
      ],
      levels: [
        { min: 0, label: 'Te kaderen', desc: 'De organisatie rust op haar leider en op enkele personen. Een vertrek of een langdurige afwezigheid zou haar in moeilijkheden brengen.', nextAction: 'De Afhankelijkheidsindex meten en eerst de relaties met sleutelklanten delegeren.' },
        { min: 3, label: 'In opbouw', desc: 'Delegaties bestaan en klanten hebben meerdere aanspreekpunten. Wat ontbreekt is de formalisering: back-ups, schriftelijk opvolgingsplan, gedocumenteerde kennis.', nextAction: 'Het opvolgingsplan van de leider en zijn N-1 schrijven, en de tien kritieke processen documenteren.' },
        { min: 5, label: 'Beheerst', desc: 'De organisatie houdt stand zonder haar leider. Het thema wordt de transitie: kalender, governance, rol van de familie of de aandeelhouders.', nextAction: 'De transitiegovernance kaderen en het benoemingscomité voorbereiden.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspectieven', items: [] },
    cta: { metier: 'talent' },
  },

  ma: {
    key: 'ma', path: '/advisory/ma',
    image: '/images/advisory/ma.webp',
    imageAlt: 'Leidinggevende op weg naar een onderhandelingsvergadering',
    meta: {
      title: 'Overname, verkoop, integratie: advies vóór de transactie | Aegryn',
      description: 'Beoordeling van de blinde vlekken van een doelwit (code en rechten, change-of-controlclausules, compliance, teams), voorbereiding van de verkoper, 100-dagenintegratie. De financiële uitvoering ligt bij erkende partners.',
      keywords: ['overnameadvies kmo', 'doelwitbeoordeling', 'change-of-controlclausule', 'post-overname-integratie', '100-dagenplan', 'build-up', 'voorbereiding verkoper'],
    },
    eyebrow: 'M&A, Transacties & PMI',
    h1: 'Een overname wordt gewonnen in de voorbereiding. Ze gaat verloren in de integratie.',
    subtitle: 'Aegryn kijkt naar wat financiële en juridische audits weinig bekijken: de code, de rechten, de change-of-controlclausules, de teams. De financiële uitvoering wordt toevertrouwd aan erkende partners.',
    scope: [
      { label: 'Auditdiepte: Risico’s & Compliance', href: '/advisory/risk-compliance' },
      { label: 'Auditdiepte: Technologie', href: '/advisory/technology' },
      { label: 'Teams: Talent & Organisatie', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '48 tot 66 %', label: 'mislukkingspercentage van M&A-transacties volgens de verzamelde studies, vooral bij de integratie', source: 'Wiley Encyclopedia of Management; Kotter et al.' },
        { value: '208', label: 'M&A-transacties van Zwitserse kmo’s in 2025, +16 %; +28 % in IT-diensten en software', source: 'SECO, kmu.admin.ch' },
        { value: '23 %', label: 'van de potentiële Franse verkopers melden een gebrek aan overnamebiedingen', source: 'Bpifrance Le Lab, 2025' },
      ],
      paragraphs: [
        'De verzamelde studies situeren het mislukken van M&A-transacties tussen 48 en 66 % naargelang de gehanteerde definitie, en de waarnemingen van Kotter en zijn co-auteurs situeren het merendeel van de mislukkingen bij de integratie. In Zwitserland veerden de M&A-transacties van kmo’s in 2025 op met 16 % (208 transacties), met +28 % in IT-diensten en software. In Frankrijk meldt 23 % van de potentiële verkopers een gebrek aan overnamebiedingen.',
      ],
      change: 'De markt heeft verkopers en kopers; wat ontbreekt is de voorbereiding die de transactie doet slagen en haar beloften doet nakomen.',
      sources: 'Bronnen: Wiley Encyclopedia of Management; Kotter, Akhtar, Gupta, Change · SECO · Bpifrance Le Lab (2025).',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een doelwit bekeken vanuit vier hoeken die de klassieke due diligence weinig dekt.',
        'Becijferde onderhandelingspunten in plaats van intuïties.',
        'Een integratieplan dat klaar is vóór de ondertekening.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'We hebben een doelwit op het oog.', decision: 'Wat te bekijken vóór de intentieverklaring.', deliverable: 'Beoordeling van de vier blinde vlekken, met voorgestelde behandeling voor elk: prijs, garantie, opschortende voorwaarde.', format: 'Enkele weken', cycles: ['acquisition'], image: `${S}planning-laptops.jpg` },
        { quote: 'Men benadert ons om ons over te nemen.', decision: 'Hoe ver voorbereiden alvorens te antwoorden.', deliverable: 'Diagnose van de verkoopgereedheid en onderhandelingspositie.', format: 'Enkele weken', cycles: ['transmission'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'We willen twee of drie overnames doen in drie jaar.', decision: 'These, criteria, proces.', deliverable: 'Herhaalbaar build-upprogramma: criteria, standaardbeoordeling, integratieplaybook.', format: 'Eén tot twee maanden', cycles: ['acquisition'], image: `${S}loft-office.jpg` },
        { quote: 'De overname is getekend, de integratie hapert.', decision: 'Wat dringend is, wat kan wachten.', deliverable: '30 / 60 / 100-dagenplan en sturing.', format: 'Opdracht van drie tot zes maanden', cycles: ['acquisition'], image: `${S}open-office.jpg` },
        { quote: 'We moeten een niet-strategische activiteit afstoten.', decision: 'Perimeter en scheiding van systemen.', deliverable: 'Scheidingsplan: perimeter, systemen, mensen, overgangsovereenkomsten.', format: 'Eén tot twee maanden', cycles: ['restructuration'], image: `${S}industrial-engineer.jpg` },
        { quote: 'Mijn fonds moet een technologisch doelwit valideren.', decision: 'Investeren, onderhandelen of afzien.', deliverable: 'Onafhankelijke technische en organisatorische beoordeling, gescoord per blinde vlek.', format: 'Enkele weken', cycles: ['acquisition'], image: `${S}server-room-walk.jpg` },
      ],
    },
    services: {
      title: 'Onze diensten',
      items: [
        'De overnamethese en de doelcriteria formuleren',
        'Het doelwit door de zeef van de vier blinde vlekken halen',
        'De onderhandelingspunten uit de beoordeling kaderen',
        'De organisatie voorbereiden om bekeken te worden (verkoperszijde)',
        'De 100-dagenintegratie sturen',
        'Een build-upprogramma structureren',
      ],
    },
    framework: {
      name: 'De Beoordeling van de vier blinde vlekken',
      intro: 'Elke vaststelling wordt gerangschikt naar impact en waarschijnlijkheid, en vervolgens behandeld: prijsaanpassing, specifieke garantie, opschortende voorwaarde of bewust aanvaard punt.',
      axes: [
        { label: 'Code en rechtenketen', desc: 'Licenties, auteursoverdrachten, afhankelijkheden.' },
        { label: 'Contracten en change of control', desc: 'Klanten, leveranciers, overgedragen licenties.' },
        { label: 'Compliance en beveiliging', desc: 'Geërfde regelgevende perimeter, incidenten, beschikbaar bewijs.' },
        { label: 'Mensen en afhankelijkheden', desc: 'Sleutelmanagers, retentie, cultuur.' },
      ],
      deliverable: 'Een impact-/waarschijnlijkheidsmatrix per hoek, en voor elke vaststelling de voorgestelde behandeling in de onderhandeling.',
    },
    bySize: {
      title: 'Naar omvang',
      items: [
        { label: 'Kmo · 10 tot 50 M€', desc: 'Overname, MBO of aankoop door een speler van vergelijkbare omvang, met weinig adviseurs rond de tafel. Wij concentreren de beoordeling binnen enkele weken op de vier blinde vlekken, naast de advocaat en de accountant.' },
        { label: 'Middelgroot bedrijf · 50 tot 300 M€', desc: 'Externe-groeiprogramma, intern M&A-team of zakenbank. Aegryn treedt op als partner voor technische, organisatorische en integratiebeoordeling.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Overname van een fintech- of insurtechspeler; vergunningen en goedkeuringen bij controlewijziging; dataportabiliteit; DORA voor derden.' },
        { cluster: 'Gezondheid & Life Sciences', desc: 'Continuïteit van de CE-markering (MDR) en de HDS-hosting; ziekenhuiscontracten met change-of-controlclausule.' },
        { cluster: 'Industrie, Energie & Infrastructuur', desc: 'Digitale competenties verwerven; intellectuele eigendom in een industriële omgeving; oprichter-ontwikkelaar.' },
        { cluster: 'Handel, Diensten & Klantbeleving', desc: 'Digitale spelers ter aanvulling van een fysiek netwerk; klantgegevens; integratie van de teams.' },
        { cluster: 'Tech, Innovatie & Publieke sector', desc: 'Build-up van verticale software; kwaliteit van de terugkerende omzet; change-of-controlclausules; copyleft.' },
      ],
    },
    scenario: {
      tag: 'Typisch scenario · illustratief',
      text: 'Dienstengroep van 90 M€ die een softwareleverancier met 8 M€ omzet wil overnemen. Binnen drie weken: twee belangrijke klantcontracten bevatten een change-of-controlclausule, een bibliotheek onder copyleft-licentie zit in de kern van het product, de technisch directeur is de enige die de architectuur kent. Drie punten gaan naar de onderhandeling: specifieke garantie, opschortende voorwaarde, retentieplan.',
    },
    ai: {
      title: 'Wat een AI-tool niet voor u doet',
      text: 'Een assistent leest een overnamecontract. Hij zal u niet zeggen wat de change-of-controlclausule in het contract van uw eerste klant waard is, zal niet tegenover de technisch directeur van het doelwit zitten, en draagt geen aansprakelijkheid.',
    },
    complement: {
      title: 'Om verder te gaan',
      text: 'Wanneer het dossier het rechtvaardigt, kan de beoordeling steunen op de onafhankelijke CIFSO 5000-certificering, uitgereikt op vijf dimensies.',
    },
    diagnostic: {
      title: 'Waar staat u? Vijf vragen.',
      intro: 'Antwoord met ja of nee. Het resultaat plaatst u op een van drie niveaus en benoemt de volgende stap.',
      questions: [
        { q: 'Beschikt u over een schriftelijke externe-groeithese (doelcriteria, budget, kalender)?' },
        { q: 'Weet u welke change-of-controlclausules in uw contracten met sleutelklanten staan?' },
        { q: 'Is de rechtenketen op uw code en uw merken gedocumenteerd?' },
        { q: 'Bestaat er een 100-dagenintegratieplan vóór elke ondertekening?' },
        { q: 'Als een overnemer u morgen zou benaderen, zou u binnen twee weken een dataroom kunnen openen?' },
      ],
      levels: [
        { min: 0, label: 'Te kaderen', desc: 'De transactie zou ad hoc worden behandeld. De blinde vlekken (rechten, clausules, teams) zouden door de tegenpartij worden ontdekt.', nextAction: 'De these of de gereedheidsdiagnose schrijven, en de change-of-controlclausules van uw drie belangrijkste contracten herlezen.' },
        { min: 3, label: 'In opbouw', desc: 'De basis bestaat: these of voorbereiding, gekende contracten. Wat ontbreekt is de mechaniek: rechtenketen, 100-dagenplan, dataroom klaar.', nextAction: 'De rechtenketen documenteren en het integratieplan opstellen vóór de volgende intentieverklaring.' },
        { min: 5, label: 'Beheerst', desc: 'U bent klaar om te kopen of bekeken te worden. Het thema wordt herhaalbaarheid: build-upprogramma, integratieplaybook.', nextAction: 'Het build-upprogramma structureren en de 100-dagenintegratie meten bij de volgende transactie.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectieven',
      items: [
        { title: 'Hoe PE-overnemers een SaaS beoordelen in 2026', href: '/blog/comment-acquereurs-pe-evaluent-saas-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 02 · The Exit Equation (april 2027)', href: '/magazine', kind: 'magazine' },
      ],
    },
    cta: { metier: 'ma' },
  },
}
