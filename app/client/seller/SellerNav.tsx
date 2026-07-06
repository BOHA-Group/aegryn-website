import { getTranslations } from 'next-intl/server'
import { LayoutDashboard, FileText, ArrowRightLeft, ShieldCheck, Bell, UserCircle, Settings } from 'lucide-react'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default async function SellerNav({ unreadCount }: { unreadCount: number }) {
  const t = await getTranslations('clientSpace')

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/seller', label: t('navDashboard'), icon: LayoutDashboard },
      ],
    },
    {
      label: t('navGroupFiles'),
      items: [
        { href: '/client/seller/actifs',       label: t('navAssets'),       icon: FileText },
        { href: '/client/seller/transactions', label: t('navTransactions'), icon: ArrowRightLeft },
      ],
    },
    {
      label: t('navGroupCompliance'),
      items: [
        { href: '/client/seller/kyc', label: t('navKyc'), icon: ShieldCheck },
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/seller/notifications', label: t('navNotifications'), icon: Bell,       badge: unreadCount },
        { href: '/client/account',              label: t('navMyAccount'),     icon: UserCircle },
        { href: '/client/account#settings',     label: t('navSettings'),     icon: Settings },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/seller" />
}
