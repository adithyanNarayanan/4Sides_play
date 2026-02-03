import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '@/types';
import MovieCard from '@/components/MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
  variant?: 'default' | 'continue-watching' | 'top10';
}

export default function MovieRow({
  title,
  movies,
  onMovieClick,
  variant = 'default',
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons, { passive: true });
      checkScrollButtons();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (variant === 'top10') {
    return (
      <div
        ref={rowRef}
        className={`py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            {title}
          </h2>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-24 flex items-center justify-center transition-all duration-300 ${canScrollLeft
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
              }`}
            style={{
              background: 'linear-gradient(to right, #181818 0%, transparent 100%)',
            }}
          >
            <div className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-24 flex items-center justify-center transition-all duration-300 ${canScrollRight
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
              }`}
            style={{
              background: 'linear-gradient(to left, #181818 0%, transparent 100%)',
            }}
          >
            <div className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto custom-scrollbar px-4 sm:px-6 lg:px-8 xl:px-12 pb-4"
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="flex-shrink-0 flex items-center gap-4 cursor-pointer group"
                onClick={() => onMovieClick?.(movie)}
              >
                {/* Rank Number */}
                <span
                  className="text-7xl sm:text-8xl font-black text-transparent leading-none"
                  style={{
                    WebkitTextStroke: '2px #EAB308',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {index + 1}
                </span>

                {/* Movie Poster */}
                <div className="relative w-[120px] sm:w-[150px] aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#EAB308]/20">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rowRef}
      className={`py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 hover:text-[#EAB308] transition-colors cursor-pointer inline-flex items-center gap-2 group">
          {title}
          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h2>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-24 flex items-center justify-center transition-all duration-300 ${canScrollLeft
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(to right, #181818 0%, transparent 100%)',
          }}
        >
          <div className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-24 flex items-center justify-center transition-all duration-300 ${canScrollRight
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(to left, #181818 0%, transparent 100%)',
          }}
        >
          <div className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </div>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto custom-scrollbar px-4 sm:px-6 lg:px-8 xl:px-12 pb-8 pt-4"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              onClick={onMovieClick}
              variant={variant === 'continue-watching' ? 'continue-watching' : 'default'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
