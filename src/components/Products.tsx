import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import TechButton from './ui/TechButton'
import { PRODUCTS } from '../data/content'

const LINEUP_IMAGE: Record<string, string> = {
  '10w40': '/img/lineup-can.png?v=float2',
  '5w40': '/img/bottle-cutout.png?v=float2',
}

export default function Products() {
  return (
    <section
      id="products"
      className="relative wrap overflow-x-clip scroll-mt-24 pt-7 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20 lg:pb-24"
    >
      <SectionHeader title={['PureLube Platinum', 'Lineup']} label="Our Products" />

      <ol className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
        {PRODUCTS.map((p, i) => {
          const isGold = p.id === '5w40'
          return (
            <Reveal key={p.id} delay={i * 0.06}>
              <li
                className={`grid items-center gap-4 py-6 sm:gap-5 sm:py-8 md:grid-cols-[minmax(200px,34%)_minmax(0,1fr)] md:gap-7 md:py-10 lg:grid-cols-[minmax(240px,36%)_minmax(0,1fr)] lg:gap-10 lg:py-12 xl:grid-cols-[minmax(280px,38%)_minmax(0,1fr)] xl:gap-14 xl:py-14 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <a
                  href={`#product/${p.id}`}
                  className="grid w-full place-items-center self-center"
                  aria-label={`View ${p.name}`}
                >
                  <img
                    src={LINEUP_IMAGE[p.id] ?? p.image}
                    alt={p.imageAlt}
                    className="mx-auto h-auto w-auto max-h-[190px] max-w-[min(72vw,200px)] object-contain object-center sm:max-h-[230px] sm:max-w-[min(60vw,240px)] md:max-h-[280px] md:max-w-full lg:max-h-[340px] xl:max-h-[400px]"
                    loading="lazy"
                    draggable={false}
                  />
                </a>
                <div className="min-w-0 max-w-[68ch] md:max-w-none">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span
                      className={`text-[12px] font-bold tabular-nums sm:text-[13px] md:text-[14px] lg:text-[15px] ${isGold ? 'text-gold' : 'text-brand'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      className={`text-[11px] font-bold uppercase tracking-[0.14em] sm:text-[12px] md:text-[13px] lg:text-[14px] ${isGold ? 'text-gold' : 'text-brand'}`}
                    >
                      {p.category}
                    </p>
                  </div>
                  <p className="mt-1.5 font-display text-[clamp(1.625rem,2.1vw+1.05rem,2.75rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink">
                    <a href={`#product/${p.id}`} className="transition-colors duration-300 hover:text-brand">
                      {p.shortName}
                    </a>
                  </p>
                  <h3 className="mt-1.5 text-[14px] font-bold uppercase leading-snug text-ink sm:text-[16px] md:text-[17px] lg:text-[19px]">
                    <a href={`#product/${p.id}`} className="transition-colors duration-300 hover:text-brand">
                      PureLube Platinum Fully Synthetic
                    </a>
                  </h3>
                  <p className="mt-2 text-[14px] font-semibold leading-snug text-ink sm:mt-2.5 sm:text-[15px] md:text-[16px] lg:text-[17px]">
                    {p.tagline}
                  </p>
                  <p className="mt-2.5 text-[13px] font-medium leading-[1.6] text-ink/70 line-clamp-3 sm:mt-3 sm:text-[14px] sm:leading-[1.65] sm:line-clamp-4 md:text-[15px] md:leading-[1.7] md:line-clamp-none lg:text-[16px] lg:max-w-[62ch]">
                    {p.intro}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                    <span className="bg-ink px-2.5 py-1 text-[11px] font-bold text-white sm:px-3 sm:py-1.5 sm:text-[12px] md:text-[13px]">
                      SAE {p.grade}
                    </span>
                    {p.standards.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="border border-line px-2.5 py-1 text-[11px] font-semibold text-ink sm:px-3 sm:py-1.5 sm:text-[12px] md:text-[13px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-5 md:mt-6">
                    <TechButton
                      href={`#product/${p.id}`}
                      variant={isGold ? 'black' : 'red'}
                      className="w-full min-h-[44px] px-5 text-[13px] sm:w-auto sm:min-h-[48px] sm:px-7 sm:text-[14px] md:text-[15px]"
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
