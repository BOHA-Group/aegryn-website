/**
 * Bloc « Mettre en œuvre » des pages métier du cabinet, et pages métier en préparation.
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
    fr: ['Mettre en place l’organisation cible : rôles, gouvernance et comités.', 'Déployer le plan de succession et de rétention des profils clés.', 'Accompagner les nominations et les prises de poste des dirigeants.', 'Installer les rituels de pilotage qui font tenir l’organisation sans nous.'],
    en: ['Set up the target organisation: roles, governance and committees.', 'Roll out the succession and key-talent retention plan.', 'Support appointments and executives taking up their posts.', 'Install the steering routines that keep the organisation running without us.'],
    de: ['Die Zielorganisation einrichten: Rollen, Governance und Gremien.', 'Den Nachfolge- und Bindungsplan für Schlüsselpersonen umsetzen.', 'Ernennungen und Amtsantritte der Führungskräfte begleiten.', 'Steuerungsroutinen etablieren, mit denen die Organisation ohne uns trägt.'],
    es: ['Poner en marcha la organización objetivo: roles, gobierno y comités.', 'Desplegar el plan de sucesión y de retención de perfiles clave.', 'Acompañar los nombramientos y la llegada de los directivos a sus puestos.', 'Instalar las rutinas de seguimiento que sostienen la organización sin nosotros.'],
    it: ['Mettere in piedi l’organizzazione obiettivo: ruoli, governance e comitati.', 'Attuare il piano di successione e di retention dei profili chiave.', 'Accompagnare le nomine e l’insediamento dei dirigenti.', 'Instaurare i rituali di pilotaggio che reggono l’organizzazione senza di noi.'],
    nl: ['De doelorganisatie inrichten: rollen, governance en comités.', 'Het opvolgings- en retentieplan voor sleutelfiguren uitrollen.', 'Benoemingen en indiensttredingen van leidinggevenden begeleiden.', 'Stuurroutines installeren waarmee de organisatie zonder ons standhoudt.'],
  },
  ma: {
    fr: ['Conduire le processus de la revue à la signature : calendrier, intervenants, documents.', 'Préparer et coordonner la revue technique et organisationnelle.', 'Piloter l’intégration après l’opération : équipes, systèmes, cent premiers jours.', 'Suivre les engagements et les synergies jusqu’à la réception.'],
    en: ['Run the process from review to signing: timetable, parties, documents.', 'Prepare and coordinate the technical and organisational review.', 'Lead post-deal integration: teams, systems, the first 100 days.', 'Track commitments and synergies until delivery.'],
    de: ['Den Prozess von der Prüfung bis zur Unterzeichnung führen: Zeitplan, Beteiligte, Dokumente.', 'Die technische und organisatorische Prüfung vorbereiten und koordinieren.', 'Die Integration nach der Transaktion steuern: Teams, Systeme, die ersten 100 Tage.', 'Zusagen und Synergien bis zur Abnahme nachverfolgen.'],
    es: ['Conducir el proceso de la revisión a la firma: calendario, intervinientes, documentos.', 'Preparar y coordinar la revisión técnica y organizativa.', 'Dirigir la integración posterior a la operación: equipos, sistemas, los primeros 100 días.', 'Seguir los compromisos y las sinergias hasta la entrega.'],
    it: ['Condurre il processo dalla revisione alla firma: calendario, parti coinvolte, documenti.', 'Preparare e coordinare la revisione tecnica e organizzativa.', 'Guidare l’integrazione dopo l’operazione: team, sistemi, i primi 100 giorni.', 'Seguire impegni e sinergie fino alla consegna.'],
    nl: ['Het proces leiden van beoordeling tot ondertekening: planning, betrokkenen, documenten.', 'De technische en organisatorische beoordeling voorbereiden en coördineren.', 'De integratie na de transactie sturen: teams, systemen, de eerste 100 dagen.', 'Toezeggingen en synergieën volgen tot de oplevering.'],
  },
}

/** Les trois métiers ajoutés : pages en préparation (contenu à fournir), noindex. */
export const NEW_PILLARS: Record<string, { slug: string; name: L6; desc: L6 }> = {
  finance: {
    slug: '/advisory/finance',
    name: L('Finance et Performance', 'Finance and Performance', 'Finanzen und Performance', 'Finanzas y Rendimiento', 'Finanza e Performance', 'Financiën en Prestaties'),
    desc: L('Piloter la performance financière, de la décision à sa mise en œuvre.', 'Steering financial performance, from decision to implementation.', 'Die finanzielle Performance steuern, von der Entscheidung bis zur Umsetzung.', 'Dirigir el rendimiento financiero, de la decisión a su puesta en práctica.', 'Guidare la performance finanziaria, dalla decisione alla sua attuazione.', 'De financiële prestaties sturen, van beslissing tot uitvoering.'),
  },
  operations: {
    slug: '/advisory/operations',
    name: L('Opérations et Excellence opérationnelle', 'Operations and Operational Excellence', 'Operations und operative Exzellenz', 'Operaciones y Excelencia operativa', 'Operazioni ed Eccellenza operativa', 'Operations en Operationele excellentie'),
    desc: L('Rendre les opérations plus fiables et plus performantes, de la décision à sa mise en œuvre.', 'Making operations more reliable and efficient, from decision to implementation.', 'Abläufe zuverlässiger und leistungsfähiger machen, von der Entscheidung bis zur Umsetzung.', 'Hacer las operaciones más fiables y eficientes, de la decisión a su puesta en práctica.', 'Rendere le operazioni più affidabili ed efficienti, dalla decisione alla sua attuazione.', 'Operaties betrouwbaarder en efficiënter maken, van beslissing tot uitvoering.'),
  },
  'project-management': {
    slug: '/advisory/project-management',
    name: L('Pilotage de projets et de programmes', 'Project and Programme Management', 'Projekt- und Programmsteuerung', 'Gestión de proyectos y programas', 'Gestione di progetti e programmi', 'Project- en programmamanagement'),
    desc: L('Piloter projets et programmes jusqu’à la réception.', 'Leading projects and programmes through to acceptance.', 'Projekte und Programme bis zur Abnahme steuern.', 'Dirigir proyectos y programas hasta la entrega.', 'Guidare progetti e programmi fino alla consegna.', 'Projecten en programma’s leiden tot en met de oplevering.'),
  },
}

export const COMING_UI = {
  notice: L(
    'Page en préparation. Pour échanger sur ce métier, notre équipe vous répond sous deux jours ouvrés.',
    'Page in preparation. To discuss this discipline, our team replies within two business days.',
    'Seite in Vorbereitung. Für ein Gespräch zu diesem Fachgebiet antwortet unser Team innerhalb von zwei Werktagen.',
    'Página en preparación. Para hablar de este oficio, nuestro equipo responde en dos días hábiles.',
    'Pagina in preparazione. Per parlare di questo mestiere, il nostro team risponde entro due giorni lavorativi.',
    'Pagina in voorbereiding. Om over dit vakgebied te spreken, antwoordt ons team binnen twee werkdagen.'),
  cta: L('Échanger 30 minutes', 'Book 30 minutes', '30 Minuten austauschen', 'Intercambiar 30 minutos', 'Scambiare 30 minuti', '30 minuten spreken'),
  all: L('Tous les métiers', 'All disciplines', 'Alle Fachgebiete', 'Todos los oficios', 'Tutti i mestieri', 'Alle vakgebieden'),
  label: L('Cadrer et réaliser', 'Frame and deliver', 'Rahmen setzen und umsetzen', 'Encuadrar y realizar', 'Inquadrare e realizzare', 'Kaderen en realiseren'),
}
