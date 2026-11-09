"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchMulti, getTitle, getImageUrl, type Movie } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Image from "next/image";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"all" | "movie" | "tv" | "person">("all");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    searchMulti(q)
      .then((data) => {
        setResults(data.results || []);
        setTotal(data.total_results || 0);
      })
      .finally(() => setLoading(false));
  }, [q]);

  const filtered = results.filter((r) => {
    if (tab === "all") return true;
    if (tab === "person") return r.media_type === "person";
    if (tab === "movie") return r.media_type === "movie" || (!r.media_type && r.title);
    if (tab === "tv") return r.media_type === "tv" || (!r.media_type && r.name && !r.title);
    return true;
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <form onSubmit={onSubmit} className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows, people..."
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500/50 text-lg"
          autoFocus
        />
      </form>

      {!q && (
        <div className="py-12 text-center text-zinc-500">
          <p className="mb-4">Try searching for a movie, TV show or person</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Inception", "Breaking Bad", "Interstellar", "The Dark Knight"].map((s) => (
              <button
                key={s}
                onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                className="px-3 py-1.5 rounded-full bg-zinc-900 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {q && (
        <>
          <div className="flex items-center gap-2 mb-4 overflow-x-auto">
            {[
              { id: "all", label: "All" },
              { id: "movie", label: "Movies" },
              { id: "tv", label: "TV Shows" },
              { id: "person", label: "People" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "all" | "movie" | "tv" | "person")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  tab === t.id ? "bg-white text-black" : "bg-zinc-900 text-zinc-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-zinc-500 py-8">Searching...</p>
          ) : (
            <>
              <p className="text-sm text-zinc-400 mb-4">
                {total.toLocaleString()} results for &quot;{q}&quot;
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filtered.map((item) =>
                  item.media_type === "person" ? (
                    <div key={item.id} className="text-center">
                      <div className="aspect-square rounded-full overflow-hidden bg-zinc-900 mb-2 mx-auto w-24 h-24 relative">
                        {item.poster_path || item.profile_path ? (
                          <Image
                            src={getImageUrl(item.profile_path || item.poster_path, "w200")}
                            alt={getTitle(item)}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl">
                            👤
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{getTitle(item)}</p>
                    </div>
                  ) : (
                    <MovieCard key={item.id} item={item} />
                  )
                )}
              </div>
              {filtered.length === 0 && (
                <p className="text-zinc-500 py-8">No results found.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
