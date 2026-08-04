import {
  EXPERTISE_TAXONOMY,
  getCategoryLabel,
  getSpecialtyLabel,
  type LocaleKey,
} from '@/lib/expertiseTaxonomy'

interface ExpertiseBadgesProps {
  specialties: string[]
  locale?:     LocaleKey
}

export function ExpertiseBadges({ specialties, locale = 'fr' }: ExpertiseBadgesProps) {
  const grouped = EXPERTISE_TAXONOMY.reduce<Record<string, string[]>>((acc, cat) => {
    const catSpecialties = specialties.filter(sId => cat.specialties.some(s => s.id === sId))
    if (catSpecialties.length > 0) acc[cat.id] = catSpecialties
    return acc
  }, {})

  if (Object.keys(grouped).length === 0) return null

  return (
    <div className="space-y-4">
      {EXPERTISE_TAXONOMY
        .filter(cat => grouped[cat.id])
        .map(cat => (
          <div key={cat.id}>
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light mb-2">
              {getCategoryLabel(cat, locale)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {grouped[cat.id].map(specId => {
                const spec = cat.specialties.find(s => s.id === specId)
                if (!spec) return null
                return (
                  <span
                    key={specId}
                    className="font-mono text-[10px] border border-ag-border px-2.5 py-1 text-ag-black"
                  >
                    {getSpecialtyLabel(spec, locale)}
                  </span>
                )
              })}
            </div>
          </div>
        ))
      }
    </div>
  )
}
