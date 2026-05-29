import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'
import { ArrowUpRight }  from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Grow With Us | Strategic Partnerships & Investment | Aegryn',
    description: 'Partner with Aegryn to build and scale durable digital ecosystems across Switzerland and Europe. Long-term vision. Disciplined execution.',
    path: '/grow-with-us',
    locale,
  })
}

const INVESTOR_WHY = [
  {
    num: '01',
    title: 'High-growth market',
    desc: 'We are positioned in the rapidly transforming and expanding digital ecosystem sector, opening up significant revenue opportunities.',
  },
  {
    num: '02',
    title: 'Proven expertise',
    desc: 'Our team consists of top-tier developers, UX designers, and marketing strategists committed to delivering cutting-edge digital products.',
  },
  {
    num: '03',
    title: 'Next-gen technology',
    desc: 'We integrate AI, machine learning and automation to craft future-proof solutions built for endurance and scale.',
  },
  {
    num: '04',
    title: 'Data-driven success',
    desc: 'Our robust business model and financial strategies ensure long-term profitability and sustained innovation.',
  },
  {
    num: '05',
    title: 'Transparent & investor-focused',
    desc: 'We provide clear, consistent updates on project progress, financial milestones, and market trends.',
  },
]

const PARTNER_OPS = [
  { title: 'App development', desc: "Expand your agency's service portfolio and unlock significant new revenue streams." },
  { title: 'Embedded insurance', desc: 'Propose instant, seamless coverage for purchases, deliveries, and financial transactions.' },
  { title: 'Integrated payment solutions', desc: 'Power real-time payments, flexible financing, and revenue-sharing models.' },
  { title: 'Co-branded growth initiatives', desc: 'Launch viral campaigns, exclusive offers and limited-time events.' },
  { title: 'Data-driven marketing campaigns', desc: 'Leverage platform data insights to create highly targeted and personalized marketing campaigns that drive conversions.' },
  { title: 'Social media & influencer collaborations', desc: "Partner with us to amplify our brand's message through engaging social media campaigns and strategic influencer partnerships." },
]

export default async function GrowWithUsPage({ params }: Props) {
  const { locale } = await params
  const _t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            Partenariats Stratégiques & Investissement
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.95] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            Grow With Us.
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            Aegryn is inviting visionary investors and partners to be part of a groundbreaking movement in digital technology.
            Long-term vision. Disciplined execution.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-navy transition-colors"
          >
            Contact us
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Investors */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              / Investors
            </p>
            <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.02em]">
              Become a key player
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-ag-border">
            {INVESTOR_WHY.map((item) => (
              <div key={item.num} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {item.num}
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-none mb-4"
                  style={{ fontSize: 'clamp(18px,1.6vw,22px)' }}
                >
                  {item.title}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              / Partners
            </p>
            <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.02em]">
              High-impact opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
            {PARTNER_OPS.map((op) => (
              <div key={op.title} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-3"
                  style={{ fontSize: 'clamp(16px,1.4vw,20px)' }}
                >
                  {op.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {op.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              Aegryn Group
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,46px)' }}
            >
              Ready to build the future together?
            </h2>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            Contact us
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
