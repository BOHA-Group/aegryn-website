/** Libellés d'interface du bloc FRANCHIR (hors contenu éditorial). */
import type { MetierChip } from './types'

export interface FranchirUi {
  whatWeDo:      string
  finding:       string
  situationsTag: string
  decision:      string
  metierUsed:    string
  deliverable:   string
  metiersTitle:  string
  mobilized:     string
  available:     string
  bySizeTitle:   string
  bySectorTitle: string
  scenarioTag:   string
  aiTitle:       string
  ctaDiagnostic: string
  ctaExchange:   string
  ctaUrgency:    string
  ctaEyebrow:    string
  ctaBody:       string
  /** Page d'introduction /valoriser */
  introCyclesTag: string
  seeCycle:       string
  yes:            string
  no:             string
}

export const FRANCHIR_UI: Record<string, FranchirUi> = {
  fr: {
    whatWeDo: 'Ce que nous faisons', finding: 'Constat', situationsTag: 'Six situations',
    decision: 'Décision à prendre', metierUsed: 'Métier mobilisé', deliverable: 'Ce que vous recevez',
    metiersTitle: 'Métiers mobilisés à ce cycle', mobilized: 'Mobilisé', available: 'Disponible',
    bySizeTitle: 'Selon la taille', bySectorTitle: 'Selon le secteur',
    scenarioTag: 'Scénario illustratif', aiTitle: "Ce qu'un outil d'IA généraliste ne fera pas à votre place",
    ctaDiagnostic: 'Faire le diagnostic de ce cycle', ctaExchange: 'Échanger 30 minutes',
    ctaUrgency: "Situation d'urgence : contact direct",
    ctaEyebrow: 'Échange de cadrage confidentiel',
    ctaBody: 'Trente minutes avec un expert du réseau, nommé et responsable de son périmètre. Pas d’engagement à ce stade ; les conditions sont transmises après cadrage.',
    introCyclesTag: 'Cinq cycles', seeCycle: 'Voir ce cycle', yes: 'Oui', no: 'Non',
  },
  en: {
    whatWeDo: 'What we do', finding: 'The evidence', situationsTag: 'Six situations',
    decision: 'Decision to make', metierUsed: 'Discipline engaged', deliverable: 'What you receive',
    metiersTitle: 'Disciplines engaged at this stage', mobilized: 'Engaged', available: 'Available',
    bySizeTitle: 'By size', bySectorTitle: 'By sector',
    scenarioTag: 'Illustrative scenario', aiTitle: 'What a generalist AI tool will not do for you',
    ctaDiagnostic: 'Take this stage’s assessment', ctaExchange: '30-minute call',
    ctaUrgency: 'Urgent situation: direct contact',
    ctaEyebrow: 'Confidential scoping call',
    ctaBody: 'Thirty minutes with a named expert from our network, accountable for their scope. No commitment at this stage; terms follow the scoping call.',
    introCyclesTag: 'Five stages', seeCycle: 'See this stage', yes: 'Yes', no: 'No',
  },
  de: {
    whatWeDo: 'Was wir tun', finding: 'Befund', situationsTag: 'Sechs Situationen',
    decision: 'Zu treffende Entscheidung', metierUsed: 'Mobilisierte Disziplin', deliverable: 'Was Sie erhalten',
    metiersTitle: 'In diesem Zyklus mobilisierte Disziplinen', mobilized: 'Mobilisiert', available: 'Verfügbar',
    bySizeTitle: 'Nach Unternehmensgrösse', bySectorTitle: 'Nach Branche',
    scenarioTag: 'Illustratives Szenario', aiTitle: 'Was ein generisches KI-Tool nicht für Sie tun wird',
    ctaDiagnostic: 'Diagnose dieses Zyklus machen', ctaExchange: '30 Minuten austauschen',
    ctaUrgency: 'Notlage: direkter Kontakt',
    ctaEyebrow: 'Vertrauliches Orientierungsgespräch',
    ctaBody: 'Dreissig Minuten mit einem benannten Experten aus unserem Netz, verantwortlich für sein Gebiet. Noch keine Verpflichtung; die Konditionen folgen nach dem Gespräch.',
    introCyclesTag: 'Fünf Zyklen', seeCycle: 'Diesen Zyklus ansehen', yes: 'Ja', no: 'Nein',
  },
  it: {
    whatWeDo: 'Cosa facciamo', finding: 'Constatazione', situationsTag: 'Sei situazioni',
    decision: 'Decisione da prendere', metierUsed: 'Competenza mobilitata', deliverable: 'Cosa ricevete',
    metiersTitle: 'Competenze mobilitate in questo ciclo', mobilized: 'Mobilitata', available: 'Disponibile',
    bySizeTitle: 'Secondo la dimensione', bySectorTitle: 'Secondo il settore',
    scenarioTag: 'Scenario illustrativo', aiTitle: 'Cosa uno strumento di IA generalista non farà al vostro posto',
    ctaDiagnostic: 'Fare il diagnostico di questo ciclo', ctaExchange: 'Scambiare 30 minuti',
    ctaUrgency: 'Situazione urgente: contatto diretto',
    ctaEyebrow: 'Scambio di inquadramento riservato',
    ctaBody: 'Trenta minuti con un esperto della rete, nominato e responsabile del suo ambito. Nessun impegno a questo stadio; le condizioni vengono trasmesse dopo l’inquadramento.',
    introCyclesTag: 'Cinque cicli', seeCycle: 'Vedere questo ciclo', yes: 'Sì', no: 'No',
  },
  es: {
    whatWeDo: 'Qué hacemos', finding: 'Constatación', situationsTag: 'Seis situaciones',
    decision: 'Decisión a tomar', metierUsed: 'Disciplina movilizada', deliverable: 'Lo que recibe',
    metiersTitle: 'Disciplinas movilizadas en este ciclo', mobilized: 'Movilizada', available: 'Disponible',
    bySizeTitle: 'Según el tamaño', bySectorTitle: 'Según el sector',
    scenarioTag: 'Escenario ilustrativo', aiTitle: 'Lo que una herramienta de IA generalista no hará por usted',
    ctaDiagnostic: 'Hacer el diagnóstico de este ciclo', ctaExchange: 'Intercambiar 30 minutos',
    ctaUrgency: 'Situación urgente: contacto directo',
    ctaEyebrow: 'Intercambio de encuadre confidencial',
    ctaBody: 'Treinta minutos con un experto de la red, designado y responsable de su ámbito. Sin compromiso en esta fase; las condiciones se transmiten tras el encuadre.',
    introCyclesTag: 'Cinco ciclos', seeCycle: 'Ver este ciclo', yes: 'Sí', no: 'No',
  },
  nl: {
    whatWeDo: 'Wat wij doen', finding: 'Constatering', situationsTag: 'Zes situaties',
    decision: 'Te nemen beslissing', metierUsed: 'Ingezette discipline', deliverable: 'Wat u ontvangt',
    metiersTitle: 'In dit traject ingezette disciplines', mobilized: 'Ingezet', available: 'Beschikbaar',
    bySizeTitle: 'Naar grootte', bySectorTitle: 'Naar sector',
    scenarioTag: 'Illustratief scenario', aiTitle: 'Wat een algemene AI-tool niet voor u zal doen',
    ctaDiagnostic: 'Doe de diagnose van dit traject', ctaExchange: '30 minuten spreken',
    ctaUrgency: 'Spoedgeval: direct contact',
    ctaEyebrow: 'Vertrouwelijk kadergesprek',
    ctaBody: 'Dertig minuten met een benoemde expert uit ons netwerk, verantwoordelijk voor zijn domein. Nog geen engagement; voorwaarden volgen na het kadergesprek.',
    introCyclesTag: 'Vijf trajecten', seeCycle: 'Bekijk dit traject', yes: 'Ja', no: 'Nee',
  },
}

/** Liens fixes des métiers mobilisables (spec FRANCHIR §3) */
export const METIER_HREF: Record<MetierChip, string> = {
  strategie:    '/advisory/strategy',
  conformite:   '/advisory/risk-compliance',
  technologie:  '/advisory/technology',
  talent:       '/advisory/talent-organization',
  ma:           '/advisory/ma',
  construire:   '/assets',
  recruter:     '/talent',
}

/** Libellés des métiers par langue */
export const METIER_LABELS: Record<string, Record<MetierChip, string>> = {
  fr: { strategie: 'Stratégie', conformite: 'Risques & Conformité', technologie: 'Technologie', talent: 'Talent & Organisation', ma: 'M&A & PMI', construire: 'Construire', recruter: 'Recruter' },
  en: { strategie: 'Strategy', conformite: 'Risk & Compliance', technologie: 'Technology', talent: 'Talent & Organisation', ma: 'M&A & PMI', construire: 'Build', recruter: 'Recruit' },
  de: { strategie: 'Strategie', conformite: 'Risiken & Compliance', technologie: 'Technologie', talent: 'Talent & Organisation', ma: 'M&A & PMI', construire: 'Bauen', recruter: 'Rekrutieren' },
  it: { strategie: 'Strategia', conformite: 'Rischi & Conformità', technologie: 'Tecnologia', talent: 'Talento & Organizzazione', ma: 'M&A & PMI', construire: 'Costruire', recruter: 'Reclutare' },
  es: { strategie: 'Estrategia', conformite: 'Riesgos y Cumplimiento', technologie: 'Tecnología', talent: 'Talento y Organización', ma: 'M&A & PMI', construire: 'Construir', recruter: 'Reclutar' },
  nl: { strategie: 'Strategie', conformite: 'Risico & Compliance', technologie: 'Technologie', talent: 'Talent & Organisatie', ma: 'M&A & PMI', construire: 'Bouwen', recruter: 'Rekruteren' },
}
