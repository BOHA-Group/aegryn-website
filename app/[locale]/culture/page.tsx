import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal } from '@/components/animations/WaveReveal'

type Props = { params: Promise<{ locale: string }> }
type Item = { title: string; desc: string }

const LABEL = 'flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-6'
const H2 = { fontSize: 'clamp(26px,3vw,44px)' } as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'culture' })
  return generateAegrynMetadata({ title: t('metaTitle'), description: t('metaDesc'), path: '/culture', locale })
}

export default async function CulturePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'culture' })
  const audience = t.raw('audience.items') as Item[]
  const values = t.raw('values.items') as Item[]
  const work = t.raw('work.items') as Item[]
  const doItems = t.raw('result.do') as string[]
  const avoidItems = t.raw('result.avoid') as string[]

  return (
    <main className="bg-ag-white">
      <section className="pb-20 pt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className={LABEL}><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('label')}</p>
          <WaveReveal delay={0.1}>
            <h1 className="mb-8 max-w-4xl font-sans font-bold leading-[1.05] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}>
              {t('title')}
            </h1>
          </WaveReveal>
          <ScrollReveal delay={0.25}>
            <p className="max-w-2xl font-sans text-[16px] leading-relaxed text-ag-gray">{t('intro')}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-ag-border py-24">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12">
          <p className={LABEL}><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('audience.label')}</p>
          <h2 className="mb-14 max-w-2xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={H2}>{t('audience.title')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {audience.map((a, i) => (
              <div key={i} className="rounded-2xl bg-ag-off-white p-7">
                <h3 className="mb-3 font-sans text-[18px] font-bold tracking-[-0.01em] text-ag-black">{a.title}</h3>
                <p className="text-[15px] leading-relaxed text-ag-gray">{a.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="border-t border-ag-border py-24">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12">
          <p className={LABEL}><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('result.label')}</p>
          <h2 className="mb-6 max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={H2}>{t('result.title')}</h2>
          <p className="mb-14 max-w-2xl text-[16px] leading-relaxed text-ag-gray">{t('result.intro')}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {([['doLabel', doItems, Check, 'bg-ag-off-white'], ['avoidLabel', avoidItems, X, 'border border-ag-border']] as const).map(([key, items, Icon, cls]) => (
              <div key={key} className={`rounded-2xl p-8 ${cls}`}>
                <p className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ag-apex-ink">{t(`result.${key}`)}</p>
                <ul className="flex flex-col gap-4">
                  {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon size={15} className="mt-1 shrink-0 text-ag-apex-ink" />
                      <span className="text-[15px] leading-relaxed text-ag-black">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="border-t border-ag-border py-24">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12">
          <p className={LABEL}><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('values.label')}</p>
          <h2 className="mb-14 max-w-2xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={H2}>{t('values.title')}</h2>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {values.map((v, i) => (
              <div key={i} className="flex gap-6 border-t border-ag-border pt-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="mb-2 font-sans text-[18px] font-bold tracking-[-0.01em] text-ag-black">{v.title}</h3>
                  <p className="text-[15px] leading-relaxed text-ag-gray">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="border-t border-ag-border py-24">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12">
          <p className={LABEL}><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('work.label')}</p>
          <h2 className="mb-14 max-w-2xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={H2}>{t('work.title')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {work.map((w, i) => (
              <div key={i} className="rounded-2xl bg-ag-off-white p-8">
                <h3 className="mb-3 font-sans text-[18px] font-bold tracking-[-0.01em] text-ag-black">{w.title}</h3>
                <p className="text-[15px] leading-relaxed text-ag-gray">{w.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="border-t border-ag-border py-24">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12">
          <h2 className="mb-5 max-w-2xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={H2}>{t('cta.title')}</h2>
          <p className="mb-10 max-w-xl text-[16px] leading-relaxed text-ag-gray">{t('cta.desc')}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/career" className="inline-flex items-center gap-2 rounded-lg bg-ag-black px-7 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ag-navy">
              {t('cta.careers')} <ArrowUpRight size={13} />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-lg border border-ag-border px-7 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ag-black transition-colors hover:border-ag-black">
              {t('cta.about')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
