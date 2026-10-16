/**
 * Métier FINANCE ET PERFORMANCE (/advisory/finance-performance).
 * Contenu rédigé avec l'utilisateur en octobre 2026 ; structure des pages métier.
 * Pas de chiffres sur la taille du marché ni promesse de financement : la page
 * s'arrête à la préparation du dossier, conformément aux règles du projet.
 */
import type { AdvisoryPageContent } from './types'

export const ADVISORY_FINANCE: Record<string, AdvisoryPageContent> = {
  fr: {
    key: 'financePerformance',
    path: '/advisory/finance-performance',
    image: '/images/advisory/finance.webp',
    imageAlt: 'Bureau de travail avec ordinateur, carnet et calculatrice, pilotage de la trésorerie',
    meta: {
      title: "Finance et Performance : trésorerie, rentabilité, redressement | Aegryn",
      description: "Trésorerie à 13 semaines, rentabilité par activité, plan financier et redressement : Aegryn aide les dirigeants de PME et d'ETI à décider et à mettre en œuvre leurs décisions financières. Suisse et Europe.",
      keywords: ['conseil trésorerie PME', 'trésorerie 13 semaines', 'rentabilité par activité', 'plan de redressement', 'CFO de transition', 'conseil financier Suisse'],
    },
    eyebrow: 'Finance et Performance',
    h1: "Voir le cash avant qu'il ne manque.",
    subtitle: 'Trésorerie, rentabilité, plan chiffré, redressement : les décisions financières conditionnent toutes les autres. Aegryn intervient aux moments où une décision chiffrée doit être prise, puis la met en œuvre avec votre direction financière.',
    scope: [
      { label: 'Le plan et ses hypothèses : Stratégie', href: '/advisory/strategy' },
      { label: 'Un directeur financier de transition : Sélectionner', href: '/talent' },
      { label: 'La cession ou l’acquisition : M&A', href: '/advisory/ma' },
      { label: 'Les leviers opérationnels (stocks, délais, achats) : Opérations', href: '/advisory/operations-excellence' },
    ],
    observation: {
      title: 'Ce que nous constatons',
      cards: [
        { value: '6 274', label: 'procédures d’insolvabilité ouvertes en Suisse de janvier à fin octobre 2025, soit environ +40 % sur un an', source: 'Dun & Bradstreet, communiqué du 3 nov. 2025 (relayé par l’ATS)' },
        { value: '≈ 1 sur 3', label: 'des factures B2B émises par des fournisseurs suisses sont payées en retard, contre environ une sur quatre en Europe de l’Ouest', source: 'Atradius, Tendances des pratiques de paiement B2B Suisse, juin 2026' },
        { value: '37 %', label: 'des PME suisses sont entièrement autofinancées, contre 62 % en 2016', source: 'SECO, enquête auprès de 2 712 PME (kmu.admin.ch)' },
      ],
      paragraphs: [
        'La hausse des procédures de 2025 tient en partie à la révision de la loi sur la poursuite pour dettes et la faillite (LP) du 1er janvier 2025 : les créanciers publics, comme le fisc ou les assurances sociales, doivent désormais passer par la faillite. Elle touche surtout des entreprises déjà fragilisées.',
        'Le signal reste utile : le cash se resserre, les clients paient plus tard, et moins de PME peuvent s’appuyer sur leurs seuls fonds propres.',
      ],
      change: 'La bonne question n’est pas « faisons-nous du résultat ? » mais « aurons-nous du cash dans treize semaines, et qui le sait dans l’entreprise ? ». Une entreprise rentable peut manquer de trésorerie ; une entreprise en difficulté peut redresser si elle agit tôt.',
    },
    outcomes: {
      title: 'Ce que vous obtenez',
      items: [
        'Une vue de votre trésorerie à treize semaines, mise à jour chaque semaine.',
        'Des décisions chiffrées que votre comité, votre banquier ou un acquéreur peuvent lire sans vous.',
        'Un responsable nommé pour chaque levier : clients, fournisseurs, coûts, investissements.',
      ],
    },
    situations: {
      title: 'Où vous en êtes. Comment nous intervenons.',
      items: [
        { quote: 'Nous croissons, mais la trésorerie se tend.', decision: 'Financer la croissance par le cash généré, par les délais clients ou autrement.', deliverable: 'Plan de trésorerie à 13 semaines, trois scénarios, besoin en fonds de roulement cartographié.', format: 'Quelques semaines', cycles: ['croissance'] },
        { quote: 'Nos clients paient en retard.', decision: 'Quelles conditions de paiement, quelles relances, quels clients à risque.', deliverable: 'Diagnostic du poste clients et plan de réduction du délai d’encaissement.', format: 'Mission courte', cycles: ['croissance'] },
        { quote: 'Le banquier ou un investisseur demande un plan chiffré.', decision: 'Quelles hypothèses assumer, quel niveau de détail.', deliverable: 'Modèle financier sur trois ans, cohérent avec le plan stratégique, et dossier prêt pour l’échange.', format: 'Un à deux mois', cycles: ['lancement'] },
        { quote: 'Nous ne savons pas quelles activités gagnent de l’argent.', decision: 'Quoi garder, relever, arrêter.', deliverable: 'Rentabilité par activité et par client, tableau de bord mensuel.', format: 'Quelques semaines', cycles: ['restructuration'] },
        { quote: 'La situation se dégrade : il faut agir avant d’y être contraint.', decision: 'Redresser, restructurer ou céder, et quand informer les créanciers.', deliverable: 'Plan de redressement chiffré et calendrier, avec un avocat partenaire pour le droit des poursuites et des faillites.', format: 'Mission de trois à six mois', cycles: ['restructuration'] },
        { quote: 'Nous préparons une cession ou une acquisition.', decision: 'Quels chiffres seront regardés, comment les présenter.', deliverable: 'Qualité des résultats (retraitements, fonds de roulement normalisé) et partie financière de la data room.', format: 'Quelques semaines', cycles: ['acquisition', 'transmission'] },
      ],
    },
    services: {
      title: 'Nos services : décider (Cadrer)',
      items: [
        'Diagnostiquer la situation financière : rentabilité, marges, conversion en cash.',
        'Établir la trésorerie à treize semaines et ses scénarios.',
        'Modéliser le plan financier sur trois ans.',
        'Préparer le dossier pour vos financeurs et vos investisseurs.',
        'Qualifier la qualité des résultats avant une cession ou une acquisition.',
        'Arbitrer le plan de redressement : redresser, restructurer ou céder.',
      ],
    },
    framework: {
      name: 'La Revue de liquidité à treize semaines',
      intro: 'Un document de deux pages, mis à jour chaque semaine.',
      axes: [
        { label: 'Encaissements', desc: 'Client par client, par échéance.' },
        { label: 'Décaissements', desc: 'Les décaissements obligatoires, et ceux que l’on peut décaler.' },
        { label: 'Scénarios', desc: 'Trois scénarios : attendu, prudent, tendu.' },
        { label: 'Seuils d’alerte', desc: 'Les seuils d’alerte et les décisions prises à l’avance, avant d’en avoir besoin.' },
      ],
      deliverable: 'Une page lue par le comité chaque semaine, sans annexe.',
    },
    perspectives: { title: 'Pour aller plus loin', items: [] },
    cta: { metier: 'finance' },
  },

  en: {
    key: 'financePerformance',
    path: '/advisory/finance-performance',
    image: '/images/advisory/finance.webp',
    imageAlt: 'Workspace with laptop, notebook and calculator, cash-flow steering',
    meta: {
      title: 'Finance and Performance: cash flow, profitability, turnaround | Aegryn',
      description: 'Thirteen-week cash flow, profitability by activity, financial plan and turnaround: Aegryn helps executives of SMEs and mid-sized companies decide and implement their financial decisions. Switzerland and Europe.',
      keywords: ['SME cash flow advisory', '13-week cash flow', 'profitability by activity', 'turnaround plan', 'interim CFO', 'finance advisory Switzerland'],
    },
    eyebrow: 'Finance and Performance',
    h1: 'See the cash before it runs out.',
    subtitle: 'Cash flow, profitability, costed plans, turnaround: financial decisions condition all the others. Aegryn steps in when a costed decision must be taken, then implements it with your finance team.',
    scope: [
      { label: 'The plan and its assumptions: Strategy', href: '/advisory/strategy' },
      { label: 'An interim CFO: Talent', href: '/talent' },
      { label: 'Sale or acquisition: M&A', href: '/advisory/ma' },
      { label: 'The operational levers (inventory, lead times, purchasing): Operations', href: '/advisory/operations-excellence' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '6,274', label: 'insolvency proceedings opened in Switzerland from January to end October 2025, around +40% year on year', source: 'Dun & Bradstreet, press release, 3 Nov. 2025 (via ATS)' },
        { value: '≈ 1 in 3', label: 'B2B invoices issued by Swiss suppliers are paid late, versus about one in four in Western Europe', source: 'Atradius, B2B Payment Practices Trends Switzerland, June 2026' },
        { value: '37%', label: 'of Swiss SMEs are entirely self-financed, down from 62% in 2016', source: 'SECO, survey of 2,712 SMEs (kmu.admin.ch)' },
      ],
      paragraphs: [
        'Part of the 2025 rise in proceedings stems from the revision of the Swiss DEBA, in force since 1 January 2025: public creditors, such as tax authorities and social insurers, must now go through bankruptcy. It mostly hits already weakened firms.',
        'The signal still holds: cash is tightening, customers pay later, and fewer SMEs can rely on their own funds alone.',
      ],
      change: 'The right question is not “are we profitable?” but “will we have cash in thirteen weeks, and who in the company knows that?”. A profitable company can run out of cash; a struggling one can recover if it acts early.',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'A view of your cash over thirteen weeks, updated weekly.',
        'Costed decisions your committee, your banker or a buyer can read without you.',
        'A named owner for each lever: customers, suppliers, costs, investments.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'We are growing, but cash is tightening.', decision: 'Fund growth through generated cash, customer terms, or otherwise.', deliverable: 'Thirteen-week cash plan, three scenarios, working-capital needs mapped.', format: 'A few weeks', cycles: ['croissance'] },
        { quote: 'Our customers pay late.', decision: 'Which payment terms, which reminders, which at-risk customers.', deliverable: 'Receivables review and a plan to shorten collection time.', format: 'Short engagement', cycles: ['croissance'] },
        { quote: 'The bank or an investor asks for a costed plan.', decision: 'Which assumptions to stand behind, which level of detail.', deliverable: 'A three-year financial model, consistent with the strategic plan, and a file ready for discussion.', format: 'One to two months', cycles: ['lancement'] },
        { quote: 'We do not know which activities make money.', decision: 'What to keep, fix or stop.', deliverable: 'Profitability by activity and by customer, monthly dashboard.', format: 'A few weeks', cycles: ['restructuration'] },
        { quote: 'The situation is deteriorating: we must act before being forced to.', decision: 'Recover, restructure or sell, and when to inform creditors.', deliverable: 'A costed turnaround plan and timetable, with a partner lawyer for debt collection and bankruptcy law.', format: 'Three to six months', cycles: ['restructuration'] },
        { quote: 'We are preparing a sale or an acquisition.', decision: 'Which figures will be examined, and how to present them.', deliverable: 'Quality of earnings (adjustments, normalised working capital) and the financial part of the data room.', format: 'A few weeks', cycles: ['acquisition', 'transmission'] },
      ],
    },
    services: {
      title: 'What we do: deciding (Frame)',
      items: [
        'Assess the financial position: profitability, margins, cash conversion.',
        'Build the thirteen-week cash forecast and its scenarios.',
        'Model the three-year financial plan.',
        'Prepare the file for your lenders and investors.',
        'Assess quality of earnings ahead of a sale or an acquisition.',
        'Arbitrate the recovery plan: recover, restructure or sell.',
      ],
    },
    framework: {
      name: 'The Thirteen-Week Liquidity Review',
      intro: 'A two-page document, updated every week.',
      axes: [
        { label: 'Receipts', desc: 'Customer by customer, by due date.' },
        { label: 'Payments', desc: 'Mandatory payments, and those that can be deferred.' },
        { label: 'Scenarios', desc: 'Three scenarios: expected, cautious, strained.' },
        { label: 'Alert thresholds', desc: 'Alert thresholds and decisions taken in advance, before they are needed.' },
      ],
      deliverable: 'One page the committee reads every week, with no annex.',
    },
    perspectives: { title: 'Going further', items: [] },
    cta: { metier: 'finance' },
  },

  de: {
    key: 'financePerformance',
    path: '/advisory/finance-performance',
    image: '/images/advisory/finance.webp',
    imageAlt: 'Arbeitsplatz mit Laptop, Notizbuch und Taschenrechner, Liquiditätssteuerung',
    meta: {
      title: 'Finanzen und Performance: Liquidität, Rentabilität, Sanierung | Aegryn',
      description: 'Liquidität über dreizehn Wochen, Rentabilität je Tätigkeit, Finanzplan und Sanierung: Aegryn unterstützt die Führung von KMU und ETI beim Entscheiden und Umsetzen finanzieller Entscheidungen. Schweiz und Europa.',
      keywords: ['Liquiditätsberatung KMU', 'Liquidität 13 Wochen', 'Rentabilität je Tätigkeit', 'Sanierungsplan', 'Interim-CFO', 'Finanzberatung Schweiz'],
    },
    eyebrow: 'Finanzen und Performance',
    h1: 'Die Liquidität sehen, bevor sie fehlt.',
    subtitle: 'Liquidität, Rentabilität, bezifferter Plan, Sanierung: Finanzielle Entscheidungen bedingen alle anderen. Aegryn tritt ein, wenn eine bezifferte Entscheidung ansteht, und setzt sie mit Ihrer Finanzleitung um.',
    scope: [
      { label: 'Der Plan und seine Annahmen: Strategie', href: '/advisory/strategy' },
      { label: 'Ein Interim-CFO: Auswahl', href: '/talent' },
      { label: 'Verkauf oder Akquisition: M&A', href: '/advisory/ma' },
      { label: 'Die operativen Hebel (Lager, Fristen, Einkauf): Operations', href: '/advisory/operations-excellence' },
    ],
    observation: {
      title: 'Was wir feststellen',
      cards: [
        { value: '6 274', label: 'Insolvenzverfahren wurden in der Schweiz von Januar bis Ende Oktober 2025 eröffnet, rund +40 % gegenüber dem Vorjahr', source: 'Dun & Bradstreet, Mitteilung vom 3. Nov. 2025 (via ATS)' },
        { value: '≈ 1 von 3', label: 'B2B-Rechnungen Schweizer Lieferanten werden zu spät bezahlt, gegenüber etwa jeder vierten in Westeuropa', source: 'Atradius, B2B-Zahlungspraktiken Schweiz, Juni 2026' },
        { value: '37 %', label: 'der Schweizer KMU finanzieren sich vollständig selbst, gegenüber 62 % im Jahr 2016', source: 'SECO, Befragung von 2 712 KMU (kmu.admin.ch)' },
      ],
      paragraphs: [
        'Der Anstieg der Verfahren 2025 hängt teils mit der Revision des SchKG vom 1. Januar 2025 zusammen: Öffentliche Gläubiger wie Steuerbehörden oder Sozialversicherungen müssen nun den Konkursweg beschreiten. Betroffen sind vor allem bereits geschwächte Unternehmen.',
        'Das Signal bleibt aufschlussreich: Die Liquidität spannt sich, Kunden zahlen später, und immer weniger KMU können sich allein auf ihre Eigenmittel stützen.',
      ],
      change: 'Die richtige Frage lautet nicht «sind wir profitabel?», sondern «werden wir in dreizehn Wochen Liquidität haben, und wer weiss das im Unternehmen?». Ein profitables Unternehmen kann die Liquidität verlieren; ein Unternehmen in Schwierigkeiten kann sich fangen, wenn es früh handelt.',
    },
    outcomes: {
      title: 'Was Sie erhalten',
      items: [
        'Eine Sicht auf Ihre Liquidität über dreizehn Wochen, wöchentlich aktualisiert.',
        'Bezifferte Entscheidungen, die Ihr Gremium, Ihre Bank oder ein Erwerber ohne Sie lesen kann.',
        'Eine benannte Verantwortung für jeden Hebel: Kunden, Lieferanten, Kosten, Investitionen.',
      ],
    },
    situations: {
      title: 'Wo Sie stehen. Wie wir eingreifen.',
      items: [
        { quote: 'Wir wachsen, aber die Liquidität spannt sich.', decision: 'Das Wachstum über den erwirtschafteten Cashflow, Kundenfristen oder anders finanzieren.', deliverable: 'Liquiditätsplan über dreizehn Wochen, drei Szenarien, kartierter Working-Capital-Bedarf.', format: 'Wenige Wochen', cycles: ['croissance'] },
        { quote: 'Unsere Kunden zahlen zu spät.', decision: 'Welche Zahlungsbedingungen, welche Mahnungen, welche Risikokunden.', deliverable: 'Forderungsprüfung und Plan zur Senkung der Inkassofrist.', format: 'Kurzer Einsatz', cycles: ['croissance'] },
        { quote: 'Die Bank oder ein Investor verlangt einen bezifferten Plan.', decision: 'Welche Annahmen vertreten, welcher Detaillierungsgrad.', deliverable: 'Ein Finanzmodell auf drei Jahre, konsistent mit dem Strategieplan, und ein gesprächsbereites Dossier.', format: 'Ein bis zwei Monate', cycles: ['lancement'] },
        { quote: 'Wir wissen nicht, welche Tätigkeiten Geld verdienen.', decision: 'Was behalten, anheben oder einstellen.', deliverable: 'Rentabilität je Tätigkeit und Kunde, monatliches Dashboard.', format: 'Wenige Wochen', cycles: ['restructuration'] },
        { quote: 'Die Lage verschlechtert sich: Handeln, bevor wir dazu gezwungen sind.', decision: 'Sanieren, umstrukturieren oder verkaufen, und wann die Gläubiger informiert werden.', deliverable: 'Bezifferter Sanierungsplan mit Zeitplan, mit einer Partneranwältin oder einem Partneranwalt für Betreibungs- und Konkursrecht.', format: 'Drei bis sechs Monate', cycles: ['restructuration'] },
        { quote: 'Wir bereiten einen Verkauf oder eine Akquisition vor.', decision: 'Welche Zahlen geprüft werden und wie sie darzustellen sind.', deliverable: 'Qualität der Ergebnisse (Bereinigungen, normalisiertes Umlaufvermögen) und der Finanzteil des Datenraums.', format: 'Wenige Wochen', cycles: ['acquisition', 'transmission'] },
      ],
    },
    services: {
      title: 'Unsere Leistungen: entscheiden (Rahmen setzen)',
      items: [
        'Die finanzielle Lage prüfen: Rentabilität, Margen, Umwandlung in Cash.',
        'Die Liquidität über dreizehn Wochen und ihre Szenarien erstellen.',
        'Den Finanzplan auf drei Jahre modellieren.',
        'Das Dossier für Ihre Geldgeber und Investoren vorbereiten.',
        'Die Qualität der Ergebnisse vor einem Verkauf oder einer Akquisition bewerten.',
        'Den Sanierungsplan vermitteln: sanieren, umstrukturieren oder verkaufen.',
      ],
    },
    framework: {
      name: 'Die Liquiditätsprüfung über dreizehn Wochen',
      intro: 'Ein zweiseitiges Dokument, das jede Woche aktualisiert wird.',
      axes: [
        { label: 'Einnahmen', desc: 'Kunde für Kunde, nach Fälligkeit.' },
        { label: 'Ausgaben', desc: 'Die zwingenden Ausgaben und jene, die sich verschieben lassen.' },
        { label: 'Szenarien', desc: 'Drei Szenarien: erwartet, vorsichtig, angespannt.' },
        { label: 'Alarmschwellen', desc: 'Alarmschwellen und im Voraus gefasste Beschlüsse, bevor sie gebraucht werden.' },
      ],
      deliverable: 'Eine Seite, die das Gremium jede Woche liest, ohne Anhang.',
    },
    perspectives: { title: 'Um weiterzugehen', items: [] },
    cta: { metier: 'finance' },
  },

  es: {
    key: 'financePerformance',
    path: '/advisory/finance-performance',
    image: '/images/advisory/finance.webp',
    imageAlt: 'Escritorio con portátil, libreta y calculadora, control de tesorería',
    meta: {
      title: 'Finanzas y Rendimiento: tesorería, rentabilidad, reflotamiento | Aegryn',
      description: 'Tesorería a trece semanas, rentabilidad por actividad, plan financiero y reflotamiento: Aegryn ayuda a los dirigentes de pymes y ETI a decidir y ejecutar sus decisiones financieras. Suiza y Europa.',
      keywords: ['asesoría tesorería pyme', 'tesorería 13 semanas', 'rentabilidad por actividad', 'plan de reflotamiento', 'CFO interino', 'asesoría financiera Suiza'],
    },
    eyebrow: 'Finanzas y Rendimiento',
    h1: 'Ver la caja antes de que falte.',
    subtitle: 'Tesorería, rentabilidad, plan cifrado, reflotamiento: las decisiones financieras condicionan todas las demás. Aegryn interviene cuando hay que tomar una decisión cifrada y luego la pone en práctica con su dirección financiera.',
    scope: [
      { label: 'El plan y sus hipótesis: Estrategia', href: '/advisory/strategy' },
      { label: 'Un director financiero interino: Selección', href: '/talent' },
      { label: 'Venta o adquisición: M&A', href: '/advisory/ma' },
      { label: 'Las palancas operativas (inventarios, plazos, compras): Operaciones', href: '/advisory/operations-excellence' },
    ],
    observation: {
      title: 'Lo que constatamos',
      cards: [
        { value: '6 274', label: 'procedimientos de insolvencia abiertos en Suiza de enero a finales de octubre de 2025, alrededor de un +40 % interanual', source: 'Dun & Bradstreet, comunicado del 3 de nov. de 2025 (vía ATS)' },
        { value: '≈ 1 de cada 3', label: 'facturas B2B emitidas por proveedores suizos se pagan con retraso, frente a aproximadamente una de cada cuatro en Europa Occidental', source: 'Atradius, Tendencias de las prácticas de pago B2B Suiza, junio de 2026' },
        { value: '37 %', label: 'de las pymes suizas se financian íntegramente con fondos propios, frente al 62 % en 2016', source: 'SECO, encuesta a 2 712 pymes (kmu.admin.ch)' },
      ],
      paragraphs: [
        'El aumento de los procedimientos en 2025 se debe en parte a la revisión de la ley suiza sobre persecución de deudas y quiebra (LEF), en vigor desde el 1 de enero de 2025: los acreedores públicos, como Hacienda o las aseguradoras sociales, deben ahora pasar por la quiebra. Afecta sobre todo a empresas ya debilitadas.',
        'La señal sigue siendo útil: la liquidez se estrecha, los clientes pagan más tarde, y menos pymes pueden apoyarse solo en sus fondos propios.',
      ],
      change: 'La pregunta correcta no es «¿tenemos resultados?», sino «¿tendremos caja dentro de trece semanas, y quién lo sabe en la empresa?». Una empresa rentable puede quedarse sin tesorería; una empresa en dificultades puede remontar si actúa pronto.',
    },
    outcomes: {
      title: 'Lo que usted obtiene',
      items: [
        'Una visión de su tesorería a trece semanas, actualizada cada semana.',
        'Decisiones cifradas que su comité, su banquero o un comprador pueden leer sin usted.',
        'Un responsable nombrado para cada palanca: clientes, proveedores, costes, inversiones.',
      ],
    },
    situations: {
      title: 'Dónde está usted. Cómo intervenimos.',
      items: [
        { quote: 'Crecemos, pero la tesorería se tensa.', decision: 'Financiar el crecimiento con la caja generada, los plazos de clientes u otros medios.', deliverable: 'Plan de tesorería a 13 semanas, tres escenarios, necesidad de fondo de maniobra cartografiada.', format: 'Algunas semanas', cycles: ['croissance'] },
        { quote: 'Nuestros clientes pagan tarde.', decision: 'Qué condiciones de pago, qué reclamaciones, qué clientes de riesgo.', deliverable: 'Diagnóstico del cliente y plan para reducir el plazo de cobro.', format: 'Misión corta', cycles: ['croissance'] },
        { quote: 'El banco o un inversor pide un plan cifrado.', decision: 'Qué hipótesis asumir, qué nivel de detalle.', deliverable: 'Un modelo financiero a tres años, coherente con el plan estratégico, y un expediente listo para el diálogo.', format: 'Uno a dos meses', cycles: ['lancement'] },
        { quote: 'No sabemos qué actividades ganan dinero.', decision: 'Qué conservar, subir o abandonar.', deliverable: 'Rentabilidad por actividad y por cliente, cuadro de mando mensual.', format: 'Algunas semanas', cycles: ['restructuration'] },
        { quote: 'La situación se degrada: hay que actuar antes de verse obligado.', decision: 'Reflotar, reestructurar o vender, y cuándo informar a los acreedores.', deliverable: 'Plan de reflotamiento cifrado con calendario, con un abogado asociado para el derecho de apremio y quiebra.', format: 'Tres a seis meses', cycles: ['restructuration'] },
        { quote: 'Preparamos una venta o una adquisición.', decision: 'Qué cifras se examinarán y cómo presentarlas.', deliverable: 'Calidad de los resultados (ajustes, capital circulante normalizado) y la parte financiera del data room.', format: 'Algunas semanas', cycles: ['acquisition', 'transmission'] },
      ],
    },
    services: {
      title: 'Nuestros servicios: decidir (Encuadrar)',
      items: [
        'Diagnosticar la situación financiera: rentabilidad, márgenes, conversión en caja.',
        'Establecer la tesorería a trece semanas y sus escenarios.',
        'Modelar el plan financiero a tres años.',
        'Preparar el expediente para sus financiadores e inversores.',
        'Evaluar la calidad de los resultados antes de una venta o una adquisición.',
        'Arbitrar el plan de reflotamiento: reflotar, reestructurar o vender.',
      ],
    },
    framework: {
      name: 'La Revisión de liquidez a trece semanas',
      intro: 'Un documento de dos páginas, actualizado cada semana.',
      axes: [
        { label: 'Cobros', desc: 'Cliente por cliente, por vencimiento.' },
        { label: 'Pagos', desc: 'Los pagos obligatorios y los que se pueden diferir.' },
        { label: 'Escenarios', desc: 'Tres escenarios: esperado, prudente, tenso.' },
        { label: 'Umbrales de alerta', desc: 'Umbrales de alerta y decisiones tomadas por adelantado, antes de necesitarlas.' },
      ],
      deliverable: 'Una página que el comité lee cada semana, sin anexos.',
    },
    perspectives: { title: 'Para ir más lejos', items: [] },
    cta: { metier: 'finance' },
  },

  it: {
    key: 'financePerformance',
    path: '/advisory/finance-performance',
    image: '/images/advisory/finance.webp',
    imageAlt: 'Scrivania con portatile, quaderno e calcolatrice, gestione della tesoreria',
    meta: {
      title: 'Finanza e Performance: tesoreria, redditività, risanamento | Aegryn',
      description: 'Tesoreria a tredici settimane, redditività per attività, piano finanziario e risanamento: Aegryn aiuta i dirigenti di PMI e ETI a decidere e attuare le decisioni finanziarie. Svizzera ed Europa.',
      keywords: ['consulenza tesoreria PMI', 'tesoreria 13 settimane', 'redditività per attività', 'piano di risanamento', 'CFO ad interim', 'consulenza finanziaria Svizzera'],
    },
    eyebrow: 'Finanza e Performance',
    h1: 'Vedere la cassa prima che manchi.',
    subtitle: 'Tesoreria, redditività, piano numerico, risanamento: le decisioni finanziarie condizionano tutte le altre. Aegryn interviene quando occorre prendere una decisione numerica, poi la attua con la vostra direzione finanziaria.',
    scope: [
      { label: 'Il piano e le sue ipotesi: Strategia', href: '/advisory/strategy' },
      { label: 'Un direttore finanziario ad interim: Selezione', href: '/talent' },
      { label: 'Vendita o acquisizione: M&A', href: '/advisory/ma' },
      { label: 'Le leve operative (scorte, tempi, acquisti): Operazioni', href: '/advisory/operations-excellence' },
    ],
    observation: {
      title: 'Cosa constatiamo',
      cards: [
        { value: '6 274', label: 'procedure di insolvenza aperte in Svizzera da gennaio a fine ottobre 2025, circa +40 % su un anno', source: 'Dun & Bradstreet, comunicato del 3 nov. 2025 (via ATS)' },
        { value: '≈ 1 su 3', label: 'fatture B2B emesse da fornitori svizzeri sono pagate in ritardo, contro circa una su quattro in Europa occidentale', source: 'Atradius, Tendenze delle pratiche di pagamento B2B Svizzera, giugno 2026' },
        { value: '37 %', label: 'delle PMI svizzere sono interamente autofinanziate, contro il 62 % del 2016', source: 'SECO, indagine su 2 712 PMI (kmu.admin.ch)' },
      ],
      paragraphs: [
        'L’aumento delle procedure nel 2025 dipende in parte dalla revisione della legge svizzera sull’esecuzione e il fallimento (LEF), in vigore dal 1° gennaio 2025: i creditori pubblici, come il fisco o le assicurazioni sociali, devono ora passare dal fallimento. Colpisce soprattutto imprese già fragili.',
        'Il segnale resta utile: la liquidità si stringe, i clienti pagano più tardi, e meno PMI possono contare sui soli mezzi propri.',
      ],
      change: 'La domanda giusta non è «abbiamo un risultato?», ma «avremo cassa fra tredici settimane, e chi lo sa in azienda?». Un’impresa redditizia può restare senza liquidità; un’impresa in difficoltà può risalire se agisce presto.',
    },
    outcomes: {
      title: 'Cosa ottenete',
      items: [
        'Una visione della vostra tesoreria a tredici settimane, aggiornata ogni settimana.',
        'Decisioni numeriche che il vostro comitato, il vostro banchiere o un acquirente possono leggere senza di voi.',
        'Un responsabile nominato per ogni leva: clienti, fornitori, costi, investimenti.',
      ],
    },
    situations: {
      title: 'Dove siete. Come interveniamo.',
      items: [
        { quote: 'Cresciamo, ma la tesoreria si tende.', decision: 'Finanziare la crescita con la cassa generata, i termini clienti o altro.', deliverable: 'Piano di tesoreria a 13 settimane, tre scenari, fabbisogno di capitale circolante mappato.', format: 'Alcune settimane', cycles: ['croissance'] },
        { quote: 'I nostri clienti pagano in ritardo.', decision: 'Quali condizioni di pagamento, quali solleciti, quali clienti a rischio.', deliverable: 'Diagnosi del credito clienti e piano per ridurre i tempi di incasso.', format: 'Mandato breve', cycles: ['croissance'] },
        { quote: 'La banca o un investitore chiede un piano numerico.', decision: 'Quali ipotesi assumere, quale livello di dettaglio.', deliverable: 'Un modello finanziario a tre anni, coerente con il piano strategico, e un dossier pronto per lo scambio.', format: 'Uno a due mesi', cycles: ['lancement'] },
        { quote: 'Non sappiamo quali attività guadagnino.', decision: 'Cosa tenere, alzare o fermare.', deliverable: 'Redditività per attività e per cliente, cruscotto mensile.', format: 'Alcune settimane', cycles: ['restructuration'] },
        { quote: 'La situazione peggiora: bisogna agire prima di esservi obbligati.', decision: 'Risanare, ristrutturare o cedere, e quando informare i creditori.', deliverable: 'Piano di risanamento numerico con calendario, con un avvocato partner per il diritto dell’esecuzione e dei fallimenti.', format: 'Tre a sei mesi', cycles: ['restructuration'] },
        { quote: 'Prepariamo una vendita o un’acquisizione.', decision: 'Quali cifre saranno esaminate e come presentarle.', deliverable: 'Qualità dei risultati (rettifiche, capitale circolante normalizzato) e parte finanziaria della data room.', format: 'Alcune settimane', cycles: ['acquisition', 'transmission'] },
      ],
    },
    services: {
      title: 'I nostri servizi: decidere (Inquadrare)',
      items: [
        'Diagnosticare la situazione finanziaria: redditività, margini, conversione in cassa.',
        'Stabilire la tesoreria a tredici settimane e i suoi scenari.',
        'Modellare il piano finanziario a tre anni.',
        'Preparare il dossier per i vostri finanziatori e investitori.',
        'Valutare la qualità dei risultati prima di una vendita o un’acquisizione.',
        'Arbitrare il piano di risanamento: risanare, ristrutturare o cedere.',
      ],
    },
    framework: {
      name: 'La Revisione di liquidità a tredici settimane',
      intro: 'Un documento di due pagine, aggiornato ogni settimana.',
      axes: [
        { label: 'Incassi', desc: 'Cliente per cliente, per scadenza.' },
        { label: 'Uscite', desc: 'Le uscite obbligatorie e quelle che si possono differire.' },
        { label: 'Scenari', desc: 'Tre scenari: atteso, prudente, teso.' },
        { label: 'Soglie di allerta', desc: 'Soglie di allerta e decisioni prese in anticipo, prima di averne bisogno.' },
      ],
      deliverable: 'Una pagina che il comitato legge ogni settimana, senza allegati.',
    },
    perspectives: { title: 'Per andare oltre', items: [] },
    cta: { metier: 'finance' },
  },

  nl: {
    key: 'financePerformance',
    path: '/advisory/finance-performance',
    image: '/images/advisory/finance.webp',
    imageAlt: 'Werkplek met laptop, notitieboek en rekenmachine, liquiditeitssturing',
    meta: {
      title: 'Financiën en Prestaties: kasstroom, rendabiliteit, sanering | Aegryn',
      description: 'Liquiditeit over dertien weken, rendabiliteit per activiteit, financieel plan en sanering: Aegryn helpt leidinggevenden van mkb en middelgrote bedrijven financiële beslissingen te nemen en uit te voeren. Zwitserland en Europa.',
      keywords: ['mkb liquiditeitsadvies', 'kasstroom 13 weken', 'rendabiliteit per activiteit', 'saneringsplan', 'interim CFO', 'financieel advies Zwitserland'],
    },
    eyebrow: 'Financiën en Prestaties',
    h1: 'Zie de kas voordat hij oprraakt.',
    subtitle: 'Liquiditeit, rendabiliteit, becijferd plan, sanering: financiële beslissingen bepalen alle andere. Aegryn treedt op als een becijferd besluit genomen moet worden, en voert het uit met uw financiële directie.',
    scope: [
      { label: 'Het plan en zijn veronderstellingen: Strategie', href: '/advisory/strategy' },
      { label: 'Een interim-CFO: Selectie', href: '/talent' },
      { label: 'Verkoop of overname: M&A', href: '/advisory/ma' },
      { label: 'De operationele hefbomen (voorraad, doorlooptijden, inkoop): Operations', href: '/advisory/operations-excellence' },
    ],
    observation: {
      title: 'Wat wij vaststellen',
      cards: [
        { value: '6 274', label: 'insolventieprocedures werden in Zwitserland geopend van januari tot eind oktober 2025, circa +40 % op jaarbasis', source: 'Dun & Bradstreet, persbericht van 3 nov. 2025 (via ATS)' },
        { value: '≈ 1 op 3', label: 'B2B-facturen van Zwitserse leveranciers worden te laat betaald, tegenover ongeveer één op vier in West-Europa', source: 'Atradius, B2B-betalingspraktijken Zwitserland, juni 2026' },
        { value: '37 %', label: 'van de Zwitserse mkb’s financiert zich volledig zelf, tegenover 62 % in 2016', source: 'SECO, enquête onder 2 712 mkb’s (kmu.admin.ch)' },
      ],
      paragraphs: [
        'De toename van de procedures in 2025 hangt deels samen met de herziening van de Zwitserse wet op schuldeninvordering en faillissement (SchKG), van kracht sinds 1 januari 2025: openbare schuldeisers, zoals de fiscus of sociale verzekeringen, moeten nu via het faillissement gaan. Het treft vooral al verzwakte bedrijven.',
        'Het signaal blijft bruikbaar: de liquide middelen nemen af, klanten betalen later, en steeds minder mkb’s kunnen op eigen middelen terugvallen.',
      ],
      change: 'De juiste vraag is niet «maken we winst?», maar «hebben we over dertien weken nog liquide middelen, en wie weet dat in het bedrijf?». Een winstgevend bedrijf kan zonder kasgeld komen; een bedrijf in moeilijkheden kan herstellen als het vroeg handelt.',
    },
    outcomes: {
      title: 'Wat u krijgt',
      items: [
        'Een zicht op uw liquide middelen over dertien weken, wekelijks bijgewerkt.',
        'Becijferde beslissingen die uw comité, uw bankier of een koper zonder u kan lezen.',
        'Een benoemde verantwoordelijke voor elke hefboom: klanten, leveranciers, kosten, investeringen.',
      ],
    },
    situations: {
      title: 'Waar u staat. Hoe wij ingrijpen.',
      items: [
        { quote: 'We groeien, maar de kas staat onder druk.', decision: 'De groei financieren via de gegenereerde kasstroom, klanttermijnen of anders.', deliverable: 'Liquiditeitsplan over dertien weken, drie scenario’s, werkkapitaalbehoefte in kaart.', format: 'Enkele weken', cycles: ['croissance'] },
        { quote: 'Onze klanten betalen te laat.', decision: 'Welke betalingsvoorwaarden, welke herinneringen, welke risicoklanten.', deliverable: 'Debiteurenanalyse en plan om de incassotermijn te verkorten.', format: 'Korte opdracht', cycles: ['croissance'] },
        { quote: 'De bank of een investeerder vraagt om een becijferd plan.', decision: 'Welke veronderstellingen aannemen, welk detailniveau.', deliverable: 'Een financieel model over drie jaar, consistent met het strategisch plan, en een gespreksklaar dossier.', format: 'Eén tot twee maanden', cycles: ['lancement'] },
        { quote: 'We weten niet welke activiteiten geld verdienen.', decision: 'Wat houden, verhogen of stopzetten.', deliverable: 'Rendabiliteit per activiteit en per klant, maandelijks dashboard.', format: 'Enkele weken', cycles: ['restructuration'] },
        { quote: 'De situatie verslechtert: handelen voordat we gedwongen worden.', decision: 'Saneren, herstructureren of verkopen, en wanneer de schuldeisers informeren.', deliverable: 'Becijferd saneringsplan met tijdschema, met een partneradvocaat voor invorderings- en faillissementsrecht.', format: 'Drie tot zes maanden', cycles: ['restructuration'] },
        { quote: 'We bereiden een verkoop of overname voor.', decision: 'Welke cijfers bekeken zullen worden en hoe ze te presenteren.', deliverable: 'Kwaliteit van de resultaten (aanpassingen, genormaliseerd werkkapitaal) en het financiële deel van de dataroom.', format: 'Enkele weken', cycles: ['acquisition', 'transmission'] },
      ],
    },
    services: {
      title: 'Onze diensten: beslissen (Kaderen)',
      items: [
        'De financiële situatie diagnosticeren: rendabiliteit, marges, omzetting in kas.',
        'De kasstroom over dertien weken en zijn scenario’s opstellen.',
        'Het financiële plan over drie jaar modelleren.',
        'Het dossier voor uw financiers en investeerders voorbereiden.',
        'De kwaliteit van de resultaten beoordelen vóór een verkoop of overname.',
        'Het saneringsplan bemiddelen: saneren, herstructureren of verkopen.',
      ],
    },
    framework: {
      name: 'De Liquiditeitsbeoordeling over dertien weken',
      intro: 'Een document van twee pagina’s, wekelijks bijgewerkt.',
      axes: [
        { label: 'Ontvangsten', desc: 'Klant per klant, per vervaldatum.' },
        { label: 'Uitgaven', desc: 'De verplichte uitgaven en degene die uitgesteld kunnen worden.' },
        { label: 'Scenario’s', desc: 'Drie scenario’s: verwacht, voorzichtig, gespannen.' },
        { label: 'Alarmeringsdrempels', desc: 'Alarmeringsdrempels en vooraf genomen beslissingen, voordat ze nodig zijn.' },
      ],
      deliverable: 'Eén pagina die het comité elke week leest, zonder bijlage.',
    },
    perspectives: { title: 'Om verder te gaan', items: [] },
    cta: { metier: 'finance' },
  },
}
