import { useState } from 'react';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import MovieRow from '@/sections/MovieRow';
import Categories from '@/sections/Categories';
import Footer from '@/sections/Footer';
import MovieModal from '@/components/MovieModal';
import type { Movie } from '@/types';
import {
  trendingMovies,
  continueWatching,
  top10Movies,
  featuredMovie,
} from '@/data/movies';

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  };

  return (
    <div className="min-h-screen bg-[#000000] grain-overlay">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero movie={featuredMovie} />

      {/* Main Content */}
      <main className="relative z-10 mt-0 sm:-mt-20 lg:-mt-32">
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

      {/* Footer */}
      <Footer />

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
