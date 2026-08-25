import { notFound }        from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import type { MagazineIssue } from '@/lib/magazine/types'

import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'
import { ARTICLES_01 }     from '@/content/magazine/issue-01/articles'
import { DATA_01, dealVolumeData, multiplesChartData, gradeDistributionData } from '@/content/magazine/issue-01/data'

import { MagazineNav }       from '@/components/magazine/MagazineNav'
import { CoverSection }      from '@/components/magazine/sections/CoverSection'
import { AegrynCtaBlock }    from '@/components/magazine/AegrynCtaBlock'
import { CifsBars }          from '@/components/magazine/CifsBars'
import { DealVolumeChart }   from '@/components/magazine/charts/DealVolumeChart'
import { MultiplesChart }    from '@/components/magazine/charts/MultiplesChart'
import { GradeDistributionChart } from '@/components/magazine/charts/GradeDistributionChart'
import { IssueViewerTabs } from '@/components/magazine/IssueViewerTabs'

/* ── Issue registry ─────────────────────────────────────── */
function getIssue(slug: string): MagazineIssue | null {
  switch (slug) {
    case 'issue-01': return ISSUE_01
    default: return null
  }
}

type Props = { params: Promise<{ locale: string; issue: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, issue: issueSlug } = await params
  const issue = getIssue(issueSlug)
  if (!issue) return {}

  const title       = `${issue.title} — Aegryn Magazine Issue ${String(issue.number).padStart(2, '0')}`
  const description = issue.theme

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/magazine/${issue.slug}`,
      languages: {
        fr: `/fr/magazine/${issue.slug}`,
        en: `/en/magazine/${issue.slug}`,
        de: `/de/magazine/${issue.slug}`,
        es: `/es/magazine/${issue.slug}`,
        it: `/it/magazine/${issue.slug}`,
        nl: `/nl/magazine/${issue.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type:          'article',
      publishedTime: `${issue.publishedAt}T00:00:00Z`,
      authors:       ['AEGRYN'],
    },
  }
}

export default async function IssuePage({ params }: Props) {
  const { locale, issue: issueSlug } = await params
  const issue = getIssue(issueSlug)
  if (!issue) notFound()

  const t    = await getTranslations({ locale, namespace: 'magazine.report' })
  const tHub = await getTranslations({ locale, namespace: 'magazine.hub' })

  /* ── Nav sections with articles ── */
  const navSections = issue.sections.map(s => ({
    ...s,
    articles: ARTICLES_01.filter(a => a.pillar === s.pillar).slice(0, 3),
  }))

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'Report',
            name:          `Aegryn Magazine — Issue ${String(issue.number).padStart(2, '0')} — ${issue.title}`,
            description:   issue.theme,
            author:        { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            publisher:     { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            datePublished: issue.publishedAt,
            inLanguage:    locale,
            url:           `https://aegryn.com/${locale}/magazine/${issue.slug}`,
          }),
        }}
      />

      {/* ── Cover pleine largeur (avant sidebar) ── */}
      <CoverSection
        issue={issue}
        ctaScroll={t('scrollDown')}
        locale={locale}
      />

      {/* ── Layout 2 colonnes : sidebar fixe + contenu scrollable ── */}
      <div className="relative">
        {/* Sidebar Barnes verticale fixe */}
        <MagazineNav
          sections={navSections}
          issueNumber={issue.number}
          issueTitle={issue.title}
          issueSubtitle="January 2027"
          locale={locale}
          issueSlug={issue.slug}
          labelContents={tHub('navTableOfContents')}
          labelDownload={tHub('navDownloadPdf')}
        />

        {/* Contenu principal décalé de 240px sur desktop */}
        <main className="lg:ml-[240px] bg-magazine-ivory">

        {/* ── Flipbook + Web Edition (onglets) ── */}
        {issue.slug === 'issue-01' && (
          <section id="s-flipbook">
            <IssueViewerTabs
              flipbookSrc="/magazine/issue-01/aegryn-magazine-issue-01_1.html"
              webSrc="/magazine/issue-01/aegryn-magazine-issue-01_web.html"
              issueLabel="Issue 01 — Built to Last — January 2027"
            />
          </section>
        )}

        {/* ── Editorial ── */}
        <section id="s-editorial" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-12">Editorial — Issue 01</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p
                className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                style={{ fontSize: 'clamp(56px,8vw,100px)', letterSpacing: '-0.04em', fontWeight: 800 }}
              >
                We<br /><span className="text-magazine-black">Refuse.</span>
              </p>
              <blockquote className="border-l-2 border-magazine-black/40 pl-6 mb-8">
                <p className="text-body-mag text-magazine-black/60 leading-[1.75] italic">
                  &ldquo;Every year, several hundred European tech companies disappear into transactions that should never have happened — or never happen at all.&rdquo;
                </p>
              </blockquote>
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/30 italic">
                The Aegryn Founding Team — Saint-Sulpice — January 2027
              </p>
            </div>
            <div className="space-y-6 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>Not because the assets weren't real. Not because the technology wasn't solid. Because <strong className="text-magazine-black">no one prepared them to transact.</strong></p>
              <p>We built Aegryn to refuse that outcome. We refuse to let a serious company disappear into a poorly structured process. We refuse to let a founder walk away with 60 cents on the dollar because their data room was three PDFs and a prayer.</p>
              <p><strong className="text-magazine-black">Aegryn Magazine</strong> exists because the information gap between European founders and institutional acquirers is still enormous — and the publications that could close it have chosen to stay behind paywalls, stay shallow, or stay American.</p>
              <p>Issue 01 is <strong className="text-magazine-black">&ldquo;Built to Last.&rdquo;</strong> It covers what makes an asset worth acquiring before any conversation starts — the structural decisions, the certification logic, the real market data, and the human reality of building something a serious buyer will pay full price for.</p>
              <p className="font-semibold text-magazine-black">Certified to transact. Engineered to Last.</p>
            </div>
          </div>
        </section>

        {/* ── The Market ── */}
        <section id="s-market" className="bg-magazine-ivory">
          <div className="px-6 md:px-[120px] py-10 border-b border-magazine-black/8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-magazine-black/8">
              {[
                { val: '€262B', label: 'EU M&A Q2 2026',      sub: '3,315 transactions' },
                { val: '2,698', label: 'SaaS deals 2025',      sub: 'Record by volume' },
                { val: '+28%',  label: 'Certified premium',    sub: 'vs uncertified' },
                { val: '<25%',  label: 'CIFS acceptance rate', sub: '1 in 4 pass' },
              ].map(s => (
                <div key={s.val} className="px-6 py-8 first:pl-0">
                  <p className="font-sans font-bold text-magazine-black tabular-nums" style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-0.03em', fontWeight: 800, lineHeight: 1 }}>
                    {s.val}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/50 mt-2">{s.label}</p>
                  <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-magazine-black/30 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 md:px-[120px] py-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">The Market</p>
            <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4">
              European Tech M&amp;A — The 2026 Numbers
            </h2>

            {/* Volume chart */}
            <div className="mt-16">
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-4">
                EU SaaS deal volume by quarter — 2023–2026 (est.)
              </p>
              <DealVolumeChart data={dealVolumeData} highlightQ="Q3 25" />
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-3">
                Source — Software Equity Group · Aventis Advisors · Synergy AI
              </p>
            </div>

            {/* Multiples table */}
            <div className="mt-20 overflow-x-auto">
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-6">
                EV/ARR Multiples by vertical — 2026
              </p>
              <table className="w-full text-body-mag">
                <thead>
                  <tr className="border-b border-magazine-black/10">
                    {['Sector', 'Median multiple', 'Top quartile', 'Source'].map(h => (
                      <th key={h} className="text-left text-label-mag uppercase tracking-[0.1em] text-magazine-black/40 pb-4 pr-8 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATA_01.multiples.map((row, i) => (
                    <tr
                      key={row.sector}
                      className={`border-b border-magazine-black/5 ${i % 2 === 0 ? 'bg-magazine-ivory' : 'bg-magazine-white'}`}
                    >
                      <td className="py-4 pr-8 font-semibold text-magazine-black">{row.sector}</td>
                      <td className="py-4 pr-8 font-semibold text-magazine-black/70">{row.median}</td>
                      <td className="py-4 pr-8 text-magazine-black/60">{row.top}</td>
                      <td className="py-4 text-magazine-black/40 text-label-mag uppercase tracking-[0.08em]">{row.src}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EU vs US Multiples */}
            <div className="mt-20">
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-4">
                Median EV/ARR — Europe vs United States, 2021–2026
              </p>
              <MultiplesChart data={multiplesChartData} />
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-3">
                Source — SEG SaaS Report 2026 · Aventis Advisors Q2 2026
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-label-mag uppercase tracking-[0.1em]">
                <span className="flex items-center gap-2 text-magazine-black/50">
                  <span className="inline-block w-6 h-0.5 bg-[#5ADDA4]" /> Europe: 3.1x → 4.7x ARR
                </span>
                <span className="flex items-center gap-2 text-magazine-black/50">
                  <span
                    className="inline-block w-6 h-0.5 bg-[#4A90D9] opacity-70"
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg,#4A90D9 0,#4A90D9 4px,transparent 4px,transparent 7px)' }}
                  />
                  US: 4.9x → 6.1x ARR
                </span>
                <span className="flex items-center gap-2 font-semibold text-magazine-black/60">
                  Gap narrowed from −40% to −23% since 2023
                </span>
              </div>
            </div>

            {/* The European Discount */}
            <div className="mt-20 max-w-prose">
              <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
                The European Discount — and Why It's Narrowing
              </h3>
              <p className="text-body-mag text-magazine-black/70 leading-[1.75]">
                European SaaS companies trade at a 15–25% discount vs US peers. The gap has narrowed from 30–40% in 2020 — driven by increasing US buyer appetite for European SaaS and the maturation of European growth equity. The remaining discount reflects structural factors: a less standardised advisory ecosystem, fewer certifiable due diligence frameworks, and a cultural reluctance around price transparency. These are solvable problems.
              </p>
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">
                Source — Synergy AI 2026
              </p>
            </div>
          </div>
        </section>

        {/* ── AI Effect ── */}
        <section id="s-ai" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">The AI Effect</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[800px]">
            Artificial Intelligence and the Recomposition of Tech Value
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            {[
              { val: '72%',   label: 'of SaaS M&A targets reference AI (2025)' },
              { val: '12.5x', label: 'median EV/Revenue for AI-native SaaS' },
            ].map(s => (
              <div key={s.val}>
                <p
                  className="font-sans font-bold text-magazine-black tabular-nums"
                  style={{ fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {s.val}
                </p>
                <p className="text-body-mag text-magazine-black/50 mt-4">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
            {[
              { code: 'I-16', title: 'Proprietary data',  body: 'Datasets that cannot be replicated — the foundation of durable AI value.' },
              { code: 'F-49', title: 'Contractual moat',  body: 'Long-term contracts (>24 months) that prove deep client embedding.' },
              { code: 'S-42', title: 'EU AI Act ready',   body: 'Compliance with Articles 9–15 — increasingly a buyer prerequisite.' },
              { code: 'F-14', title: 'NRR > 120%',        body: 'Net Revenue Retention above 120% demonstrates genuine product-market fit.' },
            ].map(a => (
              <div key={a.code} className="border-l-2 border-magazine-black/20 pl-6 py-2 bg-magazine-ivory">
                <p className="text-label-mag text-magazine-black/50 uppercase tracking-[0.12em] mb-2">{a.code}</p>
                <p className="text-h2-mag font-sans font-semibold text-magazine-black mb-2">{a.title}</p>
                <p className="text-body-mag text-magazine-black/60">{a.body}</p>
              </div>
            ))}
          </div>

          <div className="max-w-prose border-t border-magazine-black/10 pt-12">
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">The Commoditisation Trap</h3>
            <p className="text-body-mag text-magazine-black/65 leading-[1.75]">
              The test: can a competitor rebuild this with Claude or GPT in two weeks? If yes, the asset has no certifiable moat. This is what we observe in approximately 40% of submitted assets — products built on thin wrappers around public LLMs, without proprietary data, contractual depth, or technical differentiation. The AI valuation premium is real. It is also fragile for assets that cannot pass this test.
            </p>
          </div>
        </section>

        {/* ── Perspective ── */}
        <section id="s-perspective" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">The AEGRYN Perspective</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px]">
            What We See From the Certification Table
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
                Not a Valuation. A Certification.
              </h3>
              <p className="text-body-mag text-magazine-black/70 leading-[1.75] mb-6">
                The CIFS protocol covers four dimensions: <strong>C</strong>ode integrity, <strong>I</strong>P ownership, <strong>F</strong>inancial reliability, and <strong>S</strong>ecurity posture. Each dimension is scored on a 25-point scale. A certified asset achieves a minimum threshold across all four — not just the average.
              </p>
              <p className="text-body-mag text-magazine-black/70 leading-[1.75]">
                Unlike a CIM or an information memorandum, the CIFS certification is auditable, signed, and tied to a specific state of the asset at a specific date. It is what makes closing faster and dispute risk lower.
              </p>
              <p className="text-body-mag text-magazine-black/50 leading-[1.75] mt-4 italic">
                Less than 25% of submitted assets pass the certification threshold.
              </p>
            </div>
            <CifsBars dims={DATA_01.cifsExample} />
          </div>

          {/* Grade distribution */}
          <div className="mb-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-4">
              AEGRYN Certification Index — Edition 1
            </p>
            <GradeDistributionChart data={gradeDistributionData} />
            <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.08em] mt-3">
              Based on asset submissions since launch. Data will deepen with each annual edition.
            </p>
          </div>

          {/* Top 5 refusals */}
          <div>
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-10">
              Top 5 Reasons Assets Are Not Certified
            </h3>
            <div className="space-y-0">
              {[
                { code: 'F-11a', label: 'ARR declared without Stripe or billing access' },
                { code: 'I-21',  label: 'Software rights not formally assigned to the entity' },
                { code: 'F-42',  label: 'Founder dependency exceeding 60% of revenue' },
                { code: 'S-16',  label: 'No pentest conducted in the past 18 months' },
                { code: 'I-27',  label: 'No legal basis for personal data transfer (GDPR)' },
              ].map((r, i) => (
                <div key={r.code} className="flex items-start gap-8 py-6 border-b border-magazine-black/10">
                  <span
                    className="font-sans font-bold text-magazine-black/20 tabular-nums shrink-0"
                    style={{ fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                  >
                    0{i + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-label-mag text-magazine-black/50 uppercase tracking-[0.12em] mb-1">{r.code}</p>
                    <p className="text-h2-mag font-sans font-semibold text-magazine-black">{r.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Transaction : Deal Watch ── */}
        <section id="s-transaction" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Transaction — Deal Watch H1 2026</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">Five Deals That Defined H1 2026.</h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-16 leading-[1.75]">Not the press releases. The signals. Grades shown are analytical estimates — not official certifications.</p>
          <div className="space-y-0">
            {[
              { n: '01', name: 'Legal Workflow Platform — DACH', meta: 'LegalTech · €4.2M ARR · PE · 6.8x ARR', grade: 'Auction Ready', desc: '7-year-old bootstrapped platform, 98% subscription revenue, NRR 118%. Due diligence closed in 19 days — half the EU market average. Buyer cited documentation quality as primary driver.', lesson: 'Clean documentation is a time-to-close advantage worth 15–20% in negotiating power.' },
              { n: '02', name: 'AI Contract Intelligence — France', meta: 'AI-native SaaS · €1.8M ARR · Strategic · 11x ARR', grade: 'Grade A', desc: 'Buyer paid 11x ARR for the proprietary training dataset. Founder had documented data provenance from day one. That documentation added an estimated €3.2M to the headline price.', lesson: 'Proprietary data with documented provenance is the highest-value AI asset.' },
              { n: '03', name: 'Home Services Marketplace — Netherlands', meta: 'Marketplace · €900K GMV · Search Fund · 2.6x revenue', grade: 'Pre-Grade', desc: 'F-42 score of 4/5 — three largest clients communicated exclusively with the founder. Buyer accepted an 18-month earn-out to compensate for transition risk.', lesson: 'Founder dependency is a pricing problem — and it costs more than most founders expect.' },
              { n: '04', name: 'FinTech Compliance Tool — Spain', meta: 'RegTech · €2.1M ARR · Strategic · 8.2x ARR', grade: 'Grade A', desc: 'DORA compliance deadline created structural urgency. Sold at 8.2x ARR — a premium of ~3x above sector median. The regulatory moment was exceptional.', lesson: 'Regulatory windows create premium moments. Prepared assets capture them.' },
              { n: '05', name: 'Vibe-Coded SaaS — Germany', meta: 'Horizontal SaaS · €600K ARR · No Close', grade: 'No Close', desc: 'LOI at 5x ARR. Technical due diligence: 70% of core codebase AI-generated, no tests, no docs, 3 deprecated dependencies. Buyer requested −40%. Founder declined.', lesson: 'Speed of build is invisible in due diligence. Auditability is everything.' },
            ].map((d, i, arr) => (
              <div key={d.n} className={`py-10 grid grid-cols-[auto_1fr_auto] gap-8 items-start ${i < arr.length - 1 ? 'border-b border-magazine-black/8' : ''}`}>
                <span className="font-sans font-bold text-magazine-black/15 tabular-nums" style={{ fontSize: 'clamp(28px,3.5vw,48px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>{d.n}</span>
                <div>
                  <p className="text-label-mag text-magazine-black/50 uppercase tracking-[0.12em] mb-1">{d.meta}</p>
                  <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-3">{d.name}</h3>
                  <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-3">{d.desc}</p>
                  <p className="text-label-mag text-magazine-black/50 font-semibold">→ {d.lesson}</p>
                </div>
                <span className="inline-block font-mono text-[8px] tracking-[0.18em] uppercase border border-magazine-black/20 text-magazine-black/50 px-3 py-1.5 shrink-0 mt-1">{d.grade}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Buyers ── */}
        <section id="s-buyers" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">The Buyer Landscape</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px]">
            Who Is Buying European Tech in 2026
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {DATA_01.buyers.map((b, i) => (
              <div key={b.type}>
                <p
                  className="font-sans font-bold text-magazine-black/15"
                  style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mt-4 mb-2">{b.type}</h3>
                <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.1em] mb-6">
                  Target: {b.ticket}
                </p>
                <ul className="space-y-2 mb-6">
                  {b.criteria.map(s => (
                    <li key={s} className="flex items-start gap-3 text-body-mag text-magazine-black/70">
                      <span className="mt-2.5 w-1 h-1 rounded-full bg-magazine-black/40 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="text-body-mag text-magazine-black/50 italic">
                  Grade min. {b.gradeMin} — {b.examples}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Outlook 2027 ── */}
        <section id="s-outlook" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Perspectives 2027</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-20 max-w-[720px]">
            What the Next 12 Months Look Like
          </h2>

          <div className="space-y-0">
            {[
              {
                num: '01', title: 'The EU AI Act Enters Into Force',
                body: 'Assets not compliant with the EU AI Act — particularly high-risk systems — will face a structural devaluation. Assets that can demonstrate compliance (CIFS S-42) will command a verifiable premium.',
                impact: 'Non-compliant AI assets: est. −20 to −30% valuation impact',
              },
              {
                num: '02', title: 'The Founder Succession Wave',
                body: 'More than 3.5 million European SMEs are currently without a successor. The tech segment — particularly bootstrapped SaaS companies founded between 2008 and 2016 — is entering its peak succession window.',
                impact: 'Largest deal volume growth expected in LMM tech — H2 2026 to 2028',
              },
              {
                num: '03', title: 'PE Dry Powder Reaches Record Levels',
                body: 'European private equity funds are sitting on record undeployed capital. Certified, transaction-ready assets will move faster and attract more competitive offers.',
                impact: 'Certified assets expected to transact 40–60 days faster than uncertified',
              },
            ].map((f, i, arr) => (
              <div
                key={f.num}
                className={`py-16 ${i < arr.length - 1 ? 'border-b border-magazine-black/10' : ''}`}
              >
                <p
                  className="font-sans font-bold text-magazine-black/15 mb-4 tabular-nums"
                  style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {f.num}
                </p>
                <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6 max-w-[600px]">{f.title}</h3>
                <p className="text-body-mag text-magazine-black/60 leading-[1.75] max-w-prose mb-6">{f.body}</p>
                <p className="text-label-mag text-magazine-black/50 uppercase tracking-[0.1em]">{f.impact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AEGRYN Index ── */}
        <section id="s-index" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">The AEGRYN Index — Edition I</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">Proprietary Certification Data. Published Here First.</h2>
          <p className="text-body-mag text-magazine-black/50 max-w-prose mb-16 italic">Not available elsewhere. Updated every issue. CIFS Protocol v3.0.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-magazine-black/8 mb-16">
            {DATA_01.indexMetrics.map(m => (
              <div key={m.label} className="bg-magazine-white p-8">
                <p
                  className="font-sans font-bold text-magazine-black tabular-nums"
                  style={{ fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {m.val}
                </p>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/50 mt-3">{m.label}</p>
                <p className="text-body-mag text-magazine-black/40 mt-1 text-[11px] leading-snug">{m.note}</p>
              </div>
            ))}
          </div>
          <CifsBars dims={DATA_01.cifsExample} />
        </section>

        {/* ── People : Founder Portrait + Radar 5 Builders ── */}
        <section id="s-people" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Section 05 — People</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">The Founder Who Built to Sell.</h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-16 leading-[1.75] italic">Composite portrait drawn from four European founders who exited between 2025 and 2026. All bootstrapped. All profitable. None had institutional venture backing.</p>

          {/* Portrait stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-magazine-black/8 mb-20">
            {[
              { val: '6.4x', label: 'ARR multiple at exit' },
              { val: '14w', label: 'Process to signing' },
              { val: '€3–8M', label: 'ARR at time of sale' },
              { val: '0', label: 'VC money raised' },
            ].map(s => (
              <div key={s.label} className="bg-magazine-ivory p-8">
                <p className="font-sans font-bold text-magazine-black" style={{ fontSize: 'clamp(28px,3.5vw,48px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>{s.val}</p>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/40 mt-3">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Portrait text */}
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            <div className="space-y-6 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>He built the first version alone, over a long weekend in his apartment in Rotterdam, to solve a problem he had watched his previous employer pay €40,000 a year to solve badly. By year five, he had €2.4 million in ARR, seven employees, and a waiting list.</p>
              <p>His cap table was entirely clean. He had signed intellectual property assignment agreements with every developer who had ever written a line of production code, including two freelancers who had contributed during the first year. He had tracked both of them down. One required a modest payment. The other signed willingly.</p>
              <p>His bookkeeper closed the monthly management accounts within 48 hours of month-end, every month, without exception, for six years. None of this had been strategic preparation for a sale. It was simply how he ran things.</p>
            </div>
            <div className="space-y-6 text-body-mag text-magazine-black/65 leading-[1.8]">
              <blockquote className="border-l-2 border-magazine-accent pl-6">
                <p className="italic">&ldquo;The due diligence team told me they had never seen a data room this clean on a sub-€5M ARR company. I didn’t know that was unusual. I thought it was just how you ran a business.&rdquo;</p>
              </blockquote>
              <p>Three buyers expressed serious interest. Two submitted letters of intent. He accepted at 6.4x ARR. The process ran fourteen weeks from first meeting to signing — half the EU market average for an asset of comparable complexity.</p>
              <p>He is now 22 months into his second company. He started the documentation on day one this time. The IP assignment agreements were signed before the first line of code was written.</p>
            </div>
          </div>

          {/* 5 Builders Radar */}
          <div className="border-t border-magazine-black/10 pt-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-12">5 European Builders to Watch</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { sector: 'HealthTech · Switzerland · 4 years', name: 'Regulatory Submission Automation', arr: '€380K ARR', nrr: 'NRR 122%', desc: 'Automates CE marking and FDA 510(k) submissions for Swiss MedTech. The regulatory moat is the non-substitutable asset — 12 years of prior experience in the field.' },
                { sector: 'LegalTech · Germany · 6 years', name: 'Contract Risk Intelligence', arr: '€520K ARR', nrr: 'Enterprise only', desc: 'Proprietary risk-scoring model trained on 180,000 German-language contracts, licensed from three bar associations. The training data cannot be reproduced without six years of relationship-building.' },
                { sector: 'RegTech · Netherlands · 3 years', name: 'AI Regulatory Change Monitoring', arr: '€210K ARR', nrr: '+30% QoQ', desc: 'Monitors EU financial services regulation in real time. Built 18 months before DORA compliance became mandatory for its target customers.' },
                { sector: 'EdTech · Spain · 4 years', name: 'EU Compliance Training Platform', arr: '€340K ARR', nrr: '91% retention', desc: '140 financial institutions across Spain, Portugal, Italy. Distribution built over 12 years of direct consulting relationships — the moat is not the technology, it is the network.' },
                { sector: 'PropTech · France · 5 years', name: 'Commercial RE Transaction Intelligence', arr: '€290K ARR', nrr: 'Proprietary data', desc: 'Five years of primary research across French, Belgian, and Luxembourg commercial transactions. The dataset cannot be scraped or purchased — it required five years to build.' },
              ].map(b => (
                <div key={b.name} className="border border-magazine-black/10 p-6 bg-magazine-white">
                  <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-accent mb-3">{b.sector}</p>
                  <h3 className="font-sans font-semibold text-magazine-black text-[15px] mb-2 leading-snug">{b.name}</h3>
                  <div className="flex gap-4 mb-4">
                    <span className="font-mono text-[9px] tracking-[0.1em] text-magazine-black/50">{b.arr}</span>
                    <span className="font-mono text-[9px] tracking-[0.1em] text-magazine-black/30">·</span>
                    <span className="font-mono text-[9px] tracking-[0.1em] text-magazine-black/50">{b.nrr}</span>
                  </div>
                  <p className="text-[12px] text-magazine-black/60 leading-[1.65]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Life : The Founder's Stack ── */}
        <section id="s-life" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Section 06 — Life</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">The Founder’s Stack — Issue 01.</h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-20 leading-[1.75]">Not what founders say they use. What serious European builders in active build or pre-transaction mode actually use — day to day, quarter to quarter.</p>

          <div className="grid md:grid-cols-3 gap-16 mb-24">
            {/* Tools */}
            <div>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 mb-8">5 Tools</p>
              <div className="space-y-8">
                {[
                  { name: 'Linear', desc: 'Product and engineering task management for teams under 20. Replaces Jira without the ceremony.' },
                  { name: 'Supabase', desc: 'Open-source backend on PostgreSQL — portable, auditable, understood by every technical auditor. Built-in audit logging matters for CIFS.' },
                  { name: 'Notion — as Data Room', desc: 'The founders who close fast maintain one clean Notion workspace as their permanent data room. Updated monthly. When a buyer asks, turnaround is hours, not weeks.' },
                  { name: 'Cursor / Windsurf', desc: 'AI-assisted coding with mandatory human review. As leverage, not as a shortcut past engineering discipline.' },
                  { name: 'Lemon Squeezy', desc: 'Merchant-of-record payments. EU VAT handled by the platform. MRR verifiable from day one — a clean revenue trail for CIFS certification.' },
                ].map(tool => (
                  <div key={tool.name} className="border-l border-magazine-black/10 pl-5">
                    <p className="font-sans font-semibold text-magazine-black text-[14px] mb-1">{tool.name}</p>
                    <p className="text-[12px] text-magazine-black/55 leading-[1.6]">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Books + Podcasts */}
            <div>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 mb-8">3 Books</p>
              <div className="space-y-6 mb-12">
                {[
                  { name: 'The SaaS Playbook', author: 'Rob Walling', desc: 'The only bootstrapped SaaS book that discusses exit preparation without assuming venture backing.' },
                  { name: 'Valuation', author: 'Aswath Damodaran', desc: 'The definitive text on corporate valuation. Worth reading before any transaction process begins.' },
                  { name: 'Zero to Sold', author: 'Arvid Kahl', desc: 'Built, bootstrapped, and exited a SaaS product. Honest about what preparation actually requires.' },
                ].map(b => (
                  <div key={b.name}>
                    <p className="font-sans font-semibold text-magazine-black text-[13px]">{b.name}</p>
                    <p className="font-mono text-[9px] tracking-[0.1em] text-magazine-black/35 mb-1">{b.author}</p>
                    <p className="text-[12px] text-magazine-black/55 leading-[1.6]">{b.desc}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 mb-6">2 Podcasts</p>
              <div className="space-y-5">
                {[
                  { name: 'Acquired', host: 'Ben Gilbert & David Rosenthal', desc: 'Business history as strategy school. The Berkshire, TSMC, and Costco episodes are required listening.' },
                  { name: 'Indie Hackers', host: 'Courtland Allen', desc: 'Real founders, real revenue numbers. Filter for bootstrap-to-exit stories.' },
                ].map(p => (
                  <div key={p.name}>
                    <p className="font-sans font-semibold text-magazine-black text-[13px]">{p.name}</p>
                    <p className="font-mono text-[9px] tracking-[0.1em] text-magazine-black/35 mb-1">{p.host}</p>
                    <p className="text-[12px] text-magazine-black/55 leading-[1.6]">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Habits + Place */}
            <div>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 mb-8">1 Habit</p>
              <div className="border-l border-magazine-black/10 pl-5 mb-12">
                <p className="font-sans font-semibold text-magazine-black text-[14px] mb-2">The Monthly P&amp;L Review — Alone, in Writing</p>
                <p className="text-[12px] text-magazine-black/55 leading-[1.65]">Every first Monday of the month. 90 minutes. No accountant. No co-founder. The founder reads the previous month’s P&amp;L and writes a one-page commentary. The founders who do this close their books cleaner and are never surprised by what due diligence finds.</p>
              </div>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 mb-6">1 Place</p>
              <div className="border-l border-magazine-black/10 pl-5 mb-12">
                <p className="font-sans font-semibold text-magazine-black text-[14px] mb-2">Lausanne — Canton de Vaud</p>
                <p className="text-[12px] text-magazine-black/55 leading-[1.65]">40 minutes by train to Geneva. EPFL talent at walking distance. Corporate tax rate of 13.8% in the Canton de Vaud. Legal infrastructure that understands SaaS revenue models. A fiduciaire community that has worked with SaaS since SaaS was a novel concept.</p>
              </div>
              <div className="bg-magazine-ivory p-6">
                <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-accent mb-3">Coming Next — Issue 02 — April 2027</p>
                <p className="font-sans font-bold text-magazine-black text-[18px] mb-3">The Exit Equation.</p>
                <p className="text-[12px] text-magazine-black/55 leading-[1.65] mb-4">The decision, the preparation, the negotiation, and the twelve months that follow. The number that changes your life, and whether it was the right number.</p>
                <a href={`/${locale}/magazine`} className="font-mono text-[9px] tracking-[0.16em] uppercase text-magazine-accent hover:underline">Subscribe →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <AegrynCtaBlock
          title={t('ctaTitle')}
          sub={t('ctaSub')}
          line={t('ctaLine')}
          ctaEstimate={t('ctaEstimate')}
          ctaGrade={t('ctaGrade')}
        />
        </main>
      </div>
    </>
  )
}
