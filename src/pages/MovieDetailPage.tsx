import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookmarkSimple, Play, Star, VideoCamera } from "@phosphor-icons/react";
import { PageContainer } from "@/components/layout/PageContainer";
import { contentItems, recommendations } from "@/data/mockContent";
import { GenreChip } from "@/components/common/GenreChip";
import { SynopsisSection } from "@/components/details/SynopsisSection";
import { CastGrid } from "@/components/details/CastGrid";
import { ContentCarousel } from "@/components/content/ContentCarousel";
import { PosterCard } from "@/components/content/PosterCard";
import { TrailerModal } from "@/components/common/TrailerModal";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

type MovieDetailPageProps = {
  myList: string[];
  onToggleList: (id: string) => void;
};

export const MovieDetailPage = ({ myList, onToggleList }: MovieDetailPageProps) => {
  const { slug } = useParams();
  const item = useMemo(
    () => contentItems.find((entry) => entry.slug === slug && entry.type === "movie") ?? contentItems[0],
    [slug],
  );
  const [trailerOpen, setTrailerOpen] = useState(false);
  const inList = myList.includes(item.id);

  useDocumentMeta(`${item.title} | streamXie`, item.description);

  return (
    <>
      {/* Hero backdrop */}
      <section className="relative min-h-[75vh] overflow-hidden pt-[72px]">
        <motion.img
          key={item.id}
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={item.backdropImage}
          alt={item.heroAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        <PageContainer className="relative flex min-h-[75vh] items-end py-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8"
          >
            {/* Poster */}
            <div className="hidden md:block w-44 shrink-0">
              <img
                src={item.posterImage}
                alt={item.posterAlt}
                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            </div>

            {/* Info */}
            <div className="max-w-2xl space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-medium uppercase tracking-[0.08em] text-foreground md:text-5xl lg:text-6xl">
                {item.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
                <span className="flex items-center gap-1">
                  <Star size={13} weight="fill" className="text-warning" />
                  {item.rating}
                </span>
                <span className="text-gray-500">·</span>
                <span>{item.year}</span>
                <span className="text-gray-500">·</span>
                <span>{item.duration}</span>
                <span className="text-gray-500">·</span>
                <span>{item.country}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <GenreChip key={genre} label={genre} />
                ))}
              </div>

              <p className="max-w-xl text-base leading-relaxed text-gray-200 md:text-lg">
                {item.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to={`/watch/${item.id}`}
                  className="inline-flex min-h-[52px] items-center gap-3 rounded-xl bg-gradient-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] hover:brightness-110"
                >
                  <Play size={20} weight="fill" />
                  Watch Now
                </Link>
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex min-h-[52px] items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20"
                >
                  <VideoCamera size={20} weight="duotone" />
                  Trailer
                </button>
                <button
                  type="button"
                  onClick={() => onToggleList(item.id)}
                  className={`inline-flex min-h-[52px] items-center gap-3 rounded-xl border px-6 py-3 text-base font-medium transition-all ${inList ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-foreground hover:border-primary hover:text-primary"}`}
                >
                  <BookmarkSimple size={20} weight={inList ? "fill" : "bold"} />
                  {inList ? "Saved" : "Add to List"}
                </button>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      <PageContainer className="py-8 md:py-12">
        <SynopsisSection text={item.longDescription} />
        <CastGrid cast={item.cast} />
        <ContentCarousel title="Related Content" subtitle="Similar titles chosen for tone, scale, and audience overlap.">
          {recommendations.map((related, index) => (
            <div key={`${related.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={related} inList={myList.includes(related.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>
      </PageContainer>

      <TrailerModal
        open={trailerOpen}
        title={item.title}
        trailerUrl={item.trailerUrl}
        onClose={() => setTrailerOpen(false)}
      />
    </>
  );
};
