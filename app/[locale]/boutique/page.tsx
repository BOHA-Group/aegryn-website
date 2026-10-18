/**
 * /boutique : accueil de La Boutique, la boutique entrepreneuriale de projets
 * emblématiques. Hero en patchwork vidéo calé sur la musique, concept, méthode,
 * valeurs, projets, lieux de rencontre (bientôt), pour qui, savoir-faire complets,
 * magazine et prise de contact confidentielle.
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { generateAegrynMetadata, generateWebPageSchema, generateServiceSchema, pageUrl } from '@/lib/seo'
import { HeroPatchwork } from '@/components/boutique/HeroPatchwork'
import { ScrollZoomVideo } from '@/components/boutique/ScrollZoomVideo'
import { PortraitScroll } from '@/components/boutique/PortraitScroll'
import { TypedTitle } from '@/components/boutique/TypedTitle'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ProjectsScroller } from '@/components/boutique/ProjectsScroller'
import Image from 'next/image'
import { ArticleCard } from '@/components/sections/ArticleCard'
import { ArticleStrip } from '@/components/sections/ArticleStrip'
import { AllArticlesButton } from '@/components/sections/AllArticlesButton'
import { ARTICLE_CATEGORIES } from '@/data/articles'
import { BLOG_IMAGES, BLOG_IMAGE_FALLBACK, getBlogImagePosition } from '@/data/blogImages'
import { SavoirFaire } from '@/components/boutique/SavoirFaire'
import { BOUTIQUE, H1_LINES, br } from '@/content/boutique/copy'
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

const SEGMENT_IMAGES: Record<string, string> = {
  startup:    '/images/boutique/entrepreneurs-team.jpg',
  funds:      '/images/blog/family-business.jpg',
  enterprise: '/images/blog/office-building.jpg',
  pme:        '/images/boutique/industrial-bottling.jpg',
}
const ARTICLES = [TRENDS_SIGNALS_ARTICLE, BUILDER_DAY_ARTICLE, LAUNCH_ANATOMY_ARTICLE]
const h2 = { fontSize: 'clamp(26px,3vw,44px)' }

export default async function BoutiquePage({ params }: Props) {
  const { locale } = await params
  const lang = toLang(locale)
  const [tv, ts, tBlog] = await Promise.all([
    getTranslations({ locale, namespace: 'about.values' }),
    getTranslations({ locale, namespace: 'homeSegments' }),
    getTranslations({ locale, namespace: 'discover' }),
  ])
  const valueKeys = ['exceptional', 'exclusive', 'confidential', 'trust', 'experience', 'elegance'] as const
  const segments = ts.raw('cards') as { key: string; title: string; desc: string }[]
  const projects = Aegryn_ASSETS.filter(a => a.id !== 'subblink' && !a.internalOnly)

  const url = pageUrl('/boutique', locale)
  const jsonLd = [
    generateWebPageSchema({
      name: BOUTIQUE.metaTitle[lang], description: BOUTIQUE.metaDesc[lang], url,
      breadcrumbs: [{ name: 'Aegryn', url: pageUrl('/', locale) }, { name: BOUTIQUE.label[lang], url }],
    }),
    generateServiceSchema({
      name: 'La Boutique', description: BOUTIQUE.metaDesc[lang], url,
      serviceType: 'Signature project framing, delivery and accompaniment', areaServed: 'Europe',
    }),
  ]

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero : patchwork vidéo sur le tempo de la musique, sous la barre de navigation transparente */}
      <section data-nav-hero className="relative -mt-16 h-[calc(96vh+4rem)] min-h-[704px] overflow-hidden bg-ag-navy" aria-labelledby="boutique-title">
        <HeroPatchwork />
        <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/90 via-ag-navy/40 to-ag-navy/45" />
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto px-6 md:px-12 max-w-7xl px-6 pb-16 md:px-12 md:pb-20">
            <TypedTitle
              id="boutique-title"
              line1={H1_LINES[lang][0]}
              line2={H1_LINES[lang][1]}
              className="mb-8 max-w-4xl font-sans font-bold leading-[1.15] tracking-[-0.03em] text-white"
              style={{ fontSize: 'clamp(30px,4.2vw,58px)', textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}
            />
            <RevealOnScroll>
              <p className="max-w-2xl text-[16px] leading-relaxed text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.45)' }}><span className="font-semibold text-ag-apex">{BOUTIQUE.signature[lang]}</span> {BOUTIQUE.sub[lang]}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={{ pathname: '/contact', query: { subject: 'project' } }} className="rounded-full bg-ag-apex px-7 py-3.5 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white">
                  {BOUTIQUE.cta1[lang]}
                </Link>
                <a href="#projets" className="rounded-full bg-white/10 px-7 py-3.5 font-sans text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                  {BOUTIQUE.cta2[lang]}
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Le concept */}
      <section className="bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 grid max-w-7xl gap-10 md:grid-cols-12">
          <h2 className="whitespace-pre-line font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black md:col-span-5" style={h2}>{BOUTIQUE.conceptTitleLead[lang]}<span className="font-script block">{BOUTIQUE.conceptTitleAccent[lang]}</span></h2>
          <div className="space-y-6 md:col-span-6 md:col-start-7">
            <p className="text-[18px] leading-relaxed text-ag-black/80">{BOUTIQUE.conceptText[lang]}</p>
            <p className="text-[15px] leading-relaxed text-ag-gray">{BOUTIQUE.participation[lang]}</p>
          </div>
        </div>
      </section>

      <ScrollZoomVideo src="/videos/boutique/statue-of-liberty-full.mp4" srcMobile="/videos/boutique/statue-of-liberty-full-m.mp4" objectPosition="38% 50%" caption={br(BOUTIQUE.bandCaption[lang])} />

      {/* La méthode */}
      <section className="bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.methodTitleLead[lang]} <span className="font-script">{BOUTIQUE.methodTitleAccent[lang]}</span></h2>
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

      <PortraitScroll caption={br(BOUTIQUE.portraitCaption[lang])} />

      {/* Les valeurs */}
      <section className="bg-ag-off-white py-28 md:py-32">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.valuesTitleLead[lang]}<span className="font-script">{BOUTIQUE.valuesTitleAccent[lang]}</span></h2>
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

      {/* Projets signature : défilement horizontal épinglé, image et titre, clic vers la page du projet */}
      <ProjectsScroller
        title={<>{BOUTIQUE.projectsTitlePre[lang]}<span className="font-script">{BOUTIQUE.projectsTitleAccent[lang]}</span>{BOUTIQUE.projectsTitlePost[lang]}</>}
        titleSr={BOUTIQUE.projectsLabel[lang]}
        allLabel={BOUTIQUE.projectsAll[lang]}
        projects={projects}
      />

      {/* Les lieux de rencontre, bientôt */}
      <section className="bg-ag-navy py-14 text-white md:py-16">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex"><span className="inline-block h-px w-5 bg-ag-apex/50" />{BOUTIQUE.placesLabel[lang]}</p>
          <h2 className="mt-4 max-w-3xl font-sans font-bold leading-[1.2] tracking-[-0.025em]" style={h2}>{BOUTIQUE.placesTitle[lang].replace(/\n/g, ' ')}</h2>
          <p className="mt-8 inline-block rounded-full bg-white/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">{BOUTIQUE.soon[lang]}</p>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="scroll-mt-24 bg-white py-28 md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{BOUTIQUE.forWhoTitlePre[lang]}<span className="font-script">{BOUTIQUE.forWhoTitleAccent[lang]}</span>{BOUTIQUE.forWhoTitlePost[lang]}</h2>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((c, i) => (
              <div key={c.key} className="group relative flex flex-col justify-end overflow-hidden rounded-xl" style={{ minHeight: 'clamp(300px, 28vw, 380px)' }}>
                <Image src={SEGMENT_IMAGES[c.key] ?? SEGMENT_IMAGES.startup} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.22em] text-white/70">{String(i + 1).padStart(2, '0')}</span>
                <div className="relative z-10 p-5">
                  <h3 className="font-sans text-[18px] font-bold leading-[1.15] tracking-[-0.01em] text-white">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/80">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Savoir-faire */}
      <section id="savoir-faire" className="scroll-mt-24 bg-white pb-20 md:pb-24">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <h2 className="font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{SF_UI.titleLead[lang]}<span className="font-script">{SF_UI.titleAccent[lang]}</span></h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ag-gray">{SF_UI.intro[lang]}</p>
          <div className="mt-8"><SavoirFaire locale={locale} /></div>
        </div>
      </section>

      {/* Magazine La Boutique */}
      <section className="bg-ag-off-white py-28 md:py-32">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />
                {BOUTIQUE.magazineLabel[lang]}</p>
              <h2 className="font-sans font-bold leading-[1.15] tracking-[-0.03em] text-ag-black" style={h2}>{BOUTIQUE.magazineTitle[lang]}</h2>
            </div>
            <AllArticlesButton label={BOUTIQUE.magazineLink[lang]} className="hidden shrink-0 md:inline-flex" />
          </div>
          <ArticleStrip>
            {ARTICLES.map(a => {
              const img = BLOG_IMAGES[a.slug] ?? BLOG_IMAGE_FALLBACK
              return (
                <ArticleCard
                  key={a.slug}
                  slug={a.slug}
                  title={a.title[lang] ?? a.title.en}
                  category={ARTICLE_CATEGORIES[a.category][lang] ?? ARTICLE_CATEGORIES[a.category].en}
                  date={new Date(a.date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                  readTime={`${a.readMin} ${tBlog('readMinShort')}`}
                  excerpt={a.excerpt[lang] ?? a.excerpt.en}
                  image={img}
                  imagePosition={getBlogImagePosition(img)}
                />
              )
            })}
          </ArticleStrip>
          <div className="mt-8 md:hidden"><AllArticlesButton label={BOUTIQUE.magazineLink[lang]} /></div>
        </div>
      </section>

      {/* Soumettre un projet */}
      <section className="bg-ag-navy py-28 text-white md:py-36">
        <div className="mx-auto px-6 md:px-12 max-w-4xl text-center">
          <h2 className="whitespace-pre-line font-sans font-bold leading-[1.1] tracking-[-0.025em]" style={h2}>{br(BOUTIQUE.submitTitle[lang])}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75">{BOUTIQUE.submitText[lang]}</p>
          <Link href={{ pathname: '/contact', query: { subject: 'project' } }} className="mt-10 inline-block rounded-full bg-ag-apex px-8 py-4 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white">
            {BOUTIQUE.cta1[lang]}
          </Link>
        </div>
      </section>
    </main>
  )
}
