import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedurally-built PureLube 1L tin can.
 *
 * The label is painted onto a canvas at runtime (no external texture needed),
 * then wrapped around a cylinder. Rims / cap are separate meshes with metallic
 * materials. Swap `<CanModel />` for a `useGLTF('/models/can.glb')` export from
 * Blender if a sculpted model is preferred later.
 */

function buildLabelTexture(): THREE.CanvasTexture {
  const W = 2048
  const H = 1024
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  // base: black top, red band, black bottom
  ctx.fillStyle = '#0b0b0b'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#e4131f'
  ctx.fillRect(0, H * 0.40, W, H * 0.36)

  // thin vertical stripe (blue / red / yellow) as on the tin
  const sx = W * 0.05
  ctx.fillStyle = '#1d3fb8'
  ctx.fillRect(sx, 0, 10, H)
  ctx.fillStyle = '#e4131f'
  ctx.fillRect(sx + 14, 0, 8, H)
  ctx.fillStyle = '#f2b233'
  ctx.fillRect(sx + 26, 0, 6, H)

  // subtle sheen
  const g = ctx.createLinearGradient(0, 0, W, 0)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.08)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.08)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // front label is centred at 50% of the width
  const cx = W * 0.5
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // drop logo
  const ly = H * 0.17
  ctx.lineWidth = 16
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#ee1c2e'
  ctx.beginPath()
  ctx.arc(cx, ly, 92, Math.PI * 0.85, Math.PI * 1.65)
  ctx.stroke()
  ctx.strokeStyle = '#1d3fb8'
  ctx.beginPath()
  ctx.arc(cx, ly, 92, Math.PI * -0.15, Math.PI * 0.65)
  ctx.stroke()
  const drop = ctx.createLinearGradient(0, ly - 70, 0, ly + 60)
  drop.addColorStop(0, '#ffd769')
  drop.addColorStop(1, '#d97a12')
  ctx.fillStyle = drop
  ctx.beginPath()
  ctx.moveTo(cx, ly - 70)
  ctx.bezierCurveTo(cx - 60, ly + 10, cx - 50, ly + 60, cx, ly + 60)
  ctx.bezierCurveTo(cx + 50, ly + 60, cx + 60, ly + 10, cx, ly - 70)
  ctx.fill()

  // wordmark
  ctx.font = 'italic 900 118px Rajdhani, Arial Black, sans-serif'
  ctx.fillStyle = '#1d3fb8'
  ctx.fillText('PURE', cx - 120, H * 0.325)
  ctx.fillStyle = '#ee1c2e'
  ctx.fillText('LUBE', cx + 135, H * 0.325)

  // red band copy
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 62px Rajdhani, Arial, sans-serif'
  ctx.fillText('FULLY SYNTHETIC', cx, H * 0.465)
  ctx.fillText('ENGINE OIL', cx - 60, H * 0.53)
  ctx.fillStyle = '#ffd400'
  ctx.font = '900 62px Rajdhani, Arial, sans-serif'
  ctx.fillText('4T', cx + 190, H * 0.53)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 118px Rajdhani, Arial Black, sans-serif'
  ctx.fillText('10W-40', cx, H * 0.64)
  ctx.font = '700 58px Rajdhani, Arial, sans-serif'
  ctx.fillText('API SN  JASO MA', cx, H * 0.725)

  // bottom black copy
  ctx.font = '900 70px Rajdhani, Arial Black, sans-serif'
  ctx.fillText('NET: 1 LITER', cx, H * 0.86)

  // side (back) copy
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '700 40px Rajdhani, Arial, sans-serif'
  const bx = W * 0.83
  ctx.fillText('PLATINUM SERIES', bx, H * 0.45)
  ctx.font = '500 30px Rajdhani, Arial, sans-serif'
  ;['• Fully Synthetic', '• High Mileage', '• API SN · JASO MA/MA2', '• Modern Bikes'].forEach((l, i) =>
    ctx.fillText(l, bx, H * 0.51 + i * 46),
  )

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.wrapS = THREE.RepeatWrapping
  tex.offset.x = 0.5 // cylinder seam (u=0) sits at +Z, so shift the label centre (u=0.5) to face the camera
  return tex
}

function CanModel() {
  const label = useMemo(buildLabelTexture, [])
  const group = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.18
  })

  const R = 0.82
  const H = 2.7

  return (
    <group ref={group} rotation={[0, -1.75, 0]}>
      {/* body */}
      <mesh castShadow>
        <cylinderGeometry args={[R, R, H, 96, 1, true]} />
        <meshPhysicalMaterial map={label} metalness={0.35} roughness={0.28} clearcoat={0.6} clearcoatRoughness={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* gold rims */}
      {[H / 2, -H / 2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R, 0.055, 24, 96]} />
          <meshStandardMaterial color="#d9b25a" metalness={1} roughness={0.25} />
        </mesh>
      ))}
      {/* top face */}
      <mesh position={[0, H / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R - 0.02, 96]} />
        <meshStandardMaterial color="#e5c273" metalness={1} roughness={0.35} />
      </mesh>
      {/* bottom face */}
      <mesh position={[0, -H / 2 - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R - 0.02, 96]} />
        <meshStandardMaterial color="#5a4a25" metalness={1} roughness={0.5} />
      </mesh>
      {/* cap */}
      <mesh position={[0, H / 2 + 0.11, 0]}>
        <cylinderGeometry args={[0.3, 0.28, 0.22, 48]} />
        <meshStandardMaterial color="#f4f4f4" roughness={0.45} />
      </mesh>
      <mesh position={[0, H / 2 + 0.23, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 48]} />
        <meshStandardMaterial color="#ee1c2e" roughness={0.4} />
      </mesh>
    </group>
  )
}

export default function Can3D({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.5, 7.6], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow />
          <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-3, -1, 3]} intensity={12} color="#ee1c2e" distance={9} />
          <pointLight position={[3, 3, -2]} intensity={8} color="#ff6a3d" distance={9} />
          <spotLight position={[0, 6, 2]} intensity={6} angle={0.4} penumbra={0.8} color="#fff5e0" />

          <Bounds fit observe margin={1.35}>
            <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
              <CanModel />
            </Float>
          </Bounds>

          <ContactShadows position={[0, -1.6, 0]} opacity={0.55} scale={7} blur={2.4} far={3} color="#000" />
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
