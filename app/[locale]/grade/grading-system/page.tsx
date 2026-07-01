import { redirect } from 'next/navigation'

type Props = { params: Promise<{ locale: string }> }

/**
 * Route consolidée dans /grade/methodology (contenu fusionné : storytelling
 * Antiquorum + cadre CIFS détaillé). Redirection permanente pour éviter le
 * doublon de contenu et préserver le référencement des liens existants.
 */
export default async function GradingSystemRedirect({ params }: Props) {
  const { locale } = await params
  redirect(`/${locale}/grade/methodology`)
}
