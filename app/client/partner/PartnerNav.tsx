import { getTranslations } from 'next-intl/server'
import { LayoutDashboard, Award, Users, DollarSign, Bell, UserCircle, Settings } from 'lucide-react'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default async function PartnerNav({ unreadCount }: { unreadCount: number }) {
  const t = await getTranslations('clientSpace')

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/partner', label: t('navDashboard'), icon: LayoutDashboard },
      ],
    },
    {
      label: t('navGroupActivity'),
      items: [
        { href: '/client/partner/certifications', label: t('navCosigning'),            icon: Award },
        { href: '/client/partner/introductions',  label: t('navIntroductions'),         icon: Users },
        { href: '/client/partner/commissions',    label: t('navPartnerCommissions'),    icon: DollarSign },
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/partner/notifications', label: t('navNotifications'), icon: Bell,       badge: unreadCount },
        { href: '/client/account',               label: t('navMyAccount'),     icon: UserCircle },
        { href: '/client/account#settings',      label: t('navSettings'),     icon: Settings },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/partner" />
}
