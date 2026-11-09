const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

// Fallback gradient poster when no image
export const getImageUrl = (
  path: string | null | undefined,
  size: "w200" | "w300" | "w500" | "w780" | "original" | "w1280" = "w500"
) => {
  if (!path) {
    // Transparent 1x1 pixel data URI as safe fallback (no broken image)
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect fill='%2318181b' width='300' height='450'/%3E%3Ctext fill='%2352525b' font-family='system-ui' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
  return `${IMAGE_BASE}/${size}${path}`;
};

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv" | "person";
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  production_countries?: { name: string }[];
  spoken_languages?: { english_name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; profile_path: string | null }[];
  };
  videos?: {
    results: { key: string; site: string; type: string; name: string }[];
  };
  similar?: { results: Movie[] };
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  created_by?: { name: string }[];
  networks?: { name: string; logo_path: string | null }[];
  profile_path?: string | null;
};

export type TMDBResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

async function fetchTMDB<T>(endpoint: string, revalidate = 3600): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey || apiKey === "your_tmdb_api_key_here") {
    console.warn("No TMDB API key – using mock data");
    return getMockData(endpoint) as unknown as T;
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE}${endpoint}${separator}api_key=${apiKey}&language=en-US`;

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      console.error(`TMDB error ${res.status}: ${endpoint}`);
      return getMockData(endpoint) as unknown as T;
    }
    return res.json();
  } catch (e) {
    console.error("TMDB fetch failed", e);
    return getMockData(endpoint) as unknown as T;
  }
}

export async function fetchTMDBClient<T>(endpoint: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) return getMockData(endpoint) as unknown as T;

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE}${endpoint}${separator}api_key=${apiKey}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) return getMockData(endpoint) as unknown as T;
  return res.json();
}

function getMockData(endpoint: string): Record<string, unknown> | Movie | TMDBResponse {
  const mockMovies: Movie[] = [
    {
      id: 155,
      title: "The Dark Knight",
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
      vote_average: 9.0,
      release_date: "2008-07-18",
      media_type: "movie",
    },
    {
      id: 157336,
      title: "Interstellar",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole...",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "/xJHokMblPvKtuJ086SlYvdYc6fY.jpg",
      vote_average: 8.5,
      release_date: "2014-11-07",
      media_type: "movie",
    },
    {
      id: 27205,
      title: "Inception",
      overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious...",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      vote_average: 8.4,
      release_date: "2010-07-15",
      media_type: "movie",
    },
    {
      id: 278,
      title: "The Shawshank Redemption",
      overview: "Framed in the 1940s for the double murder of his wife and her lover...",
      poster_path: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzQ.jpg",
      vote_average: 8.7,
      release_date: "1994-09-23",
      media_type: "movie",
    },
    {
      id: 238,
      title: "The Godfather",
      overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family...",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop_path: "/tmU7GeKUzGhGuO9NLWbkWOfFp02.jpg",
      vote_average: 8.7,
      release_date: "1972-03-14",
      media_type: "movie",
    },
  ];

  if (endpoint.includes("/trending")) {
    return { results: mockMovies, page: 1, total_pages: 1, total_results: mockMovies.length };
  }
  if (endpoint.includes("/search")) {
    return { results: mockMovies, page: 1, total_pages: 1, total_results: mockMovies.length };
  }
  if (endpoint.match(/\/movie\/\d+/)) {
    return {
      ...mockMovies[0],
      genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }],
      runtime: 152,
      credits: {
        cast: [
          { id: 1, name: "Christian Bale", character: "Bruce Wayne", profile_path: "/qCpZn2eBxnlyTG2a7Q4QU74IH2G.jpg" },
          { id: 2, name: "Heath Ledger", character: "Joker", profile_path: "/5Y9HnYYa9jF4Kn0d1iaP9lHhZ5k.jpg" },
        ],
        crew: [{ id: 3, name: "Christopher Nolan", job: "Director", profile_path: null }],
      },
      videos: { results: [{ key: "EXeTwQWrcwY", site: "YouTube", type: "Trailer", name: "Trailer" }] },
      similar: { results: mockMovies.slice(1) },
    };
  }
  return { results: mockMovies, page: 1, total_pages: 1, total_results: mockMovies.length };
}

export async function getTrending(timeWindow: "day" | "week" = "day") {
  return fetchTMDB<TMDBResponse>(`/trending/all/${timeWindow}`);
}

export async function getPopularMovies(page = 1) {
  return fetchTMDB<TMDBResponse>(`/movie/popular?page=${page}`);
}

export async function getTopRatedMovies(page = 1) {
  return fetchTMDB<TMDBResponse>(`/movie/top_rated?page=${page}`);
}

export async function getNowPlaying(page = 1) {
  return fetchTMDB<TMDBResponse>(`/movie/now_playing?page=${page}`);
}

export async function getUpcoming(page = 1) {
  return fetchTMDB<TMDBResponse>(`/movie/upcoming?page=${page}`);
}

export async function getMovieDetails(id: number) {
  return fetchTMDB<Movie>(`/movie/${id}?append_to_response=credits,videos,similar`);
}

export async function getTVDetails(id: number) {
  return fetchTMDB<Movie>(`/tv/${id}?append_to_response=credits,videos,similar`);
}

export async function searchMulti(query: string, page = 1) {
  return fetchTMDB<TMDBResponse>(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
}

export async function discoverMovies(params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => qs.set(k, String(v)));
  return fetchTMDB<TMDBResponse>(`/discover/movie?${qs.toString()}`);
}

export async function getGenres() {
  return fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/movie/list");
}

export function getTitle(item: Movie) {
  return item.title || item.name || "Unknown";
}

export function getYear(item: Movie) {
  const date = item.release_date || item.first_air_date;
  return date ? date.slice(0, 4) : "";
}

export function getMediaType(item: Movie): "movie" | "tv" {
  if (item.media_type === "tv" || item.first_air_date) return "tv";
  return "movie";
}
