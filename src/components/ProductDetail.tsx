import { PRODUCTS } from '../data/content'

const FACT_KEYS = ['Type', 'Application', 'Origin']

const LINEUP_IMAGE: Record<string, string> = {
  '10w40': '/img/lineup-can.png',
  '5w40': '/img/bottle-cutout.png',
}

export default function ProductDetail({ id }: { id: string }) {
  const p = PRODUCTS.find((item) => item.id === id)
  const isGold = p?.id === '5w40'

  if (!p) {
    return (
      <section className="wrap py-24">
        <p className="text-[18px] font-medium text-ink">This product is not in the lineup.</p>
        <a href="#products" className="mt-6 inline-block text-[16px] font-bold text-brand">
          Back to products
        </a>
      </section>
    )
  }

  const accent = isGold ? 'text-gold' : 'text-brand'
  const accentBg = isGold ? 'bg-gold text-ink' : 'bg-brand text-white'

  return (
    <article className="bg-white pb-16 md:pb-24">
      <header className="border-b border-line">
        <div className="wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-4 text-[15px] font-semibold sm:text-[16px]">
          <a href="#products" className="text-muted transition-colors duration-300 hover:text-ink">
            Products
          </a>
          <span className="text-ink/30" aria-hidden>
            /
          </span>
          <span className="text-ink">{p.shortName}</span>
        </div>
      </header>

      <div className="wrap grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-16">
        <div className="grid place-items-center">
          <img
            src={LINEUP_IMAGE[p.id] ?? p.image}
            alt={p.imageAlt}
            className="h-auto max-h-[420px] w-full object-contain sm:max-h-[520px]"
            draggable={false}
          />
        </div>

        <div>
          <p className={`text-[14px] font-bold uppercase tracking-[0.12em] sm:text-[15px] ${accent}`}>
            {p.category}
            <span className="mx-2 text-ink/25">·</span>
            SAE {p.grade}
          </p>
          <h1 className="mt-3 text-[32px] font-bold uppercase leading-[0.98] text-ink sm:text-[42px] lg:text-[48px]">
            {p.name}
          </h1>
          <p className="mt-4 text-[18px] font-semibold leading-snug text-ink sm:text-[20px]">{p.tagline}</p>
          <p className="mt-4 max-w-[62ch] text-[16px] font-medium leading-[1.7] text-ink/75 sm:text-[17px]">
            {p.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.standards.slice(0, 4).map((s) => (
              <span key={s} className="border border-line bg-white px-3 py-1.5 text-[14px] font-semibold text-ink">
                {s}
              </span>
            ))}
          </div>
          <ul className="mt-8 grid border border-line sm:grid-cols-3">
            {FACT_KEYS.map((key) => {
              const row = p.table.find(([label]) => label === key)
              if (!row) return null
              return (
                <li
                  key={key}
                  className="border-b border-line px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <div className={`text-[13px] font-bold uppercase tracking-[0.08em] ${accent}`}>{row[0]}</div>
                  <p className="mt-1.5 text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">{row[1]}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <section className="border-t border-line bg-panel/60">
        <div className="wrap py-10 sm:py-14">
          <h2 className="text-[26px] font-bold uppercase leading-none text-ink sm:text-[32px]">Specifications</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {p.specs.map((s) => (
              <div key={s.label} className="bg-white px-5 py-5">
                <div className={`text-[13px] font-bold uppercase tracking-[0.08em] ${accent}`}>{s.label}</div>
                <div className="mt-2 text-[26px] font-bold leading-none text-ink sm:text-[30px]">{s.value}</div>
                <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-[26px] font-bold uppercase leading-none text-ink sm:text-[32px]">Features</h2>
          <ul className="mt-6 grid gap-3">
            {p.features.map((f, i) => (
              <li key={f} className="grid grid-cols-[2.5rem_1fr] items-start gap-2 border-b border-line py-3">
                <span className={`text-[15px] font-bold tabular-nums ${accent}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[26px] font-bold uppercase leading-none text-ink sm:text-[32px]">Standards</h2>
          <p className="mt-4 text-[16px] font-medium leading-relaxed text-ink/70">
            Certified specifications this grade meets or exceeds.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.standards.map((s) => (
              <li key={s} className={`px-3.5 py-2 text-[15px] font-bold ${accentBg}`}>
                {s}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-[26px] font-bold uppercase leading-none text-ink sm:text-[32px]">Spec sheet</h2>
          <dl className="mt-5">
            {p.table.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6">
                <dt className="text-[14px] font-bold uppercase tracking-[0.06em] text-muted">{k}</dt>
                <dd className="text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </article>
  )
}
