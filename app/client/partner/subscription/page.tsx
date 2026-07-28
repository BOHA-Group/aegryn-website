import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { CheckCircle2, CreditCard, Clock, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Abonnement — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function PartnerSubscriptionPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, expert_plan, expert_plan_start')
    .eq('id', user.id)
    .single()

  const plan      = (profile as Record<string, unknown> | null)?.expert_plan as string | null
  const planStart = (profile as Record<string, unknown> | null)?.expert_plan_start as string | null
  const isActive  = plan === 'active'

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Abonnement expert</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Votre fiche expert est visible dans l&apos;annuaire AEGRYN tant que votre abonnement est actif.
        </p>
      </div>

      {/* Statut */}
      <div className={`border p-6 mb-6 ${isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-3 mb-3">
          {isActive
            ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            : <Clock size={18} className="text-amber-600 shrink-0" />
          }
          <p className={`font-sans font-semibold text-[15px] ${isActive ? 'text-emerald-800' : 'text-amber-800'}`}>
            {isActive ? 'Abonnement actif' : 'Abonnement inactif'}
          </p>
        </div>
        {isActive && planStart && (
          <p className="font-sans text-[12px] text-emerald-700">
            Actif depuis le {fmtDate(planStart)}
          </p>
        )}
        {!isActive && (
          <p className="font-sans text-[12px] text-amber-700">
            Votre fiche expert n&apos;est pas visible dans l&apos;annuaire. Activez votre abonnement pour y apparaître.
          </p>
        )}
      </div>

      {/* Offre */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Plan Expert</p>
            <p className="font-sans font-bold text-gray-900 text-[22px]">89 € <span className="text-[14px] font-normal text-gray-400">HT / mois</span></p>
          </div>
          <CreditCard size={20} className="text-gray-300 mt-1" />
        </div>

        <ul className="flex flex-col gap-2 mb-5">
          {[
            'Fiche expert visible dans l\'annuaire AEGRYN',
            'Contact direct par les clients acheteurs et vendeurs',
            'Badge "Expert AEGRYN vérifié"',
            'Accès aux missions de co-certification (CIFS)',
            'Visibilité sur les introductions qualifiées',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-ag-apex shrink-0 mt-0.5" />
              <span className="font-sans text-[12px] text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="bg-gray-50 border border-gray-200 px-4 py-3 flex items-start gap-3">
          <Mail size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="font-sans text-[12px] text-gray-500 leading-relaxed">
            Pour activer ou modifier votre abonnement, contactez{' '}
            <a href="mailto:contact@boha-group.com" className="text-ag-navy underline font-medium">
              contact@boha-group.com
            </a>{' '}
            en mentionnant votre email expert. L&apos;équipe AEGRYN activera votre accès manuellement dans les 24h ouvrées.
          </p>
        </div>
      </div>

      <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
        L&apos;abonnement est sans engagement, résiliable à tout moment. La fiche expert sera retirée de l&apos;annuaire à la date d&apos;expiration.
        Les clients vous contactent directement — AEGRYN ne prélève aucune commission sur vos missions.
      </p>
    </div>
  )
}
