import { requireAdmin }       from '@/lib/adminAuth'
import { createServiceClient }  from '@/lib/supabase'
import { notFound }             from 'next/navigation'
import Link                     from 'next/link'
import SessionForm              from '../SessionForm'

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const supa = createServiceClient()
  const { data: session } = await supa
    .from('auction_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!session) notFound()

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/sessions" className="font-sans text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
          ← Sessions
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="font-sans font-bold text-gray-900 text-[15px]">Modifier la session</h1>
        <span className="ml-2 font-mono text-[10px] text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5">
          {session.status}
        </span>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <SessionForm
          mode="edit"
          sessionId={id}
          initial={{
            name:         session.name,
            type:         session.type,
            theme:        session.theme ?? '',
            session_date: session.session_date ?? '',
            location:     session.location ?? '',
            format:       session.format,
            status:       session.status,
            notes:        session.notes ?? '',
          }}
        />
      </div>
    </div>
  )
}
