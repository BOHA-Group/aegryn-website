import { redirect } from 'next/navigation'

type Props = { params: Promise<{ locale: string }> }

// Catalogue offmarket archivé — le processus de qualification est désormais
// confidentiel et individuel, après NDA et sélection par Aegryn.
export default async function TransactCatalogPage({ params }: Props) {
  const { locale } = await params
  redirect(`/${locale}/transact`)
}
