/**
 * Legacy route — redirected to /magazine via next.config.ts (301 permanent).
 * This file is kept for TypeScript compilation but will never be reached at runtime.
 */
import { redirect } from 'next/navigation'

export default function LegacyReportIndexPage() {
  redirect('/magazine')
}
