import { PRODUCTS } from '../data/content'
import TechButton from './ui/TechButton'

const FACT_KEYS = ['Type', 'Application', 'Origin']

const LINEUP_IMAGE: Record<string, string> = {
  '10w40': '/img/lineup-can.png?v=float2',
  '5w40': '/img/bottle-cutout.png?v=float2',
}

export default function ProductDetail({ id }: { id: string }) {
  const p = PRODUCTS.find((item) => item.id === id)
  const isGold = p?.id === '5w40'

  if (!p) {
    return (
      <section className="wrap py-16 sm:py-24">
        <p className="text-[16px] font-medium text-ink sm:text-[18px]">This product is not in the lineup.</p>
        <a href="#products" className="mt-5 inline-block text-[15px] font-bold text-brand sm:text-[16px]">
          Back to products
        </a>
      </section>
    )
  }

  const accent = isGold ? 'text-gold' : 'text-brand'
  const accentBg = isGold ? 'bg-gold text-ink' : 'bg-brand text-white'

  return (
    <article className="bg-white pb-12 sm:pb-16 md:pb-24">
      <header className="border-b border-line">
        <div className="wrap py-3 text-[12px] font-semibold sm:py-4 sm:text-[14px] md:text-[15px]">
          <nav className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <a href="#products" className="text-muted transition-colors duration-300 hover:text-ink">
              Products
            </a>
            <span className="text-ink/30" aria-hidden>
              /
            </span>
            <span className="truncate text-ink">{p.shortName}</span>
          </nav>
        </div>
      </header>

      <div className="wrap grid items-center gap-5 py-6 sm:gap-7 sm:py-9 md:grid-cols-[minmax(220px,38%)_minmax(0,1fr)] md:gap-8 md:py-12 lg:grid-cols-[minmax(260px,40%)_minmax(0,1fr)] lg:gap-12 lg:py-16 xl:gap-16">
        <div className="grid w-full place-items-center">
          <img
            src={LINEUP_IMAGE[p.id] ?? p.image}
            alt={p.imageAlt}
            className="mx-auto h-auto w-auto max-h-[240px] max-w-[min(70vw,240px)] object-contain object-center sm:max-h-[300px] sm:max-w-[min(55vw,300px)] md:max-h-[380px] md:max-w-full lg:max-h-[460px] xl:max-h-[520px]"
            draggable={false}
          />
        </div>

        <div className="min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-[0.14em] sm:text-[12px] md:text-[13px] ${accent}`}>
            {p.category}
            <span className="mx-2 text-ink/25">·</span>
            SAE {p.grade}
          </p>
          <p className="mt-2 font-display text-[clamp(1.875rem,2.4vw+1.15rem,3.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink">
            {p.shortName}
          </p>
          <h1 className="mt-2 text-[15px] font-bold uppercase leading-snug text-ink sm:text-[18px] md:text-[20px] lg:text-[22px]">
            PureLube Platinum Fully Synthetic
          </h1>
          <p className="mt-2.5 text-[14px] font-semibold leading-snug text-ink sm:mt-3 sm:text-[16px] md:text-[17px] lg:text-[18px]">
            {p.tagline}
          </p>
          <p className="mt-3 max-w-[62ch] text-[13px] font-medium leading-[1.65] text-ink/75 sm:mt-4 sm:text-[14.5px] sm:leading-[1.7] md:text-[16px] lg:text-[17px]">
            {p.intro}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2 md:mt-6">
            {p.standards.slice(0, 4).map((s) => (
              <span
                key={s}
                className="border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink sm:px-3 sm:py-1.5 sm:text-[12px] md:text-[13px]"
              >
                {s}
              </span>
            ))}
          </div>
          <ul className="mt-5 grid border border-line sm:mt-7 lg:grid-cols-3">
            {FACT_KEYS.map((key) => {
              const row = p.table.find(([label]) => label === key)
              if (!row) return null
              return (
                <li
                  key={key}
                  className="border-b border-line px-3.5 py-3 last:border-b-0 lg:border-b-0 lg:border-r lg:px-4 lg:py-4 lg:last:border-r-0"
                >
                  <div className={`text-[11px] font-bold uppercase tracking-[0.08em] sm:text-[12px] ${accent}`}>
                    {row[0]}
                  </div>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-ink sm:mt-1.5 sm:text-[14px] md:text-[15px]">
                    {row[1]}
                  </p>
                </li>
              )
            })}
          </ul>
          <div className="mt-5 sm:mt-7">
            <TechButton
              href="#contact"
              variant={isGold ? 'black' : 'red'}
              className="w-full min-h-[44px] px-5 text-[13px] sm:w-auto sm:min-h-[48px] sm:px-8 sm:text-[14px] md:text-[15px]"
              onClick={() => {
                try {
                  sessionStorage.setItem('purelube-inquire-product', p.name)
                  sessionStorage.setItem('purelube-inquire-type', 'Product Inquiry')
                } catch {
                  /* ignore private-mode storage */
                }
              }}
            >
              Inquire About This Grade
            </TechButton>
          </div>
        </div>
      </div>

      <section className="border-t border-line bg-panel/60">
        <div className="wrap py-8 sm:py-10 md:py-12 lg:py-14">
          <h2 className="text-[20px] font-bold uppercase leading-none text-ink sm:text-[24px] md:text-[28px] lg:text-[32px]">
            Specifications
          </h2>
          <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
            {p.specs.map((s) => (
              <div key={s.label} className="bg-white px-4 py-4 sm:px-5 sm:py-5">
                <div className={`text-[11px] font-bold uppercase tracking-[0.08em] sm:text-[12px] ${accent}`}>
                  {s.label}
                </div>
                <div className="mt-1.5 text-[clamp(1.25rem,3vw,1.875rem)] font-bold leading-none text-ink">
                  {s.value}
                </div>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-ink/70 sm:mt-3 sm:text-[14px] md:text-[15px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-8 sm:py-12 md:py-16 lg:py-20">
        <h2 className="text-[20px] font-bold uppercase leading-none text-ink sm:text-[24px] md:text-[28px] lg:text-[30px]">
          Features & Benefits
        </h2>
        <ol className="mt-5 grid sm:mt-6 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
          {p.features.map((f, i) => (
            <li
              key={f}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-2.5 border-b border-line py-3 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-3 sm:py-3.5 md:py-4"
            >
              <span className={`pt-0.5 text-[12px] font-bold tabular-nums sm:text-[13px] ${accent}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 text-[13.5px] font-semibold leading-[1.45] text-ink sm:text-[15px] md:text-[16px]">
                {f}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 sm:mt-12 md:mt-14 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold uppercase leading-none text-ink sm:text-[24px] md:text-[28px] lg:text-[30px]">
              Performance Standards
            </h2>
            <p className="mt-3 max-w-[48ch] text-[13px] font-medium leading-relaxed text-ink/70 sm:mt-4 sm:text-[14px] md:text-[15px]">
              {p.name} meets or exceeds the following specifications:
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
              {p.standards.map((s) => (
                <li
                  key={s}
                  className={`max-w-full px-2.5 py-1.5 text-[11px] font-bold leading-snug sm:px-3 sm:py-2 sm:text-[13px] ${accentBg}`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-[20px] font-bold uppercase leading-none text-ink sm:text-[24px] md:text-[28px] lg:text-[30px]">
              Spec sheet
            </h2>
            <dl className="mt-4 border-t border-line sm:mt-5">
              {p.table.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[minmax(5.75rem,7.25rem)_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-2.5 sm:grid-cols-[minmax(7.5rem,10rem)_minmax(0,1fr)] sm:gap-6 sm:py-3"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted sm:text-[12px]">
                    {k}
                  </dt>
                  <dd className="min-w-0 text-[13.5px] font-semibold leading-snug text-ink sm:text-[15px] md:text-[16px]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </article>
  )
}
