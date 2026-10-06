/**
 * FRANCHIR content — Deutsch.
 * Uebersetzung der franzoesischen Referenz (content/franchir/fr.ts),
 * Spezifikation vom 6. Oktober 2026. Szenarien sind illustrativ und
 * als solche gekennzeichnet.
 */

import type { CycleContent, FranchirIntro } from './types'

export const FRANCHIR_INTRO_DE: FranchirIntro = {
  meta: {
    title:       'Meistern — jeder Zyklus hat seine Entscheidung | Aegryn',
    description: 'Gründung, Wachstum, Pivot, Akquisition, Übergabe: fünf Zyklen, in denen eine Organisation von 10 bis 300 Mio. € ihre Zukunft entscheidet. Was auf dem Spiel steht, und wen Sie einsetzen.',
  },
  eyebrow:   'Meistern',
  heroTitle: 'Jeder Zyklus hat seine Entscheidung. Finden Sie Ihre.',
  heroSub:   'Gründung, Wachstum, Pivot, Akquisition, Übergabe: fünf Zyklen, in denen eine Organisation von 10 bis 300 Mio. € ihre Zukunft entscheidet. Was auf dem Spiel steht, und wen Sie einsetzen.',
  cycles: [
    { slug: 'lancement',       title: 'Gründung & Strukturierung',        stake: 'Entscheidungen, die jetzt wenig kosten, sind später sehr teuer zu korrigieren.' },
    { slug: 'croissance',      title: 'Wachstum & Skalierung',            stake: 'Was mit zehn Personen funktionierte, wird mit fünfzig langsam.' },
    { slug: 'restructuration', title: 'Restrukturierung & Pivot',         stake: 'Modell, Markt oder Vorschriften haben sich geändert: schnell entscheiden.' },
    { slug: 'acquisition',     title: 'Akquisition & externes Wachstum',  stake: 'Wissen, was man übernimmt, und wie man es integriert.' },
    { slug: 'transmission',    title: 'Übergabe & Verkauf',               stake: 'Die Organisation ohne ihren Inhaber tragfähig machen.' },
  ],
  overlap: {
    title: 'Durchlaufen Sie zwei Zyklen gleichzeitig?',
    text:  'Wachsen durch Akquisition, restrukturieren vor der Übergabe: Zyklen überlappen sich. Aegryn baut einen einzigen Einsatzrahmen mit den betroffenen Disziplinen.',
    examples: [
      { label: 'Wachstum + Akquisition',           a: 'croissance',      b: 'acquisition' },
      { label: 'Restrukturierung + Übergabe',      a: 'restructuration', b: 'transmission' },
    ],
  },
  diagnostic: {
    title: 'Wo stehen Sie?',
    questions: [
      { q: 'Ist Ihre Organisation jünger als 3 Jahre oder bereitet sie ein neues Produkt oder eine neue Einheit vor?', cycle: 'lancement' },
      { q: 'Hat sich Ihr Geschäftsvolumen oder Ihre Belegschaft kürzlich mehr als verdoppelt?', cycle: 'croissance' },
      { q: 'Stellt ein Grosskunde, ein Markt, ein Vorfall oder eine Vorschrift Ihr Modell infrage?', cycle: 'restructuration' },
      { q: 'Prüfen Sie die Übernahme einer Organisation oder haben Sie in den letzten 18 Monaten eine übernommen?', cycle: 'acquisition' },
      { q: 'Denken Sie daran, innerhalb von fünf Jahren zu übergeben?', cycle: 'transmission' },
    ],
  },
  assetsLink: { text: 'Um den Wert Ihrer Aktiven zu messen und zu bezeugen:', label: 'die Aktiven von Aegryn ansehen' },
  cta:        { label: '30 Minuten austauschen' },
}

export const FRANCHIR_DE: CycleContent[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'lancement',
    path: '/franchir/lancement',
    meta: {
      title:       'Gründung & Strukturierung — die richtigen Grundlagen legen, bevor Sie ausgeben | Aegryn',
      description: 'Dienstleister, Technologie, geistiges Eigentum, Compliance, Governance: Die Entscheidungen der ersten Monate kosten wenig und sind später sehr teuer zu korrigieren.',
    },
    eyebrow:  'Meistern · Gründung & Strukturierung',
    h1:       'Die richtigen Grundlagen legen, bevor Sie ausgeben.',
    subtitle: 'Dienstleister, Technologie, geistiges Eigentum, Compliance, Governance: Die Entscheidungen der ersten Monate kosten wenig und sind später sehr teuer zu korrigieren.',
    verbs:    ['Rahmen', 'Bauen', 'Rekrutieren'],
    constat: {
      text:   'Die Transparenzpflichten der europäischen KI-Verordnung (Art. 50) gelten seit dem 2. August 2026, mit Bussgeldern von bis zu 15 Mio. € oder 3 % des weltweiten Umsatzes für Pflichten ausserhalb verbotener Praktiken. Wer ein KI-gestütztes Produkt lanciert, ist vom ersten Tag an betroffen.',
      source: 'Verordnung (EU) über künstliche Intelligenz.',
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Mein Dienstleister hat den Code geliefert, aber ich habe den Vertrag nicht geprüft.', decision: 'Wem gehören Code und Daten? Was passiert, wenn der Dienstleister geht?', metiers: ['technologie'], deliverable: 'Positionspapier zu Eigentum und Reversibilität, mit den zu korrigierenden Klauseln' },
        { quote: 'Wir wollen schnell sein, Compliance kommt später.', decision: 'Welche Pflichten gelten bereits, welche können warten?', metiers: ['conformite'], deliverable: 'Expositionskarte: gilt jetzt / bald / nicht betroffen' },
        { quote: 'Wir schwanken zwischen Bauen, Kaufen oder Mieten.', decision: 'Welchen Umfang bauen, welchen kaufen oder mieten?', metiers: ['strategie', 'construire'], deliverable: 'Schriftliche Abwägung, einschliesslich dessen, worauf zu verzichten ist' },
        { quote: 'Mein Partner und ich haben nicht festgelegt, wer entscheidet.', decision: 'Wer entscheidet was, wem gehört was?', metiers: ['talent'], deliverable: 'Zweiseitiger Entscheidungsrahmen, unterschriftsreif' },
        { quote: 'Ich brauche eine erste technische Leitung.', decision: 'Profil, Status, Vergütung, Rolle gegenüber Dienstleistern', metiers: ['recruter'], deliverable: 'Stellenprofil, Kandidatenpool' },
        { quote: 'Unsere Gruppe schafft eine neue Aktivität, die abzugrenzen ist.', decision: 'Welchen Umfang vom Informationssystem der Gruppe isolieren?', metiers: ['technologie', 'strategie'], deliverable: 'Isolationsplan und Fahrplan der ersten 6 Monate' },
      ],
    },
    metiers: { mobilized: ['technologie', 'conformite', 'strategie', 'construire'], available: ['talent', 'recruter'] },
    bySize: {
      title: 'Nach Unternehmensgrösse',
      items: [
        { label: 'KMU', desc: 'Wenig Ressourcen, Abwägungen in wenigen Tagen, ein einziger Ansprechpartner bei Aegryn.' },
        { label: 'ETI', desc: 'Neue Einheit, Spin-off: die neue Aktivität vom Informationssystem und der Governance der Gruppe isolieren.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Betriebs- und Outsourcing-Anforderungen für Systeme ab Konzeption.' },
        { cluster: 'Health & Life Sciences',                        desc: 'Sensible Daten ab dem ersten Nutzer verarbeitet.' },
        { cluster: 'Industrie, Energie & Infrastruktur',            desc: 'Eingebettete Software, Wartung über Jahrzehnte.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis',     desc: 'Einwilligung und Kundendaten.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor',        desc: 'Reversibilität von Komponenten und Anbietern.' },
      ],
    },
    scenario: {
      tag:  'Illustratives Szenario',
      text: 'Ein Softwareanbieter mit 3 Mio. € Umsatz, dessen Produkt von einem externen Dienstleister entwickelt wird, bereitet seinen ersten Grosskunden vor. Der Reversibilitätstest zeigt: Das Code-Repository läuft auf den Namen des Dienstleisters. Die Korrektur lässt sich vor der Unterzeichnung in wenigen Wochen regeln — und würde danach weit mehr kosten.',
    },
    ai: {
      title: 'Was ein generisches KI-Tool nicht für Sie tun wird',
      text:  'Ihren Vertrag mit dem Dienstleister in seinem Kontext lesen, zwischen zwei Partnern schlichten und die Entscheidung vor Ihrem Verwaltungsrat oder Ihren Geldgebern verantworten.',
    },
    diagnostic: {
      title: 'Selbsteinschätzung',
      intro: 'Fünf Ja/Nein-Fragen zu Ihren Grundlagen.',
      questions: [
        { q: 'Sind Code und Daten Ihres Produkts auf den Namen Ihrer Organisation registriert?' },
        { q: 'Könnten Sie Ihren Hauptdienstleister in weniger als 90 Tagen wechseln?' },
        { q: 'Haben Sie die regulatorischen Pflichten aufgelistet, die für Ihr Produkt gelten?' },
        { q: 'Sind Rollen und Entscheidungsbefugnisse zwischen den Partnern schriftlich festgehalten?' },
        { q: 'Versteht jemand intern die Architektur von Ende zu Ende?' },
      ],
      levels: [
        { min: 4, label: 'Grundlagen gelegt',   desc: 'Ihre Grundlagen stehen. Ein 30-minütiges Gespräch kann die verbleibenden Punkte bestätigen.', nextAction: '30 Minuten austauschen' },
        { min: 2, label: 'Zu sichern',          desc: 'Mehrere Punkte vor dem Wachstum zu sichern.', nextAction: '30 Minuten austauschen' },
        { min: 0, label: 'Fundamente zuerst',   desc: 'Priorität auf den Fundamenten.', nextAction: '30 Minuten austauschen' },
      ],
      privacy: 'Es werden keine Daten gespeichert: Die Einschätzung wird in Ihrem Browser berechnet.',
    },
    nextLabel: 'Nächster Zyklus',
    next:      [{ label: 'Wachstum & Skalierung', slug: 'croissance' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'croissance',
    path: '/franchir/croissance',
    meta: {
      title:       'Wachstum & Skalierung — wachsen, ohne zu zerbrechen, was funktioniert | Aegryn',
      description: 'Ab einem gewissen Volumen wird mit fünfzig Personen langsam, was mit zehn funktionierte: Tools, Entscheidungen, Regeln, Abhängigkeiten.',
    },
    eyebrow:  'Meistern · Wachstum & Skalierung',
    h1:       'Wachsen, ohne zu zerbrechen, was funktioniert.',
    subtitle: 'Ab einem gewissen Volumen wird mit fünfzig Personen langsam, was mit zehn funktionierte: Tools, Entscheidungen, Regeln, Abhängigkeiten.',
    verbs:    ['Strukturieren', 'Absichern', 'Verstärken'],
    constat: {
      text:   'In der Schweiz stieg die KI-Nutzung der KMU zwischen 2024 und 2025 von 22 % auf 34 %, doch nur 34 % haben Regeln für die in diese Tools eingegebenen Daten (23 % bei Betrieben mit weniger als 10 Mitarbeitenden). Das KMU-Barometer 2026 liegt bei −7,3, dem tiefsten Stand seit 2021. Wachstum geschieht in angespannter Lage, mit noch kaum gerahmten Praktiken.',
      source: 'SECO, KMU-Portal.',
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Meine Teams nutzen KI, wie sie wollen.', decision: 'Welche Regeln, welche Daten, welche erlaubten Tools?', metiers: ['conformite'], deliverable: 'Nutzungscharta in drei Regeln, Einführungsplan' },
        { quote: 'Ein Grosskunde verlangt Sicherheitsnachweise.', decision: 'Welches Beweisniveau, zu welchem Preis?', metiers: ['conformite', 'technologie'], deliverable: 'Expositionskarte und priorisierter Nachrüstplan' },
        { quote: 'Alles läuft noch über mich.', decision: 'Welche Entscheidungen delegieren, an wen, in welchen Grenzen?', metiers: ['talent'], deliverable: 'Abhängigkeitsindex und Delegationsmatrix' },
        { quote: 'Unser aktuelles Tool hält das doppelte Volumen nicht aus.', decision: 'Reparieren, neu bauen oder ersetzen?', metiers: ['technologie'], deliverable: 'Reversibilitätstest und bezifferte Abwägung' },
        { quote: 'Ich brauche eine Finanz- oder Betriebsleitung.', decision: 'Profil, Rekrutierungszeitpunkt, Rolle gegenüber der Geschäftsleitung', metiers: ['recruter'], deliverable: 'Stellenprofil, Pool, Interviewraster' },
        { quote: 'Ich muss einen zweiten Markt oder eine zweite Tochtergesellschaft eröffnen.', decision: 'Welches Tempo, welche Prioritäten, welcher Verzicht?', metiers: ['strategie'], deliverable: 'Vier-Tests-Raster auf die Optionen angewendet' },
      ],
    },
    metiers: { mobilized: ['conformite', 'technologie', 'talent', 'recruter'], available: ['strategie', 'ma', 'construire'] },
    bySize: {
      title: 'Nach Unternehmensgrösse',
      items: [
        { label: 'KMU', desc: 'Drei einfache Regeln statt eines schweren Rahmens; erste Delegationsstufe.' },
        { label: 'ETI', desc: 'Mehrere Standorte oder Töchter auf eine einheitliche Politik koordinieren; strukturierte Geschäftsleitung.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Rahmen für Outsourcing und operationelle Resilienz.' },
        { cluster: 'Health & Life Sciences',                        desc: 'Patientendaten, Rückverfolgbarkeit.' },
        { cluster: 'Industrie, Energie & Infrastruktur',            desc: 'Sicherheit industrieller Systeme, Pflichten kritischer Betreiber.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis',     desc: 'Aktivitätsspitzen, Kundendaten.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor',        desc: 'Steigende Anforderungen der Auftraggeber.' },
      ],
    },
    scenario: {
      tag:  'Illustratives Szenario',
      text: 'Ein Softwareanbieter mit 25 Mio. € Umsatz, dessen Kunden Energieunternehmen sind, erhält vor der Vertragsverlängerung eine Forderung nach Sicherheitsmassnahmen. Die Expositionskarte trennt tatsächlich geltende Pflichten von allgemeinen Befürchtungen und ordnet die Arbeiten auf zwölf Monate.',
    },
    ai: {
      title: 'Was ein generisches KI-Tool nicht für Sie tun wird',
      text:  'Entscheiden, was zentralisiert bleibt, mit einem Grosskunden über das verhandeln, was Sie tatsächlich garantieren können, Ihre Teams von einer Regel überzeugen.',
    },
    diagnostic: {
      title: 'Selbsteinschätzung',
      intro: 'Fünf Fragen zu Ihrer Wachstumsfähigkeit.',
      questions: [
        { q: 'Laufen die alltäglichen Entscheidungen noch mehrheitlich über die Geschäftsleitung?', goodIf: 'no' },
        { q: 'Gibt es eine schriftliche Regel für die in KI-Tools eingegebenen Daten?' },
        { q: 'Hat ein Grosskunde Garantien verlangt, die Sie kaum dokumentieren können?', goodIf: 'no' },
        { q: 'Kann Ihr Kernsystem das doppelte Volumen ohne Umbau tragen?' },
        { q: 'Zählt Ihre Geschäftsleitung die Funktionen, die die angestrebte Grösse erfordert?' },
      ],
      levels: [
        { min: 4, label: 'Tempo gehalten',       desc: 'Ihre Organisation hält ihr Wachstumstempo: ein 30-minütiges Gespräch kann die verbleibenden Punkte bestätigen.', nextAction: '30 Minuten austauschen' },
        { min: 2, label: 'Zu strukturieren',     desc: 'Das Wachstum stützt sich noch auf informelle Gewohnheiten: mehrere Punkte zu strukturieren.', nextAction: '30 Minuten austauschen' },
        { min: 0, label: 'Struktur nötig',       desc: 'Ihre Organisation braucht Struktur, um ihr Wachstum zu tragen.', nextAction: '30 Minuten austauschen' },
      ],
      privacy: 'Es werden keine Daten gespeichert: Die Einschätzung wird in Ihrem Browser berechnet.',
    },
    nextLabel: 'Nächster Zyklus',
    next:      [
      { label: 'Restrukturierung & Pivot',        slug: 'restructuration' },
      { label: 'Akquisition & externes Wachstum', slug: 'acquisition' },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'restructuration',
    path: '/franchir/restructuration',
    meta: {
      title:       'Restrukturierung & Pivot — Kurs ändern, ohne die Kontrolle zu verlieren | Aegryn',
      description: 'Verlust eines Grosskunden, Vorfall, regulatorische Anordnung, kippender Markt: die ersten Entscheidungen wiegen am schwersten.',
    },
    eyebrow:  'Meistern · Restrukturierung & Pivot',
    h1:       'Kurs ändern, ohne die Kontrolle zu verlieren.',
    subtitle: 'Verlust eines Grosskunden, Vorfall, regulatorische Anordnung, kippender Markt: die ersten Entscheidungen wiegen am schwersten.',
    verbs:    ['Entscheiden', 'Stabilisieren', 'Pivotieren'],
    constat: {
      text:   'Die Banque de France verzeichnet 70 605 Unternehmensausfälle in den zwölf Monaten bis Ende Juli 2026. In der Schweiz müssen Betreiber kritischer Infrastrukturen einen Cyberangriff seit dem 1. April 2025 innerhalb von 24 Stunden dem NCSC melden, bei einer Busse von bis zu 100 000 CHF seit dem 1. Oktober 2025.',
      source: 'Banque de France; NCSC.',
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Ein Kunde trägt einen grossen Teil meines Umsatzes — und geht.', decision: 'Welche Prioritäten über 90 Tage, welche Liquidität schützen?', metiers: ['strategie'], deliverable: '30/60/90-Tage-Plan, präsentierbar vor Verwaltungsrat und Bank' },
        { quote: 'Wir hatten einen Vorfall. Was müssen wir melden?', decision: 'Wen benachrichtigen, in welcher Frist, mit welchen Nachweisen?', metiers: ['conformite'], deliverable: 'Positionspapier und Meldereihenfolge' },
        { quote: 'Mein Markt kippt mit der KI.', decision: 'Welcher Pivot, auf welchen vorhandenen Aktiven?', metiers: ['strategie', 'technologie'], deliverable: 'Pivot-Optionen, verglichen im Vier-Tests-Raster' },
        { quote: 'Eine Aktivität muss veräussert werden, um zu überleben.', decision: 'Welchen Umfang isolieren, welche gemeinsamen Systeme?', metiers: ['ma'], deliverable: 'Abgrenzungsumfang, Liste der Abhängigkeiten' },
        { quote: 'Ich muss Kosten senken, ohne die Ausführung zu brechen.', decision: 'Welche Kosten, welche Fristen, welche sozialen Risiken?', metiers: ['talent'], deliverable: 'Reorganisationsplan und Risiken des Abgangs von Schlüsselprofilen' },
        { quote: 'Ich brauche eine Interim-Geschäftsleitung.', decision: 'Profil, Mandat, Dauer', metiers: ['recruter'], deliverable: 'Mandatsprofil und vorausgewählte Kandidaten' },
      ],
    },
    metiers: { mobilized: ['strategie', 'conformite', 'recruter'], available: ['technologie', 'talent', 'ma', 'construire'] },
    bySize: {
      title: 'Nach Unternehmensgrösse',
      items: [
        { label: 'KMU', desc: 'Entscheidungen konzentriert auf eine Person, 30-Tage-Rahmen.' },
        { label: 'ETI', desc: 'Koordination von Verwaltungsrat, Geldgebern und Tochtergesellschaften.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Anforderungen der Aufsichtsbehörden.' },
        { cluster: 'Health & Life Sciences',                        desc: 'Kontinuität der Versorgung und der Bewilligungen.' },
        { cluster: 'Industrie, Energie & Infrastruktur',            desc: 'Produktionskontinuität und Meldepflichten.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis',     desc: 'Liquidität und Saisonalität.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor',        desc: 'Vertragliche Service-Level-Verpflichtungen.' },
      ],
    },
    scenario: {
      tag:  'Illustratives Szenario',
      text: 'Ein B2B-Dienstleistungsunternehmen mit 40 Mio. € verliert einen Kunden, der ein Drittel des Umsatzes trägt. In zehn Tagen: Kartierung vermeidbarer Kosten, Neuausrichtung des Angebots, Abstimmung mit der Bank. Der 30/60/90-Tage-Plan wird dem Verwaltungsrat vorgelegt.',
    },
    ai: {
      title: 'Was ein generisches KI-Tool nicht für Sie tun wird',
      text:  'Entscheiden, was geopfert wird, mit Ihrer Bank und Ihren Teams sprechen, die Entscheidung in einer Notlage verantworten.',
    },
    diagnostic: {
      title: 'Selbsteinschätzung',
      intro: 'Fünf Fragen zu Ihrer Exposition.',
      questions: [
        { q: 'Trägt ein Kunde oder Lieferant einen kritischen Anteil Ihrer Aktivität?', goodIf: 'no' },
        { q: 'Erzwingt ein Ereignis (Vorfall, Anordnung, Kundenverlust) eine Entscheidung innerhalb von 30 Tagen?', goodIf: 'no' },
        { q: 'Ist Ihre Liquidität über 90 Tage projiziert?' },
        { q: 'Wissen Sie, welche Meldepflichten für Ihre Organisation gelten?' },
        { q: 'Gibt es einen schriftlichen Plan für den Abgang einer Schlüsselperson?' },
      ],
      levels: [
        { min: 4, label: 'Vorbereitet',       desc: 'Ihre Organisation ist auf Kurswechsel vorbereitet.', nextAction: '30 Minuten austauschen' },
        { min: 2, label: 'Schwachstellen',    desc: 'Schwachstellen zu beheben, bevor sie dringend werden.', nextAction: '30 Minuten austauschen' },
        { min: 0, label: 'Zu stabilisieren',  desc: 'Mehrere Signale verlangen eine rasche Entscheidung: Stabilisierung zuerst.', nextAction: '30 Minuten austauschen' },
      ],
      privacy: 'Es werden keine Daten gespeichert: Die Einschätzung wird in Ihrem Browser berechnet.',
    },
    nextLabel: 'Nächster Zyklus',
    next:      [
      { label: 'Akquisition & externes Wachstum', slug: 'acquisition' },
      { label: 'Übergabe & Verkauf',              slug: 'transmission' },
    ],
    urgency: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'acquisition',
    path: '/franchir/acquisition',
    meta: {
      title:       'Akquisition & externes Wachstum — kaufen im Wissen, was Sie übernehmen | Aegryn',
      description: 'Eine Akquisition entscheidet sich ebenso über die Integration wie über den Preis: vier blinde Flecken, ein Integrationsplan, Retentionszusagen.',
    },
    eyebrow:  'Meistern · Akquisition & externes Wachstum',
    h1:       'Kaufen im Wissen, was Sie übernehmen.',
    subtitle: 'Eine Akquisition entscheidet sich ebenso über die Integration wie über den Preis.',
    verbs:    ['Bewerten', 'Integrieren', 'Binden'],
    constat: {
      text:   'Die in der Wiley Encyclopedia of Management zusammengetragenen Studien beziffern die Misserfolgsquote von Fusionen und Übernahmen auf 48 % bis 66 %; wiederkehrende Ursachen sind überschätzte Synergien, fehlende Integrationspläne und ein zu langsames Tempo. In der Schweiz erreichten die KMU-Transaktionen 2025 208 Abschlüsse (+16 %), darunter +28 % bei IT-Dienstleistungen und Software.',
      source: 'Wiley Encyclopedia of Management; SECO.',
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Wir haben ein Zielunternehmen gefunden. Was jenseits der Bilanzen prüfen?', decision: 'Welche Punkte vor dem Engagement zu prüfen?', metiers: ['ma'], deliverable: 'Prüfung der vier blinden Flecken, mit den zu verhandelnden Bedingungen' },
        { quote: 'Sind Code und Systeme des Zielunternehmens gesund?', decision: 'Abhängigkeiten, Lizenzen, Reversibilität', metiers: ['technologie'], deliverable: 'Technischer Bericht und geschätzte Nachrüstkosten' },
        { quote: 'Werden wir seine Schlüsselteams halten?', decision: 'Wen binden, mit welchen Zusagen?', metiers: ['talent'], deliverable: 'Abhängigkeitsindex des Zielunternehmens, Retentionsplan' },
        { quote: 'Wie integrieren, ohne das Geschäft zu blockieren?', decision: 'Sequenz der ersten 100 Tage', metiers: ['ma', 'technologie'], deliverable: 'Meilenstein-Integrationsplan' },
        { quote: 'Ist diese Akquisition mit unserer Strategie vereinbar?', decision: 'These, Prioritäten, Verzichte', metiers: ['strategie'], deliverable: 'Vier-Tests-Raster auf das Zielunternehmen angewendet' },
        { quote: 'Erfüllt das Zielunternehmen die Regeln, die morgen für uns gelten?', decision: 'Welche Pflichten übernehmen wir?', metiers: ['conformite'], deliverable: 'Expositionskarte des Zielunternehmens' },
      ],
    },
    metiers: { mobilized: ['ma', 'technologie', 'strategie'], available: ['conformite', 'talent', 'recruter'] },
    bySize: {
      title: 'Nach Unternehmensgrösse',
      items: [
        { label: 'KMU', desc: 'Eine Akquisition kann ein Viertel der Aktivität ausmachen; die Integration ruht auf wenigen Personen.' },
        { label: 'ETI', desc: 'Programm aufeinanderfolgender Akquisitionen, Integration zu systematisieren.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Zu übertragende Bewilligungen und Zulassungen.' },
        { cluster: 'Health & Life Sciences',                        desc: 'Compliance der übernommenen Produkte.' },
        { cluster: 'Industrie, Energie & Infrastruktur',            desc: 'Standorte, Lieferketten, schwere Aktiven.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis',     desc: 'Kundenstämme und Verträge.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor',        desc: 'Eigentum und Wartbarkeit des Codes.' },
      ],
    },
    scenario: {
      tag:  'Illustratives Szenario',
      text: 'Eine Dienstleistungsgruppe mit 90 Mio. € erwägt den Kauf eines Softwareanbieters mit 8 Mio. €. Die Prüfung der blinden Flecken offenbart die Abhängigkeit von zwei Entwicklern und eine Komponente unter restriktiver Lizenz. Der Preis ändert sich nicht; Retentionsbedingungen und ein Ersatzplan werden in die Vereinbarung aufgenommen.',
    },
    ai: {
      title: 'Was ein generisches KI-Tool nicht für Sie tun wird',
      text:  'Die Zuverlässigkeit des Teams gegenüber beurteilen, Retentionszusagen verhandeln, den Verzicht entscheiden.',
    },
    mandate: 'Aegryn führt die Transaktion nicht aus. Die Ausführung wird Investmentbanken, M&A-Boutiquen und zugelassenen Anwälten anvertraut.',
    diagnostic: {
      title: 'Selbsteinschätzung',
      intro: 'Fünf Ja/Nein-Fragen vor Ihrem Engagement.',
      questions: [
        { q: 'Haben Sie die These dieser Akquisition schriftlich festgehalten?' },
        { q: 'Existiert ein Integrationsplan vor der Unterzeichnung?' },
        { q: 'Kennen Sie die drei bis fünf Personen, von denen der Wert des Zielunternehmens abhängt?' },
        { q: 'Sind die Systeme des Zielunternehmens mit Ihren kompatibel?' },
        { q: 'Ist die Ausführung der Transaktion zugelassenen Beratern anvertraut?' },
      ],
      levels: [
        { min: 4, label: 'Strukturierter Ansatz', desc: 'Ihr Ansatz ist strukturiert: ein 30-minütiges Gespräch kann die letzten blinden Flecken prüfen.', nextAction: '30 Minuten austauschen' },
        { min: 2, label: 'Zu rahmen',             desc: 'Mehrere Punkte vor dem Engagement zu rahmen.', nextAction: '30 Minuten austauschen' },
        { min: 0, label: 'Vor der Unterzeichnung', desc: 'Vor der Unterzeichnung die Grundlagen sichern.', nextAction: '30 Minuten austauschen' },
      ],
      privacy: 'Es werden keine Daten gespeichert: Die Einschätzung wird in Ihrem Browser berechnet.',
    },
    nextLabel: 'Nächster Zyklus',
    next:      [{ label: 'Übergabe & Verkauf', slug: 'transmission' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'transmission',
    path: '/franchir/transmission',
    meta: {
      title:       'Übergabe & Verkauf — die Organisation darauf vorbereiten, ohne Sie zu bestehen | Aegryn',
      description: 'Die Übergabe wird Jahre im Voraus vorbereitet. Entscheidend ist die Fähigkeit der Organisation, ohne ihren Inhaber zu funktionieren.',
    },
    eyebrow:  'Meistern · Übergabe & Verkauf',
    h1:       'Die Organisation darauf vorbereiten, ohne Sie zu bestehen.',
    subtitle: 'Die Übergabe wird Jahre im Voraus vorbereitet. Entscheidend ist die Fähigkeit der Organisation, ohne ihren Inhaber zu funktionieren.',
    verbs:    ['Dokumentieren', 'Delegieren', 'Übergeben'],
    constat: {
      text:   'Laut Bpifrance Le Lab (Nov. 2025) planen 40 % der Inhaber von Kleinstunternehmen, KMU und ETI die Übergabe innerhalb von fünf Jahren — 370 000 Unternehmen — und 23 % der Verkäufer beklagen einen Mangel an Nachfolgern. 47 % der Inhaber familiengeführter Unternehmen im Alter von 60 bis 69 Jahren haben keinen formalisierten Nachfolgeplan.',
      source: 'Bpifrance Le Lab.',
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Alles ruht auf mir.', decision: 'Wer kann was übernehmen, in welcher Reihenfolge?', metiers: ['talent'], deliverable: 'Abhängigkeitsindex, 24-Monats-Delegationsplan' },
        { quote: 'Wird meine Familie oder mein Kader übernehmen?', decision: 'Familien-, interne oder externe Option', metiers: ['strategie', 'ma'], deliverable: 'Vergleich der drei Optionen und Zeitplan' },
        { quote: 'Sind meine Verträge und Rechte in Ordnung?', decision: 'Was ein Nachfolger prüfen wird', metiers: ['ma', 'conformite'], deliverable: 'Prüfung der blinden Flecken auf Verkäuferseite, Liste der Korrekturen' },
        { quote: 'Mein System ruht auf einer Person.', decision: 'Dokumentation und Reversibilität', metiers: ['technologie'], deliverable: 'Reversibilitätstest und Dokumentationsplan' },
        { quote: 'Ich will in 24 Monaten gehen.', decision: 'Zeitplan, Meilensteine, Rolle nach dem Ausscheiden', metiers: ['ma'], deliverable: 'Rückwärts geplanter Fahrplan' },
        { quote: 'Meine Geschäftsleitung ist nicht bereit zu übernehmen.', decision: 'Wen rekrutieren, wen fördern?', metiers: ['recruter', 'talent'], deliverable: 'Profile und Plan zur Übernahme der Verantwortung' },
      ],
    },
    metiers: { mobilized: ['talent', 'ma'], available: ['strategie', 'technologie', 'conformite', 'recruter'] },
    bySize: {
      title: 'Nach Unternehmensgrösse',
      items: [
        { label: 'KMU', desc: 'Inhaber-Gründer, starke Abhängigkeit, Horizont von 2 bis 3 Jahren.' },
        { label: 'ETI', desc: 'Familienrat, Governance, mehrere Aktionäre.' },
      ],
    },
    bySector: {
      title: 'Nach Branche',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'An Personen gebundene Bewilligungen.' },
        { cluster: 'Health & Life Sciences',                        desc: 'Inhaber von Lizenzen und Bewilligungen.' },
        { cluster: 'Industrie, Energie & Infrastruktur',            desc: 'Konzentriertes Know-how, schwere Aktiven.' },
        { cluster: 'Handel, Dienstleistungen & Kundenerlebnis',     desc: 'Vom Inhaber getragene Kundenbeziehungen.' },
        { cluster: 'Tech, Innovation & öffentlicher Sektor',        desc: 'Code-Kenntnis konzentriert bei wenigen Personen.' },
      ],
    },
    scenario: {
      tag:  'Illustratives Szenario',
      text: 'Ein familiengeführtes ETI mit 140 Mio. €, dessen Inhaber 63 Jahre alt ist. Der Abhängigkeitsindex zeigt, dass viele Entscheidungen bei ihm allein liegen. 24-Monats-Plan: schrittweise Delegation, verstärkte Geschäftsleitung, Dokumentation der wichtigsten Kundenbeziehungen.',
    },
    ai: {
      title: 'Was ein generisches KI-Tool nicht für Sie tun wird',
      text:  'Mit Ihrer Familie und Ihren Kadern sprechen, einen Nachfolger wählen, das Loslassen bestimmter Entscheidungen akzeptieren.',
    },
    mandate: 'Aegryn bereitet die Organisation vor. Der Verkauf wird mit der Investmentbank, der M&A-Boutique oder dem Anwalt des Kunden ausgeführt.',
    diagnostic: {
      title: 'Selbsteinschätzung',
      intro: 'Fünf Ja/Nein-Fragen zu Ihrer Vorbereitung.',
      questions: [
        { q: 'Kann eine wichtige Entscheidung ohne Sie getroffen werden?' },
        { q: 'Ist Ihre Nachfolge schriftlich geregelt?' },
        { q: 'Werden Ihre wichtigsten Kundenbeziehungen von mehr als einer Person getragen?' },
        { q: 'Sind Ihre Verträge, Rechte und Daten dokumentiert und aktuell?' },
        { q: 'Haben Sie ein Zieldatum für Ihr Ausscheiden?' },
      ],
      levels: [
        { min: 4, label: 'Übergabe eingeleitet', desc: 'Ihre Übergabe läuft unter guten Bedingungen.', nextAction: '30 Minuten austauschen' },
        { min: 2, label: 'Zu dokumentieren',     desc: 'Punkte zu dokumentieren, bevor der Zeitplan festgelegt wird.', nextAction: '30 Minuten austauschen' },
        { min: 0, label: 'Vorzubereiten',        desc: 'Die Vorbereitung Ihrer Übergabe beginnt jetzt.', nextAction: '30 Minuten austauschen' },
      ],
      privacy: 'Es werden keine Daten gespeichert: Die Einschätzung wird in Ihrem Browser berechnet.',
    },
    nextLabel: 'Vorheriger Zyklus',
    next:      [{ label: 'Akquisition & externes Wachstum', slug: 'acquisition' }],
  },
]
