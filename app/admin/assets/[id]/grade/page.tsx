import { redirect } from 'next/navigation'

/**
 * Ancien formulaire de grading (4 dimensions, 0-25). Remplacé par le moteur CIFSO 5000
 * à cinq dimensions (C, I, F, S, O) : /admin/assets/[id]/grade-engine.
 */
export default async function LegacyGradePage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams
  redirect(`/admin/assets/${id}/grade-engine${token ? `?token=${token}` : ''}`)
}
