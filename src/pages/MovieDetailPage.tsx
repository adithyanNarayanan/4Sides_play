import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ThumbsUp, Share2, Star, Clock, Calendar, Globe, ArrowLeft, User, Film } from 'lucide-react';
import { useMovieDetails, useTVShowDetails } from '@/hooks/useApi';
import { toMovie, toCast, toMovieList } from '@/lib/adapters';
import MovieCard from '@/components/MovieCard';
import VideoModal from '@/components/VideoModal';
import { DetailSkeleton } from '@/components/LoadingSkeletons';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Try fetching as movie first, then as TV show
  const { data: movieData, isLoading: isLoadingMovie } = useMovieDetails(id);
  const { data: tvShowData, isLoading: isLoadingTVShow } = useTVShowDetails(
    // Only try TV show if movie returned no data
    movieData && !movieData.data ? id : undefined
  );

  const isLoading = isLoadingMovie || isLoadingTVShow;

  // Transform API response to our format
  const { movie, cast, similarMovies, isTVShow } = useMemo(() => {
    const rawMovie = movieData?.data || tvShowData?.data;
    if (!rawMovie) return { movie: null, cast: [], similarMovies: [], isTVShow: false };

    const transformed = toMovie(rawMovie);
    const castData = (rawMovie.cast || rawMovie.cast_crew || []).map(toCast);
    const similar = toMovieList(rawMovie.similar_movie || rawMovie.related_movie || rawMovie.similar_tvshow || rawMovie.related_tvshow || []);
    const isShow = !!tvShowData?.data;

    return { movie: transformed, cast: castData, similarMovies: similar, isTVShow: isShow };
  }, [movieData, tvShowData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Content not found</h2>
          <p className="text-white/50 mb-4">The requested content could not be loaded.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#EAB308] text-black font-bold rounded-lg hover:bg-[#FACC15] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] selection:bg-[#EAB308] selection:text-black">
      {/* Background Grain/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation Guard (Fade top) */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0F0F0F] to-transparent z-40 pointer-events-none"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-28 left-4 sm:left-12 z-50 p-4 rounded-full glass hover:bg-[#EAB308] hover:text-black text-white transition-all duration-500 hover:scale-110 active:scale-95 group shadow-2xl"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Hero Section - Immersive Backdrop */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 optimize-gpu">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          {/* Multi-layered content protection gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/90 via-[#0F0F0F]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/50 to-transparent" />
        </div>

        {/* Hero Content - Elevated for better visibility */}
        <div className="absolute inset-0 flex items-end pb-24 sm:pb-40">
          <div className="max-w-[1920px] mx-auto w-full px-6 sm:px-12 lg:px-20">
            <div className="max-w-4xl space-y-8 animate-slide-up optimize-gpu">
              {/* High-Impact Meta Tags */}
              <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#EAB308] text-black font-black rounded-md shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  <Star className="w-4 h-4 fill-black" />
                  {movie.imdbRating}
                </div>
                <div className="flex items-center gap-1.5 glass-light px-3 py-1 rounded-md text-white/90 border-white/10">
                  <Film className="w-4 h-4 text-[#EAB308]" />
                  {movie.rating}
                </div>
                <div className="flex items-center gap-1.5 glass-light px-3 py-1 rounded-md text-white/90 border-white/10">
                  <Calendar className="w-4 h-4 text-[#EAB308]" />
                  {movie.year}
                </div>
                <div className="flex items-center gap-1.5 glass-light px-3 py-1 rounded-md text-white/90 border-white/10">
                  <Clock className="w-4 h-4 text-[#EAB308]" />
                  {movie.duration}
                </div>
              </div>

              {/* Cinematic Title with Text Shadow for readability */}
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter text-balance leading-[0.9] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                {movie.title}
              </h1>

              {/* Visual Genres */}
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres.map(genre => (
                  <span
                    key={genre}
                    className="px-5 py-2 text-sm font-bold text-white/80 bg-white/5 border border-white/10 rounded-full hover:border-[#EAB308]/50 hover:text-white transition-all cursor-default backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Action Suite - Hero Priority */}
              <div className="flex flex-wrap items-center gap-6 pt-6">
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group flex items-center gap-4 px-12 py-5 bg-[#EAB308] text-black font-black rounded-2xl hover:bg-[#FACC15] transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-[0_0_50px_rgba(234,179,8,0.25)]"
                >
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black" />
                  </div>
                  <span className="tracking-[0.1em]">WATCH NOW</span>
                </button>

                <div className="flex items-center gap-3">
                  <button className="p-5 glass rounded-2xl text-white hover:bg-[#EAB308] hover:text-black transition-all duration-500 border border-white/10 hover:scale-110 active:scale-95 group shadow-xl">
                    <ThumbsUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <button className="p-5 glass rounded-2xl text-white hover:bg-white/10 transition-all duration-500 border border-white/10 hover:scale-110 active:scale-95 group shadow-xl">
                    <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-20 max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-20 -mt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-24">

            {/* Story & Description Section */}
            <section className="animate-slide-up [animation-delay:200ms]">
              <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-xl text-[#EAB308] text-xs font-black tracking-[0.2em] uppercase mb-8 border-white/5 mx-auto lg:mx-0">
                <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse"></div>
                STORYLINE
              </div>
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-white tracking-tight">Overview</h2>
                <p className="text-white/70 text-2xl leading-[1.6] font-light tracking-tight max-w-5xl text-pretty border-l-2 border-[#EAB308]/30 pl-8">
                  {movie.description}
                </p>
              </div>
            </section>

            {/* Cast Grid - Horizontal Scroll on Mobile */}
            {cast.length > 0 && (
              <section className="animate-slide-up [animation-delay:400ms]">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-4xl font-black text-white tracking-tight">Top Cast</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                  {cast.slice(0, 6).map((actor, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-5 border border-white/5 transition-all duration-700 group-hover:scale-[1.03] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group-hover:border-[#EAB308]/20 relative">
                        {actor.image ? (
                          <img
                            src={actor.image}
                            alt={actor.name}
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/10 flex items-center justify-center">
                            <User className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <p className="text-white font-black text-sm truncate group-hover:text-[#EAB308] transition-colors tracking-tight">{actor.name}</p>
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.15em] mt-1.5">{actor.role}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations Section */}
            {similarMovies.length > 0 && (
              <section className="animate-slide-up [animation-delay:600ms]">
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-[2px] w-12 bg-[#EAB308]"></div>
                  <h2 className="text-4xl font-black text-white tracking-tight">Recommended For You</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-8">
                  {similarMovies.map((similar, index) => (
                    <MovieCard
                      key={similar.id}
                      movie={similar}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Section */}
          <aside className="lg:col-span-4 space-y-8 animate-slide-up [animation-delay:300ms]">
            <div className="glass rounded-[2rem] p-10 border border-white/5 space-y-12 sticky top-32 shadow-3xl">
              {/* Technical List */}
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EAB308]/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  Details
                </h3>

                <div className="grid grid-cols-1 gap-8">
                  {[
                    { icon: Calendar, label: 'Release Date', value: movie.year },
                    { icon: Clock, label: 'Duration', value: movie.duration },
                    { icon: Globe, label: 'Origin', value: 'United States' },
                    { icon: Star, label: 'Critic Score', value: `${movie.imdbRating} / 10` },
                    ...(isTVShow && tvShowData?.data ? [
                      { icon: Film, label: 'Seasons', value: tvShowData.data.total_season || tvShowData.data.seasons || 'N/A' },
                      { icon: User, label: 'Network', value: tvShowData.data.network || 'N/A' }
                    ] : [])
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-500 group-hover/item:bg-[#EAB308] group-hover/item:text-black shadow-lg">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</p>
                        <p className="text-white text-lg font-bold tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards Section - Highlighted */}
              <div className="relative overflow-hidden group/awards rounded-[1.5rem] bg-gradient-to-br from-[#EAB308]/20 via-[#EAB308]/5 to-transparent p-8 border border-[#EAB308]/20 shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#EAB308]/10 rounded-full blur-[60px] group-hover/awards:bg-[#EAB308]/20 transition-all duration-700"></div>
                <h3 className="relative z-10 text-white font-black text-xl mb-6 flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#EAB308] fill-[#EAB308]" />
                  Accolades
                </h3>
                <ul className="relative z-10 space-y-4">
                  <li className="text-white/80 text-sm font-bold flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></div>
                    4 Academy Awards Winner
                  </li>
                  <li className="text-white/80 text-sm font-bold flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></div>
                    Best Cinematography
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Main Video Player Modal - Portaled to root */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoTitle={movie.title}
      />
    </div>
  );
}
