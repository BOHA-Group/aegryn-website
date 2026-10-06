/**
 * FRANCHIR content — English.
 * Translated from the French reference (content/franchir/fr.ts),
 * spec dated 6 October 2026. Scenarios are illustrative and marked as such.
 */

import type { CycleContent, FranchirIntro } from './types'

export const FRANCHIR_INTRO_EN: FranchirIntro = {
  meta: {
    title:       'Navigate — every stage has its decision | Aegryn',
    description: 'Launch, growth, pivot, acquisition, succession: five stages in which an organisation of €10 to 300M commits its future. Here is what is at stake, and whom to engage.',
  },
  eyebrow:   'Navigate',
  heroTitle: 'Every stage has its decision. Find yours.',
  heroSub:   'Launch, growth, pivot, acquisition, succession: five stages in which an organisation of €10 to 300M commits its future. Here is what is at stake, and whom to engage.',
  cycles: [
    { slug: 'lancement',       title: 'Launch & Structuring',          stake: 'Choices that are cheap to make now are very costly to correct later.' },
    { slug: 'croissance',      title: 'Growth & Scaling',              stake: 'What worked with ten people slows down at fifty.' },
    { slug: 'restructuration', title: 'Restructuring & Pivot',         stake: 'The model, the market or the rules have changed: decide fast.' },
    { slug: 'acquisition',     title: 'Acquisition & External Growth', stake: 'Knowing what you are taking on, and how to integrate it.' },
    { slug: 'transmission',    title: 'Succession & Sale',             stake: 'Making the organisation hold without its leader.' },
  ],
  overlap: {
    title: 'Going through two stages at once?',
    text:  'Growing through acquisition, restructuring before succession: stages overlap. Aegryn builds a single scope of intervention, with the disciplines concerned.',
    examples: [
      { label: 'Growth + Acquisition',        a: 'croissance',      b: 'acquisition' },
      { label: 'Restructuring + Succession',  a: 'restructuration', b: 'transmission' },
    ],
  },
  diagnostic: {
    title: 'Where are you?',
    questions: [
      { q: 'Is your organisation under 3 years old, or preparing a new product or entity?', cycle: 'lancement' },
      { q: 'Has your activity more than doubled in volume or headcount recently?', cycle: 'croissance' },
      { q: 'Is a major client, a market, an incident or a regulation challenging your model?', cycle: 'restructuration' },
      { q: 'Are you studying the acquisition of an organisation, or have you acquired one in the last 18 months?', cycle: 'acquisition' },
      { q: 'Are you considering handing over within five years?', cycle: 'transmission' },
    ],
  },
  assetsLink: { text: 'To measure and certify the value of your assets:', label: 'see Aegryn assets' },
  cta:        { label: '30-minute call' },
}

export const FRANCHIR_EN: CycleContent[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'lancement',
    path: '/franchir/lancement',
    meta: {
      title:       'Launch & Structuring — laying the right foundations before spending | Aegryn',
      description: 'Suppliers, technology, intellectual property, compliance, governance: first-month choices are cheap to make and very costly to fix.',
    },
    eyebrow:  'Navigate · Launch & Structuring',
    h1:       'Lay the right foundations before you spend.',
    subtitle: 'Suppliers, technology, intellectual property, compliance, governance: the choices of the first months are cheap to decide and very costly to correct.',
    verbs:    ['Frame', 'Build', 'Recruit'],
    constat: {
      text:   'The transparency obligations of the EU AI Act (Article 50) have applied since 2 August 2026, with fines of up to €15M or 3% of worldwide turnover for obligations other than prohibited practices. An organisation launching an AI-powered product is concerned from day one.',
      source: 'EU AI Act.',
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'My contractor delivered the code, but I never re-read the contract.', decision: 'Who owns the code and the data? What happens if the contractor leaves?', metiers: ['technologie'], deliverable: 'Position note on ownership and reversibility, with the clauses to fix' },
        { quote: 'We want to move fast; we’ll deal with compliance later.', decision: 'Which obligations already apply, which can wait?', metiers: ['conformite'], deliverable: 'Exposure map: applies now / soon / not concerned' },
        { quote: 'We hesitate between building, buying or renting.', decision: 'What scope to build, what to buy or rent?', metiers: ['strategie', 'construire'], deliverable: 'Written trade-off, including what to give up' },
        { quote: 'My partner and I never defined who decides.', decision: 'Who decides what, who owns what?', metiers: ['talent'], deliverable: 'Two-page decision framework, ready to sign' },
        { quote: 'I need a first technical lead.', decision: 'Profile, status, compensation, role facing contractors', metiers: ['recruter'], deliverable: 'Job description, candidate pool' },
        { quote: 'Our group is creating a new activity to be ring-fenced.', decision: 'What scope to isolate from the group’s information system?', metiers: ['technologie', 'strategie'], deliverable: 'Ring-fencing plan and six-month roadmap' },
      ],
    },
    metiers: { mobilized: ['technologie', 'conformite', 'strategie', 'construire'], available: ['talent', 'recruter'] },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME', desc: 'Few resources, trade-offs in days, a single point of contact at Aegryn.' },
        { label: 'Mid-cap', desc: 'New entity, spin-off: isolate the new activity from the group’s information system and governance.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital',                              desc: 'Operational and systems outsourcing requirements from day one.' },
        { cluster: 'Health & Life Sciences',                         desc: 'Sensitive data processed from the very first user.' },
        { cluster: 'Industry, Energy & Infrastructure',              desc: 'Embedded software, maintenance over decades.' },
        { cluster: 'Commerce, Services & Customer Experience',       desc: 'Consent and customer data.' },
        { cluster: 'Tech, Innovation & Public Sector',               desc: 'Reversibility of components and suppliers.' },
      ],
    },
    scenario: {
      tag:  'Illustrative scenario',
      text: 'A software publisher with €3M revenue, whose product is developed by an external contractor, is preparing its first enterprise account. The reversibility test shows the code repository is in the contractor’s name. The fix takes a few weeks before signing — and would cost far more after.',
    },
    ai: {
      title: 'What a generalist AI tool will not do for you',
      text:  'Read your contractor agreement in its context, arbitrate between two partners, and answer for the decision before your board or your funders.',
    },
    diagnostic: {
      title: 'Self-assessment',
      intro: 'Five yes/no questions to locate your foundations.',
      questions: [
        { q: 'Are your product’s code and data held in your organisation’s name?' },
        { q: 'Could you replace your main contractor in under 90 days?' },
        { q: 'Have you listed the regulatory obligations applying to your product?' },
        { q: 'Are decision roles and powers between partners written down?' },
        { q: 'Does someone in-house understand the architecture end to end?' },
      ],
      levels: [
        { min: 4, label: 'Foundations laid',  desc: 'Your foundations are in place. A 30-minute call can confirm what remains.', nextAction: '30-minute call' },
        { min: 2, label: 'To secure',         desc: 'Several points to secure before growing.', nextAction: '30-minute call' },
        { min: 0, label: 'Foundations first', desc: 'Prioritise the foundations.', nextAction: '30-minute call' },
      ],
      privacy: 'No data is recorded: the assessment is computed in your browser.',
    },
    nextLabel: 'Next stage',
    next:      [{ label: 'Growth & Scaling', slug: 'croissance' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'croissance',
    path: '/franchir/croissance',
    meta: {
      title:       'Growth & Scaling — grow without breaking what works | Aegryn',
      description: 'Beyond a certain volume, what worked with ten people slows down at fifty: tools, decisions, rules, dependencies.',
    },
    eyebrow:  'Navigate · Growth & Scaling',
    h1:       'Grow without breaking what works.',
    subtitle: 'Beyond a certain volume, what worked with ten people slows down at fifty: tools, decisions, rules, dependencies.',
    verbs:    ['Structure', 'Secure', 'Strengthen'],
    constat: {
      text:   'In Switzerland, SME use of AI rose from 22% to 34% between 2024 and 2025, yet only 34% have rules on the data entered into these tools (23% among those with under 10 employees). The 2026 SME barometer stands at −7.3, its lowest since 2021. Growth is happening in a strained environment, with practices still largely unframed.',
      source: 'SECO, SME Portal.',
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'My teams use AI however they like.', decision: 'Which rules, which data, which authorised tools?', metiers: ['conformite'], deliverable: 'Three-rule usage charter, rollout plan' },
        { quote: 'A major client is asking for security guarantees.', decision: 'What level of evidence, at what cost?', metiers: ['conformite', 'technologie'], deliverable: 'Exposure map and prioritised upgrade plan' },
        { quote: 'Everything still goes through me.', decision: 'Which decisions to delegate, to whom, within what limits?', metiers: ['talent'], deliverable: 'Dependency index and delegation matrix' },
        { quote: 'Our current tool won’t hold twice the volume.', decision: 'Repair, rebuild or replace?', metiers: ['technologie'], deliverable: 'Reversibility test and costed trade-off' },
        { quote: 'I need a finance or operations director.', decision: 'Profile, hiring timing, role facing the leader', metiers: ['recruter'], deliverable: 'Job description, candidate pool, interview grid' },
        { quote: 'I need to open a second market or subsidiary.', decision: 'What pace, which priorities, what renunciation?', metiers: ['strategie'], deliverable: 'Four-test grid applied to the options' },
      ],
    },
    metiers: { mobilized: ['conformite', 'technologie', 'talent', 'recruter'], available: ['strategie', 'ma', 'construire'] },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME', desc: 'Set three simple rules rather than a heavy framework; first level of delegation.' },
        { label: 'Mid-cap', desc: 'Coordinate multiple sites or subsidiaries on one policy; structured executive committee.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital',                              desc: 'Outsourcing and operational resilience frameworks.' },
        { cluster: 'Health & Life Sciences',                         desc: 'Patient data, traceability.' },
        { cluster: 'Industry, Energy & Infrastructure',              desc: 'Industrial systems security, critical operator obligations.' },
        { cluster: 'Commerce, Services & Customer Experience',       desc: 'Activity peaks, customer data.' },
        { cluster: 'Tech, Innovation & Public Sector',               desc: 'Rising requirements from contracting authorities.' },
      ],
    },
    scenario: {
      tag:  'Illustrative scenario',
      text: 'A €25M publisher whose clients are energy companies receives a demand for security measures ahead of renewal. The exposure map separates genuinely applicable obligations from general concerns, and sequences the work over twelve months.',
    },
    ai: {
      title: 'What a generalist AI tool will not do for you',
      text:  'Decide what stays centralised, negotiate with a major account on what you can actually guarantee, convince your teams to apply a rule.',
    },
    diagnostic: {
      title: 'Self-assessment',
      intro: 'Five questions to locate your capacity to grow.',
      questions: [
        { q: 'Do everyday decisions still mostly go through the leader?', goodIf: 'no' },
        { q: 'Do you have a written rule on data entered into AI tools?' },
        { q: 'Has a major client asked for guarantees you struggle to document?', goodIf: 'no' },
        { q: 'Can your core system absorb twice the volume without redesign?' },
        { q: 'Does your executive committee include the functions needed for your target size?' },
      ],
      levels: [
        { min: 4, label: 'Holding pace',        desc: 'Your organisation is holding its growth pace: a 30-minute call can confirm what remains.', nextAction: '30-minute call' },
        { min: 2, label: 'To structure',        desc: 'Growth still relies on informal habits: several points to structure.', nextAction: '30-minute call' },
        { min: 0, label: 'Structure required',  desc: 'Your organisation needs structure to sustain its growth.', nextAction: '30-minute call' },
      ],
      privacy: 'No data is recorded: the assessment is computed in your browser.',
    },
    nextLabel: 'Next stage',
    next:      [
      { label: 'Restructuring & Pivot',         slug: 'restructuration' },
      { label: 'Acquisition & External Growth', slug: 'acquisition' },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'restructuration',
    path: '/franchir/restructuration',
    meta: {
      title:       'Restructuring & Pivot — change course without losing control | Aegryn',
      description: 'Loss of a major client, an incident, a regulatory injunction, a market turning: the first decisions are the heaviest.',
    },
    eyebrow:  'Navigate · Restructuring & Pivot',
    h1:       'Change course without losing control.',
    subtitle: 'Loss of a major client, an incident, a regulatory injunction, a market turning: the first decisions are the heaviest.',
    verbs:    ['Arbitrate', 'Stabilise', 'Pivot'],
    constat: {
      text:   'The Banque de France records 70,605 business failures over the twelve months to end-July 2026. In Switzerland, operators of critical infrastructure must report a cyberattack to the NCSC within 24 hours since 1 April 2025, on pain of a fine of up to CHF 100,000 since 1 October 2025.',
      source: 'Banque de France; NCSC.',
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'One client accounts for a major share of my revenue — and it is leaving.', decision: 'What priorities over 90 days, what cash to protect?', metiers: ['strategie'], deliverable: '30/60/90-day plan presentable to the board and the bank' },
        { quote: 'We suffered an incident. What must we declare?', decision: 'Whom to notify, within what deadline, with what evidence?', metiers: ['conformite'], deliverable: 'Position note and notification sequence' },
        { quote: 'My market is turning with AI.', decision: 'Which pivot, on which existing assets?', metiers: ['strategie', 'technologie'], deliverable: 'Pivot options compared on the four-test grid' },
        { quote: 'An activity must be sold off to stay afloat.', decision: 'What scope to isolate, which shared systems?', metiers: ['ma'], deliverable: 'Separation perimeter, dependency list' },
        { quote: 'I must cut costs without breaking execution.', decision: 'Which costs, what timing, what social risks?', metiers: ['talent'], deliverable: 'Reorganisation plan and key-profile departure risks' },
        { quote: 'I need an interim leader.', decision: 'Profile, mandate, duration', metiers: ['recruter'], deliverable: 'Mission brief and pre-selected profiles' },
      ],
    },
    metiers: { mobilized: ['strategie', 'conformite', 'recruter'], available: ['technologie', 'talent', 'ma', 'construire'] },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME', desc: 'Decisions concentrated on one person, 30-day frame.' },
        { label: 'Mid-cap', desc: 'Coordination of the board, funders and subsidiaries.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital',                              desc: 'Supervisory authority requirements.' },
        { cluster: 'Health & Life Sciences',                         desc: 'Continuity of care and authorisations.' },
        { cluster: 'Industry, Energy & Infrastructure',              desc: 'Production continuity and reporting obligations.' },
        { cluster: 'Commerce, Services & Customer Experience',       desc: 'Cash flow and seasonality.' },
        { cluster: 'Tech, Innovation & Public Sector',               desc: 'Contractual service-level commitments.' },
      ],
    },
    scenario: {
      tag:  'Illustrative scenario',
      text: 'A €40M B2B services company loses a client representing a third of its revenue. Within ten days: mapping of avoidable costs, offer refocus, check-in with the bank. The 30/60/90-day plan is presented to the board.',
    },
    ai: {
      title: 'What a generalist AI tool will not do for you',
      text:  'Choose what to sacrifice, talk to your bank and your teams, answer for the decision in an emergency.',
    },
    diagnostic: {
      title: 'Self-assessment',
      intro: 'Five questions to locate your exposure.',
      questions: [
        { q: 'Does a client or supplier account for a critical share of your activity?', goodIf: 'no' },
        { q: 'Does an event (incident, injunction, client loss) force a decision within 30 days?', goodIf: 'no' },
        { q: 'Is your cash flow projected over 90 days?' },
        { q: 'Do you know which reporting obligations apply to your organisation?' },
        { q: 'Do you have a written plan for the departure of a key person?' },
      ],
      levels: [
        { min: 4, label: 'Prepared',       desc: 'Your organisation is prepared for turning points.', nextAction: '30-minute call' },
        { min: 2, label: 'Fragile points', desc: 'Points of fragility to address before they become urgent.', nextAction: '30-minute call' },
        { min: 0, label: 'To stabilise',   desc: 'Several signals call for a rapid decision: stabilisation first.', nextAction: '30-minute call' },
      ],
      privacy: 'No data is recorded: the assessment is computed in your browser.',
    },
    nextLabel: 'Next stage',
    next:      [
      { label: 'Acquisition & External Growth', slug: 'acquisition' },
      { label: 'Succession & Sale',             slug: 'transmission' },
    ],
    urgency: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'acquisition',
    path: '/franchir/acquisition',
    meta: {
      title:       'Acquisition & External Growth — buy knowing what you take on | Aegryn',
      description: 'An acquisition is decided as much on integration as on price: four blind spots, an integration plan, retention commitments.',
    },
    eyebrow:  'Navigate · Acquisition & External Growth',
    h1:       'Buy knowing what you are taking on.',
    subtitle: 'An acquisition is decided as much on integration as on price.',
    verbs:    ['Assess', 'Integrate', 'Retain'],
    constat: {
      text:   'Studies compiled in the Wiley Encyclopedia of Management put the failure rate of mergers and acquisitions between 48% and 66%, with recurring causes being overestimated synergies, absent integration plans and too slow a pace. In Switzerland, SME transactions reached 208 deals in 2025 (+16%), including +28% in IT services and software.',
      source: 'Wiley Encyclopedia of Management; SECO.',
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'We found a target. What should we look at beyond the accounts?', decision: 'Which points to check before committing?', metiers: ['ma'], deliverable: 'Four-blind-spot review, with the conditions to negotiate' },
        { quote: 'Are the target’s code and systems sound?', decision: 'Dependencies, licences, reversibility', metiers: ['technologie'], deliverable: 'Technical report and estimated upgrade cost' },
        { quote: 'Will we keep its key teams?', decision: 'Whom to retain, with what commitments?', metiers: ['talent'], deliverable: 'Target dependency index, retention plan' },
        { quote: 'How to integrate without stalling the business?', decision: 'Sequence of the first 100 days', metiers: ['ma', 'technologie'], deliverable: 'Milestoned integration plan' },
        { quote: 'Is this acquisition consistent with our strategy?', decision: 'Thesis, priorities, renunciations', metiers: ['strategie'], deliverable: 'Four-test grid applied to the target' },
        { quote: 'Is the target compliant with the rules we will face tomorrow?', decision: 'Which obligations are we taking on?', metiers: ['conformite'], deliverable: 'Target exposure map' },
      ],
    },
    metiers: { mobilized: ['ma', 'technologie', 'strategie'], available: ['conformite', 'talent', 'recruter'] },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME', desc: 'An acquisition can weigh a quarter of the activity; integration rests on a few people.' },
        { label: 'Mid-cap', desc: 'Programme of successive acquisitions, integration to systematise.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital',                              desc: 'Licences and authorisations to transfer.' },
        { cluster: 'Health & Life Sciences',                         desc: 'Compliance of acquired products.' },
        { cluster: 'Industry, Energy & Infrastructure',              desc: 'Sites, supply chains, heavy assets.' },
        { cluster: 'Commerce, Services & Customer Experience',       desc: 'Customer bases and contracts.' },
        { cluster: 'Tech, Innovation & Public Sector',               desc: 'Code ownership and maintainability.' },
      ],
    },
    scenario: {
      tag:  'Illustrative scenario',
      text: 'A €90M services group considers buying an €8M software publisher. The blind-spot review reveals dependence on two developers and a component under a restrictive licence. The price does not change; retention conditions and a replacement plan are added to the agreement.',
    },
    ai: {
      title: 'What a generalist AI tool will not do for you',
      text:  'Assess the reliability of the team across the table, negotiate retention commitments, decide to walk away.',
    },
    mandate: 'Aegryn does not execute the transaction. Execution is entrusted to investment banks, M&A boutiques and accredited lawyers.',
    diagnostic: {
      title: 'Self-assessment',
      intro: 'Five yes/no questions before you commit.',
      questions: [
        { q: 'Have you defined this acquisition’s thesis in writing?' },
        { q: 'Does an integration plan exist before signing?' },
        { q: 'Do you know the three to five people the target’s value depends on?' },
        { q: 'Are the target’s systems compatible with yours?' },
        { q: 'Is the transaction’s execution entrusted to accredited advisers?' },
      ],
      levels: [
        { min: 4, label: 'Structured approach', desc: 'Your approach is structured: a 30-minute call can check the last blind spots.', nextAction: '30-minute call' },
        { min: 2, label: 'To frame',            desc: 'Several points to frame before committing.', nextAction: '30-minute call' },
        { min: 0, label: 'Before signing',      desc: 'Before signing, secure the fundamentals.', nextAction: '30-minute call' },
      ],
      privacy: 'No data is recorded: the assessment is computed in your browser.',
    },
    nextLabel: 'Next stage',
    next:      [{ label: 'Succession & Sale', slug: 'transmission' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'transmission',
    path: '/franchir/transmission',
    meta: {
      title:       'Succession & Sale — prepare the organisation to hold without you | Aegryn',
      description: 'Succession is prepared years in advance. What conditions it is the organisation’s capacity to run without its leader.',
    },
    eyebrow:  'Navigate · Succession & Sale',
    h1:       'Prepare the organisation to hold without you.',
    subtitle: 'Succession is prepared years in advance. What conditions it is the organisation’s capacity to function without its leader.',
    verbs:    ['Document', 'Delegate', 'Hand over'],
    constat: {
      text:   'According to Bpifrance Le Lab (Nov. 2025), 40% of micro, SME and mid-cap leaders plan to transfer within five years — 370,000 businesses — and 23% of sellers report a shortage of buyers. 47% of family-business leaders aged 60 to 69 have no formalised succession plan.',
      source: 'Bpifrance Le Lab.',
    },
    situations: {
      title: 'Where you stand. How we step in.',
      items: [
        { quote: 'Everything rests on me.', decision: 'Who can take over what, in which order?', metiers: ['talent'], deliverable: 'Dependency index, 24-month delegation plan' },
        { quote: 'Will my family or my managers take over?', decision: 'Family, internal or third-party option', metiers: ['strategie', 'ma'], deliverable: 'Comparison of the three options and timetable' },
        { quote: 'Are my contracts and rights in order?', decision: 'What a buyer will inspect', metiers: ['ma', 'conformite'], deliverable: 'Seller-side blind-spot review, list of fixes' },
        { quote: 'My system rests on one person.', decision: 'Documentation and reversibility', metiers: ['technologie'], deliverable: 'Reversibility test and documentation plan' },
        { quote: 'I want to leave within 24 months.', decision: 'Timetable, milestones, role after departure', metiers: ['ma'], deliverable: 'Backwards-planned roadmap' },
        { quote: 'My executive committee is not ready to take over.', decision: 'Whom to recruit, whom to promote?', metiers: ['recruter', 'talent'], deliverable: 'Profiles and readiness plan' },
      ],
    },
    metiers: { mobilized: ['talent', 'ma'], available: ['strategie', 'technologie', 'conformite', 'recruter'] },
    bySize: {
      title: 'By size',
      items: [
        { label: 'SME', desc: 'Owner-founder, strong dependency, 2-to-3-year horizon.' },
        { label: 'Mid-cap', desc: 'Family council, governance, multiple shareholders.' },
      ],
    },
    bySector: {
      title: 'By sector',
      items: [
        { cluster: 'Finance & Capital',                              desc: 'Licences tied to individuals.' },
        { cluster: 'Health & Life Sciences',                         desc: 'Licence and authorisation holders.' },
        { cluster: 'Industry, Energy & Infrastructure',              desc: 'Concentrated know-how, heavy assets.' },
        { cluster: 'Commerce, Services & Customer Experience',       desc: 'Customer relationships carried by the leader.' },
        { cluster: 'Tech, Innovation & Public Sector',               desc: 'Code knowledge concentrated in a few people.' },
      ],
    },
    scenario: {
      tag:  'Illustrative scenario',
      text: 'A €140M family-owned mid-cap whose leader is 63. The dependency index shows that many decisions go back to him alone. A 24-month plan: progressive delegation, strengthened executive committee, documentation of key client relationships.',
    },
    ai: {
      title: 'What a generalist AI tool will not do for you',
      text:  'Talk to your family and your managers, choose a successor, accept letting go of certain decisions.',
    },
    mandate: 'Aegryn prepares the organisation. The sale is executed with the client’s investment bank, M&A boutique or lawyer.',
    diagnostic: {
      title: 'Self-assessment',
      intro: 'Five yes/no questions to locate your preparedness.',
      questions: [
        { q: 'Can an important decision be made without you?' },
        { q: 'Is your succession formalised in writing?' },
        { q: 'Are your key client relationships carried by more than one person?' },
        { q: 'Are your contracts, rights and data documented and up to date?' },
        { q: 'Do you have a target date for your departure?' },
      ],
      levels: [
        { min: 4, label: 'Transfer under way', desc: 'Your succession is under way in good conditions.', nextAction: '30-minute call' },
        { min: 2, label: 'To document',        desc: 'Points to document before committing to a timetable.', nextAction: '30-minute call' },
        { min: 0, label: 'To prepare',         desc: 'Preparing your succession starts now.', nextAction: '30-minute call' },
      ],
      privacy: 'No data is recorded: the assessment is computed in your browser.',
    },
    nextLabel: 'Previous stage',
    next:      [{ label: 'Acquisition & External Growth', slug: 'acquisition' }],
  },
]
