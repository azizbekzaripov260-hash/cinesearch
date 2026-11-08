"use client";

import { useState } from "react";
import { useLocalLists } from "@/hooks/useLocalLists";
import { showToast } from "./Toast";
import type { Movie } from "@/lib/tmdb";

type Props = {
  movie: Movie;
  trailerKey?: string;
};

export default function MovieDetailClient({ movie, trailerKey }: Props) {
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites, addToRecent } =
    useLocalLists();
  const [showTrailer, setShowTrailer] = useState(false);

  // Add to recent on mount
  useState(() => {
    addToRecent(movie);
  });

  const inWatch = isInWatchlist(movie.id);
  const inFav = isInFavorites(movie.id);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {trailerKey && (
          <button
            onClick={() => setShowTrailer(true)}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition"
          >
            ▶ Watch Trailer
          </button>
        )}
        <button
          onClick={() => {
            toggleWatchlist(movie);
            showToast(inWatch ? "Removed from watchlist" : "Added to watchlist");
          }}
          className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg transition ${
            inWatch ? "bg-red-600 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
        >
          {inWatch ? "✓ In Watchlist" : "+ Add to Watchlist"}
        </button>
        <button
          onClick={() => {
            toggleFavorite(movie);
            showToast(inFav ? "Removed from favorites" : "Added to favorites");
          }}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
            inFav ? "bg-red-600 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
          title="Favorite"
        >
          ♥
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: movie.title || movie.name,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              showToast("Link copied");
            }
          }}
          className="w-11 h-11 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 flex items-center justify-center"
          title="Share"
        >
          ↗
        </button>
      </div>

      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              className="w-full h-full rounded-xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
