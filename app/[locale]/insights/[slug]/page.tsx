import { notFound }   from 'next/navigation'
import Link           from 'next/link'
import type { Metadata } from 'next'
import { allInsights } from '@/content/insights/legal-tech-europe-2026'
import { Clock, Tag, ArrowLeft, ArrowRight } from 'lucide-react'

interface Props { params: Promise<{ slug: string; locale: string }> }

export async function generateStaticParams() {
  return allInsights.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article   = allInsights.find(a => a.slug === slug)
  if (!article) return {}
  return {
    title:       article.seo.title,
    description: article.seo.description,
    openGraph: {
      title:       article.seo.title,
      description: article.seo.description,
      images:      [article.seo.ogImage],
      type:        'article',
      publishedTime: article.publishedAt,
    },
  }
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params
  const article   = allInsights.find(a => a.slug === slug)
  if (!article) notFound()

  const { content } = article

  /* JSON-LD Article schema.org */
  const jsonLd = {
    '@context':        'https://schema.org',
    '@type':           'Article',
    headline:          content.headline,
    description:       content.subheadline,
    datePublished:     article.publishedAt,
    publisher: {
      '@type': 'Organization',
      name:    'AEGRYN Auction',
      url:     'https://aegryn.com',
    },
    keywords: article.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FAF8F3]">

        {/* Header article */}
        <div className="bg-[#0C0C0C] py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-[#9C7A3C] text-[11px] font-bold uppercase tracking-widest mb-8 hover:opacity-80"
            >
              <ArrowLeft size={11} />
              Insights
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C7A3C]">
                {article.category}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} />
                {article.readingMinutes} min
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-[10px] text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString('fr-CH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {content.headline}
            </h1>
            <p className="text-[#9BA8B0] text-lg leading-relaxed">
              {content.subheadline}
            </p>

            <div className="flex items-center gap-2 flex-wrap mt-6">
              {article.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-gray-700 px-2.5 py-1 text-gray-400">
                  <Tag size={8} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-6 py-14">

          {/* Intro */}
          <p className="text-[17px] leading-[1.8] text-[#1A1A1A] mb-10 font-medium">
            {content.intro}
          </p>

          <div className="w-14 border-t-2 border-[#9C7A3C] mb-10" />

          {/* Sections */}
          {content.sections.map((section, i) => (
            <section key={i} className="mb-10">
              <h2 className="text-xl font-bold text-[#0C0C0C] mb-4">
                {section.title}
              </h2>
              <div className="text-[15px] leading-[1.8] text-[#1A1A1A] space-y-4">
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="w-14 border-t-2 border-[#9C7A3C] my-10" />

          {/* Conclusion */}
          <div className="bg-white border border-[#D9D2C2] px-8 py-7 rounded-sm mb-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#9C7A3C] mb-3">
              Conclusion
            </p>
            <p className="text-[15px] leading-[1.8] text-[#1A1A1A]">
              {content.conclusion}
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={content.cta.href}
              className="inline-flex items-center gap-2 bg-[#0C0C0C] text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3.5 hover:opacity-90 transition-opacity"
            >
              {content.cta.label}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
