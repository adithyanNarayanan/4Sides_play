import { useState, useRef, useEffect } from 'react';
import type { MovieCategory } from '@/types';
import { useGenreList } from '@/hooks/useApi';
import { CategoriesSkeleton } from '@/components/LoadingSkeletons';

interface CategoryCardProps {
  category: MovieCategory;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const moveX = (x - 0.5) * 20;
    const moveY = (y - 0.5) * 20;
    const rotateX = (y - 0.5) * -15;
    const rotateY = (x - 0.5) * 15;

    setTransform({ x: moveX, y: moveY, rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  // Get background image from genre image or movie poster
  const genreImage = (category as MovieCategory & { image?: string }).image;
  const backgroundImage = genreImage || category.movies[0]?.posterUrl || '';

  return (
    <div
      ref={cardRef}
      className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      style={{
        transform: isVisible
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateZ(${transform.x !== 0 ? '20px' : '0'})`
          : 'perspective(1000px) rotateX(90deg)',
        transformStyle: 'preserve-3d',
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `scale(1.1) translate(${-transform.x * 0.5}px, ${-transform.y * 0.5}px)`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Accent Glow */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3
          className="text-2xl font-bold text-white transition-transform duration-300"
          style={{
            transform: `translate(${transform.x * 0.3}px, ${transform.y * 0.3}px)`,
          }}
        >
          {category.name}
        </h3>
        <p className="text-white/60 text-sm mt-1">
          {category.movies.length}+ titles
        </p>
      </div>

      {/* Border Glow on Hover */}
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-[#EAB308]/50 transition-colors duration-300 pointer-events-none"
      />
    </div>
  );
}

export default function Categories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: genreData, isLoading } = useGenreList();

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Transform genre API data to MovieCategory format
  const categories: MovieCategory[] = (genreData?.data || []).map((genre) => ({
    id: String(genre.id),
    name: genre.name,
    movies: [], // Genres API only returns names, movies are loaded per-genre
  }));

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-[1920px] mx-auto">
        <h2
          className={`text-2xl sm:text-3xl font-bold text-white mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          Browse by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
