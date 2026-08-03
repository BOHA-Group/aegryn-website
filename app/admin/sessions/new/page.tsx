import { requireAdmin } from '@/lib/adminAuth'
import Link             from 'next/link'
import SessionForm       from '../SessionForm'

export default async function NewSessionPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/sessions" className="font-sans text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
          ← Sessions
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="font-sans font-bold text-gray-900 text-[15px]">Nouvelle session</h1>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <SessionForm mode="create" />
      </div>
    </div>
  )
}
