import type { Metadata } from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import FaqContent from './FaqContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'FAQ — Aegryn',
    description: 'Questions fréquentes sur Aegryn TRANSACT : cession d\'actifs tech, certification CIFSO, grades, acheteurs pré-qualifiés, séquestre et comptes utilisateurs.',
    path: '/help/faq',
    locale,
    keywords: ['FAQ Aegryn', 'questions fréquentes TRANSACT', 'aide Aegryn', 'certification CIFSO FAQ', 'cession SaaS questions'],
  })
}

export default function FaqPage() {
  return <FaqContent />
}
