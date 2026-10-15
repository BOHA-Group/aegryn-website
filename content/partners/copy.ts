/** Page Partenaires (fusion des anciennes pages Alliances et Experts) : textes en 6 langues. Les douze activités viennent du formulaire de contact. */
import type { L6 } from '@/content/boutique/savoirFaire'
const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): L6 => ({ fr, en, de, es, it, nl })

export const PARTNERS = {
  metaTitle: L('Partenaires | Aegryn', 'Partners | Aegryn', 'Partner | Aegryn', 'Socios | Aegryn', 'Partner | Aegryn', 'Partners | Aegryn'),
  metaDesc: L(
    'Un réseau de partenaires choisis un par un, dans douze activités : juridique, finance, stratégie, ingénierie, design, technologie, fabrication, distribution. Rejoignez Aegryn sur un projet précis.',
    'A network of partners chosen one by one, across twelve fields of activity: legal, finance, strategy, engineering, design, technology, manufacturing, distribution. Join Aegryn on a specific project.',
    'Ein Netzwerk einzeln ausgewählter Partner in zwölf Tätigkeitsfeldern: Recht, Finanzen, Strategie, Ingenieurwesen, Design, Technologie, Fertigung, Vertrieb. Arbeiten Sie mit Aegryn an einem konkreten Projekt.',
    'Una red de socios elegidos uno a uno, en doce actividades: jurídico, finanzas, estrategia, ingeniería, diseño, tecnología, fabricación, distribución. Únase a Aegryn en un proyecto concreto.',
    'Una rete di partner scelti uno a uno, in dodici attività: legale, finanza, strategia, ingegneria, design, tecnologia, produzione, distribuzione. Unitevi ad Aegryn su un progetto preciso.',
    'Een netwerk van één voor één gekozen partners, in twaalf activiteiten: juridisch, financiën, strategie, engineering, design, technologie, productie, distributie. Sluit u aan bij Aegryn voor een concreet project.'),
  label: L('Partenaires', 'Partners', 'Partner', 'Socios', 'Partner', 'Partners'),
  title: L('Un réseau choisi,\nprojet par projet.', 'A chosen network,\nproject by project.', 'Ein ausgewähltes Netzwerk,\nProjekt für Projekt.', 'Una red elegida,\nproyecto a proyecto.', 'Una rete scelta,\nprogetto per progetto.', 'Een gekozen netwerk,\nproject per project.'),
  desc: L(
    'Aegryn réunit, pour chaque projet, des partenaires sélectionnés un par un. Douze activités couvrent ce qu’un projet exige, du cadre juridique à la distribution. Un nombre limité de partenaires par activité, une relation de confiance, sous accord de confidentialité.',
    'For each project, Aegryn brings together partners selected one by one. Twelve fields of activity cover what a project requires, from the legal framework to distribution. A limited number of partners per field, a relationship of trust, under a confidentiality agreement.',
    'Für jedes Projekt führt Aegryn einzeln ausgewählte Partner zusammen. Zwölf Tätigkeitsfelder decken ab, was ein Projekt verlangt, vom rechtlichen Rahmen bis zum Vertrieb. Eine begrenzte Zahl von Partnern pro Feld, eine Vertrauensbeziehung, unter Vertraulichkeitsvereinbarung.',
    'Para cada proyecto, Aegryn reúne a socios seleccionados uno a uno. Doce actividades cubren lo que exige un proyecto, del marco jurídico a la distribución. Un número limitado de socios por actividad, una relación de confianza, bajo acuerdo de confidencialidad.',
    'Per ogni progetto, Aegryn riunisce partner selezionati uno a uno. Dodici attività coprono ciò che un progetto richiede, dal quadro giuridico alla distribuzione. Un numero limitato di partner per attività, una relazione di fiducia, sotto accordo di riservatezza.',
    'Voor elk project brengt Aegryn één voor één geselecteerde partners samen. Twaalf activiteiten dekken wat een project vraagt, van het juridisch kader tot de distributie. Een beperkt aantal partners per activiteit, een vertrouwensrelatie, onder geheimhoudingsovereenkomst.'),
  cta: L('Rejoindre le réseau', 'Join the network', 'Dem Netzwerk beitreten', 'Unirse a la red', 'Entrare nella rete', 'Lid worden van het netwerk'),
  activitiesTitle: L('Les activités que nous mobilisons.', 'The fields of activity we call on.', 'Die Tätigkeitsfelder, die wir einbinden.', 'Las actividades que movilizamos.', 'Le attività che mobilitiamo.', 'De activiteiten die wij inschakelen.'),
  stepsTitle: L('Comment rejoindre le réseau.', 'How to join the network.', 'So werden Sie Teil des Netzwerks.', 'Cómo unirse a la red.', 'Come entrare nella rete.', 'Hoe sluit u zich aan.'),
  steps: [
    { title: L('Présentez votre activité', 'Present your activity', 'Stellen Sie Ihre Tätigkeit vor', 'Presente su actividad', 'Presentate la vostra attività', 'Presenteer uw activiteit'),
      desc: L('Un message, votre domaine, vos références. Réponse personnelle sous 2 jours ouvrés.', 'A message, your field, your references. Personal reply within 2 business days.', 'Eine Nachricht, Ihr Fachgebiet, Ihre Referenzen. Persönliche Antwort innerhalb von 2 Werktagen.', 'Un mensaje, su ámbito, sus referencias. Respuesta personal en 2 días hábiles.', 'Un messaggio, il vostro ambito, le vostre referenze. Risposta personale entro 2 giorni lavorativi.', 'Een bericht, uw vakgebied, uw referenties. Persoonlijk antwoord binnen 2 werkdagen.') },
    { title: L('Échangeons sous confidentialité', 'Let’s talk in confidence', 'Austausch unter Vertraulichkeit', 'Hablemos con confidencialidad', 'Confrontiamoci in riservatezza', 'Vertrouwelijk uitwisselen'),
      desc: L('Un accord de confidentialité précède tout échange détaillé.', 'A confidentiality agreement precedes any detailed exchange.', 'Eine Vertraulichkeitsvereinbarung geht jedem detaillierten Austausch voraus.', 'Un acuerdo de confidencialidad precede a cualquier intercambio detallado.', 'Un accordo di riservatezza precede ogni scambio dettagliato.', 'Een geheimhoudingsovereenkomst gaat elke gedetailleerde uitwisseling vooraf.') },
    { title: L('Intervenez sur un projet', 'Work on a project', 'Arbeiten Sie an einem Projekt', 'Intervenga en un proyecto', 'Intervenite su un progetto', 'Werk mee aan een project'),
      desc: L('Nous faisons appel à vous quand un projet le justifie, dans un cadre clair.', 'We call on you when a project justifies it, within a clear framework.', 'Wir ziehen Sie hinzu, wenn ein Projekt es rechtfertigt, in einem klaren Rahmen.', 'Recurrimos a usted cuando un proyecto lo justifica, en un marco claro.', 'Vi coinvolgiamo quando un progetto lo giustifica, in un quadro chiaro.', 'Wij doen een beroep op u wanneer een project dat rechtvaardigt, binnen een duidelijk kader.') },
  ],
}
