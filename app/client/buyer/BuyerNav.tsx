import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default async function BuyerNav({ unreadCount }: { unreadCount: number }) {
  const t = await getTranslations('clientSpace')

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/buyer', label: t('navDashboard'), icon: 'LayoutDashboard' },
      ],
    },
    {
      label: t('navGroupAcquisitions'),
      items: [
        { href: '/client/buyer/catalogue',    label: t('navCatalog'),      icon: 'BookOpen' },
        { href: '/client/buyer/offres',       label: t('navOffers'),       icon: 'Gavel' },
        { href: '/client/buyer/transactions', label: t('navTransactions'), icon: 'ArrowRightLeft' },
        // { href: '/client/buyer/commissions', label: t('navCommissions'), icon: 'Receipt' }, // parking-lot
      ],
    },
    {
      label: t('navGroupCompliance'),
      items: [
        { href: '/client/buyer/kyc', label: t('navKyc'), icon: 'ShieldCheck' },
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/buyer/notifications', label: t('navNotifications'), icon: 'Bell',       badge: unreadCount },
        { href: '/client/account',             label: t('navMyAccount'),     icon: 'UserCircle' },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/buyer" />
}
