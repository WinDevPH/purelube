import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal, { EASE } from './ui/Reveal'
import { setPageScrollLocked } from '../hooks/useLenis'
import { GALLERY, RIDES } from '../data/content'
import { COMPANY } from '../data/company'

function TripleArrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      className="group inline-flex min-h-11 min-w-11 items-center justify-center gap-[2px] p-2 text-ink/45 transition-all duration-500 hover:text-brand hover:scale-[1.06] disabled:opacity-25 disabled:hover:text-ink/45 disabled:hover:scale-100 touch-manipulation"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block border-y-[9px] border-y-transparent"
          style={
            dir === 'prev'
              ? { borderRight: '11px solid currentColor', opacity: 0.4 + i * 0.3 }
              : { borderLeft: '11px solid currentColor', opacity: 1 - i * 0.3 }
          }
        />
      ))}
    </button>
  )
}

function usePerView() {
  const [n, setN] = useState(3)
  useEffect(() => {
    const calc = () => setN(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return n
}

function RidersCarousel() {
  const [i, setI] = useState(0)
  const perView = usePerView()
  const max = Math.max(0, RIDES.length - perView)
  const index = Math.min(i, max)

  const trackRef = useRef<HTMLDivElement>(null)
  const [trackW, setTrackW] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setTrackW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const gap = perView === 1 ? 16 : 32
  const cardW = trackW ? (trackW - gap * (perView - 1)) / perView : 0
  const step = cardW + gap

  return (
    <div id="riders" className="scroll-mt-24">
      <div className="wrap">
        <SectionHeader title={['Built For', 'Every Ride']} label="PureLube Riders" />
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-[360px] text-[14px] leading-relaxed text-muted">
            From daily scooters to off-road CRF and big bikes, PureLube Platinum Fully Synthetic 10W-40 SN
            turns every ride into pure performance.
          </p>
        </Reveal>
      </div>

      <div className="wrap mt-7 sm:mt-10">
        <div ref={trackRef} className="relative overflow-hidden py-2">
          <motion.div
            className="flex"
            style={{ gap }}
            animate={{ x: -index * step }}
            transition={{ type: 'spring', stiffness: 120, damping: 24, mass: 0.8 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 && index < max) setI(index + 1)
              if (info.offset.x > 60 && index > 0) setI(index - 1)
            }}
          >
            {RIDES.map((r, k) => {
              const visible = k >= index && k < index + perView
              return (
                <motion.figure
                  key={r.src + r.tag}
                  animate={{ opacity: visible ? 1 : 0.45, y: visible ? 0 : 8 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="group relative shrink-0"
                  style={{ width: cardW || undefined }}
                >
                  <div className="clip-hud bg-white p-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.14)]">
                    <div className="relative clip-hud overflow-hidden bg-ink">
                      <img
                        src={r.src}
                        alt={r.caption}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                      <figcaption className="absolute bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 text-white transition-transform duration-500 group-hover:translate-y-[-2px]">
                        <div className="text-tech text-[12px] sm:text-[13px] font-bold">{r.tag}</div>
                        <div className="text-[12px] sm:text-[13px] text-white/70 leading-snug">{r.caption}</div>
                      </figcaption>
                    </div>
                  </div>
                </motion.figure>
              )
            })}
          </motion.div>
        </div>
      </div>

      <div className="wrap mt-6 flex items-center justify-between sm:mt-8">
        <TripleArrow dir="prev" onClick={() => setI(Math.max(0, index - 1))} disabled={index === 0} />
        <div className="flex items-center gap-0.5">
          {Array.from({ length: max + 1 }).map((_, k) => (
            <button
              key={k}
              aria-label={`Go to slide ${k + 1}`}
              onClick={() => setI(k)}
              className="grid h-11 w-8 place-items-center touch-manipulation"
            >
              <span className={`h-[3px] w-6 transition-colors ${k === index ? 'bg-brand' : 'bg-ink/15'}`} />
            </button>
          ))}
        </div>
        <TripleArrow dir="next" onClick={() => setI(Math.min(max, index + 1))} disabled={index === max} />
      </div>
    </div>
  )
}

function FacilitiesBlock() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const office = COMPANY.office
  const cards = [
    {
      ...GALLERY[0],
      kicker: 'Headquarters',
      line: 'Am Haupttor, Geb. 4609',
      sub: office.line2,
    },
    {
      ...GALLERY[1],
      kicker: 'Production',
      line: 'Precision blending & logistics',
      sub: office.line2,
    },
  ]

  useEffect(() => {
    setPageScrollLocked(lightbox !== null)
    return () => setPageScrollLocked(false)
  }, [lightbox])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <div className="relative mt-14 md:mt-20 overflow-x-clip bg-panel hatch pt-10 md:pt-14 pb-12 md:pb-16">
      <div className="relative wrap">
        <SectionHeader title={['PureLube', 'Facilities']} label="Our Buildings" />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[420px] text-[13px] sm:text-[14px] leading-relaxed text-muted">
            Clean German engineering, from headquarters to production — the PureLube facilities behind every
            Platinum grade.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-2 lg:gap-5">
          {cards.map((g, i) => (
            <Reveal key={g.src} delay={0.08 * i}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative block w-full overflow-hidden clip-diag-10 sm:clip-diag-16 border border-line bg-ink text-left shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-500 hover:-translate-y-0.5 touch-manipulation"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-ink">
                  <img
                    src={g.src}
                    alt={g.caption}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <div className="pointer-events-none absolute left-3 top-3 z-10 clip-diag-6 bg-ink px-2.5 py-1.5 text-tech text-[11px] font-bold tracking-[0.14em] text-white sm:left-4 sm:top-4 sm:px-3 sm:text-[12px]">
                    {String(i + 1).padStart(2, '0')} · Facility
                  </div>
                  <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                    <div className="min-w-0 clip-diag-6 bg-white/95 px-3 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:px-3.5">
                      <div className="text-tech text-[10px] font-bold tracking-[0.16em] text-brand">{g.kicker}</div>
                      <div className="mt-0.5 truncate text-[12px] font-semibold text-ink sm:text-[13px]">{g.line}</div>
                      <div className="text-[11px] text-muted">{g.sub}</div>
                    </div>
                    <span className="shrink-0 clip-diag-6 bg-brand px-3 py-2.5 text-tech text-[11px] font-bold whitespace-nowrap text-white transition-colors group-hover:bg-brand-dark sm:px-3.5 sm:text-[12px]">
                      View ↗
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/90 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative w-full max-w-5xl overflow-hidden clip-diag-10 sm:clip-diag-16 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center clip-diag-4 bg-ink text-white text-lg font-bold touch-manipulation hover:bg-brand"
              >
                ×
              </button>
              <img
                src={GALLERY[lightbox].src}
                alt={GALLERY[lightbox].caption}
                className="max-h-[78vh] w-full object-contain bg-panel"
                draggable={false}
              />
              <div className="flex items-center justify-between gap-4 border-t border-line bg-white px-4 py-3.5 sm:px-6">
                <div>
                  <div className="text-tech text-[10px] font-bold tracking-[0.16em] text-brand">
                    {String(lightbox + 1).padStart(2, '0')} · Facility
                  </div>
                  <div className="text-tech text-[13px] font-bold text-ink">{GALLERY[lightbox].tag}</div>
                  <div className="text-[12px] font-medium text-muted">{GALLERY[lightbox].caption}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden pt-8 md:pt-12 pb-14 md:pb-20">
      <RidersCarousel />
      <FacilitiesBlock />
    </section>
  )
}
