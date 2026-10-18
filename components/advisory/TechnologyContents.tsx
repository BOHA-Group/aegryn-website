import { useTranslations } from 'next-intl'

const ITEMS = [
  ['situations', 'expertise'],
  ['mettre-en-oeuvre', 'delivery'],
  ['formats-mission', 'formats'],
  ['souverainete', 'sovereignty'],
  ['methode-projet', 'method'],
] as const

export function TechnologyContents() {
  const t = useTranslations('harmony')
  return (
    <nav aria-label={t('contents')} className="sticky top-16 z-20 border-y border-ag-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-6 py-4 md:px-12">
        {ITEMS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="shrink-0 text-[13px] font-semibold text-ag-gray hover:text-ag-apex-ink focus-visible:underline">{t(label)}</a>
        ))}
      </div>
    </nav>
  )
}
