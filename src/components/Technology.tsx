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
        <span className={`text-tech text-[13px] font-bold sm:text-[14px] ${gold ? 'text-gold' : 'text-brand'}`}>{label}</span>
        <span className="mt-1 block h-px w-full bg-white/30" />
        <span className={`absolute -bottom-1 right-0 h-[3px] w-1/3 ${gold ? 'bg-gold/70' : 'bg-white/60'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' }} />
      </div>
      <motion.div
        whileHover={{ x: 8 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="clip-diag-10 sm:clip-diag-16 bg-ink-2 hatch-dark px-4 py-3 sm:px-5 sm:py-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow duration-500 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
      >
        <div className={`text-[24px] font-bold leading-none sm:text-[26px] ${gold ? 'text-gold' : 'text-white'}`}>{value}</div>
        <div className="mt-1.5 text-[13px] font-medium leading-snug text-white/70 sm:text-[14px]">{desc}</div>
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
              className={`relative min-h-[48px] w-full clip-diag-8 px-3 py-2.5 text-tech text-[13px] sm:text-[14px] font-semibold transition-transform duration-500 hover:scale-[1.02] touch-manipulation sm:w-auto sm:px-5 ${
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
              <span key={`${s}-${i}`} className="mx-5 text-tech text-[13px] font-semibold tracking-[0.14em] whitespace-nowrap sm:text-[14px]">
                {s}
                <span className={`mx-5 inline-block h-1 w-1 align-middle ${isGold ? 'bg-gold' : 'bg-brand'}`} />
              </span>
            ))}
          </Marquee>
        </Reveal>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <Reveal className="relative mx-auto w-full min-w-0 max-w-[280px] sm:max-w-[420px] lg:max-w-[520px]">
            <div className="relative aspect-square overflow-hidden">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="pointer-events-none mt-2 px-1 text-center text-[11px] font-medium leading-snug text-white/50 sm:mt-3 sm:text-[12px]">
              {isBike ? 'Drag to spin and tilt · Lid, labels, and base' : 'Drag to spin and tilt · Cap, labels, and base'}
            </p>
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

      <div className="relative z-10 wrap pt-6 md:pt-10 pb-12 sm:pb-0 sm:translate-y-[30%]">
        <Reveal className="relative mx-auto max-w-[1180px]">
          <div className="absolute -top-[2px] right-[14%] z-10 hidden sm:block">
            <Chevrons count={3} color="bg-ink" size="lg" dir="left" />
          </div>
          <div className="clip-tl-16 sm:clip-tl-24 md:clip-tl-28 bg-white text-ink shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
            <div className="grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr] md:items-stretch">
              <div className="relative overflow-hidden bg-panel hatch aspect-[16/11] min-h-[200px] sm:min-h-[240px] md:aspect-auto md:h-full md:min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={p.image}
                    src={isBike ? '/img/spec-card.png?v=8' : '/img/spec-card-bottle.png?v=8'}
                    alt={p.imageAlt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    loading="lazy"
                    draggable={false}
                  />
                </AnimatePresence>
              </div>
              <div className="min-w-0 px-5 py-5 sm:px-7 sm:py-6 md:px-8 md:py-6 lg:px-10 lg:py-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={`text-tech text-[13px] sm:text-[14px] font-bold tracking-[0.12em] ${isGold ? 'text-gold' : 'text-brand'}`}>
                      Spec Sheet
                    </div>
                    <h3 className="mt-1.5 text-tech text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold text-ink leading-[1.15]">
                      {p.name}
                    </h3>
                    <div className="relative mt-2.5 h-px w-full bg-ink/10">
                      <span className={`absolute left-0 top-[-1px] h-[3px] w-14 ${isGold ? 'bg-gold' : 'bg-brand'}`} />
                    </div>
                    <ul className="mt-3 sm:mt-3.5">
                      {p.table.map(([k, v], i) => (
                        <motion.li
                          key={k}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.04 * i }}
                          className="flex items-start justify-between gap-4 border-b border-line py-2 sm:gap-6 sm:py-2.5 text-[13px] sm:text-[14px] md:text-[15px]"
                        >
                          <span className="shrink-0 font-semibold uppercase tracking-[0.06em] text-muted">{k}</span>
                          <span className="min-w-0 text-right font-bold text-ink break-words leading-snug">{v}</span>
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
