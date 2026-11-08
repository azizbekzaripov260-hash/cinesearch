"use client";

import MovieRow from "./MovieRow";
import { useLocalLists } from "@/hooks/useLocalLists";
import type { Movie } from "@/lib/tmdb";

type Props = {
  trendingDay: Movie[];
  trendingWeek: Movie[];
  popular: Movie[];
  topRated: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
};

export default function HomeClient({
  trendingDay,
  trendingWeek,
  popular,
  topRated,
  nowPlaying,
  upcoming,
}: Props) {
  const { recent, clearRecent } = useLocalLists();

  return (
    <>
      <MovieRow title="Trending Today" items={trendingDay} seeAllHref="/discover" />
      <MovieRow title="Trending This Week" items={trendingWeek} seeAllHref="/discover" />

      {recent.length > 0 && (
        <MovieRow
          title="Recently Viewed"
          items={recent}
          onClear={clearRecent}
        />
      )}

      <MovieRow title="Popular Movies" items={popular} seeAllHref="/discover?sort=popularity.desc" />
      <MovieRow title="Top Rated Movies" items={topRated} seeAllHref="/discover?sort=vote_average.desc" />
      <MovieRow title="Now Playing" items={nowPlaying} />
      <MovieRow title="Upcoming" items={upcoming} />
    </>
  );
}
