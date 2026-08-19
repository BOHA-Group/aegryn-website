/**
 * Legacy route — redirected to /magazine/issue-01 via next.config.ts (301 permanent).
 * This file is kept for TypeScript compilation but will never be reached at runtime.
 */
import { redirect } from 'next/navigation'

export default function LegacyReport2027Page() {
  redirect('/magazine/issue-01')
}
