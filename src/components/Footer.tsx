import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-[#0a0a0a] mt-12">
      <div className="max-w-[1400px] mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="text-lg font-bold mb-3">
            <span className="text-red-500">CINE</span>SEARCH
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Discover movies and TV shows, watch trailers and keep track of everything you want to watch.
          </p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300"
          >
            TMDB
          </a>
          <p className="text-xs text-zinc-600 mt-2">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/search" className="hover:text-white">Search</Link></li>
            <li><Link href="/discover" className="hover:text-white">Discover</Link></li>
            <li><Link href="/watchlist" className="hover:text-white">Watchlist</Link></li>
            <li><Link href="/favorites" className="hover:text-white">Favorites</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3">More</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link href="/discover" className="hover:text-white">Browse Movies</Link></li>
            <li><Link href="/discover?type=tv" className="hover:text-white">Browse TV Shows</Link></li>
            <li>
              <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                TMDB
              </a>
            </li>
            <li>
              <a href="https://developer.themoviedb.org/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                TMDB API
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-900 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} CineSearch. Data and images provided by TMDB.
      </div>
    </footer>
  );
}
