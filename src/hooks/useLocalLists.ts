"use client";

import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/lib/tmdb";

const WATCHLIST_KEY = "cinesearch_watchlist";
const FAVORITES_KEY = "cinesearch_favorites";
const RECENT_KEY = "cinesearch_recent";

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function useLocalLists() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [recent, setRecent] = useState<Movie[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWatchlist(load(WATCHLIST_KEY));
    setFavorites(load(FAVORITES_KEY));
    setRecent(load(RECENT_KEY));
    setReady(true);
  }, []);

  const addToWatchlist = useCallback((item: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === item.id)) return prev;
      const next = [{ ...item, media_type: item.media_type || "movie" }, ...prev];
      save(WATCHLIST_KEY, next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number) => {
    setWatchlist((prev) => {
      const next = prev.filter((m) => m.id !== id);
      save(WATCHLIST_KEY, next);
      return next;
    });
  }, []);

  const toggleWatchlist = useCallback((item: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === item.id);
      const next = exists
        ? prev.filter((m) => m.id !== item.id)
        : [{ ...item, media_type: item.media_type || "movie" }, ...prev];
      save(WATCHLIST_KEY, next);
      return next;
    });
  }, []);

  const addToFavorites = useCallback((item: Movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === item.id)) return prev;
      const next = [{ ...item, media_type: item.media_type || "movie" }, ...prev];
      save(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const removeFromFavorites = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.filter((m) => m.id !== id);
      save(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((item: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === item.id);
      const next = exists
        ? prev.filter((m) => m.id !== item.id)
        : [{ ...item, media_type: item.media_type || "movie" }, ...prev];
      save(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const addToRecent = useCallback((item: Movie) => {
    setRecent((prev) => {
      const filtered = prev.filter((m) => m.id !== item.id);
      const next = [{ ...item, media_type: item.media_type || "movie" }, ...filtered].slice(0, 20);
      save(RECENT_KEY, next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    save(RECENT_KEY, []);
  }, []);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    save(WATCHLIST_KEY, []);
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    save(FAVORITES_KEY, []);
  }, []);

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((m) => m.id === id),
    [watchlist]
  );

  const isInFavorites = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const exportData = useCallback(() => {
    return JSON.stringify({ watchlist, favorites }, null, 2);
  }, [watchlist, favorites]);

  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.watchlist) {
        setWatchlist(data.watchlist);
        save(WATCHLIST_KEY, data.watchlist);
      }
      if (data.favorites) {
        setFavorites(data.favorites);
        save(FAVORITES_KEY, data.favorites);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    watchlist,
    favorites,
    recent,
    ready,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    addToRecent,
    clearRecent,
    clearWatchlist,
    clearFavorites,
    isInWatchlist,
    isInFavorites,
    exportData,
    importData,
  };
}
