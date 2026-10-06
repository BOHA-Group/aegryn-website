/**
 * FRANCHIR content — Nederlands.
 * Vertaling van de Franse referentie (content/franchir/fr.ts),
 * specificatie van 6 oktober 2026. Scenario's zijn illustratief en
 * als zodanig aangeduid.
 */

import type { CycleContent, FranchirIntro } from './types'

export const FRANCHIR_INTRO_NL: FranchirIntro = {
  meta: {
    title:       'Doorlopen — elk traject heeft zijn beslissing | Aegryn',
    description: 'Lancering, groei, pivot, overname, overdracht: vijf trajecten waarin een organisatie van 10 tot 300 M€ haar toekomst bepaalt. Dit staat er op het spel, en wie u inzet.',
  },
  eyebrow:   'Doorlopen',
  heroTitle: 'Elk traject heeft zijn beslissing. Vind de uwe.',
  heroSub:   'Lancering, groei, pivot, overname, overdracht: vijf trajecten waarin een organisatie van 10 tot 300 M€ haar toekomst bepaalt. Dit staat er op het spel, en wie u inzet.',
  cycles: [
    { slug: 'lancement',       title: 'Lancering & Structurering',           stake: 'Keuzes die nu weinig kosten, zijn later zeer duur om te corrigeren.' },
    { slug: 'croissance',      title: 'Groei & Opschaling',                  stake: 'Wat met tien mensen werkte, vertraagt met vijftig.' },
    { slug: 'restructuration', title: 'Herstructurering & Pivot',            stake: 'Het model, de markt of de regel is veranderd: snel beslissen.' },
    { slug: 'acquisition',     title: 'Overname & Externe groei',            stake: 'Weten wat u overneemt, en hoe u het integreert.' },
    { slug: 'transmission',    title: 'Overdracht & Verkoop',                stake: 'De organisatie laten bestaan zonder haar leidinggevende.' },
  ],
  overlap: {
    title: 'Doorloopt u twee trajecten tegelijk?',
    text:  'Groeien door overname, herstructureren vóór de overdracht: trajecten overlappen. Aegryn bouwt één interventieperimeter, met de betrokken disciplines.',
    examples: [
      { label: 'Groei + Overname',                 a: 'croissance',      b: 'acquisition' },
      { label: 'Herstructurering + Overdracht',    a: 'restructuration', b: 'transmission' },
    ],
  },
  diagnostic: {
    title: 'Waar staat u?',
    questions: [
      { q: 'Is uw organisatie jonger dan 3 jaar of bereidt zij een nieuw product of een nieuwe entiteit voor?', cycle: 'lancement' },
      { q: 'Is uw activiteit recentelijk meer dan verdubbeld in volume of personeelsbestand?', cycle: 'croissance' },
      { q: 'Zet een belangrijke klant, een markt, een incident of een regel uw model onder druk?', cycle: 'restructuration' },
      { q: 'Bestudeert u de overname van een organisatie of heeft u er in de laatste 18 maanden een overgenomen?', cycle: 'acquisition' },
      { q: 'Denkt u eraan binnen vijf jaar het stokje over te dragen?', cycle: 'transmission' },
    ],
  },
  assetsLink: { text: 'Om de waarde van uw activa te meten en te bevestigen:', label: 'bekijk de activa van Aegryn' },
  cta:        { label: '30 minuten spreken' },
}

export const FRANCHIR_NL: CycleContent[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'lancement',
    path: '/franchir/lancement',
    meta: {
      title:       'Lancering & Structurering — de juiste basis leggen voor u uitgeeft | Aegryn',
      description: 'Leveranciers, technologie, intellectueel eigendom, compliance, governance: de keuzes van de eerste maanden kosten weinig om te nemen en veel om te corrigeren.',
    },
    eyebrow:  'Doorlopen · Lancering & Structurering',
    h1:       'De juiste basis leggen voor u uitgeeft.',
    subtitle: 'Leveranciers, technologie, intellectueel eigendom, compliance, governance: de keuzes van de eerste maanden kosten weinig om te nemen en zeer veel om te corrigeren.',
    verbs:    ['Kaderen', 'Bouwen', 'Rekruteren'],
    constat: {
      text:   'De transparantieverplichtingen van de Europese AI-verordening (art. 50) gelden sinds 2 augustus 2026, met boetes tot 15 M€ of 3 % van de wereldwijde omzet voor verplichtingen buiten de verboden praktijken. Een organisatie die een product met AI lanceert, is vanaf dag één betrokken.',
      source: 'AI-verordening (EU).',
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Mijn leverancier heeft de code geleverd, maar ik heb het contract niet herlezen.', decision: 'Aan wie behoren de code en de data? Wat gebeurt er als de leverancier vertrekt?', metiers: ['technologie'], deliverable: 'Standpuntnota over eigendom en omkeerbaarheid, met de te corrigeren clausules' },
        { quote: 'We willen snel gaan, compliance zien we later wel.', decision: 'Welke verplichtingen gelden al, welke kunnen wachten?', metiers: ['conformite'], deliverable: 'Blootstellingskaart: geldt nu / binnenkort / niet van toepassing' },
        { quote: 'We twijfelen tussen bouwen, kopen of huren.', decision: 'Welk domein bouwen, welk kopen of huren?', metiers: ['strategie', 'construire'], deliverable: 'Schriftelijke afweging, inclusief wat u moet laten vallen' },
        { quote: 'Mijn partner en ik hebben niet bepaald wie beslist.', decision: 'Wie beslist over wat, wie bezit wat?', metiers: ['talent'], deliverable: 'Beslissingskader van twee pagina’s, klaar om te ondertekenen' },
        { quote: 'Ik heb een eerste technisch verantwoordelijke nodig.', decision: 'Profiel, statuut, vergoeding, rol tegenover leveranciers', metiers: ['recruter'], deliverable: 'Functieprofiel, kandidatenpool' },
        { quote: 'Onze groep creëert een nieuwe activiteit die afgezonderd moet worden.', decision: 'Welk domein isoleren van het informatiesysteem van de groep?', metiers: ['technologie', 'strategie'], deliverable: 'Isolatieplan en roadmap van de eerste 6 maanden' },
      ],
    },
    metiers: { mobilized: ['technologie', 'conformite', 'strategie', 'construire'], available: ['talent', 'recruter'] },
    bySize: {
      title: 'Naar grootte',
      items: [
        { label: 'KMO', desc: 'Weinig middelen, afwegingen in enkele dagen, één aanspreekpunt bij Aegryn.' },
        { label: 'ETI', desc: 'Nieuwe entiteit, spin-off: de nieuwe activiteit isoleren van het informatiesysteem en de governance van de groep.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Operationele en outsourcingvereisten voor systemen vanaf het ontwerp.' },
        { cluster: 'Gezondheid & Life Sciences',               desc: 'Gevoelige data verwerkt vanaf de eerste gebruiker.' },
        { cluster: 'Industrie, Energie & Infrastructuur',      desc: 'Embedded software, onderhoud over tientallen jaren.' },
        { cluster: 'Handel, Diensten & Klantbeleving',         desc: 'Toestemming en klantgegevens.' },
        { cluster: 'Tech, Innovatie & Publieke sector',        desc: 'Omkeerbaarheid van componenten en leveranciers.' },
      ],
    },
    scenario: {
      tag:  'Illustratief scenario',
      text: 'Een uitgever met 3 M€ omzet, wiens product door een externe leverancier wordt ontwikkeld, bereidt zijn eerste grote klant voor. De omkeerbaarheidstest toont dat de coderepository op naam van de leverancier staat. De correctie wordt vóór de ondertekening in enkele weken geregeld — en zou erna veel meer kosten.',
    },
    ai: {
      title: 'Wat een algemene AI-tool niet voor u zal doen',
      text:  'Uw contract met de leverancier in zijn context lezen, tussen twee partners bemiddelen en de beslissing verantwoorden voor uw raad of uw financiers.',
    },
    diagnostic: {
      title: 'Zelfdiagnose',
      intro: 'Vijf ja/nee-vragen om uw basis te situeren.',
      questions: [
        { q: 'Staan de code en data van uw product op naam van uw organisatie?' },
        { q: 'Zou u uw hoofdleverancier in minder dan 90 dagen kunnen vervangen?' },
        { q: 'Heeft u de regelgevende verplichtingen opgesomd die voor uw product gelden?' },
        { q: 'Zijn de rollen en beslissingsbevoegdheden tussen partners schriftelijk vastgelegd?' },
        { q: 'Begrijpt iemand intern de architectuur van begin tot eind?' },
      ],
      levels: [
        { min: 4, label: 'Basis gelegd',        desc: 'Uw basis is gelegd. Een gesprek van 30 minuten kan de resterende punten bevestigen.', nextAction: '30 minuten spreken' },
        { min: 2, label: 'Te beveiligen',       desc: 'Meerdere punten te beveiligen vóór de groei.', nextAction: '30 minuten spreken' },
        { min: 0, label: 'Fundamenten',         desc: 'Prioriteit aan de fundamenten.', nextAction: '30 minuten spreken' },
      ],
      privacy: 'Er worden geen gegevens geregistreerd: de diagnose wordt in uw browser berekend.',
    },
    nextLabel: 'Volgend traject',
    next:      [{ label: 'Groei & Opschaling', slug: 'croissance' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'croissance',
    path: '/franchir/croissance',
    meta: {
      title:       'Groei & Opschaling — groeien zonder te breken wat werkt | Aegryn',
      description: 'Vanaf een bepaald volume vertraagt met vijftig mensen wat met tien werkte: tools, beslissingen, regels, afhankelijkheden.',
    },
    eyebrow:  'Doorlopen · Groei & Opschaling',
    h1:       'Groeien zonder te breken wat werkt.',
    subtitle: 'Vanaf een bepaald volume vertraagt met vijftig mensen wat met tien werkte: tools, beslissingen, regels, afhankelijkheden.',
    verbs:    ['Structureren', 'Beveiligen', 'Versterken'],
    constat: {
      text:   'In Zwitserland steeg het AI-gebruik door kmo’s van 22 % naar 34 % tussen 2024 en 2025, maar slechts 34 % heeft regels over de in deze tools ingevoerde data (23 % bij bedrijven met minder dan 10 medewerkers). De kmo-barometer 2026 staat op −7,3, het laagste niveau sinds 2021. Groei vindt plaats in een gespannen context, met nog nauwelijks gekaderde praktijken.',
      source: 'SECO, KMO-portaal.',
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Mijn teams gebruiken AI zoals ze willen.', decision: 'Welke regels, welke data, welke toegestane tools?', metiers: ['conformite'], deliverable: 'Gebruikerscharter in drie regels, uitrolplan' },
        { quote: 'Een grote klant vraagt beveiligingsgaranties.', decision: 'Welk bewijsniveau, tegen welke kost?', metiers: ['conformite', 'technologie'], deliverable: 'Blootstellingskaart en geprioriteerd upgradeplan' },
        { quote: 'Alles loopt nog via mij.', decision: 'Welke beslissingen delegeren, aan wie, binnen welke grenzen?', metiers: ['talent'], deliverable: 'Afhankelijkheidsindex en delegatiematrix' },
        { quote: 'Onze huidige tool houdt het dubbele volume niet aan.', decision: 'Herstellen, herbouwen of vervangen?', metiers: ['technologie'], deliverable: 'Omkeerbaarheidstest en becijferde afweging' },
        { quote: 'Ik heb een financieel of operationeel directeur nodig.', decision: 'Profiel, timing van de rekrutering, rol tegenover de leidinggevende', metiers: ['recruter'], deliverable: 'Functieprofiel, pool, interviewraster' },
        { quote: 'Ik moet een tweede markt of een tweede dochteronderneming openen.', decision: 'Welk tempo, welke prioriteiten, welke afstand?', metiers: ['strategie'], deliverable: 'Vier-testsraster toegepast op de opties' },
      ],
    },
    metiers: { mobilized: ['conformite', 'technologie', 'talent', 'recruter'], available: ['strategie', 'ma', 'construire'] },
    bySize: {
      title: 'Naar grootte',
      items: [
        { label: 'KMO', desc: 'Drie eenvoudige regels vastleggen in plaats van een zwaar kader; eerste delegatieniveau.' },
        { label: 'ETI', desc: 'Meerdere sites of dochters op één beleid coördineren; gestructureerd directiecomité.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Kaders voor outsourcing en operationele veerkracht.' },
        { cluster: 'Gezondheid & Life Sciences',               desc: 'Patiëntengegevens, traceerbaarheid.' },
        { cluster: 'Industrie, Energie & Infrastructuur',      desc: 'Beveiliging van industriële systemen, verplichtingen van kritieke operators.' },
        { cluster: 'Handel, Diensten & Klantbeleving',         desc: 'Activiteitspieken, klantgegevens.' },
        { cluster: 'Tech, Innovatie & Publieke sector',        desc: 'Stijgende eisen van opdrachtgevers.' },
      ],
    },
    scenario: {
      tag:  'Illustratief scenario',
      text: 'Een uitgever van 25 M€ wiens klanten energiebedrijven zijn, ontvangt vóór de verlenging een verzoek om beveiligingsmaatregelen. De blootstellingskaart onderscheidt de werkelijk geldende verplichtingen van algemene zorgen en spreidt de werkzaamheden over twaalf maanden.',
    },
    ai: {
      title: 'Wat een algemene AI-tool niet voor u zal doen',
      text:  'Beslissen wat gecentraliseerd blijft, met een grootaccount onderhandelen over wat u werkelijk kunt garanderen, uw teams overtuigen een regel toe te passen.',
    },
    diagnostic: {
      title: 'Zelfdiagnose',
      intro: 'Vijf vragen om uw groeicapaciteit te situeren.',
      questions: [
        { q: 'Lopen de dagelijkse beslissingen nog grotendeels via de leidinggevende?', goodIf: 'no' },
        { q: 'Heeft u een schriftelijke regel over de in AI-tools ingevoerde data?' },
        { q: 'Heeft een grote klant garanties gevraagd die u moeilijk kunt documenteren?', goodIf: 'no' },
        { q: 'Kan uw kernysteem het dubbele volume aan zonder herbouw?' },
        { q: 'Telt uw directiecomité de functies die nodig zijn voor de beoogde grootte?' },
      ],
      levels: [
        { min: 4, label: 'Tempo vastgehouden',   desc: 'Uw organisatie houdt haar groeitempo vast: een gesprek van 30 minuten kan de resterende punten bevestigen.', nextAction: '30 minuten spreken' },
        { min: 2, label: 'Te structureren',      desc: 'De groei steunt nog op informele gewoonten: meerdere punten te structureren.', nextAction: '30 minuten spreken' },
        { min: 0, label: 'Structuur vereist',    desc: 'Uw organisatie heeft structuur nodig om haar groei te dragen.', nextAction: '30 minuten spreken' },
      ],
      privacy: 'Er worden geen gegevens geregistreerd: de diagnose wordt in uw browser berekend.',
    },
    nextLabel: 'Volgend traject',
    next:      [
      { label: 'Herstructurering & Pivot',    slug: 'restructuration' },
      { label: 'Overname & Externe groei',    slug: 'acquisition' },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'restructuration',
    path: '/franchir/restructuration',
    meta: {
      title:       'Herstructurering & Pivot — van koers veranderen zonder de controle te verliezen | Aegryn',
      description: 'Verlies van een grote klant, incident, regelgevingsbevel, kantelende markt: de eerste beslissingen wegen het zwaarst.',
    },
    eyebrow:  'Doorlopen · Herstructurering & Pivot',
    h1:       'Van koers veranderen zonder de controle te verliezen.',
    subtitle: 'Verlies van een grote klant, incident, regelgevingsbevel, kantelende markt: de eerste beslissingen wegen het zwaarst.',
    verbs:    ['Arbitreren', 'Stabiliseren', 'Pivoteren'],
    constat: {
      text:   'De Banque de France registreert 70 605 bedrijfsfaillissementen in de twaalf maanden tot eind juli 2026. In Zwitserland moeten exploitanten van kritieke infrastructuur een cyberaanval sinds 1 april 2025 binnen 24 uur melden bij het NCSC, bij een boete tot 100 000 CHF sinds 1 oktober 2025.',
      source: 'Banque de France; NCSC.',
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Een klant vertegenwoordigt een groot deel van mijn omzet — en vertrekt.', decision: 'Welke prioriteiten over 90 dagen, welke liquiditeit beschermen?', metiers: ['strategie'], deliverable: '30/60/90-dagenplan, presenteerbaar aan raad en bank' },
        { quote: 'We hebben een incident gehad. Wat moeten we melden?', decision: 'Wie informeren, binnen welke termijn, met welke bewijzen?', metiers: ['conformite'], deliverable: 'Standpuntnota en meldingssequentie' },
        { quote: 'Mijn markt kantelt met AI.', decision: 'Welke pivot, op welke bestaande activa?', metiers: ['strategie', 'technologie'], deliverable: 'Pivotopties vergeleken op het vier-testsraster' },
        { quote: 'Een activiteit moet worden afgestoten om stand te houden.', decision: 'Welk domein isoleren, welke gedeelde systemen?', metiers: ['ma'], deliverable: 'Afbakeningsperimeter, lijst van afhankelijkheden' },
        { quote: 'Ik moet kosten verlagen zonder de uitvoering te breken.', decision: 'Welke kosten, welke termijnen, welke sociale risico’s?', metiers: ['talent'], deliverable: 'Reorganisatieplan en risico’s van vertrek van sleutelprofielen' },
        { quote: 'Ik heb een ad-interim leidinggevende nodig.', decision: 'Profiel, mandaat, duur', metiers: ['recruter'], deliverable: 'Missieprofiel en voorgeselecteerde kandidaten' },
      ],
    },
    metiers: { mobilized: ['strategie', 'conformite', 'recruter'], available: ['technologie', 'talent', 'ma', 'construire'] },
    bySize: {
      title: 'Naar grootte',
      items: [
        { label: 'KMO', desc: 'Beslissingen geconcentreerd bij één persoon, kader van 30 dagen.' },
        { label: 'ETI', desc: 'Coördinatie van raad van bestuur, financiers en dochterondernemingen.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Eisen van toezichthouders.' },
        { cluster: 'Gezondheid & Life Sciences',               desc: 'Continuïteit van zorg en vergunningen.' },
        { cluster: 'Industrie, Energie & Infrastructuur',      desc: 'Productiecontinuïteit en meldplicht.' },
        { cluster: 'Handel, Diensten & Klantbeleving',         desc: 'Liquiditeit en seizoensgebondenheid.' },
        { cluster: 'Tech, Innovatie & Publieke sector',        desc: 'Contractuele servicelevelverplichtingen.' },
      ],
    },
    scenario: {
      tag:  'Illustratief scenario',
      text: 'Een B2B-dienstenbedrijf van 40 M€ verliest een klant die een derde van de omzet vertegenwoordigt. In tien dagen: mapping van vermijdbare kosten, herfocussing van het aanbod, afstemming met de bank. Het 30/60/90-dagenplan wordt aan de raad voorgelegd.',
    },
    ai: {
      title: 'Wat een algemene AI-tool niet voor u zal doen',
      text:  'Kiezen wat op te offeren, met uw bank en uw teams praten, de beslissing verantwoorden in een noodgeval.',
    },
    diagnostic: {
      title: 'Zelfdiagnose',
      intro: 'Vijf vragen om uw blootstelling te situeren.',
      questions: [
        { q: 'Vertegenwoordigt een klant of leverancier een kritiek aandeel van uw activiteit?', goodIf: 'no' },
        { q: 'Dwingt een gebeurtenis (incident, bevel, klantverlies) een beslissing binnen 30 dagen af?', goodIf: 'no' },
        { q: 'Is uw liquiditeit over 90 dagen geprojecteerd?' },
        { q: 'Weet u welke meldplichten voor uw organisatie gelden?' },
        { q: 'Heeft u een schriftelijk plan voor het vertrek van een sleutelpersoon?' },
      ],
      levels: [
        { min: 4, label: 'Voorbereid',        desc: 'Uw organisatie is voorbereid op koerswijzigingen.', nextAction: '30 minuten spreken' },
        { min: 2, label: 'Knelpunten',        desc: 'Knelpunten aan te pakken voordat ze urgent worden.', nextAction: '30 minuten spreken' },
        { min: 0, label: 'Te stabiliseren',   desc: 'Meerdere signalen vragen een snelle beslissing: stabilisatie eerst.', nextAction: '30 minuten spreken' },
      ],
      privacy: 'Er worden geen gegevens geregistreerd: de diagnose wordt in uw browser berekend.',
    },
    nextLabel: 'Volgend traject',
    next:      [
      { label: 'Overname & Externe groei',  slug: 'acquisition' },
      { label: 'Overdracht & Verkoop',      slug: 'transmission' },
    ],
    urgency: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'acquisition',
    path: '/franchir/acquisition',
    meta: {
      title:       'Overname & Externe groei — kopen wetend wat u overneemt | Aegryn',
      description: 'Een overname wordt evenzeer op de integratie als op de prijs beslist: vier blinde vlekken, een integratieplan, retentieafspraken.',
    },
    eyebrow:  'Doorlopen · Overname & Externe groei',
    h1:       'Kopen wetend wat u overneemt.',
    subtitle: 'Een overname wordt evenzeer op de integratie als op de prijs beslist.',
    verbs:    ['Beoordelen', 'Integreren', 'Behouden'],
    constat: {
      text:   'De in de Wiley Encyclopedia of Management samengebrachte studies situeren het mislukken van fusies en overnames tussen 48 % en 66 %, met als terugkerende oorzaken overschatte synergieën, een ontbrekend integratieplan en een te traag tempo. In Zwitserland bereikten de kmo-transacties 208 deals in 2025 (+16 %), waarvan +28 % in IT-diensten en software.',
      source: 'Wiley Encyclopedia of Management; SECO.',
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'We hebben een doelwit gevonden. Waar moeten we verder dan de cijfers kijken?', decision: 'Welke punten controleren vóór engagement?', metiers: ['ma'], deliverable: 'Beoordeling van de vier blinde vlekken, met de te onderhandelen voorwaarden' },
        { quote: 'Zijn de code en systemen van het doelwit gezond?', decision: 'Afhankelijkheden, licenties, omkeerbaarheid', metiers: ['technologie'], deliverable: 'Technisch rapport en geschatte upgradekosten' },
        { quote: 'Behouden we zijn sleutelteams?', decision: 'Wie behouden, met welke toezeggingen?', metiers: ['talent'], deliverable: 'Afhankelijkheidsindex van het doelwit, retentieplan' },
        { quote: 'Hoe integreren zonder de activiteit te blokkeren?', decision: 'Sequentie van de eerste 100 dagen', metiers: ['ma', 'technologie'], deliverable: 'Integratieplan met mijlpalen' },
        { quote: 'Is deze overname consistent met onze strategie?', decision: 'These, prioriteiten, afstand', metiers: ['strategie'], deliverable: 'Vier-testsraster toegepast op het doelwit' },
        { quote: 'Voldoet het doelwit aan de regels die ons morgen zullen binden?', decision: 'Welke verplichtingen nemen we over?', metiers: ['conformite'], deliverable: 'Blootstellingskaart van het doelwit' },
      ],
    },
    metiers: { mobilized: ['ma', 'technologie', 'strategie'], available: ['conformite', 'talent', 'recruter'] },
    bySize: {
      title: 'Naar grootte',
      items: [
        { label: 'KMO', desc: 'Een overname kan een kwart van de activiteit wegen; de integratie rust op enkele personen.' },
        { label: 'ETI', desc: 'Programma van opeenvolgende overnames, integratie te systematiseren.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Over te dragen vergunningen en erkenningen.' },
        { cluster: 'Gezondheid & Life Sciences',               desc: 'Compliance van overgenomen producten.' },
        { cluster: 'Industrie, Energie & Infrastructuur',      desc: 'Sites, toeleveringsketens, zware activa.' },
        { cluster: 'Handel, Diensten & Klantbeleving',         desc: 'Klantbestanden en contracten.' },
        { cluster: 'Tech, Innovatie & Publieke sector',        desc: 'Eigendom en onderhoudbaarheid van de code.' },
      ],
    },
    scenario: {
      tag:  'Illustratief scenario',
      text: 'Een dienstengroep van 90 M€ overweegt een uitgever van 8 M€ over te nemen. De beoordeling van de blinde vlekken onthult de afhankelijkheid van twee ontwikkelaars en een component onder restrictieve licentie. De prijs verandert niet; retentievoorwaarden en een vervangingsplan worden aan de overeenkomst toegevoegd.',
    },
    ai: {
      title: 'Wat een algemene AI-tool niet voor u zal doen',
      text:  'De betrouwbaarheid van het team aan de overkant inschatten, retentieafspraken onderhandelen, beslissen af te zien.',
    },
    mandate: 'Aegryn voert de transactie niet uit. De uitvoering wordt toevertrouwd aan investmentbanken, M&A-boutiques en erkende advocaten.',
    diagnostic: {
      title: 'Zelfdiagnose',
      intro: 'Vijf ja/nee-vragen vóór uw engagement.',
      questions: [
        { q: 'Heeft u de these van deze overname schriftelijk vastgelegd?' },
        { q: 'Bestaat er een integratieplan vóór de ondertekening?' },
        { q: 'Kent u de drie tot vijf personen van wie de waarde van het doelwit afhangt?' },
        { q: 'Zijn de systemen van het doelwit compatibel met die van u?' },
        { q: 'Is de uitvoering van de transactie toevertrouwd aan erkende adviseurs?' },
      ],
      levels: [
        { min: 4, label: 'Gestructureerde aanpak', desc: 'Uw aanpak is gestructureerd: een gesprek van 30 minuten kan de laatste blinde vlekken controleren.', nextAction: '30 minuten spreken' },
        { min: 2, label: 'Te kaderen',             desc: 'Meerdere punten te kaderen vóór engagement.', nextAction: '30 minuten spreken' },
        { min: 0, label: 'Vóór ondertekening',     desc: 'Beveilig vóór de ondertekening de fundamenten.', nextAction: '30 minuten spreken' },
      ],
      privacy: 'Er worden geen gegevens geregistreerd: de diagnose wordt in uw browser berekend.',
    },
    nextLabel: 'Volgend traject',
    next:      [{ label: 'Overdracht & Verkoop', slug: 'transmission' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'transmission',
    path: '/franchir/transmission',
    meta: {
      title:       'Overdracht & Verkoop — de organisatie voorbereiden om zonder u te blijven bestaan | Aegryn',
      description: 'De overdracht wordt jaren vooraf voorbereid. Bepalend is de capaciteit van de organisatie om zonder haar leidinggevende te functioneren.',
    },
    eyebrow:  'Doorlopen · Overdracht & Verkoop',
    h1:       'De organisatie voorbereiden om zonder u te blijven bestaan.',
    subtitle: 'De overdracht wordt jaren vooraf voorbereid. Bepalend is de capaciteit van de organisatie om zonder haar leidinggevende te functioneren.',
    verbs:    ['Documenteren', 'Delegeren', 'Doorgeven'],
    constat: {
      text:   'Volgens Bpifrance Le Lab (nov. 2025) plant 40 % van de leidinggevenden van micro-, kleine en middelgrote ondernemingen de overdracht binnen vijf jaar — 370 000 ondernemingen — en constateert 23 % van de verkopers een gebrek aan overnemers. 47 % van de leidinggevenden van familiebedrijven van 60 tot 69 jaar heeft geen geformaliseerd opvolgingsplan.',
      source: 'Bpifrance Le Lab.',
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'Alles rust op mij.', decision: 'Wie kan wat overnemen, in welke volgorde?', metiers: ['talent'], deliverable: 'Afhankelijkheidsindex, delegatieplan over 24 maanden' },
        { quote: 'Zal mijn familie of mijn kader overnemen?', decision: 'Familiale, interne of externe optie', metiers: ['strategie', 'ma'], deliverable: 'Vergelijking van de drie opties en tijdschema' },
        { quote: 'Zijn mijn contracten en rechten in orde?', decision: 'Wat een overnemer zal controleren', metiers: ['ma', 'conformite'], deliverable: 'Beoordeling van blinde vlekken aan verkoperszijde, lijst van correcties' },
        { quote: 'Mijn systeem rust op één persoon.', decision: 'Documentatie en omkeerbaarheid', metiers: ['technologie'], deliverable: 'Omkeerbaarheidstest en documentatieplan' },
        { quote: 'Ik wil over 24 maanden vertrekken.', decision: 'Tijdschema, mijlpalen, rol na het vertrek', metiers: ['ma'], deliverable: 'Terugwaarts geplande roadmap' },
        { quote: 'Mijn directiecomité is niet klaar om over te nemen.', decision: 'Wie rekruteren, wie laten groeien?', metiers: ['recruter', 'talent'], deliverable: 'Profielen en plan voor groei in verantwoordelijkheid' },
      ],
    },
    metiers: { mobilized: ['talent', 'ma'], available: ['strategie', 'technologie', 'conformite', 'recruter'] },
    bySize: {
      title: 'Naar grootte',
      items: [
        { label: 'KMO', desc: 'Leidinggevende-oprichter, sterke afhankelijkheid, horizon van 2 tot 3 jaar.' },
        { label: 'ETI', desc: 'Familieraad, governance, meerdere aandeelhouders.' },
      ],
    },
    bySector: {
      title: 'Naar sector',
      items: [
        { cluster: 'Finance & Capital',                        desc: 'Aan personen gebonden vergunningen.' },
        { cluster: 'Gezondheid & Life Sciences',               desc: 'Houders van licenties en vergunningen.' },
        { cluster: 'Industrie, Energie & Infrastructuur',      desc: 'Geconcentreerde kennis, zware activa.' },
        { cluster: 'Handel, Diensten & Klantbeleving',         desc: 'Door de leidinggevende gedragen klantrelaties.' },
        { cluster: 'Tech, Innovatie & Publieke sector',        desc: 'Codekennis geconcentreerd bij enkele personen.' },
      ],
    },
    scenario: {
      tag:  'Illustratief scenario',
      text: 'Een familiale ETI van 140 M€ waarvan de leidinggevende 63 jaar is. De afhankelijkheidsindex toont dat veel beslissingen bij hem alleen terugkomen. Plan over 24 maanden: geleidelijke delegatie, versterkt directiecomité, documentatie van de belangrijkste klantrelaties.',
    },
    ai: {
      title: 'Wat een algemene AI-tool niet voor u zal doen',
      text:  'Met uw familie en uw kader praten, een opvolger kiezen, het loslaten van bepaalde beslissingen aanvaarden.',
    },
    mandate: 'Aegryn bereidt de organisatie voor. De verkoop wordt uitgevoerd met de investmentbank, de M&A-boutique of de advocaat van de klant.',
    diagnostic: {
      title: 'Zelfdiagnose',
      intro: 'Vijf ja/nee-vragen om uw voorbereiding te situeren.',
      questions: [
        { q: 'Kan een belangrijke beslissing zonder u worden genomen?' },
        { q: 'Is uw opvolging schriftelijk geregeld?' },
        { q: 'Worden uw belangrijkste klantrelaties door meer dan één persoon gedragen?' },
        { q: 'Zijn uw contracten, rechten en data gedocumenteerd en up-to-date?' },
        { q: 'Heeft u een streefdatum voor uw vertrek?' },
      ],
      levels: [
        { min: 4, label: 'Overdracht op gang', desc: 'Uw overdracht verloopt onder goede voorwaarden.', nextAction: '30 minuten spreken' },
        { min: 2, label: 'Te documenteren',    desc: 'Punten te documenteren vóór het tijdschema wordt vastgelegd.', nextAction: '30 minuten spreken' },
        { min: 0, label: 'Voor te bereiden',   desc: 'De voorbereiding van uw overdracht begint nu.', nextAction: '30 minuten spreken' },
      ],
      privacy: 'Er worden geen gegevens geregistreerd: de diagnose wordt in uw browser berekend.',
    },
    nextLabel: 'Vorig traject',
    next:      [{ label: 'Overname & Externe groei', slug: 'acquisition' }],
  },
]
