"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { discoverMovies, getGenres, type Movie } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

const GENRES_FALLBACK = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 14, name: "Fantasy" },
  { id: 10749, name: "Romance" },
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState(GENRES_FALLBACK);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sort, setSort] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getGenres().then((d) => {
      if (d.genres?.length) setGenres(d.genres);
    });
  }, []);

  useEffect(() => {
    const g = searchParams.get("genres");
    if (g) setSelectedGenres(g.split(",").map(Number).filter(Boolean));
    const s = searchParams.get("sort");
    if (s) setSort(s);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      sort_by: sort,
      page: 1,
    };
    if (selectedGenres.length) params.with_genres = selectedGenres.join(",");
    if (year) params.primary_release_year = year;
    if (rating > 0) params["vote_average.gte"] = rating;

    discoverMovies(params)
      .then((data) => {
        setItems(data.results || []);
        setTotal(data.total_results || 0);
      })
      .finally(() => setLoading(false));
  }, [selectedGenres, sort, year, rating]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
    if (sort !== "popularity.desc") params.set("sort", sort);
    router.push(`/discover?${params.toString()}`);
  };

  const reset = () => {
    setSelectedGenres([]);
    setSort("popularity.desc");
    setYear("");
    setRating(0);
    router.push("/discover");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Discover Movies</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 12).map((g) => (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    selectedGenres.includes(g.id)
                      ? "bg-red-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">Sort by</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="popularity.desc">Popularity</option>
              <option value="vote_average.desc">Rating</option>
              <option value="primary_release_date.desc">Newest</option>
              <option value="revenue.desc">Revenue</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">Release year</h3>
            <input
              type="number"
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">
              Min rating: {rating > 0 ? rating.toFixed(1) : "Any"}
            </h3>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium"
            >
              Apply
            </button>
            <button
              onClick={reset}
              className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
            >
              Reset
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="text-sm text-zinc-400 mb-4">
            {loading ? "Loading..." : `${total.toLocaleString()} titles`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
          {!loading && items.length === 0 && (
            <p className="text-zinc-500 py-12 text-center">No movies found with these filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
