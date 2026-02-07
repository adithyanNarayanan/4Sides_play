// HomePage component
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/sections/Hero';
import MovieRow from '@/sections/MovieRow';
import Categories from '@/sections/Categories';
import { HeroSkeleton, MovieRowSkeleton } from '@/components/LoadingSkeletons';
import type { Movie } from '@/types';
import { useDashboard } from '@/hooks/useApi';
import { toMovie, toContinueWatching } from '@/lib/adapters';
import type { DashboardSectionItem, DashboardSlider, ContinueWatchItem } from '@/lib/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useDashboard();

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Extract and transform dashboard data
  const { featuredMovie, sections, continueWatchingItems } = useMemo(() => {
    const raw = dashboardData?.data;
    if (!raw) return { featuredMovie: undefined, sections: [], continueWatchingItems: [] };

    // Featured movie from slider/banner
    const sliders = raw.slider || raw.banner || [];
    const featured = sliders.length > 0
      ? toMovie(sliders[0] as DashboardSlider)
      : undefined;

    // Continue watching
    const cw = (raw.continue_watch || []).map((item: ContinueWatchItem) => toContinueWatching(item));

    // Sections (trending, top 10, etc.)
    const sectionList = (raw.section || []).map((s) => ({
      title: s.title || 'Untitled Section',
      movies: (s.data || s.list || []).map((item: DashboardSectionItem) => toMovie(item)),
      type: s.type,
    }));

    return {
      featuredMovie: featured,
      sections: sectionList,
      continueWatchingItems: cw,
    };
  }, [dashboardData]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] grain-overlay flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Unable to load content</h2>
          <p className="text-white/50 mb-4">Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#EAB308] text-black font-bold rounded-lg hover:bg-[#FACC15] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] grain-overlay">
      {/* Hero Section */}
      {isLoading ? <HeroSkeleton /> : <Hero movie={featuredMovie} />}

      {/* Main Content */}
      <main className="relative z-10 -mt-32">
        {isLoading ? (
          <>
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </>
        ) : (
          <>
            {/* Continue Watching */}
            {continueWatchingItems.length > 0 && (
              <MovieRow
                title="Continue Watching"
                movies={continueWatchingItems}
                onMovieClick={handleMovieClick}
                variant="continue-watching"
              />
            )}

            {/* Dynamic Sections from API */}
            {sections.map((section, index) => (
              <MovieRow
                key={`${section.title}-${index}`}
                title={section.title}
                movies={section.movies}
                onMovieClick={handleMovieClick}
                variant={section.title.toLowerCase().includes('top 10') ? 'top10' : 'default'}
              />
            ))}

            {/* Categories */}
            <Categories />
          </>
        )}
      </main>
    </div>
  );
}
