// HomePage component
import { useNavigate } from 'react-router-dom';
import Hero from '@/sections/Hero';
import MovieRow from '@/sections/MovieRow';
import Categories from '@/sections/Categories';
import type { Movie } from '@/types';
import {
  trendingMovies,
  continueWatching,
  top10Movies,
  featuredMovie,
} from '@/data/movies';

export default function HomePage() {
  const navigate = useNavigate();

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-[#000000] grain-overlay">
      {/* Hero Section */}
      <Hero movie={featuredMovie} />

      {/* Main Content */}
      <main className="relative z-10 -mt-32">
        {/* Continue Watching */}
        <MovieRow
          title="Continue Watching"
          movies={continueWatching}
          onMovieClick={handleMovieClick}
          variant="continue-watching"
        />

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
        />

        {/* Top 10 Movies */}
        <MovieRow
          title="Top 10 Movies Today"
          movies={top10Movies}
          onMovieClick={handleMovieClick}
          variant="top10"
        />

        {/* Categories */}
        <Categories />

        {/* More Rows */}
        <MovieRow
          title="Critically Acclaimed"
          movies={trendingMovies.slice().reverse()}
          onMovieClick={handleMovieClick}
        />

        <MovieRow
          title="Because You Watched Inception"
          movies={top10Movies.slice().reverse()}
          onMovieClick={handleMovieClick}
        />
      </main>
    </div>
  );
}
