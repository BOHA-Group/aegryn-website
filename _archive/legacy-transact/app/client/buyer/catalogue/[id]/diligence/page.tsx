import { redirect } from 'next/navigation'

// Data room accessible uniquement après sélection par admin pour négociation exclusive.
export default function BuyerDiligencePage() {
  redirect('/client/buyer')
}
