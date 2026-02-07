import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Info, Star, Volume2, VolumeX } from 'lucide-react';
import type { Movie } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoModal from '@/components/VideoModal';

interface HeroProps {
  movie?: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const { t } = useLanguage();

  if (!movie) {
    return (
      <section className="relative w-full h-[100dvh] min-h-[500px] lg:min-h-[600px] overflow-hidden bg-[#181818]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-[#222]" />
        <div className="relative h-full flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#EAB308]/20 border-t-[#EAB308] rounded-full animate-spin" />
        </div>
      </section>
    );
  }
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = heroRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x: x * 15, y: y * 15 });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100dvh] min-h-[500px] lg:min-h-[600px] overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px) scale(1.1)`,
        }}
      >
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-[#181818]/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 sm:pt-24 pb-32 sm:pb-0">
          <div
            className={`max-w-2xl transition-all duration-1000 ${isLoaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            {/* Movie Meta */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#EAB308] font-semibold text-sm tracking-wider uppercase">
                {t('featured')}
              </span>
              <span className="text-white/40">|</span>
              <span className="text-white/70 text-sm">{movie.year}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/70 text-sm">{movie.rating}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/70 text-sm">{movie.duration}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 text-shadow-lg tracking-tight">
              {movie.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{movie.imdbRating}</span>
              </div>
              <span className="text-white/50">/10</span>
              <span className="text-white/50 text-sm ml-2">IMDb</span>
            </div>

            {/* Description */}
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 line-clamp-3 text-shadow">
              {movie.description}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-sm text-white/70 bg-white/10 rounded-full border border-white/10"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              >
                <Play className="w-5 h-5 fill-black" />
                {t('playNow')}
              </button>



              <button className="group flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <Info className="w-5 h-5" />
                {t('moreInfo')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 gradient-overlay-bottom" />

      {/* Mute Toggle (Decorative) */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoTitle={movie.title}
      />
    </section >
  );
}
