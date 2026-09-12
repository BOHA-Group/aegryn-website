/* ════════════════════════════════════════════════════════════════════
   INDUSTRIES — 5 clusters sectoriels
   Contenu éditorial par industrie, multilingue (fr/en/de/es/it/nl).
   Pattern LocaleText identique à data/articles.ts.
   Consommé par : app/[locale]/industries/[slug]/page.tsx
   ════════════════════════════════════════════════════════════════════ */

export type LocaleText = {
  fr: string
  en: string
  de: string
  es: string
  it: string
  nl: string
}

export function getLocaleText(text: LocaleText, locale: string): string {
  const key = locale as keyof LocaleText
  return text[key] ?? text.en
}

export interface IndustryMetric {
  value: string
  label: LocaleText
}

export interface IndustrySector {
  img:   string
  name:  LocaleText
  tag:   LocaleText
  desc:  LocaleText
}

export interface IndustryExpertise {
  title: LocaleText
  desc:  LocaleText
}

export interface IndustrySegment {
  label:    LocaleText
  story:    LocaleText
  problems: LocaleText[]
}

export interface Industry {
  slug:         string
  clusterId:    string
  name:         LocaleText
  img:          string
  imgAlt:       LocaleText
  vision:       LocaleText
  keyMetrics:   IndustryMetric[]
  sectors:      IndustrySector[]
  expertise:    IndustryExpertise[]
  segments:     IndustrySegment[]
  articleSlugs: string[]
}

/* ════════════════════════════════════════════════════════════════════
   1. FINANCE & CAPITAL
   ════════════════════════════════════════════════════════════════════ */
const finance: Industry = {
  slug:      'finance-capital',
  clusterId: 'finance',
  name: {
    fr: 'Finance & Capital',
    en: 'Finance & Capital',
    de: 'Finanzen & Kapital',
    es: 'Finanzas y Capital',
    it: 'Finanza & Capitale',
    nl: 'Financiën & Kapitaal',
  },
  img: '/images/theme_fintech.jpg',
  imgAlt: {
    fr: 'Finance & Capital — Aegryn',
    en: 'Finance & Capital — Aegryn',
    de: 'Finanzen & Kapital — Aegryn',
    es: 'Finanzas y Capital — Aegryn',
    it: 'Finanza & Capitale — Aegryn',
    nl: 'Financiën & Kapitaal — Aegryn',
  },
  vision: {
    fr: `Les organisations financières opèrent dans un environnement de conformité permanente où chaque décision de valeur est exposée à un scrutin réglementaire et à une pression acheteur croissante. Leur valeur repose sur la qualité des données, la robustesse de la gouvernance et la crédibilité des métriques financières.

La Certification CIFSO 5000 est particulièrement pertinente pour documenter et défendre ce que les audits réglementaires ne capturent pas : l'intégrité opérationnelle, la souveraineté des données et la transmissibilité réelle.`,
    en: `Financial organisations operate in an environment of permanent compliance where every value decision is exposed to regulatory scrutiny and growing buyer pressure. Their value rests on data quality, governance robustness and the credibility of financial metrics.

CIFSO 5000 Certification is particularly relevant for documenting and defending what regulatory audits do not capture: operational integrity, data sovereignty and real transferability.`,
    de: `Finanzorganisationen agieren in einem Umfeld permanenter Compliance, in dem jede Wertentscheidung regulatorischer Prüfung und wachsendem Käuferdruck ausgesetzt ist. Ihr Wert beruht auf Datenqualität, robuster Governance und der Glaubwürdigkeit finanzieller Kennzahlen.

Die CIFSO-5000-Zertifizierung ist besonders geeignet, um zu dokumentieren und zu verteidigen, was regulatorische Audits nicht erfassen: operative Integrität, Datensouveränität und reale Übertragbarkeit.`,
    es: `Las organizaciones financieras operan en un entorno de cumplimiento permanente donde cada decisión de valor está expuesta al escrutinio regulatorio y a una presión compradora creciente. Su valor descansa en la calidad de los datos, la solidez de la gobernanza y la credibilidad de las métricas financieras.

La Certificación CIFSO 5000 es especialmente relevante para documentar y defender lo que las auditorías regulatorias no capturan: la integridad operativa, la soberanía de los datos y la transmisibilidad real.`,
    it: `Le organizzazioni finanziarie operano in un ambiente di conformità permanente in cui ogni decisione di valore è esposta al controllo regolamentare e a una pressione crescente degli acquirenti. Il loro valore si fonda sulla qualità dei dati, sulla solidità della governance e sulla credibilità delle metriche finanziarie.

La Certificazione CIFSO 5000 è particolarmente pertinente per documentare e difendere ciò che gli audit regolamentari non catturano: l'integrità operativa, la sovranità dei dati e la trasmissibilità reale.`,
    nl: `Financiële organisaties opereren in een omgeving van permanente compliance waarin elke waardebepaling wordt blootgesteld aan regelgevend toezicht en groeiende kopersdruk. Hun waarde berust op datakwaliteit, robuuste governance en de geloofwaardigheid van financiële metrics.

De CIFSO 5000-certificering is bijzonder relevant om te documenteren en te verdedigen wat regelgevende audits niet vastleggen: operationele integriteit, datasoevereiniteit en reële overdraagbaarheid.`,
  },
  keyMetrics: [
    { value: '4,1 Tn EUR', label: {
      fr: 'actifs gérés par les fonds PE en Europe (Preqin 2024)',
      en: 'assets managed by PE funds in Europe (Preqin 2024)',
      de: 'von PE-Fonds in Europa verwaltete Vermögen (Preqin 2024)',
      es: 'activos gestionados por fondos PE en Europa (Preqin 2024)',
      it: 'attività gestite dai fondi PE in Europa (Preqin 2024)',
      nl: 'vermogen beheerd door PE-fondsen in Europa (Preqin 2024)',
    }},
    { value: '47 Mrd EUR', label: {
      fr: 'investissement FinTech Europe 2023 (KPMG Pulse)',
      en: 'FinTech investment Europe 2023 (KPMG Pulse)',
      de: 'FinTech-Investitionen Europa 2023 (KPMG Pulse)',
      es: 'inversión FinTech Europa 2023 (KPMG Pulse)',
      it: 'investimenti FinTech Europa 2023 (KPMG Pulse)',
      nl: 'FinTech-investeringen Europa 2023 (KPMG Pulse)',
    }},
    { value: '3 ans', label: {
      fr: 'calendrier moyen de mise en conformité DORA (EBA 2024)',
      en: 'average DORA compliance timeline (EBA 2024)',
      de: 'durchschnittlicher DORA-Compliance-Zeitplan (EBA 2024)',
      es: 'plazo medio de cumplimiento DORA (EBA 2024)',
      it: 'tempi medi di conformità DORA (EBA 2024)',
      nl: 'gemiddelde DORA-compliance-planning (EBA 2024)',
    }},
    { value: '68%', label: {
      fr: 'des deals M&A financiers bloqués par des lacunes de data governance (PwC 2024)',
      en: 'of financial M&A deals blocked by data governance gaps (PwC 2024)',
      de: 'der Finanz-M&A-Deals scheitern an Lücken in der Data Governance (PwC 2024)',
      es: 'de las operaciones M&A financieras bloqueadas por carencias de gobernanza de datos (PwC 2024)',
      it: 'dei deal M&A finanziari bloccati da lacune di data governance (PwC 2024)',
      nl: 'van financiële M&A-deals geblokkeerd door datagovernance-lacunes (PwC 2024)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/finance-trading.jpg',
      name: {
        fr: 'Banque & Services Financiers',
        en: 'Banking & Financial Services',
        de: 'Banken & Finanzdienstleistungen',
        es: 'Banca y Servicios Financieros',
        it: 'Banche & Servizi Finanziari',
        nl: 'Banken & Financiële Diensten',
      },
      tag: {
        fr: 'Réglementé', en: 'Regulated', de: 'Reguliert',
        es: 'Regulado',   it: 'Regolamentato', nl: 'Gereguleerd',
      },
      desc: {
        fr: 'Conformité DORA, Bâle IV, IA de risque crédit, modernisation back-office et résilience opérationnelle.',
        en: 'DORA compliance, Basel IV, credit risk AI, back-office modernisation and operational resilience.',
        de: 'DORA-Compliance, Basel IV, KI für Kreditrisiko, Backoffice-Modernisierung und operative Resilienz.',
        es: 'Cumplimiento DORA, Basilea IV, IA de riesgo crediticio, modernización de back-office y resiliencia operativa.',
        it: 'Conformità DORA, Basilea IV, IA per il rischio di credito, modernizzazione del back-office e resilienza operativa.',
        nl: 'DORA-compliance, Bazel IV, AI voor kredietrisico, back-office-modernisering en operationele weerbaarheid.',
      },
    },
    {
      img: '/images/blog/fintech-app.jpg',
      name: {
        fr: 'FinTech & Paiements',
        en: 'FinTech & Payments',
        de: 'FinTech & Zahlungsverkehr',
        es: 'FinTech y Pagos',
        it: 'FinTech & Pagamenti',
        nl: 'FinTech & Betalingen',
      },
      tag: {
        fr: 'Croissance', en: 'Growth', de: 'Wachstum',
        es: 'Crecimiento', it: 'Crescita', nl: 'Groei',
      },
      desc: {
        fr: 'PSD2, open banking, AML/KYC, architectures paiement temps réel, tokenisation et métriques SaaS défendables.',
        en: 'PSD2, open banking, AML/KYC, real-time payment architectures, tokenisation and defensible SaaS metrics.',
        de: 'PSD2, Open Banking, AML/KYC, Echtzeit-Zahlungsarchitekturen, Tokenisierung und belastbare SaaS-Kennzahlen.',
        es: 'PSD2, open banking, AML/KYC, arquitecturas de pago en tiempo real, tokenización y métricas SaaS defendibles.',
        it: 'PSD2, open banking, AML/KYC, architetture di pagamento in tempo reale, tokenizzazione e metriche SaaS difendibili.',
        nl: 'PSD2, open banking, AML/KYC, realtime-betaalarchitecturen, tokenisatie en verdedigbare SaaS-metrics.',
      },
    },
    {
      img: '/images/blog/investment-coins.jpg',
      name: {
        fr: 'PropTech & Immobilier',
        en: 'PropTech & Real Estate',
        de: 'PropTech & Immobilien',
        es: 'PropTech e Inmobiliario',
        it: 'PropTech & Immobiliare',
        nl: 'PropTech & Vastgoed',
      },
      tag: {
        fr: 'Hybride', en: 'Hybrid', de: 'Hybrid',
        es: 'Híbrido', it: 'Ibrido', nl: 'Hybride',
      },
      desc: {
        fr: 'Valorisation des actifs, IA scoring locataire, plateforme transaction, données ESG et dualité logiciel/actif physique.',
        en: 'Asset valuation, tenant-scoring AI, transaction platforms, ESG data and the software/physical-asset duality.',
        de: 'Asset-Bewertung, KI für Mieter-Scoring, Transaktionsplattformen, ESG-Daten und die Dualität Software/physisches Asset.',
        es: 'Valoración de activos, IA de scoring de inquilinos, plataformas de transacción, datos ESG y dualidad software/activo físico.',
        it: 'Valorizzazione degli asset, IA per lo scoring degli inquilini, piattaforme di transazione, dati ESG e dualità software/asset fisico.',
        nl: 'Vastgoedwaardering, AI voor huurders-scoring, transactieplatforms, ESG-data en de dualiteit software/fysiek actief.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Évaluation indépendante des 5 dimensions CIFSO sur les actifs financiers et technologiques — documentation opposable en due diligence réglementaire, auprès des LPs et des régulateurs (EBA, FINMA, DORA).',
        en: 'Independent assessment of the 5 CIFSO dimensions on financial and technology assets — documentation enforceable in regulatory due diligence, with LPs and regulators (EBA, FINMA, DORA).',
        de: 'Unabhängige Bewertung der 5 CIFSO-Dimensionen für Finanz- und Technologie-Assets — Dokumentation, die in regulatorischer Due Diligence, gegenüber LPs und Regulatoren (EBA, FINMA, DORA) Bestand hat.',
        es: 'Evaluación independiente de las 5 dimensiones CIFSO sobre activos financieros y tecnológicos — documentación oponible en due diligence regulatoria, ante LPs y reguladores (EBA, FINMA, DORA).',
        it: 'Valutazione indipendente delle 5 dimensioni CIFSO su asset finanziari e tecnologici — documentazione opponibile in due diligence regolamentare, presso LP e regolatori (EBA, FINMA, DORA).',
        nl: 'Onafhankelijke beoordeling van de 5 CIFSO-dimensies op financiële en technologische activa — documentatie die standhoudt in regelgevende due diligence, bij LP\'s en toezichthouders (EBA, FINMA, DORA).',
      },
    },
    {
      title: {
        fr: 'Conseil en Stratégie',
        en: 'Strategy Advisory',
        de: 'Strategieberatung',
        es: 'Consultoría de Estrategia',
        it: 'Consulenza Strategica',
        nl: 'Strategieadvies',
      },
      desc: {
        fr: 'Positionnement face aux nouveaux entrants FinTech, refonte du modèle économique, gouvernance conseil d\'administration et planification de la transformation réglementaire.',
        en: 'Positioning against new FinTech entrants, business model redesign, board governance and regulatory transformation planning.',
        de: 'Positionierung gegenüber neuen FinTech-Wettbewerbern, Redesign des Geschäftsmodells, Governance im Verwaltungsrat und Planung der regulatorischen Transformation.',
        es: 'Posicionamiento frente a nuevos entrantes FinTech, rediseño del modelo de negocio, gobernanza del consejo y planificación de la transformación regulatoria.',
        it: 'Posizionamento rispetto ai nuovi entranti FinTech, riprogettazione del modello di business, governance del consiglio di amministrazione e pianificazione della trasformazione regolamentare.',
        nl: 'Positionering tegenover nieuwe FinTech-spelers, herontwerp van het verdienmodel, bestuurlijke governance en planning van regelgevende transformatie.',
      },
    },
    {
      title: {
        fr: 'Conseil en Technologie',
        en: 'Technology Advisory',
        de: 'Technologieberatung',
        es: 'Consultoría Tecnológica',
        it: 'Consulenza Tecnologica',
        nl: 'Technologieadvies',
      },
      desc: {
        fr: 'Architecture système résiliente, migration cloud souverain européen, souveraineté des données financières et conformité technique DORA, NIS2, AI Act EBA.',
        en: 'Resilient system architecture, European sovereign cloud migration, financial data sovereignty and technical compliance with DORA, NIS2, AI Act, EBA.',
        de: 'Resiliente Systemarchitektur, Migration in souveräne europäische Clouds, Souveränität über Finanzdaten und technische Compliance mit DORA, NIS2, AI Act und EBA.',
        es: 'Arquitectura de sistemas resiliente, migración a cloud soberano europeo, soberanía de los datos financieros y cumplimiento técnico de DORA, NIS2, AI Act y EBA.',
        it: 'Architettura di sistemi resiliente, migrazione verso cloud sovrano europeo, sovranità dei dati finanziari e conformità tecnica a DORA, NIS2, AI Act ed EBA.',
        nl: 'Veerkrachtige systeemarchitectuur, migratie naar Europese soevereine cloud, soevereiniteit van financiële data en technische compliance met DORA, NIS2, AI Act en EBA.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Préparation à la cession ou à l\'acquisition dans le secteur financier : valorisation des actifs data, structuration transaction, accompagnement closing avec fonds PE et acquéreurs stratégiques.',
        en: 'Preparation for sale or acquisition in the financial sector: data asset valuation, transaction structuring, closing support with PE funds and strategic buyers.',
        de: 'Vorbereitung auf Verkauf oder Akquisition im Finanzsektor: Bewertung von Daten-Assets, Transaktionsstrukturierung, Closing-Begleitung mit PE-Fonds und strategischen Käufern.',
        es: 'Preparación para la venta o adquisición en el sector financiero: valoración de activos de datos, estructuración de la transacción y acompañamiento del cierre con fondos PE y compradores estratégicos.',
        it: 'Preparazione alla cessione o all\'acquisizione nel settore finanziario: valorizzazione degli asset data, strutturazione della transazione e supporto al closing con fondi PE e acquirenti strategici.',
        nl: 'Voorbereiding op verkoop of overname in de financiële sector: waardering van data-activa, transactiestructurering en closing-begeleiding met PE-fondsen en strategische kopers.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'Fonds de Private Equity',
        en: 'Private Equity funds',
        de: 'Private-Equity-Fonds',
        es: 'Fondos de Private Equity',
        it: 'Fondi di Private Equity',
        nl: 'Private-equityfondsen',
      },
      story: {
        fr: 'Vous étudiez une cible dans les services financiers. La data room est incomplète, la gouvernance des données peu documentée et les régulateurs posent des questions. Vous avez besoin d\'une évaluation indépendante pour sécuriser votre thèse avant le closing.',
        en: 'You are assessing a target in financial services. The data room is incomplete, data governance is poorly documented and regulators are asking questions. You need an independent assessment to secure your thesis before closing.',
        de: 'Sie prüfen eine Beteiligung im Finanzdienstleistungssektor. Der Datenraum ist unvollständig, die Data Governance ist kaum dokumentiert und die Regulatoren stellen Fragen. Sie benötigen eine unabhängige Bewertung, um Ihre Investmentthese vor dem Closing abzusichern.',
        es: 'Está analizando una empresa objetivo en servicios financieros. El data room está incompleto, la gobernanza de datos está mal documentada y los reguladores hacen preguntas. Necesita una evaluación independiente para asegurar su tesis antes del cierre.',
        it: 'State valutando un target nei servizi finanziari. La data room è incompleta, la governance dei dati è scarsamente documentata e i regolatori pongono domande. Avete bisogno di una valutazione indipendente per consolidare la vostra tesi prima del closing.',
        nl: 'U beoordeelt een overnamedoel in financiële dienstverlening. De dataroom is incompleet, datagovernance is slecht gedocumenteerd en toezichthouders stellen vragen. U heeft een onafhankelijke beoordeling nodig om uw these vóór de closing te borgen.',
      },
      problems: [
        {
          fr: 'Vérifier la qualité et la traçabilité des données d\'une cible financière',
          en: 'Verify the quality and traceability of a financial target\'s data',
          de: 'Qualität und Nachverfolgbarkeit der Daten einer Finanz-Zielgesellschaft prüfen',
          es: 'Verificar la calidad y trazabilidad de los datos de una empresa financiera objetivo',
          it: 'Verificare qualità e tracciabilità dei dati di un target finanziario',
          nl: 'De kwaliteit en traceerbaarheid van de data van een financieel overnamedoel verifiëren',
        },
        {
          fr: 'Obtenir une documentation de gouvernance opposable avant closing',
          en: 'Obtain enforceable governance documentation before closing',
          de: 'Vor dem Closing belastbare Governance-Dokumentation erhalten',
          es: 'Obtener documentación de gobernanza oponible antes del cierre',
          it: 'Ottenere documentazione di governance opponibile prima del closing',
          nl: 'Aantoombare governance-documentatie verkrijgen vóór de closing',
        },
        {
          fr: 'Défendre la thèse d\'investissement face aux LPs avec un grade certifié',
          en: 'Defend the investment thesis to LPs with a certified grade',
          de: 'Die Investmentthese gegenüber LPs mit einem zertifizierten Rating verteidigen',
          es: 'Defender la tesis de inversión ante los LP con un grado certificado',
          it: 'Difendere la tesi di investimento presso gli LP con un grado certificato',
          nl: 'De investeringsthese verdedigen bij LP\'s met een gecertificeerde grade',
        },
      ],
    },
    {
      label: {
        fr: 'FinTech en croissance',
        en: 'Growing FinTech',
        de: 'FinTech im Wachstum',
        es: 'FinTech en crecimiento',
        it: 'FinTech in crescita',
        nl: 'Groeiende FinTech',
      },
      story: {
        fr: 'Votre FinTech lève ou cherche un acquéreur. Vos métriques sont solides, mais votre algorithme de scoring, vos contrats PSD2 et votre IP ne sont pas documentés de façon défendable. Un investisseur veut une certification indépendante avant de s\'engager.',
        en: 'Your FinTech is raising or seeking an acquirer. Your metrics are solid, but your scoring algorithm, PSD2 contracts and IP are not documented in a defensible way. An investor wants independent certification before committing.',
        de: 'Ihr FinTech sammelt Kapital oder sucht einen Käufer. Ihre Kennzahlen sind solide, aber Ihr Scoring-Algorithmus, Ihre PSD2-Verträge und Ihr geistiges Eigentum sind nicht belastbar dokumentiert. Ein Investor verlangt eine unabhängige Zertifizierung, bevor er sich bindet.',
        es: 'Su FinTech está levantando capital o buscando un comprador. Sus métricas son sólidas, pero su algoritmo de scoring, sus contratos PSD2 y su propiedad intelectual no están documentados de forma defendible. Un inversor exige una certificación independiente antes de comprometerse.',
        it: 'La vostra FinTech sta raccogliendo capitali o cerca un acquirente. Le metriche sono solide, ma l\'algoritmo di scoring, i contratti PSD2 e la proprietà intellettuale non sono documentati in modo difendibile. Un investitore richiede una certificazione indipendente prima di impegnarsi.',
        nl: 'Uw FinTech haalt kapitaal op of zoekt een koper. Uw metrics zijn solide, maar uw scoring-algoritme, PSD2-contracten en IP zijn niet verdedigbaar gedocumenteerd. Een investeerder wil een onafhankelijke certificering voordat hij zich committeert.',
      },
      problems: [
        {
          fr: 'Préparer un dossier investisseur avec certification de la propriété algorithmique',
          en: 'Prepare an investor dossier with certification of algorithmic ownership',
          de: 'Ein Investorendossier mit Zertifizierung des algorithmischen Eigentums vorbereiten',
          es: 'Preparar un expediente para inversores con certificación de la propiedad algorítmica',
          it: 'Preparare un dossier per investitori con certificazione della proprietà algoritmica',
          nl: 'Een investeerdersdossier voorbereiden met certificering van het algoritmische eigendom',
        },
        {
          fr: 'Documenter la conformité PSD2/DORA pour rassurer un acquéreur bancaire',
          en: 'Document PSD2/DORA compliance to reassure a banking acquirer',
          de: 'PSD2-/DORA-Compliance dokumentieren, um einen Banken-Käufer zu überzeugen',
          es: 'Documentar el cumplimiento PSD2/DORA para tranquilizar a un comprador bancario',
          it: 'Documentare la conformità PSD2/DORA per rassicurare un acquirente bancario',
          nl: 'PSD2-/DORA-compliance documenteren om een bancaire koper gerust te stellen',
        },
        {
          fr: 'Structurer la valeur des données AML/KYC en actif certifiable',
          en: 'Structure the value of AML/KYC data as a certifiable asset',
          de: 'Den Wert der AML-/KYC-Daten als zertifizierbares Asset strukturieren',
          es: 'Estructurar el valor de los datos AML/KYC como activo certificable',
          it: 'Strutturare il valore dei dati AML/KYC come asset certificabile',
          nl: 'De waarde van AML/KYC-data structureren als certificeerbaar actief',
        },
      ],
    },
    {
      label: {
        fr: 'Banques & Établissements financiers',
        en: 'Banks & financial institutions',
        de: 'Banken & Finanzinstitute',
        es: 'Bancos y entidades financieras',
        it: 'Banche e istituzioni finanziarie',
        nl: 'Banken & financiële instellingen',
      },
      story: {
        fr: 'Vous gérez une transformation numérique dans un contexte DORA/NIS2 et devez démontrer votre résilience opérationnelle aux régulateurs. Vos dépendances technologiques critiques sont peu cartographiées et les risques IA non gouvernés selon les guidelines EBA.',
        en: 'You are running a digital transformation in a DORA/NIS2 context and must demonstrate operational resilience to regulators. Your critical technology dependencies are poorly mapped and AI risks are not governed per EBA guidelines.',
        de: 'Sie steuern eine digitale Transformation im DORA-/NIS2-Kontext und müssen den Regulatoren Ihre operative Resilienz nachweisen. Ihre kritischen Technologie-Abhängigkeiten sind kaum kartiert und KI-Risiken werden nicht nach EBA-Leitlinien gesteuert.',
        es: 'Gestiona una transformación digital en un contexto DORA/NIS2 y debe demostrar resiliencia operativa ante los reguladores. Sus dependencias tecnológicas críticas están mal mapeadas y los riesgos de IA no se gobiernan según las directrices EBA.',
        it: 'Gestite una trasformazione digitale in un contesto DORA/NIS2 e dovete dimostrare la resilienza operativa ai regolatori. Le dipendenze tecnologiche critiche sono poco mappate e i rischi IA non sono governati secondo le linee guida EBA.',
        nl: 'U leidt een digitale transformatie in een DORA-/NIS2-context en moet operationele weerbaarheid aantonen aan toezichthouders. Uw kritieke technologie-afhankelijkheden zijn slecht in kaart gebracht en AI-risico\'s worden niet beheerst volgens de EBA-richtlijnen.',
      },
      problems: [
        {
          fr: 'Gouverner les risques IA et les modèles d\'alerte selon les EBA guidelines',
          en: 'Govern AI risks and alert models according to EBA guidelines',
          de: 'KI-Risiken und Alarmmodelle nach EBA-Leitlinien steuern',
          es: 'Gobernar los riesgos de IA y los modelos de alerta según las directrices EBA',
          it: 'Governare i rischi IA e i modelli di alert secondo le linee guida EBA',
          nl: 'AI-risico\'s en alertmodellen beheersen volgens de EBA-richtlijnen',
        },
        {
          fr: 'Documenter et certifier la résilience opérationnelle pour un audit DORA',
          en: 'Document and certify operational resilience for a DORA audit',
          de: 'Operative Resilienz für ein DORA-Audit dokumentieren und zertifizieren',
          es: 'Documentar y certificar la resiliencia operativa para una auditoría DORA',
          it: 'Documentare e certificare la resilienza operativa per un audit DORA',
          nl: 'Operationele weerbaarheid documenteren en certificeren voor een DORA-audit',
        },
        {
          fr: 'Cartographier et maîtriser les dépendances technologiques critiques',
          en: 'Map and control critical technology dependencies',
          de: 'Kritische Technologie-Abhängigkeiten kartieren und beherrschen',
          es: 'Mapear y controlar las dependencias tecnológicas críticas',
          it: 'Mappare e controllare le dipendenze tecnologiche critiche',
          nl: 'Kritieke technologie-afhankelijkheden in kaart brengen en beheersen',
        },
      ],
    },
  ],
  articleSlugs: [
    'fintech-europe-ma-valorisation-2026',
    'family-office-investissement-actifs-tech',
    'fintech-finance-capital-enjeux-certification-cifso-2025',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   2. SANTÉ & SCIENCES DE LA VIE
   ════════════════════════════════════════════════════════════════════ */
const sante: Industry = {
  slug:      'sante-sciences-de-la-vie',
  clusterId: 'sante',
  name: {
    fr: 'Santé & Sciences de la Vie',
    en: 'Health & Life Sciences',
    de: 'Gesundheit & Life Sciences',
    es: 'Salud y Ciencias de la Vida',
    it: 'Salute & Scienze della Vita',
    nl: 'Gezondheid & Life Sciences',
  },
  img: '/images/grade-usecases/uc-due-diligence.jpg',
  imgAlt: {
    fr: 'Santé & Sciences de la Vie — Aegryn',
    en: 'Health & Life Sciences — Aegryn',
    de: 'Gesundheit & Life Sciences — Aegryn',
    es: 'Salud y Ciencias de la Vida — Aegryn',
    it: 'Salute & Scienze della Vita — Aegryn',
    nl: 'Gezondheid & Life Sciences — Aegryn',
  },
  vision: {
    fr: `Les organisations de santé et de sciences de la vie opèrent avec des exigences de conformité parmi les plus strictes au monde. Leur valeur tient à leur capital data clinique, à leurs protocoles propriétaires et à la solidité de leur gouvernance réglementaire.

La Certification CIFSO 5000 s'applique avec une granularité adaptée à ces contraintes : documenter la valeur des données de santé, la robustesse des process qualité et la transmissibilité de l'organisation à l'horizon d'une cession, d'un financement ou d'un partenariat industriel.`,
    en: `Health and life sciences organisations operate under some of the strictest compliance requirements in the world. Their value lies in their clinical data capital, proprietary protocols and the strength of their regulatory governance.

CIFSO 5000 Certification applies with granularity adapted to these constraints: documenting the value of health data, the robustness of quality processes and the transferability of the organisation ahead of a sale, financing or industrial partnership.`,
    de: `Organisationen im Gesundheitswesen und in den Life Sciences unterliegen einigen der strengsten Compliance-Anforderungen weltweit. Ihr Wert liegt im klinischen Datenkapital, in proprietären Protokollen und in der Stärke ihrer regulatorischen Governance.

Die CIFSO-5000-Zertifizierung wird mit an diese Anforderungen angepasster Granularität angewendet: Sie dokumentiert den Wert von Gesundheitsdaten, die Robustheit der Qualitätsprozesse und die Übertragbarkeit der Organisation im Hinblick auf Verkauf, Finanzierung oder industrielle Partnerschaft.`,
    es: `Las organizaciones de salud y ciencias de la vida operan con unos requisitos de cumplimiento entre los más estrictos del mundo. Su valor reside en su capital de datos clínicos, sus protocolos propietarios y la solidez de su gobernanza regulatoria.

La Certificación CIFSO 5000 se aplica con una granularidad adaptada a estas limitaciones: documentar el valor de los datos de salud, la robustez de los procesos de calidad y la transmisibilidad de la organización ante una venta, una financiación o una alianza industrial.`,
    it: `Le organizzazioni sanitarie e delle scienze della vita operano con requisiti di conformità tra i più severi al mondo. Il loro valore risiede nel capitale di dati clinici, nei protocolli proprietari e nella solidità della governance regolamentare.

La Certificazione CIFSO 5000 si applica con una granularità adeguata a questi vincoli: documentare il valore dei dati sanitari, la robustezza dei processi qualità e la trasmissibilità dell'organizzazione in vista di una cessione, di un finanziamento o di una partnership industriale.`,
    nl: `Organisaties in de gezondheidszorg en life sciences werken onder enkele van de strengste compliance-eisen ter wereld. Hun waarde zit in hun klinische datakapitaal, propriëtaire protocollen en de sterkte van hun regelgevende governance.

De CIFSO 5000-certificering wordt toegepast met een granulariteit afgestemd op deze beperkingen: het documenteren van de waarde van gezondheidsdata, de robuustheid van kwaliteitsprocessen en de overdraagbaarheid van de organisatie voorafgaand aan een verkoop, financiering of industriële samenwerking.`,
  },
  keyMetrics: [
    { value: '278 Mrd EUR', label: {
      fr: 'marché santé numérique mondial 2028 (Grand View Research 2024)',
      en: 'global digital health market 2028 (Grand View Research 2024)',
      de: 'weltweiter Digital-Health-Markt 2028 (Grand View Research 2024)',
      es: 'mercado mundial de salud digital 2028 (Grand View Research 2024)',
      it: 'mercato globale della salute digitale 2028 (Grand View Research 2024)',
      nl: 'wereldwijde digitale-gezondheidsmarkt 2028 (Grand View Research 2024)',
    }},
    { value: '2 ans', label: {
      fr: 'délai moyen certification MDR/IVDR pour un dispositif médical (CE 2023)',
      en: 'average MDR/IVDR certification time for a medical device (EC 2023)',
      de: 'durchschnittliche MDR-/IVDR-Zertifizierungsdauer für ein Medizinprodukt (EK 2023)',
      es: 'plazo medio de certificación MDR/IVDR para un dispositivo médico (CE 2023)',
      it: 'tempo medio di certificazione MDR/IVDR per un dispositivo medico (CE 2023)',
      nl: 'gemiddelde MDR-/IVDR-certificeringstijd voor een medisch hulpmiddel (EC 2023)',
    }},
    { value: '+42%', label: {
      fr: 'croissance M&A HealthTech Europe 2022-2024 (Dealroom 2024)',
      en: 'HealthTech M&A growth Europe 2022-2024 (Dealroom 2024)',
      de: 'HealthTech-M&A-Wachstum Europa 2022-2024 (Dealroom 2024)',
      es: 'crecimiento M&A HealthTech Europa 2022-2024 (Dealroom 2024)',
      it: 'crescita M&A HealthTech Europa 2022-2024 (Dealroom 2024)',
      nl: 'HealthTech M&A-groei Europa 2022-2024 (Dealroom 2024)',
    }},
    { value: '89%', label: {
      fr: 'des due diligences pharma bloquées par des manques de documentation données (EY 2023)',
      en: 'of pharma due diligences blocked by data documentation gaps (EY 2023)',
      de: 'der Pharma-Due-Diligences scheitern an fehlender Datendokumentation (EY 2023)',
      es: 'de las due diligences farmacéuticas bloqueadas por falta de documentación de datos (EY 2023)',
      it: 'delle due diligence farmaceutiche bloccate da carenze di documentazione dei dati (EY 2023)',
      nl: 'van pharma-due diligences geblokkeerd door ontbrekende datadocumentatie (EY 2023)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/healthcare-lab.jpg',
      name: {
        fr: 'Santé & Pharmaceutique',
        en: 'Health & Pharmaceutical',
        de: 'Gesundheit & Pharma',
        es: 'Salud y Farmacéutica',
        it: 'Salute & Farmaceutico',
        nl: 'Gezondheid & Farmacie',
      },
      tag: {
        fr: 'Très réglementé', en: 'Highly regulated', de: 'Stark reguliert',
        es: 'Muy regulado',      it: 'Fortemente regolamentato', nl: 'Sterk gereguleerd',
      },
      desc: {
        fr: 'Données RGPD/HIPAA, interopérabilité HL7/FHIR, conformité EMA, chaîne d\'approvisionnement et IP clinique.',
        en: 'GDPR/HIPAA data, HL7/FHIR interoperability, EMA compliance, supply chain and clinical IP.',
        de: 'DSGVO-/HIPAA-Daten, HL7-/FHIR-Interoperabilität, EMA-Compliance, Lieferkette und klinisches geistiges Eigentum.',
        es: 'Datos RGPD/HIPAA, interoperabilidad HL7/FHIR, cumplimiento EMA, cadena de suministro e IP clínica.',
        it: 'Dati GDPR/HIPAA, interoperabilità HL7/FHIR, conformità EMA, catena di approvvigionamento e IP clinica.',
        nl: 'AVG-/HIPAA-data, HL7/FHIR-interoperabiliteit, EMA-compliance, toeleveringsketen en klinische IP.',
      },
    },
    {
      img: '/images/blog/robot-ai.jpg',
      name: {
        fr: 'HealthTech & MedTech',
        en: 'HealthTech & MedTech',
        de: 'HealthTech & MedTech',
        es: 'HealthTech y MedTech',
        it: 'HealthTech & MedTech',
        nl: 'HealthTech & MedTech',
      },
      tag: {
        fr: 'Croissance', en: 'Growth', de: 'Wachstum',
        es: 'Crecimiento', it: 'Crescita', nl: 'Groei',
      },
      desc: {
        fr: 'IA diagnostique, conformité MDR/IVDR, données de santé, interopérabilité et valorisation pour M&A.',
        en: 'Diagnostic AI, MDR/IVDR compliance, health data, interoperability and M&A valuation.',
        de: 'Diagnose-KI, MDR-/IVDR-Compliance, Gesundheitsdaten, Interoperabilität und M&A-Bewertung.',
        es: 'IA diagnóstica, cumplimiento MDR/IVDR, datos de salud, interoperabilidad y valoración para M&A.',
        it: 'IA diagnostica, conformità MDR/IVDR, dati sanitari, interoperabilità e valorizzazione per M&A.',
        nl: 'Diagnostische AI, MDR-/IVDR-compliance, gezondheidsdata, interoperabiliteit en waardering voor M&A.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Documentation certifiée de la valeur des données cliniques, des protocoles propriétaires et de la gouvernance qualité — opposable face à un acquéreur industriel, un régulateur EMA ou un partenaire pharmaceutique.',
        en: 'Certified documentation of the value of clinical data, proprietary protocols and quality governance — enforceable against an industrial acquirer, an EMA regulator or a pharmaceutical partner.',
        de: 'Zertifizierte Dokumentation des Werts klinischer Daten, proprietärer Protokolle und der Qualitäts-Governance — belastbar gegenüber einem industriellen Käufer, einer EMA-Behörde oder einem Pharma-Partner.',
        es: 'Documentación certificada del valor de los datos clínicos, los protocolos propietarios y la gobernanza de calidad — oponible ante un comprador industrial, un regulador EMA o un socio farmacéutico.',
        it: 'Documentazione certificata del valore dei dati clinici, dei protocolli proprietari e della governance qualità — opponibile a un acquirente industriale, a un regolatore EMA o a un partner farmaceutico.',
        nl: 'Gecertificeerde documentatie van de waarde van klinische data, propriëtaire protocollen en kwaliteitsgovernance — aantoombaar tegenover een industriële koper, een EMA-toezichthouder of een farmaceutische partner.',
      },
    },
    {
      title: {
        fr: 'Conseil en Technologie',
        en: 'Technology Advisory',
        de: 'Technologieberatung',
        es: 'Consultoría Tecnológica',
        it: 'Consulenza Tecnologica',
        nl: 'Technologieadvies',
      },
      desc: {
        fr: 'Architecture HealthTech souveraine, conformité MDR/IVDR, intégration HL7/FHIR, gouvernance des données patients et sécurité des systèmes critiques de santé.',
        en: 'Sovereign HealthTech architecture, MDR/IVDR compliance, HL7/FHIR integration, patient data governance and security of critical health systems.',
        de: 'Souveräne HealthTech-Architektur, MDR-/IVDR-Compliance, HL7-/FHIR-Integration, Governance von Patientendaten und Sicherheit kritischer Gesundheitssysteme.',
        es: 'Arquitectura HealthTech soberana, cumplimiento MDR/IVDR, integración HL7/FHIR, gobernanza de datos de pacientes y seguridad de sistemas sanitarios críticos.',
        it: 'Architettura HealthTech sovrana, conformità MDR/IVDR, integrazione HL7/FHIR, governance dei dati dei pazienti e sicurezza dei sistemi sanitari critici.',
        nl: 'Soevereine HealthTech-architectuur, MDR-/IVDR-compliance, HL7/FHIR-integratie, governance van patiëntendata en beveiliging van kritieke zorgsystemen.',
      },
    },
    {
      title: {
        fr: 'Solutions sur-mesure',
        en: 'Custom Solutions',
        de: 'Massgeschneiderte Lösungen',
        es: 'Soluciones a medida',
        it: 'Soluzioni su misura',
        nl: 'Maatwerkoplossingen',
      },
      desc: {
        fr: 'Plateformes de gestion clinique, outils d\'IA diagnostique, systèmes d\'interopérabilité et data rooms sécurisées — conçus pour les contraintes réglementaires de la santé.',
        en: 'Clinical management platforms, diagnostic AI tools, interoperability systems and secure data rooms — designed for healthcare regulatory constraints.',
        de: 'Klinikmanagement-Plattformen, Diagnose-KI-Tools, Interoperabilitätssysteme und sichere Datenräume — konzipiert für die regulatorischen Anforderungen des Gesundheitswesens.',
        es: 'Plataformas de gestión clínica, herramientas de IA diagnóstica, sistemas de interoperabilidad y data rooms seguros — diseñados para las limitaciones regulatorias de la salud.',
        it: 'Piattaforme di gestione clinica, strumenti di IA diagnostica, sistemi di interoperabilità e data room sicure — progettate per i vincoli regolamentari della sanità.',
        nl: 'Klinische beheerplatforms, diagnostische AI-tools, interoperabiliteitssystemen en beveiligde datarooms — ontworpen voor de regelgevende vereisten van de zorgsector.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Structuration et accompagnement des deals pharma et HealthTech, valorisation des IP cliniques et algorithmes diagnostiques, préparation due diligence acquéreur industriel ou fonds.',
        en: 'Structuring and supporting pharma and HealthTech deals, valuing clinical IP and diagnostic algorithms, preparing due diligence for industrial acquirers or funds.',
        de: 'Strukturierung und Begleitung von Pharma- und HealthTech-Deals, Bewertung klinischer IP und Diagnosealgorithmen, Due-Diligence-Vorbereitung für industrielle Käufer oder Fonds.',
        es: 'Estructuración y acompañamiento de operaciones pharma y HealthTech, valoración de IP clínicas y algoritmos diagnósticos, preparación de due diligence para compradores industriales o fondos.',
        it: 'Strutturazione e accompagnamento di deal pharma e HealthTech, valorizzazione di IP cliniche e algoritmi diagnostici, preparazione della due diligence per acquirenti industriali o fondi.',
        nl: 'Structurering en begeleiding van pharma- en HealthTech-deals, waardering van klinische IP en diagnostische algoritmen, due-diligence-voorbereiding voor industriële kopers of fondsen.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'MedTech en croissance',
        en: 'Growing MedTech',
        de: 'MedTech im Wachstum',
        es: 'MedTech en crecimiento',
        it: 'MedTech in crescita',
        nl: 'Groeiende MedTech',
      },
      story: {
        fr: 'Vous avez développé un dispositif médical avec IA diagnostique. Un industriel pharmaceutique s\'intéresse à une acquisition, mais exige une documentation MDR/IVDR complète et une certification de la valeur de vos algorithmes avant d\'engager ses équipes de due diligence.',
        en: 'You have developed a medical device with diagnostic AI. A pharmaceutical company is interested in an acquisition, but requires complete MDR/IVDR documentation and certification of the value of your algorithms before engaging its due diligence teams.',
        de: 'Sie haben ein Medizinprodukt mit Diagnose-KI entwickelt. Ein Pharmakonzern interessiert sich für eine Übernahme, verlangt aber eine vollständige MDR-/IVDR-Dokumentation und eine Zertifizierung des Werts Ihrer Algorithmen, bevor er seine Due-Diligence-Teams beauftragt.',
        es: 'Ha desarrollado un dispositivo médico con IA diagnóstica. Una empresa farmacéutica está interesada en una adquisición, pero exige una documentación MDR/IVDR completa y una certificación del valor de sus algoritmos antes de movilizar sus equipos de due diligence.',
        it: 'Avete sviluppato un dispositivo medico con IA diagnostica. Un gruppo farmaceutico è interessato all\'acquisizione, ma richiede una documentazione MDR/IVDR completa e una certificazione del valore dei vostri algoritmi prima di attivare i team di due diligence.',
        nl: 'U heeft een medisch hulpmiddel met diagnostische AI ontwikkeld. Een farmaceutisch bedrijf is geïnteresseerd in een overname, maar eist volledige MDR-/IVDR-documentatie en een certificering van de waarde van uw algoritmen voordat het due-diligence-teams inschakelt.',
      },
      problems: [
        {
          fr: 'Préparer un dossier M&A défendable incluant la certification des algorithmes IA diagnostiques',
          en: 'Prepare a defensible M&A dossier including certification of diagnostic AI algorithms',
          de: 'Ein belastbares M&A-Dossier vorbereiten, inklusive Zertifizierung der Diagnose-KI-Algorithmen',
          es: 'Preparar un expediente M&A defendible que incluya la certificación de los algoritmos de IA diagnóstica',
          it: 'Preparare un dossier M&A difendibile includendo la certificazione degli algoritmi IA diagnostici',
          nl: 'Een verdedigbaar M&A-dossier voorbereiden inclusief certificering van de diagnostische AI-algoritmen',
        },
        {
          fr: 'Documenter la conformité MDR/IVDR de façon opposable pour un investisseur industriel',
          en: 'Document MDR/IVDR compliance in an enforceable way for an industrial investor',
          de: 'MDR-/IVDR-Compliance belastbar für einen industriellen Investor dokumentieren',
          es: 'Documentar el cumplimiento MDR/IVDR de forma oponible para un inversor industrial',
          it: 'Documentare la conformità MDR/IVDR in modo opponibile per un investitore industriale',
          nl: 'MDR-/IVDR-compliance aantoombaar documenteren voor een industriële investeerder',
        },
        {
          fr: 'Structurer la valeur IP (brevets, datasets cliniques) en actif certifiable et transmissible',
          en: 'Structure IP value (patents, clinical datasets) as a certifiable and transferable asset',
          de: 'Den IP-Wert (Patente, klinische Datensätze) als zertifizierbares und übertragbares Asset strukturieren',
          es: 'Estructurar el valor de la IP (patentes, datasets clínicos) como activo certificable y transmisible',
          it: 'Strutturare il valore IP (brevetti, dataset clinici) come asset certificabile e trasmissibile',
          nl: 'De IP-waarde (patenten, klinische datasets) structureren als certificeerbaar en overdraagbaar actief',
        },
      ],
    },
    {
      label: {
        fr: 'Groupes pharmaceutiques',
        en: 'Pharmaceutical groups',
        de: 'Pharmakonzerne',
        es: 'Grupos farmacéuticos',
        it: 'Gruppi farmaceutici',
        nl: 'Farmaceutische groepen',
      },
      story: {
        fr: 'Vous cédez une division ou externalisez un actif de R&D. Vos brevets, vos données cliniques et vos contrats fournisseurs sont dispersés. L\'acquéreur exige une data room solide et une documentation de gouvernance des données qui tient face à un audit EMA.',
        en: 'You are divesting a division or outsourcing an R&D asset. Your patents, clinical data and supplier contracts are scattered. The acquirer requires a solid data room and data governance documentation that withstands an EMA audit.',
        de: 'Sie veräussern eine Division oder lagern ein F&E-Asset aus. Ihre Patente, klinischen Daten und Lieferantenverträge sind verstreut. Der Käufer verlangt einen soliden Datenraum und eine Data-Governance-Dokumentation, die einem EMA-Audit standhält.',
        es: 'Está cediendo una división o externalizando un activo de I+D. Sus patentes, datos clínicos y contratos con proveedores están dispersos. El comprador exige un data room sólido y una documentación de gobernanza de datos que resista una auditoría EMA.',
        it: 'State cedendo una divisione o esternalizzando un asset di R&S. Brevetti, dati clinici e contratti con i fornitori sono dispersi. L\'acquirente richiede una data room solida e una documentazione di governance dei dati che regga a un audit EMA.',
        nl: 'U verkoopt een divisie of besteedt een R&D-actief uit. Uw patenten, klinische data en leverancierscontracten zijn versnipperd. De koper eist een solide dataroom en datagovernance-documentatie die een EMA-audit doorstaat.',
      },
      problems: [
        {
          fr: 'Documenter et certifier la valeur des brevets et datasets cliniques propriétaires',
          en: 'Document and certify the value of proprietary patents and clinical datasets',
          de: 'Den Wert proprietärer Patente und klinischer Datensätze dokumentieren und zertifizieren',
          es: 'Documentar y certificar el valor de las patentes y datasets clínicos propietarios',
          it: 'Documentare e certificare il valore di brevetti e dataset clinici proprietari',
          nl: 'De waarde van propriëtaire patenten en klinische datasets documenteren en certificeren',
        },
        {
          fr: 'Gouverner les transferts de données sensibles dans le cadre d\'une cession d\'actifs',
          en: 'Govern sensitive data transfers in the context of an asset sale',
          de: 'Die Übertragung sensibler Daten im Rahmen eines Asset-Verkaufs steuern',
          es: 'Gobernar las transferencias de datos sensibles en el marco de una venta de activos',
          it: 'Governare i trasferimenti di dati sensibili nell\'ambito di una cessione di asset',
          nl: 'Gevoelige data-overdrachten beheersen in het kader van een assetverkoop',
        },
        {
          fr: 'Préparer une data room certifiée défendable face à une due diligence pharmaceutique',
          en: 'Prepare a certified data room defensible against pharmaceutical due diligence',
          de: 'Einen zertifizierten Datenraum vorbereiten, der einer Pharma-Due-Diligence standhält',
          es: 'Preparar un data room certificado defendible ante una due diligence farmacéutica',
          it: 'Preparare una data room certificata difendibile in una due diligence farmaceutica',
          nl: 'Een gecertificeerde dataroom voorbereiden die standhoudt bij farmaceutische due diligence',
        },
      ],
    },
    {
      label: {
        fr: 'Investisseurs HealthTech',
        en: 'HealthTech investors',
        de: 'HealthTech-Investoren',
        es: 'Inversores HealthTech',
        it: 'Investitori HealthTech',
        nl: 'HealthTech-investeerders',
      },
      story: {
        fr: 'Vous étudiez une cible HealthTech prometteuse dont la gouvernance réglementaire et la qualité des données sont difficiles à évaluer. Avant de signer, vous avez besoin d\'une évaluation indépendante qui va au-delà des audits financiers classiques.',
        en: 'You are assessing a promising HealthTech target whose regulatory governance and data quality are difficult to evaluate. Before signing, you need an independent assessment that goes beyond traditional financial audits.',
        de: 'Sie prüfen eine vielversprechende HealthTech-Beteiligung, deren regulatorische Governance und Datenqualität schwer zu beurteilen sind. Vor der Unterzeichnung benötigen Sie eine unabhängige Bewertung, die über klassische Finanzaudits hinausgeht.',
        es: 'Está analizando una empresa HealthTech prometedora cuya gobernanza regulatoria y calidad de datos son difíciles de evaluar. Antes de firmar, necesita una evaluación independiente que vaya más allá de las auditorías financieras clásicas.',
        it: 'State valutando un target HealthTech promettente la cui governance regolamentare e qualità dei dati sono difficili da valutare. Prima di firmare, serve una valutazione indipendente che vada oltre i tradizionali audit finanziari.',
        nl: 'U beoordeelt een veelbelovend HealthTech-overnamedoel waarvan regelgevende governance en datakwaliteit moeilijk te beoordelen zijn. Vóór ondertekening heeft u een onafhankelijke beoordeling nodig die verder gaat dan klassieke financiële audits.',
      },
      problems: [
        {
          fr: 'Vérifier la robustesse réglementaire MDR/IVDR et RGPD santé d\'une cible avant investissement',
          en: 'Verify the MDR/IVDR and health GDPR regulatory robustness of a target before investing',
          de: 'Die regulatorische Robustheit (MDR/IVDR, DSGVO-Gesundheitsdaten) einer Zielgesellschaft vor der Investition prüfen',
          es: 'Verificar la robustez regulatoria MDR/IVDR y RGPD sanitario de una empresa antes de invertir',
          it: 'Verificare la robustezza regolamentare MDR/IVDR e GDPR sanitario di un target prima dell\'investimento',
          nl: 'De regelgevende robuustheid (MDR/IVDR en AVG-gezondheidsdata) van een overnamedoel vóór investering verifiëren',
        },
        {
          fr: 'Évaluer la qualité et la souveraineté des données patients comme actif de valeur',
          en: 'Assess the quality and sovereignty of patient data as a value asset',
          de: 'Qualität und Souveränität der Patientendaten als Wert-Asset beurteilen',
          es: 'Evaluar la calidad y soberanía de los datos de pacientes como activo de valor',
          it: 'Valutare qualità e sovranità dei dati dei pazienti come asset di valore',
          nl: 'De kwaliteit en soevereiniteit van patiëntendata beoordelen als waardevol actief',
        },
        {
          fr: 'Quantifier les actifs immatériels (IP clinique, algorithmes, protocoles) avec un référentiel certifié',
          en: 'Quantify intangible assets (clinical IP, algorithms, protocols) with a certified framework',
          de: 'Immaterielle Vermögenswerte (klinische IP, Algorithmen, Protokolle) mit einem zertifizierten Referenzrahmen quantifizieren',
          es: 'Cuantificar los activos intangibles (IP clínica, algoritmos, protocolos) con un marco certificado',
          it: 'Quantificare gli asset immateriali (IP clinica, algoritmi, protocolli) con un framework certificato',
          nl: 'Immateriële activa (klinische IP, algoritmen, protocollen) kwantificeren met een gecertificeerd raamwerk',
        },
      ],
    },
  ],
  articleSlugs: [
    'actif-tech-certifiable',
    'certification-independante-saas-avant-cession',
    'sante-sciences-vie-valorisation-actifs-certification-2025',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   3. INDUSTRIE, ÉNERGIE & INFRASTRUCTURE
   ════════════════════════════════════════════════════════════════════ */
const industrie: Industry = {
  slug:      'industrie-energie-infrastructure',
  clusterId: 'industrie',
  name: {
    fr: 'Industrie, Énergie & Infrastructure',
    en: 'Industry, Energy & Infrastructure',
    de: 'Industrie, Energie & Infrastruktur',
    es: 'Industria, Energía e Infraestructura',
    it: 'Industria, Energia & Infrastrutture',
    nl: 'Industrie, Energie & Infrastructuur',
  },
  img: '/images/theme_marketplace.jpg',
  imgAlt: {
    fr: 'Industrie, Énergie & Infrastructure — Aegryn',
    en: 'Industry, Energy & Infrastructure — Aegryn',
    de: 'Industrie, Energie & Infrastruktur — Aegryn',
    es: 'Industria, Energía e Infraestructura — Aegryn',
    it: 'Industria, Energia & Infrastrutture — Aegryn',
    nl: 'Industrie, Energie & Infrastructuur — Aegryn',
  },
  vision: {
    fr: `Les organisations industrielles ont une valeur souvent sous-documentée : savoir-faire opérationnel, contrats long terme, propriété intellectuelle sur les processus, réseaux de sous-traitants stratégiques. Le CIFSO 5000 donne un langage commun entre le dirigeant qui connaît sa valeur et l'investisseur qui a besoin de la vérifier.

Dans les secteurs de la transition énergétique et de l'infrastructure, la robustesse des actifs et leur transmissibilité deviennent des critères de financement décisifs.`,
    en: `Industrial organisations often have under-documented value: operational know-how, long-term contracts, intellectual property on processes, networks of strategic subcontractors. CIFSO 5000 provides a common language between the executive who knows their value and the investor who needs to verify it.

In the energy transition and infrastructure sectors, asset robustness and transferability are becoming decisive financing criteria.`,
    de: `Industrielle Organisationen haben oft einen unzureichend dokumentierten Wert: operatives Know-how, langfristige Verträge, geistiges Eigentum an Prozessen, Netzwerke strategischer Zulieferer. CIFSO 5000 schafft eine gemeinsame Sprache zwischen dem Geschäftsführer, der seinen Wert kennt, und dem Investor, der ihn verifizieren muss.

In den Bereichen Energiewende und Infrastruktur werden Robustheit und Übertragbarkeit von Assets zu entscheidenden Finanzierungskriterien.`,
    es: `Las organizaciones industriales tienen a menudo un valor insuficientemente documentado: saber hacer operativo, contratos a largo plazo, propiedad intelectual sobre los procesos, redes de subcontratistas estratégicos. CIFSO 5000 ofrece un lenguaje común entre el dirigente que conoce su valor y el inversor que necesita verificarlo.

En los sectores de la transición energética y la infraestructura, la robustez de los activos y su transmisibilidad se convierten en criterios de financiación decisivos.`,
    it: `Le organizzazioni industriali hanno spesso un valore sotto-documentato: know-how operativo, contratti di lungo periodo, proprietà intellettuale sui processi, reti di subappaltatori strategici. CIFSO 5000 offre un linguaggio comune tra il dirigente che conosce il proprio valore e l'investitore che deve verificarlo.

Nei settori della transizione energetica e delle infrastrutture, la robustezza degli asset e la loro trasmissibilità diventano criteri di finanziamento decisivi.`,
    nl: `Industriële organisaties hebben vaak een ondergedocumenteerde waarde: operationele knowhow, langetermijncontracten, intellectueel eigendom op processen, netwerken van strategische toeleveranciers. CIFSO 5000 biedt een gemeenschappelijke taal tussen de directeur die zijn waarde kent en de investeerder die die moet verifiëren.

In de sectoren energietransitie en infrastructuur worden robuustheid en overdraagbaarheid van activa beslissende financieringscriteria.`,
  },
  keyMetrics: [
    { value: '1 Tn EUR', label: {
      fr: 'investissements infrastructure Europe 2021-2027 (Commission Européenne)',
      en: 'infrastructure investment Europe 2021-2027 (European Commission)',
      de: 'Infrastrukturinvestitionen Europa 2021-2027 (Europäische Kommission)',
      es: 'inversiones en infraestructura Europa 2021-2027 (Comisión Europea)',
      it: 'investimenti in infrastrutture Europa 2021-2027 (Commissione Europea)',
      nl: 'infrastructuurinvesteringen Europa 2021-2027 (Europese Commissie)',
    }},
    { value: '500 Mrd EUR', label: {
      fr: 'financements transition énergétique prévus en Europe d\'ici 2030 (AIE 2024)',
      en: 'energy transition financing planned in Europe by 2030 (IEA 2024)',
      de: 'geplante Finanzierung der Energiewende in Europa bis 2030 (IEA 2024)',
      es: 'financiación de la transición energética prevista en Europa hasta 2030 (AIE 2024)',
      it: 'finanziamenti per la transizione energetica previsti in Europa entro il 2030 (AIE 2024)',
      nl: 'geplande financiering van de energietransitie in Europa tot 2030 (IEA 2024)',
    }},
    { value: '+31%', label: {
      fr: 'croissance M&A industrie 4.0 Europe 2023-2024 (Mergermarket 2024)',
      en: 'Industry 4.0 M&A growth Europe 2023-2024 (Mergermarket 2024)',
      de: 'Industrie-4.0-M&A-Wachstum Europa 2023-2024 (Mergermarket 2024)',
      es: 'crecimiento M&A industria 4.0 Europa 2023-2024 (Mergermarket 2024)',
      it: 'crescita M&A industria 4.0 Europa 2023-2024 (Mergermarket 2024)',
      nl: 'Industrie 4.0 M&A-groei Europa 2023-2024 (Mergermarket 2024)',
    }},
    { value: '73%', label: {
      fr: 'des PME industrielles sans documentation de valeur transmissible (CCI France 2023)',
      en: 'of industrial SMEs without transferable value documentation (CCI France 2023)',
      de: 'der industriellen KMU ohne Dokumentation übertragbaren Werts (CCI Frankreich 2023)',
      es: 'de las pymes industriales sin documentación de valor transmisible (CCI Francia 2023)',
      it: 'delle PMI industriali senza documentazione di valore trasmissibile (CCI Francia 2023)',
      nl: 'van industriële mkb-bedrijven zonder documentatie van overdraagbare waarde (CCI Frankrijk 2023)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/tech-circuit.jpg',
      name: {
        fr: 'Énergie & Utilities',
        en: 'Energy & Utilities',
        de: 'Energie & Versorger',
        es: 'Energía y Utilities',
        it: 'Energia & Utilities',
        nl: 'Energie & Utilities',
      },
      tag: {
        fr: 'Stratégique', en: 'Strategic', de: 'Strategisch',
        es: 'Estratégico',  it: 'Strategico', nl: 'Strategisch',
      },
      desc: {
        fr: 'Transition énergétique, smart grid, EU ETS, IA de gestion des actifs et résilience des infrastructures critiques.',
        en: 'Energy transition, smart grid, EU ETS, asset management AI and critical infrastructure resilience.',
        de: 'Energiewende, Smart Grid, EU ETS, KI für Asset Management und Resilienz kritischer Infrastrukturen.',
        es: 'Transición energética, smart grid, EU ETS, IA de gestión de activos y resiliencia de infraestructuras críticas.',
        it: 'Transizione energetica, smart grid, EU ETS, IA per la gestione degli asset e resilienza delle infrastrutture critiche.',
        nl: 'Energietransitie, smart grid, EU ETS, AI voor assetbeheer en weerbaarheid van kritieke infrastructuur.',
      },
    },
    {
      img: '/images/blog/factory-industry.jpg',
      name: {
        fr: 'Industrie & Manufacturing',
        en: 'Industry & Manufacturing',
        de: 'Industrie & Fertigung',
        es: 'Industria y Manufactura',
        it: 'Industria & Manifattura',
        nl: 'Industrie & Productie',
      },
      tag: {
        fr: 'Consolidation', en: 'Consolidation', de: 'Konsolidierung',
        es: 'Consolidación',  it: 'Consolidamento', nl: 'Consolidatie',
      },
      desc: {
        fr: 'Industrie 4.0, maintenance prédictive, MES/ERP, ISO qualité et base de valeur opposable.',
        en: 'Industry 4.0, predictive maintenance, MES/ERP, ISO quality and enforceable value base.',
        de: 'Industrie 4.0, vorausschauende Wartung, MES/ERP, ISO-Qualität und belastbare Wertbasis.',
        es: 'Industria 4.0, mantenimiento predictivo, MES/ERP, calidad ISO y base de valor oponible.',
        it: 'Industria 4.0, manutenzione predittiva, MES/ERP, qualità ISO e base di valore opponibile.',
        nl: 'Industrie 4.0, predictief onderhoud, MES/ERP, ISO-kwaliteit en een aantoombare waardebasis.',
      },
    },
    {
      img: '/images/blog/europe-skyline.jpg',
      name: {
        fr: 'Logistique & Supply Chain',
        en: 'Logistics & Supply Chain',
        de: 'Logistik & Lieferkette',
        es: 'Logística y Cadena de Suministro',
        it: 'Logistica & Supply Chain',
        nl: 'Logistiek & Supply Chain',
      },
      tag: {
        fr: 'Récurrent', en: 'Recurring', de: 'Wiederkehrend',
        es: 'Recurrente',  it: 'Ricorrente', nl: 'Terugkerend',
      },
      desc: {
        fr: 'Visibilité temps réel, IA optimisation flux, conformité douanière, 3PL/4PL et valeur récurrente.',
        en: 'Real-time visibility, flow optimisation AI, customs compliance, 3PL/4PL and recurring value.',
        de: 'Echtzeit-Transparenz, KI zur Flussoptimierung, Zoll-Compliance, 3PL/4PL und wiederkehrender Wert.',
        es: 'Visibilidad en tiempo real, IA de optimización de flujos, cumplimiento aduanero, 3PL/4PL y valor recurrente.',
        it: 'Visibilità in tempo reale, IA per l\'ottimizzazione dei flussi, conformità doganale, 3PL/4PL e valore ricorrente.',
        nl: 'Realtime-zichtbaarheid, AI voor stroomoptimalisatie, douanecompliance, 3PL/4PL en terugkerende waarde.',
      },
    },
    {
      img: '/images/blog/city-buildings.jpg',
      name: {
        fr: 'Construction & Infrastructure',
        en: 'Construction & Infrastructure',
        de: 'Bau & Infrastruktur',
        es: 'Construcción e Infraestructura',
        it: 'Costruzioni & Infrastrutture',
        nl: 'Bouw & Infrastructuur',
      },
      tag: {
        fr: 'Complexe', en: 'Complex', de: 'Komplex',
        es: 'Complejo',  it: 'Complesso', nl: 'Complex',
      },
      desc: {
        fr: 'BIM, maintenance prédictive, contrats complexes, sous-traitants multi-niveaux et gouvernance.',
        en: 'BIM, predictive maintenance, complex contracts, multi-level subcontractors and governance.',
        de: 'BIM, vorausschauende Wartung, komplexe Verträge, mehrstufige Subunternehmer und Governance.',
        es: 'BIM, mantenimiento predictivo, contratos complejos, subcontratistas multinivel y gobernanza.',
        it: 'BIM, manutenzione predittiva, contratti complessi, subappaltatori multilivello e governance.',
        nl: 'BIM, predictief onderhoud, complexe contracten, meervoudige onderaannemers en governance.',
      },
    },
    {
      img: '/images/blog/server-room.jpg',
      name: {
        fr: 'Aérospatiale & Défense',
        en: 'Aerospace & Defence',
        de: 'Luft- und Raumfahrt & Verteidigung',
        es: 'Aeroespacial y Defensa',
        it: 'Aerospazio & Difesa',
        nl: 'Luchtvaart & Defensie',
      },
      tag: {
        fr: 'Confidentiel', en: 'Confidential', de: 'Vertraulich',
        es: 'Confidencial',  it: 'Riservato', nl: 'Vertrouwelijk',
      },
      desc: {
        fr: 'Systèmes embarqués, IA mission, ITAR/EAR, sous-traitants stratégiques et certification confidentielle.',
        en: 'Embedded systems, mission AI, ITAR/EAR, strategic subcontractors and confidential certification.',
        de: 'Eingebettete Systeme, Missions-KI, ITAR/EAR, strategische Zulieferer und vertrauliche Zertifizierung.',
        es: 'Sistemas embarcados, IA de misión, ITAR/EAR, subcontratistas estratégicos y certificación confidencial.',
        it: 'Sistemi embedded, IA di missione, ITAR/EAR, subappaltatori strategici e certificazione riservata.',
        nl: 'Embedded systemen, missie-AI, ITAR/EAR, strategische toeleveranciers en vertrouwelijke certificering.',
      },
    },
    {
      img: '/images/blog/mobile-analytics.jpg',
      name: {
        fr: 'Automobile & Mobilité',
        en: 'Automotive & Mobility',
        de: 'Automobil & Mobilität',
        es: 'Automoción y Movilidad',
        it: 'Automotive & Mobilità',
        nl: 'Automotive & Mobiliteit',
      },
      tag: {
        fr: 'Transformation', en: 'Transformation', de: 'Transformation',
        es: 'Transformación',  it: 'Trasformazione', nl: 'Transformatie',
      },
      desc: {
        fr: 'IA embarquée, Tier-1/2, électrification et MaaS — opportunités M&A inter-constructeurs.',
        en: 'Embedded AI, Tier-1/2 suppliers, electrification and MaaS — cross-OEM M&A opportunities.',
        de: 'Eingebettete KI, Tier-1/2-Zulieferer, Elektrifizierung und MaaS — M&A-Chancen zwischen Herstellern.',
        es: 'IA embarcada, proveedores Tier-1/2, electrificación y MaaS — oportunidades M&A entre fabricantes.',
        it: 'IA embedded, fornitori Tier-1/2, elettrificazione e MaaS — opportunità M&A tra costruttori.',
        nl: 'Embedded AI, Tier-1/2-leveranciers, elektrificatie en MaaS — M&A-kansen tussen fabrikanten.',
      },
    },
    {
      img: '/images/blog/alpine-swiss.jpg',
      name: {
        fr: 'Agriculture & Agroalimentaire',
        en: 'Agriculture & Agri-food',
        de: 'Landwirtschaft & Ernährung',
        es: 'Agricultura y Agroalimentación',
        it: 'Agricoltura & Agroalimentare',
        nl: 'Landbouw & Voeding',
      },
      tag: {
        fr: 'ESG', en: 'ESG', de: 'ESG',
        es: 'ESG',  it: 'ESG', nl: 'ESG',
      },
      desc: {
        fr: 'Traçabilité, IA rendement, conformité sanitaire et IP propriétaires à certifier.',
        en: 'Traceability, yield AI, sanitary compliance and proprietary IP to certify.',
        de: 'Rückverfolgbarkeit, Ertrags-KI, Lebensmittel-Compliance und zu zertifizierendes proprietäres geistiges Eigentum.',
        es: 'Trazabilidad, IA de rendimiento, cumplimiento sanitario e IP propietaria por certificar.',
        it: 'Tracciabilità, IA per i rendimenti, conformità sanitaria e IP proprietarie da certificare.',
        nl: 'Traceerbaarheid, opbrengst-AI, voedselveiligheidscompliance en te certificeren propriëtaire IP.',
      },
    },
    {
      img: '/images/blog/analytics-graphs.jpg',
      name: {
        fr: 'Chimie & Matériaux Avancés',
        en: 'Chemicals & Advanced Materials',
        de: 'Chemie & Hochleistungsmaterialien',
        es: 'Química y Materiales Avanzados',
        it: 'Chimica & Materiali Avanzati',
        nl: 'Chemie & Geavanceerde Materialen',
      },
      tag: {
        fr: 'IP forte', en: 'Strong IP', de: 'Starke IP',
        es: 'IP fuerte',  it: 'Forte IP', nl: 'Sterke IP',
      },
      desc: {
        fr: 'R&D data, REACH, contrats fournisseurs et propriété intellectuelle spécialisée.',
        en: 'R&D data, REACH, supplier contracts and specialised intellectual property.',
        de: 'F&E-Daten, REACH, Lieferantenverträge und spezialisiertes geistiges Eigentum.',
        es: 'Datos de I+D, REACH, contratos con proveedores y propiedad intelectual especializada.',
        it: 'Dati di R&S, REACH, contratti con i fornitori e proprietà intellettuale specializzata.',
        nl: 'R&D-data, REACH, leverancierscontracten en gespecialiseerd intellectueel eigendom.',
      },
    },
    {
      img: '/images/blog/office-building.jpg',
      name: {
        fr: 'Transport & Fret',
        en: 'Transport & Freight',
        de: 'Transport & Fracht',
        es: 'Transporte y Carga',
        it: 'Trasporti & Merci',
        nl: 'Transport & Vracht',
      },
      tag: {
        fr: 'Consolidation', en: 'Consolidation', de: 'Konsolidierung',
        es: 'Consolidación',  it: 'Consolidamento', nl: 'Consolidatie',
      },
      desc: {
        fr: 'Optimisation de flotte, conformité transport, plateformes digitales et valeur documentée.',
        en: 'Fleet optimisation, transport compliance, digital platforms and documented value.',
        de: 'Flottenoptimierung, Transport-Compliance, digitale Plattformen und dokumentierter Wert.',
        es: 'Optimización de flotas, cumplimiento del transporte, plataformas digitales y valor documentado.',
        it: 'Ottimizzazione della flotta, conformità dei trasporti, piattaforme digitali e valore documentato.',
        nl: 'Vlootoptimalisatie, transportcompliance, digitale platforms en gedocumenteerde waarde.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Documentation certifiée du savoir-faire opérationnel, des contrats long terme, des processus propriétaires et de la gouvernance industrielle — base défendable pour tout financement, cession ou succession d\'ETI.',
        en: 'Certified documentation of operational know-how, long-term contracts, proprietary processes and industrial governance — a defensible basis for any financing, sale or mid-cap succession.',
        de: 'Zertifizierte Dokumentation von operativem Know-how, langfristigen Verträgen, proprietären Prozessen und industrieller Governance — belastbare Basis für jede Finanzierung, jeden Verkauf oder jede Nachfolge eines Mid-Cap.',
        es: 'Documentación certificada del saber hacer operativo, los contratos a largo plazo, los procesos propietarios y la gobernanza industrial — base defendible para cualquier financiación, venta o sucesión de una ETI.',
        it: 'Documentazione certificata del know-how operativo, dei contratti di lungo periodo, dei processi proprietari e della governance industriale — base difendibile per qualsiasi finanziamento, cessione o successione di una mid-cap.',
        nl: 'Gecertificeerde documentatie van operationele knowhow, langetermijncontracten, propriëtaire processen en industriële governance — een verdedigbare basis voor elke financiering, verkoop of opvolging van een midcap.',
      },
    },
    {
      title: {
        fr: 'Conseil en Stratégie',
        en: 'Strategy Advisory',
        de: 'Strategieberatung',
        es: 'Consultoría de Estrategia',
        it: 'Consulenza Strategica',
        nl: 'Strategieadvies',
      },
      desc: {
        fr: 'Positionnement dans les vagues de consolidation sectorielle (énergie, logistique, agroalimentaire), gouvernance dirigeante et planification de la transition industrielle et numérique.',
        en: 'Positioning in sector consolidation waves (energy, logistics, agri-food), executive governance and planning of industrial and digital transition.',
        de: 'Positionierung in sektoralen Konsolidierungswellen (Energie, Logistik, Ernährung), Führungs-Governance und Planung der industriellen und digitalen Transformation.',
        es: 'Posicionamiento en las olas de consolidación sectorial (energía, logística, agroalimentación), gobernanza directiva y planificación de la transición industrial y digital.',
        it: 'Posizionamento nelle ondate di consolidamento settoriale (energia, logistica, agroalimentare), governance dirigenziale e pianificazione della transizione industriale e digitale.',
        nl: 'Positionering in sectorale consolidatiegolven (energie, logistiek, voeding), directiegovernance en planning van de industriële en digitale transitie.',
      },
    },
    {
      title: {
        fr: 'Conseil en Technologie',
        en: 'Technology Advisory',
        de: 'Technologieberatung',
        es: 'Consultoría Tecnológica',
        it: 'Consulenza Tecnologica',
        nl: 'Technologieadvies',
      },
      desc: {
        fr: 'Architecture Industrie 4.0, intégration MES/ERP, surveillance prédictive, conformité NIS2 et souveraineté des données industrielles opérationnelles.',
        en: 'Industry 4.0 architecture, MES/ERP integration, predictive monitoring, NIS2 compliance and sovereignty of operational industrial data.',
        de: 'Industrie-4.0-Architektur, MES-/ERP-Integration, vorausschauende Überwachung, NIS2-Compliance und Souveränität über operative Industriedaten.',
        es: 'Arquitectura Industria 4.0, integración MES/ERP, monitorización predictiva, cumplimiento NIS2 y soberanía de los datos industriales operativos.',
        it: 'Architettura Industria 4.0, integrazione MES/ERP, monitoraggio predittivo, conformità NIS2 e sovranità dei dati industriali operativi.',
        nl: 'Industrie 4.0-architectuur, MES/ERP-integratie, predictieve monitoring, NIS2-compliance en soevereiniteit van operationele industriële data.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Préparation à la cession d\'ETI industrielle, structuration des processus acheteur/vendeur, valorisation des actifs opérationnels incorporels et accompagnement closing.',
        en: 'Preparation for the sale of an industrial mid-cap, structuring of buyer/seller processes, valuation of intangible operational assets and closing support.',
        de: 'Vorbereitung auf den Verkauf eines industriellen Mid-Cap, Strukturierung der Käufer-/Verkäuferprozesse, Bewertung immaterieller operativer Assets und Closing-Begleitung.',
        es: 'Preparación para la venta de una ETI industrial, estructuración de los procesos comprador/vendedor, valoración de los activos operativos intangibles y acompañamiento del cierre.',
        it: 'Preparazione alla cessione di una mid-cap industriale, strutturazione dei processi acquirente/venditore, valorizzazione degli asset operativi intangibili e supporto al closing.',
        nl: 'Voorbereiding op de verkoop van een industriële midcap, structurering van koper-/verkoperprocessen, waardering van immateriële operationele activa en closing-begeleiding.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'ETI & PME industrielles',
        en: 'Industrial mid-caps & SMEs',
        de: 'Industrielle Mid-Caps & KMU',
        es: 'ETI y pymes industriales',
        it: 'Mid-cap e PMI industriali',
        nl: 'Industriële midcaps & mkb',
      },
      story: {
        fr: 'Vous dirigez une ETI industrielle en Suisse ou en Europe. La transmission approche — familiale, à un fonds ou à un repreneur industriel. Votre valeur est réelle mais peu documentée : savoir-faire, contrats long terme, dépendances sous-traitants. Les banques et les acquéreurs demandent des preuves.',
        en: 'You run an industrial mid-cap in Switzerland or Europe. Succession is approaching — family, a fund or an industrial buyer. Your value is real but poorly documented: know-how, long-term contracts, subcontractor dependencies. Banks and acquirers are asking for proof.',
        de: 'Sie führen einen industriellen Mid-Cap in der Schweiz oder in Europa. Die Übergabe naht — familienintern, an einen Fonds oder an einen industriellen Nachfolger. Ihr Wert ist real, aber kaum dokumentiert: Know-how, langfristige Verträge, Zulieferer-Abhängigkeiten. Banken und Käufer verlangen Nachweise.',
        es: 'Dirige una ETI industrial en Suiza o Europa. La transmisión se acerca — familiar, a un fondo o a un comprador industrial. Su valor es real pero está poco documentado: saber hacer, contratos a largo plazo, dependencias de subcontratistas. Los bancos y los compradores piden pruebas.',
        it: 'Dirigete una mid-cap industriale in Svizzera o in Europa. Il passaggio si avvicina — familiare, a un fondo o a un acquirente industriale. Il valore è reale ma poco documentato: know-how, contratti di lungo periodo, dipendenze da subappaltatori. Banche e acquirenti chiedono prove.',
        nl: 'U leidt een industriële midcap in Zwitserland of Europa. De overdracht nadert — familiair, aan een fonds of aan een industriële overnemer. Uw waarde is reëel maar slecht gedocumenteerd: knowhow, langetermijncontracten, toeleveranciersafhankelijkheden. Banken en kopers vragen om bewijs.',
      },
      problems: [
        {
          fr: 'Documenter et certifier la valeur transmissible avant une cession ou une succession familiale',
          en: 'Document and certify transferable value before a sale or family succession',
          de: 'Übertragbaren Wert vor einem Verkauf oder einer familiären Nachfolge dokumentieren und zertifizieren',
          es: 'Documentar y certificar el valor transmisible antes de una venta o una sucesión familiar',
          it: 'Documentare e certificare il valore trasmissibile prima di una cessione o di una successione familiare',
          nl: 'Overdraagbare waarde documenteren en certificeren vóór een verkoop of familiale opvolging',
        },
        {
          fr: 'Obtenir un financement bancaire basé sur les actifs incorporels opérationnels',
          en: 'Obtain bank financing based on operational intangible assets',
          de: 'Bankfinanzierung auf Basis operativer immaterieller Vermögenswerte erhalten',
          es: 'Obtener financiación bancaria basada en los activos intangibles operativos',
          it: 'Ottenere un finanziamento bancario basato sugli asset intangibili operativi',
          nl: 'Bankfinanciering verkrijgen op basis van immateriële operationele activa',
        },
        {
          fr: 'Préparer une due diligence acheteur industriel ou fonds dans les délais d\'un process M&A',
          en: 'Prepare for industrial buyer or fund due diligence within M&A process timelines',
          de: 'Eine Due Diligence für industrielle Käufer oder Fonds innerhalb der M&A-Fristen vorbereiten',
          es: 'Preparar una due diligence de comprador industrial o fondo dentro de los plazos de un proceso M&A',
          it: 'Preparare una due diligence per acquirente industriale o fondo entro i tempi di un processo M&A',
          nl: 'Een due diligence voor een industriële koper of fonds voorbereiden binnen de termijnen van een M&A-proces',
        },
      ],
    },
    {
      label: {
        fr: 'Fonds PE & Infrastructure',
        en: 'PE & Infrastructure funds',
        de: 'PE- & Infrastrukturfonds',
        es: 'Fondos PE e Infraestructura',
        it: 'Fondi PE & Infrastrutture',
        nl: 'PE- & infrastructuurfondsen',
      },
      story: {
        fr: 'Vous investissez dans une cible industrielle ou d\'infrastructure en Europe. La valorisation repose sur des actifs opérationnels difficiles à auditer : savoir-faire, contrats fournisseurs, personnes-clés, processus propriétaires. Vous avez besoin d\'une évaluation indépendante avant de signer.',
        en: 'You are investing in an industrial or infrastructure target in Europe. The valuation rests on operational assets that are difficult to audit: know-how, supplier contracts, key people, proprietary processes. You need an independent assessment before signing.',
        de: 'Sie investieren in eine Industrie- oder Infrastruktur-Beteiligung in Europa. Die Bewertung beruht auf schwer auditierbaren operativen Assets: Know-how, Lieferantenverträge, Schlüsselpersonen, proprietäre Prozesse. Sie benötigen eine unabhängige Bewertung vor der Unterzeichnung.',
        es: 'Invierte en una empresa industrial o de infraestructura en Europa. La valoración descansa en activos operativos difíciles de auditar: saber hacer, contratos con proveedores, personas clave, procesos propietarios. Necesita una evaluación independiente antes de firmar.',
        it: 'Investite in un target industriale o infrastrutturale in Europa. La valutazione si fonda su asset operativi difficili da verificare: know-how, contratti con i fornitori, persone chiave, processi proprietari. Serve una valutazione indipendente prima della firma.',
        nl: 'U investeert in een industrieel of infrastructuur-overnamedoel in Europa. De waardering berust op moeilijk te auditen operationele activa: knowhow, leverancierscontracten, sleutelfiguren, propriëtaire processen. U heeft een onafhankelijke beoordeling nodig vóór ondertekening.',
      },
      problems: [
        {
          fr: 'Vérifier la robustesse opérationnelle et la dépendance aux personnes-clés d\'une cible industrielle',
          en: 'Verify the operational robustness and key-person dependency of an industrial target',
          de: 'Operative Robustheit und Schlüsselpersonen-Abhängigkeit einer Industrie-Zielgesellschaft prüfen',
          es: 'Verificar la robustez operativa y la dependencia de personas clave de una empresa industrial objetivo',
          it: 'Verificare la robustezza operativa e la dipendenza da persone chiave di un target industriale',
          nl: 'De operationele robuustheid en sleutelfiguur-afhankelijkheid van een industrieel overnamedoel verifiëren',
        },
        {
          fr: 'Évaluer les actifs incorporels (process, IP opérationnelle, contrats) avec un référentiel certifié',
          en: 'Assess intangible assets (processes, operational IP, contracts) with a certified framework',
          de: 'Immaterielle Vermögenswerte (Prozesse, operative IP, Verträge) mit einem zertifizierten Referenzrahmen bewerten',
          es: 'Evaluar los activos intangibles (procesos, IP operativa, contratos) con un marco certificado',
          it: 'Valutare gli asset immateriali (processi, IP operativa, contratti) con un framework certificato',
          nl: 'Immateriële activa (processen, operationele IP, contracten) beoordelen met een gecertificeerd raamwerk',
        },
        {
          fr: 'Défendre la thèse de valeur auprès des co-investisseurs et des LPs avec une certification opposable',
          en: 'Defend the value thesis to co-investors and LPs with enforceable certification',
          de: 'Die Wertthese gegenüber Co-Investoren und LPs mit einer belastbaren Zertifizierung verteidigen',
          es: 'Defender la tesis de valor ante co-inversores y LP con una certificación oponible',
          it: 'Difendere la tesi di valore presso co-investitori e LP con una certificazione opponibile',
          nl: 'De waardethese verdedigen bij co-investeerders en LP\'s met een aantoombare certificering',
        },
      ],
    },
    {
      label: {
        fr: 'Opérateurs énergie & utilities',
        en: 'Energy & utility operators',
        de: 'Energie- & Versorgungsbetreiber',
        es: 'Operadores de energía y utilities',
        it: 'Operatori energia & utilities',
        nl: 'Energie- & utilityoperatoren',
      },
      story: {
        fr: 'Vous gérez des actifs d\'infrastructure critique — smart grid, production renouvelable, réseau de distribution. Vos régulateurs demandent des preuves de résilience, vos financeurs green bond exigent une documentation ESG et vous envisagez de valoriser vos plateformes digitales propriétaires.',
        en: 'You manage critical infrastructure assets — smart grid, renewable generation, distribution networks. Your regulators demand proof of resilience, your green bond financiers require ESG documentation, and you are considering monetising your proprietary digital platforms.',
        de: 'Sie betreiben kritische Infrastruktur — Smart Grid, Erneuerbare-Energien-Erzeugung, Verteilnetze. Ihre Regulatoren verlangen Resilienznachweise, Ihre Green-Bond-Finanzierer ESG-Dokumentation, und Sie erwägen, Ihre proprietären digitalen Plattformen zu monetarisieren.',
        es: 'Gestiona activos de infraestructura crítica — smart grid, generación renovable, redes de distribución. Sus reguladores piden pruebas de resiliencia, sus financiadores de green bonds exigen documentación ESG y usted considera valorizar sus plataformas digitales propietarias.',
        it: 'Gestite asset di infrastruttura critica — smart grid, produzione rinnovabile, reti di distribuzione. I regolatori chiedono prove di resilienza, i finanziatori green bond esigono documentazione ESG e state valutando di valorizzare le vostre piattaforme digitali proprietarie.',
        nl: 'U beheert kritieke-infrastructuuractiva — smart grid, hernieuwbare opwekking, distributienetwerken. Uw toezichthouders eisen weerbaarheidsbewijs, uw green-bond-financiers eisen ESG-documentatie en u overweegt uw propriëtaire digitale platforms te monetariseren.',
      },
      problems: [
        {
          fr: 'Documenter et certifier la résilience opérationnelle pour un audit réglementaire sectoriel',
          en: 'Document and certify operational resilience for a sector regulatory audit',
          de: 'Operative Resilienz für ein sektorales Regulierungsaudit dokumentieren und zertifizieren',
          es: 'Documentar y certificar la resiliencia operativa para una auditoría regulatoria sectorial',
          it: 'Documentare e certificare la resilienza operativa per un audit regolamentare di settore',
          nl: 'Operationele weerbaarheid documenteren en certificeren voor een sectorale regelgevende audit',
        },
        {
          fr: 'Préparer les actifs digitaux propriétaires à un financement green bond ou infrastructure fund',
          en: 'Prepare proprietary digital assets for green bond or infrastructure fund financing',
          de: 'Proprietäre digitale Assets für eine Green-Bond- oder Infrastrukturfonds-Finanzierung vorbereiten',
          es: 'Preparar los activos digitales propietarios para una financiación green bond o fondo de infraestructura',
          it: 'Preparare gli asset digitali proprietari per un finanziamento green bond o fondo infrastrutture',
          nl: 'Propriëtaire digitale activa voorbereiden op green-bond- of infrastructuurfondsfinanciering',
        },
        {
          fr: 'Valoriser les plateformes de gestion énergétique comme actifs certifiables et transmissibles',
          en: 'Value energy management platforms as certifiable and transferable assets',
          de: 'Energiemanagement-Plattformen als zertifizierbare und übertragbare Assets bewerten',
          es: 'Valorizar las plataformas de gestión energética como activos certificables y transmisibles',
          it: 'Valorizzare le piattaforme di gestione energetica come asset certificabili e trasmissibili',
          nl: 'Energiebeheerplatforms waarderen als certificeerbare en overdraagbare activa',
        },
      ],
    },
  ],
  articleSlugs: [
    'small-mid-cap-enjeux-entreprises-50-300m',
    'preparer-organisation-cession-levee-5-points',
    'industrie-energie-infrastructure-valeur-transmissible-2025',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   4. COMMERCE, SERVICES & EXPÉRIENCE CLIENT
   ════════════════════════════════════════════════════════════════════ */
const commerce: Industry = {
  slug:      'commerce-services-experience-client',
  clusterId: 'commerce',
  name: {
    fr: 'Commerce, Services & Expérience Client',
    en: 'Commerce, Services & Customer Experience',
    de: 'Handel, Dienstleistungen & Kundenerlebnis',
    es: 'Comercio, Servicios y Experiencia de Cliente',
    it: 'Commercio, Servizi & Customer Experience',
    nl: 'Handel, Diensten & Klantervaring',
  },
  img: '/images/theme_saas.jpg',
  imgAlt: {
    fr: 'Commerce, Services & Expérience Client — Aegryn',
    en: 'Commerce, Services & Customer Experience — Aegryn',
    de: 'Handel, Dienstleistungen & Kundenerlebnis — Aegryn',
    es: 'Comercio, Servicios y Experiencia de Cliente — Aegryn',
    it: 'Commercio, Servizi & Customer Experience — Aegryn',
    nl: 'Handel, Diensten & Klantervaring — Aegryn',
  },
  vision: {
    fr: `Les organisations du commerce, des services et de l'expérience client naviguent entre des cycles d'innovation très courts, des attentes consommateurs en transformation permanente et une pression réglementaire croissante sur les données et la publicité numérique.

Leur valeur repose sur la fidélité client, les données propriétaires et la robustesse des plateformes. La Certification CIFSO 5000 structure ce capital immatériel en un référentiel indépendant et défendable face aux investisseurs et acquéreurs.`,
    en: `Commerce, services and customer experience organisations navigate between very short innovation cycles, permanently evolving consumer expectations and growing regulatory pressure on data and digital advertising.

Their value rests on customer loyalty, proprietary data and platform robustness. CIFSO 5000 Certification structures this intangible capital into an independent framework that is defensible to investors and acquirers.`,
    de: `Organisationen aus Handel, Dienstleistungen und Kundenerlebnis bewegen sich zwischen sehr kurzen Innovationszyklen, sich permanent wandelnden Verbrauchererwartungen und wachsendem regulatorischem Druck auf Daten und digitale Werbung.

Ihr Wert beruht auf Kundenloyalität, proprietären Daten und der Robustheit der Plattformen. Die CIFSO-5000-Zertifizierung strukturiert dieses immaterielle Kapital zu einem unabhängigen Referenzrahmen, der gegenüber Investoren und Käufern Bestand hat.`,
    es: `Las organizaciones de comercio, servicios y experiencia de cliente navegan entre ciclos de innovación muy cortos, expectativas de consumidores en transformación permanente y una presión regulatoria creciente sobre los datos y la publicidad digital.

Su valor descansa en la fidelidad del cliente, los datos propietarios y la robustez de las plataformas. La Certificación CIFSO 5000 estructura este capital intangible en un marco independiente y defendible ante inversores y compradores.`,
    it: `Le organizzazioni del commercio, dei servizi e della customer experience navigano tra cicli di innovazione molto brevi, aspettative dei consumatori in trasformazione permanente e una pressione regolamentare crescente su dati e pubblicità digitale.

Il loro valore si fonda sulla fedeltà dei clienti, sui dati proprietari e sulla robustezza delle piattaforme. La Certificazione CIFSO 5000 struttura questo capitale immateriale in un framework indipendente e difendibile di fronte a investitori e acquirenti.`,
    nl: `Organisaties in handel, diensten en klantervaring bewegen zich tussen zeer korte innovatiecycli, permanent veranderende consumentenverwachtingen en groeiende regelgevende druk op data en digitale reclame.

Hun waarde berust op klantloyaliteit, propriëtaire data en de robuustheid van platforms. De CIFSO 5000-certificering structureert dit immateriële kapitaal in een onafhankelijk raamwerk dat verdedigbaar is tegenover investeerders en kopers.`,
  },
  keyMetrics: [
    { value: '887 Mrd EUR', label: {
      fr: 'e-commerce Europe 2024 (Eurostat / E-commerce Europe)',
      en: 'e-commerce Europe 2024 (Eurostat / E-commerce Europe)',
      de: 'E-Commerce Europa 2024 (Eurostat / E-commerce Europe)',
      es: 'e-commerce Europa 2024 (Eurostat / E-commerce Europe)',
      it: 'e-commerce Europa 2024 (Eurostat / E-commerce Europe)',
      nl: 'e-commerce Europa 2024 (Eurostat / E-commerce Europe)',
    }},
    { value: '11,5 Mrd EUR', label: {
      fr: 'M&A retail & services Europe 2023 (Refinitiv 2024)',
      en: 'retail & services M&A Europe 2023 (Refinitiv 2024)',
      de: 'Retail- & Services-M&A Europa 2023 (Refinitiv 2024)',
      es: 'M&A retail y servicios Europa 2023 (Refinitiv 2024)',
      it: 'M&A retail e servizi Europa 2023 (Refinitiv 2024)',
      nl: 'retail- & diensten-M&A Europa 2023 (Refinitiv 2024)',
    }},
    { value: '66%', label: {
      fr: 'des deals retail bloqués par des manques de documentation data clients (Gartner 2023)',
      en: 'of retail deals blocked by customer data documentation gaps (Gartner 2023)',
      de: 'der Retail-Deals scheitern an fehlender Kundendaten-Dokumentation (Gartner 2023)',
      es: 'de las operaciones retail bloqueadas por falta de documentación de datos de clientes (Gartner 2023)',
      it: 'dei deal retail bloccati da carenze di documentazione dei dati clienti (Gartner 2023)',
      nl: 'van retail-deals geblokkeerd door ontbrekende klantdata-documentatie (Gartner 2023)',
    }},
    { value: '4,6 Mrd EUR', label: {
      fr: 'tourisme & hôtellerie M&A Europe 2023 (UNWTO / Dealroom)',
      en: 'tourism & hospitality M&A Europe 2023 (UNWTO / Dealroom)',
      de: 'Tourismus- & Hotel-M&A Europa 2023 (UNWTO / Dealroom)',
      es: 'M&A turismo y hotelería Europa 2023 (UNWTO / Dealroom)',
      it: 'M&A turismo e hotellerie Europa 2023 (UNWTO / Dealroom)',
      nl: 'toerisme- & horeca-M&A Europa 2023 (UNWTO / Dealroom)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/ecommerce-shop.jpg',
      name: {
        fr: 'Retail & E-commerce',
        en: 'Retail & E-commerce',
        de: 'Retail & E-Commerce',
        es: 'Retail y E-commerce',
        it: 'Retail & E-commerce',
        nl: 'Retail & E-commerce',
      },
      tag: {
        fr: 'Masse', en: 'Mass market', de: 'Massenmarkt',
        es: 'Masivo',  it: 'Mass market', nl: 'Massamarkt',
      },
      desc: {
        fr: 'Plateformes omnicanales, IA personnalisation, logistique last-mile et données first-party défendables.',
        en: 'Omnichannel platforms, personalisation AI, last-mile logistics and defensible first-party data.',
        de: 'Omnichannel-Plattformen, Personalisierungs-KI, Last-Mile-Logistik und belastbare First-Party-Daten.',
        es: 'Plataformas omnicanal, IA de personalización, logística last-mile y datos first-party defendibles.',
        it: 'Piattaforme omnicanale, IA di personalizzazione, logistica last-mile e dati first-party difendibili.',
        nl: 'Omnichannel-platforms, personalisatie-AI, last-mile-logistiek en verdedigbare first-party-data.',
      },
    },
    {
      img: '/images/blog/business-meeting.jpg',
      name: {
        fr: 'Hôtellerie & Tourisme',
        en: 'Hospitality & Tourism',
        de: 'Hotellerie & Tourismus',
        es: 'Hotelería y Turismo',
        it: 'Hotellerie & Turismo',
        nl: 'Horeca & Toerisme',
      },
      tag: {
        fr: 'Récupération', en: 'Recovery', de: 'Erholung',
        es: 'Recuperación',  it: 'Ripresa', nl: 'Herstel',
      },
      desc: {
        fr: 'Revenue management, expérience digitale, ESG et valorisation des marques hôtelières pour cession.',
        en: 'Revenue management, digital experience, ESG and hotel brand valuation for sale.',
        de: 'Revenue Management, digitales Erlebnis, ESG und Bewertung von Hotelmarken für den Verkauf.',
        es: 'Revenue management, experiencia digital, ESG y valoración de marcas hoteleras para la venta.',
        it: 'Revenue management, esperienza digitale, ESG e valorizzazione dei marchi alberghieri per la cessione.',
        nl: 'Revenue management, digitale ervaring, ESG en waardering van hotelmerken voor verkoop.',
      },
    },
    {
      img: '/images/blog/executive-suit.jpg',
      name: {
        fr: 'Luxe & Retail Premium',
        en: 'Luxury & Premium Retail',
        de: 'Luxus & Premium-Retail',
        es: 'Lujo y Retail Premium',
        it: 'Lusso & Retail Premium',
        nl: 'Luxe & Premium Retail',
      },
      tag: {
        fr: 'IP forte', en: 'Strong IP', de: 'Starke IP',
        es: 'IP fuerte',  it: 'Forte IP', nl: 'Sterke IP',
      },
      desc: {
        fr: 'Marques, exclusivité, données clientèle premium et gouvernance IP dans les structures de groupe.',
        en: 'Brands, exclusivity, premium customer data and IP governance within group structures.',
        de: 'Marken, Exklusivität, Premium-Kundendaten und IP-Governance in Konzernstrukturen.',
        es: 'Marcas, exclusividad, datos de clientela premium y gobernanza de IP en estructuras de grupo.',
        it: 'Marchi, esclusività, dati di clientela premium e governance IP nelle strutture di gruppo.',
        nl: 'Merken, exclusiviteit, premium-klantdata en IP-governance binnen groepsstructuren.',
      },
    },
    {
      img: '/images/blog/startup-team.jpg',
      name: {
        fr: 'Médias & Entertainment',
        en: 'Media & Entertainment',
        de: 'Medien & Entertainment',
        es: 'Medios y Entretenimiento',
        it: 'Media & Entertainment',
        nl: 'Media & Entertainment',
      },
      tag: {
        fr: 'Disruption', en: 'Disruption', de: 'Disruption',
        es: 'Disrupción',  it: 'Disruption', nl: 'Disruptie',
      },
      desc: {
        fr: 'Streaming, gaming, IP contenus, monétisation et régulation DSA/droits voisins.',
        en: 'Streaming, gaming, content IP, monetisation and DSA/neighbouring rights regulation.',
        de: 'Streaming, Gaming, Content-IP, Monetarisierung und DSA-/Leistungsschutzrechte-Regulierung.',
        es: 'Streaming, gaming, IP de contenidos, monetización y regulación DSA/derechos conexos.',
        it: 'Streaming, gaming, IP dei contenuti, monetizzazione e regolazione DSA/diritti connessi.',
        nl: 'Streaming, gaming, content-IP, monetisatie en DSA-/naburige-rechten-regulering.',
      },
    },
    {
      img: '/images/blog/mobile-app.jpg',
      name: {
        fr: 'Télécommunications',
        en: 'Telecommunications',
        de: 'Telekommunikation',
        es: 'Telecomunicaciones',
        it: 'Telecomunicazioni',
        nl: 'Telecommunicatie',
      },
      tag: {
        fr: 'Réglementé', en: 'Regulated', de: 'Reguliert',
        es: 'Regulado',   it: 'Regolamentato', nl: 'Gereguleerd',
      },
      desc: {
        fr: 'Infrastructures, conformité BEREC, déploiement fibre/5G et valorisation des bases abonnés.',
        en: 'Infrastructure, BEREC compliance, fibre/5G rollout and subscriber base valuation.',
        de: 'Infrastruktur, BEREC-Compliance, Glasfaser-/5G-Ausbau und Bewertung der Abonnentenbasis.',
        es: 'Infraestructuras, cumplimiento BEREC, despliegue fibra/5G y valoración de las bases de abonados.',
        it: 'Infrastrutture, conformità BEREC, deployment fibra/5G e valorizzazione delle basi abbonati.',
        nl: 'Infrastructuur, BEREC-compliance, glasvezel-/5G-uitrol en waardering van abonneebases.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Documentation certifiée des données clients first-party, des marques, des plateformes propriétaires et des IP contenus — base opposable pour M&A, financement ou succession dans les secteurs du commerce et des services.',
        en: 'Certified documentation of first-party customer data, brands, proprietary platforms and content IP — an enforceable basis for M&A, financing or succession in commerce and services.',
        de: 'Zertifizierte Dokumentation von First-Party-Kundendaten, Marken, proprietären Plattformen und Content-IP — belastbare Basis für M&A, Finanzierung oder Nachfolge in Handel und Dienstleistungen.',
        es: 'Documentación certificada de los datos de clientes first-party, las marcas, las plataformas propietarias y la IP de contenidos — base oponible para M&A, financiación o sucesión en comercio y servicios.',
        it: 'Documentazione certificata dei dati clienti first-party, dei marchi, delle piattaforme proprietarie e delle IP dei contenuti — base opponibile per M&A, finanziamento o successione nel commercio e nei servizi.',
        nl: 'Gecertificeerde documentatie van first-party-klantdata, merken, propriëtaire platforms en content-IP — een aantoombare basis voor M&A, financiering of opvolging in handel en diensten.',
      },
    },
    {
      title: {
        fr: 'Conseil en Stratégie',
        en: 'Strategy Advisory',
        de: 'Strategieberatung',
        es: 'Consultoría de Estrategia',
        it: 'Consulenza Strategica',
        nl: 'Strategieadvies',
      },
      desc: {
        fr: 'Positionnement omnicanal, transformation du modèle économique face aux plateformes, consolidation sectorielle retail et planification de la croissance internationale.',
        en: 'Omnichannel positioning, business model transformation against platforms, retail sector consolidation and international growth planning.',
        de: 'Omnichannel-Positionierung, Geschäftsmodell-Transformation gegenüber Plattformen, sektorale Retail-Konsolidierung und Planung des internationalen Wachstums.',
        es: 'Posicionamiento omnicanal, transformación del modelo de negocio frente a las plataformas, consolidación sectorial retail y planificación del crecimiento internacional.',
        it: 'Posizionamento omnicanale, trasformazione del modello di business rispetto alle piattaforme, consolidamento settoriale retail e pianificazione della crescita internazionale.',
        nl: 'Omnichannel-positionering, transformatie van het verdienmodel tegenover platforms, sectorale retailconsolidatie en planning van internationale groei.',
      },
    },
    {
      title: {
        fr: 'Solutions sur-mesure',
        en: 'Custom Solutions',
        de: 'Massgeschneiderte Lösungen',
        es: 'Soluciones a medida',
        it: 'Soluzioni su misura',
        nl: 'Maatwerkoplossingen',
      },
      desc: {
        fr: 'Plateformes e-commerce propriétaires, outils de personnalisation IA, systèmes de fidélité avancés et intégrations ERP/CRM — conçus pour la performance et la certification.',
        en: 'Proprietary e-commerce platforms, AI personalisation tools, advanced loyalty systems and ERP/CRM integrations — designed for performance and certification.',
        de: 'Proprietäre E-Commerce-Plattformen, KI-Personalisierungstools, fortschrittliche Loyalitätssysteme und ERP-/CRM-Integrationen — konzipiert für Performance und Zertifizierung.',
        es: 'Plataformas e-commerce propietarias, herramientas de personalización IA, sistemas de fidelización avanzados e integraciones ERP/CRM — diseñados para el rendimiento y la certificación.',
        it: 'Piattaforme e-commerce proprietarie, strumenti di personalizzazione IA, sistemi di loyalty avanzati e integrazioni ERP/CRM — progettati per la performance e la certificazione.',
        nl: 'Propriëtaire e-commerceplatforms, AI-personalisatietools, geavanceerde loyaliteitssystemen en ERP/CRM-integraties — ontworpen voor prestaties en certificering.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Valorisation des actifs digitaux et des IP contenus, accompagnement des cessions retail et médias, structuration des deals sur droits numériques et due diligence acheteur.',
        en: 'Valuation of digital assets and content IP, support for retail and media disposals, structuring of digital rights deals and buyer due diligence.',
        de: 'Bewertung digitaler Assets und Content-IP, Begleitung von Retail- und Medien-Veräusserungen, Strukturierung von Deals über digitale Rechte und Käufer-Due-Diligence.',
        es: 'Valoración de activos digitales e IP de contenidos, acompañamiento de ventas retail y medios, estructuración de operaciones sobre derechos digitales y due diligence comprador.',
        it: 'Valorizzazione degli asset digitali e delle IP dei contenuti, supporto alle cessioni retail e media, strutturazione di deal su diritti digitali e due diligence acquirente.',
        nl: 'Waardering van digitale activa en content-IP, begeleiding van retail- en mediaverkopen, structurering van deals over digitale rechten en koper-due diligence.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'Retailers & e-commerçants',
        en: 'Retailers & e-merchants',
        de: 'Retailer & E-Händler',
        es: 'Retailers y e-comerciantes',
        it: 'Retailer & e-commerce',
        nl: 'Retailers & e-commercebedrijven',
      },
      story: {
        fr: 'Vous avez construit une base client propriétaire et une plateforme e-commerce performante. Un fonds PE ou un acquéreur stratégique s\'intéresse à votre actif. Mais vos données first-party, votre plateforme et vos métriques de fidélité ne sont pas documentées de façon défendable pour une due diligence.',
        en: 'You have built a proprietary customer base and a high-performance e-commerce platform. A PE fund or strategic acquirer is interested in your asset. But your first-party data, platform and loyalty metrics are not documented defensibly enough for due diligence.',
        de: 'Sie haben eine proprietäre Kundenbasis und eine leistungsstarke E-Commerce-Plattform aufgebaut. Ein PE-Fonds oder strategischer Käufer interessiert sich für Ihr Unternehmen. Aber Ihre First-Party-Daten, Ihre Plattform und Ihre Loyalitätskennzahlen sind nicht belastbar genug für eine Due Diligence dokumentiert.',
        es: 'Ha construido una base de clientes propietaria y una plataforma e-commerce eficaz. Un fondo PE o un comprador estratégico se interesa por su activo. Pero sus datos first-party, su plataforma y sus métricas de fidelidad no están documentados de forma defendible para una due diligence.',
        it: 'Avete costruito una base clienti proprietaria e una piattaforma e-commerce performante. Un fondo PE o un acquirente strategico è interessato al vostro asset. Ma i dati first-party, la piattaforma e le metriche di fidelizzazione non sono documentati in modo difendibile per una due diligence.',
        nl: 'U heeft een propriëtaire klantenbasis en een performant e-commerceplatform opgebouwd. Een PE-fonds of strategische koper is geïnteresseerd in uw actief. Maar uw first-party-data, platform en loyaliteitsmetrics zijn niet verdedigbaar genoeg gedocumenteerd voor een due diligence.',
      },
      problems: [
        {
          fr: 'Certifier la valeur des données clients first-party comme actif indépendant transmissible',
          en: 'Certify the value of first-party customer data as an independent transferable asset',
          de: 'Den Wert der First-Party-Kundendaten als unabhängiges, übertragbares Asset zertifizieren',
          es: 'Certificar el valor de los datos de clientes first-party como activo independiente transmisible',
          it: 'Certificare il valore dei dati clienti first-party come asset indipendente trasmissibile',
          nl: 'De waarde van first-party-klantdata certificeren als onafhankelijk overdraagbaar actief',
        },
        {
          fr: 'Documenter la plateforme propriétaire et ses métriques pour un investisseur PE',
          en: 'Document the proprietary platform and its metrics for a PE investor',
          de: 'Die proprietäre Plattform und ihre Kennzahlen für einen PE-Investor dokumentieren',
          es: 'Documentar la plataforma propietaria y sus métricas para un inversor PE',
          it: 'Documentare la piattaforma proprietaria e le sue metriche per un investitore PE',
          nl: 'Het propriëtaire platform en zijn metrics documenteren voor een PE-investeerder',
        },
        {
          fr: 'Préparer la due diligence sur les indicateurs de rétention, LTV et performance omnicanale',
          en: 'Prepare due diligence on retention, LTV and omnichannel performance indicators',
          de: 'Die Due Diligence zu Retention-, LTV- und Omnichannel-Performance-Kennzahlen vorbereiten',
          es: 'Preparar la due diligence sobre los indicadores de retención, LTV y rendimiento omnicanal',
          it: 'Preparare la due diligence sugli indicatori di retention, LTV e performance omnicanale',
          nl: 'De due diligence voorbereiden over retentie-, LTV- en omnichannel-prestatie-indicatoren',
        },
      ],
    },
    {
      label: {
        fr: 'Groupes médias & divertissement',
        en: 'Media & entertainment groups',
        de: 'Medien- & Entertainment-Gruppen',
        es: 'Grupos de medios y entretenimiento',
        it: 'Gruppi media & intrattenimento',
        nl: 'Media- & entertainmentgroepen',
      },
      story: {
        fr: 'Vous gérez un catalogue de contenus ou une base d\'abonnés significative. Un acquéreur ou un partenaire de distribution veut comprendre la valeur de vos droits, de votre audience et de vos IP. La documentation est fragmentée entre vos équipes créatives, juridiques et techniques.',
        en: 'You manage a content catalogue or a significant subscriber base. An acquirer or distribution partner wants to understand the value of your rights, audience and IP. Documentation is fragmented across your creative, legal and technical teams.',
        de: 'Sie verwalten einen Content-Katalog oder eine bedeutende Abonnentenbasis. Ein Käufer oder Distributionspartner will den Wert Ihrer Rechte, Ihrer Reichweite und Ihrer IP verstehen. Die Dokumentation ist über Kreativ-, Rechts- und Technikteams fragmentiert.',
        es: 'Gestiona un catálogo de contenidos o una base de abonados significativa. Un comprador o socio de distribución quiere comprender el valor de sus derechos, su audiencia y su IP. La documentación está fragmentada entre sus equipos creativos, jurídicos y técnicos.',
        it: 'Gestite un catalogo di contenuti o una base abbonati significativa. Un acquirente o un partner di distribuzione vuole capire il valore dei vostri diritti, della vostra audience e delle vostre IP. La documentazione è frammentata tra team creativi, legali e tecnici.',
        nl: 'U beheert een contentcatalogus of een aanzienlijke abonneebasis. Een koper of distributiepartner wil de waarde van uw rechten, publiek en IP begrijpen. De documentatie is versnipperd over uw creatieve, juridische en technische teams.',
      },
      problems: [
        {
          fr: 'Certifier la valeur des IP contenus et des droits numériques pour un deal de cession ou de licence',
          en: 'Certify the value of content IP and digital rights for a sale or licensing deal',
          de: 'Den Wert von Content-IP und digitalen Rechten für einen Verkaufs- oder Lizenzdeal zertifizieren',
          es: 'Certificar el valor de la IP de contenidos y los derechos digitales para una operación de venta o licencia',
          it: 'Certificare il valore delle IP dei contenuti e dei diritti digitali per un deal di cessione o licenza',
          nl: 'De waarde van content-IP en digitale rechten certificeren voor een verkoop- of licentiedeal',
        },
        {
          fr: 'Documenter et valoriser la base abonnés comme actif défendable face à un acquéreur ou distributeur',
          en: 'Document and value the subscriber base as a defensible asset to an acquirer or distributor',
          de: 'Die Abonnentenbasis als belastbares Asset gegenüber einem Käufer oder Distributor dokumentieren und bewerten',
          es: 'Documentar y valorizar la base de abonados como activo defendible ante un comprador o distribuidor',
          it: 'Documentare e valorizzare la base abbonati come asset difendibile verso un acquirente o distributore',
          nl: 'De abonneebasis documenteren en waarderen als verdedigbaar actief tegenover een koper of distributeur',
        },
        {
          fr: 'Structurer un deal sur droits avec une documentation de gouvernance IP complète et certifiable',
          en: 'Structure a rights deal with complete, certifiable IP governance documentation',
          de: 'Einen Rechte-Deal mit vollständiger, zertifizierbarer IP-Governance-Dokumentation strukturieren',
          es: 'Estructurar una operación sobre derechos con una documentación de gobernanza de IP completa y certificable',
          it: 'Strutturare un deal sui diritti con una documentazione di governance IP completa e certificabile',
          nl: 'Een rechten-deal structureren met volledige, certificeerbare IP-governance-documentatie',
        },
      ],
    },
    {
      label: {
        fr: 'Opérateurs télécoms & services',
        en: 'Telecom & service operators',
        de: 'Telekom- & Service-Betreiber',
        es: 'Operadores de telecom y servicios',
        it: 'Operatori telecom & servizi',
        nl: 'Telecom- & service-operators',
      },
      story: {
        fr: 'Vous opérez une infrastructure ou une base d\'abonnés B2B significative et envisagez un rapprochement ou une cession partielle. La conformité BEREC, la documentation de vos actifs d\'infrastructure et la valorisation de vos contrats long terme sont des prérequis que votre acquéreur potentiel exige dès la phase d\'exclusivité.',
        en: 'You operate an infrastructure or a significant B2B subscriber base and are considering a merger or partial sale. BEREC compliance, documentation of your infrastructure assets and valuation of your long-term contracts are prerequisites your potential acquirer demands from the exclusivity phase.',
        de: 'Sie betreiben eine Infrastruktur oder eine bedeutende B2B-Abonnentenbasis und erwägen einen Zusammenschluss oder Teilverkauf. BEREC-Compliance, Dokumentation Ihrer Infrastruktur-Assets und Bewertung Ihrer langfristigen Verträge sind Voraussetzungen, die Ihr potenzieller Käufer bereits in der Exklusivphase verlangt.',
        es: 'Opera una infraestructura o una base de abonados B2B significativa y considera una fusión o venta parcial. El cumplimiento BEREC, la documentación de sus activos de infraestructura y la valoración de sus contratos a largo plazo son requisitos que su comprador potencial exige desde la fase de exclusividad.',
        it: 'Operate un\'infrastruttura o una base abbonati B2B significativa e valutate una fusione o una cessione parziale. Conformità BEREC, documentazione degli asset infrastrutturali e valorizzazione dei contratti di lungo periodo sono prerequisiti che il potenziale acquirente richiede fin dalla fase di esclusiva.',
        nl: 'U exploiteert een infrastructuur of een aanzienlijke B2B-abonneebasis en overweegt een fusie of gedeeltelijke verkoop. BEREC-compliance, documentatie van uw infrastructuuractiva en waardering van uw langetermijncontracten zijn vereisten die uw potentiële koper al in de exclusiviteitsfase eist.',
      },
      problems: [
        {
          fr: 'Documenter et certifier les actifs d\'infrastructure pour un financement ou une opération de fusion',
          en: 'Document and certify infrastructure assets for financing or a merger operation',
          de: 'Infrastruktur-Assets für eine Finanzierung oder Fusion dokumentieren und zertifizieren',
          es: 'Documentar y certificar los activos de infraestructura para una financiación o una operación de fusión',
          it: 'Documentare e certificare gli asset infrastrutturali per un finanziamento o un\'operazione di fusione',
          nl: 'Infrastructuuractiva documenteren en certificeren voor een financiering of fusieoperatie',
        },
        {
          fr: 'Préparer la conformité réglementaire BEREC dans le cadre d\'un rapprochement transfrontalier',
          en: 'Prepare BEREC regulatory compliance in the context of a cross-border merger',
          de: 'BEREC-Compliance im Rahmen eines grenzüberschreitenden Zusammenschlusses vorbereiten',
          es: 'Preparar el cumplimiento regulatorio BEREC en el marco de una fusión transfronteriza',
          it: 'Preparare la conformità regolamentare BEREC nel contesto di una fusione transfrontaliera',
          nl: 'BEREC-regelgevingscompliance voorbereiden in het kader van een grensoverschrijdende fusie',
        },
        {
          fr: 'Valoriser une base abonnés B2B avec des métriques de récurrence certifiables et transmissibles',
          en: 'Value a B2B subscriber base with certifiable and transferable recurring metrics',
          de: 'Eine B2B-Abonnentenbasis mit zertifizierbaren, übertragbaren Wiederkehr-Kennzahlen bewerten',
          es: 'Valorizar una base de abonados B2B con métricas de recurrencia certificables y transmisibles',
          it: 'Valorizzare una base abbonati B2B con metriche di ricorrenza certificabili e trasmissibili',
          nl: 'Een B2B-abonneebasis waarderen met certificeerbare en overdraagbare recurrente metrics',
        },
      ],
    },
  ],
  articleSlugs: [
    'valoriser-application-mobile-cession',
    'marche-ma-tech-europe-q4-2026',
    'commerce-services-experience-client-capital-donnees-2025',
  ],
}

/* ════════════════════════════════════════════════════════════════════
   5. TECH, INNOVATION & SECTEUR PUBLIC
   ════════════════════════════════════════════════════════════════════ */
const tech: Industry = {
  slug:      'tech-innovation-secteur-public',
  clusterId: 'tech',
  name: {
    fr: 'Tech, Innovation & Secteur Public',
    en: 'Tech, Innovation & Public Sector',
    de: 'Tech, Innovation & öffentlicher Sektor',
    es: 'Tech, Innovación y Sector Público',
    it: 'Tech, Innovazione & Settore Pubblico',
    nl: 'Tech, Innovatie & Publieke Sector',
  },
  img: '/images/theme_AI.jpg',
  imgAlt: {
    fr: 'Tech, Innovation & Secteur Public — Aegryn',
    en: 'Tech, Innovation & Public Sector — Aegryn',
    de: 'Tech, Innovation & öffentlicher Sektor — Aegryn',
    es: 'Tech, Innovación y Sector Público — Aegryn',
    it: 'Tech, Innovazione & Settore Pubblico — Aegryn',
    nl: 'Tech, Innovatie & Publieke Sector — Aegryn',
  },
  vision: {
    fr: `Les organisations technologiques et innovantes font face à un paradoxe structurel : une valeur intrinsèque élevée mais souvent indéfendable face aux investisseurs et régulateurs. Leur capital repose sur des actifs immatériels — code, données, algorithmes, équipes — dont la documentation est insuffisante.

La Certification CIFSO 5000 résout ce paradoxe en fournissant une évaluation indépendante sur 5 dimensions adaptée aux réalités des SaaS, de l'IA et du secteur public numérique.`,
    en: `Technology and innovation organisations face a structural paradox: high intrinsic value that is often indefensible to investors and regulators. Their capital rests on intangible assets — code, data, algorithms, teams — whose documentation is insufficient.

CIFSO 5000 Certification resolves this paradox by providing an independent 5-dimension assessment adapted to the realities of SaaS, AI and the digital public sector.`,
    de: `Technologie- und Innovationsorganisationen stehen vor einem strukturellen Paradox: ein hoher intrinsischer Wert, der gegenüber Investoren und Regulatoren oft nicht verteidigbar ist. Ihr Kapital beruht auf immateriellen Vermögenswerten — Code, Daten, Algorithmen, Teams — deren Dokumentation unzureichend ist.

Die CIFSO-5000-Zertifizierung löst dieses Paradox mit einer unabhängigen Bewertung über 5 Dimensionen, angepasst an die Realitäten von SaaS, KI und dem digitalen öffentlichen Sektor.`,
    es: `Las organizaciones tecnológicas e innovadoras se enfrentan a una paradoja estructural: un valor intrínseco elevado pero a menudo indefendible ante inversores y reguladores. Su capital descansa en activos intangibles — código, datos, algoritmos, equipos — cuya documentación es insuficiente.

La Certificación CIFSO 5000 resuelve esta paradoja proporcionando una evaluación independiente en 5 dimensiones adaptada a las realidades del SaaS, la IA y el sector público digital.`,
    it: `Le organizzazioni tecnologiche e innovative affrontano un paradosso strutturale: un valore intrinseco elevato ma spesso indifendibile di fronte a investitori e regolatori. Il loro capitale si fonda su asset immateriali — codice, dati, algoritmi, team — la cui documentazione è insufficiente.

La Certificazione CIFSO 5000 risolve questo paradosso fornendo una valutazione indipendente su 5 dimensioni, adattata alle realtà del SaaS, dell'IA e del settore pubblico digitale.`,
    nl: `Technologie- en innovatieorganisaties staan voor een structurele paradox: een hoge intrinsieke waarde die vaak onverdedigbaar is tegenover investeerders en toezichthouders. Hun kapitaal berust op immateriële activa — code, data, algoritmen, teams — waarvan de documentatie onvoldoende is.

De CIFSO 5000-certificering lost deze paradox op met een onafhankelijke beoordeling over 5 dimensies, afgestemd op de realiteit van SaaS, AI en de digitale publieke sector.`,
  },
  keyMetrics: [
    { value: '131 Mrd EUR', label: {
      fr: 'investissement VC tech Europe 2023 (Atomico State of European Tech 2023)',
      en: 'tech VC investment Europe 2023 (Atomico State of European Tech 2023)',
      de: 'Tech-VC-Investitionen Europa 2023 (Atomico State of European Tech 2023)',
      es: 'inversión VC tech Europa 2023 (Atomico State of European Tech 2023)',
      it: 'investimenti VC tech Europa 2023 (Atomico State of European Tech 2023)',
      nl: 'tech-VC-investeringen Europa 2023 (Atomico State of European Tech 2023)',
    }},
    { value: '52 Mrd EUR', label: {
      fr: 'M&A software & SaaS Europe 2023 (Refinitiv / Dealroom)',
      en: 'software & SaaS M&A Europe 2023 (Refinitiv / Dealroom)',
      de: 'Software- & SaaS-M&A Europa 2023 (Refinitiv / Dealroom)',
      es: 'M&A software y SaaS Europa 2023 (Refinitiv / Dealroom)',
      it: 'M&A software e SaaS Europa 2023 (Refinitiv / Dealroom)',
      nl: 'software- & SaaS-M&A Europa 2023 (Refinitiv / Dealroom)',
    }},
    { value: '4,5x ARR', label: {
      fr: 'multiple médian SaaS B2B Europe mid-market 2024 (SaaS Capital 2024)',
      en: 'median B2B SaaS multiple Europe mid-market 2024 (SaaS Capital 2024)',
      de: 'medianes B2B-SaaS-Multiple Europa Mid-Market 2024 (SaaS Capital 2024)',
      es: 'múltiple mediano SaaS B2B Europa mid-market 2024 (SaaS Capital 2024)',
      it: 'multiplo mediano SaaS B2B Europa mid-market 2024 (SaaS Capital 2024)',
      nl: 'mediaan B2B-SaaS-multiple Europa mid-market 2024 (SaaS Capital 2024)',
    }},
    { value: '41 Mrd EUR', label: {
      fr: 'marché cloud souverain Europe 2028 estimé (IDC / Gartner 2024)',
      en: 'estimated sovereign cloud market Europe 2028 (IDC / Gartner 2024)',
      de: 'geschätzter Sovereign-Cloud-Markt Europa 2028 (IDC / Gartner 2024)',
      es: 'mercado estimado de cloud soberano Europa 2028 (IDC / Gartner 2024)',
      it: 'mercato stimato del cloud sovrano Europa 2028 (IDC / Gartner 2024)',
      nl: 'geschatte soevereine-cloudmarkt Europa 2028 (IDC / Gartner 2024)',
    }},
  ],
  sectors: [
    {
      img: '/images/blog/coding-screen.jpg',
      name: {
        fr: 'Technologie & SaaS',
        en: 'Technology & SaaS',
        de: 'Technologie & SaaS',
        es: 'Tecnología y SaaS',
        it: 'Tecnologia & SaaS',
        nl: 'Technologie & SaaS',
      },
      tag: {
        fr: 'Coeur de métier', en: 'Core business', de: 'Kerngeschäft',
        es: 'Core business',    it: 'Core business', nl: 'Kernactiviteit',
      },
      desc: {
        fr: 'Multiples ARR, métriques SaaS (NRR, churn, LTV/CAC), scalabilité et dette technique.',
        en: 'ARR multiples, SaaS metrics (NRR, churn, LTV/CAC), scalability and technical debt.',
        de: 'ARR-Multiples, SaaS-Kennzahlen (NRR, Churn, LTV/CAC), Skalierbarkeit und technische Schulden.',
        es: 'Múltiplos ARR, métricas SaaS (NRR, churn, LTV/CAC), escalabilidad y deuda técnica.',
        it: 'Multipli ARR, metriche SaaS (NRR, churn, LTV/CAC), scalabilità e debito tecnico.',
        nl: 'ARR-multiples, SaaS-metrics (NRR, churn, LTV/CAC), schaalbaarheid en technische schuld.',
      },
    },
    {
      img: '/images/blog/team-laptops.jpg',
      name: {
        fr: 'Éducation & EdTech',
        en: 'Education & EdTech',
        de: 'Bildung & EdTech',
        es: 'Educación y EdTech',
        it: 'Istruzione & EdTech',
        nl: 'Onderwijs & EdTech',
      },
      tag: {
        fr: 'Croissance', en: 'Growth', de: 'Wachstum',
        es: 'Crecimiento', it: 'Crescita', nl: 'Groei',
      },
      desc: {
        fr: 'LMS, IA pédagogique, marchés B2B/B2G et modèles freemium à monétisation mixte.',
        en: 'LMS, educational AI, B2B/B2G markets and freemium models with mixed monetisation.',
        de: 'LMS, Bildungs-KI, B2B-/B2G-Märkte und Freemium-Modelle mit gemischter Monetarisierung.',
        es: 'LMS, IA pedagógica, mercados B2B/B2G y modelos freemium de monetización mixta.',
        it: 'LMS, IA pedagogica, mercati B2B/B2G e modelli freemium a monetizzazione mista.',
        nl: 'LMS, educatieve AI, B2B-/B2G-markten en freemium-modellen met gemengde monetisatie.',
      },
    },
    {
      img: '/images/blog/whiteboard-strategy.jpg',
      name: {
        fr: 'GovTech & Secteur Public',
        en: 'GovTech & Public Sector',
        de: 'GovTech & öffentlicher Sektor',
        es: 'GovTech y Sector Público',
        it: 'GovTech & Settore Pubblico',
        nl: 'GovTech & Publieke Sector',
      },
      tag: {
        fr: 'Souveraineté', en: 'Sovereignty', de: 'Souveränität',
        es: 'Soberanía',    it: 'Sovranità', nl: 'Soevereiniteit',
      },
      desc: {
        fr: 'Marchés publics, conformité DINUM/ANSSI, cloud souverain et interopérabilité.',
        en: 'Public procurement, DINUM/ANSSI compliance, sovereign cloud and interoperability.',
        de: 'Öffentliche Aufträge, DINUM-/ANSSI-Compliance, souveräne Cloud und Interoperabilität.',
        es: 'Contratación pública, cumplimiento DINUM/ANSSI, cloud soberano e interoperabilidad.',
        it: 'Appalti pubblici, conformità DINUM/ANSSI, cloud sovrano e interoperabilità.',
        nl: 'Overheidsopdrachten, DINUM-/ANSSI-compliance, soevereine cloud en interoperabiliteit.',
      },
    },
  ],
  expertise: [
    {
      title: {
        fr: 'Certification CIFSO 5000',
        en: 'CIFSO 5000 Certification',
        de: 'CIFSO-5000-Zertifizierung',
        es: 'Certificación CIFSO 5000',
        it: 'Certificazione CIFSO 5000',
        nl: 'CIFSO 5000-certificering',
      },
      desc: {
        fr: 'Évaluation indépendante des actifs SaaS et IA sur les 5 dimensions CIFSO — métriques ARR/NRR, gouvernance IP, architecture et organisation — base certifiée défendable face à tout investisseur, acquéreur ou régulateur.',
        en: 'Independent assessment of SaaS and AI assets across the 5 CIFSO dimensions — ARR/NRR metrics, IP governance, architecture and organisation — a certified basis defensible to any investor, acquirer or regulator.',
        de: 'Unabhängige Bewertung von SaaS- und KI-Assets über die 5 CIFSO-Dimensionen — ARR-/NRR-Kennzahlen, IP-Governance, Architektur und Organisation — eine zertifizierte Basis, die gegenüber jedem Investor, Käufer oder Regulator Bestand hat.',
        es: 'Evaluación independiente de los activos SaaS e IA en las 5 dimensiones CIFSO — métricas ARR/NRR, gobernanza de IP, arquitectura y organización — base certificada defendible ante cualquier inversor, comprador o regulador.',
        it: 'Valutazione indipendente degli asset SaaS e IA sulle 5 dimensioni CIFSO — metriche ARR/NRR, governance IP, architettura e organizzazione — base certificata difendibile verso qualsiasi investitore, acquirente o regolatore.',
        nl: 'Onafhankelijke beoordeling van SaaS- en AI-activa over de 5 CIFSO-dimensies — ARR/NRR-metrics, IP-governance, architectuur en organisatie — een gecertificeerde basis die verdedigbaar is tegenover elke investeerder, koper of toezichthouder.',
      },
    },
    {
      title: {
        fr: 'Conseil en Technologie',
        en: 'Technology Advisory',
        de: 'Technologieberatung',
        es: 'Consultoría Tecnológica',
        it: 'Consulenza Tecnologica',
        nl: 'Technologieadvies',
      },
      desc: {
        fr: 'Architecture SaaS multi-tenant, migration cloud souverain européen, réduction de la dette technique avant cession et conformité AI Act / NIS2 pour les organisations technologiques.',
        en: 'Multi-tenant SaaS architecture, European sovereign cloud migration, technical debt reduction before sale and AI Act / NIS2 compliance for technology organisations.',
        de: 'Multi-Tenant-SaaS-Architektur, Migration in souveräne europäische Clouds, Abbau technischer Schulden vor dem Verkauf und AI-Act-/NIS2-Compliance für Technologieorganisationen.',
        es: 'Arquitectura SaaS multi-tenant, migración a cloud soberano europeo, reducción de la deuda técnica antes de la venta y cumplimiento AI Act / NIS2 para organizaciones tecnológicas.',
        it: 'Architettura SaaS multi-tenant, migrazione verso cloud sovrano europeo, riduzione del debito tecnico prima della cessione e conformità AI Act / NIS2 per le organizzazioni tecnologiche.',
        nl: 'Multi-tenant SaaS-architectuur, migratie naar Europese soevereine cloud, afbouw van technische schuld vóór verkoop en AI-Act-/NIS2-compliance voor technologieorganisaties.',
      },
    },
    {
      title: {
        fr: 'Solutions sur-mesure',
        en: 'Custom Solutions',
        de: 'Massgeschneiderte Lösungen',
        es: 'Soluciones a medida',
        it: 'Soluzioni su misura',
        nl: 'Maatwerkoplossingen',
      },
      desc: {
        fr: 'Développement de produits SaaS B2B, plateformes IA propriétaires certifiables et systèmes GovTech adaptés aux contraintes d\'interopérabilité et de souveraineté du secteur public.',
        en: 'B2B SaaS product development, certifiable proprietary AI platforms and GovTech systems adapted to public sector interoperability and sovereignty constraints.',
        de: 'Entwicklung von B2B-SaaS-Produkten, zertifizierbare proprietäre KI-Plattformen und GovTech-Systeme, angepasst an Interoperabilitäts- und Souveränitätsanforderungen des öffentlichen Sektors.',
        es: 'Desarrollo de productos SaaS B2B, plataformas de IA propietarias certificables y sistemas GovTech adaptados a las exigencias de interoperabilidad y soberanía del sector público.',
        it: 'Sviluppo di prodotti SaaS B2B, piattaforme IA proprietarie certificabili e sistemi GovTech adattati ai vincoli di interoperabilità e sovranità del settore pubblico.',
        nl: 'Ontwikkeling van B2B-SaaS-producten, certificeerbare propriëtaire AI-platforms en GovTech-systemen afgestemd op de interoperabiliteits- en soevereiniteitseisen van de publieke sector.',
      },
    },
    {
      title: {
        fr: 'M&A Advisory',
        en: 'M&A Advisory',
        de: 'M&A-Beratung',
        es: 'Asesoría M&A',
        it: 'Consulenza M&A',
        nl: 'M&A-advies',
      },
      desc: {
        fr: 'Préparation à la cession SaaS ou IA, valorisation et documentation des métriques (ARR, NRR, churn, LTV/CAC), constitution data room et accompagnement du closing avec fonds PE ou acquéreur stratégique.',
        en: 'Preparation for SaaS or AI sale, valuation and documentation of metrics (ARR, NRR, churn, LTV/CAC), data room buildout and closing support with PE funds or strategic acquirers.',
        de: 'Vorbereitung auf den SaaS- oder KI-Verkauf, Bewertung und Dokumentation der Kennzahlen (ARR, NRR, Churn, LTV/CAC), Datenraum-Aufbau und Closing-Begleitung mit PE-Fonds oder strategischen Käufern.',
        es: 'Preparación para la venta SaaS o IA, valoración y documentación de las métricas (ARR, NRR, churn, LTV/CAC), constitución del data room y acompañamiento del cierre con fondos PE o compradores estratégicos.',
        it: 'Preparazione alla cessione SaaS o IA, valorizzazione e documentazione delle metriche (ARR, NRR, churn, LTV/CAC), costituzione della data room e supporto al closing con fondi PE o acquirenti strategici.',
        nl: 'Voorbereiding op SaaS- of AI-verkoop, waardering en documentatie van metrics (ARR, NRR, churn, LTV/CAC), opbouw van de dataroom en closing-begeleiding met PE-fondsen of strategische kopers.',
      },
    },
  ],
  segments: [
    {
      label: {
        fr: 'Fondateurs SaaS & scale-ups tech',
        en: 'SaaS founders & tech scale-ups',
        de: 'SaaS-Gründer & Tech-Scale-ups',
        es: 'Fundadores SaaS y scale-ups tech',
        it: 'Fondatori SaaS & scale-up tech',
        nl: 'SaaS-oprichters & tech-scale-ups',
      },
      story: {
        fr: 'Vous avez construit un SaaS B2B avec de solides métriques ARR. Un fonds PE ou un acquéreur stratégique entre en process. Ils demandent une certification indépendante de vos métriques, de votre gouvernance IP et de votre architecture avant d\'engager leurs équipes juridiques. Vous avez 90 jours.',
        en: 'You have built a B2B SaaS with solid ARR metrics. A PE fund or strategic acquirer has entered the process. They require independent certification of your metrics, IP governance and architecture before engaging their legal teams. You have 90 days.',
        de: 'Sie haben ein B2B-SaaS mit soliden ARR-Kennzahlen aufgebaut. Ein PE-Fonds oder strategischer Käufer ist in den Prozess eingestiegen. Sie verlangen eine unabhängige Zertifizierung Ihrer Kennzahlen, IP-Governance und Architektur, bevor sie ihre Rechtsteams einschalten. Sie haben 90 Tage.',
        es: 'Ha construido un SaaS B2B con métricas ARR sólidas. Un fondo PE o un comprador estratégico ha entrado en el proceso. Exigen una certificación independiente de sus métricas, su gobernanza de IP y su arquitectura antes de movilizar sus equipos jurídicos. Tiene 90 días.',
        it: 'Avete costruito un SaaS B2B con solide metriche ARR. Un fondo PE o un acquirente strategico è entrato nel processo. Richiedono una certificazione indipendente delle metriche, della governance IP e dell\'architettura prima di coinvolgere i team legali. Avete 90 giorni.',
        nl: 'U heeft een B2B-SaaS opgebouwd met solide ARR-metrics. Een PE-fonds of strategische koper is in het proces gestapt. Ze eisen een onafhankelijke certificering van uw metrics, IP-governance en architectuur voordat ze hun juridische teams inschakelen. U heeft 90 dagen.',
      },
      problems: [
        {
          fr: 'Certifier et défendre les métriques NRR, churn et LTV/CAC face à un acquéreur PE exigeant',
          en: 'Certify and defend NRR, churn and LTV/CAC metrics to a demanding PE acquirer',
          de: 'NRR-, Churn- und LTV/CAC-Kennzahlen gegenüber einem anspruchsvollen PE-Käufer zertifizieren und verteidigen',
          es: 'Certificar y defender las métricas NRR, churn y LTV/CAC ante un comprador PE exigente',
          it: 'Certificare e difendere le metriche NRR, churn e LTV/CAC di fronte a un acquirente PE esigente',
          nl: 'NRR-, churn- en LTV/CAC-metrics certificeren en verdedigen tegenover een veeleisende PE-koper',
        },
        {
          fr: 'Documenter la propriété du code, des algorithmes et des données en actifs IP certifiés',
          en: 'Document ownership of code, algorithms and data as certified IP assets',
          de: 'Das Eigentum an Code, Algorithmen und Daten als zertifizierte IP-Assets dokumentieren',
          es: 'Documentar la propiedad del código, los algoritmos y los datos como activos de IP certificados',
          it: 'Documentare la proprietà di codice, algoritmi e dati come asset IP certificati',
          nl: 'Het eigendom van code, algoritmen en data documenteren als gecertificeerde IP-activa',
        },
        {
          fr: 'Préparer une data room complète et défendable dans les délais d\'un process M&A SaaS',
          en: 'Prepare a complete, defensible data room within SaaS M&A process timelines',
          de: 'Einen vollständigen, belastbaren Datenraum innerhalb der Fristen eines SaaS-M&A-Prozesses vorbereiten',
          es: 'Preparar un data room completo y defendible dentro de los plazos de un proceso M&A SaaS',
          it: 'Preparare una data room completa e difendibile entro i tempi di un processo M&A SaaS',
          nl: 'Een volledige, verdedigbare dataroom voorbereiden binnen de termijnen van een SaaS-M&A-proces',
        },
      ],
    },
    {
      label: {
        fr: 'Fonds venture & growth',
        en: 'Venture & growth funds',
        de: 'Venture- & Growth-Fonds',
        es: 'Fondos venture y growth',
        it: 'Fondi venture & growth',
        nl: 'Venture- & growth-fondsen',
      },
      story: {
        fr: 'Vous gérez un portefeuille de SaaS B2B européens. Sur plusieurs participations, les métriques déclarées sont difficiles à auditer indépendamment et la gouvernance IP est insuffisamment documentée. Vous préparez un exit secondaire ou un tour de table et avez besoin d\'une base certifiée.',
        en: 'You manage a portfolio of European B2B SaaS companies. Across several holdings, reported metrics are difficult to audit independently and IP governance is insufficiently documented. You are preparing a secondary exit or a funding round and need a certified basis.',
        de: 'Sie verwalten ein Portfolio europäischer B2B-SaaS-Unternehmen. Bei mehreren Beteiligungen sind die gemeldeten Kennzahlen schwer unabhängig zu auditieren und die IP-Governance ist unzureichend dokumentiert. Sie bereiten einen Secondary Exit oder eine Finanzierungsrunde vor und benötigen eine zertifizierte Basis.',
        es: 'Gestiona una cartera de SaaS B2B europeos. En varias participaciones, las métricas declaradas son difíciles de auditar de forma independiente y la gobernanza de IP está insuficientemente documentada. Prepara un exit secundario o una ronda de financiación y necesita una base certificada.',
        it: 'Gestite un portafoglio di SaaS B2B europei. In diverse partecipazioni, le metriche dichiarate sono difficili da verificare in modo indipendente e la governance IP è insufficientemente documentata. State preparando un exit secondario o un round e avete bisogno di una base certificata.',
        nl: 'U beheert een portefeuille van Europese B2B-SaaS-bedrijven. Bij meerdere deelnemingen zijn gerapporteerde metrics moeilijk onafhankelijk te auditen en is IP-governance onvoldoende gedocumenteerd. U bereidt een secundaire exit of financieringsronde voor en heeft een gecertificeerde basis nodig.',
      },
      problems: [
        {
          fr: 'Vérifier indépendamment la qualité et la robustesse des métriques SaaS d\'une participation',
          en: 'Independently verify the quality and robustness of a holding\'s SaaS metrics',
          de: 'Qualität und Robustheit der SaaS-Kennzahlen einer Beteiligung unabhängig verifizieren',
          es: 'Verificar independientemente la calidad y robustez de las métricas SaaS de una participación',
          it: 'Verificare in modo indipendente qualità e robustezza delle metriche SaaS di una partecipazione',
          nl: 'De kwaliteit en robuustheid van de SaaS-metrics van een deelneming onafhankelijk verifiëren',
        },
        {
          fr: 'Documenter et certifier la gouvernance et l\'architecture avant une levée de fond série B ou C',
          en: 'Document and certify governance and architecture before a Series B or C round',
          de: 'Governance und Architektur vor einer Series-B- oder -C-Runde dokumentieren und zertifizieren',
          es: 'Documentar y certificar la gobernanza y la arquitectura antes de una ronda serie B o C',
          it: 'Documentare e certificare governance e architettura prima di un round Serie B o C',
          nl: 'Governance en architectuur documenteren en certificeren vóór een Series-B- of -C-ronde',
        },
        {
          fr: 'Préparer les conditions d\'un exit secondaire ou d\'un processus dual-track dans les meilleures conditions',
          en: 'Prepare optimal conditions for a secondary exit or a dual-track process',
          de: 'Die besten Bedingungen für einen Secondary Exit oder einen Dual-Track-Prozess vorbereiten',
          es: 'Preparar las mejores condiciones para un exit secundario o un proceso dual-track',
          it: 'Preparare le migliori condizioni per un exit secondario o un processo dual-track',
          nl: 'De beste voorwaarden voorbereiden voor een secundaire exit of een dual-track-proces',
        },
      ],
    },
    {
      label: {
        fr: 'Acteurs GovTech & EdTech',
        en: 'GovTech & EdTech players',
        de: 'GovTech- & EdTech-Akteure',
        es: 'Actores GovTech y EdTech',
        it: 'Operatori GovTech & EdTech',
        nl: 'GovTech- & EdTech-spelers',
      },
      story: {
        fr: 'Vous opérez une plateforme numérique pour le secteur public ou l\'éducation. Un marché public exige une certification cloud souverain, un partenaire industriel veut fusionner et une administration régionale envisage une reprise partielle. Chaque scénario exige une documentation différente mais toutes reposent sur les mêmes actifs.',
        en: 'You operate a digital platform for the public sector or education. A public tender requires sovereign cloud certification, an industrial partner wants to merge and a regional administration is considering a partial takeover. Each scenario requires different documentation but all rest on the same assets.',
        de: 'Sie betreiben eine digitale Plattform für den öffentlichen Sektor oder die Bildung. Eine öffentliche Ausschreibung verlangt eine Sovereign-Cloud-Zertifizierung, ein industrieller Partner will fusionieren und eine Regionalverwaltung erwägt eine Teilübernahme. Jedes Szenario erfordert andere Dokumentation, aber alle beruhen auf denselben Assets.',
        es: 'Opera una plataforma digital para el sector público o la educación. Una licitación pública exige una certificación de cloud soberano, un socio industrial quiere fusionarse y una administración regional considera una toma parcial. Cada escenario exige una documentación diferente, pero todas descansan sobre los mismos activos.',
        it: 'Operate una piattaforma digitale per il settore pubblico o l\'istruzione. Un appalto pubblico richiede una certificazione di cloud sovrano, un partner industriale vuole fondersi e un\'amministrazione regionale valuta un\'acquisizione parziale. Ogni scenario richiede documentazione diversa, ma tutti si fondano sugli stessi asset.',
        nl: 'U exploiteert een digitaal platform voor de publieke sector of het onderwijs. Een overheidsaanbesteding eist een soevereine-cloudcertificering, een industriële partner wil fuseren en een regionale overheid overweegt een gedeeltelijke overname. Elk scenario vereist andere documentatie, maar alle berusten op dezelfde activa.',
      },
      problems: [
        {
          fr: 'Certifier la conformité cloud souverain DINUM/ANSSI pour l\'éligibilité aux marchés publics',
          en: 'Certify DINUM/ANSSI sovereign cloud compliance for public tender eligibility',
          de: 'DINUM-/ANSSI-Sovereign-Cloud-Compliance für die Zulassung zu öffentlichen Ausschreibungen zertifizieren',
          es: 'Certificar el cumplimiento de cloud soberano DINUM/ANSSI para la elegibilidad a licitaciones públicas',
          it: 'Certificare la conformità cloud sovrano DINUM/ANSSI per l\'ammissibilità agli appalti pubblici',
          nl: 'DINUM-/ANSSI-soevereine-cloudcompliance certificeren voor toelating tot overheidsaanbestedingen',
        },
        {
          fr: 'Documenter l\'organisation et la gouvernance avant une fusion ou un rapprochement inter-acteurs',
          en: 'Document organisation and governance before a merger or inter-player consolidation',
          de: 'Organisation und Governance vor einer Fusion oder einem Zusammenschluss zwischen Akteuren dokumentieren',
          es: 'Documentar la organización y la gobernanza antes de una fusión o agrupación entre actores',
          it: 'Documentare organizzazione e governance prima di una fusione o aggregazione tra operatori',
          nl: 'Organisatie en governance documenteren vóór een fusie of samenvoeging tussen spelers',
        },
        {
          fr: 'Valoriser un actif numérique public ou parapublic dans un contexte de privatisation ou de spin-off',
          en: 'Value a public or semi-public digital asset in a privatisation or spin-off context',
          de: 'Ein öffentliches oder halböffentliches digitales Asset im Kontext einer Privatisierung oder Ausgliederung bewerten',
          es: 'Valorizar un activo digital público o parapúblico en un contexto de privatización o spin-off',
          it: 'Valorizzare un asset digitale pubblico o parapubblico in un contesto di privatizzazione o spin-off',
          nl: 'Een publiek of semi-publiek digitaal actief waarderen in een context van privatisering of spin-off',
        },
      ],
    },
  ],
  articleSlugs: [
    'ai-native-saas-valorisation-multiples-2026',
    'nrr-churn-ltv-cac-metriques-valorisation-saas',
    'tech-innovation-secteur-public-certification-saas-ia-2025',
  ],
}

export const INDUSTRIES: Industry[] = [
  finance,
  sante,
  industrie,
  commerce,
  tech,
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}

export function getOtherIndustries(slug: string): Industry[] {
  return INDUSTRIES.filter(i => i.slug !== slug)
}
