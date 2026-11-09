import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlaying,
  getUpcoming,
} from "@/lib/tmdb";
import Hero from "@/components/Hero";
import HomeClient from "@/components/HomeClient";

export const revalidate = 3600;

export default async function HomePage() {
  const [trendingDay, trendingWeek, popular, topRated, nowPlaying, upcoming] =
    await Promise.all([
      getTrending("day"),
      getTrending("week"),
      getPopularMovies(),
      getTopRatedMovies(),
      getNowPlaying(),
      getUpcoming(),
    ]);

  const heroItems = trendingDay.results?.slice(0, 8) || [];

  return (
    <div>
      <Hero items={heroItems} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-12">
        <HomeClient
          trendingDay={trendingDay.results || []}
          trendingWeek={trendingWeek.results || []}
          popular={popular.results || []}
          topRated={topRated.results || []}
          nowPlaying={nowPlaying.results || []}
          upcoming={upcoming.results || []}
        />
      </div>
    </div>
  );
}
