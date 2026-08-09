/**
 * Payload de réinitialisation complète d'une fiche expert — vide tous les champs
 * de contenu et remet le workflow de publication à zéro (brouillon, non visible).
 * Utilisé côté admin (reset forcé) et côté partenaire (repartir d'une fiche vierge).
 */
export const EXPERT_PROFILE_BLANK: Record<string, unknown> = {
  first_name:             '',
  last_name:              '',
  profession:             '',
  specialties:            [],
  expertise_dimension:    null,
  expertise_categories:   [],
  expertise_specialties:  [],
  city:                   null,
  country_code:           'CH',
  bio:                    null,
  organization:           null,
  email_public:           null,
  phone:                  null,
  phone_country:          'CH',
  website:                null,
  min_rate_eur:           null,
  rate_currency:          'CHF',
  languages:              [],
  avatar_url:             null,
  category:               null,
  domain:                 [],
  is_visible:             false,
  hidden_reason:          null,
  verified_at:            null,
  review_status:          'draft',
}
