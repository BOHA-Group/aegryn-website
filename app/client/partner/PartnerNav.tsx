import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

export default async function PartnerNav({ unreadCount: _unreadCount }: { unreadCount: number }) {
  const t = await getTranslations('clientSpace')

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/partner', label: t('navDashboard'), icon: 'LayoutDashboard' },
      ],
    },
    {
      label: 'Ma fiche',
      items: [
        { href: '/client/partner/expert-profile', label: t('navExpertProfile') || 'Fiche expert', icon: 'BadgeCheck' },
      ],
    },
    {
      label: t('navGroupActivity'),
      items: [
        { href: '/client/partner/certifications', label: t('navCosigning'),    icon: 'Award' },
        { href: '/client/partner/introductions',  label: t('navIntroductions'), icon: 'Users' },
        { href: '/client/partner/mandates',       label: t('navMandates'),      icon: 'Briefcase' },
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/partner/kyc',           label: t('navKyc'),           icon: 'ShieldCheck' },
        { href: '/client/partner/nda',           label: t('navPartnerNda'),    icon: 'FileText' },
        { href: '/client/partner/notifications', label: t('navNotifications'), icon: 'Bell' },
        { href: '/client/partner/account',       label: t('navMyAccount'),     icon: 'UserCircle'  },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/partner" />
}
