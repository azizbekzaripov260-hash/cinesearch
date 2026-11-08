"use client";

import { useRef } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import type { Movie } from "@/lib/tmdb";

type Props = {
  title: string;
  items: Movie[];
  seeAllHref?: string;
  onClear?: () => void;
};

export default function MovieRow({ title, items, seeAllHref, onClear }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scroller.current) return;
    const amount = scroller.current.clientWidth * 0.8;
    scroller.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-3">
          {onClear && (
            <button onClick={onClear} className="text-xs text-zinc-400 hover:text-white">
              Clear history
            </button>
          )}
          {seeAllHref && (
            <Link href={seeAllHref} className="text-sm text-zinc-400 hover:text-red-400">
              See All →
            </Link>
          )}
        </div>
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 transition hidden sm:flex items-center justify-center hover:bg-red-600"
        >
          ‹
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 transition hidden sm:flex items-center justify-center hover:bg-red-600"
        >
          ›
        </button>

        <div
          ref={scroller}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1"
        >
          {items.map((item) => (
            <MovieCard key={`${item.id}-${item.media_type || "m"}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
