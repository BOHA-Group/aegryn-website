import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import { Link as LocalizedLink } from '@/i18n/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal }   from '@/components/animations/WaveReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legalNotice.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/legal-notice', locale })
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params
  const tN = await getTranslations({ locale, namespace: 'legalNav' })
  const tL = await getTranslations({ locale, namespace: 'legalNotice' })

  return (
    <main className="bg-white min-h-screen">

      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">{tN('eyebrowLegal')}</p>
          <WaveReveal delay={0.1}><h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {tL('label')}
          </h1></WaveReveal>
          <ScrollReveal delay={0.25}><p className="font-sans text-[16px] text-white/70">{tL('updated')}</p></ScrollReveal>
        </div>
      </section>

      <div className="bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','legalNotice','security','faq'] as const).map((k, i) => (
            <LocalizedLink
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/legal-notice','/security','/help/faq'][i] as never}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'legalNotice' ? 'text-ag-black' : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </LocalizedLink>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-16 py-16">
        <div className="prose prose-slate max-w-none font-sans prose-headings:font-sans prose-headings:font-bold prose-headings:text-ag-black prose-headings:tracking-[-0.02em] prose-h2:text-[22px] prose-h2:mt-14 prose-h2:mb-5 prose-p:text-[15px] prose-p:text-ag-gray prose-p:leading-[1.75] prose-li:text-[15px] prose-li:text-ag-gray prose-li:leading-[1.75] prose-a:text-ag-navy prose-a:no-underline hover:prose-a:underline prose-strong:text-ag-black">

          <h2>{tL('publisher.h')}</h2>
          <ul>
            {(tL.raw('publisher.rows') as string[][]).map(([label, value]) => (
              <li key={label}><strong>{label}</strong> : {value}</li>
            ))}
          </ul>

          <h2>{tL('director.h')}</h2>
          <p>{tL('director.p')}</p>

          <h2>{tL('contact.h')}</h2>
          <ul>
            {(tL.raw('contact.items') as string[]).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2>{tL('hosting.h')}</h2>
          <ul>
            {(tL.raw('hosting.items') as string[]).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2>{tL('ip.h')}</h2>
          <p>{tL('ip.p')}</p>

          <h2>{tL('docs.h')}</h2>
          <p>{tL('docs.p')}</p>
          <ul>
            <li><LocalizedLink href="/terms/use">{tN('termsUse')}</LocalizedLink></li>
            <li><LocalizedLink href="/terms/cgv">{tN('termsCgv')}</LocalizedLink></li>
            <li><LocalizedLink href="/privacy">{tN('privacy')}</LocalizedLink></li>
          </ul>
        </div>
      </div>
    </main>
  )
}
