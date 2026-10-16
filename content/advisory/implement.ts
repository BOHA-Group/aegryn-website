/**
 * Bloc « Mettre en œuvre » des pages métier du cabinet.
 * Cadrer et réaliser : chaque métier couvre la décision et la mise en œuvre « jusqu'à la réception ».
 */
export type Lang = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
type L6 = Record<Lang, string>
type L6List = Record<Lang, string[]>
const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): L6 => ({ fr, en, de, es, it, nl })

export const IMPLEMENT_UI = {
  label: L('Mettre en œuvre', 'Implement', 'Umsetzen', 'Ejecutar', 'Attuare', 'Uitvoeren'),
  lead: L(
    'Mettre en œuvre ce qui a été décidé, jusqu’à la réception.',
    'Implementing what was decided, through to acceptance.',
    'Das Beschlossene umsetzen, bis zur Abnahme.',
    'Llevar a la práctica lo decidido, hasta la entrega.',
    'Attuare ciò che è stato deciso, fino alla consegna.',
    'Uitvoeren wat besloten is, tot en met de oplevering.'),
}

/** Slug de page → lignes de mise en œuvre. Technologie reprend la page « Solutions sur mesure » (voir BuildImplementation). */
export const IMPLEMENT_ITEMS: Record<string, L6List> = {
  strategy: {
    fr: ['Traduire la stratégie en plan d’action, avec responsables, jalons et budgets.', 'Animer le comité de pilotage et suivre un tableau de bord d’indicateurs clés.', 'Lancer les initiatives prioritaires : nouveau marché, offre ou modèle économique.', 'Ajuster le plan à chaque revue, jusqu’à la réception des résultats.'],
    en: ['Turn the strategy into an action plan, with owners, milestones and budgets.', 'Run the steering committee and track a dashboard of key indicators.', 'Launch the priority initiatives: new market, offer or business model.', 'Adjust the plan at each review, until results are delivered.'],
    de: ['Die Strategie in einen Aktionsplan mit Verantwortlichen, Meilensteinen und Budgets übersetzen.', 'Den Lenkungsausschuss führen und ein Kennzahlen-Dashboard verfolgen.', 'Die vorrangigen Initiativen starten: neuer Markt, Angebot oder Geschäftsmodell.', 'Den Plan bei jeder Überprüfung anpassen, bis die Ergebnisse vorliegen.'],
    es: ['Traducir la estrategia en un plan de acción, con responsables, hitos y presupuestos.', 'Dirigir el comité de seguimiento y vigilar un cuadro de indicadores clave.', 'Lanzar las iniciativas prioritarias: nuevo mercado, oferta o modelo de negocio.', 'Ajustar el plan en cada revisión, hasta la entrega de los resultados.'],
    it: ['Tradurre la strategia in un piano d’azione, con responsabili, tappe e budget.', 'Guidare il comitato di pilotaggio e seguire un cruscotto di indicatori chiave.', 'Avviare le iniziative prioritarie: nuovo mercato, offerta o modello di business.', 'Adeguare il piano a ogni revisione, fino alla consegna dei risultati.'],
    nl: ['De strategie vertalen naar een actieplan, met verantwoordelijken, mijlpalen en budgetten.', 'Het stuurcomité leiden en een dashboard met kerncijfers volgen.', 'De prioritaire initiatieven lanceren: nieuwe markt, aanbod of verdienmodel.', 'Het plan bij elke herziening bijsturen, tot de resultaten zijn opgeleverd.'],
  },
  'risk-compliance': {
    fr: ['Déployer le plan de mise en conformité : politiques, procédures et registres.', 'Mettre en place les contrôles et le dossier de preuves opposable aux clients.', 'Former les équipes et les comités de direction aux nouvelles exigences.', 'Piloter la remédiation jusqu’à la clôture des écarts.'],
    en: ['Roll out the compliance plan: policies, procedures and registers.', 'Put in place the controls and the evidence file that stands up with clients.', 'Train teams and executive committees on the new requirements.', 'Lead remediation until the gaps are closed.'],
    de: ['Den Compliance-Plan ausrollen: Richtlinien, Verfahren und Register.', 'Kontrollen und eine gegenüber Kunden belastbare Nachweisakte einrichten.', 'Teams und Geschäftsleitungen zu den neuen Anforderungen schulen.', 'Die Behebung steuern, bis die Abweichungen geschlossen sind.'],
    es: ['Desplegar el plan de cumplimiento: políticas, procedimientos y registros.', 'Implantar los controles y el expediente de pruebas oponible a los clientes.', 'Formar a los equipos y a los comités de dirección en las nuevas exigencias.', 'Dirigir la remediación hasta el cierre de las desviaciones.'],
    it: ['Attuare il piano di conformità: politiche, procedure e registri.', 'Mettere in atto i controlli e il fascicolo di prove opponibile ai clienti.', 'Formare i team e i comitati di direzione sulle nuove esigenze.', 'Guidare le azioni correttive fino alla chiusura degli scostamenti.'],
    nl: ['Het compliance-plan uitrollen: beleid, procedures en registers.', 'De controles en het bewijsdossier invoeren dat bij klanten standhoudt.', 'Teams en directiecomités opleiden in de nieuwe vereisten.', 'De remediëring sturen tot de afwijkingen zijn gesloten.'],
  },
  'talent-organization': {
    fr: ['Mettre en place l’organisation cible : rôles, gouvernance et comités.', 'Déployer le plan de succession et de rétention des profils clés.', 'Conduire les nominations et les prises de poste des dirigeants.', 'Installer les rituels de pilotage qui font tenir l’organisation sans nous.', 'Conduire le changement : communication, adoption, suivi des équipes concernées.', 'Transférer les savoir-faire critiques vers les successeurs et les doublures.'],
    en: ['Set up the target organisation: roles, governance and committees.', 'Roll out the succession and key-talent retention plan.', 'Lead appointments and executives taking up their posts.', 'Install the steering routines that keep the organisation running without us.', 'Lead the change: communication, adoption, follow-up of the teams concerned.', 'Transfer critical know-how to successors and backups.'],
    de: ['Die Zielorganisation einrichten: Rollen, Governance und Gremien.', 'Den Nachfolge- und Bindungsplan für Schlüsselpersonen umsetzen.', 'Ernennungen und Amtsantritte der Führungskräfte leiten.', 'Steuerungsroutinen etablieren, mit denen die Organisation ohne uns trägt.', 'Den Wandel führen: Kommunikation, Akzeptanz, Begleitung der betroffenen Teams.', 'Kritisches Know-how auf Nachfolger und Stellvertretungen übertragen.'],
    es: ['Poner en marcha la organización objetivo: roles, gobierno y comités.', 'Desplegar el plan de sucesión y de retención de perfiles clave.', 'Conducir los nombramientos y la llegada de los directivos a sus puestos.', 'Instalar las rutinas de seguimiento que sostienen la organización sin nosotros.', 'Conducir el cambio: comunicación, adopción, seguimiento de los equipos afectados.', 'Transferir los saberes críticos a los sucesores y suplentes.'],
    it: ['Mettere in piedi l’organizzazione obiettivo: ruoli, governance e comitati.', 'Attuare il piano di successione e di retention dei profili chiave.', 'Condurre le nomine e l’insediamento dei dirigenti.', 'Instaurare i rituali di pilotaggio che reggono l’organizzazione senza di noi.', 'Guidare il cambiamento: comunicazione, adozione, monitoraggio dei team coinvolti.', 'Trasferire le competenze critiche ai successori e ai sostituti.'],
    nl: ['De doelorganisatie inrichten: rollen, governance en comités.', 'Het opvolgings- en retentieplan voor sleutelfiguren uitrollen.', 'Benoemingen en indiensttredingen van leidinggevenden leiden.', 'Stuurroutines installeren waarmee de organisatie zonder ons standhoudt.', 'De verandering leiden: communicatie, adoptie, opvolging van de betrokken teams.', 'De kritieke vakkennis overdragen aan opvolgers en back-ups.'],
  },
  operationsExcellence: {
    fr: ['Conduire le programme d’amélioration : standardisation des processus, indicateurs, rituels de pilotage.', 'Mettre en œuvre le plan achats : renégociation, seconde source, suivi des gains.', 'Déployer les tableaux de bord opérationnels (outils sur mesure si nécessaire, voir Technologie et Souveraineté).', 'Conduire le plan de réduction de coûts avec la direction, avec la conduite du changement de Talent et Organisation.'],
    en: ['Lead the improvement programme: process standardisation, indicators, steering routines.', 'Implement the purchasing plan: renegotiation, second source, tracking of gains.', 'Roll out the operational dashboards (custom tools where needed, see Technology and Sovereignty).', 'Lead the cost-reduction plan with management, with change management from Talent and Organisation.'],
    de: ['Das Verbesserungsprogramm führen: Prozessstandardisierung, Indikatoren, Steuerungsroutinen.', 'Den Einkaufsplan umsetzen: Neuverhandlung, Zweitquelle, Gewinnverfolgung.', 'Die operativen Dashboards einführen (bei Bedarf massgeschneiderte Werkzeuge, siehe Technologie und Souveränität).', 'Den Kostensenkungsplan mit der Geschäftsleitung umsetzen, mit dem Change Management von Talent und Organisation.'],
    es: ['Dirigir el programa de mejora: estandarización de procesos, indicadores, rutinas de seguimiento.', 'Poner en práctica el plan de compras: renegociación, segunda fuente, seguimiento de las ganancias.', 'Desplegar los cuadros de mando operativos (herramientas a medida si hace falta, ver Tecnología y Soberanía).', 'Dirigir el plan de reducción de costes con la dirección, con la conducción del cambio de Talento y Organización.'],
    it: ['Guidare il programma di miglioramento: standardizzazione dei processi, indicatori, rituali di pilotaggio.', 'Attuare il piano acquisti: rinegoziazione, seconda fonte, monitoraggio dei guadagni.', 'Distribuire i cruscotti operativi (strumenti su misura se necessario, vedi Tecnologia e Sovranità).', 'Guidare il piano di riduzione dei costi con la direzione, con la gestione del cambiamento di Talento e Organizzazione.'],
    nl: ['Het verbeteringsprogramma leiden: processtandaardisatie, indicatoren, stuurroutines.', 'Het inkoopplan uitvoeren: heronderhandeling, tweede bron, winstbewaking.', 'De operationele dashboards uitrollen (maatwerktools waar nodig, zie Technologie en Soevereiniteit).', 'Het kostenverlagingsplan met de directie uitvoeren, met verandermanagement van Talent en Organisatie.'],
  },
  financePerformance: {
    fr: ['Installer le pilotage hebdomadaire de la trésorerie.', 'Mettre en place le budget, le reporting et le tableau de bord mensuel.', 'Conduire le programme de réduction du besoin en fonds de roulement (clients, stocks, fournisseurs).', 'Conduire le plan de redressement avec la direction, y compris le dialogue avec les créanciers, avec l’appui d’avocats partenaires.'],
    en: ['Set up weekly cash-flow steering.', 'Install the budget, reporting and monthly dashboard.', 'Lead the working-capital reduction programme (receivables, inventory, suppliers).', 'Lead the turnaround plan with management, including dialogue with creditors, supported by partner lawyers.'],
    de: ['Die wöchentliche Liquiditätssteuerung einrichten.', 'Budget, Reporting und monatliches Dashboard einführen.', 'Das Programm zur Senkung des Working Capital (Kunden, Lager, Lieferanten) führen.', 'Den Sanierungsplan mit der Geschäftsleitung umsetzen, einschliesslich des Dialogs mit den Gläubigern, mit Unterstützung von Partneranwälten.'],
    es: ['Instalar el seguimiento semanal de la tesorería.', 'Implantar el presupuesto, el reporting y el cuadro de mando mensual.', 'Dirigir el programa de reducción del fondo de maniobra (clientes, inventarios, proveedores).', 'Dirigir el plan de reflotamiento con la dirección, incluido el diálogo con los acreedores, con el apoyo de abogados asociados.'],
    it: ['Instaurare il pilotaggio settimanale della tesoreria.', 'Mettere in atto il budget, il reporting e il cruscotto mensile.', 'Guidare il programma di riduzione del capitale circolante (clienti, scorte, fornitori).', 'Guidare il piano di risanamento con la direzione, compreso il dialogo con i creditori, con l’appoggio di avvocati partner.'],
    nl: ['De wekelijkse liquiditeitssturing instellen.', 'Budget, reporting en maandelijks dashboard invoeren.', 'Het programma ter vermindering van het werkkapitaal (klanten, voorraden, leveranciers) leiden.', 'Het saneringsplan met de directie uitvoeren, inclusief de dialoog met schuldeisers, met steun van partneradvocaten.'],
  },
  ma: {
    fr: ['Conduire le processus de la revue à la signature : calendrier, intervenants, documents.', 'Préparer et coordonner la revue technique et organisationnelle.', 'Piloter l’intégration après l’opération : équipes, systèmes, cent premiers jours.', 'Suivre les engagements et les synergies jusqu’à la réception.'],
    en: ['Run the process from review to signing: timetable, parties, documents.', 'Prepare and coordinate the technical and organisational review.', 'Lead post-deal integration: teams, systems, the first 100 days.', 'Track commitments and synergies until delivery.'],
    de: ['Den Prozess von der Prüfung bis zur Unterzeichnung führen: Zeitplan, Beteiligte, Dokumente.', 'Die technische und organisatorische Prüfung vorbereiten und koordinieren.', 'Die Integration nach der Transaktion steuern: Teams, Systeme, die ersten 100 Tage.', 'Zusagen und Synergien bis zur Abnahme nachverfolgen.'],
    es: ['Conducir el proceso de la revisión a la firma: calendario, intervinientes, documentos.', 'Preparar y coordinar la revisión técnica y organizativa.', 'Dirigir la integración posterior a la operación: equipos, sistemas, los primeros 100 días.', 'Seguir los compromisos y las sinergias hasta la entrega.'],
    it: ['Condurre il processo dalla revisione alla firma: calendario, parti coinvolte, documenti.', 'Preparare e coordinare la revisione tecnica e organizzativa.', 'Guidare l’integrazione dopo l’operazione: team, sistemi, i primi 100 giorni.', 'Seguire impegni e sinergie fino alla consegna.'],
    nl: ['Het proces leiden van beoordeling tot ondertekening: planning, betrokkenen, documenten.', 'De technische en organisatorische beoordeling voorbereiden en coördineren.', 'De integratie na de transactie sturen: teams, systemen, de eerste 100 dagen.', 'Toezeggingen en synergieën volgen tot de oplevering.'],
  },
  projectProgram: {
    fr: ['Mettre en place le bureau de projets (PMO) : méthode minimale, tableau de bord, rituels.', 'Piloter un projet ou un programme avec la direction : jalons, risques, arbitrages, reporting.', 'Conduire un plan de redressement : reprise du planning, du budget, de la relation fournisseur.', 'Réceptionner et transférer à l’exploitation : tests de réception, formation, reprise par les équipes.'],
    en: ['Set up the project office (PMO): minimal method, dashboard, routines.', 'Lead a project or programme with management: milestones, risks, arbitration, reporting.', 'Lead a turnaround plan: recovering schedule, budget and vendor relationship.', 'Accept and transfer to operations: acceptance tests, training, handover to the teams.'],
    de: ['Das Projektbüro (PMO) einrichten: minimale Methode, Dashboard, Routinen.', 'Ein Projekt oder Programm mit der Geschäftsleitung steuern: Meilensteine, Risiken, Vermittlungen, Reporting.', 'Einen Sanierungsplan umsetzen: Wiederaufnahme von Planung, Budget und Anbieterbeziehung.', 'Abnehmen und an den Betrieb übergeben: Abnahmetests, Schulung, Übernahme durch die Teams.'],
    es: ['Poner en marcha la oficina de proyectos (PMO): método mínimo, cuadro de mando, rutinas.', 'Dirigir un proyecto o programa con la dirección: hitos, riesgos, arbitrajes, reporting.', 'Dirigir un plan de reflotamiento: recuperación del calendario, del presupuesto, de la relación con el proveedor.', 'Recepcionar y transferir a explotación: pruebas de recepción, formación, reanudación por los equipos.'],
    it: ['Istituite l’ufficio progetti (PMO): metodo minimo, cruscotto, rituali.', 'Pilotare un progetto o un programma con la direzione: tappe, rischi, arbitraggi, reporting.', 'Condurre un piano di risanamento: ripresa di calendario, budget e rapporto con il fornitore.', 'Collaudare e trasferire all’esercizio: test di collaudo, formazione, ripresa da parte dei team.'],
    nl: ['Het projectbureau (PMO) inrichten: minimale methode, dashboard, routines.', 'Een project of programma met de directie sturen: mijlpalen, risico’s, bemiddelingen, reporting.', 'Een saneringsplan uitvoeren: herstel van planning, budget en leveranciersrelatie.', 'Aannemen en overdragen aan beheer: acceptatietests, training, overname door de teams.'],
  },
}

/** Lignes d'accompagnement sous le bloc, par métier (ex. Finance : Sélectionner + régimes d'intervention). */
export const IMPLEMENT_NOTES: Record<string, L6List> = {
  'talent-organization': {
    fr: ['Régimes d’intervention : nous réalisons, nous réalisons avec des experts, ou nous coordonnons des experts que vous avez choisis.'],
    en: ['Engagement modes: we deliver, we deliver with experts, or we coordinate experts of your choosing.'],
    de: ['Einsatzformen: Wir setzen um, wir setzen mit Experten um, oder wir koordinieren von Ihnen gewählte Experten.'],
    es: ['Modalidades de intervención: ejecutamos, ejecutamos con expertos, o coordinamos expertos elegidos por usted.'],
    it: ['Modalità d’intervento: attuiamo, attuiamo con degli esperti, o coordiniamo esperti scelti da voi.'],
    nl: ['Inzetvormen: wij voeren uit, wij voeren uit met experts, of wij coördineren experts die u heeft gekozen.'],
  },
  operationsExcellence: {
    fr: ['Un directeur des opérations ou un responsable d’opérations à temps partiel peut renforcer l’équipe : cette mission passe par Sélectionner (profils de transition).', 'Régimes d’intervention : nous réalisons, nous réalisons avec des experts, ou nous coordonnons des experts que vous avez choisis.'],
    en: ['An operations director or part-time operations lead can reinforce the team: this assignment runs through Talent (interim profiles).', 'Engagement modes: we deliver, we deliver with experts, or we coordinate experts of your choosing.'],
    de: ['Ein Operations-Direktor oder ein Teilzeit-Operationsleiter kann das Team verstärken: Dieser Auftrag läuft über die Auswahl (Interim-Profile).', 'Einsatzformen: Wir setzen um, wir setzen mit Experten um, oder wir koordinieren von Ihnen gewählte Experten.'],
    es: ['Un director de operaciones o un responsable de operaciones a tiempo parcial puede reforzar el equipo: esta misión pasa por Selección (perfiles interinos).', 'Modalidades de intervención: ejecutamos, ejecutamos con expertos, o coordinamos expertos elegidos por usted.'],
    it: ['Un direttore delle operazioni o un responsabile delle operazioni a tempo parziale può rafforzare il team: questo mandato passa per Selezione (profili ad interim).', 'Modalità d’intervento: attuiamo, attuiamo con degli esperti, o coordiniamo esperti scelti da voi.'],
    nl: ['Een operations director of een deeltijdse operations manager kan het team versterken: deze opdracht loopt via Selectie (interimprofielen).', 'Inzetvormen: wij voeren uit, wij voeren uit met experts, of wij coördineren experts die u heeft gekozen.'],
  },
  financePerformance: {
    fr: ['Un directeur financier de transition peut renforcer l’équipe : cette mission passe par Sélectionner (profils de transition).', 'Régimes d’intervention : nous réalisons, nous réalisons avec des experts, ou nous coordonnons des experts que vous avez choisis.'],
    en: ['An interim CFO can reinforce the team: this assignment runs through Talent (interim profiles).', 'Engagement modes: we deliver, we deliver with experts, or we coordinate experts of your choosing.'],
    de: ['Ein Interim-CFO kann das Team verstärken: Dieser Auftrag läuft über die Auswahl (Interim-Profile).', 'Einsatzformen: Wir setzen um, wir setzen mit Experten um, oder wir koordinieren von Ihnen gewählte Experten.'],
    es: ['Un director financiero interino puede reforzar el equipo: esta misión pasa por Selección (perfiles interinos).', 'Modalidades de intervención: ejecutamos, ejecutamos con expertos, o coordinamos expertos elegidos por usted.'],
    it: ['Un direttore finanziario ad interim può rafforzare il team: questo mandato passa per Selezione (profili ad interim).', 'Modalità d’intervento: attuiamo, attuiamo con degli esperti, o coordiniamo esperti scelti da voi.'],
    nl: ['Een interim-CFO kan het team versterken: deze opdracht loopt via Selectie (interimprofielen).', 'Inzetvormen: wij voeren uit, wij voeren uit met experts, of wij coördineren experts die u heeft gekozen.'],
  },
  projectProgram: {
    fr: ['Une direction de projet à temps partiel peut renforcer l’équipe : cette mission passe par Sélectionner (profils de transition).', 'Régimes d’intervention : nous réalisons, nous réalisons avec des experts, ou nous coordonnons des experts que vous avez choisis.'],
    en: ['A part-time project director can reinforce the team: this assignment runs through Talent (interim profiles).', 'Engagement modes: we deliver, we deliver with experts, or we coordinate experts of your choosing.'],
    de: ['Eine Projektleitung in Teilzeit kann das Team verstärken: Dieser Auftrag läuft über die Auswahl (Interim-Profile).', 'Einsatzformen: Wir setzen um, wir setzen mit Experten um, oder wir koordinieren von Ihnen gewählte Experten.'],
    es: ['Una dirección de proyectos a tiempo parcial puede reforzar el equipo: esta misión pasa por Selección (perfiles interinos).', 'Modalidades de intervención: ejecutamos, ejecutamos con expertos, o coordinamos expertos elegidos por usted.'],
    it: ['Una direzione di progetto a tempo parziale può rafforzare il team: questo mandato passa per Selezione (profili ad interim).', 'Modalità d’intervento: attuiamo, attuiamo con degli esperti, o coordiniamo esperti scelti da voi.'],
    nl: ['Een deeltijdse projectleiding kan het team versterken: deze opdracht loopt via Selectie (interimprofielen).', 'Inzetvormen: wij voeren uit, wij voeren uit met experts, of wij coördineren experts die u heeft gekozen.'],
  },
}
