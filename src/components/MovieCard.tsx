"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl, getTitle, getYear, getMediaType, type Movie } from "@/lib/tmdb";
import { useLocalLists } from "@/hooks/useLocalLists";
import { showToast } from "./Toast";

type Props = {
  item: Movie;
  showActions?: boolean;
};

export default function MovieCard({ item, showActions = true }: Props) {
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites, addToRecent } = useLocalLists();
  const media = getMediaType(item);
  const href = media === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
  const inWatch = isInWatchlist(item.id);
  const inFav = isInFavorites(item.id);

  return (
    <div className="group relative flex-shrink-0 w-[140px] sm:w-[160px]">
      <Link
        href={href}
        onClick={() => addToRecent(item)}
        className="block relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900"
      >
        <Image
          src={getImageUrl(item.poster_path, "w300")}
          alt={getTitle(item)}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="160px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

        {showActions && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(item);
                showToast(inWatch ? "Removed from watchlist" : "Added to watchlist");
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                inWatch ? "bg-red-600 text-white" : "bg-black/70 text-white hover:bg-red-600"
              }`}
              title="Watchlist"
            >
              {inWatch ? "✓" : "+"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(item);
                showToast(inFav ? "Removed from favorites" : "Added to favorites");
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                inFav ? "bg-red-600 text-white" : "bg-black/70 text-white hover:bg-red-600"
              }`}
              title="Favorite"
            >
              ♥
            </button>
          </div>
        )}
      </Link>

      <div className="mt-2 px-0.5">
        <Link href={href} className="block text-sm font-medium text-white line-clamp-1 hover:text-red-400">
          {getTitle(item)}
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
          {item.vote_average > 0 && (
            <span className="flex items-center gap-0.5">
              <span className="text-yellow-400">★</span>
              {item.vote_average.toFixed(1)}
            </span>
          )}
          {getYear(item) && <span>{getYear(item)}</span>}
        </div>
      </div>
    </div>
  );
}
