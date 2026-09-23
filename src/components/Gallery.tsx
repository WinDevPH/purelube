import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal, { EASE } from './ui/Reveal'
import { setPageScrollLocked } from '../hooks/useLenis'
import { GALLERY, RIDES } from '../data/content'

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
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const featured = GALLERY[0]
  const secondary = GALLERY[1]
  const current = GALLERY[active]

  useEffect(() => {
    setPageScrollLocked(lightbox !== null)
    return () => setPageScrollLocked(false)
  }, [lightbox])

  return (
    <div className="relative mt-14 md:mt-20 overflow-x-clip bg-[#f4f6f8] pt-10 md:pt-14 pb-2">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[#c8ddf0]/55 via-[#e8eef4]/40 to-transparent"
        aria-hidden
      />

      <div className="relative wrap">
        <SectionHeader title={['PureLube', 'Facilities']} label="Our Buildings" />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[420px] text-[13px] sm:text-[14px] font-medium leading-relaxed text-ink/65">
            Clean German engineering, from headquarters to production — the PureLube facilities behind every
            Platinum grade.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-8">
            <button
              type="button"
              onClick={() => {
                setActive(0)
                setLightbox(0)
              }}
              className="group relative block w-full overflow-hidden bg-white text-left shadow-[0_1px_0_rgba(15,23,42,0.06),0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-500 hover:-translate-y-0.5 touch-manipulation"
            >
              <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden">
                <img
                  src={featured.src}
                  alt={featured.caption}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  draggable={false}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute left-0 top-0 h-full w-[3px] bg-brand" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-7">
                  <div className="text-tech text-[13px] sm:text-[14px] font-bold tracking-[0.16em] text-white/70">
                    01 · Facility
                  </div>
                  <div className="mt-1 text-[22px] sm:text-[30px] md:text-[34px] font-bold uppercase leading-[0.98] text-white">
                    {featured.tag}
                  </div>
                  <div className="mt-1.5 max-w-[36ch] text-[12px] sm:text-[13px] font-medium text-white/75">
                    {featured.caption}
                  </div>
                </div>
              </div>
            </button>
          </Reveal>

          <div className="grid gap-3 sm:gap-4 lg:col-span-4 lg:grid-rows-[1fr_auto]">
            <Reveal delay={0.1}>
              <button
                type="button"
                onClick={() => {
                  setActive(1)
                  setLightbox(1)
                }}
                className="group relative block h-full min-h-[220px] w-full overflow-hidden bg-white text-left shadow-[0_1px_0_rgba(15,23,42,0.06),0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-500 hover:-translate-y-0.5 touch-manipulation lg:min-h-0"
              >
                <div className="relative h-full min-h-[220px] aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-full overflow-hidden">
                  <img
                    src={secondary.src}
                    alt={secondary.caption}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <div className="text-tech text-[13px] font-bold tracking-[0.14em] text-white/65">
                      02 · Facility
                    </div>
                    <div className="mt-1 text-[18px] sm:text-[20px] font-bold uppercase leading-tight text-white">
                      {secondary.tag}
                    </div>
                    <div className="mt-1 text-[14px] font-medium text-white/70 leading-snug">
                      {secondary.caption}
                    </div>
                  </div>
                </div>
              </button>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="grid grid-cols-2 gap-px overflow-hidden border border-[#d7dde5] bg-[#d7dde5]">
                {[
                  { k: 'Origin', v: 'Germany' },
                  { k: 'Focus', v: 'HQ · Plant' },
                  { k: 'Skyline', v: 'Modern' },
                  { k: 'Brand', v: 'PureLube' },
                ].map((item) => (
                  <div key={item.k} className="bg-[#f4f6f8] px-3 py-3.5 sm:px-4 sm:py-4">
                    <div className="text-tech text-[12px] font-semibold tracking-[0.12em] text-muted">{item.k}</div>
                    <div className="mt-1 text-tech text-[12px] sm:text-[13px] font-bold text-ink">{item.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2} className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap">
          {GALLERY.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative min-h-12 w-full sm:min-h-11 sm:w-auto clip-diag-6 px-3 py-2.5 text-tech text-[12px] sm:text-[14px] font-bold tracking-[0.06em] sm:tracking-[0.08em] transition-all duration-500 touch-manipulation ${
                active === i
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink/70 hover:bg-ink hover:text-white border border-[#d7dde5]'
              }`}
            >
              <span className="sm:hidden">{String(i + 1).padStart(2, '0')} · {i === 0 ? 'HQ' : 'Plant'}</span>
              <span className="hidden sm:inline">{String(i + 1).padStart(2, '0')} · {g.tag}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setLightbox(active)}
            className="col-span-2 min-h-12 w-full sm:col-auto sm:min-h-11 sm:w-auto clip-diag-6 bg-brand px-5 py-2.5 text-tech text-[13px] sm:text-[14px] font-bold text-white tracking-[0.08em] transition-transform duration-500 hover:scale-[1.02] touch-manipulation"
          >
            View Full Photo
          </button>
        </Reveal>

        <Reveal delay={0.25} className="mt-4 border border-[#d7dde5] bg-white px-4 py-3.5 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <span className="text-tech text-[13px] font-bold tracking-[0.14em] text-brand">Selected</span>
              <span className="mx-2 text-ink/20">·</span>
              <span className="text-tech text-[12px] sm:text-[13px] font-bold text-ink">{current.tag}</span>
            </div>
            <p className="text-[12px] font-medium text-ink/60">{current.caption}</p>
          </div>
        </Reveal>
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
              className="relative w-full max-w-5xl overflow-hidden bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-ink text-white text-lg font-bold touch-manipulation"
              >
                ×
              </button>
              <img
                src={GALLERY[lightbox].src}
                alt={GALLERY[lightbox].caption}
                className="max-h-[78vh] w-full object-contain bg-[#e8eef4]"
                draggable={false}
              />
              <div className="border-t border-[#d7dde5] px-4 py-3.5 sm:px-6">
                <div className="text-tech text-[13px] font-bold text-ink">{GALLERY[lightbox].tag}</div>
                <div className="text-[12px] font-medium text-ink/60">{GALLERY[lightbox].caption}</div>
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
