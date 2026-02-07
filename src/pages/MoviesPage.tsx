import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Grid, List, Star, Clock, Calendar } from 'lucide-react';
import { useMovieList, useGenreList } from '@/hooks/useApi';
import { toMovieList } from '@/lib/adapters';
import { GridSkeleton } from '@/components/LoadingSkeletons';
// Movies Page

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'az', label: 'A-Z' },
];

const filterOptions = {
  years: ['All', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2010s', '2000s', 'Classic'],
  ratings: ['All', '9+', '8+', '7+', '6+', 'Any'],
};

export default function MoviesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const { data: movieListData, isLoading } = useMovieList();
  const { data: genreData } = useGenreList();

  // Transform API data to our Movie type
  const apiMovies = useMemo(() => {
    return toMovieList(movieListData?.data || []);
  }, [movieListData]);

  // Build genre list from API
  const apiGenres = useMemo(() => {
    const genres = (genreData?.data || []).map(g => g.name);
    return ['All', ...genres];
  }, [genreData]);

  const filteredMovies = useMemo(() => {
    let movies = [...apiMovies];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      movies = movies.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.genres.some(g => g.toLowerCase().includes(query))
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      movies = movies.filter(m => m.genres.includes(selectedGenre));
    }

    // Year filter
    if (selectedYear !== 'All') {
      if (selectedYear === '2010s') {
        movies = movies.filter(m => m.year >= 2010 && m.year < 2020);
      } else if (selectedYear === '2000s') {
        movies = movies.filter(m => m.year >= 2000 && m.year < 2010);
      } else if (selectedYear === 'Classic') {
        movies = movies.filter(m => m.year < 2000);
      } else {
        movies = movies.filter(m => m.year === parseInt(selectedYear));
      }
    }

    // Rating filter
    if (selectedRating !== 'All') {
      const minRating = parseFloat(selectedRating);
      movies = movies.filter(m => m.imdbRating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        movies.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        movies.sort((a, b) => a.year - b.year);
        break;
      case 'rating':
        movies.sort((a, b) => b.imdbRating - a.imdbRating);
        break;
      case 'az':
        movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep default order (popular)
        break;
    }

    return movies;
  }, [searchQuery, selectedGenre, selectedYear, selectedRating, sortBy]);

  const activeFiltersCount = [
    selectedGenre !== 'All',
    selectedYear !== 'All',
    selectedRating !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#181818] pt-24 pb-16">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Movies</h1>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search movies, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-[#EAB308] transition-colors"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#EAB308] cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#181818]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${showFilters || activeFiltersCount > 0
                ? 'bg-[#EAB308] border-[#EAB308] text-white'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#EAB308] text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode */}
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-[#EAB308] text-white' : 'text-white/60 hover:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-[#EAB308] text-white' : 'text-white/60 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Genre Filter */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {apiGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedGenre === genre
                        ? 'bg-[#EAB308] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Year</label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.years.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedYear === year
                        ? 'bg-[#7B61FF] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-white/60 text-sm mb-2 block">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.ratings.map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedRating === rating
                        ? 'bg-[#EAB308] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSelectedGenre('All');
                  setSelectedYear('All');
                  setSelectedRating('All');
                }}
                className="mt-4 text-[#EAB308] text-sm hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <p className="text-white/50 text-sm">
          Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
        </p>
      </div>

      {/* Movies Grid/List */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {isLoading ? (
          <GridSkeleton count={18} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <span className="text-[#EAB308] text-xs font-semibold">{movie.rating}</span>
                      <span className="text-white/60 text-xs">{movie.duration}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-white font-medium text-sm truncate group-hover:text-[#EAB308] transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white/50 text-xs">{movie.imdbRating}</span>
                  <span className="text-white/30 text-xs">|</span>
                  <span className="text-white/50 text-xs">{movie.year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group flex gap-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#EAB308] transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
                    <span className="text-[#EAB308] font-semibold">{movie.rating}</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {movie.year}
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {movie.duration}
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {movie.imdbRating}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm line-clamp-2 mb-3">
                    {movie.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map(genre => (
                      <span
                        key={genre}
                        className="px-2 py-1 text-xs text-white/70 bg-white/10 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-white/50">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
