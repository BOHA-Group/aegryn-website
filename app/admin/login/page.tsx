import type { Metadata }  from 'next'
import AdminLoginForm      from './AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin — AEGRYN',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo / titre */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9C7A3C] mb-2">
            AEGRYN
          </p>
          <h1 className="text-2xl font-bold text-[#0C0C0C]">Administration</h1>
          <p className="text-[12px] text-gray-400 mt-1">Accès réservé à l&apos;équipe AEGRYN</p>
        </div>

        <div className="bg-white border border-[#D9D2C2] p-8">
          <AdminLoginForm errorParam={error} />
        </div>

        <p className="text-center text-[11px] text-gray-300 mt-6">
          Seuls les comptes avec le rôle <code className="text-gray-400">admin</code> ont accès.
        </p>
      </div>
    </div>
  )
}
