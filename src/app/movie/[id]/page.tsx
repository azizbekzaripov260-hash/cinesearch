import { getMovieDetails, getImageUrl, getTitle, getYear } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import MovieDetailClient from "@/components/MovieDetailClient";
import MovieRow from "@/components/MovieRow";

type Props = { params: Promise<{ id: string }> };

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id));

  if (!movie || !movie.id) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center text-zinc-500">
        Movie not found.
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const writers = movie.credits?.crew?.filter((c) => c.job === "Writer" || c.job === "Screenplay").slice(0, 3);

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[320px]">
        <Image
          src={getImageUrl(movie.backdrop_path || movie.poster_path, "w1280")}
          alt={getTitle(movie)}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/60" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-[180px] sm:w-[220px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movie.poster_path, "w500")}
                alt={getTitle(movie)}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {getTitle(movie)}{" "}
              <span className="text-zinc-400 font-normal text-2xl">
                ({getYear(movie)})
              </span>
            </h1>

            {movie.tagline && (
              <p className="text-zinc-400 italic mb-3">&quot;{movie.tagline}&quot;</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 mb-4">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded">
                  <span className="text-yellow-400">★</span>
                  {movie.vote_average.toFixed(1)}
                  {movie.vote_count ? (
                    <span className="text-zinc-500 text-xs">
                      ({(movie.vote_count / 1000).toFixed(1)}K)
                    </span>
                  ) : null}
                </span>
              )}
              {movie.runtime ? <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span> : null}
              {movie.release_date && <span>{movie.release_date}</span>}
            </div>

            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-zinc-300 leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6">
              {director && (
                <div>
                  <div className="text-zinc-500 text-xs uppercase">Director</div>
                  <div className="text-white">{director.name}</div>
                </div>
              )}
              {writers && writers.length > 0 && (
                <div>
                  <div className="text-zinc-500 text-xs uppercase">Writers</div>
                  <div className="text-white">{writers.map((w) => w.name).join(", ")}</div>
                </div>
              )}
              {movie.budget != null && movie.budget > 0 && (
                <div>
                  <div className="text-zinc-500 text-xs uppercase">Budget</div>
                  <div className="text-white">${(movie.budget / 1e6).toFixed(0)}M</div>
                </div>
              )}
              {movie.revenue != null && movie.revenue > 0 && (
                <div>
                  <div className="text-zinc-500 text-xs uppercase">Revenue</div>
                  <div className="text-white">${(movie.revenue / 1e6).toFixed(0)}M</div>
                </div>
              )}
            </div>

            <MovieDetailClient movie={movie} trailerKey={trailer?.key} />
          </div>
        </div>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {movie.credits.cast.slice(0, 16).map((c) => (
                <div key={c.id} className="flex-shrink-0 w-28 text-center">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden bg-zinc-900 mb-2">
                    {c.profile_path ? (
                      <Image
                        src={getImageUrl(c.profile_path, "w200")}
                        alt={c.name}
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
                  <p className="text-sm font-medium line-clamp-1">{c.name}</p>
                  <p className="text-xs text-zinc-500 line-clamp-1">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Similar Movies" items={movie.similar.results} />
          </div>
        )}
      </div>
    </div>
  );
}
