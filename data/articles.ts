export type ArticleCategory = 'market' | 'seller' | 'buyer' | 'certification' | 'strategy'

export type ContentBlock =
  | { type: 'p';     text:  { fr: string; en: string } }
  | { type: 'h2';    text:  { fr: string; en: string } }
  | { type: 'h3';    text:  { fr: string; en: string } }
  | { type: 'list';  items: { fr: string; en: string }[] }
  | { type: 'quote'; text:  { fr: string; en: string }; author?: string }
  | { type: 'stats'; items: { value: string; label: { fr: string; en: string } }[] }

export interface Article {
  slug:        string
  category:    ArticleCategory
  date:        string
  readMin:     number
  title:       { fr: string; en: string }
  excerpt:     { fr: string; en: string }
  featured:    boolean
  body?:       ContentBlock[]
}

export const ARTICLES: Article[] = [
  {
    slug:     'marche-ma-tech-europe-q3-2026',
    category: 'market',
    date:     '2026-06-15',
    readMin:  7,
    featured: true,
    title: {
      fr: 'État du marché M&A tech Europe — Q3 2026',
      en: 'European Tech M&A Market — Q3 2026 Report',
    },
    excerpt: {
      fr: 'Analyse des volumes de transactions, multiples de valorisation et tendances sectorielles sur le marché européen des actifs tech. SaaS B2B en tête avec un multiple médian de 3,1x ARR.',
      en: 'Analysis of transaction volumes, valuation multiples and sector trends in the European tech asset market. B2B SaaS leads with a median multiple of 3.1x ARR.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché européen des actifs tech a franchi en 2025 un seuil structurel. Les volumes de M&A SaaS ont progressé de 42% en un an, portés par une conjonction de facteurs : normalisation des taux post-cycle de hausse, maturité des fonds micro-PE spécialisés, et émergence d\'une demande institutionnelle pour des actifs certifiés et documentés.',
        en: 'The European tech asset market crossed a structural threshold in 2025. SaaS M&A volumes grew 42% year-on-year, driven by a combination of factors: interest rate normalisation post-hike cycle, maturity of specialist micro-PE funds, and growing institutional demand for certified, documented assets.',
      }},
      { type: 'stats', items: [
        { value: '+42%',    label: { fr: 'Volume M&A SaaS Europe 2025 (YoY)',         en: 'European SaaS M&A volume 2025 (YoY)'      } },
        { value: '14,2 Md€', label: { fr: 'Volume total de transactions 2025',         en: 'Total transaction volume 2025'            } },
        { value: '3,1x ARR', label: { fr: 'Multiple médian — SaaS privé, mars 2026',   en: 'Median multiple — private SaaS, Mar 2026' } },
        { value: '58%',     label: { fr: 'Part des acquéreurs PE dans les deals SaaS', en: 'Share of PE buyers in SaaS deals'         } },
      ]},
      { type: 'h2', text: { fr: 'SaaS B2B : la classe d\'actifs préférée des acquéreurs', en: 'B2B SaaS: the acquirers\' preferred asset class' } },
      { type: 'p', text: {
        fr: 'Avec un multiple médian de 3,1x ARR sur le marché privé européen (Aventis Advisors, mars 2026), le SaaS B2B consolide son statut de classe d\'actifs de référence. Les verticaux en tête : legal tech, HR tech, logistique et outils d\'automatisation. À noter : les actifs disposant d\'une documentation technique complète et d\'une certification indépendante traitent en moyenne 0,4 à 0,8x ARR au-dessus du multiple médian.',
        en: 'With a median multiple of 3.1x ARR on the European private market (Aventis Advisors, March 2026), B2B SaaS consolidates its status as the benchmark asset class. Leading verticals: legal tech, HR tech, logistics and automation tools. Notable: assets with complete technical documentation and independent certification trade an average of 0.4–0.8x ARR above the median multiple.',
      }},
      { type: 'h2', text: { fr: 'IA & verticaux spécialisés : une prime certification émerge', en: 'AI & specialist verticals: a certification premium emerges' } },
      { type: 'p', text: {
        fr: 'Les actifs intégrant des briques IA propriétaires (modèles fine-tunés, pipelines de données exclusifs) subissent un écart de valorisation croissant selon qu\'ils disposent ou non d\'une IP formellement déposée. Les acquéreurs institutionnels — fonds PE en tête — exigent désormais systématiquement une revue technique indépendante avant de formuler une offre ferme. Un actif sans certification est un actif négocié à la baisse par principe.',
        en: 'Assets incorporating proprietary AI components (fine-tuned models, exclusive data pipelines) face a growing valuation gap depending on whether or not they hold formally filed IP. Institutional acquirers — PE funds in particular — now systematically require independent technical review before making a firm offer. An uncertified asset is one negotiated down as a default.',
      }},
      { type: 'h2', text: { fr: 'Qui achète, et pourquoi maintenant', en: 'Who is buying, and why now' } },
      { type: 'h3', text: { fr: 'Private Equity (58% des deals)', en: 'Private Equity (58% of deals)' } },
      { type: 'p', text: {
        fr: 'Les fonds PE et micro-PE représentent désormais 58% des acquéreurs sur les deals SaaS européens (SEG Annual Report 2026). Leur logique : constituer des portefeuilles d\'actifs récurrents, les consolider opérationnellement, et les revendre en platform deals à 3–5 ans. Ils achètent avec une discipline de due diligence élevée — et ne signent pas sans rapport de certification indépendant.',
        en: 'PE and micro-PE funds now represent 58% of acquirers in European SaaS deals (SEG Annual Report 2026). Their rationale: build portfolios of recurring-revenue assets, consolidate them operationally, and exit via platform deals at 3–5 years. They buy with high due diligence discipline — and will not sign without an independent certification report.',
      }},
      { type: 'h3', text: { fr: 'Family Offices & gérants de fortune', en: 'Family Offices & wealth managers' } },
      { type: 'p', text: {
        fr: 'Face à la compression des rendements obligataires et à la volatilité des marchés publics, les family offices européens se sont positionnés massivement sur les actifs tech privés. Ils privilégient les actifs de taille moyenne (0,5–5 M€ ARR), à revenus récurrents, avec un management en place. La transparence documentaire est leur premier critère de sélection — avant même le multiple.',
        en: 'Facing compressed bond yields and public market volatility, European family offices have moved massively into private tech assets. They favour mid-size assets (€0.5–5M ARR), with recurring revenues and management in place. Documentary transparency is their primary selection criterion — even before the multiple.',
      }},
      { type: 'h2', text: { fr: 'Ce que ça signifie si vous envisagez de vendre', en: 'What this means if you are considering selling' } },
      { type: 'list', items: [
        { fr: 'Le timing est structurellement favorable — la demande institutionnelle dépasse l\'offre d\'actifs certifiés.', en: 'The timing is structurally favourable — institutional demand exceeds the supply of certified assets.' },
        { fr: 'Un actif non certifié sera systématiquement négocié à la baisse. La certification n\'est plus un différenciant — c\'est un prérequis.', en: 'An uncertified asset will be systematically negotiated down. Certification is no longer a differentiator — it is a prerequisite.' },
        { fr: 'Les acheteurs les plus qualifiés (PE, family office) travaillent sur des listes shortlistées — si vous n\'êtes pas référencé, vous n\'êtes pas dans la conversation.', en: 'The most qualified buyers (PE, family office) work from shortlisted pipelines — if you are not referenced, you are not in the conversation.' },
        { fr: 'La discrétion est une valeur, pas un luxe : un processus de vente visible détériore la valorisation opérationnelle de l\'actif.', en: 'Confidentiality is a value, not a luxury: a visible sale process deteriorates the operational valuation of the asset.' },
      ]},
      { type: 'quote', text: {
        fr: 'Le marché ne manque pas d\'acheteurs. Il manque d\'actifs documentés, certifiés et présentables avec confiance.',
        en: 'The market does not lack buyers. It lacks documented, certified assets that can be presented with confidence.',
      }, author: 'AEGRYN Research, Q3 2026' },
    ],
  },
  {
    slug:     '5-erreurs-valorisation-saas',
    category: 'seller',
    date:     '2026-05-28',
    readMin:  5,
    featured: true,
    title: {
      fr: 'Les 5 erreurs qui font chuter la valorisation de votre SaaS',
      en: 'The 5 mistakes that destroy your SaaS valuation',
    },
    excerpt: {
      fr: 'Les erreurs les plus fréquentes identifiées lors des certifications AEGRYN — et comment les corriger avant de soumettre votre actif.',
      en: 'The most common mistakes identified during AEGRYN certifications — and how to fix them before submitting your asset.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Sur l\'ensemble des actifs soumis au protocole AEGRYN Grade, plus de 70% présentent au moins une anomalie structurelle qui comprime leur valorisation ou bloque la certification au premier passage. Ces anomalies ne sont pas des accidents — elles suivent des patterns récurrents. Voici les cinq plus courantes.',
        en: 'Of all assets submitted to the AEGRYN Grade protocol, over 70% present at least one structural anomaly that compresses their valuation or blocks certification at first pass. These anomalies are not accidents — they follow recurring patterns. Here are the five most common.',
      }},
      { type: 'h2', text: { fr: '1. IP non déposée ou mal protégée', en: '1. IP not filed or poorly protected' } },
      { type: 'p', text: {
        fr: 'Un actif dont le code source n\'est pas protégé par un dépôt IP (INPI, EUIPO ou équivalent) expose l\'acquéreur à un risque juridique direct. Sans preuve d\'antériorité opposable, tout litige post-acquisition sur la propriété du code devient incontrôlable. Résultat : les acquéreurs institutionnels appliquent systématiquement une décote de 20 à 40% sur le multiple, ou exigent une clause de garantie élargie qui renchérit le coût du deal.',
        en: 'An asset whose source code is not protected by an IP filing (INPI, EUIPO or equivalent) exposes the acquirer to direct legal risk. Without enforceable evidence of prior creation, any post-acquisition dispute over code ownership becomes unmanageable. Result: institutional acquirers systematically apply a 20–40% discount to the multiple, or require an extended warranty clause that inflates deal cost.',
      }},
      { type: 'h2', text: { fr: '2. Dette technique non documentée', en: '2. Undocumented technical debt' } },
      { type: 'p', text: {
        fr: 'La dette technique existe dans tous les projets. Ce qui la rend pénalisante, c\'est l\'absence de documentation. Un acquéreur qui découvre en due diligence une architecture non documentée, des dépendances obsolètes ou un taux de couverture de tests insuffisant ne peut pas quantifier le risque — il l\'applique en totalité sur le prix. Documentez votre dette, priorisez-la, et présentez un plan de remédiation. C\'est la différence entre une décote acceptable et une offre annulée.',
        en: 'Technical debt exists in every project. What makes it penalising is the absence of documentation. An acquirer who discovers undocumented architecture, outdated dependencies or insufficient test coverage during due diligence cannot quantify the risk — so applies it in full to the price. Document your debt, prioritise it, and present a remediation plan. That is the difference between an acceptable discount and a cancelled offer.',
      }},
      { type: 'h2', text: { fr: '3. Métriques financières non auditées', en: '3. Unaudited financial metrics' } },
      { type: 'p', text: {
        fr: 'MRR auto-déclaré, churn calculé sans définition claire, NRR gonflé par des expansions non récurrentes : les métriques SaaS non auditées sont le premier signal d\'alarme pour un fonds PE. La règle est simple : si vos métriques ne peuvent pas être reconstruites depuis vos données brutes par un tiers indépendant, elles ne seront pas acceptées à leur valeur nominale. Faites réaliser un audit de métriques avant de soumettre — le coût est marginal au regard de la différence sur le multiple.',
        en: 'Self-reported MRR, churn calculated without a clear definition, NRR inflated by non-recurring expansions: unaudited SaaS metrics are the first red flag for a PE fund. The rule is simple: if your metrics cannot be reconstructed from your raw data by an independent third party, they will not be accepted at face value. Commission a metrics audit before submitting — the cost is marginal relative to the difference on the multiple.',
      }},
      { type: 'h2', text: { fr: '4. Non-conformité RGPD', en: '4. GDPR non-compliance' } },
      { type: 'p', text: {
        fr: 'Un actif non conforme RGPD est un actif qui transfère un risque réglementaire chiffrable à l\'acquéreur. En Europe, cela se traduit par une clause de représentation et garantie élargie, ou plus simplement par un retrait de l\'offre. Les points les plus fréquemment bloquants : absence de DPA avec les sous-traitants, cookies non conformis, absence de registre des traitements. Tous sont corrigeables en 4 à 8 semaines — faites-le avant de soumettre.',
        en: 'A GDPR non-compliant asset transfers a quantifiable regulatory risk to the acquirer. In Europe, this translates into a widened representation and warranty clause, or more simply a withdrawal of the offer. The most frequently blocking points: missing DPAs with sub-processors, non-compliant cookies, absence of processing register. All are correctable in 4–8 weeks — do it before submitting.',
      }},
      { type: 'h2', text: { fr: '5. Mauvais timing de présentation', en: '5. Wrong timing of presentation' } },
      { type: 'p', text: {
        fr: 'Présenter un actif en phase de décroissance MRR, post-départ d\'un cofondateur clé, ou en période de restructuration client est structurellement pénalisant — même si les fondamentaux sont solides. Le timing optimal pour céder est quand les métriques sont en croissance ou stable, que l\'équipe est en place, et que vous avez 6 à 12 mois de runway. Préparer une cession prend 3 à 6 mois. Ne commencez pas la réflexion quand vous êtes déjà en difficulté.',
        en: 'Presenting an asset during MRR decline, post-departure of a key co-founder, or during client restructuring is structurally penalising — even if the fundamentals are sound. The optimal timing to sell is when metrics are growing or stable, the team is in place, and you have 6–12 months of runway. Preparing a sale takes 3–6 months. Do not start thinking about it when you are already in difficulty.',
      }},
      { type: 'quote', text: {
        fr: 'La valorisation ne se négocie pas le jour de l\'offre. Elle se construit dans les 12 mois qui précèdent.',
        en: 'Valuation is not negotiated on the day of the offer. It is built in the 12 months before it.',
      }, author: 'AEGRYN Advisory' },
    ],
  },
  {
    slug:     'actif-tech-certifiable',
    category: 'certification',
    date:     '2026-05-10',
    readMin:  6,
    featured: true,
    title: {
      fr: 'Qu\'est-ce qu\'un actif tech vraiment certifiable ?',
      en: 'What makes a tech asset truly certifiable?',
    },
    excerpt: {
      fr: 'Les critères objectifs qui distinguent un actif certifiable d\'un actif qui nécessite un plan de remédiation préalable selon le protocole AEGRYN Grade.',
      en: 'The objective criteria that distinguish a certifiable asset from one requiring a remediation plan, according to the AEGRYN Grade protocol.',
    },
    body: [
      { type: 'p', text: {
        fr: '75% des actifs soumis au protocole AEGRYN Grade nécessitent un plan de remédiation avant d\'atteindre un grade publiable. Ce chiffre n\'est pas un aveu d\'échec du marché — c\'est le reflet d\'une réalité structurelle : la plupart des fondateurs construisent pour scale, pas pour cession. Certifier un actif, c\'est le rendre lisible, opposable, et transférable. Voici ce que ça signifie concrètement.',
        en: '75% of assets submitted to the AEGRYN Grade protocol require a remediation plan before reaching a publishable grade. This figure is not an indictment of the market — it reflects a structural reality: most founders build for scale, not for exit. Certifying an asset means making it readable, enforceable, and transferable. Here is what that means in practice.',
      }},
      { type: 'h2', text: { fr: 'Les 4 dimensions du protocole AEGRYN Grade', en: 'The 4 dimensions of the AEGRYN Grade protocol' } },
      { type: 'h3', text: { fr: 'C — Code & Architecture', en: 'C — Code & Architecture' } },
      { type: 'p', text: {
        fr: 'Qualité du code source (couverture tests, documentation, absence de hardcoded secrets), architecture (microservices vs monolithe, dette identifiée), dépendances (versions, licences, vulnérabilités), et dépôt IP (INPI, EUIPO ou équivalent). Un actif qui échoue en dimension C ne peut pas recevoir de grade supérieur à AEG B.',
        en: 'Source code quality (test coverage, documentation, absence of hardcoded secrets), architecture (microservices vs monolith, identified debt), dependencies (versions, licences, vulnerabilities), and IP filing (INPI, EUIPO or equivalent). An asset failing on dimension C cannot receive a grade above AEG B.',
      }},
      { type: 'h3', text: { fr: 'I — Infrastructure & Sécurité', en: 'I — Infrastructure & Security' } },
      { type: 'p', text: {
        fr: 'Souveraineté de l\'hébergement (cloud provider, région de données, SLA), sécurité opérationnelle (WAF, accès MFA, logs d\'audit, backups testés), conformité (ISO 27001, SOC 2, ou équivalent documenté), et absence de single point of failure critique. L\'infrastructure non souveraine ou non documentée est la deuxième cause de blocage en certification.',
        en: 'Hosting sovereignty (cloud provider, data region, SLA), operational security (WAF, MFA access, audit logs, tested backups), compliance (ISO 27001, SOC 2, or documented equivalent), and absence of critical single point of failure. Non-sovereign or undocumented infrastructure is the second most common blocking point in certification.',
      }},
      { type: 'h3', text: { fr: 'F — Finance & Métriques', en: 'F — Finance & Metrics' } },
      { type: 'p', text: {
        fr: 'MRR/ARR vérifiable depuis les données brutes (Stripe, Chargebee, ou export comptable), churn calculé selon une définition standard, NRR calculé sur base client sans expansions non récurrentes, et coûts d\'infrastructure documentés. Les métriques non auditables sont assimilées à des métriques inexistantes — elles ne peuvent pas servir de base de valorisation.',
        en: 'MRR/ARR verifiable from raw data (Stripe, Chargebee, or accounting export), churn calculated to a standard definition, NRR calculated on a customer basis without non-recurring expansions, and documented infrastructure costs. Non-auditable metrics are treated as non-existent — they cannot serve as a valuation basis.',
      }},
      { type: 'h3', text: { fr: 'S — Stratégie & Transférabilité', en: 'S — Strategy & Transferability' } },
      { type: 'p', text: {
        fr: 'Dépendance au fondateur (score 1–5), documentation opérationnelle (runbooks, onboarding, processus documentés), contractualisation clients (durée, conditions de résiliation, concentration client), et potentiel de croissance post-acquisition. Un actif dont l\'opération dépend entièrement d\'une seule personne non remplaçable reçoit un score S critique — même avec d\'excellentes métriques financières.',
        en: 'Founder dependency (score 1–5), operational documentation (runbooks, onboarding, documented processes), client contractualisation (duration, termination conditions, client concentration), and post-acquisition growth potential. An asset whose operation depends entirely on a single non-replaceable individual receives a critical S score — even with excellent financial metrics.',
      }},
      { type: 'h2', text: { fr: 'Pourquoi 75% échouent au premier passage', en: 'Why 75% fail at first pass' } },
      { type: 'list', items: [
        { fr: 'IP non déposée ou déposée tardivement (cause n°1)', en: 'IP not filed or filed late (cause #1)' },
        { fr: 'Métriques financières auto-déclarées sans traçabilité', en: 'Self-reported financial metrics without traceability' },
        { fr: 'Infrastructure hébergée sur compte personnel du fondateur', en: 'Infrastructure hosted on the founder\'s personal account' },
        { fr: 'Dépendance opérationnelle totale au fondateur', en: 'Total operational dependency on the founder' },
        { fr: 'Absence de contrats clients formalisés (paiements informels)', en: 'Absence of formalised client contracts (informal payments)' },
      ]},
      { type: 'h2', text: { fr: 'Checklist pré-soumission', en: 'Pre-submission checklist' } },
      { type: 'list', items: [
        { fr: '✓ Dépôt IP du code source réalisé', en: '✓ Source code IP filing completed' },
        { fr: '✓ Tests automatisés couvrant ≥60% du codebase', en: '✓ Automated tests covering ≥60% of codebase' },
        { fr: '✓ MRR exportable depuis la source de facturation', en: '✓ MRR exportable from billing source' },
        { fr: '✓ Infrastructure hébergée sous compte entreprise (pas personnel)', en: '✓ Infrastructure hosted under company account (not personal)' },
        { fr: '✓ Conformité RGPD documentée (registre traitements, DPA sous-traitants)', en: '✓ GDPR compliance documented (processing register, sub-processor DPAs)' },
        { fr: '✓ Au moins un employé ou prestataire capable d\'opérer sans le fondateur', en: '✓ At least one employee or contractor capable of operating without the founder' },
      ]},
      { type: 'quote', text: {
        fr: 'Un actif certifiable n\'est pas un actif parfait. C\'est un actif dont les forces et les failles sont documentées, mesurées et opposables.',
        en: 'A certifiable asset is not a perfect asset. It is an asset whose strengths and weaknesses are documented, measured, and enforceable.',
      }, author: 'AEGRYN Grade Protocol — v2.1' },
    ],
  },
  {
    slug:     'due-diligence-acquereur-checklist',
    category: 'buyer',
    date:     '2026-04-22',
    readMin:  8,
    featured: false,
    title: {
      fr: 'Due diligence acquéreur : la checklist complète',
      en: 'Buyer due diligence: the complete checklist',
    },
    excerpt: {
      fr: 'Ce que tout acquéreur sérieux doit vérifier avant de faire une offre sur un actif tech. Checklist en 40 points couvrant code, infrastructure, finance et stratégie.',
      en: 'What every serious buyer must verify before making an offer on a tech asset. 40-point checklist covering code, infrastructure, finance and strategy.',
    },
  },
  {
    slug:     'multiples-valorisation-saas-europe-2026',
    category: 'market',
    date:     '2026-04-05',
    readMin:  6,
    featured: false,
    title: {
      fr: 'Multiples de valorisation SaaS en Europe — Baromètre 2026',
      en: 'SaaS Valuation Multiples in Europe — 2026 Barometer',
    },
    excerpt: {
      fr: 'Panorama des multiples ARR et EBITDA observés sur le marché européen des actifs SaaS en 2025–2026. Comparaison par verticale, taille et statut.',
      en: 'Overview of ARR and EBITDA multiples observed on the European SaaS asset market in 2025–2026. Comparison by vertical, size and status.',
    },
  },
  {
    slug:     'escrow-institutionnel-transactions-tech',
    category: 'strategy',
    date:     '2026-03-18',
    readMin:  4,
    featured: false,
    title: {
      fr: 'Pourquoi l\'escrow institutionnel est non-négociable dans les transactions tech',
      en: 'Why institutional escrow is non-negotiable in tech transactions',
    },
    excerpt: {
      fr: 'Un escrow mal structuré est la première cause d\'échec de closing en M&A tech. Tour d\'horizon des mécanismes et des acteurs recommandés en Europe.',
      en: 'A poorly structured escrow is the leading cause of closing failure in tech M&A. Overview of mechanisms and recommended providers in Europe.',
    },
  },
]

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { fr: string; en: string }> = {
  market:        { fr: 'Rapport marché',   en: 'Market report'   },
  seller:        { fr: 'Guide vendeur',    en: 'Seller guide'    },
  buyer:         { fr: 'Guide acquéreur',  en: 'Buyer guide'     },
  certification: { fr: 'Certification',   en: 'Certification'   },
  strategy:      { fr: 'Stratégie',        en: 'Strategy'        },
}
