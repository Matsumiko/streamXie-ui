import {
  topTenToday,
  trendingNow,
  newReleases,
  animePicks,
  dramaSeries,
  moviesCollection,
  continueWatchingCollection,
  recommendations,
} from "@/data/mockContent";
import { HeroBanner } from "@/components/content/HeroBanner";
import { ContentCarousel } from "@/components/content/ContentCarousel";
import { PosterCard } from "@/components/content/PosterCard";
import { TopRankCard } from "@/components/content/TopRankCard";
import { LandscapeCard } from "@/components/content/LandscapeCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

type HomePageProps = {
  myList: string[];
  onToggleList: (id: string) => void;
  progressMap: Record<string, number>;
};

export const HomePage = ({
  myList,
  onToggleList,
  progressMap,
}: HomePageProps) => {
  useDocumentMeta(
    "streamXie - Nonton Film dan Series Streaming Download Movie",
    "Discover trending movies, anime, drama, and series with a cinematic dark experience.",
  );

  return (
    <>
      <HeroBanner />
      <PageContainer className="py-8 md:py-12">
        <ContentCarousel title="Trending Now" subtitle="High-velocity picks moving across the platform right now.">
          {trendingNow.map((item, index) => (
            <div key={`tr-${item.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={item} inList={myList.includes(item.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="New Releases" subtitle="Fresh arrivals with strong critical momentum.">
          {newReleases.map((item, index) => (
            <div key={`nr-${item.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={item} inList={myList.includes(item.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="Top 10 Today" subtitle="The titles viewers are watching most right now.">
          {topTenToday.map((item, index) => (
            <div key={`top-${item.id}-${index}`} className="shrink-0" style={{ scrollSnapAlign: "start" }}>
              <TopRankCard item={item} rank={index + 1} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="Anime Picks" subtitle="Large-scale fantasy and high-energy worlds worth starting next.">
          {animePicks.map((item, index) => (
            <div key={`anime-${item.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={item} inList={myList.includes(item.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="Drama Series" subtitle="Prestige drama with layered characters and long-form tension.">
          {dramaSeries.map((item, index) => (
            <div key={`drama-${item.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={item} inList={myList.includes(item.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="Movies" subtitle="Feature-length stories optimized for an evening watch.">
          {moviesCollection.map((item, index) => (
            <div key={`movies-${item.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={item} inList={myList.includes(item.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="Continue Watching" subtitle="Jump back into the stories you left in motion.">
          {continueWatchingCollection.map((item, index) => (
            <div key={`cw-${item.id}-${index}`} className="w-[300px] shrink-0 md:w-[400px]" style={{ scrollSnapAlign: "start" }}>
              <LandscapeCard item={item} progress={progressMap[item.id] ?? 35} />
            </div>
          ))}
        </ContentCarousel>

        <ContentCarousel title="Picks for You" subtitle="Curated based on your saved list and viewing habits.">
          {recommendations.map((item, index) => (
            <div key={`rec-${item.id}-${index}`} className="w-[160px] shrink-0 md:w-[200px]" style={{ scrollSnapAlign: "start" }}>
              <PosterCard item={item} inList={myList.includes(item.id)} onToggleList={onToggleList} />
            </div>
          ))}
        </ContentCarousel>
      </PageContainer>
    </>
  );
};
