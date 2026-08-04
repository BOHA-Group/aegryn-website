// lib/expertiseValidation.ts

import { EXPERTISE_TAXONOMY } from './expertiseTaxonomy'

export interface ExpertiseSelection {
  dimension:   string | null
  categories:  string[]
  specialties: string[]
}

export function validateExpertiseSelection(expertise: ExpertiseSelection): string | null {
  if (!expertise.dimension)
    return 'La dimension advisory est obligatoire.'

  if (expertise.categories.length === 0)
    return 'Sélectionnez au moins 1 catégorie.'

  if (expertise.categories.length > 3)
    return 'Maximum 3 catégories autorisées.'

  if (expertise.specialties.length === 0)
    return 'Sélectionnez au moins 1 spécialité.'

  if (expertise.specialties.length > 6)
    return 'Maximum 6 spécialités autorisées.'

  if (expertise.dimension === 'tech') {
    if (expertise.categories.includes('transaction'))
      return 'Incohérence : dimension "Advisory Tech" incompatible avec la catégorie Transaction.'
  }

  if (expertise.dimension === 'transaction') {
    const techCats = ['security', 'architecture', 'data-ai', 'product-ux']
    if (expertise.categories.some(c => techCats.includes(c)))
      return 'Incohérence : dimension "Advisory Transaction" incompatible avec des catégories Tech.'
  }

  // Vérifier que les spécialités appartiennent aux catégories sélectionnées
  const selectedCatIds = new Set(expertise.categories)
  for (const specId of expertise.specialties) {
    const cat = EXPERTISE_TAXONOMY.find(c => c.specialties.some(s => s.id === specId))
    if (!cat || !selectedCatIds.has(cat.id)) {
      return `Spécialité "${specId}" n'appartient pas aux catégories sélectionnées.`
    }
  }

  return null
}
