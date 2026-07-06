'use client'

import { LayoutDashboard, FileText, ArrowRightLeft, ShieldCheck, Bell, UserCircle, Settings } from 'lucide-react'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default function SellerNav({ unreadCount }: { unreadCount: number }) {
  const groups: NavGroup[] = [
    {
      label: 'Vue générale',
      items: [
        { href: '/client/seller', label: 'Tableau de bord', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Dossiers',
      items: [
        { href: '/client/seller/actifs',       label: 'Mes actifs',   icon: FileText },
        { href: '/client/seller/transactions', label: 'Transactions', icon: ArrowRightLeft },
      ],
    },
    {
      label: 'Conformité',
      items: [
        { href: '/client/seller/kyc', label: 'KYC / Identité', icon: ShieldCheck },
      ],
    },
    {
      label: 'Compte',
      items: [
        { href: '/client/seller/notifications', label: 'Notifications', icon: Bell,       badge: unreadCount },
        { href: '/client/account',              label: 'Mon compte',    icon: UserCircle },
        { href: '/client/account#settings',     label: 'Paramètres',   icon: Settings },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/seller" />
}
