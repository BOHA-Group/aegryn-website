import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProjectPage, { generateMetadata as projectMetadata } from '@/app/[locale]/boutique/projets/[slug]/page'

/* /assets/subblink : seul actif propriétaire du cabinet à avoir une fiche. Les projets de
   La Boutique vivent sous /boutique/projets/<slug> (301 depuis /assets/<slug>). */
type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  return ['fr', 'en', 'de', 'es', 'it', 'nl'].map((locale) => ({ locale, slug: 'subblink' }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  return slug === 'subblink' ? projectMetadata(props) : {}
}

export default async function SubblinkPage(props: Props) {
  const { slug } = await props.params
  if (slug !== 'subblink') notFound()
  return ProjectPage(props)
}
