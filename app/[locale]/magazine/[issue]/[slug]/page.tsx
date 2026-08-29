import { notFound }        from 'next/navigation'
import type { Metadata }   from 'next'
import type { MagazineIssue, MagazineArticle } from '@/lib/magazine/types'

import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'
import { ARTICLES_01 }     from '@/content/magazine/issue-01/articles'
import { ArticleSection }  from '@/components/magazine/sections/ArticleSection'
import { AegrynCtaBlock }  from '@/components/magazine/AegrynCtaBlock'

/* ── Registry helpers ───────────────────────────────────── */
function getIssue(slug: string): MagazineIssue | null {
  switch (slug) {
    case 'issue-01': return ISSUE_01
    default: return null
  }
}

function getArticles(issueSlug: string): MagazineArticle[] {
  switch (issueSlug) {
    case 'issue-01': return ARTICLES_01
    default: return []
  }
}

/* ── Article body content ────────────────────────────────── */
function getArticleContent(slug: string): string {
  const content: Record<string, string> = {
    'editorial-why-europe-needs-a-standard': `We have spent years building, auditing, and structuring digital assets — and observing the same gap: the absence of a standardised, independent reference that both sides of a tech transaction could equally trust. Sellers operate without a certified baseline. Buyers make decisions on unverified information. The market, for all its sophistication, runs on opacity.

In 2026, the European SaaS M&A market reached its highest recorded volume. AI is fundamentally recomposing how tech value is defined and priced. European buyers are finally asserting themselves in a market long dominated by North American capital. Yet fragmentation and opacity persist — particularly for the 100K–5M€ segment, which represents the majority of deals by volume and the least served segment in terms of infrastructure.

The European discount — 15 to 25% below comparable US multiples — has narrowed, but has not disappeared. Part of the explanation is structural: a less mature advisory ecosystem, fewer standardised due diligence frameworks, and a cultural reluctance around price transparency. AEGRYN exists to change that.

The CIFS certification protocol — covering Code integrity, IP ownership, Financial reliability, and Security posture — provides both sides of a transaction with a shared, auditable language. The Grade is not a valuation. It is a certification of transactability: a verified statement that an asset has been prepared, structured, and documented to a standard that makes closing possible.

This report is not a commissioned market study. It is our reading of the market — drawn from our data, our protocol, our point of view. Each year, as our certification database grows, the data will become more ours. This first edition establishes the baseline. Everything that follows will build on it.`,

    'market-european-tech-ma-2026-numbers': `2,698 SaaS deals completed in 2025 — a record. EU M&A volume up +40% since 2023. €14.2 billion in total European tech transaction volume. These are not projections. They are the confirmed numbers that define the market we are operating in.

The European SaaS landscape has reached an inflection point. For the first time, deal volume exceeds pre-2022 peaks — but the market structure has fundamentally changed. The era of growth-at-all-costs multiples is over. What has replaced it is a more rigorous, more buyer-driven market where certified quality commands premium.

The median EV/ARR for European SaaS sits at 4.7x in 2026 — up from 3.4x in 2023. This recovery is real, but uneven. AI-native SaaS trades at 8–15x. Generic B2B SaaS without defensible differentiation trades at 3.1x. The spread between top and bottom quartile has never been wider.

The European discount versus US peers persists at 15–25%, down from 30–40% in 2020. This convergence reflects three forces: increasing US buyer appetite for certified European assets, the maturation of European growth equity, and the emergence of pan-European certification frameworks that reduce information asymmetry.

The remaining gap is structural, not fundamental. It reflects the absence of standardised diligence, not an absence of quality. That is precisely where AEGRYN operates.`,

    'ai-recomposition-of-tech-value': `72% of SaaS M&A targets now reference AI. Median EV/Revenue for AI-native SaaS sits at 12.5x. But the premium is fragile — and the commoditisation trap is real.

The AI valuation premium is being driven by a genuine recomposition of tech value. Buyers are no longer pricing software on revenue multiples alone. They are pricing proprietary data, contractual moats, regulatory compliance, and net revenue retention. These are the four AI attributes that the CIFS protocol has formalised.

Proprietary data (I-16 in the CIFS framework) is the foundation. Datasets that cannot be replicated are the primary source of durable AI value. If a competitor can rebuild your training data from scratch in six months, the asset has no certifiable moat in the AI dimension.

The commoditisation trap is the inverse. 40% of submitted assets present AI features built on thin wrappers around public LLMs — Claude, GPT, Gemini — without proprietary data, contractual depth, or technical differentiation. The valuation premium these assets claim is not supported by the CIFS assessment.

EU AI Act compliance (S-42) is emerging as a binary filter. Assets that cannot demonstrate compliance with Articles 9–15 face a structural devaluation. Assets that can demonstrate compliance — and have documented it at submission — command a verifiable premium. This is the first regulatory certification arbitrage in European tech M&A history.`,

    'perspective-certification-table': `Less than 25% of submitted assets pass the CIFS certification threshold. Here is what the top 5 refusal reasons tell us about the state of European tech.

The most common refusal reason is F-11a: ARR declared without Stripe or billing access. This affects 34% of submitted assets. Sellers declare revenue figures that they cannot substantiate with billing system access. Buyers walk away. This is the most preventable reason for a deal to fail.

I-21 — software rights not formally assigned to the entity — affects 28% of submissions. Founders build products on personal GitHub accounts, use contractor code without IP assignment clauses, or never formalised the transfer of software rights to the company entity. This is a clean kill for any strategic acquirer.

F-42 — founder dependency exceeding 60% of revenue — affects 24% of submissions. The asset is operationally viable, but the founder is the product. Search funds will not touch it. PE will only consider it with a long earnout and a transition plan. The discount is significant.

S-16 — no pentest in the past 18 months — affects 19% of submissions. Security posture is increasingly a first-filter for institutional buyers, particularly in regulated sectors. The absence of a pentest is not just a technical concern. It is a signal about management hygiene.

I-27 — no legal basis for personal data transfer under GDPR — affects 17% of submissions. Data controllers that have not established a legal basis for cross-border data flows face acquisition blockers in due diligence. This is particularly common in SaaS companies with US buyers.`,

    'deal-watch-h1-2026': `Five transactions from H1 2026 analysed through the CIFS lens. What worked, what did not, and what each grade would have signalled.

team.blue × Windsor.ai (Switzerland, Q1 2026) represents the archetype of a clean AI acquisition. Windsor.ai's dataset was proprietary, its IP stack clean, and its NRR above 130%. An estimated CIFS grade of AA reflects the quality of preparation — not just the product. The transaction closed at an estimated 7–10x ARR, a premium to the FinTech median.

Hg × OneStream (UK/EU, Q1 2026) is the defining upper mid-market deal of the period. OneStream's position as a category leader in financial performance management, combined with mission-critical enterprise embedding and PE-grade financial documentation, puts this firmly in AAA territory. The estimated multiple of 12–15x ARR reflects the premium for category leadership.

The French LegalTech (Q2 2026) is a case study in how a Grade A asset transacts. Contract automation, RGPD-compliant architecture, and verifiable accuracy metrics — but limited scale and no AI-native moat. The 4.5x ARR multiple is fair for the grade. The deal closed in 74 days from mandate — faster than the market median.

The German HR Automation SaaS (Q1 2026) demonstrates the value of a clean cap table. Single founder, no convertibles, SAP integration creating switching costs, and a documented transition plan. Grade A with a 3.8x multiple reflects accurate market pricing for the segment.

The Dutch HealthTech Platform (Q2 2026) is the benchmark for regulated-sector certification. CE marking under IEC 62304, ISO 27001 certification, and multi-year hospital contracts. Grade AA, 5.2x ARR — and a transaction structure that required zero renegotiation post-LOI.`,

    'buyers-who-is-buying-european-tech': `PE funds, search funds, strategic acquirers, family offices — four buyer profiles, four sets of criteria, and what each one actually looks for in a certified asset.

PE lower mid-market funds (target: 2–15M€ EV) are the most process-driven buyers in the market. They will not engage without certified financials. ARR certification with billing access (F-11a), founder dependency below 40% (F-42), and net revenue retention above 110% (F-22) are the three filters that determine whether a conversation progresses to LOI. A CIFS grade of AA or above significantly accelerates their process — not because they trust the grade unconditionally, but because it signals a seller who has prepared seriously.

Search funds and ETA operators (target: 300K–3M€) are the buyer profile most likely to pay a premium for CIFS certification. Their typical thesis is operational: they acquire, replace the founder, and scale through execution. They need documented SOPs, customer playbooks, and a founder committed to a genuine transition period. The CIFS certification gives them a standardised language for the quality they are buying.

Strategic acquirers (target: 500K–10M€) filter primarily on IP. They need to know that all software rights are formally assigned to the entity (I-21), that there are no open-source licence conflicts (I-14), and that the technology is complementary to their existing stack. The I-dimension of the CIFS assessment is their primary due diligence tool. IP certification is not a nice-to-have. It is a transaction enabler.

Family offices (target: 1–20M€ EV) are growing rapidly as direct buyers of European tech. They have a 10+ year investment horizon, a preference for cashflow-positive assets, and a strong preference for discreet, structured processes. They are AEGRYN's core Transact audience. Minimal founder involvement post-close is their primary operational requirement.`,

    'outlook-2027-three-forces': `The EU AI Act enters into force. The founder succession wave accelerates. PE dry powder reaches record levels. Three structural forces that will define the next 12 months.

The EU AI Act represents the first regulatory certification arbitrage in European tech M&A history. Assets that can demonstrate compliance with Articles 9–15 — particularly those that have documented their compliance within a CIFS assessment — will command a verifiable premium. Assets that cannot demonstrate compliance face a structural devaluation estimated at 20–30% of enterprise value. The compliance window is now. Buyers are already filtering on this.

The founder succession wave is the largest untapped deal pipeline in European tech. More than 3.5 million European SMEs are currently without a successor. The tech segment — particularly bootstrapped SaaS companies founded between 2008 and 2016 — is entering its peak succession window. These founders are often first-time sellers, unfamiliar with M&A processes, and underserved by the advisory ecosystem. AEGRYN operates at the intersection of this market and the certification infrastructure it lacks.

PE dry powder at record levels creates a structural advantage for prepared sellers. European private equity funds are sitting on undeployed capital that must be deployed. The competition for quality certified assets will intensify in H2 2026 and throughout 2027. Sellers who have prepared their assets — through certification, documentation, and structured positioning — will attract competitive processes. Certified assets are expected to transact 40–60 days faster than uncertified assets and at a measurable premium.`,

    'aegryn-index-edition-1': `Our certification database, made public for the first time. Acceptance rate, dimension scores, grade distribution — the baseline against which every future edition will be measured.

The AEGRYN Certification Index represents the aggregate output of every CIFS assessment conducted since launch. It is the most granular dataset available on the structural quality of European tech assets preparing for exit.

The acceptance rate — under 25% — is the most cited number in this index. It is not a reflection of market quality. It is a reflection of market preparation. The majority of assets that fail certification are not fundamentally flawed. They are structurally underprepared. Revenue not certified with billing access. Software rights not formally assigned. No pentest in the past 18 months. These are solvable problems.

The four CIFS dimensions — Code integrity, IP ownership, Financial reliability, Security posture — are each scored on a 25-point scale. The minimum threshold for certification requires a score above the threshold in each dimension, not just in the aggregate. This is deliberate. An asset with perfect financial documentation and no IP assignment is not certifiable. The certification is a signal of comprehensive readiness.

The grade distribution — from AEG ★ (5%) through AAA (12%), AA (27%), A (32%), to B (17%) — reflects the current state of the market. Most assets that pass certification are A or AA grade. The AEG ★ grade is reserved for assets that represent the top of market in every CIFS dimension. As our certification database grows, this distribution will become the definitive benchmark for European tech M&A quality.`,
  }

  return content[slug] ?? `This article is part of Aegryn Magazine Issue 01 — The State of European Tech M&A.`
}

type Props = { params: Promise<{ locale: string; issue: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { issue: issueSlug, slug } = await params
  const issue    = getIssue(issueSlug)
  const articles = getArticles(issueSlug)
  const article  = articles.find(a => a.slug === slug)

  if (!issue || !article) return {}

  return {
    title:       `${article.title} — Aegryn Magazine`,
    description: article.excerpt,
    keywords:    article.seoKeywords,
    alternates:  { canonical: `/magazine/${issue.slug}/${article.slug}` },
    openGraph: {
      title:         article.title,
      description:   article.excerpt,
      type:          'article',
      publishedTime: `${article.publishedAt}T00:00:00Z`,
      authors:       ['AEGRYN'],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { issue: issueSlug, slug } = await params
  const issue    = getIssue(issueSlug)
  const articles = getArticles(issueSlug)
  const article  = articles.find(a => a.slug === slug)

  if (!issue || !article) notFound()

  const content = getArticleContent(slug)

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'Article',
            headline:      article.title,
            description:   article.excerpt,
            keywords:      article.seoKeywords.join(', '),
            author:        { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            publisher:     { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            datePublished: `${article.publishedAt}T00:00:00Z`,
            isPartOf:      { '@type': 'Periodical', name: 'Aegryn Magazine' },
          }),
        }}
      />

      <main>
        <ArticleSection
          article={article}
          content={content}
          backHref={`/magazine/${issue.slug}`}
          backLabel={`Back to Issue ${String(issue.number).padStart(2, '0')}`}
        />

        <AegrynCtaBlock
          title={article.ctaLabel}
          sub="AEGRYN | European Tech M&A Intelligence"
          line="Certified by AEGRYN | Switzerland"
          ctaEstimate="Get a valuation estimate"
          ctaGrade="Request CIFS certification"
        />
      </main>
    </>
  )
}
