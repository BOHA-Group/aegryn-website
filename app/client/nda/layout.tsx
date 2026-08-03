import { redirect } from 'next/navigation'
import { getUser }  from '@/lib/supabaseServer'

export default async function NdaLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/client/login')
  return <>{children}</>
}
