import { notFound, redirect } from 'next/navigation'
import { getTranslations }    from 'next-intl/server'
import type { Metadata }      from 'next'
import type { MagazineIssue } from '@/lib/magazine/types'
import { canAccessIssue }     from '@/lib/magazineAccess'

import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'
import { ARTICLES_01 }     from '@/content/magazine/issue-01/articles'
import { DATA_01, dealVolumeData, multiplesChartData, gradeDistributionData } from '@/content/magazine/issue-01/data'

import { MagazineNav }       from '@/components/magazine/MagazineNav'
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

  /* ── Gate d'accès : public > early_access (cookie de déverrouillage) > preview > verrouillé ──
     Une issue non publique n'est accessible que via le lien d'accès anticipé envoyé
     par email (48h avant), ou depuis un environnement non-production (relecture interne). */
  const pad = String(issue.number).padStart(2, '0')
  if (!(await canAccessIssue(pad))) redirect(`/${locale}/magazine`)

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
              issueLabel="Issue 01 | Built to Last | January 2027"
            />
          </section>
        )}

        {/* ── Editorial ── */}
        <section id="s-editorial" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-12">Editorial — Issue 01</p>

          {/* Our conviction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-20">
            <div>
              <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 300, fontStyle: 'italic' }}>
                We refuse to let a solid asset disappear into a poorly prepared transaction.
              </p>
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/30 italic">
                The Aegryn Founding Team — Saint-Sulpice, Switzerland
              </p>
            </div>
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>Aegryn is a Swiss company building what we intend to become the European reference for trusted technology transactions. We certify assets. We facilitate sales. We refuse to rush either.</p>
              <p className="text-magazine-black/50">This magazine is the editorial layer of that mission: a place to tell the stories, share the data, and publish the opinions that the market needs but rarely gets from someone without a conflict of interest.</p>
              <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-magazine-black/30">Aegryn SA · Saint-Sulpice, Canton de Vaud, Switzerland · aegryn.com</p>
            </div>
          </div>

          {/* Three disciplines */}
          <div className="border-t border-magazine-black/10 pt-16 mb-20">
            <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-10"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              Three disciplines.<br /><strong>One goal.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { label: 'Build',       color: 'border-magazine-black text-magazine-black',   desc: 'Designing and engineering technology assets to be documented, certifiable, and transferable. The foundation everything else depends on.' },
                { label: 'Grade',       color: 'border-magazine-accent text-magazine-accent', desc: 'Independent certification across Code, IP, Finance and Security. A score a buyer can trust, because it was earned — not declared.' },
                { label: 'Transaction', color: 'border-magazine-black/40 text-magazine-black/50', desc: 'Confidential transactions between certified sellers and qualified buyers. Supported by institutional standards and a trusted European network.' },
              ].map(d => (
                <div key={d.label}>
                  <p className={`font-mono text-[9px] font-bold tracking-[0.14em] uppercase mb-3 pb-3 border-b-2 ${d.color}`}>{d.label}</p>
                  <p className="text-body-mag text-magazine-black/60 leading-[1.7]">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial letter */}
          <div className="border-t border-magazine-black/10 pt-16 mb-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">From the Founding Team</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                  style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  Built to be<br /><strong>acquired.</strong>
                </p>
                <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                  <p>This magazine began as a question we kept asking ourselves: why do so many solid European technology companies sell for far less than they are worth, or fail to sell at all?</p>
                  <p>The answer was almost never the product. It was preparation. Documentation. The kind of unglamorous, systematic work that founders put off until a buyer is already asking for it.</p>
                  <p>We built Aegryn to change that. This magazine is where we tell the stories, share the data, and publish the opinions that we believe this market needs but rarely gets from someone without a conflict of interest.</p>
                </div>
              </div>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>The people you will meet in these pages built companies without asking anyone&rsquo;s permission. Some sold them well. Some learned the hard way what they should have done differently. A few are still in the middle of it.</p>
                <p>We do not pretend to be neutral. We think the European technology market is undervalued, under-documented, and over-dependent on advisors with a stake in the outcome. We are building a different kind of infrastructure — one where trust is the product, not the pitch.</p>
                <p className="font-semibold text-magazine-black">Built to last.</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/30">The Aegryn Founding Team<br />Saint-Sulpice, Switzerland · January 2027</p>
              </div>
            </div>
          </div>

          {/* Contents */}
          <div className="border-t border-magazine-black/10 pt-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">What is inside</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {[
                { num: '01', label: 'Tech and AI',  title: 'She Quit on a Tuesday',            desc: 'Building from anywhere. What actually changed. The tools founders use. Five honest lessons.' },
                { num: '02', label: 'Build',         title: 'The Habit That Changes Everything', desc: 'The workshop that became a platform. Why we refuse to rush. The bookkeeper who saved six weeks.' },
                { num: '03', label: 'Money',         title: 'Fewer Deals. More Capital.',        desc: 'What buyers actually pay. Stop raising. The metrics that move the number.' },
                { num: '04', label: 'Transaction',   title: 'Five Deals, Five Stories',          desc: 'Who is buying European tech. From first meeting to signature. Getting paid later.' },
                { num: '05', label: 'People',        title: 'The Founders',                      desc: 'The first leap. The second try. The family business. The acquirer\'s portrait.' },
                { num: '06', label: 'Life',          title: 'The Good Life, Earned',             desc: 'European tech cities. The reading list. On building for the long view.' },
              ].map(s => (
                <div key={s.num} className="py-6 border-b border-magazine-black/8 pr-8">
                  <p className="font-mono text-[8px] font-bold tracking-[0.2em] uppercase text-magazine-accent mb-1">{s.num} — {s.label}</p>
                  <p className="font-sans font-semibold text-magazine-black text-[15px] mb-1">{s.title}</p>
                  <p className="text-[12px] text-magazine-black/45">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Market ── */}
        <section id="s-market" className="bg-magazine-ivory">
          <div className="px-6 md:px-[120px] py-10 border-b border-magazine-black/8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-magazine-black/8">
              {[
                { val: '€44.1B', label: 'EU Tech H1 2026',     sub: '~1,740 deals' },
                { val: '+77%',  label: 'EMEA Strategic value', sub: 'through May 2026' },
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
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">Money — H1 2026</p>
            <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4">
              Fewer Deals. More Concentrated Capital.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10 mb-16">
              <p className="text-body-mag text-magazine-black/65 leading-[1.8]">
                European tech funding recovered to 44.1 billion euros in the first half of 2026, but across roughly 1,740 deals — well below the pace of 2024. The market is not shrinking. It is concentrating. The UK raised 18.7 billion across 423 deals alone. Capital is not evenly distributed, and it is not evenly distributed across company stages either.
              </p>
              <div>
                <p className="text-body-mag text-magazine-black/65 leading-[1.8] mb-4">
                  On the M&amp;A side, strategic deal value in EMEA rose 77 percent through May as acquirers chose fewer, higher-conviction targets. The mid-market — where most European founders operate — is living inside that concentration, not above it.
                </p>
                <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em]">
                  Sources: tech.eu H1 2026 Ecosystem Report · FE International Mid-Year 2026 · LSEG
                </p>
              </div>
            </div>

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
                Source — SaaS Capital Index Q2 2026 · ECB Financial Stability Review 2026
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-label-mag uppercase tracking-[0.1em]">
                <span className="flex items-center gap-2 text-magazine-black/50">
                  <span className="inline-block w-6 h-0.5 bg-[#5ADDA4]" /> Europe: 6.5x → 3.8x ARR
                </span>
                <span className="flex items-center gap-2 text-magazine-black/50">
                  <span
                    className="inline-block w-6 h-0.5 bg-[#4A90D9] opacity-70"
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg,#4A90D9 0,#4A90D9 4px,transparent 4px,transparent 7px)' }}
                  />
                  US: 8.0x → 4.1x ARR
                </span>
                <span className="flex items-center gap-2 font-semibold text-magazine-black/60">
                  Gap under 0.3x in 2026 — first time since 2015
                </span>
              </div>
            </div>

            {/* The European Discount */}
            <div className="mt-20 max-w-prose">
              <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
                The European Discount — and Why It's Narrowing
              </h3>
              <p className="text-body-mag text-magazine-black/70 leading-[1.75]">
                For the first time since 2015, US public SaaS no longer trades at a significant premium over EU peers — the gap has closed to under 0.3x ARR (EU median 3.8x vs US median 4.1x, 2026). The SaaS Capital Index itself peaked at 16.9x in 2021, entered 2025 at roughly 7x, fell to a decade-plus low near 3.2x by mid-2026, and has since recovered modestly to ~3.8x. The recovery is selective: identity, security, and vertical SaaS are leading. AI-exposed horizontal SaaS is lagging.
              </p>
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">
                Source — SaaS Capital Index Q2 2026 · ECB Financial Stability Review 2026
              </p>
            </div>
          </div>

          {/* Portrait p62-63 — The number in his head */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                The number in his head<br />wasn&rsquo;t the number<br /><strong>on the table.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">A composite, drawn from patterns across European tech transactions 2024 to 2026.</p>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>He had done the arithmetic a hundred times. Take the yearly recurring revenue, multiply by what he had read online, and there was the number he had been picturing for two years. The first offer came in at less than half of it. Not because his company was bad. Because four things he had never thought about were quietly working against him the whole time.</p>
              </div>
            </div>
            <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>The private mid-market for software companies sits at a median around 4.5 times yearly revenue in 2026, with a range from three to seven times for most transactions. But the gap between the bottom and the top of that range has widened sharply since 2022.</p>
              <p>The variable is almost always preparation. A ten-point improvement in net revenue retention now translates into a 20 to 30 percent valuation increase. Companies that are profitable in 2026 command stronger multiples than fast-growing but unprofitable ones at the same overall efficiency score — a direct reversal of the logic that ruled two years earlier.</p>
              <p>European software companies still trade at a discount of 15 to 25 percent versus comparable US businesses. That gap has narrowed from 30 to 40 percent five years ago, but it has not closed.</p>
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em]">Sources: Livmo SaaS Multiples 2026 · Synergy AI Q1 2026 · SaaSMag Exit Playbook 2026</p>
            </div>
          </div>

          {/* Portrait p73-74 — The year he stopped raising */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                The year he stopped<br />raising and started<br /><strong>building.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">The decision that changed the outcome.</p>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>Year three, month four. He had been in conversations with investors for almost two years — not continuously, but cyclically. Every six months or so, he would update his deck, reach out to a new set of funds, go through several rounds of meetings, and end up at the same place: a term sheet with terms he did not like, from an investor he was not sure he trusted, for a company that was growing steadily and generating more cash each quarter than the one before.</p>
                <p>In month four of year three, a larger fund passed with a note that said, essentially, that the company was too profitable to be interesting as a venture investment. He closed the browser and opened a spreadsheet instead.</p>
              </div>
            </div>
            <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>He modelled the next four years without raising. The spreadsheet showed that if he kept his current growth rate and margins — neither heroic — he would arrive at roughly 4.5 million euros in annual recurring revenue in year seven, with no debt and no dilution. At a median transaction multiple for a bootstrapped software company in his vertical, that would produce a total outcome roughly equivalent to raising a Series A, growing faster, diluting 25 percent, and selling at the same time.</p>
              <p>He stopped raising. He hired a bookkeeper. He opened a data room folder and started filling it with the documents that a buyer would eventually ask for. He did not think of it as exit preparation. He thought of it as good practice.</p>
              <p>Three years later, a strategic acquirer in his sector approached him. He had not put the company on the market. The buyer found him through a certification registry.</p>
              <blockquote className="border-l-2 border-magazine-accent pl-6 mt-2">
                <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;The VC told me the company was too profitable to be interesting to them. I thought that was a problem. It turned out to be the best thing they ever said to me.&rdquo;</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Composite quote — European bootstrapped founder, acquired 2026</p>
              </blockquote>
            </div>
          </div>

          {/* Sector premiums */}
          <div className="mt-0 max-w-prose">
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
              What Buyers Actually Pay, Sector by Sector
            </h3>
            <div className="space-y-0">
              {[
                { sector: 'Cybersecurity', note: 'Regulatory demand under NIS2 is not discretionary. Even mid-tier security tools carry structurally low churn.' },
                { sector: 'Vertical software', note: 'Commands a 25–30% premium over horizontal tools. Depth of integration, higher switching costs, and embedded revenue all contribute.' },
                { sector: 'AI-native products', note: 'The premium goes to proprietary data and defensible architecture — not to products that use standard APIs anyone could replicate in ninety days.' },
                { sector: 'Strategic vs. financial buyers', note: 'Strategic acquirers paid roughly 1.5–2× more than private equity for comparable deals in 2025.' },
              ].map(s => (
                <div key={s.sector} className="py-5 border-b border-magazine-black/8">
                  <p className="font-sans font-semibold text-magazine-black text-[14px] mb-1">{s.sector}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]">{s.note}</p>
                </div>
              ))}
            </div>
            <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">Sources: Windsor Drake 2026 · Synergy AI · ENISA · FE International</p>
          </div>

          {/* Bootstrap path */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-4">The Other Path</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-6"
                style={{ fontSize: 'clamp(22px,3vw,36px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                Stop raising.<br /><strong>Start building to sell.</strong>
              </p>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>For bootstrapped software companies in the three to ten million euro annual revenue range, realistic exit multiples run from three to five times yearly revenue, with equity-backed companies typically commanding a modest premium.</p>
                <p>What separates a three-times outcome from a seven-times outcome comes down to three variables: growth rate, customer retention, and the efficiency score that combines both.</p>
              </div>
              <blockquote className="border-l-2 border-magazine-accent pl-6 mt-8">
                <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;Below fifteen percent growth, most buyers shift from revenue multiples to profit multiples. The company gets priced as a cash-flow asset, not a growth asset. That is not necessarily bad. But you need to know which conversation you are walking into.&rdquo;</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Livmo SaaS Multiples 2026</p>
              </blockquote>
            </div>
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">The Metrics That Move the Number</p>
              <div className="space-y-0">
                {[
                  { metric: 'Customer retention above 100%', note: 'Existing customers spend more each year than the previous year. This single metric now drives a 20–30% valuation premium when strong.' },
                  { metric: 'Gross margin above 70%', note: 'For software, this is the baseline. Below it, buyers start applying different valuation frameworks.' },
                  { metric: 'Growth + profitability, combined', note: 'The efficiency score combining growth rate with profit margin. A ten-point improvement correlates with a meaningful lift in what buyers pay.' },
                  { metric: 'Revenue concentration', note: 'If one customer represents more than 25% of revenue, buyers will ask about it extensively. Better to address this before going to market.' },
                ].map(m => (
                  <div key={m.metric} className="py-5 border-b border-magazine-black/8">
                    <p className="font-sans font-semibold text-magazine-black text-[13px] mb-1">{m.metric}</p>
                    <p className="text-[12px] text-magazine-black/55 leading-[1.65]">{m.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">Sources: SaaSMag Exit Playbook 2026 · Windsor Drake 2026 · Aventis Advisors</p>
            </div>
          </div>

          {/* Compliance Premium Story */}
          <div className="mt-20 pb-0 border-t border-magazine-black/10 pt-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                  style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  The buyers she<br />wasn&rsquo;t <strong>looking for.</strong>
                </p>
                <p className="text-[12px] text-magazine-black/40 italic mb-6">A composite portrait, based on patterns observed in EU RegTech transactions 2023–2026.</p>
                <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                  <p>She had not planned to sell in 2026. She had a list of things to fix first: a second product line to launch, a Paris office to open, a Series A she had been postponing for eighteen months because the terms were never quite right.</p>
                  <p>What changed her timeline was a cold email from a compliance officer at a mid-sized Dutch bank. He had found her software through a regulatory body&rsquo;s approved vendor list — the same list she had spent eight months and roughly forty thousand euros getting onto.</p>
                </div>
              </div>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>The bank needed to demonstrate DORA compliance to its national regulator by the end of the year. Her software — already certified, already documented, already running on two comparable institutions — was one of fewer than a dozen products in Europe that could be deployed fast enough.</p>
                <p>What followed was not what she expected a sale process to look like. There was no competitive auction, no investment banker running the process. There was a conversation about operational fit, a due diligence that took two weeks because her documentation was already in order, and an offer that arrived before she had decided whether she actually wanted to sell.</p>
                <p>The price was above the range she had privately modelled. The reason was simple: her compliance made the buyer&rsquo;s problem disappear. They paid for the solution, not just the software.</p>
                <blockquote className="border-l-2 border-magazine-accent pl-6 mt-4">
                  <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;The VC told me the company was too profitable to be interesting. Three years later, a strategic buyer called it the most interesting asset in the sector. Same company. Different audience.&rdquo;</p>
                  <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Composite quote — European bootstrapped founder, acquired 2026</p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech and AI ── */}
        <section id="s-ai" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Tech and AI</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[800px]">
            What Actually Changed.
          </h2>

          {/* She quit on a Tuesday */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                She quit on<br />a <strong>Tuesday.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6 leading-[1.5]">Drawn from patterns across dozens of solo-founder journeys observed in Aegryn Advisory work, 2022 to 2026.</p>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>No investors. No co-founder. No plan B. Just a laptop, an idea she had been circling for two years, and a generation of tools that let one determined person do what used to require a department.</p>
                <p>She built the first version in six weeks, nights and weekends, then full-time once the fear of staying became larger than the fear of leaving. The product worked. Customers paid.</p>
                <p>This is the quiet revolution nobody put on a cover. Building a real company no longer requires permission, capital, or a team. What it requires is time, a decent laptop, and the willingness to sit with a blank page until something good happens. Three years later, she has a team of seven and a waiting list.</p>
              </div>
            </div>
            <div className="space-y-8">
              <blockquote className="border-l-2 border-magazine-accent pl-6">
                <p className="text-body-mag text-magazine-black/70 leading-[1.75] italic text-[17px]">
                  &ldquo;I used to think I needed a team of ten to build something real. I was wrong. I needed a laptop, four hours of quiet every morning, and the courage to stop asking for permission.&rdquo;
                </p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-4">Composite quote — Aegryn Advisory conversations 2024 to 2026</p>
              </blockquote>
              <div className="bg-magazine-ivory p-6">
                <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-4">Building from a café in Lisbon</p>
                <div className="space-y-3 text-body-mag text-magazine-black/65 leading-[1.75]">
                  <p>He moved from Amsterdam eighteen months ago, told himself it was temporary, and never left. His entire product runs on tools that did not exist five years ago. What used to need a team of eight now needs him, a good pair of headphones, and a city that costs a third of what Amsterdam did.</p>
                  <p>This is not a remote-work trend piece. It is the new default for an entire generation of founders: build somewhere beautiful, because for the first time nothing is stopping you.</p>
                </div>
                <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">Source: Idealista Portugal Rent Index, May 2026</p>
              </div>
            </div>
          </div>

          {/* Switzerland correction */}
          <div className="border border-magazine-black/10 p-8 mb-20 max-w-2xl">
            <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-3">A Correction Worth Making</p>
            <p className="font-sans font-semibold text-magazine-black text-[16px] mb-4">Switzerland has no nomad visa. The real advantages are elsewhere.</p>
            <p className="text-body-mag text-magazine-black/60 leading-[1.75]">Despite what circulates online, Switzerland launched no digital-nomad visa in 2026. Founders building from Lausanne or Geneva use standard residence or business permits. The country&rsquo;s actual advantage is its tax environment and proximity to EPFL and ETH Zurich, two of the world&rsquo;s highest-ranked engineering institutions.</p>
          </div>

          {/* Five tools */}
          <div className="mb-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">What Is Actually On Their Laptops</p>
            <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              Five tools,<br /><strong>one solo founder.</strong>
            </p>
            <p className="text-body-mag text-magazine-black/55 mb-8">Not a sponsored list. What shows up, again and again, on the desktops of founders building alone in 2026.</p>
            <div className="space-y-0">
              {[
                { tool: 'An AI coding assistant',       note: 'Writes the first draft of almost everything. The founder reads it carefully rather than typing from scratch.' },
                { tool: 'A design tool that never sleeps', note: 'Turns a rough sketch into something a customer would pay for, in minutes instead of weeks.' },
                { tool: 'An inbox that answers itself',  note: 'Handles predictable questions so the founder only sees the ones that need a human.' },
                { tool: 'One good notebook',             note: 'Every founder, regardless of how much software they run, still writes the big decisions by hand.' },
                { tool: 'A door that closes',            note: 'Somewhere quiet enough to think, four mornings a week. The one piece of infrastructure nobody talks about.' },
              ].map(t => (
                <div key={t.tool} className="py-5 border-b border-magazine-black/8">
                  <p className="font-sans font-semibold text-magazine-black text-[14px] mb-1">{t.tool}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nine to five + Architecture premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-4">The Freedom Ledger</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-6"
                style={{ fontSize: 'clamp(20px,3vw,34px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                Nine to five<br />is <strong>optional now.</strong>
              </p>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>Ask any founder who built solo in the last two years what actually changed, and none of them mention artificial intelligence first. They mention their mornings. Their ability to take a Tuesday off.</p>
                <p>The tools do the repetitive work, the first draft, the boilerplate, the parts of building a company that used to eat entire weeks. What is left for the founder is the part that was always the actual job: deciding what matters, talking to customers, and having the nerve to ship something before it is perfect.</p>
                <p>Freedom, in this context, is not a slogan. It is a Tuesday afternoon spent somewhere with a laptop open, half-working and half-not, because for the first time the two are not opposites.</p>
              </div>
            </div>
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-6">The Architecture Premium — by element</p>
              <div className="space-y-4">
                {[
                  { code: 'Proprietary training dataset', pct: '+35%', body: 'The data doesn\u2019t exist elsewhere. Non-replicable in 90 days.' },
                  { code: 'Custom fine-tuned model',      pct: '+25%', body: '18 months of customer feedback baked into the model.' },
                  { code: 'EU AI Act conformity',         pct: '+20%', body: 'Legal and technical investment most competitors haven\u2019t made.' },
                  { code: 'Model versioning strategy',    pct: '+10%', body: 'A documented answer for when the underlying LLM updates.' },
                ].map(a => (
                  <div key={a.code} className="border-l-2 border-magazine-black/20 pl-6 py-2 bg-magazine-ivory">
                    <p className="text-label-mag text-magazine-black/50 uppercase tracking-[0.12em] mb-1">{a.pct}</p>
                    <p className="font-sans font-semibold text-magazine-black text-[13px] mb-1">{a.code}</p>
                    <p className="text-[12px] text-magazine-black/60">{a.body}</p>
                  </div>
                ))}
              </div>
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">Source — CB Insights / EU Commission AI Innovation Report 2026 · Aegryn CIFS Protocol S-16</p>
            </div>
          </div>

          {/* Five honest lessons */}
          <div className="border-t border-magazine-black/10 pt-16 mb-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">Five Lessons, Earned the Hard Way</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {[
                { n: '01', lesson: 'You will use the tools wrong at first.', note: 'Everyone does. The founders who win are the ones who notice fast.' },
                { n: '02', lesson: 'Your first version will embarrass you.', note: 'Ship it anyway. That version gets you real feedback.' },
                { n: '03', lesson: 'Alone does not mean lonely.', note: 'Solo founders who last find their community — online or in a shared space nearby.' },
                { n: '04', lesson: 'Rest is part of the work.', note: 'Founders still building three years later are the ones who took real weekends.' },
                { n: '05', lesson: 'Write things down for the you of next year.', note: 'Not for a buyer. For yourself, so you remember why each choice was made.' },
              ].map(l => (
                <div key={l.n} className="py-8 border-b border-magazine-black/8 pr-8">
                  <p className="font-mono text-[8px] font-bold tracking-[0.18em] text-magazine-black/20 mb-3">{l.n}</p>
                  <p className="font-sans font-semibold text-magazine-black text-[14px] mb-2">{l.lesson}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]">{l.note}</p>
                </div>
              ))}
            </div>
          </div>

          <blockquote className="border-l-2 border-magazine-black/20 pl-8 max-w-2xl">
            <p className="text-body-mag text-magazine-black/65 italic leading-[1.8] text-[17px]">
              &ldquo;Nobody warns you how quiet it gets when you leave a company of two thousand people to build something with just yourself. And then, one day, you realise the quiet is the whole point.&rdquo;
            </p>
            <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-4">Composite quote — Aegryn Advisory founder conversations 2024 to 2026</p>
          </blockquote>
        </section>

        {/* ── Perspective ── */}
        <section id="s-perspective" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">The AEGRYN Perspective</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px]">
            The Certification That Changes the Conversation.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
                Not a Valuation. A Certification.
              </h3>
              <div className="space-y-5 text-body-mag text-magazine-black/70 leading-[1.75]">
                <p>The most common question we hear from founders who have just completed their CIFS grade is: does this change what I can ask for? The honest answer is: sometimes directly, and almost always indirectly.</p>
                <p>Directly, a certified asset eliminates a category of buyer uncertainty. The conversation shifts from &ldquo;can we trust these numbers and this documentation&rdquo; to &ldquo;do we want to own this specific company.&rdquo; That is a different and more productive conversation, and it tends to happen faster.</p>
                <p>Indirectly, certification changes who approaches you. There is a growing category of buyer — particularly in regulated industries — who searches for certified assets specifically, because the certification reduces their own post-acquisition remediation cost and timeline.</p>
                <p>We grade assets because we believe verification is the foundation of a fair transaction. A grade makes the process faster, the conversations better, and the outcomes more predictable.</p>
              </div>
              <p className="text-body-mag text-magazine-black/50 leading-[1.75] mt-4 italic">
                Less than 25% of submitted assets pass the certification threshold.
              </p>
            </div>
            <div>
              <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
                Not a Valuation. A Certification.
              </h3>
              <div className="space-y-5 text-body-mag text-magazine-black/70 leading-[1.75]">
                <p>The CIFS methodology assesses four dimensions: code quality and technical documentation, intellectual property ownership and assignment, financial record completeness and accuracy, and security posture and compliance. Each is scored through independent review, not self-assessment.</p>
                <p>In the first half of 2026, the most common finding across initial reviews was incomplete IP assignment documentation — contractor agreements that did not explicitly transfer code ownership to the company. This issue appeared in 64 percent of first submissions. It is almost always fixable. It takes, on average, eleven weeks to resolve properly once identified.</p>
                <p>The second most common finding was financial statements that had not been independently reviewed for more than 24 months. Buyers apply a discount for the uncertainty this creates.</p>
              </div>
              <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">Aegryn CIFS Protocol v3.0 · Aegryn Transaction Desk H1 2026 observations</p>
            </div>
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
                { pct: '64%', label: 'IP Ownership Gaps', note: 'Incomplete contractor agreements not explicitly transferring code ownership.' },
                { pct: '58%', label: 'ARR Not Verifiable', note: 'Financial statements not independently reviewed in the last 24 months.' },
                { pct: '42%', label: 'No Pentest on Record', note: 'No documented independent security assessment.' },
                { pct: '35%', label: 'RGPD / AI Act Risk', note: 'Regulatory compliance gaps identified during review.' },
                { pct: '28%', label: 'Founder Dependency', note: 'Operational concentration creating structural transition risk.' },
              ].map((r, i) => (
                <div key={r.label} className="flex items-start gap-8 py-6 border-b border-magazine-black/10">
                  <span
                    className="font-sans font-bold text-magazine-black/20 tabular-nums shrink-0"
                    style={{ fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
                  >
                    0{i + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-label-mag text-magazine-black/50 uppercase tracking-[0.12em] mb-1">{r.pct} of initial submissions</p>
                    <p className="text-h2-mag font-sans font-semibold text-magazine-black mb-1">{r.label}</p>
                    <p className="text-[12px] text-magazine-black/50 leading-[1.6]">{r.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">
              Source — CIFS Protocol v3.0, Issue 01 Base Reference (multi-select — assets can trigger more than one reason)
            </p>
          </div>
        </section>

        {/* ── Build ── */}
        <section id="s-build" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Build</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">
            The Habit That Changes Everything.
          </h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-16 leading-[1.75] italic">
            Nobody builds a company thinking about the day they will sell it. But the habits from year one are exactly what a buyer checks in year eight.
          </p>

          {/* Stats banner */}
          <div className="grid grid-cols-2 gap-px bg-magazine-black/8 mb-20">
            <div className="bg-magazine-ivory p-10">
              <p className="font-sans font-bold text-magazine-black tabular-nums" style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 800 }}>−30%</p>
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/50 mt-3">Typical valuation cut for a company that enters a sale process unprepared</p>
              <p className="text-[12px] text-magazine-black/40 mt-1">It is almost never about the product.</p>
            </div>
            <div className="bg-magazine-ivory p-10">
              <p className="font-sans font-bold text-magazine-accent tabular-nums" style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 800 }}>+28%</p>
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-magazine-black/50 mt-3">Typical premium when properly reviewed and certified before going to market</p>
              <p className="text-[12px] text-magazine-black/40 mt-1">Source: Aegryn CIFS Protocol v3.0</p>
            </div>
          </div>

          {/* Portrait — The Habit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                A decade of small,<br />boring,<br /><strong>correct decisions.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">Drawn from patterns across founder journeys observed in Aegryn Advisory work, 2022 to 2026.</p>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>He did not set out to build a company that would sell well. He set out to build one that would not embarrass him. So from the very first month, every contractor signed a proper agreement. Every invoice got filed the same day. It felt excessive at the time — a single person running a company nobody had heard of, filing paperwork like it mattered.</p>
                <p>Ten years later, it mattered enormously. When a buyer&rsquo;s team opened his records, they found exactly what they expected to find: nothing missing, nothing to explain away.</p>
              </div>
            </div>
            <div>
              <blockquote className="border-l-2 border-magazine-accent pl-6 mb-8">
                <p className="text-body-mag text-magazine-black/70 leading-[1.75] italic text-[17px]">
                  &ldquo;The due diligence team said they had never seen a data room this clean. I thought it was just how you ran a serious business.&rdquo;
                </p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-4">Composite quote — European founder, acquired 2026</p>
              </blockquote>
              <blockquote className="border-l-2 border-magazine-black/20 pl-6">
                <p className="text-body-mag text-magazine-black/60 leading-[1.75] italic">
                  &ldquo;Write everything down. Not for the buyer. For yourself. The moment you can hand the company to someone else for two weeks and nothing breaks — that is when it is worth something.&rdquo;
                </p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-4">Composite quote — European founder, acquired 2026</p>
              </blockquote>
            </div>
          </div>

          {/* Portrait — He Built Fast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                He built fast.<br />Then he had to<br /><strong>slow down and check.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">A composite, reflecting a pattern seen repeatedly in Aegryn technical reviews.</p>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>He built the first version of his product almost entirely with AI coding tools, in a fraction of the time a small team would have needed five years earlier. It worked. Customers paid. He was, understandably, proud of the pace.</p>
                <p>A buyer&rsquo;s technical reviewer found something he had not thought to check: large sections of the product had never been looked at by a human after the AI wrote them. Nothing was broken, exactly, but nobody could confidently explain why certain choices had been made. That made the buyer nervous about what else might be hidden.</p>
                <p>The fix took twelve weeks: reviewing the important parts, writing down the reasoning, adding basic tests. Not glamorous work. But it turned a fast, fragile product into a fast, trustworthy one. The difference showed up directly in what he was eventually paid.</p>
              </div>
            </div>
            <div>
              <div className="bg-magazine-ivory p-6 mb-6">
                <p className="font-sans font-semibold text-magazine-black text-[13px] mb-2">The simple habit</p>
                <p className="text-[12px] text-magazine-black/60 leading-[1.65]">Once a week, actually read the code the tools wrote. Write one sentence explaining why each major decision was made. That is most of what a technical reviewer needs to find.</p>
              </div>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>The founders who navigate a technical review well have almost always done one thing consistently: they have kept a short document explaining why important architectural decisions were made. Not a formal spec. One sentence per decision. Written at the time, not reconstructed later.</p>
                <p>The buyers who do the most thorough technical reviews are not looking for perfection. They are looking for evidence that the person who built it understood what they were building. That evidence is surprisingly rare.</p>
              </div>
            </div>
          </div>

          {/* The Bookkeeper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                The bookkeeper<br />who saved<br /><strong>six weeks.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">A composite, drawn from Aegryn Advisory client patterns.</p>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>She hired a proper bookkeeper in year two, long before she could comfortably afford it. Every friend told her to wait. She had watched a previous employer spend months untangling records during a sale, and she never wanted to live through that.</p>
                <p>For six years, her books closed within 48 hours of every month-end: clean, consistent, boring in the best possible way.</p>
              </div>
            </div>
            <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>When her sale process began, the buyer&rsquo;s team reviewed three years of records in four days. On a comparable deal that same quarter, a founder without this habit spent six weeks doing the same work under far more pressure.</p>
              <p>The bookkeeper cost her roughly what a nice dinner costs, once a month, for six years. The time it saved at the finish line was worth vastly more than that. The peace of mind along the way was worth it on its own.</p>
            </div>
          </div>

          {/* The Three Documents */}
          <div className="mb-20 pb-20 border-b border-magazine-black/10">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">What Closes Deals Faster Than Anything Else</p>
            <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-10"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              The three documents<br />that close <strong>deals.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  n: '01',
                  title: 'A signed IP assignment for every contractor',
                  body: 'Not an NDA. Not a service agreement. A document that explicitly transfers ownership of whatever they built to the company. This is the single most common gap in European mid-market software transactions.',
                },
                {
                  n: '02',
                  title: 'Three years of independently reviewed monthly financials',
                  body: 'Not annual accounts. Not management accounts prepared by the founder. Monthly statements reviewed by someone external, with margins and customer metrics visible by period. This answers the buyer\'s first question in the first afternoon of due diligence.',
                },
                {
                  n: '03',
                  title: 'A one-page technical architecture summary',
                  body: 'Written by the founder or lead engineer: what the product is built on, what it depends on, and what would change if any dependency changed. The best versions are three pages or fewer, written for a non-technical reader.',
                },
              ].map(d => (
                <div key={d.n}>
                  <p className="font-sans font-bold text-magazine-black/10 tabular-nums mb-4" style={{ fontSize: 'clamp(40px,5vw,64px)', lineHeight: 1, fontWeight: 800 }}>{d.n}</p>
                  <p className="font-sans font-semibold text-magazine-black text-[14px] mb-3">{d.title}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]">{d.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Art of the Data Room */}
          <div className="mb-20 pb-20 border-b border-magazine-black/10">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">How to Build One That Works</p>
            <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              The art of the<br /><strong>data room.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-8">
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>A data room tells a buyer something about a company before a single document is opened. A well-organised data room — clear folder structure, documents named consistently, no broken links, nothing missing — signals a management team that runs things properly.</p>
                <p>A data room with 200 randomly named files in a flat folder structure signals the opposite.</p>
                <div className="bg-magazine-ivory p-6 mt-4">
                  <p className="font-sans font-semibold text-magazine-black text-[13px] mb-3">The standard structure that works</p>
                  {[
                    { folder: 'Financials', content: 'Monthly P&L for three years, plus any signed contracts with lenders.' },
                    { folder: 'Customers', content: 'Full customer list with ARR by client, plus copies of signed contracts with renewal terms.' },
                    { folder: 'Technology', content: 'Architecture summary, code ownership agreements, and any certifications or security reviews.' },
                    { folder: 'Legal', content: 'Shareholders agreement, option pool documentation, and corporate registration.' },
                  ].map(f => (
                    <div key={f.folder} className="py-3 border-b border-magazine-black/8 last:border-0">
                      <p className="font-sans font-semibold text-magazine-black text-[12px]">{f.folder}</p>
                      <p className="text-[11px] text-magazine-black/50 leading-[1.5] mt-0.5">{f.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p><strong className="text-magazine-black">How early?</strong> Today. Not because a buyer is waiting, but because the act of building a proper data room reveals every gap in how the company is documented. Finding those gaps when there is no buyer waiting costs nothing. Finding them in week two of due diligence costs trust, time, and often money.</p>
                <p><strong className="text-magazine-black">How detailed?</strong> Complete and well-labelled, but not exhaustive in a way that creates confusion. A buyer needs to be able to find what they are looking for in under ten minutes. If the data room requires a guide to navigate, it is too complex.</p>
                <p><strong className="text-magazine-black">Who should see it?</strong> Access should be logged and controlled from the moment the room is created. Every person who opens a document should be tracked.</p>
                <blockquote className="border-l-2 border-magazine-accent pl-6 mt-6">
                  <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;The best data rooms I have seen were built by founders who started them two years before they needed them. The worst were built in three weeks while the buyer was waiting.&rdquo;</p>
                  <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Composite observation — Aegryn Transaction Desk, H1 2026</p>
                </blockquote>
                <p className="text-body-mag text-magazine-black/65 leading-[1.75] mt-2">The gap between those two experiences is preparation. Not intelligence, not capital, not the quality of the product. Preparation — which is the one variable that is entirely within a founder&rsquo;s control from day one.</p>
              </div>
            </div>
          </div>

          {/* POV — Stop Raising */}
          <div className="bg-magazine-navy p-10 md:p-16">
            <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-accent mb-4">Aegryn Point of View</p>
            <p className="font-sans font-bold text-white leading-[0.86] mb-8"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              A tech asset doesn&rsquo;t have<br />to be a startup.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 text-body-mag text-white/70 leading-[1.75]">
                <p>Most conversations about technology assets assume a startup — young, venture-adjacent, growing fast. We see something different every week: family businesses, small industrial companies, service firms, quietly digitising themselves into something transferable and valuable.</p>
                <p>We think this is the more interesting story in European tech right now. Not the next unicorn, but the third-generation manufacturer whose granddaughter built a client portal. Not the funding round, but the fiduciaire who insisted on clean books from month one.</p>
              </div>
              <div className="space-y-4 text-body-mag text-white/70 leading-[1.75]">
                <p>The unglamorous version of building turns out to be exactly the version that sells well. Companies built with systematic care — documented, clean, transferable — are the ones that survive a serious buyer&rsquo;s review, that close faster, and that command the premium.</p>
                <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-white/30">Aegryn Founding Team — Saint-Sulpice, Switzerland</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Transaction : Deal Watch ── */}
        <section id="s-transaction" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Transaction — Deal Watch H1 2026</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">Five Deals. Five Completely Different Stories.</h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-16 leading-[1.75]">All real. Names, companies, and identifying details anonymised or inferred from public registry data. Multiples confirmed through documented processes only. The deal that did not close is included because it is the most instructive of all.</p>

          {/* Deal 01 & 02 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
            <div className="border-b border-magazine-black/8 pb-8">
              <p className="font-mono text-[8px] font-bold tracking-[0.18em] uppercase text-magazine-accent mb-2">Deal 01</p>
              <p className="font-sans font-semibold text-magazine-black text-[18px] leading-[0.92] mb-4">The certification<br /><strong>that closed it.</strong></p>
              <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-3">Legal automation software, DACH region. The certification review completed eighteen months before the sale process began. When the buyer&rsquo;s due diligence team arrived, the data room was already structured to answer their questions before they asked them. The deal closed in nine weeks.</p>
              <p className="font-mono text-[8px] font-semibold text-magazine-black/40 tracking-[0.12em] uppercase">Outcome: agreed above initial guidance</p>
            </div>
            <div className="border-b border-magazine-black/8 pb-8">
              <p className="font-mono text-[8px] font-bold tracking-[0.18em] uppercase text-magazine-accent mb-2">Deal 02</p>
              <p className="font-sans font-semibold text-magazine-black text-[18px] leading-[0.92] mb-4">The search fund<br /><strong>that moved quietly.</strong></p>
              <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-3">Property management software, France. A search fund identified the company through a referral network rather than a formal process. The founder had not planned to sell for another two years. The buyer&rsquo;s speed and certainty made the difference.</p>
              <p className="font-mono text-[8px] font-semibold text-magazine-black/40 tracking-[0.12em] uppercase">Outcome: below market median, but clean and certain</p>
            </div>
          </div>

          {/* Deal 03–05 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-10">
              <div>
                <p className="font-mono text-[8px] font-bold tracking-[0.18em] uppercase text-magazine-accent mb-2">Deal 03</p>
                <p className="font-sans font-semibold text-magazine-black text-[17px] leading-[0.92] mb-4">The patient<br /><strong>buyer.</strong></p>
                <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-2">HR software, Benelux. A family office had been tracking the company for three years before making contact. They were not in a hurry. That patience produced a more favourable outcome for both parties than a competitive process would have.</p>
                <p className="font-mono text-[8px] font-semibold text-magazine-black/40 tracking-[0.12em] uppercase">Outcome: at market median, with a generous earn-out structure</p>
              </div>
              <div>
                <p className="font-mono text-[8px] font-bold tracking-[0.18em] uppercase text-magazine-accent mb-2">Deal 04</p>
                <p className="font-sans font-semibold text-magazine-black text-[17px] leading-[0.92] mb-4">The compliance<br /><strong>premium.</strong></p>
                <p className="text-body-mag text-magazine-black/60 leading-[1.75]">Fintech RegTech, EU-wide. Full regulatory compliance eliminated the buyer&rsquo;s own post-acquisition remediation cost. That single factor drove the final price above the range the seller had initially modelled.</p>
              </div>
            </div>
            <div>
              <p className="font-mono text-[8px] font-bold tracking-[0.18em] uppercase text-[#c0392b] mb-2">Deal 05 — No Close</p>
              <p className="font-sans font-semibold text-magazine-black text-[17px] leading-[0.92] mb-4">The deal<br /><strong>that taught the most.</strong></p>
              <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-3">AI software, Iberia. Letter of intent signed. Technical review found large sections of core product written by AI and never reviewed by a human. The buyer walked. The founder spent twelve weeks fixing it. A second process opened six months later.</p>
              <p className="font-mono text-[8px] font-semibold text-magazine-black/40 tracking-[0.12em] uppercase">Outcome: no close — technical risk unresolved in the buyer&rsquo;s timeline</p>
            </div>
          </div>

          {/* PE partner quote */}
          <blockquote className="bg-magazine-navy p-10 mb-16">
            <p className="text-body-mag text-white/80 leading-[1.75] italic mb-4">
              &ldquo;He reads approximately two hundred deal summaries per year. He takes forty first meetings. He acquires three companies. The 160 he never meets are not worse businesses. They failed to make the right impression on the two-page summary his analyst read in four minutes.&rdquo;
            </p>
            <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/35">Composite portrait of a PE mid-market fund partner — Aegryn Advisory observations 2024 to 2026</p>
          </blockquote>

          {/* Process + Earn-out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">From First Meeting to Signature</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                style={{ fontSize: 'clamp(22px,3vw,36px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                What actually happens,<br /><strong>week by week.</strong>
              </p>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>The first conversation is rarely decisive. The buyer is pattern-matching against dozens of companies they have seen. What makes a founder memorable is having a clear answer to the three questions every buyer is actually asking: can I trust the revenue, can I run this without the founder, and is there a real reason I should pay more than I would for something similar?</p>
                <p>The letter of intent arrives after roughly four to eight weeks of conversation. The exclusivity period that follows is when the real work happens. Due diligence typically runs eight to twelve weeks.</p>
                <p>The founders who report the best experience share one habit in common: they started preparing the documentation twelve to eighteen months before the conversation began. By the time a buyer asked for something, it was already ready.</p>
              </div>
            </div>
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">Getting Paid Later</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                style={{ fontSize: 'clamp(22px,3vw,36px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                Getting paid<br /><strong>later.</strong>
              </p>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>An earn-out is a payment structure where part of the price is paid after the transaction closes, contingent on the business hitting agreed targets. It lets a buyer pay more for future performance they cannot yet verify, and it lets a seller prove the business is worth what they claimed.</p>
                <p>The risks are real. Targets can be set in ways that are difficult to achieve after the sale, especially if the founder is no longer in full operational control. The metrics used to calculate the earn-out should be simple, objective, and within the founder&rsquo;s ability to influence.</p>
                <p>The founders who navigate earn-outs well have one advantage: they negotiated the terms before they signed, not after.</p>
              </div>
              <blockquote className="border-l-2 border-magazine-accent pl-6 mt-8">
                <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;Negotiate the earn-out as carefully as you negotiate the headline number. You are writing a second contract, with a different set of risks.&rdquo;</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Composite observation — Aegryn Transaction Desk, 2026</p>
              </blockquote>
            </div>
          </div>

          {/* Earn-out real case */}
          <div className="mt-16 border-t border-magazine-black/10 pt-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Real Case, Explained Plainly</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                  style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  What an earn-out<br />actually <strong>feels like.</strong>
                </p>
                <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                  <p>He sold his company for what looked like a good headline number. A third was paid on closing. A third would be paid twelve months later if the company hit its annual recurring revenue target. A final third came at month 24, contingent on maintaining the customer retention rate above a specified threshold.</p>
                  <p>The earn-out was designed around metrics he could influence. That mattered enormously.</p>
                </div>
              </div>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>In the 18 months after closing, the new parent company changed the product roadmap twice, replaced his head of sales, and moved the customer success team to a shared services model. The earn-out targets survived two of those three changes. The third — losing his sales lead — put the month-24 threshold at risk.</p>
                <p>He hit it, narrowly. What he learned was that earn-outs work when the targets are simple, measurable, and within the seller&rsquo;s control after the transaction closes. They fail when any of those three conditions is missing.</p>
                <div className="bg-magazine-ivory p-5 mt-2">
                  <p className="font-sans font-semibold text-magazine-black text-[13px] mb-2">The principle that held</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]">Once the letter of intent is signed and exclusivity begins, the founder&rsquo;s leverage drops sharply. The earn-out terms you accept at that point are the ones you will live with for two years. Negotiate them before you need to.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Buyers ── */}
        <section id="s-buyers" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Transaction — Who Is Buying</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px]">
            Who Is Buying European Tech in 2027.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 mb-16">
            {[
              { type: 'Strategic acquirers', desc: 'Represented roughly 62 percent of lower mid-market software transactions in 2025. They pay more because they have revenue synergies a financial buyer cannot access.' },
              { type: 'Private equity funds', desc: 'Buy on the basis of financial engineering and operational improvement. Their investment committee meets every two weeks. Eleven minutes to present. Decisions made before the full report is read.' },
              { type: 'Family offices', desc: 'Move more slowly and more quietly. They are often the best buyer for a founder who values continuity over speed. They track companies for years before making contact.' },
              { type: 'Search funds', desc: 'A small but growing category: entrepreneurially-minded buyers who acquire a single company to operate themselves. Often more flexible on price in exchange for continuity and knowledge transfer.' },
            ].map((b, i) => (
              <div key={b.type} className={`py-8 border-b border-magazine-black/8 ${i % 2 === 0 ? 'md:border-r md:pr-12' : 'md:pl-12'}`}>
                <p className="font-sans font-bold text-magazine-black/15"
                  style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mt-4 mb-3">{b.type}</h3>
                <p className="text-body-mag text-magazine-black/60 leading-[1.75]">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Build — The Year Before ── */}
        <section id="s-outlook" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Build — The Year Before</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-8 max-w-[720px]">
            Twelve months that determine the price.
          </h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-16 leading-[1.75]">What follows is a distilled account of how a prepared founder uses the twelve months before a transaction. It is a composite of several real processes observed by Aegryn between 2023 and 2026. Not every step applies to every situation. The sequence, however, holds consistently.</p>

          <div className="space-y-0 mb-20">
            {[
              {
                num: '01', label: 'Months 1–3',
                title: 'Audit the ownership structure',
                body: 'Find every contractor who ever touched the product and confirm the agreement transferring their work to the company. This is the step most founders skip and most buyers ask about. It is almost always fixable, but it takes time to track down former contributors and obtain the right signatures.',
              },
              {
                num: '02', label: 'Months 4–6',
                title: 'Commission an independent financial review',
                body: 'If the last one was more than eighteen months ago. Clean and consistent monthly financials for the past three years are one of the strongest signals a buyer receives about how a company is managed. The cost of the review is small relative to what it protects in the final offer.',
              },
              {
                num: '03', label: 'Months 7–9',
                title: 'Document the technical architecture',
                body: 'Not for a buyer — for yourself first. Write down why each major component was built the way it was, what it depends on, and what would need to change if the core AI or infrastructure provider changed their pricing or API. This documentation saves weeks in due diligence later.',
              },
              {
                num: '04', label: 'Months 10–12',
                title: 'Organise the data room itself',
                body: 'Create a clear folder structure. Add a one-page executive summary that answers the buyer\'s first three questions before they ask them. Index every document so a reviewer can navigate it without guidance. The data room is the first impression.',
              },
            ].map((f, i, arr) => (
              <div key={f.num} className={`py-12 grid grid-cols-[auto_1fr] gap-10 items-start ${i < arr.length - 1 ? 'border-b border-magazine-black/10' : ''}`}>
                <div>
                  <p className="font-sans font-bold text-magazine-black/15 tabular-nums"
                    style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>
                    {f.num}
                  </p>
                  <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-magazine-black/35 mt-2">{f.label}</p>
                </div>
                <div>
                  <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-4">{f.title}</h3>
                  <p className="text-body-mag text-magazine-black/60 leading-[1.75] max-w-prose">{f.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* The Data Room — what it actually contains */}
          <div className="border-t border-magazine-black/10 pt-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">The Document That Closes Deals</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                  style={{ fontSize: 'clamp(22px,3vw,36px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  What a data room<br />actually <strong>contains.</strong>
                </p>
                <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                  <p>The term &ldquo;data room&rdquo; sounds more intimidating than it is. At its core, it is an organised folder with documents that answer the questions a serious buyer will eventually ask. The founders who do well in a sale process are the ones who build this folder long before anyone asks for it.</p>
                  <p>There are four categories every buyer looks at, in roughly this order of importance: the financials, the customer contracts and revenue documentation, the technical architecture and code ownership, and the legal structure including shares, options, and any outstanding claims.</p>
                  <p>The financials are usually the first thing opened. A buyer&rsquo;s first question is: can I trust this revenue? The second is: what is the cost of producing it? If those two questions can be answered quickly and clearly, the rest of the process tends to go faster.</p>
                </div>
              </div>
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                  style={{ fontSize: 'clamp(22px,3vw,36px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  The buyer&rsquo;s first<br />48 hours with your<br /><strong>data room.</strong>
                </p>
                <p className="text-[12px] text-magazine-black/40 italic mb-6">A composite portrait — PE fund partner and deal team, based on Aegryn Advisory buy-side observations.</p>
                <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                  <p>The data room opens on a Tuesday morning. The analyst downloads everything in the financial folder first. He is looking for three things: the trend in gross margin over 24 months, the customer churn rate in the last four quarters, and whether the revenue is genuinely recurring or lumpy.</p>
                  <p>By Thursday, the technical reviewer has a first look at the code and architecture documentation. In a well-documented data room, the reviewer can build a mental model of the product&rsquo;s defensibility in two hours.</p>
                </div>
                <div className="bg-magazine-white border border-magazine-black/8 p-6 mt-8">
                  <p className="font-sans font-semibold text-magazine-black text-[13px] mb-2">The week-one signal</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]">The pace of week one in due diligence is the strongest predictor of deal outcome. Founders who answer questions in hours, not days, close faster and at higher prices. Preparation is speed. Speed is trust. Trust is price.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AEGRYN Index ── */}
        <section id="s-index" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Aegryn Index — Edition I</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">What we tracked and what it showed.</h2>
          <p className="text-label-mag text-magazine-black/35 uppercase tracking-[0.1em] mb-12">Aegryn Transaction and Grade Desks · H1 2026</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>For this first edition of the Aegryn Index, we tracked a selection of European technology transactions in the sectors we work in most actively: B2B software, RegTech, HealthTech, and software-enabled services. We are not claiming statistical significance. We are sharing the patterns we observed across the processes we participated in or closely followed in the first half of 2026.</p>
              <p>Two patterns held consistently enough that we are prepared to state them as working hypotheses. The first: time-to-close correlates more strongly with data room preparation quality than with any other observable variable we tracked. The second: the largest discounts from initial offer to final signed price occurred in companies where the financial statements had not been independently reviewed in the 24 months preceding the sale.</p>
            </div>
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>The CIFS methodology assesses four dimensions: code quality and technical documentation, intellectual property ownership and assignment, financial record completeness and accuracy, and security posture and compliance. Each is scored through independent review, not self-assessment. The final grade reflects what a reviewer found, not what the founder believes to be true.</p>
              <p>In the first half of 2026, the most common finding across initial reviews was incomplete IP assignment documentation — contractor agreements that did not explicitly transfer code ownership to the company. This issue appeared in 64 percent of first submissions. The cost of not fixing it is a discount in the final offer, a slower process, or both.</p>
              <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-magazine-black/30">Aegryn CIFS Protocol v3.0 · Aegryn Transaction Desk H1 2026 observations</p>
            </div>
          </div>

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

        {/* ── People ── */}
        <section id="s-people" className="bg-magazine-ivory px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">People</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">The founders, the acquirers, and the people who built something worth buying.</h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-20 leading-[1.75] italic">Their stories, told as closely as we were allowed to tell them.</p>

          {/* Portrait 1 — She had no plan B */}
          <div className="grid md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                She had<br />no <strong>plan B.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">Drawn from patterns across Aegryn Advisory founder conversations, 2022 to 2026.</p>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>No investor. No co-founder. No safety net. Just eleven months of savings, a laptop, and an idea she had been circling for two years without acting on it.</p>
                <p>The decision to leave her job was not brave. It was arithmetic. She had been unhappy for long enough that the discomfort of staying had become larger than the fear of failing. That is how most of these decisions actually work.</p>
              </div>
              <blockquote className="border-l-2 border-magazine-accent pl-6 mt-8">
                <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;Everyone told me to wait for the right moment. There is no right moment. There is only the moment you stop waiting.&rdquo;</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Composite quote — Aegryn Advisory 2024</p>
              </blockquote>
            </div>
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p className="font-sans font-semibold text-magazine-black text-[18px] leading-[0.94] mb-6">The first eighteen months.</p>
              <p>The first client paid late. The second one didn&rsquo;t pay at all. She kept going because the alternative — going back to a salaried job she&rsquo;d already left — felt worse than the fear of running out of money.</p>
              <p>What changed everything wasn&rsquo;t a big break. It was a small one: a single enterprise client who referred three more. Word of mouth built what no marketing budget could have. Eighteen months in, she hired her first employee — not because she could easily afford it, but because she couldn&rsquo;t do the work alone anymore.</p>
              <p>Five years later, the company she built without a safety net has a team of twelve and a buyer&rsquo;s attention. She still remembers the exact balance in her bank account the week she almost quit. She uses that number now as a compass, not a warning.</p>
            </div>
          </div>

          {/* Portrait 2 — His first company died quietly */}
          <div className="grid md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                His first company<br />died <strong>quietly.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">Composite portrait — European founder, two companies, 2016 to 2026.</p>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>No press release. No dramatic collapse. It just ran out of customers, then out of runway, then out of reasons to continue. He shut it down himself, told his five employees in person, and spent the following year and a half working for someone else while he paid off what the company owed him personally.</p>
                <p>&ldquo;The first time, I built what I thought was smart. The second time, I built what people asked me for. That is the whole difference.&rdquo;</p>
              </div>
            </div>
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>The second company started from a single observation: the exact problem his old customers kept complaining about, that he had never fixed because he was too busy building features nobody had asked for.</p>
              <p>He kept the team deliberately small for the first two years — three people — and refused every investor meeting until the product was already profitable. When he finally raised capital, it was on his terms, at a valuation that reflected leverage rather than desperation.</p>
              <p>The company sold four years later. Not for a headline-making sum, but for enough that he never has to explain the first failure in a job interview again.</p>
              <div className="bg-magazine-white border border-magazine-black/8 p-5 mt-4">
                <p className="font-sans font-semibold text-magazine-black text-[13px] mb-2">The pattern</p>
                <p className="text-[12px] text-magazine-black/55 leading-[1.65]">Most successful founders have at least one earlier company that did not work. The story the market tells is the second act. The lesson is almost always in the first one.</p>
              </div>
            </div>
          </div>

          {/* Portrait 3 — Workshop to Platform */}
          <div className="grid md:grid-cols-2 gap-16 mb-20 pb-20 border-b border-magazine-black/10">
            <div>
              <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                Her grandfather built<br />the workshop.<br />She built the <strong>platform.</strong>
              </p>
              <p className="text-[12px] text-magazine-black/40 italic mb-6">Third-generation founder, family manufacturing group, technology transition 2020 to 2026.</p>
            </div>
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>The business had run the same way for forty years. Reliable, profitable, entirely on paper. She joined with an engineering degree and one uncomfortable question: what happens to this company in fifteen years if nothing changes?</p>
              <p>She started with the smallest, least glamorous project possible — digitising the order book. It worked. That single win bought her the trust to go further. Predictive maintenance. A client portal. A data layer the old business had never had.</p>
              <p>The company is worth more today than at any point in its history. Not because it makes something different, but because a buyer can now see, verify, and trust everything it does. The workshop still exists. It runs on better information.</p>
              <blockquote className="border-l-2 border-magazine-accent pl-6 mt-4">
                <p className="text-body-mag text-magazine-black/65 italic leading-[1.75]">&ldquo;I did not want to save the company from my father. I wanted to build the version of it that exists for another forty years.&rdquo;</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/35 mt-3">Composite quote — third-generation European founder</p>
              </blockquote>
            </div>
          </div>

          {/* Portrait 4 — The Acquirer */}
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">A Composite Portrait</p>
              <p className="text-[12px] text-magazine-black/40 italic mb-4">PE mid-market fund partner, active in EU tech transactions. Aegryn Advisory observations 2024 to 2026.</p>
              <p className="font-sans font-bold text-magazine-black leading-[0.86] mb-6"
                style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                Two hundred<br />summaries.<br /><strong>Three acquisitions.</strong>
              </p>
            </div>
            <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
              <p>He reads approximately 200 deal summaries per year. He takes 40 first meetings. He acquires three companies. The 160 he never meets are not worse businesses — they failed to make the right impression on the two-page summary his analyst read in four minutes.</p>
              <p>His investment committee meets every two weeks. A partner has eleven minutes to present a dossier. Seven for the thesis. Three for the financials. One for questions. The 200-page due diligence report is never read in full before the committee vote.</p>
              <p>What matters is what the presenting partner chose to highlight. Which means what matters, long before the committee, is the data room the seller built before the process started.</p>
            </div>
          </div>
        </section>

        {/* ── Life ── */}
        <section id="s-life" className="bg-magazine-white px-6 md:px-[120px] py-32">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Life</p>
          <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-6 max-w-[720px]">The Good Life, Earned.</h2>
          <p className="text-body-mag text-magazine-black/55 max-w-prose mb-20 leading-[1.75]">Where European builders go when they need to think. What they read. Why they stay.</p>

          {/* European tech cities */}
          <div className="mb-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">European Tech Cities</p>
            <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-10"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              Five cities.<br /><strong>One question: where would you build?</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {[
                { city: 'Lisbon', sub: 'Portugal', note: 'A third of Zurich&rsquo;s cost. English-speaking founder community already in place. Warm. The city where dozens of European founders moved &ldquo;temporarily&rdquo; and stayed. Source: Idealista Portugal Rent Index, May 2026.' },
                { city: 'Lausanne', sub: 'Switzerland', note: 'EPFL at walking distance. Tax rate of 13.8% in the Canton de Vaud. 40 minutes from Geneva. A legal infrastructure that understands SaaS and has been working with software companies since software was a niche.' },
                { city: 'Tallinn', sub: 'Estonia', note: 'The smallest country with the highest density of unicorns per capita in Europe. Digital infrastructure built to global standards. The e-Residency program has brought 100,000 entrepreneurs to operate under Estonian law. Source: e-Estonia, 2026.' },
                { city: 'Amsterdam', sub: 'Netherlands', note: 'The financial infrastructure of continental Europe. English-language courts for commercial disputes. A founder community that has been building B2B software since before B2B software was a category.' },
                { city: 'Berlin', sub: 'Germany', note: 'Still the largest startup ecosystem in continental Europe by deal volume. Access to the DACH market from a city where the cost of failure is lower than in Munich or Frankfurt.' },
              ].map((c) => (
                <div key={c.city} className="py-8 border-b border-magazine-black/8 pr-6">
                  <p className="font-sans font-bold text-magazine-black text-[22px] mb-0.5">{c.city}</p>
                  <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-accent mb-4">{c.sub}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65]" dangerouslySetInnerHTML={{ __html: c.note }} />
                </div>
              ))}
            </div>
          </div>

          {/* Reading list */}
          <div className="border-t border-magazine-black/10 pt-16 mb-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">The Reading List</p>
            <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-10"
              style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              What the founders<br />in this issue <strong>recommended.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {[
                { title: 'The SaaS Playbook', author: 'Rob Walling', note: 'The only bootstrapped SaaS book that treats exit preparation seriously without assuming venture backing. Honest about what it actually takes.' },
                { title: 'Valuation', author: 'Aswath Damodaran', note: 'The definitive text on corporate valuation. Every founder heading toward a transaction should spend a weekend with this before the first meeting.' },
                { title: 'Zero to Sold', author: 'Arvid Kahl', note: 'Built, bootstrapped, and exited. Honest about what preparation requires. The chapters on documentation are worth the price of the book alone.' },
                { title: 'The Mom Test', author: 'Rob Fitzpatrick', note: 'How to talk to customers about your product without them lying to you. The single best book on validating an idea before building it.' },
                { title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', note: 'For moments when the situation is genuinely difficult and the management books have no answer.' },
                { title: 'Zero to One', author: 'Peter Thiel', note: 'Useful not for its conclusions but for the questions it insists you answer about defensibility.' },
                { title: 'Good to Great', author: 'Jim Collins', note: 'The discipline of doing less, extremely well, for a very long time.' },
                { title: 'The Innovator\'s Dilemma', author: 'Clayton Christensen', note: 'Why good companies fail when the market moves. Relevant to every founder who has incumbents as both competitors and potential acquirers.' },
                { title: 'The Art of the Deal (M&A edition)', author: 'Alexandra Reed Lajoux', note: 'The practical mechanics of M&A, explained without the investment banking jargon. The reference every seller should read before signing an LOI.' },
                { title: 'Built to Sell', author: 'John Warrillow', note: 'A short novel about building a company that doesn\'t depend on its founder. The framework translates directly to the CIFS F-42 dimension.' },
                { title: 'Acquired (Podcast)', author: 'Ben Gilbert & David Rosenthal', note: 'Business history as strategy school. The Berkshire, TSMC, and Costco episodes are required listening for anyone thinking about acquirers.' },
                { title: 'Indie Hackers (Podcast)', author: 'Courtland Allen', note: 'Real founders, real revenue numbers. Filter for bootstrap-to-exit stories. The signal-to-noise ratio is higher than most business media.' },
              ].map(b => (
                <div key={b.title} className="py-6 border-b border-magazine-black/8 pr-8">
                  <p className="font-sans font-semibold text-magazine-black text-[14px] mb-0.5">{b.title}</p>
                  <p className="font-mono text-[8px] tracking-[0.12em] text-magazine-black/35 mb-2">{b.author}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.6]">{b.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Stack p115 */}
          <div className="border-t border-magazine-black/10 pt-16 mb-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">The Workspace of the Deliberate Founder</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-6"
                  style={{ fontSize: 'clamp(24px,3.5vw,40px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  What they keep<br />on their <strong>desk.</strong>
                </p>
                <p className="text-[12px] text-magazine-black/40 italic mb-6">Not a library. A working collection.</p>
                <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                  <p>The founders who build deliberately tend to have the same things on their desks. Not the flashiest hardware or the most subscriptions. One good notebook. A few well-chosen books with notes in the margins. A system for processing information that they have refined over years rather than adopted from a productivity blog last month.</p>
                </div>
              </div>
              <div className="space-y-4 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>The tools are secondary. What they are really protecting is the ability to think without interruption for four hours in the morning. That is the resource most founders underestimate, and the one most difficult to buy back once it has been given away.</p>
                <p>The workspace changes. The discipline behind it does not.</p>
                <div className="bg-magazine-ivory p-6 mt-4">
                  <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-magazine-black/40 mb-1">The good life, earned.</p>
                  <p className="font-sans font-semibold text-magazine-black text-[15px] italic">Not a reward for finishing. A condition for thinking clearly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Work With Aegryn p117 */}
          <div className="border-t border-magazine-black/10 pt-16 mb-20">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">How to Work With Aegryn</p>
            <blockquote className="border-l-2 border-magazine-black/20 pl-8 mb-12 max-w-2xl">
              <p className="text-body-mag text-magazine-black/70 italic leading-[1.8] text-[18px]">&ldquo;The transaction is the last chapter. Everything before it is the book.&rdquo;</p>
            </blockquote>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  label: 'Aegryn Build',
                  desc: 'For founders who want to engineer their asset toward a future transaction from the beginning. Systematic, structured, and built to last.',
                  cta: 'aegryn.com/build',
                },
                {
                  label: 'Aegryn Grade',
                  desc: 'Independent certification across Code, IP, Finance, and Security. A score a buyer can trust, because it was earned — not declared.',
                  cta: 'aegryn.com/grade',
                },
                {
                  label: 'Aegryn Transaction',
                  desc: 'Confidential transactions between certified sellers and qualified buyers, across Europe. Supported by institutional standards and a trusted network.',
                  cta: 'aegryn.com/transaction',
                },
              ].map(s => (
                <div key={s.label} className="border-t-2 border-magazine-accent pt-6">
                  <p className="font-sans font-bold text-magazine-black text-[15px] mb-3">{s.label}</p>
                  <p className="text-[12px] text-magazine-black/55 leading-[1.65] mb-4">{s.desc}</p>
                  <p className="font-mono text-[8px] tracking-[0.12em] text-magazine-accent uppercase">{s.cta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Closing essay */}
          <div className="border-t border-magazine-black/10 pt-16">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">Essay</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-sans font-bold text-magazine-black leading-[0.88] mb-8"
                  style={{ fontSize: 'clamp(22px,3.5vw,38px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                  On building<br />for the <strong>long view.</strong>
                </p>
                <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-magazine-black/35 mb-6">The Aegryn Founding Team</p>
              </div>
              <div className="space-y-5 text-body-mag text-magazine-black/65 leading-[1.8]">
                <p>The companies that sell well share one quality that has nothing to do with their product, their market, or their technology. It is a quality of attention. The founders who built them paid attention to the details that did not matter yet — the contracts, the documentation, the financial records — long before anyone asked for them.</p>
                <p>This is not glamorous advice. It does not make for a good podcast episode or a viral LinkedIn post. But it is the closest thing to a reliable pattern that we have seen across the transactions we have observed and participated in.</p>
                <p>Build something real. Build it cleanly. Document it before anyone asks you to. Let the work speak before you do. The buyers who matter already know the difference.</p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-magazine-black/30">Aegryn Magazine — Issue 01 — Saint-Sulpice, Switzerland — January 2027</p>
              </div>
            </div>

            <div className="mt-16 bg-magazine-ivory p-8">
              <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-accent mb-3">Coming Next — Issue 02 — April 2027</p>
              <p className="font-sans font-bold text-magazine-black text-[22px] mb-3">The Exit Equation.</p>
              <p className="text-body-mag text-magazine-black/55 leading-[1.65] mb-6 max-w-prose">The decision, the preparation, the negotiation, and the twelve months that follow. The number that changes your life, and whether it was the right number.</p>
              <a href={`/${locale}/magazine`} className="font-mono text-[9px] tracking-[0.16em] uppercase text-magazine-accent hover:underline">Subscribe →</a>
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
