"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getTitle, getYear, getMediaType, type Movie } from "@/lib/tmdb";
import { useLocalLists } from "@/hooks/useLocalLists";
import { showToast } from "./Toast";

type Props = {
  items: Movie[];
};

export default function Hero({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { toggleWatchlist, isInWatchlist, addToRecent } = useLocalLists();

  const safeItems = items?.filter((i) => i.backdrop_path || i.poster_path) || [];
  const current = safeItems[index] || safeItems[0];

  const next = useCallback(() => {
    if (safeItems.length === 0) return;
    setIndex((i) => (i + 1) % safeItems.length);
  }, [safeItems.length]);

  const prev = useCallback(() => {
    if (safeItems.length === 0) return;
    setIndex((i) => (i - 1 + safeItems.length) % safeItems.length);
  }, [safeItems.length]);

  useEffect(() => {
    if (paused || safeItems.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next, safeItems.length]);

  if (!current) {
    return (
      <div className="h-[50vh] bg-zinc-900 flex items-center justify-center text-zinc-500">
        Loading hero...
      </div>
    );
  }

  const media = getMediaType(current);
  const href = media === "tv" ? `/tv/${current.id}` : `/movie/${current.id}`;
  const inWatch = isInWatchlist(current.id);

  return (
    <section className="relative h-[55vh] sm:h-[65vh] min-h-[400px] max-h-[700px] overflow-hidden">
      <Image
        src={getImageUrl(current.backdrop_path || current.poster_path, "w1280")}
        alt={getTitle(current)}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />

      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
              {media === "tv" ? "TV SERIES" : "MOVIE"}
            </span>
            <span className="text-xs text-zinc-400">TRENDING TODAY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            {getTitle(current)}
          </h1>

          <div className="flex items-center gap-3 text-sm text-zinc-300 mb-3">
            {current.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                {current.vote_average.toFixed(1)}
              </span>
            )}
            {getYear(current) && <span>{getYear(current)}</span>}
          </div>

          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 mb-5 max-w-lg">
            {current.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={href}
              onClick={() => addToRecent(current)}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition"
            >
              ▶ Play Trailer
            </Link>
            <button
              onClick={() => {
                toggleWatchlist(current);
                showToast(inWatch ? "Removed from watchlist" : "Added to watchlist");
              }}
              className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg transition ${
                inWatch
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800/80 text-white hover:bg-zinc-700"
              }`}
            >
              {inWatch ? "✓ In Watchlist" : "+ Add to Watchlist"}
            </button>
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-transparent border border-zinc-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition"
            >
              More Info
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 sm:right-8 flex items-center gap-2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full bg-black/50 border border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center"
          >
            ‹
          </button>
          <span className="text-xs text-zinc-400 min-w-[40px] text-center">
            {index + 1} / {safeItems.length}
          </span>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full bg-black/50 border border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center"
          >
            ›
          </button>
          <button
            onClick={() => setPaused((p) => !p)}
            className="w-9 h-9 rounded-full bg-black/50 border border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center text-xs"
            title={paused ? "Play" : "Pause"}
          >
            {paused ? "▶" : "❚❚"}
          </button>
        </div>
      </div>
    </section>
  );
}
