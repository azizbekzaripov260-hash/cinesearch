import { getTVDetails, getImageUrl, getTitle, getYear } from "@/lib/tmdb";
import Image from "next/image";
import MovieDetailClient from "@/components/MovieDetailClient";
import MovieRow from "@/components/MovieRow";

type Props = { params: Promise<{ id: string }> };

export default async function TVPage({ params }: Props) {
  const { id } = await params;
  const show = await getTVDetails(Number(id));

  if (!show || !show.id) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center text-zinc-500">
        TV show not found.
      </div>
    );
  }

  const trailer = show.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  return (
    <div>
      <div className="relative h-[50vh] min-h-[320px]">
        <Image
          src={getImageUrl(show.backdrop_path || show.poster_path, "w1280")}
          alt={getTitle(show)}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/60" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-[180px] sm:w-[220px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(show.poster_path, "w500")}
                alt={getTitle(show)}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="flex-1 pt-2">
            <div className="text-xs text-red-500 font-semibold uppercase mb-1">TV Series</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {getTitle(show)}{" "}
              <span className="text-zinc-400 font-normal text-2xl">({getYear(show)})</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 mb-4">
              {show.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {show.vote_average.toFixed(1)}
                </span>
              )}
              {show.number_of_seasons != null && (
                <span>{show.number_of_seasons} season{show.number_of_seasons !== 1 ? "s" : ""}</span>
              )}
              {show.number_of_episodes != null && (
                <span>{show.number_of_episodes} episodes</span>
              )}
            </div>

            {show.genres && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((g) => (
                  <span key={g.id} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-zinc-300 leading-relaxed mb-6 max-w-2xl">{show.overview}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
              {show.created_by && show.created_by.length > 0 && (
                <div>
                  <div className="text-zinc-500 text-xs uppercase">Created by</div>
                  <div className="text-white">{show.created_by.map((c) => c.name).join(", ")}</div>
                </div>
              )}
              {show.networks && show.networks.length > 0 && (
                <div>
                  <div className="text-zinc-500 text-xs uppercase">Networks</div>
                  <div className="text-white">{show.networks.map((n) => n.name).join(", ")}</div>
                </div>
              )}
            </div>

            <MovieDetailClient movie={{ ...show, media_type: "tv" }} trailerKey={trailer?.key} />
          </div>
        </div>

        {show.credits?.cast && show.credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Series Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {show.credits.cast.slice(0, 16).map((c) => (
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
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-sm font-medium line-clamp-1">{c.name}</p>
                  <p className="text-xs text-zinc-500 line-clamp-1">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {show.similar?.results && show.similar.results.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Similar TV Shows" items={show.similar.results.map((r) => ({ ...r, media_type: "tv" }))} />
          </div>
        )}
      </div>
    </div>
  );
}
