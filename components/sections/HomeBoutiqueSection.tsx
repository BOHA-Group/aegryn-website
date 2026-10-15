import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { BOUTIQUE } from '@/content/boutique/copy'

/** Accueil du cabinet : La Boutique remplace « Nos clients » (les 4 profils de La Boutique). */
export async function HomeBoutiqueSection({ locale }: { locale: string }) {
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
  const [ts, td] = await Promise.all([getTranslations({ locale, namespace: 'homeSegments' }), getTranslations({ locale, namespace: 'homeDoors' })])
  const cards = ts.raw('cards') as { key: string; title: string; desc: string }[]
  return (
    <section className="bg-ag-navy py-24 text-white md:py-32" aria-labelledby="home-boutique-title">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">{BOUTIQUE.label[lang]}</p>
        <h2 id="home-boutique-title" className="mt-5 max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.025em] text-balance" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{BOUTIQUE.homeTitle[lang]}</h2>
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75">{BOUTIQUE.homeText[lang]}</p>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(c => (
            <div key={c.key} className="rounded-2xl bg-white/[0.06] p-7">
              <h3 className="font-sans text-[18px] font-bold tracking-[-0.01em]">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link href="/boutique" className="rounded-full bg-ag-apex px-7 py-3.5 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white">{td('boutiqueLink')}</Link>
          <Link href={{ pathname: '/contact', query: { subject: 'project' } }} className="font-sans text-sm font-semibold text-white underline decoration-white/40 decoration-2 underline-offset-4 hover:text-ag-apex">{BOUTIQUE.cta1[lang]}</Link>
        </div>
      </div>
    </section>
  )
}
