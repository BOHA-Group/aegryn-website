'use client'

import { Suspense, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

const SECTIONS = [
  {
    label: 'Certification',
    items: [
      { href: '/admin/assets',  label: 'Soumissions / Grading' },
      { href: '/admin/catalog', label: 'Catalogue' },
    ],
  },
  {
    label: 'Transaction',
    items: [
      { href: '/admin/offers',         label: 'Offres' },
      { href: '/admin/transactions',   label: 'Pipeline PTT' },
      { href: '/admin/introductions',  label: 'Introductions' },
      { href: '/admin/invoices',       label: 'Factures' },
      // { href: '/admin/commissions', label: 'Commissions' }, // parking-lot
    ],
  },
  {
    label: 'Utilisateurs',
    items: [
      { href: '/admin/members',   label: 'Membres & NDA' },
      { href: '/admin/kyc',       label: 'KYC' },
      { href: '/admin/partners',  label: 'Partenaires' },
      { href: '/admin/experts',   label: 'Experts réseau' },
      { href: '/admin/referrals', label: 'Parrainages' },
    ],
  },
  {
    label: 'Acquisition',
    items: [
      { href: '/admin/leads',       label: 'Leads' },
      { href: '/admin/newsletter',  label: 'Newsletter' },
    ],
  },
  {
    label: 'Pilotage',
    items: [
      { href: '/admin/analytics',     label: 'Analytics' },
      { href: '/admin/notifications', label: 'Notifications' },
      { href: '/admin/settings',      label: 'Paramètres' },
    ],
  },
]

function AdminSideNavInner({ adminEmail }: { adminEmail: string }) {
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const router      = useRouter()
  const token       = searchParams.get('token')
  const tokenSuffix = token ? `?token=${token}` : ''

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }, [router])

  return (
    <nav className="flex flex-col flex-1 overflow-y-auto py-3">
      {/* Identifiant admin */}
      <div className="px-5 py-3 border-b border-white/10 mb-2">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30 mb-0.5">Connecté</p>
        <p className="font-sans text-[11px] text-white/70 truncate">{adminEmail}</p>
      </div>

      {/* Dashboard global */}
      <div className="mb-1">
        <Link
          href={`/admin${tokenSuffix}`}
          className={`flex items-center px-5 py-2 font-sans text-[12px] transition-colors ${
            pathname === '/admin'
              ? 'bg-white/10 text-white font-semibold border-l-2 border-ag-apex'
              : 'text-white/50 hover:text-white/90 hover:bg-white/5 border-l-2 border-transparent'
          }`}
        >
          Dashboard
        </Link>
      </div>

      {SECTIONS.map(section => (
        <div key={section.label} className="mb-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25 px-5 py-2">
            {section.label}
          </p>
          {section.items.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={`${item.href}${tokenSuffix}`}
                className={`flex items-center px-5 py-2 font-sans text-[12px] transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-2 border-ag-apex'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}

      {/* Logout */}
      <div className="mt-auto px-4 py-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-red-400 hover:text-white hover:bg-red-600 border border-red-500/40 hover:border-red-600 transition-colors"
        >
          <LogOut size={12} className="shrink-0" />
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

export default function AdminSideNav({ adminEmail }: { adminEmail: string }) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <AdminSideNavInner adminEmail={adminEmail} />
    </Suspense>
  )
}
