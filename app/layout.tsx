import { AudioProvider } from '@/components/providers/AudioProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>
}
