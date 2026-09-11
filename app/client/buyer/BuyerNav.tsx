import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default async function BuyerNav({ unreadCount: _unreadCount }: { unreadCount: number }) {
  const t = await getTranslations('clientSpace')

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/buyer', label: t('navDashboard'), icon: 'LayoutDashboard', locked: true },
      ],
    },
    {
      label: t('navGroupAcquisitions'),
      items: [
        { href: '/client/buyer/notifications', label: t('navNotifications'), icon: 'Bell',          locked: true },
        { href: '/client/buyer/offres',        label: t('navOffers'),        icon: 'Gavel',         locked: true },
        { href: '/client/buyer/transactions',  label: t('navTransactions'),  icon: 'ArrowRightLeft', locked: true },
      ],
    },
    {
      label: t('navGroupCompliance'),
      items: [
        { href: '/client/buyer/kyc',      label: t('navKyc'),      icon: 'ShieldCheck', locked: true },
        { href: '/client/buyer/nda-view', label: t('navBuyerNda'), icon: 'FileText',    locked: true },
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/buyer/account', label: t('navMyAccount'), icon: 'UserCircle' },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/buyer" />
}
