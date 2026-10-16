import { IMPLEMENT_ITEMS, IMPLEMENT_NOTES, IMPLEMENT_UI, type Lang } from '@/content/advisory/implement'

/** Bloc « Mettre en œuvre » : ce que le cabinet réalise une fois la décision prise (3 à 4 lignes par métier). */
export function ImplementBlock({ pillar, locale }: { pillar: string; locale: string }) {
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang
  const items = IMPLEMENT_ITEMS[pillar]?.[lang]
  if (!items?.length) return null
  return (
    <section id="mettre-en-oeuvre" className="scroll-mt-24 bg-ag-white px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{IMPLEMENT_UI.label[lang]}</p>
        <h2 className="max-w-3xl font-sans font-bold leading-[1.15] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{IMPLEMENT_UI.lead[lang]}</h2>
        <ol className="mt-12 grid gap-x-16 gap-y-8 md:grid-cols-2">
          {items.map((it, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-4">
              <span className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[15px] leading-relaxed text-ag-black">{it}</p>
            </li>
          ))}
        </ol>
        {(IMPLEMENT_NOTES[pillar]?.[lang] ?? []).length > 0 && (
          <div className="mt-10 flex max-w-3xl flex-col gap-2">
            {IMPLEMENT_NOTES[pillar][lang].map((n, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-ag-gray">{n}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
