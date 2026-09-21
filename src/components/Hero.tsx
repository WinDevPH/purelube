import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { MouseEvent } from 'react'
import TechButton from './ui/TechButton'
import Chevrons from './ui/Chevrons'
import { LetterReveal, EASE } from './ui/Reveal'
import { PRODUCTS } from '../data/content'

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease: EASE },
})

const AUTO_MS = 5500

function Rating({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {[1, 2, 3].map((n) => (
          <img
            key={n}
            src={`/img/avatar-${n}.png`}
            alt=""
            className="h-9 w-9 rounded-full border-2 border-white object-cover transition-transform duration-500 hover:scale-110 hover:z-10"
            loading="lazy"
            draggable={false}
          />
        ))}
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-ink text-[10px] font-bold text-white">
          5k+
        </span>
      </div>
      <div className="leading-none">
        <div className="text-[17px] font-bold text-brand">4.9/5</div>
        <div className="text-tech-sm text-[9.5px] text-ink">{label}</div>
      </div>
      <span className="pointer-events-none absolute -bottom-3 left-0 right-6 h-px bg-line" />
      <span className="pointer-events-none absolute -bottom-3 right-6 h-3 w-px bg-line" />
    </div>
  )
}

function Callout({
  title,
  desc,
  className = '',
}: {
  title: string
  desc: string
  className?: string
}) {
  return (
    <div
      className={`clip-tr-12 sm:clip-tr-18 bg-panel hatch p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)] transition-transform duration-500 hover:-translate-y-1 ${className}`}
    >
      <h3 className="text-tech text-[13.5px] font-bold leading-[1.15] text-ink">{title}</h3>
      <p className="mt-2 text-tech-sm text-[9.5px] text-muted">{desc}</p>
    </div>
  )
}

function PriceCard({ grade, blurb, className = '' }: { grade: string; blurb: string; className?: string }) {
  return (
    <div className={`relative transition-transform duration-500 hover:-translate-y-1 ${className}`}>
      <span className="absolute -top-3 left-4 z-10 clip-diag-6 bg-white px-5 py-1 text-tech text-[10px] font-bold shadow-sm">
        SAE Grade
      </span>
      <div className="clip-br-16 bg-ink hatch-dark px-4 pb-4 pt-5 text-white">
        <div className="text-[26px] font-bold leading-none text-brand">{grade}</div>
        <p className="mt-1.5 text-tech-sm text-[9.5px] text-white/70">{blurb}</p>
      </div>
    </div>
  )
}

function ProductDots({
  index,
  onSelect,
  className = '',
}: {
  index: number
  onSelect: (i: number) => void
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {PRODUCTS.map((prod, i) => (
        <button
          key={prod.id}
          type="button"
          aria-label={`Show ${prod.shortName}`}
          onClick={() => onSelect(i)}
          className="grid h-11 min-w-11 place-items-center touch-manipulation"
        >
          <span
            className={`h-[3px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === index ? 'w-8 bg-brand' : 'w-5 bg-ink/20 hover:bg-ink/40'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const p = PRODUCTS[index]

  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => {
      setIndex((v) => (v + 1) % PRODUCTS.length)
    }, AUTO_MS)
    return () => window.clearInterval(t)
  }, [paused])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const rotateY = useTransform(sx, [-1, 1], [-6, 6])
  const rotateX = useTransform(sy, [-1, 1], [4, -4])
  const tx = useTransform(sx, [-1, 1], [-10, 10])

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-x-clip overflow-hidden wrap pt-6 sm:pt-10 md:pt-16 pb-12 md:pb-20"
      onMouseMove={onMove}
      onMouseLeave={() => {
        onLeave()
        setPaused(false)
      }}
      onMouseEnter={() => setPaused(true)}
    >
      {/* ===== Desktop ===== */}
      <div className="relative hidden lg:block aspect-[798/480] w-full">
        <div className="absolute left-0 top-0 max-w-[62%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id + '-copy'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="text-tech text-[18px] font-medium text-ink">{p.eyebrow}</p>
              <h1 className="mt-2 text-[44px] xl:text-[50px] font-bold uppercase leading-[0.98] tracking-[0.005em] text-ink">
                <LetterReveal text={p.headline[0]} delay={0.05} stagger={0.035} />
                <br />
                <LetterReveal text={p.headline[1]} delay={0.28} stagger={0.035} />
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-0 top-[6%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.ratingLabel}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Rating label={p.ratingLabel} />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          className="absolute -right-[3%] left-0 top-[24%] bottom-[6%] origin-left bg-panel-2/70 hatch"
          style={{
            clipPath:
              'polygon(0 12%, 58% 12%, 64% 0, 100% 0, 100% 100%, 66% 100%, 60% 88%, 30% 88%, 26% 100%, 0 100%)',
          }}
        />

        <div className="absolute left-[37%] top-[4%] w-[56%] mix-blend-multiply" style={{ perspective: 1200 }}>
          <motion.div style={{ rotateX, rotateY, x: tx }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={p.heroImage}
                src={p.heroImage}
                alt={p.imageAlt}
                className="w-full"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -16 }}
                transition={{ duration: 0.85, ease: EASE }}
                drag={false}
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.id + '-l'}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute left-[7%] top-[47%] w-[18.5%]"
          >
            <Callout title={p.callouts[0].title} desc={p.callouts[0].desc} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute left-[25.5%] top-[55%] h-[10%] w-[22%] border-b border-r border-line" />
        <span className="pointer-events-none absolute left-[47.2%] top-[54.4%] h-2 w-2 rounded-full border border-line bg-white" />

        <AnimatePresence mode="wait">
          <motion.div
            key={p.id + '-r'}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute left-[81.5%] top-[68%] w-[18.5%]"
          >
            <Callout title={p.callouts[1].title} desc={p.callouts[1].desc} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute left-[61%] top-[58%] h-[15%] w-[20.5%] border-b border-l border-line" />
        <span className="pointer-events-none absolute left-[60.6%] top-[57.4%] h-2 w-2 rounded-full border border-line bg-white" />

        <AnimatePresence mode="wait">
          <motion.div
            key={p.grade}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute left-0 top-[81%] w-[26.5%]"
          >
            <PriceCard
              grade={p.grade}
              blurb={`${p.name.split('Fully Synthetic ')[1] ?? p.shortName} · ${p.tagline}`}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div {...fade(0.9)} className="absolute left-[43%] top-[88%] flex items-center gap-5">
          <TechButton href="#products" variant="red" className="px-10">
            Learn More
          </TechButton>
          <ProductDots index={index} onSelect={setIndex} />
        </motion.div>

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/40">
          <div className="scroll-mouse">
            <span className="scroll-mouse-wheel" />
          </div>
        </div>

        <Chevrons className="absolute right-0 top-[48%]" count={3} color="bg-line" size="md" dir="left" />
      </div>

      {/* ===== Mobile ===== */}
      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id + '-m'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <p className="text-tech text-[12px] sm:text-[16px] font-medium leading-snug">{p.eyebrow}</p>
            <h1 className="mt-2 text-[30px] sm:text-[46px] font-bold uppercase leading-[0.98]">
              <LetterReveal text={p.headline[0]} delay={0.05} stagger={0.03} />
              <br />
              <LetterReveal text={p.headline[1]} delay={0.22} stagger={0.03} />
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6">
          <Rating label={p.ratingLabel} />
        </div>

        <div className="relative mt-6 overflow-hidden">
          <div className="absolute inset-x-0 top-[12%] bottom-[8%] bg-panel-2/70 hatch clip-diag-16 sm:clip-diag-28" />
          <AnimatePresence mode="wait">
            <motion.img
              key={p.heroImage + '-m'}
              src={p.heroImage}
              alt={p.imageAlt}
              className="relative mx-auto w-full max-w-[340px] mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.75, ease: EASE }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        <div className="mt-4 flex justify-center">
          <ProductDots index={index} onSelect={setIndex} />
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
          <Callout title={p.callouts[0].title} desc={p.callouts[0].desc} />
          <Callout title={p.callouts[1].title} desc={p.callouts[1].desc} />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <PriceCard
            className="w-full sm:w-[290px]"
            grade={p.grade}
            blurb={`${p.shortName} · ${p.tagline}`}
          />
          <TechButton href="#products" variant="red" className="w-full sm:w-auto px-10">
            Learn More
          </TechButton>
        </div>
      </div>
    </section>
  )
}
