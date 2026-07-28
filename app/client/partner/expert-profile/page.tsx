import type { Metadata }    from 'next'
import { redirect }          from 'next/navigation'
import Link                  from 'next/link'
import { getUser }           from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ShieldCheck, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react'
import ExpertProfileForm     from './ExpertProfileForm'

export const metadata: Metadata = {
  title: 'Fiche Expert — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

export default async function PartnerExpertProfilePage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const [
    { data: profile },
    { data: kycDocs },
    { data: existingExpertProfile },
  ] = await Promise.all([
    supa.from('profiles')
      .select('full_name, kyc_status, expert_plan, expert_plan_start, expert_plan_end')
      .eq('id', user.id)
      .single(),
    supa.from('kyc_documents')
      .select('id, doc_type, status')
      .eq('user_id', user.id),
    supa.from('expert_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const p = profile as Record<string, unknown> | null
  const kycStatus   = (p?.kyc_status as string | null)  ?? 'pending'
  const expertPlan  = (p?.expert_plan as string | null) ?? null

  const kycApproved      = kycStatus === 'approved'
  const subscriptionActive = expertPlan === 'active'

  /* Compter docs KYC validés */
  const PARTNER_REQUIRED = ['id_card', 'proof_of_address', 'kbis', 'professional_insurance']
  const validated = new Set(
    (kycDocs ?? [])
      .filter((d: Record<string, unknown>) => d.status === 'validated')
      .map((d: Record<string, unknown>) => d.doc_type as string)
  )
  const kycProgress = PARTNER_REQUIRED.filter(t => validated.has(t)).length

  return (
    <div className="p-8 max-w-3xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Fiche expert</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Votre fiche est visible dans l&apos;annuaire AEGRYN une fois le KYC validé et l&apos;abonnement activé.
        </p>
      </div>

      {/* Checklist prérequis */}
      <div className="bg-white border border-gray-200 divide-y divide-gray-100 mb-8">
        <div className="px-5 py-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Prérequis à la publication</p>
        </div>

        {/* KYC */}
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {kycApproved
              ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              : <AlertCircle  size={16} className="text-amber-500 shrink-0" />
            }
            <div>
              <p className="font-sans font-semibold text-gray-900 text-[13px]">Vérification KYC</p>
              <p className="font-sans text-[11px] text-gray-400">
                {kycApproved
                  ? 'Dossier KYC approuvé'
                  : `${kycProgress}/${PARTNER_REQUIRED.length} documents validés — en attente d'approbation`
                }
              </p>
            </div>
          </div>
          {!kycApproved && (
            <Link href="/client/partner/kyc"
              className="font-mono text-[9px] uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 transition-colors shrink-0">
              Compléter →
            </Link>
          )}
          {kycApproved && (
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          )}
        </div>

        {/* Abonnement */}
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {subscriptionActive
              ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              : <AlertCircle  size={16} className="text-amber-500 shrink-0" />
            }
            <div>
              <p className="font-sans font-semibold text-gray-900 text-[13px]">Abonnement expert — 89 CHF/mois</p>
              <p className="font-sans text-[11px] text-gray-400">
                {subscriptionActive ? 'Abonnement actif' : 'Abonnement non activé'}
              </p>
            </div>
          </div>
          {!subscriptionActive && (
            <Link href="/client/partner/subscription"
              className="font-mono text-[9px] uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 transition-colors shrink-0">
              Activer →
            </Link>
          )}
          {subscriptionActive && (
            <CreditCard size={14} className="text-emerald-400 shrink-0" />
          )}
        </div>
      </div>

      {/* Guard : les deux prérequis non remplis */}
      {(!kycApproved || !subscriptionActive) && (
        <div className="bg-amber-50 border border-amber-200 px-5 py-4 mb-8">
          <p className="font-sans font-semibold text-amber-900 text-[13px] mb-1">
            Formulaire disponible après validation des prérequis
          </p>
          <p className="font-sans text-[12px] text-amber-700">
            Complétez votre KYC et activez votre abonnement pour remplir et publier votre fiche expert.
            Vous pouvez dès maintenant préparer vos informations.
          </p>
        </div>
      )}

      {/* Formulaire — toujours affiché pour permettre la saisie, mais submission bloquée si prérequis manquants */}
      <ExpertProfileForm
        existing={existingExpertProfile as {
          id?: string
          first_name: string
          last_name: string
          profession: string
          specialties: string[]
          city: string
          country_code: string
          bio: string
          organization: string
          email_public: string
          phone: string
          website: string
          min_rate_eur: number | null
          languages: string[]
          avatar_url: string | null
          is_visible: boolean
          verified_at: string | null
        } | null}
      />

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          <strong>Publication :</strong> votre fiche sera examinée par l&apos;équipe AEGRYN sous 48h après soumission.
          Elle sera automatiquement retirée de l&apos;annuaire si votre abonnement expire.
          Les clients vous contactent directement — AEGRYN ne prélève aucune commission sur vos missions.
        </p>
      </div>

    </div>
  )
}
