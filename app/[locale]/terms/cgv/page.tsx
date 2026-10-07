import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { ArrowUpRight }         from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { getCgv, roman }        from '@/content/legal/cgv'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { meta } = getCgv(locale)
  return generateAegrynMetadata({ title: meta.title, description: meta.desc, path: '/terms/cgv', locale })
}

export default async function TermsCgvPage({ params }: Props) {
  const { locale } = await params
  const cgv = getCgv(locale)
  const tN  = await getTranslations({ locale, namespace: 'legalNav' })


  return (
    <main className="bg-ag-white min-h-screen">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">
            Aegryn — Legal
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {cgv.label}
          </h1>
          <p className="font-sans text-[16px] text-white/40 mb-3">{cgv.version}</p>
          <p className="font-sans text-[13px] text-ag-apex/70 max-w-2xl italic">{cgv.note}</p>
        </div>
      </section>

      {/* Legal nav strip */}
      <div className="border-b border-ag-border bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','security','faq'] as const).map((k, i) => (
            <Link
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/security','/help/faq'][i]}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'termsCgv'
                  ? 'text-ag-black'
                  : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-16 space-y-14">
        {cgv.sections.map((section, i) => (
          <section key={i} className="border-t border-ag-border pt-8">
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-6">
              {roman(i)} — {section.title}
            </h2>
            {section.defs && (
              <dl className="space-y-4">
                {section.defs.map(([term, def]) => (
                  <div key={term} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6">
                    <dt className="font-sans font-semibold text-[13px] text-ag-black pt-0.5">{term}</dt>
                    <dd className="font-sans text-[14px] text-ag-gray leading-relaxed">{def}</dd>
                  </div>
                ))}
              </dl>
            )}
            {section.blocks?.map((b, j) => b.title ? (
              <div key={j} className="mb-6 pl-4 border-l-2 border-ag-border">
                <h3 className="font-sans font-semibold text-[13px] text-ag-black mb-2">{b.title}</h3>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{b.body}</p>
              </div>
            ) : (
              <p key={j} className="font-sans text-[14px] text-ag-gray leading-relaxed mb-4">{b.body}</p>
            ))}
          </section>
        ))}

        {/* CTA */}
        <div className="border-t border-ag-border pt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] bg-ag-apex text-ag-navy px-5 py-3 hover:bg-ag-apex/90 transition-colors"
          >
            {cgv.ctaContact} <ArrowUpRight size={12} />
          </Link>
          <Link
            href="/terms/use"
            className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-gray-light border border-ag-border px-5 py-3 hover:border-ag-black hover:text-ag-black transition-colors"
          >
            {cgv.ctaTermsUse} <ArrowUpRight size={12} />
          </Link>
        </div>
      </article>
    </main>
  )
}
