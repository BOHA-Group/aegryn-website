import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Aegryn Advisory — Strategic Advisory Data, AI & Cybersecurity',
    description: 'Strategic guidance in Data, AI and Cybersecurity. Built by operators. Delivered without noise.',
    path: '/advisory',
    locale,
  })
}

const TEAM = [
  { name: 'Romain F.',    domain: 'Security Audit – Cybersecurity, Penetration Testing & Risk Management', langs: 'French, English', area: 'Back-end security' },
  { name: 'Yacouba N.',   domain: 'App & SaaS Security Audit – Cybersecurity Back-End & Cloud Expert',    langs: 'French',          area: 'Back-end security' },
  { name: 'Yohann B.',    domain: 'Business Strategy, Creation & Growth',                                  langs: 'French, English', area: 'Business Strategy' },
  { name: 'Ferdinand H.', domain: 'Mobile Application – CTO as a service',                                langs: 'French, English', area: 'Mobile application' },
  { name: 'Sarah L.',     domain: 'Digital Transformation – Operational Efficiency Expert',               langs: 'French',          area: 'UI/UX no-code' },
  { name: 'Rayan K.',     domain: 'Growth & Digital Marketing Expert',                                    langs: 'French, English', area: 'Growth' },
  { name: 'Jeremy D.',    domain: 'Full-Stack Engineer & Technical Architecture',                          langs: 'French, English', area: 'Engineering' },
  { name: 'Alexandre M.', domain: 'Data & AI Strategy',                                                   langs: 'French, English', area: 'AI & Data' },
  { name: 'Romain M.',    domain: 'Digital Law & Intellectual Property',                                   langs: 'French',          area: 'Legal' },
  { name: 'Léo H.',       domain: 'Product & Platform Strategy',                                          langs: 'French, English', area: 'Product' },
  { name: 'Baptiste L.',  domain: 'UX Design & User Experience',                                          langs: 'French',          area: 'Design' },
  { name: 'Nour M.',      domain: 'Marketing & Social Networks',                                           langs: 'French, English', area: 'Marketing' },
]

const DOMAINS = [
  { title: 'Digital Products',                  desc: 'Mobile applications, web platforms, SaaS, technology choices, digital project management.' },
  { title: 'Audit & Application Security',      desc: 'Evaluation of digital solutions, recommendations, compliance and awarding of an annual trust label.' },
  { title: 'Artificial Intelligence & Automation', desc: 'AI agents, process automation, productivity, integration of AI into products and organizations.' },
  { title: 'Digital Law & Intellectual Property', desc: 'Terms of Service, digital compliance, IP protection, legal structuring of digital products.' },
  { title: 'Design & User Experience',          desc: 'UX/UI, product identity, user journeys.' },
  { title: 'Business Strategy',                 desc: 'Business architecture, revenue logic, capital efficiency, scalable models, market positioning.' },
  { title: 'Marketing & Social Networks',       desc: 'Positioning, content strategy, organic and inorganic growth.' },
]

const WHO_FOR = [
  {
    title: 'Founders & Builders',
    desc: 'You are building or scaling a digital platform and facing structural decisions that will shape its long-term resilience. We help you establish robust foundations before complexity compounds.',
  },
  {
    title: 'Growing Organizations',
    desc: 'As your organization grows, technical depth becomes critical. We provide an independent, senior-level perspective on infrastructure scalability, AI deployment and long-term architectural coherence.',
  },
  {
    title: 'Leadership in Transition',
    desc: 'Digital evolution requires structural discipline, not incremental patchwork. We support leadership teams navigating legacy modernization, data restructuring and cybersecurity reinforcement.',
  },
]

export default function AdvisoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            Aegryn Advisory
          </p>
          <h1
            className="font-display font-black text-white tracking-[-0.03em] leading-[0.92] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            Strategic Clarity.<br />Operational Depth.
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            At Aegryn Advisory, we work with founders, executives and organizations facing critical technology decisions. Our guidance is derived from how we design, build and secure our own digital ecosystems.
            <br /><br />
            We don&apos;t rely on theory, trends or recycled frameworks. We provide clear, direct and execution-grounded strategic direction across Data, AI and Cybersecurity — focused on impact, resilience and long-term value.
          </p>
          <p className="font-sans font-semibold text-[13px] text-white/40 leading-relaxed max-w-xl mb-10 border-l-2 border-ag-apex/40 pl-5">
            No endless slides. No generic playbooks.<br />
            Only standards that have been tested in real environments.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex transition-colors"
          >
            Book a session <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Why Advisory */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / Why Advisory?
            </p>
          </div>
          <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-16 md:pr-16">
              <p className="text-[15px] text-ag-gray leading-relaxed mb-6">
                Designing or scaling a digital ecosystem requires more than ambition. It requires architectural clarity, disciplined execution and long-term thinking.
              </p>
              <p className="text-[15px] text-ag-gray leading-relaxed">
                Aegryn Advisory exists for leaders who need structured guidance in moments where Data, AI and Cybersecurity decisions define future resilience and growth. Our perspective comes from building and operating our own digital ecosystems. We have navigated infrastructure trade-offs. We have secured real environments. We have scaled real systems.
              </p>
            </div>
            <div className="py-16 md:pl-16">
              <p
                className="font-display font-black text-ag-black tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: 'clamp(20px,2vw,28px)' }}
              >
                Our role is simple: Bring clarity. Reduce risk. Accelerate the right decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / Who is Advisory for?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {WHO_FOR.map((item, i) => (
              <div key={item.title} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-tight mb-4"
                  style={{ fontSize: 'clamp(16px,1.4vw,20px)' }}
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

      {/* Experts */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / Our Experts
            </p>
            <p className="font-sans font-semibold text-[10px] text-ag-gray-light">
              {String(TEAM.length).padStart(2, '0')} Senior Advisors
            </p>
          </div>
          <div className="divide-y divide-ag-border">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="flex items-center justify-between py-5 hover:bg-ag-off-white transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <span className="font-sans font-semibold text-[10px] text-ag-gray-light w-6 shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-display font-black text-ag-black text-[16px] tracking-[-0.02em] group-hover:text-ag-navy transition-colors">
                      {member.name}
                    </p>
                    <p className="font-sans font-semibold text-[11px] text-ag-gray-light mt-0.5">
                      {member.domain}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 shrink-0 ml-6">
                  <span className="font-sans font-semibold text-[10px] tracking-[0.12em] uppercase border border-ag-border px-3 py-1 text-ag-gray-light">
                    {member.area}
                  </span>
                  <span className="font-sans font-semibold text-[10px] text-ag-gray-light">
                    {member.langs}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / Our areas of intervention
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
            {DOMAINS.map((d) => (
              <div key={d.title} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                <h3
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-tight mb-3"
                  style={{ fontSize: 'clamp(15px,1.3vw,18px)' }}
                >
                  {d.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach + CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/40 mb-4">
              / Approach
            </p>
            <h2
              className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(24px,3vw,44px)' }}
            >
              Making the right decision starts with the right conversation.
            </h2>
            <p className="mt-4 text-[14px] text-white/50 max-w-lg leading-relaxed">
              We offer qualified senior time, direct exchanges with the right experts, and immediately actionable recommendations. You pay for expertise and experience, not for structure.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3.5 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            Book a session <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
