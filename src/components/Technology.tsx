import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal, { EASE } from './ui/Reveal'
import Marquee from './ui/Marquee'
import Chevrons from './ui/Chevrons'
import { PRODUCTS } from '../data/content'

const Can3D = lazy(() => import('./three/Can3D'))
const Bottle3D = lazy(() => import('./three/Bottle3D'))

const TECH_PRODUCT_KEY = 'purelube-tech-product'
const TECH_PRODUCT_EVENT = 'purelube:select-tech-product'

function indexFromProductId(id: string | null | undefined) {
  if (!id) return 0
  const i = PRODUCTS.findIndex((x) => x.id === id)
  return i >= 0 ? i : 0
}

function SpecRow({
  label,
  value,
  desc,
  i,
  gold,
}: {
  label: string
  value: string
  desc: string
  i: number
  gold?: boolean
}) {
  return (
    <Reveal delay={0.1 + i * 0.12} x={30} y={0} className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[110px_1fr] sm:items-center sm:gap-4 md:grid-cols-[150px_1fr]">
      <div className="relative">
        <span className={`text-tech text-[11px] font-bold ${gold ? 'text-gold' : 'text-brand'}`}>{label}</span>
        <span className="mt-1 block h-px w-full bg-white/30" />
        <span className={`absolute -bottom-1 right-0 h-[3px] w-1/3 ${gold ? 'bg-gold/70' : 'bg-white/60'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' }} />
      </div>
      <motion.div
        whileHover={{ x: 8 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="clip-diag-10 sm:clip-diag-16 bg-ink-2 hatch-dark px-4 py-3 sm:px-5 sm:py-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow duration-500 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
      >
        <div className={`text-[22px] font-bold leading-none ${gold ? 'text-gold' : 'text-white'}`}>{value}</div>
        <div className="mt-1 text-tech-sm text-[9.5px] text-white/60">{desc}</div>
      </motion.div>
    </Reveal>
  )
}

export default function Technology() {
  const [active, setActive] = useState(() =>
    indexFromProductId(
      typeof window !== 'undefined' ? sessionStorage.getItem(TECH_PRODUCT_KEY) : null,
    ),
  )
  const p = PRODUCTS[active]
  const isBike = p.id === '10w40'
  const isGold = p.id === '5w40'

  const selectProduct = (index: number) => {
    setActive(index)
    sessionStorage.setItem(TECH_PRODUCT_KEY, PRODUCTS[index].id)
  }

  useEffect(() => {
    const applyId = (id: string) => selectProduct(indexFromProductId(id))

    const onSelect = (e: Event) => applyId((e as CustomEvent<string>).detail)
    const onHash = () => {
      if (location.hash.replace(/^#/, '').startsWith('technology')) {
        const stored = sessionStorage.getItem(TECH_PRODUCT_KEY)
        if (stored) applyId(stored)
      }
    }

    window.addEventListener(TECH_PRODUCT_EVENT, onSelect)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener(TECH_PRODUCT_EVENT, onSelect)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  return (
    <section id="technology" className="relative scroll-mt-24 overflow-x-clip bg-ink text-white">
      <div
        className="absolute right-0 top-0 h-6 w-[16%] bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12% 100%)' }}
      />

      <div className="wrap pt-12 md:pt-20">
        <SectionHeader title={['Protection That', 'Moves With You']} label="PureLube Technology" tone="dark" />

        <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          {PRODUCTS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectProduct(i)}
              className={`relative min-h-[44px] w-full clip-diag-8 px-3 py-2 text-tech text-[10px] sm:text-[11px] font-semibold transition-transform duration-500 hover:scale-[1.02] touch-manipulation sm:w-auto sm:px-5 ${
                i === active
                  ? item.id === '5w40'
                    ? 'text-ink'
                    : 'text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="tech-tab"
                  className={`absolute inset-0 clip-diag-8 ${item.id === '5w40' ? 'bg-gold' : 'bg-brand'}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.shortName}</span>
            </button>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-6 sm:mt-8">
          <Marquee duration={32} className="py-2 text-white/35">
            {[...p.standards, ...p.standards].slice(0, 12).map((s, i) => (
              <span key={`${s}-${i}`} className="mx-5 text-tech text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap">
                {s}
                <span className={`mx-5 inline-block h-1 w-1 align-middle ${isGold ? 'bg-gold' : 'bg-brand'}`} />
              </span>
            ))}
          </Marquee>
        </Reveal>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <Reveal className="relative mx-auto aspect-square w-full min-w-0 max-w-[280px] overflow-hidden sm:max-w-[420px] lg:max-w-[520px]">
            <motion.div
              key={isGold ? 'rays-gold' : 'rays-red'}
              className={`absolute inset-[4%] ${isGold ? 'ray-burst-gold' : 'ray-burst'}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            />
            <div className={`absolute inset-[26%] rounded-full blur-3xl ${isGold ? 'bg-gold/25' : 'bg-brand/10'}`} />
            <AnimatePresence mode="wait">
              {isBike ? (
                <motion.div
                  key="3d-can"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Suspense
                    fallback={
                      <img src={p.techImage} alt={p.imageAlt} className="relative h-full w-full object-contain" />
                    }
                  >
                    <Can3D className="relative h-full w-full cursor-grab active:cursor-grabbing" />
                  </Suspense>
                  <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-tech-sm text-[9px] text-white/40">
                    Drag to rotate · Live 3D model
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="3d-bottle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Suspense
                    fallback={
                      <img src={p.techImage} alt={p.imageAlt} className="relative h-full w-full object-contain" />
                    }
                  >
                    <Bottle3D className="relative h-full w-full cursor-grab active:cursor-grabbing" />
                  </Suspense>
                  <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-tech-sm text-[9px] text-white/40">
                    Drag to rotate · Live 3D model
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>

          <div className="grid min-w-0 gap-7 overflow-x-clip">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="grid gap-7"
              >
                {p.specs.map((s, i) => (
                  <SpecRow key={`${p.id}-${s.label}`} {...s} i={i} gold={isGold} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative z-10 wrap pt-6 md:pt-10 pb-10 sm:pb-0 sm:translate-y-[30%]">
        <Reveal className="relative mx-auto max-w-[900px]">
          <div className="absolute -top-[2px] right-[18%] z-10 hidden sm:block">
            <Chevrons count={3} color="bg-ink" size="lg" dir="left" />
          </div>
          <div className="clip-tl-16 sm:clip-tl-28 bg-white text-ink shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="grid md:grid-cols-[42%_1fr]">
              <div className="relative overflow-hidden bg-panel hatch grid place-items-center min-h-[180px] sm:min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={p.image}
                    src={isBike ? '/img/spec-card.png' : '/img/spec-card-bottle.png'}
                    alt={p.imageAlt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`h-full min-h-[180px] sm:min-h-[240px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    loading="lazy"
                    draggable={false}
                  />
                </AnimatePresence>
              </div>
              <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-tech text-[14px] md:text-[17px] font-bold text-ink leading-snug">{p.name}</h3>
                    <ul className="mt-3 sm:mt-4">
                      {p.table.map(([k, v], i) => (
                        <motion.li
                          key={k}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.05 * i }}
                          className="flex items-start justify-between gap-3 border-b border-line py-[7px] text-tech-sm text-[9px] sm:gap-4 sm:text-[9.5px]"
                        >
                          <span className="shrink-0 text-muted">{k}</span>
                          <span className="min-w-0 text-right font-semibold text-ink break-words">{v}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
