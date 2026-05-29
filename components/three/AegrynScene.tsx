'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ── Floating AE monogram geometry ──────────────────────── */
function AEMonogram() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.22
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.08
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.12
  })

  return (
    <group ref={meshRef}>
      {/* Lambda left leg */}
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI * 0.23]}>
        <boxGeometry args={[0.07, 0.9, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Lambda right leg — thicker */}
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, -Math.PI * 0.23]}>
        <boxGeometry args={[0.10, 0.9, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Cut Apex triangle — #5ADDA4 */}
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.14, 0.18, 3]} />
        <meshStandardMaterial color="#5ADDA4" roughness={0.1} metalness={0.7} emissive="#5ADDA4" emissiveIntensity={0.3} />
      </mesh>
      {/* E bar top */}
      <mesh position={[0.85, 0.30, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* E bar middle — shorter */}
      <mesh position={[0.78, 0, 0]}>
        <boxGeometry args={[0.26, 0.08, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* E bar bottom */}
      <mesh position={[0.85, -0.30, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  )
}

/* ── 60 particles floating around the logo ───────────────── */
function ApexParticles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(60 * 3)
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.2 + Math.random() * 0.8
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.05
    ref.current.rotation.x = clock.getElapsedTime() * 0.02
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#5ADDA4"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  )
}

/* ── Scene ────────────────────────────────────────────────── */
export function AegrynScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Ambient */}
      <ambientLight intensity={0.6} />
      {/* Key light */}
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      {/* Rim light — #5ADDA4 apex glow */}
      <pointLight position={[-2, 1, -1]} color="#5ADDA4" intensity={0.6} distance={6} />
      {/* Back fill */}
      <pointLight position={[0, -3, -2]} color="#0A1D2E" intensity={0.4} distance={8} />

      <AEMonogram />
      <ApexParticles />
    </Canvas>
  )
}
