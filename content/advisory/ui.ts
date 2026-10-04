/** Libellés d'interface du gabarit ACCOMPAGNER (hors contenu éditorial). */
export interface AdvisoryUi {
  autoDiag:        string
  decision:        string
  deliverable:     string
  yes:             string
  no:              string
  yesCount:        (n: number, total: number) => string
  progress:        (n: number, total: number) => string
  nextAction:      string
  restart:         string
  question:        string
  change:          string
  ourFramework:    string
  sixSituations:   string
  notCovered:      string
  ctaEyebrow:      string
  ctaBody:         string
  newsletterLabel: string
  newsletterBody:  string
  article:         string
  magazine:        string
}

export const ADVISORY_UI: Record<string, AdvisoryUi> = {
  fr: {
    autoDiag: 'Auto-diagnostic', decision: 'Décision', deliverable: 'Livrable', yes: 'Oui', no: 'Non',
    yesCount: (n, t) => `${n} / ${t} oui`,
    progress: (n, t) => `${n} / ${t} réponses. Le résultat s’affiche une fois les cinq questions renseignées.`,
    nextAction: 'Prochaine action', restart: 'Recommencer', question: 'Question',
    change: 'Ce que cela change', ourFramework: 'Notre cadre', sixSituations: 'Six situations',
    notCovered: 'Ce que cette page ne couvre pas', ctaEyebrow: 'Échange de cadrage confidentiel',
    ctaBody: 'Trente minutes avec un expert du réseau, nommé et responsable de son périmètre. Pas d’engagement à ce stade ; les conditions sont transmises après cadrage.',
    newsletterLabel: 'Newsletter · Built to Last',
    newsletterBody: 'Analyses de marché, cycles de vie des organisations, retours d’expérience. Une lettre, pas de prospection.',
    article: 'Article', magazine: 'Magazine',
  },
  en: {
    autoDiag: 'Self-assessment', decision: 'Decision', deliverable: 'Deliverable', yes: 'Yes', no: 'No',
    yesCount: (n, t) => `${n} / ${t} yes`,
    progress: (n, t) => `${n} / ${t} answered. Your result appears once all five questions are completed.`,
    nextAction: 'Next step', restart: 'Start again', question: 'Question',
    change: 'What this changes', ourFramework: 'Our framework', sixSituations: 'Six situations',
    notCovered: 'What this page does not cover', ctaEyebrow: 'Confidential scoping call',
    ctaBody: 'Thirty minutes with a named expert from our network, accountable for their scope. No commitment at this stage; terms follow the scoping call.',
    newsletterLabel: 'Newsletter · Built to Last',
    newsletterBody: 'Market analysis, company lifecycles, lessons from the field. One letter, no prospecting.',
    article: 'Article', magazine: 'Magazine',
  },
  de: {
    autoDiag: 'Selbsteinschätzung', decision: 'Entscheidung', deliverable: 'Ergebnis', yes: 'Ja', no: 'Nein',
    yesCount: (n, t) => `${n} / ${t} Ja`,
    progress: (n, t) => `${n} / ${t} beantwortet. Das Ergebnis erscheint, sobald alle fünf Fragen beantwortet sind.`,
    nextAction: 'Nächster Schritt', restart: 'Neu beginnen', question: 'Frage',
    change: 'Was das ändert', ourFramework: 'Unser Rahmenwerk', sixSituations: 'Sechs Situationen',
    notCovered: 'Was diese Seite nicht abdeckt', ctaEyebrow: 'Vertrauliches Erstgespräch',
    ctaBody: 'Dreissig Minuten mit einem namentlich benannten Experten aus unserem Netzwerk, verantwortlich für seinen Bereich. Keine Verpflichtung in dieser Phase; die Konditionen folgen nach dem Erstgespräch.',
    newsletterLabel: 'Newsletter · Built to Last',
    newsletterBody: 'Marktanalysen, Lebenszyklen von Unternehmen, Erfahrungen aus der Praxis. Ein Brief, keine Akquise.',
    article: 'Artikel', magazine: 'Magazin',
  },
  it: {
    autoDiag: 'Autodiagnosi', decision: 'Decisione', deliverable: 'Risultato', yes: 'Sì', no: 'No',
    yesCount: (n, t) => `${n} / ${t} sì`,
    progress: (n, t) => `${n} / ${t} risposte. Il risultato appare una volta completate le cinque domande.`,
    nextAction: 'Prossimo passo', restart: 'Ricomincia', question: 'Domanda',
    change: 'Che cosa cambia', ourFramework: 'Il nostro metodo', sixSituations: 'Sei situazioni',
    notCovered: 'Che cosa questa pagina non copre', ctaEyebrow: 'Colloquio riservato di inquadramento',
    ctaBody: 'Trenta minuti con un esperto della rete, nominato e responsabile del proprio perimetro. Nessun impegno in questa fase; le condizioni seguono l’inquadramento.',
    newsletterLabel: 'Newsletter · Built to Last',
    newsletterBody: 'Analisi di mercato, cicli di vita delle organizzazioni, esperienze sul campo. Una lettera, nessuna prospezione.',
    article: 'Articolo', magazine: 'Magazine',
  },
  es: {
    autoDiag: 'Autodiagnóstico', decision: 'Decisión', deliverable: 'Entregable', yes: 'Sí', no: 'No',
    yesCount: (n, t) => `${n} / ${t} sí`,
    progress: (n, t) => `${n} / ${t} respuestas. El resultado aparece al completar las cinco preguntas.`,
    nextAction: 'Siguiente paso', restart: 'Volver a empezar', question: 'Pregunta',
    change: 'Qué cambia esto', ourFramework: 'Nuestro marco', sixSituations: 'Seis situaciones',
    notCovered: 'Lo que esta página no cubre', ctaEyebrow: 'Conversación confidencial de encuadre',
    ctaBody: 'Treinta minutos con un experto de la red, con nombre y responsable de su perímetro. Sin compromiso en esta fase; las condiciones se comunican tras el encuadre.',
    newsletterLabel: 'Newsletter · Built to Last',
    newsletterBody: 'Análisis de mercado, ciclos de vida de las organizaciones, experiencias de terreno. Una carta, sin prospección.',
    article: 'Artículo', magazine: 'Revista',
  },
  nl: {
    autoDiag: 'Zelfdiagnose', decision: 'Beslissing', deliverable: 'Resultaat', yes: 'Ja', no: 'Nee',
    yesCount: (n, t) => `${n} / ${t} ja`,
    progress: (n, t) => `${n} / ${t} beantwoord. Het resultaat verschijnt zodra alle vijf vragen zijn ingevuld.`,
    nextAction: 'Volgende stap', restart: 'Opnieuw beginnen', question: 'Vraag',
    change: 'Wat dit verandert', ourFramework: 'Ons kader', sixSituations: 'Zes situaties',
    notCovered: 'Wat deze pagina niet dekt', ctaEyebrow: 'Vertrouwelijk kennismakingsgesprek',
    ctaBody: 'Dertig minuten met een met naam genoemde expert uit ons netwerk, verantwoordelijk voor zijn domein. Geen verplichting in dit stadium; de voorwaarden volgen na het gesprek.',
    newsletterLabel: 'Nieuwsbrief · Built to Last',
    newsletterBody: 'Marktanalyses, levenscycli van organisaties, ervaringen uit de praktijk. Eén brief, geen prospectie.',
    article: 'Artikel', magazine: 'Magazine',
  },
}
