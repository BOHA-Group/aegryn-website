/**
 * Modèle de NDA mutuel Aegryn, tout-en-un.
 *
 * Un socle commun (articles 1 à 16) valable pour tous les signataires, et sept
 * annexes par profil, incluses selon les profils du signataire. Aegryn est
 * partie à chaque relation ; les signataires ne sont pas liés entre eux.
 * Aucune clause de non-concurrence, de non-sollicitation, d'exclusivité ni de
 * cession de droits : le NDA reste sans exigence de forme (art. 11 CO).
 *
 * Langues : fr (texte de référence) et en. La langue envoyée au signataire fait foi.
 * Le modèle doit être validé par le conseil juridique avant usage (voir config).
 */
import { createHash } from 'crypto'
import { AEGRYN_PARTY, NDA_TEMPLATE_VERSION } from './config'

export const NDA_ROLES = ['project_owner', 'investor', 'institution', 'industrial', 'partner', 'profile', 'certification'] as const
export type NdaRole = typeof NDA_ROLES[number]
export type NdaLang = 'fr' | 'en'

export type NdaBlock =
  | { kind: 'title' | 'subtitle' | 'meta' | 'h' | 'p' | 'li'; text: string }

export interface NdaVars {
  projectLabel:     string
  termYears:        number
  penaltyChf:       number | null
  signatoryName:    string
  signatoryCompany?: string | null
  roles:            NdaRole[]
  aegrynSignatory:  { name: string; title: string }
  reference?:       string
}

export const ROLE_LABELS: Record<NdaLang, Record<NdaRole, string>> = {
  fr: {
    project_owner: 'Porteur de projet', investor: 'Investisseur ou family office', institution: 'Institution ou grand groupe',
    industrial: 'Industriel ou marque', partner: 'Partenaire de réalisation ou expert du réseau',
    profile: 'Profil à sélectionner (dirigeant, expert, candidat)', certification: 'Certification et data room',
  },
  en: {
    project_owner: 'Project owner', investor: 'Investor or family office', institution: 'Institution or large group',
    industrial: 'Industrial or brand', partner: 'Delivery partner or network expert',
    profile: 'Profile to select (executive, expert, candidate)', certification: 'Certification and data room',
  },
}

interface Clause { title: string; paras: string[] }
interface Content {
  docTitle:   string
  docSubtitle: string
  partiesIntro: string
  common:     Clause[]
  annexes:    Record<NdaRole, string[]>
  annexWord:  string
  penaltyOn:  string[]
  penaltyOff: string[]
  signature:  { aegryn: string; signatory: string; signedAt: string; auto: string; ref: string; version: string }
}

const FR: Content = {
  docTitle: 'Accord de confidentialité mutuel',
  docSubtitle: 'Aegryn · Idées, projets et documents confidentiels',
  partiesIntro: 'Entre',
  common: [
    { title: 'Parties et portée', paras: [
      'Le présent accord lie Aegryn et chaque Signataire. Il crée, entre Aegryn et chaque Signataire, une relation contractuelle distincte et réciproque. Les Signataires ne sont pas liés entre eux, sauf pour une information qu’un Signataire désigne expressément comme partagée avec un autre Signataire.',
      'Chaque Signataire reçoit un exemplaire comprenant le socle commun (articles 1 à 16) et la ou les annexes correspondant à son profil.',
    ]},
    { title: 'Objet et finalité', paras: [
      'Les parties échangent des informations confidentielles dans le cadre suivant : {{project}} (la « Finalité »). Cela peut inclure cadrer, réaliser ou accompagner un projet, sélectionner des profils ou des partenaires, évaluer une participation, un partenariat ou une certification. Les informations ne sont utilisées que pour cette Finalité.',
    ]},
    { title: 'Informations confidentielles', paras: [
      'Constitue une information confidentielle toute information communiquée par une partie (la « Partie divulgatrice ») à l’autre (la « Partie réceptrice »), quels que soient sa forme, son support ou le moment de sa communication, y compris : idées, concepts, projets, plans d’affaires, noms et signes distinctifs non encore protégés, savoir-faire, formules, spécifications, prototypes et échantillons, codes, données, documents d’entreprise, ainsi que l’existence, la teneur et l’avancement des discussions.',
      'Les informations d’Aegryn comprennent notamment ses méthodes, outils, protocoles (dont le protocole CIFSO), grilles d’évaluation, conditions commerciales, portefeuille de projets, réseau d’experts et de partenaires.',
      'Aucun marquage n’est nécessaire : une information est confidentielle dès lors qu’elle l’est par nature ou par les circonstances.',
    ]},
    { title: 'Exclusions', paras: [
      'Ne sont pas confidentielles les informations qui : (a) sont ou deviennent publiques sans faute de la Partie réceptrice ; (b) étaient déjà connues de la Partie réceptrice, de manière licite, avant leur communication ; (c) sont reçues licitement d’un tiers libre de toute obligation de confidentialité ; (d) sont développées de manière indépendante, sans usage des informations confidentielles. La Partie réceptrice supporte la charge de la preuve.',
    ]},
    { title: 'Obligations de la Partie réceptrice', paras: [
      'La Partie réceptrice s’engage à :',
      '(a) garder confidentielles les informations reçues ;',
      '(b) ne les utiliser que pour la Finalité ;',
      '(c) les protéger avec le même soin que ses propres informations sensibles, et au minimum avec une diligence raisonnable ;',
      '(d) ne les copier que si nécessaire ;',
      '(e) ne procéder à aucune ingénierie inverse, analyse, démontage ou décompilation des prototypes, échantillons, logiciels ou documents reçus ;',
      '(f) informer sans délai la Partie divulgatrice de toute divulgation, perte ou accès non autorisé.',
    ]},
    { title: 'Personnes autorisées', paras: [
      'La Partie réceptrice ne communique les informations confidentielles qu’aux personnes qui ont besoin de les connaître pour la Finalité : ses collaborateurs, organes et conseils professionnels et, pour Aegryn, les experts et partenaires du réseau mobilisés pour le projet.',
      'Ces personnes doivent être liées par des obligations de confidentialité au moins équivalentes. La Partie réceptrice répond du respect du présent accord par elles.',
      'À la demande du Signataire, Aegryn lui indique les catégories d’experts et de partenaires concernés avant toute communication d’informations particulièrement sensibles.',
    ]},
    { title: 'Divulgation imposée', paras: [
      'Si la loi, une autorité ou un tribunal impose une divulgation, la Partie réceptrice en informe sans délai la Partie divulgatrice, lorsque la loi le permet, limite la divulgation au strict nécessaire et lui permet, si possible, de s’y opposer.',
    ]},
    { title: 'Propriété intellectuelle, aucune licence', paras: [
      'Chaque partie conserve tous ses droits sur ses informations. Le présent accord n’emporte ni licence, ni cession, ni transfert de droits de propriété intellectuelle. Tout développement commun ou toute exploitation fait l’objet d’un contrat distinct.',
    ]},
    { title: 'Données personnelles', paras: [
      'Les données personnelles contenues dans les informations échangées sont traitées conformément à la loi fédérale sur la protection des données (LPD) et, le cas échéant, au RGPD, pour la seule Finalité et en limitant leur circulation au nécessaire.',
    ]},
    { title: 'Durée', paras: [
      'Le présent accord s’applique dès sa signature par le Signataire. Les obligations de confidentialité durent pendant les échanges et {{term}} ans après leur fin ou leur abandon, quelle qu’en soit la raison. Pour les secrets d’affaires et le savoir-faire, elles durent aussi longtemps que l’information n’est pas devenue publique sans faute de la Partie réceptrice.',
    ]},
    { title: 'Restitution et destruction', paras: [
      'À la demande de la Partie divulgatrice, ou à la fin des échanges, la Partie réceptrice restitue ou détruit les informations confidentielles et le confirme par écrit sur demande. Elle peut conserver les copies que la loi lui impose de conserver ou qui résultent de sauvegardes automatiques, qui restent soumises au présent accord.',
    ]},
    { title: 'Violation', paras: ['{{penalty}}'] },
    { title: 'Absence d’engagement', paras: [
      'Le présent accord n’oblige aucune partie à conclure un contrat ni à poursuivre les échanges. Il n’emporte aucune obligation d’exclusivité, de non-concurrence ni de non-sollicitation.',
    ]},
    { title: 'Droit applicable et for', paras: [
      'Le présent accord est soumis au droit suisse. En cas de litige, les parties tentent d’abord une résolution amiable pendant 30 jours. À défaut, les tribunaux ordinaires du canton de Vaud, siège d’Aegryn, sont compétents, sous réserve des règles impératives de for.',
    ]},
    { title: 'Signature électronique, preuve et exemplaires', paras: [
      'Les parties conviennent que le présent accord n’est soumis à aucune forme particulière. Le Signataire le conclut par voie électronique, en saisissant son nom complet et en cochant la case d’acceptation. Aegryn le contresigne automatiquement à cet instant, par son signataire autorisé indiqué en tête du document.',
      'Ces signatures sont des signatures électroniques simples, et non des signatures électroniques qualifiées au sens de la loi sur la signature électronique. Les parties les reconnaissent comme valant acceptation du présent accord.',
      'Aegryn conserve un dossier de preuve : date et heure (UTC), adresse IP, version du texte, empreinte numérique (SHA-256) du texte accepté et exemplaire signé. Chaque Signataire reçoit son exemplaire au format PDF par e-mail. Le juge apprécie librement ce dossier.',
    ]},
    { title: 'Dispositions finales', paras: [
      'Le présent accord exprime l’intégralité de l’accord des parties sur son objet. Toute modification requiert l’accord exprès des parties, y compris par signature électronique. La nullité ou l’inapplicabilité d’une clause n’affecte pas les autres. Aucune partie ne peut céder le présent accord sans l’accord de l’autre. La langue du texte envoyé au Signataire fait foi.',
    ]},
  ],
  annexes: {
    project_owner: [
      'Informations concernées : l’idée, le concept, le prototype, le plan d’affaires, les noms et éléments d’identité en cours de création, et tout élément remis pour cadrer ou réaliser le projet.',
      'Aegryn n’utilise ces informations que pour cadrer, réaliser ou accompagner le projet du Signataire. Elle ne les reproduit pas, ne les exploite pas et ne lance ni ne soutient de projet concurrent à partir d’elles.',
      'Le Signataire garde confidentiels les offres, méthodes, tarifs et recommandations d’Aegryn ainsi que l’identité des experts et partenaires qui lui sont présentés.',
    ],
    investor: [
      'Informations concernées : projets du portfolio, participations, valorisations, données financières et plans, identité des porteurs, des experts et des partenaires.',
      'Le Signataire n’utilise ces informations que pour évaluer une participation, un co-développement ou un rôle d’operating partner. Il ne les communique ni aux sociétés de son portefeuille ni à des tiers, sauf aux personnes autorisées à l’article 6.',
      'Aegryn ne communique les informations du Signataire à un porteur de projet qu’avec son accord.',
    ],
    institution: [
      'Informations concernées : projets signature, orientations stratégiques, données internes, documents de gouvernance.',
      'Le Signataire peut communiquer les informations aux membres de sa direction, de son conseil et de ses organes de contrôle (audit interne, conformité) qui ont besoin de les connaître.',
      'Si une obligation de transparence, de publicité ou de marchés publics s’applique à l’une des parties, elle en informe l’autre avant toute divulgation.',
    ],
    industrial: [
      'Informations concernées : données techniques, spécifications, formules, cahiers des charges, échantillons, prototypes, procédés et plans de lancement.',
      'Les parties s’interdisent l’ingénierie inverse, l’analyse chimique ou physique, le démontage et la décompilation des échantillons, prototypes et logiciels reçus.',
      'Les échantillons et prototypes sont restitués ou détruits à la fin des échanges, sur demande.',
      'Ces informations sont aussi des secrets d’affaires, protégés comme tels aussi longtemps qu’ils restent secrets.',
    ],
    partner: [
      'Le Signataire ne reçoit que les informations strictement nécessaires à sa contribution, que lui transmet Aegryn. Il s’engage envers Aegryn à les garder confidentielles selon le présent accord.',
      'Il n’utilise aucune information d’un projet pour son propre compte ou celui de tiers, y compris pour un projet concurrent.',
      'Les livrables et la rémunération relèvent d’un contrat de mission distinct. Le Signataire confirme par écrit, sur demande, la restitution ou la destruction des informations.',
      'Aegryn ne communique au Signataire que les informations qu’elle est autorisée à partager.',
    ],
    profile: [
      'Informations concernées : mandats, identité des entreprises et des projets pour lesquels le profil est approché, conditions de la mission.',
      'Les données personnelles du Signataire (parcours, coordonnées, éléments de candidature) sont traitées par Aegryn pour la seule sélection et transmises à un client uniquement avec son accord. Il peut accéder à ses données, les rectifier et demander leur suppression.',
      'Le Signataire ne communique pas à des tiers les informations sur les mandats.',
    ],
    certification: [
      'Informations concernées : rapports, grades et évaluations CIFSO ; données et documents contenus dans les dossiers de certification et la data room ; échanges avec les analystes, auditeurs et partenaires certifiés ; méthodes et outils d’Aegryn ; existence et contenu du processus de certification.',
      'Le Signataire n’utilise ces informations qu’aux fins de l’évaluation et de la certification. Il ne reproduit, ne copie et ne transmet pas les documents consultés dans la data room, et fournit des informations exactes, complètes et à jour.',
      'Il informe sans délai Aegryn de tout contact direct initié par un tiers introduit dans le cadre du processus.',
      'Les accès à la data room sont tracés. Aegryn peut suspendre immédiatement l’accès en cas de manquement.',
      'Aegryn garde de son côté confidentiels les documents et données que le Signataire dépose dans les dossiers de certification et la data room, selon le socle commun.',
    ],
  },
  annexWord: 'Annexe',
  penaltyOn: [
    'En cas de violation fautive du présent accord, la partie fautive verse à l’autre une peine conventionnelle de {{amount}} CHF par violation établie, sans préjudice de dommages-intérêts supérieurs si le préjudice est prouvé. Le juge peut réduire une peine qu’il estime excessive (art. 163 al. 3 CO).',
    'La Partie divulgatrice peut en outre demander toute mesure judiciaire utile, y compris des mesures provisionnelles, pour faire cesser la violation.',
  ],
  penaltyOff: [
    'En cas de violation fautive du présent accord, la partie fautive répond du préjudice causé. La Partie divulgatrice peut en outre demander toute mesure judiciaire utile, y compris des mesures provisionnelles, pour faire cesser la violation.',
  ],
  signature: { aegryn: 'Pour Aegryn', signatory: 'Le Signataire', signedAt: 'Signé électroniquement le', auto: 'Contresignature électronique automatique à la signature du Signataire', ref: 'Référence', version: 'Version du modèle' },
}

const EN: Content = {
  docTitle: 'Mutual confidentiality agreement',
  docSubtitle: 'Aegryn · Confidential ideas, projects and documents',
  partiesIntro: 'Between',
  common: [
    { title: 'Parties and scope', paras: [
      'This agreement binds Aegryn and each Signatory. It creates a separate, reciprocal contractual relationship between Aegryn and each Signatory. Signatories are not bound to one another, except for information that a Signatory expressly designates as shared with another Signatory.',
      'Each Signatory receives a copy comprising the common terms (articles 1 to 16) and the annex or annexes matching their profile.',
    ]},
    { title: 'Purpose', paras: [
      'The parties exchange confidential information in the following context: {{project}} (the “Purpose”). This may include framing, delivering or accompanying a project, selecting profiles or partners, assessing an equity stake, a partnership or a certification. The information is used for this Purpose only.',
    ]},
    { title: 'Confidential information', paras: [
      'Confidential information means any information communicated by one party (the “Disclosing Party”) to the other (the “Receiving Party”), whatever its form, medium or time of communication, including: ideas, concepts, projects, business plans, names and distinctive signs not yet protected, know-how, formulas, specifications, prototypes and samples, code, data, company documents, as well as the existence, content and progress of the discussions.',
      'Aegryn’s information includes in particular its methods, tools, protocols (including the CIFSO protocol), assessment grids, commercial terms, project portfolio, and network of experts and partners.',
      'No marking is required: information is confidential where it is so by nature or by the circumstances.',
    ]},
    { title: 'Exclusions', paras: [
      'Information is not confidential where it: (a) is or becomes public through no fault of the Receiving Party; (b) was already lawfully known to the Receiving Party before disclosure; (c) is lawfully received from a third party free of any confidentiality obligation; (d) is independently developed without use of the confidential information. The Receiving Party bears the burden of proof.',
    ]},
    { title: 'Obligations of the Receiving Party', paras: [
      'The Receiving Party undertakes to:',
      '(a) keep the information received confidential;',
      '(b) use it only for the Purpose;',
      '(c) protect it with the same care as its own sensitive information, and at least with reasonable diligence;',
      '(d) copy it only where necessary;',
      '(e) not reverse-engineer, analyse, dismantle or decompile prototypes, samples, software or documents received;',
      '(f) promptly inform the Disclosing Party of any disclosure, loss or unauthorised access.',
    ]},
    { title: 'Authorised persons', paras: [
      'The Receiving Party discloses confidential information only to persons who need to know it for the Purpose: its employees, governing bodies and professional advisers and, for Aegryn, the experts and network partners mobilised for the project.',
      'These persons must be bound by confidentiality obligations at least equivalent to these. The Receiving Party is responsible for their compliance with this agreement.',
      'At the Signatory’s request, Aegryn indicates the categories of experts and partners concerned before disclosing particularly sensitive information.',
    ]},
    { title: 'Compelled disclosure', paras: [
      'If the law, an authority or a court requires disclosure, the Receiving Party promptly informs the Disclosing Party where the law permits, limits disclosure to what is strictly necessary and, where possible, allows the Disclosing Party to oppose it.',
    ]},
    { title: 'Intellectual property, no licence', paras: [
      'Each party retains all its rights in its information. This agreement grants no licence, assignment or transfer of intellectual property rights. Any joint development or exploitation is subject to a separate contract.',
    ]},
    { title: 'Personal data', paras: [
      'Personal data contained in the information exchanged is processed in accordance with the Swiss Federal Act on Data Protection (FADP) and, where applicable, the GDPR, for the Purpose only and limiting circulation to what is necessary.',
    ]},
    { title: 'Term', paras: [
      'This agreement applies from the Signatory’s signature. The confidentiality obligations last during the discussions and for {{term}} years after they end or are abandoned, for any reason. For trade secrets and know-how, they also last as long as the information has not become public through no fault of the Receiving Party.',
    ]},
    { title: 'Return and destruction', paras: [
      'At the Disclosing Party’s request, or at the end of the discussions, the Receiving Party returns or destroys the confidential information and confirms this in writing on request. It may keep copies that the law requires it to keep or that result from automatic backups, which remain subject to this agreement.',
    ]},
    { title: 'Breach', paras: ['{{penalty}}'] },
    { title: 'No commitment', paras: [
      'This agreement does not oblige any party to enter into a contract or to continue the discussions. It imposes no obligation of exclusivity, non-competition or non-solicitation.',
    ]},
    { title: 'Governing law and jurisdiction', paras: [
      'This agreement is governed by Swiss law. In the event of a dispute, the parties first attempt an amicable resolution for 30 days. Failing that, the ordinary courts of the canton of Vaud, Aegryn’s seat, have jurisdiction, subject to mandatory rules of jurisdiction.',
    ]},
    { title: 'Electronic signature, evidence and copies', paras: [
      'The parties agree that this agreement is subject to no particular form. The Signatory concludes it electronically by entering their full name and ticking the acceptance box. Aegryn countersigns automatically at that moment, through its authorised signatory named at the head of the document.',
      'These signatures are simple electronic signatures, not qualified electronic signatures within the meaning of the electronic signature law. The parties recognise them as constituting acceptance of this agreement.',
      'Aegryn keeps an evidence file: date and time (UTC), IP address, version of the text, digital fingerprint (SHA-256) of the text accepted and signed copy. Each Signatory receives their copy as a PDF by e-mail. The court assesses this file freely.',
    ]},
    { title: 'Final provisions', paras: [
      'This agreement expresses the entire understanding of the parties on its subject. Any amendment requires the express agreement of the parties, including by electronic signature. The invalidity or unenforceability of a clause does not affect the others. No party may assign this agreement without the other’s consent. The language of the text sent to the Signatory prevails.',
    ]},
  ],
  annexes: {
    project_owner: [
      'Information concerned: the idea, concept, prototype, business plan, names and identity elements under creation, and anything supplied to frame or deliver the project.',
      'Aegryn uses this information only to frame, deliver or accompany the Signatory’s project. It does not reproduce or exploit it, and does not launch or support a competing project based on it.',
      'The Signatory keeps confidential Aegryn’s offers, methods, fees and recommendations, as well as the identity of the experts and partners introduced to them.',
    ],
    investor: [
      'Information concerned: portfolio projects, stakes, valuations, financial data and plans, identity of project owners, experts and partners.',
      'The Signatory uses this information only to assess an equity stake, a co-development or an operating partner role. It does not disclose it to its portfolio companies or to third parties, except to the persons authorised under article 6.',
      'Aegryn discloses the Signatory’s information to a project owner only with the Signatory’s consent.',
    ],
    institution: [
      'Information concerned: signature projects, strategic orientations, internal data, governance documents.',
      'The Signatory may disclose the information to the members of its management, board and control bodies (internal audit, compliance) who need to know it.',
      'If a transparency, publicity or public procurement obligation applies to either party, it informs the other before any disclosure.',
    ],
    industrial: [
      'Information concerned: technical data, specifications, formulas, requirements documents, samples, prototypes, processes and launch plans.',
      'The parties refrain from reverse engineering, chemical or physical analysis, dismantling and decompilation of the samples, prototypes and software received.',
      'Samples and prototypes are returned or destroyed at the end of the discussions, on request.',
      'This information also constitutes trade secrets, protected as such for as long as it remains secret.',
    ],
    partner: [
      'The Signatory receives only the information strictly necessary for its contribution, as transmitted by Aegryn. It undertakes towards Aegryn to keep it confidential under this agreement.',
      'It does not use any project information for its own account or for third parties, including for a competing project.',
      'Deliverables and remuneration fall under a separate service contract. The Signatory confirms in writing, on request, the return or destruction of the information.',
      'Aegryn discloses to the Signatory only information it is authorised to share.',
    ],
    profile: [
      'Information concerned: mandates, identity of the companies and projects for which the profile is approached, terms of the assignment.',
      'The Signatory’s personal data (career, contact details, application elements) is processed by Aegryn for selection only and passed to a client only with the Signatory’s consent. The Signatory may access, rectify and request deletion of their data.',
      'The Signatory does not disclose mandate information to third parties.',
    ],
    certification: [
      'Information concerned: CIFSO reports, grades and assessments; data and documents in the certification files and the data room; exchanges with analysts, auditors and certified partners; Aegryn’s methods and tools; the existence and content of the certification process.',
      'The Signatory uses this information only for assessment and certification. It does not reproduce, copy or transmit documents viewed in the data room, and provides accurate, complete and up-to-date information.',
      'It promptly informs Aegryn of any direct contact initiated by a third party introduced through the process.',
      'Data room access is logged. Aegryn may immediately suspend access in the event of a breach.',
      'For its part, Aegryn keeps confidential the documents and data the Signatory places in the certification files and the data room, under the common terms.',
    ],
  },
  annexWord: 'Annex',
  penaltyOn: [
    'In the event of a culpable breach of this agreement, the party in breach pays the other a contractual penalty of CHF {{amount}} per established breach, without prejudice to higher damages if the loss is proven. The court may reduce a penalty it considers excessive (art. 163 para. 3 CO).',
    'The Disclosing Party may also seek any appropriate judicial measure, including interim measures, to stop the breach.',
  ],
  penaltyOff: [
    'In the event of a culpable breach of this agreement, the party in breach is liable for the loss caused. The Disclosing Party may also seek any appropriate judicial measure, including interim measures, to stop the breach.',
  ],
  signature: { aegryn: 'For Aegryn', signatory: 'The Signatory', signedAt: 'Signed electronically on', auto: 'Automatic electronic countersignature when the Signatory signs', ref: 'Reference', version: 'Template version' },
}

const CONTENT: Record<NdaLang, Content> = { fr: FR, en: EN }

export function getNdaSignatureLabels(lang: NdaLang) { return CONTENT[lang].signature }

const spaced = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** Rend le NDA d'un signataire : socle commun + annexes de ses profils, variables résolues. */
export function renderNda(lang: NdaLang, vars: NdaVars): NdaBlock[] {
  const c = CONTENT[lang]
  const roles = NDA_ROLES.filter(r => vars.roles.includes(r))
  /* Annexes numérotées A, B, C... selon celles réellement incluses, dans l'ordre des profils */
  const letter = (r: NdaRole) => String.fromCharCode(65 + roles.indexOf(r))
  const sub = (text: string) =>
    text
      .replaceAll('{{project}}', vars.projectLabel)
      .replaceAll('{{term}}', String(vars.termYears))
  const penalty = vars.penaltyChf != null && vars.penaltyChf > 0
    ? c.penaltyOn.map(p => p.replaceAll('{{amount}}', spaced(vars.penaltyChf as number)))
    : c.penaltyOff

  const blocks: NdaBlock[] = [
    { kind: 'title', text: c.docTitle },
    { kind: 'subtitle', text: c.docSubtitle },
    { kind: 'meta', text: `${c.signature.ref} : ${vars.reference ?? '-'}   |   ${c.signature.version} : ${NDA_TEMPLATE_VERSION}` },
    { kind: 'h', text: c.partiesIntro },
    { kind: 'p', text: lang === 'fr'
        ? `${AEGRYN_PARTY.name}, ${AEGRYN_PARTY.address} (${AEGRYN_PARTY.uid}), représentée par ${vars.aegrynSignatory.name}, ${vars.aegrynSignatory.title} (« Aegryn »),`
        : `${AEGRYN_PARTY.name}, ${AEGRYN_PARTY.address} (${AEGRYN_PARTY.uid}), represented by ${vars.aegrynSignatory.name}, ${vars.aegrynSignatory.title} (“Aegryn”),` },
    { kind: 'p', text: lang === 'fr'
        ? `et ${vars.signatoryName}${vars.signatoryCompany ? `, ${vars.signatoryCompany}` : ''} (le « Signataire »), agissant en qualité de : ${roles.map(r => `${ROLE_LABELS.fr[r]} (${c.annexWord} ${letter(r)})`).join(' ; ')}.`
        : `and ${vars.signatoryName}${vars.signatoryCompany ? `, ${vars.signatoryCompany}` : ''} (the “Signatory”), acting as: ${roles.map(r => `${ROLE_LABELS.en[r]} (${c.annexWord} ${letter(r)})`).join('; ')}.` },
  ]

  c.common.forEach((clause, i) => {
    blocks.push({ kind: 'h', text: `${i + 1}. ${clause.title}` })
    for (const para of clause.paras) {
      if (para === '{{penalty}}') penalty.forEach(p => blocks.push({ kind: 'p', text: p }))
      else blocks.push({ kind: /^\([a-z]\)/.test(para) ? 'li' : 'p', text: sub(para) })
    }
  })

  for (const r of roles) {
    blocks.push({ kind: 'h', text: `${c.annexWord} ${letter(r)} : ${ROLE_LABELS[lang][r]}` })
    for (const para of c.annexes[r]) blocks.push({ kind: 'p', text: sub(para) })
  }
  return blocks
}

/** Empreinte SHA-256 du texte exact accepté (version, langue, contenu résolu). */
export function ndaContentHash(lang: NdaLang, blocks: NdaBlock[]): string {
  return createHash('sha256')
    .update(JSON.stringify({ v: NDA_TEMPLATE_VERSION, lang, blocks }))
    .digest('hex')
}

export function isNdaRole(x: unknown): x is NdaRole {
  return typeof x === 'string' && (NDA_ROLES as readonly string[]).includes(x)
}
