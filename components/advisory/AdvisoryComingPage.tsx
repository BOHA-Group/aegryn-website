import { Link } from '@/i18n/navigation'
import { NEW_PILLARS, COMING_UI, IMPLEMENT_UI, type Lang } from '@/content/advisory/implement'

/** Page métier en préparation (Finance, Opérations, Pilotage) : gabarit provisoire, non indexé, en attendant le contenu. */
export function AdvisoryComingPage({ pillar, locale }: { pillar: keyof typeof NEW_PILLARS; locale: string }) {
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang
  const p = NEW_PILLARS[pillar]
  return (
    <main>
      <section className="relative overflow-hidden bg-ag-navy px-6 pb-24 pt-36 md:px-12" style={{ minHeight: 'clamp(460px,50vw,620px)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy via-ag-navy to-ag-navy-mid" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex"><span className="inline-block h-px w-5 bg-ag-apex/50" />{COMING_UI.label[lang]}</p>
          <h1 className="mb-6 max-w-4xl font-sans font-bold leading-[1.05] tracking-[-0.03em] text-white" style={{ fontSize: 'clamp(36px,5vw,72px)' }}>{p.name[lang]}</h1>
          <p className="max-w-2xl text-[16px] leading-relaxed text-white/80">{p.desc[lang]}</p>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/60">{IMPLEMENT_UI.lead[lang]}</p>
        </div>
      </section>
      <section className="bg-ag-white px-6 py-20 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-[15px] leading-relaxed text-ag-gray">{COMING_UI.notice[lang]}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={{ pathname: '/contact', query: { action: 'echange' } } as never} className="rounded-full bg-ag-navy px-7 py-3.5 font-sans text-sm font-bold text-white transition-colors hover:bg-ag-navy-mid">{COMING_UI.cta[lang]}</Link>
            <Link href={'/advisory' as never} className="rounded-full border border-ag-border px-7 py-3.5 font-sans text-sm font-semibold text-ag-black transition-colors hover:border-ag-black">{COMING_UI.all[lang]}</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
