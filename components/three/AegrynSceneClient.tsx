'use client'

import dynamic from 'next/dynamic'

const AegrynScene = dynamic(
  () => import('@/components/three/AegrynScene').then((m) => m.AegrynScene),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
)

export function AegrynSceneClient() {
  return <AegrynScene />
}
