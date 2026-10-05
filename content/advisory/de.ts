import type { AdvisoryPageContent, AdvisoryKey } from './types'

/** Deutsche Inhalte der fünf ACCOMPAGNER-Seiten, übersetzt aus fr.ts (Referenz). Schweizer Schreibweise (ss). */

const PRIVACY =
  'Ihre Antworten bleiben in Ihrem Browser. Ohne Ihre Zustimmung wird nichts gespeichert oder übermittelt. Das Ergebnis passt auf eine Seite: Ihr Niveau und der empfohlene nächste Schritt.'

const S = '/images/advisory/situations/'

export const ADVISORY_DE: Record<AdvisoryKey, AdvisoryPageContent> = {

  strategy: {
    key: 'strategy', path: '/advisory/strategy',
    image: '/images/advisory/strategy-towers.jpg',
    imageAlt: 'Bürotürme aus der Froschperspektive, Kurs und Weitblick',
    meta: {
      title: 'Strategieberatung für KMU und Mid-Caps | Aegryn',
      description: 'Kurs, Geschäftsmodell, externes Wachstum, neue Märkte: Aegryn hilft Führungskräften von Organisationen mit 10 bis 300 Mio. € dabei, strategische Entscheidungen abzuwägen, zu beziffern und durchzuhalten. Schweiz und Europa.',
      keywords: ['Strategieberatung KMU', 'Strategieberatung Mid-Cap', 'Dreijahresplan', 'externes Wachstum', 'Markteintritt', 'Strategy Advisory Schweiz'],
    },
    eyebrow: 'Unternehmensstrategie & Innovation',
    h1: 'Den richtigen Kurs wählen, in der richtigen Reihenfolge, mit den Mitteln, die Sie tatsächlich haben.',
    subtitle: 'Für die Leitung einer Organisation mit 10 bis 300 Mio. € ist Strategie keine Planungsübung: Es sind Abwägungen unter Kapital-, Zeit- und Umsetzungsrestriktionen. Aegryn hilft Ihnen, sie zu stellen, zu beziffern und durchzuhalten.',
    scope: [
      { label: 'Führungsteam: Talent & Organisation', href: '/advisory/talent-organization' },
      { label: 'Durchführung einer Akquisition: M&A', href: '/advisory/ma' },
      { label: 'Architekturentscheide: Technologie', href: '/advisory/technology' },
    ],
    observation: {
      title: 'Was wir beobachten',
      cards: [
        { value: '≈ 9 000', label: 'Beratungsmandate von Bpifrance im Jahr 2024, +50 % in einem Jahr', source: 'Bpifrance Presse, 2025' },
        { value: '−2 %', label: 'französischer Beratungsmarkt 2025, inflationsbereinigt', source: 'Syntec Conseil' },
        { value: '−7,3', label: 'Indexpunkte, NZZ-KMU-Barometer 2026, tiefster Stand seit Erhebungsbeginn 2021', source: 'NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule' },
      ],
      paragraphs: [
        'KMU- und Mid-Cap-Führungskräfte kaufen Beratung, aber anders. Bpifrance führte 2024 fast 9 000 Beratungsmandate durch, 50 % mehr als im Vorjahr, während der französische Beratungsmarkt 2025 inflationsbereinigt um 2 % schrumpfte. In der Schweiz fällt der Gesamtindex des NZZ-KMU-Barometers 2026 (NZZ und Kalaidos Fachhochschule) auf −7,3 Punkte, den tiefsten Stand seit Erhebungsbeginn 2021; einzig die Technologieintegration legt zu.',
      ],
      change: 'Wenn das Umfeld rauer wird, steigen die Kosten einer Fehlentscheidung. Gefragt ist kein grosses Programm mehr, sondern eine präzise Entscheidung, rasch getroffen, mit erfahrenem Blick.',
      sources: 'Quellen: Bpifrance Presse (2025) · Syntec Conseil · NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule (vom SECO aufgegriffen).',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Eine Entscheidung, die Ihr Gremium vor einer Bank oder einem Aktionär vertreten kann.',
        'Einen Kurs, den Ihr Gremium in Ihrer Abwesenheit umsetzen kann, ohne Sie anzurufen.',
        'Eine erste terminierte Massnahme innerhalb von dreissig Tagen.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Unser Modell erodiert.', decision: 'Pivotieren, verteidigen oder Segment wechseln.', deliverable: 'Positionsprüfung: Stückkostenrechnung je Segment, Wettbewerb, drei bezifferte Optionen.', format: 'Kurzmandat', cycles: ['croissance', 'restructuration'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'KI verändert unser Geschäft.', decision: 'Wo integrieren, was nicht automatisieren.', deliverable: 'Karte der KI-Anwendungsfälle je Wertschöpfungsstufe, geordnet nach geschaffenem Wert und getragenem Risiko.', format: 'Einige Wochen', cycles: ['croissance'], image: `${S}developer-desk.jpg` },
        { quote: 'Ein Wettbewerber steht zum Verkauf, oder ein Partner könnte uns übernehmen.', decision: 'Organisches Wachstum, Allianz oder Akquisition.', deliverable: 'These für externes Wachstum, Zielkriterien, Go-/No-go-Rahmen.', format: 'Einige Wochen', cycles: ['acquisition'], image: `${S}handshake.jpg` },
        { quote: 'Wir erschliessen einen neuen Markt (DACH, Benelux, Südeuropa).', decision: 'Tochtergesellschaft, Distributor, Partner oder abwarten.', deliverable: 'Markteintrittsplan je Land, mit lokalen regulatorischen Anforderungen und Talentbedarf.', format: 'Einige Wochen', cycles: ['croissance'], image: `${S}meeting-room.jpg` },
        { quote: 'Mein Verwaltungsrat, meine Bank oder mein Aktionär verlangt einen Dreijahresplan.', decision: 'Welche Annahmen übernehmen, welche testen.', deliverable: 'Belastbarer Plan, explizite Sensitivitäten, zehnseitiges Memo für das Gremium.', format: 'Ein bis zwei Monate', cycles: ['lancement', 'croissance'], image: `${S}planning-laptops.jpg` },
        { quote: 'Die Strategie ist in meinem Kopf.', decision: 'Was ohne Sie existieren muss.', deliverable: 'Strategie dokumentiert in fünf Prioritäten, mit Verantwortlichen und Meilensteinen.', format: 'Einige Wochen', cycles: ['croissance', 'transmission'], image: `${S}plan-writing.jpg` },
      ],
    },
    services: {
      title: 'Unsere Leistungen',
      items: [
        'Die strategische Position überprüfen',
        'Zwischen Optionen entscheiden',
        'Den Dreijahresplan erstellen',
        'Das Gremium vorbereiten (Memo für Verwaltungsrat, Bank, Aktionäre)',
        'Den Eintritt in einen neuen Markt rahmen',
        'Den Verwaltungsrat begleiten (vierteljährliches Advisory)',
      ],
    },
    framework: {
      name: 'Das Vier-Tests-Raster',
      intro: 'Jede strategische Option durchläuft vier Tests, bevor sie beibehalten wird.',
      axes: [
        { label: 'Wert', desc: 'Was ändert sie am Wert der Organisation in drei Jahren?' },
        { label: 'Reversibilität', desc: 'Wenn sie scheitert, was kostet der Ausstieg nach zwölf Monaten?' },
        { label: 'Kapazität', desc: 'Haben wir die Menschen, die Technologie und das Kapital, um sie umzusetzen, ohne die Geschäftsleitung vollständig zu binden?' },
        { label: 'Reihenfolge', desc: 'Was muss vorher wahr sein, und was kann warten?' },
      ],
      deliverable: 'Ein einseitiges Entscheidungsblatt, das die Optionen bewertet und die erste Entscheidung innerhalb von dreissig Tagen benennt.',
    },
    bySize: {
      title: 'Nach Grösse',
      items: [
        { label: 'KMU · 10 bis 50 Mio. €', desc: 'Die Geschäftsleitung entscheidet mit zwei oder drei Personen, ohne Strategieabteilung. Die Restriktion ist ihre Zeit. Wir liefern kurz, ohne Projektstruktur, in einem Format, das auf zehn Seiten passt.' },
        { label: 'Mid-Cap · 50 bis 300 Mio. €', desc: 'Mehrere Geschäftsbereiche, eine Geschäftsleitung, manchmal ein Familienaktionär oder ein Fonds. Die Restriktion ist die Abstimmung. Wir moderieren die Abwägung und dokumentieren die Entscheidung für den Verwaltungsrat.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital', desc: 'Disintermediation durch neue Akteure; Technologiepartnerschaften, abzuwägen unter DORA- und FINMA-Vorgaben zu kritischen Drittparteien.' },
        { cluster: 'Health & Life Sciences', desc: 'Übergang vom öffentlichen zum privaten Sektor, Markteintritt in einem Land mit anderem MDR-, HDS- oder EHDS-Rahmen.' },
        { cluster: 'Industrie, Energie & Infrastruktur', desc: 'Dienstleistungen rund um das Produkt (vorausschauende Wartung, As-a-Service); den Wert der Daten selbst heben oder an einen Integrator abgeben.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis', desc: 'Omnichannel, Pricing, Stellung der eigenen Marke gegenüber Drittplattformen.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor', desc: 'Product-led oder vertriebsgetriebenes Modell, Definition des Zielkunden, DACH-Eintritt, Zugang zu öffentlichen Ausschreibungen.' },
      ],
    },
    scenario: {
      tag: 'Typisches Szenario · illustrativ, nicht aus einem benannten Mandat',
      text: 'Industrielles Mid-Cap mit 120 Mio. €, Westschweiz und Frankreich. Die Geschäftsleitung schwankt zwischen dem Kauf eines Anbieters für vorausschauende Wartung und der Eigenentwicklung. Innerhalb von drei Wochen liegt dem Gremium ein Entscheidungsblatt vor: drei Optionen, Gesamtkosten über drei Jahre, Umsetzungsrisiken, Reversibilitätsbedingungen, erste Entscheidung innerhalb von dreissig Tagen.',
    },
    ai: {
      title: 'Was ein KI-Werkzeug nicht für Sie tun wird',
      text: 'Ein Assistent strukturiert Ihre Optionen. Er kennt weder Ihr Aktionariat, noch Ihr Team, noch das, was Ihre Bank akzeptieren wird. Er verantwortet die Entscheidung nicht. Aegryn hinterfragt Ihre Annahmen, bezieht Stellung und misst einige Monate später die Abweichung.',
    },
    diagnostic: {
      title: 'Wo stehen Sie? Fünf Fragen.',
      intro: 'Antworten Sie mit Ja oder Nein. Das Ergebnis ordnet Sie einem von drei Niveaus zu und benennt den nächsten Schritt.',
      questions: [
        { q: 'Können Sie Ihre Strategie auf einer Seite aufschreiben, und kennt die Geschäftsleitung Ihre fünf Prioritäten?' },
        { q: 'Hat jede Priorität einen Verantwortlichen, einen Meilenstein und eine Kennzahl?' },
        { q: 'Haben Sie mindestens zwei Alternativen zu Ihrem aktuellen Kurs beziffert?' },
        { q: 'Wissen Sie, welche Entscheidungen innerhalb von zwölf Monaten reversibel sind und welche nicht?' },
        { q: 'Hat in den letzten zwölf Monaten ein Aussenstehender Ihre Kernannahmen in Frage gestellt?' },
      ],
      levels: [
        { min: 0, label: 'Zu rahmen', desc: 'Die Strategie existiert, aber vor allem im Kopf der Geschäftsleitung. Die Optionen wurden weder beziffert noch hinterfragt.', nextAction: 'Ihre Hauptentscheidung auf ein Blatt bringen: Optionen, Ausstiegskosten, erste Massnahme innerhalb von dreissig Tagen.' },
        { min: 3, label: 'Im Aufbau', desc: 'Die Prioritäten sind bekannt und werden verfolgt. Es fehlt die Belastungsprobe: bezifferte Alternativen, Reversibilität, Aussensicht.', nextAction: 'Ihren aktuellen Kurs durch das Vier-Tests-Raster laufen lassen, mit einem erfahrenen Gegenpart.' },
        { min: 5, label: 'Beherrscht', desc: 'Strategie geschrieben, gesteuert, getestet. Das Thema wird der Rhythmus: Quartalsreview und Vorbereitung des Gremiums.', nextAction: 'Ein vierteljährliches Advisory einrichten, um den Kurs zu halten und die nächsten Abwägungen vorzubereiten.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspektiven',
      items: [
        { title: 'Europäischer Tech-M&A-Markt, Mitte 2026', href: '/blog/marche-ma-tech-europe-q3-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 01 · Built to Last', href: '/magazine/issue-01', kind: 'magazine' },
      ],
    },
    cta: { primary: 'Ihre Entscheidung rahmen', secondary: 'Ein Entscheidungsblatt anfordern', subject: 'advisory' },
  },

  riskCompliance: {
    key: 'riskCompliance', path: '/advisory/risk-compliance',
    image: '/images/advisory/risk-compliance.jpg',
    imageAlt: 'Prüfung von Vertrags- und Regulierungsdokumenten',
    meta: {
      title: 'Regulatorische Compliance für KMU und Mid-Caps: NIS2, DORA, AI Act, DSG | Aegryn',
      description: 'Welche Pflichten für Sie gelten, welche Ihre Kunden Ihnen auferlegen werden, welche warten können. Kartierung, belastbare Nachweise, Vorfallmanagement. Frankreich, Schweiz, EU.',
      keywords: ['NIS2 KMU', 'DORA Compliance', 'AI Act Pflichten', 'DSG DSGVO Schweiz', 'regulatorische Kartierung', 'Cyber-Vorfallmanagement', 'BACS Meldung 24 h'],
    },
    eyebrow: 'Risiken & Compliance',
    h1: 'Wissen, was Sie heute bindet, was Ihre Kunden morgen verlangen werden, und was warten kann.',
    subtitle: 'NIS2 in Frankreich noch nicht umgesetzt, ein eigenes Schweizer Regime, ein AI Act mit neu gezogenen Fristen, Kunden, die bereits Nachweise verlangen. Compliance ist keine Juristensache mehr: Sie ist eine Führungsentscheidung.',
    scope: [
      { label: 'Architektur und Hosting: Technologie', href: '/advisory/technology' },
      { label: 'Compliance eines Zielunternehmens: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Was wir beobachten',
      cards: [
        { value: '≈ 15 000', label: 'Einrichtungen, die in Frankreich im NIS2-Anwendungsbereich erwartet werden, gegenüber einigen Hundert heute', source: 'Europäische Kommission; Schätzung' },
        { value: '24 h', label: 'Frist zur Meldung eines Cyberangriffs an das BACS für kritische Infrastrukturen in der Schweiz, seit 1. April 2025', source: 'BACS, bacs.admin.ch' },
        { value: '35 Mio. € · 7 %', label: 'Bussenobergrenze des AI Act für verbotene Praktiken; 15 Mio. € oder 3 % für die meisten übrigen Pflichten', source: 'Verordnung (EU) 2024/1689, Art. 99' },
      ],
      paragraphs: [
        'Frankreich. NIS2 soll die Zahl der regulierten Einrichtungen von einigen Hundert auf rund 15 000 erhöhen, in 18 Sektoren, ab 50 Beschäftigten oder 10 Mio. €. Das Umsetzungsgesetz ist nicht verabschiedet; die Kommission hat den Gerichtshof am 8. Juli 2026 angerufen. Auf das Gesetz zu warten ist eine Wette, kein Plan.',
        'Schweiz. NIS2 gilt nicht direkt. Seit dem 1. April 2025 melden Betreiber kritischer Infrastrukturen jeden Cyberangriff innerhalb von 24 Stunden dem BACS, mit einer Busse von bis zu 100 000 CHF seit dem 1. Oktober 2025. Sechs Monate nach Inkrafttreten waren 164 Meldungen eingegangen. Ausserhalb kritischer Infrastrukturen besteht keine gesetzliche Pflicht, aber Ihre EU-Kunden können sie Ihnen vertraglich auferlegen.',
        'KI. Artikel 50 des AI Act gilt seit dem 2. August 2026. Die Hochrisiko-Pflichten des Anhangs III sind durch die Verordnung (EU) 2026/1744 auf den 2. Dezember 2027 verschoben. Die Bussen erreichen 35 Mio. € oder 7 % des weltweiten Umsatzes für verbotene Praktiken, 15 Mio. € oder 3 % für die meisten übrigen Pflichten.',
      ],
      change: 'Drei Kalender, drei Rechtsordnungen. Die richtige Frage lautet nicht «Sind wir konform?», sondern «Wozu sind wir verpflichtet, gegenüber wem, bis wann?».',
      sources: 'Quellen: Richtlinie (EU) 2022/2555 · Europäische Kommission · BACS, Medienmitteilung vom 29.09.2025 · Verordnungen (EU) 2024/1689 und 2026/1744.',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Einen klaren Blick darauf, was gilt, was vertraglich verlangt wird und was warten kann.',
        'Nachweise, die Sie einem Kunden übergeben, ohne sie neu zusammenzustellen.',
        'Einen namentlich benannten Verantwortlichen für jede Pflicht.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Ein Grosskunde schickt uns einen vierzigseitigen Sicherheitsfragebogen.', decision: 'Welches Nachweisniveau liefern, nach welchem Referenzrahmen.', deliverable: 'Nachweisdossier und Plan zur Schliessung der Lücken, wiederverwendbar für die nächsten Kunden.', format: 'Einige Wochen', cycles: ['croissance'], image: `${S}laptop-hands.jpg` },
        { quote: 'Wir wissen nicht, ob wir im Anwendungsbereich sind.', decision: 'Was für uns gilt, was uns auferlegt wird, was warten kann.', deliverable: 'Expositionskarte mit drei Spuren.', format: 'Kurzmandat', cycles: ['lancement', 'croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Unsere Teams nutzen KI ohne Regeln.', decision: 'Welche Werkzeuge, mit welchen Daten, unter wessen Verantwortung.', deliverable: 'Nutzungsrichtlinie, Systeminventar, Einstufung gemäss AI Act.', format: 'Kurzmandat', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'Wir hatten einen Vorfall.', decision: 'Wen informieren (Behörde, Kunden, Versicherer), innerhalb welcher Fristen.', deliverable: 'Dokumentiertes Vorfalldossier und Verbesserungsplan, mit Incident-Response-Experten aus dem Netzwerk.', format: 'Auf Anfrage', cycles: ['restructuration'], image: `${S}network-cables.jpg` },
        { quote: 'Ein Investor oder ein Käufer wird uns prüfen.', decision: 'Was vorher zu bereinigen ist, was man offenlegt.', deliverable: 'Compliance-Dossier, bereit für den Datenraum.', format: 'Einige Wochen', cycles: ['acquisition', 'transmission'], image: `${S}planning-laptops.jpg` },
        { quote: 'Wir verkaufen aus der Schweiz in die EU (oder umgekehrt).', decision: 'Vertreter, DSB, Datenübermittlungen.', deliverable: 'Matrix der Rechtsordnungen (DSG / DSGVO) und zugehörige Pflichten.', format: 'Kurzmandat', cycles: ['croissance'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Unsere Leistungen',
      items: [
        'Ihre regulatorische Exposition kartieren',
        'Das gegenüber Ihren Kunden belastbare Nachweisdossier aufbauen',
        'Den Einsatz von KI regeln',
        'Das Vorfallmanagement dokumentieren',
        'Die Behebung steuern',
        'Die Geschäftsleitung zu ihren Verantwortlichkeiten schulen',
      ],
    },
    framework: {
      name: 'Die Expositionskarte mit drei Spuren',
      intro: 'Jeder Erlass wird einer der drei Spuren zugeordnet, mit Frist, internem Verantwortlichen und festgestellter Lücke.',
      axes: [
        { label: 'Verpflichtend', desc: 'Was das Gesetz Ihnen heute auferlegt, je nach Rolle: wesentliche oder wichtige Einrichtung, KI-Betreiber oder -Anbieter, Verantwortlicher für die Datenbearbeitung.' },
        { label: 'Vertraglich', desc: 'Was Ihre Kunden, Versicherer und Investoren verlangen, auch ohne Gesetz.' },
        { label: 'Zu beobachten', desc: 'Bekannte Frist, derzeit nicht anwendbar.' },
      ],
      deliverable: 'Eine einseitige Zusammenfassung, detaillierte Anhänge je Erlass.',
    },
    bySize: {
      title: 'Nach Grösse',
      items: [
        { label: 'KMU · 10 bis 50 Mio. €', desc: 'Selten ein CISO oder DSB in Vollzeit. Wir zielen auf einen Sockel belastbarer Kontrollen, nicht auf ein vollständiges Managementsystem, und ziehen ausgelagerte Funktionen aus dem Netzwerk bei.' },
        { label: 'Mid-Cap · 50 bis 300 Mio. €', desc: 'Eine Risikofunktion existiert, mehrere Referenzrahmen überlagern sich. Wir konsolidieren sie in einem einzigen Plan und bereiten das interne Audit vor.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital', desc: 'DORA, anwendbar seit 17. Januar 2025: kritische IKT-Drittanbieter, Resilienztests, Anbieterregister. In der Schweiz FINMA-Anforderungen an operationelle Risiken und Resilienz (Rundschreiben 2023/1).' },
        { cluster: 'Health & Life Sciences', desc: 'HDS in Frankreich, MDR/IVDR, EHDS. In ein Medizinprodukt eingebettete KI: Hochrisiko nach Anhang I, Frist 2. August 2028.' },
        { cluster: 'Industrie, Energie & Infrastruktur', desc: 'NIS2 (Energie, Wasser, Verkehr, Fertigung); in der Schweiz BACS-Meldung innerhalb von 24 h; IT/OT-Segmentierung.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis', desc: 'DSGVO und DSG (Kundenbindung, Profiling); Artikel 50 (Konversationsagenten, generierte Inhalte); Werkzeuge zur Bewerbervorauswahl: Hochrisiko, Anhang III, 2. Dezember 2027.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor', desc: 'Ihre NIS2- und DORA-Kunden verlangen Nachweise von Ihnen; Cyber Resilience Act (Meldepflichten ab September 2026, Produktanforderungen im Dezember 2027); Softwareanbieter in kritischen Infrastrukturen: prüfen, ob das ISG Sie betrifft.' },
      ],
    },
    scenario: {
      tag: 'Typisches Szenario · illustrativ',
      text: 'Schweizer Softwareanbieter mit 25 Mio. € Umsatz, Kunden im Energiesektor in Deutschland und Frankreich. Sein grösster Kunde verlangt vor der Verlängerung Nachweise zur Sicherheit der Lieferkette. Innerhalb von drei Wochen: Anwendungsbereich geklärt (verpflichtend für den Kunden, vertraglich für den Anbieter), acht Lücken priorisiert, Nachweise wiederverwendbar für die drei anderen Kunden.',
    },
    ai: {
      title: 'Was ein KI-Werkzeug nicht für Sie tun wird',
      text: 'Ein Assistent fasst NIS2 zusammen. Er trägt Ihr Dossier nicht vor Ihren Kunden, wählt nicht die Lücken aus, die Sie akzeptieren, und verantwortet nicht die Qualität des Nachweises. Aegryn verpflichtet einen namentlich benannten Experten, der für seinen Bereich einsteht.',
      legal: 'Unsere Begleitung ersetzt keine Rechtsberatung; wir arbeiten mit Partnerkanzleien.',
    },
    diagnostic: {
      title: 'Wo stehen Sie? Fünf Fragen.',
      intro: 'Antworten Sie mit Ja oder Nein. Das Ergebnis ordnet Sie einem von drei Niveaus zu und benennt den nächsten Schritt.',
      questions: [
        { q: 'Haben Sie die Liste der Erlasse, die für Sie gelten (EU und Schweiz), samt Fristen?' },
        { q: 'Wissen Sie, was Ihre drei grössten Kunden Ihnen vertraglich zu Sicherheit und Daten auferlegen?' },
        { q: 'Gibt es ein schriftliches Vorfallverfahren mit Meldefristen und Kontakten?' },
        { q: 'Haben Sie eine schriftliche Regel zu den Daten, die in KI-Werkzeuge eingegeben werden?' },
        { q: 'Verantwortet ein namentlich benanntes Mitglied der Geschäftsleitung die Compliance?' },
      ],
      levels: [
        { min: 0, label: 'Zu rahmen', desc: 'Der Anwendungsbereich ist nicht festgelegt. Die Exposition zeigt sich erst, wenn ein Kunde, ein Prüfer oder ein Vorfall sie offenlegt.', nextAction: 'Die Expositionskarte mit drei Spuren erstellen: verpflichtend, vertraglich, zu beobachten.' },
        { min: 3, label: 'Im Aufbau', desc: 'Erlasse und Kundenanforderungen sind identifiziert. Es fehlt der Nachweis: wiederverwendbares Dossier, Vorfallverfahren, benannter Verantwortlicher.', nextAction: 'Das belastbare Nachweisdossier aufbauen und je Pflicht einen Verantwortlichen benennen.' },
        { min: 5, label: 'Beherrscht', desc: 'Anwendungsbereich, Nachweise, Verantwortliche: der Sockel steht. Das Thema wird die Pflege und die kommenden Fristen (AI Act 2027, CRA).', nextAction: 'Eine jährliche Überprüfung des Anwendungsbereichs planen und die Geschäftsleitung zu ihren Verantwortlichkeiten schulen.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspektiven', items: [] },
    cta: { primary: 'Ihre Exposition bewerten', secondary: 'Die Expositionskarte anfordern', subject: 'advisory' },
  },

  technology: {
    key: 'technology', path: '/advisory/technology',
    image: '/images/advisory/technology.jpg',
    imageAlt: 'Serverschränke in einem Rechenzentrum',
    meta: {
      title: 'Technologieberatung: Architektur, Schulden, KI, Hosting | Aegryn',
      description: 'Architekturaudit, Abwägung Bauen-Kaufen-Kooperieren, KI-Governance, technische Leitung in Teilzeit. Für KMU und Mid-Caps mit 10 bis 300 Mio. €. Schweiz und Europa.',
      keywords: ['Architekturaudit', 'technische Schulden', 'CTO in Teilzeit', 'Interim-CTO', 'KI-Governance KMU', 'souveränes Hosting Schweiz', 'Reversibilität'],
    },
    eyebrow: 'Technologie & Souveränität',
    h1: 'Ihre Technologie ist ein Vermögenswert oder eine Abhängigkeit. Messen Sie, welches von beiden, bevor ein Kunde, ein Investor oder ein Ausfall es für Sie tut.',
    subtitle: 'Architektur, technische Schulden, KI, Hosting: Die Entscheidungen der ersten drei Jahre lasten auf den nächsten zehn. Aegryn greift in den Momenten ein, in denen sie fallen.',
    scope: [
      { label: 'Gesetzliche Pflichten: Risiken & Compliance', href: '/advisory/risk-compliance' },
      { label: 'Prüfung eines Zielunternehmens: M&A', href: '/advisory/ma' },
      { label: 'Massgeschneiderte Entwicklung: Build', href: '/services/build' },
    ],
    observation: {
      title: 'Was wir beobachten',
      cards: [
        { value: '22 % → 34 %', label: 'Schweizer KMU, die KI nutzen, 2024 bis 2025', source: 'SECO, kmu.admin.ch' },
        { value: '34 %', label: 'verfügen über Regeln zu den in KI-Werkzeuge eingegebenen Daten; 23 % bei Unternehmen mit weniger als 10 Beschäftigten', source: 'SECO, kmu.admin.ch' },
        { value: '2. Aug. 2026', label: 'Transparenzpflichten des AI Act (Artikel 50) anwendbar', source: 'Verordnung (EU) 2024/1689' },
      ],
      paragraphs: [
        'Die Einführung läuft der Governance voraus. In der Schweiz stieg die KI-Nutzung bei KMU zwischen 2024 und 2025 von 22 % auf 34 %; 60 % sehen darin eine Chance. Aber nur 34 % verfügen über klare Regeln zu den Daten, die in diese Werkzeuge eingegeben werden dürfen, und 23 % bei Unternehmen mit weniger als zehn Beschäftigten. Auf europäischer Seite gelten die Transparenzpflichten des AI Act seit dem 2. August 2026.',
      ],
      change: 'Das Risiko kommt nicht vom Werkzeug, sondern vom Fehlen einer Regel um das Werkzeug herum.',
      sources: 'Quellen: SECO, «AI gains ground among Swiss SMEs» · Verordnung (EU) 2024/1689.',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Benannte Abhängigkeiten, mit einem Plan für jede nicht reversible Komponente.',
        'Technische Schulden, die beziffert statt gefühlt sind.',
        'KI-Nutzungsregeln, die Ihre Teams anwenden.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Unsere Plattform bremst unsere Auslieferungen.', decision: 'Refaktorieren, neu bauen oder ersetzen.', deliverable: 'Architekturaudit, technische Schulden je Domäne beziffert, Zwölfmonatspfad.', format: 'Einige Wochen', cycles: ['croissance'], image: `${S}server-room-walk.jpg` },
        { quote: 'Nur eine Person versteht das System.', decision: 'Dokumentieren, doppelt besetzen oder internalisieren.', deliverable: 'Abhängigkeitsregister (Personen, Dienstleister, Lizenzen) und Reduktionsplan.', format: 'Kurzmandat', cycles: ['croissance', 'transmission'], image: `${S}developer-desk.jpg` },
        { quote: 'Bauen, kaufen oder kooperieren?', decision: 'Die richtige Abwägung, inklusive Ausstiegskosten.', deliverable: 'Analyse mit gewichteten Kriterien, Reversibilität eingeschlossen.', format: 'Kurzmandat', cycles: ['lancement', 'croissance'], image: `${S}loft-office.jpg` },
        { quote: 'Unsere Teams nutzen KI ohne Rahmen.', decision: 'Zugelassene Werkzeuge, zulässige Daten, Hosting.', deliverable: 'Nutzungsrichtlinie, Inventar, Werkzeugabwägung.', format: 'Kurzmandat', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'Wir haben keinen CTO mehr.', decision: 'Interim, Rekrutierung oder Leitung in Teilzeit.', deliverable: 'Technische Interimsleitung mit dokumentierter Übergabe.', format: 'Teilzeitmandat', cycles: ['restructuration'], image: `${S}open-office.jpg` },
        { quote: 'Wo sind unsere Daten, und wer kann darauf zugreifen?', decision: 'Hosting in der EU oder der Schweiz, Reversibilitätsklauseln, Exposition gegenüber extraterritorialen Gesetzen.', deliverable: 'Hosting-Prüfung und Reversibilitätsplan.', format: 'Kurzmandat', cycles: ['lancement', 'croissance'], image: `${S}network-cables.jpg` },
      ],
    },
    services: {
      title: 'Unsere Leistungen',
      items: [
        'Architektur und Schulden auditieren',
        'Zwischen Bauen, Kaufen und Kooperieren entscheiden',
        'Das Register kritischer Abhängigkeiten aufbauen',
        'Den Einsatz von KI regeln',
        'Die technische Interimsleitung sicherstellen',
        'Den Technologie-Vermögenswert auf den Blick Dritter vorbereiten (Investor, Käufer)',
      ],
    },
    framework: {
      name: 'Der 90-Tage-Reversibilitätstest',
      intro: 'Für jede kritische Komponente (Hoster, Anbieter, Dienstleister, KI-Modell, Schlüsselentwickler) eine Frage: Wenn sie morgen verschwindet, in wie vielen Tagen, zu welchen Kosten und mit welchem Datenverlust läuft der Dienst wieder?',
      axes: [
        { label: 'Reversibel in einer Woche', desc: 'Alternative identifiziert, Daten exportierbar, Umstellung dokumentiert.' },
        { label: 'Reversibel in einem Monat', desc: 'Alternative bekannt, Migration zu planen, begrenzte funktionale Abhängigkeit.' },
        { label: 'Reversibel in 90 Tagen', desc: 'Ersatz möglich, aber teuer: Teilneubau, Nachverhandlung, Rekrutierung.' },
        { label: 'Nicht reversibel', desc: 'Derzeit keine glaubwürdige Alternative. Die Komponente bedingt die Kontinuität des Dienstes.' },
      ],
      deliverable: 'Karte der zehn kritischsten Komponenten und Behandlungsplan für die nicht reversiblen.',
    },
    bySize: {
      title: 'Nach Grösse',
      items: [
        { label: 'KMU · 10 bis 50 Mio. €', desc: 'Ein über die Zeit angehäufter Stack, einige Entwickler, Dienstleister. Priorität: minimale Dokumentation und Reversibilität der drei kritischen Komponenten.' },
        { label: 'Mid-Cap · 50 bis 300 Mio. €', desc: 'Gewachsenes Informationssystem, mehrere Anbieter, eine IT-Abteilung. Priorität: ein vom Gremium abgewogener Modernisierungspfad und eine Datengovernance über die Geschäftsbereiche hinweg.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital', desc: 'Kritische IKT-Drittanbieter und Cloud-Auslagerung (DORA); Resilienzarchitektur.' },
        { cluster: 'Health & Life Sciences', desc: 'HDS-Hosting in Frankreich; Trennung von Gesundheitsdaten; KI in einem Medizinprodukt (Anhang I, 2. August 2028).' },
        { cluster: 'Industrie, Energie & Infrastruktur', desc: 'IT/OT, Fernwartung, Eigentum an Industriedaten.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis', desc: 'Kundendaten über Kanäle hinweg vereinheitlichen, ohne von einem einzigen CRM abzuhängen; KI-Personalisierung und DSGVO.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor', desc: 'Audit vor Investition oder Verkauf; Copyleft-Lizenzen im Kern des Produkts; durch öffentliche Ausschreibungen vorgegebenes Hosting.' },
      ],
    },
    scenario: {
      tag: 'Typisches Szenario · illustrativ',
      text: 'Softwareanbieter für Kliniken, 18 Mio. € Umsatz, 14 Entwickler, davon 6 Externe. Ein Fonds interessiert sich für das Unternehmen. Innerhalb von vier Wochen: Abhängigkeiten und Schulden kartiert, drei nicht reversible Komponenten identifiziert, Sechsmonats-Behebungsplan beziffert. Die Geschäftsleitung legt ihn dem Fonds vor, bevor dieser ihn allein entdeckt.',
    },
    ai: {
      title: 'Was ein KI-Werkzeug nicht für Sie tun wird',
      text: 'Ein Code-Assistent produziert Code. Er verantwortet nicht die Architekturentscheidung, weiss nicht, was Ihr Hosting-Vertrag erlaubt, und wird vor Ihrem Verwaltungsrat nicht die Rolle des CTO einnehmen.',
    },
    diagnostic: {
      title: 'Wo stehen Sie? Fünf Fragen.',
      intro: 'Antworten Sie mit Ja oder Nein. Das Ergebnis ordnet Sie einem von drei Niveaus zu und benennt den nächsten Schritt.',
      questions: [
        { q: 'Ist Ihre Architektur aktuell dokumentiert (Schema, Datenflüsse)?' },
        { q: 'Können Sie Ihre zehn kritischen Komponenten und die Ersatzfrist für jede benennen?' },
        { q: 'Versteht mehr als eine Person jede kritische Komponente?' },
        { q: 'Sind die Rechteabtretungen und Lizenzen für allen von Dienstleistern gelieferten Code archiviert?' },
        { q: 'Wissen Sie, wo Ihre Daten gehostet werden und wer darauf zugreifen kann?' },
      ],
      levels: [
        { min: 0, label: 'Zu rahmen', desc: 'Das System funktioniert, aber sein Wissen ruht auf wenigen Personen und seine Dokumentation ist nicht aktuell.', nextAction: 'Das Abhängigkeitsregister erstellen und die drei kritischsten Komponenten dem Reversibilitätstest unterziehen.' },
        { min: 3, label: 'Im Aufbau', desc: 'Architektur und Daten sind bekannt. Es bleiben blinde Flecken: Rechtekette, Stellvertretung der Schlüsselpersonen, Ersatzfristen.', nextAction: 'Das Register vervollständigen (Rechte, Lizenzen, Stellvertretungen) und die Schulden je Domäne beziffern.' },
        { min: 5, label: 'Beherrscht', desc: 'Der Technologie-Vermögenswert ist dokumentiert, reversibel und für Dritte lesbar. Das Thema wird der Pfad: Modernisierung, KI, Datengovernance.', nextAction: 'Den Zwölfmonatspfad im Gremium abwägen und den Vermögenswert auf den Blick eines Investors oder Käufers vorbereiten.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspektiven',
      items: [
        { title: 'Was einen Tech-Vermögenswert wirklich zertifizierbar macht', href: '/blog/actif-tech-certifiable', kind: 'article' },
      ],
    },
    cta: { primary: 'Ihre Architektur auditieren', secondary: 'Ihre zehn kritischen Komponenten dem Test unterziehen', subject: 'tech' },
  },

  talentOrganization: {
    key: 'talentOrganization', path: '/advisory/talent-organization',
    image: '/images/advisory/talent.jpg',
    imageAlt: 'Leerer Sitzungssaal, bereit für die nächste Sitzung',
    meta: {
      title: 'Nachfolge, Governance, Führungsteam | Aegryn',
      description: 'Die Abhängigkeit von der Geschäftsleitung messen, die Geschäftsleitung strukturieren, einen Nachfolgeplan aufbauen, Schlüsselpersonen halten. KMU und Mid-Caps mit 10 bis 300 Mio. €. Schweiz und Europa.',
      keywords: ['Nachfolgeplan KMU', 'Abhängigkeit vom Gründer', 'Governance Geschäftsleitung', 'Bindung von Schlüsselpersonen', 'Übergabe Familienunternehmen', 'Organisation Mid-Cap'],
    },
    eyebrow: 'Talent & Organisation',
    h1: 'Der Wert einer Organisation bemisst sich daran, was sie ohne ihre Führung leisten kann.',
    subtitle: 'Nachfolge, Governance, Bindung, Strukturierung der Führung: Organisationsentscheidungen wiegen auf Dauer am schwersten und werden am häufigsten aufgeschoben.',
    scope: [
      { label: 'Suche und Vermittlung: Rekrutieren', href: '/talent' },
      { label: 'Kurswahl: Strategie', href: '/advisory/strategy' },
      { label: 'Team eines Zielunternehmens: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Was wir beobachten',
      cards: [
        { value: '40 %', label: 'der französischen Kleinst-, KMU- und Mid-Cap-Führungskräfte wollen innerhalb von fünf Jahren übergeben, das sind 370 000 Unternehmen', source: 'Bpifrance Le Lab, 27. Nov. 2025' },
        { value: '130 000', label: 'tatsächliche Übergaben, die beim aktuellen Tempo erwartet werden', source: 'Bpifrance Le Lab, 27. Nov. 2025' },
        { value: '47 %', label: 'der 60- bis 69-jährigen Führungskräfte von Familienunternehmen haben keinen formalisierten Nachfolgeplan', source: 'Bpifrance Le Lab, Familienunternehmen' },
      ],
      paragraphs: [
        'In Frankreich wollen 40 % der Führungskräfte von Kleinst-, kleinen und mittleren Unternehmen sowie Mid-Caps ihr Unternehmen innerhalb von fünf Jahren übergeben, ein Potenzial von 370 000 Unternehmen. Beim aktuellen Tempo würden tatsächlich 130 000 den Besitzer wechseln. Unter den 60- bis 69-jährigen Führungskräften von Familien-KMU und -Mid-Caps haben 47 % keinen formalisierten Nachfolgeplan.',
      ],
      change: 'Die Lücke zwischen Absicht und Tat liegt weniger am Markt als an der Vorbereitung. Eine Organisation, die von einer Person abhängt, lässt sich schlecht übergeben, schlecht finanzieren und schlecht steuern.',
      sources: 'Quellen: Bpifrance Le Lab, Studie Unternehmensübergabe und -übernahme (27. November 2025) · Bpifrance Le Lab, Familienunternehmen.',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Eine Organisation, die drei Monate ohne ihre Führung durchhält.',
        'Kritische Positionen mit Stellvertretung.',
        'Einen Nachfolgeplan, der geschrieben, datiert und geteilt ist.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Alles läuft über mich.', decision: 'Was zuerst delegieren, an wen.', deliverable: 'Abhängigkeitsindex und Delegationsplan über zwölf Monate.', format: 'Einige Wochen', cycles: ['croissance', 'transmission'], image: `${S}meeting-room.jpg` },
        { quote: 'Mein Führungsteam ist noch kein Team.', decision: 'Rollen, Entscheidungsrhythmen, Delegationen.', deliverable: 'Governance-Charta der Geschäftsleitung.', format: 'Einige Wochen', cycles: ['croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Eine Schlüsselperson will gehen.', decision: 'Halten, ersetzen oder doppelt besetzen.', deliverable: 'Bindungsplan, identifizierte Stellvertretung, dokumentierter Wissenstransfer.', format: 'Kurzmandat', cycles: ['restructuration'], image: `${S}laptop-hands.jpg` },
        { quote: 'Ich muss eine Führungskraft rekrutieren (Technik, Finanzen, Betrieb, Land).', decision: 'Das richtige Profil, in der richtigen Governance.', deliverable: 'Stellendefinition und Integrationskriterien, danach Übergabe an Rekrutieren.', format: 'Kurzmandat', cycles: ['croissance'], image: `${S}handshake.jpg` },
        { quote: 'Ich denke daran, in zwei bis fünf Jahren zu übergeben.', decision: 'Familie, intern oder externer Übernehmer.', deliverable: 'Nachfolgeplan und Übergangs-Governance.', format: 'Ein bis zwei Monate', cycles: ['transmission'], image: `${S}plan-writing.jpg` },
        { quote: 'Eine Akquisition steht an, zwei Kulturen werden aufeinandertreffen.', decision: 'Wer bleibt, wer führt, wie organisieren.', deliverable: 'Bewertung des Zielteams, Zielorganisation, Bindungsplan.', format: 'Einige Wochen', cycles: ['acquisition'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Unsere Leistungen',
      items: [
        'Die Abhängigkeit von der Führung und von Schlüsselpersonen messen',
        'Die Geschäftsleitung und ihre Delegationen strukturieren',
        'Den Nachfolgeplan aufbauen',
        'Die Bindung kritischer Personen sichern',
        'Kritisches Know-how dokumentieren',
        'Die Rekrutierung einer Führungskraft vorbereiten',
      ],
    },
    framework: {
      name: 'Der Abhängigkeitsindex',
      intro: 'Für jede kritische Person vier Achsen, ein Wert, eine Ersatzzeit in Wochen und eine Alarmschwelle.',
      axes: [
        { label: 'Entscheidungen', desc: 'Wer entscheidet.' },
        { label: 'Beziehungen', desc: 'Wer die Schlüsselkunden und -partner hält.' },
        { label: 'Wissen', desc: 'Wer als Einziger weiss.' },
        { label: 'Verträge', desc: 'Welche Klauseln an einen Namen gebunden sind.' },
      ],
      deliverable: 'Eine Karte der Personen, deren Weggang die Organisation in Schwierigkeiten brächte, und was jeder Weggang an Kontinuität kosten würde.',
    },
    bySize: {
      title: 'Nach Grösse',
      items: [
        { label: 'KMU · 10 bis 50 Mio. €', desc: 'Die Geschäftsleitung ist oft erster Verkäufer und erster Produktentscheider. Priorität: Schlüsselkundenbeziehungen delegieren und die zehn kritischen Prozesse dokumentieren.' },
        { label: 'Mid-Cap · 50 bis 300 Mio. €', desc: 'Familien-Governance oder Aktionäre. Priorität: Nachfolgeplan für den CEO und die direkt Unterstellten, Nominationsausschuss, Rolle der Familie.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital', desc: 'Funktionen mit Bewilligungs- oder Meldepflicht gegenüber der Aufsicht, deren Wechsel Formalitäten auslöst.' },
        { cluster: 'Health & Life Sciences', desc: 'Verantwortliche Person für die Einhaltung der Regulierungsvorschriften (PRRC, MDR) und Qualitätsverantwortliche: regulierte Funktionen mit vorbereiteter Nachfolge.' },
        { cluster: 'Industrie, Energie & Infrastruktur', desc: 'Implizites Know-how der Erfahrenen, gehäufte Pensionierungen, Familienunternehmen.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis', desc: 'Netzverantwortliche, Schlüsselkunden, Bindung der Führungskräfte vor Ort.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor', desc: 'Einziger CTO, Entwickler als Träger der Architektur.' },
      ],
    },
    scenario: {
      tag: 'Typisches Szenario · illustrativ',
      text: 'Familien-Mid-Cap mit 140 Mio. €, Geschäftsführer 63 Jahre alt, zwei Kinder, von denen keines führen möchte. Innerhalb von vier Wochen: Abhängigkeitsindex (sieben kritische Personen), drei Nachfolgeszenarien verglichen, Übergangskalender über vierundzwanzig Monate, über den der Familienrat entscheiden kann.',
    },
    ai: {
      title: 'Was ein KI-Werkzeug nicht für Sie tun wird',
      text: 'Ein Assistent verfasst eine Stellenbeschreibung. Er führt nicht das schwierige Gespräch mit dem Gründer, entscheidet nicht zwischen zwei direkt Unterstellten und weiss nicht, was die Familie nicht sagt.',
    },
    diagnostic: {
      title: 'Wo stehen Sie? Fünf Fragen.',
      intro: 'Antworten Sie mit Ja oder Nein. Das Ergebnis ordnet Sie einem von drei Niveaus zu und benennt den nächsten Schritt.',
      questions: [
        { q: 'Würde Ihre Organisation drei Monate ohne Sie normal funktionieren?' },
        { q: 'Haben Ihre fünf Schlüsselkunden oder -partner mindestens zwei Ansprechpersonen bei Ihnen?' },
        { q: 'Hat jede kritische Funktion eine identifizierte Stellvertretung?' },
        { q: 'Gibt es einen schriftlichen Nachfolgeplan für die Führung und die direkt Unterstellten?' },
        { q: 'Ist kritisches Know-how anderswo dokumentiert als in den Köpfen derer, die es besitzen?' },
      ],
      levels: [
        { min: 0, label: 'Zu rahmen', desc: 'Die Organisation ruht auf ihrer Führung und wenigen Personen. Ein Weggang oder eine längere Abwesenheit brächte sie in Schwierigkeiten.', nextAction: 'Den Abhängigkeitsindex messen und zuerst die Schlüsselkundenbeziehungen delegieren.' },
        { min: 3, label: 'Im Aufbau', desc: 'Delegationen existieren und Kunden haben mehrere Ansprechpersonen. Es fehlt die Formalisierung: Stellvertretungen, schriftlicher Nachfolgeplan, dokumentiertes Wissen.', nextAction: 'Den Nachfolgeplan für die Führung und die direkt Unterstellten schreiben und die zehn kritischen Prozesse dokumentieren.' },
        { min: 5, label: 'Beherrscht', desc: 'Die Organisation hält ohne ihre Führung. Das Thema wird der Übergang: Kalender, Governance, Rolle der Familie oder der Aktionäre.', nextAction: 'Die Übergangs-Governance rahmen und den Nominationsausschuss vorbereiten.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspektiven', items: [] },
    cta: { primary: 'Ihre Abhängigkeit messen', secondary: 'Ihre Nachfolge rahmen', subject: 'advisory' },
  },

  ma: {
    key: 'ma', path: '/advisory/ma',
    image: '/images/advisory/ma.jpg',
    imageAlt: 'Führungskraft auf dem Weg zu einem Verhandlungstermin',
    meta: {
      title: 'Akquisition, Verkauf, Integration: Beratung im Vorfeld von Transaktionen | Aegryn',
      description: 'Prüfung der blinden Flecken eines Zielunternehmens (Code und Rechte, Change-of-Control-Klauseln, Compliance, Teams), Vorbereitung des Verkäufers, 100-Tage-Integration. Die finanzielle Durchführung obliegt zugelassenen Partnern.',
      keywords: ['Akquisitionsberatung KMU', 'Zielprüfung', 'Change-of-Control-Klausel', 'Post-Merger-Integration', '100-Tage-Plan', 'Build-up', 'Verkäufervorbereitung'],
    },
    eyebrow: 'M&A, Transaktionen & PMI',
    h1: 'Eine Akquisition wird in der Vorbereitung gewonnen. Sie geht in der Integration verloren.',
    subtitle: 'Aegryn schaut auf das, was Finanz- und Rechtsprüfungen wenig betrachten: den Code, die Rechte, die Change-of-Control-Klauseln, die Teams. Die finanzielle Durchführung wird zugelassenen Partnern anvertraut.',
    scope: [
      { label: 'Prüftiefe: Risiken & Compliance', href: '/advisory/risk-compliance' },
      { label: 'Prüftiefe: Technologie', href: '/advisory/technology' },
      { label: 'Teams: Talent & Organisation', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Was wir beobachten',
      cards: [
        { value: '48 bis 66 %', label: 'Misserfolgsquote von M&A-Transaktionen gemäss zusammengetragenen Studien, überwiegend in der Integration', source: 'Wiley Encyclopedia of Management; Kotter et al.' },
        { value: '208', label: 'M&A-Transaktionen von Schweizer KMU im Jahr 2025, +16 %; +28 % in IT-Dienstleistungen und Software', source: 'SECO, kmu.admin.ch' },
        { value: '23 %', label: 'der potenziellen französischen Verkäufer nennen einen Mangel an Übernahmeangeboten', source: 'Bpifrance Le Lab, 2025' },
      ],
      paragraphs: [
        'Zusammengetragene Studien verorten den Misserfolg von M&A-Transaktionen je nach Definition zwischen 48 und 66 %, und die Beobachtungen von Kotter und seinen Mitautoren verorten den Grossteil der Misserfolge in der Integration. In der Schweiz haben die M&A-Transaktionen von KMU 2025 um 16 % zugelegt (208 Transaktionen), mit +28 % in IT-Dienstleistungen und Software. In Frankreich nennen 23 % der potenziellen Verkäufer einen Mangel an Übernahmeangeboten.',
      ],
      change: 'Der Markt hat Verkäufer und Käufer; was fehlt, ist die Vorbereitung, die die Transaktion zum Abschluss bringt und ihre Versprechen hält.',
      sources: 'Quellen: Wiley Encyclopedia of Management; Kotter, Akhtar, Gupta, Change · SECO · Bpifrance Le Lab (2025).',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Ein Zielunternehmen, betrachtet aus vier Blickwinkeln, die die klassische Due Diligence wenig abdeckt.',
        'Bezifferte Verhandlungspunkte statt Intuitionen.',
        'Einen Integrationsplan, der vor der Unterzeichnung bereit ist.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Wir haben ein Zielunternehmen identifiziert.', decision: 'Was vor der Absichtserklärung zu prüfen ist.', deliverable: 'Prüfung der vier blinden Flecken, mit vorgeschlagener Behandlung für jeden: Preis, Garantie, aufschiebende Bedingung.', format: 'Einige Wochen', cycles: ['acquisition'], image: `${S}planning-laptops.jpg` },
        { quote: 'Man ist an uns herangetreten, um uns zu kaufen.', decision: 'Wie weit vorbereiten, bevor man antwortet.', deliverable: 'Diagnose der Verkäuferbereitschaft und Verhandlungsposition.', format: 'Einige Wochen', cycles: ['transmission'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'Wir wollen in drei Jahren zwei oder drei Akquisitionen tätigen.', decision: 'These, Kriterien, Prozess.', deliverable: 'Wiederholbares Build-up-Programm: Kriterien, Standardprüfung, Integrations-Playbook.', format: 'Ein bis zwei Monate', cycles: ['acquisition'], image: `${S}loft-office.jpg` },
        { quote: 'Die Akquisition ist unterzeichnet, die Integration stockt.', decision: 'Was dringend ist, was warten kann.', deliverable: '30-/60-/100-Tage-Plan und Steuerung.', format: 'Mandat über drei bis sechs Monate', cycles: ['acquisition'], image: `${S}open-office.jpg` },
        { quote: 'Wir müssen einen nicht strategischen Geschäftsbereich abgeben.', decision: 'Perimeter und Trennung der Systeme.', deliverable: 'Trennungsplan: Perimeter, Systeme, Personen, Übergangsvereinbarungen.', format: 'Ein bis zwei Monate', cycles: ['restructuration'], image: `${S}industrial-engineer.jpg` },
        { quote: 'Mein Fonds muss ein Technologie-Zielunternehmen validieren.', decision: 'Investieren, verhandeln oder verzichten.', deliverable: 'Unabhängige technische und organisatorische Prüfung, bewertet je blindem Fleck.', format: 'Einige Wochen', cycles: ['acquisition'], image: `${S}server-room-walk.jpg` },
      ],
    },
    services: {
      title: 'Unsere Leistungen',
      items: [
        'Die Akquisitionsthese und die Zielkriterien formulieren',
        'Das Zielunternehmen auf die vier blinden Flecken prüfen',
        'Die aus der Prüfung resultierenden Verhandlungspunkte rahmen',
        'Die Organisation darauf vorbereiten, geprüft zu werden (Verkäuferseite)',
        'Die 100-Tage-Integration steuern',
        'Ein Build-up-Programm strukturieren',
      ],
    },
    framework: {
      name: 'Die Prüfung der vier blinden Flecken',
      intro: 'Jeder Befund wird nach Auswirkung und Wahrscheinlichkeit eingestuft und dann behandelt: Preisanpassung, spezifische Garantie, aufschiebende Bedingung oder bewusst akzeptierter Punkt.',
      axes: [
        { label: 'Code und Rechtekette', desc: 'Lizenzen, Urheberrechtsabtretungen, Abhängigkeiten.' },
        { label: 'Verträge und Change of Control', desc: 'Kunden, Lieferanten, abgetretene Lizenzen.' },
        { label: 'Compliance und Sicherheit', desc: 'Geerbter regulatorischer Perimeter, Vorfälle, verfügbare Nachweise.' },
        { label: 'Personen und Abhängigkeiten', desc: 'Schlüsselmanager, Bindung, Kultur.' },
      ],
      deliverable: 'Eine Auswirkungs-/Wahrscheinlichkeitsmatrix je Blickwinkel und für jeden Befund die vorgeschlagene Behandlung in der Verhandlung.',
    },
    bySize: {
      title: 'Nach Grösse',
      items: [
        { label: 'KMU · 10 bis 50 Mio. €', desc: 'Übernahme, MBO oder Kauf durch einen Akteur ähnlicher Grösse, mit wenigen Beratern am Tisch. Wir konzentrieren die Prüfung innerhalb weniger Wochen auf die vier blinden Flecken, an der Seite des Anwalts und des Treuhänders.' },
        { label: 'Mid-Cap · 50 bis 300 Mio. €', desc: 'Programm für externes Wachstum, internes M&A-Team oder Investmentbank. Aegryn tritt als Partner für technische, organisatorische und Integrationsprüfung auf.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital', desc: 'Akquisition eines Fintech- oder Insurtech-Akteurs; Bewilligungen und Genehmigungen bei Kontrollwechsel; Datenportabilität; DORA bei Drittparteien.' },
        { cluster: 'Health & Life Sciences', desc: 'Kontinuität der CE-Kennzeichnung (MDR) und des HDS-Hostings; Spitalverträge mit Change-of-Control-Klausel.' },
        { cluster: 'Industrie, Energie & Infrastruktur', desc: 'Digitale Kompetenzen erwerben; geistiges Eigentum im industriellen Umfeld; Gründer-Entwickler.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis', desc: 'Digitale Akteure zur Ergänzung eines physischen Netzes; Kundendaten; Integration der Teams.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor', desc: 'Build-up vertikaler Software; Qualität der wiederkehrenden Umsätze; Change-of-Control-Klauseln; Copyleft.' },
      ],
    },
    scenario: {
      tag: 'Typisches Szenario · illustrativ',
      text: 'Dienstleistungsgruppe mit 90 Mio. €, die einen Softwareanbieter mit 8 Mio. € Umsatz übernehmen will. Innerhalb von drei Wochen: Zwei wichtige Kundenverträge enthalten eine Change-of-Control-Klausel, eine Bibliothek unter Copyleft-Lizenz liegt im Kern des Produkts, der CTO ist alleiniger Träger der Architektur. Drei Punkte gehen in die Verhandlung: spezifische Garantie, aufschiebende Bedingung, Bindungsplan.',
    },
    ai: {
      title: 'Was ein KI-Werkzeug nicht für Sie tun wird',
      text: 'Ein Assistent liest einen Kaufvertrag. Er sagt Ihnen nicht, was die Change-of-Control-Klausel im Vertrag Ihres ersten Kunden wert ist, sitzt nicht dem CTO des Zielunternehmens gegenüber und übernimmt keine Haftung.',
    },
    complement: {
      title: 'Weiterführend',
      text: 'Wenn das Dossier es rechtfertigt, kann sich die Prüfung auf die unabhängige CIFSO 5000-Zertifizierung stützen, die in fünf Dimensionen erteilt wird.',
    },
    diagnostic: {
      title: 'Wo stehen Sie? Fünf Fragen.',
      intro: 'Antworten Sie mit Ja oder Nein. Das Ergebnis ordnet Sie einem von drei Niveaus zu und benennt den nächsten Schritt.',
      questions: [
        { q: 'Verfügen Sie über eine schriftliche These für externes Wachstum (Zielkriterien, Budget, Kalender)?' },
        { q: 'Wissen Sie, welche Change-of-Control-Klauseln in Ihren Schlüsselkundenverträgen stehen?' },
        { q: 'Ist die Rechtekette an Ihrem Code und Ihren Marken dokumentiert?' },
        { q: 'Existiert vor jeder Unterzeichnung ein 100-Tage-Integrationsplan?' },
        { q: 'Könnten Sie innerhalb von zwei Wochen einen Datenraum öffnen, wenn morgen ein Käufer an Sie heranträte?' },
      ],
      levels: [
        { min: 0, label: 'Zu rahmen', desc: 'Die Transaktion würde nach und nach abgewickelt. Die blinden Flecken (Rechte, Klauseln, Teams) würden von der Gegenseite entdeckt.', nextAction: 'Die These oder die Bereitschaftsdiagnose schreiben und die Change-of-Control-Klauseln Ihrer drei wichtigsten Verträge erneut lesen.' },
        { min: 3, label: 'Im Aufbau', desc: 'Die Grundlagen bestehen: These oder Vorbereitung, bekannte Verträge. Es fehlt die Mechanik: Rechtekette, 100-Tage-Plan, bereiter Datenraum.', nextAction: 'Die Rechtekette dokumentieren und den Integrationsplan vor der nächsten Absichtserklärung verfassen.' },
        { min: 5, label: 'Beherrscht', desc: 'Sie sind bereit zu kaufen oder geprüft zu werden. Das Thema wird die Wiederholbarkeit: Build-up-Programm, Integrations-Playbook.', nextAction: 'Das Build-up-Programm strukturieren und die 100-Tage-Integration bei der nächsten Transaktion messen.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspektiven',
      items: [
        { title: 'Wie PE-Käufer 2026 ein SaaS bewerten', href: '/blog/comment-acquereurs-pe-evaluent-saas-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 02 · The Exit Equation (April 2027)', href: '/magazine', kind: 'magazine' },
      ],
    },
    cta: { primary: 'Ein Zielunternehmen prüfen lassen', secondary: 'Eine Integration vorbereiten', subject: 'advisory' },
  },
}
