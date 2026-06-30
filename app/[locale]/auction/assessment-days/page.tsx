import type { Metadata } from 'next'
import AssessmentDaysClient from './AssessmentDaysClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AssessmentDaysPage() {
  return <AssessmentDaysClient />
}
