import type { AdvisoryPageContent, AdvisoryKey } from './types'

/** English content of the five ACCOMPAGNER pages, translated from fr.ts (reference). */

const PRIVACY =
  'Your answers stay in your browser. Nothing is stored or sent without your consent. The result fits on one page: your level and the recommended next step.'

const S = '/images/advisory/situations/'

export const ADVISORY_EN: Record<AdvisoryKey, AdvisoryPageContent> = {

  strategy: {
    key: 'strategy', path: '/advisory/strategy',
    image: '/images/advisory/strategy-towers.webp',
    imageAlt: 'Office towers seen from below, direction and height of view',
    meta: {
      title: 'Strategy consulting for SMEs and mid-caps | Aegryn',
      description: 'Direction, business model, external growth, new markets: Aegryn helps leaders of organisations between 10 and 300 M€ to decide, quantify and hold their strategic choices. Switzerland and Europe.',
      keywords: ['SME strategy consulting', 'mid-cap strategy consulting', 'three-year plan', 'external growth', 'market entry', 'strategy advisory Switzerland'],
    },
    eyebrow: 'Business Strategy & Innovation',
    h1: 'Choose the right direction, in the right order, with the means you actually have.',
    subtitle: 'For the leader of a 10 to 300 M€ organisation, strategy is not a planning exercise: it is a set of trade-offs under constraints of capital, management time and execution capacity. Aegryn helps you frame them, quantify them and hold them.',
    scope: [
      { label: 'Leadership team: Talent & Organisation', href: '/advisory/talent-organization' },
      { label: 'Executing an acquisition: M&A', href: '/advisory/ma' },
      { label: 'Architecture choices: Technology', href: '/advisory/technology' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '≈ 9,000', label: 'Bpifrance consulting missions in 2024, up 50% in one year', source: 'Bpifrance Press, 2025' },
        { value: '−2%', label: 'French consulting market in 2025, excluding inflation', source: 'Syntec Conseil' },
        { value: '−7.3', label: 'index points, NZZ SME barometer 2026, lowest level since the survey began in 2021', source: 'NZZ-KMU-Barometer 2026, Kalaidos University of Applied Sciences' },
      ],
      paragraphs: [
        'SME and mid-cap leaders do buy consulting, but differently. Bpifrance delivered close to 9,000 consulting missions in 2024, up 50% in one year, while the French consulting market declined by 2% in 2025 excluding inflation. In Switzerland, the composite index of the 2026 NZZ SME barometer (NZZ and Kalaidos University of Applied Sciences) falls to −7.3 points, its lowest level since the survey began in 2021; only technology integration is improving.',
      ],
      change: 'When conditions tighten, the cost of a wrong call rises. The need is no longer a large programme; it is one precise decision, taken quickly, with senior eyes on it.',
      sources: 'Sources: Bpifrance Press (2025) · Syntec Conseil · NZZ-KMU-Barometer 2026, Kalaidos University of Applied Sciences (relayed by SECO).',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'A decision your board can defend in front of a banker or a shareholder.',
        'A direction your committee can execute in your absence, without calling you.',
        'A first dated action within thirty days.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'Our model is eroding.', decision: 'Pivot, defend or change segment.', deliverable: 'Position review: unit economics by segment, competition, three costed options.', format: 'Short engagement', cycles: ['croissance', 'restructuration'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'AI is changing our business.', decision: 'Where to integrate it, what not to automate.', deliverable: 'Map of AI use cases by value-chain step, ranked by value created and risk carried.', format: 'A few weeks', cycles: ['croissance'], image: `${S}developer-desk.jpg` },
        { quote: 'A competitor is for sale, or a partner could acquire us.', decision: 'Organic growth, alliance or acquisition.', deliverable: 'External growth thesis, target criteria, go / no-go framework.', format: 'A few weeks', cycles: ['acquisition'], image: `${S}handshake.jpg` },
        { quote: 'We are opening a new market (DACH, Benelux, Southern Europe).', decision: 'Subsidiary, distributor, partner, or wait.', deliverable: 'Country entry plan, with local regulatory requirements and talent needs.', format: 'A few weeks', cycles: ['croissance'], image: `${S}meeting-room.jpg` },
        { quote: 'My board, my bank or my shareholder wants a three-year plan.', decision: 'Which assumptions to own, which to test.', deliverable: 'Defensible plan, explicit sensitivities, ten-page memo for the committee.', format: 'One to two months', cycles: ['lancement', 'croissance'], image: `${S}planning-laptops.jpg` },
        { quote: 'The strategy is in my head.', decision: 'What must exist without you.', deliverable: 'Strategy documented in five priorities, with owners and milestones.', format: 'A few weeks', cycles: ['croissance', 'transmission'], image: `${S}plan-writing.jpg` },
      ],
    },
    services: {
      title: 'Our services',
      items: [
        'Review the strategic position',
        'Decide between options',
        'Build the three-year plan',
        'Prepare the committee (board, bank, shareholder memo)',
        'Frame entry into a new market',
        'Support the board (quarterly advisory)',
      ],
    },
    framework: {
      name: 'The Four-Test Grid',
      intro: 'Every strategic option passes four tests before it is retained.',
      axes: [
        { label: 'Value', desc: 'What does it change to the value of the organisation in three years?' },
        { label: 'Reversibility', desc: 'If it fails, what is the exit cost at twelve months?' },
        { label: 'Capacity', desc: 'Do we have the people, the technology and the capital to execute it, without the CEO working on it full time?' },
        { label: 'Sequence', desc: 'What has to be true first, and what can wait?' },
      ],
      deliverable: 'A one-page decision sheet that scores the options and names the first decision to take within thirty days.',
    },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME · 10 to 50 M€', desc: 'The CEO decides with two or three people, without a strategy function. The constraint is time. We deliver short, without project structure, in a format that fits in ten pages.' },
        { label: 'Mid-cap · 50 to 300 M€', desc: 'Several businesses, an executive committee, sometimes a family shareholder or a fund. The constraint is alignment. We run the arbitration and document the decision for the board.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Disintermediation by new entrants; technology partnerships to arbitrate under DORA and FINMA constraints on critical third parties.' },
        { cluster: 'Health & Life Sciences', desc: 'Moving from public to private, entering a country under a different MDR, HDS or EHDS framework.' },
        { cluster: 'Industry, Energy & Infrastructure', desc: 'Services around the product (predictive maintenance, as-a-service); capturing the value of data or delegating it to an integrator.' },
        { cluster: 'Commerce, Services & Customer Experience', desc: 'Omnichannel, pricing, the place of your own brand against third-party platforms.' },
        { cluster: 'Tech, Innovation & Public Sector', desc: 'Product-led or sales-led model, target customer definition, DACH entry, access to public procurement.' },
      ],
    },
    scenario: {
      tag: 'Typical scenario · illustrative, not drawn from a named engagement',
      text: 'Industrial mid-cap of 120 M€, French-speaking Switzerland and France. The CEO hesitates between acquiring a predictive-maintenance software vendor and building in-house. Within three weeks, the committee holds a decision sheet: three options, total cost over three years, execution risks, reversibility conditions, first decision to take within thirty days.',
    },
    ai: {
      title: 'What an AI tool will not do for you',
      text: 'An assistant structures your options. It knows neither your shareholders, nor your team, nor what your banker will accept. It does not answer for the decision. Aegryn challenges your assumptions, takes a position and comes back a few months later to measure the gap.',
    },
    diagnostic: {
      title: 'Where do you stand? Five questions.',
      intro: 'Answer yes or no. The result places you on one of three levels and names the next step.',
      questions: [
        { q: 'Can you write your strategy on one page, and are your five priorities known to the management committee?' },
        { q: 'Does each priority have an owner, a milestone and an indicator?' },
        { q: 'Have you costed at least two alternatives to your current direction?' },
        { q: 'Do you know which decisions are reversible within twelve months and which are not?' },
        { q: 'Has an outside view challenged your key assumptions in the last twelve months?' },
      ],
      levels: [
        { min: 0, label: 'To be framed', desc: 'The strategy exists, but mostly in the CEO’s head. Options have not been costed or challenged.', nextAction: 'Put your main decision on one sheet: options, exit cost, first action within thirty days.' },
        { min: 3, label: 'Under construction', desc: 'Priorities are known and tracked. What is missing is the test: costed alternatives, reversibility, outside view.', nextAction: 'Run your current direction through the Four-Test Grid, with a senior challenger.' },
        { min: 5, label: 'Mastered', desc: 'Strategy written, steered, tested. The topic becomes rhythm: quarterly review and committee preparation.', nextAction: 'Set up a quarterly advisory to hold the trajectory and prepare the next trade-offs.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectives',
      items: [
        { title: 'European tech M&A market, mid-2026', href: '/blog/marche-ma-tech-europe-q3-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 01 · Built to Last', href: '/magazine/issue-01', kind: 'magazine' },
      ],
    },
    cta: { metier: 'strategie' },
  },

  riskCompliance: {
    key: 'riskCompliance', path: '/advisory/risk-compliance',
    image: '/images/advisory/risk-compliance.webp',
    imageAlt: 'Review of contractual and regulatory documents',
    meta: {
      title: 'Regulatory compliance for SMEs and mid-caps: NIS2, DORA, AI Act, FADP | Aegryn',
      description: 'Which obligations apply to you, which ones your customers will impose, which can wait. Mapping, defensible evidence, incident management. France, Switzerland, EU.',
      keywords: ['NIS2 SME', 'DORA compliance', 'AI Act obligations', 'FADP GDPR Switzerland', 'regulatory mapping', 'cyber incident management', 'NCSC 24-hour reporting'],
    },
    eyebrow: 'Risk & Compliance',
    h1: 'Know what binds you today, what your customers will impose tomorrow, and what can wait.',
    subtitle: 'NIS2 not yet transposed in France, a distinct Swiss regime, an AI Act with redrawn deadlines, customers already demanding evidence. Compliance is no longer a matter for lawyers: it is a management trade-off.',
    scope: [
      { label: 'Architecture and hosting: Technology', href: '/advisory/technology' },
      { label: 'Compliance of a target: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '≈ 15,000', label: 'entities expected within the NIS2 scope in France, against a few hundred today', source: 'European Commission; estimate' },
        { value: '24 h', label: 'deadline to report a cyberattack to the Swiss NCSC for critical infrastructure, since 1 April 2025', source: 'NCSC, ncsc.admin.ch' },
        { value: '35 M€ · 7%', label: 'AI Act fine ceiling for prohibited practices; 15 M€ or 3% for most other obligations', source: 'Regulation (EU) 2024/1689, art. 99' },
      ],
      paragraphs: [
        'France. NIS2 is set to raise the number of regulated entities from a few hundred to around 15,000, across 18 sectors, from 50 employees or 10 M€. The transposition law has not been passed; the Commission referred France to the Court of Justice on 8 July 2026. Waiting for the law is a bet, not a plan.',
        'Switzerland. NIS2 does not apply directly. Since 1 April 2025, operators of critical infrastructure must report any cyberattack to the NCSC within 24 hours, with a fine of up to CHF 100,000 since 1 October 2025. Six months after entry into force, 164 reports had been recorded. Outside critical infrastructure there is no legal obligation, but your EU customers may impose one by contract.',
        'AI. Article 50 of the AI Act has applied since 2 August 2026. The high-risk obligations of Annex III are postponed to 2 December 2027 by Regulation (EU) 2026/1744. Fines reach 35 M€ or 7% of worldwide turnover for prohibited practices, 15 M€ or 3% for most other obligations.',
      ],
      change: 'Three calendars, three jurisdictions. The right question is not “are we compliant?” but “what are we bound to, towards whom, by when?”.',
      sources: 'Sources: Directive (EU) 2022/2555 · European Commission · NCSC, press release of 29.09.2025 · Regulations (EU) 2024/1689 and 2026/1744.',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'A clear view of what applies, what is required by contract and what can wait.',
        'Evidence you hand to a customer without rebuilding it.',
        'A named owner for every obligation.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'A major customer sent us a forty-page security questionnaire.', decision: 'What level of evidence to provide, against which framework.', deliverable: 'Evidence file and gap-closure plan, reusable for the next customers.', format: 'A few weeks', cycles: ['croissance'], image: `${S}laptop-hands.jpg` },
        { quote: 'We do not know whether we are in scope.', decision: 'What applies to us, what will be imposed on us, what can wait.', deliverable: 'Three-Track Exposure Map.', format: 'Short engagement', cycles: ['lancement', 'croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Our teams use AI without rules.', decision: 'Which tools, with which data, under whose responsibility.', deliverable: 'Usage policy, system inventory, classification under the AI Act.', format: 'Short engagement', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'We have had an incident.', decision: 'Whom to inform (authority, customers, insurer), within what deadlines.', deliverable: 'Documented incident file and improvement plan, with incident-response experts from the network.', format: 'On request', cycles: ['restructuration'], image: `${S}network-cables.jpg` },
        { quote: 'An investor or an acquirer is going to audit us.', decision: 'What to regularise beforehand, what to own.', deliverable: 'Compliance file ready for the data room.', format: 'A few weeks', cycles: ['acquisition', 'transmission'], image: `${S}planning-laptops.jpg` },
        { quote: 'We sell into the EU from Switzerland (or the reverse).', decision: 'Representative, DPO, data transfers.', deliverable: 'Jurisdiction matrix (FADP / GDPR) and associated obligations.', format: 'Short engagement', cycles: ['croissance'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Our services',
      items: [
        'Map your regulatory exposure',
        'Build the evidence file your customers can rely on',
        'Govern the use of AI',
        'Document incident management',
        'Steer remediation',
        'Train the management committee on its responsibilities',
      ],
    },
    framework: {
      name: 'The Three-Track Exposure Map',
      intro: 'Each text is placed on one of three tracks, with its deadline, its internal owner and the gap observed.',
      axes: [
        { label: 'Mandatory', desc: 'What the law imposes on you today, according to your role: essential or important entity, AI deployer or provider, data controller.' },
        { label: 'Contractual', desc: 'What your customers, insurers and investors require, even without a law.' },
        { label: 'To watch', desc: 'Known deadline, not applicable to date.' },
      ],
      deliverable: 'A one-page summary, detailed annexes per text.',
    },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME · 10 to 50 M€', desc: 'Rarely a full-time CISO or DPO. We aim for a base of defensible controls, not a complete management system, and draw on outsourced functions from the network.' },
        { label: 'Mid-cap · 50 to 300 M€', desc: 'A risk function exists, several frameworks overlap. We consolidate them into a single plan and prepare the internal audit.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'DORA, applicable since 17 January 2025: critical ICT third parties, resilience testing, register of providers. In Switzerland, FINMA requirements on operational risks and resilience (circular 2023/1).' },
        { cluster: 'Health & Life Sciences', desc: 'HDS in France, MDR/IVDR, EHDS. AI embedded in a medical device: Annex I high risk, deadline 2 August 2028.' },
        { cluster: 'Industry, Energy & Infrastructure', desc: 'NIS2 (energy, water, transport, manufacturing); in Switzerland, NCSC reporting within 24 h; IT/OT segmentation.' },
        { cluster: 'Commerce, Services & Customer Experience', desc: 'GDPR and FADP (loyalty, profiling); Article 50 (conversational agents, generated content); CV-screening tools: high risk, Annex III, 2 December 2027.' },
        { cluster: 'Tech, Innovation & Public Sector', desc: 'Your NIS2 and DORA customers ask you for evidence; Cyber Resilience Act (reporting obligations from September 2026, product requirements in December 2027); software vendors used in critical infrastructure: check whether the Swiss ISA applies to you.' },
      ],
    },
    scenario: {
      tag: 'Typical scenario · illustrative',
      text: 'Swiss software vendor with 25 M€ revenue, energy customers in Germany and France. Its largest customer demands supply-chain security evidence before renewal. Within three weeks: scope clarified (mandatory for the customer, contractual for the vendor), eight gaps ranked, evidence reusable for the three other customers.',
    },
    ai: {
      title: 'What an AI tool will not do for you',
      text: 'An assistant summarises NIS2. It will not carry your file in front of your customer, will not choose which gaps you accept, will not answer for the quality of the evidence. Aegryn commits a named expert, accountable for their scope.',
      legal: 'Our support does not replace legal advice; we work with partner law firms.',
    },
    diagnostic: {
      title: 'Where do you stand? Five questions.',
      intro: 'Answer yes or no. The result places you on one of three levels and names the next step.',
      questions: [
        { q: 'Do you have the list of texts that apply to you (EU and Switzerland) and their deadlines?' },
        { q: 'Do you know what your three largest customers impose on you by contract on security and data?' },
        { q: 'Is there a written incident procedure, with notification deadlines and contacts?' },
        { q: 'Do you have a written rule on the data entered into AI tools?' },
        { q: 'Is a named member of management accountable for compliance?' },
      ],
      levels: [
        { min: 0, label: 'To be framed', desc: 'The scope is not established. Exposure is discovered when a customer, an auditor or an incident reveals it.', nextAction: 'Build the Three-Track Exposure Map: mandatory, contractual, to watch.' },
        { min: 3, label: 'Under construction', desc: 'Texts and customer requirements are identified. What is missing is the evidence: reusable file, incident procedure, named owner.', nextAction: 'Build the defensible evidence file and name an owner per obligation.' },
        { min: 5, label: 'Mastered', desc: 'Scope, evidence, owners: the base exists. The topic becomes upkeep and the coming deadlines (AI Act 2027, CRA).', nextAction: 'Plan an annual scope review and train the management committee on its responsibilities.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspectives', items: [] },
    cta: { metier: 'conformite' },
  },

  technology: {
    key: 'technology', path: '/advisory/technology',
    image: '/images/advisory/technology.webp',
    imageAlt: 'Server racks in a data centre',
    meta: {
      title: 'Technology consulting: architecture, debt, AI, hosting | Aegryn',
      description: 'Architecture audit, build-buy-partner arbitration, AI governance, fractional technical leadership. For SMEs and mid-caps between 10 and 300 M€. Switzerland and Europe.',
      keywords: ['architecture audit', 'technical debt', 'fractional CTO', 'interim CTO', 'AI governance SME', 'sovereign hosting Switzerland', 'reversibility'],
    },
    eyebrow: 'Technology & Sovereignty',
    h1: 'Your technology is an asset or a dependency. Measure which, before a customer, an investor or an outage does it for you.',
    subtitle: 'Architecture, technical debt, AI, hosting: the choices of the first three years weigh on the next ten. Aegryn steps in at the moments when they are decided.',
    scope: [
      { label: 'Legal obligations: Risk & Compliance', href: '/advisory/risk-compliance' },
      { label: 'Audit of a target: M&A', href: '/advisory/ma' },
      { label: 'Custom development: Build', href: '/services/build' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '22% → 34%', label: 'Swiss SMEs using AI, 2024 to 2025', source: 'SECO, kmu.admin.ch' },
        { value: '34%', label: 'have rules on the data entered into AI tools; 23% among companies with fewer than 10 employees', source: 'SECO, kmu.admin.ch' },
        { value: '2 Aug 2026', label: 'AI Act transparency obligations (Article 50) applicable', source: 'Regulation (EU) 2024/1689' },
      ],
      paragraphs: [
        'Adoption is ahead of governance. In Switzerland, AI use among SMEs rose from 22% to 34% between 2024 and 2025; 60% see it as an opportunity. Yet only 34% have clear rules on the data that may be entered into these tools, and 23% among companies with fewer than ten employees. On the European side, the AI Act’s transparency obligations have applied since 2 August 2026.',
      ],
      change: 'The risk does not come from the tool, but from the absence of a rule around it.',
      sources: 'Sources: SECO, “AI gains ground among Swiss SMEs” · Regulation (EU) 2024/1689.',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'Named dependencies, with a plan for each non-reversible component.',
        'Technical debt that is quantified rather than felt.',
        'AI usage rules your teams actually apply.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'Our platform is slowing down our releases.', decision: 'Refactor, rebuild or replace.', deliverable: 'Architecture audit, technical debt quantified by domain, twelve-month trajectory.', format: 'A few weeks', cycles: ['croissance'], image: `${S}server-room-walk.jpg` },
        { quote: 'Only one person understands the system.', decision: 'Document, duplicate or insource.', deliverable: 'Dependency register (people, providers, licences) and reduction plan.', format: 'Short engagement', cycles: ['croissance', 'transmission'], image: `${S}developer-desk.jpg` },
        { quote: 'Build, buy or partner?', decision: 'The right call, with the exit cost.', deliverable: 'Weighted-criteria analysis, reversibility included.', format: 'Short engagement', cycles: ['lancement', 'croissance'], image: `${S}loft-office.jpg` },
        { quote: 'Our teams use AI without a framework.', decision: 'Authorised tools, admitted data, hosting.', deliverable: 'Usage policy, inventory, tool arbitration.', format: 'Short engagement', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'We no longer have a CTO.', decision: 'Interim, hire, or fractional leadership.', deliverable: 'Interim technical leadership with documented handover.', format: 'Fractional engagement', cycles: ['restructuration'], image: `${S}open-office.jpg` },
        { quote: 'Where is our data, and who can access it?', decision: 'EU or Swiss hosting, reversibility clauses, exposure to extraterritorial laws.', deliverable: 'Hosting review and reversibility plan.', format: 'Short engagement', cycles: ['lancement', 'croissance'], image: `${S}network-cables.jpg` },
      ],
    },
    services: {
      title: 'Our services',
      items: [
        'Audit the architecture and the debt',
        'Decide between build, buy and partner',
        'Establish the register of critical dependencies',
        'Govern the use of AI',
        'Provide interim technical leadership',
        'Prepare the technology asset for a third party’s scrutiny (investor, acquirer)',
      ],
    },
    framework: {
      name: 'The 90-Day Reversibility Test',
      intro: 'For each critical component (host, vendor, provider, AI model, key developer), one question: if it disappears tomorrow, in how many days, at what cost and with what data loss does the service restart?',
      axes: [
        { label: 'Reversible within a week', desc: 'Alternative identified, exportable data, documented switchover.' },
        { label: 'Reversible within a month', desc: 'Known alternative, migration to plan, limited functional dependency.' },
        { label: 'Reversible within 90 days', desc: 'Replacement possible but costly: partial rebuild, renegotiation, hiring.' },
        { label: 'Non-reversible', desc: 'No credible alternative to date. The component conditions service continuity.' },
      ],
      deliverable: 'Map of the ten most critical components and treatment plan for the non-reversible ones.',
    },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME · 10 to 50 M€', desc: 'A stack built by accretion, a few developers, some providers. Priority: minimal documentation and reversibility of the three critical components.' },
        { label: 'Mid-cap · 50 to 300 M€', desc: 'Legacy information system, several vendors, an IT department. Priority: a modernisation trajectory arbitrated by the committee, and data governance across businesses.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Critical ICT third parties and cloud outsourcing (DORA); resilience architecture.' },
        { cluster: 'Health & Life Sciences', desc: 'HDS hosting in France; separation of health data; AI in a medical device (Annex I, 2 August 2028).' },
        { cluster: 'Industry, Energy & Infrastructure', desc: 'IT/OT, remote maintenance, ownership of industrial data.' },
        { cluster: 'Commerce, Services & Customer Experience', desc: 'Unifying customer data across channels without depending on a single CRM; AI personalisation and GDPR.' },
        { cluster: 'Tech, Innovation & Public Sector', desc: 'Audit before investment or sale; copyleft licences at the core of the product; hosting imposed by public procurement.' },
      ],
    },
    scenario: {
      tag: 'Typical scenario · illustrative',
      text: 'Software vendor for clinics, 18 M€ revenue, 14 developers including 6 contractors. A fund takes an interest in the company. Within four weeks: dependencies and debt mapped, three non-reversible components identified, six-month remediation plan costed. The CEO presents it to the fund before the fund discovers it alone.',
    },
    ai: {
      title: 'What an AI tool will not do for you',
      text: 'A coding assistant produces code. It does not answer for the architecture choice, does not know what your hosting contract allows, and will not hold the CTO seat in front of your board.',
    },
    diagnostic: {
      title: 'Where do you stand? Five questions.',
      intro: 'Answer yes or no. The result places you on one of three levels and names the next step.',
      questions: [
        { q: 'Is your architecture documented and up to date (diagram, data flows)?' },
        { q: 'Can you name your ten critical components and the replacement time for each?' },
        { q: 'Does more than one person understand each critical component?' },
        { q: 'Are the rights assignments and licences for all code delivered by contractors archived?' },
        { q: 'Do you know where your data is hosted and who can access it?' },
      ],
      levels: [
        { min: 0, label: 'To be framed', desc: 'The system works, but its knowledge rests on a few people and its documentation is not current.', nextAction: 'Establish the dependency register and run the three most critical components through the Reversibility Test.' },
        { min: 3, label: 'Under construction', desc: 'Architecture and data are known. Blind spots remain: chain of rights, backups for key people, replacement times.', nextAction: 'Complete the register (rights, licences, backups) and quantify the debt by domain.' },
        { min: 5, label: 'Mastered', desc: 'The technology asset is documented, reversible and readable by a third party. The topic becomes trajectory: modernisation, AI, data governance.', nextAction: 'Arbitrate the twelve-month trajectory in committee and prepare the asset for an investor’s or acquirer’s scrutiny.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectives',
      items: [
        { title: 'What makes a tech asset truly certifiable', href: '/blog/actif-tech-certifiable', kind: 'article' },
      ],
    },
    cta: { metier: 'technologie' },
  },

  talentOrganization: {
    key: 'talentOrganization', path: '/advisory/talent-organization',
    image: '/images/advisory/talent.webp',
    imageAlt: 'Empty boardroom, ready for the next session',
    meta: {
      title: 'Succession, governance, leadership team | Aegryn',
      description: 'Measure dependency on the CEO, structure the management committee, build a succession plan, retain key people. SMEs and mid-caps between 10 and 300 M€. Switzerland and Europe.',
      keywords: ['SME succession plan', 'founder dependency', 'management committee governance', 'key people retention', 'family business transfer', 'mid-cap organisation'],
    },
    eyebrow: 'Talent & Organisation',
    h1: 'The value of an organisation is measured by what it can do without its leader.',
    subtitle: 'Succession, governance, retention, structuring the leadership: organisational decisions weigh the most over time and are the most often postponed.',
    scope: [
      { label: 'Search and placement: Recruit', href: '/talent' },
      { label: 'Direction: Strategy', href: '/advisory/strategy' },
      { label: 'Team of a target: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '40%', label: 'of French micro, small and mid-sized business leaders intend to transfer within five years, i.e. 370,000 companies', source: 'Bpifrance Le Lab, 27 Nov 2025' },
        { value: '130,000', label: 'effective transfers expected at the current pace', source: 'Bpifrance Le Lab, 27 Nov 2025' },
        { value: '47%', label: 'of family business leaders aged 60 to 69 have not formalised a succession plan', source: 'Bpifrance Le Lab, family businesses' },
      ],
      paragraphs: [
        'In France, 40% of micro, small and mid-sized business leaders intend to transfer their company within five years, a potential of 370,000 companies. At the current pace, 130,000 would actually change hands. Among leaders of family SMEs and mid-caps aged 60 to 69, 47% have not formalised a succession plan.',
      ],
      change: 'The gap between intention and action has less to do with the market than with preparation. An organisation that depends on one person transfers badly, finances badly and steers badly.',
      sources: 'Sources: Bpifrance Le Lab, Business transfer and takeover study (27 November 2025) · Bpifrance Le Lab, family businesses.',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'An organisation that holds for three months without its leader.',
        'Critical roles with identified backups.',
        'A succession plan that is written, dated and shared.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'Everything goes through me.', decision: 'What to delegate first, to whom.', deliverable: 'Dependency Index and twelve-month delegation plan.', format: 'A few weeks', cycles: ['croissance', 'transmission'], image: `${S}meeting-room.jpg` },
        { quote: 'My leadership team is not yet a team.', decision: 'Roles, decision rhythms, delegations.', deliverable: 'Governance charter for the management committee.', format: 'A few weeks', cycles: ['croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'A key person wants to leave.', decision: 'Retain, replace or back up.', deliverable: 'Retention plan, identified backup, documented knowledge transfer.', format: 'Short engagement', cycles: ['restructuration'], image: `${S}laptop-hands.jpg` },
        { quote: 'I need to hire an executive (technical, financial, operations, country).', decision: 'The right profile, in the right governance.', deliverable: 'Role definition and integration criteria, then handover to Recruit.', format: 'Short engagement', cycles: ['croissance'], image: `${S}handshake.jpg` },
        { quote: 'I am thinking of transferring in two to five years.', decision: 'Family, internal or external buyer.', deliverable: 'Succession plan and transition governance.', format: 'One to two months', cycles: ['transmission'], image: `${S}plan-writing.jpg` },
        { quote: 'An acquisition is coming, two cultures are about to meet.', decision: 'Who stays, who leads, how to organise.', deliverable: 'Assessment of the target team, target organisation, retention plan.', format: 'A few weeks', cycles: ['acquisition'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Our services',
      items: [
        'Measure dependency on the leader and on key people',
        'Structure the management committee and its delegations',
        'Build the succession plan',
        'Secure the retention of critical people',
        'Document critical know-how',
        'Prepare the hiring of an executive',
      ],
    },
    framework: {
      name: 'The Dependency Index',
      intro: 'For each critical person, four axes, one score, a substitution time in weeks and an alert threshold.',
      axes: [
        { label: 'Decisions', desc: 'Who decides.' },
        { label: 'Relationships', desc: 'Who holds the key customers and partners.' },
        { label: 'Knowledge', desc: 'Who alone knows.' },
        { label: 'Contracts', desc: 'Which clauses are attached to a name.' },
      ],
      deliverable: 'A map of the people whose departure would put the organisation in difficulty, and what each departure would cost in continuity.',
    },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME · 10 to 50 M€', desc: 'The CEO is often the first salesperson and the first product decision-maker. Priority: delegate key customer relationships and document the ten critical processes.' },
        { label: 'Mid-cap · 50 to 300 M€', desc: 'Family governance or shareholders. Priority: succession plan for the managing director and direct reports, nomination committee, role of the family.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Functions subject to regulatory approval or notification, where the holder’s departure triggers formalities.' },
        { cluster: 'Health & Life Sciences', desc: 'Person responsible for regulatory compliance (PRRC, MDR) and quality manager: regulated functions with prepared succession.' },
        { cluster: 'Industry, Energy & Infrastructure', desc: 'Tacit know-how of senior staff, clustered retirements, family businesses.' },
        { cluster: 'Commerce, Services & Customer Experience', desc: 'Network managers, key accounts, retention of frontline managers.' },
        { cluster: 'Tech, Innovation & Public Sector', desc: 'Single CTO, developers who hold the architecture.' },
      ],
    },
    scenario: {
      tag: 'Typical scenario · illustrative',
      text: 'Family mid-cap of 140 M€, CEO aged 63, two children, neither wishing to lead. Within four weeks: Dependency Index (seven critical people), three succession scenarios compared, twenty-four-month transition calendar the family council can decide on.',
    },
    ai: {
      title: 'What an AI tool will not do for you',
      text: 'An assistant drafts a job description. It does not hold the difficult conversation with the founder, does not arbitrate between two direct reports, and does not know what the family is not saying.',
    },
    diagnostic: {
      title: 'Where do you stand? Five questions.',
      intro: 'Answer yes or no. The result places you on one of three levels and names the next step.',
      questions: [
        { q: 'Would your organisation operate normally for three months without you?' },
        { q: 'Do your five key customers or partners have at least two contacts in your company?' },
        { q: 'Does each critical function have an identified backup?' },
        { q: 'Is there a written succession plan for the leader and direct reports?' },
        { q: 'Is critical know-how documented somewhere other than in the heads of those who hold it?' },
      ],
      levels: [
        { min: 0, label: 'To be framed', desc: 'The organisation rests on its leader and a few people. A departure or a prolonged absence would put it in difficulty.', nextAction: 'Measure the Dependency Index and delegate key customer relationships first.' },
        { min: 3, label: 'Under construction', desc: 'Delegations exist and customers have several contacts. What is missing is formalisation: backups, written succession plan, documented knowledge.', nextAction: 'Write the succession plan for the leader and direct reports, and document the ten critical processes.' },
        { min: 5, label: 'Mastered', desc: 'The organisation holds without its leader. The topic becomes the transition: calendar, governance, role of the family or shareholders.', nextAction: 'Frame the transition governance and prepare the nomination committee.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspectives', items: [] },
    cta: { metier: 'talent' },
  },

  ma: {
    key: 'ma', path: '/advisory/ma',
    image: '/images/advisory/ma.webp',
    imageAlt: 'Executive on the way to a negotiation meeting',
    meta: {
      title: 'Acquisition, sale, integration: advisory ahead of the transaction | Aegryn',
      description: 'Review of a target’s blind spots (code and rights, change-of-control clauses, compliance, teams), seller preparation, 100-day integration. Financial execution rests with accredited partners.',
      keywords: ['SME acquisition advisory', 'target review', 'change of control clause', 'post-merger integration', '100-day plan', 'build-up', 'seller preparation'],
    },
    eyebrow: 'M&A, Transactions & PMI',
    h1: 'An acquisition is won in preparation. It is lost in integration.',
    subtitle: 'Aegryn looks at what financial and legal audits look at little: the code, the rights, the change-of-control clauses, the teams. Financial execution is entrusted to accredited partners.',
    scope: [
      { label: 'Audit depth: Risk & Compliance', href: '/advisory/risk-compliance' },
      { label: 'Audit depth: Technology', href: '/advisory/technology' },
      { label: 'Teams: Talent & Organisation', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'What we observe',
      cards: [
        { value: '48 to 66%', label: 'failure rate of M&A operations across compiled studies, mostly at integration', source: 'Wiley Encyclopedia of Management; Kotter et al.' },
        { value: '208', label: 'Swiss SME M&A deals in 2025, up 16%; up 28% in IT services and software', source: 'SECO, kmu.admin.ch' },
        { value: '23%', label: 'of potential French sellers report a lack of takeover offers', source: 'Bpifrance Le Lab, 2025' },
      ],
      paragraphs: [
        'Compiled studies place the failure of M&A operations between 48 and 66% depending on the definition used, and the observations of Kotter and his co-authors locate most failures at integration. In Switzerland, SME M&A deals rebounded by 16% in 2025 (208 deals), with +28% in IT services and software. In France, 23% of potential sellers report a lack of takeover offers.',
      ],
      change: 'The market has sellers and buyers; what is missing is the preparation that gets the deal done and keeps its promises.',
      sources: 'Sources: Wiley Encyclopedia of Management; Kotter, Akhtar, Gupta, Change · SECO · Bpifrance Le Lab (2025).',
    },
    outcomes: {
      title: 'What you get',
      items: [
        'A target examined from four angles that classic due diligence covers little.',
        'Negotiation points that are quantified rather than intuited.',
        'An integration plan ready before signing.',
      ],
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'We have identified a target.', decision: 'What to look at before the letter of intent.', deliverable: 'Four Blind Spots review, with a proposed treatment for each: price, warranty, condition precedent.', format: 'A few weeks', cycles: ['acquisition'], image: `${S}planning-laptops.jpg` },
        { quote: 'Someone has approached us to buy the company.', decision: 'How far to prepare before answering.', deliverable: 'Seller readiness diagnosis and negotiating position.', format: 'A few weeks', cycles: ['transmission'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'We want to make two or three acquisitions in three years.', decision: 'Thesis, criteria, process.', deliverable: 'Repeatable build-up programme: criteria, standard review, integration playbook.', format: 'One to two months', cycles: ['acquisition'], image: `${S}loft-office.jpg` },
        { quote: 'The acquisition is signed, integration is stalling.', decision: 'What is urgent, what can wait.', deliverable: '30 / 60 / 100-day plan and steering.', format: 'Three to six-month engagement', cycles: ['acquisition'], image: `${S}open-office.jpg` },
        { quote: 'We need to divest a non-core business.', decision: 'Scope and separation of systems.', deliverable: 'Separation plan: scope, systems, people, transition agreements.', format: 'One to two months', cycles: ['restructuration'], image: `${S}industrial-engineer.jpg` },
        { quote: 'My fund needs to validate a technology target.', decision: 'Invest, negotiate or walk away.', deliverable: 'Independent technical and organisational review, scored by blind spot.', format: 'A few weeks', cycles: ['acquisition'], image: `${S}server-room-walk.jpg` },
      ],
    },
    services: {
      title: 'Our services',
      items: [
        'Formulate the acquisition thesis and target criteria',
        'Run the target through the four blind spots',
        'Frame the negotiation points arising from the review',
        'Prepare the organisation to be examined (seller side)',
        'Steer the 100-day integration',
        'Structure a build-up programme',
      ],
    },
    framework: {
      name: 'The Four Blind Spots Review',
      intro: 'Each finding is ranked by impact and probability, then treated: price adjustment, specific warranty, condition precedent or point accepted knowingly.',
      axes: [
        { label: 'Code and chain of rights', desc: 'Licences, author assignments, dependencies.' },
        { label: 'Contracts and change of control', desc: 'Customers, suppliers, assigned licences.' },
        { label: 'Compliance and security', desc: 'Inherited regulatory scope, incidents, available evidence.' },
        { label: 'People and dependencies', desc: 'Key managers, retention, culture.' },
      ],
      deliverable: 'An impact / probability matrix per angle, and for each finding the proposed treatment in negotiation.',
    },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME · 10 to 50 M€', desc: 'Takeover, MBO or acquisition by a player of similar size, with few advisers around the table. We focus the review on the four blind spots within a few weeks, alongside the lawyer and the accountant.' },
        { label: 'Mid-cap · 50 to 300 M€', desc: 'External growth programme, in-house M&A team or investment bank. Aegryn acts as the technical, organisational and integration review partner.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Acquisition of a fintech or insurtech player; approvals and change-of-control authorisations; data portability; DORA on third parties.' },
        { cluster: 'Health & Life Sciences', desc: 'Continuity of CE marking (MDR) and HDS hosting; hospital contracts with change-of-control clauses.' },
        { cluster: 'Industry, Energy & Infrastructure', desc: 'Acquiring digital skills; intellectual property in an industrial environment; founder-developer.' },
        { cluster: 'Commerce, Services & Customer Experience', desc: 'Digital players to complement a physical network; customer data; team integration.' },
        { cluster: 'Tech, Innovation & Public Sector', desc: 'Vertical software build-up; quality of recurring revenue; change-of-control clauses; copyleft.' },
      ],
    },
    scenario: {
      tag: 'Typical scenario · illustrative',
      text: 'Services group of 90 M€ wanting to acquire a software vendor with 8 M€ revenue. Within three weeks: two major customer contracts carry a change-of-control clause, a copyleft-licensed library sits at the core of the product, the CTO alone holds the architecture. Three points go to negotiation: specific warranty, condition precedent, retention plan.',
    },
    ai: {
      title: 'What an AI tool will not do for you',
      text: 'An assistant reads a sale agreement. It will not tell you what the change-of-control clause in your first customer’s contract is worth, will not sit across from the target’s CTO, and does not carry liability.',
    },
    complement: {
      title: 'Going further',
      text: 'When the case warrants it, the review can draw on the independent CIFSO 5000 certification, delivered across five dimensions.',
    },
    diagnostic: {
      title: 'Where do you stand? Five questions.',
      intro: 'Answer yes or no. The result places you on one of three levels and names the next step.',
      questions: [
        { q: 'Do you have a written external growth thesis (target criteria, budget, calendar)?' },
        { q: 'Do you know which change-of-control clauses appear in your key customer contracts?' },
        { q: 'Is the chain of rights over your code and trademarks documented?' },
        { q: 'Does a 100-day integration plan exist before any signing?' },
        { q: 'If an acquirer approached you tomorrow, could you open a data room within two weeks?' },
      ],
      levels: [
        { min: 0, label: 'To be framed', desc: 'The deal would be handled as it comes. The blind spots (rights, clauses, teams) would be discovered by the other party.', nextAction: 'Write the thesis or the readiness diagnosis, and reread the change-of-control clauses of your top three contracts.' },
        { min: 3, label: 'Under construction', desc: 'The basics exist: thesis or preparation, contracts known. What is missing is the mechanics: chain of rights, 100-day plan, data room ready.', nextAction: 'Document the chain of rights and draft the integration plan before the next letter of intent.' },
        { min: 5, label: 'Mastered', desc: 'You are ready to buy or to be examined. The topic becomes repeatability: build-up programme, integration playbook.', nextAction: 'Structure the build-up programme and measure the 100-day integration on the next deal.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectives',
      items: [
        { title: 'How PE acquirers assess a SaaS in 2026', href: '/blog/comment-acquereurs-pe-evaluent-saas-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 02 · The Exit Equation (April 2027)', href: '/magazine', kind: 'magazine' },
      ],
    },
    cta: { metier: 'ma' },
  },
}
