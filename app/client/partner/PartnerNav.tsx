'use client'

import { LayoutDashboard, Award, Users, DollarSign, Bell, UserCircle, Settings } from 'lucide-react'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default function PartnerNav({ unreadCount }: { unreadCount: number }) {
  const groups: NavGroup[] = [
    {
      label: 'Vue générale',
      items: [
        { href: '/client/partner', label: 'Tableau de bord', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Activité',
      items: [
        { href: '/client/partner/certifications', label: 'Co-signatures',  icon: Award },
        { href: '/client/partner/introductions',  label: 'Introductions',  icon: Users },
        { href: '/client/partner/commissions',    label: 'Commissions',    icon: DollarSign },
      ],
    },
    {
      label: 'Compte',
      items: [
        { href: '/client/partner/notifications', label: 'Notifications', icon: Bell,       badge: unreadCount },
        { href: '/client/account',               label: 'Mon compte',    icon: UserCircle },
        { href: '/client/account#settings',      label: 'Paramètres',    icon: Settings },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/partner" />
}
