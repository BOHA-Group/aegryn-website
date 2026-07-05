'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, ArrowRightLeft, ShieldCheck, Bell, UserCircle } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/client/seller',              label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/client/seller/actifs',       label: 'Mes dossiers',    icon: FileText },
  { href: '/client/seller/transactions', label: 'Transactions',    icon: ArrowRightLeft },
  { href: '/client/seller/kyc',          label: 'KYC',             icon: ShieldCheck },
  { href: '/client/seller/notifications',label: 'Notifications',   icon: Bell },
  { href: '/client/account',             label: 'Mon compte',     icon: UserCircle },
]

export default function SellerNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/client/seller'
          ? pathname === href
          : pathname.startsWith(href)
        const isNotif = href.includes('notifications')

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <Icon size={15} />
            <span className="font-sans text-[12px]">{label}</span>
            {isNotif && unreadCount > 0 && (
              <span className="ml-auto bg-ag-apex text-ag-navy font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
