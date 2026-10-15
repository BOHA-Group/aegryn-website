import { BoutiqueAudioProvider } from '@/components/boutique/BoutiqueAudio'

/** Le lecteur de musique vit ici : il démarre à l'entrée dans La Boutique, se poursuit
    entre ses pages et s'arrête dès qu'on la quitte. */
export default async function BoutiqueLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <BoutiqueAudioProvider locale={locale}>{children}</BoutiqueAudioProvider>
}
