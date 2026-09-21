import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Chevrons from "./ui/Chevrons";
import Logo from "./ui/Logo";
import TechButton from "./ui/TechButton";
import { COMPANY } from "../data/company";

const STATS = [
  {
    value: 4,
    suffix: "",
    label: "Continents",
    sub: "Europe · Asia · Africa · Americas",
  },
  {
    value: 4,
    suffix: "",
    label: "Core Values",
    sub: "Integrity · Responsibility · Quality · Service",
  },
  {
    value: 2,
    suffix: "",
    label: "Platinum Grades",
    sub: "10W-40 SN · 5W-40 SP/CK-4",
  },
  {
    value: 100,
    suffix: "%",
    label: "Made in Germany",
    sub: "Fully synthetic formulation",
  },
];

type Continent = (typeof COMPANY.continents)[number];

const NODES: { x: number; y: number; continent: Continent; main?: boolean }[] =
  [
    { x: 49.6, y: 37, continent: "Europe", main: true },
    { x: 22, y: 42, continent: "Americas" },
    { x: 33, y: 66, continent: "Americas" },
    { x: 57, y: 63, continent: "Africa" },
    { x: 76.5, y: 42, continent: "Asia" },
    { x: 73, y: 57.5, continent: "Asia" },
  ];

const CONTINENTS: { name: Continent; note: string }[] = [
  { name: "Europe", note: "Headquarters · Frankfurt & Leuna, Germany" },
  { name: "Asia", note: "Regional distribution & dealer network" },
  { name: "Africa", note: "Regional distribution & dealer network" },
  { name: "Americas", note: "Regional distribution & dealer network" },
];

const valueIcons = [
  "M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z",
  "M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v5l4 2",
  "M12 2l2.4 7.2H22l-6 4.4 2.3 7.2L12 16.8 5.7 20.8 8 13.6 2 9.2h7.6z",
  "M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.7 0-8 1.3-8 4v2h10v-2c0-1.2.6-2.2 1.6-3C10.2 13.4 9.1 13 8 13zm8 0c-.4 0-.7 0-1.1.1 1.3.8 2.1 1.9 2.1 3.4V19h7v-2c0-2.7-5.3-4-8-4z",
];

const TABS = [
  { id: "global", n: "01", label: "Global Presence", short: "Global" },
  { id: "vision", n: "02", label: "Vision", short: "Vision" },
  { id: "mission", n: "03", label: "Mission", short: "Mission" },
  { id: "values", n: "04", label: "Core Values", short: "Values" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const AUTOPLAY_MS = 8000;
const ease = [0.22, 1, 0.36, 1] as const;

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, value, {
      duration: 2.4,
      ease,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {String(n).padStart(2, "0")}
      {suffix}
    </span>
  );
}

function MediaFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full clip-hud bg-white p-[6px] shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
      <div className="relative clip-hud overflow-hidden bg-ink aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[420px]">
        {children}
      </div>
    </div>
  );
}

function GlobalPanel() {
  const [hot, setHot] = useState<Continent>("Europe");
  return (
    <>
      <MediaFrame>
        <img
          src="/img/profile-worldmap.png"
          alt="PureLube global network across four continents"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {NODES.map((n, i) => {
          const on = n.continent === hot;
          return (
            <button
              key={i}
              type="button"
              aria-label={n.continent}
              onMouseEnter={() => setHot(n.continent)}
              onFocus={() => setHot(n.continent)}
              onClick={() => setHot(n.continent)}
              className="absolute -translate-x-1/2 -translate-y-1/2 touch-manipulation"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span
                className={`absolute inset-0 m-auto rounded-full bg-brand/55 ${on ? "animate-ping" : ""} ${
                  n.main ? "h-6 w-6" : "h-3.5 w-3.5"
                }`}
              />
              <span
                className={`relative block rounded-full bg-brand shadow-[0_0_14px_rgba(238,28,46,0.9)] transition-transform ${
                  n.main ? "h-3 w-3" : "h-1.5 w-1.5"
                } ${on ? "scale-125" : ""}`}
              />
            </button>
          );
        })}
        <motion.div
          key={hot}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-3 top-3 clip-diag-5 bg-brand px-2.5 py-1 text-tech text-[9px] font-bold text-white shadow-lg"
        >
          {hot === "Europe" ? "HQ · Germany" : hot}
        </motion.div>
        <div className="absolute bottom-3 left-3 hidden sm:block text-tech-sm text-[8px] text-white/55">
          Tap a node · Frankfurt → four continents
        </div>
      </MediaFrame>

      <div className="flex min-w-0 flex-col justify-center lg:py-2">
        <div className="text-tech text-[12px] font-semibold text-brand">
          Global Presence
        </div>
        <h3 className="mt-2 font-display text-[22px] sm:text-[32px] md:text-[36px] font-bold uppercase leading-[0.98] text-ink">
          Four Continents.
          <br />
          One German Standard.
        </h3>
        <p className="mt-4 text-tech-sm text-[10.5px] sm:text-[11px] leading-relaxed text-muted">
          {COMPANY.about}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:col-span-2 lg:grid-cols-4 lg:gap-4">
        {CONTINENTS.map((c, i) => {
          const on = c.name === hot
          return (
            <motion.li
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <button
                type="button"
                onMouseEnter={() => setHot(c.name)}
                onFocus={() => setHot(c.name)}
                onClick={() => setHot(c.name)}
                className={`group flex w-full min-h-[64px] items-center gap-3 clip-diag-8 px-3 py-3 text-left border transition-colors touch-manipulation sm:min-h-[72px] sm:px-4 sm:py-3.5 ${
                  on ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-line/60 hover:border-brand/40'
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center clip-diag-5 text-tech text-[11px] font-bold ${
                    on ? 'bg-brand text-white' : 'bg-ink text-white group-hover:bg-brand'
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-tech text-[12px] font-bold">{c.name}</span>
                  <span className={`block text-tech-sm text-[8.5px] leading-snug ${on ? 'text-white/65' : 'text-muted'}`}>
                    {c.note}
                  </span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </>
  )
}

type StoryProps = {
  n: string;
  title: string;
  img: string;
  alt: string;
  lead: string;
  body: string;
  extra?: string;
  quote?: boolean;
  points: string[];
};

function StoryPanel({
  n,
  title,
  img,
  alt,
  lead,
  body,
  extra,
  quote,
  points,
}: StoryProps) {
  return (
    <>
      <MediaFrame>
        <motion.img
          src={img}
          alt={alt}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <span className="pointer-events-none absolute right-3 top-0 select-none font-display text-[84px] font-bold leading-none text-white/[0.08]">
          {n}
        </span>
        <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center clip-diag-6 bg-brand text-tech text-[10px] font-bold text-white">
            {n}
          </span>
          <span className="font-display text-[20px] sm:text-[22px] font-bold uppercase leading-none text-white">
            {title}
          </span>
        </div>
      </MediaFrame>

      <div className="flex min-w-0 flex-col justify-center lg:py-2">
        <div className="text-tech text-[12px] font-semibold text-brand">Our {title}</div>
        <h3
          className={`mt-2 font-display font-bold leading-[1.05] ${
            quote ? 'italic text-[20px] sm:text-[32px] text-brand' : 'uppercase text-[20px] sm:text-[32px] text-ink'
          }`}
        >
          {lead}
        </h3>
        <span className="mt-4 block h-px w-full bg-line relative">
          <span className="absolute left-0 -top-[1px] h-[3px] w-12 bg-brand" />
        </span>
        <p className="mt-4 text-tech-sm text-[10.5px] sm:text-[11px] leading-relaxed text-muted">{body}</p>
        {extra && <p className="mt-3 hidden sm:block text-tech-sm text-[10px] leading-relaxed text-ink/60">{extra}</p>}
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:col-span-2 lg:grid-cols-4 lg:gap-4">
        {points.map((p, i) => (
          <motion.li
            key={p}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.05 }}
            whileHover={{ y: -2 }}
            className="flex min-h-[48px] items-center gap-2.5 clip-diag-6 bg-white border border-line/60 px-3 py-3 hover:border-brand/40 sm:min-h-[56px] sm:px-4"
          >
            <span className="block h-[7px] w-[7px] shrink-0 bg-brand" style={{ transform: 'skewX(-20deg)' }} />
            <span className="text-tech text-[10.5px] font-semibold text-ink leading-tight">{p}</span>
          </motion.li>
        ))}
      </ul>
    </>
  )
}

function ValuesPanel() {
  const [active, setActive] = useState(0);
  const v = COMPANY.values[active];
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:gap-4 lg:min-h-[420px]">
        {COMPANY.values.map((item, i) => {
          const on = i === active
          return (
            <motion.button
              key={item.title}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              whileTap={{ scale: 0.98 }}
              aria-pressed={on}
              className={`relative flex min-h-[108px] sm:min-h-[160px] lg:min-h-0 flex-col justify-between overflow-hidden clip-diag-8 sm:clip-diag-10 p-3.5 sm:p-5 text-left transition-colors touch-manipulation ${
                on ? 'bg-brand text-white' : 'bg-ink hatch-dark text-white/80 hover:bg-ink-2'
              }`}
            >
              <span
                className={`pointer-events-none absolute -right-1 -bottom-2 select-none font-display text-[52px] sm:text-[64px] font-bold leading-none ${
                  on ? "text-white/15" : "text-white/[0.06]"
                }`}
              >
                0{i + 1}
              </span>
              <span
                className={`grid h-8 w-8 place-items-center clip-diag-5 ${on ? "bg-white/20" : "bg-white/[0.07]"}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 ${on ? "text-white" : "text-brand"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={valueIcons[i]} />
                </svg>
              </span>
              <span className="relative font-display text-[12px] sm:text-[14px] font-bold uppercase leading-tight">
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex min-w-0 flex-col justify-center lg:py-2">
        <div className="text-tech text-[12px] font-semibold text-brand">
          What Drives Us
        </div>
        <h3 className="mt-2 font-display text-[22px] sm:text-[32px] md:text-[36px] font-bold uppercase leading-[0.98] text-ink">
          Our Core Values
        </h3>
        <p className="mt-4 text-tech-sm text-[10.5px] sm:text-[11px] leading-relaxed text-muted">
          {COMPANY.valuesIntro}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 clip-diag-8 sm:clip-diag-12 bg-ink hatch-dark p-4 sm:p-6 text-white"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-tech text-[10px] font-bold text-brand">
                Value 0{active + 1} / 04
              </div>
              <Chevrons count={3} color="bg-white/50" dir="left" />
            </div>
            <h4 className="mt-1.5 font-display text-[18px] font-bold uppercase leading-tight">
              {v.title}
            </h4>
            <p className="mt-1.5 text-tech-sm text-[9.5px] leading-relaxed text-white/70">
              {v.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default function Profile() {
  const office = COMPANY.office;
  const [tab, setTab] = useState<TabId>("global");
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const explorerRef = useRef<HTMLDivElement>(null);
  const explorerInView = useInView(explorerRef, { amount: 0.35 });

  useEffect(() => {
    if (paused || !explorerInView) return;
    const t = setTimeout(() => {
      setTab(
        (cur) =>
          TABS[(TABS.findIndex((x) => x.id === cur) + 1) % TABS.length].id,
      );
      setCycle((c) => c + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [tab, paused, explorerInView, cycle]);

  const select = (id: TabId) => {
    setTab(id);
    setCycle((c) => c + 1);
  };
  const idx = TABS.findIndex((x) => x.id === tab);
  const step = (dir: -1 | 1) =>
    select(TABS[(idx + dir + TABS.length) % TABS.length].id);

  return (
    <section id="profile" className="relative wrap overflow-x-clip scroll-mt-24 pt-8 md:pt-12 pb-10 md:pb-16">
      <SectionHeader
        title={["Company", "Profile"]}
        label="PureLube Lubricant GmbH"
      />

      {/* Journey banner — live factory film */}
      <Reveal className="mt-6">
        <div className="relative overflow-hidden clip-diag-10 sm:clip-diag-16 lg:clip-diag-20 bg-ink text-white">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            src="/video/purelube-factory.mp4"
            poster="/video/purelube-factory-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/25" />
          <div className="absolute inset-0 hatch-dark opacity-40" />
          <span className="pointer-events-none absolute -right-2 -bottom-6 select-none font-display font-bold uppercase leading-none text-white/[0.04] text-[100px] sm:text-[150px] lg:text-[200px]">
            Germany
          </span>
          <Chevrons
            className="absolute right-6 top-6"
            count={3}
            color="bg-white/70"
            dir="left"
          />

          <div className="relative grid gap-5 px-4 py-7 sm:gap-6 sm:px-9 sm:py-10 md:px-12 md:py-12 lg:grid-cols-[1.3fr_1fr] lg:items-stretch lg:gap-10 lg:min-h-[420px]">
            <div className="max-w-[680px] flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <span
                  className="block h-[3px] w-8 sm:w-10 bg-brand"
                  style={{ transform: "skewX(-28deg)" }}
                />
                <span className="text-tech text-[10px] sm:text-[12px] font-semibold text-brand">
                  Our Journey · Since Frankfurt
                </span>
              </div>
              <h3 className="mt-3 sm:mt-4 font-display text-[26px] sm:text-[42px] md:text-[50px] font-bold uppercase leading-[0.95]">
                Engineered in Germany.
                <br />
                <span className="text-white/60">Trusted on</span>{" "}
                <span className="text-brand">Four Continents.</span>
              </h3>
              <p className="mt-4 sm:mt-5 max-w-[560px] text-tech-sm text-[10.5px] sm:text-[12px] leading-relaxed text-white/75">
                {COMPANY.journey}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap sm:gap-2.5">
                {COMPANY.continents.map((c, i) => (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => select("global")}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    whileHover={{ y: -2 }}
                    className="inline-flex min-h-[40px] items-center justify-center gap-2 clip-diag-6 border border-white/15 bg-white/[0.06] px-3 py-2 text-tech text-[10.5px] font-semibold text-white/85 backdrop-blur-sm hover:border-brand/60 hover:bg-brand/20 sm:justify-start sm:px-3.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(238,28,46,0.9)]" />
                    {c}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/10 clip-diag-8 sm:clip-diag-10 min-h-[200px] sm:min-h-[260px] lg:min-h-0">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }}
                  whileHover={{ backgroundColor: "rgba(238,28,46,0.2)" }}
                  className="relative flex flex-col justify-center bg-ink/80 px-3 py-4 sm:px-6 sm:py-6 backdrop-blur-sm"
                >
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-brand" />
                  <div className="font-display text-[30px] sm:text-[44px] font-bold leading-none tabular-nums">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1.5 text-tech text-[11px] sm:text-[12px] font-bold text-white">
                    {s.label}
                  </div>
                  <div className="mt-1 hidden md:block text-tech-sm text-[9px] text-white/50">
                    {s.sub}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Interactive explorer */}
      <Reveal delay={0.05} className="mt-4">
        <div
          ref={explorerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="relative clip-diag-8 sm:clip-diag-16 bg-panel hatch border border-line/60"
        >
          <div
            role="tablist"
            aria-label="Company profile"
            className="grid grid-cols-4 border-b border-line/70"
          >
            {TABS.map((t) => {
              const on = t.id === tab;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(t.id)}
                  className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-tech text-[10px] font-semibold transition-colors touch-manipulation sm:min-h-[48px] sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[11px] ${
                    on ? "text-ink bg-white/70" : "text-muted hover:text-ink"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 sm:h-6 sm:w-6 place-items-center clip-diag-4 text-[8px] sm:text-[9px] font-bold ${on ? "bg-brand text-white" : "bg-ink/10 text-ink"}`}
                  >
                    {t.n}
                  </span>
                  <span className="hidden md:inline">{t.label}</span>
                  <span className="md:hidden">{t.short}</span>
                  {on && (
                    <>
                      <motion.span
                        layoutId="tab-active"
                        className="absolute inset-x-0 bottom-0 h-[3px] bg-brand/20"
                      />
                      <motion.span
                        key={`${t.id}-${cycle}`}
                        className="absolute left-0 bottom-0 h-[3px] w-full origin-left bg-brand"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused || !explorerInView ? 0 : 1 }}
                        transition={{
                          duration: paused ? 0.2 : AUTOPLAY_MS / 1000,
                          ease: "linear",
                        }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden p-4 sm:p-7 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.35, ease }}
                drag="x"
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) step(1)
                  if (info.offset.x > 50) step(-1)
                }}
                className="grid cursor-grab gap-5 touch-pan-y active:cursor-grabbing sm:gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-stretch lg:gap-10"
              >
                {tab === "global" && <GlobalPanel />}
                {tab === "vision" && (
                  <StoryPanel
                    n="02"
                    title="Vision"
                    img="/img/profile-vision.png"
                    alt="PureLube laboratory quality testing"
                    lead="Preferred supplier for customers worldwide."
                    body={COMPANY.vision}
                    extra={COMPANY.growth}
                    points={[
                      "Integrated Organization",
                      "Advanced Technology",
                      "High-Value Products",
                      "Sustainable Growth",
                    ]}
                  />
                )}
                {tab === "mission" && (
                  <StoryPanel
                    n="03"
                    title="Mission"
                    img="/img/profile-mission.png"
                    alt="PureLube partnership handshake"
                    lead="“Together We Conquer”"
                    body={COMPANY.mission}
                    quote
                    points={[
                      "Exceptional Service",
                      "Strong Partnerships",
                      "Mutual Success",
                      "Global Vision",
                    ]}
                  />
                )}
                {tab === "values" && <ValuesPanel />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
              <button
                type="button"
                onClick={() => step(-1)}
                className="inline-flex items-center gap-2 min-h-[40px] text-tech text-[10px] font-semibold text-muted hover:text-brand"
              >
                <Chevrons count={2} color="bg-current" dir="right" />
                Prev
              </button>
              <div className="flex gap-1.5">
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={t.label}
                    onClick={() => select(t.id)}
                    className={`h-[3px] transition-all ${i === idx ? "w-8 bg-brand" : "w-4 bg-ink/15 hover:bg-ink/40"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex items-center gap-2 min-h-[40px] text-tech text-[10px] font-semibold text-muted hover:text-brand"
              >
                Next
                <Chevrons count={2} color="bg-current" dir="left" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-4">
        <div className="relative overflow-hidden clip-diag-8 sm:clip-diag-12 bg-white border border-line shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
          <div className="absolute left-0 top-0 h-full w-[5px]">
            <span className="block h-1/3 bg-ink" />
            <span className="block h-1/3 bg-brand" />
            <span className="block h-1/3 bg-gold" />
          </div>
          <div className="grid gap-4 px-4 py-4 sm:px-7 sm:py-5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-5">
            <div className="hidden md:block">
              <Logo variant="compact" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-tech text-[10px] font-bold text-brand">
                  International Office
                </span>
                <span className="clip-diag-4 bg-ink px-2 py-0.5 text-tech text-[8px] font-bold text-white">
                  Made in Germany
                </span>
              </div>
              <div className="mt-0.5 font-display text-[15px] sm:text-[18px] font-bold uppercase text-ink">
                {office.company}
              </div>
              <p className="text-tech-sm text-[9px] text-muted">
                {office.line1} · {office.line2}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:justify-center sm:gap-2.5">
              <TechButton
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                variant="black"
                className="w-full sm:flex-1 md:flex-none md:w-auto px-3 sm:px-5 whitespace-nowrap"
              >
                {office.phone}
              </TechButton>
              <TechButton
                href={`mailto:${office.email}`}
                variant="red"
                className="w-full sm:flex-1 md:flex-none md:w-auto px-3 sm:px-5"
              >
                Email Us
              </TechButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
