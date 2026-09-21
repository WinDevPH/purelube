import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Product 2 — exact Platinum mockup photo in live 360° view.
 * Uses /img/platinum-5w40-exact.png 1:1 (white studio keyed out).
 * Same drag / auto-spin interaction as Product 1 can.
 */

const PRODUCT_SRC = '/img/platinum-5w40-exact.png'

function loadKeyedTexture(url: string): Promise<{ tex: THREE.CanvasTexture; aspect: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const w = img.naturalWidth
      const h = img.naturalHeight
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, w, h)
      const d = imageData.data

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i]
        const g = d[i + 1]
        const b = d[i + 2]
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const sat = max === 0 ? 0 : (max - min) / max
        const lum = (r + g + b) / 3

        // Remove studio white only — keep label whites & gold highlights
        if (lum > 248 && sat < 0.06) {
          d[i + 3] = 0
        } else if (lum > 235 && sat < 0.05) {
          d[i + 3] = Math.round(255 * Math.max(0, (248 - lum) / 13))
        } else if (lum > 220 && sat < 0.035) {
          d[i + 3] = Math.round(d[i + 3] * 0.25)
        }
      }

      // Soft edge cleanup pass
      ctx.putImageData(imageData, 0, 0)

      const tex = new THREE.CanvasTexture(c)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 16
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
      tex.needsUpdate = true
      resolve({ tex, aspect: w / h })
    }
    img.onerror = () => reject(new Error(`Failed to load ${url}`))
    img.src = url
  })
}

function ProductCard() {
  const group = useRef<THREE.Group>(null)
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null)
  const [aspect, setAspect] = useState(0.78)

  useEffect(() => {
    let alive = true
    loadKeyedTexture(PRODUCT_SRC)
      .then(({ tex: t, aspect: a }) => {
        if (!alive) {
          t.dispose()
          return
        }
        setAspect(a)
        setTex(t)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // Same spin rate as Product 1 can
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.18
  })

  if (!tex) return null

  const height = 3.4
  const width = height * aspect

  return (
    <group ref={group}>
      <mesh castShadow>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={tex}
          transparent
          alphaTest={0.05}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Bottle3D({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 6.5], fov: 30 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight position={[3, 5, 4]} intensity={0.8} />

          <Bounds fit observe margin={1.12}>
            <Float speed={1.45} rotationIntensity={0.18} floatIntensity={0.45}>
              <ProductCard />
            </Float>
          </Bounds>

          <ContactShadows position={[0, -1.9, 0]} opacity={0.42} scale={7.5} blur={2.8} far={3.5} color="#000" />
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.75}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
