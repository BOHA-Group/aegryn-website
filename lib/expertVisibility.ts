import { createServiceClient } from '@/lib/supabase'

/**
 * Recalcule automatiquement la visibilité (`is_visible`) d'une fiche expert
 * en fonction des 3 prérequis de publication :
 *   1. Validation admin du contenu    → expert_profiles.review_status === 'approved'
 *   2. KYC approuvé                   → profiles.kyc_status === 'approved'
 *   3. Abonnement actif (ou crédit)   → profiles.expert_plan === 'active' OU expert_plan_end > now
 *
 * Un refus admin (`review_status = 'rejected'`) ou un masquage silencieux
 * (`hidden_reason = 'admin_hidden'`) bloquent toute republication automatique
 * jusqu'à ce qu'un admin lève le blocage explicitement.
 *
 * Retourne le nouvel état `is_visible` (ou l'état inchangé si la fiche n'existe pas).
 */
export async function syncExpertVisibility(
  supa: ReturnType<typeof createServiceClient>,
  userId: string,
): Promise<boolean | null> {
  const { data: ep } = await supa
    .from('expert_profiles')
    .select('id, review_status, is_visible, hidden_reason')
    .eq('user_id', userId)
    .maybeSingle()

  if (!ep) return null

  // Blocage explicite : refus admin ou masquage silencieux → jamais republié automatiquement
  if (ep.review_status === 'rejected' || ep.hidden_reason === 'admin_hidden') {
    if (ep.is_visible) {
      await supa.from('expert_profiles').update({ is_visible: false }).eq('id', ep.id)
    }
    return false
  }

  const { data: profile } = await supa
    .from('profiles')
    .select('kyc_status, expert_plan, expert_plan_end')
    .eq('id', userId)
    .maybeSingle()

  const reviewOk  = ep.review_status === 'approved'
  const kycOk     = profile?.kyc_status === 'approved'
  const hasCredit = profile?.expert_plan_end ? new Date(profile.expert_plan_end) > new Date() : false
  const planOk    = profile?.expert_plan === 'active' || hasCredit

  const shouldBeVisible = reviewOk && kycOk && planOk

  if (shouldBeVisible !== ep.is_visible) {
    await supa.from('expert_profiles').update({
      is_visible:  shouldBeVisible,
      verified_at: shouldBeVisible ? new Date().toISOString() : null,
    }).eq('id', ep.id)
  }

  return shouldBeVisible
}
