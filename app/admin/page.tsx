import { createServiceClient } from '@/lib/supabase'
import { getUser }             from '@/lib/supabaseServer'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Admin — AEGRYN',
  robots: { index: false, follow: false },
}

type DomainModule = {
  href:        string
  title:       string
  desc:        string
  badge:       number | null
  badgeLabel?: string
}

type Domain = {
  key:     string
  label:   string
  color:   string
  modules: DomainModule[]
}

export default async function AdminIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  const hasToken = adminToken && params.token === adminToken
  if (!hasToken) {
    const user = await getUser()
    if (!user) redirect('/client/login')
    const supa = createServiceClient()
    const { data: profile } = await supa
      .from('profiles').select('roles').eq('id', user.id).single()
    const roles = (profile?.roles ?? []) as string[]
    if (!roles.includes('admin') && !roles.includes('super_admin')) redirect('/')
  }

  const supa    = createServiceClient()
  const qs      = params.token ? `?token=${params.token}` : ''

  const [
    { count: assetsNew },
    { count: assetsGraded },
    { count: ndaPending },
    { count: valLeads },
    { count: kycBuyerPending },
    { count: offersSubmitted },
    { count: transactionsOpen },
    { count: commissionsDue },
    { count: expertAppsPending },
    { data: expertProfilesData },
    { data: kycDocsPending },
  ] = await Promise.all([
    supa.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
    supa.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'graded'),
    supa.from('nda_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supa.from('valuation_leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supa.from('buyer_kyc_verifications').select('*', { count: 'exact', head: true }).eq('kyc_status', 'pending'),
    supa.from('auction_bids').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
    supa.from('transactions').select('*', { count: 'exact', head: true }).not('status', 'in', '(closed,cancelled)'),
    supa.from('commissions').select('*', { count: 'exact', head: true }).neq('status', 'paid'),
    supa.from('expert_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supa.from('expert_profiles').select('id, is_visible, hidden_reason, review_status'),
    supa.from('kyc_documents').select('user_id').eq('status', 'pending'),
  ])

  const expertProfilesPendingCount = (expertProfilesData ?? []).filter(
    (p: { is_visible: boolean; hidden_reason: string | null; review_status: string | null }) =>
      p.review_status === 'pending_review' ||
      (!p.is_visible && !p.hidden_reason && p.review_status !== 'rejected')
  ).length
  const expertsPending = (expertAppsPending ?? 0) + expertProfilesPendingCount

  /* Partenaires avec docs pending mais sans ligne buyer_kyc_verifications */
  const { data: kycBuyerIds } = await supa
    .from('buyer_kyc_verifications').select('user_id').eq('kyc_status', 'pending')
  const buyerKycSet = new Set((kycBuyerIds ?? []).map((r: Record<string, unknown>) => String(r.user_id)))
  const partnerOnlyPending = new Set(
    (kycDocsPending ?? [])
      .map((d: Record<string, unknown>) => String(d.user_id))
      .filter(uid => !buyerKycSet.has(uid))
  ).size
  const kycPending = (kycBuyerPending ?? 0) + partnerOnlyPending

  const domains: Domain[] = [
    {
      key:   'certification',
      label: 'Certification',
      color: 'border-blue-100 bg-blue-50/40',
      modules: [
        {
          href:       `/admin/assets${qs}${qs ? '&' : '?'}status=submitted`,
          title:      '📥 Soumissions',
          desc:       'Actifs soumis en attente d\'audit et d\'attribution de grade.',
          badge:      assetsNew ?? 0,
          badgeLabel: 'à traiter',
        },
        {
          href:       `/admin/assets${qs}${qs ? '&' : '?'}status=graded`,
          title:      '🏷️ Grading',
          desc:       'Actifs gradés, prêts à publier ou en révision finale avant catalogue.',
          badge:      assetsGraded ?? 0,
          badgeLabel: 'à publier',
        },
        {
          href:  `/admin/catalog${qs}`,
          title: '📖 Catalogue',
          desc:  'Publication et gestion de la visibilité des actifs auprès des acquéreurs.',
          badge: null,
        },
      ],
    },
    {
      key:   'transaction',
      label: 'Transaction',
      color: 'border-emerald-100 bg-emerald-50/40',
      modules: [
        {
          href:       `/admin/offers${qs}`,
          title:      '💬 Offres',
          desc:       'Offres soumises tous actifs confondus — nouvelle / en examen / acceptée.',
          badge:      offersSubmitted ?? 0,
          badgeLabel: 'à examiner',
        },
        {
          href:       `/admin/transactions${qs}`,
          title:      '🔄 Transactions — Pipeline PTT',
          desc:       'EI → AP → Séquestre → Due Diligence → Signing → Closing.',
          badge:      transactionsOpen ?? 0,
          badgeLabel: 'en cours',
        },
        {
          href:       `/admin/commissions${qs}`,
          title:      '💰 Commissions',
          desc:       'Commissions de transaction et rémunérations des partenaires apporteurs.',
          badge:      commissionsDue ?? 0,
          badgeLabel: 'dues',
        },
      ],
    },
    {
      key:   'utilisateurs',
      label: 'Utilisateurs',
      color: 'border-amber-100 bg-amber-50/40',
      modules: [
        {
          href:       `/admin/kyc${qs}`,
          title:      '🪪 KYC',
          desc:       'Validation des documents d\'identité, KYC et UBO — tous profils.',
          badge:      kycPending ?? 0,
          badgeLabel: 'en attente',
        },
        {
          href:       `/admin/members${qs}`,
          title:      '👤 Membres & NDA',
          desc:       'Qualification des acquéreurs et suivi des NDA signés.',
          badge:      ndaPending ?? 0,
          badgeLabel: 'en attente',
        },
        {
          href:  `/admin/partners${qs}`,
          title: '🤝 Partenaires',
          desc:  'Cabinets juridiques, experts-comptables, cybersécurité, apporteurs d\'affaires.',
          badge: null,
        },
        {
          href:       `/admin/experts${qs}`,
          title:      '🧑‍💼 Experts réseau',
          desc:       'Candidatures formulaire + fiches partenaires à réviser. Abonnement 89 € HT/mois.',
          badge:      expertsPending ?? 0,
          badgeLabel: 'à traiter',
        },
      ],
    },
    {
      key:   'acquisition',
      label: 'Acquisition',
      color: 'border-violet-100 bg-violet-50/40',
      modules: [
        {
          href:       `/admin/leads${qs}`,
          title:      '📈 Leads',
          desc:       'Valuation, catalog waitlist, assessment days, alliances — tous canaux entrants.',
          badge:      valLeads ?? 0,
          badgeLabel: 'nouveaux',
        },
      ],
    },
    {
      key:   'pilotage',
      label: 'Pilotage',
      color: 'border-gray-100 bg-gray-50/60',
      modules: [
        {
          href:  `/admin/analytics${qs}`,
          title: '📊 Analytics',
          desc:  'KPIs opérationnels — vue d\'ensemble transversale.',
          badge: null,
        },
        {
          href:  `/admin/settings${qs}`,
          title: '⚙️ Paramètres',
          desc:  'Documents légaux, templates emails, benchmark marché.',
          badge: null,
        },
        {
          href:  `/admin/notifications${qs}`,
          title: '📣 Notifications & Communication',
          desc:  'Broadcast email + in-app vers acquéreurs, cédants et partenaires.',
          badge: null,
        },
      ],
    },
  ]

  const totalActionRequired =
    (assetsNew ?? 0) + (offersSubmitted ?? 0) + (kycPending ?? 0) + (ndaPending ?? 0) + (valLeads ?? 0) + (expertsPending ?? 0)

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">AEGRYN</p>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Admin</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              {new Date().toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {totalActionRequired > 0 && (
            <div className="bg-red-50 border border-red-200 px-4 py-2 text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">Action requise</p>
              <p className="font-mono text-[22px] font-bold text-red-600 leading-none mt-0.5">{totalActionRequired}</p>
            </div>
          )}
        </div>

        {/* 5 Domain sections */}
        <div className="flex flex-col gap-6">
          {domains.map(domain => (
            <div key={domain.key} className={`border rounded-none p-5 ${domain.color}`}>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-gray-400 mb-4">
                {domain.label}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {domain.modules.map(m => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="bg-white border border-gray-200 p-5 flex flex-col gap-2.5 hover:border-gray-400 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-sans font-bold text-gray-900 text-[13px] leading-tight">{m.title}</h2>
                      {m.badge != null && m.badge > 0 && (
                        <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 shrink-0 whitespace-nowrap">
                          {m.badge} {m.badgeLabel}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[11px] text-gray-400 leading-relaxed flex-1">{m.desc}</p>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-300 group-hover:text-gray-500 transition-colors">
                      Ouvrir →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-8 border-t border-gray-200 pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-gray-300 mb-3">Liens rapides — vue publique</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '/grade/submit',    href: '/grade/submit' },
              { label: '/auction/catalog', href: '/auction/catalog' },
              { label: '/valuation',       href: '/valuation' },
              { label: '/client/login',    href: '/client/login' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener"
                className="font-mono text-[9px] text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 hover:border-gray-400 transition-colors">
                {label} ↗
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
