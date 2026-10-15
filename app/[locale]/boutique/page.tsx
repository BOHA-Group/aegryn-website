/**
 * /boutique : accueil de La Boutique, la boutique entrepreneuriale de projets
 * emblématiques. Hero en patchwork vidéo calé sur la musique, concept, méthode,
 * valeurs, projets, lieux de rencontre (bientôt), pour qui, savoir-faire complets,
 * magazine et prise de contact confidentielle.
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { HeroPatchwork } from '@/components/boutique/HeroPatchwork'
import { ScrollZoomVideo } from '@/components/boutique/ScrollZoomVideo'
import { SavoirFaire } from '@/components/boutique/SavoirFaire'
import { BOUTIQUE } from '@/content/boutique/copy'
import { SF_UI } from '@/content/boutique/savoirFaire'
import { Aegryn_ASSETS } from '@/data/assets'
import { BUILDER_DAY_ARTICLE, LAUNCH_ANATOMY_ARTICLE, TRENDS_SIGNALS_ARTICLE } from '@/data/articles-home-2026'

type Props = { params: Promise<{ locale: string }> }
const LANGS = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type Lang = typeof LANGS[number]
const toLang = (l: string): Lang => ((LANGS as readonly string[]).includes(l) ? (l as Lang) : 'en')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const lang = toLang(locale)
  return generateAegrynMetadata({
    title: BOUTIQUE.metaTitle[lang], description: BOUTIQUE.metaDesc[lang],
    path: '/boutique', locale, image: '/og/default.jpg',
  })
}

const ARTICLES = [TRENDS_SIGNALS_ARTICLE, BUILDER_DAY_ARTICLE, LAUNCH_ANATOMY_ARTICLE]
const h2 = { fontSize: 'clamp(26px,3vw,44px)' }
const eyebrow = 'font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink'

export default async function BoutiquePage({ params }: Props) {
  const { locale } = await params
  const lang = toLang(locale)
  const [tv, ts, ti] = await Promise.all([
    getTranslations({ locale, namespace: 'about.values' }),
    getTranslations({ locale, namespace: 'homeSegments' }),
    getTranslations({ locale, namespace: 'assets.items' }),
  ])
  const valueKeys = ['exceptional', 'exclusive', 'confidential', 'trust', 'experience', 'elegance'] as const
  const segments = ts.raw('cards') as { key: string; title: string; desc: string }[]
  const projects = Aegryn_ASSETS.filter(a => a.id !== 'subblink' && !a.internalOnly)

  return (
    <main>
      {/* Hero : patchwork vidéo sur le tempo de la musique, sous la barre de navigation transparente */}
      <section className="relative -mt-16 h-[calc(100svh+4rem)] min-h-[700px] overflow-hidden bg-ag-navy" aria-labelledby="boutique-title">
        <HeroPatchwork />
        <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/90 via-ag-navy/20 to-ag-navy/45" />
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto px-6 md:px-12 max-w-7xl px-6 pb-16 md:px-12 md:pb-20">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-ag-apex">{BOUTIQUE.label[lang]}</p>
            <h1
              id="boutique-title"
              className="max-w-4xl font-sans font-bold leading-[1.05] tracking-[-0.03em] text-white text-balance"
              style={{ fontSize: 'clamp(34px,4.8vw,68px)', textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}
            >
              {BOUTIQUE.h1[lang]}
            </h1>
            <p className="mt-6 font-sans text-[clamp(18px,1.8vw,24px)] font-semibold tracking-[-0.01em] text-ag-apex">{BOUTIQUE.signature[lang]}</p>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/85">{BOUTIQUE.sub[lang]}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={{ pathname: '/contact', query: { subject: 'project' } }} className="rounded-full bg-ag-apex px-7 py-3.5 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white">
                {BOUTIQUE.cta1[lang]}
              </Link>
              <a href="#projets" className="rounded-full bg-white/10 px-7 py-3.5 font-sans text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                {BOUTIQUE.cta2[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Le concept */}
      <section className="bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 grid max-w-7xl gap-10 md:grid-cols-12">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black md:col-span-5" style={h2}>{BOUTIQUE.conceptTitle[lang]}</h2>
          <div className="space-y-6 md:col-span-6 md:col-start-7">
            <p className="text-[18px] leading-relaxed text-ag-black/80">{BOUTIQUE.conceptText[lang]}</p>
            <p className="text-[15px] leading-relaxed text-ag-gray">{BOUTIQUE.participation[lang]}</p>
          </div>
        </div>
      </section>

      <ScrollZoomVideo src="/videos/boutique/09-statue-of-liberty.mp4" caption={BOUTIQUE.bandCaption[lang]} />

      {/* La méthode */}
      <section className="bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.methodTitle[lang]}</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-16">
            {BOUTIQUE.steps.map((s, i) => (
              <div key={i}>
                <p className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-sans text-[28px] font-bold tracking-[-0.02em] text-ag-black">{s.title[lang]}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ag-gray">{s.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Les valeurs */}
      <section className="bg-ag-off-white py-28 md:py-32">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.valuesTitle[lang]}</h2>
          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {valueKeys.map(k => (
              <div key={k}>
                <p className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{tv(`${k}.label`)}</p>
                <h3 className="mt-2 font-sans text-[22px] font-bold tracking-[-0.015em] text-ag-black">{tv(`${k}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ag-gray">{tv(`${k}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projets emblématiques */}
      <section id="projets" className="scroll-mt-24 bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.projectsLabel[lang]}</h2>
            <Link href="/portfolio" className="font-sans text-[14px] font-semibold text-ag-navy underline decoration-ag-apex decoration-2 underline-offset-4 hover:text-ag-apex-ink">
              {BOUTIQUE.projectsAll[lang]} →
            </Link>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => (
              <Link key={p.id} href={`/assets/${p.slug}` as never} className="group rounded-2xl bg-ag-off-white p-7 transition-colors hover:bg-ag-navy">
                <p className="font-sans text-[22px] font-bold capitalize tracking-[-0.015em] text-ag-black transition-colors group-hover:text-white">{p.name}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ag-gray transition-colors group-hover:text-white/75">{ti(`${p.id}.tagline` as never)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Les lieux de rencontre, bientôt */}
      <section className="bg-ag-navy py-28 text-white md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">{BOUTIQUE.placesLabel[lang]}</p>
          <h2 className="mt-5 max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.025em]" style={h2}>{BOUTIQUE.placesTitle[lang]}</h2>
          <p className="mt-8 inline-block rounded-full bg-white/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">{BOUTIQUE.soon[lang]}</p>
        </div>
      </section>

      {/* Pour qui */}
      <section className="bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.forWhoTitle[lang]}</h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map(c => (
              <div key={c.key} className="rounded-2xl bg-ag-off-white p-7">
                <h3 className="font-sans text-[19px] font-bold tracking-[-0.01em] text-ag-black">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ag-gray">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Savoir-faire */}
      <section id="savoir-faire" className="scroll-mt-24 bg-white pb-28 md:pb-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <p className={eyebrow}>{BOUTIQUE.label[lang]}</p>
          <h2 className="mt-4 font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{SF_UI.title[lang]}</h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ag-gray">{SF_UI.intro[lang]}</p>
          <div className="mt-12"><SavoirFaire locale={locale} /></div>
        </div>
      </section>

      {/* Magazine La Boutique */}
      <section className="bg-ag-off-white py-28 md:py-32">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <p className={eyebrow}>{BOUTIQUE.magazineLabel[lang]}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.magazineTitle[lang]}</h2>
            <Link href="/blog" className="font-sans text-[14px] font-semibold text-ag-navy underline decoration-ag-apex decoration-2 underline-offset-4">{BOUTIQUE.magazineLink[lang]} →</Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {ARTICLES.map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}` as never} className="group rounded-2xl bg-white p-7 transition-shadow hover:shadow-[0_12px_40px_rgba(15,28,63,0.12)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-apex-ink">{a.category}</p>
                <h3 className="mt-3 font-sans text-[20px] font-bold leading-snug tracking-[-0.015em] text-ag-black">{a.title[lang]}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ag-gray">{a.excerpt[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Soumettre un projet */}
      <section className="bg-ag-navy py-28 text-white md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-4xl text-center">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-balance" style={h2}>{BOUTIQUE.submitTitle[lang]}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75">{BOUTIQUE.submitText[lang]}</p>
          <Link href={{ pathname: '/contact', query: { subject: 'project' } }} className="mt-10 inline-block rounded-full bg-ag-apex px-8 py-4 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white">
            {BOUTIQUE.cta1[lang]}
          </Link>
        </div>
      </section>
    </main>
  )
}
