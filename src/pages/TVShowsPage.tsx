import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Grid, List, Star, Play, CheckCircle, XCircle } from 'lucide-react';
import { useTVShowList, useGenreList } from '@/hooks/useApi';
import { toTVShowList } from '@/lib/adapters';
import { GridSkeleton, HeroSkeleton } from '@/components/LoadingSkeletons';
import VideoModal from '@/components/VideoModal';
// TV Shows Page

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'az', label: 'A-Z' },
];

const statusOptions = ['All', 'Ongoing', 'Ended', 'Cancelled'];

export default function TVShowsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { data: tvShowData, isLoading } = useTVShowList();
  const { data: genreData } = useGenreList();

  // Transform API data
  const allApiShows = useMemo(() => {
    return toTVShowList(tvShowData?.data || []);
  }, [tvShowData]);

  // Build genre list from API
  const tvShowCategories = useMemo(() => {
    const genres = (genreData?.data || []).map(g => g.name);
    return ['All', ...genres];
  }, [genreData]);

  const uniqueShows = allApiShows;
  const featuredTVShow = allApiShows.length > 0 ? allApiShows[0] : null;

  const filteredShows = useMemo(() => {
    let shows = [...uniqueShows];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      shows = shows.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.genres.some(g => g.toLowerCase().includes(query))
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      shows = shows.filter(s => s.genres.includes(selectedGenre));
    }

    // Status filter
    if (selectedStatus !== 'All') {
      shows = shows.filter(s => s.status === selectedStatus);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        shows.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        shows.sort((a, b) => a.year - b.year);
        break;
      case 'rating':
        shows.sort((a, b) => b.imdbRating - a.imdbRating);
        break;
      case 'az':
        shows.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return shows;
  }, [searchQuery, selectedGenre, selectedStatus, sortBy, uniqueShows]);

  const activeFiltersCount = [
    selectedGenre !== 'All',
    selectedStatus !== 'All',
  ].filter(Boolean).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return <Play className="w-3 h-3 text-green-400" />;
      case 'Ended':
        return <CheckCircle className="w-3 h-3 text-blue-400" />;
      case 'Cancelled':
        return <XCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000]">
        <HeroSkeleton />
        <div className="pt-8 pb-16 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <GridSkeleton count={18} />
        </div>
      </div>
    );
  }

  if (!featuredTVShow) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">No TV shows available</h2>
          <p className="text-white/50">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Featured Show Hero */}
      <div className="relative h-[500px] sm:h-[600px]">
        <img
          src={featuredTVShow.backdropUrl || featuredTVShow.posterUrl}
          alt={featuredTVShow.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
          <div className="max-w-[1920px] mx-auto">
            <span className="text-[#F5C518] font-semibold text-sm tracking-wider uppercase mb-2 block">
              Featured Series
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow-lg">
              {featuredTVShow.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[#F5C518] font-semibold">{featuredTVShow.rating}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/70">{featuredTVShow.year}</span>
              <span className="text-white/40">|</span>
              {featuredTVShow.seasons > 0 && (
                <>
                  <span className="text-white/70">{featuredTVShow.seasons} Seasons</span>
                  <span className="text-white/40">|</span>
                </>
              )}
              {featuredTVShow.episodes > 0 && (
                <span className="text-white/70">{featuredTVShow.episodes} Episodes</span>
              )}
              <span className="text-white/40">|</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{featuredTVShow.imdbRating}</span>
              </div>
            </div>
            <p className="text-white/80 max-w-2xl mb-6 line-clamp-3">
              {featuredTVShow.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-[#FACC15] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
              >
                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-black" />
                </div>
                Watch Now
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 pb-16">
        {/* Header */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">All TV Shows</h2>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search TV shows, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-[#F5C518] transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#F5C518] cursor-pointer"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#000000]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${showFilters || activeFiltersCount > 0
                  ? 'bg-[#F5C518] border-[#F5C518] text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-[#F5C518] text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-[#F5C518] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-[#F5C518] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {tvShowCategories.map(genre => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedGenre === genre
                          ? 'bg-[#F5C518] text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedStatus === status
                          ? 'bg-[#F5C518] text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedGenre('All');
                    setSelectedStatus('All');
                  }}
                  className="mt-4 text-[#F5C518] text-sm hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <p className="text-white/50 text-sm">
            Showing {filteredShows.length} {filteredShows.length === 1 ? 'show' : 'shows'}
          </p>
        </div>

        {/* Shows Grid/List */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {isLoading ? (
            <GridSkeleton count={18} />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredShows.map((show, index) => (
                <div
                  key={show.id}
                  onClick={() => navigate(`/movie/${show.id}`)}
                  className="group cursor-pointer"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <span className="text-[#F5C518] text-xs font-semibold">{show.rating}</span>
                        <span className="text-white/60 text-xs">{show.seasons}S</span>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1">
                      {getStatusIcon(show.status)}
                      <span className="text-white text-xs">{show.status}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm truncate group-hover:text-[#F5C518] transition-colors">
                    {show.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/50 text-xs">{show.imdbRating}</span>
                    <span className="text-white/30 text-xs">|</span>
                    <span className="text-white/50 text-xs">{show.year}</span>
                    <span className="text-white/30 text-xs">|</span>
                    <span className="text-white/50 text-xs">{show.network}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShows.map((show, index) => (
                <div
                  key={show.id}
                  onClick={() => navigate(`/movie/${show.id}`)}
                  className="group flex gap-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1">
                      {getStatusIcon(show.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#F5C518] transition-colors">
                      {show.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
                      <span className="text-[#F5C518] font-semibold">{show.rating}</span>
                      <span className="text-white/40">|</span>
                      <span className="text-white/60">{show.year}</span>
                      <span className="text-white/40">|</span>
                      <span className="text-white/60">{show.seasons} Seasons</span>
                      <span className="text-white/40">|</span>
                      <span className="text-white/60">{show.episodes} Episodes</span>
                      <span className="text-white/40">|</span>
                      <span className="text-white/60 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {show.imdbRating}
                      </span>
                      <span className="text-white/40">|</span>
                      <span className="text-white/60">{show.network}</span>
                    </div>
                    <p className="text-white/60 text-sm line-clamp-2 mb-3">
                      {show.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {show.genres.map(genre => (
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

          {filteredShows.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <Search className="w-10 h-10 text-white/40" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">No shows found</h3>
              <p className="text-white/50">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoTitle={featuredTVShow.title}
      />
    </div>
  );
}
