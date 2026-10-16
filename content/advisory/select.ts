/**
 * Bloc « Sélectionner » de la page Talent et Organisation (/advisory/talent-organization#selectionner).
 * Les libellés du menu (titre, accroche, liens) viennent de nav.craftRecruit* ; ce fichier porte le reste.
 * Le bloc remplace la colonne Sélectionner du menu Nos métiers.
 */
import type { Lang } from './implement'

export interface SelectCopy {
  hire: string
  trans: string
  cyc_title: string
  h_cycle: string
  h_profile: string
  rows: string[]
  method_title: string
  steps: string[]
  indep_label: string
  indep: string
  button: string
}

export const SELECT_COPY: Record<Lang, SelectCopy> = {
  fr: {
    hire: 'un dirigeant ou un expert dont l’entreprise a besoin durablement. Nous cadrons le besoin avec vous, puis nous présentons des profils sélectionnés.',
    trans: 'un directeur financier, des opérations ou de projet, pour une durée définie. Il arrive vite et prépare sa succession.',
    cyc_title: 'À chaque cycle', h_cycle: 'Cycle', h_profile: 'Profil sollicité',
    rows: ['Associé fondateur, responsable produit ou technique', 'Directeur commercial, financier ou des opérations', 'Profil de transition : finance, opérations, redressement', 'Responsable de l’intégration, directeur de site', 'Successeur désigné, direction générale de transition'],
    method_title: 'Méthode en quatre temps', steps: ['Cadrer le besoin', 'Cartographier le marché', 'Sélectionner', 'Intégrer'],
    indep_label: 'Principe d’indépendance.', indep: 'Notre conseil en organisation ne dépend pas d’une mission de sélection, et inversement.',
    button: 'Décrire le profil recherché',
  },
  en: {
    hire: 'an executive or an expert the company needs on a lasting basis. We frame the need with you, then present selected profiles.',
    trans: 'a finance, operations or project director, for a defined period. They arrive quickly and prepare their succession.',
    cyc_title: 'At every stage', h_cycle: 'Stage', h_profile: 'Profile sought',
    rows: ['Founding partner, product or technical lead', 'Sales, finance or operations director', 'Transition profile: finance, operations, turnaround', 'Integration lead, site director', 'Designated successor, interim general management'],
    method_title: 'Method in four steps', steps: ['Frame the need', 'Map the market', 'Select', 'Integrate'],
    indep_label: 'Independence principle.', indep: 'Our organisational advice does not depend on a selection assignment, and vice versa.',
    button: 'Describe the profile you need',
  },
  de: {
    hire: 'eine Führungskraft oder ein Experte, den das Unternehmen dauerhaft braucht. Wir klären den Bedarf mit Ihnen und stellen dann ausgewählte Profile vor.',
    trans: 'eine Finanz-, Betriebs- oder Projektleitung für eine festgelegte Dauer. Sie kommt schnell und bereitet ihre Nachfolge vor.',
    cyc_title: 'In jeder Phase', h_cycle: 'Phase', h_profile: 'Gefragtes Profil',
    rows: ['Gründungspartner, Produkt- oder Technikverantwortlicher', 'Vertriebs-, Finanz- oder Betriebsleiter', 'Übergangsprofil: Finanzen, Betrieb, Sanierung', 'Integrationsverantwortlicher, Standortleiter', 'Designierter Nachfolger, Übergangs-Geschäftsleitung'],
    method_title: 'Methode in vier Schritten', steps: ['Bedarf klären', 'Markt kartieren', 'Auswählen', 'Integrieren'],
    indep_label: 'Unabhängigkeitsprinzip.', indep: 'Unsere Organisationsberatung hängt nicht von einem Auswahlmandat ab, und umgekehrt.',
    button: 'Gesuchtes Profil beschreiben',
  },
  es: {
    hire: 'un directivo o un experto que la empresa necesita de forma duradera. Definimos la necesidad con usted y presentamos después perfiles seleccionados.',
    trans: 'un director financiero, de operaciones o de proyecto, por una duración definida. Llega rápido y prepara su sucesión.',
    cyc_title: 'En cada fase', h_cycle: 'Fase', h_profile: 'Perfil solicitado',
    rows: ['Socio fundador, responsable de producto o técnico', 'Director comercial, financiero o de operaciones', 'Perfil de transición: finanzas, operaciones, reflotamiento', 'Responsable de integración, director de planta', 'Sucesor designado, dirección general de transición'],
    method_title: 'Método en cuatro tiempos', steps: ['Definir la necesidad', 'Cartografiar el mercado', 'Seleccionar', 'Integrar'],
    indep_label: 'Principio de independencia.', indep: 'Nuestro asesoramiento en organización no depende de un encargo de selección, y viceversa.',
    button: 'Describir el perfil buscado',
  },
  it: {
    hire: 'un dirigente o un esperto di cui l’azienda ha bisogno in modo duraturo. Definiamo l’esigenza con voi, poi presentiamo profili selezionati.',
    trans: 'un direttore finanziario, delle operazioni o di progetto, per una durata definita. Arriva rapidamente e prepara la propria successione.',
    cyc_title: 'In ogni fase', h_cycle: 'Fase', h_profile: 'Profilo richiesto',
    rows: ['Socio fondatore, responsabile prodotto o tecnico', 'Direttore commerciale, finanziario o delle operazioni', 'Profilo di transizione: finanza, operazioni, risanamento', 'Responsabile dell’integrazione, direttore di sito', 'Successore designato, direzione generale di transizione'],
    method_title: 'Metodo in quattro tempi', steps: ['Definire l’esigenza', 'Mappare il mercato', 'Selezionare', 'Integrare'],
    indep_label: 'Principio di indipendenza.', indep: 'La nostra consulenza organizzativa non dipende da un incarico di selezione, e viceversa.',
    button: 'Descrivere il profilo cercato',
  },
  nl: {
    hire: 'een leidinggevende of een expert die het bedrijf duurzaam nodig heeft. Wij kaderen de behoefte met u en presenteren daarna geselecteerde profielen.',
    trans: 'een financieel directeur, operations- of projectdirecteur, voor een bepaalde duur. Hij of zij komt snel en bereidt de eigen opvolging voor.',
    cyc_title: 'In elke fase', h_cycle: 'Fase', h_profile: 'Gevraagd profiel',
    rows: ['Oprichtend partner, product- of technisch verantwoordelijke', 'Commercieel, financieel of operations-directeur', 'Overgangsprofiel: financiën, operations, sanering', 'Integratieverantwoordelijke, vestigingsdirecteur', 'Aangewezen opvolger, overgangsdirectie'],
    method_title: 'Methode in vier stappen', steps: ['De behoefte kaderen', 'De markt in kaart brengen', 'Selecteren', 'Integreren'],
    indep_label: 'Onafhankelijkheidsprincipe.', indep: 'Ons organisatieadvies hangt niet af van een selectieopdracht, en omgekeerd.',
    button: 'Het gezochte profiel beschrijven',
  },
}

export const SELECT_CYCLES = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const
