import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CYCLES, ITEMS, PHASES, THEME_LABELS, type Cycle, type L6, type Lang } from '@/content/boutique/savoirFaire'

const L = (fr: string, en: string, de: string, es: string, it: string, nl: string): L6 => ({ fr, en, de, es, it, nl })
const UI = {
  label: L('Savoir-faire Boutique', 'La Boutique know-how', 'Know-how der Boutique', 'Savoir-faire de La Boutique', 'Know-how della Boutique', 'Expertise van La Boutique'),
  text: L('Pour ce cycle, La Boutique mobilise notamment :', 'For this cycle, La Boutique draws in particular on:', 'Für diesen Zyklus setzt La Boutique insbesondere ein:', 'Para este ciclo, La Boutique moviliza en particular:', 'Per questo ciclo, La Boutique mobilita in particolare:', 'Voor deze cyclus zet La Boutique onder meer in:'),
  cta: L('Voir tous les savoir-faire de ce cycle', 'See all know-how for this cycle', 'Alle Kompetenzen dieses Zyklus ansehen', 'Ver todo el savoir-faire de este ciclo', 'Vedere tutto il know-how di questo ciclo', 'Alle expertise voor deze cyclus bekijken'),
}

/** Bandeau des pages /accompagner/* : savoir-faire de La Boutique mobilisés sur le cycle. */
export function BoutiqueKnowHowBanner({ cycle, locale }: { cycle: string; locale: string }) {
  if (!(CYCLES as readonly string[]).includes(cycle)) return null
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang
  const items = ITEMS.filter(it => (it.cycles ?? PHASES.find(p => p.key === it.phase)!.cycles).includes(cycle as Cycle)).slice(0, 8)
  return (
    <section className="bg-ag-navy px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">{UI.label[lang]}</p>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/80">{UI.text[lang]}</p>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {items.map((it, i) => (
            <li key={i} className="rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/90">
              <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ag-apex">{THEME_LABELS[it.theme][lang]}</span>{it.text[lang]}
            </li>
          ))}
        </ul>
        <Link href={`/${locale}/boutique#savoir-faire-${cycle}`} className="mt-9 inline-flex items-center gap-2 font-sans text-sm font-semibold text-ag-apex underline decoration-white/30 decoration-2 underline-offset-4 hover:text-white">
          {UI.cta[lang]} <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
