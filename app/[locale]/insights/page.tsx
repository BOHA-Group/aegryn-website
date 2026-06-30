import Link           from 'next/link'
import type { Metadata } from 'next'
import { allInsights } from '@/content/insights/legal-tech-europe-2026'
import { Clock, Tag }  from 'lucide-react'

export const metadata: Metadata = {
  title: 'Insights — AEGRYN Auction',
  description: 'Analyses de marche, tendances M&A et perspectives sectorielles par les equipes AEGRYN Auction.',
}

export default function InsightsIndexPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9C7A3C] mb-3">
            AEGRYN Insights
          </p>
          <h1 className="text-4xl font-bold text-[#0C0C0C] mb-4">
            Analyses de marche
          </h1>
          <p className="text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
            Perspectives sectorielles et analyses M&A par les equipes AEGRYN Auction.
            Chaque article est edite en amont des sessions d'adjudication sur le segment concerne.
          </p>
          <div className="mt-6 w-14 border-t-2 border-[#9C7A3C]" />
        </div>

        {/* Article list */}
        <div className="space-y-6">
          {allInsights.map(article => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="block bg-white border border-[#D9D2C2] p-8 rounded-sm hover:border-[#9C7A3C] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C7A3C]">
                  {article.category}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-[10px] text-[#5C5C5C] flex items-center gap-1">
                  <Clock size={10} />
                  {article.readingMinutes} min
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-[10px] text-[#5C5C5C]">
                  {new Date(article.publishedAt).toLocaleDateString('fr-CH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#0C0C0C] mb-2 group-hover:text-[#9C7A3C] transition-colors">
                {article.content.headline}
              </h2>
              <p className="text-[#5C5C5C] text-sm leading-relaxed mb-4">
                {article.content.subheadline}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {article.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-[#D9D2C2] px-2.5 py-1 text-[#5C5C5C]">
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Auction */}
        <div className="mt-16 border-t border-[#D9D2C2] pt-10 text-center">
          <p className="text-sm text-[#5C5C5C] mb-4">
            Vous souhaitez participer aux prochaines sessions d'adjudication ?
          </p>
          <Link
            href="/auction/catalog"
            className="inline-flex items-center gap-2 bg-[#0C0C0C] text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3.5 hover:opacity-90 transition-opacity"
          >
            Catalogue AEGRYN Auction
          </Link>
        </div>
      </div>
    </main>
  )
}
