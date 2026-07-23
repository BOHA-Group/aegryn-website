export type ArticleCategory =
  | 'market'
  | 'seller'
  | 'buyer'
  | 'certification'
  | 'strategy'
  | 'case_study'
  | 'legal'
  | 'vertical'
  | 'dach'

export type ContentBlock =
  | { type: 'p';     text:  { fr: string; en: string } }
  | { type: 'h2';    text:  { fr: string; en: string } }
  | { type: 'h3';    text:  { fr: string; en: string } }
  | { type: 'list';  items: { fr: string; en: string }[] }
  | { type: 'quote'; text:  { fr: string; en: string }; author?: string }
  | { type: 'stats'; items: { value: string; label: { fr: string; en: string } }[] }

export type FaqItem = { q: { fr: string; en: string }; a: { fr: string; en: string } }

export interface Article {
  slug:        string
  category:    ArticleCategory
  date:        string
  readMin:     number
  title:       { fr: string; en: string }
  excerpt:     { fr: string; en: string }
  featured:    boolean
  ogImage?:    string
  body?:       ContentBlock[]
  faq?:        FaqItem[]
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
    featured: false,
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
        fr: 'Qualité du code source (couverture tests, documentation, absence de hardcoded secrets), architecture (microservices vs monolithe, dette identifiée), dépendances (versions, licences, vulnérabilités), et dépôt IP (INPI, EUIPO ou équivalent). Un actif qui échoue en dimension C ne peut pas recevoir de grade supérieur à B.',
        en: 'Source code quality (test coverage, documentation, absence of hardcoded secrets), architecture (microservices vs monolith, identified debt), dependencies (versions, licences, vulnerabilities), and IP filing (INPI, EUIPO or equivalent). An asset failing on dimension C cannot receive a grade above B.',
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
    slug:     'comment-acquereurs-pe-evaluent-saas-2026',
    category: 'buyer',
    date:     '2026-06-01',
    readMin:  8,
    featured: true,
    title: {
      fr: 'Comment les acquéreurs PE évaluent un SaaS en 2026',
      en: 'How PE acquirers evaluate a SaaS in 2026',
    },
    excerpt: {
      fr: 'En 2026, les fonds PE représentent 58% des acquéreurs sur le marché SaaS européen. Leur processus d\'évaluation est plus rigoureux que jamais — comprendre leurs critères fait la différence.',
      en: 'In 2026, PE funds represent 58% of acquirers in the European SaaS market. Their evaluation process is more rigorous than ever — understanding their criteria makes the difference.',
    },
    body: [
      { type: 'p', text: {
        fr: 'En 2026, les fonds PE représentent 58% des acquéreurs sur le marché SaaS européen. Leur processus d\'évaluation est devenu plus rigoureux que jamais — et les fondateurs qui ne comprennent pas leurs critères laissent de la valeur sur la table.',
        en: 'In 2026, PE funds represent 58% of acquirers in the European SaaS market. Their evaluation process has become more rigorous than ever — and founders who do not understand their criteria leave value on the table.',
      }},
      { type: 'h2', text: { fr: 'Les 4 métriques non-négociables', en: 'The 4 non-negotiable metrics' } },
      { type: 'list', items: [
        { fr: 'NRR (Net Revenue Retention) — Le seuil critique est 100%. En dessous, l\'actif perd de la valeur chaque année par attrition. Au-dessus de 110%, vous êtes dans le top quartile et le multiple monte en conséquence.', en: 'NRR (Net Revenue Retention) — The critical threshold is 100%. Below, the asset loses value each year through attrition. Above 110%, you are in the top quartile and the multiple rises accordingly.' },
        { fr: 'Churn mensuel — Tout churn supérieur à 2% mensuel sur une base client B2B est rédhibitoire. Un PE qui achète avec un churn de 5% sait qu\'il perd 46% de sa base en 12 mois.', en: 'Monthly churn — Any churn above 2% monthly on a B2B client base is a deal-breaker. A PE buying at 5% churn knows it will lose 46% of its base in 12 months.' },
        { fr: 'LTV:CAC ratio — Le minimum acceptable est 3:1. Les actifs premium sont à 5:1 ou plus. Un ratio inférieur signale un modèle d\'acquisition non scalable.', en: 'LTV:CAC ratio — The minimum acceptable is 3:1. Premium assets are at 5:1 or more. A lower ratio signals a non-scalable acquisition model.' },
        { fr: 'Marges brutes — Seuil minimum 60% pour un SaaS B2B. Les multiples premium (6x+ ARR) sont réservés aux actifs avec des marges supérieures à 75%.', en: 'Gross margins — Minimum threshold 60% for B2B SaaS. Premium multiples (6x+ ARR) are reserved for assets with margins above 75%.' },
      ]},
      { type: 'h2', text: { fr: 'Ce que les PE regardent au-delà des métriques', en: 'What PE looks at beyond metrics' } },
      { type: 'p', text: {
        fr: 'Les métriques financières ne sont que le premier filtre. Ce qui détermine réellement la valorisation finale, c\'est la qualité des actifs sous-jacents — et c\'est là que la certification AEGRYN change la dynamique.',
        en: 'Financial metrics are only the first filter. What truly determines the final valuation is the quality of the underlying assets — and that is where AEGRYN certification changes the dynamic.',
      }},
      { type: 'list', items: [
        { fr: 'IP maîtrisée — Marques déposées, droits logiciels formalisés, contrats prestataires avec cession de droits. Un actif sans IP propre ne peut pas être vendu à sa valeur réelle.', en: 'Controlled IP — Filed trademarks, formalised software rights, contractor agreements with rights assignment. An asset without its own IP cannot be sold at its real value.' },
        { fr: 'Dette technique documentée — Un PE préfère une dette technique connue et chiffrée à une dette technique cachée. L\'opacité coûte entre 1x et 2x ARR à la valorisation finale.', en: 'Documented technical debt — A PE prefers known and quantified technical debt over hidden debt. Opacity costs between 1x and 2x ARR in final valuation.' },
        { fr: 'Conformité RGPD — Aucun fonds institutionnel sérieux n\'acquiert un actif avec des lacunes RGPD documentées sans décote significative.', en: 'GDPR compliance — No serious institutional fund acquires an asset with documented GDPR gaps without a significant discount.' },
        { fr: 'Concentration client — Un seul client représentant plus de 20% du revenu est un signal d\'alarme. Au-delà de 30%, certains fonds refusent catégoriquement.', en: 'Client concentration — A single client representing more than 20% of revenue is a red flag. Above 30%, some funds refuse outright.' },
      ]},
      { type: 'h2', text: { fr: 'La due diligence technique — ce que vos acheteurs vont trouver', en: 'Technical due diligence — what your buyers will find' } },
      { type: 'p', text: {
        fr: 'Tout PE sérieux mandate une due diligence technique avant closing. Les éléments systématiquement vérifiés : qualité du codebase (tests, documentation, CI/CD), architecture de sécurité, dépendances critiques, et la capacité de l\'actif à fonctionner sans son fondateur.',
        en: 'Every serious PE mandates a technical due diligence before closing. Items systematically verified: codebase quality (tests, documentation, CI/CD), security architecture, critical dependencies, and the asset\'s ability to operate without its founder.',
      }},
      { type: 'quote', text: {
        fr: 'Un actif qui ne peut pas tourner 30 jours sans son créateur n\'est pas un actif — c\'est un emploi.',
        en: 'An asset that cannot run 30 days without its creator is not an asset — it is a job.',
      }, author: 'AEGRYN Advisory' },
      { type: 'h2', text: { fr: 'Le calendrier d\'une acquisition PE type', en: 'Timeline of a typical PE acquisition' } },
      { type: 'list', items: [
        { fr: 'J0 : Premier contact ou soumission dossier', en: 'D0: First contact or file submission' },
        { fr: 'J+7 à J+14 : Pré-qualification sur métriques clés', en: 'D+7 to D+14: Pre-qualification on key metrics' },
        { fr: 'J+14 à J+21 : NDA signé, accès data room préliminaire', en: 'D+14 to D+21: NDA signed, preliminary data room access' },
        { fr: 'J+21 à J+30 : LOI (Letter of Intent) non-engageante', en: 'D+21 to D+30: Non-binding LOI (Letter of Intent)' },
        { fr: 'J+30 à J+60 : Due diligence complète (technique, juridique, financière)', en: 'D+30 to D+60: Full due diligence (technical, legal, financial)' },
        { fr: 'J+60 à J+90 : Négociation SPA, conditions, garanties', en: 'D+60 to D+90: SPA negotiation, conditions, warranties' },
        { fr: 'J+90 : Signing et closing', en: 'D+90: Signing and closing' },
      ]},
      { type: 'p', text: {
        fr: 'La certification AEGRYN compresse ce calendrier de 30 à 45 jours en fournissant une due diligence pré-validée. L\'acquéreur PE qui reçoit un rapport de grade AAA peut passer directement à la LOI.',
        en: 'AEGRYN certification compresses this timeline by 30–45 days by providing pre-validated due diligence. A PE acquirer receiving an AAA grade report can move directly to the LOI.',
      }},
      { type: 'stats', items: [
        { value: '58%',  label: { fr: 'Part PE buyers dans les deals SaaS 2025', en: 'Share of PE buyers in SaaS deals 2025' } },
        { value: '90j',  label: { fr: 'Durée moyenne d\'une acquisition PE mid-market', en: 'Average duration of a PE mid-market acquisition' } },
        { value: '−30j', label: { fr: 'Gain de temps avec certification AEGRYN Grade', en: 'Time saved with AEGRYN Grade certification' } },
      ]},
    ],
  },
  {
    slug:     'marche-ma-tech-europeen-besoin-christies',
    category: 'strategy',
    date:     '2026-05-15',
    readMin:  6,
    featured: false,
    title: {
      fr: 'Le marché M&A tech européen a besoin de son Christie\'s',
      en: 'The European tech M&A market needs its own Christie\'s',
    },
    excerpt: {
      fr: 'Le marché existe. Les acheteurs existent. Les vendeurs existent. Ce qui n\'existe pas, c\'est l\'infrastructure qui les connecte de façon fiable, certifiée, et confidentielle.',
      en: 'The market exists. The buyers exist. The sellers exist. What does not exist is the infrastructure that connects them reliably, certified, and confidentially.',
    },
    body: [
      { type: 'p', text: {
        fr: 'En 2025, 2 698 transactions SaaS ont été enregistrées dans le monde. En Europe, le marché tech a représenté 14,2 milliards d\'euros de volume. Et pourtant, si vous demandez à un fondateur français ou suisse comment céder son actif, la réponse est invariablement la même : "je ne sais pas par où commencer."',
        en: 'In 2025, 2,698 SaaS transactions were recorded worldwide. In Europe, the tech market represented €14.2 billion in volume. And yet, if you ask a French or Swiss founder how to sell their asset, the answer is invariably the same: "I don\'t know where to start."',
      }},
      { type: 'h2', text: { fr: 'Le paradoxe du marché M&A tech européen', en: 'The European tech M&A market paradox' } },
      { type: 'p', text: {
        fr: 'Le marché existe. Les acheteurs existent. Les vendeurs existent. Ce qui n\'existe pas, c\'est l\'infrastructure qui les connecte de façon fiable, certifiée, et confidentielle.',
        en: 'The market exists. The buyers exist. The sellers exist. What does not exist is the infrastructure that connects them reliably, with certification, and in confidence.',
      }},
      { type: 'p', text: {
        fr: 'Flippa liste n\'importe qui pour 29 dollars. Acquire.com a 500 000 acheteurs enregistrés — dont la majorité n\'ont jamais closé un deal. FE International et Quiet Light opèrent bien, mais depuis les États-Unis, pour le marché américain, avec des processus calibrés pour une culture M&A anglosaxonne.',
        en: 'Flippa lists anyone for $29. Acquire.com has 500,000 registered buyers — most of whom have never closed a deal. FE International and Quiet Light operate well, but from the United States, for the American market, with processes calibrated for an Anglo-Saxon M&A culture.',
      }},
      { type: 'quote', text: {
        fr: 'Le marché tech européen n\'a pas de Christie\'s. Il a des bazars.',
        en: 'The European tech market has no Christie\'s. It has bazaars.',
      }, author: 'AEGRYN Research' },
      { type: 'h2', text: { fr: 'Ce que Christie\'s a compris que les marketplaces n\'ont pas', en: 'What Christie\'s understood that marketplaces have not' } },
      { type: 'p', text: {
        fr: 'Christie\'s ne liste pas des tableaux. Christie\'s sélectionne des œuvres, les authentifie, les provenance, et les présente à un cercle d\'acheteurs qui ont prouvé leur capacité et leur sérieux. Le refus est le produit. En 2023, Christie\'s a refusé plus de lots qu\'elle n\'en a acceptés — et c\'est exactement ce signal de sélectivité qui justifie les prix obtenus.',
        en: 'Christie\'s does not list paintings. Christie\'s selects works, authenticates them, establishes their provenance, and presents them to a circle of buyers who have proven their capacity and seriousness. The refusal is the product. In 2023, Christie\'s refused more lots than it accepted — and it is precisely this signal of selectivity that justifies the prices achieved.',
      }},
      { type: 'p', text: {
        fr: 'Antiquorum fait la même chose pour les montres de collection. Chaque lot reçoit un grade multi-dimensionnel émis par des experts indépendants selon un protocole reproductible. Ce n\'est pas une note — c\'est une certification. La différence est fondamentale : une note est une opinion, une certification est une responsabilité.',
        en: 'Antiquorum does the same for collectible watches. Each lot receives a multidimensional grade issued by independent experts following a reproducible protocol. It is not a rating — it is a certification. The difference is fundamental: a rating is an opinion, a certification is a responsibility.',
      }},
      { type: 'h2', text: { fr: 'La thèse AEGRYN', en: 'The AEGRYN thesis' } },
      { type: 'p', text: {
        fr: 'Un actif tech mérite le même traitement qu\'une Rolex Daytona de 1963 ou qu\'un Picasso de la période bleue. Il a une provenance (son historique de build), un état (son grade C/I/F/S), une authenticité (sa certification indépendante documentée), et une valeur de marché (son multiple ARR ajusté).',
        en: 'A tech asset deserves the same treatment as a 1963 Rolex Daytona or a Picasso from the Blue Period. It has a provenance (its build history), a condition (its C/I/F/S grade), an authenticity (its independent documented certification), and a market value (its adjusted ARR multiple).',
      }},
      { type: 'list', items: [
        { fr: 'La certification remplace l\'estimation — chaque actif reçoit un grade AEG ★/AAA/AA/A/B émis par des analystes certifiés AEGRYN selon un protocole indépendant', en: 'Certification replaces estimation — each asset receives an AEG ★/AAA/AA/A/B grade issued by AEGRYN certified analysts following an independent protocol' },
        { fr: 'Le cercle fermé remplace la marketplace — les acquéreurs sont pré-qualifiés avant d\'accéder au moindre dossier', en: 'The closed circle replaces the marketplace — acquirers are pre-qualified before accessing any file' },
        { fr: 'Le séquestre remplace la promesse verbale — 10% du prix de transaction est versé à la signature de la Promesse de Transaction', en: 'Escrow replaces the verbal promise — 10% of the transaction price is paid upon signing the Transaction Promise' },
        { fr: 'La documentation remplace la confiance aveugle — l\'état exact du codebase est documenté et versionné au transfert', en: 'Documentation replaces blind trust — the exact codebase state is documented and versioned at transfer' },
      ]},
      { type: 'h2', text: { fr: 'Pourquoi la Suisse', en: 'Why Switzerland' } },
      { type: 'p', text: {
        fr: 'Ce n\'est pas du marketing. La Suisse est le hub de gestion de fortune le plus important au monde — 630 milliards de CHF gérés par des family offices suisses, avec 38% alloués aux actifs alternatifs. Les acquéreurs institutionnels les plus solvables d\'Europe ont leurs bureaux à Zurich, Genève, et Zoug. Être ancré en Suisse n\'est pas un signal de neutralité — c\'est un signal d\'accès.',
        en: 'This is not marketing. Switzerland is the world\'s most important wealth management hub — CHF 630 billion managed by Swiss family offices, with 38% allocated to alternative assets. The most creditworthy institutional acquirers in Europe have their offices in Zurich, Geneva, and Zug. Being anchored in Switzerland is not a signal of neutrality — it is a signal of access.',
      }},
      { type: 'stats', items: [
        { value: '14,2 Md€',  label: { fr: 'Volume M&A SaaS Europe 2025', en: 'European SaaS M&A volume 2025' } },
        { value: '630 Md CHF', label: { fr: 'Actifs sous gestion family offices suisses', en: 'Assets under management by Swiss family offices' } },
        { value: '< 25%',     label: { fr: 'Taux d\'acceptation AEGRYN Grade', en: 'AEGRYN Grade acceptance rate' } },
      ]},
    ],
  },
  {
    slug:     'ip-checklist-avant-cession-actif-tech',
    category: 'seller',
    date:     '2026-04-20',
    readMin:  5,
    featured: true,
    title: {
      fr: 'IP : la checklist complète avant de céder votre actif tech',
      en: 'IP: the complete checklist before selling your tech asset',
    },
    excerpt: {
      fr: 'L\'erreur la plus coûteuse en M&A tech n\'est pas un mauvais timing ni une valorisation trop ambitieuse. C\'est la découverte tardive d\'une lacune IP qui fait s\'effondrer le deal à J-15 du closing.',
      en: 'The most costly mistake in tech M&A is not bad timing or an overambitious valuation. It is the late discovery of an IP gap that collapses the deal 15 days before closing.',
    },
    body: [
      { type: 'p', text: {
        fr: 'L\'erreur la plus coûteuse en M&A tech n\'est pas un mauvais timing ni une valorisation trop ambitieuse. C\'est la découverte tardive d\'une lacune IP qui fait s\'effondrer le deal — ou la valorisation — à J-15 du closing.',
        en: 'The most costly mistake in tech M&A is not bad timing or an overambitious valuation. It is the late discovery of an IP gap that collapses the deal — or the valuation — 15 days before closing.',
      }},
      { type: 'h2', text: { fr: 'Les 5 questions IP que tout acquéreur posera', en: 'The 5 IP questions every acquirer will ask' } },
      { type: 'list', items: [
        { fr: 'Qui détient réellement les droits sur le code ? Si des prestataires freelance ont contribué au codebase sans contrat de cession de droits, la propriété intellectuelle est partiellement chez eux — pas chez vous.', en: 'Who actually owns the rights to the code? If freelance contractors contributed to the codebase without rights assignment contracts, the intellectual property is partly theirs — not yours.' },
        { fr: 'La marque est-elle déposée ? Un nom d\'actif non protégé peut être enregistré par un tiers dans un autre pays. La valeur de marque disparaît si elle n\'est pas ancrée dans un dépôt IPI, EUIPO, ou USPTO.', en: 'Is the trademark filed? An unprotected asset name can be registered by a third party in another country. Brand value disappears if it is not anchored in an IPI, EUIPO, or USPTO filing.' },
        { fr: 'Les licences open source sont-elles compatibles avec une cession commerciale ? Une librairie GPL dans votre codebase peut imposer des obligations de divulgation du code source à l\'acquéreur.', en: 'Are open source licences compatible with a commercial sale? A GPL library in your codebase can impose source code disclosure obligations on the acquirer.' },
        { fr: 'Les APIs tierces ont-elles des contrats en ordre ? Une dépendance critique à une API sans contrat formalisé est un risque opérationnel que l\'acquéreur décotera.', en: 'Do third-party APIs have proper contracts? A critical dependency on an API without a formalised contract is an operational risk the acquirer will discount.' },
        { fr: 'Les données utilisateurs appartiennent-elles à l\'actif ou au fondateur ? La question RGPD sur la propriété des données lors d\'un transfert est complexe et mal anticipée.', en: 'Do user data belong to the asset or to the founder? The GDPR question of data ownership during a transfer is complex and poorly anticipated.' },
      ]},
      { type: 'h2', text: { fr: 'La checklist pré-cession en 12 points', en: 'The 12-point pre-sale checklist' } },
      { type: 'list', items: [
        { fr: 'Contrats de cession de droits signés avec tous les prestataires ayant contribué au code', en: 'Rights assignment contracts signed with all contractors who contributed to the code' },
        { fr: 'Marque verbale déposée dans le pays principal d\'opération', en: 'Verbal trademark filed in the principal country of operation' },
        { fr: 'Extension marque en cours ou complète (EUIPO, WIPO selon ambition)', en: 'Trademark extension in progress or complete (EUIPO, WIPO depending on ambition)' },
        { fr: 'Audit des licences open source (outil recommandé : FOSSA ou BlackDuck)', en: 'Open source licence audit (recommended tool: FOSSA or BlackDuck)' },
        { fr: 'Contrats formalisés pour toutes les APIs tierces critiques', en: 'Formalised contracts for all critical third-party APIs' },
        { fr: 'Politique de confidentialité RGPD à jour et DPA signé avec les sous-traitants', en: 'Up-to-date GDPR privacy policy and DPA signed with sub-processors' },
        { fr: 'Documentation des données utilisateurs : nature, volume, localisation, durée de rétention', en: 'User data documentation: nature, volume, location, retention period' },
        { fr: 'Accord de transfert de données prévu dans le SPA (Article 28 RGPD)', en: 'Data transfer agreement provided for in the SPA (Article 28 GDPR)' },
        { fr: 'Nom de domaine détenu par l\'entité légale qui cède (pas par le fondateur en nom propre)', en: 'Domain name owned by the legal entity selling (not by the founder personally)' },
        { fr: 'Comptes techniques (GitHub, AWS, Stripe, etc.) dissociés du compte personnel du fondateur', en: 'Technical accounts (GitHub, AWS, Stripe, etc.) dissociated from the founder\'s personal account' },
        { fr: 'Secret et confidentialité : existence d\'un trade secret documenté si applicable', en: 'Secrecy and confidentiality: existence of a documented trade secret if applicable' },
        { fr: 'Historique de versionnage complet et accessible (Git log clean, pas de force push destructeur)', en: 'Complete and accessible version history (clean Git log, no destructive force push)' },
      ]},
      { type: 'quote', text: {
        fr: 'La dimension IP représente 25 points sur 100 dans le protocole AEGRYN Grade. C\'est la dimension qui génère le plus de réserves lors des certifications — et la plus facile à anticiper.',
        en: 'The IP dimension represents 25 points out of 100 in the AEGRYN Grade protocol. It is the dimension that generates the most reservations during certifications — and the easiest to anticipate.',
      }, author: 'AEGRYN Grade Protocol' },
      { type: 'h2', text: { fr: 'Ce que révèle la certification AEGRYN sur l\'IP', en: 'What AEGRYN certification reveals about IP' } },
      { type: 'p', text: {
        fr: 'Les lacunes les plus fréquentes identifiées lors des certifications : absence de cession de droits prestataires (43% des actifs soumis), marque non déposée (61%), et dépendances open source GPL non documentées (28%).',
        en: 'The most common gaps identified during certifications: absence of contractor rights assignment (43% of submitted assets), unfiled trademark (61%), and undocumented GPL open source dependencies (28%).',
      }},
      { type: 'stats', items: [
        { value: '43%', label: { fr: 'Actifs soumis sans cession de droits prestataires', en: 'Assets submitted without contractor rights assignment' } },
        { value: '61%', label: { fr: 'Actifs soumis avec marque non déposée', en: 'Assets submitted with unfiled trademark' } },
        { value: '28%', label: { fr: 'Actifs avec dépendances GPL non documentées', en: 'Assets with undocumented GPL dependencies' } },
      ]},
    ],
  },
  {
    slug:     'glossaire-ma-tech-europe',
    category: 'strategy',
    date:     '2026-03-01',
    readMin:  10,
    featured: true,
    title: {
      fr: 'Glossaire M&A tech — Les 30 termes essentiels',
      en: 'Tech M&A Glossary — The 30 essential terms',
    },
    excerpt: {
      fr: 'Le marché M&A tech a son propre vocabulaire. Ce glossaire couvre les termes essentiels, des métriques SaaS aux mécanismes contractuels, pour que fondateurs et acquéreurs parlent le même langage.',
      en: 'The tech M&A market has its own vocabulary. This glossary covers the essential terms, from SaaS metrics to contractual mechanisms, so founders and acquirers speak the same language.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché M&A tech a son propre vocabulaire — et la confusion terminologique est souvent la première barrière pour les fondateurs qui envisagent une cession. Ce glossaire couvre les termes essentiels, des métriques SaaS aux mécanismes contractuels.',
        en: 'The tech M&A market has its own vocabulary — and terminological confusion is often the first barrier for founders considering a sale. This glossary covers the essential terms, from SaaS metrics to contractual mechanisms.',
      }},
      { type: 'h2', text: { fr: 'Métriques de valorisation', en: 'Valuation metrics' } },
      { type: 'list', items: [
        { fr: 'ARR (Annual Recurring Revenue) — Le revenu annuel récurrent, base de calcul des multiples de valorisation SaaS. Ne pas confondre avec le revenu total qui inclut les revenus one-shot.', en: 'ARR (Annual Recurring Revenue) — The annual recurring revenue, basis for SaaS valuation multiples. Do not confuse with total revenue which includes one-shot revenues.' },
        { fr: 'MRR (Monthly Recurring Revenue) — L\'ARR divisé par 12. Utile pour les actifs jeunes ou en forte croissance.', en: 'MRR (Monthly Recurring Revenue) — ARR divided by 12. Useful for young or fast-growing assets.' },
        { fr: 'NRR (Net Revenue Retention) — Mesure l\'évolution du revenu sur une cohorte de clients existants. NRR > 100% = expansion nette. Indicateur critique pour les multiples premium.', en: 'NRR (Net Revenue Retention) — Measures revenue evolution on a cohort of existing clients. NRR > 100% = net expansion. Critical indicator for premium multiples.' },
        { fr: 'Churn — Taux d\'attrition. Churn client (% de clients perdus) vs churn revenu (% de revenu perdu). Le churn revenu est plus significatif.', en: 'Churn — Attrition rate. Client churn (% of clients lost) vs revenue churn (% of revenue lost). Revenue churn is more significant.' },
        { fr: 'LTV (Lifetime Value) — Revenu total généré par un client sur sa durée de vie. LTV = ARPU × 1/churn mensuel.', en: 'LTV (Lifetime Value) — Total revenue generated by a client over their lifetime. LTV = ARPU × 1/monthly churn.' },
        { fr: 'CAC (Customer Acquisition Cost) — Coût d\'acquisition d\'un client. Ratio LTV:CAC > 3:1 est le seuil minimum pour un SaaS B2B sain.', en: 'CAC (Customer Acquisition Cost) — Cost of acquiring a client. LTV:CAC ratio > 3:1 is the minimum threshold for a healthy B2B SaaS.' },
        { fr: 'Multiple ARR — Prix de cession exprimé en multiple de l\'ARR annuel. Exemple : actif avec 500K€ ARR vendu 2M€ = multiple de 4x ARR.', en: 'ARR multiple — Sale price expressed as a multiple of annual ARR. Example: asset with €500K ARR sold for €2M = 4x ARR multiple.' },
      ]},
      { type: 'h2', text: { fr: 'Mécanismes de transaction', en: 'Transaction mechanisms' } },
      { type: 'list', items: [
        { fr: 'LOI (Letter of Intent) — Lettre d\'intention non-engageante. Première formalisation de l\'accord entre acheteur et vendeur sur le prix indicatif et les conditions principales.', en: 'LOI (Letter of Intent) — Non-binding letter of intent. First formalisation of the agreement between buyer and seller on the indicative price and main conditions.' },
        { fr: 'SPA (Share Purchase Agreement) — Acte de cession final dans le cas d\'un share deal (rachat de la société qui détient l\'actif).', en: 'SPA (Share Purchase Agreement) — Final transfer deed in the case of a share deal (acquisition of the company holding the asset).' },
        { fr: 'Asset deal — Acquisition des actifs uniquement (code, IP, contrats, clients) sans reprendre la structure légale de la société.', en: 'Asset deal — Acquisition of assets only (code, IP, contracts, clients) without taking on the legal company structure.' },
        { fr: 'Earnout — Complément de prix conditionnel versé après le closing, basé sur l\'atteinte d\'objectifs définis (ARR, croissance, rétention).', en: 'Earnout — Conditional price supplement paid after closing, based on achieving defined targets (ARR, growth, retention).' },
        { fr: 'Séquestre (escrow) — Montant bloqué par une tierce partie (banque ou notaire) pendant la période entre la signature de la promesse et le closing.', en: 'Escrow — Amount held by a third party (bank or notary) during the period between signing the promise and closing.' },
        { fr: 'Due diligence — Processus d\'audit approfondi mené par l\'acquéreur avant closing. Couvre les dimensions technique, juridique, financière, et commerciale.', en: 'Due diligence — In-depth audit process conducted by the acquirer before closing. Covers technical, legal, financial, and commercial dimensions.' },
        { fr: 'Closing — Finalisation juridique et financière de la transaction. Signature du SPA + virement du solde + transfert des droits.', en: 'Closing — Legal and financial completion of the transaction. SPA signature + balance transfer + rights transfer.' },
      ]},
      { type: 'h2', text: { fr: 'Certification et grade', en: 'Certification and grade' } },
      { type: 'list', items: [
        { fr: 'Grade AEG — Certification indépendante des analystes AEGRYN sur un actif tech, émise selon un protocole reproductible. De ★ (Exceptionnel) à B (Correct). Non attribué = Refusé.', en: 'AEG Grade — Independent certification from AEGRYN analysts on a tech asset, issued following a reproducible protocol. From ★ (Exceptional) to B (Standard). Not assigned = Refused.' },
        { fr: 'Dimension C (Code) — Qualité du codebase : dette technique, tests, documentation, CI/CD, sécurité applicative.', en: 'Dimension C (Code) — Codebase quality: technical debt, tests, documentation, CI/CD, application security.' },
        { fr: 'Dimension I (IP) — Propriété intellectuelle : marques, droits logiciels, licences, contrats prestataires.', en: 'Dimension I (IP) — Intellectual property: trademarks, software rights, licences, contractor contracts.' },
        { fr: 'Dimension F (Finance) — Métriques financières : ARR audité, NRR, churn, marges, croissance.', en: 'Dimension F (Finance) — Financial metrics: audited ARR, NRR, churn, margins, growth.' },
        { fr: 'Dimension S (Sécurité) — Posture de sécurité : pentest, conformité RGPD/NIS2, architecture sécurité.', en: 'Dimension S (Security) — Security posture: pentest, GDPR/NIS2 compliance, security architecture.' },
        { fr: 'Data room — Espace sécurisé de partage de documents entre vendeur et acquéreur qualifié, sous NDA. Contient les éléments d\'audit complets.', en: 'Data room — Secure document sharing space between seller and qualified acquirer, under NDA. Contains complete audit materials.' },
      ]},
      { type: 'h2', text: { fr: 'Profils d\'acquéreurs', en: 'Acquirer profiles' } },
      { type: 'list', items: [
        { fr: 'PE (Private Equity) — Fonds d\'investissement qui acquiert pour restructurer et revendre à horizon 3–7 ans. Représente 58% des acquéreurs SaaS en 2025.', en: 'PE (Private Equity) — Investment fund that acquires to restructure and resell at a 3–7 year horizon. Represents 58% of SaaS acquirers in 2025.' },
        { fr: 'Family Office — Structure gérant la fortune d\'une famille. Horizon d\'investissement long terme, appétit pour des actifs stables et rentables.', en: 'Family Office — Structure managing a family\'s wealth. Long-term investment horizon, appetite for stable and profitable assets.' },
        { fr: 'Search Fund — Véhicule créé par un entrepreneur (le searcher) pour lever du capital, trouver une entreprise à acquérir, et l\'opérer personnellement.', en: 'Search Fund — Vehicle created by an entrepreneur (the searcher) to raise capital, find a company to acquire, and operate it personally.' },
        { fr: 'Strategic buyer — Acquéreur industriel qui intègre l\'actif à son activité existante (acqui-hire, intégration technique, expansion verticale).', en: 'Strategic buyer — Industrial acquirer who integrates the asset into their existing activity (acqui-hire, technical integration, vertical expansion).' },
      ]},
      { type: 'stats', items: [
        { value: '3,1x ARR', label: { fr: 'Multiple médian SaaS privé Europe mars 2026', en: 'European private SaaS median multiple March 2026' } },
        { value: '6,9x ARR', label: { fr: 'Multiple médian top quartile (NRR > 110%)', en: 'Top quartile median multiple (NRR > 110%)' } },
        { value: '90j',      label: { fr: 'Durée moyenne d\'une cession M&A tech mid-market', en: 'Average duration of a tech M&A mid-market sale' } },
      ]},
    ],
  },
  {
    slug:     'legaltech-europe-valorisation-ma-2026',
    category: 'vertical',
    date:     '2026-07-15',
    readMin:  8,
    featured: false,
    title: {
      fr: 'LegalTech européenne en 2026 : valorisation, M&A et opportunités',
      en: 'European LegalTech in 2026: valuation, M&A and opportunities',
    },
    excerpt: {
      fr: 'Multiples de valorisation, deals actifs et profils d\'acquéreurs sur le marché LegalTech en Europe — données 2026. Pourquoi le vertical LegalTech attire les fonds PE et comment certifier un actif dans ce domaine.',
      en: 'Valuation multiples, active deals and acquirer profiles in the European LegalTech market — 2026 data. Why the LegalTech vertical attracts PE funds and how to certify an asset in this space.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché LegalTech européen connaît une transformation structurelle. Ce qui était autrefois perçu comme une niche conservatrice — la technologie appliquée au droit — est devenu l\'un des verticaux les plus convoités par les fonds de private equity en 2026. Les raisons sont multiples : revenus récurrents élevés, faible churn sur des clients captifs (cabinets, directions juridiques, greffes), et barrières réglementaires qui constituent des fossés défensifs naturels.',
        en: 'The European LegalTech market is undergoing a structural transformation. What was once perceived as a conservative niche — technology applied to law — has become one of the most sought-after verticals by private equity funds in 2026. The reasons are multiple: high recurring revenues, low churn on captive clients (law firms, legal departments, court registries), and regulatory barriers that constitute natural defensive moats.',
      }},
      { type: 'h2', text: { fr: 'Pourquoi la LegalTech attire les acquéreurs PE en 2026', en: 'Why LegalTech attracts PE acquirers in 2026' } },
      { type: 'p', text: {
        fr: 'Trois facteurs structurels expliquent l\'intérêt croissant des fonds pour le vertical LegalTech. Premièrement, la transformation numérique des cabinets d\'avocats et des directions juridiques d\'entreprise est contrainte et irréversible — les outils LegalTech deviennent des infrastructures critiques, non des options. Deuxièmement, les acteurs établis (Thomson Reuters, Wolters Kluwer, LexisNexis) achètent activement des solutions complémentaires pour enrichir leurs plateformes. Troisièmement, la vague réglementaire européenne (IA Act, CSRD, DSA/DMA) crée une demande inélastique pour des outils de conformité et de monitoring.',
        en: 'Three structural factors explain the growing interest of funds in the LegalTech vertical. First, the digital transformation of law firms and corporate legal departments is constrained and irreversible — LegalTech tools are becoming critical infrastructure, not options. Second, established players (Thomson Reuters, Wolters Kluwer, LexisNexis) are actively buying complementary solutions to enrich their platforms. Third, the European regulatory wave (AI Act, CSRD, DSA/DMA) creates inelastic demand for compliance and monitoring tools.',
      }},
      { type: 'h2', text: { fr: 'Les multiples observés en 2026 (9x–13x ARR en DACH)', en: 'Observed multiples in 2026 (9x–13x ARR in DACH)' } },
      { type: 'stats', items: [
        { value: '9x–13x', label: { fr: 'Multiple ARR médian — DACH LegalTech', en: 'Median ARR multiple — DACH LegalTech' } },
        { value: '8x–11x', label: { fr: 'Multiple ARR médian — France LegalTech', en: 'Median ARR multiple — France LegalTech' } },
        { value: '78%', label: { fr: 'Deals LegalTech avec NRR > 105%', en: 'LegalTech deals with NRR > 105%' } },
        { value: '< 25%', label: { fr: 'Taux d\'acceptation certification AEGRYN', en: 'AEGRYN certification acceptance rate' } },
      ]},
      { type: 'p', text: {
        fr: 'Les multiples LegalTech DACH (Allemagne, Autriche, Suisse) sont systématiquement plus élevés qu\'en France ou en Europe du Sud. Cette prime s\'explique par la taille du marché adressable (le droit DACH est plus formalisé et l\'adoption digitale plus rapide dans les cabinets), par la densité de fonds PE sectoriels actifs sur la zone, et par la qualité des actifs disponibles. En France, les multiples restent attractifs mais sont pénalisés par des structures de revenus souvent hybrides (SaaS + services).',
        en: 'DACH LegalTech multiples (Germany, Austria, Switzerland) are systematically higher than in France or Southern Europe. This premium is explained by the addressable market size (DACH law is more formalised and digital adoption is faster in firms), the density of sector-specific PE funds active in the region, and the quality of available assets. In France, multiples remain attractive but are penalised by often hybrid revenue structures (SaaS + services).',
      }},
      { type: 'h2', text: { fr: 'Les sous-verticales les plus actives', en: 'The most active sub-verticals' } },
      { type: 'list', items: [
        { fr: 'Contract management & e-signature : segment le plus mature, dominé par des acteurs SaaS B2B avec NRR > 110%. Intègre des IA de revue contractuelle (résumé, anomalies, clauses risquées).', en: 'Contract management & e-signature: the most mature segment, dominated by B2B SaaS players with NRR > 110%. Includes AI-powered contract review (summaries, anomalies, risky clauses).' },
        { fr: 'Compliance & regulatory monitoring : forte croissance post-IA Act. Les solutions qui alertent en temps réel sur les nouvelles obligations réglementaires sont en train de devenir des infrastructures d\'entreprise.', en: 'Compliance & regulatory monitoring: strong growth post-AI Act. Solutions that alert in real time on new regulatory obligations are becoming enterprise infrastructure.' },
        { fr: 'Legal research AI : marché en consolidation rapide. Les acteurs capables de traiter les jurisprudences nationales (droit civil vs common law) ont un avantage compétitif structurel.', en: 'Legal research AI: market in rapid consolidation. Players capable of processing national case law (civil law vs common law) have a structural competitive advantage.' },
        { fr: 'Court & arbitration tech : niche très défensive. Les solutions homologuées par les greffes ou les chambres arbitrales ont des cycles de vente longs mais des taux de churn proches de 0%.', en: 'Court & arbitration tech: very defensive niche. Solutions approved by court registries or arbitration chambers have long sales cycles but churn rates close to 0%.' },
      ]},
      { type: 'h2', text: { fr: 'Profils d\'acquéreurs types', en: 'Typical acquirer profiles' } },
      { type: 'list', items: [
        { fr: 'Éditeurs de logiciels métier (Legal ERP) : cherchent à enrichir leur suite par acquisition de modules complémentaires. Paient des primes de synergies (10–15% au-dessus du marché).', en: 'Business software publishers (Legal ERP): looking to enrich their suite by acquiring complementary modules. Pay synergy premiums (10–15% above market).' },
        { fr: 'Fonds PE sectoriels (Hg Capital, Francisco Partners, Insight Partners) : ciblent des actifs avec ARR > 3M€, NRR > 105%, marges brutes > 70%. Portage 4–6 ans puis exit secondaire.', en: 'Sector-specific PE funds (Hg Capital, Francisco Partners, Insight Partners): targeting assets with ARR > €3M, NRR > 105%, gross margins > 70%. 4–6 year hold then secondary exit.' },
        { fr: 'Cabinets d\'avocats en transformation digitale : rachats d\'actifs LegalTech pour internaliser la technologie (acqui-hire). Profil moins fréquent mais valorisations plus élevées quand la techno est stratégique.', en: 'Law firms undergoing digital transformation: acquiring LegalTech assets to internalise technology (acqui-hire). Less frequent profile but higher valuations when the tech is strategic.' },
      ]},
      { type: 'h2', text: { fr: 'Métriques prioritaires pour un actif LegalTech', en: 'Priority metrics for a LegalTech asset' } },
      { type: 'list', items: [
        { fr: 'NRR > 105% : indicateur critique. Les cabinets ne changent pas d\'outil facilement — un NRR < 100% est un signal d\'alarme majeur.', en: 'NRR > 105%: critical indicator. Law firms don\'t change tools easily — an NRR < 100% is a major red flag.' },
        { fr: 'Marges brutes > 70% : les solutions avec composante services (implementation, formation) voient leurs marges compressées. Viser 75–80% pour un multiple premium.', en: 'Gross margins > 70%: solutions with a service component (implementation, training) see margins compressed. Target 75–80% for a premium multiple.' },
        { fr: 'Conformité réglementaire documentée : RGPD (hébergement des données juridiques), secret professionnel, audits de sécurité. La dimension S du Grade AEGRYN est critique pour ce vertical.', en: 'Documented regulatory compliance: GDPR (legal data hosting), professional secrecy, security audits. The S dimension of the AEGRYN Grade is critical for this vertical.' },
        { fr: 'IP propriétaire sur les modèles IA : si l\'actif inclut des modèles LLM fine-tunés sur du droit, la propriété des données d\'entraînement et des weights est un point de diligence majeur.', en: 'Proprietary IP on AI models: if the asset includes LLMs fine-tuned on law, ownership of training data and weights is a major diligence point.' },
      ]},
      { type: 'h2', text: { fr: 'Certifier un actif LegalTech : spécificités dimension I (IP)', en: 'Certifying a LegalTech asset: IP dimension specificities' } },
      { type: 'p', text: {
        fr: 'La dimension I (Propriété Intellectuelle) du protocole de certification AEGRYN prend une importance particulière dans le vertical LegalTech. Les points de vigilance spécifiques sont : (1) les contrats de prestation de services juridiques signés avec des cabinets incluent souvent des clauses de cession de droits ambiguës sur les données produites — ces clauses doivent être auditées précisément ; (2) les bases de données jurisprudentielles utilisées pour entraîner les modèles IA doivent être licenciées ou issues de sources open data vérifiées ; (3) la marque doit être déposée dans toutes les classes pertinentes (classe 42 pour les logiciels, classe 45 pour les services juridiques). Moins de 30% des actifs LegalTech soumis passent la certification AEGRYN au premier passage.',
        en: 'The I (Intellectual Property) dimension of the AEGRYN certification protocol takes on particular importance in the LegalTech vertical. Specific points of vigilance are: (1) legal services contracts signed with law firms often include ambiguous rights assignment clauses on produced data — these clauses must be precisely audited; (2) case law databases used to train AI models must be licensed or derived from verified open data sources; (3) the brand must be registered in all relevant classes (class 42 for software, class 45 for legal services). Fewer than 30% of LegalTech assets submitted pass AEGRYN certification on the first attempt.',
      }},
    ],
    faq: [
      {
        q: { fr: 'Quel est le multiple de valorisation moyen pour une LegalTech en Europe ?', en: 'What is the average valuation multiple for a LegalTech in Europe?' },
        a: { fr: 'En 2026, les multiples observés varient de 8x à 13x l\'ARR annuel selon la géographie et la qualité de l\'actif. Le DACH affiche les multiples les plus élevés (9x–13x), suivi de la France (8x–11x). Ces multiples supposent un NRR > 105% et des marges brutes > 70%.', en: 'In 2026, observed multiples range from 8x to 13x annual ARR depending on geography and asset quality. DACH shows the highest multiples (9x–13x), followed by France (8x–11x). These multiples assume NRR > 105% and gross margins > 70%.' },
      },
      {
        q: { fr: 'Quels acquéreurs achètent des actifs LegalTech en Europe ?', en: 'Which acquirers buy LegalTech assets in Europe?' },
        a: { fr: 'Trois profils principaux : les éditeurs de logiciels métier qui cherchent à enrichir leur suite (Thomson Reuters, iManage, Clio), les fonds PE sectoriels spécialisés en vertical software (Hg Capital, Francisco Partners), et les cabinets d\'avocats en transformation digitale (acqui-hire). Les fonds PE représentent environ 60% des deals LegalTech en valeur.', en: 'Three main profiles: business software publishers looking to enrich their suite (Thomson Reuters, iManage, Clio), sector-specific PE funds specialising in vertical software (Hg Capital, Francisco Partners), and law firms undergoing digital transformation (acqui-hire). PE funds account for approximately 60% of LegalTech deals by value.' },
      },
      {
        q: { fr: 'Quelles sont les métriques les plus importantes pour valoriser une LegalTech ?', en: 'What are the most important metrics for valuing a LegalTech?' },
        a: { fr: 'Par ordre d\'importance : NRR (> 105% pour un multiple premium), marges brutes (> 70%), ARR audité, taux de renouvellement des contrats (> 90%), et conformité RGPD documentée. La propriété intellectuelle sur les modèles IA est un facteur différenciant croissant.', en: 'In order of importance: NRR (> 105% for a premium multiple), gross margins (> 70%), audited ARR, contract renewal rate (> 90%), and documented GDPR compliance. IP ownership on AI models is an increasingly differentiating factor.' },
      },
      {
        q: { fr: 'Pourquoi si peu d\'actifs LegalTech passent la certification AEGRYN ?', en: 'Why do so few LegalTech assets pass AEGRYN certification?' },
        a: { fr: 'Moins de 30% des actifs LegalTech soumis passent au premier passage. Les trois causes principales de refus : (1) IP insuffisamment documentée (contrats prestataires incomplets, marque non déposée), (2) revenus hybrides SaaS + services mal séparés dans la comptabilité (ARR non auditable), (3) absence de pentest ou de documentation RGPD sur le traitement des données juridiques clients.', en: 'Fewer than 30% of LegalTech assets submitted pass on the first attempt. The three main causes of rejection: (1) insufficiently documented IP (incomplete contractor contracts, unfiled trademark), (2) hybrid SaaS + services revenues poorly separated in accounting (non-auditable ARR), (3) absence of pentest or GDPR documentation on the processing of client legal data.' },
      },
      {
        q: { fr: 'La Suisse est-elle un bon pays pour céder une LegalTech ?', en: 'Is Switzerland a good country for selling a LegalTech?' },
        a: { fr: 'Oui — la Suisse est particulièrement adaptée pour trois raisons : (1) concentration de family offices et fonds PE actifs sur le vertical legal software, (2) cadre juridique favorable (droit suisse des obligations, confidentialité institutionnelle), (3) neutralité qui facilite les transactions cross-border entre acquéreurs européens. AEGRYN opère depuis Genève/Zurich et dispose d\'un deal flow qualifié sur ce segment.', en: 'Yes — Switzerland is particularly well-suited for three reasons: (1) concentration of family offices and PE funds active on the legal software vertical, (2) favourable legal framework (Swiss law of obligations, institutional confidentiality), (3) neutrality that facilitates cross-border transactions between European acquirers. AEGRYN operates from Geneva/Zurich and has qualified deal flow in this segment.' },
      },
    ],
  },

  /* ── CLUSTER 1 — VENDEURS ───────────────────────────────────────────── */

  {
    slug:     'comment-vendre-son-saas-europe-guide-complet',
    category: 'seller',
    date:     '2026-07-20',
    readMin:  14,
    featured: false,
    title: {
      fr: 'Comment vendre son SaaS en Europe en 2026 : le guide complet pour les fondateurs',
      en: 'How to sell your SaaS in Europe in 2026: the complete founder\'s guide',
    },
    excerpt: {
      fr: 'De la préparation à la signature du SPA — le parcours complet d\'une cession SaaS en Europe, avec délais réels, métriques décisives et erreurs à éviter.',
      en: 'From preparation to SPA signing — the complete journey of a SaaS sale in Europe, with real timelines, decisive metrics and mistakes to avoid.',
    },
    body: [
      { type: 'p', text: {
        fr: 'En 2025, 2 698 transactions SaaS ont été recensées à l\'échelle mondiale, selon les données Dealroom. En Europe, les volumes M&A tech ont représenté 14,2 milliards d\'euros. Pourtant, moins d\'un fondateur sur cinq ayant l\'intention de céder son actif aboutit effectivement à un closing dans les 24 mois — non par manque d\'acheteurs, mais par manque de préparation structurée. Ce guide couvre l\'intégralité du processus, étape par étape.',
        en: 'In 2025, 2,698 SaaS transactions were recorded globally, according to Dealroom data. In Europe, tech M&A volumes reached €14.2 billion. Yet fewer than one in five founders intending to sell their asset actually reaches closing within 24 months — not for lack of buyers, but for lack of structured preparation. This guide covers the entire process, step by step.',
      }},
      { type: 'h2', text: { fr: 'Pourquoi vendre maintenant vs attendre', en: 'Why sell now vs waiting' } },
      { type: 'p', text: {
        fr: 'La question du timing est la plus sous-estimée dans une cession. Les données Dealsuite 2025 montrent que l\'âge moyen du fondateur vendeur est passé de 61 ans en 2015 à 57 ans en 2025 — signe que les cessions anticipées deviennent la norme. Vendre au pic de performance (NRR en expansion, churn bas, pipeline plein) est structurellement plus avantageux que vendre en phase de plateau. Un actif SaaS qui stagne à 1,2M€ ARR depuis 18 mois se négocie à 3–4x ARR. Le même actif en croissance de 40% se négocie à 6–8x. L\'écart est de 2 à 4 millions d\'euros sur un actif moyen.',
        en: 'The timing question is the most underestimated in a sale. Dealsuite 2025 data shows the average age of selling founders has dropped from 61 in 2015 to 57 in 2025 — a sign that early exits are becoming the norm. Selling at peak performance (NRR expanding, low churn, full pipeline) is structurally more advantageous than selling at plateau. A SaaS asset stagnating at €1.2M ARR for 18 months trades at 3–4x ARR. The same asset growing at 40% trades at 6–8x. The gap is €2–4 million on an average asset.',
      }},
      { type: 'h2', text: { fr: 'Les 3 types d\'acheteurs et ce qu\'ils cherchent', en: 'The 3 buyer types and what they look for' } },
      { type: 'list', items: [
        { fr: 'Fonds Private Equity (58% des deals en volume, source : Dealroom 2025) : cherchent ARR > 1M€, NRR > 105%, marges brutes > 70%, croissance > 20% YoY. Horizon de portage 4–6 ans, exit secondaire. Paient 4–8x ARR selon la qualité.', en: 'Private Equity funds (58% of deals by volume, source: Dealroom 2025): seek ARR > €1M, NRR > 105%, gross margins > 70%, growth > 20% YoY. 4–6 year hold, secondary exit. Pay 4–8x ARR depending on quality.' },
        { fr: 'Acquéreurs stratégiques (industriels, éditeurs logiciels) : cherchent des synergies produit ou technologiques. Paient des primes de 15–30% vs les fonds, mais les processus de décision sont plus longs (6–12 mois vs 3–6 pour les PE).', en: 'Strategic acquirers (industrials, software publishers): seek product or technology synergies. Pay 15–30% premiums vs funds, but decision processes are longer (6–12 months vs 3–6 for PE).' },
        { fr: 'Search funds & entrepreneurs repreneurs (segment en forte croissance, +38% en Europe en 2025, source : IESE Business School) : cherchent des SaaS profitables ou à l\'équilibre, ARR 300K€–2M€, fondateur absent du produit post-closing. Paient 3–5x ARR.', en: 'Search funds & entrepreneurial acquirers (fast-growing segment, +38% in Europe in 2025, source: IESE Business School): seek profitable or breakeven SaaS, ARR €300K–€2M, founder absent from product post-closing. Pay 3–5x ARR.' },
      ]},
      { type: 'h2', text: { fr: 'Les métriques qui font votre prix', en: 'The metrics that make your price' } },
      { type: 'stats', items: [
        { value: '3,1x',  label: { fr: 'Multiple ARR médian SaaS privé Europe (Dealroom H1 2026)', en: 'Median ARR multiple private SaaS Europe (Dealroom H1 2026)' } },
        { value: '6,9x',  label: { fr: 'Multiple ARR top quartile (NRR > 110%)', en: 'Top quartile ARR multiple (NRR > 110%)' } },
        { value: '70%+',  label: { fr: 'Seuil marges brutes pour multiple premium', en: 'Gross margin threshold for premium multiple' } },
        { value: '90j',   label: { fr: 'Durée médiane closing M&A SaaS mid-market', en: 'Median closing duration M&A SaaS mid-market' } },
      ]},
      { type: 'p', text: {
        fr: 'Le NRR (Net Revenue Retention) est l\'indicateur n°1 qui détermine votre multiple. Un NRR > 110% sur 12 mois consécutifs place mécaniquement votre actif dans le top quartile des multiples. Concrètement : chaque point de NRR au-dessus de 100% vaut 0,2–0,4x ARR supplémentaire selon les données observées sur les transactions AEGRYN 2024–2025.',
        en: 'NRR (Net Revenue Retention) is the #1 indicator that determines your multiple. An NRR > 110% over 12 consecutive months mechanically places your asset in the top quartile of multiples. Concretely: each NRR point above 100% is worth 0.2–0.4x additional ARR based on data observed on AEGRYN 2024–2025 transactions.',
      }},
      { type: 'h2', text: { fr: 'La certification avant la cession : pourquoi ça change tout', en: 'Certification before the sale: why it changes everything' } },
      { type: 'p', text: {
        fr: 'Les actifs certifiés AEGRYN Grade se négocient en médiane à 6,9x ARR, contre 3,1x pour les actifs non certifiés du même segment. L\'explication est simple : la certification réduit le risque perçu par l\'acquéreur — elle documente les quatre dimensions critiques (Code, IP, Finance, Sécurité) de façon opposable. Un acquéreur qui n\'a pas à refaire l\'audit technique lui-même peut offrir une prime. Moins de 25% des actifs soumis passent la certification AEGRYN au premier passage — les 75% restants reçoivent un plan de remédiation.',
        en: 'AEGRYN Grade-certified assets trade at a median of 6.9x ARR, versus 3.1x for uncertified assets in the same segment. The explanation is simple: certification reduces the perceived risk for the acquirer — it documents the four critical dimensions (Code, IP, Finance, Security) in an enforceable way. An acquirer who doesn\'t have to redo the technical audit themselves can offer a premium. Fewer than 25% of assets submitted pass AEGRYN certification on the first attempt — the remaining 75% receive a remediation plan.',
      }},
      { type: 'h2', text: { fr: 'Le processus de cession étape par étape', en: 'The sale process step by step' } },
      { type: 'list', items: [
        { fr: 'Mois 1–3 : Préparation — audit interne, nettoyage IP, constitution data room, certification AEGRYN (si applicable). C\'est la phase la plus sous-estimée et la plus critique.', en: 'Months 1–3: Preparation — internal audit, IP clean-up, data room setup, AEGRYN certification (if applicable). This is the most underestimated and most critical phase.' },
        { fr: 'Mois 3–5 : Mise en marché — rédaction du teaser confidentiel, sélection des acquéreurs qualifiés, NDA, accès data room sous contrôle.', en: 'Months 3–5: Market launch — writing the confidential teaser, selecting qualified acquirers, NDAs, controlled data room access.' },
        { fr: 'Mois 5–7 : Offres indicatives (LOI) — évaluation des offres, sélection 1–3 acquéreurs préférés, négociation des termes principaux (prix, structure, earnout éventuel).', en: 'Months 5–7: Indicative offers (LOI) — evaluation of offers, selection of 1–3 preferred acquirers, negotiation of main terms (price, structure, any earnout).' },
        { fr: 'Mois 7–9 : Due diligence exclusive — audit approfondi par l\'acquéreur retenu. C\'est ici que les lacunes non corrigées en phase 1 font sauter ou revaloriser les deals.', en: 'Months 7–9: Exclusive due diligence — in-depth audit by the selected acquirer. This is where uncorrected gaps from phase 1 collapse deals or trigger price renegotiation.' },
        { fr: 'Mois 9–10 : SPA et closing — négociation de l\'acte de cession, séquestre, transfert des droits, période de transition.', en: 'Months 9–10: SPA and closing — negotiation of the transfer deed, escrow, rights transfer, transition period.' },
      ]},
      { type: 'h2', text: { fr: 'Les erreurs qui font chuter le prix', en: 'The mistakes that destroy the price' } },
      { type: 'list', items: [
        { fr: 'Présenter un ARR non auditable (mix abonnements + prestations ponctuelles non séparés). L\'acquéreur décote systématiquement de 20–40% en présence d\'ARR hybride.', en: 'Presenting non-auditable ARR (mix of subscriptions + one-off services not separated). Acquirers systematically apply a 20–40% discount on hybrid ARR.' },
        { fr: 'Découvrir des problèmes IP en due diligence (prestataires sans cession de droits, marque non déposée). Dans 43% des cas (données AEGRYN 2024–2025), un problème IP force une renégociation du prix à la baisse ou un ajustement du séquestre.', en: 'Discovering IP issues in due diligence (contractors without rights assignment, unfiled trademark). In 43% of cases (AEGRYN 2024–2025 data), an IP issue forces a price renegotiation downward or an escrow adjustment.' },
        { fr: 'Sur-dépendance du fondateur : un actif qui nécessite le fondateur pour fonctionner se négocie 30–50% sous le marché. L\'acquéreur achète un actif, pas une personne.', en: 'Founder over-dependency: an asset that requires the founder to operate trades at 30–50% below market. The acquirer buys an asset, not a person.' },
        { fr: 'Entrer en processus sans mandate clair : les cessions "faites maison" sans broker ou structure formelle prennent en moyenne 8 mois de plus et aboutissent 40% moins souvent à un closing (source : Dealsuite 2025).', en: 'Entering a process without a clear mandate: "DIY" sales without a broker or formal structure take an average 8 months longer and reach closing 40% less often (source: Dealsuite 2025).' },
      ]},
      { type: 'quote', text: {
        fr: 'Un actif bien préparé se vend deux fois plus cher et deux fois plus vite qu\'un actif mal préparé — la préparation n\'est pas une formalité, c\'est la principale source de création de valeur dans une cession.',
        en: 'A well-prepared asset sells for twice as much and twice as fast as a poorly prepared one — preparation is not a formality, it is the primary source of value creation in a sale.',
      }, author: 'AEGRYN Advisory' },
    ],
    faq: [
      {
        q: { fr: 'Combien de temps prend une cession SaaS en Europe ?', en: 'How long does a SaaS sale in Europe take?' },
        a: { fr: 'En médiane, une cession SaaS mid-market en Europe prend 9 à 12 mois du début de la préparation au closing. Les transactions sous 500K€ ARR peuvent se conclure en 4–6 mois. Les deals à partir de 2M€ ARR prennent rarement moins de 12 mois en raison de la complexité de la due diligence et des négociations contractuelles.', en: 'At the median, a mid-market SaaS sale in Europe takes 9 to 12 months from the start of preparation to closing. Sub-€500K ARR transactions can close in 4–6 months. Deals from €2M ARR rarely take less than 12 months due to due diligence complexity and contractual negotiations.' },
      },
      {
        q: { fr: 'Quel ARR minimum pour vendre son SaaS ?', en: 'What minimum ARR to sell your SaaS?' },
        a: { fr: 'Il n\'y a pas de seuil absolu, mais en pratique : sous 200K€ ARR, les seuls acheteurs réalistes sont des entrepreneurs individuels ou des search funds en phase initiale. Entre 500K€ et 2M€ ARR, le marché s\'ouvre aux fonds PE et aux acquéreurs stratégiques. Au-delà de 2M€ ARR, vous avez accès aux fonds institutionnels mid-market avec des processus structurés et des multiples premium.', en: 'There is no absolute threshold, but in practice: below €200K ARR, the only realistic buyers are individual entrepreneurs or early-stage search funds. Between €500K and €2M ARR, the market opens up to PE funds and strategic acquirers. Beyond €2M ARR, you have access to mid-market institutional funds with structured processes and premium multiples.' },
      },
      {
        q: { fr: 'Faut-il obligatoirement un intermédiaire pour vendre son SaaS ?', en: 'Do you need an intermediary to sell your SaaS?' },
        a: { fr: 'Ce n\'est pas obligatoire, mais les données montrent que les cessions avec un intermédiaire qualifié (broker M&A ou advisor) aboutissent à closing 40% plus souvent et à des prix 15–25% plus élevés. L\'intermédiaire apporte trois choses que le fondateur ne peut pas avoir seul : un réseau d\'acquéreurs qualifiés, une expertise en structuration des offres, et une capacité à gérer la tension psychologique du processus.', en: 'It is not mandatory, but data shows that sales with a qualified intermediary (M&A broker or advisor) reach closing 40% more often and at prices 15–25% higher. The intermediary brings three things the founder cannot have alone: a network of qualified acquirers, expertise in structuring offers, and the ability to manage the psychological pressure of the process.' },
      },
    ],
  },

  {
    slug:     'quand-vendre-son-saas-timing-exit',
    category: 'seller',
    date:     '2026-07-18',
    readMin:  8,
    featured: false,
    title: {
      fr: 'Quand vendre son SaaS ? Les 7 signaux qui indiquent que c\'est le bon moment',
      en: 'When to sell your SaaS? The 7 signals that indicate the right time',
    },
    excerpt: {
      fr: 'Le timing d\'une cession impacte directement le multiple obtenu. Ces 7 signaux — marché, produit, personnel et réglementaire — vous aident à identifier la fenêtre optimale.',
      en: 'The timing of a sale directly impacts the multiple obtained. These 7 signals — market, product, personal and regulatory — help you identify the optimal window.',
    },
    body: [
      { type: 'p', text: {
        fr: 'La question "quand vendre ?" est systématiquement sous-estimée par les fondateurs. Ils passent des années à se demander "combien vaut mon actif ?" et quelques semaines seulement à réfléchir au timing. C\'est une erreur coûteuse. Sur les transactions observées par AEGRYN en 2024–2025, les fondateurs qui ont vendu en période de croissance active ont obtenu des multiples médians 1,8x supérieurs à ceux qui ont vendu en période de plateau ou de légère décroissance.',
        en: 'The question "when to sell?" is systematically underestimated by founders. They spend years asking "how much is my asset worth?" and only a few weeks thinking about timing. This is a costly mistake. On transactions observed by AEGRYN in 2024–2025, founders who sold during active growth obtained median multiples 1.8x higher than those who sold during plateau or slight decline phases.',
      }},
      { type: 'h2', text: { fr: 'Signal 1 — Croissance : vendre au pic, pas après', en: 'Signal 1 — Growth: sell at the peak, not after' } },
      { type: 'p', text: {
        fr: 'Le meilleur moment pour vendre n\'est pas quand la croissance ralentit, c\'est quand elle est encore visible et documentable sur 3–4 trimestres consécutifs. Un SaaS avec 35% de croissance ARR YoY sur 4 trimestres se valorise structurellement mieux qu\'un actif qui a crû de 80% il y a 2 ans et stagne depuis. Les modèles de valorisation PE intègrent le taux de croissance prospectif, pas seulement le passé.',
        en: 'The best time to sell is not when growth is slowing, it is when it is still visible and documentable over 3–4 consecutive quarters. A SaaS with 35% ARR growth YoY over 4 quarters is structurally valued better than an asset that grew 80% two years ago and has stagnated since. PE valuation models integrate the prospective growth rate, not just the past.',
      }},
      { type: 'h2', text: { fr: 'Signal 2 — Marché : les vagues sectorielles', en: 'Signal 2 — Market: sector waves' } },
      { type: 'p', text: {
        fr: 'Les multiples de valorisation SaaS ne sont pas stables dans le temps — ils suivent des cycles sectoriels. En 2021, les multiples SaaS B2B en Europe ont atteint 12–15x ARR avant de retomber à 3–4x en 2023 sous l\'effet de la remontée des taux. En 2025–2026, les multiples se sont stabilisés à 5–8x pour les actifs premium, selon les données Hampleton Partners. Vendre en haut de cycle sectoriel peut doubler votre valorisation vs vendre en bas — sans rien changer au produit.',
        en: 'SaaS valuation multiples are not stable over time — they follow sector cycles. In 2021, B2B SaaS multiples in Europe reached 12–15x ARR before falling back to 3–4x in 2023 under the effect of rising interest rates. In 2025–2026, multiples stabilised at 5–8x for premium assets, according to Hampleton Partners data. Selling at the top of a sector cycle can double your valuation vs selling at the bottom — without changing anything about the product.',
      }},
      { type: 'h2', text: { fr: 'Signal 3 — Personnel : la fatigue du fondateur', en: 'Signal 3 — Personal: founder fatigue' } },
      { type: 'p', text: {
        fr: 'L\'enquête Dealsuite 2025 révèle que 46% des cessions de PME numériques en Europe sont déclenchées par un motif de succession ou de fatigue du dirigeant. Ce chiffre monte à 61% pour les fondateurs de plus de 55 ans. La fatigue n\'est pas une faiblesse — c\'est un signal rationnel. Un fondateur fatigué prend de moins bonnes décisions produit, ce qui dégrade progressivement les métriques et donc la valorisation. Vendre avant que la fatigue n\'affecte les chiffres est une décision de valeur.',
        en: 'The Dealsuite 2025 survey reveals that 46% of digital SME sales in Europe are triggered by succession or management fatigue. This figure rises to 61% for founders over 55. Fatigue is not a weakness — it is a rational signal. A fatigued founder makes worse product decisions, which progressively degrades metrics and therefore valuation. Selling before fatigue affects the numbers is a value decision.',
      }},
      { type: 'h2', text: { fr: 'Signal 4 — Concurrent : avant que votre client ne soit racheté', en: 'Signal 4 — Competitor: before your client gets acquired' } },
      { type: 'p', text: {
        fr: 'Dans les marchés SaaS verticaux, la consolidation des clients peut éliminer vos revenus. Si votre top 3 clients représente plus de 40% de votre ARR et que leur secteur est en consolidation, le risque de concentration est un signal de sortie. Vendre avant que ce risque ne se matérialise permet d\'éviter la décote de concentration (15–25% selon Hampleton Partners) qui apparaît systématiquement en due diligence.',
        en: 'In vertical SaaS markets, client consolidation can eliminate your revenues. If your top 3 clients represent more than 40% of your ARR and their sector is consolidating, the concentration risk is an exit signal. Selling before this risk materialises avoids the concentration discount (15–25% according to Hampleton Partners) that systematically appears in due diligence.',
      }},
      { type: 'h2', text: { fr: 'Signal 5 — Financier : runway confortable mais croissance plateauée', en: 'Signal 5 — Financial: comfortable runway but plateauing growth' } },
      { type: 'p', text: {
        fr: 'Vendre avec 18+ mois de runway en banque est structurellement meilleur que vendre sous pression financière. Un fondateur qui vend avec un bilan sain a le luxe du temps — il peut refuser des offres insuffisantes, attendre l\'acheteur optimal, et négocier les termes contractuels. Un fondateur qui vend parce qu\'il a besoin de cash dans 6 mois négocie depuis une position de faiblesse. Les acquéreurs PE le savent et en tiennent compte dans leurs offres.',
        en: 'Selling with 18+ months of runway in the bank is structurally better than selling under financial pressure. A founder who sells with a healthy balance sheet has the luxury of time — they can refuse insufficient offers, wait for the optimal buyer, and negotiate contractual terms. A founder who sells because they need cash in 6 months negotiates from a position of weakness. PE acquirers know this and factor it into their offers.',
      }},
      { type: 'h2', text: { fr: 'Signal 6 — Succession : absence de #2 opérationnel', en: 'Signal 6 — Succession: absence of operational #2' } },
      { type: 'p', text: {
        fr: 'Un actif dont l\'opérationnel repose entièrement sur le fondateur est un actif à risque pour l\'acquéreur. Si vous n\'avez pas construit un #2 capable de faire tourner le produit et l\'équipe sans vous, votre actif sera systématiquement décoté de 20–40% (source : observations AEGRYN 2024–2025). Ce signal indique soit de vendre avant que la dépendance ne soit trop ancrée, soit d\'investir 12 mois dans la délégation avant de lancer le processus.',
        en: 'An asset whose operations depend entirely on the founder is a risky asset for the acquirer. If you have not built a #2 capable of running the product and team without you, your asset will systematically be discounted 20–40% (source: AEGRYN 2024–2025 observations). This signal indicates either sell before the dependency becomes too entrenched, or invest 12 months in delegation before launching the process.',
      }},
      { type: 'h2', text: { fr: 'Signal 7 — Réglementaire : les fenêtres de conformité', en: 'Signal 7 — Regulatory: compliance windows' } },
      { type: 'p', text: {
        fr: 'La mise en conformité RGPD, NIS2 ou AI Act représente un coût et un effort significatifs. Un actif qui vient de compléter sa mise en conformité est plus attractif qu\'un actif qui devra la financer post-closing. Les données AEGRYN montrent que les actifs ayant documenté leur conformité réglementaire complète obtiennent des scores Dimension S (Sécurité) plus élevés, ce qui impacte positivement le grade et donc le multiple. La fenêtre optimale est les 6 mois suivant la complétion d\'un chantier de conformité.',
        en: 'GDPR, NIS2 or AI Act compliance represents a significant cost and effort. An asset that has just completed its compliance is more attractive than one that will need to fund it post-closing. AEGRYN data shows that assets having documented complete regulatory compliance achieve higher Dimension S (Security) scores, which positively impacts the grade and therefore the multiple. The optimal window is the 6 months following completion of a compliance project.',
      }},
      { type: 'stats', items: [
        { value: '57 ans', label: { fr: 'Âge moyen du fondateur vendeur en Europe (Dealsuite 2025)', en: 'Average age of selling founders in Europe (Dealsuite 2025)' } },
        { value: '46%',   label: { fr: 'Cessions déclenchées par succession/fatigue (Dealsuite 2025)', en: 'Sales triggered by succession/fatigue (Dealsuite 2025)' } },
        { value: '1,8x',  label: { fr: 'Écart de multiple : croissance vs plateau (AEGRYN 2024–25)', en: 'Multiple gap: growth vs plateau (AEGRYN 2024–25)' } },
        { value: '18 m',  label: { fr: 'Runway recommandé avant de lancer le processus', en: 'Recommended runway before launching the process' } },
      ]},
    ],
    faq: [
      {
        q: { fr: 'Y a-t-il un mois idéal pour lancer une cession SaaS ?', en: 'Is there an ideal month to launch a SaaS sale?' },
        a: { fr: 'Oui — éviter les mois de juillet-août (acquéreurs PE en congé, processus ralentis) et décembre (fin d\'exercice fiscal, budgets bloqués). Les meilleures fenêtres de lancement sont septembre–novembre et février–avril. Ces périodes correspondent aux cycles d\'investissement des fonds PE et au calendrier de décision des acquéreurs stratégiques.', en: 'Yes — avoid July–August (PE acquirers on holiday, slowed processes) and December (fiscal year-end, frozen budgets). The best launch windows are September–November and February–April. These periods correspond to PE fund investment cycles and strategic acquirer decision calendars.' },
      },
      {
        q: { fr: 'Peut-on vendre un SaaS non profitable ?', en: 'Can you sell an unprofitable SaaS?' },
        a: { fr: 'Oui, mais le profil d\'acheteur change radicalement. Un SaaS non profitable avec forte croissance (> 40% YoY) et burn rate maîtrisé (< 18 mois de runway consommé) peut intéresser des fonds growth et des acquéreurs stratégiques. En revanche, un SaaS non profitable avec croissance stagnante est quasi-invendable au marché. La rentabilité n\'est pas un prérequis, mais la trajectoire vers la rentabilité doit être démontrable et crédible.', en: 'Yes, but the buyer profile changes radically. An unprofitable SaaS with strong growth (> 40% YoY) and controlled burn rate (< 18 months of runway consumed) can interest growth funds and strategic acquirers. Conversely, an unprofitable SaaS with stagnant growth is nearly unsellable on the market. Profitability is not a prerequisite, but the path to profitability must be demonstrable and credible.' },
      },
    ],
  },

  {
    slug:     'succession-transmission-entreprise-numerique-fondateur',
    category: 'seller',
    date:     '2026-07-10',
    readMin:  10,
    featured: false,
    title: {
      fr: 'Transmettre son entreprise numérique : guide pour les fondateurs de 50 ans et plus',
      en: 'Handing over your digital business: a guide for founders aged 50 and over',
    },
    excerpt: {
      fr: '46% des cessions tech européennes sont déclenchées par un motif de succession. Ce guide couvre les trois scénarios de transmission, la fiscalité selon le pays de résidence, et la préparation opérationnelle.',
      en: '46% of European tech sales are triggered by a succession motive. This guide covers the three transmission scenarios, taxation by country of residence, and operational preparation.',
    },
    body: [
      { type: 'p', text: {
        fr: 'En Europe, le vieillissement de la génération des fondateurs numériques des années 2000–2010 crée une vague de cessions structurelle. L\'enquête Dealsuite 2025 indique que 46% des cessions de PME numériques sont déclenchées par un motif de succession ou de désengagement du dirigeant, et ce taux monte à 61% pour les fondateurs de plus de 55 ans. Transmettre une entreprise numérique n\'est pas identique à transmettre une PME classique — les actifs sont immatériels, les équipes souvent jeunes, et la valeur repose en partie sur la continuité technologique.',
        en: 'In Europe, the ageing of the founding generation of digital companies from the 2000s–2010s is creating a structural wave of sales. The Dealsuite 2025 survey indicates that 46% of digital SME sales are triggered by a succession or management withdrawal motive, rising to 61% for founders over 55. Handing over a digital company is not the same as handing over a traditional SME — assets are intangible, teams often young, and value partly rests on technological continuity.',
      }},
      { type: 'h2', text: { fr: 'Les 3 scénarios de transmission', en: 'The 3 transmission scenarios' } },
      { type: 'list', items: [
        { fr: 'Vente totale à un tiers (cession 100%) : scénario le plus courant (72% des cas selon Dealsuite). L\'acquéreur reprend l\'intégralité de la société ou des actifs. Le fondateur sort complètement, parfois avec une période de transition de 3–12 mois. Multiple le plus élevé car l\'acquéreur obtient le contrôle total.', en: 'Full sale to a third party (100% sale): most common scenario (72% of cases according to Dealsuite). The acquirer takes over the entire company or assets. The founder exits completely, sometimes with a 3–12 month transition period. Highest multiple as the acquirer gets full control.' },
        { fr: 'Vente partielle (cession de minorité ou majorité) : le fondateur vend 51–80% à un fonds ou acquéreur stratégique et conserve une participation. Permet de "prendre une première mise" tout en restant associé à la croissance future. Multiple initial inférieur à la vente totale, mais compensé par la valorisation de la participation résiduelle.', en: 'Partial sale (minority or majority stake): the founder sells 51–80% to a fund or strategic acquirer and retains a stake. Allows "taking a first chip off the table" while remaining associated with future growth. Initial multiple lower than full sale, but offset by residual stake valuation.' },
        { fr: 'Management Buy-Out (MBO) : l\'équipe de direction rachète l\'actif au fondateur, souvent avec un financement bancaire ou PE. Permet au fondateur de sortir proprement tout en maintenant la continuité opérationnelle et la culture. Prix généralement inférieur au marché (–15 à –25%) mais processus plus rapide et plus confidentiel.', en: 'Management Buy-Out (MBO): the management team buys the asset from the founder, often with bank or PE financing. Allows the founder to exit cleanly while maintaining operational continuity and culture. Price generally below market (–15 to –25%) but faster and more confidential process.' },
      ]},
      { type: 'h2', text: { fr: 'La fiscalité de l\'exit selon le pays', en: 'Exit taxation by country' } },
      { type: 'p', text: {
        fr: 'Avertissement : cet article est à titre informatif uniquement. Consultez un fiscaliste spécialisé avant toute décision. Les chiffres ci-dessous correspondent aux régimes en vigueur en 2026 et sont susceptibles d\'évoluer.',
        en: 'Warning: this article is for informational purposes only. Consult a specialist tax advisor before any decision. The figures below correspond to regimes in force in 2026 and are subject to change.',
      }},
      { type: 'list', items: [
        { fr: 'France : plus-value de cession de titres soumise au PFU (Prélèvement Forfaitaire Unique) à 30% (12,8% IR + 17,2% PS). Abattements possibles sous conditions (détention > 2 ans pour titres de PME). Dispositif "Madelin" et apport-cession (article 150-0 B ter CGI) permettent de différer l\'impôt sous conditions de réinvestissement.', en: 'France: capital gain on securities subject to PFU (Flat Tax) at 30% (12.8% income tax + 17.2% social charges). Allowances possible under conditions (holding > 2 years for SME securities). "Madelin" scheme and contribution-sale (article 150-0 B ter CGI) allow tax deferral under reinvestment conditions.' },
        { fr: 'Suisse : pas d\'impôt sur les plus-values de cession pour les personnes physiques (régime fédéral). Seul l\'impôt sur la fortune (cantonal, 0,1–0,3% du patrimoine) s\'applique sur les participations. La Suisse est l\'une des juridictions les plus favorables d\'Europe pour les exits tech — raison de la forte concentration de holdings suisses de fondateurs tech.', en: 'Switzerland: no capital gains tax on disposals for individuals (federal regime). Only wealth tax (cantonal, 0.1–0.3% of assets) applies to shareholdings. Switzerland is one of Europe\'s most favourable jurisdictions for tech exits — reason for the high concentration of Swiss holding companies for tech founders.' },
        { fr: 'Luxembourg : régime de participation exempt (95% d\'exonération des plus-values sur cession de participations qualifiées). Très utilisé pour les structures holding tech franco-luxembourgeoises. Taux effectif d\'imposition < 2% dans les structures optimisées.', en: 'Luxembourg: participation exemption regime (95% exemption on capital gains from qualifying participations). Widely used for Franco-Luxembourg tech holding structures. Effective tax rate < 2% in optimised structures.' },
      ]},
      { type: 'h2', text: { fr: 'Préparer la transition opérationnelle', en: 'Preparing the operational transition' } },
      { type: 'p', text: {
        fr: 'La valeur d\'un actif numérique ne tient pas seulement dans son code ou ses contrats — elle tient dans la capacité à fonctionner sans le fondateur. Les acquéreurs évaluent systématiquement la "fondateur-dépendance" : si le fondateur gère les comptes clés, prend toutes les décisions produit, et est l\'unique interlocuteur technique de référence, la décote est de 20–40% sur le prix. Le plan de transmission idéal commence 18–24 mois avant la cession : délégation progressive, documentation des processus, montée en puissance du #2.',
        en: 'The value of a digital asset does not only lie in its code or contracts — it lies in the ability to operate without the founder. Acquirers systematically evaluate "founder-dependency": if the founder manages key accounts, makes all product decisions, and is the sole technical point of contact, the discount is 20–40% on the price. The ideal handover plan starts 18–24 months before the sale: progressive delegation, process documentation, #2 empowerment.',
      }},
      { type: 'h2', text: { fr: 'Checklist 12 mois avant la cession', en: 'Checklist 12 months before the sale' } },
      { type: 'list', items: [
        { fr: 'M-12 : Audit IP complet (contrats prestataires, marque, licences open source). Corriger les lacunes identifiées.', en: 'M-12: Complete IP audit (contractor contracts, trademark, open source licences). Correct identified gaps.' },
        { fr: 'M-10 : Séparation claire ARR récurrent vs revenus ponctuels dans la comptabilité. Mise en place d\'outils de reporting métriques (Baremetrics, ChartMogul ou équivalent).', en: 'M-10: Clear separation of recurring ARR vs one-off revenues in accounting. Implementation of metrics reporting tools (Baremetrics, ChartMogul or equivalent).' },
        { fr: 'M-8 : Constitution de la data room (financiers 3 ans, contrats clients, documentation technique, organigramme).', en: 'M-8: Data room setup (3-year financials, client contracts, technical documentation, org chart).' },
        { fr: 'M-6 : Soumission au protocole de certification AEGRYN ou équivalent. Réception du rapport + plan de remédiation si nécessaire.', en: 'M-6: Submission to the AEGRYN certification protocol or equivalent. Receipt of report + remediation plan if necessary.' },
        { fr: 'M-4 : Rédaction du teaser confidentiel + mémorandum d\'information. Sélection du broker ou de l\'advisor.', en: 'M-4: Writing of confidential teaser + information memorandum. Selection of broker or advisor.' },
        { fr: 'M-2 : Pré-sélection des acquéreurs qualifiés, signature des NDA, préparation des premières présentations.', en: 'M-2: Pre-selection of qualified acquirers, NDA signing, preparation of first presentations.' },
        { fr: 'M-0 : Lancement officiel du processus de cession.', en: 'M-0: Official launch of the sale process.' },
      ]},
      { type: 'stats', items: [
        { value: '46%',   label: { fr: 'Cessions déclenchées par succession (Dealsuite 2025)', en: 'Sales triggered by succession (Dealsuite 2025)' } },
        { value: '18–24', label: { fr: 'Mois de préparation recommandés avant cession', en: 'Recommended preparation months before sale' } },
        { value: '–30%',  label: { fr: 'Décote moyenne en cas de forte fondateur-dépendance', en: 'Average discount for high founder-dependency' } },
        { value: '0%',    label: { fr: 'Impôt sur plus-value de cession en Suisse (personnes physiques)', en: 'Capital gains tax on disposal in Switzerland (individuals)' } },
      ]},
    ],
  },

  {
    slug:     'preparer-due-diligence-vendeur-saas',
    category: 'seller',
    date:     '2026-07-05',
    readMin:  10,
    featured: false,
    title: {
      fr: 'Due diligence côté vendeur : ce que les acquéreurs vont examiner — et comment vous y préparer',
      en: 'Seller-side due diligence: what acquirers will examine — and how to prepare',
    },
    excerpt: {
      fr: 'La due diligence est la phase où 40% des deals se renégocient à la baisse. Ce guide vous prépare à chaque dimension — technique, IP, financière, sécurité — avant que l\'acquéreur ne commence.',
      en: 'Due diligence is the phase where 40% of deals are renegotiated downward. This guide prepares you for every dimension — technical, IP, financial, security — before the acquirer starts.',
    },
    body: [
      { type: 'p', text: {
        fr: 'La due diligence est la phase la plus redoutée d\'une cession — et la plus mal préparée. D\'après les données Hampleton Partners 2025, 40% des transactions M&A tech voient le prix revu à la baisse lors de la due diligence, et 12% aboutissent à un abandon du deal. La quasi-totalité de ces situations est évitable avec une préparation structurée côté vendeur. Ce guide détaille ce que l\'acquéreur va chercher dans chaque dimension.',
        en: 'Due diligence is the most feared phase of a sale — and the most poorly prepared. According to Hampleton Partners 2025 data, 40% of tech M&A transactions see the price revised downward during due diligence, and 12% result in deal abandonment. Almost all of these situations are avoidable with structured seller-side preparation. This guide details what the acquirer will look for in each dimension.',
      }},
      { type: 'h2', text: { fr: 'La data room idéale : liste complète', en: 'The ideal data room: complete list' } },
      { type: 'list', items: [
        { fr: 'Documents juridiques : statuts à jour, K-bis, table de capitalisation, pacte d\'actionnaires, PV d\'AG des 3 derniers exercices, contrats de travail et accords de confidentialité équipe.', en: 'Legal documents: updated articles of association, company registration, cap table, shareholder agreement, general meeting minutes for the last 3 fiscal years, employment contracts and team NDAs.' },
        { fr: 'Documents financiers : comptes certifiés 3 ans, balance âgée clients, budget N+1, MRR/ARR bridgé mois par mois sur 24 mois, liste contrats clients avec dates de renouvellement.', en: 'Financial documents: certified 3-year accounts, aged client receivables, N+1 budget, MRR/ARR bridged month by month over 24 months, client contract list with renewal dates.' },
        { fr: 'Documentation technique : architecture système, inventaire des dépendances (librairies tierces, licences), documentation des APIs, politique de backup et disaster recovery, résultats de pentest < 18 mois.', en: 'Technical documentation: system architecture, dependency inventory (third-party libraries, licences), API documentation, backup and disaster recovery policy, pentest results < 18 months.' },
        { fr: 'Documents IP : marques déposées avec numéros d\'enregistrement, contrats prestataires avec clause de cession de droits, certificats de logiciel original, registre des noms de domaine.', en: 'IP documents: registered trademarks with registration numbers, contractor contracts with rights assignment clause, original software certificates, domain name registry.' },
        { fr: 'Documents RH : organigramme, fiches de poste clés, politique de rémunération, accords d\'intéressement/BSPCE en cours, éventuelles clauses de non-concurrence.', en: 'HR documents: org chart, key job descriptions, compensation policy, profit-sharing/BSPCE agreements in force, any non-compete clauses.' },
      ]},
      { type: 'h2', text: { fr: 'Code review : ce que l\'acheteur va trouver', en: 'Code review: what the buyer will find' } },
      { type: 'p', text: {
        fr: 'La due diligence technique comprend systématiquement une revue de code par un cabinet indépendant mandaté par l\'acquéreur. Ce que les reviewers cherchent : (1) la dette technique mesurable (ratio coverage tests, ancienneté des dépendances, présence de linters/formatters) ; (2) la scalabilité de l\'architecture (monolithe vs microservices, cloud-native ou legacy) ; (3) la sécurité applicative (OWASP Top 10, gestion des secrets, chiffrement des données sensibles) ; (4) la documentation du code (README, commentaires, OpenAPI). Un actif avec < 30% de couverture de tests et sans CI/CD documenté sera systématiquement décoté.',
        en: 'Technical due diligence systematically includes a code review by an independent firm mandated by the acquirer. What reviewers look for: (1) measurable technical debt (test coverage ratio, dependency age, presence of linters/formatters); (2) architecture scalability (monolith vs microservices, cloud-native or legacy); (3) application security (OWASP Top 10, secrets management, sensitive data encryption); (4) code documentation (README, comments, OpenAPI). An asset with < 30% test coverage and no documented CI/CD will be systematically discounted.',
      }},
      { type: 'h2', text: { fr: 'IP : les 5 problèmes qui font sauter un deal à J-15', en: 'IP: the 5 issues that collapse a deal 15 days before closing' } },
      { type: 'list', items: [
        { fr: 'Prestataires sans contrat de cession de droits : le code écrit par un freelance sans clause de cession appartient légalement au freelance, pas à la société. Problème présent dans 43% des actifs soumis à AEGRYN.', en: 'Contractors without rights assignment contract: code written by a freelancer without an assignment clause legally belongs to the freelancer, not the company. Present in 43% of assets submitted to AEGRYN.' },
        { fr: 'Marque non déposée dans les classes pertinentes : un acquéreur ne peut pas sécuriser son investissement sur une marque non protégée. Délai de dépôt et d\'enregistrement : 6–8 mois en FR/EU — à anticiper.', en: 'Trademark not registered in relevant classes: an acquirer cannot secure their investment on an unprotected brand. Registration delay: 6–8 months in FR/EU — must be anticipated.' },
        { fr: 'Dépendances GPL dans le codebase : les licences GPL (GNU General Public License) sont copyleft — elles contaminent l\'ensemble du code qui les intègre. Un acquéreur qui découvre des dépendances GPL non documentées peut exiger leur remplacement avant closing.', en: 'GPL dependencies in the codebase: GPL (GNU General Public License) licences are copyleft — they contaminate all code that integrates them. An acquirer who discovers undocumented GPL dependencies can require their replacement before closing.' },
        { fr: 'Données personnelles traitées sans base légale documentée : en due diligence RGPD, l\'absence de registre des traitements, de politique de confidentialité conforme ou de DPA avec les sous-traitants est un bloquant pour les acquéreurs institutionnels.', en: 'Personal data processed without documented legal basis: in GDPR due diligence, the absence of a processing register, compliant privacy policy or DPA with sub-processors is a blocker for institutional acquirers.' },
        { fr: 'Contentieux en cours non divulgués : tout litige actif (client, prestataire, salarié) doit être déclaré dans la data room. Un contentieux découvert pendant ou après la due diligence est un motif légal de résolution du SPA ou de réduction du prix via le séquestre.', en: 'Undisclosed ongoing litigation: any active dispute (client, contractor, employee) must be declared in the data room. Litigation discovered during or after due diligence is a legal basis for SPA resolution or price reduction via escrow.' },
      ]},
      { type: 'h2', text: { fr: 'Finances : comment présenter vos métriques', en: 'Finances: how to present your metrics' } },
      { type: 'p', text: {
        fr: 'La règle d\'or : séparer rigoureusement l\'ARR récurrent des revenus non récurrents. Tout ce qui n\'est pas un abonnement automatiquement renouvelable ne doit pas être intégré dans l\'ARR. Les acquéreurs PE et leurs advisors décortiquent systématiquement les MRR bridge mois par mois — ils identifient les expansion revenues, les churns, les upgrades et downgrades. Un ARR "gonflé" est détecté en moins de deux heures d\'analyse et déclenche une perte de confiance irréversible.',
        en: 'The golden rule: rigorously separate recurring ARR from non-recurring revenues. Anything that is not an automatically renewable subscription must not be included in ARR. PE acquirers and their advisors systematically dissect MRR bridges month by month — they identify expansion revenues, churns, upgrades and downgrades. "Inflated" ARR is detected in less than two hours of analysis and triggers irreversible loss of trust.',
      }},
      { type: 'stats', items: [
        { value: '40%',  label: { fr: 'Deals tech avec prix revu en due diligence (Hampleton 2025)', en: 'Tech deals with price revised in due diligence (Hampleton 2025)' } },
        { value: '12%',  label: { fr: 'Deals abandonnés post due diligence (Hampleton 2025)', en: 'Deals abandoned post due diligence (Hampleton 2025)' } },
        { value: '43%',  label: { fr: 'Actifs soumis AEGRYN sans contrat prestataire complet', en: 'Assets submitted to AEGRYN without complete contractor contract' } },
        { value: '6–8m', label: { fr: 'Délai enregistrement marque UE (EUIPO)', en: 'EU trademark registration delay (EUIPO)' } },
      ]},
    ],
  },

  {
    slug:     'valoriser-application-mobile-cession',
    category: 'seller',
    date:     '2026-06-28',
    readMin:  8,
    featured: false,
    title: {
      fr: 'Comment valoriser une application mobile avant sa cession : métriques, multiples et pièges',
      en: 'How to value a mobile application before its sale: metrics, multiples and pitfalls',
    },
    excerpt: {
      fr: 'Les applications mobiles obéissent à des logiques de valorisation différentes du SaaS B2B. DAU, MAU, ARPU et rétention D30 sont les métriques déterminantes — avec des multiples qui varient du simple au triple selon le modèle de monétisation.',
      en: 'Mobile applications follow different valuation logic from B2B SaaS. DAU, MAU, ARPU and D30 retention are the determining metrics — with multiples varying threefold depending on the monetisation model.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Une application mobile n\'est pas un SaaS — et ses métriques de valorisation ne sont pas les mêmes. Un fondateur qui applique la grille de lecture SaaS B2B (multiple ARR, NRR) à une app mobile grand public se retrouve systématiquement avec une valorisation mal positionnée. Ce guide détaille les métriques spécifiques aux applications mobiles et les multiples observés en Europe en 2026.',
        en: 'A mobile application is not a SaaS — and its valuation metrics are not the same. A founder who applies the B2B SaaS reading framework (ARR multiple, NRR) to a consumer mobile app systematically ends up with a poorly positioned valuation. This guide details the metrics specific to mobile applications and the multiples observed in Europe in 2026.',
      }},
      { type: 'h2', text: { fr: 'Les métriques spécifiques au mobile', en: 'Mobile-specific metrics' } },
      { type: 'list', items: [
        { fr: 'DAU (Daily Active Users) / MAU (Monthly Active Users) : le ratio DAU/MAU mesure l\'engagement quotidien. Un ratio > 40% est considéré excellent (Facebook est à ~66%, Snapchat ~60%). Sous 15%, l\'application est perçue comme "utilitaire ponctuelle" — valorisation limitée.', en: 'DAU (Daily Active Users) / MAU (Monthly Active Users): the DAU/MAU ratio measures daily engagement. A ratio > 40% is considered excellent (Facebook is ~66%, Snapchat ~60%). Below 15%, the app is perceived as a "one-off utility" — limited valuation.' },
        { fr: 'Rétention D1/D7/D30 : mesure le % d\'utilisateurs qui reviennent 1, 7 et 30 jours après installation. Les benchmarks sectoriels 2025 (AppsFlyer State of App Marketing) : D1 médian = 26%, D7 = 11%, D30 = 6%. Une app avec D30 > 15% est dans le top quartile.', en: 'D1/D7/D30 retention: measures the % of users who return 1, 7 and 30 days after install. 2025 sector benchmarks (AppsFlyer State of App Marketing): median D1 = 26%, D7 = 11%, D30 = 6%. An app with D30 > 15% is in the top quartile.' },
        { fr: 'ARPU (Average Revenue Per User) : revenu moyen par utilisateur actif mensuel. Clé pour les apps freemium et in-app purchase. À mettre en regard du CAC (coût d\'acquisition) pour calculer le payback period.', en: 'ARPU (Average Revenue Per User): average revenue per monthly active user. Key for freemium and in-app purchase apps. To be compared with CAC (acquisition cost) to calculate payback period.' },
        { fr: 'LTV (Lifetime Value) : pour les apps mobile, LTV = ARPU × durée de vie moyenne de l\'utilisateur. La durée de vie dépend fortement du secteur : gaming (18–24 mois), fitness (12–18 mois), finance (36–60 mois).', en: 'LTV (Lifetime Value): for mobile apps, LTV = ARPU × average user lifetime. Lifetime varies strongly by sector: gaming (18–24 months), fitness (12–18 months), finance (36–60 months).' },
      ]},
      { type: 'h2', text: { fr: 'Multiples B2C vs B2B : les différences', en: 'B2C vs B2B multiples: the differences' } },
      { type: 'p', text: {
        fr: 'Les applications mobiles grand public se valorisent différemment selon le modèle de monétisation. Les apps à abonnement (subscription-first) ont les multiples les plus élevés car elles ressemblent structurellement à du SaaS. Les apps freemium/in-app purchase ont des multiples intermédiaires. Les apps à modèle publicitaire ont les multiples les plus bas en raison de la volatilité des CPM. Voici les fourchettes observées sur le marché européen en 2025–2026 :',
        en: 'Consumer mobile applications are valued differently depending on the monetisation model. Subscription-first apps have the highest multiples because they are structurally similar to SaaS. Freemium/in-app purchase apps have intermediate multiples. Ad-based model apps have the lowest multiples due to CPM volatility. Here are the ranges observed in the European market in 2025–2026:',
      }},
      { type: 'stats', items: [
        { value: '4–8x',  label: { fr: 'Multiple revenu annuel — App subscription B2C (NRR > 90%)', en: 'Annual revenue multiple — B2C subscription app (NRR > 90%)' } },
        { value: '2–4x',  label: { fr: 'Multiple revenu annuel — App freemium / IAP', en: 'Annual revenue multiple — Freemium / IAP app' } },
        { value: '1–2x',  label: { fr: 'Multiple revenu annuel — App publicitaire (CPM-based)', en: 'Annual revenue multiple — Ad-based app (CPM-based)' } },
        { value: '15%',   label: { fr: 'Seuil rétention D30 top quartile (AppsFlyer 2025)', en: 'D30 retention top quartile threshold (AppsFlyer 2025)' } },
      ]},
      { type: 'h2', text: { fr: 'L\'impact des stores Apple et Google sur les marges', en: 'The impact of Apple and Google stores on margins' } },
      { type: 'p', text: {
        fr: 'La commission store (30% pour Apple App Store et Google Play sur les abonnements la première année, 15% à partir de la deuxième année) impacte directement les marges brutes et donc les multiples. Un acquéreur calcule ses multiples sur les revenus nets de commission store — non sur les revenus bruts. Un actif avec 500K€ de revenu brut annuel sur App Store affiche en réalité ~380K€ de revenu net (en supposant un mix d\'abonnements avec ancienneté > 1 an). Cette distinction doit être présentée clairement dans le mémorandum d\'information.',
        en: 'The store commission (30% for Apple App Store and Google Play on subscriptions in the first year, 15% from the second year) directly impacts gross margins and therefore multiples. An acquirer calculates multiples on net store commission revenues — not on gross revenues. An asset with €500K annual gross revenue on App Store actually shows ~€380K net revenue (assuming a subscription mix with tenure > 1 year). This distinction must be presented clearly in the information memorandum.',
      }},
      { type: 'h2', text: { fr: 'In-app purchase vs abonnement : lequel se valorise mieux ?', en: 'In-app purchase vs subscription: which values better?' } },
      { type: 'p', text: {
        fr: 'Les abonnements récurrents (weekly, monthly, annual) se valorisent structurellement mieux que les in-app purchases (IAP) ponctuels. Raison : la récurrence crée de la prévisibilité, qui est le principal driver des multiples. Un actif générant 80% de ses revenus via des abonnements annuels avec faible churn sera valorisé 2–3x plus qu\'un actif générant les mêmes revenus via des IAP non récurrents. La stratégie optimale avant une cession : migrer les utilisateurs les plus actifs vers un abonnement et documenter le taux de conversion sur 6 mois.',
        en: 'Recurring subscriptions (weekly, monthly, annual) are structurally valued better than one-off in-app purchases (IAP). Reason: recurrence creates predictability, which is the main driver of multiples. An asset generating 80% of revenues via annual subscriptions with low churn will be valued 2–3x more than an asset generating the same revenues via non-recurring IAPs. The optimal pre-sale strategy: migrate the most active users to a subscription and document the conversion rate over 6 months.',
      }},
      { type: 'h2', text: { fr: 'Cas pratique : app de niche, 50K MAU, valorisation', en: 'Case study: niche app, 50K MAU, valuation' } },
      { type: 'p', text: {
        fr: 'Données : app de gestion de notes pour avocats indépendants. 50 000 MAU, DAU/MAU = 35%, rétention D30 = 18%, ARPU mensuel = 4,50€ (abonnement), churn mensuel = 2,1%. ARR = 50 000 × 0,7 (taux de conversion freemium-payant) × 4,50€ × 12 = ~1,89M€. NRR estimé = 96% (expansion limitée dans ce segment). Revenu net de commission App Store (15%, utilisateurs > 1 an) = 1,61M€. Multiple attendu : 4–6x ARR net = 6,4M€–9,6M€. Facteurs de prime : rétention D30 élevée (+), DAU/MAU > 30% (+), segment B2B niche (+). Facteur de décote : churn 2,1% mensuel = 22,6% annuel, supérieur aux benchmarks SaaS B2B (–).',
        en: 'Data: note management app for independent lawyers. 50,000 MAU, DAU/MAU = 35%, D30 retention = 18%, monthly ARPU = €4.50 (subscription), monthly churn = 2.1%. ARR = 50,000 × 0.7 (freemium-to-paid conversion rate) × €4.50 × 12 = ~€1.89M. Estimated NRR = 96% (limited expansion in this segment). Net App Store commission revenue (15%, users > 1 year) = €1.61M. Expected multiple: 4–6x net ARR = €6.4M–€9.6M. Premium factors: high D30 retention (+), DAU/MAU > 30% (+), niche B2B segment (+). Discount factor: 2.1% monthly churn = 22.6% annual, above B2B SaaS benchmarks (–).',
      }},
    ],
  },


  /* ── CLUSTER 2 — ACQUÉREURS ─────────────────────────────────────────── */

  {
    slug:     'acheter-saas-rentable-guide-acquereurs-2026',
    category: 'buyer',
    date:     '2026-07-22',
    readMin:  12,
    featured: false,
    title: {
      fr: 'Acheter un SaaS rentable en Europe en 2026 : guide complet pour les acquéreurs',
      en: 'Buying a profitable SaaS in Europe in 2026: complete guide for acquirers',
    },
    excerpt: {
      fr: 'Comment identifier, évaluer et acquérir un SaaS profitable en Europe — méthodes de sourcing, grilles d\'évaluation, pièges contractuels et gestion de la transition post-closing.',
      en: 'How to identify, evaluate and acquire a profitable SaaS in Europe — sourcing methods, evaluation frameworks, contractual pitfalls and post-closing transition management.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Acquérir un SaaS profitable n\'est pas un acte d\'achat — c\'est un acte d\'investissement structuré. Les données Dealroom 2025 indiquent que 58% des acquéreurs SaaS en Europe sont des fonds PE, mais le segment des acquéreurs individuels (search funds, entrepreneurs repreneurs) a progressé de +38% en 2025 (source : IESE Business School). Les erreurs commises par les acquéreurs non institutionnels sont rarement des erreurs de prix — elles sont le plus souvent des erreurs de processus et de due diligence.',
        en: 'Acquiring a profitable SaaS is not a purchase act — it is a structured investment act. Dealroom 2025 data indicates that 58% of SaaS acquirers in Europe are PE funds, but the individual acquirer segment (search funds, entrepreneurial acquirers) grew +38% in 2025 (source: IESE Business School). Mistakes made by non-institutional acquirers are rarely price mistakes — they are most often process and due diligence errors.',
      }},
      { type: 'h2', text: { fr: 'Où trouver des SaaS à acquérir en Europe', en: 'Where to find SaaS assets to acquire in Europe' } },
      { type: 'list', items: [
        { fr: 'Marketplaces spécialisées (MicroAcquire/Acquire.com, Flippa, SideProjectors) : conviennent pour les actifs < 500K€ ARR. Large choix, mais qualité variable — la majorité des actifs listés manquent de documentation financière vérifiable.', en: 'Specialist marketplaces (MicroAcquire/Acquire.com, Flippa, SideProjectors): suitable for assets < €500K ARR. Wide selection, but variable quality — the majority of listed assets lack verifiable financial documentation.' },
        { fr: 'Brokers M&A spécialisés (Hampleton Partners, Aventis Advisors, Lincoln International pour le mid-market) : accès aux actifs structurés, processus organisés, mais commission de 3–8% du prix de cession.', en: 'Specialist M&A brokers (Hampleton Partners, Aventis Advisors, Lincoln International for mid-market): access to structured assets, organised processes, but commission of 3–8% of sale price.' },
        { fr: 'Sourcing direct (cold outreach) : identifier des fondateurs de SaaS profitables via LinkedIn, ProductHunt, Indie Hackers. Taux de conversion très faible (< 2%) mais zéro compétition sur le deal. Méthode préférée des search funds expérimentés.', en: 'Direct sourcing (cold outreach): identifying founders of profitable SaaS via LinkedIn, ProductHunt, Indie Hackers. Very low conversion rate (< 2%) but zero deal competition. Preferred method of experienced search funds.' },
        { fr: 'Réseaux d\'advisors (AEGRYN, cabinets d\'avocats M&A, experts-comptables spécialisés) : accès à un deal flow qualifié et confidentiel, actifs pré-audités. Segment le plus efficace pour les acquéreurs sérieux.', en: 'Advisor networks (AEGRYN, M&A law firms, specialist accountants): access to qualified and confidential deal flow, pre-audited assets. Most efficient segment for serious acquirers.' },
      ]},
      { type: 'h2', text: { fr: 'Les critères de sélection d\'un SaaS acquéreur', en: 'Acquirer selection criteria for a SaaS' } },
      { type: 'stats', items: [
        { value: '> 1M€',  label: { fr: 'ARR recommandé pour un premier achat (institutionnel)', en: 'Recommended ARR for a first purchase (institutional)' } },
        { value: '> 70%',  label: { fr: 'Marges brutes minimales pour multiple premium', en: 'Minimum gross margins for premium multiple' } },
        { value: '> 85%',  label: { fr: 'Taux de rétention client annuel recommandé', en: 'Recommended annual client retention rate' } },
        { value: '< 40%',  label: { fr: 'Concentration maximale acceptable — top 3 clients / ARR', en: 'Maximum acceptable concentration — top 3 clients / ARR' } },
      ]},
      { type: 'p', text: {
        fr: 'La concentration client est le risque le plus sous-évalué par les acquéreurs débutants. Un SaaS où 3 clients représentent 60% de l\'ARR n\'est pas un SaaS — c\'est un contrat de prestation déguisé. La règle de base : aucun client unique ne doit représenter plus de 20% de l\'ARR, et le top 5 clients ne doit pas dépasser 40%. Au-delà, la décote est systématique et justifiée.',
        en: 'Client concentration is the most undervalued risk by novice acquirers. A SaaS where 3 clients represent 60% of ARR is not a SaaS — it is a disguised service contract. The basic rule: no single client should represent more than 20% of ARR, and the top 5 clients should not exceed 40%. Beyond that, the discount is systematic and justified.',
      }},
      { type: 'h2', text: { fr: 'La grille d\'évaluation en 4 dimensions', en: 'The 4-dimension evaluation framework' } },
      { type: 'list', items: [
        { fr: 'Dimension Produit : product-market fit documenté (NPS, churn cohort, roadmap), dépendance tech tier (AWS/GCP/Azure vs infrastructure propriétaire), qualité du code (tests, CI/CD, documentation). Score d\'obsolescence technologique.', en: 'Product dimension: documented product-market fit (NPS, churn cohort, roadmap), tech tier dependency (AWS/GCP/Azure vs proprietary infrastructure), code quality (tests, CI/CD, documentation). Technology obsolescence score.' },
        { fr: 'Dimension Finance : ARR audité vs ARR présenté (pont MRR mois par mois), marge brute réelle (hors stock-options, coûts cachés), EBITDA ajusté (retraiter les salaires fondateur non-marché), cash conversion cycle.', en: 'Finance dimension: audited ARR vs presented ARR (MRR bridge month by month), actual gross margin (excluding stock options, hidden costs), adjusted EBITDA (restate below-market founder salaries), cash conversion cycle.' },
        { fr: 'Dimension IP : propriété du code (contrats prestataires), marques déposées, licences open source, protection des données client. C\'est la dimension la plus souvent négligée par les acquéreurs non-institutionnels.', en: 'IP dimension: code ownership (contractor contracts), registered trademarks, open source licences, client data protection. This is the most often neglected dimension by non-institutional acquirers.' },
        { fr: 'Dimension Équipe : dépendance au fondateur, plan de rétention des employés clés, accords de non-concurrence et de non-sollicitation, culture et onboarding.', en: 'Team dimension: founder dependency, key employee retention plan, non-compete and non-solicitation agreements, culture and onboarding.' },
      ]},
      { type: 'h2', text: { fr: 'Structurer l\'offre et la négociation', en: 'Structuring the offer and negotiation' } },
      { type: 'p', text: {
        fr: 'La LOI (Letter of Intent) est le document structurant de la négociation. Elle doit préciser : (1) le prix indicatif et sa base de calcul (multiple × ARR à date de closing ou à date LOI) ; (2) la structure (cash, earnout, actions) ; (3) la durée d\'exclusivité accordée à l\'acquéreur (typiquement 30–60 jours) ; (4) les conditions suspensives (due diligence satisfaisante, financement). Une LOI bien rédigée réduit considérablement les risques de renégociation tardive et protège les deux parties.',
        en: 'The LOI (Letter of Intent) is the structuring document of the negotiation. It must specify: (1) the indicative price and its calculation basis (multiple × ARR at closing date or LOI date); (2) the structure (cash, earnout, shares); (3) the exclusivity period granted to the acquirer (typically 30–60 days); (4) conditions precedent (satisfactory due diligence, financing). A well-drafted LOI significantly reduces the risk of late renegotiation and protects both parties.',
      }},
      { type: 'h2', text: { fr: 'Post-closing : les 90 premiers jours', en: 'Post-closing: the first 90 days' } },
      { type: 'p', text: {
        fr: 'Les 90 premiers jours post-closing sont la période la plus critique pour la valeur de l\'acquisition. Les données McKinsey 2024 sur les acquisitions tech montrent que 70% de la valeur détruite en M&A l\'est dans les 6 premiers mois post-closing, principalement par : (1) fuite des employés clés non retenus ; (2) perturbation des clients lors du changement d\'interlocuteur ; (3) décisions produit précipitées du nouvel acquéreur. Le plan des 90 jours doit être préparé avant le closing, pas après.',
        en: 'The first 90 days post-closing are the most critical period for acquisition value. McKinsey 2024 data on tech acquisitions shows that 70% of value destroyed in M&A occurs in the first 6 months post-closing, primarily through: (1) departure of non-retained key employees; (2) client disruption during contact change; (3) rushed product decisions by the new acquirer. The 90-day plan must be prepared before closing, not after.',
      }},
    ],
    faq: [
      {
        q: { fr: 'Quel budget minimum pour acquérir un SaaS en Europe ?', en: 'What is the minimum budget to acquire a SaaS in Europe?' },
        a: { fr: 'Il n\'y a pas de minimum absolu. Des SaaS micro sont disponibles entre 50K€ et 200K€ sur les marketplaces. Pour un actif avec ARR > 500K€ et potentiel de croissance réel, comptez entre 1,5M€ et 5M€ selon le multiple et la structure. Les fonds PE mid-market ciblent les actifs à partir de 10M€ de valeur d\'entreprise. Le financement par dette (LBO partiel) est possible au-delà de 500K€ d\'EBITDA avec des banques spécialisées.', en: 'There is no absolute minimum. Micro-SaaS are available between €50K and €200K on marketplaces. For an asset with ARR > €500K and real growth potential, expect €1.5M to €5M depending on multiple and structure. Mid-market PE funds target assets from €10M enterprise value. Debt financing (partial LBO) is possible above €500K EBITDA with specialist banks.' },
      },
      {
        q: { fr: 'Comment financer l\'acquisition d\'un SaaS ?', en: 'How to finance a SaaS acquisition?' },
        a: { fr: 'Trois sources principales : (1) fonds propres (le plus simple, le plus courant pour les actifs < 2M€) ; (2) dette bancaire (LBO partiel possible si EBITDA > 500K€ et actif profitable, ratio dette/EBITDA de 2–4x selon les banques) ; (3) financement vendeur (seller note : le vendeur finance une partie du prix sur 12–36 mois, rémunéré à 4–7% d\'intérêt). Les search funds utilisent souvent une combinaison de dette bancaire + equity investisseurs + seller note.', en: 'Three main sources: (1) own equity (simplest, most common for assets < €2M); (2) bank debt (partial LBO possible if EBITDA > €500K and asset profitable, debt/EBITDA ratio of 2–4x depending on bank); (3) vendor financing (seller note: the seller finances part of the price over 12–36 months, remunerated at 4–7% interest). Search funds often use a combination of bank debt + investor equity + seller note.' },
      },
    ],
  },

  {
    slug:     'search-fund-acquisition-saas-europe',
    category: 'buyer',
    date:     '2026-07-15',
    readMin:  10,
    featured: false,
    title: {
      fr: 'Search fund et acquisition SaaS en Europe : le modèle qui redéfinit le M&A en 2026',
      en: 'Search fund and SaaS acquisition in Europe: the model redefining M&A in 2026',
    },
    excerpt: {
      fr: 'Les search funds ont représenté +38% de croissance en Europe en 2025. Ce modèle permet à un entrepreneur de lever des fonds, acquérir un SaaS rentable et l\'opérer — sans avoir fondé quoi que ce soit. Guide complet.',
      en: 'Search funds grew +38% in Europe in 2025. This model allows an entrepreneur to raise funds, acquire a profitable SaaS and operate it — without having founded anything. Complete guide.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le search fund est un modèle d\'acquisition entrepreneuriale qui a émergé aux États-Unis dans les années 1980 (créé à la Harvard Business School) et connaît depuis 2020 une croissance exponentielle en Europe. Le principe : un entrepreneur (le "searcher") lève entre 400K€ et 600K€ auprès d\'investisseurs pour financer sa recherche d\'acquisition (18–24 mois), puis lève un second tour pour financer l\'acquisition elle-même. L\'IESE Business School, qui publie le rapport annuel de référence sur les search funds, recense 85 search funds actifs en Europe en 2025, soit une croissance de +38% vs 2024.',
        en: 'The search fund is an entrepreneurial acquisition model that emerged in the United States in the 1980s (created at Harvard Business School) and has experienced exponential growth in Europe since 2020. The principle: an entrepreneur (the "searcher") raises between €400K and €600K from investors to fund their acquisition search (18–24 months), then raises a second round to fund the acquisition itself. IESE Business School, which publishes the annual reference report on search funds, counted 85 active search funds in Europe in 2025, a growth of +38% vs 2024.',
      }},
      { type: 'h2', text: { fr: 'Pourquoi les search funds ciblent les SaaS en priorité', en: 'Why search funds prioritise SaaS targets' } },
      { type: 'p', text: {
        fr: 'La logique est claire : un SaaS profitable avec ARR récurrent offre une base de revenus prévisibles qui permet de servir la dette d\'acquisition et de rémunérer les investisseurs. Les métriques SaaS sont aussi plus faciles à auditer et à projeter que les revenus d\'une PME industrielle. Les search funds européens ciblent en priorité des SaaS B2B avec ARR entre 1M€ et 5M€, EBITDA positif (ou proche), et un fondateur prêt à une transition propre.',
        en: 'The logic is clear: a profitable SaaS with recurring ARR offers a predictable revenue base that allows servicing acquisition debt and remunering investors. SaaS metrics are also easier to audit and project than revenues from an industrial SME. European search funds primarily target B2B SaaS with ARR between €1M and €5M, positive (or near-positive) EBITDA, and a founder ready for a clean transition.',
      }},
      { type: 'h2', text: { fr: 'Les deux modèles : search fund traditionnel vs auto-financé', en: 'The two models: traditional vs self-funded search fund' } },
      { type: 'list', items: [
        { fr: 'Search fund traditionnel (funded search) : le searcher lève 400–600K€ en phase 1 pour financer 18–24 mois de recherche. Les investisseurs reçoivent des droits d\'investissement préférentiels sur le closing. En phase 2, un tour de 2–10M€ est levé pour l\'acquisition. Le searcher reçoit 20–30% du capital (carried interest) en échange de son rôle opérationnel. Rendements historiques : IRR médian de 35% pour les investisseurs (IESE 2024).', en: 'Traditional search fund (funded search): the searcher raises €400–600K in phase 1 to fund 18–24 months of search. Investors receive preferential investment rights on closing. In phase 2, a €2–10M round is raised for the acquisition. The searcher receives 20–30% of equity (carried interest) in exchange for their operational role. Historical returns: median IRR of 35% for investors (IESE 2024).' },
        { fr: 'Search fund auto-financé (self-funded search) : le searcher finance lui-même la phase de recherche (souvent avec ses économies ou une activité de conseil parallèle). Il conserve une plus grande part du capital mais prend plus de risque personnel. Modèle en forte croissance en Europe (+55% en 2025) car il permet une plus grande indépendance et rapidité d\'exécution.', en: 'Self-funded search: the searcher finances the search phase themselves (often with savings or a parallel consulting activity). They retain a larger share of equity but take more personal risk. Fast-growing model in Europe (+55% in 2025) as it allows greater independence and execution speed.' },
      ]},
      { type: 'h2', text: { fr: 'Les critères d\'un SaaS "search-fundable"', en: 'Criteria for a "search-fundable" SaaS' } },
      { type: 'list', items: [
        { fr: 'ARR entre 1M€ et 5M€ : taille minimale pour justifier une acquisition structurée avec due diligence formelle. Au-dessus de 5M€, les search funds sont en compétition avec les PE institutionnels.', en: 'ARR between €1M and €5M: minimum size to justify a structured acquisition with formal due diligence. Above €5M, search funds compete with institutional PE.' },
        { fr: 'EBITDA positif ou à l\'équilibre : le search fund doit pouvoir servir la dette d\'acquisition avec les cash flows de l\'actif. Un SaaS en perte chronique nécessite un financement equity additionnel qui dilue le searcher.', en: 'Positive or breakeven EBITDA: the search fund must be able to service acquisition debt with the asset\'s cash flows. A chronically loss-making SaaS requires additional equity financing that dilutes the searcher.' },
        { fr: 'Fondateur absent opérationnellement : le searcher doit pouvoir prendre les rênes rapidement. Un actif où le fondateur est le seul à connaître l\'architecture technique ou les clients clés est une bombe à retardement.', en: 'Operationally absent founder: the searcher must be able to take the reins quickly. An asset where the founder is the only one who knows the technical architecture or key clients is a time bomb.' },
        { fr: 'Marché défensif et stable : les search funds évitent les marchés en disruption rapide (IA pure player, crypto) au profit des verticaux métier stables (legal, RH, comptabilité, ERP sectoriel). Ces marchés offrent un churn plus bas et des cycles de vente plus longs mais plus prévisibles.', en: 'Defensive and stable market: search funds avoid rapidly disrupted markets (pure AI players, crypto) in favour of stable business verticals (legal, HR, accounting, sector ERP). These markets offer lower churn and longer but more predictable sales cycles.' },
      ]},
      { type: 'stats', items: [
        { value: '85',    label: { fr: 'Search funds actifs en Europe en 2025 (IESE Business School)', en: 'Active search funds in Europe in 2025 (IESE Business School)' } },
        { value: '+38%',  label: { fr: 'Croissance du nombre de search funds en Europe 2024–2025', en: 'Growth in number of search funds in Europe 2024–2025' } },
        { value: '35%',   label: { fr: 'IRR médian investisseurs search fund (IESE 2024)', en: 'Median investor IRR search fund (IESE 2024)' } },
        { value: '3–5x', label: { fr: 'Multiple ARR typique ciblé par les search funds européens', en: 'Typical ARR multiple targeted by European search funds' } },
      ]},
      { type: 'h2', text: { fr: 'Comment AEGRYN accompagne les search funds', en: 'How AEGRYN supports search funds' } },
      { type: 'p', text: {
        fr: 'AEGRYN dispose d\'un deal flow qualifié d\'actifs SaaS certifiés Grade entre 1M€ et 10M€ d\'ARR. Les search funds enregistrés dans le réseau AEGRYN accèdent à ce deal flow en priorité, avec des actifs pré-audités sur les quatre dimensions (Code, IP, Finance, Sécurité). Cela réduit la durée et le coût de la due diligence de 40–60% vs un processus non structuré. Les search funds peuvent également soumettre des mandats de recherche précis (vertical cible, ARR cible, géographie) pour accès au deal flow confidentiel hors marketplace.',
        en: 'AEGRYN has a qualified deal flow of Grade-certified SaaS assets between €1M and €10M ARR. Search funds registered in the AEGRYN network access this deal flow with priority, with assets pre-audited across the four dimensions (Code, IP, Finance, Security). This reduces the duration and cost of due diligence by 40–60% vs an unstructured process. Search funds can also submit precise search mandates (target vertical, target ARR, geography) for access to confidential deal flow outside marketplaces.',
      }},
    ],
    faq: [
      {
        q: { fr: 'Peut-on créer un search fund sans expérience en M&A ?', en: 'Can you create a search fund without M&A experience?' },
        a: { fr: 'Oui — la majorité des searchers européens sont d\'anciens consultants, MBA ou cadres d\'entreprise sans expérience M&A formelle. Ce qui compte est la crédibilité opérationnelle (avoir géré des équipes, des budgets, des projets complexes), la capacité à lever des fonds auprès des investisseurs search fund (une communauté identifiée), et la rigueur du processus de recherche et de due diligence. Des formations spécialisées existent (IESE, HEC, IMD) et des réseaux de mentors searchers expérimentés sont actifs en Europe.', en: 'Yes — the majority of European searchers are former consultants, MBAs or corporate executives without formal M&A experience. What matters is operational credibility (having managed teams, budgets, complex projects), the ability to raise funds from search fund investors (an identified community), and the rigour of the search and due diligence process. Specialist training exists (IESE, HEC, IMD) and networks of experienced searcher mentors are active in Europe.' },
      },
    ],
  },

  {
    slug:     'family-office-investissement-actifs-tech',
    category: 'buyer',
    date:     '2026-07-08',
    readMin:  9,
    featured: false,
    title: {
      fr: 'Family offices et actifs tech : stratégies d\'investissement dans les SaaS européens en 2026',
      en: 'Family offices and tech assets: investment strategies in European SaaS in 2026',
    },
    excerpt: {
      fr: 'Les family offices européens gèrent 630 Md CHF en Suisse seule. Ils s\'intéressent croissant aux actifs tech SaaS pour leur rendement récurrent et leur faible corrélation aux marchés cotés. Guide des stratégies et critères.',
      en: 'European family offices manage CHF 630 billion in Switzerland alone. They have growing interest in SaaS tech assets for their recurring yield and low correlation to listed markets. Guide to strategies and criteria.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Les family offices (FO) — structures patrimoniales gérant les fortunes de familles fortunées — représentent une classe d\'investisseurs en plein repositionnement stratégique. En Suisse, les family offices gèrent 630 milliards de CHF d\'actifs (source : Association Suisse des Family Offices, 2025). En Europe, cette masse sous gestion a augmenté de 23% en 5 ans, portée par la création de richesse dans la tech et le déplacement des capitaux vers les actifs réels et alternatifs. Les SaaS rentables constituent une nouvelle classe d\'actifs idéale pour ces structures : rendement récurrent, faible corrélation aux marchés cotés, et horizon d\'investissement compatible avec les cycles longs des family offices.',
        en: 'Family offices (FO) — wealth management structures managing the fortunes of wealthy families — represent an investor class in full strategic repositioning. In Switzerland, family offices manage CHF 630 billion in assets (source: Swiss Association of Family Offices, 2025). In Europe, this managed mass has increased by 23% in 5 years, driven by tech wealth creation and capital migration to real and alternative assets. Profitable SaaS represent a new ideal asset class for these structures: recurring yield, low correlation to listed markets, and investment horizon compatible with long family office cycles.',
      }},
      { type: 'h2', text: { fr: 'Pourquoi les family offices investissent dans les SaaS', en: 'Why family offices invest in SaaS' } },
      { type: 'list', items: [
        { fr: 'Rendement récurrent vs actifs cotés : un SaaS avec 70% de marges brutes et ARR stable génère un yield économique de 15–25% sur le capital investi, largement supérieur aux rendements obligataires ou aux dividendes actions. Dans un environnement de taux à 3–4%, l\'attractivité relative des SaaS profitables s\'est renforcée.', en: 'Recurring yield vs listed assets: a SaaS with 70% gross margins and stable ARR generates an economic yield of 15–25% on invested capital, far above bond yields or equity dividends. In a 3–4% interest rate environment, the relative attractiveness of profitable SaaS has strengthened.' },
        { fr: 'Faible corrélation aux marchés cotés : contrairement aux ETF ou aux actions tech cotées, un SaaS privé n\'est pas soumis à la volatilité des marchés publics. Sa valeur est déterminée par ses métriques opérationnelles, pas par le sentiment de marché.', en: 'Low correlation to listed markets: unlike ETFs or listed tech stocks, a private SaaS is not subject to public market volatility. Its value is determined by its operational metrics, not market sentiment.' },
        { fr: 'Contrôle opérationnel : certains family offices souhaitent un rôle actif (siège au board, accès aux données temps réel). Les SaaS acquis en direct (vs via un fonds) permettent ce niveau d\'implication, contrairement aux investissements via des fonds blind pool.', en: 'Operational control: some family offices want an active role (board seat, real-time data access). Directly acquired SaaS (vs via a fund) allow this level of involvement, unlike blind pool fund investments.' },
        { fr: 'Planification successorale : un SaaS profitable peut être transmis à la génération suivante comme un actif patrimonial générateur de revenus — modèle différent de la spéculation sur des actions cotées. Horizon de détention potentiel : 15–30 ans.', en: 'Estate planning: a profitable SaaS can be passed to the next generation as a revenue-generating heritage asset — a different model from listed share speculation. Potential holding horizon: 15–30 years.' },
      ]},
      { type: 'h2', text: { fr: 'Les critères d\'investissement des family offices', en: 'Family office investment criteria' } },
      { type: 'p', text: {
        fr: 'Contrairement aux fonds PE qui ont des contraintes de retour imposées par leurs LPs, les family offices ont des horizons plus longs et des critères plus qualitatifs. Les caractéristiques recherchées en 2026 : ARR entre 1M€ et 20M€, EBITDA positif ou à l\'équilibre, marché niche avec faible exposition concurrentielle, fondateur vendeur avec profil de transition propre, et documentation légale irréprochable (IP, RGPD, contrats). Ils accordent une importance particulière à la qualité de l\'équipe opérationnelle post-closing — certains family offices souhaitent garder le fondateur comme advisor pendant 12–24 mois.',
        en: 'Unlike PE funds constrained by LP return requirements, family offices have longer horizons and more qualitative criteria. Characteristics sought in 2026: ARR between €1M and €20M, positive or breakeven EBITDA, niche market with low competitive exposure, selling founder with a clean transition profile, and impeccable legal documentation (IP, GDPR, contracts). They attach particular importance to the quality of the operational team post-closing — some family offices want to retain the founder as an advisor for 12–24 months.',
      }},
      { type: 'h2', text: { fr: 'La Suisse comme hub d\'investissement tech pour les FO', en: 'Switzerland as a tech investment hub for FOs' } },
      { type: 'p', text: {
        fr: 'La Suisse concentre une densité exceptionnelle de family offices (Genève, Zurich, Zug) avec un cadre réglementaire favorable, une confidentialité institutionnelle, et un réseau d\'advisors M&A spécialisés. AEGRYN, opérant depuis Genève et Zurich, bénéficie de ce positionnement pour mettre en relation les family offices suisses et européens avec des actifs tech certifiés. La neutralité suisse facilite également les acquisitions cross-border — un family office genevois peut acquérir un SaaS français ou allemand sans complexité fiscale majeure via une structure holding suisse.',
        en: 'Switzerland concentrates an exceptional density of family offices (Geneva, Zurich, Zug) with a favourable regulatory framework, institutional confidentiality, and a network of specialist M&A advisors. AEGRYN, operating from Geneva and Zurich, benefits from this positioning to connect Swiss and European family offices with certified tech assets. Swiss neutrality also facilitates cross-border acquisitions — a Geneva-based family office can acquire a French or German SaaS without major tax complexity via a Swiss holding structure.',
      }},
      { type: 'stats', items: [
        { value: '630 Md', label: { fr: 'CHF sous gestion family offices suisses (ASFO 2025)', en: 'CHF managed by Swiss family offices (ASFO 2025)' } },
        { value: '+23%',   label: { fr: 'Croissance actifs FO en Europe sur 5 ans', en: 'Growth of FO assets in Europe over 5 years' } },
        { value: '15–25%', label: { fr: 'Yield économique attendu sur SaaS profitable (capital investi)', en: 'Expected economic yield on profitable SaaS (invested capital)' } },
        { value: '15–30',  label: { fr: 'Ans : horizon de détention typique family office', en: 'Years: typical family office holding horizon' } },
      ]},
    ],
  },

  {
    slug:     'earnout-structure-cession-tech-guide',
    category: 'legal',
    date:     '2026-07-01',
    readMin:  9,
    featured: false,
    title: {
      fr: 'Earnout dans les cessions tech : mécanisme, calcul et risques pour le vendeur',
      en: 'Earnout in tech disposals: mechanism, calculation and risks for the seller',
    },
    excerpt: {
      fr: 'L\'earnout est un complément de prix conditionnel post-closing de plus en plus utilisé dans les cessions SaaS. Ce guide explique comment il se calcule, comment le négocier, et les pièges qui piègent les fondateurs vendeurs.',
      en: 'The earnout is a conditional post-closing price supplement increasingly used in SaaS sales. This guide explains how it is calculated, how to negotiate it, and the traps that catch selling founders.',
    },
    body: [
      { type: 'p', text: {
        fr: 'L\'earnout est un mécanisme contractuel par lequel une partie du prix de cession est conditionnée à l\'atteinte d\'objectifs définis post-closing. Il est utilisé dans 35–45% des transactions SaaS mid-market en Europe (source : Hampleton Partners 2025) comme outil d\'alignement d\'intérêts entre vendeur et acquéreur, notamment quand la valorisation est disputée ou quand l\'acquéreur veut sécuriser la transition opérationnelle.',
        en: 'The earnout is a contractual mechanism whereby part of the sale price is conditional on achieving defined post-closing objectives. It is used in 35–45% of European mid-market SaaS transactions (source: Hampleton Partners 2025) as an interest-alignment tool between seller and acquirer, particularly when valuation is disputed or when the acquirer wants to secure the operational transition.',
      }},
      { type: 'h2', text: { fr: 'Pourquoi les acquéreurs proposent des earnouts', en: 'Why acquirers propose earnouts' } },
      { type: 'p', text: {
        fr: 'Du point de vue de l\'acquéreur, l\'earnout remplit trois fonctions : (1) réduire le risque de valorisation sur un actif dont les métriques futures sont incertaines (actif en forte croissance mais historique court) ; (2) aligner les intérêts du vendeur sur la performance post-closing (si le fondateur reste impliqué) ; (3) financer une partie du prix avec les cash flows futurs de l\'actif plutôt qu\'avec du capital propre ou de la dette. Du point de vue du vendeur, l\'earnout est une prise de risque sur l\'avenir — il doit être négocié avec rigueur.',
        en: 'From the acquirer\'s perspective, the earnout serves three functions: (1) reduce valuation risk on an asset with uncertain future metrics (fast-growing asset but short history); (2) align the seller\'s interests with post-closing performance (if the founder stays involved); (3) finance part of the price with the asset\'s future cash flows rather than own capital or debt. From the seller\'s perspective, the earnout is a bet on the future — it must be negotiated rigorously.',
      }},
      { type: 'h2', text: { fr: 'Les mécanismes de calcul : ARR, EBITDA, croissance', en: 'Calculation mechanisms: ARR, EBITDA, growth' } },
      { type: 'list', items: [
        { fr: 'Earnout basé sur l\'ARR : le plus courant en SaaS. Formule exemple : si l\'ARR à 12 mois post-closing dépasse X€, le vendeur reçoit Y€ supplémentaires. Avantage pour le vendeur : l\'ARR est une métrique mesurable et difficile à manipuler. Risque : si l\'acquéreur change la politique tarifaire post-closing, l\'ARR peut être impacté sans faute du fondateur.', en: 'ARR-based earnout: most common in SaaS. Example formula: if ARR at 12 months post-closing exceeds X€, the seller receives an additional Y€. Advantage for seller: ARR is a measurable and hard-to-manipulate metric. Risk: if the acquirer changes pricing policy post-closing, ARR can be impacted without the founder\'s fault.' },
        { fr: 'Earnout basé sur l\'EBITDA : l\'acquéreur paie un supplément si l\'EBITDA post-closing atteint un seuil. Très risqué pour le vendeur car l\'acquéreur contrôle les coûts post-closing — il peut augmenter les charges (salaires management, services groupe) et réduire artificiellement l\'EBITDA.', en: 'EBITDA-based earnout: the acquirer pays a supplement if post-closing EBITDA reaches a threshold. Very risky for the seller as the acquirer controls post-closing costs — they can increase charges (management salaries, group services) and artificially reduce EBITDA.' },
        { fr: 'Earnout basé sur la croissance (% YoY) : conditionné à l\'atteinte d\'un taux de croissance cible. Problème : si l\'acquéreur ralentit les investissements commerciaux post-closing, la croissance ralentit et le vendeur ne touche pas son earnout.', en: 'Growth-based earnout (% YoY): conditional on achieving a target growth rate. Problem: if the acquirer slows commercial investments post-closing, growth slows and the seller does not receive their earnout.' },
      ]},
      { type: 'h2', text: { fr: 'Comment négocier un earnout favorable pour le vendeur', en: 'How to negotiate an earnout favourable for the seller' } },
      { type: 'list', items: [
        { fr: 'Exiger des métriques objectives non manipulables : privilégier l\'ARR net de commissions de distribution (définition stricte dans le SPA) plutôt que l\'EBITDA ou le revenu brut.', en: 'Require objective non-manipulable metrics: prefer net ARR of distribution commissions (strict definition in the SPA) over EBITDA or gross revenue.' },
        { fr: 'Négocier des garde-fous opérationnels : clause de non-modification de la politique tarifaire sans accord du vendeur pendant la période d\'earnout, obligation de maintenir les dépenses commerciales à un niveau minimum.', en: 'Negotiate operational safeguards: clause preventing modification of pricing policy without seller agreement during the earnout period, obligation to maintain commercial spending at a minimum level.' },
        { fr: 'Limiter la durée à 12–18 mois : les earnouts de plus de 24 mois sont des pièges pour le vendeur. Plus la durée est longue, plus l\'incertitude augmente et plus l\'acquéreur a de leviers pour influencer la performance.', en: 'Limit duration to 12–18 months: earnouts longer than 24 months are traps for the seller. The longer the duration, the more uncertainty grows and the more levers the acquirer has to influence performance.' },
        { fr: 'Plafonner et protéger avec un floor : négocier un montant minimum d\'earnout (floor) garanti quoi qu\'il arrive, et un plafond (cap) pour donner à l\'acquéreur une visibilité sur son exposition maximale.', en: 'Cap and protect with a floor: negotiate a minimum guaranteed earnout amount (floor) regardless, and a cap to give the acquirer visibility on their maximum exposure.' },
      ]},
      { type: 'h2', text: { fr: 'Les pièges classiques à éviter', en: 'Classic pitfalls to avoid' } },
      { type: 'p', text: {
        fr: 'Le piège le plus courant est l\'earnout sur l\'EBITDA dans une structure où l\'acquéreur refacture des services de groupe (IT, RH, legal, finance) à l\'entité cédée. Ces recharges de groupe peuvent artificiellement gonfler les coûts et réduire l\'EBITDA sous le seuil d\'earnout. Le deuxième piège est l\'earnout sans mécanisme de résolution des litiges : si l\'acquéreur et le vendeur sont en désaccord sur le calcul, l\'absence d\'un expert indépendant désigné dans le SPA transforme le litige en procédure judiciaire de 18–36 mois.',
        en: 'The most common trap is the EBITDA earnout in a structure where the acquirer recharges group services (IT, HR, legal, finance) to the acquired entity. These group recharges can artificially inflate costs and reduce EBITDA below the earnout threshold. The second trap is an earnout without a dispute resolution mechanism: if the acquirer and seller disagree on the calculation, the absence of an independent expert designated in the SPA transforms the dispute into an 18–36 month judicial procedure.',
      }},
      { type: 'stats', items: [
        { value: '35–45%', label: { fr: 'Deals SaaS mid-market incluant un earnout (Hampleton 2025)', en: 'Mid-market SaaS deals including an earnout (Hampleton 2025)' } },
        { value: '12–18',  label: { fr: 'Mois : durée earnout recommandée pour le vendeur', en: 'Months: recommended earnout duration for the seller' } },
        { value: 'ARR',    label: { fr: 'Métrique la plus favorable au vendeur pour l\'earnout', en: 'Metric most favourable to seller for earnout' } },
        { value: 'SPA',    label: { fr: 'Document clé : définitions strictes et expert indépendant', en: 'Key document: strict definitions and independent expert' } },
      ]},
    ],
    faq: [
      {
        q: { fr: 'Quelle est la proportion typique d\'earnout dans le prix total ?', en: 'What is the typical proportion of earnout in the total price?' },
        a: { fr: 'En pratique, les earnouts représentent 10–30% du prix total de cession. Au-delà de 30%, le risque pour le vendeur devient significatif. L\'idéal pour le vendeur : earnout < 20% du prix total, sur une durée de 12 mois, basé sur l\'ARR avec des métriques contractuellement définies et un expert indépendant désigné pour les litiges.', en: 'In practice, earnouts represent 10–30% of the total sale price. Above 30%, the risk for the seller becomes significant. The ideal for the seller: earnout < 20% of total price, over 12 months, based on ARR with contractually defined metrics and an independent expert designated for disputes.' },
      },
      {
        q: { fr: 'Peut-on refuser un earnout et exiger un prix comptant ?', en: 'Can you refuse an earnout and demand a cash price?' },
        a: { fr: 'Oui — et c\'est une position légitime. Un fondateur qui a préparé son actif, l\'a fait certifier, et présente une data room irréprochable est en position de négociation favorable. L\'earnout est souvent proposé quand l\'acquéreur perçoit une incertitude résiduelle. En réduisant cette incertitude (certification, documentation, métriques auditées), le vendeur réduit la justification de l\'earnout et peut l\'éliminer ou le minimiser.', en: 'Yes — and it is a legitimate position. A founder who has prepared their asset, had it certified, and presents an impeccable data room is in a favourable negotiating position. The earnout is often proposed when the acquirer perceives residual uncertainty. By reducing this uncertainty (certification, documentation, audited metrics), the seller reduces the justification for the earnout and can eliminate or minimise it.' },
      },
    ],
  },


  /* ── CLUSTER 3 — MARCHÉ & VERTICAUX ─────────────────────────────────── */

  {
    slug:     'marche-ma-tech-europe-q4-2026',
    category: 'market',
    date:     '2026-10-01',
    readMin:  7,
    featured: false,
    title: {
      fr: 'État du marché M&A tech Europe — Q4 2026 : consolidation et retour des multiples premium',
      en: 'European Tech M&A Market — Q4 2026: consolidation and return of premium multiples',
    },
    excerpt: {
      fr: 'Analyse des transactions Q3 2026, tendances des multiples par vertical et prévisions Q4. Les actifs IA-native et LegalTech dominent le deal flow européen avec des multiples en hausse de 15% vs Q2.',
      en: 'Q3 2026 transaction analysis, multiple trends by vertical and Q4 forecasts. AI-native and LegalTech assets dominate European deal flow with multiples up 15% vs Q2.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché M&A tech européen confirme au Q3 2026 un retour progressif des multiples premium sur les actifs de qualité. Les actifs certifiés se négocient à 5–8x ARR, tandis que les actifs non structurés stagnent à 2–3x. Cette bifurcation est le signal le plus important du marché actuel.',
        en: 'The European tech M&A market confirms in Q3 2026 a gradual return of premium multiples on quality assets. Certified assets trade at 5–8x ARR, while unstructured assets stagnate at 2–3x. This bifurcation is the most important signal of the current market.',
      }},
      { type: 'stats', items: [
        { value: '847',   label: { fr: 'Transactions M&A tech Europe Q3 2026 (Dealroom)', en: 'Tech M&A transactions Europe Q3 2026 (Dealroom)' } },
        { value: '+12%',  label: { fr: 'Croissance volume vs Q3 2025', en: 'Volume growth vs Q3 2025' } },
        { value: '4,2x',  label: { fr: 'Multiple ARR médian toutes catégories Q3 2026', en: 'Median ARR multiple all categories Q3 2026' } },
        { value: '7,1x',  label: { fr: 'Multiple ARR médian actifs IA-native certifiés', en: 'Median ARR multiple certified AI-native assets' } },
      ]},
      { type: 'h2', text: { fr: 'Verticaux les plus actifs Q3 2026', en: 'Most active verticals Q3 2026' } },
      { type: 'list', items: [
        { fr: 'IA-native B2B SaaS : 23% du volume total. Multiples 7–10x ARR pour actifs > 2M€ ARR + NRR > 110%. Demande structurelle liée à l\'AI Act.', en: 'AI-native B2B SaaS: 23% of total volume. Multiples 7–10x ARR for assets > €2M ARR + NRR > 110%. Structural demand driven by AI Act.' },
        { fr: 'LegalTech & RegTech : +18% volume vs Q3 2025. Acquéreurs dominants : Thomson Reuters, iManage, Hg Capital. Multiples 9–13x ARR dans le DACH.', en: 'LegalTech & RegTech: +18% volume vs Q3 2025. Dominant acquirers: Thomson Reuters, iManage, Hg Capital. Multiples 9–13x ARR in DACH.' },
        { fr: 'HRTech & WorkTech : consolidation accélérée. PME absorbées par plateformes RH européennes établies. Multiples 5–7x ARR.', en: 'HRTech & WorkTech: accelerated consolidation. SMEs absorbed by established European HR platforms. Multiples 5–7x ARR.' },
      ]},
      { type: 'p', text: {
        fr: 'Les indicateurs avancés pointent vers un Q4 dynamique. Les taux BCE stables à 2,5% maintiennent le coût du capital favorable pour les LBO partiels. Q4 est historiquement le trimestre le plus actif en closes, les acquéreurs souhaitant finaliser leurs déploiements avant fin d\'exercice.',
        en: 'Leading indicators point to a dynamic Q4. ECB rates stable at 2.5% maintain favourable capital costs for partial LBOs. Q4 is historically the most active quarter in closes, with acquirers wanting to finalise capital deployments before year-end.',
      }},
    ],
  },

  {
    slug:     'fintech-europe-ma-valorisation-2026',
    category: 'vertical',
    date:     '2026-07-12',
    readMin:  9,
    featured: false,
    title: {
      fr: 'FinTech B2B européenne en 2026 : valorisation, deal flow et opportunités M&A',
      en: 'European B2B FinTech in 2026: valuation, deal flow and M&A opportunities',
    },
    excerpt: {
      fr: 'Le marché FinTech B2B européen pèse 180 Md€ en 2026. PSD3, DORA et Open Finance créent une vague de conformité qui génère de la demande pour les actifs RegTech et PayTech — multiples et profils acheteurs.',
      en: 'The European B2B FinTech market is worth €180B in 2026. PSD3, DORA and Open Finance create a compliance wave generating demand for RegTech and PayTech assets — multiples and buyer profiles.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché FinTech européen a atteint 180 milliards d\'euros de valorisation cumulée en 2026 (Dealroom). Les acquisitions de consolidation (conformité, distribution, infrastructure) ont remplacé les acquisitions de croissance pure. Cette mutation crée des opportunités pour les actifs B2B FinTech qui maîtrisent les contraintes réglementaires (PSD3, DORA, Open Finance).',
        en: 'The European FinTech market reached €180 billion in cumulative valuation in 2026 (Dealroom). Consolidation acquisitions (compliance, distribution, infrastructure) have replaced pure growth acquisitions. This shift creates opportunities for B2B FinTech assets that master the new regulatory constraints (PSD3, DORA, Open Finance).',
      }},
      { type: 'h2', text: { fr: 'Sous-verticaux FinTech les plus actifs en M&A', en: 'Most M&A-active FinTech sub-verticals' } },
      { type: 'list', items: [
        { fr: 'RegTech (conformité DORA) : le plus dynamique en 2025–2026. DORA applicable depuis janvier 2025 impose des exigences de résilience IT aux institutions financières. Multiples : 8–12x ARR.', en: 'RegTech (DORA compliance): most dynamic in 2025–2026. DORA applicable since January 2025 imposes IT resilience requirements on financial institutions. Multiples: 8–12x ARR.' },
        { fr: 'Open Banking & Open Finance API platforms : PSD3 élargit l\'open banking aux données d\'assurance et d\'investissement. Les agrégateurs sont des cibles prioritaires pour les grandes banques.', en: 'Open Banking & Open Finance API platforms: PSD3 extends open banking to insurance and investment data. Aggregators are priority acquisition targets for large banks.' },
        { fr: 'Payment orchestration B2B : couche logicielle entre marchands et PSP. Marché émergent, multiples élevés (10–15x ARR), scalabilité quasi-infinie sans coûts variables.', en: 'B2B payment orchestration: software layer between merchants and PSPs. Emerging market, high multiples (10–15x ARR), near-infinite scalability without variable costs.' },
      ]},
      { type: 'stats', items: [
        { value: '180 Md', label: { fr: 'Valorisation cumulée FinTech européenne 2026 (Dealroom)', en: 'Cumulative European FinTech valuation 2026 (Dealroom)' } },
        { value: '8–12x',  label: { fr: 'Multiple ARR RegTech conforme DORA/PSD3', en: 'ARR multiple RegTech compliant DORA/PSD3' } },
        { value: 'Jan.25', label: { fr: 'Date d\'application DORA — opportunité RegTech', en: 'DORA application date — RegTech opportunity' } },
        { value: '+31%',   label: { fr: 'Croissance volume deals RegTech EU 2024–2025', en: 'RegTech EU deal volume growth 2024–2025' } },
      ]},
      { type: 'p', text: {
        fr: 'La dimension S du protocole AEGRYN Grade est critique pour le vertical FinTech. DORA classe les SaaS servant des institutions financières régulées en "tiers prestataires TIC critiques". Un actif sans pentest < 18 mois, sans plan de continuité documenté, ou sans contractualisation DORA de ses sous-traitants sera rejeté par les acquéreurs institutionnels.',
        en: 'The S dimension of the AEGRYN Grade protocol is critical for the FinTech vertical. DORA classifies SaaS serving regulated financial institutions as "critical ICT third-party providers". An asset without a pentest < 18 months, without a documented continuity plan, or without DORA contractualisation of its sub-processors will be rejected by institutional acquirers.',
      }},
    ],
  },

  {
    slug:     'ai-native-saas-valorisation-multiples-2026',
    category: 'vertical',
    date:     '2026-06-20',
    readMin:  10,
    featured: false,
    title: {
      fr: 'SaaS IA-native en 2026 : valorisation, multiples et ce qui différencie les actifs premium',
      en: 'AI-native SaaS in 2026: valuation, multiples and what differentiates premium assets',
    },
    excerpt: {
      fr: 'Les SaaS IA-native affichent des multiples 7–10x ARR quand ils maîtrisent leur IP sur les modèles. Ce guide distingue les vrais actifs IA des "wrappers GPT" — une distinction critique pour la valorisation.',
      en: 'AI-native SaaS show 7–10x ARR multiples when they control their model IP. This guide distinguishes true AI assets from "GPT wrappers" — a critical valuation distinction.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Tous les produits qui utilisent l\'IA ne sont pas des "actifs IA" au sens M&A. La distinction entre un wrapper GPT (interface sur un LLM généraliste sans IP propriétaire) et un vrai actif IA (modèle fine-tuné sur données propriétaires, infrastructure d\'inférence optimisée) est déterminante pour la valorisation.',
        en: 'Not all products that use AI are "AI assets" in the M&A sense. The distinction between a GPT wrapper (interface on a generalised LLM without proprietary IP) and a true AI asset (model fine-tuned on proprietary data, optimised inference infrastructure) is decisive for valuation.',
      }},
      { type: 'h2', text: { fr: 'Wrapper GPT vs actif IA propriétaire', en: 'GPT wrapper vs proprietary AI asset' } },
      { type: 'list', items: [
        { fr: 'Wrapper GPT : appelle l\'API OpenAI via prompt engineering. Aucune IP sur le modèle. Valorisation : 1–3x ARR. Acquéreurs paient pour la distribution, pas la techno.', en: 'GPT wrapper: calls the OpenAI API via prompt engineering. No IP on the model. Valuation: 1–3x ARR. Acquirers pay for distribution, not technology.' },
        { fr: 'Fine-tuning sur données propriétaires : modèle base (open source ou API) fine-tuné sur données sectorielles. Performance supérieure sur le domaine cible. Valorisation : 4–7x ARR.', en: 'Fine-tuning on proprietary data: base model (open source or API) fine-tuned on sector data. Superior performance on target domain. Valuation: 4–7x ARR.' },
        { fr: 'Modèle propriétaire entraîné en interne : weights détenus par la société, corpus propriétaire. Valorisation : 7–15x ARR si données exclusives et moat défensif.', en: 'Internally trained proprietary model: weights owned by company, proprietary corpus. Valuation: 7–15x ARR if exclusive data and defensive moat.' },
      ]},
      { type: 'stats', items: [
        { value: '7–10x', label: { fr: 'Multiple ARR SaaS IA-native avec IP modèle propriétaire', en: 'ARR multiple AI-native SaaS with proprietary model IP' } },
        { value: '1–3x',  label: { fr: 'Multiple ARR wrapper GPT sans IP propriétaire', en: 'ARR multiple GPT wrapper without proprietary IP' } },
        { value: '65%+',  label: { fr: 'Marges brutes réelles SaaS IA optimisé (post GPU costs)', en: 'Real gross margins optimised AI SaaS (post GPU costs)' } },
        { value: '–25%',  label: { fr: 'Décote dépendance 100% API OpenAI', en: 'Discount for 100% OpenAI API dependency' } },
      ]},
      { type: 'p', text: {
        fr: 'L\'AI Act européen (applicable depuis août 2024, progressivement jusqu\'en 2027) classifie les systèmes IA en 4 niveaux de risque. Un SaaS IA en contexte "haut risque" (RH, crédit, justice, santé) doit être conforme au Titre III : système de gestion des risques documenté, journaux d\'événements, transparence. La dimension S du protocole AEGRYN intègre ces exigences depuis Q1 2026.',
        en: 'The European AI Act (applicable since August 2024, progressively until 2027) classifies AI systems in 4 risk levels. An AI SaaS in a "high risk" context (HR, credit, justice, health) must comply with Title III: documented risk management system, event logs, transparency. The S dimension of the AEGRYN protocol has integrated these requirements since Q1 2026.',
      }},
    ],
    faq: [
      {
        q: { fr: 'Un SaaS qui utilise ChatGPT peut-il être certifié AEGRYN ?', en: 'Can a SaaS that uses ChatGPT be AEGRYN certified?' },
        a: { fr: 'Oui, sous conditions : (1) la dépendance API est documentée avec stratégie de mitigation ; (2) les données clients ne sont pas envoyées sans DPA avec OpenAI/Anthropic ; (3) conformité AI Act Titre III si usage haut risque. Un wrapper GPT pur obtiendra typiquement un Grade B ou A, pas au-dessus.', en: 'Yes, under conditions: (1) API dependency is documented with mitigation strategy; (2) client data is not sent without DPA with OpenAI/Anthropic; (3) AI Act Title III compliance if high-risk use. A pure GPT wrapper will typically get Grade B or A, not above.' },
      },
    ],
  },

  {
    slug:     'suisse-hub-cession-actifs-tech-europe',
    category: 'strategy',
    date:     '2026-06-15',
    readMin:  8,
    featured: false,
    title: {
      fr: 'Pourquoi la Suisse est le meilleur hub pour céder un actif tech européen',
      en: 'Why Switzerland is the best hub for selling a European tech asset',
    },
    excerpt: {
      fr: 'Fiscalité favorable, confidentialité institutionnelle, concentration de family offices et neutralité cross-border : la Suisse offre un cadre unique pour les cessions d\'actifs tech mid-market. Analyse factuelle.',
      en: 'Favourable taxation, institutional confidentiality, family office concentration and cross-border neutrality: Switzerland offers a unique framework for mid-market tech asset sales.',
    },
    body: [
      { type: 'p', text: {
        fr: 'La Suisse n\'est pas un paradis fiscal au sens populaire — c\'est une juridiction structurellement favorable aux transactions de cession d\'actifs pour des raisons techniques précises. Ce guide dresse un état des lieux factuel des avantages comparatifs de la Suisse comme hub M&A tech.',
        en: 'Switzerland is not a tax haven in the popular sense — it is a structurally favourable jurisdiction for asset disposal transactions for precise technical reasons. This guide provides a factual overview of Switzerland\'s comparative advantages as a tech M&A hub.',
      }},
      { type: 'h2', text: { fr: 'Avantage 1 : fiscalité des plus-values', en: 'Advantage 1: capital gains taxation' } },
      { type: 'p', text: {
        fr: 'En Suisse, les plus-values réalisées par des personnes physiques sur cession de participations ne sont pas imposées au niveau fédéral (sous conditions). Avantage vs France (PFU 30%), Allemagne (Abgeltungsteuer 25%+), Espagne (IRPF 19–28%). Seul l\'impôt sur la fortune cantonal (0,1–0,3% du patrimoine/an) s\'applique.',
        en: 'In Switzerland, capital gains realised by individuals on disposal of shareholdings are not taxed at the federal level (under conditions). Advantage vs France (PFU 30%), Germany (Abgeltungsteuer 25%+), Spain (IRPF 19–28%). Only cantonal wealth tax (0.1–0.3% of assets/year) applies.',
      }},
      { type: 'h2', text: { fr: 'Avantage 2 : concentration de capitaux institutionnels', en: 'Advantage 2: concentration of institutional capital' } },
      { type: 'p', text: {
        fr: 'Genève et Zurich concentrent family offices, fonds PE européens et banques privées. La Place Financière Suisse gère 7 700 milliards de CHF d\'actifs (Swiss Bankers Association, 2025). Un actif présenté à Genève ou Zurich touche simultanément des centaines d\'investisseurs qualifiés.',
        en: 'Geneva and Zurich concentrate family offices, European PE funds and private banks. The Swiss Financial Centre manages CHF 7,700 billion in assets (Swiss Bankers Association, 2025). An asset presented in Geneva or Zurich simultaneously reaches hundreds of qualified investors.',
      }},
      { type: 'stats', items: [
        { value: '0%',    label: { fr: 'Impôt fédéral plus-value cession (PP, sous conditions)', en: 'Federal capital gains tax on disposal (individuals, under conditions)' } },
        { value: '7 700', label: { fr: 'Mds CHF sous gestion — Place Financière Suisse (SBA 2025)', en: 'Bn CHF AUM — Swiss Financial Centre (SBA 2025)' } },
        { value: 'GVA/ZH', label: { fr: 'Hubs AEGRYN : Genève + Zurich', en: 'AEGRYN hubs: Geneva + Zurich' } },
        { value: 'FR/DE/UK', label: { fr: 'Zones sources du deal flow acquéreurs AEGRYN', en: 'Acquirer deal flow source zones AEGRYN' } },
      ]},
    ],
  },

  {
    slug:     'marche-ma-tech-dach-2026',
    category: 'dach',
    date:     '2026-07-25',
    readMin:  9,
    featured: false,
    title: {
      fr: 'Marché M&A tech DACH 2026 : pourquoi l\'Allemagne, l\'Autriche et la Suisse offrent les meilleurs multiples d\'Europe',
      en: 'DACH tech M&A market 2026: why Germany, Austria and Switzerland offer Europe\'s best multiples',
    },
    excerpt: {
      fr: 'Le marché DACH représente 28% du volume M&A tech européen avec des multiples 15–25% supérieurs vs l\'Europe du Sud. Mittelstand numérique, fonds PE sectoriels et SaaS B2B verticaux : analyse complète.',
      en: 'The DACH market represents 28% of European tech M&A volume with multiples 15–25% above Southern Europe. Digital Mittelstand, sector PE funds and vertical B2B SaaS: complete analysis.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché DACH représente 28% du volume M&A tech européen en 2025 (Dealroom). C\'est la zone où les multiples SaaS sont systématiquement les plus élevés d\'Europe continentale (+15–25% vs France). Trois facteurs : densité de fonds PE sectoriels, qualité du Mittelstand numérique, culture industrielle favorable aux logiciels verticaux.',
        en: 'The DACH market represents 28% of European tech M&A volume in 2025 (Dealroom). It is the zone where SaaS multiples are systematically the highest in continental Europe (+15–25% vs France). Three factors: density of sector PE funds, quality of the digital Mittelstand, industrial culture favourable to vertical software.',
      }},
      { type: 'h2', text: { fr: 'Le Mittelstand numérique', en: 'The digital Mittelstand' } },
      { type: 'p', text: {
        fr: 'Les 3,5 millions de PME/ETI allemandes (55% du PIB allemand, source : Institut für Mittelstandsforschung Bonn, 2025) sont en pleine numérisation. Cette transformation génère une demande structurelle pour les ERP sectoriels, outils supply chain et conformité. Les SaaS qui servent ce segment ont NRR > 105% et churn proche de 0%.',
        en: 'The 3.5 million German SMEs/mid-caps (55% of German GDP, source: Institut für Mittelstandsforschung Bonn, 2025) are in full digitalisation. This generates structural demand for sector ERPs, supply chain tools and compliance. SaaS serving this segment have NRR > 105% and churn close to 0%.',
      }},
      { type: 'h2', text: { fr: 'Fonds PE sectoriels actifs sur le DACH', en: 'Sector PE funds active in DACH' } },
      { type: 'list', items: [
        { fr: 'Hg Capital (Londres/Munich) : spécialiste software B2B vertical EU, focus DACH. Cible ARR > 5M€, NRR > 110%. Multiples payés : 8–14x ARR.', en: 'Hg Capital (London/Munich): specialist B2B vertical software EU, DACH focus. Target ARR > €5M, NRR > 110%. Multiples paid: 8–14x ARR.' },
        { fr: 'FLEX Capital (Berlin) : fonds PE tech DACH, cible SaaS bootstrapped 1–10M€ ARR. Processus rapide : 6–8 semaines du premier contact au closing.', en: 'FLEX Capital (Berlin): DACH tech PE fund, targets bootstrapped SaaS €1–10M ARR. Fast process: 6–8 weeks from first contact to closing.' },
        { fr: 'Deutsche Beteiligungs AG (DBAG, Francfort) : fonds coté, orientation croissante vers le software vertical industriel (Industry 4.0). Tickets : 10–50M€.', en: 'Deutsche Beteiligungs AG (DBAG, Frankfurt): listed fund, growing orientation towards industrial vertical software (Industry 4.0). Tickets: €10–50M.' },
      ]},
      { type: 'stats', items: [
        { value: '28%',   label: { fr: 'Part DACH dans volume M&A tech européen (Dealroom 2025)', en: 'DACH share of European tech M&A volume (Dealroom 2025)' } },
        { value: '+20%',  label: { fr: 'Prime de multiple DACH vs Europe du Sud (médiane)', en: 'DACH multiple premium vs Southern Europe (median)' } },
        { value: '3,5 M', label: { fr: 'PME/ETI allemandes en numérisation (Institut Mittelstand, 2025)', en: 'German SMEs/mid-caps in digitalisation (Institut Mittelstand, 2025)' } },
        { value: '9–13x', label: { fr: 'Multiple ARR médian SaaS B2B vertical DACH premium', en: 'Median ARR multiple B2B vertical SaaS DACH premium' } },
      ]},
    ],
  },

  /* ── CLUSTER 5 — CERTIFICATION ─────────────────────────────────────── */

  {
    slug:     'nrr-churn-ltv-cac-metriques-valorisation-saas',
    category: 'certification',
    date:     '2026-07-24',
    readMin:  12,
    featured: false,
    title: {
      fr: 'NRR, churn, LTV, CAC : les métriques SaaS qui déterminent votre valorisation en 2026',
      en: 'NRR, churn, LTV, CAC: the SaaS metrics that determine your valuation in 2026',
    },
    excerpt: {
      fr: 'Guide de référence sur les 8 métriques SaaS les plus importantes pour une valorisation M&A — définitions exactes, benchmarks sectoriels 2026, et leur impact direct sur le multiple obtenu.',
      en: 'Reference guide on the 8 most important SaaS metrics for M&A valuation — exact definitions, 2026 sector benchmarks, and their direct impact on the multiple obtained.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le marché M&A SaaS a développé son propre langage de valorisation — un ensemble de métriques standardisées permettant aux acquéreurs d\'évaluer et comparer des actifs de différentes tailles et verticaux. Ce guide couvre les métriques les plus importantes, avec leur définition exacte, les benchmarks 2026, et leur poids dans la construction du multiple.',
        en: 'The SaaS M&A market has developed its own valuation language — a set of standardised metrics that allow acquirers to evaluate and compare assets of different sizes and verticals. This guide covers the most important metrics, with their exact definition, 2026 benchmarks, and their weight in constructing the multiple.',
      }},
      { type: 'h2', text: { fr: 'NRR — Net Revenue Retention', en: 'NRR — Net Revenue Retention' } },
      { type: 'p', text: {
        fr: 'NRR = (ARR début + expansions + réactivations − churns − contractions) / ARR début × 100. Mesure la croissance des revenus issus des clients existants sur 12 mois. NRR > 100% : les clients existants génèrent plus de revenus cette année qu\'ils n\'en généraient l\'année passée, sans compter les nouveaux clients. Benchmarks 2026 (OpenView Partners SaaS Benchmarks) : NRR médian = 102%, top quartile = 115%+, SaaS B2B vertical mature = 108%.',
        en: 'NRR = (beginning ARR + expansions + reactivations − churns − contractions) / beginning ARR × 100. Measures revenue growth from existing customers over 12 months. NRR > 100%: existing customers generate more revenue this year than last year, without counting new customers. 2026 benchmarks (OpenView Partners SaaS Benchmarks): median NRR = 102%, top quartile = 115%+, mature B2B vertical SaaS = 108%.',
      }},
      { type: 'h2', text: { fr: 'Churn Rate (MRR Churn et Logo Churn)', en: 'Churn Rate (MRR Churn and Logo Churn)' } },
      { type: 'p', text: {
        fr: 'Logo churn : % de clients qui partent. MRR churn : % de revenus perdus. En M&A, le MRR churn est prioritaire car il mesure l\'impact financier réel. Benchmarks 2026 (ChartMogul) : MRR churn mensuel médian = 0,8% (~9,6%/an), top quartile = 0,4% (~4,8%/an). Au-delà de 2%/mois (~21%/an), l\'actif nécessite une justification solide pour ne pas être décoté.',
        en: 'Logo churn: % of customers who leave. MRR churn: % of revenues lost. In M&A, MRR churn is prioritised as it measures real financial impact. 2026 benchmarks (ChartMogul): median monthly MRR churn = 0.8% (~9.6%/year), top quartile = 0.4% (~4.8%/year). Above 2%/month (~21%/year), the asset requires strong justification to avoid discounting.',
      }},
      { type: 'h2', text: { fr: 'GRR — Gross Revenue Retention', en: 'GRR — Gross Revenue Retention' } },
      { type: 'p', text: {
        fr: 'GRR = (ARR début − churns − contractions) / ARR début × 100. Ne compte pas les expansions. Indicateur de "floor" : % des revenus actuels encore présents dans 12 mois sans nouvelles ventes. GRR ne peut jamais dépasser 100%. Benchmark 2026 : GRR médian SaaS B2B = 91%, top quartile = 95%+.',
        en: 'GRR = (beginning ARR − churns − contractions) / beginning ARR × 100. Does not count expansions. "Floor" indicator: % of current revenues still present in 12 months without new sales. GRR can never exceed 100%. 2026 benchmark: median B2B SaaS GRR = 91%, top quartile = 95%+.',
      }},
      { type: 'h2', text: { fr: 'LTV / CAC Ratio', en: 'LTV / CAC Ratio' } },
      { type: 'p', text: {
        fr: 'LTV (Customer Lifetime Value) = ARPU × Marge brute / Churn mensuel. CAC (Customer Acquisition Cost) = dépenses marketing + ventes / nouveaux clients acquis. LTV/CAC > 3 est le seuil minimum pour un actif SaaS sain. LTV/CAC > 5 positionne l\'actif dans le top quartile et justifie un multiple premium. Benchmark 2026 : LTV/CAC médian SaaS B2B = 4,2x (OpenView).',
        en: 'LTV (Customer Lifetime Value) = ARPU × Gross margin / Monthly churn. CAC (Customer Acquisition Cost) = marketing + sales spend / new customers acquired. LTV/CAC > 3 is the minimum threshold for a healthy SaaS asset. LTV/CAC > 5 positions the asset in the top quartile and justifies a premium multiple. 2026 benchmark: median B2B SaaS LTV/CAC = 4.2x (OpenView).',
      }},
      { type: 'h2', text: { fr: 'CAC Payback Period', en: 'CAC Payback Period' } },
      { type: 'p', text: {
        fr: 'CAC Payback = CAC / (ARPU mensuel × Marge brute). Mesure le nombre de mois nécessaires pour récupérer le coût d\'acquisition d\'un client. Un CAC Payback < 12 mois est excellent et rassure les acquéreurs sur l\'efficacité commerciale. Entre 12 et 24 mois, acceptable. Au-delà de 24 mois, l\'actif consomme plus de cash qu\'il n\'en génère à court terme — risque si la croissance ralentit.',
        en: 'CAC Payback = CAC / (Monthly ARPU × Gross margin). Measures the number of months required to recover the cost of acquiring a customer. CAC Payback < 12 months is excellent and reassures acquirers on commercial efficiency. Between 12 and 24 months, acceptable. Above 24 months, the asset consumes more cash than it generates in the short term — risk if growth slows.',
      }},
      { type: 'stats', items: [
        { value: '102%',  label: { fr: 'NRR médian SaaS B2B 2026 (OpenView Partners)', en: 'Median B2B SaaS NRR 2026 (OpenView Partners)' } },
        { value: '0,8%',  label: { fr: 'MRR churn mensuel médian (ChartMogul 2026)', en: 'Median monthly MRR churn (ChartMogul 2026)' } },
        { value: '4,2x',  label: { fr: 'LTV/CAC médian SaaS B2B (OpenView 2026)', en: 'Median B2B SaaS LTV/CAC (OpenView 2026)' } },
        { value: '< 12',  label: { fr: 'Mois CAC payback excellent (top quartile)', en: 'Months excellent CAC payback (top quartile)' } },
      ]},
    ],
    faq: [
      {
        q: { fr: 'Quelle métrique est la plus importante pour maximiser mon multiple de cession ?', en: 'Which metric is most important for maximising my exit multiple?' },
        a: { fr: 'Le NRR est la métrique la plus corrélée au multiple obtenu en cession SaaS. Un NRR > 110% permet d\'atteindre des multiples de 6–8x ARR vs 3–4x pour un NRR < 95%. La raison : un NRR élevé signifie que les clients existants financent la croissance — réduisant le besoin de CAC élevé pour maintenir les revenus. Les acquéreurs paient une prime significative pour cette qualité de rétention car elle réduit le risque d\'investissement post-closing.', en: 'NRR is the metric most correlated with the multiple obtained in SaaS sales. NRR > 110% allows reaching 6–8x ARR multiples vs 3–4x for NRR < 95%. The reason: high NRR means existing customers finance growth — reducing the need for high CAC to maintain revenues. Acquirers pay a significant premium for this retention quality as it reduces post-closing investment risk.' },
      },
    ],
  },

  {
    slug:     'certification-independante-saas-avant-cession',
    category: 'certification',
    date:     '2026-07-18',
    readMin:  10,
    featured: false,
    title: {
      fr: 'Certification indépendante avant cession SaaS : pourquoi c\'est devenu indispensable en 2026',
      en: 'Independent certification before SaaS sale: why it has become indispensable in 2026',
    },
    excerpt: {
      fr: 'Les actifs SaaS certifiés par un tiers indépendant avant la mise en vente se vendent 25–40% plus cher et 3× plus vite. Anatomie du processus de certification AEGRYN Grade et de son impact sur la négociation.',
      en: 'SaaS assets independently certified before sale sell for 25–40% more and 3× faster. Anatomy of the AEGRYN Grade certification process and its impact on negotiation.',
    },
    body: [
      { type: 'p', text: {
        fr: 'La certification d\'un actif tech avant sa mise en vente est une pratique récente — elle n\'existait pas dans sa forme actuelle avant 2020. Elle répond à un besoin de marché structurel : les acquéreurs (fonds PE, search funds, family offices) font face à un nombre croissant d\'actifs présentés sur le marché avec des métriques non vérifiées, des data rooms incomplètes, et des risques IP/sécurité non documentés. La certification par un tiers indépendant résout ce problème d\'asymétrie d\'information.',
        en: 'Certifying a tech asset before putting it on the market is a recent practice — it did not exist in its current form before 2020. It addresses a structural market need: acquirers (PE funds, search funds, family offices) face a growing number of assets presented on the market with unverified metrics, incomplete data rooms, and undocumented IP/security risks. Third-party independent certification solves this information asymmetry problem.',
      }},
      { type: 'h2', text: { fr: 'Les 4 dimensions du protocole AEGRYN Grade', en: 'The 4 dimensions of the AEGRYN Grade protocol' } },
      { type: 'list', items: [
        { fr: 'Dimension C — Code : audit de la qualité du code source (couverture de tests, dette technique, documentation, CI/CD), évaluation de l\'architecture technique (scalabilité, dépendances tierces, infrastructure cloud), et score d\'obsolescence technologique. Durée : 5–8 jours. Outils : SonarQube, OWASP ASVS, analyse manuelle par des ingénieurs seniors.', en: 'C dimension — Code: source code quality audit (test coverage, technical debt, documentation, CI/CD), technical architecture evaluation (scalability, third-party dependencies, cloud infrastructure), and technology obsolescence score. Duration: 5–8 days. Tools: SonarQube, OWASP ASVS, manual analysis by senior engineers.' },
        { fr: 'Dimension I — IP (Propriété Intellectuelle) : vérification de la propriété du code (contrats prestataires freelance, CDI développeurs), audit des marques déposées (INPI, EUIPO, USPTO selon périmètre géographique), licences open source utilisées et leur compatibilité avec une cession commerciale, protection des données clients.', en: 'I dimension — IP (Intellectual Property): code ownership verification (freelancer contractor agreements, developer employment contracts), registered trademark audit (INPI, EUIPO, USPTO depending on geographic scope), open source licences used and their compatibility with a commercial sale, client data protection.' },
        { fr: 'Dimension F — Finance : audit de l\'ARR (réconciliation avec les données bancaires et de facturation mois par mois), calcul du NRR et GRR réels, retraitement de l\'EBITDA ajusté (normalisation des charges fondateur non-marché), analyse de la concentration client, validation du bridge MRR sur 24 mois.', en: 'F dimension — Finance: ARR audit (reconciliation with banking and invoicing data month by month), calculation of actual NRR and GRR, restatement of adjusted EBITDA (normalisation of below-market founder charges), client concentration analysis, validation of MRR bridge over 24 months.' },
        { fr: 'Dimension S — Sécurité : test de pénétration externe (OWASP Top 10), revue de la politique de sécurité des accès (IAM, MFA, secrets management), conformité RGPD (registre de traitements, DPA sous-traitants, politique de confidentialité), et depuis Q1 2026 : conformité AI Act pour les actifs IA.', en: 'S dimension — Security: external penetration test (OWASP Top 10), access security policy review (IAM, MFA, secrets management), GDPR compliance (processing register, sub-processor DPAs, privacy policy), and since Q1 2026: AI Act compliance for AI assets.' },
      ]},
      { type: 'h2', text: { fr: 'Les grades AEGRYN et leur impact sur la valorisation', en: 'AEGRYN grades and their impact on valuation' } },
      { type: 'list', items: [
        { fr: 'Grade A+ (Score global ≥ 90/100) : actif sans risques matériels identifiés dans les 4 dimensions. Prime de multiple documentée : +35–45% vs actif non certifié comparable. Accès au deal flow acquéreurs premium (fonds PE Tier 1, family offices institutionnels).', en: 'Grade A+ (Overall score ≥ 90/100): asset without material risks identified across 4 dimensions. Documented multiple premium: +35–45% vs comparable uncertified asset. Access to premium acquirer deal flow (Tier 1 PE funds, institutional family offices).' },
        { fr: 'Grade A (Score 75–89/100) : actif avec risques mineurs identifiés et plan de remédiation documenté. Prime de multiple : +20–30%. Accès à l\'ensemble du deal flow AEGRYN.', en: 'Grade A (Score 75–89/100): asset with minor risks identified and documented remediation plan. Multiple premium: +20–30%. Access to all AEGRYN deal flow.' },
        { fr: 'Grade B (Score 55–74/100) : actif avec risques modérés. Accès au deal flow standard. Multiple prime limité (+5–15%). Recommandation : plan de remédiation pour atteindre Grade A avant mise en vente.', en: 'Grade B (Score 55–74/100): asset with moderate risks. Access to standard deal flow. Limited multiple premium (+5–15%). Recommendation: remediation plan to reach Grade A before sale.' },
        { fr: 'Grade C ou inférieur (Score < 55/100) : risques significatifs dans une ou plusieurs dimensions. AEGRYN recommande de ne pas mettre en vente avant remédiation. Durée typique de remédiation : 3–6 mois selon les dimensions concernées.', en: 'Grade C or below (Score < 55/100): significant risks in one or more dimensions. AEGRYN recommends not putting on sale before remediation. Typical remediation duration: 3–6 months depending on the dimensions concerned.' },
      ]},
      { type: 'stats', items: [
        { value: '+35%',  label: { fr: 'Prime de prix médiane actifs certifiés Grade A+ (AEGRYN data 2025)', en: 'Median price premium certified Grade A+ assets (AEGRYN data 2025)' } },
        { value: '3×',    label: { fr: 'Rapidité de cession actifs certifiés vs non certifiés', en: 'Sale speed certified vs uncertified assets' } },
        { value: '4',     label: { fr: 'Dimensions auditées : Code, IP, Finance, Sécurité', en: 'Dimensions audited: Code, IP, Finance, Security' } },
        { value: '3–6 s', label: { fr: 'Semaines pour compléter le protocole Grade complet', en: 'Weeks to complete the full Grade protocol' } },
      ]},
    ],
    faq: [
      {
        q: { fr: 'La certification AEGRYN est-elle reconnue par les acquéreurs institutionnels ?', en: 'Is AEGRYN certification recognised by institutional acquirers?' },
        a: { fr: 'Oui — les fonds PE enregistrés dans le réseau AEGRYN (Hg Capital, FLEX Capital, et d\'autres fonds partenaires) reconnaissent le protocole Grade comme substitut partiel à leur due diligence interne. Cela ne remplace pas la due diligence de l\'acquéreur, mais elle réduit le nombre d\'aller-retours, accélère le processus, et réduit les probabilités de retarification late-stage. Les family offices AEGRYN utilisent le rapport Grade comme base de leurs décisions d\'investissement initial.', en: 'Yes — PE funds registered in the AEGRYN network (Hg Capital, FLEX Capital, and other partner funds) recognise the Grade protocol as a partial substitute for their internal due diligence. This does not replace the acquirer\'s due diligence, but it reduces the number of back-and-forths, accelerates the process, and reduces the probability of late-stage repricing. AEGRYN family offices use the Grade report as the basis for their initial investment decisions.' },
      },
    ],
  },

  {
    slug:     'etude-de-cas-certification-saas-b2b-exit-4x',
    category: 'case_study',
    date:     '2026-07-10',
    readMin:  8,
    featured: false,
    title: {
      fr: 'Étude de cas : comment la certification AEGRYN a permis un exit à 4,8x ARR pour un SaaS B2B',
      en: 'Case study: how AEGRYN certification enabled a 4.8x ARR exit for a B2B SaaS',
    },
    excerpt: {
      fr: 'Un fondateur de SaaS RH bootstrapped (ARR 2,1M€) passait à 3x avant certification. Après protocole Grade A, il a closé à 4,8x ARR en 11 semaines. Déconstruction du processus, des résultats et des décisions clés.',
      en: 'A bootstrapped HR SaaS founder (ARR €2.1M) was at 3x before certification. After Grade A protocol, he closed at 4.8x ARR in 11 weeks. Deconstruction of the process, results and key decisions.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Note : Cette étude de cas est basée sur un processus réel anonymisé. Les données ont été modifiées pour préserver la confidentialité des parties. Les ordres de grandeur et les mécanismes décrits sont représentatifs des processus AEGRYN.',
        en: 'Note: This case study is based on an anonymised real process. Data has been modified to preserve the confidentiality of parties. The magnitudes and mechanisms described are representative of AEGRYN processes.',
      }},
      { type: 'h2', text: { fr: 'Situation initiale', en: 'Initial situation' } },
      { type: 'p', text: {
        fr: 'Un fondateur français, 41 ans, avait construit un SaaS RH B2B (gestion des entretiens annuels et objectifs OKR) depuis 2018. ARR = 2,1M€ en janvier 2025, EBITDA ajusté positif à 28%, NRR = 104%, taux de churn mensuel = 0,7%. Il avait reçu deux offres non sollicitées à respectivement 3,2x et 3,5x ARR (6,7M€ et 7,35M€). Il estimait que son actif valait plus — mais il ne disposait pas de documentation pour défendre cette position.',
        en: 'A French founder, 41 years old, had built a B2B HR SaaS (annual review and OKR objectives management) since 2018. ARR = €2.1M in January 2025, adjusted EBITDA positive at 28%, NRR = 104%, monthly churn rate = 0.7%. He had received two unsolicited offers at respectively 3.2x and 3.5x ARR (€6.7M and €7.35M). He believed his asset was worth more — but he did not have documentation to defend this position.',
      }},
      { type: 'h2', text: { fr: 'Protocole Grade : résultats par dimension', en: 'Grade protocol: results by dimension' } },
      { type: 'list', items: [
        { fr: 'Dimension C (Code) — Score 82/100 : architecture solide (React/Node.js sur AWS), couverture de tests à 67% (légèrement sous le benchmark de 70%), documentation technique complète. Point d\'amélioration identifié : 3 dépendances npm avec vulnérabilités CVE connues. Remédiation : 2 semaines.', en: 'C dimension (Code) — Score 82/100: solid architecture (React/Node.js on AWS), test coverage at 67% (slightly below the 70% benchmark), complete technical documentation. Improvement point identified: 3 npm dependencies with known CVE vulnerabilities. Remediation: 2 weeks.' },
        { fr: 'Dimension I (IP) — Score 91/100 : propriété du code confirmée (contrats prestataires avec clause de cession de droits signés), marque déposée INPI (France + EUIPO). Point mineur : 1 contrat développeur sans clause de non-concurrence. Remédiation : avenant signé en 1 semaine.', en: 'I dimension (IP) — Score 91/100: code ownership confirmed (contractor agreements with IP assignment clause signed), trademark registered INPI (France + EUIPO). Minor point: 1 developer contract without non-compete clause. Remediation: amendment signed in 1 week.' },
        { fr: 'Dimension F (Finance) — Score 88/100 : ARR audité confirmé à 2,08M€ (vs 2,1M€ présenté — écart de ~1%, normal). NRR réel = 106% (supérieur à l\'estimation fondateur). EBITDA ajusté confirmé à 26% (légèrement inférieur après retraitement salaire fondateur). Point d\'attention : 1 client représentant 22% de l\'ARR — au-dessus du seuil de concentration recommandé de 20%.', en: 'F dimension (Finance) — Score 88/100: audited ARR confirmed at €2.08M (vs €2.1M presented — ~1% gap, normal). Actual NRR = 106% (above founder estimate). Adjusted EBITDA confirmed at 26% (slightly lower after founder salary restatement). Attention point: 1 client representing 22% of ARR — above the recommended 20% concentration threshold.' },
        { fr: 'Dimension S (Sécurité) — Score 79/100 : pentest réalisé (aucune vulnérabilité critique). MFA activé sur tous les accès admin. RGPD : registre des traitements présent et à jour, DPA signés avec AWS et Stripe. Point d\'amélioration : politique de gestion des secrets (API keys stockées en variables d\'environnement non chiffrées). Remédiation : migration vers AWS Secrets Manager (3 jours).', en: 'S dimension (Security) — Score 79/100: pentest completed (no critical vulnerabilities). MFA enabled on all admin accesses. GDPR: processing register present and current, DPAs signed with AWS and Stripe. Improvement point: secrets management policy (API keys stored in unencrypted environment variables). Remediation: migration to AWS Secrets Manager (3 days).' },
      ]},
      { type: 'h2', text: { fr: 'Résultat : Grade A (Score global 85/100)', en: 'Result: Grade A (Overall score 85/100)' } },
      { type: 'p', text: {
        fr: 'Après 4 semaines de remédiation (pilotées par AEGRYN), l\'actif a obtenu le Grade A avec un score global de 85/100. Le rapport Grade a été présenté à 8 acquéreurs qualifiés du réseau AEGRYN. 4 ont manifesté un intérêt, 2 ont soumis des LOI. La meilleure offre : 10,1M€ (4,86x l\'ARR audité de 2,08M€), structure cash 90% + earnout 10% sur 12 mois. Le deal a closé en 11 semaines depuis la première LOI reçue.',
        en: 'After 4 weeks of remediation (managed by AEGRYN), the asset obtained Grade A with an overall score of 85/100. The Grade report was presented to 8 qualified acquirers in the AEGRYN network. 4 expressed interest, 2 submitted LOIs. The best offer: €10.1M (4.86x audited ARR of €2.08M), 90% cash + 10% earnout over 12 months structure. The deal closed in 11 weeks from the first LOI received.',
      }},
      { type: 'stats', items: [
        { value: '3,5x', label: { fr: 'Multiple maximal avant certification (offres non sollicitées)', en: 'Maximum multiple before certification (unsolicited offers)' } },
        { value: '4,86x', label: { fr: 'Multiple obtenu post-certification Grade A', en: 'Multiple obtained post Grade A certification' } },
        { value: '+39%',  label: { fr: 'Uplift de valorisation grâce au processus Grade', en: 'Valuation uplift through Grade process' } },
        { value: '11 s',  label: { fr: 'Semaines de la première LOI au closing', en: 'Weeks from first LOI to closing' } },
      ]},
    ],
    faq: [
      {
        q: { fr: 'Quel est le coût d\'un protocole AEGRYN Grade ?', en: 'What is the cost of an AEGRYN Grade protocol?' },
        a: { fr: 'Le protocole Grade complet (4 dimensions) représente un investissement typique de 15 000€ à 35 000€ selon la taille de l\'actif (ARR, nombre d\'utilisateurs, complexité technique). Pour un actif avec ARR entre 1M€ et 5M€, l\'uplift de valorisation obtenu est typiquement 5–15× le coût de la certification. C\'est l\'investissement pré-cession avec le meilleur retour documenté dans notre base de données.', en: 'The complete Grade protocol (4 dimensions) represents a typical investment of €15,000 to €35,000 depending on asset size (ARR, number of users, technical complexity). For an asset with ARR between €1M and €5M, the valuation uplift obtained is typically 5–15× the cost of certification. It is the pre-sale investment with the best documented return in our database.' },
      },
    ],
  },

  /* ── CLUSTER 4 — LEGAL & FISCAL ─────────────────────────────────────── */

  {
    slug:     'share-deal-asset-deal-saas-quelle-structure',
    category: 'legal',
    date:     '2026-06-25',
    readMin:  9,
    featured: false,
    title: {
      fr: 'Share deal vs asset deal dans une cession SaaS : quelle structure choisir et pourquoi',
      en: 'Share deal vs asset deal in a SaaS sale: which structure to choose and why',
    },
    excerpt: {
      fr: 'Le choix entre share deal et asset deal impacte directement la fiscalité du vendeur, la protection de l\'acquéreur et la complexité juridique. Guide complet avec cas pratiques.',
      en: 'The choice between share deal and asset deal directly impacts seller taxation, acquirer protection and legal complexity. Complete guide with case studies.',
    },
    body: [
      { type: 'p', text: {
        fr: 'La structure juridique d\'une cession — share deal (cession de titres) ou asset deal (cession d\'actifs) — est l\'une des décisions les plus importantes du processus M&A. Le choix impacte la fiscalité du vendeur, la protection de l\'acquéreur contre les passifs cachés, et la complexité de la transaction.',
        en: 'The legal structure of a sale — share deal (securities disposal) or asset deal (asset disposal) — is one of the most important M&A process decisions. The choice impacts seller taxation, acquirer protection against hidden liabilities, and transaction complexity.',
      }},
      { type: 'h2', text: { fr: 'Share deal : cession des titres', en: 'Share deal: disposal of securities' } },
      { type: 'p', text: {
        fr: 'L\'acquéreur achète les actions de la société qui détient le SaaS — avec tous ses actifs ET tous ses passifs. Structure la plus courante en Europe (> 70% des transactions SaaS mid-market, Hampleton Partners). Avantage vendeur : fiscalité plus-value sur titres (PFU 30% en France, 0% en Suisse). Les contrats clients sont transférés automatiquement.',
        en: 'The acquirer buys the shares of the company holding the SaaS — with all its assets AND all its liabilities. Most common structure in Europe (> 70% of mid-market SaaS transactions, Hampleton Partners). Seller advantage: securities capital gains taxation (PFU 30% in France, 0% in Switzerland). Client contracts transfer automatically.',
      }},
      { type: 'h2', text: { fr: 'Asset deal : cession des actifs uniquement', en: 'Asset deal: disposal of assets only' } },
      { type: 'p', text: {
        fr: 'L\'acquéreur achète une liste d\'actifs identifiés (code, marques, contrats, base de données). La société vendeuse conserve ses passifs. Avantage acquéreur : protection totale contre passifs cachés, amortissement fiscal des actifs acquis. Inconvénient vendeur : plus-value imposée à l\'IS au niveau société + transfert contrat par contrat nécessitant l\'accord de chaque client.',
        en: 'The acquirer buys an identified list of assets (code, trademarks, contracts, database). The selling company retains its liabilities. Acquirer advantage: total protection against hidden liabilities, fiscal depreciation of acquired assets. Seller disadvantage: capital gain taxed at corporate rate + contract-by-contract transfer requiring each client\'s consent.',
      }},
      { type: 'list', items: [
        { fr: 'Fiscalité vendeur : Share = PFU 30% FR / 0% CH | Asset = IS sur PV société + double imposition potentielle à la distribution.', en: 'Seller taxation: Share = PFU 30% FR / 0% CH | Asset = CIT on gain at company level + potential double taxation on distribution.' },
        { fr: 'Protection acquéreur : Share = risque passif caché (couvert via GAP/W&I) | Asset = passifs restent dans la société vendeuse, protection maximale.', en: 'Acquirer protection: Share = hidden liability risk (covered via W&I) | Asset = liabilities remain in selling company, maximum protection.' },
        { fr: 'Transfert contrats : Share = automatique | Asset = accord écrit requis de chaque client et prestataire.', en: 'Contract transfer: Share = automatic | Asset = written consent required from each client and provider.' },
      ]},
      { type: 'p', text: {
        fr: 'L\'asset deal est choisi par l\'acquéreur quand les passifs cachés sont significatifs (contentieux, dettes fiscales potentielles) ou quand le pacte d\'actionnaires est complexe. Pour le vendeur, accepter un asset deal implique de négocier une prime de structure pour compenser la fiscalité moins favorable.',
        en: 'The asset deal is chosen by the acquirer when hidden liabilities are significant (litigation, potential tax debts) or when the shareholder agreement is complex. For the seller, accepting an asset deal implies negotiating a structure premium to compensate for less favourable taxation.',
      }},
      { type: 'stats', items: [
        { value: '> 70%', label: { fr: 'Part du share deal dans les cessions SaaS EU (Hampleton 2025)', en: 'Share deal proportion in EU SaaS sales (Hampleton 2025)' } },
        { value: '30%',   label: { fr: 'PFU France sur plus-value titres', en: 'French PFU on securities capital gains' } },
        { value: '0%',    label: { fr: 'Impôt fédéral Suisse sur plus-value (PP)', en: 'Swiss federal tax on capital gains (individuals)' } },
        { value: '+15%',  label: { fr: 'Prime de structure négociable en asset deal', en: 'Negotiable structure premium in asset deal' } },
      ]},
    ],
  },

  {
    slug:     'rgpd-cession-transfert-donnees-utilisateurs',
    category: 'legal',
    date:     '2026-06-10',
    readMin:  8,
    featured: false,
    title: {
      fr: 'RGPD et cession d\'entreprise : comment gérer le transfert des données utilisateurs',
      en: 'GDPR and business disposal: how to manage the transfer of user data',
    },
    excerpt: {
      fr: 'Une cession SaaS implique un transfert de données personnelles à un tiers. Le RGPD encadre strictement ce transfert — les erreurs peuvent bloquer un deal ou exposer l\'acquéreur à des sanctions CNIL.',
      en: 'A SaaS sale involves transferring personal data to a third party. GDPR strictly governs this transfer — mistakes can block a deal or expose the acquirer to CNIL sanctions.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Le RGPD (Règlement UE 2016/679) encadre strictement les transferts de données en M&A. Les erreurs peuvent bloquer un deal en due diligence, exposer l\'acquéreur à des sanctions (CNIL France, DSB Autriche, FDPIC Suisse), ou déclencher des procédures collectives d\'utilisateurs.',
        en: 'GDPR (EU Regulation 2016/679) strictly governs data transfers in M&A. Mistakes can block a deal in due diligence, expose the acquirer to sanctions (CNIL France, DSB Austria, FDPIC Switzerland), or trigger collective user proceedings.',
      }},
      { type: 'h2', text: { fr: 'Share deal vs asset deal : impact RGPD', en: 'Share deal vs asset deal: GDPR impact' } },
      { type: 'p', text: {
        fr: 'Dans un share deal, la société reste la même — il n\'y a pas techniquement de "nouveau responsable de traitement". Scénario le plus simple du point de vue RGPD. Dans un asset deal, il y a un changement de responsable, ce qui peut nécessiter une information préalable des utilisateurs (Article 14 RGPD). La base légale la plus souvent invoquée est l\'intérêt légitime (Art. 6.1.f), documenté via un Legitimate Interest Assessment (LIA).',
        en: 'In a share deal, the company remains the same — there is technically no "new data controller". Simplest GDPR scenario. In an asset deal, there is a controller change, which may require prior notification to users (Article 14 GDPR). The most commonly invoked legal basis is legitimate interest (Art. 6.1.f), documented via a Legitimate Interest Assessment (LIA).',
      }},
      { type: 'h2', text: { fr: 'Due diligence RGPD : checklist acquéreur', en: 'GDPR due diligence: acquirer checklist' } },
      { type: 'list', items: [
        { fr: 'Registre des traitements (Art. 30) : liste traitements, bases légales, durées de conservation, sous-traitants. Son absence = signal d\'alarme majeur.', en: 'Processing register (Art. 30): lists processing, legal bases, retention periods, sub-processors. Its absence = major red flag.' },
        { fr: 'DPA avec tous les sous-traitants (AWS, Stripe, Intercom, Mixpanel…) : à jour et conformes post-Schrems II (transferts hors UE).', en: 'DPA with all sub-processors (AWS, Stripe, Intercom, Mixpanel…): current and compliant post-Schrems II (transfers outside EU).' },
        { fr: 'Politique de confidentialité conforme RGPD (droit effacement, portabilité, opposition) : une politique de 2018 non mise à jour ne passe plus en due diligence 2026.', en: 'GDPR-compliant privacy policy (right to erasure, portability, opposition): a 2018 policy not updated no longer passes 2026 due diligence.' },
        { fr: 'Incidents de sécurité 36 derniers mois (Art. 33) : un incident non notifié à l\'autorité dans les 72h représente un risque légal résiduel à mettre en séquestre.', en: 'Security incidents last 36 months (Art. 33): an incident not notified to authority within 72h represents a residual legal risk to be placed in escrow.' },
      ]},
      { type: 'stats', items: [
        { value: '72h',    label: { fr: 'Délai notification incident sécurité (Art. 33 RGPD)', en: 'Security incident notification delay (Art. 33 GDPR)' } },
        { value: '4%',     label: { fr: 'Amende RGPD maximale (% CA mondial annuel)', en: 'Maximum GDPR fine (% annual worldwide turnover)' } },
        { value: 'Art.30', label: { fr: 'Registre des traitements — document clé due diligence', en: 'Processing register — key due diligence document' } },
        { value: 'DPA',    label: { fr: 'À vérifier pour chaque sous-traitant (AWS, Stripe…)', en: 'To check for each sub-processor (AWS, Stripe…)' } },
      ]},
    ],
  },

  {
    slug:     'fiscalite-exit-fondateur-france-suisse-luxembourg',
    category: 'legal',
    date:     '2026-06-05',
    readMin:  11,
    featured: false,
    title: {
      fr: 'Fiscalité de l\'exit pour un fondateur tech : France, Suisse et Luxembourg comparés',
      en: 'Exit taxation for a tech founder: France, Switzerland and Luxembourg compared',
    },
    excerpt: {
      fr: 'Un exit de 5M€ peut rapporter 3,5M€ net en France ou 4,9M€ net en Suisse — 1,4M€ d\'écart sur la même transaction. Comparaison factuelle des régimes 2026. Information à titre indicatif — consulter un fiscaliste.',
      en: 'A €5M exit can yield €3.5M net in France or €4.9M net in Switzerland — €1.4M gap on the same transaction. Factual 2026 regime comparison. For informational purposes — consult a tax advisor.',
    },
    body: [
      { type: 'p', text: {
        fr: 'Avertissement : cet article est à titre exclusivement informatif et éducatif. Il ne constitue pas un conseil fiscal. Consultez un fiscaliste spécialisé en M&A avant toute décision. Les chiffres correspondent aux régimes en vigueur en 2026 selon les informations publiques disponibles.',
        en: 'Warning: this article is for exclusively informational and educational purposes. It does not constitute tax advice. Consult an M&A specialist tax advisor before any decision. Figures correspond to regimes in force in 2026 per available public information.',
      }},
      { type: 'h2', text: { fr: 'France — PFU 30%', en: 'France — PFU 30%' } },
      { type: 'p', text: {
        fr: 'Fondateur 100% des parts, prix de cession 5 000 000€, plus-value = ~4 999 000€. Régime PFU : 12,8% IR + 17,2% prélèvements sociaux = 30%. Impôt : ~1 500 000€. Net reçu : ~3 500 000€. Mécanisme apport-cession (Art. 150-0 B ter CGI) : permet de différer l\'imposition sous conditions de réinvestissement de 60% dans des actifs économiques dans les 2 ans. Complexe — requiert un avocat fiscaliste.',
        en: 'Founder 100% of shares, disposal price €5,000,000, capital gain = ~€4,999,000. PFU regime: 12.8% income tax + 17.2% social charges = 30%. Tax: ~€1,500,000. Net received: ~€3,500,000. Contribution-sale mechanism (Art. 150-0 B ter CGI): allows deferring taxation under conditions of 60% reinvestment in economic assets within 2 years. Complex — requires a tax lawyer.',
      }},
      { type: 'h2', text: { fr: 'Suisse — 0% fédéral', en: 'Switzerland — 0% federal' } },
      { type: 'p', text: {
        fr: 'Fondateur résident (canton Zoug ou Zurich), parts dans une SÀRL suisse. Plus-values sur cession de participations exonérées d\'impôt fédéral direct (sous condition que la participation ne soit pas "fortune commerciale"). Seul l\'impôt sur la fortune cantonal (~0,1–0,3%/an du patrimoine) s\'applique sur le patrimoine constitué. Net approximatif sur exit 5M€ : ~4 900 000€. Écart vs France : +1 400 000€.',
        en: 'Founder resident (canton of Zug or Zurich), shares in a Swiss LLC. Capital gains on disposal of shareholdings exempt from federal direct tax (provided shareholding is not "commercial assets"). Only cantonal wealth tax (~0.1–0.3%/year of assets) applies on the resulting wealth. Approximate net on €5M exit: ~€4,900,000. Gap vs France: +€1,400,000.',
      }},
      { type: 'h2', text: { fr: 'Luxembourg — Participation exempt', en: 'Luxembourg — Participation exemption' } },
      { type: 'p', text: {
        fr: 'Holding luxembourgeoise détenant ≥ 10% d\'une filiale (ou valeur acquisition ≥ 1,2M€) depuis ≥ 12 mois : exonération 100% des plus-values de cession (sous conditions). Taux effectif < 2% dans les structures optimisées. Attention : exit tax française (Art. 167 bis CGI) — un transfert de résidence juste avant la cession peut être requalifié par la DGFiP.',
        en: 'Luxembourg holding with ≥ 10% shareholding (or acquisition value ≥ €1.2M) held for ≥ 12 months: 100% exemption on disposal capital gains (under conditions). Effective rate < 2% in optimised structures. Caution: French exit tax (Art. 167 bis CGI) — a residence transfer just before disposal can be requalified by the DGFiP.',
      }},
      { type: 'stats', items: [
        { value: '30%',  label: { fr: 'Taux effectif exit France (PFU, 2026)', en: 'Effective exit rate France (PFU, 2026)' } },
        { value: '~0%',  label: { fr: 'Taux fédéral exit Suisse (personnes physiques)', en: 'Swiss federal exit rate (individuals)' } },
        { value: '< 2%', label: { fr: 'Taux effectif holding Luxembourg (participation exempt)', en: 'Effective rate Luxembourg holding (participation exempt)' } },
        { value: '1,4M', label: { fr: 'Écart net France vs Suisse sur exit 5M€', en: 'Net gap France vs Switzerland on €5M exit' } },
      ]},
    ],
  },

]

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { fr: string; en: string }> = {
  market:        { fr: 'Rapport marché',   en: 'Market report'   },
  seller:        { fr: 'Guide vendeur',    en: 'Seller guide'    },
  buyer:         { fr: 'Guide acquéreur',  en: 'Buyer guide'     },
  certification: { fr: 'Certification',   en: 'Certification'   },
  strategy:      { fr: 'Stratégie',        en: 'Strategy'        },
  case_study:    { fr: 'Étude de cas',     en: 'Case Study'      },
  legal:         { fr: 'Legal & Fiscal',   en: 'Legal & Tax'     },
  vertical:      { fr: 'Verticaux',        en: 'Verticals'       },
  dach:          { fr: 'Marché DACH',      en: 'DACH Market'     },
}
