import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import TechButton from './ui/TechButton'
import { PRODUCTS } from '../data/content'

const LINEUP_IMAGE: Record<string, string> = {
  '10w40': '/img/lineup-can.png',
  '5w40': '/img/bottle-cutout.png',
}

export default function Products() {
  return (
    <section id="products" className="relative wrap overflow-x-clip scroll-mt-24 pt-8 md:pt-12 pb-14 md:pb-24">
      <SectionHeader title={['PureLube Platinum', 'Lineup']} label="Our Products" />

      <ol className="mt-8 sm:mt-10">
        {PRODUCTS.map((p, i) => {
          const isGold = p.id === '5w40'
          return (
            <Reveal key={p.id} delay={i * 0.06}>
              <li
                className={`grid items-center gap-6 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <a href={`#product/${p.id}`} className="grid place-items-center" aria-label={`View ${p.name}`}>
                  <img
                    src={LINEUP_IMAGE[p.id] ?? p.image}
                    alt={p.imageAlt}
                    className="h-auto max-h-[280px] w-full object-contain sm:max-h-[340px]"
                    loading="lazy"
                    draggable={false}
                  />
                </a>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className={`text-[15px] font-bold tabular-nums ${isGold ? 'text-gold' : 'text-brand'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className={`text-[14px] font-bold uppercase tracking-[0.1em] sm:text-[15px] ${isGold ? 'text-gold' : 'text-brand'}`}>
                      {p.category}
                    </p>
                  </div>
                  <h3 className="mt-2 text-[28px] font-bold uppercase leading-[1.02] text-ink sm:text-[36px]">
                    <a href={`#product/${p.id}`} className="transition-colors duration-300 hover:text-brand">
                      {p.name}
                    </a>
                  </h3>
                  <p className="mt-3 text-[17px] font-semibold leading-snug text-ink sm:text-[19px]">{p.tagline}</p>
                  <p className="mt-3 max-w-[62ch] text-[16px] font-medium leading-[1.65] text-ink/70 line-clamp-4">
                    {p.intro}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-ink px-3 py-1.5 text-[14px] font-bold text-white">SAE {p.grade}</span>
                    {p.standards.slice(0, 2).map((s) => (
                      <span key={s} className="border border-line px-3 py-1.5 text-[14px] font-semibold text-ink">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6">
                    <TechButton
                      href={`#product/${p.id}`}
                      variant={isGold ? 'black' : 'red'}
                      className="w-full sm:w-auto px-7 text-[15px]"
                    >
                      View Details
                    </TechButton>
                  </div>
                </div>
              </li>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
