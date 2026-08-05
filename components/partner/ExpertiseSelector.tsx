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
const MAX_SPECIALTIES = 5

const DIMENSION_OPTIONS: { id: Dimension; labels: Record<LocaleKey, string>; subs: Record<LocaleKey, string> }[] = [
  {
    id: 'tech',
    labels: { fr: 'Advisory Tech', en: 'Advisory Tech', de: 'Advisory Tech', es: 'Advisory Tech', it: 'Advisory Tech', nl: 'Advisory Tech' },
    subs:   { fr: '4 catégories', en: '4 categories', de: '4 Kategorien', es: '4 categorías', it: '4 categorie', nl: '4 categorieën' },
  },
  {
    id: 'transaction',
    labels: { fr: 'Advisory Transaction', en: 'Advisory Transaction', de: 'Advisory Transaction', es: 'Advisory Transaction', it: 'Advisory Transaction', nl: 'Advisory Transaction' },
    subs:   { fr: '13 expertises', en: '13 expertises', de: '13 Fachgebiete', es: '13 especialidades', it: '13 competenze', nl: '13 expertises' },
  },
  {
    id: 'both',
    labels: { fr: 'Les deux', en: 'Both', de: 'Beide', es: 'Ambas', it: 'Entrambe', nl: 'Beide' },
    subs:   { fr: '5 catégories', en: '5 categories', de: '5 Kategorien', es: '5 categorías', it: '5 categorie', nl: '5 categorieën' },
  },
]

const UI_LABELS: Record<LocaleKey, {
  step1: string; step2: string; summary: string
  selectCats: string; selectedCount: (n: number, max: number) => string
  selectExperts: string; selectedExpertCount: (n: number, max: number) => string
  maxReachedTitle: string; maxReachedDesc: string
  regulatory: string; expertises: string
}> = {
  fr: {
    step1: 'Étape 1 — Dimension advisory',
    step2: 'Étape 2 — Catégories & Expertises',
    summary: 'Récapitulatif de votre profil d\'expertise',
    selectCats: `Sélectionnez 1 à ${MAX_CATEGORIES} catégories`,
    selectedCount: (n, max) => `${n}/${max} sélectionnée${n > 1 ? 's' : ''}`,
    selectExperts: `Sélectionnez vos expertises (max ${MAX_SPECIALTIES})`,
    selectedExpertCount: (n, max) => `${n}/${max} sélectionnée${n > 1 ? 's' : ''}`,
    maxReachedTitle: 'Maximum atteint',
    maxReachedDesc: 'Vous avez sélectionné 5 expertises. Choisissez les plus représentatives de votre profil pour maximiser votre visibilité.',
    regulatory: 'Réglementaire',
    expertises: 'Expertises',
  },
  en: {
    step1: 'Step 1 — Advisory dimension',
    step2: 'Step 2 — Categories & Expertises',
    summary: 'Your expertise profile summary',
    selectCats: `Select 1 to ${MAX_CATEGORIES} categories`,
    selectedCount: (n, max) => `${n}/${max} selected`,
    selectExperts: `Select your expertises (max ${MAX_SPECIALTIES})`,
    selectedExpertCount: (n, max) => `${n}/${max} selected`,
    maxReachedTitle: 'Maximum reached',
    maxReachedDesc: 'You have selected 5 expertises. Choose the most representative ones to maximize your visibility.',
    regulatory: 'Regulatory',
    expertises: 'Expertises',
  },
  de: {
    step1: 'Schritt 1 — Advisory-Dimension',
    step2: 'Schritt 2 — Kategorien & Fachgebiete',
    summary: 'Zusammenfassung Ihres Expertenprofils',
    selectCats: `Wählen Sie 1 bis ${MAX_CATEGORIES} Kategorien`,
    selectedCount: (n, max) => `${n}/${max} ausgewählt`,
    selectExperts: `Wählen Sie Ihre Fachgebiete (max. ${MAX_SPECIALTIES})`,
    selectedExpertCount: (n, max) => `${n}/${max} ausgewählt`,
    maxReachedTitle: 'Maximum erreicht',
    maxReachedDesc: 'Sie haben 5 Fachgebiete ausgewählt. Wählen Sie die repräsentativsten aus.',
    regulatory: 'Regulatorisch',
    expertises: 'Fachgebiete',
  },
  es: {
    step1: 'Paso 1 — Dimensión advisory',
    step2: 'Paso 2 — Categorías & Especialidades',
    summary: 'Resumen de su perfil de expertise',
    selectCats: `Seleccione 1 a ${MAX_CATEGORIES} categorías`,
    selectedCount: (n, max) => `${n}/${max} seleccionada${n > 1 ? 's' : ''}`,
    selectExperts: `Seleccione sus especialidades (máx. ${MAX_SPECIALTIES})`,
    selectedExpertCount: (n, max) => `${n}/${max} seleccionada${n > 1 ? 's' : ''}`,
    maxReachedTitle: 'Máximo alcanzado',
    maxReachedDesc: 'Ha seleccionado 5 especialidades. Elija las más representativas de su perfil.',
    regulatory: 'Regulatorio',
    expertises: 'Especialidades',
  },
  it: {
    step1: 'Fase 1 — Dimensione advisory',
    step2: 'Fase 2 — Categorie & Competenze',
    summary: 'Riepilogo del profilo di expertise',
    selectCats: `Seleziona da 1 a ${MAX_CATEGORIES} categorie`,
    selectedCount: (n, max) => `${n}/${max} selezionata${n > 1 ? 'e' : ''}`,
    selectExperts: `Seleziona le tue competenze (max ${MAX_SPECIALTIES})`,
    selectedExpertCount: (n, max) => `${n}/${max} selezionata${n > 1 ? 'e' : ''}`,
    maxReachedTitle: 'Massimo raggiunto',
    maxReachedDesc: 'Hai selezionato 5 competenze. Scegli quelle più rappresentative del tuo profilo.',
    regulatory: 'Normativo',
    expertises: 'Competenze',
  },
  nl: {
    step1: 'Stap 1 — Advisory-dimensie',
    step2: 'Stap 2 — Categorieën & Expertises',
    summary: 'Overzicht van uw expertiseprofiel',
    selectCats: `Selecteer 1 tot ${MAX_CATEGORIES} categorieën`,
    selectedCount: (n, max) => `${n}/${max} geselecteerd`,
    selectExperts: `Selecteer uw expertises (max ${MAX_SPECIALTIES})`,
    selectedExpertCount: (n, max) => `${n}/${max} geselecteerd`,
    maxReachedTitle: 'Maximum bereikt',
    maxReachedDesc: 'U heeft 5 expertises geselecteerd. Kies de meest representatieve voor uw profiel.',
    regulatory: 'Regelgevend',
    expertises: 'Expertises',
  },
}

export function ExpertiseSelector({ value, onChange }: ExpertiseSelectorProps) {
  const rawLocale = useLocale()
  const locale    = ((['fr','en','de','es','it','nl'].includes(rawLocale) ? rawLocale : 'fr')) as LocaleKey
  const ui        = UI_LABELS[locale]

  const availableCategories = value.dimension ? getCategoriesByDimension(value.dimension) : []

  // Pour transaction (1 seule catégorie) : auto-sélection transparente
  const isSingleCat = availableCategories.length === 1

  const handleDimension = (dim: Dimension) => {
    // Ne rien faire si on reclique sur la même dimension — évite de purger les sélections
    if (value.dimension === dim) return

    const cats        = getCategoriesByDimension(dim)
    const catIds      = new Set(cats.map(c => c.id))
    // Conserver les catégories déjà sélectionnées si elles existent dans la nouvelle dimension
    const keptCats    = value.categories.filter(id => catIds.has(id))
    const finalCats   = cats.length === 1
      ? [cats[0].id]
      : keptCats

    // Conserver les spécialités dont la catégorie parente est valide dans la nouvelle dimension
    const validSpecIds = new Set(cats.flatMap(c => c.specialties.map(s => s.id)))
    const keptSpecs   = value.specialties.filter(specId => validSpecIds.has(specId))

    onChange({ dimension: dim, categories: finalCats, specialties: keptSpecs })
  }

  const toggleCategory = (catId: string) => {
    if (isSingleCat) return // auto-sélectionnée, non décocher
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

  return (
    <div className="space-y-8">

      {/* ── Étape 1 — Dimension ── */}
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

      {/* ── Étape 2 — Catégories + Expertises en accordion inline ── */}
      {value.dimension && (
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ag-gray mb-1">
            {ui.step2}
          </p>
          <p className="font-mono text-[11px] text-ag-gray-light mb-3">
            {isSingleCat
              ? `${ui.selectExperts}${value.specialties.length > 0 ? ` — ${ui.selectedExpertCount(value.specialties.length, MAX_SPECIALTIES)}` : ''}`
              : `${ui.selectCats}${value.categories.length > 0 ? ` — ${ui.selectedCount(value.categories.length, MAX_CATEGORIES)}` : ''}${value.specialties.length > 0 ? ` · ${ui.selectedExpertCount(value.specialties.length, MAX_SPECIALTIES)} ${ui.expertises.toLowerCase()}` : ''}`
            }
          </p>

          <div className="space-y-2">
            {availableCategories.map(cat => {
              const isSelected = value.categories.includes(cat.id)
              const isDisabled = !isSelected && !isSingleCat && value.categories.length >= MAX_CATEGORIES

              return (
                <div key={cat.id}>
                  {/* ── En-tête catégorie ── */}
                  <button
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
                        {cat.specialties.length} {ui.expertises.toLowerCase()}
                        {!isSingleCat && (cat.dimension === 'tech' ? ' · Advisory Tech' : ' · Advisory Transaction')}
                      </span>
                    </div>
                    {isSingleCat ? null : isSelected ? (
                      <span className="w-5 h-5 border border-ag-black bg-ag-black flex items-center justify-center shrink-0">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    ) : (
                      <span className="w-5 h-5 border border-ag-border flex items-center justify-center shrink-0" />
                    )}
                  </button>

                  {/* ── Expertises inline sous la catégorie sélectionnée ── */}
                  {isSelected && (
                    <div className="border border-t-0 border-ag-black bg-ag-white p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cat.specialties.map(spec => {
                          const specSelected = value.specialties.includes(spec.id)
                          const specDisabled = !specSelected && value.specialties.length >= MAX_SPECIALTIES

                          return (
                            <button
                              key={spec.id}
                              type="button"
                              disabled={specDisabled}
                              onClick={() => toggleSpecialty(spec.id)}
                              className={`border p-3 text-left transition-all duration-200 ${
                                specSelected
                                  ? 'border-ag-black bg-ag-off-white'
                                  : specDisabled
                                    ? 'border-ag-border opacity-40 cursor-not-allowed'
                                    : 'border-ag-border hover:border-ag-black'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <span className="block font-sans text-[13px] font-semibold text-ag-black leading-snug">
                                    {getSpecialtyLabel(spec, locale)}
                                  </span>
                                  <span className="block font-mono text-[11px] text-ag-gray leading-relaxed mt-1">
                                    {locale === 'fr' ? spec.descriptionFr : spec.description}
                                  </span>
                                  {(spec.cifs && spec.cifs.length > 0) || spec.regulatory ? (
                                    <div className="flex flex-wrap items-center gap-1 mt-2">
                                      {spec.cifs?.map(dim => (
                                        <span key={dim} className="font-mono text-[9px] tracking-[0.1em] border border-ag-border px-1.5 py-0.5 text-ag-gray-light">
                                          {dim}
                                        </span>
                                      ))}
                                      {spec.regulatory && (
                                        <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-ag-apex border border-ag-apex px-1.5 py-0.5">
                                          {ui.regulatory}
                                        </span>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                                {specSelected && (
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
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Récapitulatif ── */}
      {value.specialties.length > 0 && (
        <div className="border-t border-ag-border pt-6">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ag-gray mb-3">
            {ui.summary}
          </p>

          {/* Banner max atteint */}
          {value.specialties.length >= MAX_SPECIALTIES && (
            <div className="mb-4 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 shrink-0 mt-0.5">
                {value.specialties.length}/{MAX_SPECIALTIES}
              </span>
              <div>
                <p className="font-sans font-semibold text-amber-800 text-[12px]">{ui.maxReachedTitle}</p>
                <p className="font-sans text-[11px] text-amber-700 mt-0.5 leading-relaxed">{ui.maxReachedDesc}</p>
              </div>
            </div>
          )}

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
