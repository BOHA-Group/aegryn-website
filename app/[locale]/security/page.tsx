import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'security.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function SecurityPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'security' })
  const tN = await getTranslations({ locale, namespace: 'legalNav' })

  const neverItems = [t('s1Never1'), t('s1Never2'), t('s1Never3')] as string[]
  const accountItems = t.raw('s3Items') as string[]
  const steps = [t('s5Step1'), t('s5Step2'), t('s5Step3')] as string[]

  return (
    <main id="main" className="bg-ag-white min-h-screen">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">AEGRYN — Legal</p>
          <div className="flex items-start gap-4 mb-4">
            <ShieldCheck size={32} className="text-ag-apex shrink-0 mt-1" />
            <div>
              <h1
                className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-2"
                style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
              >
                {t('label')}
              </h1>
              <p className="font-sans text-[14px] text-white/50">{t('subtitle')}</p>
            </div>
          </div>
          <p className="font-sans text-[13px] text-ag-apex/80 mt-4">
            Contact : <a href={`mailto:${t('contactEmail')}`} className="underline underline-offset-2">{t('contactEmail')}</a>
          </p>
        </div>
      </section>

      {/* Legal nav */}
      <div className="border-b border-ag-border bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','security','faq'] as const).map((k, i) => (
            <Link
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/security','/help/faq'][i]}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'security' ? 'text-ag-black' : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-16 space-y-14">

        {/* Intro */}
        <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl">{t('intro')}</p>

        {/* Section 1 — Usurpation */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-ag-grade-b" /> {t('s1Title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-4">{t('s1')}</p>
          <div className="bg-ag-apex/8 border border-ag-apex/20 px-5 py-4 mb-6">
            <p className="font-sans font-semibold text-[13px] text-ag-black">{t('s1Official')}</p>
          </div>
          <p className="font-sans font-semibold text-[12px] uppercase tracking-[0.16em] text-ag-black mb-3">
            {t('s1NeverTitle')}
          </p>
          <ul className="space-y-2">
            {neverItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <span className="font-sans text-[14px] text-ag-gray">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 2 — Communications frauduleuses */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-4">{t('s2Title')}</h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-4">{t('s2')}</p>
          <div className="bg-ag-off-white border border-ag-border px-5 py-4">
            <p className="font-sans text-[13px] text-ag-gray italic">{t('s2Doubt')}</p>
          </div>
        </section>

        {/* Section 3 — Compte */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-4">{t('s3Title')}</h2>
          <ul className="space-y-2">
            {accountItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={14} className="text-ag-apex shrink-0 mt-0.5" />
                <span className="font-sans text-[14px] text-ag-gray">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 — Paiements */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-6">{t('s4Title')}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-ag-apex/30 bg-ag-apex/5 p-5">
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-apex mb-4">{t('s4NormalTitle')}</p>
              <ul className="space-y-3">
                {[t('s4Normal1'), t('s4Normal2')].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-ag-apex shrink-0 mt-0.5" />
                    <span className="font-sans text-[13px] text-ag-gray leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-red-200 bg-red-50 p-5">
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-red-600 mb-4">{t('s4FraudTitle')}</p>
              <ul className="space-y-3">
                {[t('s4Fraud1'), t('s4Fraud2'), t('s4Fraud3')].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="font-sans text-[13px] text-ag-gray leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 — Signaler */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-6">{t('s5Title')}</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="font-mono text-[11px] text-ag-gray-light w-6 shrink-0 mt-0.5">
                  {String(i+1).padStart(2,'0')}
                </span>
                <span className="font-sans text-[14px] text-ag-gray leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 pt-6 border-t border-ag-border">
            <a
              href={`mailto:${t('contactEmail')}`}
              className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-5 py-3 hover:bg-ag-navy hover:text-white transition-colors"
            >
              {t('contactEmail')}
            </a>
          </div>
        </section>
      </article>
    </main>
  )
}
