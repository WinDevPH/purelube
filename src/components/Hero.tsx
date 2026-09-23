import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MouseEvent, TouchEvent } from "react";
import TechButton from "./ui/TechButton";
import Chevrons from "./ui/Chevrons";
import { LetterReveal, EASE } from "./ui/Reveal";
import { PRODUCTS } from "../data/content";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease: EASE },
});

const AUTO_MS = 5500;

function Rating({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  const av = compact ? "h-7 w-7" : "h-9 w-9";
  return (
    <div className={`relative flex items-center ${compact ? "gap-1.5" : "gap-2.5"}`}>
      <div className="flex -space-x-2">
        {[1, 2, 3].map((n) => (
          <img
            key={n}
            src={`/img/avatar-${n}.png`}
            alt=""
            className={`${av} rounded-full border-2 border-white object-cover transition-transform duration-500 hover:scale-110 hover:z-10`}
            loading="lazy"
            draggable={false}
          />
        ))}
        <span
          className={`grid ${av} place-items-center rounded-full border-2 border-white bg-ink font-bold text-white ${
            compact ? "text-[9px]" : "text-[11px]"
          }`}
        >
          5k+
        </span>
      </div>
      <div className="leading-none">
        <div className={`font-bold text-brand ${compact ? "text-[15px]" : "text-[18px]"}`}>
          4.9/5
        </div>
        <div
          className={`mt-0.5 font-semibold uppercase tracking-[0.06em] text-ink ${
            compact ? "text-[10px]" : "text-[12px]"
          }`}
        >
          {label}
        </div>
      </div>
      {!compact && (
        <>
          <span className="pointer-events-none absolute -bottom-3 left-0 right-6 h-px bg-line" />
          <span className="pointer-events-none absolute -bottom-3 right-6 h-3 w-px bg-line" />
        </>
      )}
    </div>
  );
}

function EyebrowChips({
  text,
  size = "md",
}: {
  text: string;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {text.split(" · ").map((part, i) => (
        <span
          key={part}
          className={`clip-diag-4 text-tech font-bold uppercase leading-none tracking-[0.08em] ${
            size === "md"
              ? "px-2.5 py-1.5 text-[12px] xl:text-[13px]"
              : "px-2 py-1 text-[9.5px] sm:text-[11px]"
          } ${
            i === 0
              ? "bg-ink text-white"
              : "bg-panel hatch text-ink shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
          }`}
        >
          {part}
        </span>
      ))}
    </div>
  );
}

function Callout({
  title,
  desc,
  className = "",
  compact = false,
}: {
  title: string;
  desc: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`clip-tr-12 sm:clip-tr-16 bg-panel hatch shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)] transition-transform duration-500 hover:-translate-y-1 ${
        compact ? "p-2.5 sm:p-3" : "p-3 sm:p-3.5"
      } ${className}`}
    >
      <h3
        className={`font-bold uppercase leading-tight tracking-[0.04em] text-ink ${
          compact ? "text-[12px] sm:text-[14px]" : "text-[14px] sm:text-[15px]"
        }`}
      >
        {title}
      </h3>
      <p
        className={`font-medium leading-snug text-ink/75 ${
          compact
            ? "mt-1 line-clamp-3 text-[11px] sm:text-[13px]"
            : "mt-1.5 text-[13px] sm:text-[14px]"
        }`}
      >
        {desc}
      </p>
    </div>
  );
}

function PriceCard({
  grade,
  blurb,
  className = "",
}: {
  grade: string;
  blurb: string;
  className?: string;
}) {
  return (
    <div
      className={`relative transition-transform duration-500 hover:-translate-y-1 ${className}`}
    >
      <span className="absolute -top-3 left-3 z-10 clip-diag-6 bg-white px-3.5 py-1 text-[12px] font-bold uppercase tracking-[0.06em] shadow-sm">
        SAE Grade
      </span>
      <div className="clip-br-16 bg-ink hatch-dark px-4 pb-3.5 pt-5 text-white">
        <div className="text-[26px] font-bold leading-none text-brand sm:text-[30px]">
          {grade}
        </div>
        <p className="mt-1.5 text-[13px] font-medium leading-snug text-white/80 sm:text-[14px]">
          {blurb}
        </p>
      </div>
    </div>
  );
}

function ProductDots({
  index,
  onSelect,
  className = "",
}: {
  index: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {PRODUCTS.map((prod, i) => (
        <button
          key={prod.id}
          type="button"
          aria-label={`Show ${prod.shortName}`}
          onClick={() => onSelect(i)}
          className="grid h-11 min-w-11 place-items-center touch-manipulation"
        >
          <span
            className={`h-[3px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === index ? "w-8 bg-brand" : "w-5 bg-ink/20 hover:bg-ink/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const p = PRODUCTS[index];

  const onStageTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchX.current = e.changedTouches[0].clientX;
    setPaused(true);
  };
  const onStageTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchX.current;
    touchX.current = null;
    window.setTimeout(() => setPaused(false), 1400);
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 48) return;
    setIndex((v) =>
      dx < 0
        ? (v + 1) % PRODUCTS.length
        : (v - 1 + PRODUCTS.length) % PRODUCTS.length,
    );
  };

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setIndex((v) => (v + 1) % PRODUCTS.length);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-6, 6]);
  const rotateX = useTransform(sy, [-1, 1], [4, -4]);
  const tx = useTransform(sx, [-1, 1], [-10, 10]);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-x-clip overflow-hidden wrap mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-6 pb-6 md:pb-8"
      onMouseMove={onMove}
      onMouseLeave={() => {
        onLeave();
        setPaused(false);
      }}
      onMouseEnter={() => setPaused(true)}
    >
      {/* ===== Desktop ===== */}
      <div className="relative hidden lg:block aspect-[15/8] w-full">
        <div className="absolute left-0 top-0 max-w-[52%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id + "-copy"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <EyebrowChips text={p.eyebrow} size="md" />
              <h1 className="mt-3 text-[44px] font-bold uppercase leading-[0.96] tracking-[0.005em] text-ink xl:text-[54px]">
                <LetterReveal
                  text={p.headline[0]}
                  delay={0.05}
                  stagger={0.035}
                />
                <br />
                <LetterReveal
                  text={p.headline[1]}
                  delay={0.28}
                  stagger={0.035}
                />
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-0 top-[1%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.ratingLabel}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Rating label={p.ratingLabel} />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          className="absolute -right-[3%] left-0 top-[28%] bottom-[2%] z-0 origin-left bg-panel-2/70 hatch"
          style={{
            clipPath:
              "polygon(0 12%, 58% 12%, 64% 0, 100% 0, 100% 100%, 66% 100%, 60% 88%, 30% 88%, 26% 100%, 0 100%)",
          }}
        />

        <div
          className="absolute left-[48%] top-[4%] z-10 flex h-[80%] w-[56%] -translate-x-1/2 items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <motion.div className="flex h-full w-full items-center justify-center" style={{ rotateX, rotateY, x: tx }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={p.heroImage}
                src={p.heroImage}
                alt={p.imageAlt}
                className="max-h-full max-w-full object-contain"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -16 }}
                transition={{ duration: 0.85, ease: EASE }}
                drag={false}
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.id + "-l"}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute left-[1%] top-[40%] w-[23%]"
          >
            <Callout title={p.callouts[0].title} desc={p.callouts[0].desc} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute left-[24%] top-[36%] h-[12%] w-[16%] border-b border-r border-line" />
        <span className="pointer-events-none absolute left-[39.6%] top-[35.3%] h-2 w-2 rounded-full border border-line bg-white" />

        <AnimatePresence mode="wait">
          <motion.div
            key={p.id + "-r"}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute left-[78%] top-[68%] z-20 w-[21%]"
          >
            <Callout title={p.callouts[1].title} desc={p.callouts[1].desc} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute left-[66%] top-[56%] z-20 h-[16%] w-[12%] border-b border-l border-line" />
        <span className="pointer-events-none absolute left-[65.6%] top-[55.3%] z-20 h-2 w-2 rounded-full border border-line bg-white" />

        <AnimatePresence mode="wait">
          <motion.div
            key={p.grade}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute bottom-[7%] left-0 w-[26%]"
          >
            <PriceCard
              grade={p.grade}
              blurb={`${p.name.split("Fully Synthetic ")[1] ?? p.shortName} · ${p.tagline}`}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          {...fade(0.9)}
          className="absolute bottom-[9%] left-1/2 z-20 flex -translate-x-1/2 items-center"
        >
          <ProductDots index={index} onSelect={setIndex} />
        </motion.div>

        <motion.div
          {...fade(0.95)}
          className="absolute bottom-[8%] right-[1%] z-20"
        >
          <TechButton href="#products" variant="red" className="px-10">
            Learn More
          </TechButton>
        </motion.div>

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/40">
          <div className="scroll-mouse">
            <span className="scroll-mouse-wheel" />
          </div>
        </div>

        <Chevrons
          className="absolute right-0 top-[48%]"
          count={3}
          color="bg-line"
          size="md"
          dir="left"
        />
      </div>

      {/* ===== Mobile ===== */}
      <div className="lg:hidden">
        <div className="flex items-start justify-between gap-2.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.eyebrow + "-eye"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="min-w-0 flex-1"
            >
              <EyebrowChips text={p.eyebrow} size="sm" />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={p.ratingLabel + "-m"}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="shrink-0"
            >
              <Rating compact label={p.ratingLabel} />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.h1
            key={p.id + "-mh"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-2.5 text-[34px] font-bold uppercase leading-[0.92] tracking-[0.005em] text-ink sm:text-[46px]"
          >
            <LetterReveal text={p.headline[0]} delay={0.05} stagger={0.03} />
            <br />
            <LetterReveal text={p.headline[1]} delay={0.22} stagger={0.03} />
          </motion.h1>
        </AnimatePresence>

        <div
          className="relative mt-4 touch-pan-y"
          onTouchStart={onStageTouchStart}
          onTouchEnd={onStageTouchEnd}
        >
          <div className="absolute inset-x-0 top-[8%] bottom-[2%] bg-panel-2/80 hatch clip-diag-14 sm:clip-diag-22" />
          <span className="pointer-events-none absolute left-0 top-[8%] z-20 h-3.5 w-3.5 border-l border-t border-ink/20" />
          <span className="pointer-events-none absolute right-0 top-[8%] z-20 h-3.5 w-3.5 border-r border-t border-ink/20" />
          <span className="pointer-events-none absolute bottom-[2%] left-0 z-20 h-3.5 w-3.5 border-b border-l border-ink/20" />
          <span className="pointer-events-none absolute bottom-[2%] right-0 z-20 h-3.5 w-3.5 border-b border-r border-ink/20" />

          <AnimatePresence mode="wait">
            <motion.span
              key={p.category}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute left-2 top-[12%] z-20 clip-diag-5 bg-brand px-2.5 py-1 text-tech text-[10px] font-bold text-white sm:left-3"
            >
              {p.category}
            </motion.span>
          </AnimatePresence>

          <div className="relative z-10 px-1 pb-7 pt-3 sm:px-6 sm:pb-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={p.heroImage + "-m"}
                src={p.heroImage}
                alt={p.imageAlt}
                className="relative mx-auto w-full object-contain"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.75, ease: EASE }}
                draggable={false}
              />
            </AnimatePresence>
          </div>

          <span className="absolute bottom-2 right-2 z-20 text-tech text-[10px] font-bold text-ink/35 sm:right-3">
            0{index + 1} / 0{PRODUCTS.length}
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-2.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={p.grade + "-chip"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="clip-diag-5 shrink-0 bg-ink px-2.5 py-1.5 text-[15px] font-bold leading-none text-brand sm:text-[17px]"
            >
              {p.grade}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={p.id + "-tag"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0 flex-1 text-[11px] font-semibold uppercase leading-snug tracking-[0.06em] text-ink/70 sm:text-[13px]"
            >
              {p.shortName} · {p.tagline}
            </motion.p>
          </AnimatePresence>
          <ProductDots className="shrink-0" index={index} onSelect={setIndex} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
          <Callout compact title={p.callouts[0].title} desc={p.callouts[0].desc} />
          <Callout compact title={p.callouts[1].title} desc={p.callouts[1].desc} />
        </div>

        <TechButton
          href="#products"
          variant="red"
          className="mt-4 w-full px-8"
        >
          Learn More
        </TechButton>
      </div>
    </section>
  );
}
