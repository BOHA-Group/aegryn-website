import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { CheckCircle2, CreditCard, Clock, XCircle, CalendarClock } from 'lucide-react'
import SubscribeButtons   from './SubscribeButtons'
import CancelButton       from './CancelButton'
import ReferralSection    from './ReferralSection'

export const metadata: Metadata = {
  title: 'Abonnement — Espace Partenaire Aegryn',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

function isActiveCheck(p: string | null) { return p === 'active' }

export default async function PartnerSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { success, canceled } = await searchParams

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, expert_plan, expert_plan_start, expert_plan_end, expert_plan_interval, expert_plan_cancel_at, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  const p             = profile as Record<string, unknown> | null
  const plan          = p?.expert_plan as string | null
  const planStart     = p?.expert_plan_start as string | null
  const planEnd       = p?.expert_plan_end as string | null
  const planInterval  = p?.expert_plan_interval as 'month' | 'year' | null
  const cancelAt      = p?.expert_plan_cancel_at as string | null
  const isCanceling   = isActiveCheck(plan) && !!cancelAt
  const isActive      = isActiveCheck(plan)
  const intervalLabel = planInterval === 'year' ? 'Annuel' : 'Mensuel'

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Abonnement expert</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Votre fiche expert est visible dans l&apos;annuaire Aegryn tant que votre abonnement est actif.
        </p>
      </div>


      {/* Feedback paiement */}
      {success === '1' && (
        <div className="bg-emerald-50 border border-emerald-200 px-5 py-4 flex items-start gap-3 mb-6">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-sans text-[13px] text-emerald-800">
            Paiement confirmé — votre abonnement est en cours d&apos;activation (quelques secondes).{' '}
            <Link href="/client/partner/subscription" className="underline font-medium">Rafraîchissez</Link>{' '}
            la page si le statut n&apos;a pas changé.
          </p>
        </div>
      )}
      {canceled === '1' && (
        <div className="bg-red-50 border border-red-200 px-5 py-4 flex items-start gap-3 mb-6">
          <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <p className="font-sans text-[13px] text-red-700">
            Paiement annulé — aucun montant n&apos;a été prélevé.
          </p>
        </div>
      )}

      {/* Statut */}
      <div className={`border p-6 mb-6 ${
        isCanceling
          ? 'bg-orange-50 border-orange-200'
          : isActive
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          {isCanceling
            ? <Clock size={18} className="text-orange-500 shrink-0" />
            : isActive
              ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              : <Clock size={18} className="text-amber-600 shrink-0" />
          }
          <p className={`font-sans font-semibold text-[15px] ${
            isCanceling ? 'text-orange-700' : isActive ? 'text-emerald-800' : 'text-amber-800'
          }`}>
            {isCanceling
              ? `Résiliation programmée — actif jusqu'au ${fmtDate(cancelAt)}`
              : isActive
                ? `Abonnement actif — ${intervalLabel}`
                : 'Abonnement inactif'
            }
          </p>
        </div>
        {isActive && (
          <div className="flex flex-col gap-1.5">
            {planStart && (
              <div className="flex items-center gap-2">
                <CalendarClock size={13} className={isCanceling ? 'text-orange-400 shrink-0' : 'text-emerald-500 shrink-0'} />
                <p className={`font-sans text-[12px] ${isCanceling ? 'text-orange-700' : 'text-emerald-700'}`}>
                  Actif depuis le {fmtDate(planStart)}
                </p>
              </div>
            )}
            {!isCanceling && planEnd && (
              <div className="flex items-center gap-2">
                <CalendarClock size={13} className="text-emerald-500 shrink-0" />
                <p className="font-sans text-[12px] text-emerald-700">
                  Prochain renouvellement : {fmtDate(planEnd)}
                </p>
              </div>
            )}
            {isCanceling && (
              <p className="font-sans text-[12px] text-orange-700 mt-1">
                Votre fiche expert reste visible et active jusqu&apos;à cette date.
                Aucun renouvellement ne sera effectué.
              </p>
            )}
          </div>
        )}
        {!isActive && (
          <p className="font-sans text-[12px] text-amber-700">
            Votre fiche expert n&apos;est pas visible dans l&apos;annuaire. Activez votre abonnement pour y apparaître.
          </p>
        )}
      </div>

      {/* Offre + boutons ou résumé abonné */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Plan Expert</p>
            <p className="font-sans font-bold text-gray-900 text-[22px]">89 CHF <span className="text-[14px] font-normal text-gray-400">HT / mois</span></p>
          </div>
          <CreditCard size={20} className="text-gray-300 mt-1" />
        </div>

        <ul className="flex flex-col gap-2 mb-6">
          {[
            'Fiche expert visible dans l\'annuaire Aegryn',
            'Contact direct par les clients acheteurs et vendeurs',
            'Badge "Expert Aegryn vérifié"',
            'Accès aux missions de co-certification (CIFS)',
            'Visibilité sur les introductions qualifiées',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-ag-apex shrink-0 mt-0.5" />
              <span className="font-sans text-[12px] text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        {isActive ? (
          <div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 mb-2">
              <p className="font-sans text-[12px] text-emerald-700">
                Abonnement <strong>{intervalLabel.toLowerCase()}</strong> — renouvellement automatique.
                {planEnd && <> Prochaine échéance : <strong>{fmtDate(planEnd)}</strong>.</>}
              </p>
            </div>
            <CancelButton />
          </div>
        ) : (
          <SubscribeButtons disabled={false} />
        )}
      </div>

      <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
        Sans engagement, résiliable à tout moment. La fiche expert sera retirée à la date d&apos;expiration.
        Les clients vous contactent directement — Aegryn ne prélève aucune commission sur vos missions.
      </p>

      {/* Parrainage */}
      <ReferralSection isActive={isActive} />

    </div>
  )
}
