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
    featured: false,
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
        fr: 'Antiquorum fait la même chose pour les montres de collection. Chaque lot reçoit un grade multi-dimensionnel co-signé par des experts engageant leur réputation. Ce n\'est pas une note — c\'est une certification. La différence est fondamentale : une note est une opinion, une certification est une responsabilité.',
        en: 'Antiquorum does the same for collectible watches. Each lot receives a multidimensional grade co-signed by experts staking their reputation. It is not a rating — it is a certification. The difference is fundamental: a rating is an opinion, a certification is a responsibility.',
      }},
      { type: 'h2', text: { fr: 'La thèse AEGRYN', en: 'The AEGRYN thesis' } },
      { type: 'p', text: {
        fr: 'Un actif tech mérite le même traitement qu\'une Rolex Daytona de 1963 ou qu\'un Picasso de la période bleue. Il a une provenance (son historique de build), un état (son grade C/I/F/S), une authenticité (sa certification blockchain), et une valeur de marché (son multiple ARR ajusté).',
        en: 'A tech asset deserves the same treatment as a 1963 Rolex Daytona or a Picasso from the Blue Period. It has a provenance (its build history), a condition (its C/I/F/S grade), an authenticity (its blockchain certification), and a market value (its adjusted ARR multiple).',
      }},
      { type: 'list', items: [
        { fr: 'La certification remplace l\'estimation — chaque actif reçoit un grade AEG ★/AAA/AA/A/B co-signé par des experts indépendants', en: 'Certification replaces estimation — each asset receives an AEG ★/AAA/AA/A/B grade co-signed by independent experts' },
        { fr: 'Le cercle fermé remplace la marketplace — les acquéreurs sont pré-qualifiés avant d\'accéder au moindre dossier', en: 'The closed circle replaces the marketplace — acquirers are pre-qualified before accessing any file' },
        { fr: 'Le séquestre remplace la promesse verbale — 10% du prix de transaction est versé à la signature de la Promesse de Transaction', en: 'Escrow replaces the verbal promise — 10% of the transaction price is paid upon signing the Transaction Promise' },
        { fr: 'La blockchain remplace la confiance aveugle — l\'empreinte exacte du code est certifiée au jour du transfert', en: 'Blockchain replaces blind trust — the exact code fingerprint is certified on the day of transfer' },
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
    featured: false,
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
    featured: false,
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
        { fr: 'Grade AEG — Opinion globale co-signée des experts AEGRYN sur un actif tech. De ★ (Exceptionnel) à B (Correct). Non attribué = Refusé.', en: 'AEG Grade — Overall co-signed expert opinion from AEGRYN on a tech asset. From ★ (Exceptional) to B (Standard). Not assigned = Refused.' },
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
]

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { fr: string; en: string }> = {
  market:        { fr: 'Rapport marché',   en: 'Market report'   },
  seller:        { fr: 'Guide vendeur',    en: 'Seller guide'    },
  buyer:         { fr: 'Guide acquéreur',  en: 'Buyer guide'     },
  certification: { fr: 'Certification',   en: 'Certification'   },
  strategy:      { fr: 'Stratégie',        en: 'Strategy'        },
}
