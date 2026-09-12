import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CifsoBrochure } from '@/components/sections/grade/CifsoBrochure'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'gradingSystem' })
  
  return {
    title: `${t('whitepaperTitle')} — Aegryn`,
    description: t('whitepaperDesc'),
  }
}

export default function BrochurePage() {
  return <CifsoBrochure />
}
