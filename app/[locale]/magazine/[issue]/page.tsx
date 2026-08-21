import { notFound }        from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import type { MagazineIssue } from '@/lib/magazine/types'

import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'
import { ARTICLES_01 }     from '@/content/magazine/issue-01/articles'
import { DATA_01, dealVolumeData, multiplesChartData, gradeDistributionData } from '@/content/magazine/issue-01/data'

import { CoverSection }       from '@/components/magazine/sections/CoverSection'
import { EditorialSection }  from '@/components/magazine/sections/EditorialSection'
import { ListSection }       from '@/components/magazine/sections/ListSection'
import { DataSection }       from '@/components/magazine/sections/DataSection'
import { AegrynCtaBlock }    from '@/components/magazine/AegrynCtaBlock'
import { StatHero }          from '@/components/magazine/StatHero'
import { CifsBars }          from '@/components/magazine/CifsBars'
import { DealVolumeChart }   from '@/components/magazine/charts/DealVolumeChart'
import { MultiplesChart }    from '@/components/magazine/charts/MultiplesChart'
import { GradeDistributionChart } from '@/components/magazine/charts/GradeDistributionChart'
import { HtmlMagazineViewer } from '@/components/magazine/HtmlMagazineViewer'

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

  const t = await getTranslations({ locale, namespace: 'magazine.report' })

  /* ── Article lookups ── */
  const editorial    = ARTICLES_01.find(a => a.slug === 'editorial-why-europe-needs-a-standard')!

  /* ── Editorial paragraphs ── */
  const editorialParagraphs = [
    `We have spent years building, auditing, and structuring digital assets — and observing the same gap: the absence of a standardised, independent reference that both sides of a tech transaction could equally trust. Sellers operate without a certified baseline. Buyers make decisions on unverified information. The market, for all its sophistication, runs on opacity.`,
    `In 2026, the European SaaS M&A market reached its highest recorded volume. AI is fundamentally recomposing how tech value is defined and priced. European buyers are finally asserting themselves in a market long dominated by North American capital. Yet fragmentation and opacity persist — particularly for the 100K–5M€ segment, which represents the majority of deals by volume and the least served segment in terms of infrastructure.`,
    `The European discount — 15 to 25% below comparable US multiples — has narrowed, but has not disappeared. Part of the explanation is structural: a less mature advisory ecosystem, fewer standardised due diligence frameworks, and a cultural reluctance around price transparency. AEGRYN exists to change that.`,
    `The CIFS certification protocol — covering Code integrity, IP ownership, Financial reliability, and Security posture — provides both sides of a transaction with a shared, auditable language. The Grade is not a valuation. It is a certification of transactability: a verified statement that an asset has been prepared, structured, and documented to a standard that makes closing possible.`,
    `This report is not a commissioned market study. It is our reading of the market — drawn from our data, our protocol, our point of view. Each year, as our certification database grows, the data will become more ours. This first edition establishes the baseline. Everything that follows will build on it.`,
  ]

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

      <main>
        {/* ── Cover ── */}
        <CoverSection
          issue={issue}
          stats={DATA_01.coverStats}
          ctaScroll={t('scrollDown')}
        />

        {/* ── Magazine Viewer (HTML inline) ── */}
        {issue.slug === 'issue-01' && (
          <section id="s-viewer" className="bg-[#111]">
            <HtmlMagazineViewer
              htmlSrc="/magazine/issue-01/aegryn-magazine-issue-01_1.html"
              title="Aegryn Magazine Issue 01 — Built to Last"
              label="Issue 01 — Built to Last — January 2027"
            />
          </section>
        )}

        {/* ── Editorial ── */}
        <EditorialSection
          article={editorial}
          paragraphs={editorialParagraphs}
        />

        {/* ── The Market ── */}
        <section id="s-market" className="bg-magazine-white">
          <StatHero
            value="2,698"
            text="SaaS M&A transactions completed in 2025 — a record."
            source="Software Equity Group, 2026"
          />
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
                      <td className="py-4 pr-8 text-magazine-accent font-semibold">{row.median}</td>
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
                  <span className="inline-block w-6 h-0.5 bg-[#2EAF7D]" /> Europe: 3.1x → 4.7x ARR
                </span>
                <span className="flex items-center gap-2 text-magazine-black/50">
                  <span
                    className="inline-block w-6 h-0.5 bg-[#4A90D9] opacity-70"
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg,#4A90D9 0,#4A90D9 4px,transparent 4px,transparent 7px)' }}
                  />
                  US: 4.9x → 6.1x ARR
                </span>
                <span className="flex items-center gap-2 text-magazine-accent font-semibold">
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
        <section id="s-ai" className="bg-magazine-black px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-8">The AI Effect</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-16 max-w-[800px]">
            Artificial Intelligence and the Recomposition of Tech Value
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            {[
              { val: '72%',   label: 'of SaaS M&A targets reference AI (2025)' },
              { val: '12.5x', label: 'median EV/Revenue for AI-native SaaS' },
            ].map(s => (
              <div key={s.val}>
                <p
                  className="font-sans font-bold text-magazine-white tabular-nums"
                  style={{ fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {s.val}
                </p>
                <p className="text-body-mag text-magazine-white/50 mt-4">{s.label}</p>
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
              <div key={a.code} className="border-l-2 border-magazine-accent pl-6 py-2" style={{ background: '#1A1A1A' }}>
                <p className="text-label-mag text-magazine-accent uppercase tracking-[0.12em] mb-2">{a.code}</p>
                <p className="text-h2-mag font-sans font-semibold text-magazine-white mb-2">{a.title}</p>
                <p className="text-body-mag text-magazine-white/55">{a.body}</p>
              </div>
            ))}
          </div>

          <div className="max-w-prose border-t border-magazine-white/10 pt-12">
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-white mb-6">The Commoditisation Trap</h3>
            <p className="text-body-mag text-magazine-white/65 leading-[1.75]">
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
                    <p className="text-label-mag text-magazine-accent uppercase tracking-[0.12em] mb-1">{r.code}</p>
                    <p className="text-h2-mag font-sans font-semibold text-magazine-black">{r.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Deal Watch ── */}
        <ListSection
          id="s-deals"
          label="Deal Watch"
          title="Transactions That Shaped the European Tech Landscape — H1 2026"
          disclaimer={t('disclaimer')}
        >
          <div className="space-y-6">
            {DATA_01.deals.map(deal => (
              <div key={deal.title} className="border-l-2 border-magazine-accent pl-8 py-6 bg-magazine-ivory">
                <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-2">{deal.sector}</p>
                <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-2">{deal.title}</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-1 mb-4">
                  <p className="text-body-mag text-magazine-black/60">{deal.ticket}</p>
                  <p className="text-body-mag text-magazine-black/60">{deal.multiple}</p>
                  <p className="text-label-mag text-magazine-accent uppercase tracking-[0.1em] font-semibold">
                    Est. Grade {deal.grade}
                  </p>
                </div>
                <ul className="space-y-1">
                  {deal.factors.map(f => (
                    <li key={f} className="flex items-start gap-3 text-body-mag text-magazine-black/65">
                      <span className="mt-2 w-1 h-1 rounded-full bg-magazine-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ListSection>

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
                  className="font-sans font-bold text-magazine-accent"
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
        <section id="s-outlook" className="bg-magazine-black px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-8">Perspectives 2027</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-20 max-w-[720px]">
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
                className={`py-16 ${i < arr.length - 1 ? 'border-b border-magazine-white/10' : ''}`}
              >
                <p
                  className="font-sans font-bold text-magazine-white/15 mb-4 tabular-nums"
                  style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {f.num}
                </p>
                <h3 className="text-h2-mag font-sans font-semibold text-magazine-white mb-6 max-w-[600px]">{f.title}</h3>
                <p className="text-body-mag text-magazine-white/60 leading-[1.75] max-w-prose mb-6">{f.body}</p>
                <p className="text-label-mag text-magazine-accent uppercase tracking-[0.1em]">{f.impact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AEGRYN Index ── */}
        <DataSection id="s-index" label="The AEGRYN Index" title="Edition 1 — Proprietary Certification Data">
          <p className="text-body-mag text-magazine-black/50 max-w-prose mb-16 italic">
            {t('indexNote')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:divide-x divide-magazine-black/10">
            {DATA_01.indexMetrics.map(m => (
              <div key={m.label} className="py-10 px-8 first:pl-0 last:pr-0">
                <p
                  className="font-sans font-bold text-magazine-black tabular-nums"
                  style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                >
                  {m.val}
                </p>
                <p className="text-body-mag text-magazine-black/70 mt-3 font-semibold">{m.label}</p>
                <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.08em] mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </DataSection>

        {/* ── CTA ── */}
        <AegrynCtaBlock
          title={t('ctaTitle')}
          sub={t('ctaSub')}
          line={t('ctaLine')}
          ctaEstimate={t('ctaEstimate')}
          ctaGrade={t('ctaGrade')}
        />
      </main>
    </>
  )
}
