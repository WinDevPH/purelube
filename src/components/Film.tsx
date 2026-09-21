import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal, { EASE } from './ui/Reveal'
import { setPageScrollLocked } from '../hooks/useLenis'
import { FILMS } from '../data/content'

export default function Film() {
  const [active, setActive] = useState<(typeof FILMS)[number] | null>(null)
  const hero = FILMS[0]

  useEffect(() => {
    setPageScrollLocked(!!active)
    return () => setPageScrollLocked(false)
  }, [active])

  return (
    <section id="film" className="relative wrap overflow-x-clip scroll-mt-24 pt-4 md:pt-6 pb-10 md:pb-14">
      <SectionHeader title={['PureLube', 'On Film']} label="Brand & Production" />

      <Reveal delay={0.1} className="mt-6">
        <button
          type="button"
          onClick={() => setActive(hero)}
          className="group relative block w-full overflow-hidden clip-diag-12 sm:clip-diag-20 bg-ink text-left touch-manipulation"
          aria-label={`Play ${hero.title}`}
        >
          <video
            className="aspect-[16/9] sm:aspect-[21/9] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            src={hero.src}
            poster={hero.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 hatch-dark opacity-30" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center clip-diag-8 bg-brand text-white shadow-[0_12px_40px_rgba(238,28,46,0.45)] transition-transform duration-500 group-hover:scale-110">
              <span className="ml-1 block border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <div className="text-tech text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-brand">
              Featured Film
            </div>
            <div className="mt-1 text-[22px] sm:text-[32px] font-bold uppercase leading-none text-white">
              {hero.title}
            </div>
            <div className="mt-1.5 text-tech-sm text-[9.5px] text-white/65">{hero.subtitle}</div>
          </div>
        </button>
      </Reveal>

      <Reveal delay={0.18} className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2">
        {FILMS.map((film) => (
          <button
            key={film.id}
            type="button"
            onClick={() => setActive(film)}
            className="group relative flex min-h-[72px] items-center gap-3 overflow-hidden clip-diag-8 bg-panel hatch px-3 py-3 text-left transition-transform duration-500 hover:-translate-y-0.5 touch-manipulation sm:px-4"
          >
            <div className="relative h-14 w-20 shrink-0 overflow-hidden clip-diag-6 bg-ink sm:h-16 sm:w-24">
              <img
                src={film.poster}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                draggable={false}
              />
              <span className="absolute inset-0 grid place-items-center bg-ink/35">
                <span className="ml-0.5 block border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-tech text-[12px] font-bold text-ink">{film.title}</div>
              <div className="mt-0.5 text-tech-sm text-[9px] text-muted">{film.subtitle}</div>
            </div>
          </button>
        ))}
      </Reveal>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/92 p-4 sm:p-6 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 16, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative w-full max-w-5xl clip-hud bg-white p-[6px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setActive(null)}
                className="absolute -top-3 -right-3 z-10 grid h-10 w-10 place-items-center clip-diag-6 bg-brand text-white text-lg font-bold touch-manipulation"
              >
                ×
              </button>
              <div className="clip-hud overflow-hidden bg-ink">
                <video
                  key={active.src}
                  className="aspect-video w-full bg-ink"
                  src={active.src}
                  poster={active.poster}
                  controls
                  autoPlay
                  playsInline
                />
                <div className="border-t border-white/10 px-4 py-3 sm:px-5">
                  <div className="text-tech text-[12px] font-bold text-white">{active.title}</div>
                  <div className="text-tech-sm text-[9px] text-white/55">{active.subtitle}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
