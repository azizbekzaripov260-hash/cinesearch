# CineSearch

Movie & TV discovery app built with Next.js 15 + Tailwind CSS + TMDB API.

## Features

- **Home** – Hero carousel (auto 6s), Trending, Popular, Top Rated, Recently Viewed
- **Search** – Multi search with All / Movies / TV / People tabs
- **Discover** – Genre, year, rating filters + sort
- **Watchlist & Favorites** – localStorage, Import/Export, Clear all
- **Movie & TV Detail** – Trailer modal, cast, similar, share
- Fully responsive + dark theme

## Setup

```bash
cd cinesearch
npm install
```

Create `.env.local`:

```
TMDB_API_KEY=your_key_here
NEXT_PUBLIC_TMDB_API_KEY=your_key_here
```

Get free key: https://www.themoviedb.org/settings/api

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` – development
- `npm run build` – production build
- `npm start` – run production
