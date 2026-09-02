import type { Metadata }    from 'next'
import { redirect }          from 'next/navigation'
import Link                  from 'next/link'
import { getUser }           from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ShieldCheck, CreditCard, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import { getAdminUser } from '@/lib/adminAuth'
import ExpertProfileForm     from './ExpertProfileForm'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Fiche Expert — Espace Partenaire Aegryn',
  robots: { index: false, follow: false },
}

export default async function PartnerExpertProfilePage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'client.partner.expertProfile' })

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

  const adminUser = await getAdminUser()
  const isAdmin = !!adminUser

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
    <div className="p-8 max-w-6xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">{t('areaLabel')}</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Fiche expert</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Remplissez et soumettez votre fiche — l&apos;équipe Aegryn la valide avant publication dans l&apos;annuaire.
        </p>
      </div>

      {/* Checklist prérequis */}
      <div className="max-w-2xl">
      <div className="bg-white border border-gray-200 divide-y divide-gray-100 mb-8">
        <div className="px-5 py-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Prérequis à la publication (informatif)</p>
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

      </div> {/* end max-w-2xl */}

      {isAdmin && (
        <div className="max-w-2xl mb-8 flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200">
          <Lock size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="font-sans text-[12px] text-amber-700 leading-relaxed">
            <strong>Compte administrateur :</strong> la publication de fiche expert est désactivée pour les comptes admin.
            Cette section est réservée aux partenaires certifiés.
          </p>
        </div>
      )}

      <div className={isAdmin ? 'opacity-40 pointer-events-none select-none' : ''}>
      <ExpertProfileForm
        kycApproved={kycApproved}
        subscriptionActive={subscriptionActive}
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
          rate_currency: string
          languages: string[]
          phone_country: string
          avatar_url: string | null
          is_visible: boolean
          verified_at: string | null
          hidden_reason: string | null
          review_status: string | null
        } | null}
      />
      </div>{/* end admin-disabled wrapper */}

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          <strong>Publication :</strong> votre fiche sera examinée par l&apos;équipe Aegryn sous 48h après soumission.
          Elle sera automatiquement retirée de l&apos;annuaire si votre abonnement expire.
          Les clients vous contactent directement — Aegryn ne prélève aucune commission sur vos missions.
        </p>
      </div>

    </div>
  )
}
