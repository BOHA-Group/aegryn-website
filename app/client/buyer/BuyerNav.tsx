'use client'

import { LayoutDashboard, BookOpen, Gavel, ArrowRightLeft, Receipt, ShieldCheck, Bell, UserCircle, Settings } from 'lucide-react'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default function BuyerNav({ unreadCount }: { unreadCount: number }) {
  const groups: NavGroup[] = [
    {
      label: 'Vue générale',
      items: [
        { href: '/client/buyer', label: 'Tableau de bord', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Acquisitions',
      items: [
        { href: '/client/buyer/catalogue',    label: 'Catalogue',       icon: BookOpen },
        { href: '/client/buyer/offres',       label: 'Mes offres',      icon: Gavel },
        { href: '/client/buyer/transactions', label: 'Transactions',    icon: ArrowRightLeft },
        { href: '/client/buyer/commissions',  label: 'Commissions dues',icon: Receipt },
      ],
    },
    {
      label: 'Conformité',
      items: [
        { href: '/client/buyer/kyc', label: 'KYC / Identité', icon: ShieldCheck },
      ],
    },
    {
      label: 'Compte',
      items: [
        { href: '/client/buyer/notifications', label: 'Notifications', icon: Bell,       badge: unreadCount },
        { href: '/client/account',             label: 'Mon compte',    icon: UserCircle },
        { href: '/client/account#settings',    label: 'Paramètres',    icon: Settings },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/buyer" />
}
