import type { AdvisoryKey } from './types'

/**
 * Visuels des cartes « Six situations », par métier, dans l'ordre des situations.
 * Centralisés ici : une image ne dépend pas de la langue.
 * Règles : aucune image répétée dans une page, aucune image de hero (`/images/advisory/*.webp`),
 * ni image déjà utilisée ailleurs sur le site (handshake, meeting-room : page Talent / blog).
 */
export const SITUATION_IMAGES: Record<AdvisoryKey, string[]> = {
  strategy: [
    '/images/advisory/situations/dashboard-laptop.jpg',
    '/images/advisory/situations/developer-desk.jpg',
    '/images/advisory/situations/discussion-hands.jpg',
    '/images/advisory/situations/office-corridor.jpg',
    '/images/advisory/situations/planning-laptops.jpg',
    '/images/advisory/situations/plan-writing.jpg',
  ],
  riskCompliance: [
    '/images/advisory/situations/laptop-hands.jpg',
    '/images/advisory/situations/discussion-hands.jpg',
    '/images/advisory/situations/laptop-phone.jpg',
    '/images/advisory/situations/network-cables.jpg',
    '/images/advisory/situations/planning-laptops.jpg',
    '/images/advisory/situations/open-office.jpg',
  ],
  technology: [
    '/images/advisory/situations/server-room-walk.jpg',
    '/images/advisory/situations/developer-desk.jpg',
    '/images/advisory/situations/loft-office.jpg',
    '/images/advisory/situations/laptop-phone.jpg',
    '/images/advisory/situations/open-office.jpg',
    '/images/advisory/situations/network-cables.jpg',
  ],
  talentOrganization: [
    '/images/advisory/situations/open-office.jpg',
    '/images/advisory/situations/discussion-hands.jpg',
    '/images/advisory/situations/laptop-hands.jpg',
    '/images/advisory/situations/loft-office.jpg',
    '/images/advisory/situations/plan-writing.jpg',
    '/images/advisory/situations/office-corridor.jpg',
  ],
  ma: [
    '/images/advisory/situations/planning-laptops.jpg',
    '/images/advisory/situations/dashboard-laptop.jpg',
    '/images/advisory/situations/loft-office.jpg',
    '/images/advisory/situations/open-office.jpg',
    '/images/advisory/situations/industrial-engineer.jpg',
    '/images/advisory/situations/server-room-walk.jpg',
  ],
  financePerformance: [
    '/images/advisory/situations/dashboard-laptop.jpg',
    '/images/advisory/situations/laptop-hands.jpg',
    '/images/advisory/situations/planning-laptops.jpg',
    '/images/advisory/situations/plan-writing.jpg',
    '/images/advisory/situations/open-office.jpg',
    '/images/advisory/situations/loft-office.jpg',
  ],
  operationsExcellence: [
    '/images/advisory/situations/industrial-engineer.jpg',
    '/images/advisory/situations/open-office.jpg',
    '/images/advisory/situations/laptop-phone.jpg',
    '/images/advisory/situations/discussion-hands.jpg',
    '/images/advisory/situations/plan-writing.jpg',
    '/images/advisory/situations/office-corridor.jpg',
  ],
  projectProgram: [
    '/images/advisory/situations/planning-laptops.jpg',
    '/images/advisory/situations/open-office.jpg',
    '/images/advisory/situations/dashboard-laptop.jpg',
    '/images/advisory/situations/plan-writing.jpg',
    '/images/advisory/situations/loft-office.jpg',
    '/images/advisory/situations/developer-desk.jpg',
  ],
}
