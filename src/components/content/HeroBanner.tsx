import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Play, Star } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { featuredItems } from "@/data/mockContent";
import { GenreChip } from "@/components/common/GenreChip";
import { PageContainer } from "@/components/layout/PageContainer";

const SLIDE_DURATION = 8000;

export const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const active = featuredItems[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      return;
    }

    startTimeRef.current = Date.now() - progress * SLIDE_DURATION / 100;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActiveIndex((current) => (current + 1) % featuredItems.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
      progressRef.current = requestAnimationFrame(tick);
    };

    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [paused, activeIndex]);

  const href = active.type === "movie" ? `/movie/${active.slug}` : `/series/${active.slug}`;

  // Keyboard navigation for hero slides
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") goTo((activeIndex + 1) % featuredItems.length);
      if (e.key === "ArrowLeft") goTo((activeIndex - 1 + featuredItems.length) % featuredItems.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex]);

  return (
    <section
      className="relative min-h-[90vh] overflow-hidden pt-[72px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={active.heroImage}
            alt={active.heroAlt}
            className="h-full w-full object-cover object-top"
          />
          {/* Multi-layer cinematic overlay */}
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <PageContainer className="relative flex min-h-[90vh] items-end pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${active.id}`}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl space-y-5"
          >
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/60 bg-primary/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur-sm">
                {active.tags[0]}
              </span>
              {active.tags[1] && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
                  {active.tags[1]}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-medium uppercase leading-[1.05] tracking-[0.06em] text-foreground drop-shadow-lg md:text-6xl lg:text-7xl">
              {active.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-200">
              <span className="flex items-center gap-1">
                <Star size={14} weight="fill" className="text-warning" />
                {active.rating}
              </span>
              <span className="text-gray-500">·</span>
              <span>{active.year}</span>
              <span className="text-gray-500">·</span>
              <span>{active.duration}</span>
              <span className="text-gray-500">·</span>
              <span>{active.country}</span>
            </div>

            {/* Description */}
            <p className="max-w-xl text-base leading-relaxed text-gray-200 md:text-lg">
              {active.description}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {active.genres.map((genre) => (
                <GenreChip key={genre} label={genre} />
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={`/watch/${active.id}`}
                className="inline-flex min-h-[52px] items-center gap-3 rounded-xl bg-gradient-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] hover:shadow-primary/30 hover:brightness-110"
              >
                <Play size={20} weight="fill" />
                Watch Now
              </Link>
              <Link
                to={href}
                className="inline-flex min-h-[52px] items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20"
              >
                <Info size={20} weight="duotone" />
                More Info
              </Link>
            </div>

            {/* Slide indicators with progress */}
            <div className="flex items-center gap-3 pt-4">
              {featuredItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}: ${item.title}`}
                  onClick={() => goTo(index)}
                  className="group relative h-1 rounded-full bg-white/20 transition-all"
                  style={{ width: index === activeIndex ? 56 : 20 }}
                >
                  {index === activeIndex && (
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  {index !== activeIndex && (
                    <span className="absolute inset-0 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors" />
                  )}
                </button>
              ))}
              <span className="ml-2 text-xs text-white/50">
                {activeIndex + 1} / {featuredItems.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </PageContainer>
    </section>
  );
};
