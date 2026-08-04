'use client'

import { useLocale } from 'next-intl'
import {
  EXPERTISE_TAXONOMY,
  getCategoriesByDimension,
  getCategoryLabel,
  getSpecialtyLabel,
  type Dimension,
  type LocaleKey,
} from '@/lib/expertiseTaxonomy'

export interface ExpertiseValue {
  dimension:   Dimension | null
  categories:  string[]
  specialties: string[]
}

interface ExpertiseSelectorProps {
  value:    ExpertiseValue
  onChange: (value: ExpertiseValue) => void
}

const MAX_CATEGORIES  = 3
const MAX_SPECIALTIES = 6

const DIMENSION_OPTIONS: { id: Dimension; labels: Record<LocaleKey, string>; subs: Record<LocaleKey, string> }[] = [
  {
    id: 'tech',
    labels: { fr: 'Advisory Tech', en: 'Advisory Tech', de: 'Advisory Tech', es: 'Advisory Tech', it: 'Advisory Tech', nl: 'Advisory Tech' },
    subs:   { fr: '4 catégories', en: '4 categories', de: '4 Kategorien', es: '4 categorías', it: '4 categorie', nl: '4 categorieën' },
  },
  {
    id: 'transaction',
    labels: { fr: 'Advisory Transaction', en: 'Advisory Transaction', de: 'Advisory Transaction', es: 'Advisory Transaction', it: 'Advisory Transaction', nl: 'Advisory Transaction' },
    subs:   { fr: '1 catégorie', en: '1 category', de: '1 Kategorie', es: '1 categoría', it: '1 categoria', nl: '1 categorie' },
  },
  {
    id: 'both',
    labels: { fr: 'Les deux', en: 'Both', de: 'Beide', es: 'Ambas', it: 'Entrambe', nl: 'Beide' },
    subs:   { fr: '5 catégories', en: '5 categories', de: '5 Kategorien', es: '5 categorías', it: '5 categorie', nl: '5 categorieën' },
  },
]

const UI_LABELS: Record<LocaleKey, {
  step1: string; step2: string; step3: string; summary: string
  selectCats: string; selectedCount: (n: number, max: number) => string
  selectSpecs: string; selectedSpecCount: (n: number, max: number) => string
  regulatory: string
}> = {
  fr: {
    step1: 'Étape 1 — Dimension advisory',
    step2: 'Étape 2 — Catégories',
    step3: 'Étape 3 — Spécialités',
    summary: 'Récapitulatif de votre profil d\'expertise',
    selectCats: `Sélectionnez 1 à ${MAX_CATEGORIES} catégories`,
    selectedCount: (n, max) => `${n}/${max} sélectionnée${n > 1 ? 's' : ''}`,
    selectSpecs: `Sélectionnez vos spécialités (max ${MAX_SPECIALTIES})`,
    selectedSpecCount: (n, max) => `${n}/${max} sélectionnée${n > 1 ? 's' : ''}`,
    regulatory: 'Réglementaire',
  },
  en: {
    step1: 'Step 1 — Advisory dimension',
    step2: 'Step 2 — Categories',
    step3: 'Step 3 — Specialties',
    summary: 'Your expertise profile summary',
    selectCats: `Select 1 to ${MAX_CATEGORIES} categories`,
    selectedCount: (n, max) => `${n}/${max} selected`,
    selectSpecs: `Select your specialties (max ${MAX_SPECIALTIES})`,
    selectedSpecCount: (n, max) => `${n}/${max} selected`,
    regulatory: 'Regulatory',
  },
  de: {
    step1: 'Schritt 1 — Advisory-Dimension',
    step2: 'Schritt 2 — Kategorien',
    step3: 'Schritt 3 — Spezialgebiete',
    summary: 'Zusammenfassung Ihres Expertenprofils',
    selectCats: `Wählen Sie 1 bis ${MAX_CATEGORIES} Kategorien`,
    selectedCount: (n, max) => `${n}/${max} ausgewählt`,
    selectSpecs: `Wählen Sie Ihre Spezialgebiete (max. ${MAX_SPECIALTIES})`,
    selectedSpecCount: (n, max) => `${n}/${max} ausgewählt`,
    regulatory: 'Regulatorisch',
  },
  es: {
    step1: 'Paso 1 — Dimensión advisory',
    step2: 'Paso 2 — Categorías',
    step3: 'Paso 3 — Especialidades',
    summary: 'Resumen de su perfil de expertise',
    selectCats: `Seleccione 1 a ${MAX_CATEGORIES} categorías`,
    selectedCount: (n, max) => `${n}/${max} seleccionada${n > 1 ? 's' : ''}`,
    selectSpecs: `Seleccione sus especialidades (máx. ${MAX_SPECIALTIES})`,
    selectedSpecCount: (n, max) => `${n}/${max} seleccionada${n > 1 ? 's' : ''}`,
    regulatory: 'Regulatorio',
  },
  it: {
    step1: 'Fase 1 — Dimensione advisory',
    step2: 'Fase 2 — Categorie',
    step3: 'Fase 3 — Specialità',
    summary: 'Riepilogo del profilo di expertise',
    selectCats: `Seleziona da 1 a ${MAX_CATEGORIES} categorie`,
    selectedCount: (n, max) => `${n}/${max} selezionata${n > 1 ? 'e' : ''}`,
    selectSpecs: `Seleziona le tue specialità (max ${MAX_SPECIALTIES})`,
    selectedSpecCount: (n, max) => `${n}/${max} selezionata${n > 1 ? 'e' : ''}`,
    regulatory: 'Normativo',
  },
  nl: {
    step1: 'Stap 1 — Advisory-dimensie',
    step2: 'Stap 2 — Categorieën',
    step3: 'Stap 3 — Specialisaties',
    summary: 'Overzicht van uw expertiseprofiel',
    selectCats: `Selecteer 1 tot ${MAX_CATEGORIES} categorieën`,
    selectedCount: (n, max) => `${n}/${max} geselecteerd`,
    selectSpecs: `Selecteer uw specialisaties (max ${MAX_SPECIALTIES})`,
    selectedSpecCount: (n, max) => `${n}/${max} geselecteerd`,
    regulatory: 'Regelgevend',
  },
}

export function ExpertiseSelector({ value, onChange }: ExpertiseSelectorProps) {
  const rawLocale = useLocale()
  const locale    = ((['fr','en','de','es','it','nl'].includes(rawLocale) ? rawLocale : 'fr')) as LocaleKey
  const ui        = UI_LABELS[locale]

  const handleDimension = (dim: Dimension) => {
    onChange({ dimension: dim, categories: [], specialties: [] })
  }

  const toggleCategory = (catId: string) => {
    const current    = value.categories
    const isSelected = current.includes(catId)
    let next: string[]

    if (isSelected) {
      next = current.filter(c => c !== catId)
    } else {
      if (current.length >= MAX_CATEGORIES) return
      next = [...current, catId]
    }

    const validCatIds = new Set(next)
    const filteredSpecialties = value.specialties.filter(sId => {
      const cat = EXPERTISE_TAXONOMY.find(c => c.specialties.some(s => s.id === sId))
      return cat && validCatIds.has(cat.id)
    })

    onChange({ ...value, categories: next, specialties: filteredSpecialties })
  }

  const toggleSpecialty = (specId: string) => {
    const current    = value.specialties
    const isSelected = current.includes(specId)

    if (isSelected) {
      onChange({ ...value, specialties: current.filter(s => s !== specId) })
    } else {
      if (current.length >= MAX_SPECIALTIES) return
      onChange({ ...value, specialties: [...current, specId] })
    }
  }

  const availableCategories = value.dimension ? getCategoriesByDimension(value.dimension) : []

  return (
    <div className="space-y-8">

      {/* ── Étape 1 ── */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ag-gray mb-3">
          {ui.step1}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DIMENSION_OPTIONS.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleDimension(d.id)}
              className={`border p-4 text-left transition-all duration-200 ${
                value.dimension === d.id
                  ? 'border-ag-black bg-ag-black text-white'
                  : 'border-ag-border hover:border-ag-black'
              }`}
            >
              <span className="block font-sans font-bold text-[13px] tracking-[-0.01em]">
                {d.labels[locale]}
              </span>
              <span className="block font-mono text-[10px] tracking-[0.1em] uppercase mt-1 opacity-60">
                {d.subs[locale]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Étape 2 ── */}
      {value.dimension && (
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ag-gray mb-1">
            {ui.step2}
          </p>
          <p className="font-mono text-[11px] text-ag-gray-light mb-3">
            {ui.selectCats}
            {value.categories.length > 0 && ` — ${ui.selectedCount(value.categories.length, MAX_CATEGORIES)}`}
          </p>
          <div className="space-y-2">
            {availableCategories.map(cat => {
              const isSelected = value.categories.includes(cat.id)
              const isDisabled = !isSelected && value.categories.length >= MAX_CATEGORIES

              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full border p-4 text-left transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'border-ag-black bg-ag-off-white'
                      : isDisabled
                        ? 'border-ag-border opacity-40 cursor-not-allowed'
                        : 'border-ag-border hover:border-ag-black'
                  }`}
                >
                  <div>
                    <span className="block font-sans font-bold text-[13px] text-ag-black">
                      {getCategoryLabel(cat, locale)}
                    </span>
                    <span className="block font-mono text-[10px] tracking-[0.1em] uppercase text-ag-gray-light mt-1">
                      {cat.specialties.length} spécialité{cat.specialties.length > 1 ? 's' : ''}
                      {cat.dimension === 'tech' ? ' · Advisory Tech' : ' · Advisory Transaction'}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 border border-ag-black bg-ag-black flex items-center justify-center shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Étape 3 ── */}
      {value.categories.length > 0 && (
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ag-gray mb-1">
            {ui.step3}
          </p>
          <p className="font-mono text-[11px] text-ag-gray-light mb-3">
            {ui.selectSpecs}
            {value.specialties.length > 0 && ` — ${ui.selectedSpecCount(value.specialties.length, MAX_SPECIALTIES)}`}
          </p>

          {availableCategories
            .filter(cat => value.categories.includes(cat.id))
            .map(cat => (
              <div key={cat.id} className="mb-6">
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light border-t border-ag-border pt-3 mb-3">
                  {getCategoryLabel(cat, locale)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cat.specialties.map(spec => {
                    const isSelected = value.specialties.includes(spec.id)
                    const isDisabled = !isSelected && value.specialties.length >= MAX_SPECIALTIES

                    return (
                      <button
                        key={spec.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleSpecialty(spec.id)}
                        className={`border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-ag-black bg-ag-off-white'
                            : isDisabled
                              ? 'border-ag-border opacity-40 cursor-not-allowed'
                              : 'border-ag-border hover:border-ag-black'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="block font-sans text-[13px] font-medium text-ag-black">
                              {getSpecialtyLabel(spec, locale)}
                            </span>
                            <span className="block font-mono text-[11px] text-ag-gray-light leading-relaxed mt-1">
                              {locale === 'fr' ? spec.descriptionFr : spec.description}
                            </span>
                            {spec.cifs && spec.cifs.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {spec.cifs.map(dim => (
                                  <span key={dim} className="font-mono text-[9px] tracking-[0.1em] border border-ag-border px-1.5 py-0.5 text-ag-gray-light">
                                    {dim}
                                  </span>
                                ))}
                              </div>
                            )}
                            {spec.regulatory && (
                              <span className="inline-block font-mono text-[9px] tracking-[0.1em] uppercase mt-2 text-ag-apex border border-ag-apex px-1.5 py-0.5">
                                {ui.regulatory}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <span className="w-4 h-4 border border-ag-black bg-ag-black flex items-center justify-center shrink-0 mt-0.5">
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path d="M1 3L2.8 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* ── Récapitulatif ── */}
      {value.specialties.length > 0 && (
        <div className="border-t border-ag-border pt-6">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ag-gray mb-3">
            {ui.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {value.specialties.map(specId => {
              const cat  = EXPERTISE_TAXONOMY.find(c => c.specialties.some(s => s.id === specId))
              const spec = cat?.specialties.find(s => s.id === specId)
              if (!spec) return null
              return (
                <span key={specId} className="font-mono text-[11px] border border-ag-border px-3 py-1.5 flex items-center gap-2">
                  {getSpecialtyLabel(spec, locale)}
                  <button
                    type="button"
                    onClick={() => toggleSpecialty(specId)}
                    className="text-ag-gray-light hover:text-ag-black transition-colors"
                    aria-label={`Retirer ${spec.labelFr}`}
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
